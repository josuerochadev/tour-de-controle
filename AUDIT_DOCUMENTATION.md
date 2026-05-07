# Audit Documentation & Communication — Tour de Controle

**Date :** 7 mai 2026
**Scope :** README, doc technique, commentaires code, API, commits, onboarding
**Volume :** ~5000 lignes de code source (hors node_modules, tests)

---

## Table des matieres

1. [Critiques — A corriger maintenant](#critique--a-corriger-maintenant)
2. [Important — A planifier](#important--a-planifier)
3. [Mineur — Nice to have](#mineur--nice-to-have)
4. [Note globale](#note-globale)
5. [Plan de remediation](#plan-de-remediation)

---

## Criteres evalues

- README clair et complet (installation, lancement, stack, objectifs)
- Documentation technique (architecture, choix techniques, regles de contribution)
- Changelog ou historique des versions
- Commentaires pertinents (contexte utile, pas d'explications evidentes)
- Documentation des composants, hooks et services (JSDoc, signal vs bruit)
- Decisions architecturales documentees (ADR)
- Messages de commit clairs (conventional commits, historique lisible)
- Variables d'environnement documentees (.env.example avec descriptions)
- Onboarding developpeur (lancement en < 15 min)
- Documentation des API/endpoints consommes ou exposes

---

## CRITIQUE — A corriger maintenant

### C1. Swagger non-fonctionnel — 0 annotations JSDoc dans les routes

- **Fichier :** `backend/docs/swagger/swagger.ts:127`
- **Fichiers concernes :** `backend/src/routes/user_routes.ts`, `authentication_routes.ts`, `cash_register_routes.ts`, `transaction_routes.ts`
- **Probleme :** La config Swagger reference `apis: ["./src/routes/*.ts"]` pour parser les annotations `@swagger`/`@openapi`, mais **aucun fichier route ne contient d'annotation**. Resultat : Swagger UI n'affiche que les schemas statiques, aucun endpoint. La doc API interactive promise dans le README (`http://localhost:4000/api-docs`) est une coquille vide.
- **Evidence :** 0 occurrence de `@swagger` ou `@openapi` dans tout `backend/src/`.

### C2. Pre-commit hooks absents malgre les garde-fous annonces

- **Fichiers :** `backend/package.json`, `frontend/package.json`
- **Absence de :** `.husky/`, `lint-staged`, tout outil de pre-commit
- **Probleme :** Le projet revendique "Pre-commit hooks stricts : ne JAMAIS bypasser avec `--no-verify`" dans les garde-fous, mais **aucun hook n'est configure**. Ni husky, ni lint-staged, ni lefthook. La CI attrape les erreurs apres push, mais rien ne bloque un commit malformate ou non-linte en local.

### C3. Documentation endpoints CDC desynchronisee du code

| Element | CDC (`conception/cahier des charges/`) | Code reel |
|---------|----------------------------------------|-----------|
| Update transaction | `PUT /api/transactions/{id}` (CDC.md:416, endpoints.md:176) | `PATCH` (transaction_routes.ts) |
| Authentification | "Bearer token dans le header" (endpoints.md:624) | `cookieAuth` via httpOnly cookie |
| Cash register close | Reponse contient `id_restaurant` (endpoints.md:390) | Champ inexistant dans le code |
| Login reponse | Retourne `token` dans le body (endpoints.md:36) | Token mis en cookie httpOnly |

- **Impact :** Un developpeur qui lit le CDC avant de coder va ecrire du code incorrect. La doc de conception est un piege.

---

## IMPORTANT — A planifier

### I1. JSDoc quasi absent — 1 controleur sur 4 documente

**Backend (6 JSDoc dans tout `backend/src/`):**

| Fichier | JSDoc | Commentaires |
|---------|-------|-------------|
| `controllers/transaction_controller.ts` | 5 fonctions documentees | Seul fichier avec JSDoc complet |
| `controllers/authentication_controller.ts` | 0 | 1 commentaire inline FR |
| `controllers/user_controller.ts` | 0 | Commentaires `// GET /api/users` seulement |
| `controllers/cash_register_controller.ts` | 0 | 0 commentaires |
| Tous les models (`user_model.ts`, `transaction_model.ts`, etc.) | 0 | Interfaces typees mais non documentees |
| Tous les middlewares | 0 | 0 |
| `config/constants.ts` | 1 (`/** Mirrored... */`) | Commentaires inline sur magic numbers |

**Frontend (3 JSDoc dans tout `frontend/src/`):**

| Fichier | JSDoc |
|---------|-------|
| `services/cash_register_service.ts` | 2 (interfaces seulement) |
| `constants.ts` | 1 (`/** Mirrored... */`) |
| Tous les composants, hooks, pages | 0 |

- **Impact :** Un nouveau developpeur doit lire le code entier pour comprendre le role de chaque fonction. Pas de documentation hoverable dans l'IDE.

### I2. Pas de CONTRIBUTING.md

- **Fichier :** absent a la racine
- **Probleme :** Aucun guide de contribution documentant : conventions de code, workflow Git (branching, PR), process de review, standards de nommage, setup des tests. Le CDC mentionne une equipe de 2 developpeurs mais aucun cadre formel pour la collaboration.

### I3. Pas de CHANGELOG.md

- **Fichier :** absent a la racine
- **Probleme :** `SPRINTS.md` trace les taches par sprint (tracker de projet), mais ce n'est pas un changelog versionne au format standard (Keep a Changelog / semver). Aucun numero de version n'est mentionne dans le projet (ni dans les package.json — `"version": "1.0.0"` par defaut, ni dans Swagger `version: "1.0.0"`).

### I4. Variables .env.example sans descriptions

- **Fichier :** `.env.example`
- **Probleme :** Les 18 variables sont listees avec des placeholders mais **aucune description** n'explique leur usage. Exemples :
  - `REDIS_URL=redis://localhost:6379` — pas mentionne que c'est pour le blacklist des tokens JWT, ni que le fallback memoire existe
  - `JWT_SECRET=generate_a_strong_secret_here` — pas de consigne sur la longueur/complexite attendue
  - `SMTP_USER=` / `SMTP_PASS=` — vides, pas mentionne que le reset password ne fonctionnera pas sans

### I5. README indique "48 tests" — il y en a 96

- **Fichier :** `README.md:15` (tableau stack) et `README.md:100` (commande test)
- **Probleme :** Le README dit "48 tests d'integration" mais l'AUDIT_QUALITE.md confirme 96 tests (78 backend + 18 frontend). Donne obsolete depuis le Sprint 2.

### I6. Aucun ADR (Architecture Decision Records)

- **Probleme :** Les choix architecturaux importants ne sont documentes nulle part de maniere formelle :
  - Redis avec fallback memoire pour le token blacklist
  - JWT via cookies httpOnly plutot que headers Authorization
  - Sqitch plutot qu'un ORM (Prisma, TypeORM)
  - Pattern model direct (pas de couche repository)
  - Zod pour la validation plutot que class-validator ou joi
- Les audits mentionnent des decisions prises mais pas le raisonnement original.

### I7. CI ne teste pas les migrations DB

- **Fichier :** `.github/workflows/ci.yml`
- **Probleme :** La CI verifie lint + type-check + tests + build, mais le workflow ne declare aucun service PostgreSQL. Les tests backend tournent probablement en mode mock ou echouent silencieusement sur les queries DB. Les migrations Sqitch ne sont jamais validees en CI.

---

## MINEUR — Nice to have

### M1. Langue mixte dans les commentaires (FR/EN)

| Fichier | Langue | Exemple |
|---------|--------|---------|
| `controllers/user_controller.ts` | EN | `// GET /api/users` |
| `controllers/authentication_controller.ts:75` | FR | `// Recuperer l'ID utilisateur depuis le token JWT` |
| `controllers/transaction_controller.ts` | EN | JSDoc complet en anglais |
| `config/constants.ts` | EN | `/** Mirrored in frontend... */` |

- **Probleme :** Pas de convention de langue. Le CDC et les audits sont en francais, le code melange les deux.

### M2. Fichier CI duplique et mal place

- **Fichier :** `.github/ci.yml` (en plus de `.github/workflows/ci.yml`)
- **Probleme :** Un `ci.yml` est a la racine de `.github/` ou il ne sera **pas execute** par GitHub Actions. Seul `.github/workflows/ci.yml` est pris en compte. Source de confusion.

### M3. Pas de .env.example par package

- **Probleme :** Un seul `.env.example` a la racine melange les variables backend, frontend, Docker et pgAdmin. Pas de `backend/.env.example` ni `frontend/.env.example` dedies pour clarifier quelles variables sont necessaires a chaque service isole.

### M4. Fichiers de conception non pertinents dans le repo

- **Fichier :** `conception/document_a_fournir.md`
- **Probleme :** Checklist interne de livrables (scolaire/projet), pas une documentation utile aux developpeurs. Ajoute du bruit dans le repo.

### M5. Constantes dupliquees front/back sans procedure de sync

- **Fichiers :** `backend/src/config/constants.ts:15`, `frontend/src/constants.ts:1`
- **Probleme :** Les ROLES sont dupliques avec commentaire `/** Mirrored — keep in sync */` mais aucune documentation ni test ne garantit la coherence. Un ajout de role dans un seul fichier passe silencieusement.

### M6. README manque section troubleshooting

- **Fichier :** `README.md`
- **Probleme :** Pas de section "Problemes courants" : erreur de connexion DB, port deja utilise, Redis non demarre, migration Sqitch echouee. Ce sont les premiers obstacles d'un nouveau developpeur.

---

## Note globale

### Score : 4.5 / 10

| Critere | Note | Detail |
|---------|------|--------|
| README clair et complet | 7/10 | Bon mais donnees obsoletes (48→96 tests) |
| Documentation technique | 6/10 | CDC + audits solides, mais CDC desynchronise du code |
| Changelog / versions | 2/10 | SPRINTS.md n'est pas un changelog |
| Commentaires pertinents | 4/10 | 1 controleur sur 4 documente, reste nu |
| Doc composants/hooks/services (JSDoc) | 2/10 | 9 JSDoc total dans tout le code source |
| ADR (decisions architecturales) | 1/10 | Totalement absent |
| Messages de commit | 9/10 | Conventional commits exemplaires, historique lisible |
| Variables d'environnement documentees | 5/10 | .env.example present mais sans descriptions |
| Onboarding developpeur | 6/10 | Quickstart clair mais pas de hooks, pas de CONTRIBUTING |
| Documentation API/endpoints | 3/10 | Swagger casse (0 annotations), CDC desynchronise |

### Resume

Le projet a une **excellente base documentaire macro** (README structure, CDC complet avec diagrammes UML, sprints traces, audits detailles) et des **commits exemplaires** en conventional commits. Cependant, la **documentation au niveau du code est quasi absente** (9 JSDoc total, Swagger non-fonctionnel, pas d'ADR), la **doc de conception est desynchronisee** du code reel (PUT→PATCH, Bearer→cookie, champs inexistants), et les **garde-fous annonces (pre-commit hooks) ne sont pas implementes**.

---

## Plan de remediation

### Phase 1 — Critiques

| ID | Action | Statut |
|----|--------|--------|
| C1 | Ajouter annotations `@swagger` JSDoc dans les 4 fichiers routes backend (auth, users, transactions, cash-registers) pour generer la doc Swagger dynamiquement | FAIT |
| C2 | Installer husky + lint-staged, configurer pre-commit hooks (lint, type-check, format) | FAIT |
| C3 | Mettre a jour le CDC endpoints : PUT→PATCH, Bearer→cookieAuth, supprimer champs inexistants, aligner reponses | FAIT |

### Phase 2 — Important

| ID | Action | Statut |
|----|--------|--------|
| I1 | Ajouter JSDoc sur les fonctions exportees des controllers, models, middlewares backend + services, hooks frontend | FAIT |
| I2 | Creer CONTRIBUTING.md (conventions, workflow Git, PR process, setup dev) | FAIT |
| I3 | Creer CHANGELOG.md initial recapitulant les versions depuis le debut du projet | FAIT |
| I4 | Ajouter descriptions inline dans .env.example pour chaque variable | FAIT |
| I5 | Corriger README : mettre a jour le nombre de tests (96), mentionner Vitest frontend | FAIT |
| I6 | Creer un fichier ADR initial documentant les 5 decisions architecturales cles | FAIT |
| I7 | Ajouter service PostgreSQL dans la CI pour valider les tests d'integration reellement | FAIT |

### Phase 3 — Mineurs

| ID | Action | Statut |
|----|--------|--------|
| M1 | Choisir une langue pour les commentaires (EN) et harmoniser | FAIT |
| M2 | Supprimer `.github/ci.yml` (doublon non fonctionnel) | N/A (fichier inexistant) |
| M3 | Creer `backend/.env.example` et `frontend/.env.example` dedies | FAIT |
| M4 | Supprimer `conception/document_a_fournir.md` | FAIT |
| M5 | Ajouter un test CI qui verifie la coherence des constantes front/back | FAIT |
| M6 | Ajouter section troubleshooting dans le README | FAIT |
