# Component integration and source notes

## Current VOLTURA v18.1

The project is a static HTML/CSS/JavaScript PWA. The supplied source package did **not** include the optional `KineticGrid.tsx` file named in the design brief. Accordingly, this release does not claim to port or execute that React canvas component. A static original VOLTURA SVG mark is used instead; this avoids an animation dependency on the fast NFC entry route and follows the flat/matte design direction.

## NFC quick-entry route

`quick-boot.js` is loaded immediately after the dialog markup and before `app.js`. On `?a=1`, it opens the quick expense dialog during document parsing; on `?i=1`, it opens the existing income-entry dialog. Both focus the amount field and prevent submission until the main app has opened the existing IndexedDB ledger and attached its handlers. `app.js` then removes the shortcut query with `history.replaceState`, loads local category/account preferences for expense entry, and enables saving.

## Data compatibility

The app continues to use IndexedDB database `tapledger-db`, version 3, and preserves the existing migration marker. The NFC quick expense is stored in the same `transactions` object store as manually entered transactions. The `time` property is optional, so older rows without a time remain valid.

No third-party scripts, remote fonts, external analytics, advertising endpoints or telemetry services are introduced.
