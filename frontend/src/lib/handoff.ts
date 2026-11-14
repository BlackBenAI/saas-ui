import { exportCSS, exportTailwind } from "@/lib/exporters";
import { TYPOGRAPHY_ROLES, type DesignSystem } from "@/types/design-system";

export type HandoffFramework = "vite" | "next";

export interface HandoffFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export interface HandoffStarter {
  id: HandoffFramework;
  label: string;
  description: string;
  files: HandoffFile[];
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "design-system"
  );
}

function quote(value: string): string {
  return JSON.stringify(value);
}

function buttonCode(ds: DesignSystem): string {
  const token = ds.components.button.md;
  return `"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant = "default", style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    minHeight: ${token.height},
    paddingInline: ${token.paddingX},
    fontSize: ${token.fontSize},
    borderRadius: ${token.radius},
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    transition: "background-color var(--duration-hover) cubic-bezier(0.4, 0, 0.2, 1), border-color var(--duration-hover) cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const look: React.CSSProperties =
    variant === "outline"
      ? {
          background: "transparent",
          color: "var(--color-text)",
          border: ${quote(ds.effects.borders.default)},
        }
      : {
          background: "var(--color-primary)",
          color: "var(--color-on-primary)",
          border: "1px solid transparent",
        };

  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      style={{ ...base, ...look, ...style }}
      {...props}
    />
  );
}
`;
}

function utilsCode(): string {
  return `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
}

function pageCode(ds: DesignSystem, mode: HandoffFramework): string {
  const brand = quote(ds.name);
  const description = quote(ds.description || "A complete design system.");
  const border = quote(ds.effects.borders.default);
  const palette = Object.keys(ds.colors).map((key) => [
    key.charAt(0).toUpperCase() + key.slice(1),
    `var(--color-${key})`,
  ]);
  const facts = [
    ["Color roles", String(Object.keys(ds.colors).length)],
    ["Type roles", String(TYPOGRAPHY_ROLES.length)],
    ["Spacing steps", String(Object.keys(ds.layout.spacing).length)],
    ["Button sizes", String(Object.keys(ds.components.button).length)],
  ];
  const exportName = mode === "vite" ? "App" : "Page";
  const client = mode === "next" ? '"use client";\n\n' : "";

  return `${client}import { useState } from "react";

import { Button } from "@/components/ui/button";

const brand = ${brand};
const description = ${description};
const border = ${border};
const palette: Array<[string, string]> = ${JSON.stringify(palette, null, 2)};
const facts: Array<[string, string]> = ${JSON.stringify(facts, null, 2)};

export default function ${exportName}() {
  const [dark, setDark] = useState(false);

  return (
    <div
      className={dark ? "dark" : ""}
      style={{
        minHeight: "100vh",
        background: "var(--color-background)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px 24px",
          borderBottom: border,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-h4)",
            fontWeight: 700,
          }}
        >
          {brand}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button variant="outline" onClick={() => setDark((value) => !value)}>
            Toggle theme
          </Button>
          <Button>Start</Button>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px 48px" }}>
        <h1
          style={{
            margin: 0,
            maxWidth: "16ch",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-display)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textWrap: "balance",
          }}
        >
          {brand}
        </h1>
        <p
          style={{
            maxWidth: "60ch",
            marginTop: 20,
            fontSize: "var(--text-lead)",
            lineHeight: 1.6,
            color: "var(--color-muted)",
          }}
        >
          {description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
          <Button>Primary action</Button>
          <Button variant="outline">Secondary</Button>
        </div>

        <section
          aria-label="Palette"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginTop: 48,
          }}
        >
          {palette.map(([label, color]) => (
            <div
              key={label}
              style={{
                padding: 12,
                background: "var(--color-surface)",
                border,
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: 48,
                  background: color,
                  border,
                  borderRadius: "var(--radius-sm)",
                }}
              />
              <span
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: "var(--text-label)",
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
              <code
                style={{
                  display: "block",
                  marginTop: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-muted)",
                }}
              >
                {color}
              </code>
            </div>
          ))}
        </section>

        <section
          aria-label="System facts"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            marginTop: 48,
          }}
        >
          {facts.map(([label, value]) => (
            <div key={label} style={{ paddingTop: 12, borderTop: "1px solid var(--color-primary)" }}>
              <p style={{ margin: 0, fontSize: "var(--text-label)", color: "var(--color-muted)" }}>
                {label}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-h2)",
                  fontWeight: 600,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer
        style={{
          padding: "${ds.layout.spacing["4"]}px ${ds.layout.spacing["6"]}px",
          borderTop: border,
          color: "var(--color-muted)",
          fontSize: "var(--text-small)",
        }}
      >
        Built with the {brand} design system.
      </footer>
    </div>
  );
}
`;
}

function tailwindCode(ds: DesignSystem, content: string[]): string {
  return exportTailwind(ds).replace(
    'darkMode: "class",',
    `content: ${JSON.stringify(content)},\n  darkMode: "class",`,
  );
}

function readme(ds: DesignSystem, starter: "vite" | "next"): string {
  const run = starter === "vite" ? "npm run dev" : "npm run dev";
  return `# ${ds.name} — ${starter === "vite" ? "Vite" : "Next.js"} starter

