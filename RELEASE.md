# VOLTURA release notes · current v20.9

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


## Dashboard and interaction completion — V20.9

- Reworked the dashboard into three finance-oriented scroll chapters: Cash flow, Spending and Long view. The chapter rail remains sticky, tracks continuous page progress and highlights the active chapter without pinning or hijacking the whole financial workspace.
- Repaired dashboard hierarchy and layout for reporting period, net cash flow, tracked position, savings, cash-flow chart, budget snapshot, category mix, recent activity, local insight and goals.
- Corrected light/dark wordmark contrast and primary balance contrast; the hidden chart data table no longer introduces horizontal overflow.
- Added responsive dock navigation and verified all eight views at desktop and mobile widths, including 320px and 200% root text sizing in the browser harness.
- Trackpad wheel gestures now cause a restrained temporary perspective response on the chapter rail; native scrolling stays passive. Fine-pointer tilt and magnetic button movement are disabled for touch/reduced-motion users.
- Kept the PWA dependency-free and offline-first. GSAP is not bundled; native motion APIs provide the current animation behavior rather than adding a remote dependency.
