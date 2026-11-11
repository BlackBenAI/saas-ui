# Roadmap

The open-source editor ships in small, honest increments. Each step must leave the local editor
usable on its own.

## Current status

| Area | Status |
|---|---|
| Editor shell | Available |
| Project naming | Available |
| Undo/redo and local history | Available |
| Sidebar and properties collapse | Available |
| Overview module | Available |
| IndexedDB autosave | Available |
| Reload persistence | Available |
| Other nine modules | Scaffolded, disabled |
| Export formats | Next public milestone |
| Responsive editing | Planned |
| Cloud, collaboration, billing | Separate hosted service |

## Next milestones

### 1. Remaining modules

Implement the module surfaces against the existing token model:

- Colors
- Typography
- Layout
- Components
- Effects
- Motion
- Assets
- AI Rules

Each module should update the same store, participate in history, and persist locally.

### 2. Export generation

Add deterministic exports for:

- CSS custom properties
- Tailwind config
- TypeScript tokens
- JSON
- Markdown design brief

Exports must read from the local design system and must not require a server.

### 3. Responsive editor

The shell is desktop-first today. Improve narrow-screen behavior without hiding the local-first
guarantees or breaking keyboard access.

### 4. Quality and documentation

- Add tests for every new interaction.
- Keep screenshots and the demo video current.
- Keep the README and wiki aligned with the actual build.
- Add a contributor-friendly issue list.

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
- Stripe billing and webhooks
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
