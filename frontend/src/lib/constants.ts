export const APP_NAME = "SaaS-UI";

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? "https://saasui.cloud";

export const REPOSITORY_URL =
  import.meta.env.VITE_REPOSITORY_URL ?? "https://github.com/BlackBenAI/saas-ui";

export const STORAGE_KEYS = {
  preferences: "saas-ui-preferences",
  ui: "saas-ui-ui",
} as const;

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "The complete local editor, without an account.",
    features: [
      "All ten design modules",
      "Local-first projects in IndexedDB",
      "CSS, Tailwind, TypeScript, and JSON exports",
      "MIT licensed source",
    ],
    cta: "Open editor",
    action: "editor",
  },
  {
    name: "Team",
    price: "$19",
    cadence: "per seat / month",
    description: "Cloud sync and collaboration for small teams.",
    features: [
      "Everything in Free",
      "Cloud sync and shared projects",
      "Roles and audit trail",
      "Version history",
    ],
    cta: "Choose Team",
    action: "billing",
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "per seat / month",
    description: "Unlimited projects and advanced workflows.",
    features: [
      "Everything in Team",
      "Unlimited cloud projects",
      "Advanced export presets",
      "Priority support",
    ],
    cta: "Choose Pro",
    action: "billing",
  },
] as const;
