# Human-centred design signals in KIRA (code-backed)

This document maps **user-centred / human-centred design** ideas (aligned with themes from **ISO 9241-210**: understanding users and context, involving users in evaluation where possible, iteration, whole user experience, multidisciplinary implementation in software) to **concrete implementation** in the KIRA repo. It complements **`Todo.md`** at the repository root, which lists gaps and backlog items.

---

## 1. Executive summary

KIRA encodes human-centred intent in **design tokens**, **scoped shell styling**, **transparent copy**, **priority-aware scheduling UX**, **limits and focus guardrails**, and **accessible navigation primitives** (landmarks, labels, focus rings). Implementation leans on **React Aria Components**, a **central string catalog**, and **native `<dialog>`** where documented as necessary for behaviour. Formal user research artifacts live partly in **`docs/student-design-research.md`**; automated UX/accessibility testing is not yet present in the toolchain.

---

## 2. Visual and semantic design system

### 2.1 Global brand and semantics (`src/styles/theme.css`)

- **Brand ramp (50–950)** — Teal / cyan scale, for example:
  - `--color-brand-50: rgb(236 253 252)` … `--color-brand-500: rgb(14 165 162)` … `--color-brand-950: rgb(4 47 46)`.
- **Semantic text** — Hierarchy via `--color-text-primary` (e.g. `var(--color-neutral-950)` in light), `secondary`, `tertiary`, `quaternary`, `placeholder`, brand variants, and **error / warning / success** text roles.
- **Semantic surfaces** — e.g. `--color-bg-primary: rgb(245 252 250)` (mint-tinted app canvas), `bg-secondary`, `bg-brand-solid` / `hover` to `brand-700`, error/warning/success backgrounds, **`--color-bg-overlay`** for scrims.
- **Borders and rings** — `--color-border-primary` through `tertiary`, brand and error borders; matching `--ring-color-*` / `--outline-color-*` aliases for focus and invalid states.
- **Focus** — `--color-focus-ring: var(--color-brand-500)`; `--color-focus-ring-error: var(--color-red-500)` (also adjusted under dark).
- **Dark mode** — Semantic colours and utility ramps remap under **`.dark-mode`** on the root element (not a generic `.dark` class). Shadows are tuned for dark UI (less “muddy” elevation).

### 2.2 Typography (`src/styles/theme.css`, `src/styles/typography.css`)

- **Body scale** — `@theme` comments note body text is roughly **15% larger** than prior defaults for readability.
- **Links** — `typography.css` uses `outline: 2px solid var(--color-focus-ring)` on `a:focus-visible` for visible keyboard focus.

### 2.3 Revamp shell (`src/styles/kira-revamp.css`)

Scoped under **`.kira-app-revamp`** (onboarding/marketing can keep other tokens per file header):

| Token | Light (example) | Role |
|--------|-----------------|------|
| `--kira-revamp-bg-base` | `#f5efe6` | Page background |
| `--kira-revamp-bg-sidebar` | `#eee5d8` | Rail / bottom bar |
| `--kira-revamp-bg-card` | `#ffffff` | Cards |
| `--kira-revamp-text-primary` | `#2c2420` | Primary copy |
| `--kira-revamp-text-secondary` | `#7a6e68` | Secondary |
| `--kira-revamp-text-muted` | `#a89e98` | Section labels / de-emphasis |
| `--kira-revamp-border` | `rgb(120 100 80 / 0.12)` | Hairlines |
| `--kira-revamp-accent-work` / `-dark` | `#e8b4a0` / `#c47a5a` | Work / FAB emphasis |
| `--kira-revamp-accent-study` / `-dark` | `#c9c2e8` / `#8f86c4` | Study / exams tone |
| `--kira-revamp-accent-social` | `#d4c9ef` | Social |
| `--kira-revamp-accent-wellbeing` | `#bcd9c4` | Wellbeing |
| `--kira-revamp-accent-warning` | `#e8c97e` | Warning tone |
| `--kira-revamp-accent-success` | `#6bae8a` | Success |
| `--kira-revamp-accent-danger` | `#c45a5a` | Destructive / danger |
| `--kira-revamp-focus-ring` | `rgb(196 122 90 / 0.6)` | Focus outline colour |

