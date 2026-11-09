import { Lock, MousePointerClick, PanelRightClose, PanelRightOpen } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";
import { useUIStore } from "@/stores/useUIStore";

export function PropertiesPanel() {
  const collapsed = useUIStore((state) => state.propertiesCollapsed);
  const toggleProperties = useUIStore((state) => state.toggleProperties);
  const name = useDesignSystemStore((state) => state.designSystem.name);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-l bg-background transition-[width] duration-180",
        collapsed ? "w-12" : "w-[300px]",
      )}
      aria-label="Properties"
    >
      <div
        className={cn(
          "flex h-10 items-center border-b px-2",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {collapsed ? null : (
          <h2 className="text-xs font-medium text-muted-foreground">Properties</h2>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleProperties}
          aria-label={collapsed ? "Expand properties panel" : "Collapse properties panel"}
          title={collapsed ? "Expand properties panel" : "Collapse properties panel"}
        >
          {collapsed ? (
            <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelRightClose className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {collapsed ? null : (
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 scrollbar-thin">
          <EmptyState
            icon={MousePointerClick}
            title="No module selected"
            description="Select a module to inspect and edit its tokens. Modules become available in later releases."
            className="mx-auto py-6"
          />

          <Separator />

          <dl className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Project</dt>
              <dd className="max-w-[160px] truncate font-medium text-foreground">{name}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Storage</dt>
              <dd className="font-medium text-foreground">IndexedDB</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Cloud sync</dt>
              <dd className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Off
              </dd>
            </div>
          </dl>
        </div>
      )}
    </aside>
  );
}
