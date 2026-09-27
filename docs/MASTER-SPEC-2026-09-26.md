# TIERPLAY V2
## MASTER BUILD / CREATIVE DIRECTION / ENGINEERING SPECIFICATION

You are not being asked to “design a gaming website.”

You are being asked to rebuild the existing TierPlay website into a production-grade, award-level interactive digital experience while preserving the existing business content, products, pages, information architecture, features, and conversion goals.

The existing website is the **content and product source of truth**.

REFERENCE / LEGACY WEBSITE:

https://electronhubs.com/

Do not reinterpret TierPlay's business.

Do not invent new products.

Do not remove existing functionality.

Do not arbitrarily rearrange the complete information architecture.

Do not replace factual product information with marketing hallucinations.

The redesign concerns:

- art direction
- visual hierarchy
- typography
- layout
- motion
- WebGL
- Three.js
- transitions
- responsive interaction
- asset quality
- storytelling
- navigation experience
- product presentation
- game presentation
- engineering quality

The final result should feel closer to an **interactive digital product experience / game world / premium technology showroom** than a traditional casino website.

---

# 0. PRIMARY OBJECTIVE

Transform TierPlay from a conventional gaming-industry website into an immersive digital universe where the company's real gaming machines, products, software systems and games become part of an interactive environment.

The user should feel like they are entering:

> THE TIERPLAY GAMING SYSTEM

rather than browsing:

> A CASINO COMPANY WEBSITE

The creative intersection is:

AAA GAME MENU  
×  
PREMIUM INDUSTRIAL PRODUCT LAUNCH  
×  
AWARD-WINNING WEBGL EXPERIENCE  
×  
INTERACTIVE CASINO TECHNOLOGY SHOWROOM  
×  
HIGH-END EDITORIAL WEBSITE

Do not build another:

- neon casino landing page
- purple-gradient website
- glassmorphism dashboard
- generic Web3 website
- template gaming site
- glowing card collection
- animated-particle homepage

---

# 1. SOURCE-OF-TRUTH RULE

The existing Electron Hubs / TierPlay website determines:

- available pages
- page purpose
- existing product names
- existing machine names
- existing games
- existing service descriptions
- technical specifications
- operator messaging
- distributor messaging
- contact/conversion requirements
- company facts
- navigation architecture

Before redesigning ANYTHING, perform a complete forensic extraction.

Create:

```text
/docs/audit/
    CONTENT-INVENTORY.md
    ROUTE-MAP.md
    PAGE-SEQUENCE.md
    PRODUCT-MATRIX.md
    GAME-MATRIX.md
    CABINET-MATRIX.md
    FEATURE-MATRIX.md
    EXISTING-CTA-MATRIX.md
    EXISTING-ASSET-INVENTORY.md
    EXISTING-SEO-INVENTORY.md
```

Every legacy section must receive one of these statuses:

```text
PRESERVED
REDESIGNED
MERGED
RELOCATED
DEPRECATED-WITH-REASON
```

Do not silently remove anything.

---

# 2. REFERENCE PHILOSOPHY

Do not create the design from vague concepts such as:

“futuristic”
“premium”
“modern”
“immersive”
“WebGL”
“cinematic”

Every important visual system must have a concrete reference.

Use these references for SPECIFIC purposes.

## CYBER CITY ORION

Use for:

- world architecture
- arcade-world feeling
- cabinet placement
- environmental discovery
- spatial navigation concepts
- lighting hierarchy
- depth and atmosphere

DO NOT copy its cyberpunk aesthetic literally.

TierPlay should feel more premium, controlled and industrial.

---

## BRUNO SIMON

Use for:

- environment-as-navigation philosophy
- meaningful interactive objects
- physical spatial relationship between content
- playful interaction
- cohesive world rather than disconnected sections

Do not reproduce the toy-car aesthetic.

---

## LUSION

Use as the quality benchmark for:

- rendering polish
- material quality
- lighting
- transitions
- shader sophistication
- procedural motion
- subtle interaction
- GPU effects
- WebGL restraint

If the scene looks like a Three.js tutorial rather than a Lusion-level production experience, it is not acceptable.

---

## ACTIVE THEORY

Use for:

- scene transitions
- camera transitions
- experimentation
- WebGL-to-DOM transitions
- interactive storytelling
- nonlinear visual composition
- highly polished micro-interaction

---

## BLUE TOWER GAMES

Use for:

- game content hierarchy
- featured game presentation
- game showcase structure
- product-first visual storytelling
- roadmap/content presentation

Do not copy its whole design system.

---

## LITTLE WORKSHOP

Use for:

- browser-as-game mentality
- WebGL performance awareness
- environmental interaction
- responsive immersive experiences

---

# 3. REFERENCE IMPLEMENTATION RULE

Create:

```text
/docs/design/REFERENCE-MAP.md
```

For EVERY major section document:

```text
SECTION:
REFERENCE:
REFERENCE URL:
SPECIFIC INTERACTION BEING STUDIED:
SPECIFIC CAMERA BEHAVIOR:
SPECIFIC TYPOGRAPHIC BEHAVIOR:
SPECIFIC TRANSITION:
WHAT WE ARE ADAPTING:
WHAT WE ARE NOT COPYING:
TIERPLAY INTERPRETATION:
TECHNICAL IMPLEMENTATION:
MOBILE INTERPRETATION:
PERFORMANCE COST:
```

Never say:

> inspired by award-winning sites.

That is useless.

Say:

