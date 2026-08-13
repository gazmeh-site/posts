"""Deterministic line-range validation, rendering, and splicing for MDC enrichment.

No LLM calls here. The plan node picks a component and a line range; this module
verifies the range really is where the model thinks it is, renders the block from
the article's own lines (via ``components.render_block``), and splices it in.

The model never produces article text, so the body cannot drift and the MDC cannot
be malformed. What it *can* get wrong is arithmetic — models miscount lines — so
every item carries a ``starts_with`` checksum that is matched against the real line
under Persian normalization (ZWNJ, Arabic yeh/kaf, digits) plus Markdown-markup
stripping (see ``checksum_key``). A mismatch skips that block with a readable warning
instead of corrupting the text.
"""

import re

from .components import COLOR_ENUM, COMPONENTS, ICON_RE, render_block, validate_props

_ZWNJ = "‌"
_ARABIC_YEH = "ي"
_PERSIAN_YEH = "ی"
_ARABIC_KAF = "ك"
_PERSIAN_KAF = "ک"
_DIGIT_MAP = {
    **{d: str(i) for i, d in enumerate("۰۱۲۳۴۵۶۷۸۹")},  # Persian digits.
    **{d: str(i) for i, d in enumerate("٠١٢٣٤٥٦٧٨٩")},  # Arabic-Indic digits.
}


def _normalize_char(ch: str):
    """Map ``ch`` to its canonical form, or ``None`` to drop it entirely."""
    if ch == _ZWNJ:
        return None
    if ch in " \t\r\n":
        return " "
    if ch == _ARABIC_YEH:
        return _PERSIAN_YEH
    if ch == _ARABIC_KAF:
        return _PERSIAN_KAF
    return _DIGIT_MAP.get(ch, ch)


def normalize(text: str) -> str:
    """Canonicalize ``text`` for comparison: drop ZWNJ, unify letters/digits, collapse spaces.

    Anchors and checksums come back from the model retyped rather than copied, so
    ``می‌شود`` may arrive as ``ميشود``. Normalizing both sides makes the comparison
    survive that without loosening it into a fuzzy match.
    """
    out = []
    for ch in text:
        mapped = _normalize_char(ch)
        if mapped is None:
            continue
        if mapped == " " and (not out or out[-1] == " "):
            continue
        out.append(mapped)
    return "".join(out).strip()


_LIST_PREFIX_RE = re.compile(r"^\s*(?:[-*+•]|\d+[.)])\s+")
# Emphasis, code, heading and quote markers, plus whitespace: all invisible when read.
_MARKUP_CHARS = str.maketrans("", "", "*_`~#> \t")
# A leading `**bold title:**`-style run the model may have pulled into a `title`/`label`
# prop, then quoted `starts_with` from the remainder of the line — see _check_checksum.
_BOLD_PREFIX_RE = re.compile(r"^\*\*[^*]+\*\*\s*")


def checksum_key(text: str) -> str:
    """Reduce ``text`` to what a reader would say the line *says*, for checksum matching.

    ``starts_with`` is the model quoting a line back from the numbered draft, and it
    quotes what it reads, not what it parses: a line like ``1. **نصب و بارگذاری:** …``
    comes back as ``نصب و بارگذاری: …``. That is the right answer to "what does line 74
    start with" and a wrong answer to ``str.startswith`` — so the checksum compares the
    prose, dropping the leading list marker and the inline markup characters around it.

    This does not weaken the guard against the failure it exists for. Miscounted line
    numbers land on *different prose*, which still fails to match; only the formatting
    the model was never asked to reproduce is ignored.
    """
    return normalize(_LIST_PREFIX_RE.sub("", text)).translate(_MARKUP_CHARS)


def _safe_excerpt(text: str, limit: int = 40) -> str:
    """Return a Markdown-safe preview of ``text`` for warning messages.

    Article text often contains backticks (writers quote terms in inline code); a
    naive ``text[:limit]`` can slice a pair in half and leave an unmatched backtick,
    which then swallows the rest of the Markdown-rendered warnings list into a stray
    code span. The excerpt is only a preview, so drop backticks entirely.
    """
    text = text.replace("`", "'")
    excerpt = text[:limit].strip()
    return excerpt + "…" if len(text) > limit else excerpt


