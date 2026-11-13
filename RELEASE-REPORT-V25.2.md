# VOLTURA V25.2 — Atelier visual repair release

**Build:** `VOLTURA-25.2-ATELIER-20261113`  
**Architecture:** static HTML, CSS and vanilla JavaScript  
**Storage:** existing `tapledger-db`, IndexedDB version 3

## What changed

V25.2 resolves the main visual consistency problem in the prior release: several independent visual systems were loaded sequentially and competed over the same component selectors, palette, shadows and transforms. A single final Atelier layer now establishes a coherent visual system across the overview, data views, dialogs and navigation.

The design uses mineral paper, deep pine, warm brass and editorial serif typography. The dashboard uses a dark, restrained cash-flow instrument with subtle metallic orbital geometry. Dense financial information stays on opaque, high-contrast surfaces. A matching dark appearance is included.

The previous two independent pointer tilt systems were removed from the active interface because they both wrote transforms to the same cards. This was a source of pointer-exit jumps and inconsistent hover states. The 3D orbital object remains, but its parallax is isolated to the object itself.

The Canvas 2D fallback was also corrected: if a browser blocks or lacks a 2D context, the canvas is removed and the rest of the motion script continues rather than returning from the entire initializer. Reduced-motion users receive a static rendering and no animation loop.

## Data and compatibility safeguards

- `tapledger-db` and IndexedDB version 3 are unchanged.
- Store names, key paths, indexes, and record formats are unchanged.
- Monetary values remain integer paise.
- Additive JSON restore and existing backup compatibility are unchanged.
- NFC / quick-entry routes `?a=1`, `?i=1`, and `?add=1` are unchanged.
- No finance data is read or written by the visual/motion layer.
- No CDN, remote font, analytics or external runtime is added.

## Verification

The dependency-free Node test suites, syntax checks, stylesheet/precache checks, manifest parsing and release archive checks are run for this release. The browser screenshot process in this environment did not complete reliably, so a visual Chromium screenshot, real-device responsive review, NFC hardware check, installed-PWA update/offline check and deployed-site review remain outstanding. This report does not claim those checks were completed.

## GSAP status

GSAP is not bundled in this package. The visual layer remains native CSS/Canvas/JavaScript and does not claim GSAP integration. No third-party source was fabricated or substituted under the GSAP name.
