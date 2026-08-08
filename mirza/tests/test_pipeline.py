import os
import tempfile
import unittest
from unittest.mock import patch

from mirza import controller
from mirza.controller import ArticleSession, Jump, next_command
from mirza.graph import ArticleDraft, ArticleMetadata, Review
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
        def fake_invoke(_temperature, schema, _messages, retries=1):
            if schema is ArticleDraft:
                return ArticleDraft(body="متن تبدیل‌شده", desc="خلاصه‌ی اولیه")
            if schema is Review:
                return Review(notes="- خوب", improved_body="متن نهایی")
            if schema is ArticleMetadata:
                return ArticleMetadata(
                    title="عنوان استخراج‌شده",
                    desc="خلاصه‌ی نهایی",
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
            self.assertEqual(session.current_node(), "metadata")

            session.resume(None)
            self.assertEqual(session.current_node(), "build")
            self.assertEqual(session.values()["title"], "عنوان استخراج‌شده")
            self.assertEqual(session.values()["slug"], "metadata-flow")

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

    def test_manual_edit_reruns_reviewer(self):
        """A manual edit reruns review instead of skipping to metadata or build."""
        def fake_invoke(_temperature, schema, _messages, retries=1):
            if schema is ArticleDraft:
                return ArticleDraft(body="متن تبدیل‌شده", desc="خلاصه‌ی اولیه")
            if schema is Review:
                return Review(notes="- بازبینی شد", improved_body="متنِ بازبینی‌شده‌ی نهایی")
            if schema is ArticleMetadata:
                return ArticleMetadata(
                    title="عنوان", desc="خلاصه", tags=["تست"], topic="automation", slug="edit-flow",
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

            # A manual edit is equivalent to rewinding to review with a new draft.
            session.rewind_to_before("review", {"draft": "ویرایش دستی"})

            # The reviewer ran and the flow returned to text approval, not build.
            self.assertEqual(session.current_node(), "metadata")
            self.assertEqual(session.values()["draft"], "متنِ بازبینی‌شده‌ی نهایی")
            self.assertEqual(session.values()["review_notes"], "- بازبینی شد")


if __name__ == "__main__":
    unittest.main()
