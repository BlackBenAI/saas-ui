import { hexToRgb, rgbToHex } from "@/lib/color-utils";
import {
  buildTypographyRoles,
  normalizeDesignSystem,
  type DesignSystem,
  type DesignSystemColors,
} from "@/types/design-system";

export interface FigmaColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export type FigmaValue = FigmaColorValue | number | string | boolean;

export interface FigmaVariable {
  name: string;
  type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, FigmaValue>;
}

export interface FigmaCollection {
  name: string;
  modes: string[];
  variables: FigmaVariable[];
}

export interface FigmaVariablesFile {
  meta: { version: number; source: string };
  collections: FigmaCollection[];
}

const COLOR_KEYS: Array<keyof DesignSystemColors> = [
  "primary",
  "secondary",
  "background",
  "surface",
  "text",
  "muted",
  "success",
  "warning",
  "error",
];

function colorValue(hex: string): FigmaColorValue {
  const [r, g, b] = hexToRgb(hex);
  return { r: r / 255, g: g / 255, b: b / 255, a: 1 };
}

function hexFromValue(value: FigmaValue | undefined): string | null {
  if (!value || typeof value !== "object" || !("r" in value)) {
    return null;
  }
  const scale = [value.r, value.g, value.b].some((channel) => channel > 1) ? 1 : 255;
  return rgbToHex(value.r * scale, value.g * scale, value.b * scale);
}

function modeValue(variable: FigmaVariable, names: string[]): FigmaValue | undefined {
  const entries = Object.entries(variable.valuesByMode);
  for (const name of names) {
    const match = entries.find(([mode]) => mode.toLowerCase() === name.toLowerCase());
    if (match) return match[1];
  }
  return entries[0]?.[1];
}

