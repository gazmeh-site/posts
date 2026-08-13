"""Mirza's article-authoring domain: pure logic with no infrastructure dependencies.

``enrichment`` (MDC block rendering), ``catalog`` (posts-repo scanning + identifier
validation), ``components`` (the MDC vocabulary), and ``profiles`` (the writer profile) live
here. These modules take paths/data as parameters and do not import ``llm`` / ``infra`` / ``ui``.
"""
