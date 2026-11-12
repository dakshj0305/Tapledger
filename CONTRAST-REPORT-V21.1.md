# VOLTURA contrast report — V21.1

Date: 2026-11-12

Ratios below are calculated from the authored design tokens using the WCAG relative-luminance contrast formula. These are token-pair calculations, not a pixel-by-pixel audit of the rendered pages or every dynamic data state.

| Pair | Ratio | Target | Result |
|---|---:|---:|---|
| Dark primary text `#F1F5EB` on canvas `#0B1211` | 17.14:1 | 4.5:1 | Pass |
| Dark muted text `#A2B1A6` on card `#15211D` | 7.40:1 | 4.5:1 | Pass |
| Dark faint label `#73877A` on canvas `#0B1211` | 4.94:1 | 4.5:1 | Pass |
| Dark primary-button text `#142016` on lime `#D7F36A` | 13.56:1 | 4.5:1 | Pass |
| Dark positive text `#8BD5AA` on card `#15211D` | 9.62:1 | 4.5:1 | Pass |
| Dark negative text `#FF9B91` on card `#15211D` | 8.17:1 | 4.5:1 | Pass |
| Dark warning text `#F0C879` on card `#15211D` | 10.45:1 | 4.5:1 | Pass |
| Light primary text `#17251D` on canvas `#F2F4EE` | 14.37:1 | 4.5:1 | Pass |
| Light muted text `#53645A` on card `#FBFCF8` | 6.11:1 | 4.5:1 | Pass |
| Light faint label `#5D6E62` on canvas `#F2F4EE` | 4.89:1 | 4.5:1 | Pass |
| Light primary-button text `#142016` on lime `#B9DC50` | 10.75:1 | 4.5:1 | Pass |
| Light positive text `#216B4C` on card `#FBFCF8` | 6.23:1 | 4.5:1 | Pass |
| Light negative text `#A83E37` on card `#FBFCF8` | 5.98:1 | 4.5:1 | Pass |
| Light warning text `#80540C` on card `#FBFCF8` | 6.39:1 | 4.5:1 | Pass |
| Dark focus token `#B8D8FF` on canvas `#0B1211` | 12.90:1 | 3:1 | Pass |
| Light focus token `#174F9B` on canvas `#F2F4EE` | 7.21:1 | 3:1 | Pass |
| Dark control-border token `#6C8473` on card `#15211D` | 4.09:1 | 3:1 | Pass |
| Light control-border token `#7B8F80` on card `#FBFCF8` | 3.35:1 | 3:1 | Pass |

## Caveats

- Glass contrast depends on the actual backdrop. The chapter rail and hero use a bounded dark surface treatment, but rendered contrast over all possible content has not been browser-measured.
- Status colours and chart colours must continue to be paired with labels, signs, values or shape; colour alone is not the meaning.
- Browser forced-colors and 200% zoom were not runtime-tested in this release.
