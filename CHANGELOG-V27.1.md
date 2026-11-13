# VOLTURA V27.1 — loud, clean visual refresh

- Replaced the subdued green skin with a distinctive matte ink, warm off-white and volt-lime visual system.
- Rebalanced the overview into a full-width account position followed by budget and recent activity side-by-side on desktop; the layout stacks on smaller screens.
- Tightened typography, button hierarchy, input states, table density, navigation and mobile bottom navigation.
- Kept the four core destinations, transaction flows, local IndexedDB schema, backup/restore and quick-entry URLs unchanged.
- Expanded the local GSAP 3.15.1 / ScrollTrigger enhancement to include the dashboard entrance, one-time content reveals, view transitions and budget progress reveal.
- Respects reduced-motion preferences and degrades to a fully visible, usable static interface when GSAP is unavailable.
- Updated service-worker precache and cache namespace for the new stylesheet.
- No external runtime dependencies added.

## Verification
Run the commands in README.md. GitHub Actions runs the CSS build, JavaScript syntax checks and regression suite on push.
