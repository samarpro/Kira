# Revamp contrast checklist (WCAG-oriented)

Use this when changing `src/styles/kira-revamp.css` or nav surfaces in `app-shell.tsx`.

1. **Section labels** (`.kira-revamp-section-label`, `--kira-revamp-text-muted` on `--kira-revamp-bg-sidebar` or card): aim for **≥ 4.5:1** against the surface behind the label in both light and `html.dark-mode`.
2. **Selected nav / bottom tabs** (`revampNavSelectedSurface`): text uses `--kira-revamp-text-primary` on `color-mix` tints; verify **primary vs mix** in dark mode (where card/sidebar are brown, not white).
3. **Tinted tooltips** (`:root` / `html.dark-mode` `--kira-revamp-popover-*`): title vs panel bg and description vs panel bg; borders visible on both themes.
4. **Scrollbars** (`--kira-revamp-scrollbar-thumb` / `track`): thumb visible on track without looking like a second accent color.

## Token layers (Todo: dual systems)

- **Revamp shell** (`.kira-app-revamp`): layout, warm surfaces, `--kira-revamp-*` for in-app chrome, cards, and revamped panels.
- **Global semantic** (`theme.css`, `bg-primary`, `text-secondary`, …): onboarding, marketing, legacy panels (e.g. calendar quick-add section), and shared primitives.

When a component sits **inside** the revamp shell but still uses `bg-primary`, treat it as intentional until migrated; new work should prefer revamp tokens for visual consistency.
