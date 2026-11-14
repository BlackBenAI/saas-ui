import type { DesignSystem } from "@/types/design-system";

export const AI_TEMPLATE_IDS = [
  "system_prompt",
  "frontend_agent",
  "backend_agent",
  "design_reviewer",
  "code_generator",
  "component_builder",
  "style_enforcer",
  "accessibility_checker",
] as const;

export type AITemplateId = (typeof AI_TEMPLATE_IDS)[number];

export const AI_TEMPLATE_LABELS: Record<AITemplateId, string> = {
  system_prompt: "System Prompt",
  frontend_agent: "Frontend Agent",
  backend_agent: "Backend Agent",
  design_reviewer: "Design Reviewer",
  code_generator: "Code Generator",
  component_builder: "Component Builder",
  style_enforcer: "Style Enforcer",
  accessibility_checker: "Accessibility Checker",
};

export const AI_TEMPLATES: Record<AITemplateId, string> = {
  system_prompt: `You are a design system enforcer for {{project_name}}.

## Colors
- Primary: {{primary_color}}
- Secondary: {{secondary_color}}
- Background: {{background_color}}
- Text: {{text_color}}
- Dark primary: {{dark_primary_color}}
- Dark background: {{dark_background_color}}
- Dark text: {{dark_text_color}}

## Typography
- Heading: {{heading_font}}
- Body: {{body_font}}
- Mono: {{mono_font}}

1. Use only the tokens above.
2. Implement both light and dark modes using the palettes above.
3. Maintain WCAG AA contrast in both modes.
4. Respect the spacing and radius scale.`,
  frontend_agent: `You are a frontend developer agent for {{project_name}}.

Stack: React, TypeScript, Tailwind CSS, shadcn/ui.
Primary: {{primary_color}}; Background: {{background_color}}; Text: {{text_color}}.
Heading font: {{heading_font}}; Body: {{body_font}}.
Never hardcode colors. Use the Tailwind theme and ensure keyboard accessibility.`,
  backend_agent: `You are a backend agent for {{project_name}}.

Expose design tokens as JSON. Validate hex colors. Preserve the token names used by the frontend. Primary token: {{primary_color}}.`,
  design_reviewer: `Review this UI against {{project_name}}.

Check palette discipline, typography hierarchy, spacing rhythm, contrast, and motion restraint. Flag off-palette colors and missing reduced-motion handling.`,
  code_generator: `Generate production React code for {{project_name}} using these tokens:
Primary {{primary_color}}, surface {{surface_color}}, text {{text_color}}, radius {{radius_md}}px, body {{body_font}}.`,
  component_builder: `Build a component for {{project_name}} using the existing design system. Use {{heading_font}} for labels and {{primary_color}} for the primary action. Include hover, focus, disabled, and loading states.`,
  style_enforcer: `Enforce the {{project_name}} style guide. Reject any color outside the palette, any radius outside {{radius_sm}}-{{radius_xl}}px, and durations outside {{duration_min}}-{{duration_max}}ms.`,
  accessibility_checker: `Audit {{project_name}} for WCAG 2.2 AA. Verify text contrast against {{background_color}}, focus visibility, keyboard order, labels, and reduced-motion behavior.`,
};

export function templateVariables(ds: DesignSystem): Record<string, string> {
  const durations = Object.values(ds.motion.duration);
  const light = ds.lightColors ?? ds.colors;
  const dark = ds.darkColors;
  return {
    project_name: ds.name,
    primary_color: light.primary,
    dark_primary_color: dark.primary,
    dark_background_color: dark.background,
    dark_text_color: dark.text,
    secondary_color: light.secondary,
    background_color: light.background,
    surface_color: light.surface,
    text_color: light.text,
    heading_font: ds.typography.headingFont,
    body_font: ds.typography.bodyFont,
    mono_font: ds.typography.monoFont,
    radius_sm: String(ds.layout.radius.sm),
    radius_md: String(ds.layout.radius.md),
    radius_lg: String(ds.layout.radius.lg),
    radius_xl: String(ds.layout.radius.xl),
    spacing_4: String(ds.layout.spacing["4"] ?? 16),
    duration_min: String(Math.min(...durations)),
    duration_max: String(Math.max(...durations)),
  };
}

export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => variables[key] ?? match);
}
