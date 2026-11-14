import { AI_TEMPLATES, renderTemplate, templateVariables } from "@/lib/ai-templates";
import { buildBrandProfile, resolveBrandBookContent } from "@/lib/brand-guidance";
import { buildDesignQA } from "@/lib/design-qa";
import { exportCSS } from "@/lib/exporters";
import {
  TYPOGRAPHY_ROLES,
  TYPOGRAPHY_ROLE_LABELS,
  type DesignSystem,
  type TypographyStyle,
} from "@/types/design-system";

export const AGENT_BRIEF_FILENAME = "AI_INTERFACE_BRIEF.md";

const COLOR_USAGE: Record<string, string> = {
  primary: "Primary actions, active states, selection, and focus indicators. Never decoration.",
  secondary: "Strong secondary emphasis, dark surfaces, and high-contrast supporting elements.",
  background: "Page and section background. Let it carry most of the surface area.",
  surface: "Cards, panels, inputs, and floating layers.",
  text: "Headings and body content.",
  muted: "Metadata and supporting copy only when contrast meets AA.",
  success: "Positive status, confirmation, and completion.",
  warning: "Caution, pending, and attention states.",
  error: "Errors, destructive actions, and failure states.",
};

function roleFeatures(style: TypographyStyle): string {
  const features = [
    style.features.ligatures ? "liga" : null,
    style.features.tabularNumbers ? "tnum" : null,
    style.features.smallCaps ? "smcp" : null,
    style.features.stylisticAlternates ? "salt" : null,
  ].filter(Boolean);
  const effects = [
    style.textEffects.shadow !== "none" ? "shadow" : null,
    style.textEffects.outline !== "none" ? "outline" : null,
    style.textEffects.highlight !== "transparent" ? "highlight" : null,
  ].filter(Boolean);
  return [...features, ...effects].join(" + ") || "—";
}

function paletteTable(ds: DesignSystem, mode: "light" | "dark"): string {
  const colors = mode === "light" ? ds.lightColors ?? ds.colors : ds.darkColors;
  const profile = buildBrandProfile({ ...ds, colors });
  return `| Token | Hex | RGB | HSL | Contrast on background | Use for |
|---|---|---|---|---|---|
${profile.palette
  .map((color) => {
    const key = color.label.toLowerCase();
    return `| ${color.label} | \`${color.value}\` | ${color.rgb} | ${color.hsl} | ${color.contrastOnBackground.toFixed(2)}:1 | ${COLOR_USAGE[key] ?? "Semantic use only."} |`;
  })
  .join("\n")}`;
}

export function generateAgentBrief(ds: DesignSystem): string {
  const content = resolveBrandBookContent(ds);
  const qa = buildDesignQA(ds);
  const quickPrompt = renderTemplate(AI_TEMPLATES.system_prompt, templateVariables(ds));

  return `# ${ds.name} — AI interface directive

> Give this file to the coding agent before it writes or reviews any interface for ${ds.name}.
> It is the source of truth for color, type, layout, components, effects, motion, and accessibility.
> Do not replace its values with defaults from a framework, a template, or personal taste.

## Mission

You are the design lead and frontend engineer for **${ds.name}**.

Build the best possible interface for the task while making this design system unmistakable. The result should feel like the next page of the same product, not a generic dashboard with new colors.

- **Brand line:** ${content.tagline}
- **Positioning:** ${content.positioning}
- **Personality:** ${content.adjectives.join(" · ")}
- **Success:** a production-ready interface that uses only the tokens below, works in light and dark mode, meets WCAG 2.2 AA, and keeps the brand voice.

## Non-negotiable rules

1. Use only the colors, type roles, spacing steps, radii, shadows, and motion values in this document.
2. Never hardcode an off-palette hex, an off-scale spacing value, an arbitrary radius, or a new font.
3. Use the semantic role of a token, not its color name: primary means action, error means failure, muted means support.
4. Build both light and dark modes from the two palettes below. Do not derive dark mode with opacity or filters.
5. Borders come before shadows. Use shadows only for floating layers such as dialogs, menus, popovers, and the command palette.
6. Use Lucide icons only. Never use emoji as interface icons.
7. Keep motion between 100 and 200 ms unless the token says otherwise, and respect \`prefers-reduced-motion\`.
8. Use real content and honest labels. Never invent metrics, customers, testimonials, or product claims.
9. Keep body text at WCAG AA contrast in both modes. If a pair fails, fix the pair—not the rule.
10. Use the type roles exactly. Do not invent a new type style because a heading "looks better" larger.

## Brand

### Principles

${content.principles.map((item) => `#### ${item.title}\n\n${item.body}`).join("\n\n")}

### Voice

${content.voice.map((item) => `- ${item}`).join("\n")}

### Art direction

${content.artDirection.idea}

- **Composition:** ${content.artDirection.composition}
- **Color:** ${content.artDirection.color}
- **Typography:** ${content.artDirection.typography}
- **Imagery:** ${content.artDirection.imagery}
${content.artDirection.imageRules.map((item) => `- ${item}`).join("\n")}

