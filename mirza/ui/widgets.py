"""Pure builders for Mirza's Chainlit settings widgets."""

import chainlit as cl

from ..profiles import WRITER_TONE, WRITER_USERNAME


def _specs_widgets(values: dict) -> list:
    return [
        cl.input_widget.Select(
            id="mode",
            label="حالت تولید",
            initial_value=values.get("mode", "mdfy"),
            # Chainlit displays mapping keys and returns their values.
            items={
                "خودکار — تولید از صفر": "auto",
                "mdfy — متنی که می‌دهم را تبدیل کن": "mdfy",
            },
            description="پیش‌فرض mdfy است؛ در این حالت metadata بعد از تأیید متن استخراج می‌شود.",
        ),
        cl.input_widget.TextInput(
            id="title",
            label="عنوان مقاله (فارسی)",
            initial=values.get("title", ""),
            description="فقط برای حالت auto؛ در mdfy پس از تأیید متن استخراج می‌شود.",
        ),
        cl.input_widget.Tags(
            id="tags",
            label="تگ‌ها (فارسی)",
            initial=values.get("tags", []),
            description="فقط برای حالت auto؛ در mdfy پس از تأیید متن استخراج می‌شود.",
        ),
        cl.input_widget.TextInput(
            id="writer",
            label="نویسنده (username انگلیسی)",
            initial=values.get("writer", WRITER_USERNAME),
            placeholder="amiri",
            description="از mirza/.writer.py خوانده می‌شود؛ فقط در حالت auto قابل تغییر است.",
        ),
        cl.input_widget.TextInput(
            id="topic",
            label="تاپیک (kebab-case)",
            initial=values.get("topic", ""),
            placeholder="benchmark",
            description="فقط برای حالت auto؛ در mdfy پس از تأیید متن پیشنهاد می‌شود.",
        ),
        cl.input_widget.TextInput(
            id="slug",
            label="اسلاگ (kebab-case)",
            initial=values.get("slug", ""),
            placeholder="types-of-benchmarks",
            description="فقط برای حالت auto؛ در mdfy پس از تأیید متن پیشنهاد می‌شود.",
        ),
        cl.input_widget.TextInput(
            id="tone",
            label="لحن",
            initial=values.get("tone", WRITER_TONE),
            placeholder="آموزشی / رسمی / صمیمی",
            description="از mirza/.writer.py خوانده می‌شود؛ فقط در حالت auto قابل تغییر است.",
        ),
    ]


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
