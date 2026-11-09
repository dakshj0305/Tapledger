# Vellum v11 — QA report

## Scope
This report covers the static Vellum app and the native integration of the user-supplied GlyphPortal wrapper, GlassWorkspace component and KineticGrid implementation ideas. It does not certify the live GitHub Pages deployment, the user's Android device, the user's physical NFC tag or any browser speech provider.

## Checks performed for this release

| Check | Result | Evidence / limitation |
|---|---|---|
| JavaScript syntax | PASS | `node --check app.js` completed without syntax errors after the v11 patch. |
| HTML parsing | PASS | Parsed `index.html`, `privacy.html`, `terms.html` and `cookies.html`; checked main document structure and unique IDs. |
| Manifest JSON | PASS | `manifest.webmanifest` parses as JSON; declared local icon files exist. |
| Local file references | PASS | App shell, stylesheet, script, legal CSS/pages, manifest, local icons and service-worker app-shell entries are present. |
| Archive integrity | PASS | Final ZIP was tested with `unzip -t`. |
| Third-party runtime assets | PASS (static scan) | Runtime HTML/CSS/JS/service worker contain no remote font, image, script, iframe, analytics or tracking URL. The SVG namespace URL is markup metadata, not an asset request. |
| Network code | PASS with boundary | Service-worker `fetch()` is limited to same-origin app-shell requests. Web Speech is browser-mediated and can involve a vendor service only after opt-in. |
| IndexedDB compatibility | PASS (source inspection) | `tapledger-db` and DB version `3` remain unchanged; no object-store schema upgrade was added for the visual effects. |
| NFC URL compatibility | PASS (source inspection) | `?a=1`, `?i=1`, and legacy `?add=1` are still read by `applyUrlAction()`. |
| Component integration | PASS with documented boundary | Native versions of the visible concepts are included. The actual GlyphPortal component source was not supplied, so its hidden internals are not reproduced. |
| Kinetic animation idle scheduling | FIXED (static code review) | Frame scheduling now continues only while pointer/strength/ripples/letter springs are unsettled; stationary hover no longer unconditionally schedules frames. |
| Touch/pen release | FIXED (static code review) | Non-mouse `pointerup` returns target strength to zero. |
| Reduced motion | PASS (source inspection) | `prefers-reduced-motion` disables active animation and renders a static state. |
| Legal pages | PASS as drafts | Privacy, Terms and Cookies pages are included. They contain draft-status warnings and publisher placeholders; they are not legal advice. |

## Browser test limitation
A fresh interactive browser smoke test was attempted against a local HTTP preview, but Chromium navigation in the current execution environment returned `ERR_BLOCKED_BY_ADMINISTRATOR` for localhost and file URLs. Therefore, the v11 build's full interactive browser run is **UNVERIFIED in this execution environment**. The v10 package's prior QA report documented a local Chromium smoke test, but the v11 animation-loop change has only been statically checked here.

## Contrast and accessibility notes
- The Vellum palette and CSS include text, surface and focus tokens; however, this release does not claim an exhaustive WCAG 2.2 AA pass for every computed colour combination, translucent backdrop, hover state and dynamically generated component. Those combinations should be verified in a real browser with computed styles and an accessibility testing tool.
- The app includes a skip link, semantic navigation/landmarks, accessible names on icon-only controls, native dialogs with focus return and keyboard trapping, live status/toast messaging, form labels and error messaging, reduced-motion styles and a forced-colors treatment.
- Screen-reader behavior, 200% zoom, 320 CSS px reflow and target touch sizes still require manual testing with the specific Android/Windows browsers and assistive technologies in use.

## Data and privacy boundary
- IndexedDB stores include legacy `expenses`, `settings`, `transactions`, `budgets`, `goals` and `accounts`.
- `settings` keys include migration state, the old monthly budget migration value, optional speech consent and the visual `glass-material-v1` preference.
- Service-worker Cache Storage contains only static app-shell files.
- No `localStorage`, `sessionStorage`, cookie API or analytics tracker is used by the app source.
- NFC action query values are read and removed from the visible URL after routing; no financial amount or personal information is put into the NFC URL.
- Voice recognition is optional and gated by explicit on-device consent. Audio/speech processing may occur outside the device under the browser/vendor service; exact provider, location and retention are not controlled or verified by Vellum.

## Asset/copyright status
The runtime uses inline SVG paths, locally packaged Vellum SVG/PNG icons, system fonts and CSS/Canvas-generated graphics. No remote photographic asset or remote font is used. The package does not contain a formal licence file assigning rights in the project logo/icon artwork; see `ASSET-PROVENANCE.md`. Rights should be confirmed by the publisher before commercial release.

## Remaining UNVERIFIED items
1. Live GitHub Pages deployment and service-worker update on the user's actual site.
2. Physical MIFARE Ultralight EV1 NDEF write/read success and exact URL fit on the tag.
3. Android touch and PWA installation behavior on the user's phone.
4. Actual Web Speech recognition availability, service provider and external processing behavior.
5. Screen-reader, keyboard, zoom/reflow, contrast and touch-target testing on the target browsers.
6. Legal sufficiency under Indian law; have an Indian-law-qualified lawyer review every legal draft before publication.

This report does not guarantee that no defects remain. Export a JSON backup before updating and test on the live site before relying on Vellum for important records.


## v13 visual regression scope
- CSS-only redesign plus updated cache version and visible release label.
- Existing DOM IDs and application JavaScript are unchanged.
- No external images, fonts, scripts, APIs or tracking requests were added.
- Responsive overrides cover desktop and narrow mobile layouts; reduced-motion override disables the new orb motion.
- Visual appearance still requires real browser review at desktop and Android viewport sizes.

## v13 motif pass
- Visual motif is implemented with CSS and existing markup; no new runtime dependency.
- Reduced-motion override disables the waypoint animation.
- Existing data IDs and JavaScript logic are retained from v12.
- Automated checks cover JavaScript syntax, HTML parsing, duplicate IDs and ZIP integrity; full browser/device visual QA remains a manual step.