## Palette — light

${paletteTable(ds, "light")}

## Palette — dark

${paletteTable(ds, "dark")}

### Color rules

- Primary is a signal, not a surface treatment. Use it for the action that matters, active states, and focus rings.
- Background and surface carry most of the page. Keep large fields quiet.
- Text is for reading; muted is for metadata. Never use muted for body copy that must be read.
- Success, warning, and error are status colors. They are not decorative accents.
- If a status color is used as a fill, use readable text on it (the contrast table above is the quickest reference).
- The warning color does not meet body-text contrast on the light background. Use it as a fill, a dot, or a border paired with a text label—never as the only carrier of meaning.
- Dark mode is a real palette. Re-check contrast rather than reusing light-mode assumptions.

## Typography

- **Heading family:** ${ds.typography.headingFont}
- **Body family:** ${ds.typography.bodyFont}
- **Mono family:** ${ds.typography.monoFont} (use it for values a developer can copy)
- **Base size:** ${ds.typography.baseSize}px
- **Scale ratio:** ${ds.typography.scaleRatio}
- **Weights:** regular ${ds.typography.weights.regular} / medium ${ds.typography.weights.medium} / semibold ${ds.typography.weights.semibold} / bold ${ds.typography.weights.bold}
- **Heading line height:** ${ds.typography.lineHeight.heading}
- **Body line height:** ${ds.typography.lineHeight.body}
- **Paragraph rhythm:** ${ds.typography.paragraph.spacing}px between paragraphs, ${ds.typography.paragraph.indent}px indent, ${ds.typography.paragraph.listSpacing}px list spacing, ${ds.typography.paragraph.align} alignment
- **Responsive base:** ${Object.entries(ds.typography.responsive)
    .map(([breakpoint, value]) => `${breakpoint}=${value}px`)
    .join(" · ")}

### Type roles

| Role | Family | Size | Weight | Line height | Tracking | Case | Features / effects |
|---|---|---:|---:|---:|---:|---|---|
${TYPOGRAPHY_ROLES.map((role) => {
  const style = ds.typography.roles[role];
  return `| ${TYPOGRAPHY_ROLE_LABELS[role]} (\`${role}\`) | ${style.fontFamily} | ${style.fontSize}px | ${style.fontWeight} | ${style.lineHeight} | ${style.letterSpacing}em | ${style.textCase} | ${roleFeatures(style)} |`;
}).join("\n")}

### Typography rules

- Use the heading family for display and headings, the body family for UI and prose, and the mono family for values, code, and measurements.
- Use the role that matches the job: \`display\` for the one page statement, \`h1\`–\`h6\` for hierarchy, \`lead\` for a short intro, \`body\` for reading, \`small\`/\`caption\` for support, \`label\` for controls, \`quote\` for pull quotes, and \`code\` for code.
- Keep prose measure around 65–75 characters. Do not stretch body copy across a full desktop canvas.
- Preserve the tracking, line height, case, OpenType features, text effects, and paragraph rhythm above.
- Keep the responsive base ramp. Do not replace it with fluid clamp typography.

## Layout

### Spacing scale

| Step | Value |
|---|---:|
${Object.entries(ds.layout.spacing)
  .map(([key, value]) => `| \`${key}\` | ${value}px |`)
  .join("\n")}

### Radius scale

| Token | Value |
|---|---:|
${Object.entries(ds.layout.radius)
  .map(([key, value]) => `| \`${key}\` | ${value}px |`)
  .join("\n")}

### Breakpoints

| Breakpoint | Min width |
|---|---:|
${Object.entries(ds.layout.breakpoints)
  .map(([key, value]) => `| \`${key}\` | ${value}px |`)
  .join("\n")}

- **Container max width:** ${ds.layout.containerMaxWidth}px
- Use spacing steps for padding, margin, and gaps. Do not invent 13px or 22px.
- Use radius tokens for every corner. Do not mix arbitrary radii in one surface.
- Responsive behavior is structural: stack columns, collapse navigation, and switch grids at the breakpoints above. Do not shrink type to make a desktop layout fit a phone.
- Design and test at 390px, 768px, and 1280px at minimum.

## Interface composition

When you build a new page, start from the system rather than from a layout template.

1. **One statement per view.** Use a display or h1 role for the page's main promise. Follow it with a lead, then body copy only where it helps a decision.
2. **One primary action per decision point.** Use the primary color for that action. Everything else is secondary, outline, or text.
3. **Sections before cards.** Use background, spacing, and 1px borders to separate regions. Reach for a card only for repeated items, floating content, or a bounded tool.
4. **Show the product.** Prefer a real interface surface, a diagram, or a concrete artifact over decorative illustration.
5. **Keep the rhythm.** Alternate dense and quiet regions; use the spacing scale to create breathing room; keep headings closer to their content than to the previous section.
6. **Close with a next step.** End the page with a clear action and a short reason to take it.

### Required states

Every screen needs its empty, loading, error, and success states designed with the same tokens. Do not ship a happy path only.