function numeric(value: FigmaValue | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringValue(value: FigmaValue | undefined): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function exportFigmaVariables(ds: DesignSystem): string {
  const light = ds.lightColors ?? ds.colors;
  const dark = ds.darkColors;
  const typographyVariables: FigmaVariable[] = [
    { name: "heading-font", type: "STRING", valuesByMode: { Default: ds.typography.headingFont } },
    { name: "body-font", type: "STRING", valuesByMode: { Default: ds.typography.bodyFont } },
    { name: "mono-font", type: "STRING", valuesByMode: { Default: ds.typography.monoFont } },
    { name: "base-size", type: "FLOAT", valuesByMode: { Default: ds.typography.baseSize } },
    { name: "scale-ratio", type: "FLOAT", valuesByMode: { Default: ds.typography.scaleRatio } },
    { name: "heading-line-height", type: "FLOAT", valuesByMode: { Default: ds.typography.lineHeight.heading } },
    { name: "body-line-height", type: "FLOAT", valuesByMode: { Default: ds.typography.lineHeight.body } },
    { name: "heading-tracking", type: "FLOAT", valuesByMode: { Default: ds.typography.letterSpacing.heading } },
    { name: "body-tracking", type: "FLOAT", valuesByMode: { Default: ds.typography.letterSpacing.body } },
    ...Object.entries(ds.typography.scale).map(([key, value]) => ({
      name: `${key}-size`,
      type: "FLOAT" as const,
      valuesByMode: { Default: value },
    })),
    ...Object.entries(ds.typography.responsive).map(([key, value]) => ({
      name: `responsive-${key}`,
      type: "FLOAT" as const,
      valuesByMode: { Default: value },
    })),
  ];
  const componentVariables: FigmaVariable[] = Object.entries(ds.components.button).flatMap(
    ([size, token]) => [
      { name: `button-${size}-height`, type: "FLOAT" as const, valuesByMode: { Default: token.height } },
      { name: `button-${size}-padding-x`, type: "FLOAT" as const, valuesByMode: { Default: token.paddingX } },
      { name: `button-${size}-font-size`, type: "FLOAT" as const, valuesByMode: { Default: token.fontSize } },
      { name: `button-${size}-radius`, type: "FLOAT" as const, valuesByMode: { Default: token.radius } },
    ],
  );

  const file: FigmaVariablesFile = {
    meta: { version: 1, source: "SaaS-UI" },
    collections: [
      {
        name: "Colors",
        modes: ["Light", "Dark"],
        variables: COLOR_KEYS.map((key) => ({
          name: key,
          type: "COLOR",
          valuesByMode: { Light: colorValue(light[key]), Dark: colorValue(dark[key]) },
        })),
      },
      {
        name: "Typography",
        modes: ["Default"],
        variables: typographyVariables,
      },
      {
        name: "Spacing",
        modes: ["Default"],
        variables: Object.entries(ds.layout.spacing).map(([key, value]) => ({
          name: `space-${key}`,
          type: "FLOAT",
          valuesByMode: { Default: value },
        })),
      },
      {
        name: "Radius",
        modes: ["Default"],
        variables: Object.entries(ds.layout.radius).map(([key, value]) => ({
          name: `radius-${key}`,
          type: "FLOAT",
          valuesByMode: { Default: value },
        })),
      },
      {
        name: "Components",
        modes: ["Default"],
        variables: componentVariables,
      },
      {
        name: "Motion",
        modes: ["Default"],
        variables: [
          ...Object.entries(ds.motion.duration).map(([key, value]) => ({
            name: `duration-${key}`,
            type: "FLOAT" as const,
            valuesByMode: { Default: value },
          })),
          ...Object.entries(ds.motion.easing).map(([key, value]) => ({
            name: `easing-${key}`,
            type: "STRING" as const,
            valuesByMode: { Default: value },
          })),
        ],
      },
    ],
  };

  return JSON.stringify(file, null, 2);
}

export function parseFigmaVariables(text: string): FigmaVariablesFile {
  const parsed = JSON.parse(text) as Partial<FigmaVariablesFile>;
  if (!parsed || !Array.isArray(parsed.collections)) {
    throw new Error("This file does not contain Figma variable collections.");
  }
  return {
    meta: parsed.meta ?? { version: 1, source: "Figma" },
    collections: parsed.collections.filter(
      (collection): collection is FigmaCollection =>
        Boolean(collection) && typeof collection.name === "string" && Array.isArray(collection.variables),
    ),
  };
}

export function applyFigmaVariables(ds: DesignSystem, text: string): DesignSystem {
  const file = parseFigmaVariables(text);
  const variables = file.collections.flatMap((collection) => collection.variables);
  if (variables.length === 0) {
    throw new Error("No variables were found in this Figma file.");
  }

  const light: DesignSystemColors = { ...ds.lightColors };
  const dark: DesignSystemColors = { ...ds.darkColors };
  const typography = { ...ds.typography };
  const scale = { ...ds.typography.scale };
  const responsive = { ...ds.typography.responsive };
  const lineHeight = { ...ds.typography.lineHeight };
  const letterSpacing = { ...ds.typography.letterSpacing };
  const spacing = { ...ds.layout.spacing };
  const radius = { ...ds.layout.radius };
  const components = {
    button: {
      sm: { ...ds.components.button.sm },
      md: { ...ds.components.button.md },
      lg: { ...ds.components.button.lg },
    },
  };
  const duration = { ...ds.motion.duration };
  const easing = { ...ds.motion.easing };

  for (const variable of variables) {
    const name = normalizeName(variable.name);
    const value = modeValue(variable, ["Default", "Light", "Dark"]);
    const number = numeric(value);
    const textValue = stringValue(value);

    if (variable.type === "COLOR" && COLOR_KEYS.includes(name as keyof DesignSystemColors)) {
      const lightValue = hexFromValue(modeValue(variable, ["Light", "Default"]));
      const darkValue = hexFromValue(modeValue(variable, ["Dark"]));
      if (lightValue) light[name as keyof DesignSystemColors] = lightValue;
      if (darkValue) dark[name as keyof DesignSystemColors] = darkValue;
      continue;
    }

    if (name === "heading-font" || name === "headingfont") {
      if (textValue) typography.headingFont = textValue;
    } else if (name === "body-font" || name === "bodyfont") {
      if (textValue) typography.bodyFont = textValue;
    } else if (name === "mono-font" || name === "monofont") {
      if (textValue) typography.monoFont = textValue;
    } else if (name === "base-size" || name === "basesize") {
      if (number !== null) typography.baseSize = number;
    } else if (name === "scale-ratio" || name === "scaleratio") {
      if (number !== null) typography.scaleRatio = number;
    } else if (name === "heading-line-height") {
      if (number !== null) lineHeight.heading = number;
    } else if (name === "body-line-height") {
      if (number !== null) lineHeight.body = number;
    } else if (name === "heading-tracking") {
      if (number !== null) letterSpacing.heading = number;
    } else if (name === "body-tracking") {
      if (number !== null) letterSpacing.body = number;
    } else if (name.endsWith("-size") && name.slice(0, -5) in scale) {
      if (number !== null) scale[name.slice(0, -5) as keyof typeof scale] = number;
    } else if (name.startsWith("responsive-")) {
      if (number !== null) responsive[name.slice("responsive-".length)] = number;
    } else if (name.startsWith("space-") || name.startsWith("spacing-")) {
      if (number !== null) spacing[name.replace(/^spacing-|^space-/, "")] = number;
    } else if (name.startsWith("radius-")) {
      if (number !== null && name.slice(7) in radius) {
        radius[name.slice(7) as keyof typeof radius] = number;
      }
    } else if (name.startsWith("button-")) {
      const match = name.match(/^button-(sm|md|lg)-(height|padding-x|font-size|radius)$/);
      if (match && number !== null) {
        const [, size, property] = match;
        const target = components.button[size as keyof typeof components.button];
        const propertyKey =
          property === "padding-x"
            ? "paddingX"
            : property === "font-size"
              ? "fontSize"
              : (property as "height" | "radius");
        target[propertyKey] = number;
      }
    } else if (name.startsWith("duration-")) {
      if (number !== null) duration[name.slice(9)] = number;
    } else if (name.startsWith("easing-")) {
      if (textValue) easing[name.slice(7)] = textValue;
    }
  }

  const typographyNext = {
    ...typography,
    scale,
    responsive,
    lineHeight,
    letterSpacing,
    baseSize: typography.baseSize,
    scaleRatio: typography.scaleRatio,
    roles: buildTypographyRoles({
      headingFont: typography.headingFont,
      bodyFont: typography.bodyFont,
      monoFont: typography.monoFont,
      scale,
      weights: typography.weights,
      lineHeight,
      letterSpacing,
    }),
  };

  return normalizeDesignSystem({
    ...ds,
    colors: light,
    lightColors: light,
    darkColors: dark,
    typography: typographyNext,
    layout: { ...ds.layout, spacing, radius },
    components,
    motion: { ...ds.motion, duration, easing },
  });
}
