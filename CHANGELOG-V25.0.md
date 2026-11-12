# VOLTURA V25.0 — Kinetic Relic

A radical visual-direction experiment replacing the restrained Observatory treatment with a high-contrast, dimensional, motion-led interface.

- Midnight indigo instrument environment, acid-lime and signal-coral accents, oversized condensed display type, glass/metal surfaces and tactile controls.
- Procedural 3D-style capital relic built from CSS 3D geometry, orbital rings, canvas-projected particle points and pointer parallax.
- Pointer-responsive spring-like panel tilt, view entrance choreography, visibility-aware animation, and reduced-motion support.
- New visual assets are local files; no WebGL, remote runtime, or financial-data access was added.
- Existing finance logic, IndexedDB schema, integer-paise representation, navigation, quick routes, backup/restore and PWA architecture are retained.

## Motion-engine note

GSAP is not present in the supplied source and network access was unavailable during this build, so no third-party GSAP runtime has been fabricated or silently pulled from a CDN. V25.0 uses a small authored requestAnimationFrame / Canvas 2D / CSS 3D motion layer. This keeps the app self-contained and offline-capable, but it is not GSAP. A locally licensed/bundled GSAP distribution can replace the choreography layer in a follow-up without changing finance logic.
