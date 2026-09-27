# Reference map

2026-09-26. Concrete reference evidence is separated from proposed Tierplay behavior. Camera distances/timing below are design proposals, not reverse-engineered measurements of reference implementations. No imported reference assets.

## Reference: Orion

URL: https://orion.adrianred.com/

Evidence: Live entry screen inspected; explicit Enter gate, credits and flight controls, quality settings in DOM. Not measured as an implementation benchmark.

Adaptation boundary: A deliberate entrance establishes a navigable environment. No cyberpunk palette, collectibles, flying vehicles or flight controls.

## Reference: Bruno Simon

URL: https://bruno-simon.com/

Evidence: Live spatial scene inspected: vehicle, bridge, paths and world-space identity; official page documents map, interact, mute, quality and device-specific controls.

Adaptation boundary: Objects have locations and interaction meaning. No car, physics sandbox or mandatory exploration to reach business content.

## Reference: Lusion

URL: https://lusion.co/projects/porsche_dream_machine/

Evidence: Official Porsche case study and live layout inspected: large editorial title, controlled product imagery and services column. This is a CG film reference, not proof of real-time browser rendering.

Adaptation boundary: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

## Reference: Active Theory

URL: https://activetheory.net/

Evidence: Live loading/abstract entry and sparse Work/Contact/Audio UI inspected. Work activation failed in browser; exact project camera behavior unverified.

Adaptation boundary: Study scene-to-interface continuity; proposed Tierplay screen transition is an original authored interaction, not a claimed copy of inspected motion.

## Reference: Blue Tower

URL: https://www.bluetowergames.com/

Evidence: Hero scene/scroll inspected earlier in this session; current source confirms Featured Games, catalogue link, Roadmap, More Games and contact hierarchy.

Adaptation boundary: Featured work before deeper catalogue. Do not copy castle/world assets, roadmap counts, genres or studio business facts.

## Reference: Little Workshop

URL: https://www.littleworkshop.fr/projects/5milliondevs/

Evidence: Official project case study confirms chaptered interactive 3D timeline and desktop/mobile-specific controls; live Netlify game not played.

Adaptation boundary: Content chapters and device-specific interaction. No contest, cartoon style or assumption of its frame-time budget.

## SECTION: Boot / opening media

REFERENCE: Orion

REFERENCE URL: https://orion.adrianred.com/

