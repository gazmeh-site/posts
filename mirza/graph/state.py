"""State and structured-output schemas for the Mirza article graph."""

from typing import Dict, List, Literal, TypedDict

from pydantic import BaseModel, Field


class ArticleState(TypedDict, total=False):
    title: str
    tags: List[str]
    writer: str
    topic: str  # English kebab-case, for example "benchmark".
    slug: str  # English kebab-case, for example "types-of-benchmarks".
    tone: str
    draft: str
    desc: str
    title_hint: str  # Short proposed Persian title, extracted in the draft node.
    keywords: List[str]  # Topic keywords for tag/topic extraction.
    review_notes: str
    change_feedback: str  # When present, the draft node runs in revision mode.
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
    draft_plain: str  # Pre-enrichment body; the reference every enrichment revision re-splices from.
    enrichment_plan: List[dict]  # Serialized EnrichmentItem entries, for checkpoint display.
    enrichment_notes: str
    enrichment_warnings: List[str]
    enrich_feedback: str  # When present, revisions rewind to enrich_plan instead of draft.


class ArticleDraft(BaseModel):
    body: str = Field(description="متن کامل مقاله به فارسی و در قالب Markdown، ویراستاری‌شده و نهایی")
    desc: str = Field(description="خلاصه‌ی ۲ تا ۳ جمله‌ای فارسی برای config.json")
    notes: List[str] = Field(
        default_factory=list,
        description="فهرستی از یادداشت‌های کوتاه فارسی درباره‌ی بهبودها/تصمیم‌های ویرایشی اعمال‌شده روی مبدأ",
    )
    title_hint: str = Field(
        description="عنوان فارسیِ کوتاه و روشنِ پیشنهادی برای مقاله (بدون Markdown)"
    )
    keywords: List[str] = Field(
        default_factory=list,
        description="کلمات کلیدیِ موضوعیِ مقاله (فارسی/انگلیسی) برای استخراج تگ و تاپیک",
    )


class ArticleMetadata(BaseModel):
    title: str = Field(min_length=1, description="عنوان فارسی مقاله، بدون Markdown")
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


class EnrichmentSubItem(BaseModel):
    """One child of a ``kind="group"`` component, covering part of the parent's range."""

    start_line: int = Field(description="شماره‌ی خطِ شروعِ زیرآیتم، داخلِ بازه‌ی والد")
    end_line: int = Field(description="شماره‌ی خطِ پایانِ زیرآیتم (شاملِ خودِ خط)")
    starts_with: str = Field(description="سه تا شش کلمه‌ی اولِ خطِ شروع، عیناً — برای اعتبارسنجی")
    props: Dict[str, str] = Field(default_factory=dict, description="پراپ‌های زیرآیتم، مثل label")


class EnrichmentItem(BaseModel):
    """A planned block: which component wraps which line range, with what labels.

    The model never writes the block body — ``enrich_apply`` builds it from the raw
    article lines this range names. ``starts_with`` is a checksum against miscounted
    line numbers: if it does not match the real line, the block is skipped with a warning.
    """

    component: str = Field(description="نام کامپوننت MDC، مثل note یا card")
    start_line: int = Field(description="شماره‌ی خطِ شروعِ بازه در متنِ شماره‌گذاری‌شده (۱-based)")
    end_line: int = Field(description="شماره‌ی خطِ پایانِ بازه (شاملِ خودِ خط)")
    starts_with: str = Field(description="سه تا شش کلمه‌ی اولِ خطِ شروع، عیناً از متن — برای اعتبارسنجی")
    props: Dict[str, str] = Field(default_factory=dict, description="پراپ‌های کوتاه مثل title/label/icon؛ هرگز متنِ بدنه")
    items: List[EnrichmentSubItem] = Field(default_factory=list, description="فقط برای کامپوننت‌های گروهی")
    reason: str = Field(description="دلیلِ کوتاهِ فارسیِ انتخابِ این کامپوننت در این نقطه")
    confidence: Literal["high", "medium", "low"] = Field(description="اطمینان از تناسبِ این انتخاب")


class EnrichmentPlan(BaseModel):
    items: List[EnrichmentItem] = Field(default_factory=list)
