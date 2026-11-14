import {
  Accessibility,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowRight,
  Bold,
  Check,
  Clipboard,
  Download,
  FileCode2,
  Image as ImageIcon,
  Italic,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Strikethrough,
  Sparkles,
  Trash2,
  Underline,
  Upload,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { AGENT_BRIEF_FILENAME, generateAgentBrief } from "@/lib/agent-brief";
import {
  applyFigmaVariables,
  exportFigmaVariables,
} from "@/lib/figma";
import {
  buildHandoffBundle,
  buildHandoffStarter,
  type HandoffFramework,
} from "@/lib/handoff";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AI_TEMPLATES,
  AI_TEMPLATE_IDS,
  AI_TEMPLATE_LABELS,
  renderTemplate,
  templateVariables,
  type AITemplateId,
} from "@/lib/ai-templates";
import {
  calculateContrast,
  checkWCAG,
  formatHsl,
  formatRgb,
  generateHarmony,
  rgbToHex,
  type HarmonyType,
} from "@/lib/color-utils";
import { generateButtonCode, generateCardCode, generateTailwindConfig } from "@/lib/code-generator";
import { copyText, downloadFile } from "@/lib/download";
import { generateShadow } from "@/lib/effect-utils";
import { buildExport, EXPORT_FORMATS, type ExportFormat } from "@/lib/exporters";
import {
  GOOGLE_FONT_CATEGORIES,
  GOOGLE_FONTS_POPULAR,
  loadGoogleFont,
  SYSTEM_FONTS,
} from "@/lib/font-loader";
import type { AssetCategory } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useAssetsStore } from "@/stores/useAssetsStore";
import { STARTER_ASSETS } from "@/lib/starter-assets";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";
import { useFontsStore } from "@/stores/useFontsStore";
import { useUIStore } from "@/stores/useUIStore";
import {
  buildTypographyRoles,
  TYPOGRAPHY_ROLES,
  TYPOGRAPHY_ROLE_LABELS,
  type DesignSystem,
  type TypographyRole,
  type TypographyStyle,
} from "@/types/design-system";
import type { ModuleId } from "@/types";

function readableOn(color: string): string {
  return calculateContrast("#FFFFFF", color) >= calculateContrast("#111111", color)
    ? "#FFFFFF"
    : "#111111";
}

function LiveTokenPreview() {
  const ds = useDesignSystemStore((state) => state.designSystem);
  return (
    <aside className="hidden xl:block" aria-label="Live design preview">
      <div className="sticky top-4 space-y-3 rounded-xl border bg-surface p-4 shadow-ambient">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            Live preview
          </p>
          <span role="status" className="h-1.5 w-1.5 rounded-full bg-success" aria-label="Live updates on" />
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: ds.colors.background, color: ds.colors.text }}
        >
          <p
            style={{
              fontFamily: ds.typography.headingFont,
              fontSize: ds.typography.scale.h3,
              fontWeight: ds.typography.weights.semibold,
              lineHeight: ds.typography.lineHeight.heading,
            }}
          >
            {ds.name}
          </p>
          <p
            className="mt-1 line-clamp-2 text-[11px] opacity-70"
            style={{ fontFamily: ds.typography.bodyFont }}
          >
            {ds.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className="px-2 py-1 text-[10px] font-medium"
              style={{
                background: ds.colors.primary,
                color: readableOn(ds.colors.primary),
                borderRadius: ds.layout.radius.md,
              }}
            >
              Primary
            </span>
            <span
              className="px-2 py-1 text-[10px] font-medium"
              style={{
                border: ds.effects.borders.strong,
                borderRadius: ds.layout.radius.md,
                color: ds.colors.text,
              }}
            >
              Secondary
            </span>
            <span
              className="px-2 py-1 text-[10px] font-medium"
              style={{
                background: ds.colors.success,
                color: readableOn(ds.colors.success),
                borderRadius: ds.layout.radius.sm,
              }}
            >
              Badge
            </span>
          </div>
          <div
            className="mt-3 border bg-surface p-2"
            style={{
              borderRadius: ds.layout.radius.lg,
              boxShadow: ds.effects.shadows.md,
              borderColor: ds.colors.muted,
            }}
          >
            <span className="text-[10px] font-medium" style={{ color: ds.colors.text }}>
              Card surface
            </span>
            <div className="mt-2 h-6 rounded-sm" style={{ background: ds.colors.primary }} />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(ds.colors)
            .slice(0, 10)
            .map(([key, value]) => (
              <span
                key={key}
                title={`${key}: ${value}`}
                className="h-6 rounded-sm border"
                style={{ background: value }}
              />
            ))}
        </div>
        <dl className="space-y-1 text-[10px] text-muted-foreground">
          <div className="flex justify-between gap-2">
            <dt>Radius</dt>
            <dd className="font-mono">{ds.layout.radius.md}px</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>H1</dt>
            <dd className="font-mono">{ds.typography.scale.h1}px</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Motion</dt>
            <dd className="font-mono">{ds.motion.duration.panel}ms</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

function ModulePage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:p-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-6">
        <header>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.01em]">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </header>
        {children}
      </div>
      <LiveTokenPreview />
    </div>
  );
}

function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-lg border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 w-7 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent p-0"
        aria-label={`${label} color`}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium">{label}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="block w-full bg-transparent font-mono text-[11px] uppercase text-muted-foreground outline-none"
        />
      </span>
    </label>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "px",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-mono text-[11px] text-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-ew-resize accent-[var(--accent)]"
        aria-label={label}
      />
    </label>
  );
}

function parseShadow(value: string) {
  const match = value.match(
    /(-?\d+)px\s+(-?\d+)px\s+(\d+)px(?:\s+(-?\d+)px)?\s+rgba?\(([^)]+)\)/,
  );
  const channels = (match?.[5] ?? "0,0,0,0.12").split(",").map((part) => Number(part.trim()));
  return {
    x: Number(match?.[1] ?? 0),
    y: Number(match?.[2] ?? 4),
    blur: Number(match?.[3] ?? 10),
    spread: Number(match?.[4] ?? 0),
    color: rgbToHex(channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0),
    opacity: Math.round((channels[3] ?? 0.12) * 100),
  };
}

function ShadowTokenEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const shadow = parseShadow(value);
  const update = (patch: Partial<typeof shadow>) => {
    const next = { ...shadow, ...patch };
    onChange(generateShadow(next.x, next.y, next.blur, next.spread, next.color, next.opacity));
  };
  return (
    <div className="space-y-2 rounded-md border bg-background p-3">
      <p className="font-mono text-[11px] font-medium">{label}</p>
      <SliderField label="X" value={shadow.x} min={-24} max={24} onChange={(x) => update({ x })} />
      <SliderField label="Y" value={shadow.y} min={-24} max={24} onChange={(y) => update({ y })} />
      <SliderField label="Blur" value={shadow.blur} min={0} max={64} onChange={(blur) => update({ blur })} />
      <SliderField label="Spread" value={shadow.spread} min={-12} max={24} onChange={(spread) => update({ spread })} />
      <SliderField label="Opacity" value={shadow.opacity} min={0} max={100} suffix="%" onChange={(opacity) => update({ opacity })} />
    </div>
  );
}

