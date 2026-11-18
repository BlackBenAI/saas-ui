# Roadmap

The open-source editor ships in small, honest increments. Each step must leave the local editor
usable on its own.

## Current status

| Area | Status |
|---|---|
| Editor shell | Available |
| Project naming | Available |
| Local project hub (`/projects`) | Available |
| Automatic project creation | Available |
| Undo/redo and local history | Available |
| Sidebar and properties collapse | Available |
| All ten editor modules | Available |
| IndexedDB autosave | Available |
| Reload persistence | Available |
| CSS, Tailwind, TypeScript, JSON, Markdown exports | Available |
| Vite/Next starter handoff | Available |
| Figma variables import/export | Available |
| Responsive editor shell | Available |
| Cloud, collaboration, billing | Separate hosted service |

## Delivered

- The ten editor modules edit the same store, participate in history, and persist locally.
- Export generation reads the local design system and supports CSS custom properties, Tailwind,
  TypeScript, JSON, and Markdown. No server is required.
- AI Rules generates a complete `AI_INTERFACE_BRIEF.md` for coding agents.
- Export generates Vite + React and Next.js + shadcn starters with a real page section and a live
  preview.
- Export and import Figma variables through a documented JSON file.
- The shell adapts to narrow screens with a horizontal module bar and hidden secondary panels.
- `/projects` lists local projects and supports create, open, duplicate, and delete. A project
  is created automatically when none exists.

## Next milestones

### 1. Extensibility

- Add a plugin API for modules and exporters.
- Ship a component-level preview surface.
- Add more framework starters and token importers.
- Expand accessibility and keyboard-first coverage.

## Open-core boundary

This repository remains the local editor:

- React/Vite shell and shared UI
- design-system model and tokens
- Zustand state and local history
- Dexie/IndexedDB persistence and autosave
- landing page, documentation, tests

The hosted service remains separate:

- accounts, JWT/OAuth, MFA
- organizations, RLS, audit
- FedaPay billing and webhooks
- cloud sync, collaboration, community
- deployment, secrets, operations

See [OPEN_CORE.md](https://github.com/BlackBenAI/saas-ui/blob/main/OPEN_CORE.md).

## Non-goals for this repository

- becoming a backend application;
- adding a login wall to the editor;
- replacing local persistence with a cloud-only model;
- inventing product metrics or customers for the landing page.

## Proposing a change

Open an issue with the problem, the proposed behavior, and the local-first impact. For large
changes, agree on the approach before writing a large patch.
