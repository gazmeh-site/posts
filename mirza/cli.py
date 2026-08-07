"""Interactive terminal loop for Mirza's human-in-the-loop workflow.

Command construction is shared with Chainlit through controller.next_command.
"""
import os
import subprocess
import sys
import tempfile
from .config import GEMINI_API_KEY, LLM_PROVIDER
from .controller import ArticleSession, Jump, Rewind, next_command
from .profiles import WRITER_TONE, WRITER_USERNAME


# Input helpers.
def _ask(prompt: str) -> str:
    return input(prompt).strip()


def _ask_default(prompt: str, default: str) -> str:
    suffix = f" [{default}]" if default else ""
    return _ask(f"{prompt}{suffix}: ") or default


def _collect_multiline(prompt: str) -> str:
    print(prompt + "  (برای پایان، یک خط خالی بزنید)")
    lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if not line.strip():
            break
        lines.append(line)
    return "\n".join(lines)


def _yesno(prompt: str) -> bool:
    return _ask(prompt + " [y/N]: ").lower().startswith("y")


def _edit_in_editor(text: str) -> str:
    """Open text in the configured editor and return the final version."""
    with tempfile.NamedTemporaryFile("w+", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(text)
        path = f.name
    try:
        editor = os.environ.get("EDITOR") or os.environ.get("VISUAL") or "vi"
        subprocess.call([editor, path])
        with open(path, encoding="utf-8") as f:
            return f.read()
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass


def handle_interrupt(nxt: str, state: dict):
    """Collect input for the current interrupt and build the next action."""

    if nxt == "draft":
        # Handle initial specifications or a return for revision.
        if not state.get("draft") and not state.get("change_feedback"):
            print("\n" + "=" * 60)
            print("گام ۱/۵ — دریافت مقاله")
            print("=" * 60)
            mode = _ask_default(
                "حالت تولید؛ mdfy (تبدیل متن) یا auto (تولید از صفر)", "mdfy"
            ).lower()
            if mode not in ("auto", "mdfy"):
                mode = "mdfy"
            print("\n" + "-" * 60)
            if mode == "mdfy":
                source_text = _collect_multiline("متن کامل مقاله‌ی مبدأ را وارد کنید (در حالت mdfy):")
                if not source_text:
                    raise ValueError("متن مبدأ در حالت mdfy نمی‌تواند خالی باشد.")
                if not WRITER_USERNAME:
                    raise ValueError("username نویسنده در mirza/.writer.py تنظیم نشده است.")
                return next_command({
                    "action": "source",
                    "source_text": source_text,
                    "writer": WRITER_USERNAME,
                    "tone": WRITER_TONE,
                })

            title = _ask("عنوان (فارسی): ")
            tags = [t.strip() for t in _ask("تگ‌ها (فارسی، با کاما جدا کنید): ").split(",") if t.strip()]
            writer = _ask_default("نویسنده (username انگلیسی)", WRITER_USERNAME)
            topic = _ask("تاپیک/دسته (kebab-case انگلیسی، مثلاً benchmark): ")
            slug = _ask("اسلاگ مقاله (kebab-case انگلیسی، مثلاً types-of-benchmarks): ")
            outline = _collect_multiline("سرفصل‌های مورد نظر را وارد کنید (هر سرفصل در یک خط):")
            tone = _ask_default("لحن مقاله", WRITER_TONE)
            return next_command({
                "action": "specs",
                "title": title, "tags": tags, "writer": writer,
                "topic": topic, "slug": slug, "outline": outline, "tone": tone,
                "mode": mode, "source_text": "",
            })
        else:
            # Collect revision feedback after text review.
            print("\n" + "-" * 60)
            feedback = _collect_multiline("بازخورد اصلاح مقاله را وارد کنید:")
            return next_command({"action": "revise_text", "feedback": feedback})

    if nxt == "metadata":
        print("\n" + "=" * 60)
        print("گام ۲/۵ — بازبینی متن مقاله")
        print("=" * 60)
        print("\n--- متن مقاله ---\n")
        print(state.get("draft", ""))
        if state.get("review_notes"):
            print("\n--- یادداشت‌های ویراستار ---\n")
            print(state["review_notes"])
        print("\n" + "-" * 60)
        if _yesno("متن مورد تایید است؟"):
            return next_command({"action": "approve"})
        if _yesno("ویرایش دستی در ویرایشگر ($EDITOR)؟ (نه = اصلاح با هوش مصنوعی)"):
            return Rewind("review", {"draft": _edit_in_editor(state.get("draft", ""))})
        feedback = _collect_multiline("بازخورد اصلاح:")
        return next_command({"action": "revise_text", "feedback": feedback})

    if nxt == "build":
        print("\n" + "=" * 60)
        print("گام ۳/۵ — تأیید مشخصات و مسیر")
        print("=" * 60)
        print(f"عنوان: {state.get('title', '')}")
        print(f"تگ‌ها: {', '.join(state.get('tags', []))}")
        print(f"نویسنده: {state.get('writer', '')}")
        print(f"مسیر: fa/{state.get('topic', '')}/{state.get('slug', '')}/")
        print("وضعیت topic: جدید" if state.get("topic_is_new") else "وضعیت topic: موجود")
        if state.get("new_tags"):
            print("⚠️  تگ‌های جدید (پیش از انتشار باید در Strapi موجود باشند): " +
                  ", ".join(state["new_tags"]))
        if state.get("path_exists"):
            print("❌ این مسیر از قبل وجود دارد؛ overwrite مجاز نیست.")
            print("پیشنهاد slug: " + ", ".join(state.get("slug_alternatives", [])))
        elif _yesno("مشخصات و مسیر مورد تایید است؟"):
            return next_command({"action": "approve"})

        print("\nمقادیر را اصلاح کنید:")
        title = _ask_default("عنوان", state.get("title", ""))
        tags_raw = _ask_default("تگ‌ها (با کاما جدا کنید)", ", ".join(state.get("tags", [])))
        topic = _ask_default("topic", state.get("topic", ""))
        slug_default = (state.get("slug_alternatives") or [state.get("slug", "")])[0]
        slug = _ask_default("slug", slug_default)
        return next_command({
            "action": "metadata",
            "title": title,
            "tags": [tag.strip() for tag in tags_raw.split(",") if tag.strip()],
            "topic": topic,
            "slug": slug,
        })

    if nxt == "images":
        print("\n" + "=" * 60)
        print("گام ۴/۵ — مشخصات تصویر")
        print("=" * 60)
        mode = _ask("تصویر را چطور بسازیم؟ «auto» (بر اساس متن) یا «custom» (توضیح خودت): ")
        specs = ""
        if mode.lower() != "auto":
            specs = _collect_multiline("توضیح/سبک تصویر مورد نظر:")
        return next_command({"action": "image", "mode": mode.lower() or "auto", "specs": specs})

    if nxt == "finish":
        print("\n" + "=" * 60)
        print("گام ۵/۵ — تایید پرامپت‌های تصویر")
        print("=" * 60)
        print("\n--- پرامپت کاور (imageCover.png) ---\n")
        print(state.get("image_prompt", ""))
        print("\n--- پرامپت کارت (imageThumbnail.png) ---\n")
        print(state.get("imagecard_prompt", ""))
        print("\n" + "-" * 60)
        if _yesno("پرامپت‌ها مورد تایید است؟"):
            return next_command({"action": "approve"})
        feedback = _collect_multiline("بازخورد اصلاح پرامپت‌ها:")
        return next_command({"action": "revise_images", "feedback": feedback})

    # All graph interrupt nodes are handled above.
    return None


# CLI entry point.
def main():
    if LLM_PROVIDER == "google":
        if not GEMINI_API_KEY:
            sys.exit("❌ LLM_PROVIDER=google اما GEMINI_API_KEY تنظیم نشده.")
    elif not os.getenv("ANTHROPIC_API_KEY"):
        sys.exit("❌ ANTHROPIC_API_KEY در mirza/.env پیدا نشد. آن را اضافه کنید.")
    if not GEMINI_API_KEY:
        print("⚠️  توجه: GEMINI_API_KEY نیست → تصاویر خودکار تولید نمی‌شوند "
              "(فقط پرامپت ذخیره می‌شود).")

    session = ArticleSession("article-1")
    session.start()  # Run to the first interrupt before draft.

    while True:
        nxt = session.current_node()
        if not nxt:  # None means the graph reached END.
            break
        action = handle_interrupt(nxt, session.values())
        if isinstance(action, Rewind):
            session.rewind_to_before(action.target_node, action.values_patch)
        elif isinstance(action, Jump):
            session.jump_to_before(action.target_node, action.values_patch)
        else:
            session.resume(action)

    print("\n🎉 تمام شد.")
