import type { AssetCategory } from "@/lib/db";

export interface StarterAsset {
  id: string;
  name: string;
  category: AssetCategory;
  path: string;
  source: string;
  license: string;
}

const BASE = "/assets/starter";

export const STARTER_ASSETS: StarterAsset[] = [
  { id: "logo-github", name: "GitHub mark", category: "logo", path: `${BASE}/logos/github.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-google", name: "Google mark", category: "logo", path: `${BASE}/logos/google.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-figma", name: "Figma mark", category: "logo", path: `${BASE}/logos/figma.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-react", name: "React mark", category: "logo", path: `${BASE}/logos/react.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-typescript", name: "TypeScript mark", category: "logo", path: `${BASE}/logos/typescript.svg`, source: "Simple Icons", license: "CC0" },
  { id: "icon-palette", name: "Palette", category: "icon", path: `${BASE}/icons/palette.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-type", name: "Typography", category: "icon", path: `${BASE}/icons/type.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-layout", name: "Layout", category: "icon", path: `${BASE}/icons/layout-dashboard.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-sparkles", name: "Sparkles", category: "icon", path: `${BASE}/icons/sparkles.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-bot", name: "AI agent", category: "icon", path: `${BASE}/icons/bot.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-code", name: "Code export", category: "icon", path: `${BASE}/icons/file-code.svg`, source: "Lucide", license: "ISC" },
  { id: "illu-maya", name: "Maya portrait", category: "illustration", path: `${BASE}/illustrations/maya.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "illu-atlas", name: "Atlas portrait", category: "illustration", path: `${BASE}/illustrations/atlas.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "illu-robin", name: "Robin portrait", category: "illustration", path: `${BASE}/illustrations/robin.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "illu-sol", name: "Sol portrait", category: "illustration", path: `${BASE}/illustrations/sol.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "logo-tailwind", name: "Tailwind CSS", category: "logo", path: `${BASE}/logos/tailwindcss.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-vite", name: "Vite", category: "logo", path: `${BASE}/logos/vite.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-django", name: "Django", category: "logo", path: `${BASE}/logos/django.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-postgresql", name: "PostgreSQL", category: "logo", path: `${BASE}/logos/postgresql.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-javascript", name: "JavaScript", category: "logo", path: `${BASE}/logos/javascript.svg`, source: "Simple Icons", license: "CC0" },
  { id: "logo-nextjs", name: "Next.js", category: "logo", path: `${BASE}/logos/nextdotjs.svg`, source: "Simple Icons", license: "CC0" },
  { id: "icon-component", name: "Component", category: "icon", path: `${BASE}/icons/component.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-layers", name: "Layers", category: "icon", path: `${BASE}/icons/layers.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-swatch", name: "Swatches", category: "icon", path: `${BASE}/icons/swatch-book.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-accessibility", name: "Accessibility", category: "icon", path: `${BASE}/icons/accessibility.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-image", name: "Image", category: "icon", path: `${BASE}/icons/image.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-download", name: "Download", category: "icon", path: `${BASE}/icons/download.svg`, source: "Lucide", license: "ISC" },
  { id: "icon-upload", name: "Upload", category: "icon", path: `${BASE}/icons/upload.svg`, source: "Lucide", license: "ISC" },
  { id: "illu-kai", name: "Kai portrait", category: "illustration", path: `${BASE}/illustrations/kai.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "illu-noa", name: "Noa portrait", category: "illustration", path: `${BASE}/illustrations/noa.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "illu-remy", name: "Remy portrait", category: "illustration", path: `${BASE}/illustrations/remy.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
  { id: "illu-zoe", name: "Zoe portrait", category: "illustration", path: `${BASE}/illustrations/zoe.svg`, source: "Open Peeps / DiceBear", license: "CC0" },
];
