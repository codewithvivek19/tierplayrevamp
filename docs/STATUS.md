# Current status — full public-content build

## Electron Hub content expansion — 2026-09-27
- Expanded every preserved public route with the complete recoverable Electron Hub/Tierplay content structure: homepage, games, cabinets, products, player journey, support, updates, collection, contact and six Sunscape board pages.
- Staged 104 MIME-validated recovered public images and logo files in `public/media/legacy/`. Authentication, anti-bot controls and private endpoints were not bypassed; the existing public recovery manifest remains the provenance record. One `.webp`-named HTML response was excluded from runtime media.
- Preserved all fifteen game names from boards 1–5 and retained the incomplete sixth route without inventing its games. Removed the old unattributed testimonial copy from the presentation. Legacy product claims and conflicting metrics are labelled as requiring current approval.
- Added original implementations of public React Bits-style patterns: blur/split heading reveals, spotlight cards, pointer tilt, continuous signal loops and reduced-motion fallbacks. These complement the existing GSAP/Three hero without importing gated Pro source.
- Production build and typecheck pass. All 33 Chromium tests pass, including every content route, 320–1440 responsive layouts, media availability, horizontal overflow, keyboard behavior, reduced motion, axe accessibility, WebGL fallback and context-loss recovery. Physical devices, Safari and Firefox remain unverified.
- Preview: http://localhost:3004.

## Portal refinement — 2026-09-27
- Added a spring/drag particle simulation, pointer repulsion, depth-sized glints, velocity trails and damped stone motion. Refined the broken ring silhouette and orbital highlights.
- Reworked hero typography, copy, product index and primary/secondary controls. Outgoing links become inert during the passage.
- Extended scroll choreography through the portal into the approved entrance artwork, then into the overview section; reversible native scrolling is retained.
- Added modest desktop bloom and adaptive reduced-cost rendering. Mobile/software/slow-frame modes omit bloom and real-time reflection. Canvas rendering stops once the entrance artwork covers it.
- ADR-013 records scope and reference limitations. Updated verification is recorded in docs/review/PORTAL-REFINEMENT-REVIEW.md.
- Final production build/typecheck and all 14 focused Chromium tests pass. Desktop, transition, arrival, overview and mobile screenshots reviewed. SwiftShader software-renderer frame time improved from 116.6ms to 66.6ms median with persistent adaptive resolution; this remains below a smoothness target and is not physical-GPU validation. Preview refreshed on localhost:3004.

## Spatial multiverse hero — 2026-09-27
- Implemented the user's request to reconstruct the approved hero environment in Three.js: fractured obsidian portal, four floating island cities, orbit trails, star field, planet and foreground geometry, plus procedural energy/atmosphere shaders.
- Added reversible GSAP camera travel and fragment separation, independent float, pointer response, pause/resume and skip navigation. Only CameraDirector writes to the global camera.
- Original image retained as loading, reduced-motion, save-data, disabled-WebGL and context-loss fallback. Mobile composes the portal above the text and omits the desktop reflection pass.
- Production build and typecheck pass. Four new portal checks and ten existing focused Chromium checks pass. Visual evidence and limitations: docs/review/PORTAL-HERO-REVIEW.md.
- This is a procedural interpretation of the approved image. Bespoke modeled art would be needed for pixel-exact realism. Physical-device GPU performance, Safari, Firefox and screen-reader testing remain unverified.

## Theme V3 media revision — 2026-09-27
- Regenerated the main entrance, gaming floor, cabinet lineup, dragon world, two transparent cabinet renders and three game worlds for the existing responsive media slots.
- Added three additional color-graded game derivatives after the image service returned its account usage limit; they retain their approved game identities while matching the charcoal/violet/pink treatment.
- Switched homepage, interior heroes, cabinet cards and game cards to `public/media/generated/theme-v3/`. Added exact local Tierplay logo overlays to graphic frames.
- Production build, typecheck and 10 focused Chromium tests pass. Desktop/mobile views and loaded image responses checked. Image generation service limitation is recorded in `docs/assets/THEME-V3-ASSET-MANIFEST.md`.

## BrainNFT appearance revision — 2026-09-27
- Applied the reference's inspected charcoal/white palette, violet/pink primary gradient, lavender/blue ambient lighting, original noise texture, pink grid and gradient stars.
- Changed hero decorative artwork and shared surface colors only; retained Tierplay content, logo, layout, cards, navigation, motion and production placeholders.
- Production build and typecheck pass. Existing 10-test Chromium suite passes, including responsive widths, keyboard menu, routes, reduced motion and accessibility. Desktop/mobile browser views inspected. Physical devices and other browser engines remain unverified.
- Preview: http://localhost:3004. Source/asset provenance: docs/assets/BRAINNFT-BACKGROUNDS.md.

## Battlez reference revision — 2026-09-27

