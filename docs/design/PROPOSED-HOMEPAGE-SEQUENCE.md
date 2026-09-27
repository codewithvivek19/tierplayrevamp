# Proposed homepage sequence

Proposal only. Legacy anchor order is retained: Games → About → Cabinets → Testimonials → lead form → footer. Added technology/product/journey excerpts are explicit expansions from existing dedicated pages; not silently claimed as legacy sections. Prototype boundary is row03.

## 01 Boot

- Content retained: Opening media. New presentation shell.
- Visual concept: Load critical bundle; clear Enter and Skip controls; real readiness only.
- Reference: Orion — https://orion.adrianred.com/.
- Camera: Hold a composed entry view while assets decode.
- Layout: Tierplay wordmark and one status line; no fake machine online statuses.
- Animation: Ready state reveals Enter; skip goes directly to meaningful DOM.
- WebGL involvement: AssetManager dependencies + accessible status; no false percentages.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-001, TP-004, TP-007.
- Desktop behavior: Load critical bundle; clear Enter and Skip controls; real readiness only with keyboard equivalents and direct routes.
- Mobile behavior: Immediate poster/HTML, optional entry.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Low; critical bundle <2MB target; assets stream only near intent/visibility.

## 02 Entrance

- Content retained: Opening media. New architectural threshold.
- Visual concept: Architectural threshold reveals ONE identifiable Altitude.
- Reference: Orion — https://orion.adrianred.com/.
- Camera: Authored 2–4s curve; ease velocity and target; no roll.
- Layout: Short anchored brand statement exits as product arrives.
- Animation: Occluding wall edge/light reveal; no generic tunnel.
- WebGL involvement: CameraDirector spline + baked environment + one canvas.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-004.
- Desktop behavior: Architectural threshold reveals ONE identifiable Altitude with keyboard equivalents and direct routes.
- Mobile behavior: Shorter 0.8–1.4s lateral reveal; tap Continue.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: High: environment texture/fill rate; bake light; assets stream only near intent/visibility.

## 03 Floor / Altitude / focus / screen entry

- Content retained: Cabinets source. Relocated introductory product encounter; first prototype ends here.
- Visual concept: Hover/focus selects product; separate Enter command commits.
- Reference: Active Theory — https://activetheory.net/.
- Camera: 5–15cm focus offset in scene units; dolly to actual display normal; restrained FOV.
- Layout: DOM Altitude name, verified detail, focus and enter controls.
- Animation: Glass → resolving RGB grid → screen-plane crossing → destination.
- WebGL involvement: Separate ScreenGlass/ScreenDisplay; deterministic TransitionDirector.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-001, TP-005, TP-006.
- Desktop behavior: Hover/focus selects product; separate Enter command commits with keyboard equivalents and direct routes.
- Mobile behavior: First tap focuses, CTA enters; no hover dependency.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: High: pixel shader only during crossing; bounded render target; assets stream only near intent/visibility.

## 04 Featured/new games

- Content retained: Newly released Games. Preserve legacy first content anchor.
- Visual concept: One active board/cabinet with adjacent choices; preserve media galleries and catalogue routes.
- Reference: Blue Tower — https://www.bluetowergames.com/.
- Camera: Controlled short lateral reposition, never auto-rotate.
- Layout: Board/game heading, factual description, catalogue link in DOM.
- Animation: Replace screen media after decoded next frame; preserve layout height.
- WebGL involvement: One reusable cabinet; DOM list/filter only where useful; maintain six board URLs.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-005, TP-008.
- Desktop behavior: One active board/cabinet with adjacent choices; preserve media galleries and catalogue routes with keyboard equivalents and direct routes.
- Mobile behavior: Vertical catalogue, one still/video active; touch previous/next.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Medium: one video decoded at once; lazy posters; assets stream only near intent/visibility.

## 05 About

