# VOLTURA V22.0 — Visual and UX overhaul

## Why this release exists

The V21.1.1 screens supplied for review showed real layout and readability defects: the dashboard's lower insight copy was squeezed into a narrow column by a long adjacent action; several surfaces used low-contrast secondary text; the visual hierarchy was too compressed; and mobile navigation hid destinations without exposing every one in the More sheet.

## Changes

- Rebalanced the desktop workspace and dashboard spacing.
- Rebuilt the monthly cash-flow hero as a high-contrast lime surface with dark text.
- Increased legibility for section headings, panel labels, chart legends, recent activity, budget summaries, form controls, dialogs and settings.
- Rebuilt the insight and goal feature cards as full-width stacked content; the insight action now sits beneath its copy instead of competing for horizontal space.
- Improved category chart/legend sizing and recent-activity row spacing.
- Added explicit light-theme foreground/background pairs, including system-light handling.
- Added mobile Intelligence as a primary destination and exposed Budgets and Savings Goals in the More sheet.
- Preserved the central mobile Add action and keyboard-aware quick-entry rules.
- Advanced the service-worker cache namespace to V22.0 and added the new local stylesheet to precache.

## Motion

The project retains its local progressive motion scripts and optional GSAP/ScrollTrigger integration point. A GSAP runtime could not be fetched in this execution environment: npm registry access failed with DNS `EAI_AGAIN`, and no local GSAP distribution was present. No CDN or remote dependency was introduced. GSAP is therefore **not bundled or claimed as integrated** in V22.0. The existing reduced-motion and native motion fallbacks remain in place.

## Compatibility

- No IndexedDB name, version, store, key path, index, migration marker or record shape changes.
- No financial calculations changed.
- No NFC URL shortcut changed: `?a=1`, `?i=1`, and `?add=1` remain supported.
- No external runtime, font, image, analytics or tracking request added.
- No files deleted.
