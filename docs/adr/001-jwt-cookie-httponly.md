# ADR-001 : JWT stocke dans un cookie httpOnly

## Statut
Accepte

## Contexte
L'application necessite une authentification stateless. Deux approches standard existent : stocker le JWT dans le localStorage/sessionStorage (transmis via header `Authorization: Bearer`) ou dans un cookie httpOnly.

## Decision
Le JWT est stocke dans un **cookie httpOnly** (`authenticationToken`) configure avec `Secure`, `SameSite=Strict`.

## Consequences
- **Securite** : le token n'est pas accessible via JavaScript (protection XSS)
- **CSRF** : risque mitige par `SameSite=Strict` et le fait que l'API n'effectue pas d'actions sur GET
- **Simplicite** : pas besoin de gerer manuellement le header Authorization cote frontend, axios envoie les cookies avec `withCredentials: true`
- **Contrainte** : le frontend et le backend doivent partager le meme domaine (ou sous-domaine) en production pour que le cookie soit transmis
