"""Model access for text, JSON-structured output, and image generation."""

import base64
import json
import os
import re
import sys

import requests
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage

from .config import (
    LLM_PROVIDER,
    ANTHROPIC_MODEL,
    GEMINI_TEXT_MODEL,
    GEMINI_API_KEY,
    GEMINI_IMAGE_URL,
)


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
    kwargs = {"model": ANTHROPIC_MODEL, "temperature": temperature}
    base_url = os.getenv("ANTHROPIC_BASE_URL") or os.getenv("ANTHROPIC_API_URL")
    if base_url:
        kwargs["anthropic_api_url"] = base_url
    # Some compatible proxies require Bearer auth on /v1/messages instead of x-api-key.
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        kwargs["default_headers"] = {"Authorization": f"Bearer {api_key}"}
    return ChatAnthropic(**kwargs)


# Structured output through JSON in the prompt. Some Anthropic-compatible APIs do not
# reliably support forced tool calls, so request plain JSON and validate it with Pydantic.
def invoke_structured(temperature: float, schema, messages, retries: int = 1):
    """Invoke the LLM and validate its plain JSON response against ``schema``."""
    llm = get_chat_llm(temperature)
    schema_json = json.dumps(schema.model_json_schema(), ensure_ascii=False)
    json_instruction = SystemMessage(
        "پاسخ شما فقط و فقط یک شیء JSON معتبر باید باشد که دقیقاً مطابق schema زیر است. "
        "هیچ متن، توضیح، مارک‌داون یا code fence اضافه‌ای نفرست؛ فقط خود شیء JSON.\n"
        f"Schema: {schema_json}"
    )
    attempts = retries + 1
    last_err = None
    for _ in range(attempts):
        try:
            ai = llm.invoke([json_instruction] + list(messages))
            text = ai.content if isinstance(ai.content, str) else str(ai.content)
            match = re.search(r"\{.*\}", text, re.S)
            if not match:
                raise ValueError("هیچ شیء JSON در پاسخ پیدا نشد.")
            return schema.model_validate_json(match.group(0))
        except Exception as exc:  # noqa: BLE001
            last_err = exc
    raise RuntimeError(f"parse ساختاریافته بعد از {attempts} تلاش ناموفق بود: {last_err}")


# Gemini image generation.
def generate_image_file(prompt: str, out_path: str, aspect_ratio: str = "16:9", image_size: str = "1K") -> bool:
    """Generate a Gemini image at ``out_path`` and report whether it succeeded."""
    if not GEMINI_API_KEY:
        print("⚠️  GEMINI_API_KEY نیست؛ تولید تصویر رد شد.")
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
        print(f"⚠️  خطای شبکه در تولید تصویر: {exc}")
        return False
    if resp.status_code != 200:
        print(f"⚠️  تولید تصویر ناموفق ({resp.status_code}): {resp.text[:200]}")
        return False
    parts = (resp.json().get("candidates") or [{}])[0].get("content", {}).get("parts", [])
    for part in parts:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(inline["data"]))
            return True
    print("⚠️  پاسخ Gemini فاقد inlineData (تصویر) بود.")
    return False
