# Contributing to SaaS-UI

Thanks for helping improve the local-first editor.

## Scope

This repository is the MIT-licensed editor. Cloud sync, collaboration, billing, marketplace,
and operational tooling live in a separate hosted service. Read `OPEN_CORE.md` before adding a
feature that needs a backend.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/dashboard`. A local project is created automatically.

## Before opening a PR

```bash
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

CI runs the same checks. Keep UI copy and identifiers in English, follow `DESIGN.md`, and do not
add fake metrics, testimonials, decorative controls, or emoji UI icons.

## Good first contributions

- Documentation and wiki corrections.
- Accessibility fixes with a concrete WCAG reference.
- Tests for editor modules, project management, exports, and importers.
- New framework starters or token importers that stay client-side.
- Small UI polish that follows the existing zinc/indigo system.

## Pull requests

- Explain the user problem and the local-first impact.
- Include screenshots or a short recording for visual changes.
- Keep unrelated refactors out of the same PR.
- Update `README.md`, `docs/wiki/`, or `docs/` when behavior changes.

## Security

Do not open public issues for vulnerabilities. Report them privately to
`security@blackbenai.bj` as described in `SECURITY.md`.
