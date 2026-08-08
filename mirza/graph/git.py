"""Git helpers for publishing a generated article branch."""

import subprocess

from ..config import POSTS_DIR


GITHUB_REMOTE = "origin"
GITHUB_REPO_FALLBACK = "gazmeh-site/posts"


def _git(args, cwd=POSTS_DIR):
    proc = subprocess.run(["git"] + args, cwd=cwd, text=True, capture_output=True)
    if proc.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}:\n{proc.stderr.strip()}")
    return proc.stdout.strip()


def create_branch_and_pr(folder_rel: str, title: str, branch: str) -> str:
    """Commit and push an article folder, then return its pull-request URL."""
    try:
        _git(["checkout", "-b", branch])
    except RuntimeError:
        _git(["checkout", branch])  # The branch already exists.

    _git(["add", "--", folder_rel])
    if _git(["status", "--porcelain"]).strip():
        _git(["commit", "-m", f"draft: {title}"])

    repo = GITHUB_REPO_FALLBACK
    try:
        remote_url = _git(["remote", "get-url", GITHUB_REMOTE])
        for prefix in ("https://github.com/", "git@github.com:"):
            if remote_url.startswith(prefix):
                remote_url = remote_url[len(prefix):]
                break
        if remote_url.endswith(".git"):
            remote_url = remote_url[:-4]
        repo = remote_url or repo
    except RuntimeError:
        pass

    try:
        _git(["push", "-u", GITHUB_REMOTE, branch])
    except RuntimeError as exc:
        print(f"⚠️  push ناموفق (شاخه‌ی محلی ساخته شد):\n{exc}")

    return f"https://github.com/{repo}/compare/main...{branch}"
