import { hexToHsl, hslToHex } from "@/lib/color-utils";

export interface DesignSystemColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
}

export const TYPOGRAPHY_ROLES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "lead",
  "body",
  "small",
  "label",
  "caption",
  "quote",
  "code",
] as const;

export type TypographyRole = (typeof TYPOGRAPHY_ROLES)[number];

export const TYPOGRAPHY_ROLE_LABELS: Record<TypographyRole, string> = {
  display: "Display",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  lead: "Lead",
  body: "Body",
  small: "Small",
  label: "Label",
  caption: "Caption",
  quote: "Quote",
  code: "Code",
};

export type TextCase = "none" | "uppercase" | "lowercase" | "capitalize";
export type FontStyle = "normal" | "italic";
export type TextDecoration = "none" | "underline" | "line-through";
export type TextAlign = "left" | "center" | "right" | "justify";

export interface TypographyFeatures {
  ligatures: boolean;
  tabularNumbers: boolean;
  smallCaps: boolean;
  stylisticAlternates: boolean;
}

export interface TypographyTextEffects {
  shadow: string;
  outline: string;
  highlight: string;
}

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textCase: TextCase;
  fontStyle: FontStyle;
  textDecoration: TextDecoration;
  textAlign: TextAlign;
  features: TypographyFeatures;
  textEffects: TypographyTextEffects;
}

export interface TypographyParagraph {
  spacing: number;
  indent: number;
  listSpacing: number;
  align: TextAlign;
}

export interface DesignSystemTypography {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scale: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    body: number;
    small: number;
    label: number;
    caption: number;
  };
  weights: { regular: number; medium: number; semibold: number; bold: number };
  lineHeight: { heading: number; body: number };
  letterSpacing: { heading: number; body: number };
  baseSize: number;
  scaleRatio: number;
  responsive: Record<string, number>;
  roles: Record<TypographyRole, TypographyStyle>;
  paragraph: TypographyParagraph;
}

export interface DesignSystemLayout {
  spacing: Record<string, number>;
  radius: { sm: number; md: number; lg: number; xl: number };
  breakpoints: Record<string, number>;
  containerMaxWidth: number;
}

export interface DesignSystemEffects {
  shadows: Record<string, string>;
  borders: Record<string, string>;
  transitions: Record<string, { duration: number; easing: string }>;
  backdropFilters: Record<string, string>;
  opacities: Record<string, number>;
}

export interface DesignSystemMotion {
  duration: Record<string, number>;
  easing: Record<string, string>;
  presets: Record<string, { duration: number; easing: string }>;
  reducedMotion: boolean;
}

export interface BrandBookContent {
  tagline: string;
  positioning: string;
  adjectives: string[];
  principles: Array<{ title: string; body: string }>;
  voice: string[];
  artDirection: {
    idea: string;
    composition: string;
    color: string;
    typography: string;
    imagery: string;
    imageRules: string[];
  };
}

export interface ButtonSizeToken {
  height: number;
  paddingX: number;
  fontSize: number;
  radius: number;
}

export interface TextBlock {
  id: string;
  role: TypographyRole;
  content: string;
  maxWidth: number;
}

export interface DesignSystemComponents {
  button: {
    sm: ButtonSizeToken;
    md: ButtonSizeToken;
    lg: ButtonSizeToken;
  };
}

export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  colors: DesignSystemColors;
  lightColors: DesignSystemColors;
  darkColors: DesignSystemColors;
  typography: DesignSystemTypography;
  layout: DesignSystemLayout;
  components: DesignSystemComponents;
  effects: DesignSystemEffects;
  motion: DesignSystemMotion;
  assets: { logos: string[]; illustrations: string[]; icons: string[] };
  textBlocks: TextBlock[];
  brandBook?: Partial<BrandBookContent>;
}

export const DEFAULT_LIGHT_COLORS: DesignSystemColors = {
  primary: "#4F46E5",
  secondary: "#18181B",
  background: "#FAFAF9",
  surface: "#FFFFFF",
  text: "#18181B",
  muted: "#6B6B73",
  success: "#15803D",
  warning: "#EA580C",
  error: "#DC2626",
};

