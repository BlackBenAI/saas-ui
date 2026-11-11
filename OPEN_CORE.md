# Open-core boundary

SaaS-UI is developed as an open-core product. This repository is the open-source
local-first editor. The hosted service is proprietary and lives in a separate private
repository.

## Open source in this repository (MIT)

- The React/Vite editor shell and the editor modules as they are implemented.
- The design-system data model, tokens, and local Zustand state.
- IndexedDB persistence, autosave, and local project loading.
- Local previews and export generation.
- Shared UI components, design documentation, and tests.
- The editor remains fully usable without an account, a network connection, or the hosted API.

## Proprietary hosted service

The following capabilities are not part of this repository and are not licensed under MIT:

- Accounts, JWT/OAuth authentication, and session management.
- Organizations, PostgreSQL row-level security, and audit logging.
- Stripe subscriptions, billing, invoices, and webhooks.
- Cloud sync, shared projects, real-time collaboration, and version history.
- Community publishing/moderation and admin operations.
- Production deployment, infrastructure, secrets, and operational tooling.

## Contract

The open-source editor must never require the proprietary service to start, edit, or export
a local design system. Cloud features are optional upgrades and must degrade gracefully when
the hosted service is unavailable.

Contributions to this repository are accepted under the MIT license.
