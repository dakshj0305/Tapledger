# VOLTURA V21.1.1 — Final release report

- Product: VOLTURA local-first personal finance PWA
- Build ID: `VOLTURA-21.1.1-20261112`
- Date: 2026-11-12
- Source baseline: user-confirmed `Tapledger-v20.9-complete(1).zip`, outer `Tapledger-main/` directory
- Source branch: reconstructed local Git history (`main`); uploaded ZIP did not contain `.git`
- Deployment: not pushed or deployed

## Summary

V21.1.1 consolidates the V21.1 editorial workspace redesign and its approved core reliability repairs, then fixes the final CSS fallback cascade for browsers without backdrop-filter and for reduced-transparency / forced-colors modes. It remains the existing static HTML, CSS and vanilla JavaScript application. It does not replace the app with a template or framework.

## Dashboard and experience

- Dark-first charcoal / forest / lime design with a full light theme.
- Rebalanced dashboard masthead, reporting-period panel, monthly cash-flow hero, position/savings detail, chart and budget comparison, category mix, recent activity, local insight and savings-goal feature.
- Sticky chapter navigation and a three-surface maximum glass treatment across the dashboard navigation/hero surfaces. Blur is 10px; quick entry, form controls and long lists remain opaque.
- Responsive desktop sidebar and mobile bottom dock with an always-prominent Add action; other destinations remain available in More.
- Direct Edit and Delete actions on recent dashboard transactions.
- Recent action buttons use existing editor and confirmation-based deletion handlers.

## Core repairs

- JSON restore is additive and atomic: existing IDs win, incoming duplicate IDs are skipped, budget/category conflicts are skipped, account names are compared case-insensitively, and imported transaction references are normalized to existing account spelling.
- Legacy migration does not rewrite transactions that already exist under the same ID.
- Account initialization adds missing account records without rewriting existing transaction account references.
- Quick-entry shortcuts are captured early but opened only after the database and event handlers are ready. Supported routes remain `?a=1`, `?i=1` and `?add=1`.
- `visualViewport` supports keyboard-aware quick-entry sizing.
- V21.1.1 corrects the backdrop support query and final cascade ordering; reduced-transparency preserves readable dark navigation, and forced-colors rules take final precedence.

## Files changed in V21.1.1 patch

- `app.js` — release identity comment only; finance logic unchanged in this patch.
- `index.html` — visible build label.
- `sw.js` — cache namespace advanced to `voltura-platform-v21.1.1`.
- `voltura-visual-system.css` — corrected fallback query and final reduced-transparency / forced-colors cascade.
- `release-audit.test.cjs` — regression test for fallback syntax, ordering and contrast behavior.
- `README.md`, `RELEASE.md`, `QA-REPORT.md`, `DESIGN-SYSTEM-V21.1.md` — release and verification documentation.
- `RELEASE-REPORT-V21.1.1.md`, `SOURCE-INVENTORY-V21.1.1.txt` — new release artifacts.
- `SHA256SUMS.txt` — regenerated after all source changes.

No files were deleted.

## Data and compatibility

- IndexedDB name: `tapledger-db` (unchanged)
- IndexedDB version: `3` (unchanged)
- Existing object stores, key paths and indexes: unchanged
- Financial calculations: unchanged; amounts continue to use integer paise
- Backup tags: `Voltura`, `Vellum`, `Cairn`, `TapLedger` accepted
- No existing browser database was opened, exported, modified, migrated or cleared during this build.
- No real financial backup was used. Restore tests use fabricated records and a deterministic transaction harness, not a browser's persistent IndexedDB.

## Source-size comparison

Measured from root project source files in the imported V20.9 baseline commit versus the V21.1.1 working source. Gzip uses Python's standard gzip compressor at level 9 over same-extension files joined with newlines; this is a comparative source-size estimate, not a network transfer measurement.