function parseBorder(value: string) {
  const match = value.match(/(\d+)px\s+(solid|dashed|dotted)\s+(#[0-9a-fA-F]{3,8})/);
  return {
    width: Number(match?.[1] ?? 1),
    style: match?.[2] ?? "solid",
    color: match?.[3] ?? "#E4E4E7",
  };
}

function BorderTokenEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const border = parseBorder(value);
  const update = (patch: Partial<typeof border>) => {
    const next = { ...border, ...patch };
    onChange(`${next.width}px ${next.style} ${next.color}`);
  };
  return (
    <div className="space-y-2 rounded-md border bg-background p-3">
      <p className="font-mono text-[11px] font-medium">{label}</p>
      <SliderField label="Width" value={border.width} min={0} max={8} onChange={(width) => update({ width })} />
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={border.color}
          onChange={(event) => update({ color: event.target.value })}
          className="h-7 w-9 cursor-pointer rounded-sm border-0 bg-transparent p-0"
          aria-label={`${label} color`}
        />
        <select
          value={border.style}
          onChange={(event) => update({ style: event.target.value })}
          className="h-7 flex-1 rounded-sm border bg-surface px-1 text-xs"
          aria-label={`${label} style`}
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      <div className="h-7 rounded-sm" style={{ border: value }} />
    </div>
  );
}

const COLOR_LABELS: Record<keyof DesignSystem["colors"], string> = {
  primary: "Primary",
  secondary: "Secondary",
  background: "Background",
  surface: "Surface",
  text: "Text",
  muted: "Muted",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

export function OverviewPage() {
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  const updateColor = useDesignSystemStore((state) => state.updateColor);
  const updateScale = useDesignSystemStore((state) => state.updateScale);
  const updateRadius = useDesignSystemStore((state) => state.updateRadius);
  const contrast = calculateContrast(designSystem.colors.text, designSystem.colors.background);
  const wcag = checkWCAG(contrast);
  const modules: Array<{ id: ModuleId; label: string; value: string }> = [
    { id: "colors", label: "Colors", value: `${Object.keys(designSystem.colors).length}` },
    { id: "typography", label: "Typography", value: `${Object.keys(designSystem.typography.scale).length}` },
    { id: "layout", label: "Layout", value: `${Object.keys(designSystem.layout.spacing).length}` },
    { id: "components", label: "Components", value: "9" },
    { id: "effects", label: "Effects", value: `${Object.keys(designSystem.effects.shadows).length}` },
    { id: "motion", label: "Motion", value: `${Object.keys(designSystem.motion.duration).length}` },
  ];

  return (
    <ModulePage
      title="Overview"
      description="A live summary of your design system. Every value below comes from the local project."
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Panel title="Design system preview">
          <div
            className="rounded-lg p-5"
            style={{ background: designSystem.colors.background, color: designSystem.colors.text }}
          >
            <h3
              style={{
                fontFamily: designSystem.typography.headingFont,
                fontSize: designSystem.typography.scale.h2,
                lineHeight: designSystem.typography.lineHeight.heading,
              }}
            >
              {designSystem.name}
            </h3>
            <p className="mt-1 text-sm opacity-70">{designSystem.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                style={{
                  background: designSystem.colors.primary,
                  color: readableOn(designSystem.colors.primary),
                  borderRadius: designSystem.layout.radius.md,
                }}
                className="px-3 py-1.5 text-xs font-medium"
              >
                Primary action
              </button>
              <button
                type="button"
                style={{
                  border: designSystem.effects.borders.strong,
                  borderRadius: designSystem.layout.radius.md,
                  color: designSystem.colors.text,
                }}
                className="px-3 py-1.5 text-xs font-medium"
              >
                Secondary
              </button>
              <span
                style={{
                  background: designSystem.colors.success,
                  color: readableOn(designSystem.colors.success),
                  borderRadius: designSystem.layout.radius.sm,
                }}
                className="px-2 py-1 text-[11px] font-medium"
              >
                Success
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Object.entries(designSystem.colors)
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={key}>
                    <div
                      className="h-8 rounded-md border"
                      style={{ background: value }}
                    />
                    <p className="mt-1 font-mono text-[10px] opacity-70">{key}</p>
                  </div>
                ))}
            </div>
            <input
              readOnly
              value="Input preview"
              aria-label="Input preview"
              className="mt-4 h-8 w-full rounded-md border bg-transparent px-2 text-xs"
              style={{ borderRadius: designSystem.layout.radius.md }}
            />
          </div>
        </Panel>

        <Panel title="Quick settings">
          <div className="space-y-4">
            <ColorField
              label="Primary color"
              value={designSystem.colors.primary}
              onChange={(value) => updateColor("primary", value)}
            />
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Heading font</span>
              <select
                value={designSystem.typography.headingFont}
                onChange={(event) => {
                  loadGoogleFont(event.target.value);
                  useDesignSystemStore.getState().updateTypography({ headingFont: event.target.value });
                }}
                className="h-8 w-full rounded-md border bg-surface px-2 text-xs"
              >
                {GOOGLE_FONTS_POPULAR.map((font) => (
                  <option key={font}>{font}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">H1 size</span>
              <input
                type="range"
                min={24}
                max={64}
                value={designSystem.typography.scale.h1}
                onChange={(event) => updateScale("h1", Number(event.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <span className="font-mono text-[11px] text-muted-foreground">
                {designSystem.typography.scale.h1}px
              </span>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Border radius</span>
              <input
                type="range"
                min={0}
                max={24}
                value={designSystem.layout.radius.md}
                onChange={(event) => updateRadius("md", Number(event.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <span className="font-mono text-[11px] text-muted-foreground">
                {designSystem.layout.radius.md}px
              </span>
            </label>
          </div>
        </Panel>
      </div>

      <Panel title="Quick access">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={module.id === "overview" ? "/dashboard" : `/dashboard/${module.id}`}
              className="flex items-center justify-between rounded-md border bg-background px-3 py-2.5 text-sm transition-colors duration-120 hover:bg-secondary"
            >
              <span>{module.label}</span>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                {module.value}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="System summary">
          <dl className="space-y-2 text-sm">
            {[
              ["Colors", Object.keys(designSystem.colors).length],
              ["Type styles", Object.keys(designSystem.typography.scale).length],
              ["Spacing tokens", Object.keys(designSystem.layout.spacing).length],
              ["Shadows", Object.keys(designSystem.effects.shadows).length],
              ["Motion durations", Object.keys(designSystem.motion.duration).length],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-mono text-xs">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Accessibility">
          <div className="flex items-start gap-3">
            <Accessibility className="mt-0.5 h-5 w-5 text-accent" aria-hidden="true" />
            <div>
              <p className="font-mono text-2xl font-semibold">{contrast.toFixed(2)}:1</p>
              <p className="mt-1 text-sm text-muted-foreground">Text on background</p>
              <div className="mt-3 flex gap-2">
                <Badge variant={wcag.aa ? "success" : "outline"}>AA {wcag.aa ? "pass" : "fail"}</Badge>
                <Badge variant={wcag.aaa ? "success" : "outline"}>AAA {wcag.aaa ? "pass" : "fail"}</Badge>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </ModulePage>
  );
}

const HARMONIES: HarmonyType[] = ["complementary", "analogous", "triadic", "splitComplementary"];

export function ColorsPage() {
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  const colorMode = useDesignSystemStore((state) => state.colorMode);
  const setColorMode = useDesignSystemStore((state) => state.setColorMode);
  const setTheme = useUIStore((state) => state.setTheme);
  const updateColor = useDesignSystemStore((state) => state.updateColor);
  const fileRef = useRef<HTMLInputElement>(null);
  const [harmony, setHarmony] = useState<HarmonyType>("complementary");
  const contrast = calculateContrast(designSystem.colors.text, designSystem.colors.background);

  function importPalette(file: File | undefined) {
    if (!file) return;
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text) as Record<string, string>;
        for (const [key, value] of Object.entries(parsed)) {
          if (key in designSystem.colors && typeof value === "string") {
            updateColor(key as keyof DesignSystem["colors"], value);
          }
        }
        toast.success("Palette imported.");
      })
      .catch(() => toast.error("Invalid palette JSON."));
  }

  function chooseMode(mode: "light" | "dark") {
    setColorMode(mode);
    setTheme(mode);
  }

  return (
    <ModulePage
      title="Colors"
      description="Edit the light and dark palettes, inspect WCAG contrast, and generate harmonious colors."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-surface p-3">
        <div>
          <p className="text-xs font-semibold">Editing the {colorMode} palette</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Both palettes are stored, previewed, exported, and included in the AI prompt.
          </p>
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Color mode">
          <Button
            size="sm"
            variant={colorMode === "light" ? "default" : "outline"}
            onClick={() => chooseMode("light")}
          >
            Light
          </Button>
          <Button
            size="sm"
            variant={colorMode === "dark" ? "default" : "outline"}
            onClick={() => chooseMode("dark")}
          >
            Dark
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Panel
          title="Core palette"
          action={
            <div className="flex gap-1.5">
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => importPalette(event.target.files?.[0])}
              />
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" aria-hidden="true" /> Import
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void copyText(JSON.stringify(designSystem.colors, null, 2));
                  toast.success("Palette copied.");
                }}
              >
                <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy
              </Button>
            </div>
          }
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(designSystem.colors) as Array<keyof DesignSystem["colors"]>).map((key) => (
              <ColorField
                key={key}
                label={COLOR_LABELS[key]}
                value={designSystem.colors[key]}
                onChange={(value) => updateColor(key, value)}
              />
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Contrast">
            <p className="font-mono text-2xl font-semibold">{contrast.toFixed(2)}:1</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {designSystem.colors.text} on {designSystem.colors.background}
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant={contrast >= 4.5 ? "success" : "outline"}>AA</Badge>
              <Badge variant={contrast >= 7 ? "success" : "outline"}>AAA</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              RGB {formatRgb(designSystem.colors.text)} · HSL {formatHsl(designSystem.colors.text)}
            </p>
          </Panel>
          <Panel title="Harmony">
            <select
              value={harmony}
              onChange={(event) => setHarmony(event.target.value as HarmonyType)}
              className="h-8 w-full rounded-md border bg-surface px-2 text-xs capitalize"
              aria-label="Harmony type"
            >
              {HARMONIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <div className="mt-3 flex gap-2">
              {generateHarmony(designSystem.colors.primary, harmony).map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-12 flex-1 rounded-md border"
                  style={{ background: color }}
                  title={color}
                  onClick={() => updateColor("primary", color)}
                  aria-label={`Use ${color}`}
                />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void copyText(generateHarmony(designSystem.colors.primary, harmony).join("\n"));
                  toast.success("Harmony copied.");
                }}
              >
                Copy harmony
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </ModulePage>
  );
}

const FONT_PAIRINGS = [
  { name: "Product clarity", heading: "Manrope", body: "Inter" },
  { name: "Editorial", heading: "Playfair Display", body: "Source Sans 3" },
  { name: "Technical", heading: "Space Grotesk", body: "IBM Plex Sans" },
  { name: "Warm serif", heading: "Fraunces", body: "Work Sans" },
  { name: "Modern grotesk", heading: "Schibsted Grotesk", body: "DM Sans" },
  { name: "Studio", heading: "DM Serif Display", body: "DM Sans" },
];

const SCALE_RATIOS = [1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618];

function typographyCss(style: TypographyStyle, mono = false): CSSProperties {
  const features = [
    style.features.ligatures ? '"liga" 1' : null,
    style.features.tabularNumbers ? '"tnum" 1' : null,
    style.features.smallCaps ? '"smcp" 1' : null,
    style.features.stylisticAlternates ? '"salt" 1' : null,
  ].filter(Boolean);

  return {
    fontFamily: `"${style.fontFamily}", ${mono ? "monospace" : "sans-serif"}`,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}em`,
    textTransform: style.textCase === "none" ? undefined : style.textCase,
    fontStyle: style.fontStyle,
    textDecoration:
      style.textDecoration === "none" ? undefined : style.textDecoration,
    textAlign: style.textAlign,
    fontFeatureSettings: features.length ? features.join(", ") : undefined,
    textShadow:
      style.textEffects.shadow === "none" ? undefined : style.textEffects.shadow,
    WebkitTextStroke:
      style.textEffects.outline === "none" ? undefined : style.textEffects.outline,
    paintOrder: "stroke fill",
  };
}

export function TypographyPage() {
  const typography = useDesignSystemStore((state) => state.designSystem.typography);
  const updateTypography = useDesignSystemStore((state) => state.updateTypography);
  const updateTextStyle = useDesignSystemStore((state) => state.updateTextStyle);
  const updateTypographySettings = useDesignSystemStore(
    (state) => state.updateTypographySettings,
  );
  const applyTypeScale = useDesignSystemStore((state) => state.applyTypeScale);
  const updateResponsiveBase = useDesignSystemStore(
    (state) => state.updateResponsiveBase,
  );
  const textBlocks = useDesignSystemStore((state) => state.designSystem.textBlocks);
  const addTextBlock = useDesignSystemStore((state) => state.addTextBlock);
  const updateTextBlock = useDesignSystemStore((state) => state.updateTextBlock);
  const removeTextBlock = useDesignSystemStore((state) => state.removeTextBlock);
  const customFonts = useFontsStore((state) => state.fonts);
  const fontsLoading = useFontsStore((state) => state.isLoading);
  const addFont = useFontsStore((state) => state.addFont);
  const deleteFont = useFontsStore((state) => state.deleteFont);
  const loadFonts = useFontsStore((state) => state.loadFonts);
  const [role, setRole] = useState<TypographyRole>("h1");
  const [fontQuery, setFontQuery] = useState("");
  const [fontName, setFontName] = useState("");
  const [fontWeight, setFontWeight] = useState(400);
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [fontBusy, setFontBusy] = useState(false);
  const [previewBreakpoint, setPreviewBreakpoint] = useState("base");
  const fontFileRef = useRef<HTMLInputElement>(null);
  const [sample, setSample] = useState(
    "The quick brown fox jumps over the lazy dog. Design decisions stay exact from the canvas to the codebase.",
  );

  const style = typography.roles[role];
  const customFamilies = new Set(customFonts.map((font) => font.family));
  const previewBase =
    previewBreakpoint === "base"
      ? typography.baseSize
      : typography.responsive[previewBreakpoint] ?? typography.baseSize;
  const responsiveFactor = previewBase / Math.max(1, typography.baseSize);

  function roleStyle(id: TypographyRole): TypographyStyle {
    return {
      ...typography.roles[id],
      fontSize: Math.max(9, Math.round(typography.roles[id].fontSize * responsiveFactor)),
    };
  }
  const textRoles = typography.roles;

  useEffect(() => {
    const families = new Set([
      typography.headingFont,
      typography.bodyFont,
      typography.monoFont,
      ...Object.values(typography.roles).map((item) => item.fontFamily),
    ]);
    families.forEach((family) => loadGoogleFont(family));
    void loadFonts();
  }, [typography.headingFont, typography.bodyFont, typography.monoFont, typography.roles, loadFonts]);

  const filteredCategories = useMemo<Record<string, readonly string[]>>(() => {
    const query = fontQuery.trim().toLowerCase();
    if (!query) return GOOGLE_FONT_CATEGORIES;
    return Object.fromEntries(
      Object.entries(GOOGLE_FONT_CATEGORIES)
        .map(([category, fonts]) => [
          category,
          fonts.filter((font) => font.toLowerCase().includes(query)),
        ])
        .filter(([, fonts]) => fonts.length > 0),
    ) as Record<string, readonly string[]>;
  }, [fontQuery]);

  function loadFamily(fontFamily: string) {
    if (!customFamilies.has(fontFamily)) {
      loadGoogleFont(fontFamily);
    }
  }

  function chooseFont(fontFamily: string) {
    loadFamily(fontFamily);
    updateTextStyle(role, { fontFamily });
  }

  async function onFontFile(file: File | undefined) {
    if (!file) return;
    setFontFile(file);
    setFontName((current) => current || file.name.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " "));
  }

  async function uploadFont() {
    if (!fontFile) {
      toast.error("Choose a font file first.");
      return;
    }
    setFontBusy(true);
    try {
      await addFont(fontFile, fontName, fontWeight, fontStyle);
      toast.success(`${fontName || fontFile.name} added to the font library.`);
      setFontFile(null);
      setFontName("");
      if (fontFileRef.current) fontFileRef.current.value = "";
    } catch {
      toast.error("Unable to register this font file.");
    } finally {
      setFontBusy(false);
    }
  }

  function resetRole() {
    const defaults = buildTypographyRoles(typography);
    updateTextStyle(role, defaults[role]);
  }

  function applyPairing(pairing: (typeof FONT_PAIRINGS)[number]) {
    loadGoogleFont(pairing.heading);
    loadGoogleFont(pairing.body);
    updateTypography({ headingFont: pairing.heading, bodyFont: pairing.body });
    toast.success(`${pairing.name} pairing applied.`);
  }

  const fontOptions = (
    <>
      {customFamilies.size ? (
        <optgroup label="Custom">
          {[...customFamilies].map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </optgroup>
      ) : null}
      <optgroup label="System">
        {SYSTEM_FONTS.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </optgroup>
      {Object.entries(filteredCategories).map(([category, fonts]) => (
        <optgroup key={category} label={category}>
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );

  const caseOptions: Array<[TypographyStyle["textCase"], string]> = [
    ["none", "Default"],
    ["uppercase", "UPPER"],
    ["lowercase", "lower"],
    ["capitalize", "Title"],
  ];

  return (
    <ModulePage
      title="Typography"
      description="Build a complete type system: families, roles, scale, rhythm, case, alignment, and paragraph behavior."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Panel
            title="Font library"
            action={
              <span className="font-mono text-[10px] text-muted-foreground">
                {GOOGLE_FONTS_POPULAR.length} Google fonts
              </span>
            }
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={fontQuery}
                onChange={(event) => setFontQuery(event.target.value)}
                placeholder="Search fonts by name"
                aria-label="Search fonts"
                className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["headingFont", "Heading", "display"],
                  ["bodyFont", "Body", "body"],
                  ["monoFont", "Mono", "code"],
                ] as const
              ).map(([key, label, previewRole]) => (
                <label key={key} className="block space-y-1">
                  <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    {label}
                  </span>
                  <select
                    value={typography[key]}
                    onChange={(event) => {
                      loadFamily(event.target.value);
                      updateTypography({ [key]: event.target.value });
                    }}
                    className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                    aria-label={`${label} font`}
                  >
                    {fontOptions}
                  </select>
                  <span
                    className="block truncate text-lg"
                    style={{ fontFamily: `"${typography[key]}", sans-serif` }}
                    aria-hidden="true"
                  >
                    Aa
                  </span>
                  <span className="block truncate font-mono text-[9px] text-muted-foreground">
                    {textRoles[previewRole].fontSize}px · {textRoles[previewRole].fontWeight}
                  </span>
                </label>
              ))}
            </div>
          </Panel>

          <Panel
            title="Custom fonts"
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => fontFileRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" aria-hidden="true" /> Choose file
              </Button>
            }
          >
            <input
              ref={fontFileRef}
              type="file"
              accept=".woff2,.woff,.ttf,.otf"
              className="hidden"
              onChange={(event) => void onFontFile(event.target.files?.[0])}
              aria-label="Custom font file"
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Add WOFF2, WOFF, TTF, or OTF files. Fonts stay in this browser (IndexedDB) and are
              available in every text role. Bundle the font file with your app when exporting.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_110px_100px_auto]">
              <input
                value={fontName}
                onChange={(event) => setFontName(event.target.value)}
                placeholder="Family name"
                aria-label="Custom font family name"
                className="h-9 min-w-0 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <select
                value={fontWeight}
                onChange={(event) => setFontWeight(Number(event.target.value))}
                className="h-9 rounded-md border bg-surface px-2 text-xs"
                aria-label="Custom font weight"
              >
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
              <select
                value={fontStyle}
                onChange={(event) =>
                  setFontStyle(event.target.value as "normal" | "italic")
                }
                className="h-9 rounded-md border bg-surface px-2 text-xs"
                aria-label="Custom font style"
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
              <Button
                type="button"
                size="sm"
                onClick={() => void uploadFont()}
                disabled={fontBusy || !fontFile}
              >
                {fontBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Add
              </Button>
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              {fontFile ? fontFile.name : "No file selected"}
            </p>
            {fontsLoading ? (
              <div className="mt-3 flex justify-center py-4 text-muted-foreground" role="status">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span className="sr-only">Loading fonts</span>
              </div>
            ) : customFonts.length ? (
              <ul className="mt-3 space-y-1.5">
                {customFonts.map((font) => (
                  <li
                    key={font.id}
                    className="flex items-center justify-between gap-3 rounded-md border bg-background px-2.5 py-2"
                  >
                    <span className="min-w-0">
                      <span
                        className="block truncate text-xs font-medium"
                        style={{ fontFamily: `"${font.family}", sans-serif` }}
                      >
                        {font.family}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">
                        {font.weight} · {font.style}
                      </span>
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => void deleteFont(font.id)}
                      aria-label={`Delete ${font.family} ${font.weight} ${font.style}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[11px] text-muted-foreground">No custom fonts yet.</p>
            )}
          </Panel>

          <Panel
            title="Text styles"
            action={
              <span className="font-mono text-[10px] text-muted-foreground">
                {TYPOGRAPHY_ROLE_LABELS[role]}
              </span>
            }
          >
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Typography roles">
              {TYPOGRAPHY_ROLES.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={role === id}
                  onClick={() => setRole(id)}
                  className={`rounded-sm border px-2 py-1 text-[10px] font-medium transition-colors duration-120 ${
                    role === id
                      ? "border-accent bg-accent-soft text-accent-hover"
                      : "bg-surface text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {TYPOGRAPHY_ROLE_LABELS[id]}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-muted-foreground">Font family</span>
                <select
                  value={style.fontFamily}
                  onChange={(event) => chooseFont(event.target.value)}
                  className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                  aria-label={`${TYPOGRAPHY_ROLE_LABELS[role]} font family`}
                  style={{ fontFamily: `"${style.fontFamily}", sans-serif` }}
                >
                  {fontOptions}
                </select>
              </label>
              <SliderField
                label="Size"
                min={8}
                max={120}
                value={style.fontSize}
                onChange={(value) => updateTextStyle(role, { fontSize: value })}
              />
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Weight</span>
                <select
                  value={style.fontWeight}
                  onChange={(event) =>
                    updateTextStyle(role, { fontWeight: Number(event.target.value) })
                  }
                  className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                  aria-label={`${TYPOGRAPHY_ROLE_LABELS[role]} weight`}
                >
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </label>
              <SliderField
                label="Line height"
                min={0.8}
                max={2.4}
                step={0.05}
                suffix=""
                value={style.lineHeight}
                onChange={(value) => updateTextStyle(role, { lineHeight: value })}
              />
              <SliderField
                label="Letter spacing"
                min={-0.1}
                max={0.3}
                step={0.005}
                suffix="em"
                value={style.letterSpacing}
                onChange={(value) => updateTextStyle(role, { letterSpacing: value })}
              />

              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Case</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {caseOptions.map(([value, label]) => (
                    <Button
                      key={value}
                      type="button"
                      size="sm"
                      variant={style.textCase === value ? "default" : "outline"}
                      onClick={() => updateTextStyle(role, { textCase: value })}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Emphasis</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={style.fontStyle === "normal" ? "default" : "outline"}
                    onClick={() => updateTextStyle(role, { fontStyle: "normal" })}
                  >
                    Normal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={style.fontStyle === "italic" ? "default" : "outline"}
                    onClick={() => updateTextStyle(role, { fontStyle: "italic" })}
                  >
                    <Italic className="h-3.5 w-3.5" aria-hidden="true" /> Italic
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={style.textDecoration === "underline" ? "default" : "outline"}
                    onClick={() =>
                      updateTextStyle(role, {
                        textDecoration:
                          style.textDecoration === "underline" ? "none" : "underline",
                      })
                    }
                  >
                    <Underline className="h-3.5 w-3.5" aria-hidden="true" /> Underline
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={style.textDecoration === "line-through" ? "default" : "outline"}
                    onClick={() =>
                      updateTextStyle(role, {
                        textDecoration:
                          style.textDecoration === "line-through" ? "none" : "line-through",
                      })
                    }
                  >
                    <Strikethrough className="h-3.5 w-3.5" aria-hidden="true" /> Strike
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={style.fontWeight >= 600 ? "default" : "outline"}
                    onClick={() =>
                      updateTextStyle(role, { fontWeight: style.fontWeight >= 600 ? 400 : 700 })
                    }
                  >
                    <Bold className="h-3.5 w-3.5" aria-hidden="true" /> Bold
                  </Button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Alignment</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(
                    [
                      ["left", AlignLeft, "Align left"],
                      ["center", AlignCenter, "Align center"],
                      ["right", AlignRight, "Align right"],
                      ["justify", AlignJustify, "Justify"],
                    ] as const
                  ).map(([value, Icon, label]) => (
                    <Button
                      key={value}
                      type="button"
                      size="sm"
                      variant={style.textAlign === value ? "default" : "outline"}
                      onClick={() => updateTextStyle(role, { textAlign: value })}
                      aria-label={label}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">OpenType features</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(
                  [
                    ["ligatures", "Ligatures"],
                    ["tabularNumbers", "Tabular numbers"],
                    ["smallCaps", "Small caps"],
                    ["stylisticAlternates", "Stylistic alternates"],
                  ] as const
                ).map(([key, label]) => (
                  <Button
                    key={key}
                    type="button"
                    size="sm"
                    variant={style.features[key] ? "default" : "outline"}
                    onClick={() =>
                      updateTextStyle(role, {
                        features: {
                          ...style.features,
                          [key]: !style.features[key],
                        },
                      })
                    }
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Text effects</p>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                <label className="block space-y-1">
                  <span className="text-[10px] text-muted-foreground">Shadow</span>
                  <select
                    value={style.textEffects.shadow}
                    onChange={(event) =>
                      updateTextStyle(role, {
                        textEffects: {
                          ...style.textEffects,
                          shadow: event.target.value,
                        },
                      })
                    }
                    className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                    aria-label="Text shadow"
                  >
                    <option value="none">None</option>
                    <option value="0 1px 2px rgba(0,0,0,0.12)">Soft</option>
                    <option value="0 2px 4px rgba(0,0,0,0.22)">Hard</option>
                    <option value="0 0 12px currentColor">Glow</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] text-muted-foreground">Outline</span>
                  <select
                    value={style.textEffects.outline}
                    onChange={(event) =>
                      updateTextStyle(role, {
                        textEffects: {
                          ...style.textEffects,
                          outline: event.target.value,
                        },
                      })
                    }
                    className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                    aria-label="Text outline"
                  >
                    <option value="none">None</option>
                    <option value="1px rgba(0,0,0,0.35)">Thin</option>
                    <option value="2px rgba(0,0,0,0.45)">Strong</option>
                    <option value="1px rgba(255,255,255,0.65)">Light</option>
                  </select>
                </label>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Highlight</span>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={
                        style.textEffects.highlight === "transparent"
                          ? "#FEF08A"
                          : style.textEffects.highlight
                      }
                      onChange={(event) =>
                        updateTextStyle(role, {
                          textEffects: {
                            ...style.textEffects,
                            highlight: event.target.value,
                          },
                        })
                      }
                      aria-label="Highlight color"
                      className="h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-surface p-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateTextStyle(role, {
                          textEffects: {
                            ...style.textEffects,
                            highlight: "transparent",
                          },
                        })
                      }
                    >
                      None
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
              <p className="font-mono text-[10px] text-muted-foreground">
                {TYPOGRAPHY_ROLE_LABELS[role]} · {style.fontSize}px / {style.lineHeight} ·{" "}
                {style.fontWeight} · {style.letterSpacing}em
              </p>
              <Button size="sm" variant="outline" onClick={resetRole}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset role
              </Button>
            </div>
          </Panel>
          <Panel
            title="Free text blocks"
            action={
              <Button size="sm" variant="outline" onClick={addTextBlock}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add block
              </Button>
            }
          >
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Add text layers to the preview canvas. Each block uses one of the type roles and
              stays with the project.
            </p>
            {textBlocks.length ? (
              <div className="mt-3 space-y-2">
                {textBlocks.map((block) => (
                  <div key={block.id} className="rounded-md border bg-background p-2">
                    <div className="flex gap-2">
                      <select
                        value={block.role}
                        onChange={(event) =>
                          updateTextBlock(block.id, {
                            role: event.target.value as TypographyRole,
                          })
                        }
                        className="h-8 min-w-0 flex-1 rounded-md border bg-surface px-2 text-xs"
                        aria-label="Text block role"
                      >
                        {TYPOGRAPHY_ROLES.map((id) => (
                          <option key={id} value={id}>
                            {TYPOGRAPHY_ROLE_LABELS[id]}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTextBlock(block.id)}
                        aria-label="Delete text block"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(event) =>
                        updateTextBlock(block.id, { content: event.target.value })
                      }
                      rows={2}
                      className="mt-2 w-full resize-y rounded-md border bg-surface p-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Text block content"
                    />
                    <label className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      Max width
                      <input
                        type="range"
                        min={240}
                        max={960}
                        step={20}
                        value={block.maxWidth}
                        onChange={(event) =>
                          updateTextBlock(block.id, {
                            maxWidth: Number(event.target.value),
                          })
                        }
                        className="h-1.5 flex-1 accent-[var(--accent)]"
                        aria-label="Text block max width"
                      />
                      <span className="font-mono">{block.maxWidth}px</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-muted-foreground">No text blocks yet.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Modular scale">
            <SliderField
              label="Base size"
              min={12}
              max={24}
              value={typography.baseSize}
              onChange={(value) =>
                updateTypographySettings({ baseSize: value })
              }
            />
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Ratio</span>
              <select
                value={typography.scaleRatio}
                onChange={(event) =>
                  updateTypographySettings({ scaleRatio: Number(event.target.value) })
                }
                className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                aria-label="Type scale ratio"
              >
                {SCALE_RATIOS.map((ratio) => (
                  <option key={ratio} value={ratio}>
                    {ratio}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              className="mt-3 w-full"
              onClick={() => applyTypeScale(typography.baseSize, typography.scaleRatio)}
            >
              Generate scale
            </Button>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TYPOGRAPHY_ROLES.map((id) => (
                <span
                  key={id}
                  className="rounded-sm border bg-background px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
                >
                  {id} {textRoles[id].fontSize}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Responsive type ramp">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Preview at</span>
              <select
                value={previewBreakpoint}
                onChange={(event) => setPreviewBreakpoint(event.target.value)}
                className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                aria-label="Preview breakpoint"
              >
                <option value="base">Base ({typography.baseSize}px)</option>
                <option value="sm">Mobile · sm ({typography.responsive.sm}px)</option>
                <option value="md">Tablet · md ({typography.responsive.md}px)</option>
                <option value="lg">Desktop · lg ({typography.responsive.lg}px)</option>
                <option value="xl">Wide · xl ({typography.responsive.xl}px)</option>
              </select>
            </label>
            <div className="mt-3 space-y-2.5">
              {(["sm", "md", "lg", "xl"] as const).map((breakpoint) => (
                <SliderField
                  key={breakpoint}
                  label={`${breakpoint} base size`}
                  min={10}
                  max={24}
                  value={typography.responsive[breakpoint] ?? typography.baseSize}
                  onChange={(value) => updateResponsiveBase(breakpoint, value)}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Preview scale ×{responsiveFactor.toFixed(2)}
            </p>
          </Panel>

          <Panel title="Paragraph rhythm">
            <div className="space-y-2.5">
              <SliderField
                label="Paragraph spacing"
                min={0}
                max={48}
                value={typography.paragraph.spacing}
                onChange={(value) =>
                  updateTypographySettings({ paragraph: { spacing: value } })
                }
              />
              <SliderField
                label="List spacing"
                min={0}
                max={32}
                value={typography.paragraph.listSpacing}
                onChange={(value) =>
                  updateTypographySettings({ paragraph: { listSpacing: value } })
                }
              />
              <SliderField
                label="Indent"
                min={0}
                max={64}
                value={typography.paragraph.indent}
                onChange={(value) =>
                  updateTypographySettings({ paragraph: { indent: value } })
                }
              />
            </div>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Body alignment</span>
              <select
                value={typography.paragraph.align}
                onChange={(event) =>
                  updateTypographySettings({
                    paragraph: {
                      align: event.target.value as TypographyStyle["textAlign"],
                    },
                  })
                }
                className="h-9 w-full rounded-md border bg-surface px-2 text-xs"
                aria-label="Body alignment"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </label>
          </Panel>

          <Panel title="Font pairings">
            <div className="grid gap-2">
              {FONT_PAIRINGS.map((pairing) => (
                <button
                  key={pairing.name}
                  type="button"
                  onClick={() => applyPairing(pairing)}
                  className="flex items-center justify-between gap-3 rounded-md border bg-surface px-3 py-2 text-left transition-colors duration-120 hover:bg-secondary"
                >
                  <span className="text-[11px] font-medium">{pairing.name}</span>
                  <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span style={{ fontFamily: `"${pairing.heading}", sans-serif` }}>
                      {pairing.heading}
                    </span>
                    <span aria-hidden="true">+</span>
                    <span style={{ fontFamily: `"${pairing.body}", sans-serif` }}>
                      {pairing.body}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        title="Live typography preview"
        action={
          <span className="font-mono text-[10px] text-muted-foreground">
            {typography.headingFont} / {typography.bodyFont} / {typography.monoFont}
          </span>
        }
      >
        <input
          value={sample}
          onChange={(event) => setSample(event.target.value)}
          aria-label="Sample text"
          className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="mt-4 rounded-lg border bg-background p-5" style={{ fontFamily: typography.bodyFont }}>
          <p style={{ ...typographyCss(roleStyle(role)), marginBottom: 12 }}>
            <span
              style={{
                backgroundColor:
                  style.textEffects.highlight === "transparent"
                    ? undefined
                    : style.textEffects.highlight,
                padding: "0 2px",
              }}
            >
              {TYPOGRAPHY_ROLE_LABELS[role]}: {sample}
            </span>
          </p>
          <p style={typographyCss(roleStyle("display"))}>Design that ships.</p>
          <p style={{ ...typographyCss(roleStyle("h1")), marginTop: 24 }}>
            A complete system, not a pile of styles.
          </p>
          <p style={{ ...typographyCss(roleStyle("h2")), marginTop: 20 }}>
            Type, rhythm, and hierarchy.
          </p>
          <p style={{ ...typographyCss(roleStyle("lead")), marginTop: typography.paragraph.spacing }}>
            Lead paragraph: make the promise clear before the details.
          </p>
          <p
            style={{
              ...typographyCss(roleStyle("body")),
              textAlign: typography.paragraph.align,
              marginTop: typography.paragraph.spacing,
            }}
          >
            {sample}
          </p>
          <ul
            style={{
              ...typographyCss(roleStyle("body")),
              marginTop: typography.paragraph.listSpacing,
              paddingLeft: 20 + typography.paragraph.indent,
              listStyleType: "disc",
            }}
          >
            <li>Structured tokens, not one-off values.</li>
            <li>Readable rhythm across every surface.</li>
            <li>Light and dark palettes stay in sync.</li>
          </ul>
          <blockquote
            style={{
              ...typographyCss(roleStyle("quote")),
              marginTop: typography.paragraph.spacing,
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "12px 16px",
              background: "var(--background-secondary)",
            }}
          >
            “The system is the source of truth.”
          </blockquote>
          <pre
            tabIndex={0}
            aria-label="Code token preview"
            style={{
              ...typographyCss(roleStyle("code"), true),
              marginTop: typography.paragraph.spacing,
              overflowX: "auto",
              borderRadius: 8,
              background: "var(--background-secondary)",
              padding: 12,
            }}
          >
            --color-primary: #4F46E5;
          </pre>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span style={typographyCss(roleStyle("label"))}>LABEL</span>
            <span style={typographyCss(roleStyle("caption"))}>Caption text</span>
            <span style={typographyCss(roleStyle("small"))}>Small text</span>
          </div>
          {textBlocks.length ? (
            <div className="mt-6 space-y-4 border-t pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                Free text blocks
              </p>
              {textBlocks.map((block) => (
                <p
                  key={block.id}
                  style={{
                    ...typographyCss(roleStyle(block.role), block.role === "code"),
                    maxWidth: block.maxWidth,
                    whiteSpace: "pre-wrap",
                    backgroundColor:
                      textRoles[block.role].textEffects.highlight === "transparent"
                        ? undefined
                        : textRoles[block.role].textEffects.highlight,
                  }}
                >
                  {block.content}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </Panel>
    </ModulePage>
  );
}

export function LayoutPage() {
  const layout = useDesignSystemStore((state) => state.designSystem.layout);
  const updateSpacing = useDesignSystemStore((state) => state.updateSpacing);
  const updateRadius = useDesignSystemStore((state) => state.updateRadius);
  const updateBreakpoint = useDesignSystemStore((state) => state.updateBreakpoint);
  const updateLayout = useDesignSystemStore((state) => state.updateLayout);

  return (
    <ModulePage title="Layout" description="Spacing, radius, breakpoints, and container width for every surface.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Spacing scale">
          <div className="space-y-2.5">
            {Object.entries(layout.spacing).map(([key, value]) => (
              <SliderField
                key={key}
                label={`space-${key}`}
                min={0}
                max={128}
                value={value}
                onChange={(next) => updateSpacing(key, next)}
              />
            ))}
          </div>
        </Panel>
        <Panel title="Radius">
          <div className="space-y-2.5">
            {Object.entries(layout.radius).map(([key, value]) => (
              <SliderField
                key={key}
                label={`radius-${key}`}
                min={0}
                max={48}
                value={value}
                onChange={(next) => updateRadius(key as keyof typeof layout.radius, next)}
              />
            ))}
          </div>
          <div className="mt-4 flex items-end gap-3">
            {Object.entries(layout.radius).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="h-12 w-12 border bg-secondary" style={{ borderRadius: value }} />
                <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Breakpoints">
          <div className="space-y-2.5">
            {Object.entries(layout.breakpoints).map(([key, value]) => (
              <SliderField
                key={key}
                label={`breakpoint-${key}`}
                min={320}
                max={2560}
                step={4}
                value={value}
                onChange={(next) => updateBreakpoint(key, next)}
              />
            ))}
          </div>
        </Panel>
        <Panel title="Container">
          <SliderField
            label="Max width"
            min={320}
            max={1920}
            step={8}
            value={layout.containerMaxWidth}
            onChange={(value) => updateLayout({ containerMaxWidth: value })}
          />
          <div className="mt-4 rounded-md border bg-background-secondary p-3">
            <div
              className="mx-auto flex h-16 items-center justify-center rounded-md border bg-surface font-mono text-[11px]"
              style={{ maxWidth: layout.containerMaxWidth / 4 }}
            >
              {layout.containerMaxWidth}px
            </div>
          </div>
        </Panel>
      </div>
    </ModulePage>
  );
}

export function ComponentsPage() {
  const ds = useDesignSystemStore((state) => state.designSystem);
  const [code, setCode] = useState(generateButtonCode("default", "default"));
  const buttonRadius = ds.layout.radius.md;

  return (
    <ModulePage title="Components" description="Preview components with your real tokens and copy the matching code.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Preview">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium"
                style={{
                  background: ds.colors.primary,
                  color: readableOn(ds.colors.primary),
                  borderRadius: buttonRadius,
                }}
              >
                Primary
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium"
                style={{ border: ds.effects.borders.strong, borderRadius: buttonRadius }}
              >
                Outline
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium"
                style={{
                  background: ds.colors.error,
                  color: readableOn(ds.colors.error),
                  borderRadius: buttonRadius,
                }}
              >
                Destructive
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["success", "warning", "error"].map((key) => (
                <span
                  key={key}
                  className="px-2 py-1 text-[11px] font-medium"
                  style={{
                    background: ds.colors[key as keyof typeof ds.colors],
                    color: readableOn(ds.colors[key as keyof typeof ds.colors]),
                    borderRadius: ds.layout.radius.sm,
                  }}
                >
                  {key}
                </span>
              ))}
            </div>
            <input
              placeholder="Input preview"
              aria-label="Input preview"
              className="h-9 w-full max-w-sm border bg-surface px-3 text-sm"
              style={{ borderRadius: ds.layout.radius.md, borderColor: ds.colors.muted }}
            />
            <div
              className="max-w-sm border bg-surface p-4"
              style={{ borderRadius: ds.layout.radius.lg, boxShadow: ds.effects.shadows.md }}
            >
              <h3 style={{ fontFamily: ds.typography.headingFont, fontWeight: ds.typography.weights.semibold }}>
                Card title
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Cards inherit spacing, radius, borders, and shadows from the system.
              </p>
            </div>
          </div>
        </Panel>
        <Panel title="Generated code">
          <div className="space-y-2">
            <Button size="sm" variant="outline" onClick={() => setCode(generateButtonCode())}>
              Button
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCode(generateCardCode())}>
              Card
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCode(generateTailwindConfig(ds))}>
              Tailwind config
            </Button>
          </div>
          <pre
            tabIndex={0}
            aria-label="Generated component code"
            className="mt-3 max-h-56 overflow-auto rounded-md border bg-background-secondary p-3 font-mono text-[11px] leading-relaxed"
          >
            {code}
          </pre>
          <Button
            className="mt-3 w-full"
            size="sm"
            onClick={() => {
              void copyText(code);
              toast.success("Code copied.");
            }}
          >
            <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy code
          </Button>
        </Panel>
      </div>
    </ModulePage>
  );
}

export function EffectsPage() {
  const effects = useDesignSystemStore((state) => state.designSystem.effects);
  const updateShadow = useDesignSystemStore((state) => state.updateShadow);
  const updateBorder = useDesignSystemStore((state) => state.updateBorder);

  return (
    <ModulePage title="Effects" description="Shadows, borders, transitions, and depth tokens with live previews.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Shadows">
          <div className="space-y-3">
            {Object.entries(effects.shadows).map(([key, value]) => (
              <ShadowTokenEditor
                key={key}
                label={`shadow-${key}`}
                value={value}
                onChange={(next) => updateShadow(key, next)}
              />
            ))}
          </div>
        </Panel>
        <Panel title="Borders">
          <div className="space-y-3">
            {Object.entries(effects.borders).map(([key, value]) => (
              <BorderTokenEditor
                key={key}
                label={`border-${key}`}
                value={value}
                onChange={(next) => updateBorder(key, next)}
              />
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Preview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(effects.shadows).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="h-20 rounded-lg border bg-surface" style={{ boxShadow: value }} />
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{key}</p>
            </div>
          ))}
        </div>
      </Panel>
    </ModulePage>
  );
}

export function MotionPage() {
  const motionTokens = useDesignSystemStore((state) => state.designSystem.motion);
  const updateDuration = useDesignSystemStore((state) => state.updateDuration);
  const updateEasing = useDesignSystemStore((state) => state.updateEasing);
  const updateMotion = useDesignSystemStore((state) => state.updateMotion);
  const reduceMotion = useReducedMotion();
  const [play, setPlay] = useState(0);

  return (
    <ModulePage title="Motion" description="Durations, easing curves, and restrained presets. Reduced motion is respected.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Durations">
          <div className="space-y-2.5">
            {Object.entries(motionTokens.duration).map(([key, value]) => (
              <SliderField
                key={key}
                label={key}
                min={0}
                max={600}
                step={10}
                suffix="ms"
                value={value}
                onChange={(next) => updateDuration(key, next)}
              />
            ))}
          </div>
        </Panel>
        <Panel title="Easing">
          <div className="space-y-3">
            {Object.entries(motionTokens.easing).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-muted-foreground">{key}</span>
                <select
                  value={value}
                  onChange={(event) => updateEasing(key, event.target.value)}
                  className="h-7 max-w-[220px] flex-1 rounded-sm border bg-surface px-1 font-mono text-[10px]"
                  aria-label={`${key} easing`}
                >
                  <option value="cubic-bezier(0.4, 0, 0.2, 1)">Standard</option>
                  <option value="cubic-bezier(0.16, 1, 0.3, 1)">Spring</option>
                  <option value="cubic-bezier(0.4, 0, 1, 1)">Ease in</option>
                  <option value="cubic-bezier(0, 0, 0.2, 1)">Ease out</option>
                  <option value="linear">Linear</option>
                  <option value={value}>{value}</option>
                </select>
              </label>
            ))}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={motionTokens.reducedMotion}
                onChange={(event) => updateMotion({ reducedMotion: event.target.checked })}
              />
              Force reduced motion
            </label>
          </div>
        </Panel>
      </div>
      <Panel
        title="Preset preview"
        action={
          <Button size="sm" variant="outline" onClick={() => setPlay((value) => value + 1)}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Play
          </Button>
        }
      >
        <div className="flex flex-wrap gap-4">
          {Object.entries(motionTokens.presets).map(([name, preset]) => (
            <motion.div
              key={`${name}-${play}`}
              className="flex h-20 w-28 items-center justify-center rounded-lg border bg-background-secondary text-xs"
              initial={
                reduceMotion || motionTokens.reducedMotion
                  ? false
                  : { opacity: 0, y: name === "slide-up" ? 8 : 0, scale: name === "scale-in" ? 0.96 : 1 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: preset.duration / 1000,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {name}
            </motion.div>
          ))}
        </div>
      </Panel>
    </ModulePage>
  );
}

const ASSET_CATEGORIES: AssetCategory[] = ["logo", "illustration", "icon", "photo", "other"];

function AssetPreview({ asset }: { asset: import("@/lib/db").AssetRecord }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(asset.blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [asset.blob]);
  return url ? (
    <img src={url} alt={asset.alt || asset.name} className="h-24 w-full object-contain" />
  ) : null;
}

export function AssetsPage() {
  const assets = useAssetsStore((state) => state.assets);
  const assetsLoading = useAssetsStore((state) => state.isLoading);
  const loadAssets = useAssetsStore((state) => state.loadAssets);
  const addAsset = useAssetsStore((state) => state.addAsset);
  const deleteAsset = useAssetsStore((state) => state.deleteAsset);
  const selectedId = useAssetsStore((state) => state.selectedAssetId);
  const selectAsset = useAssetsStore((state) => state.selectAsset);
  const [category, setCategory] = useState<AssetCategory>("logo");
  const [starterBusy, setStarterBusy] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = assets.find((asset) => asset.id === selectedId);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  function upload(files: FileList | null) {
    if (!files?.length) return;
    void Promise.all(Array.from(files).map((file) => addAsset(file, category))).then(() =>
      toast.success("Assets saved locally."),
    );
  }

  async function addStarterAsset(id: string) {
    const item = STARTER_ASSETS.find((asset) => asset.id === id);
    if (!item) return;
    setStarterBusy(id);
    try {
      const response = await fetch(item.path);
      const blob = await response.blob();
      const file = new File([blob], `${item.id}.svg`, { type: "image/svg+xml" });
      await addAsset(file, item.category, item.name);
      toast.success(`${item.name} added to the local library.`);
    } catch {
      toast.error("Unable to add this starter asset.");
    } finally {
      setStarterBusy(null);
    }
  }

  return (
    <ModulePage title="Assets" description="Upload assets or start with a free, licensed pack. Blobs stay in IndexedDB.">
      <Panel
        title="Free starter pack"
        action={
          <a
            href="/assets/starter/LICENSES.md"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
          >
            Licenses
          </a>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {STARTER_ASSETS.map((asset) => (
            <div key={asset.id} className="rounded-lg border bg-background p-2.5">
              <div className="flex h-16 items-center justify-center rounded-sm border bg-surface p-2">
                <img src={asset.path} alt={asset.name} className="max-h-12 max-w-full" />
              </div>
              <p className="mt-2 truncate text-[11px] font-medium">{asset.name}</p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {asset.category} · {asset.license}
              </p>
              <div className="mt-2 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  className="h-6 flex-1 px-1 text-[10px]"
                  disabled={starterBusy === asset.id}
                  onClick={() => void addStarterAsset(asset.id)}
                >
                  {starterBusy === asset.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus className="h-3 w-3" aria-hidden="true" />
                  )}
                  Add
                </Button>
                <Button size="sm" variant="outline" className="h-6 px-1.5" asChild>
                  <a href={asset.path} download aria-label={`Download ${asset.name}`}>
                    <Download className="h-3 w-3" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Panel
          title="Asset library"
          action={
            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as AssetCategory)}
                className="h-8 rounded-md border bg-surface px-2 text-xs capitalize"
                aria-label="Asset category"
              >
                {ASSET_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" aria-hidden="true" /> Upload
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.svg"
                multiple
                className="hidden"
                onChange={(event) => upload(event.target.files)}
              />
            </div>
          }
        >
          {assetsLoading ? (
            <div className="flex justify-center rounded-lg border border-dashed p-10 text-muted-foreground" role="status">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span className="sr-only">Loading assets</span>
            </div>
          ) : assets.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              <ImageIcon className="mx-auto h-6 w-6" aria-hidden="true" />
              <p className="mt-2">No assets yet. Upload SVG, PNG, JPG, or WebP.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => selectAsset(asset.id)}
                  className={cn(
                    "rounded-lg border bg-background p-3 text-left transition-colors duration-120 hover:bg-secondary",
                    selectedId === asset.id && "border-accent",
                  )}
                >
                  <AssetPreview asset={asset} />
                  <p className="mt-2 truncate text-xs font-medium">{asset.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {asset.category} · {(asset.size / 1024).toFixed(1)} KB
                  </p>
                </button>
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Selected asset">
          {selected ? (
            <div className="space-y-3">
              <AssetPreview asset={selected} />
              <p className="text-sm font-medium">{selected.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{selected.mimeType}</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  const url = URL.createObjectURL(selected.blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = selected.name;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export asset
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => void deleteAsset(selected.id)}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select an asset to inspect it.</p>
          )}
        </Panel>
      </div>
    </ModulePage>
  );
}

export function AIRulesPage() {
  const ds = useDesignSystemStore((state) => state.designSystem);
  const [templateId, setTemplateId] = useState<AITemplateId>("system_prompt");
  const [draft, setDraft] = useState(AI_TEMPLATES.system_prompt);
  const variables = useMemo(() => templateVariables(ds), [ds]);
  const rendered = useMemo(() => renderTemplate(draft, variables), [draft, variables]);
  const brief = useMemo(() => generateAgentBrief(ds), [ds]);

  function chooseTemplate(id: AITemplateId) {
    setTemplateId(id);
    setDraft(AI_TEMPLATES[id]);
  }

  return (
    <ModulePage
      title="AI Rules"
      description="Generate a complete interface brief and ready-to-use instructions that keep AI agents inside your design system."
    >
      <Panel
        title="Complete interface brief (.md)"
        action={
          <div className="flex flex-wrap justify-end gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void copyText(brief);
                toast.success("AI interface brief copied.");
              }}
            >
              <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy
            </Button>
            <Button
              size="sm"
              onClick={() => downloadFile(AGENT_BRIEF_FILENAME, brief, "text/markdown")}
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download .md
            </Button>
          </div>
        }
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          A complete Markdown directive for a coding agent: mission, palettes, all type roles,
          layout, components, effects, motion, accessibility, QA, interface composition, and a
          definition of done. This is generated from the current local tokens.
        </p>
        <pre
          tabIndex={0}
          aria-label="AI interface brief preview"
          className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-md border bg-background-secondary p-3 font-mono text-[10px] leading-relaxed"
        >
          {brief.slice(0, 2400)}
          {brief.length > 2400 ? "\n…" : ""}
        </pre>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <Panel title="Templates">
          <div className="space-y-1">
            {AI_TEMPLATE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => chooseTemplate(id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors duration-120 hover:bg-secondary",
                  templateId === id && "bg-secondary",
                )}
              >
                {AI_TEMPLATE_LABELS[id]}
                {templateId === id ? <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t pt-3">
            <p className="text-[11px] font-medium text-muted-foreground">Variables</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.keys(variables).map((key) => (
                <span key={key} className="rounded-sm border px-1.5 py-0.5 font-mono text-[10px]">
                  {`{{${key}}}`}
                </span>
              ))}
            </div>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel title="Template editor">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-56 w-full resize-y rounded-md border bg-surface p-3 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Template editor"
            />
          </Panel>
          <Panel
            title="Rendered preview"
            action={
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void copyText(rendered);
                    toast.success("Template copied.");
                  }}
                >
                  <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(`${templateId}.md`, rendered, "text/markdown")}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download
                </Button>
              </div>
            }
          >
            <pre
              tabIndex={0}
              aria-label="Generated AI rules preview"
              className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border bg-background-secondary p-3 text-xs leading-relaxed"
            >
              {rendered}
            </pre>
          </Panel>
        </div>
      </div>
    </ModulePage>
  );
}

function slugifyStarterName(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "design-system"
  );
}

function HandoffPreview({ ds }: { ds: DesignSystem }) {
  const light = ds.lightColors ?? ds.colors;
  const button = ds.components.button.md;
  const buttonStyle = {
    minHeight: button.height,
    paddingInline: button.paddingX,
    fontSize: button.fontSize,
    borderRadius: button.radius,
    fontFamily: ds.typography.bodyFont,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-background-secondary">
      <div className="flex h-8 items-center justify-between border-b px-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
          Live starter preview
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">Generated locally</span>
      </div>
      <div
        className="p-4"
        style={{
          background: light.background,
          color: light.text,
          fontFamily: ds.typography.bodyFont,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            style={{
              fontFamily: ds.typography.headingFont,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {ds.name}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span
              style={{
                ...buttonStyle,
                background: "transparent",
                color: light.text,
                border: `1px solid ${light.muted}`,
              }}
            >
              Toggle theme
            </span>
            <span
              style={{
                ...buttonStyle,
                background: light.primary,
                color: readableOn(light.primary),
              }}
            >
              Start
            </span>
          </div>
        </div>
        <p
          className="mt-3"
          style={{
            margin: 0,
            maxWidth: "22ch",
            fontFamily: ds.typography.headingFont,
            fontSize: Math.min(30, ds.typography.roles.display.fontSize * 0.45),
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {ds.name}
        </p>
        <p
          style={{
            marginTop: 4,
            maxWidth: "44ch",
            fontSize: 10,
            lineHeight: 1.5,
            color: light.muted,
          }}
        >
          {ds.description}
        </p>
        <div className="mt-3 grid grid-cols-5 gap-1">
          {Object.entries(light).map(([key, color]) => (
            <span
              key={key}
              className="h-4 rounded-sm border"
              style={{ background: color, borderColor: light.muted }}
              title={`${key}: ${color}`}
            />
          ))}
        </div>
        <div
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[8px]"
          style={{ color: light.muted }}
        >
          <span>{Object.keys(light).length} colors</span>
          <span>{TYPOGRAPHY_ROLES.length} type roles</span>
          <span>{Object.keys(ds.layout.spacing).length} spacing steps</span>
          <span>{Object.keys(ds.components.button).length} button sizes</span>
        </div>
      </div>
    </div>
  );
}

function FigmaPanel({ ds }: { ds: DesignSystem }) {
  const applyDirection = useDesignSystemStore((state) => state.applyDirection);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const variables = useMemo(() => exportFigmaVariables(ds), [ds]);

  async function importVariables(file: File | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      const next = applyFigmaVariables(ds, text);
      applyDirection(next);
      setError("");
      toast.success("Figma variables imported.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to import Figma variables.");
    }
  }

  return (
    <Panel
      title="Figma variables"
      action={
        <Button
          size="sm"
          onClick={() => downloadFile("figma-variables.json", variables, "application/json")}
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download JSON
        </Button>
      }
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        Export the current system as Figma variable collections: colors in light and dark modes,
        typography, spacing, radius, button tokens, durations, and easings. Paste the exported JSON
        into a Figma plugin, or import an updated file back into this local project.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          id="figma-variables-file"
          type="file"
          accept=".json,application/json"
          className="sr-only"
          aria-label="Figma variables JSON file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void importVariables(file);
          }}
        />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" aria-hidden="true" /> Import variables
        </Button>
        <span className="text-[10px] text-muted-foreground">
          6 collections · round-trip with the SaaS-UI token model
        </span>
      </div>
      {error ? (
        <p role="alert" className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </Panel>
  );
}

function HandoffPanel({ ds }: { ds: DesignSystem }) {
  const [framework, setFramework] = useState<HandoffFramework>("vite");
  const starter = useMemo(() => buildHandoffStarter(ds, framework), [ds, framework]);
  const [activePath, setActivePath] = useState(starter.files[0]?.path ?? "");
  const active = starter.files.find((file) => file.path === activePath) ?? starter.files[0];
  const bundle = useMemo(() => buildHandoffBundle(starter), [starter]);
  const bundleName = `${slugifyStarterName(ds.name)}-${framework}-starter.md`;

  return (
    <Panel
      title="Framework starter"
      action={
        <div className="flex flex-wrap justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              void copyText(bundle);
              toast.success("Starter bundle copied.");
            }}
          >
            <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy all
          </Button>
          <Button
            size="sm"
            onClick={() => downloadFile(bundleName, bundle, "text/markdown")}
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download .md
          </Button>
        </div>
      }
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        A real page section plus the files needed to run it. The page uses the exported token
        variables, including both light and dark palettes. Copy individual files or download the
        whole starter as a Markdown bundle for a human or an agent.
      </p>
      <div className="mt-3">
        <HandoffPreview ds={ds} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Starter framework">
        {(["vite", "next"] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={framework === id}
            onClick={() => setFramework(id)}
            className={cn(
              "inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors duration-120",
              framework === id
                ? "border-accent bg-accent-soft text-accent-hover"
                : "bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {id === "vite" ? "Vite + React" : "Next.js + shadcn"}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <ul className="max-h-80 space-y-0.5 overflow-y-auto rounded-md border bg-background p-1 scrollbar-thin">
          {starter.files.map((file) => (
            <li key={file.path}>
              <button
                type="button"
                aria-pressed={active?.path === file.path}
                onClick={() => setActivePath(file.path)}
                className={cn(
                  "flex w-full flex-col rounded-sm px-2 py-1.5 text-left transition-colors duration-120",
                  active?.path === file.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <span className="w-full truncate font-mono text-[10px]">{file.path}</span>
                <span className="text-[9px] text-muted-foreground">{file.language}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs font-medium">{active?.path}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{active?.description}</p>
            </div>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!active) return;
                  void copyText(active.content);
                  toast.success("Starter file copied.");
                }}
              >
                <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!active) return;
                  downloadFile(active.path.split("/").pop() ?? "file.txt", active.content, "text/plain");
                }}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> File
              </Button>
            </div>
          </div>
          <pre
            tabIndex={0}
            aria-label="Starter file preview"
            className="mt-2 max-h-[420px] overflow-auto whitespace-pre rounded-md border bg-background-secondary p-3 font-mono text-[11px] leading-relaxed"
          >
            {active?.content ?? ""}
          </pre>
        </div>
      </div>
    </Panel>
  );
}

export function ExportPage() {
  const ds = useDesignSystemStore((state) => state.designSystem);
  const [format, setFormat] = useState<ExportFormat>("json");
  const current = EXPORT_FORMATS.find((item) => item.id === format) ?? EXPORT_FORMATS[0];
  const content = useMemo(() => buildExport(ds, format), [ds, format]);

  return (
    <ModulePage title="Export" description="Token formats, framework starters, and Figma variables generated from the current tokens.">
      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-2">
          {EXPORT_FORMATS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFormat(item.id)}
              className={cn(
                "w-full rounded-lg border bg-surface p-3 text-left transition-colors duration-120 hover:bg-secondary",
                format === item.id && "border-accent",
              )}
            >
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </button>
          ))}
        </div>
        <div className="min-w-0">
        <Panel
          title={current.label}
          action={
            <div className="flex flex-wrap justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void copyText(content);
                  toast.success("Export copied.");
                }}
              >
                <Clipboard className="h-3.5 w-3.5" aria-hidden="true" /> Copy
              </Button>
              <Button
                size="sm"
                onClick={() => downloadFile(current.filename, content, current.mime)}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download
              </Button>
            </div>
          }
        >
          <pre
            tabIndex={0}
            aria-label={`${current.label} export preview`}
            className="max-h-[520px] min-w-0 overflow-auto whitespace-pre rounded-md border bg-background-secondary p-3 font-mono text-[11px] leading-relaxed"
          >
            {content}
          </pre>
        </Panel>
        </div>
      </div>
      <div className="mt-4">
        <HandoffPanel ds={ds} />
      </div>
      <div className="mt-4">
        <FigmaPanel ds={ds} />
      </div>
    </ModulePage>
  );
}

const MODULE_COMPONENTS: Record<ModuleId, ComponentType> = {
  overview: OverviewPage,
  colors: ColorsPage,
  typography: TypographyPage,
  layout: LayoutPage,
  components: ComponentsPage,
  effects: EffectsPage,
  motion: MotionPage,
  assets: AssetsPage,
  "ai-rules": AIRulesPage,
  export: ExportPage,
};

export function ModuleRouter({ module }: { module: ModuleId | null }) {
  if (!module) {
    return null;
  }
  const Component = MODULE_COMPONENTS[module];
  return <Component />;
}
