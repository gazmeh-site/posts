import json
import os
import tempfile
import unittest

from mirza.catalog import (
    placement_details,
    resolve_article_folder,
    scan_post_catalog,
    validate_identifier,
)


class CatalogTests(unittest.TestCase):
    def test_scans_only_topic_slug_articles(self):
        with tempfile.TemporaryDirectory() as posts_dir:
            article = os.path.join(posts_dir, "fa", "benchmark", "spec-cpu")
            os.makedirs(article)
            with open(os.path.join(article, "config.json"), "w", encoding="utf-8") as config_file:
                json.dump({"tags": ["بنچمارک", "CPU"]}, config_file, ensure_ascii=False)

            catalog = scan_post_catalog(posts_dir)

            self.assertEqual(catalog.topics["benchmark"], frozenset({"spec-cpu"}))
            self.assertEqual(catalog.tags, frozenset({"بنچمارک", "CPU"}))

    def test_reports_collision_and_alternatives(self):
        with tempfile.TemporaryDirectory() as posts_dir:
            article = os.path.join(posts_dir, "fa", "benchmark", "spec-cpu")
            os.makedirs(article)
            with open(os.path.join(article, "config.json"), "w", encoding="utf-8") as config_file:
                json.dump({"tags": ["بنچمارک"]}, config_file, ensure_ascii=False)
            catalog = scan_post_catalog(posts_dir)

            details = placement_details(catalog, "benchmark", "spec-cpu", ["بنچمارک", "پردازنده"])

            self.assertTrue(details["path_exists"])
            self.assertFalse(details["topic_is_new"])
            self.assertEqual(details["new_tags"], ["پردازنده"])
            self.assertEqual(details["slug_alternatives"][0], "spec-cpu-2")

    def test_folder_without_config_still_counts_as_collision(self):
        with tempfile.TemporaryDirectory() as posts_dir:
            os.makedirs(os.path.join(posts_dir, "fa", "drafts", "partial-post"))
            catalog = scan_post_catalog(posts_dir)

            details = placement_details(catalog, "drafts", "partial-post", [])

            self.assertTrue(details["path_exists"])

    def test_rejects_unsafe_or_non_kebab_identifiers(self):
        for value in ("../escape", "Bad_Slug", "اسلاگ", "two words", ""):
            with self.subTest(value=value), self.assertRaises(ValueError):
                validate_identifier(value, "slug")

    def test_resolves_inside_fa(self):
        with tempfile.TemporaryDirectory() as posts_dir:
            expected = os.path.realpath(os.path.join(posts_dir, "fa", "benchmark", "spec-cpu"))
            self.assertEqual(resolve_article_folder(posts_dir, "benchmark", "spec-cpu"), expected)


if __name__ == "__main__":
    unittest.main()
