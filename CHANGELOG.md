# Changelog

Toutes les modifications notables de ce projet sont documentees dans ce fichier.
Format base sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [1.3.0] - 2026-05-07

### Added
- Audit Documentation & Communication (AUDIT_DOCUMENTATION.md)
- Annotations Swagger JSDoc sur les 15 endpoints des 4 fichiers routes
- Pre-commit hooks via husky + lint-staged (biome backend, eslint frontend)
- CONTRIBUTING.md avec conventions, workflow Git, architecture
- CHANGELOG.md (ce fichier)

### Changed
- CDC et endpoints.md alignes avec le code reel (PUT→PATCH, Bearer→cookieAuth)

## [1.2.0] - 2026-05-07

### Changed
- Audit Architecture & Organisation — 25 findings resolus (score 6→8.5/10)
- Service Redis ajoute dans docker-compose
- AuthContext centralise (1 seul appel getCurrentUser par navigation)
- Services frontend unifies en pattern instance
- Composant PasswordInput extrait et reutilisable
- Route 404 ajoutee dans le frontend
- CSS mort supprime, TypeScript aligne front/back
- 7 packages fantomes supprimes

## [1.1.0] - 2026-05-06

### Changed
- Audit Qualite du Code — score 4.5→8.5/10, 96 tests (78 backend + 18 frontend)
- Middleware validateIdParam extrait
- Constantes extraites, duplication supprimee
- Tests frontend Vitest ajoutes (18 tests)
- Extraction composants, useMemo optimise

## [1.0.0] - 2026-05-06

### Added
- Sprint 4 : CI GitHub Actions, Docker, documentation, Swagger
- Sprint 3 : Frontend complet (dashboard, validation Zod, toasts, ErrorBoundary)
- Sprint 2 : Backend complet (Winston, email, 48 tests, pagination)
- Sprint 1 : Corrections critiques P0 (securite, rate limiting, Redis)

### Fixed
- Bug `created_by` dans transaction_controller
- Reset password : verification JWT + invalidation token
- CORS configurable via CLIENT_URL
- Suppression console.log sensibles

## [0.1.0] - 2024-11

### Added
- Commit initial — structure backend Express + frontend React
- Authentification JWT, CRUD utilisateurs, transactions, caisses
- Migrations Sqitch, seeders
