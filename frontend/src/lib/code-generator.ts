import type { DesignSystem } from "@/types/design-system";

export function generateButtonCode(variant = "default", size = "default"): string {
  return `<Button variant="${variant}" size="${size}">\n  Click me\n</Button>`;
}

export function generateCardCode(): string {
  return `<Card>\n  <CardHeader>\n    <CardTitle>Title</CardTitle>\n  </CardHeader>\n  <CardContent>Content here</CardContent>\n</Card>`;
}

export function generateTailwindConfig(ds: DesignSystem): string {
  const light = ds.lightColors ?? ds.colors;
  const dark = ds.darkColors;
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: ${JSON.stringify({ ...light, dark }, null, 8)},
      borderRadius: ${JSON.stringify(ds.layout.radius, null, 8)},
      spacing: ${JSON.stringify(ds.layout.spacing, null, 8)},
      boxShadow: ${JSON.stringify(ds.effects.shadows, null, 8)},
      fontFamily: {
        heading: ${JSON.stringify([ds.typography.headingFont])},
        body: ${JSON.stringify([ds.typography.bodyFont])},
        mono: ${JSON.stringify([ds.typography.monoFont])},
      },
    },
  },
  plugins: [],
};`;
}
