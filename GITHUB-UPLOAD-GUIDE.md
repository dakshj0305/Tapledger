# VOLTURA GitHub upload guide — V22.2

This ZIP contains a static PWA source folder. **GitHub does not expand a ZIP into a repository when you upload it.** Extract the ZIP first. The extracted `Tapledger-main/` folder contains the project root; publish the *contents* of that folder at the repository root.

## Recommended: preserve the existing GitHub repository history

1. Download and extract `VOLTURA-V22.2-GitHub-Upload.zip`.
2. Clone the existing repository (`dakshj0305/Tapledger`) using GitHub Desktop or `git clone`.
3. Copy the extracted project files into the cloned repository, replacing matching source files. Do not copy any temporary test output or browser profile.
4. Review `git status` and the diff. Confirm `index.html`, `sw.js`, `manifest.webmanifest`, the CSS/JS files and `icons/` are at the repository root.
5. Commit the changes in that existing clone and push using the repository's normal branch/PR process.
6. Verify the deployed `/Tapledger/` site, asset loading, service-worker install and offline relaunch after deployment.

Example shell flow (run from a directory outside the clone):

```sh
git clone https://github.com/dakshj0305/Tapledger.git Tapledger
# Extract the release ZIP, then copy the contents of Tapledger-main/ into ./Tapledger/
cd Tapledger
git status --short
git diff --check
# Review the changes before staging.
git add -A
git commit -m "Release VOLTURA V22.2"
git push
```

Do not blindly force-push. The separate Git bundle supplied with this release contains a **reconstructed local history** because the source ZIPs supplied for this conversation did not include the original `.git` directory. It is not a replacement for the existing GitHub repository's original history.

## GitHub website upload

Alternatively, open the existing repository on GitHub, choose **Add file → Upload files**, and upload the extracted project files (not the ZIP file) to the repository root. Check the 100-file and per-file upload limits in GitHub's UI; this package is intended to remain small. Commit to the intended branch after reviewing the changed-file list. For an existing repository, GitHub Desktop or a local clone is safer because it preserves the repository's previous files and history.

## GitHub Pages settings

- The documented target is `https://dakshj0305.github.io/Tapledger/`.
- Keep the project root files at repository root; do not put an extra nested folder above `index.html`.
- Preserve relative `./` asset paths, PWA scope and `?a=1`, `?i=1`, `?add=1` quick-entry routes.
- `.nojekyll` is included.
- Select the repository's configured GitHub Pages source/branch and verify the published site after deployment.

Before publishing, review the privacy/terms/cookies drafts and complete the manual QA items in `QA-REPORT.md`. Do not add a `CNAME` for `voltura.finance` until registration and DNS ownership/configuration are confirmed. This guide does not claim that any deployment has occurred.
