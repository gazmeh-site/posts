"""Mirza generates Gazmeh blog articles with LangGraph and human review.

Flow (six worker nodes and five human checkpoints):
    START → draft → review → metadata → build → images → finish → END
    interrupt_before = ["draft", "metadata", "build", "images", "finish"]

Run the RTL Chainlit interface from posts/:
    bash mirza/run-chainlit.sh -w

Configure the text provider with LLM_PROVIDER in mirza/.env:
    - anthropic (default): ANTHROPIC_API_KEY; optional ANTHROPIC_MODEL and ANTHROPIC_BASE_URL
    - google: GEMINI_API_KEY; requires langchain-google-genai

Image generation uses GEMINI_API_KEY and optionally GEMINI_IMAGE_MODEL.
Without a key, Mirza saves only the image prompts.

Copy mirza/.writer.example.py to mirza/.writer.py to configure a writer profile.
The local file is ignored by Git and supplies tone and style to the models.

Generated files are committed and pushed to draft/<topic>-<slug> in posts,
then Mirza prints a pull-request URL without requiring the GitHub CLI.
"""
