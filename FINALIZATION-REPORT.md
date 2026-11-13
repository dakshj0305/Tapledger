# VOLTURA V25.2 — Atelier visual repair finalization

**Release:** V25.2 Atelier  
**Finalized:** 13 November 2026  
**Local commit:** recorded in the accompanying Git bundle  
**Deployment:** not pushed or deployed

## Final state

V25.2 reconciles the previously layered visual experiments into one final Atelier art-direction layer. It removes competing pointer-transform behaviours, restores a complete isolated CSS 3D orbital object, and corrects the Canvas fallback so optional rendering failures cannot abort unrelated interface enhancements.

## Verification performed

- All five dependency-free Node test suites passed: **42 tests, 0 failures**.
- Project JavaScript files passed `node --check`.
- Stylesheet block balance and no-remote-import checks passed.
- Local HTML asset references and service-worker precache entries passed.
- Manifest parsing, IndexedDB contract checks, backup/restore tests, quick-route checks and source checksum manifest passed.
- Final release ZIP CRC and Git bundle verification passed.

## Known limitations — not represented as complete

- GSAP is not bundled or active. The supplied project and local workspace contain no official GSAP distribution, and external package retrieval was unavailable. No substitute is mislabeled as GSAP.
- Headless Chromium did not complete reliably in this environment; rendered desktop/mobile visual QA is therefore not claimed.
- Real-device NFC, PWA installation/update, and deployed-host offline behaviour have not been exercised here.

## Data safety and deployment

No live financial records were modified. IndexedDB remains `tapledger-db` version 3 and money remains stored in integer paise. No GitHub push or remote deployment was performed. Extract the ZIP contents into the repository root rather than nesting the enclosing folder.

## Release decision

The source, local commit, archive and integrity metadata are packaged for review. Automated checks pass, but the browser/device verification and official GSAP dependency remain outstanding; this report does not claim those checks complete.