**Dark** — `html.dark-mode .kira-app-revamp` flips bases (e.g. `#1a1714`, card `#3a342f`, primary text `#f7f1ea`) and focus ring to `rgb(232 180 160 / 0.55)`.

**Interaction** — `.kira-revamp-card-interactive` lifts with `translateY(-2px)` and stronger shadow on hover. **`.kira-revamp-focusable`** applies **2px** `outline` + **2px** offset on `:focus-visible`.

**Popover tokens on `:root`** — Work / exam / wellbeing popover backgrounds, text, and borders (with `html.dark-mode` overrides) so portaled RAC tooltips match the shell even outside `.kira-app-revamp`.

**Safe area** — `.kira-app-revamp-main` adds bottom padding `calc(5rem + env(safe-area-inset-bottom, 0px))` for notched devices; `md` breakpoint reduces padding.

---

## 3. Component and interaction patterns

### 3.1 Buttons (`src/components/base/buttons/button.tsx`)

- **`sortCx`** composes `common`, `sizes` (xs–xl), and `colors` (primary, secondary, tertiary, destructive, link variants).
- **Disabled** — `disabled:cursor-not-allowed disabled:opacity-50` per project standard.
- **Focus** — `focus-visible:outline-2 focus-visible:outline-offset-2` with brand outline.
- **Primary / destructive** — `bg-brand-solid`, `hover:bg-brand-solid_hover`, `bg-error-solid` with skeuomorphic shadow and inset rings for depth.

### 3.2 Inputs (`src/components/base/input/input.tsx`)

- **React Aria** — `AriaTextField`, `AriaGroup`, `AriaInput`; shared focus ring (`ring-2 ring-brand` when focused and not disabled).
- **Props** — `isInvalid`, `isDisabled`, `isRequired`, hints, tooltips, password visibility — supports **error prevention** and **visibility of system status**.

### 3.3 Modals and overlays

- **Shared modal** — `src/components/application/modals/modal.tsx`: `AriaModalOverlay` / `AriaModal` / `AriaDialog` with **`motion-safe:`** enter/exit classes.
- **Collision flow** — `src/components/kira/schedule-collision-modal.tsx`: dismissable overlay, `Dialog` with `aria-label={t("collision.title")}`, warning coach panel (`bg-warning-secondary/15`, `ring-warning-secondary/30`), list of overlaps, primary CTA for suggested time when `suggestedStartMin != null`.
- **Limits** — `src/components/kira/limits-setup-modal.tsx`: **native `<dialog>`** with `aria-label`, `onCancel` guard when `isRequired`, numeric validation before save, semantic `Input` labels from `t("limits.*")`.

### 3.4 App shell RAC usage (`src/pages/app/app-shell.tsx`)

- **Mobile menu** — `AriaDialogTrigger`, `AriaButton`, `AriaModalOverlay`, `AriaModal`, `AriaDialog` with `isDismissable`, backdrop blur, **`motion-safe:`** slide animations.
- **Search** — Desktop: `Input` with `icon={SearchLg}`, `placeholder={t("app.searchPlaceholder")}`, `aria-label={t("aria.search")}`, revamp ring colours.

### 3.5 Quick add FAB (`src/components/kira/quick-add-fab.tsx`)

- **56×56** control (`size-14`), **`aria-label={t("aria.quickAdd")}`**, icon `aria-hidden`.
- **Fill** — `bg-[var(--kira-revamp-accent-work-dark)]` (`#c47a5a`), white icon, `ring-2 ring-white/30`, hover brightness tweak, **`.kira-revamp-focusable`** for focus ring consistency.

### 3.6 Focus mode (`src/components/kira/focus-mode-overlay.tsx`)

- **Portal** layer with `role="dialog"`, `aria-modal="true"`, `aria-labelledby` / `aria-describedby`.
- **Escape** ends session and credits study time per documented rounding (`t("focus.saveHint")`).
- **Decorative motion** — `MorphingFocusDiagram` wrapped in `aria-hidden`; gradients use **brand / teal / sky** tokens with `dark:` variants.

