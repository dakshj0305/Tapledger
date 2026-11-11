# VOLTURA QA report â€” historical v18.1 through v19.3

## V19.3 visual redesign pass â€” 2026-11-11

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
- Added integer-paise validation, â‚¹10 crore cap, two-decimal validation, category ranking from local history, last-used account, editable date/time, optional merchant/note and optional voice prefill. Existing transaction edits preserve the optional time.
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

## Recovery validation update â€” 2026-11-11

- Confirmed and fixed a duplicate-submit race in the manual transaction form, affecting income and other entry-dialog saves. The submit handler now locks synchronously and disables the submit button until the write completes.
- PASS: `node --check app.js`.
- PASS: isolated headless Chrome double-submit check for `?i=1` â€” two immediate submits produced one income record.
- PASS: isolated fresh-profile browser suite â€” 100/100 checks, including expense/income NFC routes, amount validation, expense duplicate protection and Undo, integer-paise saves, dashboard totals, Voltura/TapLedger/Cairn restore, invalid backup rejection, skipped-record feedback, keyboard Escape/focus, 320px/390px quick-entry layout, and 200% root-text scaling without horizontal overflow.
- Synthetic browser data used a separate temporary Chrome profile. No personal profile or database was opened, reset, or modified.
- NOT TESTED in this stage: actual browser zoom at 200%, offline reload, service-worker update handoff, physical-device NFC, screen-reader software, and normal-profile IndexedDB contents.

## Local use and responsive/update validation â€” 2026-11-11

- PASS: local preview responds at `http://127.0.0.1:8123/`; the root, `/?a=1`, and `/?i=1` return the app shell.
- Fixed a confirmed 320px horizontal overflow in the Intelligence and Automations views by constraining the mobile bottom navigation and allowing the breadcrumb to shrink safely.
- PASS: isolated headless Chrome responsive/finance checks, 29/29. Coverage included Overview, Ledger, Accounts, Budgets, Goals, Intelligence, and Automations at 320px, 390px, and desktop width; synthetic paise-based monthly totals; transaction edit/delete; dark theme; reduced-motion and forced-colors emulation; landmarks/labels; and Escape dismissal.
- PASS: service-worker update lifecycle, 6/6 in an isolated temporary profile. The old app remained active while v19.2 downloaded; an open entry dialog deferred update application; explicit update safely reloaded, retained a synthetic IndexedDB record, cleaned the old cache, and served an offline reload.
- PASS: service-worker first install does not display a false â€œupdate readyâ€ prompt.
- PASS: `node --check app.js`, `node --check sw.js`, `node --check quick-boot.js`, and manifest JSON parsing.
- The responsive and update tests used disposable browser profiles and synthetic records. The user's normal browser profile and financial records were not opened or changed.
- NOT TESTED: actual screen-reader software, physical NFC/Android link dispatch, actual browser 200% zoom, cross-tab update notification, and the installed PWA update flow on a physical device.

## V19.4 visual transformation pass â€” 2026-11-11

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

## V20 complete application pass â€” 2026-11-11

**Implementation status: implemented in this copy. Browser acceptance remains pending.**

- Dashboard now renders tracked net account position, monthly savings and savings rate alongside existing current-month income, expense and net cash flow. Account position excludes the historical archive account.
- Added category-specific chart colors, optional payment method on expense/income records and ledger rows, and receipt-note labeling. No IndexedDB store, key path, index, database name, version or existing record shape requirement changed; the new transaction property is optional.
- Added merchant suggestions from same-name local transaction history with deterministic name rules as fallback. The category only changes after the user activates the confirmation button.
- Added category and overall budget labels for 80% warning and 100% exceeded states.
- Added unusual-expense coach notices using expense-only, same-category prior transactions from the rolling 12 months. Five earlier transactions are required; the current amount must be strictly greater than 150% of their average. Math uses exact integer cross-multiplication.
- Added Monthly reports with category and calendar-week spending totals, month-specific income/expense/net summary, year-over-year expense comparison when both months contain expense records, CSV export, and report-only print layout.
- Added inline SVG bottle artwork and editorial ticker sentence; native CSS motion is disabled under `prefers-reduced-motion`. Existing Palette A tokens remain in use.
- Kept `?a=1` and `?i=1`, parser-time dialog behavior, amount focus, paise validation, duplicate-save guard, quick-save confirmation, five-second Undo, Add another and Done actions. No URL/query handling or quick-form storage format was changed.
- Advanced service-worker cache version to v20 and added `finance-core.js` to the app shell cache. Relative asset and manifest routes remain compatible with `/Tapledger/`.

