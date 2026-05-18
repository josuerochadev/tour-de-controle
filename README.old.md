# Tour de Contrôle

![Logo Tour De Controle](./images/logo-mark.svg)

**La Tour de Contrôle** est une application web de gestion des caisses et du personnel pour la restauration. Elle permet aux gérants et responsables d'ouvrir/clôturer les caisses, suivre les transactions, gérer l'équipe et auditer toutes les actions du service.

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Express.js, TypeScript, Zod, JWT |
| Base de données | PostgreSQL 15 (Neon) |
| Infrastructure | Docker Compose · Railway · Vercel |
| Tests | Jest + Supertest · Vitest · Playwright |

## Fonctionnalités

- **La Vigie** — Dashboard avec KPIs en temps réel et répartition par moyen de paiement
- **La Caisse** — Ouverture/fermeture avec détection automatique des écarts
- **Le Flux** — Transactions par type de paiement, pourboires, filtres avancés, pagination
- **L'Équipage** — Gestion du personnel avec 4 niveaux de rôle, reset password par email
- **Journaux d'actions** — Traçabilité complète (qui, quoi, quand), filtrable
- **Sécurité** — JWT via cookies `httpOnly`, rate limiting, validation Zod

## Structure

```
tour-de-controle/
├── backend/        # API Express.js (MVC)
├── frontend/       # Application React + Vite
├── db/             # Migrations Sqitch + seeders
├── e2e/            # Tests Playwright
├── docs/           # Documentation technique
└── conception/     # UML, wireframes, maquettes
```

## Demo live

**[tour-de-controle-omega.vercel.app](https://tour-de-controle-omega.vercel.app)**

| Service | URL |
|---------|-----|
| Frontend | https://tour-de-controle-omega.vercel.app |
| Backend API | https://tour-de-controle-production.up.railway.app |

## Démarrage rapide

```bash
cp .env.example .env
docker compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3002 |
| Backend | http://localhost:4000 |
| Swagger | http://localhost:8080 *(dev)* |

Pour le lancement manuel ou la configuration avancée, voir [CONTRIBUTING.md](./CONTRIBUTING.md).

## Comptes de démonstration

Mot de passe : `Password1`

| Rôle | Email |
|------|-------|
| Développeur *(admin complet)* | `developpeur@tour-de-controle.com` |
| Gérant | `gerant@tour-de-controle.com` |
| Responsable | `responsable@tour-de-controle.com` |
| Serveur | `serveur@tour-de-controle.com` |

## Tests

```bash
cd backend && npm test     # 78 tests d'intégration
cd frontend && npm test    # 18 tests unitaires
npx playwright test        # E2E
```

## API

Documentation Swagger : `http://localhost:4000/api-docs`

## Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) — conventions de commit, workflow Git, architecture.

## Licence

MIT
