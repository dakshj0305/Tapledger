# VOLTURA project instructions for OpenCode

You are working in the existing VOLTURA static, local-first personal-finance PWA. Do not replace it with a new app or framework.

## Product objective
The most important flow is NFC tap -> quick-add expense -> save -> done -> review later. A tag opens a URL; the website must render a focused quick-entry view. Do not claim that an NFC tag creates a native Android popup. On Android, URL tags normally open the browser; opening the installed PWA depends on OS/browser link-capture support and user settings and must be tested on the real device.

## Current deployment constraints
- GitHub repository: `dakshj0305/Tapledger`.
- GitHub Pages project path: `/Tapledger/`.
- Temporary site URL: `https://dakshj0305.github.io/Tapledger/`.
- Do not use `voltura.finance` as a canonical URL until the user owns/configures that domain.
- Do not add or retain a `CNAME` file for `voltura.finance` unless the owner explicitly confirms the domain is registered and its DNS is configured.
- Keep asset, manifest, service-worker, navigation, and shortcut URLs compatible with the `/Tapledger/` project path.

## Data safety — do not violate
- Preserve IndexedDB database name `tapledger-db` and schema version 3 unless a migration is demonstrably necessary and fully tested.
- Preserve existing stores, keys, indexes, migration markers, and backup compatibility.
- Continue importing backups tagged `TapLedger`, `Cairn`, and `Vellum`; write new exports as `Voltura`.
- Do not delete, reset, rename, or silently migrate user data.
- Before modifying persistence, explain the exact read/write impact and add tests for old data and backup restore.
- Use integer paise for monetary arithmetic; do not use binary floating-point for saved transaction amounts. Validate amounts to a maximum of ₹10 crore and two decimal places.

## NFC routes and quick-add behaviour
- Preserve `?a=1` for expense and `?i=1` for income.
- On either route, render the quick-add sheet/page on the first visible paint. Do not show a splash/intro or render the dashboard first.
- Focus the amount field when safe; do not steal focus in a way that breaks assistive technology or mobile keyboards.
- For the common path, amount -> category -> Save should take no more than three user actions.
- Use recent categories from local transaction history and default to the last-used account; fall back deterministically if no history exists.
- Support optional merchant/note and editable date/time.
- Voice entry is optional and opt-in. Never request the microphone before explicit consent. Voice suggestions are prefill only; the user must review before saving.
- Prevent double-submit. On success, show a visible and accessible Saved state, Undo for about five seconds, Add another, and View dashboard/Done actions.
- After save, strip `a`/`i` query parameters using `history.replaceState` to prevent refresh/back from repeating the quick-add launch.
- Do not depend on `window.close()`; it usually cannot close a tab opened by scanning an NFC tag.
- Clearly handle IndexedDB unavailable/open failure and offline first-load failure. Do not claim offline support unless the service worker cache actually supports it.

## Design and accessibility
- Follow the latest VOLTURA brief: bold, saturated accent; flat, matte surfaces; no glassmorphism, broad gradients, blur, glow, or soft decorative shadows. A small crisp highlight is acceptable on primary elements only.
- Provide light and dark themes; respect forced-colors and `prefers-reduced-motion`.
- Inputs must use at least 16px text on mobile, suitable inputmode/autocomplete, visible labels, clear validation, and safe-area insets.
- Mobile touch controls should be at least 44x44 CSS pixels.
- Maintain keyboard access, visible focus, semantic landmarks, labels, aria-invalid/aria-describedby, status/error live regions, and sensible focus management. Escape/back should close a dismissible sheet without trapping the user.
- Amounts use tabular numerals. Income and expense must not be distinguished by colour alone.
- No horizontal overflow at 320px or at 200% text zoom.

## Privacy, security, and legal copy
- Do not add trackers, analytics, advertising, third-party scripts, external fonts, or external APIs.
- Inspect and document every external URL/network request before making a change.
- Use a Content Security Policy only if it matches the app's actual inline/script/style/connect needs; do not claim GitHub Pages can set arbitrary response security headers.
- Do not add a cookie banner unless the actual code sets non-essential cookies or tracking technologies.
- Describe IndexedDB and Cache Storage truthfully. Explain export, deletion, retention, and local-device risk.
- Legal pages are drafts, not legal advice. Flag review by a lawyer qualified in Indian law. Do not claim SEBI/RBI authorisation, guaranteed accuracy, uptime, encryption, or security certification.
- Do not make claims about trademark availability. Remind the owner to search IP India and relevant international registers.

## Engineering workflow
1. Inspect the current implementation and related files before changing anything. List the files and relevant functions/selectors involved.
2. State a small plan and risks. Do not ask questions unless blocked by missing inputs.
3. Make the smallest complete change. Avoid broad rewrites and dependencies.
4. Preserve public routes, data compatibility, and existing features.
5. Run syntax checks, HTML/manifest validation where available, and targeted tests. Test `?a=1`, `?i=1`, invalid amounts, duplicate saves, Undo, Add another, account/category defaults, offline launch, import/export, and legacy migration when touching those areas.
6. Review `git diff` for accidental changes, broken URLs, secrets, stale brand strings, unsupported legal statements, and unrequested features.
7. Never commit or push without showing a concise summary and obtaining explicit user approval.
8. Report what was actually tested. Label real-device, browser, accessibility, performance, and legal checks as UNVERIFIED unless executed.

## Change request format
For every requested change, report:
- Goal
- Files/functions to change
- Data and compatibility risk
- Implementation
- Tests run and results
- Remaining UNVERIFIED items
- Exact git diff summary

Do not output placeholders such as "rest unchanged" in a release artifact. Never say a deployment is complete unless GitHub Actions and the actual published URL were checked.
