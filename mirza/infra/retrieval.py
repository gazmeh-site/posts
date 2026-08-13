"""RAG plug point.

``NoopRetriever`` returns no context, so the pipeline runs retrieval-free by default. A real
retriever (vector store, keyword search, …) implements the same ``Retriever`` shape declared in
``runtime.deps`` and is wired into ``Deps`` — no node rewrite is needed to add RAG.
"""


class NoopRetriever:
    """A ``Retriever`` that always returns no chunks (the default, RAG-off behavior)."""

    def retrieve(self, query, k=4):  # noqa: ARG002  (query/k unused by design)
        return []
