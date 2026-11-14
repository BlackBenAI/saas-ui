import type { ReactNode } from "react";
import {
  ArrowRight,
  Blocks,
  Bot,
  Check,
  Command,
  FileCode2,
  GitBranch,
  Github,
  HardDrive,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Lock,
  Palette,
  Sparkles,
  Type,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLANS, REPOSITORY_URL } from "@/lib/constants";
import { EASE, MOTION } from "@/lib/motion";
import { useDesignSystemStore } from "@/stores/useDesignSystemStore";

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION.panel.duration, ease: EASE } },
};

const FEATURES: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Professional tooling",
    description:
      "A precision editor for tokens, with values you can copy exactly into CSS, Tailwind, or TypeScript.",
    icon: Command,
  },
  {
    title: "Premium design",
    description:
      "Neutral zinc surfaces, one restrained indigo signal, and typography chosen for long sessions.",
    icon: Layers,
  },
  {
    title: "Open source",
    description:
      "MIT licensed, local-first, and usable without an account. The cloud is an upgrade, never a gate.",
    icon: GitBranch,
  },
];

const STEPS: Array<{ title: string; description: string }> = [
  {
    title: "Design",
    description: "Set color, type, layout, components, effects, and motion in one system.",
  },
  {
    title: "Preview",
    description: "See the result on the canvas while the values stay exact and copyable.",
  },
  {
    title: "Export",
    description: "Generate tokens for CSS, Tailwind, TypeScript, JSON, and Markdown.",
  },
];

