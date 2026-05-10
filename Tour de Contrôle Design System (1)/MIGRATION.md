# MIGRATION.md — Tour de Contrôle V1 (cyan) → V2 (cockpit)

> Feuille de route à donner à Claude Code (ou à suivre manuellement) pour migrer le frontend existant vers la nouvelle direction visuelle. Chaque écran est isolé : tu peux migrer dans l'ordre, tester, commit, recommencer.

---

## 0. Pré-requis (une seule fois)

1. **Installer les polices**
   ```bash
   cd frontend
   npm i @fontsource-variable/inter @fontsource-variable/jetbrains-mono
   ```
   Puis dans `frontend/src/main.tsx` (avant tout autre import CSS) :
   ```ts
   import "@fontsource-variable/inter";
   import "@fontsource-variable/jetbrains-mono";
   import "../../design-system/tokens.css";  // adapte le chemin
   import "./index.css";
   ```

2. **Étendre `tailwind.config.js`** pour exposer les tokens en classes utilitaires :
   ```js
   theme: {
     extend: {
       colors: {
         paper:  "#fef3e2",
         ink:    "#1c1917",
         signal: "#dc2626",
         beacon: "#f59e0b",
         sand:   "#efe0c4",
         mist:   "#9a928a",
       },
       fontFamily: {
         sans:    ["'Inter Variable'", "ui-sans-serif", "system-ui"],
         display: ["'JetBrains Mono Variable'", "ui-monospace", "monospace"],
         mono:    ["'JetBrains Mono Variable'", "ui-monospace", "monospace"],
       },
       borderRadius: {
         "2xl": "1.5rem",   // 24px
         "3xl": "1.75rem",  // 28px — cards
       },
     },
   },
   ```

3. **Activer `tabular-nums` partout** dans `frontend/src/index.css` :
   ```css
   body {
     font-variant-numeric: tabular-nums;
     font-feature-settings: 'cv11', 'ss01', 'ss03';
   }
   ```

4. **Supprimer** `frontend/src/styles/globals.css` (le fichier shadcn cyan/dark) ou neutraliser ses `:root` variables.

---

## 1. Table de remplacement Tailwind (à faire partout)

Cherche-remplace global avec Claude Code (`grep` puis edit) :

| V1 (cyan) | V2 (cockpit) |
|---|---|
| `bg-cyan-600` | `bg-ink` |
| `bg-cyan-500` | `bg-ink` |
| `bg-cyan-700` (hover) | `bg-ink` (no hover change) ou `hover:bg-stone-800` |
| `text-cyan-600` | `text-signal` (pour CTA) ou `text-ink` (pour navigation) |
| `text-cyan-700` | `text-signal` |
| `border-cyan-600` | `border-sand` |
| `focus:ring-cyan-500` | `focus:ring-signal` |
| `bg-gray-50` (page bg) | `bg-paper` |
| `bg-gray-100` (page bg) | `bg-paper` |
| `bg-white` (cards) | `bg-[#fef9ee]` + `border border-sand` |
| `text-gray-900` | `text-ink` |
| `text-gray-700` | `text-stone-700` |
| `text-gray-500` | `text-mist` |
| `rounded-md` (cards) | `rounded-3xl` |
| `rounded-md` (buttons/inputs) | `rounded-2xl` |
| `rounded-lg` | `rounded-3xl` |
| `shadow` `shadow-md` `shadow-lg` | **enlever** — la V2 n'utilise pas d'ombres, juste des bordures `border-sand` |

**Composants à supprimer** : la prop `bg-cyan-600` du header/footer existant, les anciens icônes `react-icons/fa` chrome (remplacés par lucide).

---

## 2. Ordre de migration (écran par écran)

### Étape 1 — Layout & shell (1 commit)
- `frontend/src/components/header.tsx` → réécris d'après `ui_kit/Pages.jsx` → `Shell` (Wordmark à gauche, nav-pills au centre, avatar à droite, `bg-paper`, `border-b border-sand`)
- `frontend/src/components/footer.tsx` → **supprimer**, remplacé par les nav-pills du header sur desktop
- `frontend/src/layouts/authentication_layout.tsx` → wrappe avec `<div className="min-h-screen bg-paper">`

### Étape 2 — Login (1 commit)
- `frontend/src/pages/login.tsx` → split deux colonnes (form gauche, beacon art droite)
- Référence : `ui_kit/Pages.jsx` → `LoginPage` + `BeaconArt`
- Remplace logo PNG par `assets/logo-mark.svg`
- Bouton primaire : `bg-ink text-paper rounded-2xl` (pas plus de cyan)

