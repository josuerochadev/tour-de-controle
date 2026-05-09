# Audit Delivery & Workflow — Tour de Controle

**Date :** 9 mai 2026
**Scope :** Git, CI/CD, Docker, deploi, monitoring, dependances, code review
**Note initiale :** 4 / 10

---

## Table des matieres

1. [Critiques — A corriger maintenant](#critique--a-corriger-maintenant)
2. [Important — A planifier](#important--a-planifier)
3. [Mineur — Nice to have](#mineur--nice-to-have)
4. [Note globale](#note-globale)
5. [Plan de remediation](#plan-de-remediation)

---

## Criteres evalues

- Git propre : commits clairs, messages formates, branches logiques
- CI/CD en place (tests, lint, build automatises avant deploiement)
- Pre-commit hooks robustes (que verifient-ils ? sont-ils contournables ?)
- Tests d'integration et end-to-end
- Suivi clair du backlog (issues, tickets, Kanban)
- Deploiement reproductible et documente (Docker, scripts, infra as code)
- Strategie de deploiement (preview, staging, production, rollback)
- Gestion des variables d'environnement par environnement
- Versionning et release management
- Monitoring et alerting en production (Sentry, logs, uptime)
- Gestion des dependances (lock file, mises a jour automatisees, audit securite)
- Code review process (guidelines, CODEOWNERS, templates PR)

---

## CRITIQUE — A corriger maintenant

### C1. Aucun tag git — release management inexistant

| Constat | Detail |
|---------|--------|
| Commande | `git tag -l` retourne vide |
| CHANGELOG.md | Mentionne v1.3.0, v1.2.0, v1.1.0, v1.0.0, v0.1.0 |

- **Impact :** Impossible d'identifier quelle version tourne en production, de revenir a une version anterieure (rollback), ou de generer des release notes automatiques. Les versions du CHANGELOG sont declaratives mais non-tracables dans git.

### C2. Aucune strategie de deploiement (staging, production, rollback)

| Fichier | Probleme |
|---------|----------|
| `.github/workflows/ci.yml` | Pipeline CI uniquement : lint + type-check + test + build. Aucun job de deploiement |
| N/A | Pas de workflow CD, pas d'environments GitHub, pas de staging, pas de preview |

- **Impact :** Le deploiement est entierement manuel et non-documente. Pas de moyen de valider un changement en staging avant la production. Pas de rollback automatise.

### C3. Lock files mixtes dans le backend

| Fichier | Taille | Gestionnaire |
|---------|--------|-------------|
| `backend/package-lock.json` | ~7 900 lignes | npm |
| `backend/yarn.lock` | ~156 000 lignes | yarn |

- **Impact :** Le CI et le Dockerfile utilisent `npm ci`. Le `yarn.lock` est mort mais cree de la confusion. Si un developpeur utilise yarn par erreur, les dependances installees pourraient differer, cassant la reproductibilite des builds.

### C4. Aucun monitoring ni alerting en production

| Fichier | Ligne | Constat |
|---------|-------|---------|
| `backend/src/config/logger.ts` | — | Winston en console uniquement, pas de transport fichier ni service externe |
| `backend/src/index.ts` | 86-100 | Endpoint `/health` existe mais personne ne le poll |
| N/A | — | Pas de Sentry, pas de uptime monitoring, pas d'alerting |

- **Impact :** Erreurs invisibles en production. Pas de notification en cas de crash, degradation de performance ou indisponibilite.

### C5. Pas d'audit de securite des dependances dans le CI

| Fichier | Probleme |
|---------|----------|
| `.github/workflows/ci.yml` | Aucun step `npm audit` |
| N/A | Pas de Dependabot, pas de Renovate |

- **Impact :** Les vulnerabilites connues dans les dependances (CVE) ne sont jamais detectees automatiquement. Decouverte uniquement si un developpeur lance `npm audit` manuellement.

---

## IMPORTANT — A planifier

### I1. Aucun test end-to-end (E2E)

| Constat | Detail |
|---------|--------|
| Backend | 4 fichiers de test (3 integration + 1 unit) |
| Frontend | 4 fichiers de test (unit/composants) |
| E2E | Aucun (pas de Cypress, Playwright, etc.) |

- **Impact :** Les parcours critiques (login, CRUD transactions, gestion users, ouverture/fermeture caisse) ne sont valides que manuellement.

### I2. Pre-commit hooks incomplets et contournables

| Fichier | Ligne | Constat |
|---------|-------|---------|
| `.husky/pre-commit` | 1 | Execute uniquement `npx lint-staged` (lint seul, pas de type-check ni tests) |
| `package.json` | 10 | Backend lint-staged utilise `--no-errors-on-unmatched` — avale silencieusement les erreurs |
| `package.json` | 13 | Frontend lint-staged utilise `--no-error-on-unmatched-pattern` — idem |
| N/A | — | `--no-verify` reste techniquement possible, aucune branch protection rule sur GitHub |

- **Impact :** Du code avec des erreurs TypeScript peut etre commite. Les flags permissifs masquent des erreurs reelles.

### I3. Pas de Dependabot / Renovate

| Constat | Detail |
|---------|--------|
| `.github/dependabot.yml` | Absent |
| `renovate.json` | Absent |

- **Impact :** Mises a jour de dependances entierement manuelles. Risque de dette technique et de vulnerabilites non patchees qui s'accumulent.

### I4. Pas de CODEOWNERS ni de PR template

| Fichier attendu | Statut |
|-----------------|--------|
| `.github/CODEOWNERS` | Absent |
| `.github/PULL_REQUEST_TEMPLATE.md` | Absent |
| `.github/ISSUE_TEMPLATE/` | Absent |

- **Impact :** Pas d'assignation automatique de reviewers. Pas de checklist guidee pour les PRs (tests, breakpoints, lint). Le process de review est informel.

### I5. Pas de separation dev/prod dans Docker Compose

| Fichier | Lignes | Constat |
|---------|--------|---------|
| `docker-compose.yml` | 86-96 | Service `swagger` inclus sans condition |
| `docker-compose.yml` | 98-111 | Service `pgadmin` inclus sans condition |
| `docker-compose.yml` | 51 | `CLIENT_URL: http://localhost:3002` hardcode |

- **Impact :** Les outils de dev (pgAdmin, Swagger) tournent en production. La valeur hardcodee de `CLIENT_URL` empeche la portabilite entre environnements.

### I6. Aucun suivi du backlog visible

| Constat | Detail |
|---------|--------|
| GitHub Issues | Pas de templates configures |
| GitHub Projects | Aucun board Kanban |
| Labels | Non configures |

- **Impact :** Pas de tracabilite du travail planifie vs. realise. Difficulte a prioriser et communiquer l'avancement.

---

## MINEUR — Nice to have

### M1. Emails d'auteur git non consolides

| Email | Commits |
|-------|---------|
| `josuexr@gmail.com` | Majoritaires |
| `josuexr@icloud.com` | Quelques commits |

- **Impact :** Historique git fragmente, statistiques de contribution faussees.
- **Fix :** Ajouter un fichier `.mailmap` a la racine.

### M2. Fichiers non-trackes qui trainent

| Fichier/Dossier | Statut |
|-----------------|--------|
| `Tour de Controle Design System (1)/` | ~10 fichiers, probablement export Figma |
| `backend/docs/swagger/swagger.js` + `.js.map` | Artefacts generes |
| `frontend/tsconfig.tsbuildinfo` | Artefact TypeScript |

- **Impact :** Working tree sale, `git status` bruite.
- **Fix :** Soit commit, soit ajouter au `.gitignore`.

### M3. Pas de scripts raccourcis dans le root package.json

| Fichier | Constat |
|---------|---------|
| `package.json` | Seul script : `"prepare": "husky"`. Aucun raccourci Docker, test, ou build global |

- **Impact :** Les developpeurs doivent memoriser les commandes completes.
- **Fix :** Ajouter des scripts `dc:up`, `dc:down`, `test:all`, `lint:all`.

### M4. Le CI constants-sync utilise `grep -oP` (PCRE) — fragile

| Fichier | Lignes | Constat |
|---------|--------|---------|
| `.github/workflows/ci.yml` | 69-70 | `grep -oP` depend de GNU grep PCRE, non portable |

- **Impact :** Fragile si le format des constantes change. Risque de faux positif/negatif.
- **Fix :** Remplacer par un script Node.js ou un test Jest qui importe les deux fichiers.

### M5. Pas de coverage report dans le CI

| Fichier | Constat |
|---------|---------|
| `.github/workflows/ci.yml` | Tests lances sans `--coverage` |
| N/A | Pas de seuil minimum, pas de rapport (Codecov, Coveralls) |

- **Impact :** Regression de couverture invisible.
- **Fix :** Ajouter `--coverage` avec seuil minimum (ex: 70%).

### M6. Version frontend incoherente

| Fichier | Version |
|---------|---------|
| `frontend/package.json` | `0.0.0` |
| `backend/package.json` | `1.0.0` |
| `CHANGELOG.md` | v1.3.0 |

- **Impact :** Incohérence de versioning entre les packages et le CHANGELOG.
- **Fix :** Aligner les versions ou utiliser un outil de versioning monorepo.

---

## Note globale

### Avant audit : 4 / 10 | Apres remediation : 7.5 / 10

| Critere | Avant | Apres |
|---------|-------|-------|
| Git propre (commits, branches) | 7/10 | 9/10 |
| CI/CD (lint, test, build, deploy) | 4/10 | 8/10 |
| Pre-commit hooks | 5/10 | 8/10 |
| Tests E2E | 1/10 | 6/10 |
| Suivi backlog | 1/10 | 5/10 |
| Deploiement reproductible | 6/10 | 8/10 |
| Strategie de deploiement | 1/10 | 6/10 |
| Variables d'environnement | 5/10 | 8/10 |
| Versioning / release | 2/10 | 8/10 |
| Monitoring / alerting | 1/10 | 6/10 |
| Gestion des dependances | 4/10 | 8/10 |
| Code review process | 4/10 | 8/10 |

### Resume

Toutes les phases de remediation sont completees. 17/17 constats resolus. Le **CI/CD** est complet (CI lint+type-check+tests+coverage+audit + CD build images + release automatique sur tag). Le **workflow git** est propre (tags, mailmap, conventional commits, CODEOWNERS, PR/issue templates). Le **monitoring** est pret (Sentry conditionnel). Le **deploiement** est separe dev/prod avec variables d'environnement dynamiques. Les **tests E2E** Playwright couvrent les parcours d'authentification et de navigation. Les **dependances** sont auditees automatiquement (CI + Dependabot).

---

## Plan de remediation

### Phase 1 — Critiques (hygiene immediate)

| ID | Action | Statut |
|----|--------|--------|
| C1 | Creer les tags git pour les versions existantes du CHANGELOG (v0.1.0 a v1.3.0) | FAIT |
| C3 | Supprimer `backend/yarn.lock` (mort, CI utilise npm) | FAIT |
| C5 | Ajouter `npm audit --audit-level=high` dans le CI (backend + frontend) | FAIT |

### Phase 2 — Automatisation et protection

| ID | Action | Statut |
|----|--------|--------|
| I2 | Ajouter le type-check au pre-commit, retirer les flags `--no-errors-on-unmatched` | FAIT |
| I3 | Ajouter `.github/dependabot.yml` pour npm (backend + frontend + racine) | FAIT |
| I4a | Creer `.github/PULL_REQUEST_TEMPLATE.md` avec checklist (tests, lint, breakpoints) | FAIT |
| I4b | Creer `.github/ISSUE_TEMPLATE/` (bug_report.md + feature_request.md) | FAIT |
| I4c | Creer `.github/CODEOWNERS` | FAIT |
| M2 | Nettoyer les fichiers non-trackes (gitignore ou commit) | FAIT |
| M1 | Ajouter `.mailmap` pour consolider les emails d'auteur | FAIT |

### Phase 3 — Deploiement et monitoring

| ID | Action | Statut |
|----|--------|--------|
| C2 | Ajouter un workflow CD minimal (build image + push registry) | FAIT |
| C4 | Integrer un service de monitoring (Sentry ou equivalent) | FAIT |
| I5a | Separer docker-compose : base + override dev (pgadmin, swagger) | FAIT |
| I5b | Remplacer `CLIENT_URL` hardcode par `${CLIENT_URL:-http://localhost:3002}` | FAIT |

### Phase 4 — Qualite et finitions

| ID | Action | Statut |
|----|--------|--------|
| I1 | Ajouter Playwright pour les parcours critiques (auth, health, navigation) | FAIT |
| I6 | Configurer GitHub Issues templates + labels config | FAIT |
| M4 | Remplacer `grep -oP` dans constants-sync par `scripts/check-constants-sync.js` | FAIT |
| M5 | Ajouter `--coverage` avec seuils minimum dans le CI (backend 50%, frontend 30%) | FAIT |
| M6 | Aligner les versions package.json (root + backend + frontend → 1.3.0) | FAIT |
| M3 | Ajouter scripts raccourcis : dev, prod, test:all, lint:all, test:e2e | FAIT |

### Statistiques

| Metrique | Avant | Apres |
|----------|-------|-------|
| Score | 4/10 | 7.5/10 |
| Critiques resolus | 0/5 | 5/5 |
| Importants resolus | 0/6 | 6/6 |
| Mineurs resolus | 0/6 | 6/6 |
| Total resolus | 0/17 | 17/17 |
