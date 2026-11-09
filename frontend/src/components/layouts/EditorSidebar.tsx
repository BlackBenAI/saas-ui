import {
  Blocks,
  Bot,
  FileCode2,
  HardDrive,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Type,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/useUIStore";
import type { ModuleId } from "@/types";

interface ModuleEntry {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
}

const DESIGN_MODULES: ModuleEntry[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "components", label: "Components", icon: Blocks },
  { id: "effects", label: "Effects", icon: Sparkles },
  { id: "motion", label: "Motion", icon: Waypoints },
  { id: "assets", label: "Assets", icon: ImageIcon },
];

const GENERATE_MODULES: ModuleEntry[] = [
  { id: "ai-rules", label: "AI Rules", icon: Bot },
  { id: "export", label: "Export", icon: FileCode2 },
];

export function EditorSidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const activeModule = useUIStore((state) => state.activeModule);
  const setActiveModule = useUIStore((state) => state.setActiveModule);

  const renderModule = (module: ModuleEntry) => {
    const Icon = module.icon;
    const active = activeModule === module.id;
    const available = module.id === "overview";

    return (
      <li key={module.id}>
        <button
          type="button"
          disabled={!available}
          onClick={() => setActiveModule(module.id)}
          aria-current={active ? "page" : undefined}
          aria-label={collapsed ? module.label : undefined}
          title={available ? module.label : `${module.label} arrives in a later release.`}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-120",
            active
              ? "bg-surface text-foreground shadow-[inset_1px_0_0_0_var(--accent)]"
              : "text-muted-foreground hover:bg-surface hover:text-foreground",
            !available && "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-muted-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {collapsed ? null : <span className="truncate">{module.label}</span>}
        </button>
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r bg-background-secondary transition-[width] duration-180",
        collapsed ? "w-14" : "w-[220px]",
      )}
      aria-label="Editor modules"
    >
      <div className={cn("flex h-10 items-center border-b px-2", collapsed && "justify-center")}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
        {collapsed ? null : (
          <span className="ml-1 text-xs font-medium text-muted-foreground">Modules</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {collapsed ? null : (
          <p className="px-2 pb-1 pt-1 text-[11px] font-medium text-muted-foreground">Design</p>
        )}
        <ul className="space-y-0.5">{DESIGN_MODULES.map(renderModule)}</ul>

        {collapsed ? (
          <div className="my-2 h-px bg-border" />
        ) : (
          <p className="px-2 pb-1 pt-4 text-[11px] font-medium text-muted-foreground">Generate</p>
        )}
        <ul className="space-y-0.5">{GENERATE_MODULES.map(renderModule)}</ul>
      </div>

      <div className={cn("border-t p-2", collapsed && "flex justify-center")}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground",
            collapsed && "px-0",
          )}
          title="Projects are stored in this browser."
        >
          <HardDrive className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {collapsed ? null : <span>Local mode</span>}
        </div>
      </div>
    </aside>
  );
}
