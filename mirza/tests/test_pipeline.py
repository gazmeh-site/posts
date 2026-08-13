import os
import tempfile
import unittest
from unittest.mock import patch

from mirza import controller
from mirza.controller import ArticleSession, Jump, Rewind, next_command
from mirza.graph import (
    ArticleDraft,
    ArticleMetadata,
    EnrichmentItem,
    EnrichmentPlan,
)
from mirza.graph import nodes

# enrich_plan always runs after draft (a second invoke_structured call); tests that
# don't care about enrichment answer with an empty plan so no blocks get spliced in.
_EMPTY_PLAN = EnrichmentPlan(items=[])


class PipelineTests(unittest.TestCase):
    def test_build_never_overwrites_existing_article(self):
        state = {
            "title": "عنوان",
            "desc": "خلاصه",
            "tags": ["تست"],
            "writer": "amiri",
            "topic": "testing",
            "slug": "safe-write",
            "draft": "متن",
        }
        with tempfile.TemporaryDirectory() as posts_dir, patch.object(nodes, "POSTS_DIR", posts_dir):
            result = nodes.build(state)
            self.assertTrue(os.path.isfile(os.path.join(result["folder_path"], "content.md")))
            with self.assertRaises(FileExistsError):
                nodes.build(state)

    def test_mdfy_stops_for_text_then_metadata_confirmation(self):
        def fake_invoke(_stage, schema, _messages, retries=1, config=None):
            if schema is ArticleDraft:
                # One-shot writer-editor produces body, desc, notes, and compact signals.
                return ArticleDraft(
                    body="متن تبدیل‌شده",
                    desc="خلاصه‌ی اولیه",
                    notes=["نیم‌فاصله‌ها اصلاح شد"],
                    title_hint="عنوان پیشنهادی",
                    keywords=["بنچمارک", "SPEC"],
                )
            if schema is ArticleMetadata:
                return ArticleMetadata(
                    title="عنوان استخراج‌شده",
                    tags=["تست نرم‌افزار"],
                    topic="automation",
                    slug="metadata-flow",
                )
            if schema is EnrichmentPlan:
                return _EMPTY_PLAN
            raise AssertionError(f"schema ناشناخته: {schema}")

        with tempfile.TemporaryDirectory() as posts_dir, patch.object(
            nodes, "POSTS_DIR", posts_dir
        ), patch.object(nodes, "invoke_structured", side_effect=fake_invoke):
            session = ArticleSession("test-mdfy-flow")
            session.start()
            self.assertEqual(session.current_node(), "draft")

            session.resume(next_command({
                "action": "source",
                "source_text": "متن خام",
                "writer": "amiri",
                "tone": "آموزشی",
            }))
            # draft runs once (one-shot, no separate review node) → plain-draft approval.
            self.assertEqual(session.current_node(), "enrich_plan")
            self.assertEqual(session.values()["draft_plain"], "متن تبدیل‌شده")
            self.assertEqual(session.values()["review_notes"], "- نیم‌فاصله‌ها اصلاح شد")
            # Compact signals are stored for the metadata phase.
            self.assertEqual(session.values()["title_hint"], "عنوان پیشنهادی")
            self.assertEqual(session.values()["keywords"], ["بنچمارک", "SPEC"])
            # desc is preserved from the draft (not re-derived in metadata).
            self.assertEqual(session.values()["desc"], "خلاصه‌ی اولیه")

            session.resume(None)  # runs enrich_plan + enrich_apply → final text approval.
            self.assertEqual(session.current_node(), "metadata")
            self.assertEqual(session.values()["desc"], "خلاصه‌ی اولیه")

            session.resume(None)
            self.assertEqual(session.current_node(), "build")
            self.assertEqual(session.values()["title"], "عنوان استخراج‌شده")
            self.assertEqual(session.values()["slug"], "metadata-flow")
            # desc is still the draft's desc after metadata extraction.
            self.assertEqual(session.values()["desc"], "خلاصه‌ی اولیه")

            with patch.object(controller, "POSTS_DIR", posts_dir):
                edit = next_command({
                    "action": "metadata",
                    "title": "عنوان ویرایش‌شده",
                    "tags": ["تست نرم‌افزار"],
                    "topic": "automation",
                    "slug": "edited-metadata-flow",
                })
            self.assertIsInstance(edit, Jump)
            session.jump_to_before(edit.target_node, edit.values_patch)
            self.assertEqual(session.current_node(), "build")
            self.assertEqual(session.values()["slug"], "edited-metadata-flow")

    def test_extract_metadata_uses_compact_signals_not_full_body(self):
        """extract_metadata must not pass the full draft; only title_hint/keywords/desc."""
        captured = {}

        def fake_invoke(_stage, schema, messages, retries=1, config=None):
            if schema is ArticleMetadata:
                captured["user_message"] = messages[-1].content
                return ArticleMetadata(
                    title="عنوان", tags=["تست"], topic="automation", slug="x",
                )
            raise AssertionError(f"unexpected schema: {schema}")

        with tempfile.TemporaryDirectory() as posts_dir, patch.object(
            nodes, "POSTS_DIR", posts_dir
        ), patch.object(nodes, "invoke_structured", side_effect=fake_invoke):
            nodes.extract_metadata({
                "draft": "X" * 20000,  # A large body that must NOT be sent to the model.
                "title_hint": "عنوان پیشنهادی",
                "keywords": ["بنچمارک", "SPEC"],
                "desc": "خلاصه‌ی کوتاه",
            }, config={})
        sent = captured["user_message"]
        self.assertNotIn("X" * 100, sent)  # The large body was not forwarded.
        self.assertIn("عنوان پیشنهادی", sent)
        self.assertIn("بنچمارک", sent)
        self.assertIn("خلاصه‌ی کوتاه", sent)

    def test_manual_edit_keeps_edited_text_at_approval(self):
        """A manual edit updates the draft in place and stays at text approval (no extra node)."""
        def fake_invoke(_stage, schema, _messages, retries=1, config=None):
            if schema is ArticleDraft:
                return ArticleDraft(
                    body="متن تبدیل‌شده",
                    desc="خلاصه‌ی اولیه",
                    notes=["بازبینی شد"],
                    title_hint="عنوان",
                    keywords=["کلید"],
                )
            if schema is ArticleMetadata:
                return ArticleMetadata(
                    title="عنوان", tags=["تست"], topic="automation", slug="edit-flow",
                )
            if schema is EnrichmentPlan:
                return _EMPTY_PLAN
            raise AssertionError(f"schema ناشناخته: {schema}")

        with tempfile.TemporaryDirectory() as posts_dir, patch.object(
            nodes, "POSTS_DIR", posts_dir
        ), patch.object(nodes, "invoke_structured", side_effect=fake_invoke):
            session = ArticleSession("test-manual-edit")
            session.start()
            session.resume(next_command({
                "action": "source",
                "source_text": "متن خام",
                "writer": "amiri",
                "tone": "آموزشی",
            }))
            self.assertEqual(session.current_node(), "enrich_plan")  # Plain-draft approval checkpoint.

            # A manual edit updates the plain draft in place without re-running any node.
            session.update({"draft_plain": "ویرایش دستی"})

            # Still at plain-draft approval; the edited text is kept as-is.
            self.assertEqual(session.current_node(), "enrich_plan")
            self.assertEqual(session.values()["draft_plain"], "ویرایش دستی")

    def test_enrich_feedback_reuses_draft_plain_and_skips_conversion(self):
        """revise_enrich must not re-run text conversion or duplicate enrichment blocks."""
        calls = {"draft_schema_count": 0}

        def fake_invoke(_stage, schema, _messages, retries=1, config=None):
            if schema is ArticleDraft:
                calls["draft_schema_count"] += 1
                return ArticleDraft(
                    body="متن پایه",
                    desc="خلاصه",
                    notes=[],
                    title_hint="عنوان",
                    keywords=["کلید"],
                )
            if schema is EnrichmentPlan:
                return EnrichmentPlan(items=[
                    EnrichmentItem(
                        component="note",
                        start_line=1,
                        end_line=1,
                        starts_with="متن پایه",
                        reason="تست",
                        confidence="high",
                    )
                ])
            raise AssertionError(f"schema ناشناخته: {schema}")

        with tempfile.TemporaryDirectory() as posts_dir, patch.object(
            nodes, "POSTS_DIR", posts_dir
        ), patch.object(nodes, "invoke_structured", side_effect=fake_invoke):
            session = ArticleSession("test-enrich-revision")
            session.start()
            session.resume(next_command({
                "action": "source",
                "source_text": "متن خام",
                "writer": "amiri",
                "tone": "آموزشی",
            }))
            self.assertEqual(session.current_node(), "enrich_plan")
            self.assertEqual(session.values()["draft_plain"], "متن پایه")
            self.assertEqual(calls["draft_schema_count"], 1)

            session.resume(None)  # runs enrich_plan + enrich_apply → final text approval.
            self.assertEqual(session.current_node(), "metadata")
            self.assertIn("::note", session.values()["draft"])

            cmd = next_command({"action": "revise_enrich", "feedback": "کارت‌ها را حذف کن"})
            self.assertIsInstance(cmd, Rewind)
            session.rewind_to_before(cmd.target_node, cmd.values_patch, cmd.carry_forward)

            # Conversion did not re-run; draft_plain unchanged and blocks were not stacked.
            self.assertEqual(calls["draft_schema_count"], 1)
            self.assertEqual(session.values()["draft_plain"], "متن پایه")
            self.assertEqual(session.values()["draft"].count("::note"), 1)

    def test_enrichment_costs_exactly_two_llm_calls(self):
        """Rendering is pure Python, so a full article needs only draft + plan."""
        schemas = []

        def fake_invoke(_stage, schema, _messages, retries=1, config=None):
            schemas.append(schema)
            if schema is ArticleDraft:
                return ArticleDraft(
                    body="جمله‌ی نکته.\n\nپاراگرافِ دوم.",
                    desc="خلاصه",
                    notes=[],
                    title_hint="عنوان",
                    keywords=["کلید"],
                )
            if schema is EnrichmentPlan:
                return EnrichmentPlan(items=[
                    EnrichmentItem(
                        component="note",
                        start_line=1,
                        end_line=1,
                        starts_with="جمله‌ی نکته.",
                        reason="تست",
                        confidence="high",
                    )
                ])
            raise AssertionError(f"schema ناشناخته: {schema}")

        with tempfile.TemporaryDirectory() as posts_dir, patch.object(
            nodes, "POSTS_DIR", posts_dir
        ), patch.object(nodes, "invoke_structured", side_effect=fake_invoke):
            session = ArticleSession("test-two-llm-calls")
            session.start()
            session.resume(next_command({
                "action": "source",
                "source_text": "متن خام",
                "writer": "amiri",
                "tone": "آموزشی",
            }))
            self.assertEqual(session.current_node(), "enrich_plan")

            session.resume(None)  # runs enrich_plan + enrich_apply → final text approval.
            self.assertEqual(session.current_node(), "metadata")
            # The block was spliced in without a render call of any kind.
            self.assertIn("::note", session.values()["draft"])
            # The untouched paragraph is byte-identical to the plain draft.
            self.assertIn("پاراگرافِ دوم.", session.values()["draft"])

        self.assertEqual(schemas, [ArticleDraft, EnrichmentPlan])

    def test_revise_text_prompt_includes_previous_draft(self):
        """Regression: without carry_forward the forked checkpoint predates draft_plain,
        leaving "متن فعلی" empty so the model writes a brand-new article."""
        prompts = []

        def fake_invoke(_stage, schema, messages, retries=1, config=None):
            if schema is ArticleDraft:
                prompts.append(messages[-1].content)
                return ArticleDraft(
                    body="متنِ اولیه‌ی مقاله.",
                    desc="خلاصه",
                    notes=[],
                    title_hint="عنوان",
                    keywords=["کلید"],
                )
            if schema is EnrichmentPlan:
                return _EMPTY_PLAN
            raise AssertionError(f"schema ناشناخته: {schema}")

        with tempfile.TemporaryDirectory() as posts_dir, patch.object(
            nodes, "POSTS_DIR", posts_dir
        ), patch.object(nodes, "invoke_structured", side_effect=fake_invoke):
            session = ArticleSession("test-revise-text-carry")
            session.start()
            session.resume(next_command({
                "action": "source",
                "source_text": "متن خام",
                "writer": "amiri",
                "tone": "آموزشی",
            }))

            cmd = next_command({"action": "revise_text", "feedback": "کوتاه‌ترش کن"})
            self.assertIsInstance(cmd, Rewind)
            session.rewind_to_before(cmd.target_node, cmd.values_patch, cmd.carry_forward)

        self.assertEqual(len(prompts), 2)
        self.assertIn("متنِ اولیه‌ی مقاله.", prompts[1])
        self.assertIn("کوتاه‌ترش کن", prompts[1])


if __name__ == "__main__":
    unittest.main()
