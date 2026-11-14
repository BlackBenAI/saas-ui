import { describe, expect, it } from "vitest";

import {
  applyFigmaVariables,
  exportFigmaVariables,
  parseFigmaVariables,
  type FigmaVariablesFile,
} from "@/lib/figma";
import { DEFAULT_DESIGN_SYSTEM } from "@/types/design-system";

describe("Figma variables", () => {
  it("exports collections for the complete system", () => {
    const file = parseFigmaVariables(exportFigmaVariables(DEFAULT_DESIGN_SYSTEM));
    expect(file.meta.source).toBe("SaaS-UI");
    expect(file.collections.map((collection) => collection.name)).toEqual([
      "Colors",
      "Typography",
      "Spacing",
      "Radius",
      "Components",
      "Motion",
    ]);
    const colors = file.collections.find((collection) => collection.name === "Colors");
    expect(colors?.modes).toEqual(["Light", "Dark"]);
    expect(colors?.variables).toHaveLength(9);

    const json = JSON.parse(exportFigmaVariables(DEFAULT_DESIGN_SYSTEM)) as FigmaVariablesFile;
    const primary = json.collections
      .find((collection) => collection.name === "Colors")
      ?.variables.find((variable) => variable.name === "primary");
    expect(primary?.valuesByMode.Light).toMatchObject({ r: expect.any(Number), a: 1 });
  });

  it("round-trips tokens without losing the model", () => {
    const imported = applyFigmaVariables(
      DEFAULT_DESIGN_SYSTEM,
      exportFigmaVariables(DEFAULT_DESIGN_SYSTEM),
    );
    expect(imported.lightColors.primary).toBe(DEFAULT_DESIGN_SYSTEM.lightColors.primary);
    expect(imported.darkColors.primary).toBe(DEFAULT_DESIGN_SYSTEM.darkColors.primary);
    expect(imported.typography.headingFont).toBe(DEFAULT_DESIGN_SYSTEM.typography.headingFont);
    expect(imported.layout.spacing["4"]).toBe(DEFAULT_DESIGN_SYSTEM.layout.spacing["4"]);
    expect(imported.layout.radius.md).toBe(DEFAULT_DESIGN_SYSTEM.layout.radius.md);
    expect(imported.components.button.md.height).toBe(
      DEFAULT_DESIGN_SYSTEM.components.button.md.height,
    );
    expect(imported.motion.duration.panel).toBe(DEFAULT_DESIGN_SYSTEM.motion.duration.panel);
  });

  it("imports changed colors, fonts, layout, components, and motion", () => {
    const file = parseFigmaVariables(exportFigmaVariables(DEFAULT_DESIGN_SYSTEM));
    const colors = file.collections.find((collection) => collection.name === "Colors");
    const primary = colors?.variables.find((variable) => variable.name === "primary");
    if (primary) {
      primary.valuesByMode.Light = { r: 0, g: 0.4, b: 0.2, a: 1 };
    }
    const typography = file.collections.find((collection) => collection.name === "Typography");
    const heading = typography?.variables.find((variable) => variable.name === "heading-font");
    if (heading) heading.valuesByMode.Default = "Lora";
    const spacing = file.collections.find((collection) => collection.name === "Spacing");
    const space4 = spacing?.variables.find((variable) => variable.name === "space-4");
    if (space4) space4.valuesByMode.Default = 20;
    const radius = file.collections.find((collection) => collection.name === "Radius");
    const radiusMd = radius?.variables.find((variable) => variable.name === "radius-md");
    if (radiusMd) radiusMd.valuesByMode.Default = 10;
    const components = file.collections.find((collection) => collection.name === "Components");
    const buttonHeight = components?.variables.find(
      (variable) => variable.name === "button-md-height",
    );
    if (buttonHeight) buttonHeight.valuesByMode.Default = 40;
    const motion = file.collections.find((collection) => collection.name === "Motion");
    const panelDuration = motion?.variables.find(
      (variable) => variable.name === "duration-panel",
    );
    if (panelDuration) panelDuration.valuesByMode.Default = 220;

    const imported = applyFigmaVariables(DEFAULT_DESIGN_SYSTEM, JSON.stringify(file));
    expect(imported.lightColors.primary).toBe("#006633");
    expect(imported.colors.primary).toBe("#006633");
    expect(imported.typography.headingFont).toBe("Lora");
    expect(imported.typography.roles.h1.fontFamily).toBe("Lora");
    expect(imported.layout.spacing["4"]).toBe(20);
    expect(imported.layout.radius.md).toBe(10);
    expect(imported.components.button.md.height).toBe(40);
    expect(imported.motion.duration.panel).toBe(220);
  });

  it("rejects files without collections", () => {
    expect(() => parseFigmaVariables("{}")).toThrow(/Figma variable collections/);
  });
});
