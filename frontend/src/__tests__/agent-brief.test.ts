import { describe, expect, it } from "vitest";

import { AGENT_BRIEF_FILENAME, generateAgentBrief } from "@/lib/agent-brief";
import { DEFAULT_DESIGN_SYSTEM } from "@/types/design-system";

describe("agent brief", () => {
  it("uses a stable Markdown filename", () => {
    expect(AGENT_BRIEF_FILENAME).toBe("AI_INTERFACE_BRIEF.md");
  });

  it("contains the complete interface directive", () => {
    const brief = generateAgentBrief(DEFAULT_DESIGN_SYSTEM);
    expect(brief).toContain("## Mission");
    expect(brief).toContain("## Non-negotiable rules");
    expect(brief).toContain("## Palette — light");
    expect(brief).toContain("## Palette — dark");
    expect(brief).toContain("## Type roles");
    expect(brief).toContain("## Interface composition");
    expect(brief).toContain("## Accessibility");
    expect(brief).toContain("## Definition of done");
    expect(brief).toContain("## Reference CSS");
    expect(brief).not.toContain("{{project_name}}");
  });
});
