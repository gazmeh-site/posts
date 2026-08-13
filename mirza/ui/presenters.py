"""Per-node review screens for the Mirza HITL loop.

Each function here corresponds to one graph checkpoint; ``NODE_PRESENTERS`` maps
a node name to its presenter so ui/app.py's advance() loop can dispatch on the
node name alone without knowing what each checkpoint looks like. (The ``draft``
node is the one exception — it needs a bit of state to choose between the
first-run and re-entry presenter — so app.py special-cases it before consulting
this map.)
"""
import asyncio

import chainlit as cl

from ..domain.profiles import WRITER_TONE, WRITER_USERNAME
from ..runtime.decisions import Rewind, next_command
from .app import (
    TIMEOUT,
    _handle_nav,
    _nav_actions,
    _resume,
    _resume_with_progress,
    _run_draft_with_stream,
    _session,
    advance,
    ask_nonempty,
)
from .editor import EDIT_TIMEOUT, _cleanup_editor_draft, _editor_iframe, _stage_editor_draft
from .widgets import _metadata_widgets


async def _open_draft_editor(current_draft: str, state_key: str = "draft", resume_review=None):
    """Open the inline editor and return to ``resume_review`` with the edited text saved."""
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
    await _run_draft_with_stream(next_command({
        "action": "source",
        "source_text": source_text,
        "writer": WRITER_USERNAME,
        "tone": WRITER_TONE,
    }), "🪄 در حال تبدیل و بازبینی متن مبدأ…")
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
    await _run_draft_with_stream(Rewind("draft", {
        "source_text": source_text,
        "writer": WRITER_USERNAME,
        "tone": WRITER_TONE,
        "change_feedback": "",
    }), "🪄 در حال تبدیل و بازبینی متن جدید…")
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
        await _resume_with_progress(None, "🧩 در حال برنامه‌ریزی و اعمال غنی‌سازیِ بصری…")
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
        await _run_draft_with_stream(
            next_command({"action": "revise_text", "feedback": fb}), "✏️ در حال بازنویسی…"
        )
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
        await _resume_with_progress(None, "🏷️ در حال استخراج عنوان، تگ‌ها و مسیر مقاله…")
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
        await _run_draft_with_stream(
            next_command({"action": "revise_text", "feedback": fb}), "✏️ در حال بازنویسی…"
        )
        await advance()
    elif choice == "revise_enrich":
        fb = await ask_nonempty("بازخورد بازبینیِ غنی‌سازی را بنویس (مثلاً «کارت‌ها را حذف کن»؛ این دستورالعمل قطعی است):")
        if not fb:
            await cl.Message(content="⏱️ بازخوردی نگرفتم؛ به مرحله‌ی بازبینی برمی‌گردیم.").send()
            await review_text()
            return
        await _run_draft_with_stream(
            next_command({"action": "revise_enrich", "feedback": fb}), "🧩 در حال بازبینیِ غنی‌سازی…"
        )
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
        await _resume_with_progress(None, "📁 در حال ساخت فایل‌ها…")
        await advance()
    elif choice == "edit":
        cl.user_session.set("phase", "await_metadata")
        await cl.ChatSettings(_metadata_widgets(v)).send()
        await cl.Message(content="مقادیر را ویرایش و تنظیمات را ذخیره کن؛ سپس دوباره تأیید می‌شوند.").send()
    elif choice == "reextract":
        await _resume_with_progress(
            next_command({"action": "reextract_metadata"}), "🏷️ در حال استخراج دوباره‌ی مشخصات…"
        )
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
    await _resume_with_progress(
        next_command({"action": "image", "mode": mode, "specs": specs}),
        "🎨 در حال تولید پرامپت‌های تصویر…",
    )
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
        await _resume_with_progress(None, "🎨 در حال تولید تصاویر، commit و ساخت PR…")
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
        await _resume_with_progress(None, "🎨 در حال تولید تصاویر با پرامپت‌های ویرایش‌شده…")
        await advance()
    elif choice == "revise":
        fb = await ask_nonempty("بازخورد اصلاح پرامپت‌ها را بنویس:")
        if not fb:
            await cl.Message(content="⏱️ بازخوردی نگرفتم؛ به مرحله‌ی بازبینی پرامپت‌ها برمی‌گردیم.").send()
            await review_prompts()
            return
        await _resume_with_progress(
            next_command({"action": "revise_images", "feedback": fb}), "🎨 در حال بازتولید پرامپت‌ها…"
        )
        await advance()
    elif choice == "back":
        await cl.Message(content="↩️ بازگشت به انتخاب حالت تصویر…").send()
        await _resume(next_command({"action": "back_images"}))
        await advance()


NODE_PRESENTERS = {
    "enrich_plan": review_plain_draft,
    "metadata": review_text,
    "build": review_metadata,
    "images": ask_image_mode,
    "finish": review_prompts,
}
