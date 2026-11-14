import { describe, expect, it } from "vitest";

import {
  buildExport,
  EXPORT_FORMATS,
  exportCSS,
  exportJSON,
  exportMarkdown,
  exportTailwind,
  exportTypeScript,
} from "@/lib/exporters";
import { DEFAULT_DESIGN_SYSTEM } from "@/types/design-system";

describe("exporters", () => {
  it("offers the five production formats", () => {
    expect(EXPORT_FORMATS.map((format) => format.id)).toEqual([
      "json",
      "markdown",
      "css",
      "tailwind",
      "typescript",
    ]);
  });

  it("exports real light and dark tokens", () => {
    const json = JSON.parse(exportJSON(DEFAULT_DESIGN_SYSTEM));
    expect(json.colors.primary).toBe("#4F46E5");
    expect(json.lightColors.primary).toBe("#4F46E5");
    expect(json.darkColors.primary).toBe("#818CF8");

    const css = exportCSS(DEFAULT_DESIGN_SYSTEM);
    expect(css).toContain("--color-primary: #4F46E5;");
    expect(css).toContain("--color-on-primary: #FFFFFF;");
    expect(css).toContain("--text-display:");
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain(".text-body");
  });

  it("exports documentation, Tailwind, and TypeScript from the same tokens", () => {
    const markdown = exportMarkdown(DEFAULT_DESIGN_SYSTEM);
    expect(markdown).toContain("## Colors — light");
    expect(markdown).toContain("## Colors — dark");
    expect(markdown).toContain("| display |");

    const tailwind = exportTailwind(DEFAULT_DESIGN_SYSTEM);
    expect(tailwind).toContain("fontFamily");
    expect(tailwind).toContain("#4F46E5");

    const typescript = exportTypeScript(DEFAULT_DESIGN_SYSTEM);
    expect(typescript).toContain("export const tokens");
    expect(typescript).toContain("export type Tokens");
  });

  it("reflects edits to the current design system", () => {
    const edited = {
      ...DEFAULT_DESIGN_SYSTEM,
      name: "Edited system",
      colors: { ...DEFAULT_DESIGN_SYSTEM.colors, primary: "#0F766E" },
      lightColors: { ...DEFAULT_DESIGN_SYSTEM.lightColors, primary: "#0F766E" },
    };
    expect(buildExport(edited, "css")).toContain("--color-primary: #0F766E;");
    expect(buildExport(edited, "markdown")).toContain("# Edited system");
  });
});
