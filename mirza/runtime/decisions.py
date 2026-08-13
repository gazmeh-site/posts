"""Map UI decisions to graph actions (``Command`` / ``Rewind`` / ``Jump`` / approval).

``next_command`` is shared by every presentation layer (Chainlit today, a future CLI) so the
interrupt/revision vocabulary lives in one place rather than in the UI.
"""
from dataclasses import dataclass, field
from typing import Union

from langgraph.types import Command

from ..config import POSTS_DIR
from ..domain.catalog import placement_details, scan_post_catalog, validate_identifier


@dataclass
class Rewind:
    """Rewind before ``target_node``, patch state, and run to the next interrupt.

    ``carry_forward`` names keys to copy from the CURRENT (latest) state into the
    forked checkpoint, in addition to ``values_patch``. This is needed because a
    historical "before target_node" checkpoint predates whatever target_node itself
    last produced — e.g. forking to "before draft" naturally has no ``draft_plain``,
    since that field only exists in checkpoints recorded *after* draft has run.
    """

    target_node: str
    values_patch: dict = field(default_factory=dict)
    carry_forward: tuple = ()


@dataclass
class Jump:
    """Fork before ``target_node`` and optionally patch state without running it."""

    target_node: str
    values_patch: dict = field(default_factory=dict)


Action = Union[None, Command, Rewind, Jump]


# Map decisions to actions. Approval uses None to avoid a LangGraph 1.2.9 issue
# with empty Commands. Source, metadata and image actions follow the natural graph
# path; revisions rewind because backward goto can skip subsequent interrupts.
def next_command(decision: dict) -> Action:
    action = decision.get("action")

    if action == "approve":
        return None

    if action == "source":
        source_text = decision["source_text"].strip()
        if not source_text:
            raise ValueError("متن مبدأ نمی‌تواند خالی باشد.")
        return Command(update={
            "source_text": source_text,
            "writer": decision.get("writer", ""),
            "tone": decision.get("tone", ""),
            "change_feedback": "",
        })

    if action == "revise_text":
        # carry_forward is required: the "before draft" checkpoint predates draft_plain,
        # so without it the revision prompt shows an empty "متن فعلی" and the model
        # rewrites the article from scratch instead of revising it.
        return Rewind(
            "draft", {"change_feedback": decision["feedback"]}, carry_forward=("draft_plain",)
        )

    if action == "revise_enrich":
        # Re-plan only; the text itself is untouched and re-spliced from draft_plain.
        return Rewind(
            "enrich_plan", {"enrich_feedback": decision["feedback"]}, carry_forward=("draft_plain",)
        )

    if action == "metadata":
        # Show edited metadata at the same checkpoint before allowing build.
        return Jump("build", _metadata_update(decision))

    if action == "reextract_metadata":
        return Rewind("metadata")

    if action == "back_text":
        return Jump("metadata")

    if action == "image":
        return Command(update={
            "image_mode": decision.get("mode", "auto"),
            "image_specs": decision.get("specs", ""),
        })

    if action == "revise_images":
        return Rewind("images", {"image_feedback": decision["feedback"]})

    if action == "back_images":
        # Return to image selection without immediately regenerating prompts.
        return Jump("images", {"image_specs": "", "image_feedback": ""})

    raise ValueError(f"action ناشناخته: {action!r}")


def _metadata_update(decision: dict) -> dict:
    title = decision["title"].strip()
    if not title:
        raise ValueError("عنوان مقاله نمی‌تواند خالی باشد.")
    topic = validate_identifier(decision["topic"], "topic")
    slug = validate_identifier(decision["slug"], "slug")
    tags = list(dict.fromkeys(tag.strip() for tag in decision.get("tags", []) if tag.strip()))
    details = placement_details(scan_post_catalog(POSTS_DIR), topic, slug, tags)
    return {
        "title": title,
        "tags": tags,
        "topic": topic,
        "slug": slug,
        **details,
    }
