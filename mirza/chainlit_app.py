"""Chainlit entry point for Mirza's RTL human-in-the-loop chat interface.

The graph uses interrupts before draft, enrich_plan, metadata, build, images,
and finish. Each browser session owns an independent ArticleSession.

Run from posts/:
    bash mirza/run-chainlit.sh -w
or:
    cd mirza && .venv/bin/chainlit run chainlit_app.py -w

Command creation is shared through controller.next_command.
"""
import asyncio
import logging
import os
import sys

# Keep posts/ importable when Chainlit is launched from an arbitrary CWD.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import chainlit as cl

from mirza.config import GEMINI_API_KEY, STAGES
from mirza.controller import ArticleSession, Jump, Rewind, next_command
from mirza.profiles import WRITER_TONE, WRITER_USERNAME
from mirza.streaming import STREAM_END, BodyExtractor, PhaseUpdate
from mirza.ui.editor import (
    EDIT_TIMEOUT,
    _cleanup_editor_draft,
    _editor_iframe,
    _ensure_editor_asset,
    _stage_editor_draft,
)
from mirza.ui.widgets import _metadata_widgets

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


async def _run_draft_with_stream(action):
    """Run the draft step while streaming its body live into the chat.

    The relay is armed only for this step. After the step finishes, the streamed
    message is finalized with the authoritative plain draft (so partial / fallback
    runs still show the correct text) and flagged so the next review checkpoint
    skips a duplicate print.
    """
    loop = asyncio.get_running_loop()
    body_q = asyncio.Queue()
    sess = _session()
    sess.relay.arm(loop, body_q)
    msg = cl.Message(content="")
    extractor = BodyExtractor()
    drain = asyncio.create_task(_drain_body(body_q, msg, extractor))
    try:
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


