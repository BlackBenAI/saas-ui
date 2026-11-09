import { Download, Eye, Redo2, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

export function EditorHeader() {
  const name = useDesignSystemStore((state) => state.designSystem.name);
  const setProjectName = useDesignSystemStore((state) => state.setProjectName);
  const undo = useDesignSystemStore((state) => state.undo);
  const redo = useDesignSystemStore((state) => state.redo);
  const historyIndex = useDesignSystemStore((state) => state.historyIndex);
  const historyLength = useDesignSystemStore((state) => state.history.length);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3">
      <Link
        to="/"
        className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Back to SaaS Builder home"
      >
        <Logo />
      </Link>

      <Separator orientation="vertical" className="h-5" />

      <label htmlFor="project-name" className="sr-only">
        Project name
      </label>
      <input
        id="project-name"
        value={name}
        onChange={(event) => setProjectName(event.target.value)}
        maxLength={80}
        spellCheck={false}
        className="h-8 w-[min(280px,32vw)] rounded-sm border border-transparent bg-transparent px-2 text-sm font-medium text-foreground transition-colors duration-120 hover:border-border focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Preview is available in a later release."
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Preview
        </Button>
        <Button
          type="button"
          size="sm"
          disabled
          title="Export is available in a later release."
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Export
        </Button>
      </div>
    </header>
  );
}