const MODULES: Array<{ name: string; description: string; icon: LucideIcon }> = [
  { name: "Overview", description: "Project status and token summary", icon: LayoutDashboard },
  { name: "Colors", description: "Palette, semantic roles, contrast", icon: Palette },
  { name: "Typography", description: "Families, scale, weights", icon: Type },
  { name: "Layout", description: "Spacing, radius, breakpoints", icon: LayoutGrid },
  { name: "Components", description: "Buttons, inputs, surfaces", icon: Blocks },
  { name: "Effects", description: "Borders, shadows, depth", icon: Sparkles },
  { name: "Motion", description: "Durations, easing, choreography", icon: Waypoints },
  { name: "Assets", description: "Logos, icons, and imagery", icon: ImageIcon },
  { name: "AI Rules", description: "Full AI brief + UI constraints", icon: Bot },
  { name: "Export", description: "Tokens + Vite/Next starters", icon: FileCode2 },
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: MOTION.panel.duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function PreviewCard() {
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  const swatches = [
    { label: "Primary", value: designSystem.colors.primary },
    { label: "Surface", value: designSystem.colors.surface },
    { label: "Text", value: designSystem.colors.text },
  ];

  return (
    <div aria-hidden="true" className="relative">
      <div className="overflow-hidden rounded-xl border bg-surface shadow-ambient">
        <div className="flex h-9 items-center justify-between border-b px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
          </div>
          <span className="max-w-[180px] truncate font-mono text-[10px] text-muted-foreground">
            {designSystem.name}
          </span>
          <Badge variant="secondary" className="text-[10px]">
            Local
          </Badge>
        </div>

        <div className="grid grid-cols-[52px_1fr]">
          <div className="space-y-2 border-r p-2">
            {[Palette, Type, LayoutGrid, Blocks].map((Icon, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? "flex h-7 items-center justify-center rounded-sm bg-accent-soft text-accent-hover"
                    : "flex h-7 items-center justify-center rounded-sm text-muted-foreground"
                }
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            ))}
          </div>

          <div className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground">Colors</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {swatches.map((swatch) => (
                <div key={swatch.label}>
                  <div
                    className="h-10 rounded-md border"
                    style={{ backgroundColor: swatch.value }}
                  />
                  <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                    {swatch.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-3">
              <p className="text-[11px] font-medium text-muted-foreground">Type scale</p>
              <div className="mt-1.5 flex items-baseline gap-3">
                <span className="font-display text-2xl font-semibold leading-none">Aa</span>
                <span className="font-display text-base font-medium leading-none">Aa</span>
                <span className="text-sm leading-none text-muted-foreground">Aa</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {designSystem.typography.scale.h1}/14
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t pt-3">
              <div className="h-6 flex-1 rounded-sm border bg-background-secondary" />
              <div className="h-6 w-16 rounded-sm bg-primary" />
              <div className="h-6 w-16 rounded-sm border" />
            </div>
          </div>
        </div>

        <div className="flex h-8 items-center justify-between border-t px-3 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3 text-success" />
            Saved locally
          </span>
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Cloud sync off
          </span>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Helmet>
        <title>SaaS-UI — Local-first design system editor</title>
        <meta
          name="description"
          content="A local-first visual editor for design systems. Design, preview, and export tokens without an account. MIT licensed."
        />
        <link rel="canonical" href="https://saasui.cloud/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SaaS-UI — Local-first design system editor" />
        <meta
          property="og:description"
          content="Edit design tokens locally, preview them live, and export CSS, Tailwind, TypeScript, JSON, or Markdown. No account required."
        />
        <meta property="og:url" content="https://saasui.cloud/" />
        <meta property="og:image" content="https://saasui.cloud/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SaaS-UI — Local-first design system editor" />
        <meta
          name="twitter:description"
          content="Edit design tokens locally, preview them live, and export CSS, Tailwind, TypeScript, JSON, or Markdown. No account required."
        />
        <meta name="twitter:image" content="https://saasui.cloud/og.png" />
      </Helmet>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="SaaS-UI home"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            <a
              href="#creative-engineering"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-120 hover:bg-secondary hover:text-foreground"
            >
              Product
            </a>
            <a
              href="#modules"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-120 hover:bg-secondary hover:text-foreground"
            >
              Modules
            </a>
            <a
              href="#pricing"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-120 hover:bg-secondary hover:text-foreground"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                GitHub
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">
                Open editor
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="container grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <motion.div
            variants={heroContainer}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
          >
            <motion.div variants={heroItem}>
              <Badge variant="outline" className="border-accent-muted bg-accent-soft text-accent-hover">
                <GitBranch className="h-3 w-3" aria-hidden="true" />
                Open source · MIT
              </Badge>
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="mt-5 max-w-[14ch] font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-balance sm:text-[56px]"
            >
              Build something remarkable.
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Your design system, beautifully consistent. Colors, type, layout, components, and
              motion in one precise editor that works without an account.
            </motion.p>

            <motion.div variants={heroItem} className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Open editor
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  View on GitHub
                </a>
              </Button>
            </motion.div>

            <motion.ul
              variants={heroItem}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"
            >
              {["No account required", "Local-first by default", "MIT licensed"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: MOTION.modal.duration, delay: 0.15, ease: EASE }}
          >
            <PreviewCard />
          </motion.div>
        </section>

        <section
          id="creative-engineering"
          className="border-t bg-background-secondary"
          aria-labelledby="creative-engineering-title"
        >
          <div className="container py-16 lg:py-20">
            <Reveal className="max-w-2xl">
              <h2
                id="creative-engineering-title"
                className="font-display text-[28px] font-semibold tracking-[-0.01em] text-balance sm:text-[32px]"
              >
                Creative engineering, not another dashboard.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every surface is built for precision: neutral fields, one indigo signal, monospace
                values, and motion that stays out of the way.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.title} delay={index * 0.05}>
                    <div className="h-full rounded-lg border bg-surface p-6">
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                        <div>
                          <h3 className="font-display text-base font-semibold">{feature.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t" aria-labelledby="how-it-works-title">
          <div className="container grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-20">
            <Reveal>
              <h2
                id="how-it-works-title"
                className="font-display text-[28px] font-semibold tracking-[-0.01em] text-balance sm:text-[32px]"
              >
                From decision to export.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                One source of truth for every visual decision. Change a token once, see it
                everywhere, then export code that matches the canvas.
              </p>
              <Button variant="outline" asChild className="mt-6">
                <Link to="/dashboard">
                  Try the editor
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>

            <ol className="divide-y border-y">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <Reveal delay={index * 0.05}>
                    <div className="grid grid-cols-[48px_1fr] gap-4 py-5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="modules" className="border-t bg-background-secondary" aria-labelledby="modules-title">
          <div className="container py-16 lg:py-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <Reveal className="max-w-2xl">
                <h2
                  id="modules-title"
                  className="font-display text-[28px] font-semibold tracking-[-0.01em] text-balance sm:text-[32px]"
                >
                  Ten modules. One system.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Each module owns one layer of the design system. No feature is decorative; every
                  control changes a token you can export.
                </p>
              </Reveal>
              <Badge variant="outline" className="w-fit">
                <HardDrive className="h-3 w-3" aria-hidden="true" />
                Editor preview
              </Badge>
            </div>

            <Reveal className="mt-10">
              <div className="overflow-hidden rounded-lg border">
                <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
                  {MODULES.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div key={module.name} className="bg-surface p-4">
                        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                        <h3 className="mt-3 text-sm font-medium">{module.name}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="pricing" className="border-t" aria-labelledby="pricing-title">
          <div className="container py-16 lg:py-20">
            <Reveal className="max-w-2xl">
              <h2
                id="pricing-title"
                className="font-display text-[28px] font-semibold tracking-[-0.01em] text-balance sm:text-[32px]"
              >
                Pricing that respects local-first.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                The editor is free forever. Cloud sync and collaboration are optional upgrades.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {PLANS.map((plan, index) => (
                <Reveal key={plan.name} delay={index * 0.05}>
                  <div
                    className={
                      plan.name === "Team"
                        ? "flex h-full flex-col rounded-lg border border-accent bg-surface p-6"
                        : "flex h-full flex-col rounded-lg border bg-surface p-6"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-base font-semibold">{plan.name}</h3>
                      {plan.name === "Team" ? <Badge variant="default">For teams</Badge> : null}
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-semibold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">{plan.cadence}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                            aria-hidden="true"
                          />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-0">
                      {plan.action === "editor" ? (
                        <Button asChild className="w-full">
                          <Link to="/dashboard">{plan.cta}</Link>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant={plan.name === "Team" ? "default" : "outline"}
                          className="w-full"
                          onClick={() =>
                            toast("Cloud billing is not enabled in this build.", {
                              description: "The local editor remains free and available.",
                            })
                          }
                        >
                          {plan.cta}
                        </Button>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#18181B] text-[#FAFAF9]">
        <div className="container py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo className="text-[#FAFAF9]" />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#A1A1AA]">
                A local-first visual editor for design systems. Built for people who care about
                exact values.
              </p>
              <p className="mt-4 text-xs text-[#A1A1AA]">MIT licensed · 2026 BlackBenAI</p>
            </div>

            <nav aria-label="Product">
              <h2 className="text-xs font-medium text-[#FAFAF9]">Product</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A1A1AA]">
                <li>
                  <Link to="/dashboard" className="transition-colors duration-120 hover:text-[#FAFAF9]">
                    Editor
                  </Link>
                </li>
                <li>
                  <a href="#modules" className="transition-colors duration-120 hover:text-[#FAFAF9]">
                    Modules
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition-colors duration-120 hover:text-[#FAFAF9]">
                    Pricing
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-label="Resources">
              <h2 className="text-xs font-medium text-[#FAFAF9]">Resources</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A1A1AA]">
                <li>
                  <a
                    href={REPOSITORY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-120 hover:text-[#FAFAF9]"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={`${REPOSITORY_URL}/issues`}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-120 hover:text-[#FAFAF9]"
                  >
                    Issues
                  </a>
                </li>
                <li>
                  <a
                    href={`${REPOSITORY_URL}/blob/main/LICENSE`}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-120 hover:text-[#FAFAF9]"
                  >
                    License
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className="text-xs font-medium text-[#FAFAF9]">Stack</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A1A1AA]">
                <li>Django 5 + DRF</li>
                <li>React 18 + Vite</li>
                <li>PostgreSQL 16 RLS</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#27272A] pt-6 text-xs text-[#A1A1AA] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 BlackBenAI. MIT licensed.</p>
            <p className="font-mono">build 0.1.0 · local-first</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
