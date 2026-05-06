# Audit Qualité du Code — Tour de Contrôle

**Date :** 6 mai 2026
**Scope :** Backend + Frontend + Infrastructure
**Volume :** ~2700 lignes de code source (hors node_modules)

---

## Table des matières

1. [Critiques — A corriger maintenant](#-critique--a-corriger-maintenant)
2. [Important — A planifier](#-important--a-planifier)
3. [Mineur — Nice to have](#-mineur--nice-to-have)
4. [Note globale](#note-globale)
5. [Plan de remédiation](#plan-de-remediation)

---

## Critères évalués

- KISS (Keep It Simple, Stupid)
- SRP (Single Responsibility Principle)
- Principes SOLID
- Lisibilité et nommage
- Clean Code : duplication, cohésion, couplage
- Code mort (imports, variables, fonctions inutilisés)
- Console.log / debug en production
- Tests unitaires et couverture métier
- Standards du langage / framework (ESLint, Biome, TypeScript strict)
- Magic numbers et strings
- Gestion des types (any, assertions, types partagés)

---

## CRITIQUE — A corriger maintenant

### C1. Aucun test frontend — Couverture 0%

- **Scope :** `frontend/src/` — aucun fichier `.test.ts`, `.spec.tsx`, ni config Vitest/Jest
- **Impact :** Zéro filet de sécurité. Logique métier (hook `useCashRegister`, services API, filtres) non couverte.

### C2. Credentials versionné en clair

| Fichier | Ligne | Contenu |
|---------|-------|---------|
| `db/sqitch.conf` | 4 | `target = db:pg://admin:admin123@localhost:5432/tour_de_controle` |
| `db/sqitch.conf` | 7-8 | `username = admindb`, `password = adm1n` |

- **Impact :** Mots de passe dans l'historique Git, même si `.env` est correctement ignoré.

### C3. Dockerfile backend utilise Yarn, projet utilise npm

| Fichier | Lignes | Problème |
|---------|--------|---------|
| `backend/Dockerfile` | 5-6 | `COPY yarn.lock`, `RUN yarn install` |
| `backend/Dockerfile` | 10 | `RUN yarn build` |
| `backend/Dockerfile` | 14 | `CMD ["yarn", "start"]` |

- **Impact :** Build Docker incohérente avec le dev local (npm + package-lock.json).

### C4. Dockerfile frontend manquant

- `docker-compose.yml:70-79` référence `build: ./frontend`, mais aucun `Dockerfile` n'existe dans `frontend/`.
- **Impact :** `docker-compose up` échoue sur le service frontend.

### C5. `console.error()` en production — 8 occurrences

| Fichier | Lignes |
|---------|--------|
| `frontend/src/services/cash_register_service.ts` | 45, 61, 77, 100, 115, 135, 151, 162 |

- **Impact :** Pollution console, potentielle fuite d'information sensible.

### C6. Duplication SALT_ROUNDS

| Fichier | Ligne | Valeur |
|---------|-------|--------|
| `backend/src/config/constants.ts` | 3 | `SALT_ROUNDS = 12` |
| `backend/src/utils/password_utils.ts` | 4 | `SALT_ROUNDS = 12` (redéfini) |

- **Impact :** Désynchronisation possible, violation DRY.

### C7. Imports inutilisés / code mort (backend)

| Fichier | Ligne | Import mort |
|---------|-------|------------|
| `backend/src/controllers/user_controller.ts` | 6 | `createSchema`, `updateSchema` |
| `backend/src/controllers/cash_register_controller.ts` | 4 | `closeSchema` |
| `backend/src/controllers/user_controller.ts` | 50 | `const { hire_date } = req.body` jamais utilisé |

---

## IMPORTANT — A planifier

### I1. Magic numbers/strings éparpillés (15+ occurrences)

| Fichier | Ligne | Valeur | Contexte |
|---------|-------|--------|----------|
| `backend/src/controllers/authentication_controller.ts` | 40 | `3600000` | Cookie maxAge |
| `backend/src/middlewares/rate_limit_middleware.ts` | 6-7, 13-14 | `15*60*1000`, `100`, `60*60*1000`, `5` | Rate limits |
| `backend/src/models/user_model.ts` | 19 | `50` | Pagination default |
| `backend/src/controllers/user_controller.ts` | 11 | `50` | Idem (dupliqué) |
| `backend/src/models/transaction_model.ts` | 75 | `50` | Idem (triplé) |
| `frontend/src/hooks/use_cash_register.ts` | 27 | `{1:"Espèces",2:"CB"...}` | Types de paiement hardcodés |
| `frontend/src/pages/add_user.tsx` | 55 | `4` | ID rôle "Serveur" |
| `frontend/src/pages/edit_user.tsx` | 28 | `4` | Idem (dupliqué) |
| `frontend/src/pages/view_user.tsx` | 79 | `{1:"Développeur",...}` | Mapping rôles hardcodé |
| `frontend/src/components/filters.tsx` | 23 | `1`, `2` | IDs admin |
| `frontend/src/components/toast.tsx` | 53 | `4000` | Timeout toast |

### I2. Duplication pattern findById identique x3

| Fichier | Lignes |
|---------|--------|
| `backend/src/models/user_model.ts` | 33-42 |
| `backend/src/models/authentication_model.ts` | 16-21 |
| `backend/src/models/transaction_model.ts` | 88-94 |

Même pattern `SELECT * FROM table WHERE id = $1` + try/catch identique.

### I3. Duplication gestion d'erreurs 500 x4

- `backend/src/controllers/authentication_controller.ts` : lignes 45-49, 86-88, 106-108, 138-140
- 4 blocs catch identiques retournant `res.status(500).json(...)`.

### I4. Duplication validation ID en number x6

| Fichier | Lignes |
|---------|--------|
| `backend/src/controllers/user_controller.ts` | 20-21, 52-53, 82-83 |
| `backend/src/controllers/transaction_controller.ts` | 34-35, 68-70, 108-109 |

Même check `!id \|\| Number.isNaN(Number(id))` — devrait être un middleware `validateIdParam`.

### I5. Duplication conversion date ISO x6 (frontend)

| Fichier | Ligne |
|---------|-------|
| `frontend/src/components/filters.tsx` | 10, 47 |
| `frontend/src/pages/add_user.tsx` | 45 |
| `frontend/src/pages/edit_user.tsx` | 39 |
| `frontend/src/pages/dashboard.tsx` | 18 |
| `frontend/src/pages/transactions.tsx` | 10 |
| `frontend/src/pages/cashier.tsx` | 20 |

Pattern : `new Date().toISOString().split("T")[0]` — extraire en utilitaire `formatTodayDate()`.

### I6. Types dupliqués / non centralisés

| Concept | Locations | Problème |
|---------|-----------|---------|
| JWT payload `{ userId, role }` | `backend/src/middlewares/authentication_middleware.ts:9-12`, `backend/src/controllers/authentication_controller.ts:33` | Type défini 2 fois |
| Rôles utilisateur (`1,2,3,4`) | 5+ fichiers frontend | Magic numbers sans enum |
| Types de paiement (`1-6`) | `frontend/src/hooks/use_cash_register.ts:27` | Hardcodé inline |

### I7. Tests backend : couverture partielle de la logique métier

Manquent des tests unitaires pour :
- `hashPassword()`, `comparePassword()` (password_utils)
- `blacklistToken()`, `isTokenBlacklisted()` (token_blacklist_utils)
- Schémas Zod de validation
- Filtres combinés et limites de pagination

### I8. URL `http://localhost:5173` dupliquée

| Fichier | Ligne |
|---------|-------|
| `backend/src/index.ts` | 30 |
| `backend/src/config/mailer.ts` | 15 |

### I9. Code mort frontend

| Fichier | Lignes | Problème |
|---------|--------|---------|
| `frontend/src/components/dialog.tsx` | 74-93 | `Dialog.show()`, `Dialog._resolve`, `Dialog._setDialog` jamais utilisés |
| `frontend/src/main.tsx` | 1 | `import React` inutile (JSX transform moderne) |
| `frontend/src/pages/contact.tsx` | 2 | `import React` inutile |

### I10. Dépendances mortes dans package-lock.json frontend

`@reduxjs/toolkit`, `@tanstack/react-query`, `react-redux` supprimées de `package.json` mais toujours dans `package-lock.json`. Exécuter `npm ci` pour nettoyer.

### I11. Règle ESLint `no-explicit-any: off`

- `frontend/eslint.config.js:26` — `any` autorisé, contredit le typage strict TypeScript.

### I12. Biome rules vides (backend)

- `backend/biome.json:12` — `"rules": {}` — aucune règle de linting active.

---

## MINEUR — Nice to have

### M1. Variables nommées trop courtes

- `frontend/src/hooks/use_cash_register.ts:58` et `frontend/src/pages/dashboard.tsx:102` — `t` au lieu de `transaction`.

### M2. Mélange français/anglais dans les messages d'erreur

- "Erreur serveur" (FR) dans `authentication_controller.ts`, messages API en anglais ailleurs.

### M3. Accessibilité — icônes cliquables sans `<button>`

- `frontend/src/components/header.tsx:66-68` — éléments cliquables sans wrapper sémantique.

### M4. Non-null assertion sans fallback

- `frontend/src/main.tsx:7` — `document.getElementById("root")!`

### M5. Performance mineure — pas de `useMemo`

- `frontend/src/pages/users.tsx:52-61` — `filteredUsers` recalculé à chaque render.
- `frontend/src/hooks/use_cash_register.ts:114-121` — `getTotalsByType()` et `getTheoreticalTotal()`.

### M6. `.gitignore` incomplet

Patterns manquants : `.env.local`, `.env.*.local`, `*.log`, `coverage/`.

### M7. Composants inline à extraire

- `ProfileModal` dans `header.tsx:10-43`
- `InfoField` dans `view_user.tsx:71-76`

---

## Note globale

### Avant audit : 4.5 / 10 | Apres remediation : 7.5 / 10

| Critere | Avant | Apres |
|---------|-------|-------|
| Architecture / Structure | 7/10 | 8/10 |
| Lisibilite / Nommage | 7/10 | 7/10 |
| KISS / SRP / SOLID | 5/10 | 7/10 |
| Duplication (DRY) | 3/10 | 7/10 |
| Code mort | 4/10 | 8/10 |
| Tests frontend | 0/10 | 0/10 |
| Tests backend | 5/10 | 8/10 |
| Magic numbers | 3/10 | 8/10 |
| Typage TypeScript | 7/10 | 8/10 |
| Infra / Docker | 3/10 | 8/10 |
| Securite (credentials) | 2/10 | 7/10 |

### Resume

Apres remediation (Phases 1-3), les problemes critiques ont ete corriges : credentials externalises, Dockerfiles fonctionnels, magic numbers centralises, duplication eliminee via middleware `validateIdParam`, 30 tests unitaires ajoutes. Le point faible restant est l'absence de tests frontend (Vitest a configurer).

---

## Plan de remédiation

### Phase 1 — Critiques (FAIT)

| ID | Action | Statut |
|----|--------|--------|
| C1 | Configurer Vitest + tests frontend | A faire |
| C2 | Externaliser credentials de `sqitch.conf` | FAIT |
| C3 | Réécrire `backend/Dockerfile` avec npm | FAIT |
| C4 | Créer `frontend/Dockerfile` (Vite + nginx) | FAIT |
| C5 | Supprimer 8 `console.error()` et try/catch inutiles | FAIT |
| C6 | Centraliser `SALT_ROUNDS` depuis `constants.ts` | FAIT |
| C7 | Supprimer imports morts et variable `hire_date` | FAIT |

### Phase 2 — Important (FAIT)

| ID | Action | Statut |
|----|--------|--------|
| I1 | Extraire magic numbers en constantes (backend + frontend) | FAIT |
| I2-I4 | Middleware `validateIdParam`, suppression duplication ID validation | FAIT |
| I5 | `formatTodayDate()` et `formatDateToISO()` dans `constants.ts` | FAIT |
| I6 | Types centralisés : `ROLES`, `ROLE_LABELS`, `PAYMENT_TYPE_FALLBACK` | FAIT |
| I7 | Tests unitaires : password, token, schemas, validateIdParam (30 tests) | FAIT |
| I8 | `FRONTEND_URL` centralisé | FAIT |
| I9-I10 | Code mort dialog.tsx, package-lock nettoyé | FAIT |
| I11-I12 | ESLint `no-explicit-any`, Biome rules activées | FAIT |

### Phase 3 — Mineurs (FAIT)

| ID | Action | Statut |
|----|--------|--------|
| M3 | Accessibilité header : icônes dans `<button>` | FAIT |
| M6 | `.gitignore` complété | FAIT |
| I3 | Auth controller : try/catch manuels supprimés (express-async-errors) | FAIT |

### Restant (Backlog)

| ID | Action | Statut |
|----|--------|--------|
| C1 | Tests frontend (Vitest) | A faire |
| M1 | Renommer variables courtes (`t` -> `transaction`) | A faire |
| M2 | Harmoniser messages d'erreur FR/EN | A faire |
| M5 | useMemo pour calculs répétés | A faire |
| M7 | Extraire ProfileModal et InfoField en composants | A faire |
