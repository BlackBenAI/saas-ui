import { cleanup, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { ModuleRouter } from "@/pages/editor/EditorModules";
import type { ModuleId } from "@/types";

afterEach(cleanup);

function renderModule(module: ModuleId) {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ModuleRouter module={module} />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("editor modules", () => {
  it("renders the overview without a backend", () => {
    renderModule("overview");
    expect(screen.getByRole("heading", { level: 1, name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("Design system preview")).toBeInTheDocument();
  });

  it("renders the complete AI interface brief", () => {
    renderModule("ai-rules");
    expect(screen.getByRole("heading", { level: 1, name: "AI Rules" })).toBeInTheDocument();
    expect(screen.getByText("Complete interface brief (.md)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download .md/i })).toBeInTheDocument();
  });

  it("renders every module heading", () => {
    const modules = [
      ["overview", "Overview"],
      ["colors", "Colors"],
      ["typography", "Typography"],
      ["layout", "Layout"],
      ["components", "Components"],
      ["effects", "Effects"],
      ["motion", "Motion"],
      ["assets", "Assets"],
      ["ai-rules", "AI Rules"],
      ["export", "Export"],
    ] as const;
    for (const [module, heading] of modules) {
      renderModule(module);
      expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
      cleanup();
    }
  });

  it("renders the export module with all formats", () => {
    renderModule("export");
    expect(screen.getByRole("heading", { level: 1, name: "Export" })).toBeInTheDocument();
    for (const label of ["JSON", "Markdown", "CSS Variables", "Tailwind Config", "TypeScript"]) {
      expect(screen.getByRole("button", { name: new RegExp(`^${label}`) })).toBeInTheDocument();
    }
    expect(screen.getByText("Framework starter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vite + React" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next.js + shadcn" })).toBeInTheDocument();
    expect(screen.getByText("Figma variables")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import variables" })).toBeInTheDocument();
  });
});
