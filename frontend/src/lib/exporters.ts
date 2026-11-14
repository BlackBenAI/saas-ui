import { calculateContrast } from "@/lib/color-utils";
import { TYPOGRAPHY_ROLES, type DesignSystem } from "@/types/design-system";

export type ExportFormat = "json" | "markdown" | "css" | "tailwind" | "typescript";

function lightColors(ds: DesignSystem): DesignSystem["colors"] {
  return ds.lightColors ?? ds.colors;
}

function darkColors(ds: DesignSystem): DesignSystem["colors"] {
  return ds.darkColors;
}

function onColor(color: string): string {
  return calculateContrast("#FFFFFF", color) >= calculateContrast("#111111", color)
    ? "#FFFFFF"
    : "#111111";
}

export function exportJSON(ds: DesignSystem): string {
  return JSON.stringify(
    {
      ...ds,
      colors: lightColors(ds),
      lightColors: lightColors(ds),
      darkColors: darkColors(ds),
    },
    null,
    2,
  );
}

export function exportMarkdown(ds: DesignSystem): string {
  const colorTable = (colors: DesignSystem["colors"]) =>
    Object.entries(colors)
      .map(([key, value]) => `| ${key} | \`${value}\` |`)
      .join("\n");
  const light = lightColors(ds);
  const dark = darkColors(ds);
  const spacing = Object.entries(ds.layout.spacing)
    .map(([key, value]) => `| ${key} | ${value}px |`)
    .join("\n");
  return `# ${ds.name}

${ds.description}

## Colors — light

| Token | Value |
|---|---|
${colorTable(light)}

## Colors — dark

| Token | Value |
|---|---|
${colorTable(dark)}

## Text styles

| Role | Family | Size | Weight | Line height | Tracking |
|---|---|---:|---:|---:|---:|
${TYPOGRAPHY_ROLES.map((role) => {
  const style = ds.typography.roles[role];
  return `| ${role} | ${style.fontFamily} | ${style.fontSize}px | ${style.fontWeight} | ${style.lineHeight} | ${style.letterSpacing}em |`;
}).join("\n")}

## Responsive type ramp

| Breakpoint | Base size |
|---|---:|
${Object.entries(ds.typography.responsive)
  .map(([breakpoint, value]) => `| ${breakpoint} | ${value}px |`)
  .join("\n")}

## Typography

- Heading: ${ds.typography.headingFont}
- Body: ${ds.typography.bodyFont}
- Mono: ${ds.typography.monoFont}
- H1: ${ds.typography.scale.h1}px
- Body size: ${ds.typography.scale.body}px

## Spacing

| Token | Value |
|---|---|
${spacing}

## Radius

${Object.entries(ds.layout.radius)
  .map(([key, value]) => `- ${key}: ${value}px`)
  .join("\n")}

## Effects

${Object.entries(ds.effects.shadows)
  .map(([key, value]) => `- ${key}: \`${value}\``)
  .join("\n")}

## Motion

${Object.entries(ds.motion.duration)
  .map(([key, value]) => `- ${key}: ${value}ms`)
  .join("\n")}
