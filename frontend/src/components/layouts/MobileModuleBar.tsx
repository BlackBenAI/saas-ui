import { FolderOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { EDITOR_MODULES } from "@/components/layouts/editor-modules";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/useUIStore";

export function MobileModuleBar() {
  const navigate = useNavigate();
  const activeModule = useUIStore((state) => state.activeModule);
  const setActiveModule = useUIStore((state) => state.setActiveModule);

  return (
    <nav
      aria-label="Editor modules"
      className="flex shrink-0 gap-1 overflow-x-auto border-b bg-background-secondary px-2 py-1.5 scrollbar-thin lg:hidden"
    >
      <Link
        to="/projects"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors duration-120 hover:bg-surface hover:text-foreground"
      >
        <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
        Projects
      </Link>
      {EDITOR_MODULES.map((module) => {
        const Icon = module.icon;
        const active = activeModule === module.id;
        return (
          <button
            key={module.id}
            type="button"
            onClick={() => {
              setActiveModule(module.id);
              navigate(module.id === "overview" ? "/dashboard" : `/dashboard/${module.id}`);
            }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors duration-120 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-surface text-foreground shadow-[inset_0_-2px_0_0_var(--accent)]"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {module.label}
          </button>
        );
      })}
    </nav>
  );
}
