# VOLTURA V21.1 — Release report

- Product: VOLTURA local-first personal finance PWA
- Build ID: `VOLTURA-21.1-20261112`
- Date: 2026-11-12
- Source baseline: user-confirmed `Tapledger-v20.9-complete(1).zip`, outer `Tapledger-main/` folder
- Deployment: not pushed or deployed

## Summary

V21.1 is a substantive presentation-layer redesign plus targeted data-safety and startup repairs. It does not replace the application or change its finance calculations, database identity or stored record shapes.

## Files changed or added

- `index.html` — loads the V21.1 visual layer, updates dashboard masthead copy, build label and mobile Add action.
- `voltura-visual-system.css` — new dark-first/light-capable visual system, responsive dashboard, navigation, glass budget and accessibility fallbacks.
- `app.js` — additive restore transaction, non-rewriting legacy migration/account initialization, recent-transaction actions, visual viewport handling, shortcut intent handling, theme-color update and V21.1 identity.
- `quick-boot.js` — captures launch intent only; no longer opens/focuses a dialog during parser time.
- `sw.js` — V21.1 cache key and precache entry for the new stylesheet.
- `manifest.webmanifest` — dark-first launch/theme colours.
- `finance-core.test.cjs` — additive planner regression test.
- `project-integrity.test.cjs` — updated quick-launch and additive-restore contract checks.
- `release-audit.test.cjs` — V21.1 visual layer, mobile add action and safe restore/migration checks.
- `restore-transaction.test.cjs` — executable test of the additive restore helper against a deterministic IndexedDB-like transaction harness.
- `RELEASE.md` — V21.1 change record.
- `QA-REPORT.md` — V21.1 verification addendum.
- `DESIGN-SYSTEM-V21.1.md` — design system documentation.
- `CONTRAST-REPORT-V21.1.md` — token-pair contrast calculations.
- `RELEASE-REPORT-V21.1.md` — this report.
- `SOURCE-INVENTORY-V21.1.txt` — complete source inventory.
- `SHA256SUMS.txt` — regenerated SHA-256 manifest (does not hash itself).

## Data compatibility

- IndexedDB name remains `tapledger-db`.
- IndexedDB version remains 3.
- Existing stores, key paths and indexes remain unchanged.
- Integer-paise calculations remain unchanged.
- Accepted backup tags remain Voltura, Vellum, Cairn and TapLedger.
- Restore now uses an atomic read/write transaction and `add()` semantics. Existing transaction IDs win; incoming duplicate IDs, duplicate budget categories, conflicting goals and case-insensitive account-name conflicts are skipped. Imported transaction account references are mapped to the existing canonical account spelling where possible.
- Legacy migration no longer rewrites matching transaction records. Account initialization creates missing account records without patching existing transaction references.
- No real user's IndexedDB or financial export was accessed.

## Performance size comparison

Measured root-level HTML/CSS/JS files (raw bytes; gzip each file independently at level 9 and sum):

| Measure | V20.9 baseline | V21.1 | Difference |
|---|---:|---:|---:|
| Root HTML/CSS/JS files | 17 | 18 | +1 |
| Raw bytes | 396,559 | 429,977 | +33,418 (+8.4%) |
| Independently gzipped bytes | 101,495 | 108,896 | +7,401 (+7.3%) |

This is a source-size measurement, not a network waterfall or runtime performance benchmark. No LCP, INP, memory or quick-entry latency measurement was completed.

## Verification

- PASSED — JavaScript syntax checks for app, finance core, quick boot, service worker, motion and scroll modules.
- PASSED — 34 automated tests across finance-core, project-integrity, release-audit and restore-transaction suites.
- PASSED — CSS parser: 212 top-level rules parsed with no top-level syntax errors (tinycss2). Nested declaration/runtime behaviour still needs browser review.
- PASSED — source checks for project-root asset references, unique IDs, IndexedDB identity/version, service-worker precache, PWA manifest and mobile navigation.
- PASSED — additive restore helper exercised with a deterministic mock transaction harness covering ID collisions, duplicate backup rows, account-name normalization, duplicate budget category, and goal collision.
- NOT TESTED — real-browser rendered screenshots. Chromium headless was attempted on localhost but did not finish within the execution window.
- NOT TESTED — real IndexedDB restore transaction, live populated data, real offline relaunch, installed-PWA update, GitHub Pages deployment, 320–2560px visual sweep, 200% zoom, forced colors, keyboard-only, TalkBack, NFC and Galaxy S23 FE keyboard behaviour.

## Deletions and dependencies

- No files were deleted.
- No new runtime dependency, framework, build tool, remote font, CDN, external image, analytics or tracking service was added.
- GSAP was not added because its installation/licence check requires the separate D5 approval. The pinned desktop story scene was not added (D6 default: no).
- The React/WebGL liquid-metal and GSAP scroll components from the earlier reference prompts were not imported; the existing vanilla architecture and quick-entry priority take precedence.

## Git

The supplied ZIP did not contain `.git`. The local history is reconstructed from the supplied snapshot as a baseline commit, followed by a V21.1 release commit. This is not the original GitHub repository history. No remote push was performed.

## User verification checklist

### Before publishing

- Download a fresh JSON backup from the live VOLTURA app in the normal browser and keep it outside the project folder.
- Extract this release into a new folder and inspect the contents before uploading.
- Do not clear site data or unregister the live service worker as a troubleshooting shortcut; that may risk locally stored financial data.

### Samsung Galaxy S23 FE

- Open the existing expense NFC URL (`?a=1`) and income URL (`?i=1`).
- Verify each opens once, focuses the amount, and preserves category/Save reachability with the keyboard open.
- Test a real tag tap and installed-PWA routing; do not lock tags during testing.
- Verify Save, confirmation, Undo and Add another using fabricated entries only.
- Check dock navigation, TalkBack and airplane-mode relaunch after a successful cache install.

### Windows

- Test current Chrome and Edge, keyboard navigation, focus visibility, 200% zoom and the desktop sidebar.
- Test theme selection, reduced motion and forced-colors.
- Check console errors, failed requests, horizontal overflow and all dashboard actions.

## Legal and brand checklist

- Review privacy, terms and cookie pages against actual shipped behaviour and current applicable requirements; no legal compliance conclusion is made here.
- Search VOLTURA and the selected logo through IP India and relevant international trademark registers before commercial use.
- Confirm ownership/licensing provenance for existing artwork and icons; retain the provenance document.

## Suggestions (not implemented)

- Add an explicit last-backup timestamp only after a privacy-preserving local setting and user-consented reminder design are agreed.
- Conduct a browser-based contrast audit over glass surfaces with real dashboard content.
- Review a populated-data dashboard screenshot on the user's actual desktop and Galaxy S23 FE before deployment.
