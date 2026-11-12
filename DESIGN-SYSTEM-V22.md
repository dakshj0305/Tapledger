# VOLTURA V22.0 design system

## Direction

A calm, editorial finance workspace: charcoal/forest foundations, a high-contrast lime cash-flow hero, warm-white insight surface, clear card hierarchy and typography sized for everyday reading. Visual effects are secondary to legibility.

## Surfaces

- App background: `#0B1110` (dark), `#F3F5EF` (light)
- Standard panel: `#17231C` (dark), `#FFFFFF` (light)
- Raised panel: `#1C2A22` (dark), `#F6F8F2` (light)
- Balance hero: `#D9F477` gradient with `#172116` foreground
- Insight feature: `#E5F0DC` with `#17251B` foreground
- Goal feature: deep forest gradient with pale text

## Typography and layout

- System UI stack only; no remote font dependency.
- Body text 15px / 1.55 default.
- Main dashboard title uses responsive 42–76px sizing.
- Main content uses fluid desktop gutters and single-column tablet/mobile sections.
- Financial values use tabular numerals where existing component rules support them.

## Components

- Desktop left navigation; mobile five-item dock: Overview, Ledger, Intelligence, Add, More.
- Budgets, Goals, Accounts, Reports, Automations and Settings remain available in More.
- Balance hero, period summary, cash-flow chart, budget snapshot, category mix, recent activity, insight and savings-goal features.
- Opaque inputs and quick-entry sheet; no blur or motion effect is applied to quick entry.

## Motion and accessibility

- Respect `prefers-reduced-motion`.
- Use native progressive motion when supported; GSAP integration remains optional and is not bundled in this release because the package registry was unreachable during the build.
- Support reduced transparency and forced-colors with opaque surfaces and system colors.
- Keep text foregrounds explicit on each colored surface; avoid relying on inherited foreground color over a changing background.
