# VOLTURA / Tapledger — source audit history

> **Current audit:** VOLTURA V22.2, 13 November 2026. The authoritative current scope, corrections and pass/fail status are in `RELEASE-REPORT-V22.2.md` and `QA-REPORT.md`. The older V20.9 audit narrative below is retained as historical project context and is not a current browser certification.

## Current V22.2 audit addendum

- Re-ran the four original test suites and added `release-packaging.test.cjs`; the final suite passes **39 tests, 0 failed**.
- Re-ran `node --check` for every root JavaScript file.
- Found and corrected stale release labels in README/release notes, nine stale entries in the package SHA manifest, and missing `.nojekyll` / `.gitignore` files.
- Added a regression test that requires the README, release notes, visible app version, app source and service-worker cache to agree on V22.2, and verifies the checksum manifest covers every shipped file except itself.
- Updated the GitHub upload instructions to explain ZIP extraction and preservation of the existing remote Git history.
- A current headless Chromium screenshot attempt timed out; browser visual QA, actual PWA lifecycle, real IndexedDB persistence, NFC hardware and live Pages deployment remain unverified.
- GSAP/ScrollTrigger remains optional and is not bundled or active in the default release; no CDN was added.

---

## Historical V20.9 baseline audit

Audit target: `Tapledger-scroll-experience.zip` (older supplied archive)
Audit date: 2026-11-12

## Scope and limits

This is a source-package and executable Node test audit. It covers JavaScript syntax, the existing finance-helper tests, static project-integrity tests, local asset references, service-worker precache completeness, manifest references, and the added interaction-layer wiring. It does not certify financial correctness for every user workflow, browser rendering, accessibility conformance, security, legal compliance, NFC hardware behavior, or deployment configuration.

## Findings corrected in this audit

1. `SHA256SUMS.txt` described an older package: multiple checksums no longer matched, and it referenced a `tests/` directory that was absent from the archive. It has been regenerated against the final source tree and the actual root-level test files.
2. Seven duplicate/unused root icon assets were present alongside the canonical `icons/` assets. No runtime source referenced the root copies; the manifest, HTML, and service worker use `icons/`. The redundant copies were removed.
3. The archive had two existing Node test files at its root. A third release-audit suite has been added to check service-worker precache entries, local page dependencies, PWA icon references, CSP presence, and the scroll/liquid interaction wiring.
4. The prior QA notes contained historical version labels and overstated some verification. The report below separates executed checks from checks that remain unverified.

## Executed checks

- `node --check` on every root `.js` file — PASS.
- `node --test finance-core.test.cjs project-integrity.test.cjs release-audit.test.cjs` — PASS (reported in the final release summary).
- Local HTML asset reference scan — PASS; no missing local `src` / `href` targets were found.
- PWA manifest JSON parse — PASS.
- Service-worker precache references — checked by `release-audit.test.cjs`.
- All files in `SHA256SUMS.txt` — regenerated and checked against the final package.

## Architecture preserved

- Static, vanilla JavaScript PWA; no React/Tailwind/shadcn migration.
- IndexedDB database remains `tapledger-db`, version 3; no schema migration or data rewrite.
- Existing finance-core helper API and transaction model remain intact.
- Local-first / offline-first design retained; no remote JS, remote fonts, analytics, or CDN runtime added.
- Liquid-metal and scroll-chapter enhancements remain progressive and respect reduced-motion preferences.

## Remaining unverified (do not treat as passed)

- Real-browser UI interaction and console/network inspection: headless Chromium did not complete in this environment.
- Full add/edit/delete/transfer, restore/import/export, Undo, budgets, goals, account balance, and legacy-data workflows against IndexedDB.
- Service-worker first-install, update activation, and offline relaunch in actual Chrome/Safari/Firefox.
- Responsive visual QA at 320 px, 375 px, tablet, desktop, 200% zoom, and landscape.
- Keyboard-only, screen-reader, forced-colors, axe/Lighthouse, and rendered contrast testing.
- Real NFC tag write/read and Android PWA URL dispatch.
- Production hosting headers, GitHub Pages deployment, legal/privacy review, and device-specific performance profiling.

A source audit cannot prove that a web app is mistake-free on every device. The items above require browser/device execution before calling the release production-certified.


## Follow-up visual/runtime repair — 2026-11-12

The next reported visual defects were traced to the delivered source rather than guessed from screenshots:

