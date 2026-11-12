# VOLTURA / Tapledger — Deep source audit

Audit target: `Tapledger-scroll-experience.zip` (the supplied archive in this review)
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
