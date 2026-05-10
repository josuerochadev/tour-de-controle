# Tour de Contrôle — Design System

> **La Tour de Contrôle** : application web de gestion des caisses et du personnel pour la restauration. Ce design system documente la direction visuelle officielle : *Cockpit / Phare opérationnel* — surfaces papier crème, encre profonde, accent rouge signal, typographie monumentale.

---

## Sommaire

- [Philosophie](#philosophie)
- [Fichiers du système](#fichiers-du-système)
- [Intégration rapide](#intégration-rapide)
- [Fondamentaux de contenu](#fondamentaux-de-contenu)
- [Fondations visuelles](#fondations-visuelles)
  - [Palette](#palette)
  - [Typographie](#typographie)
  - [Forme et rayons](#forme-et-rayons)
  - [Surfaces et cartes](#surfaces-et-cartes)
  - [Ombres](#ombres)
  - [Espacement](#espacement)
  - [Motion](#motion)
- [Iconographie](#iconographie)
- [Caveats](#caveats)

---

## Philosophie

> *« Garde le cap. »*

La Tour de Contrôle n'est pas un dashboard. C'est une **vigie** — un poste d'observation au-dessus du service. Le système visuel emprunte au registre de la marine et de l'almanach : papier crème, encre profonde, faisceau rouge, beaucoup d'air.

Les chiffres sont **monumentaux** (jusqu'à 112px en JetBrains Mono) parce qu'un gérant doit les lire à 3 mètres de la caisse. Les écrans portent des noms : la Vigie (tableau de bord), la Caisse, le Flux (transactions), l'Équipage (personnel).

---

## Fichiers du système

| Fichier | Rôle |
|---------|------|
| `README.md` | Ce document — spécification complète |
| `SKILL.md` | Manifeste condensé (prompt système pour Claude Code) |
| `tokens.css` | Source de vérité — toutes les variables CSS |
| `MIGRATION.md` | Guide pas-à-pas pour migrer V1 (cyan) → V2 (cockpit) |
| `logo-mark.svg` | Marque autonome — phare géométrique |
| `preview/` | Cartes preview pour l'onglet Design System |
| `ui_kit/` | Prototype cliquable hi-fi (Login → Vigie → Caisse → Flux → Équipage) |

---

## Intégration rapide

### 1. Importer les tokens

```css
/* En tête de votre CSS global ou main.tsx */
@import "../../design-system/tokens.css";
```

Toutes les valeurs sont en variables CSS : `--paper`, `--ink`, `--signal`, `--font-display`, `--r-lg`, `--s-6`…

### 2. Installer les polices (self-host)

```bash
cd frontend
npm i @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

```ts
// frontend/src/main.tsx
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
```

> Sans self-host, les polices sont chargées via CDN (rsms.me + Google Fonts) grâce au `@import` dans `tokens.css`.

### 3. Étendre Tailwind (optionnel)

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      paper:  "#fef3e2",
      "paper-soft": "#fef9ee",
      ink:    "#1c1917",
      signal: "#dc2626",
      beacon: "#f59e0b",
    },
    fontFamily: {
      display: ["JetBrains Mono Variable", "monospace"],
      ui:      ["Inter Variable", "sans-serif"],
    },
  }
}
```

### 4. Partir du prototype de référence

Le fichier `ui_kit/index.html` (ou `ui_kit/Pages.jsx`) contient les cinq écrans clés déjà implémentés. Repartir d'une page existante plutôt que de zéro.

Pour une migration complète depuis l'ancienne identité cyan, suivre **[MIGRATION.md](./MIGRATION.md)**.

---

## Fondamentaux de contenu

**Langue** : 100% français. Le **vous** formel partout.

**Ton** : éditorial, posé, jamais marketing. Les écrans s'ouvrent par une **phrase courte en prose** plutôt que par un titre administratif :
- *« Le service est ouvert depuis 4h 12min. Vous avez encaissé 1 247,50 €, soit 69% de l'objectif. »*
- *« 3 en service maintenant. Le prochain quart démarre à 18h00. »*

**Casse** : Sentence case partout. Les eyebrows sont en `UPPERCASE TRACKING 0.16EM` à 11px — ce sont des étiquettes de section, pas des cris.

**Devise** : `1 247,50 €` (espace insécable avant €, virgule décimale). Jamais `EUR`.

**Emojis** : aucun. Le rouge signal et le pulse vert font le travail.

### Glossaire officiel

| Avant (V1) | Maintenant (V2) |
|------------|-----------------|
| Tableau de bord | **La Vigie** |
| Caisse | **La Caisse** *(inchangé)* |
| Transactions | **Le Flux** |
| Personnel | **L'Équipage** |
| Se connecter | **Prendre le quart** |
| Se déconnecter | **Quitter le quart** |
| Statut « Ouverte » | **Caisse ouverte · 4h 12min** |
| Alerte | **Alerte du phare** |

---

## Fondations visuelles

### Palette

Trois familles, point.

**Paper** — surfaces chaudes, jamais de blanc pur

| Token | Valeur | Usage |
|-------|--------|-------|
| `--paper` | `#fef3e2` | Fond principal, page |
| `--paper-soft` | `#fef9ee` | Cartes sur paper |
| `--paper-2` | `#f7e9d3` | Nav rail, hover |
| `--paper-3` | `#efe0c4` | Bordures, dividers |

**Ink** — neutres profonds

| Token | Valeur | Usage |
|-------|--------|-------|
| `--ink` | `#1c1917` | Texte primaire, panneaux dramatiques |
| `--ink-2` | `#3f3a36` | Dividers sur ink |
| `--ink-3` | `#6b645e` | Texte body |
| `--ink-4` | `#9a928a` | Eyebrows, muted |

**Signal & Beacon** — rare, jamais décoratif

| Token | Valeur | Usage |
|-------|--------|-------|
| `--signal` | `#dc2626` | Faisceau du phare. KPI en évidence, alerte, focus ring. **1–2 fois par écran max.** |
| `--beacon` | `#f59e0b` | Accent ambre. Annotations secondaires. |
| `--ok` | `#059669` | Caisse ouverte, en service |
| `--danger` | `#dc2626` | Erreur, écart caisse |

---

### Typographie

Deux polices, chacune dans son rôle — jamais interchangées.

| Police | Rôle | Weight par défaut |
|--------|------|-------------------|
| **Inter** | Tout le texte UI (labels, body, navigation) | 500 — jamais 400 |
| **JetBrains Mono** | Tous les nombres, KPI, h1 de page | 500 |

**Règles d'or :**
- Les KPI et montants sont **toujours** en JetBrains Mono avec `font-variant-numeric: tabular-nums`.
- Inter est en **weight 500** minimum. Labels et montants en weight 600.
- Les eyebrows sont Inter 11px, `text-transform: uppercase`, `letter-spacing: 0.16em`, couleur `--ink-4`.
- Le tracking sur les display ≥ 56px est négatif (`-0.04em` à `-0.06em`).
- Le fond page a un `font-size` base de 16px. Jamais en dessous pour du texte fonctionnel.

L'échelle complète est définie dans `tokens.css`.

---

### Forme et rayons

Coins doux partout — rien sous 14px sauf badges inline.

| Token | Valeur | Usage |
|-------|--------|-------|
| `--r-sm` | 14px | Inputs, boutons compacts |
| `--r-md` | 16px | Boutons CTA |
| `--r-lg` | 20px | Cartes secondaires |
| `--r-xl` | 24px | Cartes secondaires |
| `--r-2xl` | 28px | Cartes principales, panneaux ink |
| `--r-pill` | 999px | Nav, pills, status badges, avatars |

---

### Surfaces et cartes

Trois types de cartes — pas plus.

**1. Carte paper** (majorité des cartes)
```css
background: var(--paper-soft);
border: 1px solid var(--paper-3);
border-radius: var(--r-xl); /* 24–28px */
```

**2. Carte ink dramatique** (max 2 par écran)
```css
background: var(--ink);
color: var(--paper);
border-radius: var(--r-2xl); /* 28px */
```
Réservée aux KPI hero, à l'alerte du phare, au panneau caisse principal.

**3. Carte de citation**
Italique sur fond ink, avec un faisceau ambre/rouge en arrière-plan illustratif.

---

### Ombres

Quasi inexistantes.

| Token | Usage |
|-------|-------|
| `--shadow-card` | Ombre standard des cartes |
| `--shadow-pop` | Popovers, menus flottants |

Pas d'ombres colorées.

---

### Espacement

Échelle 4-pt. Tout est dans `tokens.css` (`--s-1` à `--s-16`).

- Sections séparées par `--s-12` (48px)
- Grilles internes par `--s-6` (24px)
- Padding cartes premium : `--s-9` (36px)

**Beaucoup d'air.** Les pages ont un `max-width: 1200px`. Le hero d'une page (eyebrow + h1 de 72px) occupe environ 30% de la première frame.

---

### Motion

Discret et fonctionnel — aucune animation décorative.

| Animation | Usage | Paramètres |
|-----------|-------|------------|
| `tdc-pulse` | Points de statut « en direct » | 1.5s ease-in-out infinite |
| `tdc-rotate` | Faisceau du phare (login) | 24s linear infinite |
| Hover | Transition sur background uniquement | `--d` (200ms ease-out) |

Aucun bounce, aucun scale au hover.

---

## Iconographie

Approche minimaliste. Les icônes accompagnent un libellé — elles ne portent jamais le sens seules.

- **Pas d'icônes dans les KPI.** Le chiffre suffit.
- **Pas d'icônes décoratives.** Si une icône n'est pas cliquable ou ne dénote pas un état, elle n'a pas sa place.
- **Avatars textuels** — initiales en cercle ink avec texte paper. Jamais de photos.

Quand une icône est nécessaire (bouton close, action), utiliser **Lucide** en stroke 1.5px, taille 16–20px. Substituable par Heroicons outline.

Le **logo-marque** (`logo-mark.svg`) est la seule illustration géométrique du système : phare stylisé avec tour ink, bande signal, lanterne et point lumineux rouge, faisceau ambre.

| Contexte | Taille |
|----------|--------|
| Chrome (navbar) | 36px |
| États vides | 64px |
| Login | 120px |

---

## Caveats

- **Inter & JetBrains Mono via CDN** (rsms.me + Google Fonts). Pour self-host, déposer les fichiers dans `fonts/` et remplacer les `@import` dans `tokens.css`.
- **L'identité Tailwind-cyan (V1) est dépréciée.** Aucun écran de production ne devrait plus utiliser `cyan-600`. Voir [MIGRATION.md](./MIGRATION.md) pour la feuille de route.
- **Renommages de surface** (Vigie, Flux, Équipage) — à valider avec l'équipe produit avant déploiement. Réversibles vers « Tableau de bord / Transactions / Personnel » sans casser le système visuel.
- **Desktop-first.** Conçu pour 1200px+. Mobile breakpoint à définir (empiler les colonnes, réduire les display-xl à display-md).
