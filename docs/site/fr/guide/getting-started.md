# Démarrage rapide

Ce guide vous mène d’un clone frais à un projet local enregistré.

## Prérequis

- Node.js 20 ou plus récent
- npm 10 ou plus récent
- Facultatif : Docker 24+ et Docker Compose v2
- Un navigateur moderne compatible IndexedDB

## Lancer en local

```bash
git clone git@github.com:BlackBenAI/saas-ui.git
cd saas-ui/frontend
npm install
npm run dev
```

Ouvrez `http://localhost:5173`.

L’éditeur est disponible sur `http://localhost:5173/dashboard`.

## Lancer avec Docker

Depuis la racine du dépôt :

```bash
docker compose up --build
```

Ouvrez `http://localhost:3000`. Pour utiliser un autre port hôte :

```bash
FRONTEND_PORT=3010 docker compose up --build
```

## Première session

1. Ouvrez `/dashboard`. Un projet local est créé automatiquement s’il n’en existe aucun.
2. Ouvrez `/projects` pour créer, dupliquer ou supprimer des projets.
3. Cliquez sur le nom du projet dans l’en-tête et renommez-le.
4. Attendez que le pied de page affiche **Enregistré localement**.
5. Rechargez la page. Le nom du projet et le design system sont restaurés depuis IndexedDB.
6. Utilisez les boutons de la barre latérale et des propriétés pour replier et déplier les panneaux.
7. Utilisez annuler et rétablir dans l’en-tête pour parcourir l’historique local.

Les dix modules sont interactifs : Vue d’ensemble, Couleurs, Typographie, Mise en page,
Composants, Effets, Mouvement, Assets, Règles IA et Export. Exportez n’importe quelle direction
en CSS, Tailwind, TypeScript, JSON ou Markdown. L’export construit aussi des starters Vite +
React et Next.js + shadcn ainsi qu’un fichier JSON de variables Figma. Consultez la
[Feuille de route (EN)](/guide/roadmap) pour la suite.

## Commandes

| Commande | Rôle |
|---|---|
| `make install` | Installer les dépendances du frontend |
| `make dev` | Démarrer le serveur Vite |
| `make build` | Vérifier TypeScript et construire le bundle |
| `make preview` | Prévisualiser le build de production |
| `make test` | Lancer la suite Vitest |
| `make lint` | Lancer ESLint sans avertissement |
| `make typecheck` | Lancer `tsc --noEmit` |
| `make up` | Construire et démarrer le conteneur frontend |
| `make down` | Arrêter le conteneur |
| `make logs` | Suivre les logs du conteneur |

Vous pouvez aussi utiliser npm directement depuis `frontend/` :

```bash
npm run dev
npm run build
npm run preview
npm run test -- --run
npm run lint
npm run typecheck
```

## Configuration

| Variable | Emplacement | Rôle |
|---|---|---|
| `VITE_REPOSITORY_URL` | `frontend/.env.local` | Remplacer le lien GitHub dans l’interface |
| `FRONTEND_PORT` | shell ou `.env` | Port hôte du frontend Docker |

L’éditeur local ne nécessite ni URL d’API, ni base de données, ni authentification.

## Dépannage

### Le port 5173 est déjà utilisé

```bash
npm run dev -- --port 5174
```

### La page est blanche ou bloquée sur Loading

- Vérifiez Node.js 20+ avec `node --version`.
- Supprimez `frontend/node_modules` et relancez `npm install`.
- Consultez la console du navigateur et le terminal Vite pour la première erreur.

### Le projet ne persiste pas

- Vérifiez que le navigateur n’est pas en navigation privée restreignant IndexedDB.
- Ouvrez DevTools → Application → IndexedDB → `saas-ui`.
- Le pied de page doit afficher **Enregistré localement** après un court délai.

### Je dois réinitialiser les données locales

Ouvrez DevTools → Application → Storage → Clear site data, ou supprimez la base IndexedDB
`saas-ui`. Cela supprime définitivement les projets locaux. Voir
[Données locales (EN)](/guide/local-first-data).

## Ensuite

- [Architecture (EN)](/guide/architecture)
- [Données locales (EN)](/guide/local-first-data)
- [Contribuer (EN)](/guide/contributing)
