# VOLTURA release notes — current V26.0

**Build:** `VOLTURA-26.0-UNIFIED-20261113`  
**Date:** 13 November 2026  
**Deployment:** Not pushed or deployed by this release task.

V26.0 combines the strongest parts of the prior Observatory, Kinetic Relic, Stitch and Atelier work into one coherent product direction. The interface uses editorial financial hierarchy, mineral-paper surfaces, deep-pine navigation, a chartreuse action accent, selective dimensional motion and a consistent light/dark system. Financial controls and data tables remain matte and readable.

## Included

- One active local runtime stylesheet, `voltura.css`, generated reproducibly by `node build-css.cjs` from nine maintained local source layers plus `voltura-unified-overrides.css`.
- Focused first-paint quick entry for `?a=1`, `?i=1` and `?add=1`; Save stays disabled until IndexedDB and application handlers are ready.
- Existing transaction, account, budget, goal, intelligence, report, backup/restore, CSV, voice-consent and NFC shortcut features retained.
- Light/dark appearance, 16px mobile inputs, visible keyboard focus, reduced-motion, forced-colors and reduced-transparency fallbacks.
- Local-only CSS/Canvas/JavaScript motion; no external font, CDN, analytics or third-party runtime.
- Updated service-worker cache `voltura-platform-v26.0` and self-hosted PWA assets.

## Deliberate compatibility decisions

- Static HTML/CSS/vanilla JavaScript; no framework migration.
- IndexedDB database `tapledger-db`, version 3; stores, keys, indexes, record shapes and migration behavior unchanged.
- Money remains integer paise; JSON export remains tagged `Voltura`, with legacy `TapLedger`, `Cairn` and `Vellum` import support.
- Project-relative URLs remain compatible with GitHub Pages `/Tapledger/` hosting.
- No pinned scroll scenes or wheel hijacking.

## Removed approved dead files

`observatory.css`, `kinetic.css` and `vivid-depth.js` were not active runtime dependencies and have been removed. `vivid-depth.css` remains as a historical source file but is not loaded. The source CSS layers remain available for reproducible builds and traceability; only `voltura.css` is loaded by the app.

## GSAP status

GSAP is **not bundled**. The official distribution is absent from the supplied project and local package cache. External DNS resolution failed during retrieval attempts, so this release does not use a CDN, fabricate a substitute, or claim GSAP integration. Existing local motion remains progressive and offline-safe.

## Verification boundaries

See `QA-REPORT-V26.0.md`. Automated tests and static checks do not certify physical NFC behavior, Android PWA link capture, deployed GitHub Pages behavior, screen-reader compatibility, legal compliance or every browser/device combination. Chromium headless execution timed out in this environment, so rendered visual browser QA remains unverified.
