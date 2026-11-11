# Design Principles

SaaS-UI should feel like a precision instrument, not a generic dashboard. These principles are
part of the product contract, not decoration.

## Visual system

- **Zinc-dominant surfaces.** Warm paper background, panel zinc sidebars, pure surface cards.
- **One indigo signal.** Indigo marks primary actions, selection, and focus. It is not used for
  decoration.
- **Borders before shadows.** Surfaces are flat at rest and separated by 1 px borders. Shadows
  are reserved for floating layers.
- **Moderate geometry.** 4 px badges, 8 px buttons and inputs, 12 px cards, 16 px dialogs.
- **No decorative gradients.** Prefer solid colors and structural separation.

## Typography

| Role | Family |
|---|---|
| Display | Manrope |
| UI and body | Inter |
| Values and code | JetBrains Mono |

Any value a developer could copy — hex colors, px, rem, ms, code — is set in JetBrains Mono.
Labels and buttons use Inter. Display type is reserved for marketing and page titles.

## Icons and controls

- Lucide icons only.
- No emoji as UI icons.
- Every button has a real action. No decorative buttons.
- Icon-only controls need an accessible label.
- Use the existing primitives in `components/ui` before adding new ones.

## Motion

- 100–200 ms for most UI transitions.
- Motion communicates state, not decoration.
- Respect `prefers-reduced-motion`.
- Avoid orchestrated page-load sequences in the editor; the user came to work.

## Accessibility

- Keyboard-operable controls with visible focus rings.
- 4.5:1 body text contrast and 3:1 large text contrast.
- Accessible names on icon controls.
- Skip links in the editor shell.
- No interaction that depends on color alone.
- Test with a keyboard and a screen reader when changing the shell.

## Copy

- UI language is English.
- Copy is direct, specific, and honest.
- Name the action in the control.
- Errors name the problem and the recovery.
- Never invent customers, testimonials, usage metrics, or benchmarks.
- Disabled features are labeled as unavailable, not disguised as working.

## Token model

The editor owns these token groups:

- colors
- typography
- layout (spacing, radius, breakpoints)
- effects (shadows, borders)
- motion (durations, easing)

The design system is the source of truth. A UI change that introduces a one-off color, font,
spacing, or radius is a regression unless the token model is updated first.

## Related

- [PRODUCT.md](https://github.com/BlackBenAI/saas-ui/blob/main/PRODUCT.md)
- [DESIGN.md](https://github.com/BlackBenAI/saas-ui/blob/main/DESIGN.md)
- [Architecture](Architecture)
