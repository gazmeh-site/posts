"""Catalog of MDC (Nuxt Content + Nuxt UI v4) components mirza may enrich a draft with.

This is the single source of truth for the enrichment vocabulary AND the only place
that ever builds an MDC string. The planner prompt reads ``component_menu()`` to know
what it may choose; ``enrichment.py`` calls ``render_block()`` to actually build the
block from verbatim article lines. Because the model never writes MDC syntax itself,
unbalanced ``::`` and unknown components are structurally impossible.

The Chainlit editor's known-component list (via ``ui/editor.py``) also reads
``COMPONENTS``.
"""

import re
from dataclasses import dataclass, field


COLOR_ENUM = frozenset({
    "primary", "secondary", "success", "info", "warning", "error", "neutral",
})
ICON_RE = re.compile(r"^i-[a-z0-9]+(?:-[a-z0-9]+)+$")
_STEP_LEVEL_ENUM = frozenset({"2", "3", "4"})

# Each prop maps to a value kind that decides both how it is validated and how it is
# serialized: "color" against COLOR_ENUM, "icon" against ICON_RE, "bool" as a bare
# attribute, and "text"/"url" as a quoted key="value".
_CARD_PROPS = {
    "title": "text",
    "icon": "icon",
    "color": "color",
    "to": "url",
    "target": "text",
}
_FIELD_PROPS = {"name": "text", "type": "text", "required": "bool"}
_LABEL_PROPS = {"label": "text", "icon": "icon"}


@dataclass(frozen=True)
class Component:
    """One entry of the enrichment vocabulary.

    ``kind`` drives rendering:
    - ``wrapper``  — the planned line range goes verbatim inside one block.
    - ``group``    — the range is partitioned into sub-ranges, each wrapped in
      ``item_component``; the children are rendered one nesting level deeper than
      their parent (matching remark-mdc's ``::`` → ``:::`` convention).
    - ``inline``   — a standalone ``:name{}`` mark with no body.

    ``plannable`` is False for components the deterministic renderer cannot place
    from a line range alone (inline marks need a position *within* a line;
    ``code-preview`` needs a ``#code`` slot split that only a human can decide).
    They stay in the catalog so ``validate_mdc`` and the manual editor still know
    them — a writer may add them by hand.

    ``hidden_props`` names props that are present in ``props`` (so they are still
    validated and rendered) but left out of ``component_menu()`` — for values the
    planner should never be asked for because they are filled in automatically
    (e.g. ``steps.level``, computed from the article's own headings).
    """

    name: str
    category: str
    when: str
    kind: str
    max_per_article: int
    props: dict = field(default_factory=dict)
    item_component: str = ""
    item_props: dict = field(default_factory=dict)
    plannable: bool = True
    hidden_props: frozenset = field(default_factory=frozenset)