> Reference X uses a pinned camera while the object translates along Z and the interface crossfades from world-space labels into HTML. TierPlay will use that interaction for Pinnacle cabinet inspection.

That level of specificity is required.

---

# 4. ABSOLUTE DESIGN RULE

DO NOT GENERATE THE COMPLETE WEBSITE IN ONE PASS.

Development must proceed through quality gates.

The homepage is not approved until the initial WebGL experience meets the visual quality bar.

The first prototype must contain ONLY:

```text
BOOT
↓
ENTRANCE
↓
GAMING FLOOR REVEAL
↓
ONE CABINET
↓
CABINET HOVER
↓
CABINET SCREEN INTERACTION
↓
CAMERA PUSH INTO SCREEN
↓
TRANSITION OUT
```

Nothing else.

If this experience is mediocre, fix it before building another section.

---

# 5. PRIMARY EXPERIENCE

The homepage begins as an interactive world.

Core sequence:

```text
BOOT / LOADING SEQUENCE

        ↓

CINEMATIC ENTRANCE

        ↓

TIERPLAY GAMING FLOOR

        ↓

USER ADVANCES THROUGH WORLD

        ↓

REAL TIERPLAY CABINETS EXIST IN 3D

        ↓

CABINET PROXIMITY / HOVER

        ↓

CABINET BECOMES ACTIVE

        ↓

GAME SCREEN ANIMATES

        ↓

CAMERA DOLLIES TOWARD DISPLAY

        ↓

USER SELECTS GAME / PRODUCT

        ↓

CAMERA ENTERS DISPLAY

        ↓

DISPLAY PIXELS / GLASS / SHADER TRANSITION

        ↓

NEXT EXPERIENCE
```

---

# 6. BOOT EXPERIENCE

Do not use:

```text
LOADING 32%
LOADING 58%
LOADING 91%
```

unless those values reflect genuine resource loading.

Create a restrained system boot sequence.

Possible language:

```text
TIERPLAY
SYSTEM INITIALIZATION

CABINET NETWORK ........ ONLINE
ALTITUDE ................ READY
PINNACLE ................ READY
LINK JACKPOT ............ CONNECTED
REMOTE CONTROL .......... ACTIVE

ENTER TIERPLAY
```

No Matrix cliché.

No excessive terminal text.

No fake hacking animation.

Visual language should be elegant and engineered.

The loader should reflect real asset loading from the AssetManager.

Important assets load first.

Secondary assets can stream after entrance.

---

# 7. CINEMATIC ENTRANCE

The user enters through a short architectural transition.

Do not make a generic neon tunnel.

The environment should suggest:

- premium casino technology laboratory
- architectural showroom
- hidden machinery space
- backstage infrastructure
- futuristic gaming environment

Possible visual details:

- cabinet silhouettes
- display reflections
- TierPlay iconography
- typography fragments
- hardware schematics
- wiring/data paths
- game artwork glimpses
- jackpot digits
- environmental screens

Camera movement must be authored.

DO NOT attach camera position directly to scrollY.

Create a dedicated CameraDirector.

Use splines / curve-based motion.

Camera easing should be physically believable.

---

# 8. MAIN GAMING FLOOR

This is the central visual reveal.

Art direction:

```text
premium
architectural
dark
controlled
cinematic
industrial
high contrast
luxury
technological
gaming-driven
```

Avoid:

```text
cheap Vegas aesthetic
random neon strips
purple cyberpunk
floating coins
slot symbols flying around
roulette wheels as decoration
NFT/Web3 aesthetics
```

Concept:

> Apple industrial showroom meets premium gaming arcade.

The real TierPlay machines are the heroes.

The environment exists only to make them feel valuable.

---

# 9. CABINET PRODUCT MODELS

Primary cabinet models must eventually be real production GLBs.

Machines include:

```text
ALTITUDE
PINNACLE
```

Do not fake them using stacked boxes and emissive rectangles.

If high-quality 3D models do not exist, flag:

```text
BLENDER ASSET REQUIRED
```

and create an asset brief.

Cabinet GLB requirements:

- realistic proportions
- separated screen mesh
- separated glass
- buttons
- lighting
- payment interfaces
- speakers
- cabinet body
- stand/base
- correct PBR materials
- UV mapped
- baked AO where appropriate
- mesh naming conventions
- screen material replaceable dynamically
- LOD0
- LOD1
- LOD2
- optimized geometry
- compressed textures
- Meshopt/Draco where appropriate

Example hierarchy:

```text
Altitude
├── Body
├── Trim
├── ScreenGlass
├── ScreenDisplay
├── Controls
├── Buttons
├── Validator
├── Speakers
├── Lighting
├── Base
└── InternalDetails
```

---

# 10. CABINET INTERACTION MODEL

IDLE STATE:

- low ambient display intensity
- subtle attract-mode animation
- very minor environmental motion
- no unnecessary rotation

PROXIMITY STATE:

- cabinet brightness increases
- surrounding lighting subtly decreases
- cabinet screen animation intensifies
- sound becomes slightly more present
- floor reflection strengthens

FOCUS STATE:

- camera shifts 5–15 cm depending on viewport
- depth of field may change very subtly
- title appears
- metadata appears
- cabinet reaches full emissive intensity

SELECT STATE:

- environment recedes
- camera moves toward screen
- game becomes dominant
- screen transition begins

Never aggressively scale the cabinet on hover.

Avoid gimmicky wobble.

---

# 11. CABINET SCREEN SYSTEM

