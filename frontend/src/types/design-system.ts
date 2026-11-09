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
  };
}

export interface DesignSystemLayout {
  spacing: Record<string, number>;
  radius: { sm: number; md: number; lg: number; xl: number };
  breakpoints: Record<string, number>;
}

export interface DesignSystemEffects {
  shadows: Record<string, string>;
  borders: Record<string, string>;
}

export interface DesignSystemMotion {
  duration: Record<string, number>;
  easing: Record<string, string>;
}

export interface DesignSystem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  colors: DesignSystemColors;
  typography: DesignSystemTypography;
  layout: DesignSystemLayout;
  components: Record<string, unknown>;
  effects: DesignSystemEffects;
  motion: DesignSystemMotion;
}

export const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  id: "default",
  name: "Untitled Design System",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  colors: {
    primary: "#6366F1",
    secondary: "#18181B",
    background: "#FAFAF9",
    surface: "#FFFFFF",
    text: "#18181B",
    muted: "#A1A1AA",
    success: "#16A34A",
    warning: "#EA580C",
    error: "#DC2626",
  },
  typography: {
    headingFont: "Manrope",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    scale: { h1: 32, h2: 24, h3: 20, h4: 16, body: 14, small: 12 },
  },
  layout: {
    spacing: { "1": 4, "2": 8, "3": 12, "4": 16, "6": 24, "8": 32, "12": 48, "16": 64 },
    radius: { sm: 4, md: 8, lg: 12, xl: 16 },
    breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 },
  },
  components: {},
  effects: {
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.04)",
      md: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
      lg: "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)",
    },
    borders: {
      default: "1px solid #E4E4E7",
      strong: "1px solid #D4D4D8",
    },
  },
  motion: {
    duration: { tooltip: 100, hover: 120, tab: 150, panel: 180, modal: 200 },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.34, 1.2, 0.64, 1)",
    },
  },
};
