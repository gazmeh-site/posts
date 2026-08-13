import unittest

from langchain_core.callbacks.manager import CallbackManager

from mirza.streaming import PhaseUpdate, StreamRelay, emit_phase


class _FakeLoop:
    """Runs ``call_soon_threadsafe`` inline instead of hopping event loops."""

    def call_soon_threadsafe(self, fn, *args):
        fn(*args)


class _FakeQueue:
    def __init__(self):
        self.items = []

    def put_nowait(self, item):
        self.items.append(item)


class EmitPhaseTests(unittest.TestCase):
    def test_armed_relay_in_plain_list_receives_phase_update(self):
        """The shape used directly by ArticleSession / tests: callbacks is a list."""
        relay = StreamRelay()
        queue = _FakeQueue()
        relay.arm(_FakeLoop(), queue)

        emit_phase({"callbacks": [relay]}, "در حال برنامه‌ریزی…")

        self.assertEqual(len(queue.items), 1)
        self.assertIsInstance(queue.items[0], PhaseUpdate)
        self.assertEqual(queue.items[0].text, "در حال برنامه‌ریزی…")

    def test_armed_relay_wrapped_in_callback_manager_receives_phase_update(self):
        """LangGraph wraps the raw callbacks list into a CallbackManager before handing
        config to node functions — emit_phase must unwrap it via `.handlers`, not
        assume config["callbacks"] is directly iterable (a real bug this regresses)."""
        relay = StreamRelay()
        queue = _FakeQueue()
        relay.arm(_FakeLoop(), queue)
        manager = CallbackManager(handlers=[relay])

        emit_phase({"callbacks": manager}, "در حال رندر…")

        self.assertEqual(len(queue.items), 1)
        self.assertIsInstance(queue.items[0], PhaseUpdate)

    def test_disarmed_relay_and_missing_callbacks_are_silently_ignored(self):
        relay = StreamRelay()  # never armed
        emit_phase({"callbacks": [relay]}, "x")  # must not raise
        emit_phase({}, "x")
        emit_phase(None, "x")


if __name__ == "__main__":
    unittest.main()
