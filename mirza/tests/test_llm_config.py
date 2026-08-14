"""Tests for per-stage LLM configuration (config.py) and prefill conditioning (llm.py)."""
import importlib
import os
import unittest
from unittest.mock import patch

from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel

from mirza import config, llm
from mirza.config import StageConfig


def _reload_config(env: dict):
    """Reload mirza.config against exactly ``env``, without touching the real mirza/.env.

    Patches ``dotenv.load_dotenv`` itself (not ``mirza.config.load_dotenv``): reload
    re-executes config.py's ``from dotenv import load_dotenv``, which would otherwise
    rebind the name and silently undo a patch on the module-level attribute.
    """
    with patch.dict(os.environ, env, clear=True), patch("dotenv.load_dotenv"):
        importlib.reload(config)
    return config


class _Schema(BaseModel):
    x: int


class _FakeChatModel:
    """Stands in for ChatLiteLLM: records the message list it was invoked with."""

    def __init__(self):
        self.captured = None
        self.streaming = False

    def invoke(self, messages, config=None):
        self.captured = list(messages)
        return AIMessage(content='{"x": 1}')


class StageConfigTests(unittest.TestCase):
    def tearDown(self):
        # Restore the module to what the rest of the suite (and the real .env) expects.
        importlib.reload(config)

    def test_falls_back_to_legacy_anthropic_vars_when_no_mirza_vars_set(self):
        cfg = _reload_config({
            "ANTHROPIC_MODEL": "claude-sonnet-5",
            "ANTHROPIC_API_KEY": "legacy-key",
            "ANTHROPIC_BASE_URL": "https://legacy.example/v1",
        })
        for name, stage in cfg.STAGES.items():
            self.assertEqual(stage.model, "anthropic/claude-sonnet-5", name)
            self.assertEqual(stage.api_key, "legacy-key", name)
            self.assertEqual(stage.api_base, "https://legacy.example/v1", name)

    def test_bare_model_name_gets_anthropic_prefix(self):
        cfg = _reload_config({"MIRZA_MODEL": "claude-opus-5", "MIRZA_API_KEY": "k"})
        self.assertEqual(cfg.STAGES["draft"].model, "anthropic/claude-opus-5")

    def test_provider_prefixed_model_name_is_untouched(self):
        cfg = _reload_config({"MIRZA_MODEL": "gemini/gemini-2.5-flash", "MIRZA_API_KEY": "k"})
        self.assertEqual(cfg.STAGES["draft"].model, "gemini/gemini-2.5-flash")

    def test_per_stage_override_wins_over_shared_default(self):
        cfg = _reload_config({
            "MIRZA_MODEL": "claude-sonnet-5",
            "MIRZA_API_KEY": "shared-key",
            "MIRZA_ENRICH_MODEL": "gemini/gemini-2.5-pro",
            "MIRZA_ENRICH_API_KEY": "enrich-key",
        })
        self.assertEqual(cfg.STAGES["enrich"].model, "gemini/gemini-2.5-pro")
        self.assertEqual(cfg.STAGES["enrich"].api_key, "enrich-key")
        # Untouched stages still inherit the shared default.
        self.assertEqual(cfg.STAGES["draft"].model, "anthropic/claude-sonnet-5")
        self.assertEqual(cfg.STAGES["draft"].api_key, "shared-key")

    def test_only_draft_streams(self):
        cfg = _reload_config({"MIRZA_MODEL": "claude-sonnet-5", "MIRZA_API_KEY": "k"})
        self.assertTrue(cfg.STAGES["draft"].stream)
        for name in ("enrich", "metadata", "images"):
            self.assertFalse(cfg.STAGES[name].stream, name)

    def test_enrich_defaults_to_medium_effort_others_to_none(self):
        cfg = _reload_config({"MIRZA_MODEL": "claude-sonnet-5", "MIRZA_API_KEY": "k"})
        self.assertEqual(cfg.STAGES["enrich"].effort, "medium")
        for name in ("draft", "metadata", "images"):
            self.assertEqual(cfg.STAGES[name].effort, "none", name)

    def test_max_tokens_shared_default_and_per_stage_override(self):
        cfg = _reload_config({
            "MIRZA_MODEL": "claude-sonnet-5", "MIRZA_API_KEY": "k",
            "MIRZA_MAX_TOKENS": "8000",
            "MIRZA_DRAFT_MAX_TOKENS": "16000",
        })
        self.assertEqual(cfg.STAGES["draft"].max_tokens, 16000)
        self.assertEqual(cfg.STAGES["metadata"].max_tokens, 8000)

    def test_max_tokens_default_is_32000(self):
        cfg = _reload_config({"MIRZA_MODEL": "claude-sonnet-5", "MIRZA_API_KEY": "k"})
        self.assertEqual(cfg.STAGES["draft"].max_tokens, 32000)

    def test_invalid_effort_override_raises(self):
        with self.assertRaises(ValueError):
            _reload_config({
                "MIRZA_MODEL": "claude-sonnet-5",
                "MIRZA_API_KEY": "k",
                "MIRZA_DRAFT_EFFORT": "extreme",
            })


class PrefillConditioningTests(unittest.TestCase):
    """Anthropic rejects assistant-message prefill while extended thinking is enabled,
    so invoke_structured must only prefill '{' for stages with effort == 'none'."""

    def _run(self, effort, prefill_enabled=True):
        fake_cfg = StageConfig(
            model="anthropic/claude-sonnet-5", temperature=0.1, effort=effort,
            max_tokens=100, stream=False, api_base=None, api_key="k",
        )
        fake_llm = _FakeChatModel()
        with patch.object(llm, "STAGES", {"test": fake_cfg}), \
             patch.object(llm, "get_chat_llm", return_value=fake_llm), \
             patch.object(llm, "PREFILL_ENABLED", prefill_enabled):
            result = llm.invoke_structured("test", _Schema, [HumanMessage("hi")])
        return result, fake_llm.captured

    def test_prefill_added_when_effort_is_none(self):
        result, captured = self._run("none")
        self.assertEqual(result.x, 1)
        self.assertIsInstance(captured[-1], AIMessage)
        self.assertEqual(captured[-1].content, "{")

    def test_prefill_omitted_when_effort_enabled(self):
        result, captured = self._run("medium")
        self.assertEqual(result.x, 1)
        self.assertNotIsInstance(captured[-1], AIMessage)

    def test_prefill_omitted_when_disabled(self):
        # Gateways like 9router reject assistant prefill ("This model does not
        # support assistant message prefill"); MIRZA_PREFILL=false must skip it.
        result, captured = self._run("none", prefill_enabled=False)
        self.assertEqual(result.x, 1)
        self.assertNotIsInstance(captured[-1], AIMessage)


class GetChatLlmTests(unittest.TestCase):
    def test_raises_clear_error_when_api_key_missing(self):
        fake_cfg = StageConfig(
            model="anthropic/claude-sonnet-5", temperature=0.1, effort="none",
            max_tokens=100, stream=False, api_base=None, api_key=None,
        )
        with patch.object(llm, "STAGES", {"test": fake_cfg}):
            with self.assertRaises(RuntimeError):
                llm.get_chat_llm("test")


if __name__ == "__main__":
    unittest.main()
