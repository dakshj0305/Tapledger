---
name: Cinematic Brutalism
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#debec8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a68992'
  outline-variant: '#574048'
  surface-tint: '#ffb0cd'
  primary: '#ffb0cd'
  on-primary: '#640039'
  primary-container: '#f751a1'
  on-primary-container: '#570032'
  inverse-primary: '#b4136d'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#d2bbff'
  on-tertiary: '#3f008e'
  tertiary-container: '#a476ff'
  on-tertiary-container: '#36007d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e4'
  primary-fixed-dim: '#ffb0cd'
  on-primary-fixed: '#3e0022'
  on-primary-fixed-variant: '#8c0053'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Syne
    fontSize: 5rem
    fontWeight: '900'
    lineHeight: 5.25rem
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Syne
    fontSize: 3rem
    fontWeight: '900'
    lineHeight: 3.25rem
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Syne
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 3.75rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Syne
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-uppercase:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.2em
  label-technical:
    fontFamily: Space Grotesk
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.15em
spacing:
  gutter: 1.5rem
  gutter-desktop: 2rem
  margin: 1.25rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system fuses raw architectural brutalism with hyper-stylized cinematic depth. Engineered for forward-thinking creative technologies, immersive streaming platforms, and high-impact digital experiences, it rejects generic flat minimalism in favor of uncompromising contrast, razor-sharp precision, and intense chromatic energy.

### Aesthetic Pillars
- **Radical Monoliths:** Pitch-black canvases (`#050505`) and industrial dark surfaces (`#111111`) form an obsidian stage. Content is treated not as soft cards, but as cut-glass monoliths suspended in virtual space.
- **High-Voltage Chromatics:** High-contrast accents emerge from deep darkness. Vibrant neon flashes—anchored by hot electric pink (`#EC4899`) and cyan (`#06B6D4`)—serve as decisive visual anchors rather than decorative clutter.
- **Architectural Typography:** Mammoth headline weights command immediate authority, counterbalanced by microscopic, wide-tracked technical metadata.
- **Precision Glass & Spatial Rigor:** Monolithic shapes meet delicate 1px glass boundaries and 3D spatial staging, creating a sense of physical weight and atmospheric tension.

## Colors

The palette is engineered around an absolute void punctuated by optical luminescence. Darkness is structural, while neon chromaticity conveys state, action, and focus.

### Base Matrix
- **Canvas Base (`#050505`):** The foundational void. Applied to global backgrounds to establish infinity.
- **Surface Elevation 1 (`#111111`):** Structural card containers and panels. Deep, neutral, and dense.
- **Surface Elevation 2 (`#1A1A1A`):** Interactive hover states, elevated trays, and floating toolbars.

### Typographic Contrast
- **Text Primary (`#FFFFFF`):** 100% optical white. Reserved for titles, primary inputs, and active states.
- **Text Secondary (`#999999`):** Neutral gray. Provides strong legibility without competing with high-weight headlines.
- **Text Muted (`#555555`):** De-emphasized system metadata, disabled states, and structural grid rules.

### Kinetic Energy & Accents
- **Primary Pink (`#EC4899`):** High-voltage electric magenta. Used for primary focus indicators, active states, and core branding hooks.
- **Secondary Cyan (`#06B6D4`):** Neon cyan. Combined with Primary Pink to create directional velocity gradients (`linear-gradient(135deg, #06B6D4 0%, #EC4899 100%)`).
- **Tertiary Violet (`#7C3AED`):** Deep ultraviolet. Used strictly for volumetric atmospheric glow, depth halos, and drop-shadow underlays.

## Typography

Typography establishes tension between monolithic, sculptural forms and microscopic precision.

### Typographic Rules
- **Display & Headlines (`Syne`):** Set with extreme weight (800–900). Headings must be tightly tracked with disciplined line heights, packing maximum visual mass into single viewports. All display headlines reject decorative italics.
- **Body & Information Architecture (`Space Grotesk`):** Set at regular weights (400) to balance technical geometry with absolute clarity. Never set body copy below `0.875rem`.
- **Labels & Micro-Copy:** Transformed to full uppercase with intentional `0.2em` tracking and bold weight (`700`). This emulates aerospace readouts and brutalist architectural signage.

## Layout & Spacing

The layout embraces a rigorous 12-column architectural grid defined by crisp divisions, generous margins, and rhythmic density.

### Breakpoints & Structural Adaptation
- **Mobile (< 768px):** 4-column layout. Margin: `1.25rem`, Gutter: `1.5rem`. Fluid single-column stacking for cards and media blocks.
- **Tablet (768px - 1024px):** 8-column layout. Margin: `2rem`, Gutter: `1.5rem`. Two-column card arrangements with fixed aspect ratios.
- **Desktop (> 1024px):** 12-column layout. Margin: `3rem`, Gutter: `2rem`. Max content container capped at `1440px` or allowed full-bleed edge-to-edge for media viewing canvases.

