# Vellum v11 — Release notes

## Delivered
- Integrated the supplied GlyphPortal, GlassWorkspace and KineticGrid visual directions as native static browser code.
- Kept the Vellum identity, local data-driven financial workspace and existing native dashboard.
- Added a responsive kinetic grid/wordmark interaction with edge pinning, pointer smoothing, damped-spring lettering, decaying radial ripples, max DPR 2, reduced-motion handling and page-visibility pause.
- Fixed the animation scheduler so a stationary pointer does not cause a continuous requestAnimationFrame loop.
- Added pointer-up handling for touch/pen interactions so the visual field relaxes after touch.
- Retained adjustable glass-material presets and controls in the existing Data & privacy dialog.
- Kept the static HTML/CSS/JavaScript deployment model and removed any need for the React/GSAP/Lucide runtime.
- Added `RUN-LOCAL-WINDOWS.bat` for local HTTPS-context-compatible testing through localhost.

## Compatibility retained
- `tapledger-db`, IndexedDB schema version 3 and existing stores/migration.
- `?a=1`, `?i=1` and legacy `?add=1` URL actions.
- Existing Vellum/Cairn/TapLedger JSON import compatibility and CSV/JSON export.
- Existing privacy, terms and cookies draft pages.
- Voice remains optional and subject to an explicit opt-in notice.

## Install
Upload the contents of the extracted `vellum-finance-v13` folder to the root of the existing GitHub Pages repository, commit to `main`, verify the Pages workflow, then hard-refresh. Keep the same origin/path to preserve browser IndexedDB data and existing NFC URLs. Back up JSON before deployment.

## Verification limits
Static syntax, structure, local asset references, manifest and archive checks are included in `QA-REPORT.md`. Physical NFC card behavior, live GitHub Pages update behavior, actual Android speech-provider behavior and assistive-technology testing on target devices remain to be verified by the site owner.


## v13 design update
- Replaced the diffuse glass-heavy visual treatment with bold, flat editorial surfaces.
- Increased typographic scale and hierarchy on the overview dashboard.
- Added a restrained CSS 3D metallic orb and orbital rings to the brand portal.
- Simplified visual language: square corners, hard shadows, fewer translucent layers.
- Preserved the existing finance workflows and local data contracts.

## v13 — Motif coherence pass
Introduces the Orbiting Ledger motif across the brand, navigation, page markers, overview hero and progress states. This is a CSS-only visual refinement; the finance logic, IndexedDB schema, storage keys and NFC URL actions remain unchanged.