### Étape 3 — Dashboard / "La vigie" (1 commit)
- `frontend/src/pages/dashboard.tsx` → `VigiePage` du UI kit
- Renomme le titre H1 en **"La vigie"** (mono caps 56px)
- Tower : `bg-ink` + numéro `font-display text-[88px]` + horizon de progrès
- Pulse + sparkline + "Alerte du phare" (carte ink)

### Étape 4 — Cashier / "La caisse" (1 commit)
- `frontend/src/pages/cashier.tsx` → `CaissePage`
- Garde la logique métier (`useCashRegister`, `openRegister`, `closeRegister`)
- Réécris le rendu : tower théorique en `bg-ink`, récapitulatif en `bg-[#fef9ee]`
- Boutons Ouvrir/Clôturer en mono caps

### Étape 5 — Transactions / "Le flux" (1 commit)
- `frontend/src/pages/transactions.tsx` → `FluxPage`
- Filtres → pills (`pillBtn`)
- KPI cards 3-up
- Table → liste avec heure mono, méthode, ref `#01001`, montant mono

### Étape 6 — Users / "L'équipage" (1 commit)
- `frontend/src/pages/users.tsx` → `EquipagePage` (grille de cards au lieu d'une table)
- Bandeau "De quart maintenant" en `bg-ink`
- Conserve les actions (voir, modifier, supprimer) — les ajoute dans la card en boutons icônes lucide

### Étape 7 — Composants partagés
- `dialog.tsx` : modal en `bg-paper rounded-3xl`, scrim `bg-ink/60`
- `toast.tsx` : succès = `bg-ink text-paper`, erreur = `bg-signal text-paper`, suppression du cyan info
- `filters.tsx` : pills mono caps

### Étape 8 — Vocabulaire (chercher-remplacer cosmétique, **vérifie avec le PO d'abord**)
- "Tableau de bord" → "La vigie"
- "Personnel" / "Liste des utilisateurs" → "L'équipage"
- "Transactions" → "Le flux"
- "Connexion" / "Se connecter" → "Prendre le quart"
- "Déconnexion" → "Quitter le quart"

---

## 3. Prompt à donner à Claude Code

> Tu es chargé de migrer le frontend de Tour de Contrôle vers la direction visuelle V2 « cockpit ».
>
> **Source de vérité** : `design-system/SKILL.md` (do/don't), `design-system/tokens.css` (variables), `design-system/ui_kit/Pages.jsx` (composants de référence à recopier), `design-system/MIGRATION.md` (ce fichier).
>
> **Règle absolue** : aucune nouvelle classe `cyan-*` ou `bg-cyan-*` ne doit apparaître dans `frontend/src`. Si tu en vois une dans le code existant, remplace-la selon la table de la section 1. Aucun serif, aucune ombre `shadow-*` (la V2 utilise des bordures `border-sand`).
>
> **Plan** : suis l'ordre 1 → 8 ci-dessus. Après chaque étape, lance `npm run dev` mentalement (ou demande-moi de tester) et fais un commit séparé avec un message du genre `feat(v2): migrate <écran>`.
>
> **Démarre par l'étape 0** (installation Inter + JetBrains Mono + extension Tailwind), puis l'étape 1 (shell). N'avance pas à l'étape suivante avant que je valide.

---

## 4. Checklist post-migration

- [ ] Plus aucune occurrence de `cyan-` dans `frontend/src` (`grep -r "cyan-" frontend/src`)
- [ ] Plus aucune occurrence de `shadow-` (sauf `shadow-none` si besoin)
- [ ] `tabular-nums` actif partout (vérifier que les colonnes de montants s'alignent)
- [ ] Les contrastes WCAG AA passent (signal `#dc2626` sur `paper #fef3e2` = OK ratio 5.4:1 ; ink sur paper = 14:1)
- [ ] Les boutons primaires sont en mono caps
- [ ] Le wordmark est en `whiteSpace: nowrap` + 14px (pour éviter le wrap à 2 lignes)
- [ ] `assets/logo-mark.svg` est référencé partout — plus de `/LogoLaTourDeControle.png` (ancien logo)

---

## 5. Caveats

- **Tailwind v3** : la config étendue ci-dessus est compatible v3.x (utilisée par le repo). Pour v4 il faudra passer en `@theme` CSS-first.
- **Vocabulaire poétique** : "La vigie / Le flux / L'équipage / Prendre le quart" sont **audacieux**. Valide avec le produit avant de pousser en prod. Sinon, garde "Tableau de bord / Transactions / Personnel / Connexion" et applique uniquement la migration visuelle.
- **Mode dark** : pas encore défini en V2. La direction « cockpit » se prête bien à un dark mode (le tower `bg-ink` est déjà dark) mais il faudra une passe dédiée.
- **Mobile** : les composants de référence du UI kit sont desktop-first. Pour le responsive, garde les breakpoints `md:` du code existant et collapse les grilles `grid-cols-2` en `grid-cols-1` sur mobile.
