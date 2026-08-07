"""Load the local writer profile and format it for model prompts."""

import os
import runpy

from .config import PACKAGE_DIR


WRITER_PATH = os.path.join(PACKAGE_DIR, ".writer.py")


def _load_writer_profile() -> dict:
    """Load the local profile; the example file is only a copyable template."""
    if not os.path.isfile(WRITER_PATH):
        return {}

    profile = runpy.run_path(WRITER_PATH).get("WRITER_PROFILE", {})
    if not isinstance(profile, dict):
        raise ValueError(f"WRITER_PROFILE در {WRITER_PATH} باید یک dict باشد.")

    phrases = profile.get("preferred_phrases", [])
    if not isinstance(phrases, list) or not all(isinstance(item, str) for item in phrases):
        raise ValueError("writer preferred_phrases باید فهرستی از رشته‌ها باشد.")
    return profile


WRITER_PROFILE = _load_writer_profile()
WRITER_USERNAME = str(WRITER_PROFILE.get("username", "")).strip()
WRITER_NAME = str(WRITER_PROFILE.get("name", "")).strip()
WRITER_TONE = str(WRITER_PROFILE.get("tone", "")).strip()
WRITER_STYLE = str(WRITER_PROFILE.get("style", "")).strip()
WRITER_PREFERRED_PHRASES = WRITER_PROFILE.get("preferred_phrases", [])


def writer_prompt_context() -> str:
    """Turn the writer profile into concise instructions for model prompts."""
    phrases = "، ".join(f"«{phrase}»" for phrase in WRITER_PREFERRED_PHRASES)
    return (
        f"نام نویسنده: {WRITER_NAME or WRITER_USERNAME or 'نامشخص'}\n"
        f"لحن مطلوب: {WRITER_TONE or 'لحن طبیعی متن مبدأ'}\n"
        f"راهنمای سبک: {WRITER_STYLE or 'ندارد'}\n"
        f"عبارت‌های ترجیحی: {phrases or 'ندارد'}\n"
        "عبارت‌های ترجیحی را اجباری و تکراری استفاده نکن؛ فقط اگر طبیعی بودند، "
        "به‌شکل محدود و چرخشی به کار ببر."
    )
