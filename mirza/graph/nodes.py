"""Node implementations for the Mirza article graph."""

import json
import os

from langchain_core.messages import HumanMessage, SystemMessage

from ..catalog import placement_details, resolve_article_folder, scan_post_catalog, validate_identifier
from ..config import POSTS_DIR
from ..llm import generate_image_file, invoke_structured
from ..profiles import writer_prompt_context
from ..prompts import (
    IMAGE_SYSTEM,
    METADATA_SYSTEM,
    REVIEWER_SYSTEM,
    WRITER_SYSTEM,
    WRITER_SYSTEM_MDFY,
)
from .git import create_branch_and_pr
from .state import ArticleDraft, ArticleMetadata, ArticleState, ImagePrompts, Review


def draft(state: ArticleState) -> dict:
    """Generate or revise article text with the writer model."""
    mode = state.get("mode", "mdfy")
    is_mdfy = mode == "mdfy" and bool(state.get("source_text"))
    is_revision = bool(state.get("change_feedback"))
    feedback = state.get("change_feedback", "")

    user = (
        f"عنوان: {state.get('title', '')}\n"
        f"موضوع/تاپیک: {state.get('topic', '')}\n"
        f"لحن: {state.get('tone', '')}\n"
        f"\nپروفایل نویسنده:\n{writer_prompt_context()}\n"
    )
    if is_revision:
        # Focus revisions on the current draft instead of reinjecting the source or outline.
        user += (
            f"\nمتن فعلی:\n{state.get('draft', '')}\n\n"
            f"بازخورد اصلاح (این دستورالعمل قطعی است):\n{feedback}\n"
        )
    elif is_mdfy:
        user += (
            "\nمتن مبدأ (این متن را به مارک‌داون جذاب گزمه تبدیل کن — وفادار + غنی‌سازی):\n"
            f"{state.get('source_text', '')}\n\n"
        )
    else:
        user += f"\nسرفصل‌های مورد نظر:\n{state.get('outline', '')}\n\n"

    system = WRITER_SYSTEM_MDFY if is_mdfy else WRITER_SYSTEM
    if is_revision:
        print("✏️  در حال بازنویسی مقاله بر اساس بازخورد...")
    elif is_mdfy:
        print("🪄  در حال تبدیل متن مبدأ به مارک‌داون گزمه...")
    else:
        print("✍️  در حال نگارش مقاله...")

    result = invoke_structured(0.7, ArticleDraft, [SystemMessage(system), HumanMessage(user)])
    return {"draft": result.body, "desc": result.desc, "change_feedback": ""}


def review(state: ArticleState) -> dict:
    """Review the draft and return editorial notes plus an improved version."""
    print("🔍 در حال بازبینی مقاله توسط ویراستار...")
    user = (
        f"پروفایل نویسنده؛ هنگام ویرایش صدای او را حفظ کن:\n{writer_prompt_context()}\n\n"
        f"متن مقاله برای بازبینی:\n{state.get('draft', '')}"
    )
    result = invoke_structured(0.3, Review, [SystemMessage(REVIEWER_SYSTEM), HumanMessage(user)])
    return {"draft": result.improved_body, "review_notes": result.notes}


def extract_metadata(state: ArticleState) -> dict:
    """Extract metadata and propose article placement after text approval."""
    print("🏷️  در حال استخراج عنوان، تگ‌ها و مسیر مقاله...")
    catalog = scan_post_catalog(POSTS_DIR)
    if state.get("mode") != "mdfy" and state.get("title") and state.get("topic") and state.get("slug"):
        topic = validate_identifier(state["topic"], "topic")
        slug = validate_identifier(state["slug"], "slug")
        tags = list(dict.fromkeys(tag.strip() for tag in state.get("tags", []) if tag.strip()))
        return {
            "topic": topic,
            "slug": slug,
            "tags": tags,
            **placement_details(catalog, topic, slug, tags),
        }
    catalog_json = json.dumps(catalog.as_prompt_data(), ensure_ascii=False, indent=2)
    user = (
        f"فهرست فعلی مخزن:\n{catalog_json}\n\n"
        f"متن نهایی مقاله:\n{state.get('draft', '')}"
    )
    result = invoke_structured(
        0.2,
        ArticleMetadata,
        [SystemMessage(METADATA_SYSTEM), HumanMessage(user)],
    )
    topic = validate_identifier(result.topic, "topic")
    slug = validate_identifier(result.slug, "slug")
    tags = list(dict.fromkeys(tag.strip() for tag in result.tags if tag.strip()))
    details = placement_details(catalog, topic, slug, tags)
    return {
        "title": result.title.strip(),
        "desc": result.desc.strip(),
        "tags": tags,
        "topic": topic,
        "slug": slug,
        **details,
    }


