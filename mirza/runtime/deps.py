"""Dependency-injection seam for Mirza's graph nodes (Dependency Inversion).

Nodes read their collaborators from ``config["configurable"]["deps"]`` via :func:`get_deps`
instead of importing them at module top level. :func:`default_deps` is the composition root
that wires the real implementations; tests and alternate runs inject their own :class:`Deps`
(a fake model client, a different image generator, or a real RAG retriever) without touching
node code.

This is what keeps the ``graph`` layer independent of ``llm`` / ``infra`` / ``ui``: nodes
depend on the Protocols below, not on the concrete modules behind them.
"""
from dataclasses import dataclass
from typing import Any, Callable, Protocol, runtime_checkable


@runtime_checkable
class ModelClient(Protocol):
    """Text-model access: invoke a stage's LLM and validate its JSON against ``schema``."""

    def complete_structured(self, stage: str, schema: Any, messages: list, *, config: Any = None) -> Any: ...


@runtime_checkable
class ImageGenerator(Protocol):
    """Image generation: write one image for ``prompt`` to ``out_path``; return success."""

    def generate(self, prompt: str, out_path: str, aspect_ratio: str = "16:9", image_size: str = "1K") -> bool: ...


@runtime_checkable
class Retriever(Protocol):
    """Retrieval-augmentation plug point (RAG). Return context chunks for ``query``."""

    def retrieve(self, query: str, k: int = 4) -> list: ...


def _print_progress(text: str) -> None:
    print(text)


@dataclass
class Deps:
    """The collaborators a graph node needs, injected through the LangGraph runnable config.

    ``progress`` replaces the old ``emit_phase`` UI leak: nodes call ``deps.progress(text)``
    and ``ArticleSession`` wires it to its ``StreamRelay`` so phase notices still stream live.

    Pure domain helpers (catalog scanning, the writer profile) are NOT here on purpose —
    nodes import them directly from ``domain`` and take ``posts_dir`` as a parameter. Only
    the collaborators that must be swappable (model, images, RAG, git) or that carry run
    state (``posts_dir``, ``progress``) live in ``Deps``.
    """

    llm: ModelClient
    images: ImageGenerator
    retriever: Retriever
    posts_dir: str
    git: Callable[[str, str, str], Any]        # infra.git.create_branch_and_pr
    progress: Callable[[str], None] = _print_progress


def get_deps(config: Any) -> "Deps | None":
    """Return the ``Deps`` injected into ``config["configurable"]["deps"]`` (or ``None``)."""
    configurable = (config or {}).get("configurable") or {}
    return configurable.get("deps")


class _LiteLLMClient:
    """Adapter that satisfies :class:`ModelClient` by delegating to ``llm.invoke_structured``.

    Kept as a thin class (not a bare callable) so swapping the whole text-model layer is a
    single object substitution in :class:`Deps`.
    """

    def complete_structured(self, stage, schema, messages, *, config=None):
        # Imported here, not at module top, so this module has no hard dep on llm at import
        # time and a test/alternate runtime can supply its own ModelClient without it.
        from ..llm import invoke_structured

        return invoke_structured(stage, schema, messages, config=config)


class _GeminiImageGenerator:
    """Adapter that satisfies :class:`ImageGenerator` by delegating to Gemini image gen."""

    def generate(self, prompt, out_path, aspect_ratio="16:9", image_size="1K"):
        from ..llm import generate_image_file

        return generate_image_file(prompt, out_path, aspect_ratio, image_size)


def default_deps() -> Deps:
    """Composition root: wire the real implementations (litellm text, Gemini images, noop RAG).

    Imports are local so the wiring can be overridden wholesale (e.g. in tests) without this
    module importing every concrete dependency at load time.
    """
    from ..config import POSTS_DIR
    from ..infra.git import create_branch_and_pr
    from ..infra.retrieval import NoopRetriever

    return Deps(
        llm=_LiteLLMClient(),
        images=_GeminiImageGenerator(),
        retriever=NoopRetriever(),
        posts_dir=POSTS_DIR,
        git=create_branch_and_pr,
    )
