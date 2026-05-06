# Tour de Contrôle

![Logo Tour De Controle](./images/LogoLaTourDeControle.svg)

**La Tour de Contrôle** est une application web de contrôle des caisses et de gestion du personnel pour le secteur de la restauration. Elle permet aux gérants de restaurants d'optimiser leurs opérations quotidiennes.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Express.js, TypeScript, Zod, Winston, JWT |
| **Base de données** | PostgreSQL 15, Sqitch (migrations) |
| **Infrastructure** | Docker Compose, GitHub Actions CI |
| **Tests** | Jest, Supertest (48 tests d'intégration) |

## Fonctionnalités

- **Authentification sécurisée** — JWT via cookies httpOnly, rate limiting, reset password par email
- **Gestion des caisses** — Ouverture/fermeture avec détection des écarts
- **Suivi des transactions** — Par type de paiement, avec filtres et pagination
- **Gestion du personnel** — CRUD utilisateurs avec rôles (Développeur, Gérant, Responsable, Serveur)
- **Dashboard** — KPIs en temps réel, répartition par moyen de paiement

## Structure du projet

```
tour-de-controle/
├── backend/          # API Express.js (MVC)
├── frontend/         # Application React + Vite
├── db/               # Migrations Sqitch + seeders SQL
├── conception/       # Diagrammes UML, wireframes, maquettes
├── .github/          # CI GitHub Actions
├── docker-compose.yml
└── SPRINTS.md        # Suivi des sprints
```

## Démarrage rapide

### Prérequis

- Node.js 20+
- PostgreSQL 15+
- Sqitch

### 1. Configuration

```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

### 2. Base de données

```bash
cd db
sqitch deploy
psql -U $DB_USER -h localhost -d $DB_NAME -f seeders/sample_data.sql
```

### 3. Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:4000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Alternative Docker

```bash
docker compose up -d
```

Services : Frontend (3000), Backend (4000), Swagger (8080), pgAdmin (8081)

## Comptes de démonstration

Après le seeding, ces comptes sont disponibles (mot de passe : `Password1`) :

| Rôle | Email | Accès |
|------|-------|-------|
| Développeur | `developpeur@tour-de-controle.com` | Admin complet |
| Gérant | `gerant@tour-de-controle.com` | Admin complet |
| Responsable | `responsable@tour-de-controle.com` | Accès limité |
| Serveur | `serveur@tour-de-controle.com` | Accès limité |

## Tests

```bash
cd backend
npm test           # 48 tests d'intégration
```

## API Documentation

Swagger UI disponible sur `http://localhost:8080` (Docker) ou `http://localhost:4000/api-docs` (local).

## Licence

MIT
