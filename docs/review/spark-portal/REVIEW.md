# Spark aperture review — 2026-09-28

The production preview at http://localhost:3004 uses the new spark aperture. The surrounding approved environment, text, scroll sequence and gateway assembly are preserved.

- Typecheck and production build passed.
- Five additional portal checks passed in the default software-rendering path.
- All 40 Chromium tests passed using ANGLE Metal, including six responsive viewports, forward/reverse scrolling, pause/resume, route remount, reduced motion, context loss, explicit fallback and a new consecutive-frame image check.
- Desktop hero, active-scroll lightning, passage, arrival, 320×568, 390×844, 768×1024 and 844×390 screenshots were captured. Desktop, lightning, mobile and arrival renders were visually reviewed. No horizontal overflow or browser errors appeared in the capture run.
- Hardware: Apple M4, Chromium ANGLE Metal; CSS viewport 1440×900, device scale factor 2, canvas buffer 2520×1575, quality high.
- Four settled 120-frame requestAnimationFrame samples (hero, energized position, passage, arrival) each reported median/p95 16.7ms and max 16.8ms. These are frame-pacing observations, not GPU timer queries or guarantees for other devices. The energized timing sample occurs after the impulse settles; active lightning is captured separately in `metal-scroll-lightning.png`.
- Phone/tablet sizes are browser emulation on this Mac. Physical phones, Safari and Firefox have not been tested.

Evidence is in `metal-review.json`, `metal-*.png`, and the full suite report at `../tests.json`. Reproduce the visual/profile run with `node scripts/review-spark-portal.mjs` against the production preview.
