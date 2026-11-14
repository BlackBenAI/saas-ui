import {
  calculateContrast,
  checkWCAG,
  formatHsl,
  formatRgb,
  hexToHsl,
} from "@/lib/color-utils";
import type { BrandBookContent, DesignSystem } from "@/types/design-system";

export type ContrastPair = {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
};

export type PaletteRow = {
  key: string;
  label: string;
  value: string;
  rgb: string;
  hsl: string;
  contrastOnBackground: number;
};

export type TypeRow = {
  token: string;
  size: number;
  weight: number;
  lineHeight: number;
  use: string;
};

export type ErgonomicsCheck = {
  label: string;
  status: "pass" | "warn";
  detail: string;
};

export type BrandProfile = {
  tagline: string;
  positioning: string;
  adjectives: string[];
  temperature: string;
  energy: string;
  form: string;
  typeCharacter: string;
  palette: PaletteRow[];
  contrastPairs: ContrastPair[];
  typeRows: TypeRow[];
  voice: string[];
  principles: Array<{ title: string; body: string }>;
  artDirection: {
    idea: string;
    composition: string;
    color: string;
    typography: string;
    imagery: string;
     imageRules: string[];
  };
  ergonomics: {
    checks: ErgonomicsCheck[];
    touchTarget: number;
    bodySize: number;
    measure: string;
    focusRule: string;
    breakpoints: Array<{ name: string; value: number }>;
  };
};

