import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import {
  clearActiveLocalProjectId,
  createLocalProject,
  deleteLocalProject,
  duplicateLocalProject,
  ensureLocalProject,
  listLocalProjects,
} from "@/lib/local-projects";

describe("local projects", () => {
  beforeEach(async () => {
    await db.projects.clear();
    clearActiveLocalProjectId();
  });

  it("auto-creates a project when none exists", async () => {
    const record = await ensureLocalProject();
    expect(record.id).toBeTruthy();
    expect(record.name).toBe("Untitled Design System");
    expect(await listLocalProjects()).toHaveLength(1);
  });

  it("creates, duplicates, and deletes projects", async () => {
    const first = await createLocalProject("First");
    const copy = await duplicateLocalProject(first);
    expect(copy.name).toBe("First copy");
    expect(await listLocalProjects()).toHaveLength(2);
    await deleteLocalProject(first.id);
    expect(await listLocalProjects()).toHaveLength(1);
  });
});