_FENCE_RE = re.compile(r"^\s*```")
_HEADING_RE = re.compile(r"^(#{2,4})\s+\S")
_DEFAULT_STEPS_LEVEL = "3"


def _detect_steps_level(lines: list) -> str:
    """Infer the ``steps`` ``level`` prop from the first heading inside the range.

    ``level`` picks which heading depth the component treats as a step boundary; the
    article itself already says this (whatever ``##``/``###``/``####`` its headings use),
    so it is computed here instead of asked of the model — an arithmetic detail the
    model has no reason to get right when the text already answers it.
    """
    for line in lines:
        m = _HEADING_RE.match(line)
        if m:
            return str(len(m.group(1)))
    return _DEFAULT_STEPS_LEVEL


def _fence_open_before(lines: list, index: int) -> bool:
    """Return whether a code fence is still open just before ``lines[index]``."""
    return sum(1 for line in lines[:index] if _FENCE_RE.match(line)) % 2 != 0


def _splits_code_fence(lines: list, start: int, end: int) -> bool:
    """Return whether the 0-based ``[start, end]`` range cuts a fenced code block.

    Either boundary landing inside a fence would leave an orphaned ``` on one side
    of the splice, so both ends must sit outside one.
    """
    if _fence_open_before(lines, start):
        return True
    fences_inside = sum(1 for line in lines[start:end + 1] if _FENCE_RE.match(line))
    return fences_inside % 2 != 0


def _check_range(lines: list, start: int, end: int, label: str, bounds=None):
    """Validate a 1-based inclusive range; return a warning string or ``None``."""
    limit_lo, limit_hi = bounds or (1, len(lines))
    if start < limit_lo or end > limit_hi or start > end:
        return (
            f"⏭️ بلوکِ «{label}» اضافه نشد: بازه‌ی خطِ نامعتبر "
            f"({start}–{end}؛ محدوده‌ی مجاز: {limit_lo}–{limit_hi})."
        )
    return None


def _check_checksum(lines: list, start: int, starts_with: str, label: str):
    """Verify ``starts_with`` really is the opening of line ``start``; warn if not.

    The model sometimes pulls a leading ``**bold title:**`` into a ``title``/``label``
    prop and then quotes ``starts_with`` from the remainder of the line — a correct
    reading of the line that fails a plain ``startswith`` check. Before rejecting, also
    try matching against the line with that leading bold run stripped entirely.
    """
    expected = checksum_key(starts_with or "")
    if not expected:
        return f"⏭️ بلوکِ «{label}» اضافه نشد: فیلدِ starts_with خالی بود."
    line = lines[start - 1]
    if checksum_key(line).startswith(expected):
        return None
    after_bold = _BOLD_PREFIX_RE.sub("", line, count=1)
    if after_bold != line and checksum_key(after_bold).startswith(expected):
        return None
    return (
        f"⏭️ بلوکِ «{label}» اضافه نشد: خطِ {start} با متنِ اعلام‌شده نمی‌خواند "
        f"(انتظار: «{_safe_excerpt(starts_with)}» / واقعی: «{_safe_excerpt(line)}»)."
    )


def _build_group_items(component, lines: list, item, warnings: list):
    """Resolve a group component's sub-ranges into ``(sub_lines, sub_props)`` pairs.

    Returns ``None`` if any sub-item is invalid — a half-rendered group would drop
    article text on the floor, so the whole block is skipped instead.
    """
    if not item.items:
        warnings.append(
            f"⏭️ بلوکِ «{component.name}» اضافه نشد: کامپوننتِ گروهی بدونِ زیرآیتم."
        )
        return None
    pairs = []
    for sub in item.items:
        label = f"{component.name} › {component.item_component}"
        problem = (
            _check_range(lines, sub.start_line, sub.end_line, label, (item.start_line, item.end_line))
            or _check_checksum(lines, sub.start_line, sub.starts_with, label)
        )
        if problem:
            warnings.append(problem)
            return None
        clean, prop_warnings = validate_props(component.item_props, sub.props, label)
        warnings.extend(prop_warnings)
        pairs.append((lines[sub.start_line - 1:sub.end_line], clean))
    return pairs


