# Stitch integration notes

The supplied `stitch_voltura_fintech_redesign.zip` is retained under `design-reference/stitch/` as the source of truth for visual review. Its HTML contains static presentation examples and sample values; it must not be copied wholesale into the live application.

The first pass integrates the shared design language through `stitch-integration.css` while preserving existing view IDs, event hooks, finance calculations and IndexedDB v3. Glassmorphism is intentionally limited to navigation chrome and summary panels. Ledger rows, inputs, quick-entry forms and dialogs remain opaque to keep financial text legible.

Next implementation steps: (1) map each reference screen to the existing live view and document component-level deltas, (2) rebuild the Accounts/Ledger/Budgets live view structures incrementally with existing IDs and render functions, (3) perform browser QA at mobile/tablet/desktop widths and 200% zoom, (4) integrate GSAP from a self-hosted licensed distribution with reduced-motion handling and no CDN.


## Liquid-metal button component review

The supplied React/TypeScript `LiquidMetalButton` was reviewed against the
current architecture. Its shader implementation requires React, TypeScript,
`@paper-design/shaders`, and a bundler. VOLTURA remains a static vanilla PWA,
so the component was not copied or made a framework migration prerequisite.
The existing local `liquid-metal.css` + `liquid-metal.js` provide the
architecture-compatible interaction: pointer-responsive highlight and click
ripple, with reduced-motion handling and no remote dependency or WebGL.
See `COMPONENT-INTEGRATION-LIQUID-METAL.md` for the integration decision.
