import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { LandingPage } from "@/pages/LandingPage";

function renderLanding() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("LandingPage", () => {
  it("renders the hero and a working editor link", () => {
    renderLanding();

    expect(
      screen.getByRole("heading", { level: 1, name: /build something remarkable\./i }),
    ).toBeInTheDocument();

    const editorLinks = screen.getAllByRole("link", { name: /open editor/i });
    expect(editorLinks[0]).toHaveAttribute("href", "/dashboard");
  });

  it("renders the three pricing tiers with their real prices", () => {
    renderLanding();

    expect(screen.getByRole("heading", { level: 3, name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Team" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Pro" })).toBeInTheDocument();
    expect(screen.getByText("$19")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();
  });
});