The screen must be its own dynamic render surface.

Possible sources:

- video textures
- image sequences
- shaders
- CanvasTexture
- WebGL sub-scenes
- game poster animation

Create:

```text
CabinetScreenMaterial
GameMediaController
ScreenTransitionMaterial
ScreenMediaManager
```

The machine remains one 3D asset.

Game content is interchangeable.

---

# 12. CAMERA ENTERS SCREEN

This interaction must be exceptional.

Sequence:

```text
cabinet selected

camera begins forward dolly

field of view subtly changes

glass becomes increasingly apparent

subtle screen reflections disappear

RGB / pixel grid begins resolving

camera crosses screen plane

pixels expand to fill viewport

pixel matrix transforms into transition shader

destination experience emerges
```

Do not simply fade to black.

Possible shader ingredients:

- chromatic displacement
- RGB separation
- scan structure
- pixel grid
- slight bloom
- distortion
- screen-space UV transition

Keep it elegant.

Not VHS.

Not glitch spam.

---

# 13. HOMEPAGE CONTENT ARCHITECTURE

The original homepage sequence and business meaning should remain recognisable.

Target redesign sequence:

```text
01 BOOT

02 CINEMATIC ENTRY

03 MAIN GAMING FLOOR

04 FEATURED / NEW GAMES

05 ABOUT TIERPLAY

06 TECHNOLOGY / SYSTEM CAPABILITIES

07 LINK JACKPOT VISUALIZATION

08 CABINET SHOWCASE

09 PRODUCTS / OPERATOR TECHNOLOGY

10 PLAYER JOURNEY

11 TESTIMONIAL / SOCIAL PROOF

12 PARTNERS / DISTRIBUTION

13 OPERATOR / DISTRIBUTOR CTA

14 FOOTER
```

If the existing source site's exact content sequence differs, document the differences before changing it.

---

# 14. FEATURED GAMES

Do not display games as standard cards unless required as a secondary/fallback layout.

Desktop primary experience:

```text
pinned horizontal gallery

ONE primary cabinet

secondary cabinets partially visible

scroll changes active game

cabinet display changes

game title changes

ambient environment changes slightly

lighting adopts restrained tones from game artwork
```

Game artwork should feel integrated into the machine.

Use HTML for metadata.

Keep important text crawlable.

Possible composition:

```text
GAME CATEGORY

          [ 3D CABINET ]

         GAME TITLE

short description

PLAY / EXPLORE
```

---

# 15. ABOUT SECTION TRANSITION

After the gaming floor, visually decompress.

Suggested sequence:

```text
physical environment
↓
geometry fragments
↓
wireframe state
↓
technical grid
↓
editorial DOM layout
```

This creates contrast.

Not every section should be full 3D.

Award-level design requires restraint.

---

# 16. TECHNOLOGY / CABINET ENGINEERING SECTION

Use an exploded-view experience.

Cabinet begins assembled.

Scroll progression:

```text
0%
assembled cabinet

20%
screen assembly separates

35%
glass and trim separate

50%
control interface separates

65%
validator / hardware separates

80%
lighting/system components revealed

100%
technical system map visible
```

Annotations appear using hybrid WebGL + HTML.

Technical copy comes ONLY from verified existing TierPlay content.

No invented capabilities.

---

# 17. LINK JACKPOT VISUALIZATION

Create a real explanatory visual.

Example:

```text
8 cabinet instances

          ↑
          |
    JACKPOT NODE
      / / | \ \
     / /  |  \ \
 CAB CAB CAB CAB
 CAB CAB CAB CAB
```

Use instanced meshes.

Visualize machines contributing to a shared jackpot.

Animated energy/data pathways should communicate functionality.

Not decorative network lines.

Interaction:

scroll → machines initialize → network forms → jackpot value activates → explanation resolves.

---

# 18. CABINET SHOWCASE

Altitude and Pinnacle should receive automotive-grade product treatment.

Example:

```text
ALTITUDE
```

machine rotates only when composition calls for it.

Lighting sweeps reveal form.

Camera orbit is authored, not free uncontrolled OrbitControls.

Then:

```text
PINNACLE
```

transition using lateral camera travel / darkness / light reveal.

Do not implement a generic 360-degree product viewer unless explicitly useful.

---

# 19. PLAYER JOURNEY

The existing Player Journey page/section should become an actual journey.

Potential model:

```text
DISCOVER
↓
PLAY
↓
ENGAGE
↓
REWARD
↓
RETURN
```

Visualise progression through spatial scenes or timeline interactions.

Do not invent stages inconsistent with existing content.

Use existing source text.

---

# 20. TESTIMONIALS

Do not make:

- glass cards
- auto-rotating carousel
- generic quote slider

Use editorial typography.

Large quotation.

Subtle motion.

Strong whitespace.

Company/person attribution.

Never invent testimonials.

---

# 21. FINAL CTA

The ending should feel intentional.

Possible concept:

a cabinet remains alone in a dark environment.

Screen reads:

```text
BRING TIERPLAY
TO YOUR FLOOR
```

camera settles.

WebGL lighting fades into DOM interface.

Operator/distributor form appears.

Use real HTML.

Accessibility and conversion matter more than spectacle here.

---

# 22. SECONDARY PAGE STRATEGY

Do not recreate the homepage's cinematic intensity on every route.

## HOME

Maximum WebGL.

Flagship storytelling.

---

## GAMES

Primary structure:

