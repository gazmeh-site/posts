"""Graph session for one Mirza article.

``ArticleSession`` runs the interruptible LangGraph across HITL pauses and drives
time-travel (rewind/jump) by forking historical checkpoints. Node collaborators are injected
through the runnable config (see :mod:`runtime.deps`); inter-phase progress notices route to
the stream relay via ``deps.progress``.
"""
from typing import Optional

from ..graph import build_app
from ..graph.spec import INTERRUPT_NODES  # single source of truth (graph/spec.py)
from .deps import Deps, default_deps
from .metrics import UsageMeter
from .streaming import StreamRelay


class ArticleSession:
    """Run an interruptible graph with an in-memory checkpointer.

    LangGraph 1.2.9 can skip later interrupts when Command(goto=...) goes backward.
    Time travel therefore forks a historical checkpoint and resumes from there.
    """

    def __init__(self, thread_id: str = "article-1", deps: "Deps | None" = None):
        self.app = build_app()
        self.meter = UsageMeter()
        # Forwards per-token deltas to a live Chainlit preview when armed. It is
        # disarmed by default and only the draft step arms it.
        self.relay = StreamRelay()
        # Node collaborators are injected through the runnable config (see runtime.deps):
        # nodes read them via get_deps(config) instead of importing llm/infra/ui directly.
        self.deps = deps or default_deps()
        # Phase notices from nodes (deps.progress) are routed to this session's relay so a
        # live Chainlit preview still surfaces them — without nodes importing any UI symbol.
        # (This replaces the old emit_phase(config, ...) config-digging leak.)
        self.deps.progress = self._progress
        self.config = {
            "configurable": {"thread_id": thread_id, "deps": self.deps},
            # Name the whole graph run and tag it so LangSmith groups every node and LLM
            # call of this article (including across HITL resumes) under one labeled trace.
            "run_name": "mirza article",
            "tags": [f"thread:{thread_id}"],
            "metadata": {"thread_id": thread_id, "app": "mirza"},
            # The meter counts token usage / time across all HITL resumes of this article.
            # The relay surfaces streaming tokens to the UI; it is a no-op when disarmed.
            "callbacks": [self.meter, self.relay],
        }

    def start(self):
        """Run until the first interrupt, immediately before draft."""
        self.app.invoke({}, self.config)

    def _progress(self, text: str) -> None:
        """Print a phase notice and forward it to the armed stream relay (no-op if disarmed)."""
        print(text)
        self.relay.phase(text)

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

    def _fork_before(
        self, target_node: str, values_patch: Optional[dict] = None, carry_forward: tuple = ()
    ):
        """Fork the latest checkpoint queued for ``target_node`` and patch it.

        Updating a historical checkpoint replaces its values, so merge the full
        checkpoint state with ``carry_forward`` keys taken from the CURRENT state
        (see ``Rewind.carry_forward``) and then ``values_patch``, before updating it.
        """
        target_cp = next(
            (h for h in self.app.get_state_history(self.config) if h.next == (target_node,)),
            None,
        )
        if target_cp is None:
            raise RuntimeError(f"checkpointی که قبل از {target_node!r} باشد در تاریخچه پیدا نشد.")
        current = self.values() if carry_forward else {}
        carried = {key: current[key] for key in carry_forward if key in current}
        merged = {**(target_cp.values or {}), **carried, **(values_patch or {})}
        return self.app.update_state(target_cp.config, merged)

    def rewind_to_before(
        self, target_node: str, values_patch: Optional[dict] = None, carry_forward: tuple = ()
    ):
        """Fork, run the target node again, and stop at the next interrupt."""
        new_cfg = self._fork_before(target_node, values_patch, carry_forward)
        # Re-attach the session collaborators: the forked checkpoint's config carries the
        # thread/checkpoint ids but not the injected ``deps`` (nor our callbacks), so nodes
        # reading get_deps(config) would otherwise miss them. Meter/relay stay attached so
        # rewound runs count toward the same totals and (for the draft) still stream live.
        configurable = dict(new_cfg.get("configurable") or {})
        configurable["deps"] = self.deps
        new_cfg = {**new_cfg, "configurable": configurable, "callbacks": [self.meter, self.relay]}
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
