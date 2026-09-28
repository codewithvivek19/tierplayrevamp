# ADR-021 — One plasma volume from sphere to gateway

2026-09-28. Supersedes ADR-020's rejected spark aperture appearance.

## Reference and user direction

The user rejected the spark ring and its disappearing transition. Their ten-second Pinterest-hosted MP4 was inspected directly in the browser at several positions (roughly 2, 4 and 10 seconds). It shows a translucent luminous sphere with folding pink/blue plasma sheets, changing internal highlights and a thin illuminated silhouette. It is not an ember hoop. The video is reference only and is not bundled or played in the site.

The supplied LaserFlow source separates narrow flowing light from broader turbulent fog. The supplied GhostCursor source uses domain-warped noise, inertial trail positions and a timed idle fade. LightPillar's provided usage suggests a sustained violet/pink energy column. These inform a custom implementation inside the existing R3F canvas; no additional renderer, component-owned canvas or independent animation clock is introduced.

## Implementation

- `PortalEnergy` is now a world-space sibling of the orbital objects. One bounded raymarched emissive volume travels from the approved hero framing to the gateway and stretches continuously into its light column. It never shrinks to nothing or swaps to a replacement beam. The local view ray uses the actual render-pass camera, including the mirrored floor-reflection camera.
- `plasmaShaders` combines moving folded sheets, a thin view-dependent sphere silhouette, helical column wisps and localized floor radiance. Desktop uses 40 samples, portrait/balanced 32, and detected software renderers 16. Gaussian light sheets avoid the banding of undersampled sharp fields, and uniform branches skip the sphere or column calculation when it contributes no light. The volume is an artistic optical field, not a fluid-physics simulation.
- The old gateway's flat central beam and straight emissive cylinders are removed. Architecture keeps its proportions during reveal rather than scaling its height from zero. Existing monolith trajectories, page copy and layout remain intact.
- `PointerRadiance` applies five damped fog patches and a modest local light using the existing pointer state. The opening's text region is masked; the arrival lets light play across the piers. Pointer inactivity fades the effect, and pause freezes it. Touch users retain the autonomous base animation without needing hover.
- CameraDirector still exclusively changes the camera. It updates before local-camera uniforms and pointer-ray projection. GSAP still owns normalized scroll progress; the existing sequence clock owns time. The same canvas, reduced-motion, save-data, offscreen and context-loss behavior is retained.

## Verification

Production build, responsive/pause/fallback checks, intermediate forward/reverse rendered samples, pointer trail exercise and hardware frame pacing are recorded in `docs/review/plasma-handoff/REVIEW.md`. Do not equate procedural approximation with the exact reference film or claim physical mobile/browser validation without those devices.
