# FullScreenScrollFX component review and VOLTURA integration

## Decision

The supplied `FullScreenScrollFX` is not copied verbatim. It is a React/TypeScript component built around a pinned, full-viewport slideshow. VOLTURA is a static, vanilla-JavaScript PWA and its product interaction requirements retain native document scrolling. Introducing React, TypeScript, Tailwind, shadcn and a new build pipeline solely for this component would be a disproportionate architecture migration; a pinned scroll scene would also conflict with the existing dashboard's ordinary scrolling and mobile usability.

## Existing project conventions

- UI components and interactions live in the existing HTML/CSS/JavaScript files; there is no `/components/ui` convention or React build pipeline.
- Styles are authored in the root CSS files and loaded directly by `index.html`.
- `scroll-story.js` already provides chapter navigation, progress and active-section tracking using native `IntersectionObserver`, `requestAnimationFrame` and `scrollIntoView`.
- `motion-ui.js` supplies progressive motion and reduced-motion handling.
- `sw.js` precaches local app assets. A remote GSAP/ScrollTrigger CDN dependency is not acceptable for this local-first/offline PWA.

## Compatible integration

The existing `scroll-story.js` contains an optional enhancement hook: if locally hosted `window.gsap` and `window.ScrollTrigger` are present, it registers ScrollTrigger and animates chapter entry. The native implementation remains the complete offline-safe fallback. It does not pin the page or trap scrolling.

The new component's reusable ideas are therefore mapped as follows:

| Supplied component capability | VOLTURA approach |
| --- | --- |
| Section index and active state | Existing chapter links and `aria-current` |
| Progress indicator | Existing chapter progress bar |
| Background/title transitions | Existing view/chapter CSS transitions |
| ScrollTrigger pinning | Intentionally omitted |
| `next`, `prev`, `goTo` | Native chapter links with smooth `scrollIntoView` |
| Reduced-motion support | Existing `prefers-reduced-motion` checks |
| External background images/audio | Omitted; local-first and no unrequested assets |

## Framework setup (only if a future migration is explicitly approved)

For a future React/shadcn migration, initialize shadcn using its current CLI in a separate branch, configure Tailwind and TypeScript, and set the component alias to `@/components`. Keep reusable UI primitives under `src/components/ui` (or the configured `components/ui` path) so shadcn CLI additions, imports and generated components share one predictable location. This is not required for the current VOLTURA app and must not be run against the live project as part of this integration.

## GSAP installation

The current source does not contain a local GSAP distribution or package manifest. No package could be installed from the available offline environment, so this change does not claim to bundle GSAP. To enable the optional hook, vendor a licensed GSAP distribution and ScrollTrigger locally, load both from the app's own origin before `scroll-story.js`, add both files to `sw.js`'s `APP_FILES`, and test offline startup. Do not add a CDN URL.

## Verification boundary

The supplied component was reviewed for architecture fit; it was not copied as a nonfunctional TSX file. Existing project automated tests should be run after any integration changes. Browser-level mobile and desktop verification remains a separate required QA step.
