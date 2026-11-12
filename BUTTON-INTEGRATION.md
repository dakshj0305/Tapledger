# Liquid-metal button integration

The supplied `LiquidMetalButton` is a React + TypeScript component and uses `@paper-design/shaders`. VOLTURA is a vanilla JavaScript, static/offline-first PWA with no React, TypeScript, Tailwind, or shadcn runtime. Converting the whole app just to mount this component would add a second UI stack and compromise the simple offline deployment.

Instead, the visual and interaction treatment has been adapted to the existing stack in:

- `liquid-metal.css` — chrome/liquid-metal gradient, pointer-lit highlight, depth, focus, hover and pressed states.
- `liquid-metal.js` — delegated pointer tracking and click ripples; no dependencies or remote requests.
- `index.html` — loads both local assets.
- `sw.js` — precaches the assets and advances the cache version.

The treatment is applied to `.button-primary`, `.button-light`, and `.icon-button`. Existing click handlers, form behavior, labels, and navigation remain unchanged. Reduced-motion preferences are respected. The Paper Design fragment shader itself is not bundled; this is an offline-safe visual adaptation, not a React/WebGL port.
