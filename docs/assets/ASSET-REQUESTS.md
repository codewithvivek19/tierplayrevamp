# Asset requests

Planning only. Required media is never silently replaced. IDs are used by proposed sequence and milestone gates. Budgets are provisional targets, not measurements. Exact cabinet identity/dimensions come from the source owner, not generative inference.

## TP-001

ASSET ID: TP-001

TYPE: Blender / product model

PAGE: Home prototype; /cabinets/

SECTION: Altitude hero/focus/screen entry

PURPOSE: Recognizable real Altitude with independent display and glass

SOURCE REFERENCE: /cabinets/; vertical-cabinet-with-tierplay-logo.webp

DIMENSIONS: Measured real-world cabinet dimensions; meters; dimensions not supplied

CAMERA: Front 3/4, target lens50mm equivalent, camera1.35m subject to approved product dimensions

LIGHTING: Large soft key left; controlled rim right; subtle overhead strip

MATERIALS: Reference-verified shell, trim, glass, controls; do not assume brushed aluminum if reference does not establish it

LOOP REQUIREMENT: None; screen media separate

ALPHA REQUIREMENT: No

OUTPUT FORMAT: GLB + editable .blend + texture sources

OPTIMIZATION TARGET: Provisional LOD0≤120k triangles, LOD1≤60k, LOD2≤20k; ≤6MB compressed with textures; measure silhouette loss

MOBILE VERSION REQUIRED: Yes: LOD2, 1K textures and approved portrait still

NOTES: BLOCKED BY ASSET: TP-001. BLENDER ASSET REQUIRED. Exact orthographic front/side/rear/top, dimensions, screen curvature/normal and component photos needed. No stacked-box substitute.

## TP-002

ASSET ID: TP-002

TYPE: Blender / product model

PAGE: /cabinets/; later home showcase

SECTION: Pinnacle presentation

PURPOSE: Preserve curved cabinet identity and separate screen geometry

SOURCE REFERENCE: /cabinets/; Curved-single-side-with-tierplay-logo.webp

DIMENSIONS: Real meters and verified curved-display radius; not supplied

CAMERA: Authored shallow arc around real product bounds

LIGHTING: Soft controlled material sweep, neutral environment

MATERIALS: As per approved physical sample/photos

LOOP REQUIREMENT: None

ALPHA REQUIREMENT: No

OUTPUT FORMAT: GLB + .blend + PBR texture sources

OPTIMIZATION TARGET: Same initial LOD/bundle targets as TP-001; load only when requested

MOBILE VERSION REQUIRED: Yes

NOTES: BLENDER ASSET REQUIRED. Do not infer geometry or count of screens from generated images.

## TP-003

ASSET ID: TP-003

TYPE: Blender / internal assembly

PAGE: Technology / Cabinets

SECTION: Exploded engineering view

PURPOSE: Named components move apart along assembly axes without invented internals

SOURCE REFERENCE: Verified engineering drawings/CAD required; legacy feature text alone insufficient

DIMENSIONS: Part dimensions and assembly constraints supplied by manufacturer

CAMERA: Locked 3/4 inspection position; no unrestricted orbit

LIGHTING: Baked AO plus one key/rim

MATERIALS: Actual metal/glass/control construction

LOOP REQUIREMENT: None

ALPHA REQUIREMENT: No

OUTPUT FORMAT: GLB named nodes + .blend; optional approved SVG diagrams

OPTIMIZATION TARGET: Additional geometry staged after hero; hidden internals never loaded initially

MOBILE VERSION REQUIRED: Yes: approved 2D assembly diagram with same annotations

NOTES: BLOCKED BY ASSET: TP-003. BLENDER ASSET REQUIRED. No fictional wiring or hidden hardware.

## TP-004

ASSET ID: TP-004

TYPE: Blender / environment + lighting

PAGE: Home entrance/floor

SECTION: Architectural reveal

PURPOSE: Premium industrial showroom; supports cabinet scale and negative space

SOURCE REFERENCE: Orion spatial staging; Lusion product-lighting reference; Tierplay model dimensions

DIMENSIONS: Room scale determined from approved cabinet; floor at0, model grounded

CAMERA: Entrance spline2–4s desktop, shorter mobile; predetermined floor and screen anchors

LIGHTING: Broad neutral soft source, darker architecture, baked indirect illumination

MATERIALS: Dark graphite floor with controlled rough reflection; restrained architectural metal

LOOP REQUIREMENT: No mandatory environmental loop

ALPHA REQUIREMENT: No

OUTPUT FORMAT: GLB room + baked lightmaps + environment HDR/EXR source and optimized derivative

OPTIMIZATION TARGET: Room+lighting ≤3MB compressed provisional; no real-time planar reflection on balanced

MOBILE VERSION REQUIRED: Yes: simplified geometry and baked floor lighting

NOTES: BLENDER ASSET REQUIRED. No neon tunnel, fictional casino floor or decorative particle field.

