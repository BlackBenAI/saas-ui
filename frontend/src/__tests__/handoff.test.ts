import { describe, expect, it } from "vitest";

import { buildHandoffBundle, buildHandoffStarter } from "@/lib/handoff";
import { DEFAULT_DESIGN_SYSTEM } from "@/types/design-system";

describe("handoff starters", () => {
  it("generates a complete Vite starter", () => {
    const starter = buildHandoffStarter(DEFAULT_DESIGN_SYSTEM, "vite");
    const paths = starter.files.map((file) => file.path);
    expect(paths).toContain("package.json");
    expect(paths).toContain("src/App.tsx");
    expect(paths).toContain("src/main.tsx");
    expect(paths).toContain("src/styles/design-tokens.css");
    expect(paths).toContain("src/components/ui/button.tsx");
    expect(paths).toContain("tailwind.config.ts");

    const page = starter.files.find((file) => file.path === "src/App.tsx")?.content ?? "";
    expect(page).toContain("Untitled Design System");
    expect(page).toContain("var(--color-primary)");
    expect(page).toContain("var(--text-display)");
    expect(page).toContain("Toggle theme");
    expect(page).toContain(
      `padding: "${DEFAULT_DESIGN_SYSTEM.layout.spacing["4"]}px ${DEFAULT_DESIGN_SYSTEM.layout.spacing["6"]}px"`,
    );
    expect(page).not.toContain("20px 24px");

    const tokens = starter.files.find((file) => file.path === "src/styles/design-tokens.css")?.content ?? "";
    expect(tokens).toContain("--color-on-primary: #FFFFFF;");

    const button = starter.files.find((file) => file.path === "src/components/ui/button.tsx")?.content ?? "";
    expect(button).toContain("var(--color-primary)");
    expect(button).toContain("var(--color-on-primary)");
  });

  it("generates a Next.js + shadcn starter", () => {
    const starter = buildHandoffStarter(DEFAULT_DESIGN_SYSTEM, "next");
    const paths = starter.files.map((file) => file.path);
    expect(paths).toContain("app/page.tsx");
    expect(paths).toContain("app/layout.tsx");
    expect(paths).toContain("app/globals.css");
    expect(paths).toContain("components/ui/button.tsx");
    expect(paths).toContain("components.json");

    const page = starter.files.find((file) => file.path === "app/page.tsx")?.content ?? "";
    expect(page.startsWith('"use client";')).toBe(true);
    expect(page).toContain("Untitled Design System");

    const layout = starter.files.find((file) => file.path === "app/layout.tsx")?.content ?? "";
    expect(layout).toContain('import "./globals.css";');
    expect(layout).toContain("export const metadata");
  });

  it("bundles every file into a copyable Markdown document", () => {
    const starter = buildHandoffStarter(DEFAULT_DESIGN_SYSTEM, "vite");
    const bundle = buildHandoffBundle(starter);
    expect(bundle).toContain("# Vite + React starter");
    expect(bundle).toContain("### `src/App.tsx`");
    expect(bundle).toContain("### `src/styles/design-tokens.css`");
    expect(bundle).toContain("var(--color-primary)");
  });
});
