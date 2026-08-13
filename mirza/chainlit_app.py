"""Chainlit entry point for Mirza's RTL human-in-the-loop chat interface.

Thin shim so ``chainlit run chainlit_app.py`` (see run-chainlit.sh) keeps working;
the actual lifecycle, advance() loop, and presenters live under ``mirza.ui``.
"""
import os
import sys

# Keep posts/ importable when Chainlit is launched from an arbitrary CWD.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mirza.ui.app import *  # noqa: F401,F403 — registers the @cl.on_* handlers
from mirza.ui.presenters import *  # noqa: F401,F403
