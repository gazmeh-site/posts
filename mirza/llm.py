"""Model access for text, JSON-structured output, and image generation."""

import base64
import json
import re
import secrets

import litellm
import requests
from langchain_core.messages import AIMessage, SystemMessage
from langchain_litellm import ChatLiteLLM

from .config import GEMINI_API_KEY, GEMINI_IMAGE_URL, STAGES

# Unsupported params (e.g. reasoning_effort on a model that doesn't take it) are
# dropped instead of raising, since STAGES lets any stage point at any provider.
litellm.drop_params = True


# Configurable LLM factory, one chat model per pipeline stage.
def get_chat_llm(stage: str) -> ChatLiteLLM:
    """Return a chat model configured for ``stage`` (see config.STAGES)."""
    cfg = STAGES[stage]
    if not cfg.api_key:
        raise RuntimeError(
            f"کلید API برای مرحله‌ی {stage!r} تنظیم نشده "
            f"(MIRZA_{stage.upper()}_API_KEY یا MIRZA_API_KEY را در mirza/.env تنظیم کنید)."
        )
    kwargs = {
        "model": cfg.model,
        "temperature": cfg.temperature,
        "max_tokens": cfg.max_tokens,
        "api_key": cfg.api_key,
        "streaming": cfg.stream,
    }
    if cfg.api_base:
        kwargs["api_base"] = cfg.api_base
        # Some Anthropic-compatible proxies require Bearer auth on /v1/messages
        # instead of the provider-native header litellm sends by default.
        if cfg.model.startswith("anthropic/"):
            kwargs["extra_headers"] = {"Authorization": f"Bearer {cfg.api_key}"}
    if cfg.effort != "none":
        kwargs["model_kwargs"] = {"reasoning_effort": cfg.effort}
    return ChatLiteLLM(**kwargs)


# Structured output through JSON in the prompt. Some Anthropic-compatible APIs do not
# reliably support forced tool calls, so request plain JSON and validate it with Pydantic.
def _extract_json_object(text: str) -> str:
    """Return the first JSON-parseable ``{...}`` object found in ``text``.

    Non-thinking stages prefill the assistant turn with '{', so the response usually
    starts with a field name and may omit the closing brace. Try the text as-is plus
    several repaired variants (re-attach the opener and/or the closer) before giving up.
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


def invoke_structured(stage: str, schema, messages, retries: int = 2, config=None):
    """Invoke ``stage``'s LLM and validate its plain JSON response against ``schema``.

    ``config`` (a LangChain RunnableConfig) is forwarded to ``llm.invoke`` so the call
    inherits the caller's callback context — that is how LangSmith nests the LLM run
    under the graph node instead of emitting a detached root trace.
    """
    cfg = STAGES[stage]
    llm = get_chat_llm(stage)
    schema_json = json.dumps(schema.model_json_schema(), ensure_ascii=False)
    # Prefilling the assistant turn with '{' forces the model to continue as JSON, but
    # Anthropic rejects any assistant prefill while extended thinking is enabled ("a
    # final assistant message must start with a thinking block"). Only prefill for
    # stages without thinking; _extract_json_object already handles both shapes.
    prefill = [AIMessage("{")] if cfg.effort == "none" else []
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
            ai = llm.invoke([json_instruction] + list(messages) + prefill, config=config)
            text = ai.content if isinstance(ai.content, str) else str(ai.content)
            return schema.model_validate_json(_extract_json_object(text))
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            # A streaming failure usually means the proxy rejects SSE: disable
            # streaming for the remaining retries of this call only (draft is the
            # only stage that streams, and only this invocation needs to fall back).
            if getattr(llm, "streaming", False):
                llm.streaming = False
            usage = getattr(ai, "usage_metadata", None)
            print(
                f"⚠️  attempt {n + 1}/{attempts} structured parse failed ({stage}): {exc} "
                f"usage={usage} len(text)={len(text)}"
            )
    raise RuntimeError(f"structured parse failed after {attempts} attempts: {last_err}")


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
