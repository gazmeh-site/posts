# CLAUDE.md — Mirza

This file guides Claude Code when working in [posts/mirza/](.). Mirza is an interactive
Persian article-authoring agent: a LangGraph human-in-the-loop pipeline that turns a source
text into a complete, publication-ready Gazmeh blog article (Markdown body, metadata,
cover/card images, and a `draft/<topic>-<slug>` git branch).

> **Note on layering:** Mirza is deliberately split into independent layers
> (`config` / `domain` / `llm` / `prompts` / `graph` / `runtime` / `infra` / `ui`). The
> dependency direction is one-way (see below). Respect it when adding code — it is what
> keeps models swappable, the graph editable, and a future RAG a configuration change
> rather than a rewrite.

## What Mirza is

- **Pipeline:** `draft → enrich_plan → enrich_apply → metadata → build → images → finish`,
  with six human review checkpoints (`interrupt_before`). `enrich_apply` is pure Python and
  never pauses. All revisions/branching happen **outside** the compiled graph via checkpoint
  time-travel in [runtime/session.py](runtime/session.py) (`Rewind`/`Jump`).
- **Entry point:** only the Chainlit web server — `bash run-chainlit.sh -w`. There is no CLI.
- **Two modes:** `mdfy` (default — convert a provided source text into clean Markdown) and
  `auto` (write from scratch, triggered by `/auto`).
- **Stack:** Python 3.13, package manager **uv**, LangGraph ≥ 1.2.9, pydantic, Chainlit.
- **Models:** text access goes through **litellm** (`langchain-litellm`), so any provider
  works per stage via `"provider/model"` env values. Image generation is Gemini (REST).

## Commands (run inside `posts/mirza/`)

```bash
uv sync                          # install deps from uv.lock
bash run-chainlit.sh -w          # run the Chainlit server (the only entry point)
uv run --with pytest pytest -q   # run tests (pytest is NOT a declared dep — provide via --with)
```

There is no test framework in the parent app; mirza's own tests live in [tests/](tests/)
(`test_catalog`, `test_enrichment`, `test_llm_config`, `test_pipeline`, `test_streaming`).
Keep them green after every change.

## Layers and the dependency rule

```text
config  ←  domain  ←  {llm, prompts}  ←  graph  ←  runtime  ←  ui
```

| Layer | Path | Role | May import |
|---|---|---|---|
| config | [config.py](config.py) | paths, `.env`, per-stage `StageConfig`/`STAGES` | nothing internal |
| domain | [domain/](domain/) | pure article-authoring logic (`enrichment`, `catalog`, `components`, `profiles`) | config only (paths passed as params) |
| llm | [llm.py](llm.py) | model-access **implementation**: `invoke_structured` (JSON-repair + Pydantic + retry) and `generate_image_file` (Gemini REST). Kept as a single module — not a package — so tests can `unittest.mock.patch.object(llm, ...)`; the **ports** (Protocols) and the adapters that satisfy them (`_LiteLLMClient`, `_GeminiImageGenerator`) live in [runtime/deps.py](runtime/deps.py), which imports `llm` lazily. | config |
| prompts | [prompts.py](prompts.py) | prompt **render-functions** (`ctx` dict → messages). The `retrieval` key in `ctx` is the RAG seam. | domain |
| graph | [graph/](graph/) | `state`, `spec` (single source of truth for the pipeline), `nodes` (DI), `build` | state, prompts, domain — **never** llm/infra/ui directly (only via `deps`) |
| runtime | [runtime/](runtime/) | orchestration: `deps` (Ports + `Deps` + `default_deps` + `get_deps`), `session` (time-travel), `decisions` (`Rewind`/`Jump`/`next_command`), `metrics`, `streaming` (`StreamRelay`) | config, graph, llm, infra, domain |
| infra | [infra/](infra/) | side-effecting adapters: `git`, `retrieval` (`NoopRetriever` — the RAG plug point) | config |
| ui | [ui/](ui/) | presentation only: `app` (Chainlit lifecycle + `advance()` loop), `presenters` (node→presenter map), `preview` (`BodyExtractor`), `editor`, `widgets` | runtime + config + domain — **never** graph/prompts/llm |