1. The overview contained unrelated beverage-brand promotional copy and a bottle illustration inside a finance dashboard. That unstyled editorial rail had no matching CSS and was replaced with a VOLTURA-specific brand statement.
2. The VOLTURA mark was a generic single-letter V. The inline mark, favicon, and four PWA raster icons now share a distinct V/spark identity. The manifest theme color now matches the lime accent.
3. The app shell was still labelled V20.1 and the service worker cache remained V20.5. The visible app label and cache namespace are now V20.6.
4. The new visual stylesheet was added to the service-worker precache list, so offline installs receive it too.
5. Service-worker registration now uses `updateViaCache: 'none'` and explicitly calls `registration.update()` on startup, addressing stale HTTP-cached worker scripts and missed update checks. Existing update prompts still protect open forms and unsaved work.
6. Mobile navigation now uses a compact bottom dock with safe-area spacing; the Goals view remains reachable, while secondary views stay in the existing More dialog. Chapter navigation, focus states, and reduced-motion behavior were refined.

### Follow-up checks executed

- All seven root JavaScript files pass `node --check`.
- All 18 Node tests pass across the three suites.
- New tests verify the visual repair stylesheet, removal of irrelevant promo copy, brand asset presence, PWA icon sizes, mobile safe-area rules, reduced-motion rules, service-worker cache version, and explicit update checks.
- Service-worker precache and all local HTML dependencies resolve.
- IndexedDB database name and schema version remain unchanged.

### Still not certified

Chromium headless again failed to complete in this execution environment, so rendered browser screenshots, console inspection, responsive pixel QA, Lighthouse, and device-level interaction remain unverified. Do not treat source tests as a substitute for those checks.


## Fine-grain UI and release consistency pass — 2026-11-12

- Found and fixed a cascade defect: `motion-ui.css` declared a fixed 48px width for `.scroll-chapter-progress`, while `polish.css` attempted to stretch the same absolutely positioned element using left/right offsets. The retained width constrained the progress rail on desktop and mobile. Chapter navigation styling now has one source of truth in `polish.css`, with `width:auto` explicitly set.
- Adjusted sticky offsets to sit below the desktop/mobile top bar and added scroll padding so chapter targets do not land under sticky UI.
- Added small-screen safeguards for topbar actions, flex/grid shrink behavior and disabled controls.
- Normalized SVG `viewBox` attribute casing and made all button types explicit (`button` for controls; existing submit buttons remain submit).
- Aligned visible app version, JavaScript/CSS source labels, service-worker cache namespace and current documentation to V20.7.
- Preserved the IndexedDB database name and schema version.

Browser rendering remains environment-blocked; the local Chromium launch can start but navigation is rejected by the execution environment with `ERR_BLOCKED_BY_ADMINISTRATOR`. No visual pixel-perfect or real-device claim is made from that failed attempt.

### V20.7 final source verification

- `node --test *.test.cjs`: 21/21 passed.
- `node --check` across all seven root JavaScript files: passed.
- All six CSS files parsed with `tinycss2`: zero parse errors.
- Added regression tests for the chapter progress-rail width conflict, explicit button types, SVG viewBox casing and version/cache alignment.
- The archive and checksum manifest are regenerated after the final source changes.


## V20.9 dashboard and rendered UI repair — 2026-11-12

### Source defects corrected

- Added explicit layout rules for the dashboard masthead, reporting-period index and tracked-position/savings row; these elements previously rendered as colliding inline text because the required selectors were not defined.
- Removed the oversized, unstyled prism-stage element that expanded the cash-flow hero and rendered as a large black V.
- Corrected contrast on the lime net-cash-flow panel: the primary amount, metric label, supporting line and trend now use dark foreground colors. Dark mini-stat tiles retain light foreground colors.
- Fixed the insight feature grid after hiding its decorative orbit: copy now spans the available width instead of being squeezed into the former 40px icon column. Increased the contrast of the insight link and copy.
- Removed the long table caption from the visually-hidden chart data table and replaced it with an accessible table label. The previous caption imposed a 400px minimum table width and caused horizontal overflow on 390px and 320px screens. The table remains available to assistive technology.
- Made the chapter progress fill track continuous document scroll rather than only changing at chapter boundaries.
- Updated the browser theme-color meta tag dynamically for light, dark and system appearance preferences.
- Added minimum 44px interaction heights to the key button/chapter/range controls.
- Added IntersectionObserver and MutationObserver fallbacks to the scroll/motion enhancements.
- Aligned the app label, source comments, service-worker cache and current docs at V20.9. IndexedDB remains `tapledger-db`, schema version 3.

