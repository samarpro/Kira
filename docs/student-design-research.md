# KIRA — student-focused design research (consolidated)

This document merges three parallel research passes: **colour and contrast for high-stress use**, **navigation shell changes**, and **typography / positive affect**. It is the single reference for rationale behind the May 2026 theme and shell updates.

---

## 1. Colour, contrast, and elevation (high-stress / student context)

### Summary

- **WCAG 2.2** sets measurable floors: normal text **4.5:1** (AA), large text **3:1**, non-text UI **3:1** ([SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). For long reading under fatigue, treat AA as a **floor** and aim **higher for body copy** where possible ([SC 1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html) AAA targets as stretch goals).
- **Accents:** Use **small, saturated accents** on **calm bases**. Reserve hot colours for **deadlines, errors, primary CTAs**—not full backgrounds. Cool accents (teal, blue-green, indigo) read as “steady” in many Western product contexts; **amber** adds energy when used sparingly on cool neutrals.
- **Light vs dark:** Preference and comfort are **context-dependent** (ambient light, content). Practical pattern: **user-controlled toggle**, avoid pure **#000 / #fff** pairs; use **off-white / off-black** surfaces to reduce glare.
- **Shadows:** Avoid muddy grays on tinted surfaces. Prefer **two-layer** elevation (tight darker core + soft halo), **slightly cool / hue-matched** shadow tints, and **pair borders with shadows** for controls.

### Palette directions evaluated

| Direction | Role | Example band |
|-----------|------|----------------|
| **A — Clear teal** | Primary actions, links, progress; productive without “alarm” noise | ~`#0d9488`–`#14b8a6` |
| **B — Indigo slate** | Trust / knowledge-work secondary accent | ~`#4f46e5`–`#6366f1` |
| **C — Amber signal** | Time-sensitive / energy (accent only) | ~`#d97706`–`#f59e0b` |

**Implementation choice for KIRA:** Shift the product **brand ramp to teal** (Direction A) for a more **vibrant, student-friendly** identity while keeping neutrals for chrome. Bump **semantic text steps** slightly for stronger hierarchy in light mode; in dark mode, lift **tertiary** text one step for legibility.

### References

- W3C WCAG 2.2 — contrast and non-text contrast Understanding docs (linked above).
- Nielsen Norman Group — [usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) (visibility of status, minimalist design).

---

## 2. Application shell — hamburger on all breakpoints

### Findings (codebase survey)

- Primary chrome lives in **`src/pages/app/app-shell.tsx`** (`AppTabs`: sticky header, theme control, `Tabs.List`).
- **`ThemeToggle`** lives in **`src/components/kira/theme-toggle.tsx`** (previously a three-segment `ButtonGroup`: light / dark / system).
- Kit examples: **`mobile-header.tsx`**, **`header-navigation.tsx`** — useful **RAC `DialogTrigger` + `ModalOverlay`** patterns; the live `/app` route did not use them before this change.

### UX decision

- Remove the **large glass header + always-visible tab rail**; replace with a **compact top bar** (menu + title + theme) so content gains vertical space and cognitive load drops.
- **All breakpoints:** navigation destinations live in a **dismissible drawer** opened by a **hamburger** icon; selecting a destination **closes** the drawer and updates the active tab.

---

## 3. Typography — readability, warmth, and motivation

### Summary

- **Readability** is driven strongly by size, spacing, line length, and contrast—not font alone. Research (e.g. CHI 2022 on **individuated reading**) shows **large individual differences**; no single “best” font for everyone.
- **Humanist sans** (e.g. Source Sans 3): strong for **long reading**, neutral-professional.
- **Neo-grotesque / UI sans** (Inter, Geist): excellent for **dense UI**; can feel cooler.
- **Geometric / rounded sans** (Plus Jakarta Sans, Nunito Sans): often read as **more approachable / contemporary**; rounding can correlate with **positive affect** in some studies—treat as **soft signal**, not a medical claim.
- **Variable fonts:** Good fit for Tailwind when you want fewer files; subset and set `font-display` deliberately ([MDN variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)).

### Pairing evaluated for KIRA

| Pairing | Body / UI | Display | Notes |
|---------|-----------|---------|--------|
| A — Warm consumer | Nunito Sans / Source Sans 3 | Plus Jakarta Sans | Very friendly; slightly looser |
| B — **Balanced upbeat UI** | **Plus Jakarta Sans** | Same | **Chosen:** one family, open forms, good for marketing + app chrome |
| C — Maximum performance | `system-ui` stack | Same | Zero webfont cost; less brand control |

**Implementation choice:** **Plus Jakarta Sans** (variable) as both `--font-body` and `--font-display`, with sensible system fallbacks.

### References

- Wallace et al., *Towards Individuated Reading Experiences* (CHI 2022) — `https://doi.org/10.1145/3502222`
- MDN — [Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)

---

## 4. Implementation log (for reviewers)

| Area | Change |
|------|--------|
| Brand | Teal brand scale in `src/styles/theme.css`; `theme-color` in `index.html` |
| Contrast | Stronger light-mode text steps; slightly brighter dark tertiary text |
| Shadows | Slightly higher-definition, cool-tinted elevation tokens (light); subtler in dark |
| Surfaces | Light `bg-primary` uses cool off-white (`250 250 252`); dark `bg-primary` uses near-black (`11 13 17`) to cut pure `#000` glare |
| Accents in chrome | Drawer top bar uses teal → indigo → amber gradient as a bounded nod to research directions B + C |
| Nav | Hamburger-only trigger (`DialogTrigger` wraps **menu button only**); drawer styling in `app-shell.tsx` |
| Theme control | Single icon button in `theme-toggle.tsx` (sun / moon by resolved appearance) |
| Fonts | Plus Jakarta Sans (subset weights 400 / 600 / 700 + italic 400), `display=swap` |

---

*Psychology claims are heuristic and culture-dependent; validate with your student pilot cohort.*