Verification completed after access was restored: production build and typecheck pass; 10/10 focused Chromium tests pass across 1440, 1024, 768, 390 and 320px. Desktop/mobile screenshots reviewed. Fixed mobile header cascade conflict and decorative horizontal overflow. Current preview: http://localhost:3004. Evidence: docs/review/BATTLEZ-REVIEW-2026-09-27.md. Physical-device and Safari/Firefox checks remain unverified.

- User explicitly requested the Battlez template's visual language applied to Tierplay content and structure, superseding the procedural hero.
- Inspected the live reference at desktop width and extracted its actual background/text colors, Inter font weights, heading sizes, card silhouettes and section patterns.
- Added locally hosted Inter, full-image hero, pale blue type, clipped grainy cards, gradient buttons, cabinet timeline, product panels, game grid and orbit-style closing CTA. Tierplay branding, routes and market restriction retained.
- The old Play Core remains in source; its route-specific tests were archived because it is no longer the homepage.
- Production build and browser verification now pass. The earlier preview-startup usage-limit rejection was resolved when execution access was restored. Previous 15-test hero results do not apply to this revision.

## Play Core hero — 2026-09-27

- Latest explicit user instruction authorized implementation beyond the historical audit-only restriction.
- Replaced the cabinet still in the homepage hero with one procedural Three.js/R3F scene and three reversible GSAP scroll chapters.
- Added a fractured metallic nucleus, gyroscope rings, instanced particles, six selectable game-art artifacts, pointer response and a dragon-world reveal.
- Retained original Tierplay branding and the rest of the full-site composition.
- Added mobile/tablet composition, chapter navigation, pause/resume, static SVG fallback, reduced-motion/save-data handling and WebGL context-loss recovery.
- One canvas, demand rendering, visibility suspension and capped render resolution. No film, GLB or external environment dependency.
- Production build passes; final browser test and screenshot evidence is recorded in `docs/review/HERO-REVIEW-2026-09-27.md`.
- Real-device/GPU performance and Safari/Firefox remain unverified.

## Full-site visual implementation — 2026-09-26

- User explicitly authorized the complete website design with placeholders for video and 3D models.
- Replaced the historical homepage with an immersive, image-led Tierplay system spanning entrance, cabinets, connected products, games, player journey and conversion.
- Added preserved routes for Games, Cabinets, Products, Player Journey, Contact Sales, 24/7 Support, Up to Date, Games Collection and six Sunscape detail pages.
- Added reusable video/3D production slots; no invented model or video is presented as final media.
- Added mobile navigation, shared footer, responsive compositions and reduced-motion-safe GSAP reveals.
- Optimized the new PNG masters to web-sized WebP runtime assets.
- Production build passes. Focused Playwright suite: 8/8 passing across five viewport sizes, route coverage, mobile keyboard menu and reduced-motion axe audit.
- Remaining production dependencies: approved Altitude/Pinnacle GLBs, three core films, verified form destination, product specifications and final legal/contact information.

See ../PROJECT_STATE.md and ../CURRENT_MILESTONE.md. The new 2026-09-26 master specification supersedes the earlier concept scope. Audit/reference/asset-planning deliverables created; no runtime changes this turn. TP-001 approved Altitude model blocks physical flagship prototype.

## Asset preparation update — 2026-09-26

- Locked the presentation identities: Altitude is the upright vertical cabinet; Pinnacle is the curved-monitor cabinet.
- Preserved the recovered `tierplay-logo.svg` as the authoritative brand master and used it as the reference across the new visual set.
- Generated ten still concepts: desktop/mobile cabinet heroes, entrance, gaming floor, three-cabinet lineup, Rise of the Dragon key art, and two enhanced cutout concepts.
- Copied all presentation masters into `assets/generated/production-stills/` and runtime copies into `public/media/generated/production-stills/`.
- The image generator baked checkerboards into the enhanced cutout attempts. Packaged the two recovered transparent cabinet sources as the approved alpha assets instead; this limitation is recorded in `docs/assets/PRODUCTION-STILLS-MANIFEST-2026-09-26.md`.
- No site implementation was performed as part of this asset-preparation step.

---

## Historical concept report (not approval under new spec)

# Status — cinematic rebuild, 2026-09-26

