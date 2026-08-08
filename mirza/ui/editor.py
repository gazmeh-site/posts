"""Helpers for staging and embedding the browser-based draft editor."""

import json
import os
import shutil
import uuid

from chainlit.config import public_dir


EDIT_TIMEOUT = 1800
_EDITOR_SRC = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "mirza-editor.html",
)


def _stage_editor_draft(content: str) -> str:
    """Write a temporary public JSON draft and return its unique identifier."""
    edit_id = uuid.uuid4().hex
    path = os.path.join(public_dir, f"mirza-draft-{edit_id}.json")
    with open(path, "w", encoding="utf-8") as draft_file:
        json.dump({"content": content}, draft_file, ensure_ascii=False)
    return edit_id


def _cleanup_editor_draft(edit_id: str) -> None:
    path = os.path.join(public_dir, f"mirza-draft-{edit_id}.json")
    try:
        os.remove(path)
    except OSError:
        pass


def _editor_iframe(edit_id: str) -> str:
    src = f"/public/mirza-editor.html?d={edit_id}"
    # React accepts these iframe attributes; stylesheet.css makes the height responsive.
    return (
        f'<iframe src="{src}" sandbox="allow-scripts allow-same-origin" '
        f'width="100%" height="820" '
        f'title="ویرایشگر مقاله"></iframe>'
    )


def _ensure_editor_asset() -> None:
    """Copy the editor into Chainlit's served public directory when CWD differs."""
    target = os.path.join(public_dir, "mirza-editor.html")
    if os.path.abspath(target) == os.path.abspath(_EDITOR_SRC):
        return
    try:
        os.makedirs(public_dir, exist_ok=True)
        same = False
        if os.path.isfile(target):
            with open(_EDITOR_SRC, encoding="utf-8") as source_file, open(
                target, encoding="utf-8"
            ) as target_file:
                same = source_file.read() == target_file.read()
        if not same:
            shutil.copyfile(_EDITOR_SRC, target)
    except OSError:
        pass
