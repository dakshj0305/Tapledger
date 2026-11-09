# VOLTURA — Brand system v14

**Positioning:** A bold, local-first personal finance cockpit that turns daily money movement into a clear operating picture.

**Tagline:** Money in motion.

## The signature motif — The Volt Orbit
One continuous orbit and one electric waypoint. It stands for the movement of money through the ledger and onward to accounts, budgets and goals. The mark belongs to VOLTURA; it is not a generic decoration.

## Palette
- Graphite `#111820` — navigation, hero, logo and core structure.
- Volt lime `#D7FF3F` — the single signature waypoint and primary action accent.
- Mineral paper `#EFF1E9` — main canvas.
- Porcelain `#FAFBF6` — working surfaces.
- Satin steel `#B9C3C5` — restrained metallic detail and dividers.
- Volt teal `#087D64` — incoming money and positive progress.
- Signal coral `#E95B49` — outgoing money and warnings.
- Deep olive `#4D6310` — accessible lime-derived text and focus states on light surfaces.

## Finish and composition
- Matte graphite and mineral surfaces are the default; no full-screen glass, glow haze or generic gradients.
- The logo and hero get the controlled metallic / anodized treatment: one orbit line, one waypoint, a crisp specular edge.
- The dashboard uses bold, uppercase editorial typography, strong rectangular silhouettes and offset shadows.
- White space and data density remain balanced. Noise is not a substitute for information architecture.

## Typography
- Interface: system sans-serif stack (system UI, Segoe UI, Arial), bold weights for headings.
- Figures: local system monospace stack (SFMono-Regular, Consolas, Liberation Mono).
- No font files or web-font downloads are bundled.

## Motion
The hero portal uses local Canvas 2D motion, pointer warp and decaying ripple. The logo waypoint is the only persistent ambient path animation. Motion is decorative, pauses when the page is hidden, and is disabled by `prefers-reduced-motion`.

## Product and data integrity
- Static HTML, CSS and JavaScript. No build step, npm install, React runtime or third-party component package.
- Existing database identity remains `tapledger-db`, schema version `3`, preserving prior Vellum/TapLedger data on this browser profile.
- JSON import remains backward compatible with Voltura, Vellum, Cairn and TapLedger exports.
- All financial records remain local in IndexedDB; the design layer does not change calculation or storage behavior.