async def _open_draft_editor(current_draft: str, state_key: str = "draft", resume_review=None):
    """Open the inline editor and return to ``resume_review`` with the edited text saved.

    ``resume_review`` defaults to ``review_text`` via a late lookup (it is defined
    later in this module, so it cannot be a default-argument expression).
    """
    resume_review = resume_review or review_text
    edit_id = _stage_editor_draft(current_draft)
    fut = asyncio.get_running_loop().create_future()
    cl.user_session.set("draft_edit_future", fut)
    await cl.Message(content=_editor_iframe(edit_id)).send()
    await cl.Message(
        content="✏️ متن را در ویرایشگرِ بالا اصلاح کن و **ذخیره و بازگشت** را بزن. "
                "(متن نهایی لفظی جایگزین می‌شود.)"
    ).send()
    try:
        text = await asyncio.wait_for(fut, timeout=EDIT_TIMEOUT)
    except asyncio.TimeoutError:
        await cl.Message(content="⏱️ زمان ویرایش تمام شد؛ تغییرات ذخیره نشد.").send()
        await resume_review()
        return
    finally:
        cl.user_session.set("draft_edit_future", None)
        _cleanup_editor_draft(edit_id)
    if not text:
        await cl.Message(content="⏱️ متنی دریافت نشد؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
        await resume_review()
        return
    # The edited text is already final Markdown; keep it and re-show the checkpoint.
    _session().update({state_key: text})
    await cl.Message(content="✅ متن ویرایش شد؛ آن را بررسی و تأیید کن.").send()
    await resume_review()


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
    """Advance to the next interrupt and dispatch its interaction."""
    sess = _session()
    while True:
        node = sess.current_node()
        if node is None:
            await _done()
            return
        v = sess.values()

        if node == "draft":
            if not v.get("source_text"):
                await present_default_input()
            else:
                await present_specs()
            return

        if node == "enrich_plan":
            await review_plain_draft()
            return
        if node == "metadata":
            await review_text()
            return
        if node == "build":
            await review_metadata()
            return
        if node == "images":
            await ask_image_mode()
            return
        if node == "finish":
            await review_prompts()
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


# Article specifications.
async def present_default_input():
    """Accept the source text and run the one-shot conversion."""
    if not WRITER_USERNAME:
        await cl.Message(content="❌ `username` نویسنده در `mirza/.writer.py` تنظیم نشده است.").send()
        return
    source_text = await ask_nonempty(
        "👋 متن کامل مقاله را بفرست تا آن را به مارک‌داونِ جذابِ گزمه تبدیل کنم "
        "(تبدیل وفادار + ویراستاری):",
        "متن خالی بود؛ متن مقاله را دوباره بفرست:",
    )
    if source_text is None:
        await cl.Message(content="⏱️ متنی دریافت نشد؛ یک گفت‌وگوی جدید شروع کن.").send()
        return
    await cl.Message(content="🪄 در حال تبدیل و بازبینی متن مبدأ…").send()
    await _run_draft_with_stream(next_command({
        "action": "source",
        "source_text": source_text,
        "writer": WRITER_USERNAME,
        "tone": WRITER_TONE,
    }))
    await advance()


async def present_specs():
    """Return to source-text entry and re-run the conversion on new text."""
    source_text = await ask_nonempty(
        "↩️ **بازگشت به ورودی** — متن مبدأ را دوباره بفرست تا دوباره تبدیل شود:",
        "متن خالی بود؛ متن مقاله را بفرست:",
    )
    if source_text is None:
        await cl.Message(content="⏱️ متنی دریافت نشد؛ دوباره تلاش کن.").send()
        return
    await cl.Message(content="🪄 در حال تبدیل و بازبینی متن جدید…").send()
    await _run_draft_with_stream(Rewind("draft", {
        "source_text": source_text,
        "writer": WRITER_USERNAME,
        "tone": WRITER_TONE,
        "change_feedback": "",
    }))
    await advance()


# Plain-draft review checkpoint (streamed): the first HITL stop after draft,
# before enrich_plan/enrich_apply run (which are not streamed).
async def review_plain_draft():
    v = _session().values()
    if not cl.user_session.get("draft_streamed"):
        await cl.Message(content=v.get("draft_plain", "")).send()
    cl.user_session.set("draft_streamed", False)
    if v.get("review_notes"):
        await cl.Message(content="**🔍 یادداشت‌های ویراستار:**\n\n" + v["review_notes"]).send()
    res = await cl.AskActionMessage(
        content="**گام ۲/۶ — بازبینیِ متنِ خام:** متن (پیش از غنی‌سازیِ بصری) مورد تایید است؟",
        actions=[
            cl.Action(name="approve", payload={"v": "approve"}, label="✅ تایید"),
            cl.Action(name="edit", payload={"v": "edit"}, label="✏️ ویرایش دستی"),
            cl.Action(name="revise", payload={"v": "revise"}, label="🔄 اصلاح با هوش مصنوعی"),
            cl.Action(name="back", payload={"v": "back"}, label="↩️ بازگشت به مشخصات"),
            *_nav_actions(),
        ],
        timeout=TIMEOUT,
    ).send()
    if res is None:
        return
    choice = res["name"]
    if await _handle_nav(choice):
        return

    if choice == "approve":
        await cl.Message(content="🧩 در حال برنامه‌ریزی و اعمال غنی‌سازیِ بصری…").send()
        await _resume(None)
        await advance()
    elif choice == "edit":
        await _open_draft_editor(
            v.get("draft_plain", ""), state_key="draft_plain", resume_review=review_plain_draft
        )
    elif choice == "revise":
        fb = await ask_nonempty("بازخورد اصلاح را بنویس (این دستورالعمل قطعی است):")
        if not fb:
            await cl.Message(content="⏱️ بازخوردی نگرفتم؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
            await review_plain_draft()
            return
        await cl.Message(content="✏️ در حال بازنویسی…").send()
        await _run_draft_with_stream(next_command({"action": "revise_text", "feedback": fb}))
        await advance()
    elif choice == "back":
        await present_specs()


# Article text review checkpoint.
async def review_text():
    v = _session().values()
    # If the draft was just streamed live, that message already shows it; avoid
    # posting it twice. Reset the flag so the next article / revision re-streams.
    if not cl.user_session.get("draft_streamed"):
        await cl.Message(content=v.get("draft", "")).send()
    cl.user_session.set("draft_streamed", False)
    if v.get("review_notes"):
        await cl.Message(content="**🔍 یادداشت‌های ویراستار:**\n\n" + v["review_notes"]).send()
    if v.get("enrichment_notes"):
        await cl.Message(content="**🧩 نقشه‌ی غنی‌سازی:**\n\n" + v["enrichment_notes"]).send()
    if v.get("enrichment_warnings"):
        warn_text = "\n".join(f"- {w}" for w in v["enrichment_warnings"])
        await cl.Message(content="**⚠️ هشدارهای غنی‌سازی:**\n\n" + warn_text).send()
    res = await cl.AskActionMessage(
        content="**گام ۳/۶ — بازبینیِ نهاییِ متن:** متن مقاله مورد تایید است؟",
        actions=[
            cl.Action(name="approve", payload={"v": "approve"}, label="✅ تایید"),
            cl.Action(name="edit", payload={"v": "edit"}, label="✏️ ویرایش دستی"),
            cl.Action(name="revise", payload={"v": "revise"}, label="🔄 اصلاح با هوش مصنوعی"),
            cl.Action(name="revise_enrich", payload={"v": "revise_enrich"}, label="🧩 بازبینی غنی‌سازی"),
            cl.Action(name="back", payload={"v": "back"}, label="↩️ بازگشت به مشخصات"),
            *_nav_actions(),
        ],
        timeout=TIMEOUT,
    ).send()
    if res is None:
        return
    choice = res["name"]
    if await _handle_nav(choice):
        return

    if choice == "approve":
        await cl.Message(content="🏷️ در حال استخراج عنوان، تگ‌ها و مسیر مقاله…").send()
        await _resume(None)
        await advance()
    elif choice == "edit":
        await _open_draft_editor(v.get("draft", ""))
        return
    elif choice == "revise":
        fb = await ask_nonempty("بازخورد اصلاح را بنویس (این دستورالعمل قطعی است):")
        if not fb:
            await cl.Message(content="⏱️ بازخوردی نگرفتم؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
            await review_text()
            return
        await cl.Message(content="✏️ در حال بازنویسی…").send()
        await _run_draft_with_stream(next_command({"action": "revise_text", "feedback": fb}))
        await advance()
    elif choice == "revise_enrich":
        fb = await ask_nonempty("بازخورد بازبینیِ غنی‌سازی را بنویس (مثلاً «کارت‌ها را حذف کن»؛ این دستورالعمل قطعی است):")
        if not fb:
            await cl.Message(content="⏱️ بازخوردی نگرفتم؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
            await review_text()
            return
        await cl.Message(content="🧩 در حال بازبینیِ غنی‌سازی…").send()
        await _run_draft_with_stream(next_command({"action": "revise_enrich", "feedback": fb}))
        await advance()
    elif choice == "back":
        await present_specs()


# Metadata and destination review checkpoint.
async def review_metadata():
    v = _session().values()
    topic_status = "جدید (پوشه ساخته می‌شود)" if v.get("topic_is_new") else "موجود"
    lines = [
        "**گام ۴/۶ — مشخصات و مسیر پیشنهادی**",
        "",
        f"- عنوان: {v.get('title', '')}",
        f"- تگ‌ها: {', '.join(v.get('tags', [])) or '—'}",
        f"- نویسنده: `{v.get('writer', '')}`",
        f"- topic: `{v.get('topic', '')}` — {topic_status}",
        f"- slug: `{v.get('slug', '')}`",
        f"- مسیر: `fa/{v.get('topic', '')}/{v.get('slug', '')}/`",
    ]
    if v.get("new_tags"):
        lines.extend([
            "",
            "⚠️ تگ‌های جدید که باید پیش از انتشار در Strapi ساخته شوند: " +
            "، ".join(v["new_tags"]),
        ])
    if v.get("path_exists"):
        lines.extend([
            "",
            "❌ این مسیر از قبل وجود دارد و overwrite نخواهد شد.",
            "slugهای پیشنهادی: " + "، ".join(f"`{slug}`" for slug in v.get("slug_alternatives", [])),
        ])
    await cl.Message(content="\n".join(lines)).send()

    actions = [
        cl.Action(name="approve", payload={"v": "approve"}, label="✅ تأیید و ساخت فایل‌ها"),
        cl.Action(name="edit", payload={"v": "edit"}, label="✏️ ویرایش مشخصات"),
        cl.Action(name="reextract", payload={"v": "reextract"}, label="🔄 استخراج دوباره"),
        cl.Action(name="back", payload={"v": "back"}, label="↩️ بازگشت به متن"),
        *_nav_actions(),
    ]
    res = await cl.AskActionMessage(
        content="مشخصات و مسیر مورد تأیید است؟",
        actions=actions,
        timeout=TIMEOUT,
    ).send()
    if res is None:
        return
    choice = res["name"]
    if await _handle_nav(choice):
        return

    if choice == "approve":
        if v.get("path_exists"):
            await cl.Message(content="⛔ ابتدا slug را تغییر بده؛ overwrite مجاز نیست.").send()
            await review_metadata()
            return
        await cl.Message(content="📁 در حال ساخت فایل‌ها…").send()
        await _resume(None)
        await advance()
    elif choice == "edit":
        cl.user_session.set("phase", "await_metadata")
        await cl.ChatSettings(_metadata_widgets(v)).send()
        await cl.Message(content="مقادیر را ویرایش و تنظیمات را ذخیره کن؛ سپس دوباره تأیید می‌شوند.").send()
    elif choice == "reextract":
        await cl.Message(content="🏷️ در حال استخراج دوباره‌ی مشخصات…").send()
        await _resume(next_command({"action": "reextract_metadata"}))
        await advance()
    elif choice == "back":
        await _resume(next_command({"action": "back_text"}))
        await advance()


# Image mode checkpoint.
async def ask_image_mode():
    res = await cl.AskActionMessage(
        content="**گام ۵/۶ — حالت تصویر:** تصویر را چطور بسازیم؟",
        actions=[
            cl.Action(name="auto", payload={"v": "auto"}, label="🎨 خودکار (بر اساس متن)"),
            cl.Action(name="custom", payload={"v": "custom"}, label="🖌️ توضیح دلخواه"),
            *_nav_actions(),
        ],
        timeout=TIMEOUT,
    ).send()
    if res is None:
        return
    if await _handle_nav(res["name"]):
        return
    mode = res["name"]
    specs = ""
    if mode == "custom":
        specs = await ask_nonempty("توضیح/سبک تصویر مورد نظر را بنویس:") or ""
    await cl.Message(content="🎨 در حال تولید پرامپت‌های تصویر…").send()
    await _resume(next_command({"action": "image", "mode": mode, "specs": specs}))
    await advance()


# Image prompt review checkpoint.
async def review_prompts():
    v = _session().values()
    await cl.Message(content="**🖼️ پرامپت کاور (imageCover.png):**\n\n```\n" +
                             v.get("image_prompt", "") + "\n```").send()
    await cl.Message(content="**🖼️ پرامپت کارت (imageThumbnail.png):**\n\n```\n" +
                             v.get("imagecard_prompt", "") + "\n```").send()
    res = await cl.AskActionMessage(
        content="**گام ۶/۶ — بازبینیِ پرامپت‌های تصویر:** مورد تایید است؟",
        actions=[
            cl.Action(name="approve", payload={"v": "approve"}, label="✅ تایید و تولید تصویر"),
            cl.Action(name="edit", payload={"v": "edit"}, label="✏️ ویرایش دستی پرامپت‌ها"),
            cl.Action(name="revise", payload={"v": "revise"}, label="🔄 اصلاح با هوش مصنوعی"),
            cl.Action(name="back", payload={"v": "back"}, label="↩️ بازگشت به حالت تصویر"),
            *_nav_actions(),
        ],
        timeout=TIMEOUT,
    ).send()
    if res is None:
        return
    choice = res["name"]
    if await _handle_nav(choice):
        return

    if choice == "approve":
        await cl.Message(content="🎨 در حال تولید تصاویر، commit و ساخت PR…").send()
        await _resume(None)
        await advance()
    elif choice == "edit":
        cover = await ask_nonempty("پرامپت کاورِ اصلاح‌شده را بفرست:")
        if not cover:
            await cl.Message(content="⏱️ پرامپت کاور دریافت نشد؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
            await review_prompts()
            return
        card = await ask_nonempty("پرامپت کارتِ اصلاح‌شده را بفرست:")
        if not card:
            await cl.Message(content="⏱️ پرامپت کارت دریافت نشد؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
            await review_prompts()
            return
        _session().update({"image_prompt": cover, "imagecard_prompt": card})
        await cl.Message(content="🎨 در حال تولید تصاویر با پرامپت‌های ویرایش‌شده…").send()
        await _resume(None)
        await advance()
    elif choice == "revise":
        fb = await ask_nonempty("بازخورد اصلاح پرامپت‌ها را بنویس:")
        if not fb:
            await cl.Message(content="⏱️ بازخوردی نگرفتم؛ به مرحله‌ی بازبینی پرامپت‌ها برمی‌گردیم.").send()
            await review_prompts()
            return
        await cl.Message(content="🎨 در حال بازتولید پرامپت‌ها…").send()
        await _resume(next_command({"action": "revise_images", "feedback": fb}))
        await advance()
    elif choice == "back":
        await cl.Message(content="↩️ بازگشت به انتخاب حالت تصویر…").send()
        await _resume(next_command({"action": "back_images"}))
        await advance()
