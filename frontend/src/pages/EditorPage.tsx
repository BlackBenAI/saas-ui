import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { EditorLayout } from "@/components/layouts/EditorLayout";
import { useAutosave } from "@/lib/autosave";
import { ensureLocalProject, openLocalProject } from "@/lib/local-projects";
import { ModuleRouter } from "@/pages/editor/EditorModules";
import { useUIStore } from "@/stores/useUIStore";
import type { ModuleId } from "@/types";

const MODULE_IDS: ModuleId[] = [
  "overview",
  "colors",
  "typography",
  "layout",
  "components",
  "effects",
  "motion",
  "assets",
  "ai-rules",
  "export",
];

export function EditorPage() {
  const { module } = useParams();
  const setActiveModule = useUIStore((state) => state.setActiveModule);
  const activeModule = MODULE_IDS.includes(module as ModuleId)
    ? (module as ModuleId)
    : "overview";
  useAutosave();

  useEffect(() => {
    setActiveModule(activeModule);
  }, [activeModule, setActiveModule]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocalProject() {
      try {
        const record = await ensureLocalProject();
        if (!cancelled) {
          openLocalProject(record);
        }
      } catch {
        // IndexedDB may be unavailable (private mode). The editor still works in memory.
      }
    }

    void loadLocalProject();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Editor · SaaS-UI</title>
        <meta
          name="description"
          content="Edit your design system locally in SaaS-UI. No account required."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <EditorLayout>
        <ModuleRouter module={activeModule} />
      </EditorLayout>
    </>
  );
}
