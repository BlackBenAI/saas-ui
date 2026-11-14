import { HardDrive, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { EmptyState } from "@/components/EmptyState";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

export function EditorCanvas({ children }: { children?: ReactNode }) {
  const name = useDesignSystemStore((state) => state.designSystem.name);

  return (
    <main
      id="editor-canvas"
      className={cn(
        "canvas-grid flex min-h-0 min-w-0 flex-1 overflow-auto bg-background",
        children ? "items-stretch justify-start" : "items-center justify-center p-8",
      )}
      aria-label="Editor canvas"
    >
      {children ?? (
      <EmptyState
        icon={LayoutDashboard}
        title="Welcome to SaaS-UI"
        description="Start by selecting a module from the sidebar. This project is stored in your browser, not on a server."
      >
        <div className="inline-flex max-w-full items-center gap-2 rounded-md border bg-surface px-3 py-2 text-xs text-muted-foreground">
          <HardDrive className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate font-medium text-foreground">{name}</span>
          <span aria-hidden="true">·</span>
          <span>IndexedDB</span>
        </div>
      </EmptyState>
      )}
    </main>
  );
}
