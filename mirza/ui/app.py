"""Chainlit lifecycle: session/streaming glue, the graph advance() loop, and the
shared time-travel/restart navigation menu.

Per-node review screens live in ui/presenters.py — this module only knows node
*names*, not what each node's checkpoint looks like.
"""
import asyncio
import logging

import chainlit as cl

from ..config import GEMINI_API_KEY, STAGES
from ..runtime.decisions import Jump, Rewind, next_command
from ..runtime.session import ArticleSession
from ..runtime.streaming import STREAM_END, PhaseUpdate
from .editor import _ensure_editor_asset
from .preview import BodyExtractor

log = logging.getLogger("mirza.chat")
TIMEOUT = 3600  # LLM and image operations can take a while.


async def ask_nonempty(prompt: str, retry_prompt: str = "متن خالی بود. دوباره بفرست:") -> str | None:
    """Keep asking until the user submits text, times out, or cancels."""
    while True:
        resp = await cl.AskUserMessage(content=prompt, timeout=TIMEOUT).send()
        log.info("AskUserMessage resp type=%s keys=%s", type(resp).__name__,
                 list(resp.keys()) if isinstance(resp, dict) else "-")
        text = _ask_text(resp)
        if text:
            return text
        if resp is None:
            return None  # A genuine timeout or cancellation.
        prompt = retry_prompt


@cl.on_message
async def on_message(msg: cl.Message):
    """Direct messages outside the HITL loop back to the available controls."""
    await cl.Message(content="⚠️ لطفاً از دکمه‌ها یا فرم تنظیمات (⚙️) پایین استفاده کن.").send()


# Helpers.
def _session() -> ArticleSession:
    return cl.user_session.get("session")


async def _resume(action):
    """Run an action in a worker thread so the event loop remains responsive."""
    sess = _session()
    if isinstance(action, Rewind):
        await cl.make_async(sess.rewind_to_before)(
            action.target_node, action.values_patch, action.carry_forward
        )
    elif isinstance(action, Jump):
        await cl.make_async(sess.jump_to_before)(action.target_node, action.values_patch)
    else:
        await cl.make_async(sess.resume)(action)


async def _resume_with_progress(action, label: str):
    """Resume the graph behind a live ``cl.Step`` indicator.

    These steps (enrich_apply, metadata extraction, build, image generation,
    git commit) don't stream tokens, so a plain ``cl.Message`` sent before the
    await just sits there unchanged for however long the step takes — reading
    as a frozen UI. ``cl.Step`` shows a running spinner/timer immediately and
    finalizes with the elapsed duration when it completes.
    """
    async with cl.Step(name=label, type="run"):
        await _resume(action)


async def _drain_body(queue, msg, extractor):
    """Render streamed body characters into a Chainlit message as they arrive.

    Also surfaces ``PhaseUpdate`` notices as their own small messages — the draft
    node keeps working (planning/rendering enrichment) after the body text stops
    streaming, and without this the UI goes quiet and looks finished mid-step.
    """
    while True:
        chunk = await queue.get()
        if chunk is STREAM_END:
            return
        if isinstance(chunk, PhaseUpdate):
            await cl.Message(content=chunk.text).send()
            continue
        display = extractor.feed(chunk)
        if display:
            await msg.stream_token(display)


async def _run_draft_with_stream(action, label: str):
    """Run the draft step while streaming its body live into the chat.

    The relay is armed only for this step. After the step finishes, the streamed
    message is finalized with the authoritative plain draft (so partial / fallback
    runs still show the correct text) and flagged so the next review checkpoint
    skips a duplicate print.

    ``label`` is shown as a live ``cl.Step`` indicator running alongside the call —
    tokens only start appearing in ``msg`` once the model responds, so the Step's
    spinner/timer is what covers the (sometimes several-second) gap before the
    first token, which would otherwise look like a stalled UI.

    ``msg`` (and the drain task that feeds it, including its ``PhaseUpdate``
    notices) must be created *before* entering the Step's ``async with`` block.
    Chainlit parents any message created while a Step is active onto that Step,
    and a Step's children are only shown while it's open/running — once it exits
    and collapses to a one-line summary, nested children collapse (hide) with
    it. Creating them first keeps them top-level, so they stay visible below the
    step for good instead of disappearing the moment the draft finishes.
    """
    loop = asyncio.get_running_loop()
    body_q = asyncio.Queue()
    sess = _session()
    sess.relay.arm(loop, body_q)
    msg = cl.Message(content="")
    extractor = BodyExtractor()
    drain = asyncio.create_task(_drain_body(body_q, msg, extractor))
    try:
        async with cl.Step(name=label, type="run"):
            await _resume(action)
    finally:
        sess.relay.disarm()
        body_q.put_nowait(STREAM_END)
        await drain
        draft = sess.values().get("draft_plain", "")
        if draft:
            # Authoritative overwrite: covers the retry/fallback case where the
            # partial stream differs from the final accepted draft.
            msg.content = draft
            cl.user_session.set("draft_streamed", True)
        await msg.send()


