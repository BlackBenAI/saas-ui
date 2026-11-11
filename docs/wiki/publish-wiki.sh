#!/usr/bin/env bash
set -euo pipefail

WIKI_REMOTE="${WIKI_REMOTE:-git@github.com:BlackBenAI/saas-ui.wiki.git}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SOURCE="$ROOT/docs/wiki"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if ! git ls-remote "$WIKI_REMOTE" >/dev/null 2>&1; then
  echo "The wiki remote is not available: $WIKI_REMOTE" >&2
  echo "Enable Wikis in the repository settings and create the first Home page." >&2
  exit 1
fi

git clone "$WIKI_REMOTE" "$TMP"

PAGES=(
  Home.md
  Getting-Started.md
  Architecture.md
  Local-First-Data.md
  Design-Principles.md
  Contributing.md
  Roadmap.md
  FAQ.md
  Security.md
  _Sidebar.md
  _Footer.md
)

for page in "${PAGES[@]}"; do
  cp "$SOURCE/$page" "$TMP/$page"
done

git -C "$TMP" add .
if git -C "$TMP" diff --cached --quiet; then
  echo "Wiki is already up to date."
  exit 0
fi

git -C "$TMP" commit -m "docs: publish SaaS-UI wiki"
git -C "$TMP" push
echo "Published SaaS-UI wiki pages."
