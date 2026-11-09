# VOLTURA v14 — Architecture and integration notes

## Runtime architecture

Voltura is a static client-side application:
- `index.html` is the app shell and all screen markup.
- `style.css` contains the matte graphite/mineral design system with electric-lime and satin-steel accents and responsive behavior.
- `app.js` owns view rendering, validation, IndexedDB access, ledger calculations, NFC query handling, export/restore, optional voice entry and the native visual interactions.
- `sw.js` caches the static same-origin app shell for repeat/offline loads.
- `manifest.webmanifest` and local icons enable PWA installation.

There is no server-side API or bank connection in this package.

## Data and migration

Database name and schema are intentionally unchanged: `tapledger-db`, version `3`. Existing stores are retained. The legacy `expenses` store is read by the migration code and old expense records are placed into an `Imported history` account so that an unknown historical starting balance is not incorrectly inferred. The migration marker is stored in the existing `settings` store. Appearance preferences (including finish, tint, saturation and edge highlight) are stored in `settings` without a schema upgrade.

## NFC routing

- `?a=1` opens the new expense form.
- `?i=1` opens the new income form.
- `?add=1` remains as a legacy expense action.

The app removes the action query from the visible URL after reading it. The NFC tag stores only the URL; it does not store transaction details. Actual card capacity/format compatibility depends on the physical tag and NFC writer. Do not lock a tag during experimentation.

## Motion model

The portal uses pointer-force displacement and a radially expanding, decaying wave, with an edge pin and damped spring response. These are equations used to render a visual effect; they should not be described as literal fluid physics, exact real-world measurements or financial science.

## Privacy boundary

Financial data is stored in IndexedDB in the current browser profile. Service-worker Cache Storage contains static application files, not ledger records. No cookies, localStorage, sessionStorage, tracker, ad script or third-party asset request is implemented in the supplied source. The optional browser speech-recognition feature requires explicit opt-in and can involve processing outside the device by the browser/provider.