## TP-005

ASSET ID: TP-005

TYPE: Game media / edit existing video

PAGE: Cabinet screen; games; Player Journey

SECTION: Attract screen and authentic game presentation

PURPOSE: Use approved actual game capture; correct board/game mapping

SOURCE REFERENCE: Five recovered Sunscape MP4s; correct board pages and original game assets

DIMENSIONS: Native screen aspect from TP-001/002; 1080p master;720p delivery trial

CAMERA: Capture screen straight-on; no baked perspective inside display texture

LIGHTING: Actual game colors; no invented win state

MATERIALS: Digital screen content

LOOP REQUIREMENT: 6–10s quiet loop, continuous first/last frame, audio separate

ALPHA REQUIREMENT: No

OUTPUT FORMAT: H.264 MP4 + poster AVIF/WebP; optional WebM if justified

OPTIMIZATION TARGET: One active decode; target≤2MB clip; lazy after poster

MOBILE VERSION REQUIRED: Yes:720p or lower after device testing

NOTES: Match games per GAME-MATRIX; sixth board unidentified. Do not generate gameplay, jackpot outcomes or unverified features.

## TP-006

ASSET ID: TP-006

TYPE: Shader integration assets

PAGE: Prototype screen entry

SECTION: Glass-to-pixel crossing

PURPOSE: Validated display UVs, mask, normal and anchors; optional subtle noise texture

SOURCE REFERENCE: TP-001 ScreenDisplay / ScreenGlass

DIMENSIONS: UV0 unit square or documented curved mapping; screen-local transform

CAMERA: Dolly along display normal; scale from actual bounds

LIGHTING: Reflection fades near plane; RGB structure only during approach

MATERIALS: Glass IOR/roughness based on reference; emissive display

LOOP REQUIREMENT: Transition1.2–2.2s, reversible; not video

ALPHA REQUIREMENT: Mask if needed

OUTPUT FORMAT: Model anchor metadata JSON + shader + optional small KTX2

OPTIMIZATION TARGET: No permanent postprocessing chain; at most one bounded half-resolution intermediate if profiling requires

MOBILE VERSION REQUIRED: Yes: simplified shader/direct cut on low/reduced motion

NOTES: Shader may be coded at M03/04; asset prerequisite is true display geometry, not a guessed screen in a still.

## TP-007

ASSET ID: TP-007

TYPE: Image generation / product still

PAGE: Static/no-WebGL and boot

SECTION: Faithful fallback artwork

PURPOSE: Approved Altitude and Pinnacle front3/4, dark studio and alpha variants

SOURCE REFERENCE: Original model-specific photos or approved GLB renders only

DIMENSIONS: 3840×2160 master;2160×3840 portrait; derivative widths480/960/1600

CAMERA: 50mm equivalent;1.35m camera; complete base and correct proportions

LIGHTING: Soft key left, controlled rim right, soft grounded contact shadow

MATERIALS: Reference-confirmed material appearance, smoked glass and display surface

LOOP REQUIREMENT: None

ALPHA REQUIREMENT: Separate real-alpha variant required

OUTPUT FORMAT: PNG masters and optimized AVIF/WebP derivatives

OPTIMIZATION TARGET: Hero derivative target≤350KB at intended quality; no 4K mobile download

MOBILE VERSION REQUIRED: Yes: separately composed portrait

NOTES: IMAGEGEN BRIEF ONLY this turn. Preserve geometry, display count, button layout, base and branding position. Existing dragon images unapproved for this use.

## TP-008

ASSET ID: TP-008

TYPE: Image generation / game artwork enhancement

PAGE: Games catalogue/detail

SECTION: Higher-quality crops retaining game identity

PURPOSE: Enhance lighting/resolution only, keep character/symbol identities and titles

SOURCE REFERENCE: Correct source game asset mapped to approved board

DIMENSIONS: 2048 square/landscape masters; final display crops from layout

CAMERA: Original recognizable composition; restrained depth

LIGHTING: Color belongs to each real game, no blanket purple treatment

MATERIALS: Preserve illustration style unless explicit reimagining approved

LOOP REQUIREMENT: None

ALPHA REQUIREMENT: Only when compositing layer needed

OUTPUT FORMAT: PNG masters + AVIF/WebP derivative

OPTIMIZATION TARGET: ≤150KB catalogue thumbnails target; load visible rows only

MOBILE VERSION REQUIRED: Yes: portrait crops without cutting title/subject

NOTES: No new game names, symbols, mechanics or logos; identity review needed for generated work.

## TP-009

ASSET ID: TP-009

TYPE: Diagram / source product UI

PAGE: Products / TLJ / TCM

SECTION: Explain existing capabilities

PURPOSE: Approved topology and actual UI screenshots where needed

SOURCE REFERENCE: /products/; /player-journey/ source claims

