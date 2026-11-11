# VOLTURA v19.5 release notes

## Cinematic composition and Palette A alignment

- Kept the existing V-cut editorial composition, full-screen amount-first NFC capture, clipped signal corner, and flat matte surfaces; retained the mobile-first layout.
- Aligned copied light and dark theme tokens, browser theme color, and manifest colors with Palette A in BRAND.md.
- Advanced the service-worker cache key to oltura-platform-v19.5 so installed clients can fetch the updated presentation files.
- No JavaScript, IndexedDB, transaction arithmetic, migration, import/export, or NFC route code changed. Database remains 	apledger-db, schema version 3; backups and /Tapledger/ routes remain compatible.
- Local syntax/metadata and package checks are recorded in PACKAGE-VERIFICATION.md. Browser rendering, physical-device, accessibility-tool, deployment, and live-site checks are **UNVERIFIED**.

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

## V20 — Local finance features and editorial dashboard (2026-11-11)

Implemented in the separate GitHub upload copy: account position/savings dashboard metrics, category-ledger color treatment, optional payment method and receipt note, confirmable merchant category suggestions, 80%/100% budget states, local unusual-spend coach rules, weekly/monthly reporting, YoY comparison, print and CSV. Added the inline editorial SVG ticker while retaining Palette A and mobile navigation. Added finance helpers and automated Node tests. IndexedDB identity/schema and backup tags remain unchanged; payment method is optional. Service-worker cache version is `voltura-platform-v20.0`.

Validation: 10 Node tests passed; syntax, manifest, local asset, schema and backup-tag static checks passed. Browser workflows, responsive screenshots, accessibility interactions, export/restore in a browser, real-device behavior, and offline runtime remain untested. No publish or deploy.


## v21.0 — Cinematic Palette B review build
- Introduces the approved near-black/cyan/pink/purple visual tokens and matching light theme.
- Applies the approved cyan-to-pink gradient only to primary Save/Add actions.
- Replaces the unrelated bottle slogan with a locally generated monthly finance sentence.
- Updates the PWA theme colours and service-worker cache version.
- Keeps the existing local database schema and integer-paise finance logic unchanged.
- Browser/device visual QA remains outstanding; see QA-REPORT.md.


## V22.0 — Cinematic refinement (2026-11-11)

- Adds restrained perspective/depth accents to the dashboard hero and monthly narrative, without a decorative 3D cube or unrelated portfolio/pricing sections.
- Refines dark surfaces to #050505 / #111111 and uses subtle purple depth, cyan-to-pink primary actions, fine borders and restrained blur. Light theme remains available.
- Adds reduced-motion-aware transitions and a sticky blurred desktop topbar; compact mobile topbar behavior is retained.
- Uses system typography and local CSS only; no Aspekta download, GSAP, external dependencies or network services.
- Service-worker cache version: `voltura-platform-v22.0`. Finance calculations, integer-paise values and IndexedDB schema remain unchanged.
- Browser and Samsung device visual acceptance remains NOT TESTED.


## V22.1 — corrective reliability package

- Persistent startup failure state replaces a transient toast when workspace startup cannot complete.
- Dashboard month narrative gains a progressive-enhancement horizontal ticker with a single accessible text alternative, off-screen pause, and reduced-motion fallback.
- Cinematic effects are brought back within the supplied effects budget: blur only on the sticky desktop topbar, solid fallback, no card/sidebar blur or ambient glow.
- Service-worker cache key updated to `voltura-platform-v22.1`.
- No IndexedDB schema, finance arithmetic, transaction format, backup compatibility, or deployment settings changed.
- Automated verification: 14/14 Node tests and JavaScript syntax checks passed. Browser and physical-device checks remain unverified.
- GSAP/ScrollTrigger is not bundled because its official current licence/package could not be verified from this environment; no remote script was introduced.


## V22.2 — Add-only restore safety

- Backup restore now preserves existing records when imported primary keys collide; new records are added and conflicts/duplicates are reported as skipped.
- Account-name collisions are case-insensitive and imported transaction references use the existing account spelling.
- Existing category budgets are not duplicated during restore.
- Legacy migration/startup no longer reclassifies matching existing transactions.
- IndexedDB database identity and schema remain unchanged (`tapledger-db`, version 3).
- Service-worker cache version: `voltura-platform-v22.2`.
- Automated tests: 22/22 passed. Browser/IndexedDB integration and device checks remain unverified.
