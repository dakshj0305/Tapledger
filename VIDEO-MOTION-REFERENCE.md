# Smarter Growth video — motion direction

## Reference traits observed

- Near-black stage with a minimal top navigation.
- Large centered white editorial serif headline.
- Compact pill-shaped primary action.
- Three broad pastel cards (lavender, mint, warm yellow) with simple line illustrations.
- Rounded geometry, concise labels and restrained dark pill actions.
- A short, quiet entrance: content settles into a balanced row rather than using a pinned scroll spectacle.

## VOLTURA translation

- Preserve VOLTURA's forest-green / chartreuse identity and financial information hierarchy.
- Use the reference's editorial pacing, generous spacing and staggered card entrance as motion guidance, not its literal marketing layout.
- Keep the existing pastel insight surfaces distinct from glass surfaces. Glass is reserved for selected navigation / floating summary layers; data cards remain opaque for contrast.
- Use GSAP only when a local GSAP + ScrollTrigger build is supplied. `motion-ui.js` detects it and progressively enhances reveal transitions. Without it, the CSS/IntersectionObserver implementation remains functional.
- Never pin the finance dashboard or intercept wheel/touch scrolling. Respect `prefers-reduced-motion` and preserve immediate access to balances and ledger actions.

## Integration notes

No external script URL, font, image, network request, or framework dependency is introduced. Native scrolling and the offline service-worker cache remain the baseline.
