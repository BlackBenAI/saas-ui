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

Not in the current open-source build. Export generation is the next public milestone in the
[Roadmap](Roadmap). The token model is already in place.

## Why are Colors, Typography, Layout, and the other modules disabled?

Because they are not implemented yet. The sidebar shows the target shape of the editor without
pretending the modules are finished. The Overview module is interactive today.

## Does it work on mobile?

The editor shell is desktop-first today. Responsive editing is planned. The landing page is
responsive; the editor is best used on a desktop browser for now.

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
