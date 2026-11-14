# Architecture

SaaS-UI is a browser-only React application. There is no backend in this repository.

## Runtime overview

```text
Browser
  React 18 + Vite + TypeScript
  ├─ React Router          / and /dashboard/*
  ├─ Zustand               design system, history, save status
  ├─ localStorage          fast hydration for preferences and current system
  ├─ Dexie / IndexedDB     durable local project records
  ├─ Editor shell          header, sidebar, canvas, properties, footer
  └─ Landing page          product overview and editor entry point
```

## Directory map

```text
frontend/
  src/
    components/
      layouts/             editor header, sidebar, canvas, properties, footer
      ui/                  shared primitives (button, input, badge, card...)
    pages/                 LandingPage, EditorPage, ProjectsPage
    stores/                useDesignSystemStore, useUIStore
    lib/                   autosave, Dexie database, constants, utilities
    styles/                design tokens and global CSS
    types/                 design-system data model
    __tests__/             Vitest setup and tests
  scripts/
    capture-demo.mjs       reproducible screenshots and WebM demo
```

## Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | `LandingPage` | Product overview and editor entry point |
| `/dashboard` | `EditorPage` | Local-first editor hub and shell |
| `/dashboard/:module` | `EditorPage` | Editor module inside the shared shell |
| `/projects` | `ProjectsPage` | Local project hub: create/open/duplicate/delete |
| `/editor`, `/editor/*` | redirect | Legacy aliases for `/dashboard` |
| `*` | `LandingPage` | Fallback |

The router is intentionally small. The editor is the product; the landing page is the front door.

## State

`useDesignSystemStore` owns the current design system, undo/redo history, and save status.
`useUIStore` owns panel visibility and the active module.

The design-system store is persisted through Zustand's `persist` middleware under the
`saas-ui-preferences` key. The full project record is also written to IndexedDB by
`useAutosave`.

## Persistence

There are two local layers:

1. **localStorage** — synchronous hydration for fast startup.
2. **IndexedDB via Dexie** — durable project records and the source used to restore the latest
   project on `/dashboard`.

The IndexedDB database is named `saas-ui` and contains `projects`, `assets`, and `fonts`
tables. The project record shape is defined in
[`frontend/src/lib/db.ts`](https://github.com/BlackBenAI/saas-ui/blob/main/frontend/src/lib/db.ts).

## Autosave flow

1. A token or project-name change updates Zustand immediately.
2. The store marks the project `unsaved`.
3. `useAutosave` waits 700 ms after the last change.
4. The project is written to IndexedDB.
5. The footer changes to **Saved locally**.

A reload reads the active project (or the most recently updated one) from IndexedDB and
hydrates the store. If no project exists, `ensureLocalProject()` creates one automatically. A failed
IndexedDB write sets the footer to **Save failed** without discarding the in-memory state.

## Editor shell

The desktop shell follows the visual contract in `DESIGN.md`:

- 56 px header
- 220 px collapsible module sidebar
- flexible canvas
- 300 px collapsible properties panel
- 32 px footer

On narrow screens the shell replaces the sidebar with a horizontal module bar and hides the
properties panel so the canvas keeps the available width. Desktop keeps the full three-panel
layout.

## Extension points

### Add a module

1. Add the module id and label to the types and sidebar.
2. Build the module surface as a React component.
3. Read tokens from `useDesignSystemStore`.
4. Add a test for the interaction, not only the render.
5. Keep the local-first and accessibility rules intact.

### Add a token field

1. Extend the `DesignSystem` type.
2. Add the default value.
3. Add store actions that update the value and history.
4. Render the control with an accessible label.
5. Add tests for the update and persistence behavior.

### Add an export format

Export generation reads from `useDesignSystemStore` and produces deterministic output. Handoff
starters and Figma variables live in `src/lib/handoff.ts` and `src/lib/figma.ts`; keep them pure
and avoid adding a network request or a server dependency.

## Build and verification

```bash
cd frontend
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

The production output is a static `dist/` directory. Any static host can serve it.

## Related

- [Local-First Data](Local-First-Data)
- [Design Principles](Design-Principles)
- [Contributing](Contributing)
