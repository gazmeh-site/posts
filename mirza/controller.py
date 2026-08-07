"""Shared graph driver for Mirza's CLI and Chainlit interfaces.

ArticleSession runs one graph thread across interrupts. ``next_command`` converts
a decision into a Command or approval signal so both interfaces share the logic.
"""
from dataclasses import dataclass, field
from typing import Optional, Union

from langgraph.types import Command

from .catalog import placement_details, scan_post_catalog, validate_identifier
from .config import POSTS_DIR
from .graph import build_app

# Ordered interrupt nodes used by the time-travel menu.
INTERRUPT_NODES = ("draft", "metadata", "build", "images", "finish")


@dataclass
class Rewind:
    """Rewind before ``target_node``, patch state, and run to the next interrupt."""
    target_node: str
    values_patch: dict = field(default_factory=dict)


@dataclass
class Jump:
    """Fork before ``target_node`` and optionally patch state without running it."""
    target_node: str
    values_patch: dict = field(default_factory=dict)


Action = Union[None, Command, Rewind, Jump]


class ArticleSession:
    """Run an interruptible graph with an in-memory checkpointer.

    LangGraph 1.2.9 can skip later interrupts when Command(goto=...) goes backward.
    Time travel therefore forks a historical checkpoint and resumes from there.
    """

    def __init__(self, thread_id: str = "article-1"):
        self.app = build_app()
        self.config = {"configurable": {"thread_id": thread_id}}

    def start(self):
        """Run until the first interrupt, immediately before draft."""
        self.app.invoke({}, self.config)

    def current_node(self) -> Optional[str]:
        """Return the queued node, or ``None`` after reaching END."""
        snap = self.app.get_state(self.config)
        return snap.next[0] if snap.next else None

    def values(self) -> dict:
        return self.app.get_state(self.config).values

    def resume(self, cmd):
        """Resume with a command or approval until the next interrupt or END."""
        self.app.invoke(cmd, self.config)

    def update(self, values: dict):
        """Patch state on the current checkpoint without time travel."""
        self.app.update_state(self.config, values)

    def _fork_before(self, target_node: str, values_patch: Optional[dict] = None):
        """Fork the latest checkpoint queued for ``target_node`` and patch it.

        Updating a historical checkpoint replaces its values, so merge the full
        checkpoint state with the patch before updating it.
        """
        target_cp = next(
            (h for h in self.app.get_state_history(self.config) if h.next == (target_node,)),
            None,
        )
        if target_cp is None:
            raise RuntimeError(f"checkpointی که قبل از {target_node!r} باشد در تاریخچه پیدا نشد.")
        merged = {**(target_cp.values or {}), **(values_patch or {})}
        return self.app.update_state(target_cp.config, merged)

    def rewind_to_before(self, target_node: str, values_patch: Optional[dict] = None):
        """Fork, run the target node again, and stop at the next interrupt."""
        new_cfg = self._fork_before(target_node, values_patch)
        self.app.invoke(None, new_cfg)

    def jump_to_before(self, target_node: str, values_patch: Optional[dict] = None):
        """Fork to the interrupt before the target without executing it."""
        self._fork_before(target_node, values_patch)

    def available_rewind_targets(self) -> list:
        """List historical interrupt nodes available as rewind targets."""
        seen = set()
        for h in self.app.get_state_history(self.config):
            if h.next and len(h.next) == 1 and h.next[0] in INTERRUPT_NODES:
                seen.add(h.next[0])
        current = self.current_node()
        result = [n for n in INTERRUPT_NODES if n in seen]
        if current in INTERRUPT_NODES and current in result:
            # Do not offer a rewind to the current interrupt.
            result.remove(current)
        return result


# Map decisions to actions. Approval uses None to avoid a LangGraph 1.2.9 issue
# with empty Commands. Specs and image actions follow the natural graph path;
# revisions rewind because backward goto can skip subsequent interrupts.
def next_command(decision: dict) -> Action:
    action = decision.get("action")

    if action == "approve":
        return None

    if action == "specs":
        return Command(update=_specs_update(decision))

    if action == "source":
        source_text = decision["source_text"].strip()
        if not source_text:
            raise ValueError("متن مبدأ در حالت mdfy نمی‌تواند خالی باشد.")
        return Command(update={
            "mode": "mdfy",
            "source_text": source_text,
            "writer": decision.get("writer", ""),
            "tone": decision.get("tone", ""),
            "outline": "",
            "change_feedback": "",
        })

    if action == "revise_text":
        return Rewind("draft", {"change_feedback": decision["feedback"]})

    if action == "back_specs":
        return Rewind("draft", _specs_update(decision))

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


def _specs_update(decision: dict) -> dict:
    mode = decision.get("mode", "mdfy")
    topic = decision.get("topic", "")
    slug = decision.get("slug", "")
    if mode == "auto":
        topic = validate_identifier(topic, "topic")
        slug = validate_identifier(slug, "slug")
    return {
        "title": decision.get("title", ""),
        "tags": decision.get("tags", []),
        "writer": decision.get("writer", ""),
        "topic": topic,
        "slug": slug,
        "outline": decision.get("outline", ""),
        "tone": decision.get("tone", ""),
        "change_feedback": "",
        "mode": mode,
        "source_text": decision.get("source_text", ""),
    }


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
