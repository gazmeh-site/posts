"""Model access for text, JSON-structured output, and image generation."""

import base64
import json
import os
import re
import secrets
import sys

import requests
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, SystemMessage

from .config import (
    LLM_PROVIDER,
    ANTHROPIC_MODEL,
    GEMINI_TEXT_MODEL,
    GEMINI_API_KEY,
    GEMINI_IMAGE_URL,
)

# Module-level circuit breaker for token streaming. ChatAnthropic supports
# streaming=True (it then fires on_llm_new_token during .invoke() while still
# returning the fully aggregated message), but some Anthropic-compatible proxies
# reject SSE. If a streaming call ever fails, this flips to False so the retry
# and every later node fall back to plain (non-streaming) generation.
_STREAMING_OK = True


# Configurable LLM factory.
def get_chat_llm(temperature: float):
    """Return a chat model for the configured provider."""
    if LLM_PROVIDER == "google":
        if not GEMINI_API_KEY:
            sys.exit("❌ LLM_PROVIDER=google اما GEMINI_API_KEY تنظیم نشده.")
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
        except ImportError:
            sys.exit("❌ برای Gemini ابتدا نصب کنید: uv add langchain-google-genai")
        return ChatGoogleGenerativeAI(model=GEMINI_TEXT_MODEL, temperature=temperature)
    if not os.getenv("ANTHROPIC_API_KEY"):
        sys.exit("❌ ANTHROPIC_API_KEY در mirza/.env پیدا نشد.")
    # The default max_tokens (4096) is far too small when a full Persian article must fit
    # inside a single JSON field; generation gets cut off mid-body, the closing '}' is never
    # produced, and structured parsing fails. Raise it well above a full article's size.
    max_tokens = int(os.getenv("ANTHROPIC_MAX_TOKENS", "32000"))
    kwargs = {"model": ANTHROPIC_MODEL, "temperature": temperature, "max_tokens": max_tokens}
    base_url = os.getenv("ANTHROPIC_BASE_URL") or os.getenv("ANTHROPIC_API_URL")
    if base_url:
        kwargs["anthropic_api_url"] = base_url
    # Some compatible proxies require Bearer auth on /v1/messages instead of x-api-key.
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        kwargs["default_headers"] = {"Authorization": f"Bearer {api_key}"}

    # need deep reasoning, so disable thinking unless ANTHROPIC_ENABLE_THINKING=1 is set.
    if os.getenv("ANTHROPIC_ENABLE_THINKING", "0") != "1":
        kwargs["thinking"] = {"type": "disabled"}
    # Stream token-by-token so the Chainlit draft preview can render live. With
    # streaming=True, .invoke() still returns the fully aggregated message (so
    # JSON parsing is unchanged) but fires on_llm_new_token per token.
    if _STREAMING_OK:
        kwargs["streaming"] = True
    return ChatAnthropic(**kwargs)


# Structured output through JSON in the prompt. Some Anthropic-compatible APIs do not
# reliably support forced tool calls, so request plain JSON and validate it with Pydantic.
def _extract_json_object(text: str) -> str:
    """Return the first JSON-parseable ``{...}`` object found in ``text``.

    The assistant turn is prefilled with '{', so the response usually starts with a
    field name and may omit the closing brace. Try the text as-is plus several
    repaired variants (re-attach the opener and/or the closer) before giving up.
    """

    def parseable(candidate: str):
        candidate = candidate.strip()
        if not candidate:
            return None
        variants = [candidate]
        start, end = candidate.find("{"), candidate.rfind("}")
        if start != -1 and end != -1 and end > start:
            variants.append(candidate[start:end + 1])
        for variant in variants:
            try:
                json.loads(variant)
                return variant
            except json.JSONDecodeError:
                continue
        return None

    raw = text.strip()
    # Drop a trailing comma so constructs like '{...,"desc": "x",}' can be repaired.
    trimmed = raw[:-1].rstrip() if raw.endswith(",") else raw

    candidates = []
    fence = re.search(r"```(?:json)?\s*(.*?)```", text, re.S)
    if fence:
        candidates.append(fence.group(1))
    candidates.extend([raw, trimmed, "{" + trimmed, "{" + trimmed + "}", trimmed + "}"])

    for candidate in candidates:
        fixed = parseable(candidate)
        if fixed is not None:
            return fixed
    raise ValueError("هیچ شیء JSON معتبر در پاسخ پیدا نشد.")


