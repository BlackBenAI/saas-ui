import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { EditorLayout } from "@/components/layouts/EditorLayout";
import { useAutosave } from "@/lib/autosave";
import { db } from "@/lib/db";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

export function EditorPage() {
  const loadFromCloud = useDesignSystemStore((state) => state.loadFromCloud);
  useAutosave();

  useEffect(() => {
    let cancelled = false;

    async function loadLocalProject() {
      try {
        const latest = await db.projects.orderBy("updatedAt").last();
        if (latest && !cancelled) {
          loadFromCloud(latest.designSystem);
        }
      } catch {
        // IndexedDB may be unavailable (private mode). The editor still works in memory.
      }
    }

    void loadLocalProject();

    return () => {
      cancelled = true;
    };
  }, [loadFromCloud]);

  return (
    <>
      <Helmet>
        <title>Editor · SaaS Builder</title>
        <meta
          name="description"
          content="Edit your design system locally in SaaS Builder. No account required."
        />
      </Helmet>
      <EditorLayout />
    </>
  );
}
