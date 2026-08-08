#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
# A global DEBUG value can conflict with Chainlit's boolean option.
# Pass --debug explicitly when debugging Chainlit.
unset DEBUG
exec .venv/bin/chainlit run chainlit_app.py "$@"
