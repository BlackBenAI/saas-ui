import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import { DEFAULT_DESIGN_SYSTEM } from "@/types/design-system";

describe("IndexedDB persistence", () => {
  beforeEach(async () => {
    await db.projects.clear();
  });

  it("stores and reloads a design system", async () => {
    await db.projects.put({
      id: "default",
      name: "Local project",
      designSystem: { ...DEFAULT_DESIGN_SYSTEM, name: "Local project" },
      createdAt: DEFAULT_DESIGN_SYSTEM.createdAt,
      updatedAt: DEFAULT_DESIGN_SYSTEM.updatedAt,
      syncedToCloud: false,
    });

    const stored = await db.projects.get("default");

    expect(stored?.name).toBe("Local project");
    expect(stored?.designSystem.colors.primary).toBe("#6366F1");
    expect(stored?.syncedToCloud).toBe(false);
  });
});
