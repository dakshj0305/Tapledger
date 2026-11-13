# VOLTURA V26.0 — verification report

**Build:** `VOLTURA-26.0-UNIFIED-20261113`  
**Verification date:** 13 November 2026

## Automated verification

- Node syntax checks: all project `.js` and `.cjs` files passed.
- Node test suite: **48/48 tests passed** (`node --test *.test.cjs`).
- CSS bundler reproducibility: `node build-css.cjs` output matches the committed `voltura.css` byte-for-byte.
- CSS parser validation: all 9 source layers plus final overrides parsed without declaration/rule errors using `tinycss2`.
- CSS design guardrails: no gradients, backdrop blur, filter blur or decorative shadows remain in the runtime bundle; intentional hard offset button shadow is retained.
- HTML and runtime assets: local script/style references and every service-worker precache path resolve within the source package.
- Manifest JSON, JavaScript syntax, archive CRC and SHA-256 manifest are checked during release packaging.
- IndexedDB V3 contract, integer-paise storage and restore compatibility are protected by existing regression tests.
- Quick-boot unit tests cover `?a=1`, `?i=1`, ordinary visits, first-paint dialog selection, loading states and premature-save blocking.

## Rendered layout verification

A Chromium Playwright visual harness rendered the local HTML and CSS in memory, with local motion code enabled and database-dependent app initialization excluded because the browser sandbox blocks navigation to both local HTTP and file origins and denies IndexedDB in its opaque `about:blank` context.

Verified viewport widths: **1440, 1024, 768, 390 and 360 CSS pixels**. The Overview and all eight application views were checked at desktop and mobile widths. No horizontal document overflow was observed. Expense and income quick-entry loading surfaces were also rendered at 390px; both fit the viewport, and the expense form fields remain hidden until initialization completes.

The visual audit exposed and repaired several real layout defects:
- An old CSS selector-boundary collision positioned the balance hero absolutely and inflated it to 400px.
- The manifesto mark inherited the wrong flex sizing and expanded to over 1,000px.
- The Canvas element participated in the balance hero grid, causing a recursive ResizeObserver size expansion; it is now absolutely positioned within the hero.
- The `hidden` attribute on quick-entry fields was overridden by an explicit display rule; an explicit hidden-state rule now prevents premature form exposure.
- The orbital object is constrained to the masthead and no longer covers the financial summary.
- The mobile masthead and orbital rings were checked for horizontal overflow.

## Not verified / release limitations

- Full application runtime against a real secure origin and IndexedDB could not be exercised in this sandbox; the browser administrator blocked local HTTP/file navigation and opaque-origin IndexedDB is denied.
- Physical Android NFC tag behavior, Android app-link/PWA capture, Galaxy S23 FE keyboard behavior, installation and service-worker update lifecycle require target-device testing.
- Real user-profile IndexedDB data was not opened or modified.
- Assistive technology, screen readers and physical forced-colors testing were not available.
- GSAP is not integrated: the official distribution is absent from the project/local package cache and external DNS retrieval attempts failed. No CDN dependency or fake GSAP shim is used.
- No GitHub push or deployment was performed. GitHub Pages headers, HTTPS installation and deployed offline behavior remain unverified.
- Legal review, trademark clearance and security certification are outside this source-code QA pass.

Automated and visual harness checks reduce known defects but do not prove that every browser/device combination is defect-free. Do not represent this report as a production certification.