Generated from the local SaaS-UI design system.

## Run

\`\`\`bash
npm install
${run}
\`\`\`

The page in ${starter === "vite" ? "src/App.tsx" : "app/page.tsx"} uses the design tokens through
CSS variables. The \`Toggle theme\` button switches the \`.dark\` class, which reads the dark palette.

## Files

- \`design-tokens.css\` — color, type, spacing, radius, shadow, and motion variables.
- \`tailwind.config.ts\` — the token theme for Tailwind.
- \`${starter === "vite" ? "src" : "components"}/ui/button.tsx\` — generated button component.
- \`${starter === "vite" ? "src/App.tsx" : "app/page.tsx"}\` — generated page section.

Regenerate this starter from the SaaS-UI editor after changing the design system.
`;
}

export function buildHandoffStarter(ds: DesignSystem, framework: HandoffFramework): HandoffStarter {
  const name = slugify(ds.name);
  const pagePath = framework === "vite" ? "src/App.tsx" : "app/page.tsx";
  const pageDescription =
    framework === "vite"
      ? "A real React page section built from the current tokens."
      : "A real Next.js page section built from the current tokens.";

  if (framework === "vite") {
    return {
      id: "vite",
      label: "Vite + React",
      description: "React 18, Vite, TypeScript, Tailwind, and a token-driven page.",
      files: [
        {
          path: "package.json",
          language: "json",
          description: "Dependencies and scripts.",
          content: JSON.stringify(
            {
              name,
              private: true,
              version: "0.0.0",
              type: "module",
              scripts: {
                dev: "vite",
                build: "tsc --noEmit && vite build",
                preview: "vite preview",
              },
              dependencies: {
                "class-variance-authority": "^0.7.0",
                clsx: "^2.1.1",
                react: "^18.3.1",
                "react-dom": "^18.3.1",
                "tailwind-merge": "^2.4.0",
              },
              devDependencies: {
                "@types/react": "^18.3.3",
                "@types/react-dom": "^18.3.0",
                "@vitejs/plugin-react": "^4.3.1",
                autoprefixer: "^10.4.20",
                postcss: "^8.4.41",
                tailwindcss: "^3.4.9",
                typescript: "^5.5.4",
                vite: "^5.4.0",
              },
            },
            null,
            2,
          ),
        },
        {
          path: "index.html",
          language: "html",
          description: "Vite entry document.",
          content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ds.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
        },
        {
          path: "vite.config.ts",
          language: "typescript",
          description: "Vite config with the @ alias.",
          content: `import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
`,
        },
        {
          path: "tsconfig.json",
          language: "json",
          description: "Strict TypeScript config with the @ alias.",
          content: JSON.stringify(
            {
              compilerOptions: {
                target: "ES2022",
                lib: ["ES2022", "DOM", "DOM.Iterable"],
                module: "ESNext",
                skipLibCheck: true,
                moduleResolution: "bundler",
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: "react-jsx",
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                baseUrl: ".",
                paths: { "@/*": ["./src/*"] },
              },
              include: ["src"],
            },
            null,
            2,
          ),
        },
        {
          path: "postcss.config.js",
          language: "javascript",
          description: "Tailwind and autoprefixer.",
          content: `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
`,
        },
        {
          path: "tailwind.config.ts",
          language: "typescript",
          description: "Tailwind theme generated from the design system.",
          content: tailwindCode(ds, ["./index.html", "./src/**/*.{ts,tsx}"]),
        },
        {
          path: "src/main.tsx",
          language: "tsx",
          description: "React entrypoint.",
          content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles/design-tokens.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
        },
        {
          path: "src/index.css",
          language: "css",
          description: "Tailwind directives.",
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
        },
        {
          path: "src/styles/design-tokens.css",
          language: "css",
          description: "All color, type, layout, effect, and motion tokens.",
          content: exportCSS(ds),
        },
        {
          path: "src/lib/utils.ts",
          language: "typescript",
          description: "Class name helper.",
          content: utilsCode(),
        },
        {
          path: "src/components/ui/button.tsx",
          language: "tsx",
          description: "Generated button using the button tokens.",
          content: buttonCode(ds),
        },
        {
          path: pagePath,
          language: "tsx",
          description: pageDescription,
          content: pageCode(ds, "vite"),
        },
        {
          path: "README.md",
          language: "markdown",
          description: "How to run and edit the starter.",
          content: readme(ds, "vite"),
        },
      ],
    };
  }

  return {
    id: "next",
    label: "Next.js + shadcn",
    description: "Next.js App Router, Tailwind, and a shadcn-style button.",
    files: [
      {
        path: "package.json",
        language: "json",
        description: "Dependencies and scripts.",
        content: JSON.stringify(
          {
            name,
            private: true,
            version: "0.0.0",
            scripts: {
              dev: "next dev",
              build: "next build",
              start: "next start",
            },
            dependencies: {
              "class-variance-authority": "^0.7.0",
              clsx: "^2.1.1",
              next: "^14.2.5",
              react: "^18.3.1",
              "react-dom": "^18.3.1",
              "tailwind-merge": "^2.4.0",
            },
            devDependencies: {
              "@types/node": "^22.1.0",
              "@types/react": "^18.3.3",
              "@types/react-dom": "^18.3.0",
              autoprefixer: "^10.4.20",
              postcss: "^8.4.41",
              tailwindcss: "^3.4.9",
              typescript: "^5.5.4",
            },
          },
          null,
          2,
        ),
      },
      {
        path: "app/layout.tsx",
        language: "tsx",
        description: "App Router layout.",
        content: `import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: ${quote(ds.name)},
  description: ${quote(ds.description || "A complete design system.")},
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      },
      {
        path: "app/globals.css",
        language: "css",
        description: "Design tokens plus Tailwind directives.",
        content: `@import "./design-tokens.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
`,
      },
      {
        path: "app/design-tokens.css",
        language: "css",
        description: "All color, type, layout, effect, and motion tokens.",
        content: exportCSS(ds),
      },
      {
        path: "app/page.tsx",
        language: "tsx",
        description: pageDescription,
        content: pageCode(ds, "next"),
      },
      {
        path: "components/ui/button.tsx",
        language: "tsx",
        description: "Generated shadcn-style button using the button tokens.",
        content: buttonCode(ds),
      },
      {
        path: "lib/utils.ts",
        language: "typescript",
        description: "Class name helper.",
        content: utilsCode(),
      },
      {
        path: "components.json",
        language: "json",
        description: "shadcn configuration.",
        content: JSON.stringify(
          {
            $schema: "https://ui.shadcn.com/schema.json",
            style: "new-york",
            rsc: true,
            tsx: true,
            tailwind: {
              config: "tailwind.config.ts",
              css: "app/globals.css",
              baseColor: "zinc",
              cssVariables: true,
              prefix: "",
            },
            aliases: {
              components: "@/components",
              utils: "@/lib/utils",
              ui: "@/components/ui",
              lib: "@/lib",
              hooks: "@/hooks",
            },
          },
          null,
          2,
        ),
      },
      {
        path: "tailwind.config.ts",
        language: "typescript",
        description: "Tailwind theme generated from the design system.",
        content: tailwindCode(ds, [
          "./app/**/*.{ts,tsx}",
          "./components/**/*.{ts,tsx}",
          "./lib/**/*.{ts,tsx}",
        ]),
      },
      {
        path: "postcss.config.js",
        language: "javascript",
        description: "Tailwind and autoprefixer.",
        content: `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`,
      },
      {
        path: "next.config.mjs",
        language: "javascript",
        description: "Next.js config.",
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
`,
      },
      {
        path: "tsconfig.json",
        language: "json",
        description: "Strict TypeScript config with the @ alias.",
        content: JSON.stringify(
          {
            compilerOptions: {
              target: "ES2017",
              lib: ["dom", "dom.iterable", "esnext"],
              allowJs: true,
              skipLibCheck: true,
              strict: true,
              noEmit: true,
              esModuleInterop: true,
              module: "esnext",
              moduleResolution: "bundler",
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: "preserve",
              incremental: true,
              plugins: [{ name: "next" }],
              baseUrl: ".",
              paths: { "@/*": ["./*"] },
            },
            include: [
              "next-env.d.ts",
              "**/*.ts",
              "**/*.tsx",
              ".next/types/**/*.ts",
            ],
            exclude: ["node_modules"],
          },
          null,
          2,
        ),
      },
      {
        path: "README.md",
        language: "markdown",
        description: "How to run and edit the starter.",
        content: readme(ds, "next"),
      },
    ],
  };
}

export function buildHandoffBundle(starter: HandoffStarter): string {
  return `# ${starter.label} starter

${starter.description}

Generated from the current SaaS-UI design system.

## Files

${starter.files
  .map(
    (file) => `### \`${file.path}\`

${file.description}

\`\`\`${file.language}
${file.content}
\`\`\``,
  )
  .join("\n\n")}
`;
}