DIMENSIONS: Vector logical network; no claim of real-time production status

CAMERA: Fixed isometric or flat DOM/SVG view

LIGHTING: Signals highlight one explained relationship

MATERIALS: Neutral line/shape system tied to design tokens

LOOP REQUIREMENT: Step-driven; motion only when explaining flow

ALPHA REQUIREMENT: SVG transparent

OUTPUT FORMAT: SVG + approved screenshot sources; cabinet LOD instances optional

OPTIMIZATION TARGET: DOM/SVG preferred; no duplicated model textures

MOBILE VERSION REQUIRED: Yes: vertical steps

NOTES: Need product-owner confirmation: per-location TLJ semantics and TCM operations. Illustrative jackpot value must be explicitly illustrative, not a live figure.

## TP-010

ASSET ID: TP-010

TYPE: Business content / documents / operational integration

PAGE: Contact, support, all footers/game detail

SECTION: Preserve conversion and legal/download functions

PURPOSE: Valid flyers, legal URLs, sales/support recipients, states, consent text

SOURCE REFERENCE: Legacy CTA/form matrix

DIMENSIONS: Accessible PDF flyer; HTML legal content; form field contract

CAMERA: Not applicable

LIGHTING: Not applicable

MATERIALS: Not applicable

LOOP REQUIREMENT: None

ALPHA REQUIREMENT: No

OUTPUT FORMAT: PDF + approved text/URL configuration; endpoint contract

OPTIMIZATION TARGET: Forms lightweight; PDFs lazy downloads

MOBILE VERSION REQUIRED: Yes: accessible form and PDF

NOTES: BLOCKED BY CONTENT/INTEGRATION: TP-010. No fake download/form-success or replacing form with mailto.

## TP-011

ASSET ID: TP-011

TYPE: Verified editorial/social proof

PAGE: Home testimonials/partners; news

SECTION: Real attribution and editorial continuity

PURPOSE: Approved quotes, permissions, identities; approved partner relationships only

SOURCE REFERENCE: Legacy placeholders are NOT valid testimonials

DIMENSIONS: Original portrait/logo files if supplied; text first

CAMERA: Natural portrait only if genuinely relevant

LIGHTING: Neutral; no invented person

MATERIALS: Not applicable

LOOP REQUIREMENT: None

ALPHA REQUIREMENT: Logo alpha if supplied

OUTPUT FORMAT: Approved copy/attribution + original images

OPTIMIZATION TARGET: No carousel or video needed

MOBILE VERSION REQUIRED: Yes

NOTES: Current testimonial placeholders explicitly deprecated. No partner list in recovered home. Preserve intent without fabrication.

## TP-012

ASSET ID: TP-012

TYPE: Audio production

PAGE: Optional showroom sound

SECTION: Quiet spatial feedback

PURPOSE: Low-level room tone, cabinet hum, focus tone, screen-entry cue

SOURCE REFERENCE: Approved recordings or licensed original composition

DIMENSIONS: 48kHz master, mono positional cue/stereo room bed

CAMERA: Not applicable

LIGHTING: Not applicable

MATERIALS: Sonic restrained machinery; no casino win sounds as decoration

LOOP REQUIREMENT: Room loop12–20s with seam-free zero crossings; one-shot cues≤1s

ALPHA REQUIREMENT: No

OUTPUT FORMAT: WAV masters; compressed Ogg/AAC delivery

OPTIMIZATION TARGET: Optional audio bundle≤500KB; fetch only on unmute

MOBILE VERSION REQUIRED: Yes; off by default

NOTES: AUDIO ASSET REQUIRED if sound is adopted; no autoplay, user control and hidden-tab suspend.

## TP-013

ASSET ID: TP-013

TYPE: Google Flow / cinematic video brief

PAGE: Optional secondary product media

SECTION: Pre-rendered approved product shot, not replacement for interactive cabinet

PURPOSE: Short lighting reveal around validated Altitude; lock exact geometry

SOURCE REFERENCE: Approved TP-001 studio render start/end frames

DIMENSIONS: 1920×1080 delivery;4K master only if needed

CAMERA: 50mm lens; slow8degree lateral arc at1.35m; camera path fixed

LIGHTING: Soft key left, warm-neutral rim; no strobing

MATERIALS: Reference-accurate matte shell/glass/metal

LOOP REQUIREMENT: 6s24fps; loop only if identical pose/light at first and last frame

ALPHA REQUIREMENT: No

OUTPUT FORMAT: MP4/WebM + poster + master

OPTIMIZATION TARGET: ≤3MB clip target; entirely lazy, never boot-critical

MOBILE VERSION REQUIRED: Yes:portrait-safe shot or still

NOTES: VIDEO BRIEF ONLY; no generation requested this turn. Negative: no distorted buttons, logos, extra screens, fictional gameplay, zoom pulse, glitch, morphing machinery. Start/end frames must be approved render, color neutral graphite/warm white.
