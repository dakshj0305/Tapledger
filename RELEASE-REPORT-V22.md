# VOLTURA V22.0 — release report

- Product: VOLTURA local-first personal finance PWA
- Build ID: `VOLTURA-22.0-20261112`
- Date: 2026-11-12
- Source: consolidated from the supplied V21.1.1 package, itself based on the user-confirmed V20.9 source archive
- Hosting target: `https://dakshj0305.github.io/Tapledger/`
- Deployment: not pushed or deployed

## Why the redesign was necessary

The supplied screen recording/contact sheet showed that V21.1.1 still had a compressed insight-card layout, weak hierarchy, overly small secondary labels, low-contrast copy on several surfaces and mobile navigation that hid secondary views without making every one discoverable. V22.0 corrects these source-level layout and color conflicts instead of adding another decorative layer to the existing squeezed card.

## Changes

- Added `voltura-visual-overhaul.css` as the final local stylesheet in the cascade.
- Rebalanced the desktop content width, navigation rail and dashboard spacing.
- Reworked the balance hero into a light lime surface with dark text, increasing contrast and making the most important monthly metric dominant.
- Increased the size/contrast of headings, panel titles, chart legends, budget labels, recent-activity labels, forms, dialogs and settings copy.
- Changed the insight/goal cards to full-width stacked layouts. The insight action is below the text instead of sharing a row with a long CTA; this specifically addresses the narrow-column defect shown in the supplied contact sheet.
- Improved category chart sizing, legend wrapping and recent activity spacing.
- Added explicit light-theme surface/foreground pairings for selected surfaces, including system-light preference handling.
- Mobile navigation now exposes Overview, Ledger, Intelligence, Add and More. Budgets and Savings Goals were added to the More sheet, alongside the other secondary views.
- Updated visible build identity and service-worker cache namespace to V22.0; added the new stylesheet to the app-shell precache.

## GSAP status

GSAP was explicitly requested and the project already has an optional GSAP/ScrollTrigger enhancement branch in `scroll-story.js`. However, the runtime is not bundled in this package. Attempting to resolve it from npm failed with DNS `EAI_AGAIN`, and no local GSAP distribution was available in the workspace. To preserve the local-first/CSP requirement, no CDN script was added and the release does not claim GSAP runtime animation is active. Existing native motion enhancements and reduced-motion fallbacks remain available. A self-hosted GSAP distribution can be added when a verified package file is available.

## Data and compatibility

- IndexedDB name: `tapledger-db` (unchanged)
- IndexedDB version: `3` (unchanged)
- Object stores, key paths, indexes, migration markers and stored record shapes: unchanged
- Financial calculations: unchanged
- Quick-entry routes: `?a=1`, `?i=1`, `?add=1` preserved
- PWA scope / GitHub Pages path: `/Tapledger/` preserved
- Backup tags: Voltura, Vellum, Cairn and TapLedger remain accepted
- No actual browser profile or financial data was opened or changed
- No files were deleted

## Verification

| Check | Status | Evidence |
|---|---|---|
| JavaScript syntax | PASSED | `node --check` on each root JavaScript file |
| Automated tests | PASSED | `node --test *.test.cjs` — 36 passed, 0 failed |
| CSS parser | PASSED | Python `tinycss2` parsed all 8 root stylesheets without parse errors |
| Manifest | PASSED | JSON parse |
| HTML local references | PASSED | Every relative `src`/`href` referenced by `index.html` exists |
| Service-worker precache | PASSED | 25 unique precache entries exist in project |
| IndexedDB contract | PASSED | Source check for database name and version; full schema tests also pass |
| ZIP extraction / CRC | PASSED | 64-entry release ZIP extracted; `ZipFile.testzip()` returned no error; tests and SHA checks rerun from extracted package |
| Browser visual QA | NOT TESTED | Chromium headless attempt timed out; no Playwright/Puppeteer installed |
| Real-device / NFC | NOT TESTED | No Galaxy S23 FE available in this environment |
| Persistent IndexedDB restore | NOT TESTED | No real browser database opened; restore tests remain source/harness-level |
| Live GitHub Pages | NOT TESTED | No push/deployment performed |

## Changed files

- `index.html`
- `app.js` (release identity comment and theme-color token aligned with V22 surfaces)
- `sw.js`
- `manifest.webmanifest`
- `voltura-visual-overhaul.css` (new)
- `project-integrity.test.cjs`
- `release-audit.test.cjs`
- `CHANGELOG-V22.md` (new)
- `DESIGN-SYSTEM-V22.md` (new)
- `CONTRAST-REPORT-V22.md` (new)
- `UI-QA-CHECKLIST-V22.md` (new)
- `RELEASE-REPORT-V22.md` (new)
- `SOURCE-INVENTORY-V22.txt` (new)
- `SHA256SUMS.txt`
- `README.md`
- `RELEASE.md`

No file removals.
