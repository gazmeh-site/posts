"""Paths, environment loading, and model configuration for Mirza."""
import os

from dotenv import load_dotenv

# Mirza package directory, containing project files and .env.
PACKAGE_DIR = os.path.dirname(os.path.abspath(__file__))
# Content repository root, used for fa/<topic>/<slug> and Git commands.
POSTS_DIR = os.path.dirname(PACKAGE_DIR)

# Treat mirza/.env as authoritative over matching shell variables.
load_dotenv(os.path.join(PACKAGE_DIR, ".env"), override=True)

# Model configuration.
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic").lower()  # anthropic | google
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5")
GEMINI_TEXT_MODEL = os.getenv("GEMINI_TEXT_MODEL", "gemini-2.5-flash")
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image-preview")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_IMAGE_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_IMAGE_MODEL}:generateContent"
)
