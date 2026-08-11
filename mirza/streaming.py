"""Live token streaming plumbing for the Chainlit draft preview.

The draft node's JSON-structured response is prefilled with ``{``, so the raw
token stream is partial JSON whose first field is ``body``. ``StreamRelay``
forwards raw text deltas from the worker-thread LLM callback to the event loop,
and ``BodyExtractor`` turns those deltas into just the article-body characters
for display (not the surrounding JSON scaffolding).
"""

from langchain_core.callbacks import BaseCallbackHandler

# Pushed onto the relay's queue after the graph step finishes so the drain
# coroutine knows the stream is over.
STREAM_END = object()

# Characters that may sit between a JSON key and its value's opening quote.
_KV_SKIP = " \t\r\n:"

# JSON single-char escapes -> their decoded characters.
_SIMPLE_ESCAPES = {
    '"': '"',
    "\\": "\\",
    "/": "/",
    "n": "\n",
    "t": "\t",
    "r": "\r",
    "b": "\b",
    "f": "\f",
}


def _token_text(token) -> str:
    """Normalize an ``on_llm_new_token`` payload to a plain string.

    With thinking disabled, LangChain passes the delta as a string. When
    thinking is enabled the payload is a list of content blocks; keep the text
    blocks so this stays forward-compatible if thinking is ever turned on.
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

    Register alongside :class:`~mirza.metrics.UsageMeter` in the graph config.
    Keep it disarmed by default and arm it only for the draft node, so the
    metadata/image generations do not stream.
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


class BodyExtractor:
    """Incrementally extract the ``body`` string value from a streamed JSON.

    The model continues the prefilled ``{``, so the deltas form
    ``{"body": "...", ...}``. Only the body's characters should reach the user,
    not the surrounding JSON. ``feed`` returns the newly decodable body
    characters since the last call.

    Tokens may split an escape sequence (e.g. ``"\\u06"`` then ``"27"``) or the
    ``"body"`` key itself; this is handled by re-scanning the full accumulated
    raw buffer on every call and decoding only complete escapes, so partial
    sequences simply wait for the next token.
    """

    def __init__(self):
        self._raw = ""
        self._emitted = 0

    def feed(self, text: str) -> str:
        """Accumulate ``text`` and return the new body characters to display."""
        if not text:
            return ""
        self._raw += text
        body = _decode_body(self._raw)
        new = body[self._emitted:]
        self._emitted = len(body)
        return new


def _decode_body(raw: str) -> str:
    """Return the decoded ``body`` value found in ``raw`` (possibly incomplete).

    Locks onto the *first* ``"body"`` key. With thinking disabled and the schema
    naming ``body`` first, that is always the article body; if the model deviates
    and emits another field first, the first displayed character simply arrives a
    little later (no crash).
    """
    start = raw.find('"body"')
    if start == -1:
        return ""
    i = start + len('"body"')
    n = len(raw)
    # Skip the colon and whitespace up to the value's opening quote.
    while i < n and raw[i] in _KV_SKIP:
        i += 1
    if i >= n:
        return ""
    if raw[i] != '"':
        return ""  # Malformed value; give up rather than emit garbage.
    i += 1
    out = []
    while i < n:
        c = raw[i]
        if c == '"':
            break  # Closing quote: the body is complete.
        if c == "\\":
            if i + 1 >= n:
                break  # Incomplete escape; wait for the next token.
            e = raw[i + 1]
            if e == "u":
                if i + 6 > n:
                    break  # Incomplete \uXXXX; wait for the next token.
                try:
                    out.append(chr(int(raw[i + 2:i + 6], 16)))
                except ValueError:
                    out.append(raw[i:i + 6])
                i += 6
            else:
                out.append(_SIMPLE_ESCAPES.get(e, e))
                i += 2
        else:
            out.append(c)
            i += 1
    return "".join(out)