def build(state: ArticleState) -> dict:
    """Create the article folder, config, content, and resources directory."""
    folder = resolve_article_folder(POSTS_DIR, state["topic"], state["slug"])
    resources = os.path.join(folder, "resources")
    config_path = os.path.join(folder, "config.json")
    content_path = os.path.join(folder, "content.md")

    if os.path.exists(folder):
        raise FileExistsError(
            f"مسیر مقاله از قبل وجود دارد و برای جلوگیری از overwrite ساخته نشد: {folder}"
        )

    os.makedirs(os.path.dirname(folder), exist_ok=True)
    os.mkdir(folder)  # Atomic: never overwrite a concurrently created path.
    os.mkdir(resources)

    config = {
        "title": state["title"],
        "desc": state.get("desc", ""),
        "tags": state["tags"],
        "writer": state["writer"],
    }
    with open(config_path, "w", encoding="utf-8") as config_file:
        json.dump(config, config_file, ensure_ascii=False, indent=4)
    with open(content_path, "w", encoding="utf-8") as content_file:
        content_file.write(state["draft"])

    print(f"📁 فایل‌ها ساخته شدند: {folder}")
    return {"folder_path": folder}


def images(state: ArticleState) -> dict:
    """Generate or revise the two English image prompts."""
    is_revision = bool(state.get("image_feedback"))
    user = (
        f"Title: {state.get('title', '')}\n"
        f"Topic: {state.get('topic', '')}\n"
        f"Summary: {state.get('desc', '')}\n"
    )
    if state.get("image_mode") == "custom" and state.get("image_specs"):
        user += f"User custom image specs/style: {state.get('image_specs')}\n"
    if is_revision:
        user += f"Revision feedback: {state.get('image_feedback')}\n"

    print("🎨 در حال تولید پرامپت‌های تصویر...")
    result = invoke_structured(0.8, ImagePrompts, [SystemMessage(IMAGE_SYSTEM), HumanMessage(user)])
    return {"image_prompt": result.image, "imagecard_prompt": result.image_card, "image_feedback": ""}


def finish(state: ArticleState) -> dict:
    """Generate images, persist prompts, create a branch, and print next steps."""
    folder = state.get("folder_path", "")
    if not folder:
        print("⚠️  folder_path پیدا نشد.")
        return {}

    resources = os.path.join(folder, "resources")
    os.makedirs(resources, exist_ok=True)
    cover_prompt = state.get("image_prompt", "")
    card_prompt = state.get("imagecard_prompt", "")

    prompts_path = os.path.join(resources, "IMAGE_PROMPTS.txt")
    with open(prompts_path, "w", encoding="utf-8") as prompts_file:
        prompts_file.write(
            "imageCover.png (cover, 16:9):\n" + cover_prompt + "\n\n"
            "imageThumbnail.png (thumbnail, 1:1):\n" + card_prompt + "\n"
        )

    cover_path = os.path.join(resources, "imageCover.png")
    thumb_path = os.path.join(resources, "imageThumbnail.png")
    print("🎨 در حال تولید تصویر کاور...")
    cover_ok = generate_image_file(cover_prompt, cover_path, "16:9", "1K")
    print("🎨 در حال تولید تصویر بندانگشتی...")
    thumb_ok = generate_image_file(card_prompt, thumb_path, "1:1", "1K")

    rel = os.path.relpath(folder, POSTS_DIR)
    branch = f"draft/{state.get('topic', 'post')}-{state.get('slug', 'article')}"
    pr_url = None
    try:
        pr_url = create_branch_and_pr(rel, state.get("title", "draft article"), branch)
    except RuntimeError as exc:
        print(f"⚠️  ساخت شاخه/commit ناموفق:\n{exc}")

    print("\n" + "=" * 60)
    print("✅ مقاله آماده شد!")
    print("=" * 60)
    print(f"فایل‌ها: {rel}/  (config.json, content.md, resources/)")
    print(
        "  ✓ imageCover.png تولید شد"
        if cover_ok
        else "  ✗ imageCover.png ساخته نشد — با پرامپت IMAGE_PROMPTS.txt دستی بسازید"
    )
    print(
        "  ✓ imageThumbnail.png تولید شد"
        if thumb_ok
        else "  ✗ imageThumbnail.png ساخته نشد — با پرامپت IMAGE_PROMPTS.txt دستی بسازید"
    )
    if pr_url:
        print(f"\n🔀 برای ریویو، این PR را باز کنید:\n  {pr_url}")
    print("\nبعد از merge، برای انتشار در Strapi (از داخل posts/):")
    print("  set -a; source .env; set +a")
    print(f"  python3 add-all-posts-api.py {rel}")
    print("=" * 60)
    return {}
