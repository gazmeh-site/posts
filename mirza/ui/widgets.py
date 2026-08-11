"""Pure builders for Mirza's Chainlit settings widgets."""

import chainlit as cl


def _metadata_widgets(values: dict) -> list:
    return [
        cl.input_widget.TextInput(
            id="title", label="عنوان مقاله (فارسی)", initial=values.get("title", "")
        ),
        cl.input_widget.Tags(
            id="tags",
            label="تگ‌ها",
            initial=values.get("tags", []),
            description="تگ جدید باید پیش از انتشار در Strapi ساخته شود.",
        ),
        cl.input_widget.TextInput(
            id="topic", label="تاپیک (kebab-case)", initial=values.get("topic", "")
        ),
        cl.input_widget.TextInput(
            id="slug", label="اسلاگ (kebab-case)", initial=values.get("slug", "")
        ),
    ]