Hard rules:
- **Nodes take `(state, config)`** and read collaborators via `get_deps(config)` — no top-level
  imports of `llm`/`infra`/`prompts`/`streaming` inside node bodies. This is what makes models
  swappable and the graph re-composable.
- **Change the graph in one place:** [graph/spec.py](graph/spec.py) (`PIPELINE` +
  `INTERRUPT_NODES`). Both [graph/build.py](graph/build.py) (compile) and
  [runtime/decisions.py](runtime/decisions.py) (time-travel menu) consume it — do not duplicate
  the interrupt list.
- **Prompts are render-functions**, not constants referenced by name in nodes. A node builds a
  `ctx` dict (which may include `retrieval` chunks) and calls e.g. `draft_messages(ctx)`.
- **Progress notices:** nodes call `deps.progress(text)`, never a UI/streaming symbol directly
  (the old `emit_phase` leak is gone). `ArticleSession` wires `deps.progress` to its `StreamRelay`.

## Data path (how one article flows)

```text
Chainlit (ui/app.py) ──► ArticleSession (runtime/session.py)
        │                       │  builds Deps (runtime/deps.py), puts it in config["configurable"]["deps"]
        │                       ▼
        │              LangGraph (graph/build.py from graph/spec.py)
        │                       │  each node: get_deps(config) → prompts.* → deps.llm.complete_structured(...)
        │                       ▼
        │              llm.py: invoke_structured() ──litellm──► provider (any)
        │              llm.py: generate_image_file() ──REST──► Gemini
        └── ui/presenters.py: node name → presenter (review/edit/revise/rewind buttons)
```

`next_command(decision)` in [runtime/decisions.py](runtime/decisions.py) converts a UI decision
into `None` (approve), a LangGraph `Command` (update), or a `Rewind`/`Jump` (time-travel).

## Conventions

- **Models are env-driven.** `STAGES` in [config.py](config.py) defines four stages
  (`draft`/`enrich`/`metadata`/`images`); each field is overridable per stage as
  `MIRZA_<STAGE>_<FIELD>`, falling back to shared `MIRZA_*`, then legacy `ANTHROPIC_*`.
  Swapping a model is an `.env` change, never a code change. Swapping the image generator is a
  different `ImageGenerator` wired into `Deps`.
- **Structured output** is prompt-based JSON validated by Pydantic (not forced tool calls), with
  repair + retry in [llm.py](llm.py) (`invoke_structured`). The Pydantic schemas live in
  [graph/state.py](graph/state.py) (`ArticleDraft`, `ArticleMetadata`, `ImagePrompts`,
  `EnrichmentPlan`, …).
- **State stays a `TypedDict(total=False)`** ([graph/state.py](graph/state.py)) — native to
  LangGraph and checkpoint/time-travel; partial updates are expected. Do not migrate it to
  Pydantic (YAGNI — the LLM output boundary is already Pydantic-validated).
- **RAG is a seam, not built.** `NoopRetriever` ([infra/retrieval.py](infra/retrieval.py)) is
  wired into `Deps`; a node's `ctx` has a `retrieval` slot (empty by default). Adding RAG means a
  real `Retriever` impl that fills `ctx["retrieval"]` — no node rewrite.
- **Framework deferred (YAGNI).** There is no generic `core` package. The seams (`spec`,
  `Deps`/Ports, `progress`, the presenter map) are the future cut lines if a second pipeline ever
  appears; until then, do not pre-extract one.
- **Strings:** Persian for user-facing messages; code and identifiers stay English kebab-case.
- **Don't:** add Clean Architecture's full ring split, DDD aggregates/repositories, unused
  provider adapters, or a CLI entry point — all explicitly out of scope.

## Output

On `finish`, mirza writes `fa/<topic>/<slug>/` under the `posts` repo root: `config.json`,
`content.md`, `resources/imageCover.png`, `resources/imageThumbnail.png`,
`resources/IMAGE_PROMPTS.txt`; commits and pushes branch `draft/<topic>-<slug>`; and prints a
compare URL. After merge, publishing to Strapi is manual (see [README.md](README.md)).