export const DEFAULT_DARK_COLORS: DesignSystemColors = {
  primary: "#818CF8",
  secondary: "#E4E4E7",
  background: "#09090B",
  surface: "#18181B",
  text: "#FAFAF9",
  muted: "#A1A1AA",
  success: "#4ADE80",
  warning: "#FB923C",
  error: "#F87171",
};

function colorLift(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({
    h: hsl.h,
    s: Math.min(100, Math.max(0, hsl.s + 4)),
    l: Math.min(78, Math.max(38, hsl.l + amount)),
  });
}

export function deriveDarkColors(light: DesignSystemColors): DesignSystemColors {
  return {
    primary: colorLift(light.primary, 18),
    secondary: colorLift(light.secondary, 18),
    background: DEFAULT_DARK_COLORS.background,
    surface: DEFAULT_DARK_COLORS.surface,
    text: DEFAULT_DARK_COLORS.text,
    muted: DEFAULT_DARK_COLORS.muted,
    success: DEFAULT_DARK_COLORS.success,
    warning: DEFAULT_DARK_COLORS.warning,
    error: DEFAULT_DARK_COLORS.error,
  };
}

type TypographyBase = Omit<
  DesignSystemTypography,
  "baseSize" | "scaleRatio" | "responsive" | "roles" | "paragraph"
>;

function typographyStyle(
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  lineHeight: number,
  letterSpacing: number,
  extra: Partial<TypographyStyle> = {},
): TypographyStyle {
  return {
    fontFamily,
    fontSize: Math.round(fontSize),
    fontWeight,
    lineHeight,
    letterSpacing,
    textCase: "none",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    features: {
      ligatures: false,
      tabularNumbers: false,
      smallCaps: false,
      stylisticAlternates: false,
    },
    textEffects: { shadow: "none", outline: "none", highlight: "transparent" },
    ...extra,
  };
}

export function buildTypographyRoles(
  typography: TypographyBase,
): Record<TypographyRole, TypographyStyle> {
  const heading = typography.headingFont;
  const body = typography.bodyFont;
  const mono = typography.monoFont;
  const scale = typography.scale;
  const headingLine = typography.lineHeight.heading;
  const bodyLine = typography.lineHeight.body;
  const headingTrack = typography.letterSpacing.heading;
  const bodyTrack = typography.letterSpacing.body;

  return {
    display: typographyStyle(heading, scale.h1 * 1.25, 700, headingLine, headingTrack),
    h1: typographyStyle(heading, scale.h1, 700, headingLine, headingTrack),
    h2: typographyStyle(heading, scale.h2, 600, headingLine, headingTrack),
    h3: typographyStyle(heading, scale.h3, 600, headingLine, headingTrack),
    h4: typographyStyle(heading, scale.h4, 600, headingLine, headingTrack),
    h5: typographyStyle(heading, Math.max(12, scale.h4 * 0.9), 500, headingLine, headingTrack),
    h6: typographyStyle(heading, Math.max(11, scale.h4 * 0.8), 500, headingLine, headingTrack),
    lead: typographyStyle(body, scale.body * 1.25, 400, bodyLine, bodyTrack),
    body: typographyStyle(body, scale.body, 400, bodyLine, bodyTrack),
    small: typographyStyle(body, scale.small, 400, bodyLine, bodyTrack),
    label: typographyStyle(body, scale.label, 500, 1.4, 0.01),
    caption: typographyStyle(body, scale.caption, 400, 1.4, 0.01),
    quote: typographyStyle(body, scale.body * 1.15, 400, 1.5, 0, {
      fontStyle: "italic",
    }),
    code: typographyStyle(mono, Math.max(11, scale.body * 0.9), 400, 1.5, 0),
  };
}

const DEFAULT_TYPOGRAPHY_BASE: TypographyBase = {
  headingFont: "Manrope",
  bodyFont: "Inter",
  monoFont: "JetBrains Mono",
  scale: { h1: 32, h2: 24, h3: 20, h4: 16, body: 14, small: 12, label: 12, caption: 11 },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { heading: 1.15, body: 1.6 },
  letterSpacing: { heading: -0.02, body: 0 },
};

