# Current repository audit

2026-09-26. Read-only app inspection; no app implementation changed in this assignment.

| Area | Evidence | Finding / disposition |
|---|---|---|
| Routes | app/page.tsx; no other route pages | Only concept homepage; every business route remains missing |
| Visual medium | experience/ExperienceCanvas.tsx | One textured plane plus ember points; 2.5D displacement, not cabinet geometry |
| Camera | experience/camera/CameraDirector.tsx | Dampened pointer x/y, fixed look-at; no entrance spline, screen-plane crossing or FOV choreography |
| Choreography | experience/Experience.tsx | Scroll normalized into image reveal and copy changes; no actual boot/floor/focus states |
| Loading | systems/AssetManager.ts | Image decode cache; no bundle dependency graph, real progress accounting, GLB validation or staged model loading |
| Adaptive quality | systems/DeviceTier.ts | Motion/data/memory hints plus viewport; no runtime GPU/frame-time adaptive tiers |
| Screen | ExperienceCanvas shader | Screen-origin image transition; no independent screen mesh, glass or media controller |
| Form parity | app/page.tsx | mailto only; legacy lead form and Contact Sales form absent |
| Content | content/experience.ts, app/page.tsx | Content partly hardcoded, one world; no typed catalogue/cabinet/product/navigation data |
| Navigation | components/navigation/Navigation.tsx | Three anchors replace business IA; must restore source routes at content milestone |
| Accessibility | tests/experience.spec.ts | Ten existing tests, axe/reduced motion/menu/fallback coverage; not a complete production accessibility certification |
| Performance | docs/review/lighthouse-v2.json | Previous local mobile run 86/100/100; LCP 4.3s, TBT 40ms, CLS 0; LCP fails 2.5s target |
| Frame evidence | docs/review/performance-v2.json | Previous rAF median16.7ms/p9516.8ms; not GPU timing, INP field data or physical-device proof |
| Quality tooling | package.json, tsconfig.json | Strict TS; build/typecheck/Playwright scripts. No ESLint/Prettier pinned/configured scripts; no dependency audit proving dead imports removed |
| Ownership | existing directors and docs | Single camera owner is reusable; retain after isolating scene lifecycle |
| Provenance | assets/manifest.json | 110 originals and 3 generated concept derivatives; none approved production models |
| Git | git status --short | Project remains untracked/uncommitted baseline; do not delete or overwrite assets during re-scope |
| Documentation drift | docs/WEBGL.md, MOTION.md vs runtime | Docs claim macro/boot/demand rendering more broadly than runtime; superseded by this audit until reconciled |

Keep reusable font hosting, original assets, semantic HTML, reduced-motion fallback, menu keyboard behavior, visibility pausing and test infrastructure. Archive current dragon art direction as a prior concept. Do not call its 2.5D transition the required physical screen-entry prototype. The new spec supersedes ADR0008 for future work; application remains unchanged for comparison.
