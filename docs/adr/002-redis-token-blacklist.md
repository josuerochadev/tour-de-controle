# ADR-002 : Redis pour le blacklist des tokens JWT

## Statut
Accepte

## Contexte
Le logout doit invalider le JWT courant. Un JWT etant stateless, il faut un mecanisme de blacklist cote serveur. Options : base de donnees PostgreSQL, store en memoire, ou Redis.

## Decision
Utiliser **Redis** (via ioredis) pour stocker les tokens blacklistes, avec un **fallback en memoire** (Map) si Redis n'est pas disponible.

## Consequences
- **Performance** : Redis offre des lookups O(1) en memoire, ideal pour verifier chaque requete authentifiee
- **TTL natif** : les tokens blacklistes expirent automatiquement avec le meme TTL que le JWT (1h), sans cron de nettoyage
- **Resilience** : le fallback memoire permet au dev de travailler sans Redis installe
- **Limite du fallback** : en memoire, les tokens blacklistes sont perdus au redemarrage du serveur et ne sont pas partages entre instances (ne scale pas horizontalement)
