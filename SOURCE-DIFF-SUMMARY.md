# V20.9 source diff summary

Baseline: `Tapledger-v20.7-polished.zip` (the archive supplied earlier in this conversation). No original `.git` directory or repository history was included, so this is a file-level comparison rather than a Git commit.

## Application and UI files changed

- `index.html` — reordered CSS loading so the design system follows legacy structural CSS; removed the broken oversized prism markup; labelled the hidden chart data table; aligned the visible release label and default theme-color.
- `design-system.css` — aligned current visual-system release metadata and removed obsolete hidden decoration selectors.
- `polish.css` — completed responsive dashboard masthead, chapter rail, balance panel, tracked-position row, insight/goal panels, touch target sizing, contrast fixes, and off-screen accessible table containment.
- `motion-ui.css` — reduced the motion layer to progressive reveal, view transitions, reduced-motion behavior and the mobile dock; removed old glass/ambient presentation rules.
- `motion-ui.js` — removed a duplicate 3D tilt listener and unused ambient/pointer/chart variables; kept one fine-pointer tilt handler and made passive wheel sensing visibly drive a temporary chapter-rail perspective response.
- `liquid-metal.css` — retained tactile button/ripple feedback using flat accessible surfaces rather than a separate glossy visual system.
- `scroll-story.js` — made the three finance chapters active from scroll position, added continuous progress fill, and retained a no-IntersectionObserver fallback.
- `app.js` — synchronized browser theme-color metadata with the light/dark/system appearance preference and aligned the source release label.
- `sw.js` — advanced the service-worker cache namespace to V20.9.
- `manifest.webmanifest` — aligned theme/background colors with the refreshed palette.

## Tests and release documentation changed

- `release-audit.test.cjs` — added regression coverage for dashboard layout, contrast, accessible chart data, theme/progress behavior, brand contrast and passive trackpad motion; 27 total tests pass across the three suites.
- `README.md`, `RELEASE.md`, `QA-REPORT.md`, `AUDIT-REPORT.md`, `BRAND.md`, `MOTIF-SYSTEM.md`, `COMPONENT-INTEGRATION.md` — aligned current release notes and verification scope.
- `UI-QA-CHECKLIST.md` — added browser interaction and device verification scope.
- `SHA256SUMS.txt` — regenerated from all project files except the checksum manifest itself.

## Data and compatibility

- No IndexedDB schema, store, key, index, migration marker, transaction arithmetic or backup compatibility changes were made.
- Database remains `tapledger-db`, schema version 3.
- No external scripts, remote fonts, analytics or third-party runtime dependencies were added.
- No files were deleted in this pass. The source archive does not include Git metadata; no commit or deployment was created.
