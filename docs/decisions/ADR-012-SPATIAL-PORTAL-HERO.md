# ADR-012 — Spatial reconstruction of the multiverse hero

Date: 2026-09-27. Status: implemented for visual review, explicitly requested by the user.

## Evidence and scope
The user approved the current `hero-multiverse-v4.webp` image and requested its environment and elements in Three.js, with independent float and scroll animation. This supersedes the static Battlez opening and historical audit-only restriction for the hero. It does not authorize invented product geometry. The source image remains untouched.

## Decision
Retain BattleHero's semantic headline, CTA, product navigation and site palette. Defer one R3F canvas behind the original still. Reconstruct the image's black fractured portal, violet energy, four floating island cities, orbit trails, stars, planet and reflective foreground as procedural geometry and shaders. The energy disc and distant atmosphere are shader surfaces within the 3D scene; all rocks, islands, towers and orbital trails are actual geometry. This is an artistic reconstruction, not an exact extraction of 3D assets from the generated image.

GSAP owns normalized scroll progress. Only CameraDirector changes the camera. R3F owns geometry, material animation and elapsed float time. The native sticky stage is 220svh desktop and 175svh mobile. No scroll lock or captured keyboard navigation. Pause freezes scene motion; links and a skip anchor remain usable.

## Performance and failure behavior
Instanced debris, ring fragments, foreground stones and city towers. Procedural environment lighting is captured once at 128px; desktop ground reflection is 256px, omitted on narrow mobile. DPR capped at 1.35. No external model, image texture, HDR download or new dependency. The render loop stops offscreen, when the tab is hidden, and after pause settles. Owned geometry/materials are disposed on unmount. Reduced motion, save-data, `?no-webgl`, renderer failure and context loss retain the original hero still and standard document flow.

## Risks and review
Procedural art cannot reproduce every hand-painted detail of the still. Desktop reflections cost an additional scene pass. Exact visual parity and higher-detail cities would need bespoke art assets. Preserve original media as a truthful fallback. Verify production build, browser scene compilation, responsive screenshots, reverse scroll, motion controls, route remount, context loss, static fallback and accessibility. Physical-device GPU and cross-browser results must remain unverified unless actually tested.
