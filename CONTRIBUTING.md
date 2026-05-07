# Contribuer a Tour de Controle

## Prerequis

- Node.js 20+
- PostgreSQL 15+
- Sqitch (migrations SQL)
- Redis (optionnel — fallback memoire en dev)

## Setup dev

```bash
# 1. Cloner et configurer
git clone <repo-url>
cp .env.example .env
# Editer .env avec vos valeurs locales

# 2. Base de donnees
cd db && sqitch deploy
psql -U $DB_USER -h localhost -d $DB_NAME -f seeders/sample_data.sql

# 3. Backend
cd backend && npm install && npm run dev

# 4. Frontend
cd frontend && npm install && npm run dev

# 5. Pre-commit hooks (installe automatiquement via `npm install` a la racine)
cd .. && npm install
```

## Conventions de code

### Langue

- **Code** (variables, fonctions, commentaires JSDoc) : anglais
- **Documentation utilisateur** (README, CDC, AUDIT) : francais

### Style

- **Backend** : Biome (lint + format) — `npx biome check` / `npx biome format --write`
- **Frontend** : ESLint — `npx eslint .`
- Le pre-commit hook execute automatiquement le linter sur les fichiers stages

### Nommage

- Fichiers : `snake_case` (ex: `user_controller.ts`, `cash_register_service.ts`)
- Composants React : `PascalCase` pour l'export, `snake_case` pour le fichier
- Variables / fonctions : `camelCase`
- Constantes : `UPPER_SNAKE_CASE`

### TypeScript

- Mode strict active
- Pas de `any` — utiliser des types explicites ou `unknown`
- Interfaces pour les modeles de donnees, types Zod pour la validation

## Workflow Git

### Branches

- `main` : branche de production, toujours deployable
- Branches feature : `feat/description-courte`
- Branches fix : `fix/description-courte`

### Commits

Format **Conventional Commits** obligatoire :

```
<type>(<scope>): <description>

Types: feat, fix, docs, refactor, test, chore
Scopes: backend, frontend, db, ci, deps
```

Exemples :
- `feat(backend): ajout pagination sur GET /api/users`
- `fix(frontend): correction boucle infinie dans Filters`
- `docs: mise a jour AUDIT_DOCUMENTATION.md`

### Pull Requests

- 1 PR = 1 theme (pas de PR fourre-tout)
- Description avec contexte + captures si UI
- Validation visuelle sur 3 breakpoints (mobile/tablet/desktop) avant merge
- Les tests CI doivent passer

## Tests

```bash
# Backend (Jest + Supertest)
cd backend && npm test

# Frontend (Vitest + Testing Library)
cd frontend && npm test
```

- Tout nouveau endpoint doit avoir un test d'integration
- Tout nouveau composant complexe doit avoir un test

## Pre-commit hooks

Les hooks sont configures via **husky + lint-staged** a la racine du projet. Ils s'executent automatiquement a chaque `git commit` :

- Backend : `biome check` sur les fichiers `.ts` modifies
- Frontend : `eslint` sur les fichiers `.ts/.tsx` modifies

**Ne JAMAIS bypasser avec `--no-verify`.**

## Architecture

```
backend/src/
  controllers/   # Logique HTTP (req/res)
  models/        # Acces donnees (SQL via pg)
  middlewares/    # Auth, validation, erreurs
  schemas/       # Validation Zod
  config/        # DB, logger, constantes
  routes/        # Definitions de routes + annotations Swagger
  utils/         # Fonctions utilitaires

frontend/src/
  components/    # Composants reutilisables
  pages/         # Pages / routes
  services/      # Appels API (couche d'abstraction)
  hooks/         # Custom hooks
  context/       # React Context (AuthContext)
  schemas/       # Validation Zod frontend
  types/         # Types partages
  constants.ts   # Constantes (miroir partiel du backend)
```

## Constantes partagees

Les constantes `ROLES` et `ADMIN_ROLES` sont dupliquees entre :
- `backend/src/config/constants.ts`
- `frontend/src/constants.ts`

Elles portent le commentaire `/** Mirrored — keep in sync */`. Toute modification doit etre faite dans les deux fichiers.
