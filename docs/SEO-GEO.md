# SEO / GEO Playbook — SaaS-UI

Guide opérationnel pour être trouvé sur les moteurs de recherche (SEO), cité par
les moteurs génératifs (GEO : ChatGPT, Perplexity, Google AI Overviews, Claude)
et proposé dans la barre d'adresse des navigateurs.

> Règle d'or : les navigateurs n'ont pas d'annuaire. La suggestion dans l'omnibox
> vient du moteur de recherche par défaut + l'historique de l'utilisateur. On ne
> "soumet" rien à Chrome. On joue donc sur (1) le SEO classique, (2) OpenSearch,
> (3) la notoriété de marque.

---

## 0. Checklist express

- [ ] Nom de produit distinctif et spelling unique
- [ ] Domaine canonique + redirections `http → https` et `www → apex`
- [ ] Pages marketing prérendues en HTML (pas de SPA vide)
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt`, `opensearch.xml`
- [ ] Balises `title`/`description`/`canonical`/Open Graph par route
- [ ] JSON-LD `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`
- [ ] Search Console + Bing Webmaster Tools + IndexNow
- [ ] GitHub : description, topics, social preview, releases
- [ ] Crawlers IA autorisés dans `robots.txt`
- [ ] Documentation accessible sans JavaScript
- [ ] Mesure : GSC, analytics, suivi des citations IA

---

## 1. Avant tout : le nom et le domaine

**Problème actuel : `saas-ui` est déjà le nom d'une librairie React connue**
(<https://saas-ui.dev>). Toute recherche "saas-ui" renvoie vers elle, pas vers ce
projet. Sans un nom unique, le SEO de marque est perdu d'avance.

À faire :

1. Choisir un nom **distinctif** (pas un terme générique) et vérifier :
   - disponibilité du domaine `.com` / `.dev` / `.io`
   - disponibilité npm, Docker Hub, GitHub org
   - absence de conflit dans une recherche Google/Bing
2. Figer **un seul spelling** et l'utiliser partout : repo, domaine, npm, docs,
   réseaux sociaux, README, pied de page.
3. Un seul domaine canonique. Rediriger `www` vers l'apex (ou l'inverse) et
   `http` vers `https` en 301.
4. Déposer une fiche **Wikidata** (nom, URL, logo, licence, dépôt GitHub) : c'est
   le socle des Knowledge Panels et de la reconnaissance d'entité par les IA.

Exemples de nommage à éviter : `saas-ui`, `ui-kit`, `design-system`.
Préférer un nom propre, mémorisable et prononçable.

---

## 2. Le blocage n°1 : c'est une SPA Vite

`frontend/index.html` ne contient qu'un `<div id="root">`. Google et les crawlers
IA exécutent mal ou pas du tout le JS : ils ne voient que le `<head>`.

Solutions, par ordre de préférence :

1. **Prérendre le site public** (landing, docs, pricing, FAQ) en HTML statique :
   Astro, VitePress, Next en export statique, ou `vite-plugin-ssg`.
2. Garder `/editor` en SPA (pas d'indexation nécessaire, ajouter `noindex`).
3. Si on reste sur Vite + React : générer au build des fichiers `index.html`
   statiques par route marketing avec le contenu réel.

Côté VPS (nginx), servir les pages prérendues pour `/`, `/docs`, `/pricing` et
faire le fallback `index.html` uniquement pour `/editor`.

> Un site SPA sans prérendu peut ranker sur son nom de marque, mais quasi jamais
> sur les requêtes génériques. C'est le premier chantier.

---

## 3. Fichiers à publier à la racine du site

### `public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /editor

Sitemap: https://example.com/sitemap.xml

# Crawlers IA : autoriser pour être cité (retirer pour en empêcher l'accès)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### `public/sitemap.xml`

Générer au build (toutes les pages publiques, `lastmod` à jour). Ne pas inclure
`/editor`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/docs</loc>
    <lastmod>2026-11-12</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### `public/llms.txt` (GEO)

Fichier texte qui résume le projet pour les LLM, à la racine du domaine.
Ajouter aussi `llms-full.txt` avec la doc complète en Markdown.

```md
# SaaS-UI

> Local-first visual editor for design systems. MIT licensed.

## Docs
- [Getting started](https://example.com/docs/getting-started)
- [Architecture](https://example.com/docs/architecture)
- [FAQ](https://example.com/docs/faq)

## Source
- [GitHub](https://github.com/BlackBenAI/saas-ui)

## Licence
MIT
```

### `public/opensearch.xml` (suggestions navigateur)

C'est le **seul** mécanisme officiel pour apparaître dans la barre d'adresse :
Chrome et Firefox proposent alors "Appuyez sur Tab pour rechercher sur SaaS-UI".

```xml
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>SaaS-UI</ShortName>
  <Description>Search SaaS-UI documentation</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" template="https://example.com/docs/search?q={searchTerms}"/>
</OpenSearchDescription>
```

Et dans le `<head>` :

```html
<link rel="search" type="application/opensearchdescription+xml"
      href="/opensearch.xml" title="SaaS-UI">
```

> L'autocomplete de l'omnibox ne se force pas : il dépend du volume de recherches
> et de l'historique. On y arrive indirectement en étant #1 sur son nom de marque
> et en générant des recherches de marque.
>
> Note : le *Sitelinks Search Box* de Google est déprécié depuis fin 2024. Ne pas
> compter dessus.

---

## 4. Balises meta et données structurées

Utiliser `react-helmet-async` (déjà présent) pour définir par route :
`title`, `meta description`, `link canonical`, Open Graph, Twitter Card.

