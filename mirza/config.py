"""Paths, environment loading, and per-stage model configuration for Mirza."""
import os
from dataclasses import dataclass

from dotenv import load_dotenv

# Mirza package directory, containing project files and .env.
PACKAGE_DIR = os.path.dirname(os.path.abspath(__file__))
# Content repository root, used for fa/<topic>/<slug> and Git commands.
POSTS_DIR = os.path.dirname(PACKAGE_DIR)

# Treat mirza/.env as authoritative over matching shell variables.
load_dotenv(os.path.join(PACKAGE_DIR, ".env"), override=True)

# LangSmith auto-traces the LangGraph pipeline when LANGSMITH_TRACING=true and a key is
# set. If the key is missing, force tracing off so runs don't fail with auth errors
# before the user fills in LANGSMITH_API_KEY.
if os.getenv("LANGSMITH_TRACING", "").lower() == "true" and not os.getenv("LANGSMITH_API_KEY"):
    os.environ["LANGSMITH_TRACING"] = "false"

# Gemini image generation. Unrelated to the text-model stages below — Mirza always
# generates images through Gemini regardless of which text model each stage uses.
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image-preview")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_IMAGE_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_IMAGE_MODEL}:generateContent"
)


# --- Text-model configuration -----------------------------------------------------
#
# Every LLM call in the pipeline goes through litellm (see llm.py), so any stage can
# point at any provider by using a "provider/model" name (e.g. "anthropic/claude-
# sonnet-5", "gemini/gemini-2.5-flash"). Each of the four stages (draft, enrich,
# metadata, images) has its own StageConfig, independently overridable in .env via
# MIRZA_<STAGE>_<FIELD>. Unset fields fall back to the shared MIRZA_<FIELD> default,
# then (for backward compatibility with .env files predating this refactor) to the
# legacy ANTHROPIC_* vars, then to the hardcoded default below.

_VALID_EFFORTS = ("none", "low", "medium", "high")

_DEFAULT_MODEL = os.getenv("MIRZA_MODEL") or os.getenv("ANTHROPIC_MODEL") or "claude-sonnet-5"
_DEFAULT_API_BASE = (
    os.getenv("MIRZA_API_BASE") or os.getenv("ANTHROPIC_BASE_URL") or os.getenv("ANTHROPIC_API_URL")
)
_DEFAULT_API_KEY = os.getenv("MIRZA_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
# The default max_tokens (usually 4096) is far too small when a full Persian article
# must fit inside a single JSON field; generation gets cut off mid-body, the closing
# '}' is never produced, and structured parsing fails. Raise it well above article size.
_DEFAULT_MAX_TOKENS = os.getenv("MIRZA_MAX_TOKENS") or os.getenv("ANTHROPIC_MAX_TOKENS") or "32000"


@dataclass(frozen=True)
class StageConfig:
    """Model settings for one pipeline stage (draft/enrich/metadata/images)."""
    model: str          # litellm "provider/model" name, e.g. "anthropic/claude-sonnet-5"
    temperature: float
    effort: str          # "none" | "low" | "medium" | "high" — reasoning/thinking effort
    max_tokens: int
    stream: bool          # only draft streams tokens back to the Chainlit preview
    api_base: str | None
    api_key: str | None


def _stage(name: str, model: str, temperature: float, effort: str, stream: bool = False) -> StageConfig:
    """Build the StageConfig for ``name``, honoring MIRZA_<NAME>_<FIELD> overrides.

    ``model``/``temperature``/``effort`` are this stage's defaults (already resolved
    against the shared/legacy fallbacks by the caller for model). api_base/api_key/
    max_tokens fall back to the shared MIRZA_*/ANTHROPIC_* defaults computed above.
    """
    prefix = f"MIRZA_{name}_"

    resolved_model = os.getenv(f"{prefix}MODEL") or model
    if "/" not in resolved_model:
        # A bare model name (as legacy ANTHROPIC_MODEL values are) means Anthropic.
        resolved_model = f"anthropic/{resolved_model}"

    resolved_temperature = float(os.getenv(f"{prefix}TEMPERATURE", temperature))

    resolved_effort = os.getenv(f"{prefix}EFFORT", effort).lower()
    if resolved_effort not in _VALID_EFFORTS:
        raise ValueError(
            f"MIRZA_{name}_EFFORT نامعتبر است: {resolved_effort!r} "
            f"(باید یکی از {_VALID_EFFORTS} باشد)"
        )

    return StageConfig(
        model=resolved_model,
        temperature=resolved_temperature,
        effort=resolved_effort,
        max_tokens=int(os.getenv(f"{prefix}MAX_TOKENS", _DEFAULT_MAX_TOKENS)),
        stream=stream,
        api_base=os.getenv(f"{prefix}API_BASE", _DEFAULT_API_BASE),
        api_key=os.getenv(f"{prefix}API_KEY", _DEFAULT_API_KEY),
    )


# draft: long one-shot generation, streamed live to the UI — no thinking needed.
# enrich: precise structural reasoning over line numbers — benefits from thinking.
# metadata/images: short, well-scoped extractions — no thinking needed.
STAGES = {
    "draft": _stage("DRAFT", _DEFAULT_MODEL, 0.3, "none", stream=True),
    "enrich": _stage("ENRICH", _DEFAULT_MODEL, 0.2, "medium"),
    "metadata": _stage("METADATA", _DEFAULT_MODEL, 0.2, "none"),
    "images": _stage("IMAGES", _DEFAULT_MODEL, 0.8, "none"),
}
