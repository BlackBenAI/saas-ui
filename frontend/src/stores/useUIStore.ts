import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/constants";
import type { ModuleId } from "@/types";

interface UIStore {
  sidebarCollapsed: boolean;
  propertiesCollapsed: boolean;
  activeModule: ModuleId;
  toggleSidebar: () => void;
  toggleProperties: () => void;
  setActiveModule: (module: ModuleId) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      propertiesCollapsed: false,
      activeModule: "overview",
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleProperties: () =>
        set((state) => ({ propertiesCollapsed: !state.propertiesCollapsed })),
      setActiveModule: (module) => set({ activeModule: module }),
    }),
    {
      name: STORAGE_KEYS.ui,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        propertiesCollapsed: state.propertiesCollapsed,
        activeModule: state.activeModule,
      }),
    },
  ),
);
