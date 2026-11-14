# Contributing

SaaS-UI is an open-core project. This repository is the MIT-licensed local editor. The hosted
service is separate and proprietary.

## Before you start

- Read [Architecture](Architecture) and [Local-First Data](Local-First-Data).
- Keep the editor usable without an account, a network connection, or the hosted API.
- Do not add cloud-only gates, fake metrics, fake testimonials, decorative buttons, or emoji UI
  icons.
- UI copy and code identifiers are in English.

## Setup

```bash
git clone git@github.com:BlackBenAI/saas-ui.git
cd saas-ui/frontend
npm install
npm run dev
```

Open `http://localhost:5173/dashboard`.

## Checks before opening a pull request

```bash
cd frontend
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

All four must pass. Lint is configured with zero warnings.

## Pull requests

- Keep the change focused. Separate refactors from behavior changes.
- Explain the user-visible behavior and the local-first impact.
- Add or update tests for behavior you change.
- Include screenshots or a short recording for UI changes when useful.
- Do not commit `.env`, `node_modules`, `dist`, or generated local data.
- Do not include secrets, tokens, or private URLs.

## Commit style

The repository uses conventional prefixes:

```text
feat: add a new editor capability
fix: correct a broken interaction
docs: improve guides or comments
chore: maintenance without behavior change
test: add or adjust tests
```

## Code style

- TypeScript strict mode; no `any` unless there is a documented reason.
- Follow the existing component and store patterns.
- Prefer the existing `components/ui` primitives.
- Use Lucide icons, not emoji.
- Keep motion between 100 and 200 ms and respect reduced motion.
- Avoid new dependencies unless they are necessary and justified.

## Good first contributions

- Improve the editor shell for narrow screens.
- Add a module against the existing token model.
- Add export generation for CSS, Tailwind, TypeScript, JSON, or Markdown.
- Add tests for the autosave and restore flow.
- Improve keyboard navigation and focus behavior.
- Improve documentation without overstating current features.

## Scope boundaries

This repository does not accept:

- accounts, JWT/OAuth, or sessions;
- organizations, RLS, or audit logging;
- FedaPay billing or subscription management;
- cloud sync, collaboration, or community publishing;
- production deployment, secrets, or operational tooling.

Those belong to the separate hosted service. See
[OPEN_CORE.md](https://github.com/BlackBenAI/saas-ui/blob/main/OPEN_CORE.md).

## Reporting bugs

Open a public issue with:

- what you expected;
- what happened;
- the browser and Node.js version;
- steps to reproduce;
- the first console error, if any.

Do not open public issues for security vulnerabilities. See [Security](Security).

## Related

- [Roadmap](Roadmap)
- [FAQ](FAQ)
- [Design Principles](Design-Principles)