`;
}

export function exportCSS(ds: DesignSystem, selector = ":root"): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(lightColors(ds))) {
    lines.push(`  --color-${key}: ${value};`);
  }
  lines.push(`  --color-on-primary: ${onColor(lightColors(ds).primary)};`);
  for (const role of TYPOGRAPHY_ROLES) {
    lines.push(`  --text-${role}: ${ds.typography.roles[role].fontSize}px;`);
  }
  for (const [key, value] of Object.entries(ds.layout.spacing)) {
    lines.push(`  --space-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(ds.layout.radius)) {
    lines.push(`  --radius-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(ds.effects.shadows)) {
    lines.push(`  --shadow-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(ds.motion.duration)) {
    lines.push(`  --duration-${key}: ${value}ms;`);
  }
  lines.push(`  --font-heading: "${ds.typography.headingFont}", sans-serif;`);
  lines.push(`  --font-body: "${ds.typography.bodyFont}", sans-serif;`);
  lines.push(`  --font-mono: "${ds.typography.monoFont}", monospace;`);

  const darkLines = Object.entries(darkColors(ds)).map(
    ([key, value]) => `  --color-${key}: ${value};`,
  );
  darkLines.push(`  --color-on-primary: ${onColor(darkColors(ds).primary)};`);

  const roleClasses = TYPOGRAPHY_ROLES.map((role) => {
    const style = ds.typography.roles[role];
    const declarations = [
      `  font-family: "${style.fontFamily}", ${role === "code" ? "monospace" : "sans-serif"};`,
      `  font-size: var(--text-${role});`,
      `  font-weight: ${style.fontWeight};`,
      `  line-height: ${style.lineHeight};`,
      `  letter-spacing: ${style.letterSpacing}em;`,
    ];
    if (style.textCase !== "none") declarations.push(`  text-transform: ${style.textCase};`);
    if (style.fontStyle !== "normal") declarations.push(`  font-style: ${style.fontStyle};`);
    if (style.textDecoration !== "none") declarations.push(`  text-decoration: ${style.textDecoration};`);
    if (style.textAlign !== "left") declarations.push(`  text-align: ${style.textAlign};`);
    const features = [
      style.features.ligatures ? '"liga" 1' : null,
      style.features.tabularNumbers ? '"tnum" 1' : null,
      style.features.smallCaps ? '"smcp" 1' : null,
      style.features.stylisticAlternates ? '"salt" 1' : null,
    ].filter(Boolean);
    if (features.length) declarations.push(`  font-feature-settings: ${features.join(", ")};`);
    if (style.textEffects.shadow !== "none") declarations.push(`  text-shadow: ${style.textEffects.shadow};`);
    if (style.textEffects.outline !== "none") {
      declarations.push(`  -webkit-text-stroke: ${style.textEffects.outline};`);
      declarations.push("  paint-order: stroke fill;");
    }
    if (style.textEffects.highlight !== "transparent") {
      declarations.push(`  background-color: ${style.textEffects.highlight};`);
      declarations.push("  padding: 0 0.15em;");
    }
    return `.text-${role} {\n${declarations.join("\n")}\n}`;
  });

  const base = Math.max(1, ds.typography.baseSize);
  const responsiveBlocks = Object.entries(ds.typography.responsive).map(
    ([breakpoint, baseSize]) => {
      const minWidth = ds.layout.breakpoints[breakpoint];
      if (!minWidth) return "";
      const factor = baseSize / base;
      const sizes = TYPOGRAPHY_ROLES.map(
        (role) =>
          `    --text-${role}: ${Math.round(ds.typography.roles[role].fontSize * factor)}px;`,
      ).join("\n");
      return `@media (min-width: ${minWidth}px) {\n  :root {\n${sizes}\n  }\n}`;
    },
  ).filter(Boolean);

  return `${selector} {\n${lines.join("\n")}\n}\n\n[data-theme="dark"], .dark {\n${darkLines.join("\n")}\n}\n\n${roleClasses.join("\n\n")}\n\n${responsiveBlocks.join("\n\n")}`;
}

export function exportTailwind(ds: DesignSystem): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: ${JSON.stringify({ ...lightColors(ds), dark: darkColors(ds) }, null, 6)},
      spacing: ${JSON.stringify(ds.layout.spacing, null, 6)},
      borderRadius: ${JSON.stringify(ds.layout.radius, null, 6)},
      boxShadow: ${JSON.stringify(ds.effects.shadows, null, 6)},
      fontSize: ${JSON.stringify(
        Object.fromEntries(
          TYPOGRAPHY_ROLES.map((role) => {
            const style = ds.typography.roles[role];
            return [
              role,
              [
                `var(--text-${role})`,
                {
                  lineHeight: String(style.lineHeight),
                  letterSpacing: `${style.letterSpacing}em`,
                  fontWeight: String(style.fontWeight),
                },
              ],
            ];
          }),
        ),
        null,
        6,
      )},
      fontFamily: {
        heading: ${JSON.stringify([ds.typography.headingFont])},
        body: ${JSON.stringify([ds.typography.bodyFont])},
        mono: ${JSON.stringify([ds.typography.monoFont])},
      },
    },
  },
};`;
}

export function exportTypeScript(ds: DesignSystem): string {
  return `export const tokens = ${JSON.stringify(
    {
      colors: lightColors(ds),
      lightColors: lightColors(ds),
      darkColors: darkColors(ds),
      typography: ds.typography,
      roles: ds.typography.roles,
      responsive: ds.typography.responsive,
      paragraph: ds.typography.paragraph,
      layout: ds.layout,
      effects: ds.effects,
      motion: ds.motion,
    },
    null,
    2,
  )} as const;

export type Tokens = typeof tokens;`;
}

export function buildExport(ds: DesignSystem, format: ExportFormat): string {
  switch (format) {
    case "json":
      return exportJSON(ds);
    case "markdown":
      return exportMarkdown(ds);
    case "css":
      return exportCSS(ds);
    case "tailwind":
      return exportTailwind(ds);
    case "typescript":
      return exportTypeScript(ds);
  }
}

export const EXPORT_FORMATS: Array<{
  id: ExportFormat;
  label: string;
  filename: string;
  mime: string;
  description: string;
}> = [
  { id: "json", label: "JSON", filename: "design-system.json", mime: "application/json", description: "Full re-importable design system." },
  { id: "markdown", label: "Markdown", filename: "design-system.md", mime: "text/markdown", description: "Human-readable documentation." },
  { id: "css", label: "CSS Variables", filename: "tokens.css", mime: "text/css", description: "`:root` custom properties." },
  { id: "tailwind", label: "Tailwind Config", filename: "tailwind.config.js", mime: "text/javascript", description: "Tailwind theme extension." },
  { id: "typescript", label: "TypeScript", filename: "tokens.ts", mime: "text/typescript", description: "Typed token constants." },
];
