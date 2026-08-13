# Mirza ✍️

> The **Gazmeh** blog writing assistant — an interactive [LangGraph](https://github.com/langchain-ai/langgraph)-based agent with a human-in-the-loop workflow.

Mirza takes a raw draft and, following Gazmeh's blog standards, turns it step by step — with your approval along the way — into a complete, publication-ready article: Markdown content, article metadata, cover/card images, and finally a PR branch in the `posts` repository.

## What is Mirza?

- **One mode:** you send the complete source article, and Mirza converts it into clean, Gazmeh-compatible Markdown while preserving the original content, structure, and tone. Only formatting and supported visual blocks are enhanced; the source content stays intact.
- **Human-in-the-loop:** Mirza pauses before six stages and waits for your approval or edits. No files are written or pushed without review.
- **Time travel:** you can return to any previous stage and continue from there, or restart from scratch.
- **Gazmeh-compatible Markdown:** Mirza only uses structures the site renderer supports: `##`/`###` headings, bold, italic, inline code, lists, blockquotes, tables, code blocks, and the five alert containers `:::info/warning/danger/note/draft`.
- **RTL web chat interface:** interaction happens in the browser through Chainlit.
- **Final output:** a `fa/<topic>/<slug>/` directory (`config.json`, `content.md`, `resources/`), committed and pushed to a `draft/<topic>-<slug>` branch, followed by a PR URL.

## Flow graph

```text
START → draft → enrich_plan → enrich_apply → metadata → build → images → finish → END
```

Human checkpoints (`interrupt_before`) occur before `draft`, `enrich_plan`, `metadata`, `build`, `images`, and `finish`. `enrich_apply` is pure Python (no LLM call) and always runs automatically right after `enrich_plan` is approved, splicing the planned visual blocks into the plain draft.

| Step | Review stage | Node | Responsibility |
| --- | --- | --- | --- |
| 1 | Receive article | `draft` | Convert the source text faithfully, or rewrite it based on feedback |
| 2 | Plain-draft approval | `enrich_plan` | Decide which MDC component (note/warning/etc.) covers which line range |
| — | — | `enrich_apply` | Render and splice the planned blocks deterministically; never pauses |
| 3 | Final text approval | `metadata` | Determine title, tags, `topic`, and `slug`; check for path conflicts |
| 4 | Metadata and path | `build` | Create the directory, `config.json`, `content.md`, and `resources/` |
| 5 | Image mode | `images` | Generate English prompts for the cover (16:9) and card (1:1) images |
| 6 | Image prompts | `finish` | Generate image files, save prompts, create the branch, commit, push, print the PR URL |

The graph state is defined in `graph/state.py`; the checkpointer is in-memory (`MemorySaver`), so each conversation/terminal session has its own independent thread.

## Requirements

- Python **3.13+**
- The [uv](https://docs.astral.sh/uv/) package manager (deps locked in `uv.lock`)
- A text-model API key (`MIRZA_API_KEY`, or legacy `ANTHROPIC_API_KEY`). Every stage goes through [litellm](https://docs.litellm.ai/), so the model can be from any provider it supports.
- `GEMINI_API_KEY` for automatic image generation — without it, Mirza only saves the image prompts.

## Setup

```bash
cd posts/mirza
uv sync                 # install dependencies into .venv from uv.lock
```

### 1) Configure `.env`

Create `mirza/.env` (values here take precedence over shell env vars):

```dotenv
# Shared defaults for every stage. Model names are litellm "provider/model" strings
# (e.g. anthropic/claude-sonnet-5, gemini/gemini-2.5-flash) — see https://docs.litellm.ai/docs/providers.
# A bare name with no "/" is assumed to be Anthropic.
MIRZA_MODEL=anthropic/claude-sonnet-5
MIRZA_API_KEY=sk-ant-...
# MIRZA_API_BASE=https://your-proxy      # optional: compatible proxy/endpoint
# MIRZA_MAX_TOKENS=32000                 # optional: default is already 32000

# Per-stage overrides — MODEL/API_KEY/API_BASE/MAX_TOKENS/TEMPERATURE/EFFORT
# ("none"|"low"|"medium"|"high") can be set per stage as MIRZA_<STAGE>_<FIELD>,
# where <STAGE> is DRAFT, ENRICH, METADATA, or IMAGES. Defaults already split
# effort sensibly (draft/metadata/images: none, enrich: medium) — override only if needed:
# MIRZA_ENRICH_MODEL=anthropic/claude-opus-5
# MIRZA_ENRICH_EFFORT=high
# MIRZA_METADATA_MODEL=gemini/gemini-2.5-flash

# Image generation (Gemini only, independent of the text stages above) — optional
GEMINI_API_KEY=...
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

> Legacy `.env` files (predating per-stage config) keep working: unset `MIRZA_*` fields fall back to `ANTHROPIC_MODEL`/`ANTHROPIC_API_KEY`/`ANTHROPIC_BASE_URL` (or `ANTHROPIC_API_URL`)/`ANTHROPIC_MAX_TOKENS`.

### 2) Configure the writer profile

```bash
cp .writer.example.py .writer.py
```

Edit `WRITER_PROFILE` in `.writer.py` (git-ignored):

| Key | Description |
| --- | --- |
| `username` | Exact Strapi username stored in `config.json` — required, Mirza refuses to run without it |
| `name` | Display name of the author; used only to introduce the writer to the model |
| `tone` | Overall writing tone |
| `style` | Writing habits, sentence structure, and similar preferences |
| `preferred_phrases` | Preferred phrases the model uses sparingly and with variation |

## Running Mirza

The web chat is the only entry point — right-to-left, with an inline text editor and a time-travel menu.

```bash
# From inside posts/
bash mirza/run-chainlit.sh -w

# Or manually:
cd mirza && .venv/bin/chainlit run chainlit_app.py -w
```

Open the URL printed in the terminal, then send the complete source article as your first message.

## Output and publishing

After final approval, Mirza:

1. Writes `fa/<topic>/<slug>/`: `config.json`, `content.md`, `resources/imageCover.png`, `resources/imageThumbnail.png`, `resources/IMAGE_PROMPTS.txt`.
2. Creates branch `draft/<topic>-<slug>`, commits, and pushes to `origin`.
3. Prints the PR URL: `https://github.com/gazmeh-site/posts/compare/main...<branch>`

After the PR is merged, publish to Strapi from inside `posts/`:

```bash
set -a; source .env; set +a
python3 add-all-posts-api.py fa/<topic>/<slug>
```

## Module structure

| Path | Role |
| --- | --- |
| `config.py` | Paths, `.env` loading, per-stage `StageConfig`/`STAGES` model configuration |
| `llm.py` | litellm-backed structured JSON output (`invoke_structured`) and Gemini image generation |
| `prompts.py` | Prompt render-functions for the writer, enrichment planning, metadata, and images |
| `domain/` | Pure article logic: writer profile (`profiles.py`), MDC enrichment (`enrichment.py`), post catalog/conflict checks (`catalog.py`), MDC component defs (`components.py`) |
| `graph/` | `state.py` (`ArticleState`, Pydantic schemas), `spec.py` (pipeline + checkpoints, single source of truth), `nodes.py` (the seven nodes), `build.py` (compiles the graph) |
| `runtime/` | Orchestration: `deps.py` (dependency-injection ports), `session.py` (`ArticleSession`, time travel), `decisions.py` (`Rewind`/`Jump`/`next_command`), `streaming.py`, `metrics.py` |
| `infra/` | Side-effecting adapters: `git.py` (branch/commit/push/PR URL), `retrieval.py` (RAG seam, currently a no-op) |
| `ui/` | Chainlit presentation: `app.py` (lifecycle loop), `presenters.py` (node → UI presenter), `preview.py`, `editor.py`, `widgets.py` |
| `public/` | Chainlit static assets: styling, RTL support, offline Vazirmatn font, editor assets |
| `.chainlit/config.toml` | Chainlit configuration (`fa` locale, custom CSS/JS) |
| `chainlit_fa.md` | Persian welcome page |
