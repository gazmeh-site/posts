import unittest

from mirza.enrichment import apply_plan, validate_mdc
from mirza.graph import EnrichmentItem, EnrichmentSubItem


def _item(component, start, end, starts_with, **kwargs):
    """Build an EnrichmentItem with the boilerplate fields filled in."""
    return EnrichmentItem(
        component=component,
        start_line=start,
        end_line=end,
        starts_with=starts_with,
        reason="تست",
        confidence="high",
        **kwargs,
    )


class RangeValidationTests(unittest.TestCase):
    def test_checksum_mismatch_skips_block_and_leaves_text_intact(self):
        """A miscounted line number is the expected model failure — it must not corrupt text."""
        base = "پاراگرافِ اول.\n\nپاراگرافِ دوم."
        items = [_item("note", 3, 3, "پاراگرافِ اول")]  # Line 3 is actually the second paragraph.
        enriched, warnings = apply_plan(base, items)
        self.assertEqual(enriched, base)
        self.assertEqual(len(warnings), 1)
        self.assertIn("note", warnings[0])

    def test_checksum_survives_zwnj_and_arabic_yeh(self):
        """The model retypes rather than copies, so ZWNJ/yeh differences must still match."""
        base = "این متن به مارک‌داون تبدیل می‌شود.\n\nخطِ دوم."
        items = [_item("note", 1, 1, "این متن به مارکداون تبدیل ميشود")]
        enriched, warnings = apply_plan(base, items)
        self.assertEqual(warnings, [])
        self.assertIn("::note", enriched)
        self.assertIn("این متن به مارک‌داون تبدیل می‌شود.", enriched)

    def test_out_of_bounds_range_is_rejected(self):
        base = "تنها خط."
        enriched, warnings = apply_plan(base, [_item("note", 1, 9, "تنها خط.")])
        self.assertEqual(enriched, base)
        self.assertIn("نامعتبر", warnings[0])

    def test_range_spanning_code_fence_is_rejected(self):
        """Half a fenced block would leave an orphaned ``` on either side of the splice."""
        base = "مقدمه.\n\n```bash\necho hi\n```\n\nپایان."
        # Lines 3-4 open the fence but stop before its closing line.
        enriched, warnings = apply_plan(base, [_item("note", 3, 4, "```bash")])
        self.assertEqual(enriched, base)
        self.assertIn("بلاکِ کد", warnings[0])

    def test_whole_code_fence_can_be_wrapped(self):
        base = "مقدمه.\n\n```bash\necho hi\n```\n\nپایان."
        enriched, warnings = apply_plan(base, [_item("code-collapse", 3, 5, "```bash")])
        self.assertEqual(warnings, [])
        self.assertIn("::code-collapse", enriched)
        self.assertIn("echo hi", enriched)

    def test_unknown_component_in_plan_is_skipped(self):
        base = "متن."
        enriched, warnings = apply_plan(base, [_item("crad", 1, 1, "متن.")])
        self.assertEqual(enriched, base)
        self.assertIn("ناشناخته", warnings[0])

    def test_manual_only_component_is_not_planned(self):
        """kbd needs a position inside a line, which a line range cannot express."""
        base = "متن."
        enriched, warnings = apply_plan(base, [_item("kbd", 1, 1, "متن.", props={"value": "K"})])
        self.assertEqual(enriched, base)
        self.assertIn("دستی", warnings[0])


