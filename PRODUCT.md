# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18 + Vite 5 + TypeScript 5, Tailwind CSS 3, shadcn/ui, Zustand, Motion for React, Dexie
(IndexedDB). The optional hosted service is a separate proprietary Django/PostgreSQL stack.

## Users

- Sarah, senior product designer: builds and maintains design systems all day, expects
  Figma-grade precision and keyboard speed.
- Marcus, frontend developer: prefers code to canvases, needs tokens he can paste into
  Tailwind/CSS/TypeScript.
- Aisha, indie hacker: solo founder who needs a coherent system quickly, without an account.
- Tom, team lead: shares a system with a team and needs cloud sync, collaboration, and audit.
- Lin, open-source contributor: explores and reuses public design systems under MIT.

## Product Purpose

SaaS-UI is a visual design-system editor that combines developer-grade precision with
the freedom of a creative tool. It lets a person define colors, typography, layout, components,
effects, motion, and assets, then preview and export the system in real time. Success means a
usable local editor with zero friction and a credible paid cloud path.

## Positioning

Local-first editing with no account wall, paired with production-grade exports and optional
cloud collaboration. The editor remains fully usable offline; the cloud is an upgrade, never a gate.

## Operating Context

People work in a desktop browser for long sessions, often with Figma, an IDE, and a terminal
open. They switch between visual decisions and code exports. Prices, plans, and capabilities
shown in the product are real product facts, not marketing filler.

## Capabilities and Constraints

- Ten editor modules: Overview, Colors, Typography, Layout, Components, Effects, Motion,
  Assets, AI Rules, Export.
- Local persistence in IndexedDB with debounced autosave; UI preferences in LocalStorage.
- Optional cloud: authentication, projects, Stripe tiers (Free/Team/Pro), collaboration.
- The hosted cloud, its multi-tenant RLS, billing, and deployment are proprietary and are not
  part of this repository. The open-source editor has no dependency on them.
- UI language is English. Code and identifiers are English.
- No invented statistics, testimonials, customers, or benchmarks.

## Brand Commitments

Name: SaaS-UI. Voice: professional, precise, honest, concise; never superlative. Visual
identity is pinned by ARTISTIC_DIRECTION.md, GRAPHIC_CHARTER.md, DESIGN_SYSTEM.md, and
MOTION_DESIGN.md: neutral zinc-dominant surfaces, restrained indigo accent, Manrope for display,
Inter for UI, JetBrains Mono for technical values, Lucide icons only, no emoji as UI icons,
no decorative gradients, borders over shadows.

## Evidence on Hand

Product and technical specifications exist in the repository (SECURITY.md, ARTISTIC_DIRECTION.md,
GRAPHIC_CHARTER.md, DESIGN_SYSTEM.md, MOTION_DESIGN.md, P6.1–P6.10). No customer logos,
testimonials, usage metrics, or press assets exist; future work must not fabricate them.

## Product Principles

- Local-first by design: never block the editor, never lose local work.
- Precision is the brand: tokens, values, and alignment are exact.
- Restraint is the aesthetic: neutrals carry the surface, indigo marks action.
- Every control does something real; no decorative buttons.
- The cloud is optional and explicit; consent precedes any upload.

## Accessibility & Inclusion

Target WCAG 2.2 AA: keyboard-operable everywhere, visible focus, 4.5:1 body contrast, ARIA
labels on icon controls, focus trapping in dialogs, and `prefers-reduced-motion` respected.
