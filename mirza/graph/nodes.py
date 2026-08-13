"""Node implementations for the Mirza article graph.

Each node is a pure function of ``(state, config)`` that reads its collaborators from
``get_deps(config)`` (see ``runtime.deps``) — it does NOT import ``llm`` / ``infra`` / ``ui``
at module top level. That dependency inversion is what keeps the ``graph`` layer independent
and lets the model, image generator, RAG retriever, git, and progress sink be swapped without
touching node code.
"""

import json
import os

from langchain_core.runnables import RunnableConfig

from ..domain.catalog import placement_details, resolve_article_folder, scan_post_catalog, validate_identifier
from ..domain.enrichment import apply_plan, validate_mdc
from ..domain.profiles import writer_prompt_context
from ..prompts import (
    draft_messages,
    enrich_plan_messages,
    images_messages,
    metadata_messages,
)
from ..runtime.deps import get_deps
from .state import (
    ArticleDraft,
    ArticleMetadata,
    ArticleState,
    EnrichmentItem,
    EnrichmentPlan,
    ImagePrompts,
)


def _retrieval(deps, state) -> str:
    """RAG seam: pull context chunks for this article and join them ("" when RAG is off).

    The default ``NoopRetriever`` returns nothing, so this is a no-op today. Wiring a real
    retriever into ``Deps`` turns draft into a retrieval-augmented step with no node change.
    """
    query = state.get("title") or state.get("topic") or ""
    chunks = deps.retriever.retrieve(query) if query else []
    return "\n\n".join(chunks) if chunks else ""


def draft(state: ArticleState, config: RunnableConfig) -> dict:
    """Convert the source text to a polished article, or revise it against feedback.

    Enrichment is not this node's business: it produces the plain article body, and
    ``enrich_plan``/``enrich_apply`` decorate it downstream. An enrichment revision
    therefore rewinds to ``enrich_plan`` and never re-runs this node at all.
    """
    deps = get_deps(config)
    is_revision = bool(state.get("change_feedback"))
    if is_revision:
        print("✏️  Rewriting the article based on feedback...")
    else:
        print("🪄  Converting and polishing the source text...")

    ctx = {
        "title": state.get("title", ""),
        "topic": state.get("topic", ""),
        "tone": state.get("tone", ""),
        "writer": writer_prompt_context(),
        "is_revision": is_revision,
        "current": state.get("draft_plain") or state.get("draft", ""),
        "feedback": state.get("change_feedback", ""),
        "source_text": state.get("source_text", ""),
        "retrieval": _retrieval(deps, state),
    }
    result = deps.llm.complete_structured("draft", ArticleDraft, draft_messages(ctx), config=config)
    return {
        "draft_plain": result.body,
        "desc": result.desc,
        "title_hint": result.title_hint,
        "keywords": result.keywords,
        "review_notes": "\n".join(f"- {n.strip()}" for n in result.notes if n and n.strip()),
        "change_feedback": "",
    }


def enrich_plan(state: ArticleState, config: RunnableConfig) -> dict:
    """Decide which MDC component covers which line range of the plain draft.

    The model only ever returns line numbers and short labels — the block itself is
    built deterministically in ``enrich_apply`` from the article's own lines, so the
    body text cannot drift and the MDC cannot come back malformed. Line numbers are
    prefixed onto the text because the plan addresses the article by line.
    """
    deps = get_deps(config)
    deps.progress("🧩  در حال برنامه‌ریزیِ غنی‌سازیِ بصری…")
    base = state.get("draft_plain", "")
    numbered = "\n".join(f"{i}\t{line}" for i, line in enumerate(base.split("\n"), start=1))
    ctx = {"numbered_text": numbered, "feedback": state.get("enrich_feedback", "")}
    plan = deps.llm.complete_structured(
        "enrich", EnrichmentPlan, enrich_plan_messages(ctx), config=config
    )

    notes_lines = []
    for item in plan.items:
        note = f"- `{item.component}` خط {item.start_line}–{item.end_line} ({item.confidence}): {item.reason}"
        labels = " · ".join(f"{k}={v}" for k, v in item.props.items())
        if labels:
            note += f" — {labels}"
        notes_lines.append(note)

    return {
        "enrichment_plan": [item.model_dump() for item in plan.items],
        "enrichment_notes": "\n".join(notes_lines),
        "enrich_feedback": "",
    }


def enrich_apply(state: ArticleState, config: RunnableConfig) -> dict:
    """Render and splice the planned blocks. No LLM call — pure Python.

    Always re-splices from ``draft_plain`` rather than the previous ``draft``, so
    repeated enrichment revisions replace the blocks instead of stacking them.
    """
    deps = get_deps(config)
    base = state.get("draft_plain", "")
    items = [EnrichmentItem(**item) for item in state.get("enrichment_plan", [])]
    if items:
        deps.progress(f"🎨  در حال جای‌گذاریِ {len(items)} بلوکِ غنی‌سازی…")
    enriched, warnings = apply_plan(base, items)
    return {"draft": enriched, "enrichment_warnings": warnings + validate_mdc(enriched)}


def extract_metadata(state: ArticleState, config: RunnableConfig) -> dict:
    """Extract metadata and propose article placement after text approval."""
    deps = get_deps(config)
    print("🏷️  Extracting title, tags, and article path...")
    catalog = scan_post_catalog(deps.posts_dir)
    catalog_json = json.dumps(catalog.as_prompt_data(), ensure_ascii=False, indent=2)
    # Send only the compact signals produced in the draft node, not the full article body.
    ctx = {
        "catalog_json": catalog_json,
        "title_hint": state.get("title_hint", ""),
        "keywords": state.get("keywords", []),
        "desc": state.get("desc", ""),
    }
    result = deps.llm.complete_structured(
        "metadata", ArticleMetadata, metadata_messages(ctx), config=config
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


def build(state: ArticleState, config: RunnableConfig) -> dict:
    """Create the article folder, config, content, and resources directory."""
    deps = get_deps(config)
    folder = resolve_article_folder(deps.posts_dir, state["topic"], state["slug"])
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
    deps = get_deps(config)
    print("🎨 Generating image prompts...")
    ctx = {
        "title": state.get("title", ""),
        "topic": state.get("topic", ""),
        "desc": state.get("desc", ""),
        "image_mode": state.get("image_mode", ""),
        "image_specs": state.get("image_specs", ""),
        "feedback": state.get("image_feedback", ""),
    }
    result = deps.llm.complete_structured(
        "images", ImagePrompts, images_messages(ctx), config=config
    )
    return {"image_prompt": result.image, "imagecard_prompt": result.image_card, "image_feedback": ""}


def finish(state: ArticleState, config: RunnableConfig) -> dict:
    """Generate images, persist prompts, create a branch, and print next steps."""
    deps = get_deps(config)
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
    cover_ok = deps.images.generate(cover_prompt, cover_path, "16:9", "1K")
    print("🎨 Generating thumbnail image...")
    thumb_ok = deps.images.generate(card_prompt, thumb_path, "1:1", "1K")

    rel = os.path.relpath(folder, deps.posts_dir)
    branch = f"draft/{state.get('topic', 'post')}-{state.get('slug', 'article')}"
    pr_url = None
    try:
        pr_url = deps.git(rel, state.get("title", "draft article"), branch)
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