### Checks performed

- **PASSED:** `node --check app.js`, `finance-core.js`, `quick-boot.js`, and `sw.js`.
- **PASSED:** `node --test tests/*.test.cjs` â€” 11 tests passed, 0 failed. Tests cover budget thresholds, merchant suggestion history, unusual-spend rule/window, weekly totals, asset/manifest routes, schema/store invariants, legacy backup tags, quick-route wiring, same-origin offline shell and CSS delimiters.
- **PASSED:** Manifest parses as JSON; all local HTML `./` asset references resolve; no remote scripts, stylesheets, CSS imports or hardcoded external fetches were found.
- **PASSED:** Source review confirms backup export tag `Voltura`, additive restore, legacy `Vellum`/`Cairn`/`TapLedger` tags, and optional `paymentMethod` compatibility.
- **PASSED:** Source review confirms DB `tapledger-db`, version 3 and existing stores/indexes.
- **NOT TESTED:** expense/income form interaction, invalid amounts in browser, duplicate submission, Undo/Add another/Done interaction, actual backup file export/import merge, budget rendering, report rendering, and account/category defaults in a browser.
- **NOT TESTED:** requested viewport sizes 320, 360, 390, 430, 768, 1024 and 1440; Samsung Galaxy S23 FE; keyboard/screen reader; browser reduced-motion; actual offline first load/relaunch.
- Browser UI tooling was unavailable (`cua` reported no browser/app surfaces). Firefox headless was present but failed to start its tab subprocess and produced no screenshot. Therefore no visual/browser pass is claimed. Real browser data was not opened or changed.
- **NOT TESTED:** legal review, real-device NFC behavior, GitHub Pages publishing and deployment. No commit, push, merge or deployment occurred.


- **PASSED:** SHA-256 comparison against the pre-copy baseline matched all 23 original source-root files. The comparison report is included as `ORIGINAL-SOURCE-HASH-VERIFICATION.md`; only the separate upload copy was edited.
- **PASSED:** ZIP packaging verification: application source files and both test scripts are at archive root; only `icons/` is nested. Temporary browser profile/cache files are excluded.


## Final browser and visual QA pass — 2026-11-11

### Browser availability

- Edge was found at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`; Chrome was found at `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- **BLOCKED:** launching Edge headless with an isolated temporary profile and local debugging port was rejected by the automatic sandbox review because `sandbox_approval` is disabled. The available CUA browser/app inventory is empty. No browser was launched and no screenshot was captured. No browser profile or finance database was accessed in this pass.
- The local server mapped the project to `/Tapledger/`. **PASSED:** HTTP GET returned 200 for `/Tapledger/`, `?a=1`, `?i=1`, `finance-core.js`, `sw.js`, and `manifest.webmanifest`. This confirms route serving only, not browser rendering.

### Requested workflow status

1. Dashboard rendered correctly — **NOT TESTED** (HTTP response only).
2. Expense quick-entry `?a=1` — **NOT TESTED** (dialog/focus not observed).
3. Income quick-entry `?i=1` — **NOT TESTED** (dialog/focus not observed).
4. Valid transaction submission — **NOT TESTED** in browser.
5. Invalid amount validation — **NOT TESTED** in browser.
6. Duplicate submission prevention — **NOT TESTED** in browser.
7. Save confirmation — **NOT TESTED** in browser.
8. Undo — **NOT TESTED** in browser.
9. Add another — **NOT TESTED** in browser.
10. Done — **NOT TESTED** in browser.
11. Category selection and ledger filtering — **NOT TESTED** in browser.
12. Budget thresholds — **PASSED** helper tests at 80% and 100%; rendered budget cards **NOT TESTED**.
13. Unusual-spend rule — **PASSED** helper tests for five prior transactions, strict >150% threshold and rolling 12-month window; rendered coach card **NOT TESTED**.
14. CSV export — **NOT TESTED** in browser.
15. Backup export and additive restore with fabricated data — **NOT TESTED** in browser. Static backup tag and additive-write checks passed in the existing test suite.
16. Navigation and dialog behavior — **NOT TESTED** in browser.