- Content retained: About Us. Preserve relative order and factual meaning.
- Visual concept: Leave immersive scene and read company story.
- Reference: Lusion — https://lusion.co/projects/porsche_dream_machine/.
- Camera: Camera settles; cabinet remains grounded then yields.
- Layout: Large editorial heading + readable prose, 60–70ch maximum.
- Animation: Technical silhouette fades into DOM without letter scrambling.
- WebGL involvement: HTML source text, optional silhouette mask from approved model.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: Approved about images/copy.
- Desktop behavior: Leave immersive scene and read company story with keyboard equivalents and direct routes.
- Mobile behavior: Simple stacked image and prose.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Low: no persistent canvas required; assets stream only near intent/visibility.

## 06 Technology

- Content retained: Cabinets feature groups. New home teaser from retained dedicated route.
- Visual concept: Inspect validated cabinet layers with named annotations.
- Reference: Lusion — https://lusion.co/projects/porsche_dream_machine/.
- Camera: Fixed authored 3/4 camera; components separate along approved axes.
- Layout: HTML annotations correspond to verified components.
- Animation: Assembled → screen → glass/trim → controls → validated hardware.
- WebGL involvement: Named GLB parts; GSAP timeline; DOM detail list always available.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-003.
- Desktop behavior: Inspect validated cabinet layers with named annotations with keyboard equivalents and direct routes.
- Mobile behavior: Step buttons show one layer; static diagram on low tier.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: High: draw calls and exposed internal geometry; TP-003 required; assets stream only near intent/visibility.

## 07 TLJ

- Content retained: Products / Player Journey. New explanatory home teaser; full source pages remain.
- Visual concept: Explain source functions; TLJ shared pool vs TCM remote route controls remain distinct.
- Reference: Little Workshop — https://www.littleworkshop.fr/projects/5milliondevs/.
- Camera: Stable isometric explanation; no drifting hero camera.
- Layout: Short labels and source-derived explanations; no fictitious live money.
- Animation: Machines initialize → links resolve → explanatory shared node.
- WebGL involvement: Instanced cabinet meshes; one path shader; TCM abstract system diagram, not fake dashboard.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-001 LOD, TP-009.
- Desktop behavior: Explain source functions; TLJ shared pool vs TCM remote route controls remain distinct with keyboard equivalents and direct routes.
- Mobile behavior: 2D ordered diagram with tappable explanations.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Medium: 8 instances max initial proposal; instance materials reused; assets stream only near intent/visibility.

## 08 Cabinet showcase

- Content retained: Cabinets home section. Preserve relative home anchor; expand verified product presentation.
- Visual concept: Light reveals each product; explicit next model and specs.
- Reference: Lusion — https://lusion.co/projects/porsche_dream_machine/.
- Camera: Authored shallow arc then lateral model change; no unrestricted orbit.
- Layout: Exact model names and verified spec tables in HTML.
- Animation: Light reveals real geometry, lateral change preserves stage.
- WebGL involvement: Model LODs + environment map; lazy second cabinet.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-001, TP-002.
- Desktop behavior: Light reveals each product; explicit next model and specs with keyboard equivalents and direct routes.
- Mobile behavior: Portrait product render + tap detail; optional short arc.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: High: two model budgets; no simultaneous full-resolution loading; assets stream only near intent/visibility.

## 09 Products / operator systems

- Content retained: Products. New home teaser; no new product names.
- Visual concept: Explain source functions; TLJ shared pool vs TCM remote route controls remain distinct.
- Reference: Little Workshop — https://www.littleworkshop.fr/projects/5milliondevs/.
- Camera: Stable isometric explanation; no drifting hero camera.
- Layout: Short labels and source-derived explanations; no fictitious live money.
- Animation: Machines initialize → links resolve → explanatory shared node.
- WebGL involvement: Instanced cabinet meshes; one path shader; TCM abstract system diagram, not fake dashboard.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-009.
- Desktop behavior: Explain source functions; TLJ shared pool vs TCM remote route controls remain distinct with keyboard equivalents and direct routes.
- Mobile behavior: 2D ordered diagram with tappable explanations.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Medium: 8 instances max initial proposal; instance materials reused; assets stream only near intent/visibility.

## 10 Player Journey

