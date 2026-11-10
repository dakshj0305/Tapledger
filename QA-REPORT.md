# VOLTURA QA report — historical v18.1 through v19.3

## V19.3 visual redesign pass — 2026-11-11

**Status: IMPLEMENTED LOCALLY; visual acceptance is PENDING browser review.** Do not treat this pass as complete until the redesigned screens have been viewed in a real browser.

- Created `backups/pre-redesign-20261111-030110` before editing. SHA-256 verification passed for all 27 copied application files and icon assets.
- Archived the four existing v19 review screenshots under `review-screenshots/before-redesign-20261111/`. These are copies of the existing dashboard/quick-entry captures, not newly captured browser screenshots. No matching v18.1 screenshot set was found in the verified backup.
- Added `design-system.css` as a presentation-only layer for the application shell, dashboard, ledger, accounts, budgets, goals, analytics, automation, settings, dialogs and quick-entry screens. The layer defines matching light/dark palettes, a consistent type and spacing scale, readable financial figures, restrained surfaces, accessible focus, and mobile layouts.
- Added the stylesheet to `index.html` and the service-worker precache list; versioned the cache as `voltura-platform-v19.3`. Updated the manifest and browser theme colors to match the new palette.
- `app.js` is byte-for-byte identical to the verified pre-redesign backup. Database opening, calculation, transaction, migration, import/export, and NFC route code was not changed.
- PASS: `node --check app.js`, `node --check quick-boot.js`, and `node --check sw.js`.
- PASS: custom CSS delimiter balance check; `manifest.webmanifest` JSON parsing.
- PASS: local HTTP responses returned 200 for `/`, `/?a=1`, `/?i=1`, `/design-system.css`, and `/sw.js`. Static checks confirmed the quick-boot script remains before `app.js`, both quick-entry dialogs remain in the HTML, and v19.3 precaches the new stylesheet.
- PASS: the redesigned CSS and service-worker asset are served from the current project server at `http://127.0.0.1:8000/`.
- NOT VERIFIED: browser-rendered appearance, console errors, 320/390/1440 screenshots, light/dark rendering, or hands-on quick-entry/ledger/account/budget/report/dialog workflows after the redesign. The browser automation surface was unavailable; the bundled screenshot runner stalled and produced no image. No real browser screenshot is claimed.
- NOT RUN: financial workflow interaction tests. Because `app.js` is unchanged, the existing v19 workflow test results below remain historical results for the pre-redesign UI; they do not verify this stylesheet in a browser.
- Data safety: no normal browser profile was opened and no IndexedDB data was read, written, reset, or migrated during this pass.

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

## Recovery validation update — 2026-11-11

- Confirmed and fixed a duplicate-submit race in the manual transaction form, affecting income and other entry-dialog saves. The submit handler now locks synchronously and disables the submit button until the write completes.
- PASS: `node --check app.js`.
- PASS: isolated headless Chrome double-submit check for `?i=1` — two immediate submits produced one income record.
- PASS: isolated fresh-profile browser suite — 100/100 checks, including expense/income NFC routes, amount validation, expense duplicate protection and Undo, integer-paise saves, dashboard totals, Voltura/TapLedger/Cairn restore, invalid backup rejection, skipped-record feedback, keyboard Escape/focus, 320px/390px quick-entry layout, and 200% root-text scaling without horizontal overflow.
- Synthetic browser data used a separate temporary Chrome profile. No personal profile or database was opened, reset, or modified.
- NOT TESTED in this stage: actual browser zoom at 200%, offline reload, service-worker update handoff, physical-device NFC, screen-reader software, and normal-profile IndexedDB contents.

## Local use and responsive/update validation — 2026-11-11

- PASS: local preview responds at `http://127.0.0.1:8123/`; the root, `/?a=1`, and `/?i=1` return the app shell.
- Fixed a confirmed 320px horizontal overflow in the Intelligence and Automations views by constraining the mobile bottom navigation and allowing the breadcrumb to shrink safely.
- PASS: isolated headless Chrome responsive/finance checks, 29/29. Coverage included Overview, Ledger, Accounts, Budgets, Goals, Intelligence, and Automations at 320px, 390px, and desktop width; synthetic paise-based monthly totals; transaction edit/delete; dark theme; reduced-motion and forced-colors emulation; landmarks/labels; and Escape dismissal.
- PASS: service-worker update lifecycle, 6/6 in an isolated temporary profile. The old app remained active while v19.2 downloaded; an open entry dialog deferred update application; explicit update safely reloaded, retained a synthetic IndexedDB record, cleaned the old cache, and served an offline reload.
- PASS: service-worker first install does not display a false “update ready” prompt.
- PASS: `node --check app.js`, `node --check sw.js`, `node --check quick-boot.js`, and manifest JSON parsing.
- The responsive and update tests used disposable browser profiles and synthetic records. The user's normal browser profile and financial records were not opened or changed.
- NOT TESTED: actual screen-reader software, physical NFC/Android link dispatch, actual browser 200% zoom, cross-tab update notification, and the installed PWA update flow on a physical device.

