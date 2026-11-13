# VOLTURA V26.1.1 — GSAP integration report

- Bundled official GSAP 3.15.1 UMD runtime and ScrollTrigger locally from the supplied GSAP repository archive.
- Added local script loading under the existing self-only Content Security Policy.
- Added `gsap-motion.js` for progressive enhancement: view entrances, scroll-triggered content reveals, subtle pointer feedback, responsive matchMedia setup and dynamic view observation.
- Preserved native scrolling; no scroll hijacking or pinned dashboard sections.
- Honors `prefers-reduced-motion`; touch devices avoid hover-driven effects.
- Added GSAP assets and third-party notice to the offline service-worker precache.
- Bumped the service-worker cache namespace to `voltura-platform-v26.1.1-gsap`.
- Existing financial calculations, IndexedDB schema and transaction logic were not modified.

GSAP source: https://github.com/greensock/GSAP
GSAP documentation: https://gsap.com/docs/v3/Installation/
Version: 3.15.1
