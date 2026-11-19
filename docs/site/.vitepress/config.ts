import { defineConfig } from "vitepress";

const github = "https://github.com/BlackBenAI/saas-ui";
const discord = "https://discord.gg/GMtNYDevE";

export default defineConfig({
  title: "SaaS-UI",
  description: "A local-first visual editor for design systems.",
  base: process.env.DOCS_BASE ?? "/",
  cleanUrls: true,
  lastUpdated: true,
  head: [["meta", { name: "theme-color", content: "#18181B" }]],
  locales: {
    root: { label: "English", lang: "en" },
    fr: { label: "Français", lang: "fr", link: "/fr/" },
    es: { label: "Español", lang: "es", link: "/es/" },
  },
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      { icon: "github", link: github },
      { icon: "discord", link: discord },
    ],
    search: { provider: "local" },
    locales: {
      root: {
        label: "English",
        selectText: "Language",
        nav: [
          { text: "Guide", link: "/guide/getting-started" },
          { text: "Reference", link: "/guide/architecture" },
          { text: "Discord", link: discord },
          { text: "GitHub", link: github },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Home", link: "/" },
                { text: "Getting Started", link: "/guide/getting-started" },
                { text: "Architecture", link: "/guide/architecture" },
                { text: "Local-First Data", link: "/guide/local-first-data" },
                { text: "Design Principles", link: "/guide/design-principles" },
              ],
            },
            {
              text: "Community",
              items: [
                { text: "Contributing", link: "/guide/contributing" },
                { text: "Roadmap", link: "/guide/roadmap" },
                { text: "FAQ", link: "/guide/faq" },
                { text: "Security", link: "/guide/security" },
                { text: "Discord community", link: discord },
              ],
            },
          ],
        },
        footer: {
          message: "MIT licensed editor. Cloud is optional.",
          copyright: "© 2026 BlackBenAI",
        },
      },
      fr: {
        label: "Français",
        selectText: "Langue",
        nav: [
          { text: "Guide", link: "/fr/guide/getting-started" },
          { text: "Référence (EN)", link: "/guide/architecture" },
          { text: "Discord", link: discord },
          { text: "Discord", link: discord },
          { text: "GitHub", link: github },
        ],
        sidebar: {
          "/fr/": [
            {
              text: "Démarrage",
              items: [
                { text: "Accueil", link: "/fr/" },
                { text: "Démarrage rapide", link: "/fr/guide/getting-started" },
              ],
            },
            {
              text: "Référence anglaise",
              items: [
                { text: "Architecture (EN)", link: "/guide/architecture" },
                { text: "Données locales (EN)", link: "/guide/local-first-data" },
                { text: "Principes de design (EN)", link: "/guide/design-principles" },
                { text: "Contribuer (EN)", link: "/guide/contributing" },
                { text: "Feuille de route (EN)", link: "/guide/roadmap" },
                { text: "FAQ (EN)", link: "/guide/faq" },
                { text: "Sécurité (EN)", link: "/guide/security" },
                { text: "Communauté Discord", link: discord },
              ],
            },
          ],
        },
        footer: {
          message: "Éditeur sous licence MIT. Le cloud est optionnel.",
        },
      },
      es: {
        label: "Español",
        selectText: "Idioma",
        nav: [
          { text: "Guía", link: "/es/guide/getting-started" },
          { text: "Referencia (EN)", link: "/guide/architecture" },
          { text: "Discord", link: discord },
          { text: "Discord", link: discord },
          { text: "GitHub", link: github },
        ],
        sidebar: {
          "/es/": [
            {
              text: "Inicio",
              items: [
                { text: "Portada", link: "/es/" },
                { text: "Primeros pasos", link: "/es/guide/getting-started" },
              ],
            },
            {
              text: "Referencia en inglés",
              items: [
                { text: "Arquitectura (EN)", link: "/guide/architecture" },
                { text: "Datos locales (EN)", link: "/guide/local-first-data" },
                { text: "Principios de diseño (EN)", link: "/guide/design-principles" },
                { text: "Contribuir (EN)", link: "/guide/contributing" },
                { text: "Hoja de ruta (EN)", link: "/guide/roadmap" },
                { text: "FAQ (EN)", link: "/guide/faq" },
                { text: "Seguridad (EN)", link: "/guide/security" },
                { text: "Comunidad Discord", link: discord },
              ],
            },
          ],
        },
        footer: {
          message: "Editor con licencia MIT. La nube es opcional.",
        },
      },
    },
  },
});