- game catalogue
- category filters
- rich media
- selected cabinet visualization
- selective WebGL
- high-performance DOM catalogue

Must remain usable with large game counts.

---

## CABINETS

Premium 3D product showcase.

Altitude.

Pinnacle.

Technical specifications.

Exploded views.

Features.

Gallery.

---

## PRODUCTS

More editorial.

Use:

- diagrams
- system maps
- network visualisations
- interactive architecture
- selective WebGL

---

## PLAYER JOURNEY

Scroll narrative.

Interactive storytelling.

---

## UP TO DATE / NEWS

Primarily editorial.

Do not WebGL-ify news articles.

Optimize readability.

---

## CONTACT

Fast.

Accessible.

Simple.

No heavy GPU scene required.

---

# 23. DESIGN SYSTEM

Do not start implementing individual pages before establishing a design system.

Create:

```text
/docs/design/
    DESIGN-SYSTEM.md
    TYPE-SYSTEM.md
    COLOR-SYSTEM.md
    MOTION-SYSTEM.md
    SPACING-SYSTEM.md
    GRID-SYSTEM.md
    INTERACTION-SYSTEM.md
    RESPONSIVE-SYSTEM.md
```

---

# 24. TYPOGRAPHY

Typography must carry enormous visual weight.

Use:

- display typography for major statements
- restrained body typography
- condensed/technical treatment only where appropriate
- strong numerical typography for statistics
- monospaced typography sparingly for technical/system information

Avoid turning everything into sci-fi fonts.

---

# 25. COMPONENT LIBRARY POLICY

Before manually building a common UI interaction, check available component ecosystems.

Potential sources include:

- 21st.dev
- React Bits
- Motion Primitives
- Motion
- Magic UI
- Aceternity
- shadcn ecosystem
- transitions.dev
- useLayouts
- existing internal skills/resources
- Libraries.dev resources where relevant

BUT:

These are implementation primitives.

They MUST NOT define the website's identity.

Never assemble the site by stacking flashy community components.

For each imported pattern ask:

```text
Does this solve an interaction problem?

Does this support TierPlay's art direction?

Could a custom implementation be substantially better?

What is its performance cost?

Does it behave well on mobile?

Does it degrade accessibly?
```

---

# 26. MOTION ARCHITECTURE

Build a coherent motion language.

Motion categories:

```text
MICRO
150–300 ms

UI
250–500 ms

SECTION TRANSITIONS
500–1200 ms

CAMERA
800–3000 ms

CINEMATIC
2–8 seconds
```

Avoid using one duration for everything.

Motion characteristics:

- physical
- weighted
- deliberate
- smooth
- restrained
- high confidence

Do not overuse elastic/bouncy animation.

---

# 27. SCROLL SYSTEM

Use smooth scrolling carefully.

Recommended:

Lenis

GSAP ScrollTrigger where timeline control is required.

Do not make every animation depend directly on raw scroll percentage.

Create semantic scene phases.

Example:

```text
INTRO
ENTRY
FLOOR_REVEAL
GAME_DISCOVERY
CABINET_FOCUS
TRANSITION
ABOUT
TECH
LINK_JACKPOT
CABINET_SHOWCASE
FINAL_CTA
```

State transitions should be deterministic.

---

# 28. ARCHITECTURE

Recommended stack:

```text
Next.js
React
TypeScript

Three.js
React Three Fiber
Drei

GSAP
ScrollTrigger

Lenis

Motion

React Three Postprocessing

Zustand
```

Use additional libraries only when justified.

Do not install packages merely because they exist.

---

# 29. WEBGL SYSTEM ARCHITECTURE

Create a clean runtime architecture.

Suggested:

```text
src/
├── experience/
│   ├── ExperienceCanvas.tsx
│   ├── Experience.tsx
│
├── camera/
│   ├── CameraDirector.ts
│   ├── CameraRig.tsx
│   ├── CameraPath.ts
│
├── scenes/
│   ├── BootScene/
│   ├── EntranceScene/
│   ├── GamingFloorScene/
│   ├── CabinetScene/
│   ├── TechnologyScene/
│   └── JackpotScene/
│
├── entities/
│   ├── Cabinet/
│   ├── GameScreen/
│   ├── Environment/
│   └── Lighting/
│
├── directors/
│   ├── SceneDirector.ts
│   ├── LightingDirector.ts
│   ├── AudioDirector.ts
│   ├── TransitionDirector.ts
│   └── InteractionDirector.ts
│
├── shaders/
│
├── effects/
│
├── assets/
│
├── performance/
│   ├── PerformanceManager.ts
│   ├── DeviceProfiler.ts
│   └── QualityManager.ts
│
└── state/
```

Do not put the entire WebGL world into:

```text
HeroCanvas.tsx
```

with 4,000 lines.

---

# 30. SCENE DIRECTOR

The SceneDirector controls which visual systems are active.

Example:

```text
BOOT
ENTRANCE
FLOOR
CABINET_FOCUS
GAME_TRANSITION
ABOUT
TECHNOLOGY
JACKPOT
CABINET_SHOWCASE
EXIT
```

Only necessary objects should update.

Do not execute every useFrame callback continuously.

---

# 31. CAMERA DIRECTOR

The CameraDirector owns:

- position
- target
- FOV
- roll
- depth focus
- transitions
- splines
- scroll mapping

Components do not independently fight for camera control.

NO:

```text
section A modifies camera.position.z
section B modifies camera.position.x
section C modifies camera.rotation
```

Centralize camera authority.

---

