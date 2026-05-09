# Audit UX & Produit — Tour de Contrôle

**Date :** 9 mai 2026
**Scope :** Frontend — composants, pages, design system, accessibilité
**Volume :** ~1200 lignes de code source frontend (hors node_modules)

---

## Table des matières

1. [Critères évalués](#critères-évalués)
2. [Critiques — A corriger maintenant](#-critique--a-corriger-maintenant)
3. [Important — A planifier](#-important--a-planifier)
4. [Mineur — Nice to have](#-mineur--nice-to-have)
5. [Note globale](#note-globale)
6. [Plan de remédiation](#plan-de-remédiation)

---

## Critères évalués

- UX cohérente et simple (pas de friction inutile)
- Cohérence visuelle (design system, tokens, styleguide)
- Accessibilité testée (contrastes, navigation clavier, ARIA, WCAG 2.1 AA)
- Focus management (modales, menus, formulaires)
- Support reduced-motion (prefers-reduced-motion respecté)
- Textes alternatifs des images (pertinents, pas génériques)
- Feedback utilisateur (messages d'erreur, loaders, confirmations)
- Formulaires : validation temps réel, messages clairs, UX mobile
- Responsive design : cohérence mobile / tablette / desktop
- Navigation intuitive et retour facile
- Animations : valeur ajoutée ou distraction ?
- Call-to-action : visibles, clairs, bien positionnés
- Structure sémantique HTML (h1-h6, landmarks)
- Données structurées (JSON-LD, schema.org)
- URLs propres et canoniques

---

## CRITIQUE — A corriger maintenant

### C-01. Script React DevTools embarqué dans le build de production

| Fichier | Ligne | Problème |
|---------|-------|---------|
| `frontend/dist/index.html` | 5 | `<script src="http://localhost:8097">` |

Appel HTTP externe en production, erreur réseau systématique au chargement. Risque de sécurité si le port est détourné (injection de script tiers). Ce fichier dist ne devrait pas être versionné avec cette dépendance de dev.

---

### C-02. Aucun focus trap dans `dialog.tsx`

| Fichier | Lignes | Problème |
|---------|--------|---------|
| `frontend/src/components/dialog.tsx` | 44–69 | Modale sans capture de focus |

La modale de confirmation s'ouvre sans déplacer le focus dedans ni le capturer. L'utilisateur clavier peut tabber librement vers le contenu masqué sous l'overlay. Viole WCAG 2.1 SC 2.1.2 et le pattern ARIA Dialog. Pas de retour du focus sur le déclencheur à la fermeture non plus.

---

### C-03. Contraste insuffisant sur `text-ink-4` — ratio 2.7:1 (WCAG AA exige 4.5:1)

| Token | Valeur hex | Fond concerné | Ratio calculé | Seuil WCAG AA |
|-------|-----------|---------------|---------------|---------------|
| `ink-4` | `#9a928a` | `paper` `#fef3e2` | ~2.7:1 | 4.5:1 |

Token utilisé massivement pour labels, sous-titres, métadonnées, dates dans tous les composants (`header.tsx`, `users.tsx`, `dashboard.tsx`, `cashier.tsx`, `filters.tsx`, `info_field.tsx`, etc.). Impacte directement les utilisateurs avec déficience visuelle.

---

### C-04. Données tabulaires sans sémantique `<table>`

| Fichier | Lignes | Problème |
|---------|--------|---------|
| `frontend/src/pages/cashier.tsx` | 184–206 | Liste de transactions en `<div>` flex |
| `frontend/src/pages/transactions.tsx` | 70–103 | Idem |

Les colonnes "Heure / Moyen / Montant" sont des divs avec largeurs fixes arbitraires (`w-20`, `w-36`). Screen readers ne peuvent pas annoncer les en-têtes de colonnes, pas de navigation cellule-par-cellule, débordement horizontal garanti sur mobile étroit.

---

### C-05. `prefers-reduced-motion` absent — 3 animations non protégées

| Fichier | Lignes | Animation |
|---------|--------|-----------|
| `frontend/tailwind.config.js` | 38–54 | `tdc-rotate`, `tdc-pulse`, `slide-in` |
| `frontend/src/index.css` | 13–26 | `slide-in` (doublon CSS) |
| `frontend/src/pages/login.tsx` | 147–157 | Utilisation de `tdc-rotate` |
| `frontend/src/pages/dashboard.tsx` | 142 | Utilisation de `tdc-pulse` |
| `frontend/src/pages/cashier.tsx` | 69 | Utilisation de `tdc-pulse` |

Aucune déclaration `@media (prefers-reduced-motion: reduce)` dans le CSS ni dans Tailwind. La rotation continue des beams sur la page login (`tdc-rotate`, 24s infini) est à risque vestibulaire pour les utilisateurs concernés.

---

## IMPORTANT — A planifier

### I-01. SVG du logo sans `aria-hidden` ni `<title>` — 5 occurrences

| Fichier | Lignes |
|---------|--------|
| `frontend/src/pages/login.tsx` | 7–18, 61–71 |
| `frontend/src/pages/forgot_password.tsx` | 50–59 |
| `frontend/src/pages/reset_password.tsx` | 70–80 |
| `frontend/src/pages/contact.tsx` | 62–72 |
| `frontend/src/components/header.tsx` | 17–29 |

SVG décoratifs lus par les screen readers sans description utile. Doivent recevoir `aria-hidden="true"` (décoratifs) ou un `<title>` + `role="img"` (informatifs).

---

### I-02. Nav pills sans `aria-current="page"`

| Fichier | Lignes |
|---------|--------|
| `frontend/src/components/header.tsx` | 54–68 |

Le bouton actif est visuellement distinct mais n'a pas `aria-current="page"`. Les lecteurs d'écran ne peuvent pas identifier la page courante dans la navigation.

---

### I-03. Boutons de navigation au lieu de liens `<a>`

| Fichier | Lignes |
|---------|--------|
| `frontend/src/components/header.tsx` | 57–68, 106–117 |

`<button onClick={() => navigate(item.id)}>` perd les comportements natifs : clic-milieu pour nouvelle tab, menu contextuel "ouvrir dans un nouvel onglet", historique browser, indexation. Remplacer par `<Link>` de react-router-dom.

---

### I-04. Messages d'erreur inline sans `role="alert"`

| Fichier | Ligne | Contenu |
|---------|-------|---------|
| `frontend/src/pages/login.tsx` | 120 | `{error && <div>...` |
| `frontend/src/pages/forgot_password.tsx` | 83–87 | `{error && <div>...` |
| `frontend/src/pages/reset_password.tsx` | 116–118 | `{error && <div>...` |

Les erreurs apparaissent dans le DOM mais ne sont pas annoncées automatiquement par les screen readers. `role="alert"` ou `aria-live="assertive"` requis.

---

### I-05. Input "Fond de caisse" sans label associé

| Fichier | Lignes |
|---------|--------|
| `frontend/src/pages/cashier.tsx` | 115–121 |

`<label>` présent sans `htmlFor`, `<input>` sans `id` — le label n'est pas programmatiquement lié au champ. Click sur le label ne met pas le focus sur l'input. Viole WCAG 2.1 SC 1.3.1.

---

### I-06. Input de recherche sans label accessible

| Fichier | Lignes |
|---------|--------|
| `frontend/src/pages/users.tsx` | 81–87 |

Input avec placeholder uniquement, sans `<label>` ni `aria-label`. Le placeholder n'est pas un substitut de label (disparaît à la saisie, non annoncé systématiquement comme label).

---

### I-07. Grands chiffres non responsives sur mobile

| Fichier | Lignes | Valeur problématique |
|---------|--------|---------------------|
| `frontend/src/pages/cashier.tsx` | 87–91 | `text-[104px]`, `text-[44px]` |
| `frontend/src/pages/dashboard.tsx` | 68–72 | `text-[88px]` |
| `frontend/src/pages/cashier.tsx` | 65–66 | `text-[56px]` (h1) |
| `frontend/src/pages/dashboard.tsx` | 51–52 | `text-[56px]` (h1) |
| `frontend/src/pages/transactions.tsx` | 44 | `text-[56px]` (h1) |
| `frontend/src/pages/users.tsx` | 76 | `text-[56px]` (h1) |

Aucun variant responsive (`sm:`, `md:`). Sur écran < 400px, `text-[104px]` déborde ou force le scroll horizontal sur la page caisse.

---

### I-08. Clôture de caisse sans confirmation

| Fichier | Lignes |
|---------|--------|
| `frontend/src/pages/cashier.tsx` | 37–44 |

"Cloturer la caisse" déclenche l'opération directement au clic, sans dialog de confirmation — contrairement à la suppression d'utilisateur qui utilise `useDialog`. Action potentiellement irréversible sans protection.

---

### I-09. `contact.tsx` : `<h2>` pour le titre principal de la page

| Fichier | Ligne |
|---------|-------|
| `frontend/src/pages/contact.tsx` | 73 |

`<h2>` utilisé comme seul et premier titre de la page. Doit être `<h1>`. Viole la hiérarchie sémantique HTML.

---

### I-10. `profile_modal.tsx` : aucune sémantique de dialog ni gestion du focus

| Fichier | Lignes |
|---------|--------|
| `frontend/src/components/profile_modal.tsx` | 13–37 |

Positionnement `absolute` sans `role="dialog"`, sans `aria-modal`, sans focus trap, sans fermeture par `Escape`, sans fermeture au clic en dehors. Invisible pour les technologies d'assistance.

---

### I-11. `dialog.tsx` : pas de fermeture par `Escape`

| Fichier | Lignes |
|---------|--------|
| `frontend/src/components/dialog.tsx` | 44–69 |

Le pattern ARIA Dialog exige la fermeture via `Escape`. Actuellement seuls les boutons du dialog ferment la modale.

---

### I-12. Route catch-all `*` redirige vers `Login` au lieu d'une 404

| Fichier | Ligne |
|---------|-------|
| `frontend/src/App.tsx` | 50 |

Un utilisateur connecté qui saisit une URL invalide est redirigé silencieusement vers Login, ce qui donne l'impression d'être déconnecté.

---

### I-13. `dist/index.html` : `lang="en"` sur une app entièrement francophone

| Fichier | Ligne |
|---------|-------|
| `frontend/dist/index.html` | 2 |

Le build contient `<html lang="en">` alors que le source a `lang="fr"`. Les screen readers choisissent la voix TTS sur la base de cet attribut — impact direct sur les utilisateurs AT.

---

### I-14. Deux `<nav>` sans `aria-label` distinct

| Fichier | Lignes |
|---------|--------|
| `frontend/src/components/header.tsx` | 53, 102 |

Nav desktop et nav mobile sans `aria-label`. Quand plusieurs `<nav>` coexistent sur la page, chacun doit être nommé pour que les lecteurs d'écran puissent les distinguer.

---

## MINEUR — Nice to have

### M-01. Tokens `signal` et `danger` identiques dans le design system

| Fichier | Lignes | Valeurs |
|---------|--------|---------|
| `frontend/tailwind.config.js` | 16, 20 | `signal: "#dc2626"` et `danger: "#dc2626"` |

Même couleur hex sous deux noms. Crée de l'ambiguité sémantique sur l'usage attendu de chacun.

---

### M-02. Logo SVG dupliqué dans 5+ fichiers sans composant partagé

| Fichiers |
|---------|
| `login.tsx:6–18,61–71`, `forgot_password.tsx:50–59`, `reset_password.tsx:70–80`, `contact.tsx:62–72`, `header.tsx:17–29` |

Même bloc SVG (10 lignes) copié-collé. Toute modification du logo nécessitera 5 mises à jour synchronisées.

---

### M-03. `inputClass` / `labelClass` dupliqués entre `add_user` et `edit_user`

| Fichier | Lignes |
|---------|--------|
| `frontend/src/pages/add_user.tsx` | 10–11 |
| `frontend/src/pages/edit_user.tsx` | 9–10 |

Chaînes de classes CSS identiques définies deux fois.

---

### M-04. Validation uniquement on-submit, pas en temps réel

| Fichiers |
|---------|
| `add_user.tsx`, `edit_user.tsx`, `contact.tsx` |

Les erreurs Zod n'apparaissent qu'à la soumission. Pas de validation onChange. Une erreur d'un champ corrigé persiste jusqu'au prochain submit.

---

### M-05. Absence de lien "Skip to main content"

Aucun lien d'évitement en début de page. Les utilisateurs clavier doivent traverser toute la navigation à chaque chargement avant d'atteindre le contenu principal.

---

### M-06. Termes de navigation thématisés sans équivalent descriptif

| Fichier | Ligne |
|---------|-------|
| `frontend/src/components/header.tsx` | 10–15 |

"Vigie", "Flux", "Equipage" — la métaphore est cohérente mais un utilisateur nouvellement onboardé ne sait pas a priori que "Vigie" = tableau de bord ou que "Flux" = transactions. Aucun tooltip ni sous-texte d'orientation.

---

### M-07. Route `/` et `/login` sans redirection canonique

| Fichier | Lignes |
|---------|--------|
| `frontend/src/App.tsx` | 36–37 |

Les deux routes rendent le même composant `Login` sans `<Navigate from="/" to="/login" replace />`.

---

### M-08. `edit_user.tsx` : champs obligatoires sans astérisque

| Fichier | Lignes |
|---------|--------|
| `frontend/src/pages/edit_user.tsx` | 83–113 |

`add_user.tsx` marque les champs requis avec `*`. `edit_user.tsx` utilise les mêmes champs avec `required` mais sans indicateur visuel — incohérence entre les deux formulaires identiques.

---

## Note globale

### Avant audit : 4.5 / 10

| Critère | Note |
|---------|------|
| Design system / cohérence visuelle | 8/10 |
| Responsive design | 5/10 |
| Accessibilité (contrastes, ARIA) | 3/10 |
| Focus management | 2/10 |
| Reduced-motion | 0/10 |
| Feedback utilisateur | 6/10 |
| Sémantique HTML | 5/10 |
| Formulaires | 6/10 |
| Navigation | 6/10 |
| Animations | 5/10 |

### Résumé

Le design system est solide et cohérent (tokens sémantiques, typographie, palette). Des éléments d'accessibilité de base sont présents (aria-labels sur les boutons d'action, role="dialog" partiel, role="alert" sur les toasts). Cependant l'accessibilité fonctionnelle est incomplète : contraste `ink-4` échoue WCAG AA sur toute l'interface, aucune animation ne respecte `prefers-reduced-motion`, les modales n'ont pas de focus trap, et les données tabulaires critiques ne sont pas dans des éléments `<table>`. Le responsive mobile présente des risques concrets de débordement sur les montants financiers.

---

## Plan de remédiation

### Phase 1 — Critiques

| ID | Action | Statut |
|----|--------|--------|
| C-01 | Supprimer le script `localhost:8097` de `dist/index.html` | FAIT |
| C-02 | Ajouter focus trap + retour focus dans `dialog.tsx` | FAIT |
| C-03 | Corriger le contraste `ink-4` (passer de #9a928a à #706860, ratio 4.55:1) | FAIT |
| C-04 | Remplacer les `<div>` flex par `<table>` dans `cashier.tsx` et `transactions.tsx` | FAIT |
| C-05 | Ajouter `@media (prefers-reduced-motion: reduce)` pour les 3 animations | FAIT |

### Phase 2 — Important

| ID | Action | Statut |
|----|--------|--------|
| I-01 | Ajouter `aria-hidden="true"` sur tous les SVG décoratifs | FAIT |
| I-02 | Ajouter `aria-current="page"` sur les nav pills actifs | FAIT |
| I-03 | Remplacer `<button onClick navigate>` par `<Link>` dans `header.tsx` | FAIT |
| I-04 | Ajouter `role="alert"` sur les erreurs inline (`login`, `forgot`, `reset`) | FAIT |
| I-05 | Lier le label "Fond de caisse" à son input avec `htmlFor` / `id` | FAIT |
| I-06 | Ajouter `aria-label` sur l'input de recherche dans `users.tsx` | FAIT |
| I-07 | Ajouter variants responsives sur les grands textes (`clamp` ou `sm:` / `md:`) | FAIT |
| I-08 | Ajouter un dialog de confirmation avant clôture de caisse | FAIT |
| I-09 | Passer `<h2>` en `<h1>` dans `contact.tsx` | FAIT |
| I-10 | Ajouter `role="dialog"`, `aria-modal`, `Escape`, click-outside dans `profile_modal.tsx` | FAIT |
| I-11 | Ajouter fermeture par `Escape` dans `dialog.tsx` | FAIT |
| I-12 | Créer une page 404 et brancher le catch-all `*` dessus | FAIT |
| I-13 | Corriger `lang="en"` → `lang="fr"` dans `dist/index.html` | FAIT |
| I-14 | Ajouter `aria-label` sur les deux `<nav>` dans `header.tsx` | FAIT |

### Phase 3 — Mineurs

| ID | Action | Statut |
|----|--------|--------|
| M-01 | Fusionner `signal` et `danger` en un seul token dans `tailwind.config.js` | A faire |
| M-02 | Extraire le SVG logo en composant partagé `<LogoIcon>` | A faire |
| M-03 | Extraire `inputClass` / `labelClass` en fichier de constantes partagé | A faire |
| M-04 | Ajouter validation onChange sur les formulaires principaux | A faire |
| M-05 | Ajouter un lien "Aller au contenu" (skip nav) en début de page | A faire |
| M-06 | Ajouter tooltips ou sous-textes sur les items de navigation thématisés | A faire |
| M-07 | Ajouter `<Navigate from="/" to="/login" replace />` canonique | A faire |
| M-08 | Aligner les astérisques `*` obligatoires entre `add_user` et `edit_user` | A faire |
