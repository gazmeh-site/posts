"""Single source of truth for the Mirza pipeline graph.

``graph/build.py`` compiles the LangGraph app from ``PIPELINE`` (topology + nodes),
and ``runtime/decisions.py`` / ``runtime/session.py`` derive ``INTERRUPT_NODES`` from
here for the time-travel menu. Edit the pipeline in ONE place — never duplicate the
interrupt list elsewhere.
"""
from dataclasses import dataclass
from typing import Callable

from . import nodes


@dataclass(frozen=True)
class NodeSpec:
    """One step of the pipeline: its graph name, the node function, and whether the
    human-in-the-loop flow pauses immediately before it."""

    name: str
    fn: Callable
    interrupt_before: bool = True


# Linear happy path: START → draft → enrich_plan → enrich_apply → metadata → build → images → finish → END
# Revisions/branching are NOT edges here — they are checkpoint time-travel in runtime/session.py.
PIPELINE: list = [
    NodeSpec("draft", nodes.draft),
    NodeSpec("enrich_plan", nodes.enrich_plan),
    # Pure Python: splices enrich_plan's output, never pauses, so never an interrupt target.
    NodeSpec("enrich_apply", nodes.enrich_apply, interrupt_before=False),
    NodeSpec("metadata", nodes.extract_metadata),
    NodeSpec("build", nodes.build),
    NodeSpec("images", nodes.images),
    NodeSpec("finish", nodes.finish),
]

# Every node the human can pause before, in pipeline order. Consumed by build.py
# (compile interrupt_before=) and by the rewind-target menu.
INTERRUPT_NODES: tuple = tuple(spec.name for spec in PIPELINE if spec.interrupt_before)
