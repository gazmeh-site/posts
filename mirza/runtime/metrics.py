"""Token and timing accounting for a Mirza article session.

A :class:`UsageMeter` is attached as a callback to the graph config so every model
call across all HITL resumes of one article is counted toward the same totals, and a
single summary (total tokens + wall-clock time) is printed when the article finishes.
"""

import time

from langchain_core.callbacks import BaseCallbackHandler


class UsageMeter(BaseCallbackHandler):
    """Accumulate LLM token usage and call counts for one article session."""

    def __init__(self):
        self.input_tokens = 0
        self.output_tokens = 0
        self.calls = 0
        self.started_at = time.time()

    def _accumulate(self, response) -> None:
        self.calls += 1
        llm_output = getattr(response, "llm_output", None) or {}
        usage = llm_output.get("usage") or llm_output.get("token_usage") or {}
        if not usage:
            try:
                generation = response.generations[0][0]
                usage = (getattr(generation, "generation_info", None) or {}).get("usage") or {}
            except (IndexError, AttributeError, KeyError):
                usage = {}
        if not usage:
            # streaming=True returns no llm_output/generation_info usage; the
            # aggregated AIMessage still carries usage_metadata, so fall back to it.
            try:
                msg = response.generations[0][0].message
                um = getattr(msg, "usage_metadata", None) or {}
                if um:
                    usage = {
                        "input_tokens": um.get("input_tokens", 0),
                        "output_tokens": um.get("output_tokens", 0),
                    }
            except (IndexError, AttributeError):
                usage = {}
        self.input_tokens += int(usage.get("input_tokens", 0) or 0)
        self.output_tokens += int(usage.get("output_tokens", 0) or 0)

    # ChatLiteLLM fires on_chat_model_end; some integrations fire on_llm_end.
    def on_llm_end(self, response, **kwargs):  # noqa: D401
        self._accumulate(response)

    def on_chat_model_end(self, response, **kwargs):
        self._accumulate(response)

    @property
    def total_tokens(self) -> int:
        return self.input_tokens + self.output_tokens

    @property
    def elapsed(self) -> float:
        return time.time() - self.started_at

    def summary(self) -> str:
        return (
            f"📊 کل فرآیند — توکن: {self.total_tokens:,} "
            f"(ورودی {self.input_tokens:,} / خروجی {self.output_tokens:,}) "
            f"| فراخوانی مدل: {self.calls} | زمان: {self.elapsed:.1f}s"
        )
