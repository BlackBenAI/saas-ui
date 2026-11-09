import { EditorCanvas } from "@/components/layouts/EditorCanvas";
import { EditorFooter } from "@/components/layouts/EditorFooter";
import { EditorHeader } from "@/components/layouts/EditorHeader";
import { EditorSidebar } from "@/components/layouts/EditorSidebar";
import { PropertiesPanel } from "@/components/layouts/PropertiesPanel";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

export function EditorLayout() {
  const name = useDesignSystemStore((state) => state.designSystem.name);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <a
        href="#editor-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to canvas
      </a>
      <h1 className="sr-only">Editor — {name}</h1>
      <EditorHeader />
      <div className="flex min-h-0 flex-1">
        <EditorSidebar />
        <EditorCanvas />
        <PropertiesPanel />
      </div>
      <EditorFooter />
    </div>
  );
}
