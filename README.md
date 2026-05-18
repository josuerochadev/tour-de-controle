<div align="center">

# Tour de Controle

**Gestion des caisses, des transactions et du personnel pour la restauration.**

![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

[Demo](https://tour-de-controle-omega.vercel.app) · [Portfolio](https://josuerocha.dev) · [Signaler un bug](https://github.com/josuerochadev/tour-de-controle/issues)

</div>

---

## A propos

Tour de Controle est une application web full-stack permettant aux gerants de restaurants de piloter leurs caisses au quotidien : ouverture et fermeture des services, suivi des transactions, gestion de l'equipe et audit de toutes les operations.

Le projet a ete concu et developpe en autonomie dans le cadre d'un projet de formation full-stack (React / Express / PostgreSQL), avec un accent mis sur la rigueur d'architecture, la securite et la qualite du code. Il reflete une demarche d'ingenierie logicielle complete, du cahier des charges jusqu'au deploiement en production.

<!-- Screenshot a ajouter : capturer le dashboard "La Vigie" avec des donnees de demo -->

## Fonctionnalites

- **La Vigie** — Dashboard temps reel avec KPIs financiers, repartition par moyen de paiement et historique par date
- **La Caisse** — Cycle de vie complet d'une caisse : ouverture avec fond de caisse, ajout de transactions, cloture avec detection automatique des ecarts
- **Le Flux** — Journal des transactions avec filtres avances (date, montant, type de paiement, employe) et pagination
- **L'Equipage** — Gestion du personnel avec 4 niveaux de role hierarchiques et reinitialisation du mot de passe par email
- **Journaux d'actions** — Tracabilite complete de toutes les operations (authentification, caisse, transactions, utilisateurs)
- **Controle d'acces** — Permissions granulaires par role : Developpeur, Gerant, Responsable, Serveur
- **Securite** — Authentification JWT via cookies httpOnly, rate limiting, validation Zod sur toutes les entrees, blacklist de tokens

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Express.js, TypeScript, Zod, JWT |
| Base de donnees | PostgreSQL 15, Sqitch (migrations) |
| Cache | Redis (blacklist de tokens) |
| Tests | Jest + Supertest, Vitest, Playwright |
| Linting | Biome (backend), ESLint (frontend), Husky + lint-staged |
| Infrastructure | Docker Compose (5 services), Railway, Vercel, Neon |
| Documentation | Swagger, ADR (Architecture Decision Records) |

## Demarrer

### Prerequis

- Docker et Docker Compose
- Node.js 20+
- Git

### Installation

```bash
git clone https://github.com/josuerochadev/tour-de-controle.git
cd tour-de-controle
cp .env.example .env
docker compose up -d
```

L'application est accessible sur :

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3002 |
| Backend API | http://localhost:4000 |

En mode developpement (avec Swagger et pgAdmin) :

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

| Service | URL |
|---------|-----|
| Swagger UI | http://localhost:8080 |
| pgAdmin | http://localhost:8081 |

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance l'environnement Docker complet (dev) |
| `npm run prod` | Lance l'environnement Docker (production) |
| `npm run test:backend` | Tests backend (Jest + Supertest) |
| `npm run test:frontend` | Tests frontend (Vitest) |
| `npm run test:all` | Tests backend + frontend |
| `npm run test:e2e` | Tests end-to-end (Playwright) |
| `npm run lint:all` | Lint backend (Biome) + frontend (ESLint) |

### Comptes de demonstration

Mot de passe commun : `Password1`

| Role | Email | Acces |
|------|-------|-------|
| Developpeur | `developpeur@tour-de-controle.com` | Administration complete |
| Gerant | `gerant@tour-de-controle.com` | Gestion personnel, caisses, transactions |
| Responsable | `responsable@tour-de-controle.com` | Consultation uniquement |
| Serveur | `serveur@tour-de-controle.com` | Saisie de transactions |

## Architecture

```
tour-de-controle/
├── backend/
│   └── src/
│       ├── config/          # DB, Redis, logger, constantes
│       ├── controllers/     # Logique metier (5 controllers)
│       ├── models/          # Requetes SQL directes (5 models)
│       ├── routes/          # Definition des endpoints (6 fichiers)
│       ├── schemas/         # Validation Zod (4 schemas)
│       ├── middlewares/     # Auth, rate limit, validation, erreurs
│       └── utils/           # Hachage, blacklist tokens
├── frontend/
│   └── src/
│       ├── pages/           # 13 pages (dashboard, caisse, transactions...)
│       ├── components/      # Composants reutilisables
│       ├── services/        # Clients API Axios (4 services)
│       ├── contexts/        # AuthContext (gestion de session)
│       ├── hooks/           # useCashRegister
│       └── schemas/         # Validation cote client
├── db/
│   ├── migrations/          # Sqitch (create-tables, add-indexes)
│   └── seeders/             # Donnees de demonstration
├── e2e/                     # Tests Playwright
├── docs/adr/                # 5 ADR (JWT, Redis, Sqitch, Zod, No-ORM)
├── scripts/                 # Verification sync constantes
└── docker-compose.yml       # PostgreSQL, Redis, Backend, Frontend, Sqitch
```

## Demo en ligne

| Service | URL |
|---------|-----|
| Frontend | https://tour-de-controle-omega.vercel.app |
| Backend API | https://tour-de-controle-production.up.railway.app |

## Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les conventions de commit, le workflow Git et les details d'architecture.

## Licence

MIT

---

Construit par **[Josue Rocha](https://josuerocha.dev)** · [LinkedIn](https://linkedin.com/in/josuerocha) · [GitHub](https://github.com/josuerochadev)