COMPONENTS: dict[str, Component] = {
    "note": Component(
        name="note", category="هشدار", kind="wrapper",
        when="نکته یا اطلاعاتِ اضافی که مکملِ متنِ اطراف است.",
        max_per_article=4,
    ),
    "tip": Component(
        name="tip", category="هشدار", kind="wrapper",
        when="پیشنهاد یا راهنماییِ مفید.",
        max_per_article=4,
    ),
    "warning": Component(
        name="warning", category="هشدار", kind="wrapper",
        when="احتیاط یا نتیجه‌ی غیرمنتظره‌ی احتمالی (غیربحرانی).",
        max_per_article=3,
    ),
    "caution": Component(
        name="caution", category="هشدار", kind="wrapper",
        when="عملِ غیرقابل‌بازگشت یا خطرِ جدی.",
        max_per_article=2,
    ),
    "callout": Component(
        name="callout", category="هشدار", kind="wrapper",
        when="هشدارِ سفارشی با آیکن/رنگِ دلخواه یا وقتی باید لینک هم داشته باشد.",
        props={"icon": "icon", "color": "color", "to": "url", "target": "text"},
        max_per_article=3,
    ),
    "code-group": Component(
        name="code-group", category="کد", kind="wrapper",
        when="چند بلاکِ کدِ معادلِ پشتِ سرِ هم (مثل pnpm/npm/yarn) که باید تب‌بندی شوند.",
        max_per_article=2,
    ),
    "code-collapse": Component(
        name="code-collapse", category="کد", kind="wrapper",
        when="بلاک کدِ طولانی (بیش از ~۲۵ خط) که نباید صفحه را اشغال کند.",
        max_per_article=1,
    ),
    "code-tree": Component(
        name="code-tree", category="کد", kind="wrapper",
        when="چند بلاکِ کدِ پشتِ سرِ هم از فایل‌های مرتبط که ساختارِ پوشه/فایل هم اهمیت دارد.",
        props={"defaultValue": "text"},
        max_per_article=1,
    ),
    "code-preview": Component(
        name="code-preview", category="کد", kind="wrapper",
        when="نمایشِ هم‌زمانِ خروجی و کدِ منبع در کنار هم (فقط دستی؛ نیازمندِ اسلاتِ #code).",
        plannable=False,
        max_per_article=1,
    ),
    "steps": Component(
        name="steps", category="چیدمان", kind="wrapper",
        when="بازه‌ای که از چند هدینگِ هم‌سطحِ پشتِ سرِ هم تشکیل شده و ترتیبشان مهم است.",
        # level is computed automatically in apply_plan from the headings inside the
        # planned range — never asked of the model — but still validated/rendered
        # if a plan somehow supplies one (e.g. from a hand-edited draft).
        props={"level": "step-level"},
        hidden_props=frozenset({"level"}),
        max_per_article=1,
    ),
    "tabs": Component(
        name="tabs", category="چیدمان", kind="group",
        when="چند محتوای موازی و هم‌ارز که کاربر بینِ آن‌ها سوییچ می‌کند.",
        item_component="tabs-item", item_props=_LABEL_PROPS,
        max_per_article=2,
    ),
    "accordion": Component(
        name="accordion", category="چیدمان", kind="group",
        when="چند پرسش‌وپاسخ یا موضوعِ مستقل که پیش‌فرض بسته‌اند.",
        item_component="accordion-item", item_props=_LABEL_PROPS,
        max_per_article=2,
    ),
    "collapsible": Component(
        name="collapsible", category="چیدمان", kind="wrapper",
        when="یک بخشِ فرعیِ طولانی که پیش‌فرض باید جمع باشد.",
        max_per_article=2,
    ),
    "card": Component(
        name="card", category="چیدمان", kind="wrapper",
        when="یک قطعه‌ی مستقل که باید مثلِ کارت با عنوان و آیکن برجسته شود.",
        props=_CARD_PROPS,
        max_per_article=4,
    ),
    "card-group": Component(
        name="card-group", category="چیدمان", kind="group",
        when="چند گزینه/منبعِ موازی که باید هم‌زمان و در کنار هم دیده شوند.",
        item_component="card", item_props=_CARD_PROPS,
        max_per_article=2,
    ),
    "field": Component(
        name="field", category="تعاملی", kind="wrapper",
        when="مستندسازیِ یک پارامتر/آپشنِ تکی (نام، نوع، الزامی یا نه).",
        props=_FIELD_PROPS,
        max_per_article=6,
    ),
    "field-group": Component(
        name="field-group", category="تعاملی", kind="group",
        when="چند پارامتر/آپشنِ مرتبط با هم که باید کنارِ هم فهرست شوند.",
        item_component="field", item_props=_FIELD_PROPS,
        max_per_article=2,
    ),
    "kbd": Component(
        name="kbd", category="درون‌خطی", kind="inline",
        when="کلید یا ترکیبِ میانبرِ صفحه‌کلید (فقط دستی).",
        props={"value": "text"}, plannable=False,
        max_per_article=6,
    ),
    "badge": Component(
        name="badge", category="درون‌خطی", kind="wrapper",
        when="برچسبِ کوتاه مثلِ شماره‌ی نسخه یا وضعیت.",
        props={"color": "color"},
        max_per_article=4,
    ),
    "icon": Component(
        name="icon", category="درون‌خطی", kind="inline",
        when="آیکنِ درون‌خطی برای تأکیدِ بصریِ کوتاه (فقط دستی).",
        props={"name": "icon"}, plannable=False,
        max_per_article=6,
    ),
    "prompt": Component(
        name="prompt", category="تعاملی", kind="wrapper",
        when="یک پرامپتِ آماده برای دستیارِ هوشِ مصنوعی که کاربر می‌تواند کپی کند.",
        props={"description": "text", "icon": "icon"},
        max_per_article=1,
    ),
}

_TRUTHY = frozenset({"true", "1", "yes", "بله", "required"})


