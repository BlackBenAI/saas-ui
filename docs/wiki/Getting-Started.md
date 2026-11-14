# Getting Started

This guide takes you from a fresh clone to a saved local project.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Optional: Docker 24+ and Docker Compose v2
- A modern browser with IndexedDB support

## Run locally

```bash
git clone git@github.com:BlackBenAI/saas-ui.git
cd saas-ui/frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The editor is available at `http://localhost:5173/dashboard`.

## Run with Docker

From the repository root:

```bash
docker compose up --build
```

Open `http://localhost:3000`. To use another host port:

```bash
FRONTEND_PORT=3010 docker compose up --build
```

## First session

1. Open `/dashboard`. A local project is created automatically if none exists.
2. Open `/projects` to create, duplicate, or delete projects.
3. Click the project name in the header and rename it.
4. Wait for the footer to read **Saved locally**.
5. Reload the page. The project name and design system are restored from IndexedDB.
6. Use the sidebar and properties buttons to collapse and expand the panels.
7. Use undo and redo in the header to move through the local history.

All ten modules are interactive: Overview, Colors, Typography, Layout, Components, Effects,
Motion, Assets, AI Rules, and Export. Export any direction as CSS, Tailwind, TypeScript, JSON,
or Markdown. Export also builds Vite + React and Next.js + shadcn starters and a Figma variables
JSON file. See the [Roadmap](Roadmap) for what comes next.

## Commands

| Command | Purpose |
|---|---|
| `make install` | Install frontend dependencies |
| `make dev` | Start the Vite dev server |
| `make build` | Type-check and build the production bundle |
| `make preview` | Preview the production build |
| `make test` | Run the Vitest suite |
| `make lint` | Run ESLint with zero warnings |
| `make typecheck` | Run `tsc --noEmit` |
| `make up` | Build and start the frontend container |
| `make down` | Stop the container |
| `make logs` | Follow container logs |

You can also use npm directly from `frontend/`:

```bash
npm run dev
npm run build
npm run preview
npm run test -- --run
npm run lint
npm run typecheck
```

## Configuration

| Variable | Where | Purpose |
|---|---|---|
| `VITE_REPOSITORY_URL` | `frontend/.env.local` | Override the GitHub link in the UI |
| `FRONTEND_PORT` | shell or `.env` | Host port for the Docker frontend |

The local editor does not require an API URL, database, or authentication configuration.

## Troubleshooting

### Port 5173 is already in use

```bash
npm run dev -- --port 5174
```

### The page is blank or stuck on Loading

- Confirm Node.js 20+ with `node --version`.
- Delete `frontend/node_modules` and run `npm install` again.
- Check the browser console and the Vite terminal for the first error.

### The project does not persist

- Confirm the browser is not in a restricted private mode that blocks IndexedDB.
- Check DevTools → Application → IndexedDB → `saas-ui`.
- The footer should read **Saved locally** after a short debounce.

### I need to reset local data

Open DevTools → Application → Storage → Clear site data, or delete the `saas-ui` IndexedDB
database. This removes local projects permanently. See [Local-First Data](Local-First-Data).

## Next

- [Architecture](Architecture)
- [Local-First Data](Local-First-Data)
- [Contributing](Contributing)
