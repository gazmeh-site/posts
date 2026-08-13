import unittest

from mirza.runtime.streaming import PhaseUpdate, StreamRelay


class _FakeLoop:
    """Runs ``call_soon_threadsafe`` inline instead of hopping event loops."""

    def call_soon_threadsafe(self, fn, *args):
        fn(*args)


class _FakeQueue:
    def __init__(self):
        self.items = []

    def put_nowait(self, item):
        self.items.append(item)


class StreamRelayPhaseTests(unittest.TestCase):
    """ArticleSession routes node phase notices (deps.progress) straight to ``relay.phase``.

    An armed relay forwards them as a ``PhaseUpdate``; a disarmed one silently ignores them.
    (This used to go through emit_phase digging into config["callbacks"]; the relay is now
    held directly by the session, so the CallbackManager-unwrapping case is gone.)
    """

    def test_armed_relay_receives_phase_update(self):
        relay = StreamRelay()
        queue = _FakeQueue()
        relay.arm(_FakeLoop(), queue)

        relay.phase("در حال برنامه‌ریزی…")

        self.assertEqual(len(queue.items), 1)
        self.assertIsInstance(queue.items[0], PhaseUpdate)
        self.assertEqual(queue.items[0].text, "در حال برنامه‌ریزی…")

    def test_disarmed_relay_ignores_phase(self):
        relay = StreamRelay()  # never armed
        relay.phase("x")  # must not raise and must not enqueue anywhere


if __name__ == "__main__":
    unittest.main()
