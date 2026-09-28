# Environment clarity review — 2026-09-28

The current vortex → assembly → gateway sequence has been refined rather than replaced. See ADR-019 for rendering and motion ownership.

## Visual evidence

- `before-desktop.png`, `before-arrival.png`, `before-mobile.png`: initial production screenshots under software rendering.
- `final-*-hero.png`, `final-*-arrival.png`: responsive integration-test screenshots.
- `metal-desktop-hero.png`, `metal-desktop-passage.png`, `metal-desktop-arrival.png`: high-quality desktop pipeline, Apple M4/ANGLE Metal, 1440×900 CSS pixels and device scale factor 2.
- `metal-*.png`: independent portrait/landscape compositions on that desktop graphics backend; these are viewport emulations, not physical phones.
- `metal-review.json`: graphics backend, drawing-buffer dimensions, quality level, console errors, overflow and 120-frame rAF samples.

## Checks

Production build and TypeScript pass. Initial full serial Chromium/software validation passed 39/39. After the shader correction and final responsive framing, all 39 tests passed again on Chromium with ANGLE Metal in 41.4 seconds. No browser or shader errors were recorded.

Coverage includes reverse scrolling, all chapters, pause/resume, context loss, reduced motion, explicit fallback, route remount, keyboard navigation, content routes, accessibility and 320×568 / 390×844 / 844×390 / 768×1024 / 1024×768 / 1920×1080 framing. The arrival pixel check rejects an almost-uniform canvas above the copy, catching the bloom failure that DOM assertions missed.

## Local frame pacing

The final Apple M4/ANGLE Metal run held the high-quality path at 1440×900 CSS pixels, DPR 1.75 for the canvas (2520×1575 drawing buffer), with the postprocessing pass capped at DPR 1.5. Across 120 rAF intervals per stationary phase, the median was 16.7ms and p95 was 33.3–33.4ms for hero, passage and arrival. Some frames therefore miss a 60Hz deadline; this is not a locked-60fps claim. There were no console errors. All four additional viewport samples reported zero horizontal overflow. Arrival image detail was nonzero and the high-quality gateway was visually inspected after the bloom fix.

## Limits

Frame intervals are local browser rAF observations, not GPU timer measurements or a field FPS guarantee. Physical iOS/Android, Safari and Firefox remain unverified. Mobile uses the same art direction and sequence with bounded effect resolution; it does not force desktop GPU cost onto smaller devices.