def invoke_structured(temperature: float, schema, messages, retries: int = 2, config=None):
    """Invoke the LLM and validate its plain JSON response against ``schema``.

    ``config`` (a LangChain RunnableConfig) is forwarded to ``llm.invoke`` so the call
    inherits the caller's callback context — that is how LangSmith nests the LLM run
    under the graph node instead of emitting a detached root trace.
    """
    global _STREAMING_OK
    llm = get_chat_llm(temperature)
    schema_json = json.dumps(schema.model_json_schema(), ensure_ascii=False)
    # Prefill the assistant turn with '{' so the model must continue as JSON. Without it,
    # some Anthropic-compatible models intermittently return plain Markdown (no object).
    prefill = AIMessage("{")
    attempts = retries + 1
    last_err = None
    ai = None
    text = ""
    for n in range(attempts):
        try:
            # Tag each attempt with a unique nonce. Some upstream gateways cache by the
            # exact prompt and would otherwise replay a previously truncated response.
            nonce = secrets.token_hex(4)
            json_instruction = SystemMessage(
                "پاسخ شما فقط و فقط یک شیء JSON معتبر باید باشد که دقیقاً مطابق schema زیر است. "
                "هیچ متن، توضیح، مارک‌داون یا code fence اضافه‌ای نفرست؛ فقط خود شیء JSON.\n"
                f"Schema: {schema_json}\n(run={nonce})"
            )
            ai = llm.invoke([json_instruction] + list(messages) + [prefill], config=config)
            text = ai.content if isinstance(ai.content, str) else str(ai.content)
            return schema.model_validate_json(_extract_json_object(text))
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            # A streaming failure usually means the proxy rejects SSE: disable
            # streaming for the immediate retry and for every later node this
            # session so they don't each pay the failure cost.
            if getattr(llm, "streaming", False):
                llm.streaming = False
                _STREAMING_OK = False
            md = getattr(ai, "response_metadata", {}) or {}
            usage = getattr(ai, "usage_metadata", None)
            stop = md.get("stop_reason") or md.get("stop")
            head = text[:200].replace("\n", " ")
            tail = text[-200:].replace("\n", " ")
            print(f"⚠️  attempt {n + 1}/{attempts} structured parse failed: {exc}")
            print(f"     stop={stop!r} usage={usage} len(text)={len(text)}")
            print(f"     head: {head!r}")
            print(f"     tail: {tail!r}")
    raise RuntimeError(f"structured parse failed after {attempts} attempts: {last_err}")


# Gemini image generation.
def generate_image_file(prompt: str, out_path: str, aspect_ratio: str = "16:9", image_size: str = "1K") -> bool:
    """Generate a Gemini image at ``out_path`` and report whether it succeeded."""
    if not GEMINI_API_KEY:
        print("⚠️  GEMINI_API_KEY is not set; image generation skipped.")
        return False
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": aspect_ratio, "imageSize": image_size},
        },
    }
    try:
        resp = requests.post(
            GEMINI_IMAGE_URL,
            headers={"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"},
            json=body, timeout=180,
        )
    except requests.RequestException as exc:
        print(f"⚠️  network error during image generation: {exc}")
        return False
    if resp.status_code != 200:
        print(f"⚠️  image generation failed ({resp.status_code}): {resp.text[:200]}")
        return False
    parts = (resp.json().get("candidates") or [{}])[0].get("content", {}).get("parts", [])
    for part in parts:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(inline["data"]))
            return True
    print("⚠️  Gemini response had no inlineData (image).")
    return False
