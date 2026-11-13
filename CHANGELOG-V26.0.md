# VOLTURA V26.0 — Unified product release

## Product and visual system
- Combined the Observatory editorial hierarchy, Kinetic Relic dimensional accent, Stitch information architecture and Atelier surface refinement into one consistent matte design contract.
- Replaced ten sequential runtime stylesheets with one locally bundled `voltura.css`; original source layers remain in the repository for traceability but are no longer loaded by the app.
- Standardized light/dark tokens, navigation, balance hero, panels, tables, forms, dialogs, focus states, touch sizing and reduced-motion fallbacks.
- Kept dimensional motion selective and decorative; financial data surfaces remain opaque, readable and low-noise.

## Functionality and reliability
- Moved URL intent detection into the document head so `?a=1`, `?i=1` and `?add=1` show their focused entry dialog before dashboard rendering.
- Disabled Save until IndexedDB and app handlers are ready; the existing save path remains authoritative.
- Added a `visualViewport` fallback for browsers without the API and retained keyboard-height updates where available.
- Updated the service-worker cache to V26.0 and precached only active app runtime assets.
- Removed approved dead files after confirming they were not runtime dependencies: `observatory.css`, `kinetic.css`, `vivid-depth.js`.

## Data compatibility
- No database schema, stores, keys, indexes, record shapes, money arithmetic or backup format changes.
- IndexedDB remains `tapledger-db`, version 3; monetary values remain integer paise.
- No existing financial records were opened or modified during packaging.

## Motion dependency
GSAP is not bundled in this environment: the official distribution is absent from the supplied source and local package cache, and external DNS resolution is unavailable. No CDN or fake shim is used. Existing local motion enhancements remain progressive and offline-safe.