## Components

### Buttons

| Size | Height | Padding X | Font size | Radius |
|---|---:|---:|---:|---:|
| Small | ${ds.components.button.sm.height}px | ${ds.components.button.sm.paddingX}px | ${ds.components.button.sm.fontSize}px | ${ds.components.button.sm.radius}px |
| Default | ${ds.components.button.md.height}px | ${ds.components.button.md.paddingX}px | ${ds.components.button.md.fontSize}px | ${ds.components.button.md.radius}px |
| Large | ${ds.components.button.lg.height}px | ${ds.components.button.lg.paddingX}px | ${ds.components.button.lg.fontSize}px | ${ds.components.button.lg.radius}px |

Every interactive component needs **default, hover, focus-visible, active, disabled, loading, and error** where relevant.

### Component rules

- Primary buttons use the primary color with readable text; secondary buttons use a border and transparent or surface fill.
- Inputs use the surface color, the border token, the radius scale, and a visible focus ring.
- Cards use the surface color, a 1px border, and a radius token. Do not nest cards.
- Badges and status pills use semantic colors with readable text.
- Toggles use primary when on and muted when off; keep the focus ring visible.
- Touch targets should reach 44px on touch surfaces, even if the visual control is smaller.
- Every icon-only control needs an accessible name.

## Effects

### Shadows

| Token | Value | Use |
|---|---|---|
${Object.entries(ds.effects.shadows)
  .map(([key, value]) => `| \`${key}\` | \`${value}\` | Floating layers only. |`)
  .join("\n")}

### Borders

| Token | Value |
|---|---|
${Object.entries(ds.effects.borders)
  .map(([key, value]) => `| \`${key}\` | \`${value}\` |`)
  .join("\n")}

### Transitions

| Token | Duration | Easing |
|---|---:|---|
${Object.entries(ds.effects.transitions)
  .map(([key, value]) => `| \`${key}\` | ${value.duration}ms | \`${value.easing}\` |`)
  .join("\n")}

### Backdrop filters

${Object.entries(ds.effects.backdropFilters)
  .map(([key, value]) => `- \`${key}\`: \`${value}\``)
  .join("\n")}

### Opacity

${Object.entries(ds.effects.opacities)
  .map(([key, value]) => `- \`${key}\`: ${value}%`)
  .join("\n")}

## Motion

- **Duration tokens:** ${Object.entries(ds.motion.duration)
    .map(([key, value]) => `${key}=${value}ms`)
    .join(" · ")}
- **Easing tokens:** ${Object.entries(ds.motion.easing)
    .map(([key, value]) => `${key}=\`${value}\``)
    .join(" · ")}
- **Presets:** ${Object.entries(ds.motion.presets)
    .map(([key, value]) => `${key}=${value.duration}ms/${value.easing}`)
    .join(" · ")}
- **Reduced motion:** ${ds.motion.reducedMotion ? "enabled in the system" : "respect the operating-system preference"}

Motion communicates state: reveal, transition, feedback, loading. It is not a page-load performance. Avoid orchestrated sequences, decorative parallax, and hover effects that hide information.

## Accessibility

Target **WCAG 2.2 AA**.

- Body text and placeholders meet 4.5:1; large text and meaningful UI meet 3:1.
- Every interactive element has a visible \`:focus-visible\` style using the primary color.
- Keyboard order matches the visual order. Nothing important is hover-only.
- Every input has a label. Every icon-only button has an accessible name.
- Do not use color alone to communicate status. Pair it with text or an icon.
- Touch targets reach 44px where the interface is used on touch.
- Dialogs trap focus, restore it on close, and close with Escape.
- Respect \`prefers-reduced-motion\` and the system's reduced-motion token.
- Images have meaningful alt text unless they are decorative.

### Current QA report

**Score:** ${qa.score}/100 — ${qa.passed}/${qa.total} checks passing.

${qa.checks
  .map((check) => {
    const detail =
      check.status === "pass" ? check.detail.split(" — ")[0] : check.detail;
    return `- **${check.status === "pass" ? "PASS" : "WARN"}** — ${check.label}: ${detail}`;
  })
  .join("\n")}

## Definition of done

- [ ] Every color comes from the light or dark palette above.
- [ ] Both modes are implemented and checked for contrast.
- [ ] Every text style uses a role from the type table.
- [ ] Spacing, radii, shadows, and motion come from the token scales.
- [ ] Buttons, inputs, cards, badges, and toggles include their states.
- [ ] Focus is visible on every interactive element.
- [ ] The layout works at 390px, 768px, and 1280px.
- [ ] Touch targets reach 44px where needed.
- [ ] Reduced motion is respected.
- [ ] No fake metrics, customers, testimonials, or decorative controls.
- [ ] The interface reads in the brand voice above.
- [ ] No hardcoded off-system value remains in the final code.

## Quick system prompt

${quickPrompt}

## Reference CSS

\`\`\`css
${exportCSS(ds)}
\`\`\`
`;
}
