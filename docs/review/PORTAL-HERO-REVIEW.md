# Spatial portal hero review — 2026-09-27

User requested the same environment/elements as the approved V4 hero in Three.js, with scroll and floating motion. Local production preview: http://localhost:3004.

## Implementation
- One deferred React Three Fiber canvas, native sticky stage and one GSAP scroll-progress owner.
- Actual geometry for 46 fractured ring slabs, 200 debris fragments, four floating island/city clusters, three orbital trails, planet, stars and foreground stones.
- Procedural energy-disc, light-column and atmosphere shaders. These are shader surfaces, not volumetric simulations or scanned assets.
- Local, once-captured environment lighting; directional/portal/island lighting; 256px desktop planar reflection. No new media download or package dependency.
- Distinct mobile composition, DPR cap 1.35, instancing, offscreen/hidden-tab suspension and pause control.
- Unchanged original hero image underneath; reduced motion/save-data/explicit no-WebGL/context loss restore the still and shorter layout. Headline/navigation always remain semantic HTML.

## Validation
- `npm run typecheck`: passed.
- `npm run build`: passed; all public routes generated.
- Focused Playwright suite: 14 passed, including five responsive widths, destination links, mobile menu focus, route coverage and reduced-motion axe audit.
- New scene checks cover successful shader rendering without console errors, forward/reverse scrolling, exactly frozen canvas pixels while paused, skip navigation, actual WebGL context loss, preference changes and single-canvas remount after navigation.
- Production screenshots: [desktop](portal/desktop.png), [scroll](portal/scroll.png), [390px mobile](portal/mobile.png), [320px mobile](portal/mobile-320.png), [reduced motion](portal/reduced-motion.png).

## Limits
The reconstruction follows the image's composition, palette and elements but is not pixel-identical. Procedural stone/city detail is simpler than the source illustration. Geometry and shaders are authored for this abstract artwork; no physical product geometry or claims were invented. This validation is local Chromium/browser emulation, not real-device GPU performance, Safari/Firefox or screen-reader certification. No frame-rate or field performance guarantee is made.