def apply_plan(base: str, items: list) -> tuple:
    """Render and splice the planned blocks into ``base``. Returns ``(text, warnings)``.

    ``items`` are ``EnrichmentItem`` objects. Every item is validated independently —
    an unusable one is skipped with a warning while the rest still apply, and the
    article text itself is never modified, only wrapped. Splicing runs in reverse
    document order so earlier line numbers stay valid as later ranges are replaced.
    """
    warnings = []
    lines = base.split("\n")
    resolved = []

    for item in items:
        component = COMPONENTS.get(item.component)
        if component is None:
            warnings.append(f"⏭️ کامپوننتِ ناشناخته‌ی «{item.component}» نادیده گرفته شد.")
            continue
        if not component.plannable:
            warnings.append(
                f"⏭️ کامپوننتِ «{component.name}» فقط دستی اضافه می‌شود و در نقشه نادیده گرفته شد."
            )
            continue

        problem = (
            _check_range(lines, item.start_line, item.end_line, component.name)
            or _check_checksum(lines, item.start_line, item.starts_with, component.name)
        )
        if problem:
            warnings.append(problem)
            continue
        if _splits_code_fence(lines, item.start_line - 1, item.end_line - 1):
            warnings.append(
                f"⏭️ بلوکِ «{component.name}» اضافه نشد: بازه‌ی {item.start_line}–{item.end_line} "
                "وسطِ یک بلاکِ کد را می‌بُرد."
            )
            continue

        clean, prop_warnings = validate_props(component.props, item.props, component.name)
        warnings.extend(prop_warnings)
        if component.name == "steps":
            clean["level"] = _detect_steps_level(lines[item.start_line - 1:item.end_line])

        sub_items = ()
        if component.kind == "group":
            sub_items = _build_group_items(component, lines, item, warnings)
            if sub_items is None:
                continue

        resolved.append((item.start_line, item.end_line, component, clean, sub_items))

    # Overlapping ranges would splice into text another block already claimed.
    resolved.sort(key=lambda entry: entry[0])
    kept = []
    last_end = 0
    for entry in resolved:
        start, end, component = entry[0], entry[1], entry[2]
        if start <= last_end:
            warnings.append(f"همپوشانیِ بازه‌ی خط: کامپوننتِ «{component.name}» رد شد.")
            continue
        kept.append(entry)
        last_end = end

    for start, end, component, props, sub_items in reversed(kept):
        block = render_block(component, lines[start - 1:end], props, sub_items)
        lines[start - 1:end] = block.split("\n")

    return "\n".join(lines), warnings


_OPEN_RE = re.compile(r"^(:{2,})([a-zA-Z][\w-]*)(\{[^}]*\})?\s*$")
_CLOSE_RE = re.compile(r"^(:{2,})\s*$")
_INLINE_RE = re.compile(r"(?<!:):([a-zA-Z][\w-]*)\{[^}]*\}")
_COLOR_ATTR_RE = re.compile(r'color="([^"]*)"')
_ICON_ATTR_RE = re.compile(r'icon="([^"]*)"')
_H1_RE = re.compile(r"^#\s+\S", re.M)

MAX_BLOCKS_PER_ARTICLE = 8
MIN_WORDS_PER_BLOCK = 100

# Item components are rendered as children of their group parent and are never
# planned on their own, so they are legal in the output but absent from COMPONENTS.
_ITEM_NAMES = frozenset(c.item_component for c in COMPONENTS.values() if c.item_component)


