# ADR-013 — Particle dynamics and a continuous entrance passage

2026-09-27. User-authorized refinement of ADR-012.

## Problem and reference
The first procedural hero left its headline fixed during a short camera zoom and had no designed handoff to the next section. The user requested better particles, physics, scene quality, hero typography and transitions, citing Active Theory. Its public homepage was opened and rendered locally: the test browser displayed a dimensional identity and atmospheric particle field, but an unsupported-browser message prevented full transition inspection. We do not claim to have inspected its complete choreography or copied its source.

## Decision
Use the existing GSAP and Three.js stack, with Three's bundled postprocessing modules. Retain Tierplay's violet/obsidian world and approved entrance still. Replace the static headline with a more concise editorial composition: “Play beyond the screen.” Native scroll now follows opening → clear the text → align with portal → accelerate through → aperture-reveal the entrance → settle into the overview. The arrival is an image-based scene and is not represented as a modeled interior.

One GSAP progress value controls camera/DOM transitions. Fragment separation uses damped springs; a typed-array particle simulation uses semi-implicit integration, capped substeps, drag, moving orbital targets and pointer repulsion. These are art-directed dynamics, not a collision or astrophysics simulation. Shader points use depth sizing and velocity-oriented streaks. Pause freezes dynamics; resume resynchronizes scroll. Hidden outgoing links become inert. Native scroll, semantic navigation and skip controls remain available.

## Cost and ownership
2,800 particles desktop / 950 mobile or balanced in one draw, 38 main stones, 120 small fragments. GSAP owns the outer overview transform; existing Reveal components retain ownership of their children. CameraDirector alone changes the camera. Desktop lighting adds a modest bloom pass. Narrow screens, software rendering and sustained slow frames disable both bloom and planar reflection. Software rendering uses a stable 0.65 DPR owned by the Canvas parent; hardware DPR is capped at 1.35. The canvas stops after the arrival image covers it and when offscreen/hidden/paused. Postprocessing resources dispose on unmount or quality change. All original media remains preserved.

## Regression gates
Production shader compilation, desktop/mobile screenshot review, forward/reverse passage, destination content/link focus, pause pixel stability, context loss, live reduced-motion changes, route remount, narrow layout and axe audit. Physical devices and Safari/Firefox remain unverified. The still's fine detail is still an artistic approximation in the modeled portion.
