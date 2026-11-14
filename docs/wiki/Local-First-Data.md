# Local-First Data

SaaS-UI is local-first by contract: the editor must work without an account, without a network
connection, and without the hosted API. This page explains where data lives and how to reason
about it.

## Storage layers

| Layer | Technology | Used for |
|---|---|---|
| Fast hydration | localStorage | Current design system and last-saved timestamp |
| Durable projects | IndexedDB via Dexie | Project records used to restore the editor |
| UI preferences | localStorage | Panel visibility and active module |

The IndexedDB database is `saas-ui`. The project table is `projects`. The record contains:

```ts
interface ProjectRecord {
  id: string;
  name: string;
  designSystem: DesignSystem;
  createdAt: string;
  updatedAt: string;
  syncedToCloud: boolean;
  cloudId?: string;
}
```

`syncedToCloud` and `cloudId` are reserved for the separate hosted service. The open-source
editor does not call a cloud API.

## Autosave

- The debounce is 700 ms.
- Every token or project-name change marks the project unsaved.
- The write is local; no upload is attempted.
- A successful write updates the footer to **Saved locally**.
- A failed write shows **Save failed** and keeps the in-memory project intact.

The hook lives in
[`frontend/src/lib/autosave.ts`](https://github.com/BlackBenAI/saas-ui/blob/main/frontend/src/lib/autosave.ts).

## Restore on reload

`EditorPage` reads the most recently updated project from IndexedDB and loads it into the store.
That is why renaming a project, reloading, and finding the new name is a supported local-first
flow.

## History

The store keeps a 50-entry undo/redo history. History is local to the current session; it is not
a version-control system and does not create cloud versions.

## Migration from the pre-rebrand names

Earlier builds used `saas-builder-*` keys and a `saas-builder` IndexedDB database. The current
build migrates compatible data automatically:

- legacy localStorage keys are copied to `saas-ui-*` keys;
- legacy IndexedDB projects are copied to the `saas-ui` database when the new database is empty.

The legacy names remain only in the compatibility migration code. They are not product-facing.
See
[`frontend/src/lib/legacy-storage.ts`](https://github.com/BlackBenAI/saas-ui/blob/main/frontend/src/lib/legacy-storage.ts)
and
[`frontend/src/lib/db.ts`](https://github.com/BlackBenAI/saas-ui/blob/main/frontend/src/lib/db.ts).

## Privacy

- No telemetry.
- No analytics.
- No account.
- No API request from the local editor.
- Projects stay in the browser unless the user explicitly uses a separate hosted service.

## Backups and reset

There is no export button in the current open-source build. To preserve a project before
clearing browser data, keep the browser profile or inspect the IndexedDB record in DevTools.

To reset local data:

1. Open DevTools → Application → Storage.
2. Clear site data for the app origin, or delete the `saas-ui` IndexedDB database.
3. Reload `/dashboard`.

This is destructive. There is no server-side copy in the open-source build.

## Known limits

- Private browsing modes may restrict or discard IndexedDB.
- Two tabs editing the same project do not have cross-tab conflict resolution yet.
- Narrow-screen editing hides secondary panels behind the mobile module bar; complex token
  editing is still more comfortable on a desktop browser.
- Versioned backups are a roadmap item, not a current feature.

## Related

- [Architecture](Architecture)
- [Getting Started](Getting-Started)
- [FAQ](FAQ)
