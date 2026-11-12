# Liquid-metal button integration (VOLTURA)

## Decision

The supplied `LiquidMetalButton` is a React + TypeScript component that imports
`@paper-design/shaders` and `lucide-react`. VOLTURA is intentionally a static
HTML/CSS/vanilla-JavaScript PWA. It has no React, TypeScript, Tailwind, shadcn,
npm build pipeline, or component bundler. Introducing those tools solely for
one button would require a framework migration and a new build/deployment
pipeline, and would conflict with the existing offline-first/CSP constraints.

For that reason, the React source is **not** copied into `/components/ui`.
That directory is a shadcn convention; it is not meaningful in this codebase.
No shadcn CLI, Tailwind, TypeScript, `clsx`, `tailwind-merge`, `lucide-react`,
or `@paper-design/shaders` dependency was added.

## Integrated equivalent

VOLTURA already contains a dependency-free progressive enhancement:
- `liquid-metal.css` applies a restrained liquid-highlight treatment to
  `.button-primary`, `.button-light`, and `.icon-button`.
- `liquid-metal.js` tracks pointer position and adds a short ripple on click.
- The effect respects `prefers-reduced-motion`, has no canvas/WebGL shader,
  does not block button actions, and works without network access.
- `index.html` loads both local assets and `sw.js` precaches them.

This keeps the existing button semantics, event listeners, labels, focus
styles, and 44px icon-button target sizes intact. The visual treatment is
intentionally subtle and matte to remain consistent with the VOLTURA design
brief and preserve contrast.

## Where to extend it

- Shared styles: `liquid-metal.css`
- Progressive enhancement: `liquid-metal.js`
- Button markup and existing app actions: `index.html` and `app.js`
- Offline precache: `sw.js`

If the product later adopts React, create `/components/ui` as the shared
shadcn-compatible home for reusable primitives, then migrate the app as a
separate, explicitly approved architecture project. Do not install a React
component into the current static runtime.
