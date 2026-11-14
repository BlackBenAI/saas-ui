import { Lock, MousePointerClick, PanelRightClose, PanelRightOpen, SlidersHorizontal } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calculateContrast, checkWCAG } from "@/lib/color-utils";
import { cn } from "@/lib/utils";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";
import { useUIStore } from "@/stores/useUIStore";

const MODULE_LABELS: Record<string, string> = {
  overview: "Overview",
  colors: "Colors",
  typography: "Typography",
  layout: "Layout",
  components: "Components",
  effects: "Effects",
  motion: "Motion",
  assets: "Assets",
  "ai-rules": "AI Rules",
  export: "Export",
};

export function PropertiesPanel() {
  const collapsed = useUIStore((state) => state.propertiesCollapsed);
  const toggleProperties = useUIStore((state) => state.toggleProperties);
  const activeModule = useUIStore((state) => state.activeModule);
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  const name = designSystem.name;
  const activeLabel = activeModule ? MODULE_LABELS[activeModule] : null;
  const contrast = calculateContrast(designSystem.colors.text, designSystem.colors.background);
  const wcag = checkWCAG(contrast);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-l bg-background transition-[width] duration-180 xl:flex",
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
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 scrollbar-thin">
          {activeLabel ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-surface text-accent-hover">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{activeLabel}</h3>
                  <p className="text-[11px] text-muted-foreground">Live token context</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Primary</dt>
                  <dd className="inline-flex items-center gap-1.5 font-mono">
                    <span
                      className="h-3 w-3 rounded-sm border"
                      style={{ background: designSystem.colors.primary }}
                    />
                    {designSystem.colors.primary}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Heading font</dt>
                  <dd className="font-medium">{designSystem.typography.headingFont}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">H1</dt>
                  <dd className="font-mono">{designSystem.typography.scale.h1}px</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Radius</dt>
                  <dd className="font-mono">{designSystem.layout.radius.md}px</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Contrast</dt>
                  <dd className="inline-flex items-center gap-1.5 font-mono">
                    {contrast.toFixed(2)}:1
                    <span className={wcag.aa ? "text-success" : "text-warning"}>
                      {wcag.aa ? "AA" : wcag.aaLarge ? "AA Large" : "Fail"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <EmptyState
              icon={MousePointerClick}
              title="No module selected"
              description="Select a module to inspect and edit its tokens."
              className="mx-auto py-6"
            />
          )}

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
