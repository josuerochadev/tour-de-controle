# Tour de Contrôle

![Logo Tour De Controle](./images/logo-mark.svg)

**La Tour de Contrôle** est une application web de gestion des caisses et du personnel pour la restauration. Elle permet aux gérants et responsables d'ouvrir/clôturer les caisses, suivre les transactions, gérer l'équipe et auditer toutes les actions du service.

> Version actuelle : **1.3.0** — [Voir le CHANGELOG](./CHANGELOG.md)

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Express.js, TypeScript, Zod, Winston, JWT |
| **Base de données** | PostgreSQL 15, Sqitch (migrations) |
| **Cache** | Redis |
| **Infrastructure** | Docker Compose, GitHub Actions CI, Render |
| **Tests** | Jest + Supertest (78 tests backend), Vitest (18 tests frontend), Playwright (E2E) |
| **Qualité** | Biome (backend), ESLint (frontend), Husky + lint-staged |

---

## Fonctionnalités

### Gestion des caisses
- Ouverture et fermeture avec saisie du montant physique
- Détection automatique des écarts caisse
- Historique des sessions de caisse

### Transactions
- Enregistrement par type de paiement (espèces, CB, ticket restaurant, chèque…)
- Saisie des pourboires
- Filtres avancés (date, type, montant) et pagination
- Export et consultation par période

### Personnel
- CRUD complet avec 4 niveaux de rôle : Développeur, Gérant, Responsable, Serveur
- Réinitialisation de mot de passe par email

### Journaux d'actions
- Traçabilité complète de toutes les actions (qui, quoi, quand)
- Filtrable par utilisateur et type d'action

### Dashboard (La Vigie)
- KPIs en temps réel : recettes du jour, nombre de transactions, écarts
- Répartition des encaissements par moyen de paiement

### Sécurité
- Authentification JWT via cookies `httpOnly`
- Rate limiting sur les routes d'authentification
- Validation des entrées avec Zod

---

## Structure du projet

```
tour-de-controle/
├── backend/              # API Express.js (architecture MVC)
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── schemas/      # Validation Zod
│       ├── middlewares/
│       └── utils/
├── frontend/             # Application React + Vite
│   └── src/
│       ├── pages/        # dashboard, cashier, transactions, users, logs…
│       ├── components/
│       ├── hooks/
│       ├── services/     # Clients axios
│       └── contexts/     # AuthContext
├── db/                   # Migrations Sqitch + seeders SQL
├── docs/                 # Documentation technique (ADR, endpoints…)
├── e2e/                  # Tests Playwright end-to-end
├── scripts/              # Scripts utilitaires (migrations au démarrage…)
├── conception/           # Diagrammes UML, wireframes, maquettes
├── .github/              # CI GitHub Actions
├── docker-compose.yml
├── docker-compose.dev.yml
├── render.yaml           # Blueprint déploiement Render
├── SPRINTS.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## Démarrage rapide

### Prérequis

- Docker & Docker Compose (recommandé)
- **OU** Node.js 20+, PostgreSQL 15+, Redis, Sqitch

### Option A — Docker (recommandé)

```bash
cp .env.example .env
# Éditer .env avec vos valeurs

# Production (services essentiels)
docker compose up -d

# Développement (avec pgAdmin + Swagger UI)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3002 |
| Backend / API | http://localhost:4000 |
| Swagger UI | http://localhost:8080 *(dev uniquement)* |
| pgAdmin | http://localhost:8081 *(dev uniquement)* |

### Option B — Lancement manuel

```bash
# 1. Configuration
cp .env.example .env

# 2. Base de données
cd db
sqitch deploy
psql -U $DB_USER -h localhost -d $DB_NAME -f seeders/sample_data.sql

# 3. Backend
cd backend
npm install
npm run dev        # http://localhost:4000

# 4. Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173
```

---

## Comptes de démonstration

Après le seeding (mot de passe : `Password1`) :

| Rôle | Email | Accès |
|------|-------|-------|
| Développeur | `developpeur@tour-de-controle.com` | Admin complet |
| Gérant | `gerant@tour-de-controle.com` | Admin complet |
| Responsable | `responsable@tour-de-controle.com` | Accès limité |
| Serveur | `serveur@tour-de-controle.com` | Accès limité |

---

## Tests

```bash
# Backend — 78 tests d'intégration (Jest + Supertest)
cd backend && npm test

# Frontend — 18 tests unitaires (Vitest + Testing Library)
cd frontend && npm test

# E2E — Playwright
npx playwright test
```

---

## Déploiement

### Render

Le fichier `render.yaml` définit le blueprint complet (web service + PostgreSQL). Les migrations Sqitch s'exécutent automatiquement au démarrage du service via `scripts/migrate.sh`.

Variables d'environnement à configurer dans Render :
- `DATABASE_URL` — fournie automatiquement par Render PostgreSQL
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` *(reset password)*

### Vercel (frontend seul)

`vercel.json` inclus pour le routing SPA (fallback sur `index.html`).

---

## API Documentation

Swagger UI disponible sur :
- `http://localhost:8080` (Docker dev)
- `http://localhost:4000/api-docs` (lancement manuel)

### Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/logout` | Déconnexion |
| `GET` | `/api/cash-registers` | Liste des caisses |
| `POST` | `/api/cash-registers` | Ouvrir une caisse |
| `PATCH` | `/api/cash-registers/:id` | Clôturer une caisse |
| `GET` | `/api/transactions` | Liste des transactions |
| `POST` | `/api/transactions` | Créer une transaction |
| `GET` | `/api/users` | Liste du personnel |
| `GET` | `/api/action-logs` | Journaux d'actions |
| `GET` | `/api/payment-types` | Types de paiement |

---

## Qualité et conventions

```bash
# Backend (Biome)
cd backend && npm run biome:check
cd backend && npm run biome:format

# Frontend (ESLint)
cd frontend && npm run lint

# Vérification des types TypeScript
cd backend && npm run type-check
```

Les pre-commit hooks (Husky + lint-staged) exécutent automatiquement Biome et ESLint avant chaque commit.

---

## Problèmes courants

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| `ECONNREFUSED 5432` | PostgreSQL non démarré | `brew services start postgresql@15` ou `docker compose up db` |
| `ECONNREFUSED 6379` | Redis non démarré | Le backend fonctionne sans Redis (fallback mémoire). Pour activer : `brew services start redis` |
| `EADDRINUSE :4000` | Port déjà utilisé | `lsof -i :4000` puis `kill <PID>`, ou changer `PORT` dans `.env` |
| `sqitch: command not found` | Sqitch non installé | `brew install sqitch` (macOS) |
| Reset password inactif | Variables SMTP vides | Créer un compte sur [ethereal.email](https://ethereal.email) et renseigner `SMTP_USER` / `SMTP_PASS` |
| Pre-commit hook échoue | Erreurs lint | Corriger les erreurs signalées, ne jamais utiliser `--no-verify` |
| Rate limit auth (429) | 5 tentatives échouées | Attendre 1h ou désactiver via `RATE_LIMIT_ENABLED=false` dans `.env` |

---

## Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les conventions de commit, le workflow Git et l'architecture.

---

## Licence

MIT
