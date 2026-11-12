# VOLTURA V25.1 — Finalization record

**Release:** V25.1 Kinetic Relic  
**Finalized:** 13 November 2026  
**Local commit:** recorded in the accompanying Git bundle  
**Deployment:** not pushed or deployed

## Final state

This is the finalized, locally committed V25.1 source and packaging release. The visual enhancement layer remains progressive and decorative; financial calculations, IndexedDB records, backup/restore, NFC quick routes and offline app shell remain separate from animation code.

## Verification performed

- All five dependency-free Node test suites passed: **42 tests, 0 failures**.
- All project JavaScript files passed `node --check`.
- Service-worker precache references, local HTML script/style references, manifest parsing, app build labels, and the SHA-256 source manifest passed release checks.
- The release ZIP CRC was verified after packaging.
- The Git bundle was verified with `git bundle verify`.

## Known limitations — not represented as complete

- **GSAP is not bundled or active.** The supplied project and local workspace contain no official GSAP distribution. Attempts to retrieve the official npm package and jsDelivr distribution failed because DNS resolution for those hosts was unavailable. No substitute has been mislabeled as GSAP. The Kinetic Relic motion currently uses the existing custom Canvas 2D, CSS 3D and JavaScript animation layer.
- Headless Chromium did not complete reliably in this environment; therefore rendered desktop/mobile visual QA is not claimed.
- Real-device NFC, PWA installation/update, and deployed-host offline behaviour have not been exercised here.

## Data safety and deployment

No live financial records were modified. IndexedDB remains `tapledger-db` version 3 and money remains stored in integer paise. No remote deployment or GitHub push was performed. The release ZIP is intended for review/upload; extract its `VOLTURA/` contents into the repository root rather than nesting the folder.

## Release decision

The source, local commit, archive, and integrity metadata are finalized. The specifically requested GSAP-complete and browser/device-verified production release remains blocked by the limitations above; this report deliberately does not call those checks complete.
