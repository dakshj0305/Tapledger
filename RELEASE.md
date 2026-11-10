# VOLTURA v19.3 release notes

## v19.3 visual redesign

- Added a cohesive responsive design layer across the existing dashboard, navigation, ledger, quick entry, accounts, budgets, reports, dialogs and settings.
- Added coordinated light and dark theme tokens, clearer financial typography, consistent component sizing and mobile layouts.
- Added `design-system.css` to the service-worker precache and advanced the cache to `voltura-platform-v19.3`.
- No transaction, calculation, IndexedDB, migration, import/export or NFC route logic changed. Browser visual review and 320/390/1440 screenshots remain **UNVERIFIED**.

## v19.2 recovery update

## v19.2 recovery update

- Manual transaction saves now lock synchronously to prevent duplicate income or expense records from repeated submission.
- Service-worker updates download and cache while the current app stays usable. An accessible prompt lets the user apply a waiting update; applying is blocked while a dialog or save is active. Other open tabs are never force-reloaded.
- The IndexedDB database name, schema version, stores, keys, indexes, migration marker, and backup tags are unchanged.
- `/Tapledger/`, `?a=1`, and `?i=1` remain supported.

## v18.1 baseline release notes

## Quick expense capture

- `?a=1` opens the expense sheet at document startup, before the main app finishes initializing; the amount receives focus. `?i=1` still opens the income form.
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

## V19.4 — V-cut product redesign

- `index.html`: dashboard headline/copy and signature; mobile More navigation now includes Accounts.
- `design-system.css`: shared palette, dark-theme tokens, overview composition, full-viewport expense/income task screens, compact mobile navigation, and responsive category selection.
- `legal.css`: supporting page typography, motif, matte surfaces and dark-system palette.
- `manifest.webmanifest`: updated theme/background colors; existing `/Tapledger/` relative routes and shortcut URLs retained.
- `sw.js`: cache version advanced to `voltura-platform-v19.4` so the current shell/styles can update safely.
- `QA-REPORT.md`, `MOTIF-SYSTEM.md`: design and verification notes.
- No changes to `app.js`, IndexedDB, transaction math, NFC launch handling, restore/export logic, or data stores. No deployment or publication performed.
- Browser visual acceptance remains **NOT VERIFIED**. See the current QA report for actual checks and limitations.


## V20.0 — Signal / Editorial redesign

- Re-art-directed the application around one V-cut signature and a stronger loud-minimalist identity: graphite, mineral paper and a single chartreuse signal.
- Reworked the visual hierarchy across the shell, navigation, page headings, dashboard cashflow field, panels, actions, transaction surfaces and quick-entry controls.
- Tightened the mobile composition and retained a five-destination bottom navigation with the More entry point.
- Added the missing local SVG and PNG icon assets referenced by the manifest and service-worker precache list.
- Updated the app theme colour and service-worker cache to `voltura-platform-v20.0`.
- No changes to `app.js`, IndexedDB, financial arithmetic, transaction structures, migrations, backup tags, NFC route logic or deployment base path.
- Browser rendering and visual screenshot inspection are not available in this execution environment; visual acceptance remains **NOT VERIFIED**. Source-level checks are recorded separately in `QA-REPORT.md`.


## V21 — Mineral Botanical refinement

- Added `voltura-atmosphere.css` as a presentation-only layer after the existing design system.
- Shifted the primary light theme to mineral paper, pale sage, botanical green and muted natural data accents.
- Reworked the shell, navigation, typography and balance hero toward a lighter, more substantial editorial feel.
- Retained the V20 application logic and bumped the service-worker cache to V21.
- Browser rendering and interaction verification remain pending.


## V22 — Field Notes visual refinement

See `FEATURE-INVENTORY-V22.md` for the source-derived feature inventory, scope distinctions and verification status. Added `voltura-field-notes.css`, linked after the prior visual layers, and bumped the service-worker cache to V22. Existing `app.js` is unchanged.