### Responsive and motion status

All requested viewport checks (320, 360, 390, 430, 768, 1024, 1440 px), overflow, layout, touch targets, charts, typography, dialog sizing, ticker motion, 3D-style artwork motion and reduced-motion rendering are **NOT TESTED**. No visual pass is claimed. No application bug was confirmed, so no application code was changed in this QA pass.

### Final checks

- **PASSED:** all 11 existing automated Node tests.
- **PASSED:** JavaScript syntax checks, manifest JSON parsing, local asset checks and existing ZIP layout/decompression checks.
- **NOT TESTED:** formal browser HTML validation, accessibility interaction checks, offline runtime and real-device behavior.
- Original source root was not edited. No commit, push, merge or deployment was performed.


## Cinematic Palette B final package audit (2026-11-11)

### Changes in this package
- Replaced the third-party bottle slogan and artwork with an original, locally data-driven monthly summary sentence. The sentence uses the selected month’s recorded entry count, income, expenses and leading expense category; empty-state copy appears when there are no entries.
- Applied approved Palette B tokens: #050505 / #111111 dark surfaces, #06B6D4 cyan, #EC4899 pink and #7C3AED purple; added a warm neutral light theme.
- Restricted the cyan-to-pink gradient to primary Save/Add controls through `--action-gradient`.
- Reworked the overview heading, balance surface, account/savings row, editorial summary rail and lower panel styling.
- Updated manifest theme/background colours and service-worker cache version to `voltura-platform-v21.0`.
- Moved Node tests into `tests/` so their relative imports and project-root checks resolve correctly.
- Preserved IndexedDB name/version and transaction storage model; no schema migration was introduced.

### Verification
- PASSED: `node --check app.js`
- PASSED: `node --check sw.js`
- PASSED: `node --check finance-core.js`
- PASSED: `node --test tests/*.test.cjs` — 11/11 tests
- PASSED: manifest JSON parse and local icon references
- PASSED: test coverage confirms IndexedDB identity/version and expected stores/indexes remain present
- PASSED: project integrity test confirms local asset references and unique application IDs
- NOT TESTED: browser-rendered visual inspection, real expense/income interactions, responsive screenshot inspection, screen-reader audit, physical NFC, real-device installation and offline relaunch.

This is a static and automated-code audit, not a claim of full browser/device QA or production readiness.


## Cinematic refinement follow-up (2026-11-11)

- Added restrained spatial depth to the dashboard hero and monthly narrative using CSS perspective and fine accent rings; no rotating cube or portfolio sections were introduced.
- Refined the dark theme to the requested #050505 background and #111111 surfaces, with white/gray text, cyan/pink actions and subtle purple functional glow. The light theme remains available.
- Added restrained 8px backdrop blur to navigation/surfaces, sticky desktop topbar treatment, subtle hover transitions and reduced-motion handling. Mobile topbar remains non-sticky to preserve compact mobile behavior.
- Kept system fonts; Aspekta is not bundled or fetched. No GSAP, external scripts, remote fonts, tracking or network services were added.
- Bumped service-worker cache to `voltura-platform-v22.0`. No finance logic or IndexedDB schema changes.

Verification: 11/11 Node tests pass; JavaScript syntax checks pass. Browser-rendered appearance, mobile screenshots and real-device behavior remain NOT TESTED.


## V22.1 corrective reliability pass — 2026-11-11

**Scope:** audited the V22 package in an isolated copy. The original project, live origin, and user IndexedDB were not accessed. No schema or transaction format changes were made.

### Findings and changes

| Finding | Severity | Change | Status |
|---|---|---|---|
| Startup storage/open failure was reported only through a transient toast, leaving an empty-looking workspace underneath | High | Added a persistent, accessible startup failure screen; open dialogs close and the workspace is hidden until reload/retry | FIXED IN SOURCE; runtime failure simulation NOT TESTED |
| Cinematic refinement applied blur to the sidebar and content cards and added ambient glow, exceeding the supplied effects budget | Medium | Removed blur from sidebar/cards and removed ambient shadows; retained only an 8px sticky desktop topbar blur with a solid fallback | FIXED IN CSS; visual rendering NOT TESTED |
| Monthly sentence was static despite the approved horizontal editorial treatment | Medium | Added a dashboard-only duplicated visual ticker, a single screen-reader text alternative, off-screen pause via IntersectionObserver, and reduced-motion/static fallback | IMPLEMENTED IN SOURCE; runtime motion NOT TESTED |
| Update button displayed a question mark while updating | Low | Corrected status copy to an ellipsis | FIXED IN SOURCE |

