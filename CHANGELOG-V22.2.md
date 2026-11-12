# VOLTURA V22.2 — Smarter Growth motion pass

## Reference-led refinements

- Added restrained editorial reveal timing inspired by the supplied `Smarter Growth` video: content enters in short, calm sequences rather than dramatic scene changes.
- Optional local GSAP enhancement now animates newly revealed cards and panels when `gsap` is already hosted locally. The fallback remains CSS + IntersectionObserver.
- Preserved the existing forest-green / chartreuse identity; pastel data surfaces remain opaque and legible while glass stays selective.
- Kept native scrolling, no pinned sections, no wheel/touch interception, and no external runtime or network dependency.
- Added reduced-motion-safe reveal styling and updated the PWA cache/build labels to V22.2.

## Validation

- `node --check motion-ui.js`
- `node --check scroll-story.js`
- `node finance-core.test.cjs`
- `node project-integrity.test.cjs`
- `node release-audit.test.cjs`
- `node restore-transaction.test.cjs`

All 37 automated assertions passed in the local run. Full interactive browser QA remains a separate step.
