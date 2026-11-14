import { calculateContrast, checkWCAG } from "@/lib/color-utils";
import type { DesignSystem } from "@/types/design-system";

export interface QACheck {
  id: string;
  label: string;
  status: "pass" | "warn";
  detail: string;
  fixable?: boolean;
}

export interface QAReport {
  score: number;
  checks: QACheck[];
  passed: number;
  total: number;
}

function readableOn(color: string): string {
  return calculateContrast("#FFFFFF", color) >= calculateContrast("#111111", color)
    ? "#FFFFFF"
    : "#111111";
}

export function buildDesignQA(ds: DesignSystem): QAReport {
  const text = calculateContrast(ds.colors.text, ds.colors.background);
  const muted = calculateContrast(ds.colors.muted, ds.colors.background);
  const action = calculateContrast(readableOn(ds.colors.primary), ds.colors.primary);
  const error = calculateContrast(ds.colors.error, ds.colors.background);
  const success = calculateContrast(ds.colors.success, ds.colors.background);
  const focus = calculateContrast(ds.colors.primary, ds.colors.background);
  const darkText = calculateContrast(ds.darkColors.text, ds.darkColors.background);
  const darkAction = calculateContrast(
    readableOn(ds.darkColors.primary),
    ds.darkColors.primary,
  );
  const button = ds.components.button.md;
  const scale = ds.typography.scale;
  const hierarchy = scale.h1 > scale.h2 && scale.h2 > scale.h3 && scale.h3 >= scale.h4 && scale.h4 >= scale.body && scale.body >= scale.small;
  const checks: QACheck[] = [
    {
      id: "text-contrast",
      label: "Body contrast",
      status: checkWCAG(text).aa ? "pass" : "warn",
      detail: `${text.toFixed(2)}:1 — WCAG AA needs 4.5:1.`,
    },
    {
      id: "muted-contrast",
      label: "Muted text contrast",
      status: checkWCAG(muted).aa ? "pass" : "warn",
      detail: `${muted.toFixed(2)}:1 — raise muted text to 4.5:1.`,
      fixable: !checkWCAG(muted).aa,
    },
    {
      id: "action-contrast",
      label: "Primary action contrast",
      status: checkWCAG(action).aa ? "pass" : "warn",
      detail: `${action.toFixed(2)}:1 with readable action text.`,
    },
    {
      id: "status-contrast",
      label: "Status text contrast",
      status: checkWCAG(Math.min(error, success)).aa ? "pass" : "warn",
      detail: `Error ${error.toFixed(2)}:1 · success ${success.toFixed(2)}:1.`,
    },
    {
      id: "dark-mode-contrast",
      label: "Dark mode contrast",
      status: checkWCAG(darkText).aa ? "pass" : "warn",
      detail: `${darkText.toFixed(2)}:1 body · ${darkAction.toFixed(2)}:1 action — both should meet AA.`,
      fixable: !checkWCAG(darkText).aa || !checkWCAG(darkAction).aa,
    },
    {
      id: "focus-contrast",
      label: "Focus indicator contrast",
      status: checkWCAG(focus).aaLarge ? "pass" : "warn",
      detail: `${focus.toFixed(2)}:1 — aim for at least 3:1 for focus.`,
    },
    {
      id: "touch-target",
      label: "Touch target",
      status: button.height >= 44 ? "pass" : "warn",
      detail: `Default button is ${button.height}px high. Use 44px for touch.`,
      fixable: button.height < 44,
    },
    {
      id: "body-size",
      label: "Body size",
      status: scale.body >= 16 ? "pass" : "warn",
      detail: `${scale.body}px. Long-form body copy should be 16px or more.`,
      fixable: scale.body < 16,
    },
    {
      id: "hierarchy",
      label: "Type hierarchy",
      status: hierarchy ? "pass" : "warn",
      detail: hierarchy
        ? "Display, headings, body, and small sizes descend clearly."
        : "One or more type sizes do not descend in order.",
      fixable: !hierarchy,
    },
    {
      id: "motion",
      label: "Reduced motion",
      status: ds.motion.reducedMotion ? "pass" : "warn",
      detail: ds.motion.reducedMotion
        ? "Reduced motion is part of the system."
        : "No reduced-motion token is recorded. Set it in motion settings.",
      fixable: !ds.motion.reducedMotion,
    },
    {
      id: "breakpoints",
      label: "Responsive breakpoints",
      status: Object.keys(ds.layout.breakpoints).length >= 3 ? "pass" : "warn",
      detail: `${Object.keys(ds.layout.breakpoints).length} breakpoints defined.`,
    },
  ];
  const passed = checks.filter((check) => check.status === "pass").length;
  return {
    score: Math.round((passed / checks.length) * 100),
    checks,
    passed,
    total: checks.length,
  };
}

export function safeMutedFix(ds: DesignSystem): string {
  const candidates = ["#52525B", "#3F3F46", "#6B6B73", "#A1A1AA", "#D4D4D8", "#E4E4E7"];
  return (
    candidates.find((candidate) => calculateContrast(candidate, ds.colors.background) >= 4.5) ??
    ds.colors.text
  );
}

export function safeTypeHierarchy(ds: DesignSystem): DesignSystem["typography"]["scale"] {
  const current = { ...ds.typography.scale };
  if (current.h1 <= current.h2) current.h1 = current.h2 + 8;
  if (current.h2 <= current.h3) current.h2 = current.h3 + 4;
  if (current.h3 < current.h4) current.h3 = current.h4 + 2;
  if (current.h4 < current.body) current.h4 = current.body + 2;
  if (current.body < current.small) current.body = current.small + 2;
  return current;
}

export function qaScoreStyle(score: number): { label: string; color: string; background: string } {
  if (score >= 90) return { label: "Ready to ship", color: "#15803D", background: "#F0FDF4" };
  if (score >= 70) return { label: "Needs polish", color: "#92400E", background: "#FFFBEB" };
  return { label: "Fix before shipping", color: "#B91C1C", background: "#FEF2F2" };
}
