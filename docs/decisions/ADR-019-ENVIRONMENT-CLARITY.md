# ADR-019 — Refine the existing environment and scroll rendering

2026-09-28. Explicitly authorized by the request to improve the current Three.js environment while keeping its existing direction. The vortex, floating islands, assembling stone and gateway remain the same sequence.

## Rendering

- Weld displaced stone/cliff vertices before recomputing normals; increase silhouette detail without introducing model downloads.
- Share an object-space mineral shader across stone and architecture, with derivative normal relief, antialiased veining and varied roughness. Detail remains attached to moving surfaces.
- Generate two 128px periodic normal/roughness maps once for the wet floor and dispose them with the floor. High/portrait renderers use 768px/256px planar reflections. Balanced rendering retains the existing procedural light reflection and the same surface maps.
- Use a warmer directional key, cooler fill, restrained light intensity and one bounded shadow map. The assembling geometry has a matching custom depth material so its shadow deforms with it.
- Desktop postprocessing uses a two-sample half-float render target and honors DPR up to 1.5. Portrait rendering keeps direct antialiasing with the same lighting/materials; slow/software devices omit expensive reflections, shadows and bloom.
- Clamp the mist shader's square-root domain. Hardware review exposed an invalid fractional power at the shader edge that contaminated bloom and blanked the gateway without a console error. Pixel-detail assertions now supplement DOM/canvas checks.

## Motion and responsive framing

GSAP remains the single scroll-progress owner with native scrolling. Catch-up is shortened from .9s to .55s. The sequence extent measures the real stage height. Only CameraDirector writes the camera. Camera and architectural interpolation use smootherstep; debris uses an analytic critically damped spring, and particle integration uses bounded substeps over up to 100ms. This is decorative dynamics, not a collision simulation.

A shared aspect/height-based opening composition aligns the portal energy and independently instanced monoliths. It interpolates through tablet proportions and lifts/shrinks the portal on short portrait screens. CSS removes oversized fixed minimum heights, composes tablet portrait independently, and keeps actions reachable on short phones and landscape. There is still one canvas and the same three chapters on every viewport.

Reduced motion, save-data, explicit WebGL fallback, context loss, pause and offscreen suspension remain supported. No cabinet/product geometry, content claim or external asset was added.

## Validation

See `docs/review/environment-polish/REVIEW.md`, rendered evidence, and the repeatable `scripts/review-environment.mjs`. The optional `PLAYWRIGHT_ANGLE` setting selects a browser graphics backend for local validation without changing application behavior.
