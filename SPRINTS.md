# Plan de Sprints — Tour de Contrôle

Suivi des améliorations et corrections du projet.

---

## Sprint 1 — Corrections critiques (P0) ✅

> Bugs bloquants et failles de sécurité critiques.

| # | Tâche | Statut |
|---|-------|--------|
| 1.1 | Fix bug `created_by` : assignait `created_at` (Date) au lieu de `id_user` (ID) dans `transaction_controller.ts` | ✅ Done |
| 1.2 | Reset password : ajout de la vérification du JWT token + comparaison avec le token en BDD + invalidation après usage | ✅ Done |
| 1.3 | Rate limiting : `authLimiter` appliqué sur login/forgot/reset, `apiLimiter` global sur `/api` | ✅ Done |
| 1.4 | Token blacklist : migration vers Redis (ioredis) avec fallback mémoire, logout blacklist le token | ✅ Done |
| 1.5 | Suppression des `console.log` sensibles (cookies, tokens) dans le middleware auth | ✅ Done |
| 1.6 | JWT_SECRET centralisé depuis `config/constants.ts` (suppression des doublons) | ✅ Done |
| 1.7 | CORS rendu configurable via `process.env.CLIENT_URL` | ✅ Done |

---

## Sprint 2 — Compléter le backend (P1) ✅

> Logging, email, tests, qualité du code serveur.

| # | Tâche | Statut |
|---|-------|--------|
| 2.1 | Brancher Winston pour le logging structuré (remplacer tous les console.log/error) | ✅ Done |
| 2.2 | Implémenter l'envoi d'email pour le reset password (nodemailer + config SMTP) | ✅ Done |
| 2.3 | Écrire les tests : auth flow (11), CRUD users (10), transactions (10), cash register (6) — 48 tests | ✅ Done |
| 2.4 | Fix : caisse — valider avant update, ajouter `closed_by`, retourner info écart au lieu de throw | ✅ Done |
| 2.5 | Supprimer la dépendance `bcrypt` (doublon avec `bcryptjs`) + `compilerOptions` du package.json | ✅ Done |
| 2.6 | Ajouter la pagination aux endpoints `getAll` (users + transactions avec page/limit/total) | ✅ Done |
| 2.7 | Corriger PUT → PATCH pour la route update transaction | ✅ Done |

---

## Sprint 3 — Compléter le frontend (P1) ✅

> Dashboard, validation, state management, feedback utilisateur.

| # | Tâche | Statut |
|---|-------|--------|
| 3.1 | Dashboard implémenté : KPIs (statut caisse, nb transactions, total, panier moyen), barres de répartition, dernières transactions | ✅ Done |
| 3.2 | Validation Zod sur le formulaire ajout utilisateur (email, password, téléphone FR) | ✅ Done |
| 3.3 | Payment types chargés dynamiquement depuis l'API via le hook `useCashRegister` avec fallback | ✅ Done |
| 3.4 | Redux Toolkit + React Query supprimés du package.json (~250KB en moins) | ✅ Done |
| 3.5 | ErrorBoundary global ajouté dans App.tsx | ✅ Done |
| 3.6 | Système de toasts (ToastProvider/useToast) avec succès/erreur/info et auto-dismiss | ✅ Done |
| 3.7 | Type `User` + `AuthUser` unifiés dans `types/user.ts`, utilisés partout | ✅ Done |
| 3.8 | `UserService` centralisé — users, add_user, edit_user, view_user utilisent le service | ✅ Done |
| 3.9 | localStorage supprimé : reset password via token URL, axios interceptor nettoyé | ✅ Done |
| 3.10 | Dialog réécrit en React (DialogProvider/useDialog) — suppression innerHTML/XSS | ✅ Done |

---

## Sprint 4 — Durcissement & infra (P2-P3)

> Sécurité, base de données, CI/CD, documentation.

| # | Tâche | Statut |
|---|-------|--------|
| 4.1 | Ajouter les index manquants en BDD (FK : id_role, id_payment_type, created_by, etc.) | ⬜ Todo |
| 4.2 | Créer `.dockerignore` | ⬜ Todo |
| 4.3 | Créer `.env.example` (template sans secrets) | ⬜ Todo |
| 4.4 | Externaliser les secrets du `docker-compose.yml` (utiliser `${VARIABLE}`) | ⬜ Todo |
| 4.5 | Mettre en place une CI GitHub Actions (lint + type-check + tests) | ⬜ Todo |
| 4.6 | Compléter la documentation Swagger des endpoints | ⬜ Todo |
| 4.7 | Ajouter des constantes pour les rôles (DEVELOPER=1, MANAGER=2, etc.) | ⬜ Todo |
| 4.8 | Mettre à jour le README avec les instructions actuelles | ⬜ Todo |
