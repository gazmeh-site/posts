"""Scan the post tree and validate proposed article paths."""
import json
import os
import re
from dataclasses import dataclass


IDENTIFIER_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


@dataclass(frozen=True)
class PostCatalog:
    topics: dict[str, frozenset[str]]
    tags: frozenset[str]

    def as_prompt_data(self) -> dict:
        return {
            "topics": {topic: sorted(slugs) for topic, slugs in sorted(self.topics.items())},
            "existing_tags": sorted(self.tags),
        }


def scan_post_catalog(posts_dir: str, locale: str = "fa") -> PostCatalog:
    """Read topic/slug collisions and tags from valid article configs."""
    locale_dir = os.path.join(posts_dir, locale)
    topics: dict[str, frozenset[str]] = {}
    tags: set[str] = set()
    if not os.path.isdir(locale_dir):
        return PostCatalog(topics={}, tags=frozenset())

    for topic in sorted(os.listdir(locale_dir)):
        topic_dir = os.path.join(locale_dir, topic)
        if not os.path.isdir(topic_dir) or topic.startswith("."):
            continue
        slugs = set()
        for slug in sorted(os.listdir(topic_dir)):
            article_dir = os.path.join(topic_dir, slug)
            if not os.path.isdir(article_dir) or slug.startswith("."):
                continue
            slugs.add(slug)
            config_path = os.path.join(article_dir, "config.json")
            if not os.path.isfile(config_path):
                continue
            try:
                with open(config_path, encoding="utf-8") as config_file:
                    config = json.load(config_file)
            except (OSError, json.JSONDecodeError):
                continue
            for tag in config.get("tags", []):
                if isinstance(tag, str) and tag.strip():
                    tags.add(tag.strip())
        topics[topic] = frozenset(slugs)
    return PostCatalog(topics=topics, tags=frozenset(tags))


def validate_identifier(value: str, field_name: str) -> str:
    value = (value or "").strip().lower()
    if not IDENTIFIER_RE.fullmatch(value):
        raise ValueError(f"{field_name} باید kebab-case انگلیسی باشد: {value!r}")
    return value


def resolve_article_folder(posts_dir: str, topic: str, slug: str) -> str:
    """Build a safe article path that cannot escape ``posts/fa``."""
    topic = validate_identifier(topic, "topic")
    slug = validate_identifier(slug, "slug")
    base = os.path.realpath(os.path.join(posts_dir, "fa"))
    folder = os.path.realpath(os.path.join(base, topic, slug))
    if os.path.commonpath((base, folder)) != base:
        raise ValueError("مسیر مقاله خارج از posts/fa قرار می‌گیرد.")
    return folder


def available_slug_suggestions(catalog: PostCatalog, topic: str, slug: str, count: int = 3) -> list[str]:
    existing = catalog.topics.get(topic, frozenset())
    suggestions = []
    suffix = 2
    while len(suggestions) < count:
        candidate = f"{slug}-{suffix}"
        if candidate not in existing:
            suggestions.append(candidate)
        suffix += 1
    return suggestions


def placement_details(catalog: PostCatalog, topic: str, slug: str, tags: list[str]) -> dict:
    existing_slugs = catalog.topics.get(topic, frozenset())
    path_exists = slug in existing_slugs
    return {
        "topic_is_new": topic not in catalog.topics,
        "path_exists": path_exists,
        "new_tags": [tag for tag in tags if tag not in catalog.tags],
        "slug_alternatives": available_slug_suggestions(catalog, topic, slug) if path_exists else [],
    }
