# VOLTURA V26.2 — Dashboard refresh

## What changed
- Reworked the overview dashboard hierarchy with a larger editorial masthead, a forest-green balance feature and individually surfaced income, expense and net tiles.
- Gave cash-flow, budget, category and recent-activity panels clear matte surfaces, stronger separators and more legible data typography.
- Tuned the layout at desktop, tablet and narrow mobile widths while retaining the existing bottom navigation and quick-entry affordances.
- Increased the visibility of the GSAP dashboard entrance and chart-bar reveal.
- Preserved local-only assets, reduced-motion behavior, and the existing finance and IndexedDB implementation.

## Compatibility
No database schema, store, key, index, record, backup, NFC route or financial calculation was changed. The new stylesheet is local and included in the service-worker app shell.

## Verification
The repository's automated tests are run in the V26.2 verification workflow. Physical-device behavior, assistive-technology review and production performance profiling remain separate checks.