- Content retained: Player Journey. New home teaser; source stage meanings only.
- Visual concept: Source-led chapters: Link Jackpot benefits → standard jackpot benefits → loyalty → game features.
- Reference: Little Workshop — https://www.littleworkshop.fr/projects/5milliondevs/.
- Camera: Restrained chapter-to-chapter movement, no invented onboarding stages.
- Layout: Keep original feature distinctions and claims with approval flags.
- Animation: Active chapter accent resolves into DOM explanation.
- WebGL involvement: DOM chapter nav with optional explanatory scene.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-005.
- Desktop behavior: Source-led chapters: Link Jackpot benefits → standard jackpot benefits → loyalty → game features with keyboard equivalents and direct routes.
- Mobile behavior: Native vertical reading and explicit step buttons.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Medium: repeated media; only active video plays; assets stream only near intent/visibility.

## 11 Testimonials

- Content retained: Testimonials. Section purpose retained; placeholders explicitly held/deprecated.
- Visual concept: Read one authentic quotation; current placeholders held.
- Reference: Lusion — https://lusion.co/projects/porsche_dream_machine/.
- Camera: None.
- Layout: Editorial quotation/attribution with whitespace.
- Animation: Optional 200ms opacity reveal.
- WebGL involvement: DOM only; no auto-rotating carousel.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-011.
- Desktop behavior: Read one authentic quotation; current placeholders held with keyboard equivalents and direct routes.
- Mobile behavior: Native text flow.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Low; blocked pending attribution TP-011; assets stream only near intent/visibility.

## 12 Partners / distribution

- Content retained: Shared distributor intent only. Conditional; no partner logo evidence, do not invent a section of logos.
- Visual concept: One active board/cabinet with adjacent choices; preserve media galleries and catalogue routes.
- Reference: Blue Tower — https://www.bluetowergames.com/.
- Camera: Controlled short lateral reposition, never auto-rotate.
- Layout: Board/game heading, factual description, catalogue link in DOM.
- Animation: Replace screen media after decoded next frame; preserve layout height.
- WebGL involvement: One reusable cabinet; DOM list/filter only where useful; maintain six board URLs.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-011.
- Desktop behavior: One active board/cabinet with adjacent choices; preserve media galleries and catalogue routes with keyboard equivalents and direct routes.
- Mobile behavior: Vertical catalogue, one still/video active; touch previous/next.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Medium: one video decoded at once; lazy posters; assets stream only near intent/visibility.

## 13 Operator/distributor CTA

- Content retained: Shared lead form. Preserve fields and conversion intent; retain Contact Sales separately.
- Visual concept: Direct fast form access; preserve two form intents and role choices.
- Reference: Lusion — https://lusion.co/projects/porsche_dream_machine/.
- Camera: Optional final settled cabinet; no camera on contact route.
- Layout: Explicit field labels/errors and preserved contact details.
- Animation: World ends before form becomes active; no submission animation delay.
- WebGL involvement: Server-validated HTML form with real destination; /contact-sales/ and /24-7-support/ retained.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-010.
- Desktop behavior: Direct fast form access; preserve two form intents and role choices with keyboard equivalents and direct routes.
- Mobile behavior: Single column; correct keyboards; no WebGL dependency.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Low GPU; operational endpoint/consent gaps high priority; assets stream only near intent/visibility.

## 14 Footer

- Content retained: Shared footer. Preserve route/contact/legal intent; repair verified broken links.
- Visual concept: Editorial reading and understandable route access.
- Reference: Lusion — https://lusion.co/projects/porsche_dream_machine/.
- Camera: None.
- Layout: Readable headings/body; legible navigation and legal links.
- Animation: Immediate route change, optional short fade.
- WebGL involvement: Semantic DOM; source route parity; default Hello world deprecated.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: TP-010.
- Desktop behavior: Editorial reading and understandable route access with keyboard equivalents and direct routes.
- Mobile behavior: Native links, no cinematic wrapper.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: Low; missing genuine news/legal URLs remain explicit; assets stream only near intent/visibility.
