import { useEffect } from "react";

import { db } from "@/lib/db";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

const AUTOSAVE_DELAY_MS = 700;

export function useAutosave(): void {
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  const markSaving = useDesignSystemStore((state) => state.markSaving);
  const markSaved = useDesignSystemStore((state) => state.markSaved);
  const markError = useDesignSystemStore((state) => state.markError);

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      markSaving();
      try {
        await db.projects.put({
          id: designSystem.id,
          name: designSystem.name,
          designSystem,
          createdAt: designSystem.createdAt,
          updatedAt: designSystem.updatedAt,
          syncedToCloud: false,
        });
        if (!cancelled) {
          markSaved(new Date().toISOString());
        }
      } catch {
        if (!cancelled) {
          markError();
        }
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [designSystem, markError, markSaved, markSaving]);
}
