from pathlib import Path
def w(p,s):Path(p).parent.mkdir(parents=True,exist_ok=True);Path(p).write_text(s.strip()+'\n')
refs={
 'Orion':('https://orion.adrianred.com/','Live entry screen inspected; explicit Enter gate, credits and flight controls, quality settings in DOM. Not measured as an implementation benchmark.','A deliberate entrance establishes a navigable environment. No cyberpunk palette, collectibles, flying vehicles or flight controls.'),
 'Bruno Simon':('https://bruno-simon.com/','Live spatial scene inspected: vehicle, bridge, paths and world-space identity; official page documents map, interact, mute, quality and device-specific controls.','Objects have locations and interaction meaning. No car, physics sandbox or mandatory exploration to reach business content.'),
 'Lusion':('https://lusion.co/projects/porsche_dream_machine/','Official Porsche case study and live layout inspected: large editorial title, controlled product imagery and services column. This is a CG film reference, not proof of real-time browser rendering.','Product material/lighting and editorial contrast. Do not claim film-quality effects are free or copy its flowers, Porsche models or palette.'),
 'Active Theory':('https://activetheory.net/','Live loading/abstract entry and sparse Work/Contact/Audio UI inspected. Work activation failed in browser; exact project camera behavior unverified.','Study scene-to-interface continuity; proposed Tierplay screen transition is an original authored interaction, not a claimed copy of inspected motion.'),
 'Blue Tower':('https://www.bluetowergames.com/','Hero scene/scroll inspected earlier in this session; current source confirms Featured Games, catalogue link, Roadmap, More Games and contact hierarchy.','Featured work before deeper catalogue. Do not copy castle/world assets, roadmap counts, genres or studio business facts.'),
 'Little Workshop':('https://www.littleworkshop.fr/projects/5milliondevs/','Official project case study confirms chaptered interactive 3D timeline and desktop/mobile-specific controls; live Netlify game not played.','Content chapters and device-specific interaction. No contest, cartoon style or assumption of its frame-time budget.')}
