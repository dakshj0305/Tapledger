# QA notes

## Static checks completed
- HTML parser accepted the document.
- No duplicate HTML IDs detected.
- All in-page `href="#..."` anchors resolve to an element ID.
- Both inline JavaScript blocks pass `node --check`.
- The ticker contains two matching content passes for a seamless loop.
- Reduced-motion CSS fallback is present.
- GSAP `matchMedia()` gates scroll reveals when reduced motion is requested.

## Not verified
- A real browser visual pass could not be completed in this environment; headless Chromium did not finish rendering.
- No cross-browser/mobile device interaction test was run.
- No live CDN/network/font-load test was completed.
- No accessibility audit with assistive technology was completed.
- No end-to-end test of transaction entry, persistence, export/import, IndexedDB, PWA install, or offline behavior was run.
- No change was made to the user's local v19 project or deployment.

## Before production
1. Integrate into the actual v19 source only after checking the working tree and making a backup.
2. Self-host the Aspekta WOFF2 and license text if offline reliability is required.
3. Replace illustrative balances/calculator assumptions with verified product data and approved calculations.
4. Test at 320px, 375px, 768px, 1024px, 1440px and 200% zoom.
5. Test keyboard-only navigation, reduced motion, VoiceOver/NVDA, and all quick-entry paths.
6. Inspect browser console/network, GSAP animation behavior, and calculator outputs in current Chrome, Firefox and Safari.
