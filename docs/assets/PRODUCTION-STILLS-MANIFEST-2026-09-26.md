# Tierplay production stills manifest — 2026-09-26

This pack freezes the visual content decision before the next implementation pass. It is a presentation and prototyping pack. Generated cabinet renders do not verify dimensions, hardware, controls, regulatory details, jackpot values, or product availability.

## Approved content identities

- **Altitude** is the upright vertical-monitor cabinet, grounded in `assets/source-recovery/cabinets/vertical-cabinet-with-tierplay-logo.webp`.
- **Pinnacle** is the curved-monitor cabinet, grounded in `assets/source-recovery/cabinets/Curved-single-side-with-tierplay-logo.webp`.
- **Three-cabinet lineup** uses the user-supplied three-unit arrangement as its composition and product-family reference.
- **Rise of the Dragon** preserves the recovered dragon palette and title identity from the original game artwork.
- **Tierplay brand master** is `assets/source-recovery/brand/tierplay-logo.svg`. Generated graphics use this recovered wordmark as the visual reference.

## Generated presentation assets

| Asset | Size | Intended use |
|---|---:|---|
| `altitude-hero-landscape-v1.png` | 1672 × 941 | Desktop Altitude product hero |
| `altitude-hero-mobile-v1.png` | 941 × 1672 | Mobile Altitude product hero |
| `pinnacle-hero-landscape-v1.png` | 1672 × 941 | Desktop Pinnacle product hero |
| `pinnacle-hero-mobile-v1.png` | 941 × 1672 | Mobile Pinnacle product hero |
| `tierplay-entrance-concept-v1.png` | 1916 × 821 | Entrance composition and Blender build reference |
| `tierplay-gaming-floor-concept-v1.png` | 1672 × 941 | Gaming-floor lighting and material reference |
| `tierplay-altitude-lineup-v1.png` | 1672 × 941 | Three-cabinet brand presentation |
| `rise-of-the-dragon-key-art-v1.png` | 1672 × 941 | Game showcase key art |
| `altitude-cutout-matte-concept-v1.png` | 1024 × 1536 | Enhanced Altitude cutout concept; baked checkerboard, not production alpha |
| `pinnacle-cutout-matte-concept-v1.png` | 1024 × 1536 | Enhanced Pinnacle cutout concept; baked checkerboard, not production alpha |

The generated PNG masters live in `assets/generated/production-stills/`. Runtime-ready copies live in `public/media/generated/production-stills/`.

## Approved transparent sources

The image generator painted a checkerboard into both enhanced cutout attempts. The production pack therefore includes the recovered product-accurate transparent sources:

| Asset | Size | Alpha |
|---|---:|---:|
| `altitude-cutout-approved-source.webp` | 189 × 500 | Yes |
| `pinnacle-cutout-approved-source.webp` | 206 × 500 | Yes |

These two files are the current compositing masters. They are low resolution and should be replaced when approved high-resolution photography or cabinet renders become available.

## Brand master

`tierplay-logo-official.svg` is an unchanged copy of the recovered Tierplay wordmark. Use the SVG itself for interface branding and final overlays. The logo inside generated images is visually reference-guided, but the SVG remains authoritative.

## Approval boundary

The generated images establish art direction, composition, atmosphere, lighting, and the intended cabinet identities. They are not evidence for physical geometry that is absent from the recovered references. The next interactive prototype still requires the real Altitude model for camera movement, focus, screen entry, and exit.
