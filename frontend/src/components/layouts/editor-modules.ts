import {
  Blocks,
  Bot,
  FileCode2,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Palette,
  Sparkles,
  Type,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import type { ModuleId } from "@/types";

export interface EditorModuleEntry {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
}

export const DESIGN_MODULES: EditorModuleEntry[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "components", label: "Components", icon: Blocks },
  { id: "effects", label: "Effects", icon: Sparkles },
  { id: "motion", label: "Motion", icon: Waypoints },
  { id: "assets", label: "Assets", icon: ImageIcon },
];

export const GENERATE_MODULES: EditorModuleEntry[] = [
  { id: "ai-rules", label: "AI Rules", icon: Bot },
  { id: "export", label: "Export", icon: FileCode2 },
];

export const EDITOR_MODULES: EditorModuleEntry[] = [...DESIGN_MODULES, ...GENERATE_MODULES];
