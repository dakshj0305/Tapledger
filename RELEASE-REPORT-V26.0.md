# VOLTURA V26.0 — Unified product release

**Build:** `VOLTURA-26.0-UNIFIED-20261113`  
**Deployment:** Not pushed or deployed.

V26.0 unifies the prior Observatory, Kinetic Relic, Stitch and Atelier directions into a single product system. The visual hierarchy is editorial and premium, with matte mineral surfaces, deep pine navigation, a chartreuse primary action, restrained coral indexing, tabular financial numerals and a selective dimensional hero. It avoids broad gradients, glass blur and decorative glow on financial controls.

## Runtime architecture
- Static HTML, CSS and vanilla JavaScript; one active local stylesheet (`voltura.css`).
- Finance engine and app event handlers retained.
- IndexedDB V3 contract, integer paise and JSON compatibility unchanged.
- PWA paths remain relative to the GitHub Pages `/Tapledger/` project path.
- Service worker cache advanced to `voltura-platform-v26.0`.
- NFC/URL quick entry opens the focused dialog before the normal app boot and keeps Save disabled until data and handlers are ready.

## Removed approved dead files
`observatory.css`, `kinetic.css` and `vivid-depth.js` were not active dependencies. They were removed after checking runtime references. The historical source stylesheets used to assemble `voltura.css` remain in the repository but are not loaded at runtime.

## Verification boundaries
Automated test results are reported in `QA-REPORT-V26.0.md`. A test pass does not prove physical NFC behavior, Android PWA link capture, installed-app updates, assistive-technology behavior, legal compliance or deployed GitHub Pages behavior. A Chromium Playwright in-memory visual harness rendered the Overview, all eight views, and both quick-entry loading surfaces across desktop, tablet and mobile widths. Full application runtime against real IndexedDB remains unverified because the sandbox blocks origin navigation and opaque-origin IndexedDB. GSAP remains unavailable and is not claimed as integrated.
