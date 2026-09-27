from pathlib import Path
files={
'AGENTS.md':'''# Tierplay V2 governance
Mission: a cinematic interactive technology experience, never a template site.
Read this file, docs/DESIGN.md, MOTION.md, WEBGL.md, PERFORMANCE.md, STATUS.md and relevant docs/ADR entries before architecture changes.
Build milestone by milestone. Scope now: foundation and one cabinet → screen → Sunscape prototype. Do not expand beyond M1 until the acceptance gate has evidence.
One animation owner per property: GSAP owns choreography, scroll and DOM/WebGL synchronization; Motion owns menus/buttons/component transitions; Three/R3F owns scene objects/materials; CSS owns simple micro-interactions. Only CameraDirector mutates the global camera. One persistent canvas. Do not introduce a new style without DESIGN.md.
Reference libraries supply primitives, never the design identity. Preserve original recovered assets; derivatives go in public/media. Generated assets remain separate. Verify every product specification and legal claim before publishing. Retain the legacy market restriction verbatim.
Every expensive effect needs a fallback. Mobile is independently composed. Essential content stays semantic HTML. Update docs/STATUS.md after meaningful work. Record non-obvious architecture decisions. No fake backend, telemetry, models or product claims.
Validation: typecheck, production build, Playwright desktop/mobile/reduced-motion/fallback, rendered screenshots and interface review. Never report unavailable physical-device, GPU or cross-browser tests as passed.
''',
'docs/DESIGN.md':'''# Enter the Tier
Narrative: OBJECT → WORLD → NETWORK → SYSTEM → PRODUCT → PARTNERSHIP. Current implementation stops after WORLD.
Near-black #0b0c0e, graphite #181a1e, warm white #f3f0e9, muted #a9aaad, signal red #ed342f. Restrained amber belongs to recovered game art. No neon tunnels, orbs, excessive bloom or casino stock imagery.
Typography candidates: condensed editorial display + neutral geometric UI; oversized grotesk + technical mono; serif editorial + neutral UI. Test actual compositions before choosing. Preferred: locally hosted Barlow Condensed 600 for monumental headings, Manrope for body, system monospace for secondary chapter labels. Avoid over-tight tracking and body text below 16px.
Three hero directions, primary axis = composition:
A / Industrial cinematic: large left-aligned type, real cabinet at right, precise horizon. Hardware leads and the screen provides a natural narrative entry. Recommended because it explains Tierplay's physical/digital distinction immediately.
B / Game energy: full-bleed recovered game media, central cabinet silhouette, small centered copy. Strong entertainment signal but can obscure hardware and resemble a game publisher.
C / Architectural technology: centered cabinet with split technical index and symmetrical framing. Strong operator signal, less emotional and less direct screen entry.
Copy alternatives: THE NEXT TIER OF PLAY / A WORLD BEYOND THE SCREEN / PLAY. CONNECTED. Select first for A. Documentation includes rendered comparison, not just three colors.
Buttons: rectangular, 2px radius, precise 48px+ hit area, arrow; single filled red primary. Use visual silence; no generic grid of cards.
''',
'docs/MOTION.md':'''# Motion contract
GSAP/useGSAP owns hero boot, reveal, scroll timeline and portal DOM transforms. Motion owns mobile navigation only. CameraDirector reads the same progress object and alone changes the camera. R3F demand rendering invalidated on timeline change. No continuous decorative RAF.
Boot is a short activation cue, never a fake progress bar. DOM headline exists immediately. Reveal begins only after critical cabinet image decodes. Macro is an intentional crop of actual media; no invented hardware model.
Sequence: macro → cabinet reveal → hold hero → screen approach → screen expands beyond frame → original Sunscape artwork. Native scrolling, no Lenis. Total cinematic scroll approximately 240vh desktop, shorter mobile. Exit remains possible with native anchors.
Tokens: instant .12, fast .2, normal .35, deliberate .55, cinematic .8, chapter 1.2. Approved ease power3.out and sine.inOut. Reduced motion: no intro zoom, no pin, no large camera travel; original images + DOM narrative.
''',
'docs/WEBGL.md':'''# WebGL
One persistent ExperienceCanvas mounted inside the homepage stage. One CameraDirector; typed BOOT, CABINET_MACRO, CABINET_REVEAL, CABINET_HERO, PORTAL_APPROACH, PORTAL_TRANSITION, SUNSCAPE_WORLD states.
No CAD or verified GLB currently supplied. Use authentic product image for silhouette, not invented box geometry presented as product. M1 uses an image-based 2.5D cabinet composition; true material macro and orbit await original CAD/orthographic views.
Demand renderer; camera frame mutations are refs, not React state. Scenes preload/mount/activate/progress/deactivate/dispose. Use loader cache deliberately; do not dispose shared textures from a child. Error boundary and context-loss handling return to DOM image, never blank screen.
Start without shadows/postprocessing. No giant textures, realtime reflections or bloom to conceal poor media. Next worlds stay unloaded. Observe visibility and pause work in hidden tabs.
''',
'docs/PERFORMANCE.md':'''# Performance strategy
Budgets are provisional gates, not measured achievements: critical media <=1MB; first-load compressed JS <=250KB excluding deferred Three chunk; LCP <=2.5s, CLS <=.1, INP <=200ms on representative midrange hardware. Aim 60fps desktop / stable 30fps low tier during motion, no idle frame loop.
Tier policy: desktop fine-pointer high (DPR cap 1.75), touch/tablet medium (1.25), reduced-motion/save-data/low-memory low (static). Treat capability hints as hints, not benchmarks. Dynamic-load WebGL after meaningful HTML/media render. One cached texture per asset. Original downloads never served directly.
Measure production Lighthouse, network payload, performance trace, repeated navigation, context loss, idle draw calls, animation frame intervals. Physical Safari/iOS/Android GPU results must remain pending without hardware. MotionScore only if available; otherwise record source/runtime audit and never fabricate a score.
''',
'docs/CONTENT-MAP.md':'''# Content map and verification ledger
/ = M1 hero + cabinet → Sunscape 1 world; remaining routes deferred.
/games and /games/[slug] = M2; /technology = M3/M4; /cabinets = M5; /player-journey /about /contact = M6. Do not create empty routes.
Evidence leads: https://tierplay.com/cabinets/ ; https://electronhubs.com/games/ ; https://electronhubs.com/products/ ; https://electronhubs.com/player-journey/ . Local raw page recovery in docs/research.
Observed names: Altitude, Pinnacle, Sunscape, Rise of the Dragon, Rich Times, Gang of Evils; title spellings require product confirmation. TCM = collection management; TLJ = linked jackpot. Do not repeat unsubstantiated revenue, win, certification, manufacturing or support claims.
TODO CLIENT VERIFY: exact dimensions, panels, PCAP, validators, feature availability, company tenure, address/phone, cabinet/model mapping, current territories, privacy and contact destinations.
Legal text to preserve where relevant: “not available for Georgia market”. Do not interpret this as a verified legal analysis. Keep prototype noindex pending approval.
''',
'docs/MEDIA-RECOVERY.md':'''# Media recovery
Public sources only. tierplay.com currently serves a WordPress error. electronhubs.com serves a legacy copy but has a TLS hostname mismatch. Public unauthenticated read retried with certificate verification disabled; provenance is lower-confidence. No credentials, authentication bypass or private endpoint used.
Raw pages in docs/research; originals in assets/source-recovery; machine inventory assets/manifest.json; derivatives in public/media. Files are presumed legacy Tierplay marketing assets, not rights-cleared for public production.
Inventory generated after downloads. Inspect dimensions, bytes, page association, quality, purpose, usability, ownership assumption and replacement needs. Missing: CAD/STEP/FBX/OBJ/GLB, orthographic product photos, approved technical sheet, isolated game depth layers, current legal approval.
''',
'docs/MEDIA-BRIEFS.md':'''# Missing asset briefs
Cabinet: request actual Altitude/Pinnacle CAD/STEP/GLB or front/side/three-quarter high-resolution photographs, exact dimensions and panel/control geometry. Optimize through retopology, UVs, baked PBR, Meshopt, KTX2. Only visible geometry required. Never mislabel invented geometry as actual product.
Game world: preserve recovered game logo, characters and composition. Need layered foreground, subject, midground, environment, sky and effects. Extend only after original inventory and client identity confirmation. First world uses recovered artwork without synthetic character replacement.
Supporting media: no generation authorized as a substitute for available source. Keep generated files in assets/generated with manifest labels. Templates in ORIGINAL-BRIEF.md provide art direction when a demonstrable source gap remains.
''',
'docs/RESPONSIVE.md':'''# Responsive composition
Desktop >=1024: editorial left type, hero hardware right, chapter guide below, full screen approach. Tablet 768–1023: smaller camera range and centered product with copy above. Mobile <=767: compact nav, headline above full recognizable product, bottom CTA and shorter transition. Small 320px remains functional. No hover dependency.
Test 1440x900, 1280x800, 768x1024, 390x844, 320x740 and 200% text. Touch tap targets >=44px. Respect safe-area insets and dynamic viewport height. No horizontal overflow.
''',
'docs/ACCESSIBILITY.md':'''# Accessibility
Semantic main/nav/section/headings, skip link, meaningful image alt text, visible keyboard focus. Canvas decorative aria-hidden; all meaningful content and actions remain HTML. Native anchors operate without JS. No sound by default.
Reduced motion follows live media-query changes. Disable intro/portal flight and long sticky sequence. Low mode is a complete reading experience. Mobile menu: labelled toggle, Escape closes, focus return; keep background inaccessible when drawer is modal.
Audit keyboard, headings, axe contrast/landmarks, 200% text, image failure, WebGL disabled/context loss. No fake progress or inaccessible drag-only controls.
''',
'docs/SEO.md':'''# SEO
Prototype is noindex/nofollow until ownership, market availability and product facts are approved. Server-render headline and product/world copy. Meaningful title/description, local favicon. Do not publish invented schema/specifications or claim production canonical while reviewing locally.
At M6/M7 add verified canonical https://tierplay.com, sitemap only for complete routes, robots release policy, approved social image and real organization schema. No analytics or Sentry keys invented.
''',
'docs/STATUS.md':'''# Status — Phase 0
COMPLETED: empty workspace audit; original brief preserved; public recovery leads researched; project-scoped capability installation; initial governance and architecture docs.
IN PROGRESS: asset recovery, three visual directions, foundation setup.
KNOWN ISSUES: legacy host TLS mismatch; production domain error; no verified model.
PERFORMANCE CONCERNS: original media must be resized before serving; WebGL deferred.
VISUAL CONCERNS: exact material macro impossible without geometry/photography; image-based prototype must be honest.
ARCHITECTURE DECISIONS: Next.js App Router, typed React, persistent progressive R3F, GSAP + Motion ownership, native scroll, local content.
ASSETS RECOVERED: see assets/manifest.json after recovery completes.
ASSETS MISSING: CAD/GLB, layers, approvals.
NEXT TASK: review authentic media; create three direction compositions; implement M0 then M1 only.
FILES CHANGED: docs, AGENTS.md, scripts/recover.py, package.json, project-scoped skills.
''',
'README.md':'''# Tierplay V2
Milestone 0/1 prototype. See docs/STATUS.md for actual completion and remaining gates. Original instruction: docs/ORIGINAL-BRIEF.md.
Run: npm install, npm run dev. Validate: npm run typecheck, npm run build, npm test.
This is a local review prototype. No production claims, credentials or backend. Original assets retain provenance in assets/manifest.json.
''',
'.gitignore':'''node_modules/\n.next/\nout/\n.env*\n!.env.example\nplaywright-report/\ntest-results/\n.DS_Store\n'''
}
adrs=[('0001-persistent-webgl-canvas','Progressive shared canvas','One R3F demand canvas overlays an always-present image composition.','Per-section contexts or canvas-only presentation.','Readable fallback; explicit invalidation required.'),('0002-camera-director','One camera owner','CameraDirector alone changes camera from shared sequence progress.','Per-component camera tweens.','Predictable ownership; scenes cannot mutate camera.'),('0003-gsap-motion-ownership','Animation ownership','GSAP handles narrative; Motion only menu; CSS micro-interactions.','Mixing libraries on the same transform.','Cleanup and ownership are auditable.'),('0004-device-tier-system','Capability tiers','Capability hints cap DPR and select static low tier.','User-agent sniffing or high quality everywhere.','Hints require real device profiling.'),('0005-sunscape-2-5d-worlds','Authentic imagery first','Image-based 2.5D proof using original media until source models/layers arrive.','Invented cabinet geometry or generic AI art.','Not a production material-accurate 3D cabinet; gate stays open.'),('0006-webgl-static-fallback','Static narrative parity','Server HTML and images remain readable without renderer or motion.','Canvas-only loading experience.','Slight media duplication traded for resilience.'),('0007-local-prototype','Milestone delivery','Deliver local M0/M1 review; defer public deployment to M7 and verified content.','Publish incomplete whole site immediately.','Honors explicit milestone order over general hosting defaults.')]
for n,title,dec,alt,cons in adrs:files['docs/ADR/'+n+'.md']=f'# {title}\n\nStatus: accepted for prototype.\nContext: {title} needed for the requested cinematic, accessible staged experience.\nDecision: {dec}\nAlternatives: {alt}\nConsequences: {cons}\n'
for p,s in files.items():Path(p).parent.mkdir(parents=True,exist_ok=True);Path(p).write_text(s)
