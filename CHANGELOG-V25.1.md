# VOLTURA V25.1 — Kinetic Relic hardening

- Corrected the stale sidebar release label and synchronized build, app, and service-worker version identifiers.
- Hardened the decorative canvas enhancement for browsers without a working 2D canvas context.
- Added a resize-event fallback for browsers without `ResizeObserver`.
- Kept all animation decorative and isolated from finance records, calculation paths, and IndexedDB.
- Preserved reduced-motion handling, local assets, offline precache, and the V3 `tapledger-db` schema.

## Dependency status
This source package still does not contain GSAP. The package registry and external host resolution were unavailable during this build, and no existing local GSAP distribution was found. This release does not misrepresent custom animation code as GSAP. A real, locally bundled GSAP distribution remains a release blocker for the specifically requested GSAP deliverable.