| Type | V20.9 files | V20.9 raw | V20.9 gzip-9 | V21.1.1 files | V21.1.1 raw | V21.1.1 gzip-9 |
|---|---:|---:|---:|---:|---:|---:|
| HTML | 4 | 74,020 B | 19,850 B | 4 | 74,360 B | 19,851 B |
| CSS | 6 | 209,125 B | 41,659 B | 7 | 240,310 B | 47,548 B |
| JavaScript | 7 | 113,428 B | 32,984 B | 7 | 115,734 B | 33,680 B |
| **Total** | **17** | **396,573 B** | **94,493 B** | **18** | **430,404 B** | **101,079 B** |

The CSS increase includes the new 30KB visual design layer. No runtime vendor or remote dependency was added. Real device performance and NFC quick-entry latency are not measured by these file-size figures.

## Verification results

| Check | Status | Evidence |
|---|---|---|
| JavaScript syntax | PASSED | `node --check` on all seven root `.js` files |
| Automated tests | PASSED | `node --test *.test.cjs` — 35 passed, 0 failed |
| CSS parsing / brace balance | PASSED | `tinycss2` syntax parse plus source tests |
| Manifest JSON | PASSED | Parsed with Python `json` |
| Local HTML/CSS/JS references | PASSED | Automated project-integrity tests |
| Service-worker precache | PASSED | Every precache path exists in package; uniqueness checked |
| SHA-256 manifest | PASSED | `sha256sum -c SHA256SUMS.txt` |
| ZIP extraction and CRC | PASSED | Final archive extracted and `ZipFile.testzip()` returned no error |
| Browser-rendered screenshots | NOT TESTED | Chromium headless attempt against local HTTP server did not finish before the 25-second timeout |
| Real IndexedDB restore | NOT TESTED | Only deterministic mock transaction harness executed |
| Galaxy S23 FE / NFC / Android keyboard | NOT TESTED | Requires physical device and tag |
| Windows Edge / Chrome / TalkBack | NOT TESTED | Requires real browser/device review |
| GitHub Pages / offline PWA update | NOT TESTED | No deploy or remote repository action performed |

## Git and deployment

The uploaded source ZIP had no `.git` metadata. The local repository history is reconstructed from the user-confirmed project ZIP; it is not a copy of the original GitHub commit history. The release has been committed locally and a separate Git bundle is supplied with the package. No remote was configured, and nothing was pushed or deployed.

## Before publishing

- Download a fresh JSON backup from the live VOLTURA app in the user's normal browser and keep it outside the project folder.
- Extract and review this release in a new folder. Upload only the contents of `Tapledger-main/` to the existing Pages project path after checking the target repository/branch.
- Do not clear site data, unregister the old service worker as a troubleshooting shortcut or change origin before preserving a live JSON backup.

## Manual device checklist

**Samsung Galaxy S23 FE:** verify `?a=1`, `?i=1`, tag tap and installed-PWA route handling; check amount focus, Android keyboard, categories, Save reachability, save/Undo/Add another, dock behavior, TalkBack and airplane-mode relaunch after the app has cached successfully. Do not lock an NFC tag during testing.

**Windows:** test current Chrome and Edge, desktop navigation, all views, keyboard-only use, 200% zoom, focus states, reduced motion, forced colors, console errors, failed requests and horizontal overflow.

## Legal and brand review

Privacy, Terms and Cookies pages remain drafts and need review against actual shipped behavior and applicable requirements by a qualified lawyer. Search VOLTURA and the selected mark through IP India and relevant international trademark registers before commercial use. This package does not establish trademark availability.

## Suggestions (not implemented)

- Complete browser screenshot QA using representative fabricated data at the 320–2560px widths in the master brief.
- Run a rendered contrast audit against the actual composited glass backdrops.
- Verify the PWA update and offline flow on the existing GitHub Pages origin without deleting local data.
- Physically test NFC behavior and the target phone keyboard before using a tag for daily capture.