## COMPLETED
- 110 unique original public assets recovered and inventoried. Source pages and original brief preserved.
- Project skills installed: GSAP React/scroll/performance; Three R3F/performance/accessibility; Motion AI kit; interface review and domain skills; React/composition; Libraries.dev/transitions.
- Three initial hero directions reviewed. Initial industrial composition rejected by user and superseded.
- Blue Tower live hero inspected at entry and successive scroll positions. Environment-led composition, receding DOM chrome, persistent scene and spatial pacing informed an original Tierplay direction.
- Built-in imagegen reconstructed cabinet + dragon desktop hero, dragon-world scene, and independently composed portrait hero. Originals unchanged. Prompts/provenance saved.
- Next.js/React/TypeScript foundation; one R3F canvas; one CameraDirector; GSAP narrative; Motion menu; native scroll; local content; no fake backend.
- Cinematic hero, pointer parallax, animated ember field, image-space screen-origin reveal, explicit cabinet/world navigation, motion pause, static/reduced-motion fallback, mobile portrait art.
- Typecheck and production build pass. Initial rebuilt 10-test suite passes, including five widths, keyboard menu, scene switching, reduced motion, WebGL disabled and axe. Final media revision checks recorded in docs/review/tests.json.

## FINAL VERIFICATION
Production build and all 10 Playwright tests pass after the performance revision. Desktop/mobile artwork and scene navigation visually checked. Final throttled mobile Lighthouse: Performance 86, Accessibility 100, Best Practices 100; FCP 1.1s, LCP 4.3s, TBT 40ms, CLS 0. Three.js enhancement waits for interaction on mobile; desktop enhancement starts after artwork. These are local lab results, not field guarantees. LCP remains above the good threshold on the simulated slow connection. See docs/review/lighthouse-v2.json and tests.json.

## KNOWN ISSUES / LIMITS
- This is a 2.5D concept, not an articulated dragon or CAD-based cabinet model. Generated cabinet/game details require client review before product publication.
- Source domain failed; staging recovery host has TLS mismatch. Recovered public marketing assets are not proof of present specifications/availability.
- MotionScore MCP configured but not available/authenticated in this session. No fabricated MotionScore.
- Physical iOS/Android and Safari/Firefox runtime validation not yet performed. No field Web Vitals claims.

## PERFORMANCE CONCERNS
DPR capped at 1.5, 80 GPU points, one particle draw call plus the scene plane, rendering suspended outside viewport/hidden tab. Generated hero/world desktop media ~590KB combined. First local Chromium sample: ~1.13MB transferred overall, ~16.7ms median animation-frame interval, ~16.8ms p95; not a GPU benchmark or real-device guarantee. Lighthouse run saved separately.

## VISUAL CONCERNS
Desktop immersive direction replaces rejected cutout. Mobile uses dedicated portrait. Product/character rendering is deliberately reimagined per user request. Require visual/client acceptance before expanding to six worlds or production publishing.

## ARCHITECTURE DECISIONS
docs/ADR/0008-cinematic-rebuild.md supersedes the original media restraint. One canvas, texture-based depth, explicit state controls, DOM parity.

## ASSETS RECOVERED / MISSING
Recovered: cabinet references, games, logos, brand, technology imagery and videos. Generated: three cinematic assets. Missing: CAD/approved product models, verified technical sheets, current legal/territory confirmation, real game depth layers.

## NEXT TASK
Review the rebuilt cinematic system at http://127.0.0.1:3001. Do not expand to M2 until this direction is accepted and remaining visual/performance gates are resolved.

## FILES CHANGED
app, experience, systems, navigation, generated media and manifest, docs, tests, local font assets. Production preview runs on port 3001; port 3000 belongs to another local site.
# V4 cinematic media pass — 2026-09-27

- Replaced the homepage texture hero with an original ultra-wide fractured multiverse portal, preserving readable negative space and responsive crops.
- Replaced the final three interim game derivatives with fully generated Bison Showdown, Sinister Show and Tiki Twist campaign worlds.
- Added purpose-built visual systems for Tierplay Collection Management and Tierplay Link Jackpot.
- Kept official Tierplay branding as exact SVG overlays instead of generating approximate logo text into the imagery.
- Production build and typecheck pass. Ten focused Chromium checks pass across desktop, tablet, 390px, 320px, keyboard navigation, reduced motion and accessibility.
- Desktop and mobile renders reviewed locally. Physical-device GPU behavior and Safari/Firefox remain unverified.
# Responsive media repair — 2026-09-27

- Corrected the homepage entrance, gaming-floor and cabinet triptych to load the generated Theme V3 assets from their real runtime directory.
- Added intentional desktop/mobile crops and stronger color treatment for experience, cabinet-film, world-banner and interior-hero media.
- Reworked cabinet detail imagery as contained product presentation so the tall Altitude and Pinnacle silhouettes remain complete; corrected the alternating desktop grid.
- Added TCM and TLJ campaign artwork to the Products route and corrected square game-art behavior on Games Collection.
- Production build passes. Ten focused Chromium checks pass across desktop, tablet, 390px, 320px, keyboard navigation, reduced motion and accessibility. Rendered desktop/mobile media sections were reviewed with no horizontal overflow.
# Editorial realism and cabinet 2.5D — 2026-09-27