function readableOn(color: string): string {
  return calculateContrast("#FFFFFF", color) >= calculateContrast("#111111", color)
    ? "#FFFFFF"
    : "#111111";
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function readableTextOn(color: string): string {
  return readableOn(color);
}

export function resolveBrandBookContent(ds: DesignSystem): BrandBookContent {
  const generated = buildBrandProfile(ds);
  return {
    tagline: ds.brandBook?.tagline ?? generated.tagline,
    positioning: ds.brandBook?.positioning ?? generated.positioning,
    adjectives: ds.brandBook?.adjectives ?? generated.adjectives,
    principles: ds.brandBook?.principles ?? generated.principles,
    voice: ds.brandBook?.voice ?? generated.voice,
    artDirection: {
      ...generated.artDirection,
      ...ds.brandBook?.artDirection,
      imageRules:
        ds.brandBook?.artDirection?.imageRules ?? generated.artDirection.imageRules,
    },
  };
}

export function buildBrandProfile(ds: DesignSystem): BrandProfile {
  const bestFor = ["digital products", "brand systems"];
  const primaryHsl = hexToHsl(ds.colors.primary);
  const radius = ds.layout.radius.md;
  const isDark = hexToHsl(ds.colors.background).l < 35;
  const heading = ds.typography.headingFont.toLowerCase();
  const typeCharacter = /lora|cormorant|serif|playfair|newsreader/.test(heading)
    ? "Editorial"
    : /mono|space grotesk|jetbrains|plex/.test(heading)
      ? "Technical"
      : "Humanist geometric";
  const temperature =
    primaryHsl.h < 70 || primaryHsl.h > 330
      ? "Warm"
      : primaryHsl.h > 160 && primaryHsl.h < 270
        ? "Cool"
        : "Balanced";
  const energy =
    primaryHsl.s > 65 ? "High signal" : primaryHsl.s > 35 ? "Measured" : "Quiet";
  const form = radius >= 14 ? "Soft" : radius <= 5 ? "Precise" : "Balanced";

  const personality = new Set<string>();
  if (isDark) {
    personality.add("Focused");
    personality.add("Immersive");
  } else {
    personality.add("Open");
    personality.add("Grounded");
  }
  if (temperature === "Warm") personality.add("Human");
  if (temperature === "Cool") personality.add("Composed");
  if (temperature === "Balanced") personality.add("Adaptable");
  if (energy === "High signal") personality.add("Direct");
  if (energy === "Quiet") personality.add("Restrained");
  if (typeCharacter === "Editorial") {
    personality.add("Considered");
    personality.add("Expressive");
  }
  if (typeCharacter === "Technical") {
    personality.add("Exact");
    personality.add("Systematic");
  }
  if (typeCharacter === "Humanist geometric") personality.add("Approachable");
  if (form === "Soft") personality.add("Generous");
  if (form === "Precise") personality.add("Focused");

  const adjectives = Array.from(personality).slice(0, 6);
  const textOnBackground = calculateContrast(ds.colors.text, ds.colors.background);
  const mutedOnBackground = calculateContrast(ds.colors.muted, ds.colors.background);
  const textOnSurface = calculateContrast(ds.colors.text, ds.colors.surface);
  const primaryOnBackground = calculateContrast(ds.colors.primary, ds.colors.background);
  const onPrimary = readableOn(ds.colors.primary);
  const primaryText = calculateContrast(onPrimary, ds.colors.primary);
  const errorOnBackground = calculateContrast(ds.colors.error, ds.colors.background);
  const successOnBackground = calculateContrast(ds.colors.success, ds.colors.background);

  const pairs: ContrastPair[] = [
    { label: "Body text on background", foreground: ds.colors.text, background: ds.colors.background, ratio: textOnBackground, ...checkWCAG(textOnBackground) },
    { label: "Text on surface", foreground: ds.colors.text, background: ds.colors.surface, ratio: textOnSurface, ...checkWCAG(textOnSurface) },
    { label: "Muted text on background", foreground: ds.colors.muted, background: ds.colors.background, ratio: mutedOnBackground, ...checkWCAG(mutedOnBackground) },
    { label: "Primary button text", foreground: onPrimary, background: ds.colors.primary, ratio: primaryText, ...checkWCAG(primaryText) },
    { label: "Primary accent on background", foreground: ds.colors.primary, background: ds.colors.background, ratio: primaryOnBackground, ...checkWCAG(primaryOnBackground) },
    { label: "Error text on background", foreground: ds.colors.error, background: ds.colors.background, ratio: errorOnBackground, ...checkWCAG(errorOnBackground) },
    { label: "Success text on background", foreground: ds.colors.success, background: ds.colors.background, ratio: successOnBackground, ...checkWCAG(successOnBackground) },
  ];

  const palette = (Object.entries(ds.colors) as Array<[keyof DesignSystem["colors"], string]>).map(
    ([key, value]) => ({
      key,
      label: titleCase(key),
      value,
      rgb: formatRgb(value),
      hsl: formatHsl(value),
      contrastOnBackground: calculateContrast(value, ds.colors.background),
    }),
  );

  const weights = ds.typography.weights;
  const scale = ds.typography.scale;
  const typeRows: TypeRow[] = [
    { token: "Display / H1", size: scale.h1, weight: weights.bold, lineHeight: ds.typography.lineHeight.heading, use: "One opening statement per page." },
    { token: "Headline / H2", size: scale.h2, weight: weights.semibold, lineHeight: ds.typography.lineHeight.heading, use: "Section titles and feature names." },
    { token: "Title / H3", size: scale.h3, weight: weights.semibold, lineHeight: ds.typography.lineHeight.heading, use: "Cards, panels, and subsections." },
    { token: "Subtitle / H4", size: scale.h4, weight: weights.medium, lineHeight: ds.typography.lineHeight.heading, use: "Supporting labels and compact headings." },
    { token: "Body", size: scale.body, weight: weights.regular, lineHeight: ds.typography.lineHeight.body, use: "Interface copy and documentation." },
    { token: "Small", size: scale.small, weight: weights.regular, lineHeight: ds.typography.lineHeight.body, use: "Metadata and secondary information." },
    { token: "Label", size: scale.label, weight: weights.medium, lineHeight: ds.typography.lineHeight.body, use: "Controls, fields, and navigation." },
    { token: "Caption", size: scale.caption, weight: weights.medium, lineHeight: ds.typography.lineHeight.body, use: "Short contextual notes. Use sparingly." },
  ];

  const idea = `A ${form.toLowerCase()}, ${temperature.toLowerCase()}-toned system for ${bestFor.join(", ").toLowerCase()}. ${titleCase(ds.colors.primary)} carries action; ${ds.colors.background} gives the work room; ${ds.typography.headingFont} gives the brand its ${typeCharacter.toLowerCase()} voice.`;
  const composition = `Compose on a ${ds.layout.breakpoints.lg}px desktop container with ${ds.layout.spacing["4"]}px base spacing. Separate regions with hairlines; reserve shadows for floating layers. Use ${form === "Soft" ? "generous" : form === "Precise" ? "tight, exact" : "moderate"} radius and keep the primary action visually singular.`;
  const colorRule = `Neutrals own most of the surface. ${titleCase(ds.colors.primary)} is the action color, ${titleCase(ds.colors.secondary)} supports emphasis, and ${titleCase(ds.colors.error)} is reserved for recovery. Never introduce a new accent without a functional job.`;
  const typeRule = `${ds.typography.headingFont} leads with ${typeCharacter.toLowerCase()} character; ${ds.typography.bodyFont} carries long-form reading. Keep the body measure between 65 and 75 characters. Use weight and space before adding another color.`;
  const imagery = "Show real interfaces, real work, and human artifacts. Prefer evidence over atmosphere: a product surface, a material detail, or a clear diagram beats a staged stock scene.";
  const imageRules = [
    "Use real screenshots or authored diagrams before stock photography.",
    "Keep photography natural, specific, and related to the work.",
    "Do not color-grade images into a generic blue or purple wash.",
    "Illustrations use the palette and the same line weight as the icons.",
  ];

  const checks: ErgonomicsCheck[] = [
    {
      label: "Body contrast",
      status: checkWCAG(textOnBackground).aa ? "pass" : "warn",
      detail: `${textOnBackground.toFixed(2)}:1 against the background.`,
    },
    {
      label: "Muted contrast",
      status: checkWCAG(mutedOnBackground).aa ? "pass" : "warn",
      detail: `${mutedOnBackground.toFixed(2)}:1. Raise it to at least 4.5:1.`,
    },
    {
      label: "Primary action contrast",
      status: checkWCAG(primaryText).aa ? "pass" : "warn",
      detail: `${primaryText.toFixed(2)}:1 with ${onPrimary === "#FFFFFF" ? "white" : "ink"} text.`,
    },
    {
      label: "Touch targets",
      status: "warn",
      detail: "Use 44×44px for primary mobile controls; 24×24px is the WCAG 2.2 AA minimum.",
    },
    {
      label: "Focus visibility",
      status: "pass",
      detail: "Use a 2px focus ring with a 2px offset and at least 3:1 change in contrast.",
    },
    {
      label: "Reduced motion",
      status: ds.motion.reducedMotion ? "pass" : "warn",
      detail: "Respect prefers-reduced-motion and keep essential transitions under 200ms.",
    },
  ];

  return {
    tagline: ds.brandBook?.tagline ?? "A clear system for the work ahead.",
    positioning:
      ds.description ||
      "A clear visual system that turns a direction into consistent interfaces.",
    adjectives,
    temperature,
    energy,
    form,
    typeCharacter,
    palette,
    contrastPairs: pairs,
    typeRows,
    voice: [
      "Lead with the outcome, not the mechanism.",
      "Prefer short, concrete verbs over abstract claims.",
      "Explain the next step before describing the feature.",
      temperature === "Warm" ? "Warmth comes from specificity, not exclamation marks." : "Confidence comes from clarity, not volume.",
    ],
    principles: [
      {
        title: "Clarity before decoration",
        body: "Every visual choice should make the next decision easier to see. If it only adds atmosphere, remove it.",
      },
      {
        title: "One system, many surfaces",
        body: "Buttons, cards, documents, and campaigns read from the same palette, type, spacing, and motion rules.",
      },
      {
        title: "Accessible by default",
        body: "Contrast, focus, labels, and target sizes are part of the brand expression, not a later quality pass.",
      },
      {
        title: "Space is a material",
        body: "Use the spacing scale to create rhythm. Whitespace is a hierarchy tool, not empty space to fill.",
      },
    ],
    artDirection: { idea, composition, color: colorRule, typography: typeRule, imagery, imageRules },
    ergonomics: {
      checks,
      touchTarget: 44,
      bodySize: scale.body,
      measure: "65–75 characters",
      focusRule: "2px ring, 2px offset, 3:1 minimum contrast change",
      breakpoints: Object.entries(ds.layout.breakpoints).map(([name, value]) => ({ name, value })),
    },
  };
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
