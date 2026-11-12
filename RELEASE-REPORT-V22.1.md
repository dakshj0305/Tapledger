# VOLTURA V22.1 — Stitch integration first pass

- Build ID: `VOLTURA-22.1-STITCH-20261113`
- Base: supplied V22.0 project archive (the supplied ZIP did not contain its original `.git` directory)
- Design source: `design-reference/stitch/`

## Delivered
The Stitch reference package is now retained in the repository and its shared visual system is applied to the live application through `stitch-integration.css`, loaded after the prior visual layers. The update changes the surface palette to mineral stone and forest green, introduces chartreuse interaction emphasis, improves typography and spacing, rounds major panels, and explicitly pairs text colors with their backgrounds. Glassmorphism is selective: navigation chrome and summary surfaces may use blur; ledger data, inputs, quick-entry sheets and dialogs remain opaque.

The existing finance app remains the source of truth. No static Stitch sample balances, names, fake activity or fake analytics have been copied into the app. Existing view IDs, app handlers, local data model, IndexedDB v3 identity/schema and offline-only asset policy remain in place.

## GSAP status
GSAP was requested, but no GSAP distribution is present in either supplied archive or the workspace. This environment previously could not reach the npm registry. I did not add a CDN script or claim GSAP is integrated; this would compromise the self-hosted/offline constraint. GSAP remains a clearly documented follow-up for a locally supplied/available licensed build.

## Verification
`node --test *.test.cjs`: **37 passed, 0 failed**. This is automated source-level verification; it is not a substitute for full interactive browser QA across devices, zoom levels and themes.
