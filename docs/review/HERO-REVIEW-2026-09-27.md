# Play Core hero review — 2026-09-27

## Scope and coverage

Scope: the homepage hero, its three scroll chapters, loading illustration, game-art selection, keyboard entry, pause/resume, reduced motion, explicit WebGL fallback and simulated context loss. The rest of the site received navigation/responsive regression checks, not a new design audit.

Stack: Next.js/React, existing Manrope and Barlow Condensed fonts, local CSS, GSAP ScrollTrigger and R3F/Three.js. Conventions inspected: AGENTS.md, CURRENT_MILESTONE.md, PROJECT_STATE.md, DESIGN.md, MOTION.md, WEBGL.md, PERFORMANCE.md, STATUS.md, master specification and ADR-009/010. ADR-011 records the user's authorization for this procedural hero.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Native controls, accessible names, selected/current states, inactive chapter inertness, keyboard activation/focus outline, axe for initial WebGL and static modes, reduced-motion and context-loss tests | Clear within tested coverage; screen-reader speech output not verified |
| Layout | Rendered desktop, tablet, 390px/320px phones, three desktop chapters, mobile unfold, short-window fallback; no horizontal overflow at five sizes | Clear; actual browser zoom and RTL not verified |
| Writing | Hero labels, action destinations, game names, static-view label, copy against the abstract concept and recovered game artwork | Clear; no AI/NFT/product capability claim added |
| Typography | Existing WOFF2 fonts; rendered headline hierarchy, mobile description size and narrow-screen button wrapping | Clear; decorative indexing intentionally uses smaller type |
| Color | Automated axe contrast checks in initial WebGL and static views; selected state has a label, active chapter also has an underline; screenshot review over world art | Clear within tested states; no claim of exhaustive image-background contrast or forced-colors testing |
| UI polish | Native reversible scrolling, pointer response, ring opening, artwork selection, portal reveal, pause/resume, loading illustration and responsive artwork framing | Clear; GPU frame-time and slow-motion animation-panel profiling not performed |

## Findings

No actionable interface findings remain within the inspected scope. During review, corrected the startup fallback handler, reduced particle size/density of appearance, reframed the orbiting artwork, preserved source artwork proportions, extended the stacked composition to tablets, enlarged mobile body/control text, prevented small-phone button wrapping, and added a short-window static layout.

## Verification

Passed:

- `npm run typecheck`.
- `npm run build` — production compilation and 19 generated routes.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3003 npx playwright test tests/experience.spec.ts tests/hero.spec.ts --workers=2` — **15/15 passed** in Chromium.
- Responsive homepage with WebGL ready at 1440×900, 1024×768, 768×1024, 390×844 and 320×740.
- Chapter entry, game selection, dragon-world entry, reverse scrolling, keyboard entry and visible focus, pause from the unfolded chapter, resume, mobile chapter controls.
- Reduced-motion homepage axe audit; focused axe audits for initial WebGL, reduced motion, `?no-webgl`, and a dispatched `webglcontextlost` event. The latter verifies application recovery, not a physical driver failure.
- 720×450 short-viewport fallback and reachable actions.
- Mobile menu Escape/focus restoration and core route rendering.
- `node scripts/capture-hero.mjs` — rendered review captures saved alongside this report. Browser capture run reported no page errors.

One earlier run exhausted the five-second scene-readiness assertion at 320px while multiple screenshot/test browsers shared the GPU. The final run separated capture work and used a 15-second scene-readiness allowance; all five sizes initialized successfully. This is not a mobile performance benchmark.

Evidence: `hero-desktop.png`, `hero-unfold.png`, `hero-world.png`, `hero-mobile.png`, `hero-mobile-unfold.png`, `hero-320.png`, `hero-768.png`, `hero-720.png`, and `tests.json`.

Not verified: physical phones/tablets, Safari/Firefox, screen-reader speech, true browser 200% zoom, RTL/localization, real GPU loss, device power/thermal behavior, frame-time budgets and Lighthouse performance. No backend/media-production capability was added or tested.

## Verdict

**Approve** for the inspected local hero experience. Review the running composition at `http://localhost:3003`. Broader production/device validation remains separate.
