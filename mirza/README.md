# Mirza ✍️

> The **Gazmeh** blog writing assistant — an interactive [LangGraph](https://github.com/langchain-ai/langgraph)-based agent with a human-in-the-loop workflow.

Mirza takes a raw draft and, following Gazmeh's blog standards, turns it step by step — with your approval along the way — into a complete, publication-ready article. That includes the Markdown content, article metadata, cover/card images, and finally a PR branch in the `posts` repository.

The workflow includes five human review checkpoints, so at each stage you can approve the result, edit it yourself, ask the AI to revise it, or jump back to an earlier step.

## What is Mirza?

- **Two article generation modes:**
  - **`mdfy`** **(default):** You provide the complete article, and Mirza converts it into clean, Gazmeh-compatible Markdown while preserving the original content, structure, and tone. Only formatting and supported visual blocks are enhanced; the source content remains intact.
  - **`auto`:** Mirza writes the article from scratch based on headings and the information you provide manually.
- **Human-in-the-loop:** Mirza pauses before five major stages and waits for your approval or edits. No files are written or pushed without review.
- **Time travel:** You can return to any previous stage and continue from there, or restart the conversation from scratch.
- **Gazmeh-compatible Markdown:** Mirza only uses structures that the site renderer actually supports: `##` / `###` headings, bold, italic, inline code, lists, blockquotes, tables, code blocks, and the five alert containers `:::info/warning/danger/note/draft`.
- **RTL web chat interface:** Interaction happens in the browser through Chainlit. The logic that turns user decisions into actions is centralized in `controller.next_command`.
- **Final output:** A `fa/<topic>/<slug>/` directory containing `config.json`, `content.md`, and `resources/` (images and prompts), plus a commit and push to the `draft/<topic>-<slug>` branch, followed by a PR URL.

## Flow Graph

Mirza uses a LangGraph graph with **six processing nodes** and **five human review checkpoints**:

```text
START → draft → review → metadata → build → images → finish → END
```

Human checkpoints (`interrupt_before`) occur before:

`draft`, `metadata`, `build`, `images`, and `finish`

The `review` node acts as the editor and runs **automatically** immediately after `draft`.

| Step | Review Stage | Node | Responsibility |
| --- | --- | --- | --- |
| 1 | Receive article | `draft` | Writer: run `mdfy` for faithful conversion, run `auto` to write from scratch, or rewrite based on feedback |
| — | — | `review` | Editor: automatically improve the text and provide targeted notes without pausing |
| 2 | Review article | `metadata` | Determine title, tags, `topic`, and `slug`, and check for path conflicts with existing articles |
| 3 | Metadata and path | `build` | Create the directory, `config.json`, `content.md`, and `resources/` |
| 4 | Image mode | `images` | Generate English prompts for the cover image (16:9) and card image (1:1) |
| 5 | Image prompts | `finish` | Generate image files, save prompts, create the branch, commit, push, and display the PR URL |

The graph state is defined in `graph/state.py`, and its checkpointer uses in-memory storage (`MemorySaver`). As a result, each conversation or terminal session has its own independent `thread`.

## Requirements

- Python **3.13 or later**
- The [uv](https://docs.astral.sh/uv/) package manager; dependencies are locked in `uv.lock`
- An API key for the text model:
  - `ANTHROPIC_API_KEY` in the default mode
  - or `GEMINI_API_KEY` when using Google
- Automatic image generation requires `GEMINI_API_KEY`. If it is not available, Mirza only saves the image prompts.

## Installation and Setup

```bash
cd posts/mirza
uv sync                 # Install dependencies into .venv based on uv.lock
```

### 1) Configure `.env`

Create `mirza/.env`. Values in this file take precedence over shell environment variables:

```dotenv
# Text model provider: anthropic (default) or google
LLM_PROVIDER=anthropic

# anthropic mode
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5          # optional
# ANTHROPIC_BASE_URL=https://your-proxy  # optional: compatible proxy/endpoint

# google mode (requires: uv add langchain-google-genai)
# LLM_PROVIDER=google
# GEMINI_API_KEY=...
# GEMINI_TEXT_MODEL=gemini-2.5-flash

# Image generation in either mode — optional
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

> The text model is accessed through `llm.py` using structured JSON output validated with Pydantic, allowing it to work correctly with Anthropic-compatible endpoints as well.

### 2) Configure the Writer Profile

```bash
cp mirza/.writer.example.py mirza/.writer.py
```

Then edit `WRITER_PROFILE` in `.writer.py`. This file is ignored by Git (`git-ignored`).

| Key | Description |
| --- | --- |
| `username` | Exact Strapi username stored in `config.json` |
| `name` | Display name of the author; used only to introduce the writer to the model |
| `tone` | Overall writing tone |
| `style` | Writing habits, sentence structure, and similar preferences |
| `preferred_phrases` | Preferred phrases that the model uses sparingly and with variation |

> In `mdfy` mode, `username` and `tone` are read from `.writer.py`. In `auto` mode, this information is requested at the beginning of the workflow. `mdfy` cannot run without a `username`.

## Running Mirza

### Web Chat Interface (Recommended)

Mirza's web interface is right-to-left and includes features such as an inline text editor and a time-travel menu.

```bash
# From inside posts/
bash mirza/run-chainlit.sh -w

# Or manually:
cd mirza && .venv/bin/chainlit run chainlit_app.py -w
```

After starting the app, open the URL printed in the terminal.

By default, simply send the complete article and Mirza will process it in `mdfy` mode. To generate an article from scratch, send the `/auto` command.

## Output and Publishing

After final approval, Mirza performs the following steps:

1. Writes the article files to `fa/<topic>/<slug>/`:

- `config.json`
- `content.md`
- `resources/imageCover.png`
- `resources/imageThumbnail.png`
- `resources/IMAGE_PROMPTS.txt`

2. Creates a branch named `draft/<topic>-<slug>`, commits the changes, and pushes the branch to `origin`.

3. Finally, it displays the PR URL:

```text
https://github.com/gazmeh-site/posts/compare/main...<branch>
```

After the PR is merged, publish the article to Strapi by running the following commands from inside `posts/`:

```bash
set -a; source .env; set +a
python3 add-all-posts-api.py fa/<topic>/<slug>
```

## Module Structure

| Path | Role |
| --- | --- |
| `config.py` | Path management, `.env` loading, and model configuration |
| `llm.py` | Text-model client, structured JSON output, and image generation with Gemini |
| `prompts.py` | System prompts for writer, editor, metadata, and images, plus Gazmeh's Markdown vocabulary |
| `profiles.py` | Load `.writer.py` and prepare the writer profile for prompts |
| `catalog.py` | Scan `posts/fa`, validate identifiers, and check for path/tag conflicts |
| `controller.py` | `ArticleSession` for graph execution, checkpoints, and time travel; `next_command` converts user decisions into actions |
| `graph/build.py` | Build the LangGraph graph and define `interrupt_before` checkpoints |
| `graph/nodes.py` | Six nodes: `draft`, `review`, `metadata`, `build`, `images`, and `finish` |
| `graph/state.py` | Define `ArticleState` and Pydantic schemas |
| `graph/git.py` | Branch creation, commit, push, and PR URL generation |
| `chainlit_app.py` | Right-to-left Chainlit chat interface |
| `ui/` | Inline text editor (`editor.py`) and settings widgets (`widgets.py`) |
| `public/` | Chainlit static assets, including styling, RTL support, offline Vazirmatn font, and editor assets |
| `.chainlit/config.toml` | Chainlit configuration, including `fa` locale and custom CSS/JS |
| `chainlit_fa.md` | Persian welcome page |
