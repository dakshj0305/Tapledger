# VOLTURA V22.2 — current QA report

**Date:** 13 November 2026  
**Target:** final V22.2 source tree and GitHub-upload ZIP.

## Passed in this environment

- **JavaScript syntax:** every root `*.js` file passed `node --check`.
- **Automated tests:** all **39 tests passed, 0 failed** across finance-core, project-integrity, release-audit, restore-transaction and release-packaging suites.
- **Local page dependencies:** script and stylesheet references in `index.html` resolve to files in the project.
- **PWA references:** manifest JSON parses; referenced icon files exist; all service-worker precache entries exist in the project.
- **Data compatibility:** source tests confirm `tapledger-db`, IndexedDB version 3 and the existing stores/record contracts remain unchanged.
- **Restore safeguards:** source/unit tests cover additive import planning, duplicate IDs, case-normalized account conflicts and atomic add-only writes.
- **Release package:** ZIP extraction/CRC check and the final SHA-256 manifest are checked during packaging.

## Not passed / not tested

- **Rendered browser QA:** a headless Chromium screenshot attempt against the local server timed out. No screenshot-based visual pass is claimed for this release.
- **Cross-browser QA:** Chrome stable UI, Firefox, Safari and Edge were not tested interactively.
- **Responsive/zoom QA:** no current-release visual verification at 320px/375px/390px/tablet/desktop, landscape or 200% zoom.
- **Accessibility:** no complete screen-reader, keyboard-only, axe, Lighthouse, forced-colors or reduced-transparency browser audit.
- **Real IndexedDB:** no user browser profile or financial records were opened. Persistence across reloads, browser restart, export/restore against real stored data and crash recovery were not exercised in a real browser.
- **PWA lifecycle:** install, service-worker activation/update, cache eviction and offline relaunch were not tested on an HTTPS deployment.
- **Hardware:** NFC writing/reading, installed-PWA URL capture, Android visual viewport, haptics and microphone/speech provider behavior were not device-tested.
- **Deployment/legal/security:** no GitHub Pages push or live URL verification was performed. Legal draft pages, trademark availability, production HTTP headers and security posture still require owner/professional review.
- **GSAP runtime:** GSAP and ScrollTrigger are not bundled, so the optional GSAP path was not runtime-tested. Native CSS/IntersectionObserver behavior is covered by source-level checks only.

## Historical QA notes

Earlier V20.9–V21.1.1 reports describe work and checks performed on older source snapshots. Their rendered-browser claims, where recorded, are historical and must not be read as current V22.2 browser certification. Current-release checks are limited to the executed source, unit, reference and packaging tests listed above.
