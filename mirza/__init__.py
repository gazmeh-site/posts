"""Mirza generates Gazmeh blog articles with LangGraph and human review.

Flow (seven worker nodes and six human checkpoints):
    START → draft → enrich_plan → enrich_apply → metadata → build → images → finish → END
    interrupt_before = ["draft", "enrich_plan", "metadata", "build", "images", "finish"]
    (enrich_apply is pure Python — it splices enrich_plan's output and never pauses)

Run the RTL Chainlit interface from posts/:
    bash mirza/run-chainlit.sh -w

Each of the four LLM stages (draft/enrich/metadata/images) has its own model,
configured independently in mirza/.env via MIRZA_<STAGE>_<FIELD> (falling back to
shared MIRZA_<FIELD> defaults, then legacy ANTHROPIC_* vars). Models are litellm
"provider/model" names, so any litellm-supported provider works, not just Anthropic.
See config.STAGES and the README's .env section for the full list of fields.
draft/metadata/images run without thinking (fast, no reasoning needed); enrich runs
with thinking by default, since it reasons precisely over line numbers.

Image generation always uses Gemini (GEMINI_API_KEY, optionally GEMINI_IMAGE_MODEL)
regardless of which text models the four stages above use. Without a key, Mirza
saves only the image prompts.

Copy mirza/.writer.example.py to mirza/.writer.py to configure a writer profile.
The local file is ignored by Git and supplies tone and style to the models — this
is unrelated to the per-stage model configuration in config.py, despite the name.

Generated files are committed and pushed to draft/<topic>-<slug> in posts,
then Mirza prints a pull-request URL without requiring the GitHub CLI.
"""
