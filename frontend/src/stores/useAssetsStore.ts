import { create } from "zustand";

import { db, type AssetCategory, type AssetRecord } from "@/lib/db";

interface AssetsState {
  assets: AssetRecord[];
  selectedAssetId: string | null;
  isLoading: boolean;
  loadAssets: () => Promise<void>;
  addAsset: (file: File, category: AssetCategory, name?: string) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Pick<AssetRecord, "name" | "alt" | "category" | "tags">>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  selectAsset: (id: string | null) => void;
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
  assets: [],
  selectedAssetId: null,
  isLoading: false,

  loadAssets: async () => {
    set({ isLoading: true });
    const assets = await db.assets.orderBy("updatedAt").reverse().toArray();
    set({ assets, isLoading: false });
  },

  addAsset: async (file, category, name) => {
    const now = new Date().toISOString();
    const asset: AssetRecord = {
      id: crypto.randomUUID(),
      name: name?.trim() || file.name,
      category,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      blob: file,
      tags: [],
      alt: "",
      createdAt: now,
      updatedAt: now,
    };
    await db.assets.put(asset);
    await get().loadAssets();
    set({ selectedAssetId: asset.id });
  },

  updateAsset: async (id, updates) => {
    await db.assets.update(id, { ...updates, updatedAt: new Date().toISOString() });
    await get().loadAssets();
  },

  deleteAsset: async (id) => {
    await db.assets.delete(id);
    set((state) => ({
      selectedAssetId: state.selectedAssetId === id ? null : state.selectedAssetId,
    }));
    await get().loadAssets();
  },

  selectAsset: (id) => set({ selectedAssetId: id }),
}));
