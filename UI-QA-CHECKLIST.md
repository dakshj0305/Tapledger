# VOLTURA UI QA — V20.9

## Browser-rendered checks completed

| Area | Viewports / path | Result |
|---|---|---|
| Dashboard layout | 1440, 820, 390, 320 CSS px | Passed; no horizontal overflow |
| Primary navigation | Desktop/tablet | All 8 views switched correctly |
| Mobile navigation | 390 CSS px | Dock and More dialog exercised |
| Quick expense | Desktop, tablet, mobile | Form opened and save handler completed using test-only storage shim |
| Manual entry | Desktop, tablet, mobile | Form opened and save handler completed using test-only storage shim |
| Cash-flow chart | Seeded transactions | 12 monthly bar elements rendered |
| Chapter navigation | Scroll positions 400, 900, 1400, 2000 px | Progress reached ~17.5%, 44.0%, 71.5%, 100% |
| Appearance | Light, dark, system | Theme-color metadata changed correctly |
| Console | Tested runs | No page errors or console errors |

## Scope and limitations

The execution environment blocks normal navigation to local HTTP and file URLs. To inspect the rendered page, the project HTML, stylesheets and scripts were inlined into a Chromium `setContent` harness. The harness used a disposable in-memory IndexedDB-compatible shim so the real app initialization, navigation and form handlers could run. The shim is not part of the shipped project and does not prove real IndexedDB persistence.

Still required on the deployed HTTPS origin:

- Verify IndexedDB data survives a reload and browser restart.
- Verify service-worker install, waiting, activation, update prompt and offline reload.
- Verify NFC URL launch on a physical phone/tag.
- Verify voice input consent and the browser's speech provider behavior.
- Test with keyboard and a screen reader; run axe or an equivalent accessibility audit.
- Run Lighthouse on a normal browser profile and test actual touch/trackpad hardware.

## Reproduce source checks

```sh
for f in *.js; do node --check "$f" || exit 1; done
node --test finance-core.test.cjs project-integrity.test.cjs release-audit.test.cjs
sha256sum -c SHA256SUMS.txt
```

### Extended interaction regression checks

- `?a=1` quick-expense and `?i=1` income-entry routes: both open the intended dialog, focus the amount field, enable submit after app initialization, and call query cleanup (test-only URL shim).
- Invalid quick-expense amount: rejected, `aria-invalid` set, and no record written.
- Quick expense double-submit: one record written; success state shown; Undo removed the record; Add another reopened a clean form.
- Manual entry double-submit: one record written; native invalid amount was rejected without a write.
- Trackpad wheel gesture: chapter nav transform changed during the gesture and returned to its neutral transform after the reset transition; native scroll position advanced.
- Keyboard: first Tab reaches the skip-to-content link.
- Reduced motion and forced-colors media emulation: no runtime errors; reduced motion removes transitions/tilt.
- 200% root text sizing at 320, 390 and 720px: no horizontal overflow.
- All eight application views: no horizontal overflow at 1440px desktop or 390px mobile.
- Quick-entry dialog closes on Escape; quick-entry text/select controls measured at 16px or larger on the 390px mobile viewport.
- Key contrast ratios calculated from the shipped color tokens: balance text/lime 14.51:1, balance label/lime 11.81:1, insight body/dark surface 11.64:1, insight link/dark surface 14.51:1.