## V19.4 visual transformation pass — 2026-11-11

- Defined the V-cut visual signature: a restrained angular V paired with a clipped signal-color corner, used in the brand mark, dashboard signature, active navigation and cashflow field. The palette is matte graphite / paper with one chartreuse signal and named chart colors.
- Recomposed the overview around a compact editorial heading, a single high-contrast net-movement field, and quieter data surfaces. Amount hierarchy and chart values remain data-driven.
- Changed `?a=1` expense capture and `?i=1` income entry into full-viewport task screens. The workspace is hidden while either route form is open; mobile category chips use a two-column, shrink-safe layout. The form and save logic are the existing form, DOM IDs and handlers.
- Tightened mobile navigation to five destinations and added Accounts to the More view list.
- Applied matching typography, palette and geometry to legal/support pages. Added dark-system presentation for legal pages.
- Persistence impact: none. `app.js` was not modified. IndexedDB remains `tapledger-db`, version 3; stores, keys, indexes, migration marker, paise arithmetic and Voltura/Vellum/Cairn/TapLedger backup behavior are unchanged. No account records or browser financial data were opened or written.
- PASS: `node --check app.js`, `node --check quick-boot.js`, and `node --check sw.js`; `manifest.webmanifest` parses as JSON; local HTTP preview returned 200 for the root shell. Static route URLs `/?a=1` and `/?i=1` resolve to the same app shell.
- NOT VERIFIED: rendered screens, 320/390/1440 layout, themes, form interactions, console, offline launch, and browser accessibility. The connected browser inventory was empty; headless Chrome could not produce a capture in this environment. Existing screenshots predate this pass and are not evidence for it.
- NOT RUN: HTML/CSS validator, end-to-end transaction tests, import/export/legacy restore tests, real offline test, Android NFC/device checks, or deployment. This pass did not use real financial data.
- Network/assets: no external fonts, scripts, APIs or assets were added. Existing CSP, external links, voice-recognition disclosure and same-origin service-worker policy were not changed. The service-worker cache version is now `voltura-platform-v19.4` so clients can fetch the revised shell/styles.
- Source-control note: this project directory has no `.git` metadata, so `git diff`/`git status` are unavailable. The exact edited-file summary is recorded in `RELEASE.md` and the session report.

### Manual visual verification required before acceptance

1. Start the local preview with `RUN-LOCAL-WINDOWS.bat` and use a fresh browser profile with synthetic entries only.
2. Review Overview at 320px, 390px and 1440px in both light and dark appearance. Check headline, net-movement field, chart labels, category mix, recent rows and navigation for clipping/contrast.
3. Open `/?a=1` and `/?i=1` directly. Confirm the full-screen task view appears first, amount focus and decimal keypad behavior are appropriate, 2-column category choices remain inside 320px, save creates one record, and success actions (Undo, Add another, Done) work.
4. Open each navigation view (Ledger, Accounts, Budgets, Goals, Intelligence and Automations); test search, filters, edits and primary actions with synthetic data. Check mobile More includes Accounts.
5. Review import/export using a copied synthetic backup and verify offline launch only after the service worker has cached the shell.
6. Keep browser screenshots in `review-screenshots/after-redesign-20261111/` and add actual findings here. Do not use a normal profile or real financial records for destructive testing.


## V20.0 ChatGPT implementation — source-level verification

### Changes made
- Replaced the previous muted-green visual direction with the V20 Signal / Editorial layer in `design-system.css`.
- Established graphite / mineral-paper / volt-chartreuse colour roles and the V-cut as the single recurring structural motif.
- Reworked the visual treatment of the application shell, navigation, page headings, cash-flow hero, dashboard panels, transaction surfaces, quick-entry controls and responsive navigation.
- Added the icon files referenced by the manifest and service-worker precache list (`icons/voltura-mark.svg`, 192px/512px standard and maskable PNG icons).
- Updated `index.html` theme colour and version label, manifest theme/background colours, service-worker cache version and brand/motif/release documentation.

### Source-level checks
- PASS: `node --check app.js`
- PASS: `node --check sw.js`
- PASS: `node --check quick-boot.js`
- PASS: `design-system.css` parsed with zero CSS parser errors.
- PASS: `manifest.webmanifest` parsed as JSON.
- PASS: every path in the service-worker `APP_FILES` precache list exists in this package.
- PASS: local `href`/`src` references in `index.html` resolve to files in this package.

### Scope and data safety
- `app.js` was not changed.
- IndexedDB database/schema, stores, keys, indexes, migration marker, paise arithmetic, backup/restore logic and NFC quick-entry routing were not changed.
- No deployment, publication, database access or financial-data operation was performed.

### Not verified
- Browser rendering and screenshots could not be captured in this environment; the browser navigation attempt was blocked by the execution environment.
- Therefore actual visual appearance, 320px/390px/1440px layout, dark/light theme rendering, interactions, offline launch, accessibility and physical-device NFC remain **NOT VERIFIED**.
- The source checks above do not substitute for visual and interaction acceptance in a real browser.
