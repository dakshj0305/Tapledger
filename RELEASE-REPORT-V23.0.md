# VOLTURA V23.0 release report

**Build:** `VOLTURA-23.0-20261113`\n\n## Scope
V23.0 is a visual/interaction enhancement layered on the audited V22.2 static PWA. It introduces restrained 3D pointer tilt, specular card highlights, ambient background depth and refined elevation using local CSS and vanilla JavaScript.

## Compatibility
- No React, TypeScript, Tailwind, shadcn, WebGL or external runtime dependency.
- No pinned scrolling or wheel interception.
- Touch-first and narrow-screen layouts suppress hover tilt.
- `prefers-reduced-motion` disables transitions and transforms.
- Finance logic, integer-paise amounts, IndexedDB `tapledger-db` version 3, stores, key paths and backup format are unchanged.
- Service worker cache version is `voltura-platform-v23.0` and precaches both new assets.

## Validation
Run all `*.test.cjs` files with Node. Validate JavaScript syntax with `node --check`. Verify the service-worker asset list against the ZIP contents and check the extracted ZIP CRC. Visual cross-browser QA still requires deployment and real-device review; automated source tests are not a substitute.