# section, reference, interaction, camera, typography, transition, tech, mobile, risk
sections=[
('Boot / opening media','Orion','Load critical bundle; clear Enter and Skip controls; real readiness only','Hold a composed entry view while assets decode','Tierplay wordmark and one status line; no fake machine online statuses','Ready state reveals Enter; skip goes directly to meaningful DOM','AssetManager dependencies + accessible status; no false percentages','Immediate poster/HTML, optional entry','Low; critical bundle <2MB target'),
('Entrance → floor','Orion','Architectural threshold reveals ONE identifiable Altitude','Authored 2–4s curve; ease velocity and target; no roll','Short anchored brand statement exits as product arrives','Occluding wall edge/light reveal; no generic tunnel','CameraDirector spline + baked environment + one canvas','Shorter 0.8–1.4s lateral reveal; tap Continue','High: environment texture/fill rate; bake light'),
('Cabinet focus / screen entry','Active Theory','Hover/focus selects product; separate Enter command commits','5–15cm focus offset in scene units; dolly to actual display normal; restrained FOV','DOM Altitude name, verified detail, focus and enter controls','Glass → resolving RGB grid → screen-plane crossing → destination','Separate ScreenGlass/ScreenDisplay; deterministic TransitionDirector','First tap focuses, CTA enters; no hover dependency','High: pixel shader only during crossing; bounded render target'),
('Newly released games / Games catalogue / Games Collection','Blue Tower','One active board/cabinet with adjacent choices; preserve media galleries and catalogue routes','Controlled short lateral reposition, never auto-rotate','Board/game heading, factual description, catalogue link in DOM','Replace screen media after decoded next frame; preserve layout height','One reusable cabinet; DOM list/filter only where useful; maintain six board URLs','Vertical catalogue, one still/video active; touch previous/next','Medium: one video decoded at once; lazy posters'),
('About Us','Lusion','Leave immersive scene and read company story','Camera settles; cabinet remains grounded then yields','Large editorial heading + readable prose, 60–70ch maximum','Technical silhouette fades into DOM without letter scrambling','HTML source text, optional silhouette mask from approved model','Simple stacked image and prose','Low: no persistent canvas required'),
('Technology / source feature groups','Lusion','Inspect validated cabinet layers with named annotations','Fixed authored 3/4 camera; components separate along approved axes','HTML annotations correspond to verified components','Assembled → screen → glass/trim → controls → validated hardware','Named GLB parts; GSAP timeline; DOM detail list always available','Step buttons show one layer; static diagram on low tier','High: draw calls and exposed internal geometry; TP-003 required'),
('Link Jackpot / TCM / Products','Little Workshop','Explain source functions; TLJ shared pool vs TCM remote route controls remain distinct','Stable isometric explanation; no drifting hero camera','Short labels and source-derived explanations; no fictitious live money','Machines initialize → links resolve → explanatory shared node','Instanced cabinet meshes; one path shader; TCM abstract system diagram, not fake dashboard','2D ordered diagram with tappable explanations','Medium: 8 instances max initial proposal; instance materials reused'),
('Cabinets / Altitude / Pinnacle','Lusion','Light reveals each product; explicit next model and specs','Authored shallow arc then lateral model change; no unrestricted orbit','Exact model names and verified spec tables in HTML','Light reveals real geometry, lateral change preserves stage','Model LODs + environment map; lazy second cabinet','Portrait product render + tap detail; optional short arc','High: two model budgets; no simultaneous full-resolution loading'),
('Player Journey','Little Workshop','Source-led chapters: Link Jackpot benefits → standard jackpot benefits → loyalty → game features','Restrained chapter-to-chapter movement, no invented onboarding stages','Keep original feature distinctions and claims with approval flags','Active chapter accent resolves into DOM explanation','DOM chapter nav with optional explanatory scene','Native vertical reading and explicit step buttons','Medium: repeated media; only active video plays'),
('Testimonials','Lusion','Read one authentic quotation; current placeholders held','None','Editorial quotation/attribution with whitespace','Optional 200ms opacity reveal','DOM only; no auto-rotating carousel','Native text flow','Low; blocked pending attribution TP-011'),
('Partners / distribution','Blue Tower','Retain operator/distributor intent; logos only when evidenced','None unless approved later context needs product still','Names/logos and relationship text only from owner evidence','Simple reveal without spinning clouds','DOM list; no invented partners','Stacked names with same business meaning','Low; partner content absent from source, conditional only'),
('Sales/contact + shared lead form + support','Lusion','Direct fast form access; preserve two form intents and role choices','Optional final settled cabinet; no camera on contact route','Explicit field labels/errors and preserved contact details','World ends before form becomes active; no submission animation delay','Server-validated HTML form with real destination; /contact-sales/ and /24-7-support/ retained','Single column; correct keyboards; no WebGL dependency','Low GPU; operational endpoint/consent gaps high priority'),
('News / Up to Date / footer / legal','Lusion','Editorial reading and understandable route access','None','Readable headings/body; legible navigation and legal links','Immediate route change, optional short fade','Semantic DOM; source route parity; default Hello world deprecated','Native links, no cinematic wrapper','Low; missing genuine news/legal URLs remain explicit')]
s='# Reference map\n\n2026-09-26. Concrete reference evidence is separated from proposed Tierplay behavior. Camera distances/timing below are design proposals, not reverse-engineered measurements of reference implementations. No imported reference assets.\n\n'
for n,(url,e,principle) in refs.items():s+=f'## Reference: {n}\n\nURL: {url}\n\nEvidence: {e}\n\nAdaptation boundary: {principle}\n\n'
for name,ref,inter,cam,typ,trans,tech,mob,risk in sections:
 url,e,bound=refs[ref]
 s+=f'''## SECTION: {name}

REFERENCE: {ref}

REFERENCE URL: {url}

SPECIFIC INTERACTION BEING STUDIED: {inter} (Tierplay proposal informed by evidence above.)

SPECIFIC CAMERA BEHAVIOR: {cam}.

SPECIFIC TYPOGRAPHIC BEHAVIOR: {typ}.

SPECIFIC TRANSITION: {trans}.

WHAT WE ARE ADAPTING: {bound}

WHAT WE ARE NOT COPYING: Reference branding, content, geometry, visual assets, unmeasured technical implementations, and unrelated business claims.

TIERPLAY INTERPRETATION: Real source content and cabinets carry the scene; preserve the source route/section purpose.

TECHNICAL IMPLEMENTATION: {tech}.

MOBILE INTERPRETATION: {mob}.

PERFORMANCE COST: {risk}. Provisional budget, measure in prototype.

'''
w('docs/design/REFERENCE-MAP.md',s)
w('docs/design/VISUAL-DIRECTION.md','''# Proposed visual direction — precision showroom

Status: proposed under 2026-09-26 master spec; not approved or implemented.

Hardware is the primary subject. One authentic Altitude cabinet stands on a grounded architectural floor. Dark graphite architecture, broad soft illumination, smoked glass, restrained metal edge reflections and game color confined primarily to the display. Wide negative space supports DOM type. Avoid the generated dragon dominating cabinet identity. The three previous generated scenes remain concept history, not production geometry.

Use material-led contrast: matte shell vs reflective glass, soft key vs narrow rim, readable screen vs darker architecture. No fog masking modeling errors; no default bloom. Environment navigation leads toward meaningful product objects, with direct navigation always available. About and contact deliberately decompress into editorial HTML.

Prototype framing: standard desktop cabinet center-right with complete base visible; ultrawide preserve product scale rather than fill screen; mobile centered portrait with CTA below and clear touch target. Exact camera coordinates wait for measured model bounds. A layout cannot be approved against a fictional box cabinet.

Reference rationale and evidence limits are in REFERENCE-MAP. Brand colors/fonts below remain candidates pending isolated M02 proofs; none of this authorizes production page rollout.
''')
w('docs/design/MOTION-DIRECTION.md','''# Proposed motion direction

Weighted, reversible and skippable. A phase machine owns progress, CameraDirector owns camera position/target/FOV, LightingDirector owns state lighting, TransitionDirector owns the screen crossing, Motion owns menu/form component transitions. Scroll requests semantic phase progress; it never writes camera.position directly.

Boot waits only for real critical resources. Entrance is 2–4s desktop / 0.8–1.4s mobile and skippable. Focus is 350–500ms with 5–15cm lateral shift, not object scaling. Selection dolly 1.2–2.2s; glass reflection reduces as resolving pixel grid takes over. Reverse/cancel returns deterministically to focus. Reduced motion uses product stills and scene cuts; screen metadata remains identical.

Micro150–300ms; UI250–500ms; section500–1200ms; camera800–3000ms; cinematic2–8s upper envelope. Centralize constants at implementation. No compulsory audio or invented connection statuses. Emission changes serve cabinet focus; remove ambient particles unless part of purposeful screen/network communication.
''')
# Proposed homepage: source anchors mapped explicitly, not implemented.
order=[('01','Boot','Opening media','New presentation shell','Orion','TP-001, TP-004, TP-007'),('02','Entrance','Opening media','New architectural threshold','Orion','TP-004'),('03','Floor / Altitude / focus / screen entry','Cabinets source','Relocated introductory product encounter; first prototype ends here','Active Theory','TP-001, TP-005, TP-006'),('04','Featured/new games','Newly released Games','Preserve legacy first content anchor','Blue Tower','TP-005, TP-008'),('05','About','About Us','Preserve relative order and factual meaning','Lusion','Approved about images/copy'),('06','Technology','Cabinets feature groups','New home teaser from retained dedicated route','Lusion','TP-003'),('07','TLJ','Products / Player Journey','New explanatory home teaser; full source pages remain','Little Workshop','TP-001 LOD, TP-009'),('08','Cabinet showcase','Cabinets home section','Preserve relative home anchor; expand verified product presentation','Lusion','TP-001, TP-002'),('09','Products / operator systems','Products','New home teaser; no new product names','Little Workshop','TP-009'),('10','Player Journey','Player Journey','New home teaser; source stage meanings only','Little Workshop','TP-005'),('11','Testimonials','Testimonials','Section purpose retained; placeholders explicitly held/deprecated','Lusion','TP-011'),('12','Partners / distribution','Shared distributor intent only','Conditional; no partner logo evidence, do not invent a section of logos','Blue Tower','TP-011'),('13','Operator/distributor CTA','Shared lead form','Preserve fields and conversion intent; retain Contact Sales separately','Lusion','TP-010'),('14','Footer','Shared footer','Preserve route/contact/legal intent; repair verified broken links','Lusion','TP-010')]
s='# Proposed homepage sequence\n\nProposal only. Legacy anchor order is retained: Games → About → Cabinets → Testimonials → lead form → footer. Added technology/product/journey excerpts are explicit expansions from existing dedicated pages; not silently claimed as legacy sections. Prototype boundary is row03.\n\n'
for num,name,source,ret,ref,assets in order:
 matches=[x for x in sections if x[1]==ref];chosen=matches[0]
 if name=='About':chosen=sections[4]
 elif name=='Technology':chosen=sections[5]
 elif name=='Cabinet showcase':chosen=sections[7]
 elif name=='Testimonials':chosen=sections[9]
 elif num=='13':chosen=sections[11]
 elif num=='14':chosen=sections[12]
 elif num in ['07','09']:chosen=sections[6]
 elif num=='10':chosen=sections[8]
 elif num=='02':chosen=sections[1]
 elif num=='03':chosen=sections[2]
 s+=f'''## {num} {name}

- Content retained: {source}. {ret}.
- Visual concept: {chosen[2]}.
- Reference: {ref} — {refs[ref][0]}.
- Camera: {chosen[3]}.
- Layout: {chosen[4]}.
- Animation: {chosen[5]}.
- WebGL involvement: {chosen[6]}.
- DOM involvement: all titles, facts, navigation and actionable controls; no canvas-only content.
- Required assets: {assets}.
- Desktop behavior: {chosen[2]} with keyboard equivalents and direct routes.
- Mobile behavior: {chosen[7]}.
- Reduced-motion behavior: static product/diagram and direct scene cuts; native reading order, no forced travel.
- Performance risk: {chosen[8]}; assets stream only near intent/visibility.

'''
w('docs/design/PROPOSED-HOMEPAGE-SEQUENCE.md',s)
w('docs/design/WEBGL-ARCHITECTURE.md','''# Proposed WebGL architecture

No implementation in this assignment. Reuse existing infrastructure only where it meets the new contract.

BOOT → ENTRANCE → FLOOR_REVEAL → CABINET_IDLE → CABINET_FOCUS → SCREEN_APPROACH → SCREEN_CROSSING → EXIT.

Each transition has enter, update, settle, cancel, exit and cleanup. Focus can return to idle; approach can cancel to focus; Exit ends Prototype-01. User skip reaches floor or DOM equivalent; direct routes bypass cinematics. Transition promises carry an operation id so stale asset completion cannot change current state.

- ExperienceCanvas: single canvas within immersive route group, error boundary and DOM fallback. No hidden second renderer.
- SceneDirector: typed phase and mounted resource ownership; inactive objects stop updates.
- CameraDirector + CameraPath: one writer for pose, target, FOV; authored splines computed from model screen anchors. Delta-time damping only for small user offsets. Semantic progress maps to distance/phase, not raw scrollY.
- LightingDirector: baked room/environment map plus small dynamic key/emission changes; no arbitrary light collection.
- InteractionDirector: raycast cabinet maps to same focus/select commands as HTML buttons and keyboard. Touch focus is distinct from entering.
- TransitionDirector: cabinet screen plane supplies crossing normal/UVs; RGB grid resolves near surface then destination replaces it. Transition material only mounted while needed; not a black fade.
- Cabinet entity: vetted GLB node/material contract and LOD. Never substitute boxes or a flat generated image as production hardware.
- CabinetScreenMaterial: replaceable ScreenDisplay material; separate ScreenGlass. GameMediaController sequences poster/video using ScreenMediaManager decode/cleanup. ScreenTransitionMaterial owns RGB grid/crossing uniforms. One active video, mute by default.
- AssetManager: critical/hero/gaming-floor/cabinet-altitude/cabinet-pinnacle/game-media/technology/secondary-pages bundles; readiness from actual fetch/decode. Progress fraction only if manifest byte totals accurate; otherwise named resource readiness. Abort unused requests and preserve retryable cache semantics.
- PerformanceManager: sample frame durations with hysteresis, use save-data/motion/memory/pointer hints; downgrade DPR, texture/LOD and effects; STATIC always selectable. No precise capability inference from viewport alone.
- AudioDirector: optional after explicit unmute gesture; fades synchronized with phase; suspension on hidden tab and no surprise restart.
- DOM: source content, status, navigation, skip/focus/enter/return, error retry and specifications remain outside canvas. Canvas decorative to assistive technology; same state powers textual controls.

Folder targets: experience/, camera/, scenes/{BootScene,EntranceScene,GamingFloorScene,CabinetScene}, entities/{Cabinet,GameScreen,Environment}, directors/, shaders/, performance/, data/. Do not create empty future scene scaffolding. Later technology and jackpot modules enter only at their milestones.

Central config targets: motion.config.ts, camera.config.ts, scene.config.ts, performance.config.ts. Typed content uses id, legacyUrl, sourceSnapshot, factualCopy, marketingCopy, approvalState, conflicts and assetIds; preserve source data separate from render code.

Native scroll remains baseline. Lenis is optional only after comparative prototype evidence; GSAP governs choreography, Motion small DOM interactions. No new physics or postprocessing dependency without measured need. Context loss or model/video failure reveals approved still + complete HTML with retry. If an approved still is also missing, record asset blocker during development; never replace required media with generic visuals.
''')
w('docs/design/COMPONENT-OPPORTUNITIES.md','''# Component ecosystem review

Planning only; no packages added.

| Source | Useful problem | Decision | Cost/mobile/accessibility |
|---|---|---|---|
| Motion https://motion.dev/docs/react-animation | Menu enter/exit and form status | Reuse installed AnimatePresence where needed | Small transform/opacity; reduced motion; preserve focus |
| Radix/shadcn https://www.radix-ui.com/primitives/docs/components/dialog | Catalogue filters/lightbox dialog | Evaluate focused primitive at M07, not whole theme | Portal/focus/escape behavior; touch targets; measure bundle |
| 21st.dev https://21st.dev/community/components/anubra266/dialog-2/feedback-dialog | Dialog pattern reference | Review semantics/license before import; custom styling | No stylistic transplant; mobile sizing and focus audit |
| React Bits https://reactbits.dev/ | Effect discovery | No hero component selected; custom screen shader solves actual geometry problem | Reject decorative particle/text effects; unknown cost until isolated test |
| Motion Primitives https://motion-primitives.com/ | Disclosure/transition pattern | Candidate for small DOM sections only | Installed Motion may already suffice; avoid duplicate packages |
| transitions.dev https://transitions.dev/ | Dropdown, disclosure, icon transition | Project skill available; use when interaction implemented | CSS transform/opacity; reduced-motion path |
| useLayouts https://uselayouts.com/ | Editorial grouping references | Composition study only; not a layout stack | DOM readability and breakpoint fit |
| Libraries.dev https://libraries.dev/ | Media loading/reveal | Only if real loading problem needs it; no glow/bot/orb pattern | Existing image fallback likely simpler |
| Magic UI / Aceternity | Common visual patterns | No current dependency justified | Reject decorative beam, bento and effect-led identity |

Public Motion/21st pages checked this turn; other ecosystem entries are candidates/catalog links, not vetted implementations. Each adoption requires concrete problem, Tierplay fit, custom alternative comparison, measured payload/frame impact, touch behavior, accessible fallback and license review. Bespoke product/camera/screen interaction remains custom.
''')
w('docs/MILESTONE-PLAN.md','''# Milestone plan under new master specification

No further production work begins in the audit assignment. M00/M01 documents are reviewable, but factual/asset gaps remain; they are not a visual approval.

| Milestone | Output | Exit gate |
|---|---|---|
| 00 Audit | Public route/content/feature/CTA/media/SEO evidence and source conflict ledger | Every recovered section accounted for; missing facts explicit; owner resolves publication holds |
| 01 References | Section reference map, proposed sequence, visual/motion direction and asset briefs | Concrete interaction storyboard and content-order changes reviewed; no unverified reference claims |
| 02 Design system | Font/color/grid/spacing/controls/nav/motion/responsive tokens; isolated DOM proofs | Desktop/ultrawide/tablet/mobile composition and keyboard/contrast review |
| 03 Foundation | Canvas, Scene/Camera/Lighting/Transition directors, AssetManager, PerformanceManager | Deterministic phase cancel/skip/retry; resource cleanup; no geometry passed off as product |
| 04 Prototype-01 | Boot → entrance → floor → ONE Altitude → focus → animated screen → screen entry → exit | Visual/material/camera/mobile/performance/accessibility review; STOP, no full homepage |
| 05 Asset production | Final Altitude/Pinnacle GLBs, approved environment/game media/textures/audio/HDRI | Geometry validation, texture/LOD budgets and owner product approval |
| 06 Homepage | Remaining approved source sequence | All content dispositions reconciled; no placeholder testimonials/partners |
| 07 Games | Catalogue and retained board routes, filters if justified, downloads | Content parity, correct game media, real flyers, semantic metadata |
| 08 Cabinets | Both model presentations/specs/exploded views | Approved GLBs and sheets; factual feature-to-model mapping |
| 09 Products | TCM/TLJ/loyalty explanations | Source-accurate behaviors; no invented operational dashboard |
| 10 Player Journey | Source-led benefits narrative | No fabricated journey stages/metrics |
| 11 News/content/contact/support | Fast retained editorial/support/sales routes and genuine content | Functional validated forms and destinations; no default WordPress post |
| 12 Hardening | Full browser/device/a11y/SEO/performance/form review | Measured budgets, completed content ledger, approved release host |

## Dependency correction

Although final asset production is M05, Prototype-01 cannot look physically correct without an approved Altitude model and environment. Produce TP-001/TP-004 prototype-quality validated assets before M04; finalize complete LOD/second model pipeline at M05. No stacked-box or image-plane substitution is authorized by the new brief. The earlier general permission for prototype placeholders does not override its specific cabinet prohibition.

## Prototype acceptance

Boot reflects actual readiness and never blocks DOM navigation. Entry has skip and cancellation. Altitude is grounded, correctly proportioned and identifiable. Hover/keyboard focus lights the screen without scaling the machine. Touch tap focuses before entering. Independent screen media works and crosses actual display plane. Camera path has continuous velocity, no roll/snap, no arbitrary raw-scroll mapping. Reduced motion/static retain product and controls. Context loss, missing asset/video and back/forward leave usable content. Review screenshots plus recorded motion at 2560×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844 and 320×740.

## Measurement gates

Provisional critical transfer <2MB; first 3D bundle <8–12MB compressed; one active cabinet and video. Desktop target60fps, midrange mobile30–60fps with downgrade; record p50/p95 frame time, draw calls, triangles, texture allocation, heap, long tasks, transfer, lab LCP/CLS/TBT and interaction timing. Target LCP≤2.5s, CLS≤0.1, INP≤200ms (field INP requires field measurement; do not relabel lab TBT). Repeat navigation/context loss checks for memory recovery.

Mandatory final matrix: Chrome macOS/Windows, Safari macOS/iPhone, Chrome Android, Edge Windows, Firefox desktop; integrated Intel, Apple Silicon, midrange Android, high DPR and low power. Mark unavailable hardware pending, never passed by emulation.

## First implementation task (not executed)

M02 isolated, semantic system-boot/entry/focus-control proof driven by an actual AssetManager contract and an approved product still. Establish typography, navigation hierarchy, focus/touch/skip/error states and reduced-motion behavior without building homepage sections. In parallel as a workstream, commission TP-001 Altitude model and TP-004 environment. Start M03 resource lifecycle and camera path only after reviewing the contract. Visual M04 remains BLOCKED BY ASSET: TP-001 until the actual cabinet is available.
''')
print('Direction documents written')
