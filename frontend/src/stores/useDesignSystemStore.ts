import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/constants";
import { DEFAULT_DESIGN_SYSTEM, type DesignSystem } from "@/types/design-system";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

const HISTORY_LIMIT = 50;

interface DesignSystemStore {
  designSystem: DesignSystem;
  history: DesignSystem[];
  historyIndex: number;
  status: SaveStatus;
  lastSavedAt: string | null;
  setProjectName: (name: string) => void;
  updateColor: (key: keyof DesignSystem["colors"], value: string) => void;
  updateTypography: (patch: Partial<DesignSystem["typography"]>) => void;
  updateLayout: (patch: Partial<DesignSystem["layout"]>) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  loadFromCloud: (designSystem: DesignSystem) => void;
  markSaving: () => void;
  markSaved: (at: string) => void;
  markError: () => void;
}

export const useDesignSystemStore = create<DesignSystemStore>()(
  persist(
    (set, get) => {
      const apply = (updater: (designSystem: DesignSystem) => DesignSystem) => {
        const state = get();
        const next = {
          ...updater(state.designSystem),
          updatedAt: new Date().toISOString(),
        };
        const history = [...state.history.slice(0, state.historyIndex + 1), next].slice(
          -HISTORY_LIMIT,
        );

        set({
          designSystem: next,
          history,
          historyIndex: history.length - 1,
          status: "unsaved",
        });
      };

      return {
        designSystem: DEFAULT_DESIGN_SYSTEM,
        history: [DEFAULT_DESIGN_SYSTEM],
        historyIndex: 0,
        status: "saved",
        lastSavedAt: null,
        setProjectName: (name) => apply((designSystem) => ({ ...designSystem, name })),
        updateColor: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            colors: { ...designSystem.colors, [key]: value },
          })),
        updateTypography: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            typography: { ...designSystem.typography, ...patch },
          })),
        updateLayout: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            layout: { ...designSystem.layout, ...patch },
          })),
        undo: () => {
          const { history, historyIndex } = get();
          if (historyIndex <= 0) {
            return;
          }
          const nextIndex = historyIndex - 1;
          set({
            designSystem: history[nextIndex],
            historyIndex: nextIndex,
            status: "unsaved",
          });
        },
        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex >= history.length - 1) {
            return;
          }
          const nextIndex = historyIndex + 1;
          set({
            designSystem: history[nextIndex],
            historyIndex: nextIndex,
            status: "unsaved",
          });
        },
        reset: () => {
          const fresh = {
            ...DEFAULT_DESIGN_SYSTEM,
            updatedAt: new Date().toISOString(),
          };
          set({
            designSystem: fresh,
            history: [fresh],
            historyIndex: 0,
            status: "unsaved",
          });
        },
        loadFromCloud: (designSystem) =>
          set({
            designSystem,
            history: [designSystem],
            historyIndex: 0,
            status: "saved",
            lastSavedAt: designSystem.updatedAt,
          }),
        markSaving: () => set({ status: "saving" }),
        markSaved: (at) => set({ status: "saved", lastSavedAt: at }),
        markError: () => set({ status: "error" }),
      };
    },
    {
      name: STORAGE_KEYS.preferences,
      partialize: (state) => ({
        designSystem: state.designSystem,
        lastSavedAt: state.lastSavedAt,
      }),
    },
  ),
);
