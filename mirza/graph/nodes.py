"""Node implementations for the Mirza article graph."""

import json
import os

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig

from ..catalog import placement_details, resolve_article_folder, scan_post_catalog, validate_identifier
from ..config import POSTS_DIR
from ..llm import generate_image_file, invoke_structured
from ..profiles import writer_prompt_context
from ..prompts import (
    IMAGE_SYSTEM,
    METADATA_SYSTEM,
    WRITER_SYSTEM_MDFY,
)
from .git import create_branch_and_pr
from .state import ArticleDraft, ArticleMetadata, ArticleState, ImagePrompts


def draft(state: ArticleState, config: RunnableConfig) -> dict:
    """Convert the source text to a polished Gazmeh article (one-shot), or revise it."""
    is_revision = bool(state.get("change_feedback"))
    feedback = state.get("change_feedback", "")

    user = (
        f"عنوان: {state.get('title', '')}\n"
        f"موضوع/تاپیک: {state.get('topic', '')}\n"
        f"لحن: {state.get('tone', '')}\n"
        f"\nپروفایل نویسنده:\n{writer_prompt_context()}\n"
    )
    if is_revision:
        # Focus revisions on the current draft instead of reinjecting the source.
        user += (
            f"\nمتن فعلی:\n{state.get('draft', '')}\n\n"
            f"بازخورد اصلاح (این دستورالعمل قطعی است):\n{feedback}\n"
        )
        print("✏️  Rewriting the article based on feedback...")
    else:
        user += (
            "\nمتن مبدأ (این متن را به مارک‌داون جذاب گزمه تبدیل کن — وفادار + غنی‌سازی + ویراستاری):\n"
            f"{state.get('source_text', '')}\n\n"
        )
        print("🪄  Converting and polishing the source text...")

    result = invoke_structured(0.3, ArticleDraft, [SystemMessage(WRITER_SYSTEM_MDFY), HumanMessage(user)], config=config)
    notes = "\n".join(f"- {item.strip()}" for item in result.notes if item and item.strip())
    return {
        "draft": result.body,
        "desc": result.desc,
        "title_hint": result.title_hint,
        "keywords": result.keywords,
        "review_notes": notes,
        "change_feedback": "",
    }


def extract_metadata(state: ArticleState, config: RunnableConfig) -> dict:
    """Extract metadata and propose article placement after text approval."""
    print("🏷️  Extracting title, tags, and article path...")
    catalog = scan_post_catalog(POSTS_DIR)
    catalog_json = json.dumps(catalog.as_prompt_data(), ensure_ascii=False, indent=2)
    # Send only the compact signals produced in the draft node, not the full article body.
    user = (
        f"فهرست فعلی مخزن:\n{catalog_json}\n\n"
        f"عنوان پیشنهادی: {state.get('title_hint', '')}\n"
        f"کلمات کلیدی: {', '.join(state.get('keywords', []))}\n"
        f"خلاصه: {state.get('desc', '')}"
    )
    result = invoke_structured(
        0.2,
        ArticleMetadata,
        [SystemMessage(METADATA_SYSTEM), HumanMessage(user)],
        config=config,
    )
    topic = validate_identifier(result.topic, "topic")
    slug = validate_identifier(result.slug, "slug")
    tags = list(dict.fromkeys(tag.strip() for tag in result.tags if tag.strip()))
    details = placement_details(catalog, topic, slug, tags)
    return {
        "title": result.title.strip(),
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

    print(f"📁 Files created: {folder}")
    return {"folder_path": folder}


def images(state: ArticleState, config: RunnableConfig) -> dict:
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

    print("🎨 Generating image prompts...")
    result = invoke_structured(0.8, ImagePrompts, [SystemMessage(IMAGE_SYSTEM), HumanMessage(user)], config=config)
    return {"image_prompt": result.image, "imagecard_prompt": result.image_card, "image_feedback": ""}


def finish(state: ArticleState) -> dict:
    """Generate images, persist prompts, create a branch, and print next steps."""
    folder = state.get("folder_path", "")
    if not folder:
        print("⚠️  folder_path not found.")
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
    print("🎨 Generating cover image...")
    cover_ok = generate_image_file(cover_prompt, cover_path, "16:9", "1K")
    print("🎨 Generating thumbnail image...")
    thumb_ok = generate_image_file(card_prompt, thumb_path, "1:1", "1K")

    rel = os.path.relpath(folder, POSTS_DIR)
    branch = f"draft/{state.get('topic', 'post')}-{state.get('slug', 'article')}"
    pr_url = None
    try:
        pr_url = create_branch_and_pr(rel, state.get("title", "draft article"), branch)
    except RuntimeError as exc:
        print(f"⚠️  branch/commit creation failed:\n{exc}")

    print("\n" + "=" * 60)
    print("✅ Article ready!")
    print("=" * 60)
    print(f"Files: {rel}/  (config.json, content.md, resources/)")
    print(
        "  ✓ imageCover.png generated"
        if cover_ok
        else "  ✗ imageCover.png not generated — build it manually with the IMAGE_PROMPTS.txt prompt"
    )
    print(
        "  ✓ imageThumbnail.png generated"
        if thumb_ok
        else "  ✗ imageThumbnail.png not generated — build it manually with the IMAGE_PROMPTS.txt prompt"
    )
    if pr_url:
        print(f"\n🔀 Open this PR for review:\n  {pr_url}")
    print("\nAfter merge, to publish to Strapi (from inside posts/):")
    print("  set -a; source .env; set +a")
    print(f"  python3 add-all-posts-api.py {rel}")
    print("=" * 60)
    return {}
