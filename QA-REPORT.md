# VOLTURA QA report — current package audit

See `AUDIT-REPORT.md` for the scope, corrections, and explicit unverified areas.

## Latest visual/runtime repair — V20.9

- Rebuilt the dashboard masthead, balance hero, detail row, chart panels, insight card and goal card into a consistent responsive hierarchy.
- Fixed light-theme wordmark contrast, lime hero text contrast, insight grid sizing and accessible chart-table overflow.
- Added a real passive trackpad response to the chapter navigation, with a timed reset and no `preventDefault`.
- Removed duplicate 3D pointer listeners and unused ambient/pointer variables.
- Aligned the app, manifest theme color and service-worker cache namespace at V20.9; `polish.css` is precached and update checks use `updateViaCache: none`.

## Automated checks

Run from this directory:

```sh
node --check app.js
node --check finance-core.js
node --check quick-boot.js
node --check motion-ui.js
node --check scroll-story.js
node --check liquid-metal.js
node --check sw.js
node --test finance-core.test.cjs project-integrity.test.cjs release-audit.test.cjs
sha256sum -c SHA256SUMS.txt
```

The three dependency-free test suites are dependency-free and run with Node's built-in test runner.

## Data safety

The app continues to use IndexedDB `tapledger-db`, schema version 3. This audit did not open, migrate, clear, or modify any user database. No database migration is part of this package.

## Browser-rendered QA completed in a constrained harness

Chromium rendered the real project HTML, CSS and JavaScript at 1440, 820, 390 and 320 CSS px. A disposable in-memory IndexedDB-compatible shim was used because the environment blocks local HTTP/file navigation. All eight views were checked at desktop and mobile widths; all stayed within the viewport, including 200% root text sizing at 320px. Quick expense, manual entry, NFC route handling, undo, add-another, duplicate-submit protection, chapter progress, trackpad response, theme metadata, keyboard skip link, reduced motion and forced-colors were exercised. The tested runs had zero page errors and zero console errors.

## Still unverified on a real HTTPS origin/device

- Persistent IndexedDB across reloads/browser restarts (the browser harness used a memory shim).
- Service-worker install/update activation and offline relaunch.
- NFC tag read/write and Android URL handling on target hardware.
- Real microphone/speech provider, device haptics, full screen-reader testing, axe audit and Lighthouse performance.
- GitHub Pages deployment and actual public URL.

These remain unverified, not passed.


## V20.7 fine-grain UI pass

- Fixed the scroll chapter progress rail width conflict and consolidated chapter-nav CSS into one authoritative stylesheet.
- Refined sticky offsets, scroll target offsets, mobile topbar sizing and flex/grid overflow safeguards.
- Normalized SVG `viewBox` and explicit button types.
- Updated the service-worker cache namespace to `voltura-platform-v20.7` so the deployed browser fetches the new assets instead of reusing the previous release cache.
- Source-level tests are rerun as part of the V20.7 release. Browser navigation was attempted but blocked by the execution environment; browser QA remains outstanding.

- V20.7 final automated run: 21/21 Node tests passed; all seven JavaScript files passed `node --check`; all six CSS files parsed with zero tinycss2 syntax errors; checksum verification is regenerated for this package.


## V20.9 rendered UI regression run

- Chromium rendered the actual page source at 1440px, 820px, 390px and 320px CSS widths using a test-only in-memory IndexedDB shim.
- No horizontal overflow at 390px or 320px after constraining the off-screen chart data table.
- All desktop/tablet navigation views changed to their intended active view. Mobile dock and More dialog navigation were exercised.
- Quick expense and manual entry form handlers saved a transaction each in the shim.
- Cash-flow chart rendered with seeded test data; scroll chapter progress advanced with page scroll; theme-color switched for light/dark preferences.
- No browser page errors or console errors were observed in the tested Chromium runs.
- This is rendered layout/runtime coverage with a storage shim, not a real IndexedDB, service-worker, NFC or installed-PWA certification.


## V20.9 final interaction regression

- The 3D tilt handler was reduced to one listener per card; unused ambient and pointer CSS variables were removed.
- Passive trackpad wheel input now drives a small perspective tilt on the chapter bar and returns to neutral after the gesture reset and CSS transition.
- The light-theme sidebar wordmark now uses the active text token rather than a near-white hard-coded color.
- Browser harness covered all eight views at 320px, 390px, 820px and 1440px; all views remained within the viewport at tested widths. At 320px, all eight views also remained within the viewport with 200% root text sizing.
- Final source test run: 27/27 Node tests passed; seven JavaScript syntax checks passed; six CSS files parsed without syntax errors; manifest JSON parsed successfully.