# 32. LIGHTING DIRECTOR

Lighting must adapt to scene state.

Examples:

```text
FLOOR_IDLE
GAME_FOCUS
CABINET_ALTITUDE
CABINET_PINNACLE
TECH_VIEW
JACKPOT
```

Do not create twenty runtime lights.

Prefer:

- baked lighting where appropriate
- environment maps
- optimized dynamic lights
- emissive materials
- lightmaps
- selective real-time effects

---

# 33. AUDIO

Audio should be optional.

Never autoplay aggressive sound.

Potential layers:

```text
ambient room
cabinet hum
screen attract audio
button tone
environmental transition
jackpot network
```

Provide obvious mute control.

Respect user preferences.

---

# 34. ASSET PIPELINE

No production page is allowed to silently substitute missing media.

When an asset is missing, create:

```text
/docs/assets/ASSET-REQUESTS.md
```

Format:

```text
ASSET ID:
TYPE:
PAGE:
SECTION:
PURPOSE:
SOURCE REFERENCE:
DESCRIPTION:
DIMENSIONS:
CAMERA:
LIGHTING:
MATERIALS:
LOOP REQUIREMENT:
ALPHA REQUIREMENT:
OUTPUT FORMAT:
OPTIMIZATION TARGET:
MOBILE VERSION REQUIRED:
NOTES:
```

---

# 35. ASSET TYPES

If a section requires an IMAGE:

Create an image generation brief.

Do not substitute gradient rectangles.

---

If a section requires VIDEO:

Create a Google Flow generation brief.

Include:

```text
shot
lens
camera movement
subject
lighting
duration
framerate
composition
loop behavior
start frame
end frame
color treatment
negative requirements
```

Then create the integration point.

Do not fake video with CSS.

---

If a section requires 3D:

Create a Blender production brief.

Do not substitute primitives unless explicitly approved as prototype geometry.

---

# 36. OLD MEDIA REIMAGINING

Existing TierPlay imagery may be used as reference material.

The new media must preserve:

- product identity
- proportions
- recognizable cabinet design
- real product features

You may improve:

- lighting
- camera
- framing
- environment
- resolution
- background
- realism
- texture quality
- motion
- shadows
- reflections

Do not invent functionality.

---

# 37. IMAGE GENERATION STANDARD

Prompts must be production-oriented.

Do not say:

> futuristic casino machine, highly detailed, 8K.

Instead specify:

```text
PRODUCT
Altitude TierPlay cabinet based strictly on reference imagery

CAMERA
50mm equivalent
front 3/4 angle
camera height 1.35m

LIGHTING
large soft key camera-left
controlled rim camera-right
subtle overhead strip reflection

MATERIAL
powder-coated black metal
brushed dark aluminium
smoked glass
gloss display surface

BACKGROUND
minimal premium studio environment

SHADOW
soft grounded contact shadow

OUTPUT
transparent background variant
dark studio variant
4K

DO NOT CHANGE
cabinet geometry
display count
button layout
base proportions
branding position
```

That level of instruction is mandatory.

---

# 38. PERFORMANCE IS A FEATURE

Performance is not something to fix at the end.

Set budgets.

Desktop target:

```text
60 FPS on capable hardware
```

Mid-range mobile target:

```text
30–60 FPS depending on quality tier
```

Avoid blocking first content render.

---

# 39. ASSET BUDGETS

Initial experience should not download 100 MB.

Create staged loading.

Example:

```text
BOOT ESSENTIALS
< 2 MB preferred

INITIAL 3D EXPERIENCE
target < 8–12 MB compressed

SECONDARY ASSETS
stream after entry

HEAVY VIDEO
lazy load

UNSEEN PAGE ASSETS
never preload unnecessarily
```

These are targets, not permission to degrade quality blindly.

---

# 40. MODEL OPTIMIZATION

Use:

- Meshopt
- Draco where beneficial
- KTX2/Basis
- texture atlases where appropriate
- reduced overdraw
- instancing
- LOD
- geometry reuse
- material reuse

Measure before and after optimization.

---

# 41. GPU QUALITY TIERS

Create capability tiers.

Example:

```text
ULTRA
HIGH
BALANCED
LOW
STATIC
```

Determine using:

- device type
- GPU renderer where available
- DPR
- memory indicators
- performance sampling

Do not use only viewport width.

---

# 42. QUALITY TIER EXAMPLE

ULTRA:

- full reflections where viable
- premium postprocessing
- higher texture resolution
- volumetrics
- enhanced particles
- high DPR cap

HIGH:

- reduced volumetric quality
- normal postprocessing
- medium/high textures

BALANCED:

- fewer effects
- reduced DPR
- reduced light complexity

LOW:

- minimal postprocessing
- LOD assets
- reduced texture resolution
- reduced shadow resolution

STATIC:

- no WebGL-critical dependency
- static/composited media
- full website functionality remains

---

# 43. MOBILE IS NOT DESKTOP SHRUNK

Create a separate mobile interaction plan.

Desktop may use:

- deep camera movement
- complex world composition
- hover
- large object staging

Mobile should use:

- touch
- shorter camera distances
- fewer simultaneous objects
- stronger typography
- vertical staging
- simplified effects
- reduced particle counts
- reduced reflections
- touch-focused CTAs

Do not destroy the visual idea.

Simplify its execution.

---

# 44. RESPONSIVE BREAKPOINT THINKING

Do not design only:

```text
desktop
tablet
mobile
```

Consider:

