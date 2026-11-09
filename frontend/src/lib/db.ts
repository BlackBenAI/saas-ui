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

export class SaaSBuilderDB extends Dexie {
  projects!: Table<ProjectRecord, string>;

  constructor() {
    super("saas-builder");
    this.version(1).stores({
      projects: "id, name, updatedAt, syncedToCloud",
    });
  }
}

export const db = new SaaSBuilderDB();