export const DEFAULT_TYPOGRAPHY: DesignSystemTypography = {
  ...DEFAULT_TYPOGRAPHY_BASE,
  baseSize: DEFAULT_TYPOGRAPHY_BASE.scale.body,
  scaleRatio: 1.25,
  responsive: { sm: 14, md: 15, lg: 16, xl: 17 },
  roles: buildTypographyRoles(DEFAULT_TYPOGRAPHY_BASE),
  paragraph: { spacing: 16, indent: 0, listSpacing: 8, align: "left" },
};

export const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  id: "default",
  name: "Untitled Design System",
  description: "A local-first design system.",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  colors: { ...DEFAULT_LIGHT_COLORS },
  lightColors: { ...DEFAULT_LIGHT_COLORS },
  darkColors: { ...DEFAULT_DARK_COLORS },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    scale: { ...DEFAULT_TYPOGRAPHY.scale },
    weights: { ...DEFAULT_TYPOGRAPHY.weights },
    lineHeight: { ...DEFAULT_TYPOGRAPHY.lineHeight },
    letterSpacing: { ...DEFAULT_TYPOGRAPHY.letterSpacing },
    roles: { ...DEFAULT_TYPOGRAPHY.roles },
    paragraph: { ...DEFAULT_TYPOGRAPHY.paragraph },
  },
  layout: {
    spacing: { "1": 4, "2": 8, "3": 12, "4": 16, "6": 24, "8": 32, "12": 48, "16": 64 },
    radius: { sm: 4, md: 8, lg: 12, xl: 16 },
    breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 },
    containerMaxWidth: 1280,
  },
  components: {
    button: {
      sm: { height: 28, paddingX: 12, fontSize: 12, radius: 6 },
      md: { height: 32, paddingX: 16, fontSize: 14, radius: 8 },
      lg: { height: 36, paddingX: 20, fontSize: 14, radius: 8 },
    },
  },
  effects: {
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.04)",
      md: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
      lg: "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)",
    },
    borders: {
      default: "1px solid #E4E4E7",
      strong: "1px solid #D4D4D8",
    },
    transitions: {
      fast: { duration: 120, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      standard: { duration: 180, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    },
    backdropFilters: { sm: "blur(4px)", md: "blur(8px)", lg: "blur(16px)" },
    opacities: { disabled: 50, muted: 70, overlay: 35 },
  },
  motion: {
    duration: { tooltip: 100, hover: 120, tab: 150, panel: 180, modal: 200 },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
    },
    presets: {
      "fade-in": { duration: 180, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      "slide-up": { duration: 200, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      "scale-in": { duration: 160, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
    reducedMotion: false,
  },
  assets: { logos: [], illustrations: [], icons: [] },
  textBlocks: [],
};


export function normalizeDesignSystem(input: Partial<DesignSystem> | null | undefined): DesignSystem {
  const value = input ?? {};
  const rawColors = {
    ...DEFAULT_LIGHT_COLORS,
    ...(value.colors ?? value.lightColors),
  };
  const activeIsDark = Boolean(
    value.colors &&
      value.lightColors &&
      value.darkColors &&
      (Object.keys(DEFAULT_LIGHT_COLORS) as Array<keyof DesignSystemColors>).every(
        (key) => value.colors?.[key] === value.darkColors?.[key],
      ),
  );
  const lightColors = activeIsDark
    ? { ...DEFAULT_LIGHT_COLORS, ...value.lightColors }
    : rawColors;
  const darkColors = {
    ...deriveDarkColors(lightColors),
    ...(value.darkColors ?? {}),
  };
  return {
    ...DEFAULT_DESIGN_SYSTEM,
    ...value,
    colors: lightColors,
    lightColors,
    darkColors,
    components: {
      ...DEFAULT_DESIGN_SYSTEM.components,
      ...value.components,
      button: {
        ...DEFAULT_DESIGN_SYSTEM.components.button,
        ...value.components?.button,
        sm: { ...DEFAULT_DESIGN_SYSTEM.components.button.sm, ...value.components?.button?.sm },
        md: { ...DEFAULT_DESIGN_SYSTEM.components.button.md, ...value.components?.button?.md },
        lg: { ...DEFAULT_DESIGN_SYSTEM.components.button.lg, ...value.components?.button?.lg },
      },
    },
    typography: (() => {
      const source: Partial<DesignSystemTypography> = value.typography ?? {};
      const base: TypographyBase = {
        headingFont: source.headingFont ?? DEFAULT_TYPOGRAPHY.headingFont,
        bodyFont: source.bodyFont ?? DEFAULT_TYPOGRAPHY.bodyFont,
        monoFont: source.monoFont ?? DEFAULT_TYPOGRAPHY.monoFont,
        scale: { ...DEFAULT_TYPOGRAPHY.scale, ...source.scale },
        weights: { ...DEFAULT_TYPOGRAPHY.weights, ...source.weights },
        lineHeight: { ...DEFAULT_TYPOGRAPHY.lineHeight, ...source.lineHeight },
        letterSpacing: { ...DEFAULT_TYPOGRAPHY.letterSpacing, ...source.letterSpacing },
      };
      const defaultRoles = buildTypographyRoles(base);
      const roles = Object.fromEntries(
        TYPOGRAPHY_ROLES.map((role) => {
          const sourceRole: Partial<TypographyStyle> = source.roles?.[role] ?? {};
          return [
            role,
            {
              ...defaultRoles[role],
              ...sourceRole,
              features: {
                ...defaultRoles[role].features,
                ...(sourceRole.features ?? {}),
              },
              textEffects: {
                ...defaultRoles[role].textEffects,
                ...(sourceRole.textEffects ?? {}),
              },
            },
          ];
        }),
      ) as Record<TypographyRole, TypographyStyle>;

      return {
        ...base,
        baseSize: source.baseSize ?? base.scale.body,
        scaleRatio: source.scaleRatio ?? DEFAULT_TYPOGRAPHY.scaleRatio,
        responsive: {
          ...DEFAULT_TYPOGRAPHY.responsive,
          ...(source.responsive ?? {}),
        },
        roles,
        paragraph: {
          ...DEFAULT_TYPOGRAPHY.paragraph,
          ...(source.paragraph ?? {}),
        },
      };
    })(),
    layout: {
      ...DEFAULT_DESIGN_SYSTEM.layout,
      ...value.layout,
      spacing: { ...DEFAULT_DESIGN_SYSTEM.layout.spacing, ...value.layout?.spacing },
      radius: { ...DEFAULT_DESIGN_SYSTEM.layout.radius, ...value.layout?.radius },
      breakpoints: {
        ...DEFAULT_DESIGN_SYSTEM.layout.breakpoints,
        ...value.layout?.breakpoints,
      },
    },
    effects: {
      ...DEFAULT_DESIGN_SYSTEM.effects,
      ...value.effects,
      shadows: { ...DEFAULT_DESIGN_SYSTEM.effects.shadows, ...value.effects?.shadows },
      borders: { ...DEFAULT_DESIGN_SYSTEM.effects.borders, ...value.effects?.borders },
      transitions: {
        ...DEFAULT_DESIGN_SYSTEM.effects.transitions,
        ...value.effects?.transitions,
      },
      backdropFilters: {
        ...DEFAULT_DESIGN_SYSTEM.effects.backdropFilters,
        ...value.effects?.backdropFilters,
      },
      opacities: { ...DEFAULT_DESIGN_SYSTEM.effects.opacities, ...value.effects?.opacities },
    },
    motion: {
      ...DEFAULT_DESIGN_SYSTEM.motion,
      ...value.motion,
      duration: { ...DEFAULT_DESIGN_SYSTEM.motion.duration, ...value.motion?.duration },
      easing: { ...DEFAULT_DESIGN_SYSTEM.motion.easing, ...value.motion?.easing },
      presets: { ...DEFAULT_DESIGN_SYSTEM.motion.presets, ...value.motion?.presets },
    },
    assets: { ...DEFAULT_DESIGN_SYSTEM.assets, ...value.assets },
    textBlocks: value.textBlocks ?? DEFAULT_DESIGN_SYSTEM.textBlocks,
  };
}