def _ask_text(resp):
    """Extract text from the response shapes returned by AskUserMessage."""
    if resp is None:
        return ""
    if isinstance(resp, dict):
        # Chainlit versions may return either ``output`` or ``content``.
        for k in ("output", "content"):
            v = resp.get(k)
            if isinstance(v, str) and v.strip():
                return v.strip()
        return ""
    for k in ("output", "content"):
        v = getattr(resp, k, None)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return ""


_ensure_editor_asset()


@cl.on_window_message
async def on_window_message(data):
    """Receive edited text posted from the iframe editor."""
    if not (isinstance(data, dict) and data.get("source") == "mirza-draft-editor"):
        return
    fut = cl.user_session.get("draft_edit_future")
    if fut is not None and not fut.done():
        fut.set_result(data.get("content", ""))


# Lifecycle.
@cl.on_chat_start
async def on_chat_start():
    missing = [name for name, cfg in STAGES.items() if not cfg.api_key]
    if missing:
        await cl.Message(
            content=f"❌ کلید API برای مرحله‌ی {', '.join(missing)} در `mirza/.env` پیدا نشد."
        ).send()
        return
    if not GEMINI_API_KEY:
        await cl.Message(content="⚠️ `GEMINI_API_KEY` نیست → تصاویر خودکار تولید نمی‌شوند "
                                 "(فقط پرامپت ذخیره می‌شود).").send()

    await _start_new_article()


async def _start_new_article():
    """Create a unique graph thread and advance to its first interrupt."""
    sid_base = getattr(getattr(cl.context, "session", None), "id", None) or "article-web"
    n = int(cl.user_session.get("article_count") or 0) + 1
    cl.user_session.set("article_count", n)
    cl.user_session.set("session", ArticleSession(thread_id=f"{sid_base}-{n}"))
    cl.user_session.set("phase", None)
    await cl.make_async(_session().start)()
    await advance()


@cl.on_settings_update
async def on_settings_update(settings):
    """Handle metadata edits from the settings form (the only settings phase now)."""
    phase = cl.user_session.get("phase")
    if phase != "await_metadata":
        return  # Ignore settings updates outside metadata editing.

    required = ["title", "topic", "slug"]
    missing = [key for key in required if not (settings.get(key) or "").strip()]
    if missing:
        await cl.Message(content="⚠️ این فیلدها اجباری‌اند: " + "، ".join(missing)).send()
        return
    tags = settings.get("tags") or []
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
    try:
        action = next_command({
            "action": "metadata",
            "title": (settings.get("title") or "").strip(),
            "tags": tags,
            "topic": (settings.get("topic") or "").strip(),
            "slug": (settings.get("slug") or "").strip(),
        })
    except ValueError as exc:
        await cl.Message(content=f"⚠️ {exc}").send()
        return
    cl.user_session.set("phase", None)
    await _resume(action)
    await advance()


# Shared time-travel and restart menu.
_NODE_LABELS = {
    "draft": "مرحله‌ی ۱ — دریافت مقاله",
    "enrich_plan": "مرحله‌ی ۲ — بازبینیِ متنِ خام",
    "metadata": "مرحله‌ی ۳ — بازبینیِ نهاییِ متن",
    "build": "مرحله‌ی ۴ — مشخصات و مسیر",
    "images": "مرحله‌ی ۵ — حالت تصویر",
    "finish": "مرحله‌ی ۶ — بازبینیِ پرامپت تصویر",
}