### Reference adaptation decisions

| Reference element | Decision | Reason
|---|---|---|
| Cinematic near-black palette, high-contrast type, cyan/pink primary action, restrained purple accent | ADAPTED | Kept the finance-first hierarchy and light theme; gradient remains limited to primary actions |
| Sticky glass navigation | ADAPTED | 8px blur only on sticky desktop topbar, with solid fallback; no blur on cards/sidebar or quick-add |
| 3D rotating cube | DEFERRED | Explicitly rejected for dashboard/quick-add due battery and information hierarchy |
| Portfolio case studies, pricing cards, calculator, bottle slogan and imagery | REJECTED | Unrelated to a private single-user finance ledger and includes third-party brand copy |
| Horizontal month-in-a-sentence motion | ADAPTED | CSS transform ticker, no scroll hijacking, pauses off-screen and is static for reduced motion; the real sentence is computed from local data |
| GSAP / ScrollTrigger | NOT INCLUDED | The current environment could not retrieve the official current licence/package source (npm metadata request timed out). The supplied brief requires licence verification and a self-hosted pinned build before use. A dependency was not guessed or remotely loaded; the ticker uses local CSS/IntersectionObserver instead. Revisit only after the official licence and pinned package can be verified. |
| Third-party plugins/services | NOT CONNECTED | Replit/TinyFish-style hosted tools would move code or browser activity outside this local project and are not required for its static PWA workflow. No plugin was connected, no external API was added, and no finance data was shared. |

### Verification

- **PASSED:** `node --check app.js`, `quick-boot.js`, `finance-core.js`, `sw.js`.
- **PASSED:** `node --test tests/*.test.cjs` — 14 tests, 0 failures. Three new tests cover persistent startup failure handling, accessible/off-screen ticker behavior and the restricted effects budget.
- **PASSED:** existing tests still cover budget thresholds, merchant suggestions, unusual-spend rule/window, weekly totals, `/Tapledger/` asset references, IndexedDB schema identity, legacy backup tags, quick routes and local-only service-worker wiring.
- **PASSED:** manifest JSON parse, local HTML asset resolution, CSS brace balance, ZIP integrity and package root layout.
- **PASSED:** no new external script, font, stylesheet, API, analytics or tracking dependency was added.
- **NOT TESTED:** browser rendering, because Playwright navigation to the local server returned `ERR_BLOCKED_BY_ADMINISTRATOR`; direct headless Chromium did not complete within 15 seconds. No screenshot or runtime interaction is claimed.
- **NOT TESTED:** forced-colors, 200% text zoom, screen-reader announcements, reduced-motion behavior in a browser, offline relaunch, physical NFC and Samsung Galaxy S23 FE.
- **NOT TESTED:** runtime simulation of IndexedDB being unavailable or blocked.
- **NOT TESTED:** GSAP integration; it is intentionally absent pending official licence/package verification.

### Data and deployment safety

- IndexedDB remains `tapledger-db`, version 3; stores, keys, indexes, and migration marker are unchanged.
- No transaction arithmetic, account calculation, import/export, backup tag, NFC route, or persistence function was intentionally changed.
- Service-worker cache advanced to `voltura-platform-v22.1` for the HTML/CSS/JS changes.
- No commit, push, merge, GitHub Pages deployment, or custom-domain change was performed.

### Exact source diff summary (V22.0 → V22.1)

- `index.html`: added the persistent startup failure surface and decorative ticker host while retaining the accessible paragraph; no finance fields or dialog IDs removed.
- `app.js`: added the progressive-enhancement ticker renderer and persistent startup-failure handling; corrected update-progress wording.
- `design-system.css`: appended a corrective override to remove excess blur/glow and provide ticker, fallback and error-screen styling.
- `sw.js`: cache key changed from `voltura-platform-v22.0` to `voltura-platform-v22.1`.
- `tests/project-integrity.test.cjs`: added three source-integrity tests.

This is a deeper source and automated test pass, not a claim that every possible bug is eliminated or that browser/device acceptance has passed.


### V22.1 colour contrast calculations

