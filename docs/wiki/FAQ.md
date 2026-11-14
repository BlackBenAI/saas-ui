# FAQ

## Is SaaS-UI free?

Yes. This repository is MIT licensed. See [LICENSE](https://github.com/BlackBenAI/saas-ui/blob/main/LICENSE).

## Do I need an account?

No. The editor works without an account and without a network connection. Accounts belong to the
separate hosted service.

## Where is my project stored?

In the browser:

- localStorage for fast hydration and preferences;
- IndexedDB (`saas-ui` database) for durable project records.

See [Local-First Data](Local-First-Data).

## Is my work uploaded anywhere?

No. The open-source editor does not call an API or upload projects. There is no telemetry or
analytics in this repository.

## Can I use it offline?

After the app has loaded, the editor itself does not depend on a network connection. The
production build can be served as a static site. See [Getting Started](Getting-Started).

## Can I export CSS, Tailwind, or TypeScript?

Yes. The Export module generates CSS variables, a Tailwind config, typed TypeScript tokens, a
re-importable JSON file, and a Markdown design brief. Everything runs in the browser.

## Can I use the tokens in Figma?

Yes. Export generates a `figma-variables.json` file with color collections in light and dark
modes, typography, spacing, radius, button tokens, durations, and easings. Import the same file
after editing it in Figma to update the local tokens.

## Are the Colors, Typography, Layout, and other modules available?

Yes. All ten modules edit the same local design system and persist to IndexedDB.

## Can I hand the design system to an AI coding agent?

Yes. The AI Rules module generates a complete `AI_INTERFACE_BRIEF.md` with the mission, both
palettes, every type role, layout, components, effects, motion, accessibility, QA, interface
composition rules, and a definition of done. It also includes a short system prompt and the full
reference CSS. Everything is generated locally from the current tokens.

## Can I generate a starter app?

Yes. Export includes a **Vite + React** and a **Next.js + shadcn** starter. Each includes a real
token-driven page, the design tokens CSS, a generated Button component, Tailwind config, and a
README. Copy individual files or download the whole starter as one Markdown bundle.

## Does it work on mobile?

Yes. The landing page is responsive, and the editor replaces the sidebar with a horizontal
module bar while hiding the secondary properties panel. Complex token editing is still more
comfortable on a desktop browser.

## How do I reset my local data?

Open DevTools → Application → Storage → Clear site data, or delete the `saas-ui` IndexedDB
database. This deletes local projects permanently.

## How do I move my project to another browser?

There is no export button in this build yet. For now, keep the browser profile or inspect the
IndexedDB record in DevTools. A first-class export/import path is on the roadmap.

## Can I self-host it?

Yes. It is a static Vite application:

```bash
cd frontend
npm run build
# serve dist/ with any static host
```

The Docker setup serves the frontend container for local development.

## What is the relationship with the hosted service?

The hosted service is a separate proprietary product that adds cloud sync, collaboration,
billing, and administrative features. It is not required to use this editor. See
[OPEN_CORE.md](https://github.com/BlackBenAI/saas-ui/blob/main/OPEN_CORE.md).

## How can I contribute?

Read [Contributing](Contributing). Start with a focused issue or a small improvement, run all
checks, and keep the local-first contract intact.

## I found a security issue. Where do I report it?

Privately to `security@blackbenai.bj`. Do not open a public issue. See [Security](Security).
