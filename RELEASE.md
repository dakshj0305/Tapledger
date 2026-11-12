# VOLTURA release notes · current v22.0

## Current release — VOLTURA V22.0

V22.0 is a visual/UX repair pass following review of the supplied screen recording. It fixes the lower insight feature copy being squeezed by its long CTA, increases foreground/background contrast, rebuilds dashboard spacing and card hierarchy, improves the category and recent activity layouts, adds explicit light-theme pairs, and makes Budgets and Savings Goals discoverable in mobile More navigation. The local-only project and IndexedDB v3 contract remain unchanged. GSAP is not bundled: npm registry access failed and no local GSAP distribution was available; no CDN was introduced. See `RELEASE-REPORT-V22.md`.

## Quick expense capture

- `quick-boot.js` captures `?a=1`, `?i=1` and legacy `?add=1` as early intent only. After IndexedDB, account loading and event wiring complete, the main app opens the appropriate entry UI and focuses the amount. This avoids the former open-then-reset race.
- The first render includes a static category fallback and an account fallback; the app replaces categories with the eight most-used categories from local expense history and selects the last-used payment account after IndexedDB loads.
- Amounts are parsed as integer paise, allow a maximum of two decimal places, and are capped at ₹10 crore.
- Date and time are editable; merchant and note remain optional.
- Voice fill is optional, requires the existing explicit speech consent flow, and never saves without review.
- Save is guarded against double submission. The confirmation offers an approximately five-second Undo, Add another, and Done / View dashboard.
- `history.replaceState` removes the action query after the app handles it, preventing refresh from repeating the action.

## Hosting correction

- Removed the `CNAME` for unregistered `voltura.finance`.
- Canonical metadata now points to `https://dakshj0305.github.io/Tapledger/`.
- Manifest `start_url` and `scope` are relative to the GitHub Pages project path; app shortcuts point to `?a=1` and `?i=1`.

## Compatibility and limits

- IndexedDB remains `tapledger-db`, version 3. No schema migration was introduced. New quick transactions add an optional `time` property; older records remain valid.
- JSON exports are tagged `Voltura`. Restore accepts `Voltura`, `Vellum`, `Cairn` and `TapLedger`.
- The tag stores a URL only; the browser opens the URL. The installed PWA may handle the link only when the platform/browser captures its scope; this is **UNVERIFIED** on the target Galaxy S23 FE until tested.
- Offline operation begins only after a successful online cache installation; first-ever offline load is not possible.
- The user's previously scanned tag was identified by TagInfo as MIFARE Ultralight (MF0ICU1); writing failed for `TEST`. The source package does not claim that tag is writable or suitable.

## What was not verified

No real Android/NFC write or tap test, TalkBack/NVDA test, Lighthouse run, axe/WAVE audit, actual offline network test or GitHub Pages deployment was executed in this local build. See QA-REPORT.md.

- Added a parser-time `quick-boot.js` opener for `?a=1` and `?i=1`, so the expense sheet or income dialog is shown before the main app finishes initializing; saving remains disabled until the ledger is ready.
- Preserved quick-entry time when an existing transaction is edited and exposed recorded time in recent activity and the ledger.
- Removed the unregistered `voltura.finance` CNAME and aligned GitHub Pages metadata and manifest scope with `/Tapledger/`.
- Updated dark-theme border contrast token to `#71828D`.


## Dashboard and interaction completion — V20.9

- Reworked the dashboard into three finance-oriented scroll chapters: Cash flow, Spending and Long view. The chapter rail remains sticky, tracks continuous page progress and highlights the active chapter without pinning or hijacking the whole financial workspace.
- Repaired dashboard hierarchy and layout for reporting period, net cash flow, tracked position, savings, cash-flow chart, budget snapshot, category mix, recent activity, local insight and goals.
- Corrected light/dark wordmark contrast and primary balance contrast; the hidden chart data table no longer introduces horizontal overflow.
- Added responsive dock navigation and verified all eight views at desktop and mobile widths, including 320px and 200% root text sizing in the browser harness.
- Trackpad wheel gestures now cause a restrained temporary perspective response on the chapter rail; native scrolling stays passive. Fine-pointer tilt and magnetic button movement are disabled for touch/reduced-motion users.
- Kept the PWA dependency-free and offline-first. GSAP is not bundled; native motion APIs provide the current animation behavior rather than adding a remote dependency.


## V21.1 — Editorial workspace redesign and safe core repairs (2026-11-12)

### Visual and interaction redesign

- Added `voltura-visual-system.css` as a final, local-only design layer. The redesign intentionally resolves the prior global flat-mode `!important` cascade that disabled shadows, backdrop blur, and dimensional surfaces.
- Introduced a dark-first charcoal/forest/lime visual system with an explicit light palette, tabular financial numerals, stronger dashboard hierarchy, larger reporting typography, redesigned sidebar, glass chapter rail, cash-flow hero, cards, category chart and goal/insight surfaces.
- Limited dashboard glass treatment to the navigation rail, chapter rail and balance hero; quick entry and inputs remain opaque.
- Rebuilt mobile navigation as Overview, Ledger, Add, Intelligence and More; secondary destinations remain available in More.
- Added Edit and Delete actions to each recent dashboard transaction, wired to the existing transaction editor and confirmation-based delete flow.
- Added visual-viewport sizing for Android keyboard changes and hid the mobile dock while the keyboard is open.

### Core and data-safety repairs

- Changed JSON restore from blind `put()` operations to a single read/write IndexedDB transaction using `add()` after reading existing keys. Existing transaction IDs win; duplicate backup IDs are skipped; budget category collisions are skipped; account-name matching is case-insensitive; account references in imported transactions are normalized to the existing canonical account name. A write failure aborts the entire restore transaction.
- Changed legacy migration to import only when the migration marker is not set and to skip matching transaction IDs without rewriting their category, account, source or timestamps.
- Changed account initialization to create missing account records without rewriting existing transaction account references.
- Changed `quick-boot.js` to capture shortcut intent only; the app opens the quick-entry UI once after IndexedDB, account state and event wiring are ready. This avoids the early-open / later-reset race. `?a=1`, `?i=1` and `?add=1` remain supported.
- Added `visualViewport` resize/scroll handling for keyboard-aware quick-entry sizing.
- Preserved `tapledger-db`, IndexedDB version 3, existing stores, key paths, indexes, integer-paise calculations and accepted backup tags.

### Release and verification

- Updated service-worker cache identity to `voltura-platform-v21.1` and precached the new visual stylesheet.
- Updated app build label and manifest/theme metadata.
- Automated source tests: 34 passed. JavaScript syntax checks passed. ZIP and live-browser checks remain separate release gates.
- No framework, build system, remote dependency, remote font, CDN, analytics or network service was added. GSAP and the optional pinned scroll scene were not added.
- No files were deleted. No IndexedDB data was accessed, migrated or modified in a real user browser.


## V21.1.1 — accessibility fallback cascade repair (2026-11-12)

- Corrected the unsupported-backdrop-filter fallback to use `@supports`, not an invalid `@media` feature query.
- Moved the final glass fallback rules after the visual cascade so later `!important` design overrides cannot re-enable blur in browsers without support.
- Corrected reduced-transparency colours so the persistent dark navigation remains readable in the light theme; the chapter rail switches to a solid theme surface.
- Put forced-colors rules last so they take precedence over later insight text styling.
- Advanced the visible build label and service-worker cache namespace to `V21.1.1` / `voltura-platform-v21.1.1`.
- Added a regression test for fallback ordering and color handling. No app data, IndexedDB schema, financial calculations, stored transaction properties or user records are changed by this patch.
