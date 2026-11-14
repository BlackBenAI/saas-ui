import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/constants";
import type { ModuleId } from "@/types";

export type ThemeMode = "light" | "dark" | "system";
export type PreviewContext = "saas" | "landing" | "mobile" | "ecommerce" | "form" | "components";

interface UIStore {
  sidebarCollapsed: boolean;
  propertiesCollapsed: boolean;
  activeModule: ModuleId | null;
  commandPaletteOpen: boolean;
  theme: ThemeMode;
  previewContext: PreviewContext;
  toggleSidebar: () => void;
  toggleProperties: () => void;
  setActiveModule: (module: ModuleId | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setPreviewContext: (context: PreviewContext) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      propertiesCollapsed: false,
      activeModule: "overview",
      commandPaletteOpen: false,
      theme: "system",
      previewContext: "saas",
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleProperties: () =>
        set((state) => ({ propertiesCollapsed: !state.propertiesCollapsed })),
      setActiveModule: (module) => set({ activeModule: module }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setTheme: (theme) => set({ theme }),
      setPreviewContext: (previewContext) => set({ previewContext }),
    }),
    {
      name: STORAGE_KEYS.ui,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        propertiesCollapsed: state.propertiesCollapsed,
        activeModule: state.activeModule,
        theme: state.theme,
        previewContext: state.previewContext,
      }),
    },
  ),
);
