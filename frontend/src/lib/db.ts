import Dexie, { type Table } from "dexie";

import type { DesignSystem } from "@/types/design-system";

export interface ProjectRecord {
  id: string;
  name: string;
  designSystem: DesignSystem;
  createdAt: string;
  updatedAt: string;
  syncedToCloud: boolean;
  cloudId?: string;
}

export type AssetCategory = "logo" | "illustration" | "icon" | "photo" | "other";

export interface AssetRecord {
  id: string;
  name: string;
  category: AssetCategory;
  mimeType: string;
  size: number;
  blob: Blob;
  tags: string[];
  alt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FontRecord {
  id: string;
  family: string;
  weight: number;
  style: "normal" | "italic";
  blob: Blob;
  createdAt: string;
}

export class SaasUiDB extends Dexie {
  projects!: Table<ProjectRecord, string>;
  assets!: Table<AssetRecord, string>;
  fonts!: Table<FontRecord, string>;

  constructor() {
    super("saas-ui");
    this.version(1).stores({
      projects: "id, name, updatedAt, syncedToCloud",
    });
    this.version(2).stores({
      projects: "id, name, updatedAt, syncedToCloud",
      assets: "id, name, category, updatedAt",
    });
    this.version(3).stores({
      projects: "id, name, updatedAt, syncedToCloud",
      assets: "id, name, category, updatedAt",
      fonts: "id, family, createdAt",
    });
  }
}

export const db = new SaasUiDB();

const LEGACY_DB_NAME = "saas-builder";

export async function migrateLegacyDatabase(): Promise<void> {
  if (typeof indexedDB === "undefined") return;

  try {
    if (!(await Dexie.exists(LEGACY_DB_NAME))) return;
    if ((await db.projects.count()) > 0 || (await db.assets.count()) > 0) return;

    const legacy = new Dexie(LEGACY_DB_NAME);
    legacy.version(1).stores({
      projects: "id, name, updatedAt, syncedToCloud",
    });
    legacy.version(2).stores({
      projects: "id, name, updatedAt, syncedToCloud",
      assets: "id, name, category, updatedAt",
    });
    await legacy.open();

    const projects = (await legacy.table("projects").toArray()) as ProjectRecord[];
    const assets = (await legacy.table("assets").toArray().catch(() => [])) as AssetRecord[];
    if (projects.length > 0) await db.projects.bulkPut(projects);
    if (assets.length > 0) await db.assets.bulkPut(assets);

    legacy.close();
    await Dexie.delete(LEGACY_DB_NAME);
  } catch {
    // Keep the legacy database if migration cannot complete.
  }
}
