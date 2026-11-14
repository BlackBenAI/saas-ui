export * from "@/types/design-system";

export interface HealthResponse {
  status: "ok" | "degraded";
  service: string;
  version: string;
  timestamp: string;
  db: string;
  rls_enabled: string;
  channels: string;
}

export interface HealthResult {
  body: HealthResponse;
  latencyMs: number;
}

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
