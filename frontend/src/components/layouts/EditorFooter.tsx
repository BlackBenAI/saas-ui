import { AlertCircle, Check, CircleDot, Loader2, Lock } from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

export function SaveIndicator() {
  const status = useDesignSystemStore((state) => state.status);
  const lastSavedAt = useDesignSystemStore((state) => state.lastSavedAt);

  const content = (() => {
    if (status === "saving") {
      return (
        <>
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          <span>Saving...</span>
        </>
      );
    }
    if (status === "unsaved") {
      return (
        <>
          <CircleDot className="h-3 w-3" aria-hidden="true" />
          <span>Unsaved changes</span>
        </>
      );
    }
    if (status === "error") {
      return (
        <>
          <AlertCircle className="h-3 w-3 text-destructive" aria-hidden="true" />
          <span className="text-destructive">Save failed</span>
        </>
      );
    }
    return (
      <>
        <Check className="h-3 w-3 text-success" aria-hidden="true" />
        <span>Saved locally</span>
        {lastSavedAt ? (
          <span className="text-muted-foreground">{formatRelativeTime(lastSavedAt)}</span>
        ) : null}
      </>
    );
  })();

  return (
    <span className="inline-flex items-center gap-1.5" aria-live="polite">
      {content}
    </span>
  );
}

export function EditorFooter() {
  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t bg-background px-3 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3">
        <SaveIndicator />
        <span aria-hidden="true" className="h-3 w-px bg-border" />
        <span className="inline-flex items-center gap-1.5" title="Cloud sync is opt-in.">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Cloud sync off
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>Local-first</span>
        <span className="font-mono">v0.1.0</span>
      </div>
    </footer>
  );
}
