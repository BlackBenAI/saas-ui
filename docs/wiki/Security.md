# Security

## Reporting a vulnerability

Do not open a public issue for a security vulnerability.

Send a private report to **security@blackbenai.bj** with:

- a description of the issue;
- affected versions or commits;
- reproduction steps;
- impact and any suggested mitigation;
- whether you want public credit.

We will acknowledge the report and coordinate a fix before public disclosure.

## Scope

This repository is the local-first editor:

- React/Vite frontend;
- Zustand state;
- Dexie/IndexedDB persistence;
- static build and Docker frontend.

The hosted service is out of scope for this repository and has its own operational security.

## Local data

- Projects stay in the browser.
- There is no API client, telemetry, or analytics in this repository.
- Clearing site data deletes local projects permanently.
- Private browsing modes may restrict IndexedDB.

## Secrets

- Never commit `.env`, tokens, keys, or private URLs.
- `VITE_*` variables are public at build time; do not put secrets in them.
- The editor does not require a secret to run.

## Dependencies

- Run `npm audit` when changing dependencies.
- Keep dependencies minimal; the editor uses a small set of focused libraries.
- Review new packages before adding them.
- Do not add remote scripts, remote fonts, or third-party trackers without review.

## Rendering and input

- React escapes rendered text by default.
- Avoid `dangerouslySetInnerHTML` unless the content is fully trusted and sanitized.
- Do not execute user-provided code.
- Treat imported or pasted content as untrusted.
- Keep accessibility and security reviews together for shell changes.

## Build and deployment

- The production build is static; serve it over HTTPS.
- Do not expose source maps publicly unless you intend to.
- Keep the Docker frontend image updated with the Node base image.
- Do not add a backend to this repository without an explicit architecture decision.

## Supported versions

Security fixes target the latest `main` branch. If you maintain a fork, keep it current.

## Related

- [Contributing](Contributing)
- [Local-First Data](Local-First-Data)
- [Open-core boundary](https://github.com/BlackBenAI/saas-ui/blob/main/OPEN_CORE.md)
