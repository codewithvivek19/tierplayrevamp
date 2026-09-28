# Continuous plasma handoff — 2026-09-28

Production preview: http://localhost:3004. The active in-app preview was refreshed.

## Visual direction

The supplied MP4 was inspected in the browser at multiple frames. The rejected spark hoop is replaced by a pink/blue translucent plasma sphere: moving folded sheets, dark interior gaps and a thin luminous silhouette. Its bounded 3D field travels and elongates into the gateway's core. There is no disappearing disc or separate central beam swap. The gateway reveal preserves architectural proportions. Five inertial, noise-modulated fog patches and a local light create the pointer response over the piers.

The supplied LaserFlow/GhostCursor source informed light/fog separation, domain-warped clouds and idle fade. LightPillar's usage informed the destination's sustained column. These are custom integrations in the existing R3F scene, not extra canvases or drop-in component copies. The optical field is an artistic interpretation of the reference, not a fluid simulation.

## Correctness and visual checks

- Production build and typecheck passed.
- Final 41-test hardware Chromium run: 39 passed; the 320×568 reverse-scroll case and the desktop reverse/pause case timed out during a browser evaluation. Both passed unchanged in a focused two-test rerun (10.3 seconds). The original failed run remains in `../tests.json`; no cause is asserted for those transient timeouts.
- The new handoff test samples nine forward/reverse positions and verifies that luminous image detail persists. It also exercises pointer movement over the gateway, idle fade and route cleanup. Another image test checks successive animated frames for lost/broken rendering.
- Screenshots cover the hero, intermediate stretch, assembly, arrival, pointer fog, 320×568, 390×844, 768×1024 and 844×390. Hero, stretch, arrival, pointer response and mobile renders were reviewed. Captured viewports report no horizontal overflow; the capture run reported no browser errors.
- Existing pause, skip navigation, reduced-motion changes, context-loss and explicit no-WebGL fallback checks remain intact. No unrelated text, section or product asset was changed.

## Performance and limits

Apple M4, Chromium ANGLE Metal; CSS viewport 1440×900, device scale factor 2, initial canvas buffer 2520×1575. Four 120-frame requestAnimationFrame samples are in `metal-review.json`.

| Phase | Median | p95 | Quality |
| --- | --- | --- | --- |
| Hero | 33.3 ms | 33.4 ms | high |
| Unfold | 33.3 ms | 33.4 ms | high |
| Passage | 16.7 ms | 33.4 ms | switches to balanced |
| Arrival | 16.7 ms | 16.7 ms | balanced |

The passage sample includes a 216.7 ms peak around adaptive quality change. This is not a sustained 60fps result: the raymarched material is heavier than the old spark effect. The budget was reduced from 96 to 40 desktop samples / 32 portrait or balanced samples (16 for detected software renderers); inactive phase calculations are skipped, and smooth Gaussian sheets avoid the sharp-field grain/banding of earlier drafts. A previous, more expensive run is retained in `before-optimization.json`. Reflection rays use the actual camera of each render pass.

These are local frame-pacing observations, not GPU timer queries. Browser-emulated phone sizes are not physical phone tests. Safari, Firefox and physical iOS/Android remain unverified. The original artwork remains the fallback.
