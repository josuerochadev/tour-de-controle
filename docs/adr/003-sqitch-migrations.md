# ADR-003 : Sqitch pour les migrations SQL

## Statut
Accepte

## Contexte
Le projet utilise PostgreSQL avec des requetes SQL directes (via `pg`). Il faut un outil de migration pour gerer le schema. Options : ORM avec migrations integrees (Prisma, TypeORM), ou outil de migration SQL pur (Sqitch, Flyway, dbmate).

## Decision
Utiliser **Sqitch** comme outil de migration SQL.

## Consequences
- **Controle total** : les migrations sont du SQL pur, pas de couche d'abstraction ORM
- **Coherence** : s'aligne avec le choix de ne pas utiliser d'ORM (requetes SQL via `pg` dans les models)
- **Revert natif** : chaque migration Sqitch a un script `deploy`, `revert` et `verify`
- **Prerequis** : Sqitch doit etre installe separement (Perl), ce qui ajoute une dependance systeme pour le setup dev
- **Pas de generation** : pas de generation automatique de migrations a partir du code TypeScript (contrairement a Prisma)
