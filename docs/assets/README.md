# Demo assets

These files are captured from the running SaaS-UI editor with Playwright. They are real product
screenshots and a real local session, not mockups.

- `landing.png` — landing page at 1440×900
- `editor-overview.png` — editor shell at 1440×900
- `editor-persisted.png` — the same project after a page reload
- `saas-ui-demo.webm` — 33-second local-first demo

Regenerate from `oss/frontend/` while the dev server is running:

```bash
npm run dev
# in another terminal
npm run capture:demo
```