def validate_mdc(text: str) -> list:
    """Return a list of human-readable warnings about ``text``'s MDC usage.

    Since ``apply_plan`` now builds every block mechanically, the structural checks
    here (unknown component, unbalanced ``::``, wrong nesting depth) can no longer
    fail on generated output — they remain as a safety net over *hand-edited* drafts,
    which the Chainlit editor allows. The checks that still catch real model output
    are the ones about the article body itself: forbidden H1, unbalanced code fences,
    and the density caps.
    """
    warnings = []
    lines = text.split("\n")
    stack = []  # (depth, name, lineno)
    in_code_fence = False
    fence_count = 0
    open_counts: dict[str, int] = {}

    for lineno, line in enumerate(lines, start=1):
        if line.strip().startswith("```"):
            in_code_fence = not in_code_fence
            fence_count += 1
            continue
        if in_code_fence:
            continue

        m = _OPEN_RE.match(line)
        if m:
            depth, name = len(m.group(1)), m.group(2)
            stack.append((depth, name, lineno))
            open_counts[name] = open_counts.get(name, 0) + 1
            if name not in COMPONENTS and name not in _ITEM_NAMES:
                warnings.append(f"کامپوننتِ ناشناخته: `{name}` (خط {lineno})")
            continue

        m = _CLOSE_RE.match(line)
        if m:
            depth = len(m.group(1))
            if not stack:
                warnings.append(f"`::` بستنِ اضافی بدونِ بازکردنِ متناظر (خط {lineno})")
                continue
            open_depth, open_name, open_line = stack[-1]
            if open_depth != depth:
                warnings.append(
                    f"عمقِ نستینگِ نامتوازن: `{open_name}` (خط {open_line}) با "
                    f"{open_depth} کولون باز و با {depth} کولون بسته شد (خط {lineno})"
                )
            stack.pop()

    for _depth, name, lineno in stack:
        warnings.append(f"کامپوننتِ `{name}` (خط {lineno}) هرگز بسته نشد.")

    if fence_count % 2 != 0:
        warnings.append("بلاکِ کد (```) نامتوازن است.")

    for m in _INLINE_RE.finditer(text):
        name = m.group(1)
        if name not in COMPONENTS:
            warnings.append(f"کامپوننتِ درون‌خطیِ ناشناخته: `{name}`")

    for m in _COLOR_ATTR_RE.finditer(text):
        if m.group(1) not in COLOR_ENUM:
            warnings.append(f"رنگِ نامعتبر: `{m.group(1)}`")

    for m in _ICON_ATTR_RE.finditer(text):
        if not ICON_RE.match(m.group(1)):
            warnings.append(f"فرمتِ آیکنِ نامعتبر: `{m.group(1)}`")

    if _H1_RE.search(text):
        warnings.append("هدینگِ H1 (`#`) مجاز نیست؛ عنوان از config می‌آید.")

    for name, count in open_counts.items():
        component = COMPONENTS.get(name)
        if component and count > component.max_per_article:
            warnings.append(
                f"کامپوننتِ `{name}` {count} بار استفاده شده (سقف: {component.max_per_article})."
            )

    # Children of a group are one visual block with their parent, not extra blocks.
    total_blocks = sum(count for name, count in open_counts.items() if name not in _ITEM_NAMES)
    if total_blocks > MAX_BLOCKS_PER_ARTICLE:
        warnings.append(f"تعداد بلوک‌ها ({total_blocks}) از سقفِ {MAX_BLOCKS_PER_ARTICLE} عبور کرده.")

    plain = re.sub(r"```.*?```", "", text, flags=re.S)
    word_count = len(re.findall(r"\S+", plain))
    if total_blocks and word_count and (word_count / total_blocks) < MIN_WORDS_PER_BLOCK:
        warnings.append(
            f"تراکمِ بلوک‌ها بالاست: به‌طور میانگین هر ~{word_count // total_blocks} کلمه یک بلوک "
            f"(حداقلِ توصیه‌شده: {MIN_WORDS_PER_BLOCK})."
        )

    return warnings
