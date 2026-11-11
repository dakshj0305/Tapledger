# VOLTURA GitHub upload guide

This folder is a static web application. Publish the contents of this folder at the repository root for `dakshj0305/Tapledger`; GitHub Pages must serve the project under `/Tapledger/`.

## Upload

1. Review the changed files and `QA-REPORT.md`.
2. Upload the project files and `icons/` at repository root. Do not upload backups, browser profiles, temporary test outputs, caches, secrets, or `node_modules`.
3. Keep `index.html`, CSS, JavaScript, manifest, service worker, icons and legal draft pages at the repository root as arranged here. Preserve the `./` asset references and `./?a=1`, `./?i=1` shortcut URLs.
4. Select the repository's configured GitHub Pages source and check the published `/Tapledger/` site after GitHub finishes building it.
5. Before publishing, review privacy/legal copy and conduct the browser/device checks listed as NOT TESTED in `QA-REPORT.md`.

Do not add a `CNAME` for `voltura.finance` until the owner confirms registration and DNS configuration. GitHub Pages does not support arbitrary response security headers through project files. This guide does not claim a deployment has occurred.
