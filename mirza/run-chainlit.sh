#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
# A global DEBUG value can conflict with Chainlit's boolean option; and a stray RUN
# env var collides with Chainlit's "run" config field (pydantic tries to JSON-decode it
# and crashes on startup). Unset both before launch.
# Pass --debug explicitly when debugging Chainlit.
unset DEBUG RUN

# Optional outbound proxy for filtered services (LangSmith, the model gateway, …).
# Set it in your shell — e.g. `export MIRZA_PROXY=http://127.0.0.1:7890` — and it is
# applied to both HTTP_PROXY and HTTPS_PROXY (LangSmith/z.ai speak HTTPS).
# Plain HTTP proxies work out of the box; for socks5 install socksio into the venv.
if [[ -n "${MIRZA_PROXY:-}" ]]; then
  export HTTP_PROXY="$MIRZA_PROXY"
  export HTTPS_PROXY="$MIRZA_PROXY"
fi

exec .venv/bin/chainlit run chainlit_app.py "$@"