### 3.7 Progressive disclosure

- **`HoverHint`** (`src/components/kira/hover-hint.tsx`) combines tooltip with keyboard-focusable control and `sr-only` summary where used (e.g. onboarding, app tagline).

---

## 4. Content, honesty, and user control (`src/i18n/strings.ts`)

Examples that support **transparency** and **user autonomy**:

- **Local-only storage** — `onboarding.login.subtitleDetail`, `onboarding.login.passwordHint` explain browser **localStorage** and that passwords are not sent.
- **Demo SSO** — `onboarding.login.demoLead`, `demoNote`, and SSO button copy clarify simulation.
- **Priorities** — `onboarding.priorities.body` explains optional reordering and collision behaviour.
- **Limits copy** — `limits.modalBodyRequired` / `limits.modalBodyOptional` set expectations for the gate modal.

`OnboardingLoginPage` wires **`HoverHint`** to detailed strings and **`isDisabled={!canContinue}`** on continue and SSO actions until fields validate.

---

## 5. Navigation, landmarks, and assistive cues

From **`src/pages/app/app-shell.tsx`**:

| Element | Practice |
|---------|-----------|
| `<aside aria-label={t("app.menuTitle")}>` | Distinguishes rail from main |
| `<nav aria-label={…}>` (sidebar, drawer, bottom) | Multiple nav regions with distinct labels |
| `aria-current="page"` | Marks active tab |
| `sr-only` + visible label | Icon rail: full label for SR on small breakpoints |
| Bottom nav `aria-label={t("aria.bottomNav")}` | Catalog value `"Primary"` — consider renaming string to “Primary navigation” if “Primary” alone is ambiguous |
| `<main className="kira-app-revamp-main …">` | Primary content landmark |
| Header controls | `aria-label` for open/close menu, search, theme (see `aria.*` keys in `strings.ts`) |

**Internationalised aria strings** include `aria.previousDay`, `aria.nextDay`, `aria.weekPlannerGrid`, `aria.themeMode`, `aria.openFocusMode`, calendar navigation, etc.

---

## 6. Domain-specific UX (tasks, time, wellbeing)

- **Schedule kind colours** — `src/utils/schedule-kind-styles.ts`: **violet** (`violet-500`–`600`) shifts, **rose** exams, **sky** study, **emerald** completed; rings use dark alpha (`ring-violet-950/40` etc.) for **non-text contrast** on blocks.
- **Fortnight work meter** — `SidebarFortnightCard` in `app-shell.tsx` + `RevampProgressBar` shows usage against cap with **heads-up** copy when near limit (`t("dashboard.revamp.sidebarHeadsUp")`).
- **Tab-specific nav tint** — `revampNavSelectedSurface()` mixes revamp accent CSS variables into card background for **scanning** by area (dashboard / calendar / events / wellbeing / profile).

---

## 7. Theme provider (`src/providers/theme-provider.tsx`)

- State: **`light` | `dark` | `system`** (default **`system`**).
- **Persistence** — `localStorage` key default `ui-theme`; system preference clears explicit key when `theme === "system"`.
- **Runtime** — Toggles **`dark-mode`** on `document.documentElement`; subscribes to `matchMedia("(prefers-color-scheme: dark)")` for live updates when in system mode.

---

## 8. What is not evidenced in code (see `Todo.md`)

- Skip link, route `document.title`, full **reduced-motion** coverage for all `motion` animations, automated **a11y/UX tests**, analytics, multiple locales, and broad use of **`EmptyState`** on KIRA pages. **`package.json`** lists no test runner or axe integration.

---

## 9. Related internal docs

- `docs/student-design-research.md` — WCAG-oriented contrast discussion, palette direction (~`#0d9488`–`#14b8a6` teal band), shell rationale.
- `docs/revamp.md` — Revamp design notes referenced from `kira-revamp.css`.

---

*Sub-agent research (parallel pass) was merged and manually verified against the files above; dark-mode class names and `EmptyState` import scope were corrected for accuracy.*
