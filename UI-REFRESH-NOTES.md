# UI refresh notes — 2026-11

## Changed
- Added `motion-ui.css` for a higher-contrast dark visual system, restrained glass surfaces, stronger navigation and card hierarchy, focus styling, and responsive adjustments.
- Added `motion-ui.js` for a scroll progress rail, progressive reveal transitions, restrained pointer ambience, and passive trackpad/wheel sensing. Native scrolling is never intercepted.
- Added both assets to the service-worker precache allowlist and bumped the cache namespace to `voltura-platform-v20.2`.
- Restored the five required `icons/` assets from the included release bundle; the main HTML referenced these paths but they were absent at the top level of the supplied archive.
- Removed the nested `VOLTURA_GITHUB_UPLOAD.zip` duplicate and two unreferenced visual experiment stylesheets.
- Fixed test harness paths so tests resolve the project root from their actual location.

## Compatibility
No finance logic or persistence code was changed. IndexedDB remains `tapledger-db`, version 3; integer-paise arithmetic, import/export compatibility, and NFC query parameters remain intact.

## Motion library decision
GSAP is not included in the supplied project and no local copy is available in the nested release archive. To preserve the existing offline-first/no-third-party-script/CSP requirements, this pass uses native browser APIs instead of fetching GSAP from a CDN. A reviewed, locally vendored GSAP build can be integrated later if explicitly approved.

## Validation
- `node --check app.js` — passed
- `node --check motion-ui.js` — passed
- `node --test finance-core.test.cjs project-integrity.test.cjs` — 11/11 passed

Browser rendering, actual trackpad hardware feel, mobile layout, screen-reader review, and real-device NFC flows remain unverified.

## Interaction and responsive enhancement pass (2026-11)

- Reworked the motion layer with pointer-responsive 3D tilt on hero surfaces, magnetic primary controls, ambient pointer lighting, scroll progress, reveal-on-entry, and view transitions.
- Added passive trackpad/wheel direction and intensity sensing. Native browser scroll behavior is never prevented or remapped.
- Added a compact glass bottom navigation dock for narrow screens, retaining secondary destinations in the existing More workspace dialog.
- Strengthened contrast, surface separation, glass treatments, focus affordances, and reduced-motion fallbacks.
- Preserved the local-first architecture and IndexedDB schema. No remote animation or font dependencies were introduced.
- GSAP was not bundled: package retrieval was unavailable in this environment. The delivered motion is implemented with native CSS/WAAPI-adjacent browser primitives so offline use remains reliable; a reviewed local GSAP distribution can replace selected timelines in a follow-up without changing the finance engine.

## Liquid-metal buttons

Primary, light, and icon buttons now use a local liquid-metal treatment with pointer-following highlights, a chrome/emerald gradient, press depth, focus rings, and click ripples. See `BUTTON-INTEGRATION.md` for the framework compatibility decision and implementation details.