- Raised the entrance and gaming-floor campaign art to a photoreal editorial standard with denser materials, controlled lighting and deeper spatial composition.
- Generated two empty cabinet stages and layered the approved transparent Altitude/Pinnacle assets above them; no replacement product geometry was invented.
- Added pointer-responsive perspective, independent background/product translation and a moving light glint for a lightweight 2.5D cabinet presentation.
- Touch, hoverless and reduced-motion environments receive the same composition without spatial motion.
- Updated the homepage, Cabinets, Products, Player Journey and Contact routes to use the new detailed art family.
# Rift-to-gateway implementation — 2026-09-27

Current correction: restored the earlier vortex/orbit/island composition and removed the replacement slit/wipe after explicit user rejection. Updated mounted shader uniforms directly, corrected the low-resolution floor and slow-frame clock. Supplied Lamp, DepthText and ChromaGrid effects are now integrated into the existing footer/game sections (ADR-017). Desktop portal center changed by mean 16.03 RGB levels between stationary captures, confirming live energy animation. Final build, typecheck and all 33 serial Chromium tests pass (42.9 seconds). Desktop/mobile renders, scroll stages, lamp and ChromaGrid were reviewed; mobile overflow is zero. Preview refreshed on port 3004. Details and the resolved concurrent-render timeout are recorded in docs/review/VORTEX-RESTORATION-REVIEW.md. Physical-device GPU and other browser engines remain unverified.

Editorial card follow-up: the hero remains unchanged. Homepage journey cards now form an asymmetric image-led sequence; connected-product panels use campaign media; product pillars, cabinet capabilities and journey stages share a quieter interactive material system. The footer lamp is now a broad architectural wash around the real cabinet imagery, and six duplicate pre-footer contact bands were removed. Desktop and mobile renders are recorded as `docs/review/card-revamp-*.png`. Production build and typecheck pass. The full serial Chromium suite passed 32/33 on its first run; the unchanged GPU-heavy portal traversal exceeded its original 30-second test budget, then passed alone in 36.8 seconds with a 60-second budget. See ADR-018.

Attached-component follow-up: audited the hero and integrated a Tierplay violet lamp into the shared footer, a reduced-motion-safe marquee into the existing ecosystem strip, and a restrained ChromaGrid-style color response into existing game cards. Removed floating miniature structures and circular floor rings from the hero scene, reduced debris, and made its headline specific to six games and two cabinets. See ADR-016-ATTACHED-UI-PRIMITIVES.md. Production build, typecheck and all 33 Chromium tests pass after updating the headline assertion. Desktop and mobile renders were reviewed at `docs/review/attached-primitives-*.png`; no horizontal overflow at 1440px or 390px. Preview refreshed at http://localhost:3004. Physical-device GPU and Safari/Firefox checks remain unverified.

Latest follow-up: removed the circular hero disc/orbits in favor of a vertical light fracture, irregular stone banks and a foreground occlusion transition. Rebuilt the final invitation with recovered cabinet photos, comparison and sales links; removed the duplicate homepage contact band and simplified decorative UI/copy. See ADR-015-FRACTURE-TRANSITION.md. Initial production build and all 33 Chromium checks passed; after the final stone-normal/product-photo correction, build, typecheck and 14 focused Chromium checks passed. Desktop/mobile hero, transition and footer screenshots were rendered and reviewed (fracture-* and floor-invitation-* in docs/review). Preview refreshed on port 3004. Physical devices and other browser engines remain unverified.

Latest rendering refinement: replaced repetitive portal bands with layered curl-noise energy; reduced oversized particle halos and streaks; removed glitter-like stone veining in favor of world-space mineral seams. Added warmer key/cooler rim/hemisphere lighting, restrained bloom, tapered fractured hero stones and irregular distant cliffs. Existing camera rail, scroll timings, UI and chapter transitions remain intact. Production build and 12 focused Chromium checks pass; desktop/mobile renders reviewed. See docs/review/ENVIRONMENT-QUALITY-REVIEW.md. Preview refreshed at http://localhost:3004.

- User-authorized implementation of the refined opening plan. The same persistent Three.js canvas now renders the cosmic hero, stone-to-monolith assembly and architectural gateway; the arrival no longer switches to a flat image.
- Added procedural mineral surfaces, suspended rings, central energy, path lighting, mist, distant cliffs, water and falling particle targets. Optional ambient sound starts muted. Static mode retains both reference environments and semantic navigation.
- Final production build, typecheck and all 33 Chromium tests pass after mobile, water and camera polish. Rendered evidence is recorded in docs/review/RIFT-GATEWAY-REVIEW.md. Preview refreshed at http://localhost:3004.
- Scope ends at the existing product overview. Approved Altitude GLB remains unavailable; the physical cabinet focus/screen-entry sequence is not implemented. The environment is a procedural interpretation, not photo-exact reference reconstruction. Physical-device performance and Safari/Firefox remain unverified.
