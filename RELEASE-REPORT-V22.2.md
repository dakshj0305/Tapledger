# VOLTURA V22.2 — final source audit and release report

- **Build ID:** `VOLTURA-22.2-20261113`
- **Audit date:** 13 November 2026
- **Source:** consolidated V22.2 tree in this workspace, based on the user-confirmed V20.9 working archive and subsequent design/motion iterations
- **Hosting target:** `https://dakshj0305.github.io/Tapledger/`
- **Deployment:** not pushed or deployed
- **Data touched:** no user browser profile, live IndexedDB database or financial export was opened or modified

## Requirements reviewed from the conversation

| Request / constraint | V22.2 disposition |
|---|---|
| Full redesign; fix hidden/low-contrast text and cramped layouts | The existing visual layers include explicit foreground/surface tokens, wrapping and responsive safeguards. This source pass verifies stylesheet references and relevant source assertions; current screenshot QA remains not tested. |
| Stitch screen references | The four supplied screen exports/code files, the monogram screen and financial-intelligence design notes are retained under `design-reference/stitch/`. Shared styling is integrated as a first pass, not a full pixel-perfect rebuild of every screen. |
| Add glassmorphism | Selective glass is used for chrome and selected summaries. Dense ledger rows, form controls, quick-entry surfaces and dialogs remain opaque for readability. Reduced-transparency and forced-colors fallbacks are present. |
| Liquid-metal React/WebGL button | Adapted as a local dependency-free pointer-light and click-ripple enhancement. The React/TypeScript/WebGL component is documented, not installed. |
| Full-screen GSAP ScrollTrigger component | Its transition ideas were adapted to native chapter tracking and reveals. The pinned full-screen slideshow is deliberately excluded so financial content remains in normal document scrolling. |
| GSAP requested | Optional local-runtime detection/hooks exist; GSAP/ScrollTrigger are not bundled or loaded because no verified local distribution was available. No CDN was added. The actual GSAP code path is not runtime-tested. |
| Smarter Growth video reference | Its quiet editorial pacing, generous composition and pastel-solid card treatment informed the reveal timing and visual direction. The reference is not copied literally. |
| Preserve local finance behavior and data | IndexedDB name/version, store contracts, integer-paise amount model, core finance helpers, backup tags and quick routes are preserved by source tests. Restore remains additive and atomic. |
| Offline/local-first operation | Local scripts/styles/assets only; service-worker precache contains the required app files. No remote runtime, remote font or analytics dependency was added. |
| Commit changes and provide a GitHub upload file | This release commit and separate reconstructed bundle are supplied. The upload ZIP excludes `.git`; instructions explain preserving the existing GitHub history. Nothing was pushed. |

## Critical audit findings and corrections in this final pass

1. **Release documentation drift:** `README.md` contained conflicting V21.1.1 and V22.1 current-release headings, and `RELEASE.md` still identified V22.1 as current. Both now identify V22.2 and describe the actual integration limits.
2. **Stale checksums:** the previous `SHA256SUMS.txt` did not match nine current files, including README, release notes, app/HTML, motion scripts/styles, service worker and tests. It has been regenerated for the complete source tree, excluding only the checksum file itself.
3. **GitHub upload ambiguity:** prior instructions did not clearly explain that GitHub does not unpack a ZIP as a repository. The upload guide now explains extract/copy/commit steps and cautions against replacing the existing remote history with the reconstructed bundle.
4. **Current QA ambiguity:** historical V20.9–V21.1.1 browser results were mixed with current reporting. `QA-REPORT.md` now separates historical notes from V22.2 checks and marks current browser/device checks as not tested.
5. **Pages/Jekyll packaging:** added `.nojekyll` and `.gitignore` for a clean static-site repository upload.
6. **Release regression protection:** added a packaging test that verifies current release labels and verifies that every shipped source file (apart from the checksum manifest itself) is covered by a matching SHA-256 entry.

## Architecture and data compatibility

The project remains static HTML/CSS/vanilla JavaScript; no React, shadcn, Tailwind or TypeScript build system was introduced. This avoids an unnecessary rewrite of a working offline PWA. The supplied React components are represented by compatibility notes and vanilla progressive enhancements, not false claims that React components run in this codebase.

- IndexedDB database name: `tapledger-db`
- IndexedDB version: `3`
- Stores, key paths, indexes and existing record shapes: unchanged
- Financial amounts: integer paise
- Quick launch: `?a=1`, `?i=1`, `?add=1`
- Backup tags: `Voltura`, `Vellum`, `Cairn`, `TapLedger`
- Restore: additive, primary-key preserving, duplicate-safe and atomic
- PWA: relative project paths and `/Tapledger/` scope retained

No data deletion, database migration or live-data edit was performed.

## Verification executed

See `QA-REPORT.md` for limitations. The release checks run from the final working tree:

- `node --check` for every root JavaScript file.
- `node --test *.test.cjs` for finance, project integrity, release integration, restore and package checks.
- Manifest JSON parse, local reference/precache checks and source-level compatibility assertions.
- `sha256sum -c SHA256SUMS.txt`.
- ZIP CRC/extraction validation and a clean package inventory check.

A headless Chromium screenshot run timed out. Therefore no V22.2 rendered-browser, cross-device, screen-reader, real IndexedDB, NFC, offline lifecycle or live Pages deployment pass is claimed.

## GSAP status — explicit limitation

GSAP and ScrollTrigger are not present in the supplied archives, workspace or local package cache. No live npm/network installation was available. The app has optional local-runtime hooks in `motion-ui.js` and `scroll-story.js`, but **GSAP does not run in the default build**. Do not interpret CSS/IntersectionObserver reveals as GSAP execution. A future GSAP-enabled build must vendor a reviewed local distribution, load it before the motion scripts, add it to the service-worker precache and retest offline/reduced-motion behavior. Do not add a CDN unless the local-first requirement is explicitly changed.

## Git and deployment status

The supplied working ZIP did not include its original `.git` history. The current local repository is reconstructed. This release adds a final audit/release commit to that reconstructed history and provides a bundle separately. The upload ZIP intentionally excludes `.git`; use the guide to copy its contents into the existing repository clone so the real GitHub remote history is preserved.

**No GitHub push, Pages deployment, remote branch update or live user-data operation was performed.**
