import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import { DEFAULT_DESIGN_SYSTEM } from "@/types/design-system";

describe("IndexedDB persistence", () => {
  beforeEach(async () => {
    await db.projects.clear();
    await db.assets.clear();
    await db.fonts.clear();
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
    expect(stored?.designSystem.colors.primary).toBe("#4F46E5");
    expect(stored?.syncedToCloud).toBe(false);
  });

  it("stores asset and font blobs locally", async () => {
    const assetBlob = new Blob(["<svg />"], { type: "image/svg+xml" });
    await db.assets.put({
      id: "asset-1",
      name: "Logo",
      category: "logo",
      mimeType: "image/svg+xml",
      size: assetBlob.size,
      blob: assetBlob,
      tags: [],
      alt: "",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    const fontBlob = new Blob(["font"], { type: "font/woff2" });
    await db.fonts.put({
      id: "font-1",
      family: "Inter",
      weight: 400,
      style: "normal",
      blob: fontBlob,
      createdAt: "2026-01-01T00:00:00Z",
    });

    const storedAsset = await db.assets.get("asset-1");
    const storedFont = await db.fonts.get("font-1");
    expect(storedAsset?.blob).toBeTruthy();
    expect(storedAsset?.size).toBe(assetBlob.size);
    expect(storedAsset?.mimeType).toBe("image/svg+xml");
    expect(storedFont?.blob).toBeTruthy();
    expect(storedFont?.family).toBe("Inter");
  });
});
