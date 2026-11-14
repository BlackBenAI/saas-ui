import { db, type ProjectRecord } from "@/lib/db";
import { normalizeDesignSystem, DEFAULT_DESIGN_SYSTEM, type DesignSystem } from "@/types/design-system";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

const ACTIVE_PROJECT_KEY = "saas-ui-active-local-project";

export function getActiveLocalProjectId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveLocalProjectId(id: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }
}

export function clearActiveLocalProjectId(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}

export async function listLocalProjects(): Promise<ProjectRecord[]> {
  return db.projects.orderBy("updatedAt").reverse().toArray();
}

function freshDesignSystem(name: string): DesignSystem {
  const now = new Date().toISOString();
  return normalizeDesignSystem({
    ...DEFAULT_DESIGN_SYSTEM,
    id: crypto.randomUUID(),
    name: name.trim() || "Untitled Design System",
    createdAt: now,
    updatedAt: now,
  });
}

function recordFor(designSystem: DesignSystem): ProjectRecord {
  return {
    id: designSystem.id,
    name: designSystem.name,
    designSystem,
    createdAt: designSystem.createdAt,
    updatedAt: designSystem.updatedAt,
    syncedToCloud: false,
  };
}

export async function createLocalProject(name = "Untitled Design System"): Promise<ProjectRecord> {
  const record = recordFor(freshDesignSystem(name));
  await db.projects.put(record);
  setActiveLocalProjectId(record.id);
  return record;
}

export async function ensureLocalProject(): Promise<ProjectRecord> {
  const projects = await listLocalProjects();
  const activeId = getActiveLocalProjectId();
  const active = activeId ? await db.projects.get(activeId) : undefined;
  if (active) return active;
  if (projects[0]) {
    setActiveLocalProjectId(projects[0].id);
    return projects[0];
  }
  return createLocalProject();
}

export function openLocalProject(record: ProjectRecord): void {
  setActiveLocalProjectId(record.id);
  useDesignSystemStore.getState().loadProject(record.designSystem);
}

export async function duplicateLocalProject(record: ProjectRecord): Promise<ProjectRecord> {
  const copy = recordFor(freshDesignSystem(`${record.name} copy`));
  await db.projects.put(copy);
  return copy;
}

export async function deleteLocalProject(id: string): Promise<void> {
  await db.projects.delete(id);
  if (getActiveLocalProjectId() === id) clearActiveLocalProjectId();
}
