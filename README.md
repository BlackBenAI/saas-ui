# SaaS-UI

> Build something remarkable. Your design system, beautifully consistent.

SaaS-UI is a local-first visual design-system editor for developers and designers.
It runs without an account and keeps your work in IndexedDB. The local-first editor is open
source under MIT; optional cloud sync and team features are a separate proprietary service.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License MIT](https://img.shields.io/badge/license-MIT-18181B)

## Why

Design systems drift. SaaS-UI keeps colors, type, layout, components, effects, motion,
and assets in one precise, exportable source of truth. The local project is always the source
of truth; the cloud is an explicit upgrade, never a gate.

- **Local first** — IndexedDB autosave and a working editor with no account or API.
- **Creative engineering** — Linear/Figma/Raycast-grade precision with restrained motion.
- **Exportable by design** — CSS, Tailwind, TypeScript, JSON, and Markdown outputs are the next milestones.
- **Open source** — MIT-licensed editor, community contributions, transparent core.

## Quick start

Requires Node.js 20+ and npm.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

With Docker:

```bash
docker compose up --build
```

Open `http://localhost:3000`. Set `FRONTEND_PORT` to use another host port.

### Commands

```bash
make install     # install frontend dependencies
make dev         # local Vite server
make build       # type-check + production build
make test        # Vitest suite
make lint        # ESLint
make up          # frontend container
```

Set `VITE_REPOSITORY_URL` in `frontend/.env.local` to override the GitHub link shown in the UI.

## What is open source

This repository contains the local-first foundation: the React UI, editor shell, design tokens,
IndexedDB persistence, autosave, undo/redo, shared components, and tests. The ten editor modules
and export formats are being implemented in the public roadmap.

The hosted service — accounts, organizations, RLS, billing, cloud sync, collaboration,
community, audit, deployment, and secrets — is proprietary and maintained separately.

See [OPEN_CORE.md](OPEN_CORE.md) for the exact boundary. The editor must remain fully usable
offline and without the hosted API.

## Roadmap

P6.1 scaffold (current) → auth and tiers (private cloud) → editor core → colors → typography/layout
→ components/effects → motion/assets → AI rules/export → cloud collaboration (private) →
community, PWA, and E2E.

## Architecture

```text
frontend/
  src/
    components/    editor shell, properties panel, shared UI
    pages/         landing page and local editor
    stores/        Zustand design-system and UI state
    lib/           Dexie persistence, autosave, exports
    styles/        design tokens and global CSS
    types/         design-system data model
```

Design constraints live in [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md): zinc-dominant
surfaces, one indigo action color, Manrope/Inter/JetBrains Mono, Lucide icons only, borders
over shadows, and reduced-motion support.

## Tests

```bash
cd frontend
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

## Contributing

Keep the local editor independent of the hosted service. Do not add fake metrics, fake
testimonials, decorative buttons, emoji UI icons, or cloud-only gates. UI copy and code are
in English.

## Security

Do not open public issues for vulnerabilities. Report them privately to
`security@blackbenai.bj`.

## License

MIT © 2026 BlackBenAI. See [LICENSE](LICENSE).
