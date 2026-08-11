import os
import tempfile
import unittest
from unittest.mock import patch

from mirza import controller
from mirza.controller import ArticleSession, Jump, next_command
from mirza.graph import ArticleDraft, ArticleMetadata
from mirza.graph import nodes


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
        def fake_invoke(_temperature, schema, _messages, retries=1, config=None):
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
            # draft runs once (one-shot, no separate review node) → text approval.
            self.assertEqual(session.current_node(), "metadata")
            self.assertEqual(session.values()["draft"], "متن تبدیل‌شده")
            self.assertEqual(session.values()["review_notes"], "- نیم‌فاصله‌ها اصلاح شد")
            # Compact signals are stored for the metadata phase.
            self.assertEqual(session.values()["title_hint"], "عنوان پیشنهادی")
            self.assertEqual(session.values()["keywords"], ["بنچمارک", "SPEC"])
            # desc is preserved from the draft (not re-derived in metadata).
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

        def fake_invoke(_temperature, schema, messages, retries=1, config=None):
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
        def fake_invoke(_temperature, schema, _messages, retries=1, config=None):
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
            self.assertEqual(session.current_node(), "metadata")  # Text approval checkpoint.

            # A manual edit updates the draft in place without re-running any node.
            session.update({"draft": "ویرایش دستی"})

            # Still at text approval; the edited draft is kept as-is.
            self.assertEqual(session.current_node(), "metadata")
            self.assertEqual(session.values()["draft"], "ویرایش دستی")


if __name__ == "__main__":
    unittest.main()
