"""Example Mirza writer profile.

Copy this file to ``.writer.py`` in the same directory and customize its values.
The local ``.writer.py`` file is ignored by Git.
"""

WRITER_PROFILE = {
    # Exact Strapi username persisted in config.json.
    "username": "your-strapi-username",
    # Display name used only to introduce the writer to the model.
    "name": "نام و نام خانوادگی",
    # Short description of the overall writing tone.
    "tone": "آموزشی، صمیمی و مستقیم",
    # Writing habits, sentence structure, and verb usage.
    "style": "جمله‌های نسبتاً کوتاه؛ توضیح عملی؛ پرهیز از لحن تبلیغاتی",
    # The model uses these phrases sparingly and only when they sound natural.
    "preferred_phrases": [
        "بیایید دقیق‌تر نگاه کنیم",
        "در عمل یعنی...",
    ],
}