SPECIFIC INTERACTION BEING STUDIED: Load critical bundle; clear Enter and Skip controls; real readiness only (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Hold a composed entry view while assets decode.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Tierplay wordmark and one status line; no fake machine online statuses.

SPECIFIC TRANSITION: Ready state reveals Enter; skip goes directly to meaningful DOM.

WHAT WE ARE ADAPTING: A deliberate entrance establishes a navigable environment. No cyberpunk palette, collectibles, flying vehicles or flight controls.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: AssetManager dependencies + accessible status; no false percentages.

MOBILE INTERPRETATION: Immediate poster/HTML, optional entry.

PERFORMANCE COST: Low; critical bundle <2MB target. Provisional budget, measure in prototype.

## SECTION: Entrance → floor

REFERENCE: Orion

REFERENCE URL: https://orion.adrianred.com/

SPECIFIC INTERACTION BEING STUDIED: Architectural threshold reveals ONE identifiable Altitude (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Authored 2–4s curve; ease velocity and target; no roll.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Short anchored brand statement exits as product arrives.

SPECIFIC TRANSITION: Occluding wall edge/light reveal; no generic tunnel.

WHAT WE ARE ADAPTING: A deliberate entrance establishes a navigable environment. No cyberpunk palette, collectibles, flying vehicles or flight controls.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: CameraDirector spline + baked environment + one canvas.

MOBILE INTERPRETATION: Shorter 0.8–1.4s lateral reveal; tap Continue.

PERFORMANCE COST: High: environment texture/fill rate; bake light. Provisional budget, measure in prototype.

## SECTION: Cabinet focus / screen entry

REFERENCE: Active Theory

REFERENCE URL: https://activetheory.net/

SPECIFIC INTERACTION BEING STUDIED: Hover/focus selects product; separate Enter command commits (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: 5–15cm focus offset in scene units; dolly to actual display normal; restrained FOV.

SPECIFIC TYPOGRAPHIC BEHAVIOR: DOM Altitude name, verified detail, focus and enter controls.

SPECIFIC TRANSITION: Glass → resolving RGB grid → screen-plane crossing → destination.

WHAT WE ARE ADAPTING: Study scene-to-interface continuity; proposed Tierplay screen transition is an original authored interaction, not a claimed copy of inspected motion.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: Separate ScreenGlass/ScreenDisplay; deterministic TransitionDirector.

MOBILE INTERPRETATION: First tap focuses, CTA enters; no hover dependency.

PERFORMANCE COST: High: pixel shader only during crossing; bounded render target. Provisional budget, measure in prototype.

## SECTION: Newly released games / Games catalogue / Games Collection

REFERENCE: Blue Tower

REFERENCE URL: https://www.bluetowergames.com/

SPECIFIC INTERACTION BEING STUDIED: One active board/cabinet with adjacent choices; preserve media galleries and catalogue routes (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Controlled short lateral reposition, never auto-rotate.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Board/game heading, factual description, catalogue link in DOM.

SPECIFIC TRANSITION: Replace screen media after decoded next frame; preserve layout height.

WHAT WE ARE ADAPTING: Featured work before deeper catalogue. Do not copy castle/world assets, roadmap counts, genres or studio business facts.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: One reusable cabinet; DOM list/filter only where useful; maintain six board URLs.

MOBILE INTERPRETATION: Vertical catalogue, one still/video active; touch previous/next.

PERFORMANCE COST: Medium: one video decoded at once; lazy posters. Provisional budget, measure in prototype.

## SECTION: About Us

REFERENCE: Lusion

REFERENCE URL: https://lusion.co/projects/porsche_dream_machine/

SPECIFIC INTERACTION BEING STUDIED: Leave immersive scene and read company story (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Camera settles; cabinet remains grounded then yields.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Large editorial heading + readable prose, 60–70ch maximum.

SPECIFIC TRANSITION: Technical silhouette fades into DOM without letter scrambling.

WHAT WE ARE ADAPTING: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: HTML source text, optional silhouette mask from approved model.

MOBILE INTERPRETATION: Simple stacked image and prose.

PERFORMANCE COST: Low: no persistent canvas required. Provisional budget, measure in prototype.

## SECTION: Technology / source feature groups

REFERENCE: Lusion

REFERENCE URL: https://lusion.co/projects/porsche_dream_machine/

SPECIFIC INTERACTION BEING STUDIED: Inspect validated cabinet layers with named annotations (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Fixed authored 3/4 camera; components separate along approved axes.

SPECIFIC TYPOGRAPHIC BEHAVIOR: HTML annotations correspond to verified components.

SPECIFIC TRANSITION: Assembled → screen → glass/trim → controls → validated hardware.

WHAT WE ARE ADAPTING: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: Named GLB parts; GSAP timeline; DOM detail list always available.

MOBILE INTERPRETATION: Step buttons show one layer; static diagram on low tier.

PERFORMANCE COST: High: draw calls and exposed internal geometry; TP-003 required. Provisional budget, measure in prototype.

## SECTION: Link Jackpot / TCM / Products

REFERENCE: Little Workshop

REFERENCE URL: https://www.littleworkshop.fr/projects/5milliondevs/

SPECIFIC INTERACTION BEING STUDIED: Explain source functions; TLJ shared pool vs TCM remote route controls remain distinct (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Stable isometric explanation; no drifting hero camera.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Short labels and source-derived explanations; no fictitious live money.

SPECIFIC TRANSITION: Machines initialize → links resolve → explanatory shared node.

WHAT WE ARE ADAPTING: Content chapters and device-specific interaction. No contest, cartoon style or assumption of its frame-time budget.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: Instanced cabinet meshes; one path shader; TCM abstract system diagram, not fake dashboard.

MOBILE INTERPRETATION: 2D ordered diagram with tappable explanations.

PERFORMANCE COST: Medium: 8 instances max initial proposal; instance materials reused. Provisional budget, measure in prototype.

## SECTION: Cabinets / Altitude / Pinnacle

REFERENCE: Lusion

REFERENCE URL: https://lusion.co/projects/porsche_dream_machine/

SPECIFIC INTERACTION BEING STUDIED: Light reveals each product; explicit next model and specs (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Authored shallow arc then lateral model change; no unrestricted orbit.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Exact model names and verified spec tables in HTML.

SPECIFIC TRANSITION: Light reveals real geometry, lateral change preserves stage.

WHAT WE ARE ADAPTING: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: Model LODs + environment map; lazy second cabinet.

MOBILE INTERPRETATION: Portrait product render + tap detail; optional short arc.

PERFORMANCE COST: High: two model budgets; no simultaneous full-resolution loading. Provisional budget, measure in prototype.

## SECTION: Player Journey

REFERENCE: Little Workshop

REFERENCE URL: https://www.littleworkshop.fr/projects/5milliondevs/

SPECIFIC INTERACTION BEING STUDIED: Source-led chapters: Link Jackpot benefits → standard jackpot benefits → loyalty → game features (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Restrained chapter-to-chapter movement, no invented onboarding stages.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Keep original feature distinctions and claims with approval flags.

SPECIFIC TRANSITION: Active chapter accent resolves into DOM explanation.

WHAT WE ARE ADAPTING: Content chapters and device-specific interaction. No contest, cartoon style or assumption of its frame-time budget.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: DOM chapter nav with optional explanatory scene.

MOBILE INTERPRETATION: Native vertical reading and explicit step buttons.

PERFORMANCE COST: Medium: repeated media; only active video plays. Provisional budget, measure in prototype.

## SECTION: Testimonials

REFERENCE: Lusion

REFERENCE URL: https://lusion.co/projects/porsche_dream_machine/

SPECIFIC INTERACTION BEING STUDIED: Read one authentic quotation; current placeholders held (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: None.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Editorial quotation/attribution with whitespace.

SPECIFIC TRANSITION: Optional 200ms opacity reveal.

WHAT WE ARE ADAPTING: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: DOM only; no auto-rotating carousel.

MOBILE INTERPRETATION: Native text flow.

PERFORMANCE COST: Low; blocked pending attribution TP-011. Provisional budget, measure in prototype.

## SECTION: Partners / distribution

REFERENCE: Blue Tower

REFERENCE URL: https://www.bluetowergames.com/

SPECIFIC INTERACTION BEING STUDIED: Retain operator/distributor intent; logos only when evidenced (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: None unless approved later context needs product still.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Names/logos and relationship text only from owner evidence.

SPECIFIC TRANSITION: Simple reveal without spinning clouds.

WHAT WE ARE ADAPTING: Featured work before deeper catalogue. Do not copy castle/world assets, roadmap counts, genres or studio business facts.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: DOM list; no invented partners.

MOBILE INTERPRETATION: Stacked names with same business meaning.

PERFORMANCE COST: Low; partner content absent from source, conditional only. Provisional budget, measure in prototype.

## SECTION: Sales/contact + shared lead form + support

REFERENCE: Lusion

REFERENCE URL: https://lusion.co/projects/porsche_dream_machine/

SPECIFIC INTERACTION BEING STUDIED: Direct fast form access; preserve two form intents and role choices (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: Optional final settled cabinet; no camera on contact route.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Explicit field labels/errors and preserved contact details.

SPECIFIC TRANSITION: World ends before form becomes active; no submission animation delay.

WHAT WE ARE ADAPTING: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: Server-validated HTML form with real destination; /contact-sales/ and /24-7-support/ retained.

MOBILE INTERPRETATION: Single column; correct keyboards; no WebGL dependency.

PERFORMANCE COST: Low GPU; operational endpoint/consent gaps high priority. Provisional budget, measure in prototype.

## SECTION: News / Up to Date / footer / legal

REFERENCE: Lusion

REFERENCE URL: https://lusion.co/projects/porsche_dream_machine/

SPECIFIC INTERACTION BEING STUDIED: Editorial reading and understandable route access (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: None.

SPECIFIC TYPOGRAPHIC BEHAVIOR: Readable headings/body; legible navigation and legal links.

SPECIFIC TRANSITION: Immediate route change, optional short fade.

WHAT WE ARE ADAPTING: Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: Semantic DOM; source route parity; default Hello world deprecated.

MOBILE INTERPRETATION: Native links, no cinematic wrapper.

PERFORMANCE COST: Low; missing genuine news/legal URLs remain explicit. Provisional budget, measure in prototype.