### Spatial Rhythm
Internal layout padding follows strict multiples of `0.5rem`. Avoid soft, ambiguous spacing; components should feel locked within structural scaffolding.

## Elevation & Depth

Depth in this system is spatial and cinematic rather than material or skeuomorphic. It discards muddy dropshadows in favor of 3D spatial staging, frosted boundary light, and localized high-energy glow.

### 3D Spatial Canvas
- **Scene Perspective:** Top-level immersive viewports define a spatial perspective of `perspective: 2000px`.
- **Z-Axis Transforms:** Interactive components elevate dynamically along the z-axis (`transform: translateZ(12px)`) on hover or active engagement, rather than scaling artificially.

### Edge Illumination & Frosted Glass
- **Precision Borders:** Surface containers are bound by razor-thin, cold outlines: `1px solid rgba(255, 255, 255, 0.1)`. In hover or selected states, this border sharpens to `rgba(255, 255, 255, 0.3)`.
- **Backdrop Blur:** Glass panels use `backdrop-filter: blur(8px)` with semi-opaque bases (`rgba(17, 17, 17, 0.75)`), keeping backgrounds legible as dark chromatic silhouettes.

### Chromatic Halos
- **The Glow Effect:** Depth illumination is achieved through concentrated ultraviolet and neon underlays: `box-shadow: 0 0 40px -10px rgba(124, 58, 237, 0.45)`.
- **Interactive Flares:** Gradient buttons emit radial light onto adjacent surfaces (`box-shadow: 0 0 24px rgba(236, 72, 153, 0.4)`).

## Shapes

The shape system strictly enforces razor-sharp corners (`0px` border-radius). 

### Geometry Rules
- **Total Zero Radius:** Every container, button, input field, modal, chip, and image uses crisp `0px` corners. Curves are entirely forbidden.
- **Aspect Ratios:** Media containers, thumbnails, and feature cards adhere strictly to cinematic ratios: `16:9`, `2.39:1`, or industrial `1:1` squares.
- **Notched and Chamfered Accents (Optional Component Edge):** Where architectural variation is required, 45-degree diagonal cuts (chamfers of `8px`) may be implemented via CSS clip-path, reinforcing industrial machinery references.

## Components

### Buttons
- **Primary Kinetic Action:** Sharp rectangular block with `linear-gradient(135deg, #06B6D4 0%, #EC4899 100%)` fill, black text (`#050505`), `Syne` 800 weight, and subtle `0.05em` letter-spacing. On hover: shifts slightly on the Z-axis with an intensified pink/cyan atmospheric glow (`box-shadow: 0 0 25px rgba(236, 72, 153, 0.5)`).
- **Secondary Ghost Action:** `1px solid rgba(255, 255, 255, 0.2)` border, background `transparent`, white text (`#FFFFFF`), `Space Grotesk` 700 with uppercase tracking. On hover: background shifts to `#1A1A1A` with border snapping to `#FFFFFF`.

### Input Fields
- **Architecture:** Zero-radius box, background `#111111`, border `1px solid rgba(255, 255, 255, 0.1)`, padding `1rem`. Text input in white (`#FFFFFF`) `Space Grotesk`.
- **States:** On focus, the border illuminates to `#06B6D4` with an instantaneous `1px` inner glow. Placeholders are pinned at `#555555`.

### Cards & Monolithic Panels
- **Structure:** Solid `#111111` or semi-translucent `rgba(17, 17, 17, 0.8)` with `backdrop-filter: blur(8px)`.
- **Boundary:** Continuous `1px solid rgba(255, 255, 255, 0.1)`. No rounded corners.
- **Interaction:** Hovering lifts the monolith slightly via `translateZ(8px)` and introduces an ambient ultraviolet rim (`rgba(124, 58, 237, 0.3)`).

### Chips & Badges
- **Display:** Sharp micro-containers with uppercase technical labeling (`font-size: 0.6875rem`, `letter-spacing: 0.2em`).
- **Styling:** Matte `#1A1A1A` fill with `1px solid rgba(255, 255, 255, 0.15)`. Active or live indicators use a solid `#EC4899` dot indicator.

### Checkboxes & Selection Controls
- **Form:** Sharp square boxes (`18px x 18px`), `0px` radius, `1px solid rgba(255, 255, 255, 0.3)`.
- **Selected State:** Filled entirely with the cyan-to-pink gradient, containing a crisp black geometric checkmark.
- **Radio Controls:** Diamond-shaped indicators (rotated 45-degree squares) rather than circles to maintain non-rounded brutalist geometry.

### Cinematic Media Trays
- **Configuration:** Horizontal edge-to-edge scroll zones with `1px solid rgba(255, 255, 255, 0.05)` baseline dividers, technical monospaced index counters (`01 // 08`), and active frame highlights using hot pink (`#EC4899`) underlines.