```text
large ultrawide
standard desktop
small laptop
landscape tablet
portrait tablet
large mobile
small mobile
```

Test composition at each.

---

# 45. HOVER FALLBACK

Anything requiring hover must have touch equivalent.

Example:

Desktop:

```text
hover cabinet
→ cabinet focus
```

Mobile:

```text
tap cabinet
→ cabinet focus

tap CTA
→ enter
```

---

# 46. ACCESSIBILITY

The immersive experience must not break accessibility.

Provide:

- semantic HTML
- keyboard navigation
- focus states
- accessible navigation
- screen-reader content
- reduced-motion mode
- sufficient contrast
- text alternatives
- functional no-WebGL mode

WebGL is enhancement, not the information layer.

---

# 47. REDUCED MOTION

When:

```css
prefers-reduced-motion: reduce
```

do not merely speed animations up.

Replace:

- long camera movement
- parallax
- large transforms

with:

- cuts
- short fades
- static product views

---

# 48. SEO

Critical content stays in HTML.

Do not place:

- product name
- game name
- specifications
- company description
- CTAs

only inside Canvas.

Use WebGL as presentation.

Use DOM as semantic content.

---

# 49. NAVIGATION

Navigation should feel part of the system.

Potential desktop states:

```text
MINIMAL
EXPANDED
WORLD MODE
CONTENT MODE
```

During cinematic entrance, nav can remain reduced.

After arrival, main navigation becomes available.

Navigation must always remain understandable.

Do not sacrifice usability for experimentation.

---

# 50. TRANSITIONS BETWEEN ROUTES

Route changes should feel authored.

Potential transition vocabulary:

```text
cabinet screen entry
lighting blackout
mask transition
object wipe
shader dissolve
camera portal
```

Do not use the same transition for every page.

Do not delay route changes unnecessarily.

---

# 51. ERROR HANDLING

WebGL can fail.

Plan for:

```text
context lost
shader compile error
asset load failure
video load failure
unsupported WebGL
device memory pressure
```

Provide graceful fallback.

No blank black canvas.

---

# 52. CODE QUALITY

Required:

```text
TypeScript strict mode
ESLint
Prettier
component boundaries
typed data
typed scene states
documented shaders
no giant components
no dead dependencies
no mysterious magic numbers
```

Animation constants should be centralized.

Example:

```text
motion.config.ts
scene.config.ts
camera.config.ts
performance.config.ts
```

---

# 53. CONTENT DATA

Game/product content should be data-driven.

Example:

```text
data/
    games.ts
    cabinets.ts
    products.ts
    navigation.ts
```

Do not hardcode repeated content into components.

---

# 54. CMS READINESS

Even if no CMS is introduced immediately, structure game/news/product data so migration is straightforward.

Do not couple content to animation code.

---

# 55. VISUAL QA

Every major section must pass these questions.

## COMPOSITION

Does it look intentionally art-directed?

## HIERARCHY

Is the user's eye going to the intended subject?

## DEPTH

Does 3D genuinely improve the presentation?

## ORIGINALITY

Does this resemble a generic AI website?

If yes: redesign.

## MOTION

Does movement have purpose?

## RESTRAINT

Could an effect be removed while improving the result?

## PERFORMANCE

Is the effect worth its GPU cost?

---

# 56. AI DESIGN ANTI-PATTERNS — FORBIDDEN

Do not use these unless there is an exceptional reason:

- glowing orb behind heading
- gradient blobs
- random particles
- excessive glassmorphism
- rounded rectangle on rounded rectangle
- every section inside a card
- Bento grid because it is trendy
- generic purple/blue gradients
- endless marquees
- sparkles
- rotating logo clouds
- random text scramble
- cursor glow
- blob cursor
- random magnetic interactions
- fake terminal UI
- excessive blur
- generic three-card feature section
- floating 3D shapes
- giant meaningless spheres

TierPlay must look authored, not AI-generated.

---

# 57. COPY RULE

Do not rewrite factual content merely to sound cooler.

Separate:

```text
FACTUAL COPY
MARKETING COPY
MICROCOPY
SYSTEM COPY
```

Factual copy must remain accurate.

Marketing copy can be refined.

Do not invent awards, statistics, partners, customer claims or product capabilities.

---

# 58. PROTOTYPE QUALITY GATE

Before implementing the full website, produce:

```text
PROTOTYPE-01
Boot
Entrance
Gaming floor
Altitude cabinet
Cabinet hover
Screen animation
Camera screen transition
```

Acceptance criteria:

### VISUAL

The experience cannot resemble:

- Three.js example page
- Sketchfab viewer
- WebGL tutorial
- template scene

### CAMERA

No awkward scroll mapping.

No snapping.

No nausea-inducing motion.

### MATERIAL

Cabinet looks physically grounded.

### LIGHTING

Lighting feels intentional.

### TRANSITION

Entering screen feels seamless.

### PERFORMANCE

Stable frame rate.

### MOBILE

Meaningful reduced version works.

Until this passes, do not continue.

---

# 59. MILESTONE STRUCTURE

## MILESTONE 00 — AUDIT

Deliver:

```text
CONTENT-INVENTORY.md
ROUTES.md
FEATURE-MATRIX.md
ASSET-INVENTORY.md
SEO-INVENTORY.md
```

NO redesign.

---

## MILESTONE 01 — REFERENCES

Deliver:

```text
REFERENCE-MAP.md
VISUAL-DIRECTION.md
MOTION-DIRECTION.md
```

