"""Live token-stream relay: forward LLM token deltas from a worker thread to the UI loop.

``StreamRelay`` is a LangChain callback attached to the graph config; ``ArticleSession`` arms
it for the draft step so the Chainlit preview can render tokens as they arrive. ``PhaseUpdate``
carries inter-phase progress notices pushed by ``relay.phase`` (which node code reaches
through ``deps.progress``).

(The display-side parsing of the partial JSON into article-body characters lives in
``ui.preview.BodyExtractor`` — this module is the transport only.)
"""
from langchain_core.callbacks import BaseCallbackHandler

# Pushed onto the relay's queue after the graph step finishes so the drain
# coroutine knows the stream is over.
STREAM_END = object()


class PhaseUpdate:
    """A human-readable progress notice pushed onto the relay's queue.

    The draft node is internally multi-phase (convert → plan → render), but only the convert
    phase streams LLM tokens with a ``body`` field the UI can show live. The later phases run
    silently from the UI's perspective — the draft text stops updating but the node keeps
    working — which reads as "finished" when it isn't. ``deps.progress(text)`` (→ relay.phase)
    between phases lets the drain loop surface a small status message instead of going quiet.
    """

    __slots__ = ("text",)

    def __init__(self, text: str):
        self.text = text


def _token_text(token) -> str:
    """Normalize an ``on_llm_new_token`` payload to a plain string.

    With thinking disabled, LangChain passes the delta as a string. When thinking is enabled
    the payload is a list of content blocks; keep the text blocks so this stays
    forward-compatible if thinking is ever turned on.
    """
    if isinstance(token, str):
        return token
    if isinstance(token, list):
        parts = []
        for block in token:
            if isinstance(block, dict) and block.get("type") == "text":
                t = block.get("text", "")
                if t:
                    parts.append(t)
        return "".join(parts)
    return ""


class StreamRelay(BaseCallbackHandler):
    """Forward LLM token deltas from a worker thread to an ``asyncio.Queue``.

    Register alongside :class:`~mirza.runtime.metrics.UsageMeter` in the graph config. Keep it
    disarmed by default and arm it only for the draft node, so the metadata/image generations
    do not stream.
    """

    def __init__(self):
        self.loop = None
        self.queue = None
        self._armed = False

    def arm(self, loop, queue):
        """Begin forwarding tokens to ``queue`` on ``loop``."""
        self.loop = loop
        self.queue = queue
        self._armed = True

    def disarm(self):
        """Stop forwarding tokens (a draining queue may still be consumed)."""
        self._armed = False

    def on_llm_new_token(self, token, *, chunk=None, **kwargs):  # noqa: D401
        if not self._armed or self.queue is None or self.loop is None:
            return
        text = _token_text(token)
        if not text:
            return
        try:
            # on_llm_new_token runs on the worker thread; hop back to the loop
            # thread to put on its (non-thread-safe) queue.
            self.loop.call_soon_threadsafe(self.queue.put_nowait, text)
        except RuntimeError:
            # The event loop closed mid-stream; nothing useful left to do.
            pass

    def phase(self, text: str) -> None:
        """Push a ``PhaseUpdate`` from node code (also runs on the worker thread)."""
        if not self._armed or self.queue is None or self.loop is None:
            return
        try:
            self.loop.call_soon_threadsafe(self.queue.put_nowait, PhaseUpdate(text))
        except RuntimeError:
            pass
