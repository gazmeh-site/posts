"""Incrementally extract the article ``body`` from the draft node's streamed JSON.

The draft response is prefilled with ``{``, so token deltas form ``{"body": "...", ...}``.
``BodyExtractor`` returns just the body characters (not the surrounding JSON scaffolding) so the
Chainlit preview shows clean article text as it streams. Display-only — the final structured
result is still parsed and validated by the model client (``llm`` / ``runtime.deps``).
"""


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


class BodyExtractor:
    """Incrementally extract the ``body`` string value from a streamed JSON.

    The model continues the prefilled ``{``, so the deltas form ``{"body": "...", ...}``. Only
    the body's characters should reach the user, not the surrounding JSON. ``feed`` returns the
    newly decodable body characters since the last call.

    Tokens may split an escape sequence (e.g. ``"\\u06"`` then ``"27"``) or the ``"body"`` key
    itself; this is handled by re-scanning the full accumulated raw buffer on every call and
    decoding only complete escapes, so partial sequences simply wait for the next token.
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

    Locks onto the *first* ``"body"`` key. With thinking disabled and the schema naming
    ``body`` first, that is always the article body; if the model deviates and emits another
    field first, the first displayed character simply arrives a little later (no crash).
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