Each proposed section gets an explicit visual reference.

NO production implementation.

---

## MILESTONE 02 — DESIGN SYSTEM

Deliver:

- fonts
- colors
- layout
- buttons
- navigation
- typography
- motion tokens
- interaction tokens
- responsive system

Implement small isolated prototypes.

---

## MILESTONE 03 — WEBGL FOUNDATION

Build:

```text
ExperienceCanvas
SceneDirector
CameraDirector
LightingDirector
PerformanceManager
AssetManager
TransitionDirector
```

No full homepage.

---

## MILESTONE 04 — FLAGSHIP PROTOTYPE

Build:

```text
Boot
Entrance
Gaming Floor
Altitude
Focus
Screen Entry
```

QUALITY GATE.

---

## MILESTONE 05 — ASSET PRODUCTION

Finalize:

```text
Altitude GLB
Pinnacle GLB
environment
game media
textures
audio
HDRIs
```

Generate asset briefs for anything unavailable.

---

## MILESTONE 06 — HOMEPAGE

Build remaining homepage sequence using the approved visual language.

---

## MILESTONE 07 — GAMES

Build game catalogue + interactive showcase.

---

## MILESTONE 08 — CABINETS

Build premium 3D cabinet product pages.

---

## MILESTONE 09 — PRODUCTS

Build system diagrams and technical storytelling.

---

## MILESTONE 10 — PLAYER JOURNEY

Build narrative system.

---

## MILESTONE 11 — NEWS / CONTENT

Build fast editorial pages.

---

## MILESTONE 12 — PRODUCTION HARDENING

Run:

- device QA
- accessibility QA
- SEO
- Lighthouse
- GPU profiling
- memory profiling
- Core Web Vitals
- WebGL context testing
- form testing
- browser testing

---

# 60. BROWSER TEST MATRIX

Mandatory:

```text
Chrome macOS
Chrome Windows
Safari macOS
Safari iPhone
Chrome Android
Edge Windows
Firefox desktop
```

Also test:

- integrated Intel graphics
- Apple Silicon
- mid-range Android
- high-DPR displays
- low-power mode

---

# 61. PERFORMANCE PROFILING

Measure:

- draw calls
- triangles
- texture memory
- JS heap
- GPU timing where possible
- FPS
- long tasks
- CLS
- LCP
- INP
- total transfer size

Do not claim optimization without measurements.

---

# 62. ASSET LOADING

Create logical bundles:

```text
critical
hero
gaming-floor
cabinet-altitude
cabinet-pinnacle
game-media
technology
secondary-pages
```

Do not load all products at launch.

---

# 63. WORLD-TO-DOM TRANSITIONS

Use hybrid composition.

Example:

3D cabinet remains fixed.

HTML typography aligns next to it.

During scroll:

cabinet transitions away.

DOM takes over.

This allows premium visuals without sacrificing accessibility.

---

# 64. 3D TEXT

Do not make every heading geometry.

Prefer DOM typography.

Use actual 3D typography only when spatial integration makes it meaningful.

---

# 65. POSTPROCESSING

Possible:

- bloom
- vignette
- color grading
- subtle depth of field
- chromatic aberration
- noise

BUT:

Use extremely carefully.

Avoid “UnrealBloomPass everywhere.”

Selective bloom preferred.

Chromatic aberration should be near-imperceptible except during specific transitions.

---

# 66. PARTICLES

Particles require narrative purpose.

Good:

- screen transition
- data visualization
- jackpot network
- environment atmosphere

Bad:

- random homepage dust because it looks cool.

---

# 67. SHADERS

Use shaders where they provide unique visual value:

- cabinet screen
- screen-entry transition
- jackpot data flow
- environmental dissolve
- wireframe transition
- surface reveal

Document custom GLSL.

Do not create shaders merely to demonstrate technical sophistication.

---

# 68. 3D PHYSICS

Do not introduce physics unless an interaction genuinely needs it.

This project does not require a physics engine merely because it is game-like.

---

# 69. ORBITCONTROLS

Do not use unrestricted OrbitControls for hero scenes.

The camera is art-directed.

Orbit controls may be allowed in an explicit product inspection mode.

---

# 70. USER CONTROL

The experience must never feel like an unskippable movie.

Allow:

- scroll progression
- clear navigation
- skip/continue where appropriate
- quick route access

Cinematics support interaction.

They do not block it.

---

# 71. BRAND POSITIONING

TierPlay should communicate:

```text
WE BUILD GAMING SYSTEMS
WE ENGINEER CABINETS
WE BUILD GAMES
WE CONNECT MACHINES
WE BUILD PLAYER SYSTEMS
WE SUPPORT OPERATORS
```

Not:

```text
COME GAMBLE HERE
```

TierPlay is the technology/product company.

That distinction must define the art direction.

---

# 72. VISUAL LANGUAGE

Think:

```text
precision
machinery
light
glass
metal
electronics
screens
networks
signals
gaming artwork
premium architectural darkness
controlled color
```

Not:

```text
coins
cards
dice
roulette
Vegas lights
jackpot clichés
money imagery
```

unless those appear in actual game content.

---

# 73. PRODUCT RESPECT

The cabinet itself should carry visual status comparable to:

- a sports car
- premium audio equipment
- industrial hardware
- high-end gaming PC
- flagship smartphone

Lighting should reveal product design.

Do not bury machines under effects.

---

# 74. INITIAL HERO QUALITY BAR

When the first 3D reveal loads, the reaction should be:

