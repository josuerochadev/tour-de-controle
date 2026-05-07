# ADR-005 : Pas d'ORM — requetes SQL directes via pg

## Statut
Accepte

## Contexte
Le projet doit interagir avec PostgreSQL. Options : ORM complet (Prisma, TypeORM, Sequelize), query builder (Knex), ou driver SQL direct (pg).

## Decision
Utiliser le driver **pg** directement avec des requetes SQL parametrees dans la couche model.

## Consequences
- **Performance** : pas de couche d'abstraction, requetes optimisees manuellement
- **Transparence** : le SQL est explicite et auditable, pas de magie de generation
- **Simplicite** : pas de schema Prisma a synchroniser, pas de migration ORM separee
- **Securite** : requetes parametrees ($1, $2...) par defaut, protection contre l'injection SQL
- **Cout** : les requetes complexes (jointures, sous-requetes) doivent etre ecrites manuellement
- **Pas de type-safety DB** : les types TypeScript des models sont definis manuellement et peuvent diverger du schema reel
