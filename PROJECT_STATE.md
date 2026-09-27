# Project state

2026-09-27 latest: ADR-014 replaces the hero's flat entrance handoff with a procedural 3D gateway. Instanced orbital stones assemble into monoliths; energy, overhead rings, illuminated floor, mist and water stay in the same scene. Optional sound is muted by default. Static fallback includes both environments. The existing overview is the exit; no new cabinet model is claimed.

Latest full-site expansion (2026-09-27): all recoverable public Electron Hub/Tierplay copy and 104 MIME-validated public image/logo assets now feed the complete route set. Games preserve all six board routes and fifteen named titles; Cabinet, Product, Player Journey, Contact, Support and Update routes now carry their recovered content rather than placeholders. React Bits-style open interaction patterns are implemented locally with Motion/CSS and include reduced-motion fallbacks. Typecheck, production build and all 33 Chromium tests pass. The preview remains http://localhost:3004. Legacy claims are visibly held for current approval; no gated source or protected asset access was used.

Latest refinement: `PortalParticles.tsx`, the updated PortalCanvas, and BattleHero now form a reversible three-phase opening-to-entrance sequence. Semantic hero copy/navigation and typography were revised. See ADR-013 for particle simulation, adaptive quality, animation ownership and reference limitations.

Latest (2026-09-27): BattleHero now progressively enhances the approved V4 multiverse still with `components/hero/PortalCanvas.tsx`, a procedural spatial reconstruction. The scene is an artistic approximation, not an exact recovered model. All later sections/routes stay intact. Original still retained for loading, reduced motion, save-data, disabled WebGL and context loss. One canvas; desktop floor reflections; smaller independent mobile framing. See ADR-012 and the portal review report.

Latest media revision: `public/media/generated/theme-v3/` supplies the current responsive art family for the homepage and interior routes. The asset manifest records generated vs color-graded derivatives and the image-service limit encountered during the final three generations. Layout/content remain unchanged; the production preview is http://localhost:3004.

Latest appearance layer: app/brain-theme.css applies the user-requested BrainNFT palette and backgrounds. Original grain/grid/stars are locally hosted; hero background updated. Existing Tierplay layout, content and behavior retained. Production build/typecheck and 10 focused Chromium tests pass. Preview: http://localhost:3004.

Latest: Battlez reference design applied to Tierplay homepage and shared page styling. Primary files: app/battlez.css, app/page.tsx, components/site/BattleHero.tsx and GameCard.tsx. Production build, typecheck and 10 focused Chromium tests pass after preview access was restored. Desktop/mobile screenshots reviewed; header cascade and decorative overflow corrected. Running preview: http://localhost:3004. See docs/review/BATTLEZ-REVIEW-2026-09-27.md.

2026-09-27: Implemented the user-requested cabinet-free hero with a procedural R3F chrome core, scroll-synchronized GSAP chapters, orbiting recovered game artwork, dragon-world reveal, keyboard chapter controls, pause/resume and a static reduced-motion/WebGL fallback. Main implementation: `components/hero/`. Latest design decision: ADR-011. Full visual/validation evidence: `docs/review/HERO-REVIEW-2026-09-27.md`. No Blender model or video is required for this hero; downstream media slots remain unchanged.

2026-09-26: New master specification adopted. Audit/planning completed, followed by an explicit user-authorized full-site visual implementation using approved stills and labelled video/3D production slots.

Public recovery:9pages +6game entries +1default post; no public production GLBs. Source TLS mismatch recorded, form delivery not tested. Correct /our_games/ routes recovered; previous guessed routes are not evidence. Full artifacts in docs/audit, docs/design, docs/assets and docs/MILESTONE-PLAN.md.

Current runtime is a complete responsive visual site with preserved Games, Cabinets, Products, Player Journey, Contact Sales, Support, Updates, Games Collection and six Sunscape detail routes. The historical prototype remains at `/prototype-01` for reference. Main blocker for real spatial cabinet interaction remains TP-001 approved Altitude model.

What changed: complete homepage, shared navigation/footer, core public routes, six static game-detail paths, responsive art direction, GSAP reveal choreography, media optimization, explicit video/GLB slots and updated tests. No fake form, model, telemetry or verified technical claim was introduced. Production build and the focused 8-test responsive/accessibility suite pass.