Calculated from the final CSS token values using WCAG relative luminance (sRGB). Text and focus roles are compared with the page background; essential borders are compared with their underlying surfaces. These calculations do not replace a rendered component audit.

| Theme / role | Foreground | Background | Ratio | Result |
|---|---|---|---:|---|
| Light primary text | `#17141D` | `#F4F2F7` | 16.37:1 | PASS |
| Light muted text | `#625C6B` | `#F4F2F7` | 5.79:1 | PASS |
| Light accent | `#7C3AED` | `#F4F2F7` | 5.13:1 | PASS |
| Light positive | `#006B5B` | `#F4F2F7` | 5.87:1 | PASS |
| Light negative | `#C12F68` | `#F4F2F7` | 4.88:1 | PASS |
| Light warning | `#8A5A00` | `#F4F2F7` | 5.33:1 | PASS |
| Light focus | `#6D28D9` | `#F4F2F7` | 6.39:1 | PASS |
| Light border | `#8B8492` | `#F4F2F7` | 3.25:1 | PASS for non-text boundary |
| Dark primary text | `#FFFFFF` | `#050505` | 20.38:1 | PASS |
| Dark muted text | `#999999` | `#050505` | 7.15:1 | PASS |
| Dark accent | `#A78BFA` | `#050505` | 7.49:1 | PASS |
| Dark positive | `#67E8C0` | `#050505` | 13.47:1 | PASS |
| Dark negative | `#FDA4AF` | `#050505` | 10.78:1 | PASS |
| Dark warning | `#FCD34D` | `#050505` | 14.13:1 | PASS |
| Dark focus | `#67E8F9` | `#050505` | 14.06:1 | PASS |
| Dark border | `rgba(255,255,255,.38)` | `#050505` | 3.44:1 | PASS for non-text boundary |
| Dark border | `rgba(255,255,255,.38)` | `#111111` | 3.54:1 | PASS for non-text boundary |
| Primary button text | `#08070B` | `#06B6D4` gradient stop | 8.27:1 | PASS |
| Primary button text | `#08070B` | `#EC4899` gradient stop | 5.69:1 | PASS |

The border alpha is intentionally more visible than the earlier V22.0 value so essential component edges remain discernible. Colour must not be the only income/expense signal; labels and signed values remain in the UI.


## V22.2 isolated restore-safety reconstruction — 2026-11-11

**Status: IMPLEMENTED IN A SEPARATE WORKING COPY; automated checks passed. Browser and IndexedDB integration remain unverified.**

- Changed JSON restore from unconditional primary-key `put()` replacement to add-only planning. Existing transaction, budget, goal and account keys are retained; incoming conflicts and duplicate keys within a backup are skipped and included in the user-facing count.
- Account collisions are checked case-insensitively. Imported transaction account references are normalized to the existing account spelling so they continue to resolve to the existing account record.
- Budget restore checks both primary-key collisions and category collisions to avoid duplicate category budgets.
- Legacy migration no longer rewrites a matching existing transaction. The `ensureAccounts()` startup path no longer mutates legacy transaction account classifications.
- IndexedDB remains `tapledger-db`, version 3; stores, key paths, indexes and migration marker name are unchanged. No live browser profile was opened or modified.
- Added unit tests for add-only collision handling, duplicate backup keys, case-insensitive account matching, restore wiring, migration non-rewrite behaviour, and cache versioning.
- Advanced the service-worker cache name to `voltura-platform-v22.2` so updated application code is not served from the previous V22.1 cache.
- PASS: `node --check app.js`; `node --check finance-core.js`; `node --check sw.js`.
- PASS: `node --test tests/*.test.cjs` — 22 tests passed.
- NOT TESTED: real IndexedDB transaction rollback/commit in a browser, restore UI against fabricated IndexedDB records, actual backup round-trip, Android NFC, browser rendering, screen readers, performance and offline first-install.
- No commit, push or deployment was performed.
- PASS: controlled in-memory fault-injection tests reproduced the old overwrite behaviour and verified the add-only planner preserves the on-device record while importing a new record. A second fault case verified that a matching user-edited legacy transaction is not reclassified. These are model tests, not live IndexedDB integration tests.
- PASS: isolated local HTTP server returned 200 for `/`, `/?a=1`, `/?i=1`, `index.html`, `app.js`, `finance-core.js`, `sw.js`, `manifest.webmanifest`, `design-system.css` and `quick-boot.js`.
