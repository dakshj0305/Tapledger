# Vellum v11 — Supplied React component integration

## Integration decision

The supplied snippets are React/TypeScript components, while Vellum is a static HTML/CSS/JavaScript PWA hosted on GitHub Pages. The supplied snippets import local modules and packages that are not part of Vellum. They cannot be pasted directly into the static application without introducing a build system and dependency chain.

Vellum therefore implements the observable visual and interaction ideas natively in browser code. No React, Next.js, GSAP, `@gsap/react`, Lucide, Tailwind, `@/lib/utils`, `@/components/...` or remote image/font dependency is shipped.

## 1. GlyphPortal wrapper

The supplied wrapper demonstrates:
- A large word (`SUBLIME`) rendered by a separate `GlyphPortal` component.
- An interactive mode.
- A scroll length setting.
- A front layer with brand text, eyebrow, supporting text and scroll hint.
- A custom font URL loaded from `cdn.21st.dev` with Arial fallback.

The `GlyphPortal` component implementation itself was not supplied. Its internal scroll choreography, annotations and exact motion cannot be verified. Vellum uses a native VELLUM wordmark portal with a staggered letter reveal and spring-responsive letter transforms, positioned in the overview introduction. It does not claim to reproduce the missing component's internal scroll behavior. The external font URL was intentionally not copied.

## 2. GlassWorkspace component

The supplied source is a React component with GSAP animation, Lucide icons, glass material controls, tabs, sample transactions/goals/cash-flow points, a demo user, USD formatting and a remote background image URL.

Vellum reuses the useful product ideas through its existing local-data-backed views:
- Overview and cash-flow visualization use actual Vellum transactions.
- Ledger provides activity/search and CSV export.
- Savings Goals shows the user's locally stored goals.
- Reports-style data is represented in the existing ledger/overview/insights views; the demo's hard-coded sample data is not imported.
- Adjustable glass material settings are available in Data & privacy and are stored as a small visual preference in the existing IndexedDB `settings` store (`glass-material-v1`).

The sample user identity, USD demo values, demo transactions/goals, GSAP runtime, Lucide package, and remote `backgroundImage` were not copied. Existing Vellum data and INR formatting remain authoritative.

## 3. KineticGrid component

The supplied KineticGrid source is ported into `initKineticPortal()` in `app.js`, scoped to the Vellum overview portal. It retains these elements from the supplied algorithm:
- 55 px grid cell spacing.
- 260 px pointer influence radius.
- Maximum 24 px pointer displacement.
- 0.2 s pointer smoothing time constant.
- 0.25 s influence-strength smoothing time constant.
- 400 px/s expanding ripple speed.
- 1.2 opacity units/s ripple fade.
- 55 px wave width.
- Maximum 8 simultaneous ripples.
- Ripple spreading attenuation `1 / sqrt(1 + radius / 80)`.
- Edge pinning, smooth falloff and Canvas 2D rendering.
- Device-pixel ratio capped at 2.
- Reduced-motion handling and pause when the document is hidden.

Vellum adds damped-spring movement to the individual wordmark letters. The animation loop now stops when the pointer, influence strength, ripples and letter springs settle; a stationary pointer no longer keeps the canvas rendering continuously. Touch/pen pointer release returns the visual field to rest.

The colour treatment is adapted to Vellum's midnight navy, parchment, forest and antique-brass palette. This is a decorative mathematical animation, not a literal fluid simulation or scientific measurement.

## Privacy and runtime

- Pointer coordinates are processed in memory only and are not persisted or transmitted.
- The canvas is decorative and hidden from assistive technology.
- The interaction is not required to access financial data or controls.
- No external image, web font, script, iframe, analytics endpoint, beacon or telemetry service is added.
