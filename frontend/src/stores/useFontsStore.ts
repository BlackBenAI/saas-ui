import { create } from "zustand";

import { db, type FontRecord } from "@/lib/db";

const registered = new Set<string>();

function fontKey(font: Pick<FontRecord, "family" | "weight" | "style">): string {
  return `${font.family}:${font.weight}:${font.style}`;
}

export async function registerFont(font: FontRecord): Promise<boolean> {
  if (typeof document === "undefined" || typeof FontFace === "undefined") {
    return false;
  }
  const key = fontKey(font);
  if (registered.has(key)) {
    return true;
  }
  try {
    const face = new FontFace(font.family, await font.blob.arrayBuffer(), {
      weight: String(font.weight),
      style: font.style,
    });
    await face.load();
    document.fonts.add(face);
    registered.add(key);
    return true;
  } catch {
    return false;
  }
}

interface FontsState {
  fonts: FontRecord[];
  isLoading: boolean;
  loadFonts: () => Promise<void>;
  addFont: (file: File, family: string, weight: number, style: FontRecord["style"]) => Promise<void>;
  deleteFont: (id: string) => Promise<void>;
}

export const useFontsStore = create<FontsState>((set, get) => ({
  fonts: [],
  isLoading: false,

  loadFonts: async () => {
    set({ isLoading: true });
    const fonts = await db.fonts.orderBy("createdAt").reverse().toArray();
    for (const font of fonts) {
      await registerFont(font);
    }
    set({ fonts, isLoading: false });
  },

  addFont: async (file, family, weight, style) => {
    const name =
      family.trim() ||
      file.name.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " ").trim() ||
      "Custom font";
    const font: FontRecord = {
      id: crypto.randomUUID(),
      family: name,
      weight,
      style,
      blob: file,
      createdAt: new Date().toISOString(),
    };
    await db.fonts.put(font);
    await registerFont(font);
    await get().loadFonts();
  },

  deleteFont: async (id) => {
    const font = await db.fonts.get(id);
    await db.fonts.delete(id);
    if (font) {
      registered.delete(fontKey(font));
    }
    await get().loadFonts();
  },
}));
