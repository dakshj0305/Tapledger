# VOLTURA v18.1 QA report

## Source-level checks completed

- Confirmed database name `tapledger-db`, database version 3 and migration marker `migration-v3-complete` are unchanged.
- Confirmed `?a=1`, legacy `?add=1` and `?i=1` remain recognised; action query is removed with `history.replaceState`.
- Added parser-time quick-boot dialog activation for `?a=1` and immediate amount focus; submission stays disabled until IndexedDB and the existing ledger are ready.
- Added integer-paise validation, ₹10 crore cap, two-decimal validation, category ranking from local history, last-used account, editable date/time, optional merchant/note and optional voice prefill. Existing transaction edits preserve the optional time.
- Added in-session duplicate-save guard, five-second Undo window, Add another and View dashboard actions.
- Confirmed new backups use `app: "Voltura"`; restore accepts Voltura, Vellum, Cairn and TapLedger tags. CSV uses quote escaping and prefixes cells whose first meaningful character is `=`, `+`, `-` or `@` (including leading control/space characters).
- Removed custom-domain `CNAME` and updated canonical/manifest paths for the GitHub Pages project URL.
- Added `quick-boot.js` to the service-worker cache and versioned cache as `voltura-platform-v18.1`.
- No localStorage/sessionStorage/cookie APIs, analytics, ad scripts, remote fonts, CDN scripts, iframe embeds, WebSocket or Beacon calls were found in the app source. The service worker uses same-origin fetch for the application shell only.
- No IndexedDB version migration was introduced; existing database schema is preserved.

## Contrast token calculations

| Pair | Ratio | Result against stated target |
|---|---:|---|
| Light text / background | 16.31:1 | Pass 4.5:1 |
| Light muted / background | 6.48:1 | Pass 4.5:1 |
| Light positive / background | 5.90:1 | Pass 4.5:1 |
| Light negative / background | 5.94:1 | Pass 4.5:1 |
| Light warning / background | 5.56:1 | Pass 4.5:1 |
| Light focus / background | 5.40:1 | Pass 3:1 |
| Light border / background | 4.46:1 | Pass 3:1 |
| Dark text / background | 16.31:1 | Pass 4.5:1 |
| Dark muted / background | 11.05:1 | Pass 4.5:1 |
| Dark positive / background | 9.93:1 | Pass 4.5:1 |
| Dark negative / background | 8.01:1 | Pass 4.5:1 |
| Dark warning / background | 10.95:1 | Pass 4.5:1 |
| Dark focus / background | 10.20:1 | Pass 3:1 |
| Dark border / background | 4.54:1 | Pass 3:1 |
| Dark border / surface | 3.77:1 | Pass 3:1 |
| Dark border / raised surface | 3.18:1 | Pass 3:1 |
| Text / volt-lime primary | 15.75:1 | Pass 4.5:1 |

Ratios are calculated for declared token pairings. They are not a complete browser-state audit of every legacy hard-coded colour, hover, disabled, placeholder, chart or component pair. Those rendered combinations remain **UNVERIFIED** and need automated and manual testing.

## Test cases still requiring execution

- `?a=1` and `?i=1` quick-route startup on Android Chrome and desktop Chrome.
- Rapid double tap on Save; exactly one transaction should exist.
- Save then Undo within five seconds; saved transaction should be removed.
- Undo after timeout; button should be disabled and transaction retained.
- Offline after service-worker installation; first-ever visit with airplane mode should fail or show the host/browser network failure.
- Amounts `0`, `0.01`, `1.999`, `100000000`, `100000000.01`, scientific notation and empty input.
- Edit/delete, transfers, budgets, goals, import/export, legacy migration and delete-all.
- Haptics unsupported, reduced motion, forced-colors, keyboard-only use and screen-reader focus/announcement flow.
- GitHub Pages deployment from the `/Tapledger/` project path and PWA manifest shortcut scope.

## Items not verified in this environment

- Real NFC tag write/read and Android link dispatch on a Galaxy S23 FE. The user-supplied tag failed a `TEST` write; test a known-writable NFC Forum Type 2 tag.
- Whether Android launches the browser or installed PWA for the NFC URL. This depends on the OS/browser link-handling configuration.
- TalkBack/NVDA, axe, WAVE and Lighthouse; 320 px through 4K layout; 200% zoom; throttled-network/offline test.
- Every contrast combination in every interactive state.
- GitHub Pages headers and host-side log retention. GitHub Pages does not provide this project with control of all response headers.

## Legal review required

Have a lawyer qualified in Indian law review privacy, terms, DPDP Act 2023 / implementing rules and IT Act 2000 applicability, any Consumer Protection Act 2019 or E-Commerce Rules 2020 obligations, publisher identity/contact, children and grievance handling, and jurisdiction wording. Applicability depends on the publisher's status, audience, distribution and any future accounts, payments, ads or server features. Do not treat this technical report as a compliance certification.

- Parser-time quick boot now opens the expense sheet for `?a=1` and the income dialog for `?i=1`; saving is held until IndexedDB initialization and form wiring finish. Both routes still need a real-browser check.
