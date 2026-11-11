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

export class SaasUiDB extends Dexie {
  projects!: Table<ProjectRecord, string>;

  constructor() {
    super("saas-ui");
    this.version(1).stores({
      projects: "id, name, updatedAt, syncedToCloud",
    });
  }
}

export const db = new SaasUiDB();

const LEGACY_DB_NAME = "saas-builder";

export async function migrateLegacyDatabase(): Promise<void> {
  if (typeof indexedDB === "undefined") return;

  try {
    if (!(await Dexie.exists(LEGACY_DB_NAME))) return;
    if ((await db.projects.count()) > 0) return;

    const legacy = new Dexie(LEGACY_DB_NAME);
    legacy.version(1).stores({
      projects: "id, name, updatedAt, syncedToCloud",
    });
    await legacy.open();

    const projects = (await legacy.table("projects").toArray()) as ProjectRecord[];
    if (projects.length > 0) await db.projects.bulkPut(projects);

    legacy.close();
    await Dexie.delete(LEGACY_DB_NAME);
  } catch {
    // Keep the legacy database if migration cannot complete.
  }
}