def validate_props(spec: dict, props: dict, label: str) -> tuple:
    """Filter ``props`` down to ``spec``'s allowlist; return ``(clean, warnings)``.

    An invalid prop only drops that prop, never the whole block — a mistyped icon
    is not a reason to lose the enrichment. Returns props in ``spec`` order so the
    rendered attribute order is deterministic regardless of what the model emitted.
    """
    warnings = []
    clean = {}
    for key, value in (props or {}).items():
        if key not in spec:
            warnings.append(f"پراپِ ناشناخته‌ی «{key}» در «{label}» نادیده گرفته شد.")
            continue
        text = " ".join(str(value).split())
        kind = spec[key]
        if kind == "color" and text not in COLOR_ENUM:
            warnings.append(f"رنگِ نامعتبرِ «{text}» در «{label}» نادیده گرفته شد.")
            continue
        if kind == "icon" and not ICON_RE.match(text):
            warnings.append(f"آیکنِ نامعتبرِ «{text}» در «{label}» نادیده گرفته شد.")
            continue
        if kind == "step-level" and text not in _STEP_LEVEL_ENUM:
            warnings.append(f"levelِ نامعتبرِ «{text}» در «{label}» نادیده گرفته شد.")
            continue
        if kind == "bool":
            if text.lower() in _TRUTHY:
                clean[key] = True
            continue
        if text:
            clean[key] = text
    return {key: clean[key] for key in spec if key in clean}, warnings


def _render_props(spec: dict, props: dict) -> str:
    """Serialize validated props to an MDC ``{...}`` attribute string (or empty)."""
    parts = []
    for key, value in props.items():
        if spec.get(key) == "bool":
            parts.append(key)
        else:
            # Props are single-line attribute values; a stray quote would break the tag.
            parts.append(f'{key}="{str(value).replace(chr(34), chr(39))}"')
    return "{" + " ".join(parts) + "}" if parts else ""


def _wrap(depth: int, name: str, spec: dict, props: dict, lines) -> str:
    """Build one MDC block at ``depth`` colons around ``lines`` (verbatim)."""
    colons = ":" * depth
    body = "\n".join(lines).strip("\n")
    # Blank lines around the body keep fenced code and lists parsing correctly
    # inside the container, and are harmless for plain paragraphs.
    return f"{colons}{name}{_render_props(spec, props)}\n\n{body}\n\n{colons}"


def render_block(component: Component, lines, props: dict, items=()) -> str:
    """Render ``component`` around verbatim article ``lines``.

    ``items`` is only used for ``kind="group"``: a sequence of ``(sub_lines, sub_props)``
    pairs, each becoming one ``item_component`` child. Children render one nesting level
    deeper than their parent — MDC/remark-mdc's convention is fewer colons on the
    outside, more colons on the inside (``::hero`` wrapping ``:::card``) — so the colon
    depths can never disagree.
    """
    if component.kind == "group":
        children = [
            _wrap(3, component.item_component, component.item_props, sub_props, sub_lines)
            for sub_lines, sub_props in items
        ]
        return _wrap(2, component.name, component.props, props, "\n\n".join(children).split("\n"))
    return _wrap(2, component.name, component.props, props, lines)


def _prop_hint(key: str, kind: str) -> str:
    """Describe one prop's allowed values, not just its name — so the model doesn't guess."""
    if kind == "color":
        return f"{key} (یکی از: {'|'.join(sorted(COLOR_ENUM))})"
    if kind == "icon":
        return f"{key} (فرمتِ i-lucide-xxx، مثلِ i-lucide-info)"
    return key


def component_menu() -> str:
    """Compact menu of plannable components: name, category, when, and prop hints.

    ``hidden_props`` are validated/rendered but never listed here — they are values
    the planner should never be asked for (e.g. ``steps.level``, computed elsewhere).
    """
    lines = []
    for c in COMPONENTS.values():
        if not c.plannable:
            continue
        entry = f"- `{c.name}` ({c.category}): {c.when}"
        visible_props = {k: v for k, v in c.props.items() if k not in c.hidden_props}
        if visible_props:
            hints = ", ".join(_prop_hint(k, v) for k, v in visible_props.items())
            entry += f" — پراپ‌ها: {hints}"
        if c.kind == "group":
            item_hints = ", ".join(_prop_hint(k, v) for k, v in c.item_props.items())
            entry += (
                f" — گروهی: بازه به زیرآیتم‌های `{c.item_component}` تقسیم می‌شود"
                f" (پراپ‌های هر زیرآیتم: {item_hints})"
            )
        lines.append(entry)
    return "\n".join(lines)
