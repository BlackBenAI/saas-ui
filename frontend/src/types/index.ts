export type {
  DesignSystem,
  DesignSystemColors,
  DesignSystemEffects,
  DesignSystemLayout,
  DesignSystemMotion,
  DesignSystemTypography,
} from "@/types/design-system";

export type ModuleId =
  | "overview"
  | "colors"
  | "typography"
  | "layout"
  | "components"
  | "effects"
  | "motion"
  | "assets"
  | "ai-rules"
  | "export";

export interface ModuleDefinition {
  id: ModuleId;
  label: string;
}
