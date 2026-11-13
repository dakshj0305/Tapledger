# VOLTURA release notes — current V25.2

**Build:** `VOLTURA-25.2-ATELIER-20261113`  
**Date:** 13 November 2026  
**Deployment:** Not pushed or deployed by this release task.

V25.2 is the visual repair release after the Stitch design first pass, liquid-metal-style interaction adaptation, scroll-motion adaptation and “Smarter Growth” motion-reference pass. It retains the app's static HTML/CSS/vanilla-JavaScript architecture and the existing IndexedDB v3 contract.

## Included

- Shared Stitch-derived presentation system and retained source references for Overview, Accounts, Transactions Ledger, Budgets, Financial Intelligence and VOLTURA identity.
- Selective glass surfaces with opaque financial forms and dense data surfaces.
- Local liquid-metal-style pointer lighting and click ripple, without the supplied React/WebGL shader.
- Native-scroll chapter tracking and IntersectionObserver/CSS reveal fallback, with reduced-motion handling.
- Motion pacing based on the supplied short “Smarter Growth” reference video.
- PWA manifest, icons, service-worker cache, offline shell and project-relative URLs.
- Additive atomic JSON restore and migration safeguards from prior audited releases.

## Deliberate compatibility decisions

The supplied React components are not copied into `/components/ui`: this repository is not a shadcn, Tailwind or TypeScript project. The project remains vanilla JavaScript so the existing PWA and financial workflows are not needlessly rewritten. The full-screen pinned React slideshow is not used. Its useful transition ideas are adapted to native page scrolling.

GSAP was explicitly requested, but there is no local GSAP/ScrollTrigger distribution in the supplied project or available workspace. The source detects a locally supplied runtime and offers progressive enhancement hooks; GSAP is **not bundled or active by default**. No remote CDN dependency is introduced.

## Data contract

- IndexedDB database: `tapledger-db`
- IndexedDB version: `3`
- Stores/key paths/indexes and saved record shapes: unchanged
- Financial amount storage: integer paise
- Quick routes: `?a=1`, `?i=1`, `?add=1`
- JSON restore: additive, duplicate-safe and transactionally applied

## Verification summary

See `RELEASE-REPORT-V25.2.md`, `CHANGELOG-V25.2.md` and `QA-REPORT.md`. The current package was checked with Node syntax validation, all dependency-free automated tests, manifest parsing, local asset/precache tests, checksum verification and ZIP integrity validation. A headless Chromium run timed out; rendered desktop/mobile browser QA, real IndexedDB persistence, PWA install/update/offline behavior, NFC hardware and the deployed Pages site remain unverified.


V25.2 consolidates the visual cascade into the Atelier design system and removes competing card tilt transforms. The dimensional orbital object remains a progressive CSS 3D / Canvas 2D enhancement. GSAP was not available in the supplied project or package cache; this build does not claim to include GSAP.