def _patch_for_jump(target: str) -> dict:
    """Clear consumed fields before jumping to a historical checkpoint."""
    if target == "images":
        return {"image_specs": "", "image_feedback": ""}
    return {}


async def _offer_rewind_menu() -> bool:
    """Offer rewind targets and return whether a rewind was performed."""
    sess = _session()
    targets = sess.available_rewind_targets()
    if not targets:
        await cl.Message(content="⚠️ هیچ مرحله‌ی قابل بازگشتی در تاریخچه پیدا نشد.").send()
        return False
    actions = [cl.Action(name=t, payload={"v": t}, label=f"↩️ {_NODE_LABELS.get(t, t)}")
               for t in targets]
    actions.append(cl.Action(name="__cancel__", payload={"v": "cancel"}, label="✖️ انصراف"))
    res = await cl.AskActionMessage(
        content="به کدام مرحله برگردیم؟ (state از آن نقطه ادامه خواهد یافت)",
        actions=actions, timeout=TIMEOUT,
    ).send()
    if res is None or res["name"] == "__cancel__":
        return False
    target = res["name"]
    await cl.Message(content=f"⏮ در حال بازگشت به «{_NODE_LABELS.get(target, target)}»…").send()
    await _resume(Jump(target, _patch_for_jump(target)))
    await advance()
    return True


async def _confirm_restart() -> bool:
    """Offer a restart and report whether a new session was created."""
    res = await cl.AskActionMessage(
        content="🗑️ آیا مقاله‌ی فعلی را دور بریزیم و یک مقاله‌ی جدید (thread تازه) شروع کنیم؟",
        actions=[
            cl.Action(name="yes", payload={"v": "yes"}, label="✅ بله، از نو شروع کن"),
            cl.Action(name="no", payload={"v": "no"}, label="✖️ نه، ادامه بده"),
        ],
        timeout=TIMEOUT,
    ).send()
    if res is None or res["name"] != "yes":
        return False
    await _start_new_article()
    return True


def _nav_actions() -> list:
    """Return navigation actions shared by every interrupt."""
    return [
        cl.Action(name="__rewind__", payload={"v": "rewind"}, label="⏮ برگشت به مرحله‌ای…"),
        cl.Action(name="__restart__", payload={"v": "restart"}, label="↺ شروع دوباره"),
    ]


async def _handle_nav(choice: str) -> bool:
    """Handle a navigation action and report whether the caller should return."""
    if choice == "__rewind__":
        if not await _offer_rewind_menu():
            # The user cancelled, so render the same step again.
            await advance()
        return True
    if choice == "__restart__":
        if not await _confirm_restart():
            await advance()
        return True
    return False


# Graph advance loop.
async def advance():
    """Advance to the next interrupt and dispatch its interaction.

    Imports presenters lazily to break the app<->presenters import cycle:
    presenters import session/nav helpers from this module at module scope, so
    this module cannot import presenters until it is fully defined.
    """
    from .presenters import NODE_PRESENTERS, present_default_input, present_specs

    sess = _session()
    while True:
        node = sess.current_node()
        if node is None:
            await _done()
            return

        if node == "draft":
            v = sess.values()
            if not v.get("source_text"):
                await present_default_input()
            else:
                await present_specs()
            return

        presenter = NODE_PRESENTERS.get(node)
        if presenter is not None:
            await presenter()
            return


async def _done():
    v = _session().values()
    where = f"`fa/{v.get('topic', '')}/{v.get('slug', '')}/`"
    await cl.Message(content="🎉 مقاله آماده شد! فایل‌ها در " + where + " نوشته شدند "
                             "(config.json, content.md, resources/). برای انتشار، پس از merge، "
                             "`add-all-posts-api.py` را اجرا کنید.").send()
    await cl.Message(content=_session().meter.summary()).send()
    models = " · ".join(f"{name}={cfg.model}" for name, cfg in STAGES.items())
    await cl.Message(content=f"🧠 مدل‌ها: {models}").send()
    await cl.Message(content="➡️ برای مقاله‌ی بعدی، متن مقاله‌ی جدید را بفرست.").send()
    await _start_new_article()
