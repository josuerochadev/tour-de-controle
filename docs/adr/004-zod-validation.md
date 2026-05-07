# ADR-004 : Zod pour la validation des donnees

## Statut
Accepte

## Contexte
L'API recoit des donnees utilisateur qui doivent etre validees avant traitement. Options : validation manuelle (if/regex), joi, class-validator, Zod.

## Decision
Utiliser **Zod** pour la validation cote backend et cote frontend.

## Consequences
- **Type-safe** : Zod infere automatiquement les types TypeScript depuis les schemas, eliminant la duplication type + validation
- **Partage** : les memes patterns de validation peuvent etre utilises frontend et backend (meme si les schemas ne sont pas partages directement aujourd'hui)
- **Leger** : ~50KB, pas de decorateurs ni de metadata reflection
- **Ecosysteme** : compatible avec swagger-jsdoc pour documenter les contraintes, et avec React Hook Form via `@hookform/resolvers`
- **Contrainte** : les schemas Zod sont dupliques entre backend et frontend (pas de package partage dans ce monorepo)
