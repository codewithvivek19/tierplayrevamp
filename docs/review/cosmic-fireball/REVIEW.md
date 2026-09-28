# Cosmic background / fireball review — 2026-09-28

## Delivered
The supplied Cosmic BG and Toon fireball 2 techniques now run inside the existing Three.js scene. Original embedded texture bytes are in `public/media/effects/originkit`, with provenance. Fireball motion is driven through live ShaderMaterial refs, preserving Fiber 9.8's descriptor ownership. The same source and flame rotate, move and morph into the gateway column. The background remains within the camera far plane throughout the sequence.

No page sections, copy, product models or camera sequence were redesigned in this component-integration pass. Geometry realism and a longer cinematic sequence remain a separate planned pass.

## Validation
- Production build with TypeScript: passed.
- 12 focused Chromium/ANGLE Metal tests passed: six viewport sizes (320×568, 390×844, 844×390, 768×1024, 1024×768, 1920×1080); forward/reverse scroll; one canvas; pause with identical screenshots; reduced motion; WebGL loss/fallback; route cleanup/remount; moving fireball texture and opening clouds; luminous upper column at arrival.
- After the final settled-core size adjustment, both rendered animation/handoff tests passed again. See `tests.txt` and `final-render-tests.txt`.
- Visual review: opening, intermediate scroll poses, final pillars and mobile-sized captures. User's actual preview was refreshed and inspected at stationary scroll: successive screenshots visibly show changes within the sphere and flame.
- One earlier validation run timed out during the handoff while a build was also running, and was interrupted for the next revision. This is not counted as a successful run. Final successful checks were run separately from the build.

## Performance and limits
`metal-review.json` records the latest production frame-pacing sample and rendering backend. These are local rAF observations, not GPU timings or physical phone measurements. `earlier-profile.json` preserves a prior run with a 700ms maximum during the passage; the adaptive scene still has a quality-switch cost. Fireball and cosmic resource budgets were subsequently decoupled from that mid-scroll switch to avoid rebuilding those effect resources.

Latest M4 sample: opening/unfold median 33.3ms, arrival 16.7ms; passage maximum 1099.9ms with the existing switch to balanced quality. This remains an unresolved scene-performance limitation, not a smoothness pass. No universal 60fps claim. Physical iOS/Android devices, Safari and Firefox are untested. Original still fallback is intentionally retained. User visual approval is pending.

## Follow-up: sphere-only opening
All 13 focused Chromium/Metal tests pass after the departure reveal and surface-detail refinement (`departure-tests.txt`). Reviewed no-tail opening, progressive reveal at .37/.44, column handoff, return to zero and 3840×2160 screenshot. The fireball's existing motion test still passes. Original cloud/architecture/camera choreography stays unchanged. Physical devices and 4K sustained frame rate were not measured in this follow-up.
