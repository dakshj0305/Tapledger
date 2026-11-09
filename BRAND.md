# VELLUM — Brand system (v9)

**Positioning:** A considered personal finance studio for people who want clarity, not noise.

**Tagline:** Every rupee, in perspective.

## Core palette
- Midnight ink `#14243A` — primary structure and navigation.
- Deep navy `#1D3049` — elevated dark surfaces.
- Warm parchment `#E9E1D3` — page canvas.
- Porcelain `#F8F6F1` — working surfaces.
- Forest `#234638` — primary actions and positive financial progress.
- Slate `#405A74` — accessible secondary links and headings.
- Accessible neutral `#59636F` — secondary text on light surfaces.
- Antique brass `#B69B70` — decorative accent only, not small body text.
- Clay `#853F32` — accessible expense/error text on light surfaces.
- Light-on-dark `#C6D0C8` — secondary copy on navy/forest dark surfaces.

## Typography
- Display: local system serif stack (Iowan Old Style, Palatino Linotype, Book Antiqua, Georgia).
- Interface: local system sans-serif stack (system UI, Segoe UI, Arial).
- Figures: local system monospace stack (SFMono-Regular, Consolas, Liberation Mono).
- No font files or web-font downloads are bundled. The operating system supplies the selected font.

## Motion and physics-inspired interaction
The overview hero includes a decorative canvas grid and a kinetic VELLUM wordmark. Grid nodes are modelled as damped spring systems using `a = F - kx - cv`; pointer proximity applies a short-lived radial force, and a pointer press launches a decaying radial wave. The animation is local to the page, uses no remote component or physics package, and is disabled when `prefers-reduced-motion: reduce` is active. This is a small visual interaction, not a financial model or scientific measurement.

## Component direction
- The dashboard is data-driven from the user's IndexedDB records. It does not use the supplied sample transactions, demo person or USD figures from the React reference.
- Translucent layered surfaces are limited to the cash-flow summary; the app remains primarily editorial and readable.
- The kinetic grid is decorative and `aria-hidden`; charts and financial meaning remain available as text/table content.
- No generic gradient backgrounds, random glowing effects, remote background images or external fonts are used.

## Assets and provenance
- `icons/vellum-mark.svg`: simple V monogram authored for this Vellum project.
- `icons/icon-192.png`, `icons/icon-512.png` and maskable variants: locally generated raster exports of the Vellum monogram.
- All interface icons are inline SVG symbols authored in `index.html`.
- No stock photography, third-party illustration, external image, icon font or bundled font file is used.
- The supplied Glyph Portal font and Glass Workspace remote background image were not reused. Their external CDN origins and licence terms were not included with the supplied snippets.


## Native interactive surface
- The overview wordmark portal uses a local Canvas 2D grid and letter movement.
- The grid uses a damped spring response and expanding radial ripple as a decorative interaction. These are visual simulations, not a claim of exact physical modeling.
- Glass material controls affect the summary surface only. They are an on-device visual preference stored under `settings` key `glass-material-v1`; they do not affect ledger calculations.
- Reduced-motion preferences disable the kinetic animation. The wordmark remains visible without motion.
