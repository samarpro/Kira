# KIRA — repository inspection (UCD / UX lens)

Inspection date: 13 May 2026. Scope: `src/`, `docs/`, `package.json`, design tokens, navigation, forms, modals, i18n, and accessibility signals. This file lists **findings** (what is already in good shape) and **to-improve** items (concrete backlog).

---

## Findings (what the repo already does well)

1. **Human-centred copy and transparency** — `src/i18n/strings.ts` states that profile and schedule data stay in the browser (`onboarding.login.subtitleDetail`, `onboarding.login.passwordHint`), labels SSO as simulated (`onboarding.login.demoLead` / `demoNote`), and explains priority ordering for collisions (`onboarding.priorities.body`). Onboarding forms use clear labels, hints, and validation gating (`src/pages/onboarding/onboarding-login.tsx`).

2. **Structured design system** — `src/styles/theme.css` defines a **teal brand ramp** `--color-brand-50`–`--color-brand-950` (e.g. 50 `rgb(236 253 252)` … 950 `rgb(4 47 46)`), semantic **text** (`--color-text-primary` … `quaternary`, brand, error/warning/success), **backgrounds** (including `--color-bg-primary: rgb(245 252 250)`), **borders**, **focus rings** (`--color-focus-ring` → `var(--color-brand-500)`, error variant `--color-focus-ring-error`). Dark appearance is driven by **`html.dark-mode`** with remapped utilities and softer shadows.

3. **Scoped “whole shell” experience** — `src/styles/kira-revamp.css` under `.kira-app-revamp` defines a warm cream palette, dark overrides under `html.dark-mode .kira-app-revamp`, **custom scrollbars**, and **`.kira-revamp-focusable`**. Contrast notes live in `docs/revamp-contrast-checklist.md`.

4. **User control of appearance** — `src/providers/theme-provider.tsx` supports `light` | `dark` | `system`, persists choice, and listens to `prefers-color-scheme: dark` when theme is system.

5. **Predictable navigation and landmarks** — `src/pages/app/app-shell.tsx` uses `<aside>`, `<header>`, **`<main id="kira-app-main">`**, skip link, `aria-live` for the active tab title, multiple `<nav>` regions with `aria-label` from `t("app.menuTitle")` / `t("aria.bottomNav")`, `aria-current="page"` on the active tab, `sr-only` labels where the rail is icon-first, and `aria-label` on menu / search / FAB controls.

6. **Recovery and guardrails in the domain model** — `src/components/kira/schedule-collision-modal.tsx` explains overlaps, surfaces the user’s priority order, offers a **suggested time** when available, and allows “continue anyway” or back off. `src/components/kira/limits-setup-modal.tsx` uses native `<dialog>` with `showModal()`, blocks cancel when `isRequired`, validates numeric ranges (study 1–100 h, work 1–120 h), and uses semantic surface classes (`bg-primary`, `ring-secondary`). `src/components/kira/focus-mode-overlay.tsx` exposes `role="dialog"`, `aria-modal`, labelled content, **Escape** to end session, and documents how time credits to the calendar.

7. **Motion and reduced-motion awareness** — `motion-safe:` on overlays; **`useReducedMotion`** in `quick-add-fab.tsx` and `focus-mode-overlay.tsx` for continuous / ambient motion.

8. **Design rationale documented** — `docs/student-design-research.md` ties palette, contrast, and shell decisions to WCAG-oriented thinking and student stress context.

9. **Calendar visual encoding** — `src/utils/schedule-kind-styles.ts` uses distinct **Tailwind colour ramps** (violet shifts, rose exams, sky study, emerald completed) with rings for **recognition** and status at a glance.

---

## To-improve (backlog)

### Accessibility and inclusive design

- [x] **Add a “Skip to main content”** link at the top of `AppShell` (or root layout) targeting the existing `<main>` in `src/pages/app/app-shell.tsx` — improves keyboard and screen-reader efficiency (currently no skip-link pattern in `src/`).

- [x] **Audit contrast** for revamp-specific pairs (e.g. text on `color-mix(...)` selected nav surfaces, `#a89e98` muted on `#eee5d8`) against **WCAG 2.2** targets; `docs/student-design-research.md` already sets the bar—add a short checklist or token notes in `docs/` after measurement.

- [x] **Harmonise motion** — `motion-safe:` is used on some overlays, but `src/components/kira/quick-add-fab.tsx` and `src/components/kira/focus-mode-overlay.tsx` use **`motion/react`** without an explicit `useReducedMotion` guard; consider wrapping continuous animations in reduced-motion checks.

- [x] **Search affordance on small screens** — `AppShell` renders a **secondary `Button` with search icon** on `md:hidden` (`aria-label={t("aria.search")}`) without wiring a search flow; either connect behaviour or expose a disabled/tooltip state so users are not misled.

- [x] **Document title and live regions** — `src/main.tsx` does not set route-level `<title>` / `document.title` or announce view changes; add per-route titles (and optional `aria-live` for major status updates) for clearer **whole-UX** orientation.

### Content, trust, and evaluation

- [x] **Marketing-style claims** — `onboarding.welcome.socialProof` (“Trusted by 10+ students…”) may read as factual; align copy with real pilot data or soften to avoid **credibility** issues under ISO-style “integrity of communication.”

- [x] **Avatar button** — Profile shortcut wraps `<Avatar … alt="" />`; parent has `aria-label={t("app.nav.profile")}` which is acceptable; verify **focus order** between header controls and that avatar focus ring matches `.kira-revamp-focusable` elsewhere for consistency.

### Components and consistency

- [ ] **`EmptyState` usage** — `src/components/application/empty-state/empty-state.tsx` is a full kit pattern but **no page imports** it under `src/pages/` (only internal/select patterns); consider using it for zero-state dashboard, calendar, events, or wellbeing lists for **consistent** empty UX.

- [x] **Dual token systems** — App shell mixes **revamp CSS variables** (`--kira-revamp-*`) with **global semantic** classes in modals (e.g. collision modal uses `bg-primary`, revamp uses card tokens). Track drift and document when to use which layer (`docs/revamp.md` + design tokens section).

- [x] **`LimitsSetupModal` `onOpenChange`** — `AppShell` passes `onOpenChange={() => undefined}`; limits still close via store actions inside the modal, but a real handler would make parent state **traceable** and easier to test.

### Quality and human-centred evaluation (process)

- [ ] **No automated tests** — `package.json` has no Vitest, Playwright, Testing Library, or axe-core; add smoke tests for onboarding + collision modal + limits dialog, and optional **accessibility** checks in CI.

- [ ] **No analytics or in-product feedback loop** — acceptable for a local demo; document as a gap if moving toward ISO-style **continuous evaluation**.

- [ ] **i18n is string-catalog only** — `t()` is ready for extraction but locales are not implemented; track as debt if non–English-speaking students are a target.

---

## Quick reference — key files touched by this review

| Area | Path |
|------|------|
| Tokens & semantics | `src/styles/theme.css`, `src/styles/globals.css`, `src/styles/typography.css`, `src/styles/kira-revamp.css` |
| Shell & nav | `src/pages/app/app-shell.tsx` |
| Theme | `src/providers/theme-provider.tsx` |
| Copy | `src/i18n/strings.ts` |
| Collisions / limits / focus | `src/components/kira/schedule-collision-modal.tsx`, `limits-setup-modal.tsx`, `focus-mode-overlay.tsx`, `quick-add-fab.tsx` |
| Calendar colour coding | `src/utils/schedule-kind-styles.ts` |
| Research notes | `docs/student-design-research.md`, `docs/revamp.md`, `docs/revamp-contrast-checklist.md` |
