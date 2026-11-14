import { FolderOpen, HardDrive, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DESIGN_MODULES,
  GENERATE_MODULES,
  type EditorModuleEntry,
} from "@/components/layouts/editor-modules";
import { cn } from "@/lib/utils";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";
import { useUIStore } from "@/stores/useUIStore";

export function EditorSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const activeModule = useUIStore((state) => state.activeModule);
  const setActiveModule = useUIStore((state) => state.setActiveModule);
  const projectName = useDesignSystemStore((state) => state.designSystem.name);

  const renderModule = (module: EditorModuleEntry) => {
    const Icon = module.icon;
    const active = activeModule === module.id;

    return (
      <li key={module.id}>
        <button
          type="button"
          onClick={() => {
            setActiveModule(module.id);
            navigate(module.id === "overview" ? "/dashboard" : `/dashboard/${module.id}`);
          }}
          aria-current={active ? "page" : undefined}
          aria-label={collapsed ? module.label : undefined}
          title={module.label}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-120",
            active
              ? "bg-surface text-foreground shadow-[inset_2px_0_0_0_var(--accent)]"
              : "text-muted-foreground hover:bg-surface hover:text-foreground",
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
        "hidden min-h-0 shrink-0 flex-col border-r bg-background-secondary transition-[width] duration-180 lg:flex",
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

      <div className="min-h-0 flex-1 overflow-y-auto p-2 scrollbar-thin">
        <Link
          to="/projects"
          aria-current={pathname === "/projects" ? "page" : undefined}
          aria-label={collapsed ? "Projects" : undefined}
          title="Projects"
          className={cn(
            "mb-3 flex w-full items-center gap-2.5 rounded-md border border-accent/30 bg-accent-soft px-2 py-1.5 text-sm font-medium text-accent-hover transition-colors duration-120 hover:bg-accent-muted/40",
            collapsed && "justify-center px-0",
          )}
        >
          <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
          {collapsed ? null : <span className="truncate">Projects</span>}
        </Link>
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
            "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground",
            collapsed && "justify-center px-0",
          )}
          title={projectName}
        >
          <HardDrive className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {collapsed ? null : (
            <span className="min-w-0">
              <span className="block truncate font-medium text-foreground">{projectName}</span>
              <span className="block text-[10px]">Active project</span>
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