class ApplyPlanTests(unittest.TestCase):
    def test_article_text_outside_blocks_is_byte_identical(self):
        """The whole point of deterministic rendering: the body never drifts."""
        base = "اول.\n\nدوم.\n\nسوم."
        enriched, warnings = apply_plan(base, [_item("note", 3, 3, "دوم.")])
        self.assertEqual(warnings, [])
        stripped = "\n".join(
            line for line in enriched.split("\n") if not line.startswith("::")
        )
        for sentence in ("اول.", "دوم.", "سوم."):
            self.assertIn(sentence, stripped)

    def test_multiple_blocks_keep_line_numbers_valid(self):
        base = "اول.\n\nدوم.\n\nسوم."
        items = [
            _item("note", 1, 1, "اول."),
            _item("tip", 5, 5, "سوم."),
        ]
        enriched, warnings = apply_plan(base, items)
        self.assertEqual(warnings, [])
        self.assertIn("::note", enriched)
        self.assertIn("::tip", enriched)
        # The untouched middle line still separates the two blocks.
        self.assertLess(enriched.index("::note"), enriched.index("دوم."))
        self.assertLess(enriched.index("دوم."), enriched.index("::tip"))

    def test_overlapping_ranges_drop_the_later_item(self):
        base = "اول.\nدوم.\nسوم."
        items = [
            _item("note", 1, 2, "اول."),
            _item("tip", 2, 3, "دوم."),
        ]
        enriched, warnings = apply_plan(base, items)
        self.assertIn("::note", enriched)
        self.assertNotIn("::tip", enriched)
        self.assertTrue(any("همپوشانی" in w for w in warnings))

    def test_invalid_prop_is_dropped_but_block_still_renders(self):
        """A mistyped icon is not a reason to lose the enrichment."""
        base = "متنِ نکته."
        items = [_item("callout", 1, 1, "متنِ نکته.", props={"color": "blue", "icon": "i-lucide-info"})]
        enriched, warnings = apply_plan(base, items)
        self.assertIn("::callout", enriched)
        self.assertIn('icon="i-lucide-info"', enriched)
        self.assertNotIn("blue", enriched)
        self.assertTrue(any("رنگِ نامعتبر" in w for w in warnings))

    def test_unknown_prop_name_is_dropped(self):
        base = "متن."
        enriched, warnings = apply_plan(base, [_item("note", 1, 1, "متن.", props={"label": "x"})])
        self.assertIn("::note", enriched)
        self.assertNotIn("label", enriched)
        self.assertTrue(any("پراپِ ناشناخته" in w for w in warnings))

    def test_group_component_renders_nested_items_in_order(self):
        # Long enough that the single block stays under the density cap, so the only
        # thing validate_mdc can complain about is the nesting itself.
        filler = " ".join(f"کلمه{i}" for i in range(120))
        base = f"گزینه‌ی یک. {filler}\nگزینه‌ی دو. {filler}"
        items = [
            _item(
                "tabs", 1, 2, "گزینه‌ی یک.",
                items=[
                    EnrichmentSubItem(start_line=1, end_line=1, starts_with="گزینه‌ی یک.", props={"label": "یک"}),
                    EnrichmentSubItem(start_line=2, end_line=2, starts_with="گزینه‌ی دو.", props={"label": "دو"}),
                ],
            )
        ]
        enriched, warnings = apply_plan(base, items)
        self.assertEqual(warnings, [])
        # The parent nests one level deeper than its children, so depths cannot disagree.
        self.assertIn(":::tabs", enriched)
        self.assertIn('::tabs-item{label="یک"}', enriched)
        self.assertIn('::tabs-item{label="دو"}', enriched)
        self.assertLess(enriched.index('label="یک"'), enriched.index('label="دو"'))
        # Machine-rendered output is structurally valid by construction.
        self.assertEqual(validate_mdc(enriched), [])

    def test_group_with_invalid_subitem_is_skipped_entirely(self):
        """A half-rendered group would drop article lines, so it is all-or-nothing."""
        base = "گزینه‌ی یک.\nگزینه‌ی دو."
        items = [
            _item(
                "tabs", 1, 2, "گزینه‌ی یک.",
                items=[
                    EnrichmentSubItem(start_line=1, end_line=1, starts_with="گزینه‌ی یک.", props={"label": "یک"}),
                    EnrichmentSubItem(start_line=2, end_line=2, starts_with="متنِ اشتباه", props={"label": "دو"}),
                ],
            )
        ]
        enriched, warnings = apply_plan(base, items)
        self.assertEqual(enriched, base)
        self.assertTrue(warnings)

    def test_warning_excerpt_strips_backticks(self):
        """An unmatched backtick would swallow the rest of the Markdown warnings list."""
        base = "مدیریت حافظه: فعال‌سازی قابلیت `Transparent Huge Pages` در کرنل و چیزهای دیگر."
        items = [_item("note", 1, 1, "عبارتی که در متن نیست")]
        _enriched, warnings = apply_plan(base, items)
        self.assertEqual(len(warnings), 1)
        self.assertNotIn("`", warnings[0])


class ValidateMdcTests(unittest.TestCase):
    """validate_mdc is now a safety net over hand-edited drafts, not a model-output check."""

    def test_valid_document_has_no_warnings(self):
        filler = " ".join(f"کلمه{i}" for i in range(120))
        text = f"## بخش\n\n::note\nمتنِ نکته.\n::\n\n{filler}"
        self.assertEqual(validate_mdc(text), [])

    def test_validator_catches_unbalanced_fence_and_bad_color(self):
        text = (
            "::callout{color=\"blue\"}\n"
            "متن\n"
            "::\n\n"
            "```bash\n"
            "echo hi\n"
        )
        warnings = validate_mdc(text)
        self.assertTrue(any("رنگِ نامعتبر" in w for w in warnings))
        self.assertTrue(any("نامتوازن" in w for w in warnings))

    def test_unknown_component_is_flagged(self):
        warnings = validate_mdc("::crad\nمتن\n::")
        self.assertTrue(any("ناشناخته" in w for w in warnings))

    def test_unclosed_component_is_flagged(self):
        warnings = validate_mdc("::note\nمتن بدون بسته شدن")
        self.assertTrue(any("هرگز بسته نشد" in w for w in warnings))

    def test_h1_is_forbidden(self):
        warnings = validate_mdc("# عنوان\n\nمتن.")
        self.assertTrue(any("H1" in w for w in warnings))

    def test_bad_icon_format_is_flagged(self):
        warnings = validate_mdc('::callout{icon="info"}\nمتن\n::')
        self.assertTrue(any("آیکن" in w for w in warnings))

    def test_density_cap_exceeded_is_flagged(self):
        blocks = "\n\n".join(f"::note\nمتنِ کوتاه {i}.\n::" for i in range(9))
        warnings = validate_mdc(blocks)
        self.assertTrue(any("سقفِ" in w for w in warnings))


if __name__ == "__main__":
    unittest.main()
