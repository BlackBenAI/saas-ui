# Wiki source

This directory contains the source for the SaaS-UI GitHub wiki.

## Publish

1. Enable **Wikis** in the repository settings.
2. Create the first `Home` page from the GitHub Wiki tab.
3. Clone the wiki repository:

```bash
git clone git@github.com:BlackBenAI/saas-ui.wiki.git
```

4. Copy the pages, excluding this README:

```bash
cp docs/wiki/Home.md docs/wiki/Getting-Started.md docs/wiki/Architecture.md \
   docs/wiki/Local-First-Data.md docs/wiki/Design-Principles.md \
   docs/wiki/Contributing.md docs/wiki/Roadmap.md docs/wiki/FAQ.md \
   docs/wiki/Security.md docs/wiki/_Sidebar.md docs/wiki/_Footer.md \
   /path/to/saas-ui.wiki/
```

5. Commit and push from the wiki clone:

```bash
cd /path/to/saas-ui.wiki
git add .
git commit -m "docs: publish SaaS-UI wiki"
git push
```

Or run the helper from the repository root:

```bash
bash docs/wiki/publish-wiki.sh
```

The helper clones the wiki into a temporary directory, copies the pages, commits, pushes, and
cleans up. It requires the wiki to be enabled and the SSH remote to be reachable.
