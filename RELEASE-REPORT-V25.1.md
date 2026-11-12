# VOLTURA V25.1 — Release hardening report

## Changes
- Synchronized V25.1 labels in the HTML build ID, sidebar, app version, and service-worker cache.
- Added graceful fallback when Canvas 2D or ResizeObserver is unavailable.
- Retained the existing local-first finance engine, database identity/version, backup/restore logic, NFC routes, and offline shell.

## Verification
- Automated project, finance-core, restore, release-audit, and release-packaging tests are run against the source and packaged archive.
- JavaScript syntax is checked with Node.
- ZIP CRC and SHA-256 manifest are verified.
- Headless Chromium was attempted, but the browser process did not complete reliably in this environment; no claim of full interactive browser QA is made.

## Explicit blocker
A genuine GSAP distribution could not be obtained: no local copy exists in the supplied files or machine caches, and outbound DNS/package-registry access failed. The code is not relabelled as GSAP. Therefore this is a hardening release, not yet the requested GSAP-complete final release.
