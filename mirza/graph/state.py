"""State and structured-output schemas for the Mirza article graph."""

from typing import List, TypedDict

from pydantic import BaseModel, Field


class ArticleState(TypedDict, total=False):
    title: str
    tags: List[str]
    writer: str
    topic: str  # English kebab-case, for example "benchmark".
    slug: str  # English kebab-case, for example "types-of-benchmarks".
    outline: str
    tone: str
    draft: str
    desc: str
    review_notes: str
    change_feedback: str  # When present, the draft node runs in revision mode.
    mode: str  # "auto" generates from scratch; "mdfy" transforms user text.
    source_text: str
    image_mode: str  # "auto" or "custom".
    image_specs: str
    image_prompt: str
    imagecard_prompt: str
    image_feedback: str  # When present, the images node runs in revision mode.
    folder_path: str
    topic_is_new: bool
    path_exists: bool
    new_tags: List[str]
    slug_alternatives: List[str]


class ArticleDraft(BaseModel):
    body: str = Field(description="متن کامل مقاله به فارسی و در قالب Markdown")
    desc: str = Field(description="خلاصه‌ی ۲ تا ۳ جمله‌ای فارسی برای config.json")


class Review(BaseModel):
    notes: str = Field(description="نقد نقطه‌ای فارسی به‌صورت لیست")
    improved_body: str = Field(description="نسخه‌ی نهایی و کامل متن به فارسی و Markdown")


class ArticleMetadata(BaseModel):
    title: str = Field(min_length=1, description="عنوان فارسی مقاله، بدون Markdown")
    desc: str = Field(description="خلاصه‌ی ۲ تا ۳ جمله‌ای فارسی")
    tags: List[str] = Field(description="تگ‌های مرتبط و محدود")
    topic: str = Field(
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="دسته‌ی انگلیسی kebab-case",
    )
    slug: str = Field(
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="اسلاگ انگلیسی kebab-case",
    )


class ImagePrompts(BaseModel):
    image: str = Field(description="پرامپت انگلیسی برای تصویر کاور عریض")
    image_card: str = Field(description="پرامپت انگلیسی برای تصویر کارت/بندانگشتی")
