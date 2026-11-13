# VOLTURA V26.1.1 — Local motion integration

**Source build:** `VOLTURA-26.1.1-GSAP-20261113`  
**Repository:** `dakshj0305/Tapledger`, default branch `main`  
**Release status:** Source commit exists on GitHub. GitHub Pages deployment status and live-browser behavior are not certified by this report.

## Scope

V26.1.1 carries forward the V26.0 unified personal-finance PWA and adds a locally hosted GSAP 3.15.1 enhancement layer.

- GSAP core: `vendor/gsap/gsap.min.js`
- ScrollTrigger: `vendor/gsap/ScrollTrigger.min.js`
- Vendor notice: `vendor/gsap/THIRD-PARTY-NOTICE.txt`
- Motion integration: `gsap-motion.js`
- Native progressive motion: `motion-ui.js` and `scroll-story.js`
- Main app entry: `index.html`

The GSAP files are loaded locally; no CDN dependency is intended. Native scrolling remains in control. Reduced-motion handling and a no-GSAP fallback are present in the motion controller.

## Finance and data compatibility

The application remains static HTML, CSS and vanilla JavaScript. Its finance workflows, integer-paise arithmetic, database name `tapledger-db`, IndexedDB version `3`, existing stores and JSON backup compatibility are intended to remain unchanged. No user database was accessed or modified during this repository metadata/documentation review.

## Deployment

The GitHub Pages project URL is `https://dakshj0305.github.io/Tapledger/`. The expected Pages source is `main` at repository root. Pages configuration is a repository setting and cannot be inferred from the source files alone. Confirm the latest Pages deployment in GitHub Actions/Deployments and test the deployed URL in a clean browser profile.

## Verification boundaries

This report records the source configuration, not a fresh execution of the application. Do not infer that the deployed site, offline installation, service-worker update, IndexedDB flows, NFC hardware behavior, accessibility, or all viewport layouts have passed from the presence of these files. Run the commands in `README.md` against this exact commit and complete target-browser/device QA before calling the release production-ready.
