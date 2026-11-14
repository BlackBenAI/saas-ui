import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/constants";
import {
  buildTypographyRoles,
  DEFAULT_DESIGN_SYSTEM,
  normalizeDesignSystem,
  TYPOGRAPHY_ROLES,
  type DesignSystem,
  type TypographyParagraph,
  type TypographyRole,
  type TextBlock,
  type TypographyStyle,
} from "@/types/design-system";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

const HISTORY_LIMIT = 50;

interface DesignSystemStore {
  designSystem: DesignSystem;
  history: DesignSystem[];
  historyIndex: number;
  status: SaveStatus;
  lastSavedAt: string | null;
  colorMode: "light" | "dark";
  setColorMode: (mode: "light" | "dark") => void;
  setProjectName: (name: string) => void;
  updateDescription: (description: string) => void;
  updateColor: (key: keyof DesignSystem["colors"], value: string) => void;
  updateTypography: (patch: Partial<DesignSystem["typography"]>) => void;
  updateScale: (key: keyof DesignSystem["typography"]["scale"], value: number) => void;
  updateTextStyle: (role: TypographyRole, patch: Partial<TypographyStyle>) => void;
  updateTypographySettings: (patch: {
    baseSize?: number;
    scaleRatio?: number;
    paragraph?: Partial<TypographyParagraph>;
  }) => void;
  applyTypeScale: (baseSize?: number, scaleRatio?: number) => void;
  updateResponsiveBase: (breakpoint: string, value: number) => void;
  addTextBlock: () => void;
  updateTextBlock: (id: string, patch: Partial<Pick<TextBlock, "role" | "content" | "maxWidth">>) => void;
  removeTextBlock: (id: string) => void;
  updateLayout: (patch: Partial<DesignSystem["layout"]>) => void;
  updateSpacing: (key: string, value: number) => void;
  updateRadius: (key: keyof DesignSystem["layout"]["radius"], value: number) => void;
  updateBreakpoint: (key: string, value: number) => void;
  updateEffects: (patch: Partial<DesignSystem["effects"]>) => void;
  updateShadow: (key: string, value: string) => void;
  updateBorder: (key: string, value: string) => void;
  updateMotion: (patch: Partial<DesignSystem["motion"]>) => void;
  updateDuration: (key: string, value: number) => void;
  updateEasing: (key: string, value: string) => void;
  updateAssets: (patch: Partial<DesignSystem["assets"]>) => void;
  pushHistory: (designSystem: DesignSystem) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  loadProject: (designSystem: DesignSystem) => void;
  applyDirection: (designSystem: DesignSystem) => void;
  updateBrandBook: (patch: Partial<NonNullable<DesignSystem["brandBook"]>>) => void;
  updateComponentToken: (size: keyof DesignSystem["components"]["button"], patch: Partial<DesignSystem["components"]["button"]["md"]>) => void;
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
        colorMode: "light",
        setColorMode: (colorMode) =>
          set((state) => ({
            colorMode,
            designSystem: {
              ...state.designSystem,
              colors:
                colorMode === "dark"
                  ? state.designSystem.darkColors
                  : state.designSystem.lightColors,
            },
          })),
        setProjectName: (name) => apply((designSystem) => ({ ...designSystem, name })),
        updateDescription: (description) =>
          apply((designSystem) => ({ ...designSystem, description })),
        updateColor: (key, value) =>
          apply((designSystem) => {
            const colors = { ...designSystem.colors, [key]: value };
            const mode = get().colorMode;
            return {
              ...designSystem,
              colors,
              lightColors:
                mode === "light" ? colors : designSystem.lightColors,
              darkColors:
                mode === "dark" ? colors : designSystem.darkColors,
            };
          }),
        updateTypography: (patch) =>
          apply((designSystem) => {
            const typography = { ...designSystem.typography, ...patch };
            const roles = { ...typography.roles };
            if (patch.headingFont) {
              for (const role of ["display", "h1", "h2", "h3", "h4", "h5", "h6"] as const) {
                roles[role] = { ...roles[role], fontFamily: patch.headingFont };
              }
            }
            if (patch.bodyFont) {
              for (const role of ["lead", "body", "small", "label", "caption", "quote"] as const) {
                roles[role] = { ...roles[role], fontFamily: patch.bodyFont };
              }
            }
            if (patch.monoFont) {
              roles.code = { ...roles.code, fontFamily: patch.monoFont };
            }
            return { ...designSystem, typography: { ...typography, roles } };
          }),
        updateScale: (key, value) =>
          apply((designSystem) => {
            const scale = { ...designSystem.typography.scale, [key]: value };
            const roles = { ...designSystem.typography.roles };
            if (key in roles) {
              roles[key as TypographyRole] = {
                ...roles[key as TypographyRole],
                fontSize: value,
              };
            }
            return {
              ...designSystem,
              typography: {
                ...designSystem.typography,
                scale,
                baseSize: key === "body" ? value : designSystem.typography.baseSize,
                roles,
              },
            };
          }),
        updateTextStyle: (role, patch) =>
          apply((designSystem) => {
            const current = designSystem.typography.roles[role];
            const style = { ...current, ...patch };
            const roles = { ...designSystem.typography.roles, [role]: style };
            const scale = { ...designSystem.typography.scale };
            if (role in scale) {
              scale[role as keyof typeof scale] = style.fontSize;
            }
            const headingRoles: TypographyRole[] = [
              "display",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
            ];
            return {
              ...designSystem,
              typography: {
                ...designSystem.typography,
                roles,
                scale,
                headingFont: headingRoles.includes(role)
                  ? style.fontFamily
                  : designSystem.typography.headingFont,
                bodyFont:
                  role === "code" || headingRoles.includes(role)
                    ? designSystem.typography.bodyFont
                    : style.fontFamily,
                monoFont:
                  role === "code"
                    ? style.fontFamily
                    : designSystem.typography.monoFont,
              },
            };
          }),
        updateTypographySettings: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            typography: {
              ...designSystem.typography,
              ...(patch.baseSize !== undefined ? { baseSize: patch.baseSize } : {}),
              ...(patch.scaleRatio !== undefined
                ? { scaleRatio: patch.scaleRatio }
                : {}),
              paragraph: {
                ...designSystem.typography.paragraph,
                ...(patch.paragraph ?? {}),
              },
            },
          })),
        updateResponsiveBase: (breakpoint, value) =>
          apply((designSystem) => ({
            ...designSystem,
            typography: {
              ...designSystem.typography,
              responsive: {
                ...designSystem.typography.responsive,
                [breakpoint]: value,
              },
            },
          })),
        addTextBlock: () =>
          apply((designSystem) => ({
            ...designSystem,
            textBlocks: [
              ...designSystem.textBlocks,
              {
                id: crypto.randomUUID(),
                role: "body",
                content: "New text block",
                maxWidth: 640,
              },
            ],
          })),
        updateTextBlock: (id, patch) =>
          apply((designSystem) => ({
            ...designSystem,
            textBlocks: designSystem.textBlocks.map((block) =>
              block.id === id ? { ...block, ...patch } : block,
            ),
          })),
        removeTextBlock: (id) =>
          apply((designSystem) => ({
            ...designSystem,
            textBlocks: designSystem.textBlocks.filter((block) => block.id !== id),
          })),
        applyTypeScale: (baseSize, scaleRatio) =>
          apply((designSystem) => {
            const base = baseSize ?? designSystem.typography.baseSize;
            const ratio = scaleRatio ?? designSystem.typography.scaleRatio;
            const round = (value: number) => Math.max(9, Math.round(value));
            const scale = {
              h1: round(base * ratio ** 4),
              h2: round(base * ratio ** 3),
              h3: round(base * ratio ** 2),
              h4: round(base * ratio),
              body: round(base),
              small: round(base - 2),
              label: round(base - 2),
              caption: round(base - 3),
            };
            const baseTypography = {
              headingFont: designSystem.typography.headingFont,
              bodyFont: designSystem.typography.bodyFont,
              monoFont: designSystem.typography.monoFont,
              scale,
              weights: designSystem.typography.weights,
              lineHeight: designSystem.typography.lineHeight,
              letterSpacing: designSystem.typography.letterSpacing,
            };
            const defaults = buildTypographyRoles(baseTypography);
            const roles = { ...designSystem.typography.roles };
            for (const role of TYPOGRAPHY_ROLES) {
              roles[role] = {
                ...roles[role],
                fontSize: defaults[role].fontSize,
              };
            }
            return {
              ...designSystem,
              typography: {
                ...baseTypography,
                baseSize: base,
                scaleRatio: ratio,
                responsive: designSystem.typography.responsive,
                roles,
                paragraph: designSystem.typography.paragraph,
              },
            };
          }),
        updateLayout: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            layout: { ...designSystem.layout, ...patch },
          })),
        updateSpacing: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            layout: {
              ...designSystem.layout,
              spacing: { ...designSystem.layout.spacing, [key]: value },
            },
          })),
        updateRadius: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            layout: {
              ...designSystem.layout,
              radius: { ...designSystem.layout.radius, [key]: value },
            },
          })),
        updateBreakpoint: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            layout: {
              ...designSystem.layout,
              breakpoints: { ...designSystem.layout.breakpoints, [key]: value },
            },
          })),
        updateEffects: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            effects: { ...designSystem.effects, ...patch },
          })),
        updateShadow: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            effects: {
              ...designSystem.effects,
              shadows: { ...designSystem.effects.shadows, [key]: value },
            },
          })),
        updateBorder: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            effects: {
              ...designSystem.effects,
              borders: { ...designSystem.effects.borders, [key]: value },
            },
          })),
        updateMotion: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            motion: { ...designSystem.motion, ...patch },
          })),
        updateDuration: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            motion: {
              ...designSystem.motion,
              duration: { ...designSystem.motion.duration, [key]: value },
            },
          })),
        updateEasing: (key, value) =>
          apply((designSystem) => ({
            ...designSystem,
            motion: {
              ...designSystem.motion,
              easing: { ...designSystem.motion.easing, [key]: value },
            },
          })),
        updateAssets: (patch) =>
          apply((designSystem) => ({
            ...designSystem,
            assets: { ...designSystem.assets, ...patch },
          })),
        pushHistory: (designSystem) => {
          const state = get();
          const history = [
            ...state.history.slice(0, state.historyIndex + 1),
            designSystem,
          ].slice(-HISTORY_LIMIT);
          set({ history, historyIndex: history.length - 1 });
        },
        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,
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
          const mode = get().colorMode;
          const fresh = {
            ...DEFAULT_DESIGN_SYSTEM,
            colors:
              mode === "dark"
                ? DEFAULT_DESIGN_SYSTEM.darkColors
                : DEFAULT_DESIGN_SYSTEM.lightColors,
            updatedAt: new Date().toISOString(),
          };
          set({
            designSystem: fresh,
            history: [fresh],
            historyIndex: 0,
            status: "unsaved",
          });
        },
        loadProject: (designSystem) => {
          const normalized = normalizeDesignSystem(designSystem);
          const mode = get().colorMode;
          const next = {
            ...normalized,
            colors:
              mode === "dark" ? normalized.darkColors : normalized.lightColors,
          };
          set({
            designSystem: next,
            history: [next],
            historyIndex: 0,
            status: "saved",
            lastSavedAt: next.updatedAt,
          });
        },
        applyDirection: (designSystem) => {
          const normalized = normalizeDesignSystem(designSystem);
          const state = get();
          const mode = state.colorMode;
          const next = {
            ...normalized,
            colors:
              mode === "dark" ? normalized.darkColors : normalized.lightColors,
            updatedAt: new Date().toISOString(),
          };
          const history = [
            ...state.history.slice(0, state.historyIndex + 1),
            next,
          ].slice(-HISTORY_LIMIT);
          set({
            designSystem: next,
            history,
            historyIndex: history.length - 1,
            status: "unsaved",
          });
        },
        updateBrandBook: (patch) => {
          const current = get().designSystem;
          get().applyDirection({
            ...current,
            brandBook: { ...current.brandBook, ...patch },
          });
        },
        updateComponentToken: (size, patch) => {
          const current = get().designSystem;
          get().applyDirection({
            ...current,
            components: {
              ...current.components,
              button: {
                ...current.components.button,
                [size]: { ...current.components.button[size], ...patch },
              },
            },
          });
        },
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
      merge: (persisted, current) => {
        const saved = persisted as Partial<DesignSystemStore> | undefined;
        return {
          ...current,
          ...saved,
          designSystem: normalizeDesignSystem(saved?.designSystem ?? current.designSystem),
        };
      },
    },
  ),
);