```tsx
<Helmet>
  <title>SaaS-UI — Local-first design system editor</title>
  <meta name="description" content="Design tokens, preview and export without an account. MIT licensed, runs in your browser." />
  <link rel="canonical" href="https://example.com/" />
  <meta property="og:title" content="SaaS-UI" />
  <meta property="og:description" content="Local-first design system editor." />
  <meta property="og:image" content="https://example.com/og.png" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
```

Prévoir une image **OG 1200×630** (`public/og.png`).

### JSON-LD

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "SaaS-UI",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png",
      "sameAs": ["https://github.com/BlackBenAI/saas-ui"]
    },
    {
      "@type": "WebSite",
      "name": "SaaS-UI",
      "url": "https://example.com"
    },
    {
      "@type": "SoftwareApplication",
      "name": "SaaS-UI",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "license": "https://opensource.org/licenses/MIT"
    }
  ]
}
</script>
```

Ajouter un `FAQPage` sur la page FAQ (questions/réponses réelles, pas de fake).

Autres points :

- `hreflang` si le site est FR + EN.
- `lang` correct sur `<html>`.
- Pas de contenu critique uniquement en JS.
- Core Web Vitals : images WebP/AVIF, `font-display: swap`, code-splitting.

---

## 5. SEO GitHub (souvent plus efficace que le SEO classique)

Les pages GitHub rankent très bien. À optimiser :

- **Description du repo** : une phrase claire, mots-clés naturels.
- **Topics** : `design-system`, `design-tokens`, `local-first`, `react`, `vite`,
  `offline`, `mit-license`, `typescript`.
- **README** : la promesse en 3 lignes + badges + démo visuelle + lien site/docs.
- **Social preview** : image 1280×640 dans Settings → Social preview.
- **Releases** : publier des versions taguées (signal de fraîcheur).
- **Discussions** activées (contenu indexable).
- **Wiki** : publié et lié depuis le README.
- **Licence** visible (MIT) : critère de sélection.

### Registres et annuaires

- Publier un paquet **npm** (description + keywords) même minimal.
- **Docker Hub** si image publiée.
- **Homebrew** si CLI.
- Listes `awesome-*` : `awesome-selfhosted`, `awesome-react`, `awesome-design-systems`.
- **Product Hunt**, **Hacker News**, **Lobsters**, **r/webdev**, **r/reactjs**, **dev.to**.

### Backlinks

- Articles comparatifs ("X vs SaaS-UI"), tutoriels, intégrations.
- Démo **YouTube** (les LLM et Google indexent les transcriptions).
- Guest posts et newsletters dev.

---

## 6. GEO : être cité par les moteurs génératifs

Les LLM ne "classent" pas : ils citent des sources. Il faut être récupérable et
faisable confiance.

1. **Autoriser les crawlers IA** (voir `robots.txt`). Si on les bloque, on
   n'apparaît jamais dans les réponses.
2. **`llms.txt` + `llms-full.txt`** à la racine, et docs en Markdown accessible
   sans JS.
3. **Contenu factuel et citable** : définitions nettes, comparatifs, FAQ, chiffres,
   dates, auteur. Format question → réponse courte.
4. **Cohérence d'entité** : même nom, logo, URL, description partout (site, GitHub,
   npm, Wikidata, réseaux).
5. **Présence sur les sources pêchées** : GitHub, Reddit, Stack Overflow,
   Wikipedia/Wikidata, YouTube, blogs techniques.
6. **Suivi mensuel** : poser "what is <nom>", "<nom> vs <concurrent>" dans
   ChatGPT, Perplexity, Google AI Overviews et noter si le projet est cité.

À éviter : marketing creux, métriques inventées, contenu 100 % généré sans
vérification. Les IA comme les humains pénalisent le contenu non fiable.

---

## 7. Spécifique VPS (nginx)

- Servir le build statique (`dist/`) avec gzip/brotli.
- Fallback SPA **uniquement** pour `/editor`, pages marketing prérendues sinon.
- Redirections 301 `http → https` et `www → apex`.
- En-têtes de cache longs pour les assets hashés, courts pour le HTML.
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`.
- Vérifier `robots.txt` et `sitemap.xml` accessibles en direct.

Exemple minimal :

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    root /var/www/saas-ui/dist;

    location /editor {
        try_files $uri /index.html;
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

---

## 8. Mesure

- **Google Search Console** : requêtes de marque vs génériques, couverture, CWV.
- **Bing Webmaster Tools** + **IndexNow** (soumission instantanée).
- Analytics privacy-friendly (Plausible, Umami) : sources, pages, conversions.
- Suivi des positions sur 10–20 requêtes cibles + suivi des citations IA.

---

## 9. Plan de lancement (30 jours)

1. Semaine 1 : nom définitif, domaine, redirections, prérendu des pages publiques.
2. Semaine 2 : `robots.txt`, `sitemap.xml`, `llms.txt`, OpenSearch, JSON-LD, OG.
3. Semaine 3 : Search Console + Bing + IndexNow, README/topics/social preview,
   publication npm/Docker, listes awesome.
4. Semaine 4 : lancement Product Hunt / HN / Reddit / dev.to, démo YouTube,
   premier article comparatif, fiche Wikidata.
5. Ensuite : publier de la doc et des articles chaque semaine, suivre GSC et les
   citations IA, corriger les pages qui ne rankent pas.

---

## 10. Fichiers à créer dans ce repo

```
frontend/public/robots.txt
frontend/public/sitemap.xml        # généré au build si possible
frontend/public/llms.txt
frontend/public/llms-full.txt
frontend/public/opensearch.xml
frontend/public/og.png             # 1200x630
frontend/public/logo.png
```

Et dans le `<head>` de `frontend/index.html` : `canonical`, Open Graph, Twitter
Card, `link` OpenSearch, JSON-LD.