> “This company builds serious gaming technology.”

Not:

> “This website has Three.js.”

Technology should disappear behind design.

---

# 75. DOCUMENT DECISIONS

Maintain:

```text
/docs/decisions/
```

Use ADR-style notes for major decisions.

Examples:

```text
ADR-001-WEBGL-STACK.md
ADR-002-SCROLL-SYSTEM.md
ADR-003-MODEL-COMPRESSION.md
ADR-004-MOBILE-DEGRADATION.md
ADR-005-ROUTE-TRANSITIONS.md
```

Future agents must understand why the system works this way.

---

# 76. AGENT CONTINUITY

This repository will potentially be worked on by multiple AI agents and editors.

Maintain:

```text
AGENTS.md
PROJECT_STATE.md
CURRENT_MILESTONE.md
DECISIONS.md
KNOWN_ISSUES.md
NEXT_ACTIONS.md
```

After meaningful work, update:

```text
what changed
why
files changed
current state
remaining issues
performance implications
next action
```

Do not assume another agent knows prior reasoning.

---

# 77. NO RANDOM REFACTORING

When working on one milestone, do not rewrite unrelated systems.

Before changing architecture:

1. identify issue
2. document evidence
3. explain proposed change
4. evaluate regression risk
5. implement smallest correct change

---

# 78. NO PLACEHOLDER-TO-PRODUCTION LEAK

During prototypes it is acceptable to use:

```text
placeholder environment geometry
temporary cabinet blockout
temporary texture
```

BUT mark clearly:

```text
PROTOTYPE ONLY
```

Before production milestone, search and remove all temporary assets.

---

# 79. NO SILENT MEDIA FALLBACK

This rule is absolute.

IF REQUIRED MEDIA IS MISSING:

DO NOT:

- generate a gradient
- use a stock photo
- insert a generic casino image
- invent a substitute model
- create random CSS visuals
- remove the interaction

Instead:

CREATE ASSET BRIEF.

Mark implementation:

```text
BLOCKED BY ASSET: TP-XXXX
```

Continue other independent work.

---

# 80. FINAL EXPERIENCE PRINCIPLE

The final TierPlay website should feel like a single designed system.

Not:

```text
hero built by one designer
cards from UI library
3D from another demo
animations from Motion examples
footer from template
```

Everything should share:

- lighting philosophy
- typography
- timing
- materials
- geometry
- camera behavior
- interaction language
- visual rhythm

---

# 81. FIRST ASSIGNMENT

DO NOT BUILD THE SITE.

Your first assignment is:

## STEP 1

Audit:

https://electronhubs.com/

and the existing repository.

## STEP 2

Create:

```text
CONTENT-INVENTORY.md
PAGE-SEQUENCE.md
ROUTE-MAP.md
PRODUCT-MATRIX.md
FEATURE-MATRIX.md
ASSET-INVENTORY.md
```

## STEP 3

Create:

```text
REFERENCE-MAP.md
```

Map every existing TierPlay section to a specific high-quality interaction/design reference.

## STEP 4

Create:

```text
PROPOSED-HOMEPAGE-SEQUENCE.md
```

For each section describe:

- content retained
- visual concept
- reference
- camera
- layout
- animation
- WebGL involvement
- DOM involvement
- required assets
- desktop behavior
- mobile behavior
- reduced-motion behavior
- performance risk

## STEP 5

Create:

```text
ASSET-REQUESTS.md
```

Identify everything that would require:

- image generation
- Blender
- video generation
- texture production
- audio

DO NOT SUBSTITUTE MISSING ASSETS.

## STEP 6

Create:

```text
MILESTONE-PLAN.md
```

The first implementation milestone must end at:

```text
BOOT
→
ENTRANCE
→
GAMING FLOOR
→
ONE CABINET
→
FOCUS
→
SCREEN ENTRY
```

Stop there.

Do not build additional homepage sections until this prototype passes review.

---

# 82. RESPONSE FORMAT

After analysis, report back using exactly:

```text
1. LEGACY SITE AUDIT

2. CURRENT REPOSITORY AUDIT

3. CONTENT THAT MUST BE PRESERVED

4. PROPOSED EXPERIENCE ARCHITECTURE

5. REFERENCE-BY-REFERENCE DESIGN MAP

6. WEBGL ARCHITECTURE

7. ASSET REQUIREMENTS

8. BLENDER REQUIREMENTS

9. IMAGE GENERATION REQUIREMENTS

10. VIDEO REQUIREMENTS

11. COMPONENT LIBRARY OPPORTUNITIES

12. PERFORMANCE RISKS

13. MOBILE STRATEGY

14. ACCESSIBILITY STRATEGY

15. MILESTONE PLAN

16. FILES TO CREATE

17. FIRST IMPLEMENTATION TASK
```

Do not implement before completing this analysis.

---

# FINAL DIRECTIVE

Your objective is NOT maximum animation.

Your objective is:

> maximum perceived quality per interaction.

Every animation, shader, camera move, transition and 3D object must earn its place.

The website should be visually exceptional enough to sit alongside top-tier WebGL studio work while remaining:

- fast
- usable
- accessible
- maintainable
- responsive
- SEO friendly
- factually faithful to TierPlay
- production ready

Do not optimize for how much code you can generate.

Optimize for how deliberate the final experience feels.

Begin with the forensic audit.

DO NOT BEGIN IMPLEMENTATION UNTIL THAT AUDIT AND REFERENCE MAP ARE COMPLETE.