import { EditorCanvas } from "@/components/layouts/EditorCanvas";
import { EditorFooter } from "@/components/layouts/EditorFooter";
import { EditorHeader } from "@/components/layouts/EditorHeader";
import { EditorSidebar } from "@/components/layouts/EditorSidebar";
import { MobileModuleBar } from "@/components/layouts/MobileModuleBar";
import { PropertiesPanel } from "@/components/layouts/PropertiesPanel";
import type { ReactNode } from "react";

export function EditorLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <a
        href="#editor-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to canvas
      </a>
      <EditorHeader />
      <MobileModuleBar />
      <div className="flex min-h-0 flex-1">
        <EditorSidebar />
        <EditorCanvas>{children}</EditorCanvas>
        <PropertiesPanel />
      </div>
      <EditorFooter />
    </div>
  );
}
