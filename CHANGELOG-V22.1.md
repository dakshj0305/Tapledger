# VOLTURA V22.1 — Stitch design integration (first pass)

## Included
- Added the supplied Stitch reference package under `design-reference/stitch/` (four screens, monogram reference and design-system notes) for traceable design handoff.
- Added `stitch-integration.css` as the final local stylesheet so the new design layer can correct the existing cascade without replacing application markup or handlers.
- Applied the Stitch visual direction: warm mineral canvas, forest-green navigation and hero surfaces, chartreuse interaction accents, editorial headings, calmer rounded panels and stronger explicit text/surface pairings.
- Added selective glassmorphism to top chrome and summary surfaces only. Dense tables, form fields, transaction sheets and dialog content remain opaque for legibility.
- Added reduced-transparency, reduced-motion and forced-colors fallbacks, plus responsive gutters and safe wrapping rules.
- Advanced the service-worker cache namespace to `voltura-platform-v22.1` and precached the new stylesheet.

## Preserved
- IndexedDB database name, version 3, stores, key paths, indexes and record shapes.
- Integer-paise financial storage and existing finance, restore, backup, NFC and offline behavior.
- Existing application DOM hooks and event handlers; supplied Stitch screens are references, not replacements for live data-driven views.

## Not yet integrated
- GSAP is not bundled in the supplied archive and no local GSAP distribution is present in the workspace. No CDN dependency was added because VOLTURA is local-first/offline-capable. GSAP motion integration remains a follow-up once a licensed local distribution is supplied or can be retrieved in a network-enabled environment.
- The four Stitch screens are desktop-oriented visual references; responsive adaptation into each live view remains an incremental follow-up rather than a full component rewrite in this pass.

## Verification
- `node --test *.test.cjs` — 37 tests expected after the Stitch integration test was added; run result recorded in the delivery response.
- No live financial data was opened, migrated or modified.