### Rendered Chromium QA performed

The complete HTML, CSS and JavaScript source was loaded into headless Chromium through a `setContent` test harness. A test-only in-memory IndexedDB-compatible shim was injected because the execution environment blocks navigation to local HTTP and file URLs. This validates actual layout, CSS cascade, app initialization, view navigation and form handlers, but it does **not** certify persistent IndexedDB or service-worker behavior.

- Desktop 1440px and tablet 820px: all eight primary views navigated successfully; no JavaScript page errors or console errors; no horizontal overflow.
- Mobile 390px and compact 320px: document width equals viewport width; no horizontal overflow. Main dock navigation and More dialog were exercised.
- Quick-expense and manual-entry forms: both saved one transaction through the test shim; no duplicate submission observed in the tested path.
- Cash-flow chart: 12 bar elements rendered from seeded test records; accessible chart table constrained to an 8px off-screen box and no longer widened the document.
- Chapter progress: tested at scroll positions 400/900/1400/2000px, with progress approximately 17.5%/44.0%/71.5%/100%; active chapter advanced as the page scrolled.
- Theme-color: dark preference set `#101715`; light preference set `#F3F3ED`.
- Desktop/tablet and mobile interaction runs produced zero page errors and zero console errors in the harness.

### Still outside this harness

Real IndexedDB persistence across reloads, service-worker install/update lifecycle, NFC hardware, installed-PWA link capture, voice-provider behavior, actual device haptics, Lighthouse performance and assistive-technology testing still require a normal HTTPS deployment and real-device verification. The test shim is intentionally not shipped as application code.

### Additional V20.9 polish and interaction regression findings

- Fixed the light-theme sidebar wordmark contrast. The previous hard-coded near-white brand name was almost invisible on the light sidebar; it now uses the active text token, with its descriptor using the muted text token in both themes.
- Removed a duplicate 3D-tilt listener block that attached a second pointer handler to the same cards and wrote unused `--shine-*` values.
- Removed unused pointer/ambient/chart variables and the unused ambient DOM node. Trackpad wheel sensing now drives a restrained, temporary perspective tilt on the sticky chapter navigation, resets to neutral after the gesture, and remains passive (native scrolling is not prevented).
- Verified NFC shortcut routing in a browser harness with a test-only query-string shim: `?a=1` opened the quick expense sheet, focused the amount input, enabled Save after initialization, and invoked query cleanup; `?i=1` opened the income entry sheet with the same readiness/focus behavior.
- Verified invalid quick-expense amount rejection, double-submit protection, successful save state, Undo, Add another reset, and manual-entry single-save behavior in the disposable storage shim.
- Verified the brand wordmark computed color in light theme, keyboard skip-link focus, reduced-motion styles, forced-colors overrides, and 200% root text sizing at 320/390/720px without horizontal overflow.
- Tested all eight app views at desktop and mobile widths; no horizontal overflow was detected in any tested view. Mobile secondary views opened through the More dialog and navigated correctly.


### Final V20.9 package verification

- Node test suites: 27 passed, 0 failed.
- JavaScript syntax: all 7 source files passed `node --check`.
- CSS parsing: all 6 stylesheets parsed with zero errors.
- Manifest: valid JSON.
- Browser harness: desktop/tablet/mobile navigation and forms passed; quick-expense/income shortcut routes opened the intended forms; no page or console errors in tested runs.
- Responsive: all eight views checked at 320px and 390px; no horizontal overflow. All eight views also checked at 320px with 200% root text sizing; no horizontal overflow.
- Interaction: trackpad tilt responded to wheel movement and returned to neutral after the full reset/transition interval; native page scrolling continued.
- Package checksum manifest and ZIP integrity are regenerated and verified after final changes.
- Contrast calculations for the key redesigned surfaces: primary balance text on lime 14.51:1; balance label on lime 11.81:1; insight body on the dark insight surface 11.64:1; lime insight action on that surface 14.51:1; sidebar wordmark on light/dark surfaces 14.95:1 / 16.52:1.
- Verified the quick-entry dialog closes on Escape and visible quick-entry text/select controls are at least 16px on a 390px mobile viewport.
