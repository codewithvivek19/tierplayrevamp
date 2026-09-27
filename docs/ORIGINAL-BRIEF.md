Blue Tower’s current public site still leans heavily on immersive game worlds and 3D-style presentation, so the benchmark remains appropriate—but the master prompt below explicitly tells Astra to **study its principles without cloning its branded creative work**. 

Paste this entire block as **one prompt**:

# TIERPLAY V2 — MASTER EXECUTION PROMPT

You are the **Lead Creative Director, Senior Interactive Designer, Principal Frontend Engineer, WebGL Engineer, Motion Director, Technical Architect and Performance Engineer** responsible for rebuilding Tierplay.com from the ground up.

This is not a conventional website redesign.

This is a flagship interactive digital experience for a gaming technology company.

The finished result must feel comparable in ambition and production quality to the strongest interactive gaming, automotive, hardware and Awwwards-level websites on the web.

Our reference benchmark includes Blue Tower Games for its immersive presentation and game-world approach.

DO NOT clone Blue Tower Games.

Study:

- production quality
- visual density
- cinematography
- game presentation
- use of immersive media
- transitions
- scale
- pacing
- interaction quality

Then build an original Tierplay identity around Tierplay's actual differentiators:

- physical gaming cabinets
- Sunscape game ecosystem
- linked jackpots
- Tierplay Collection Management
- loyalty systems
- player journey
- operator infrastructure
- remote management
- hardware
- physical + digital integration

The central creative idea is:

# ENTER THE TIER

The user should not feel like they are scrolling through sections.

They should feel like they are moving through the Tierplay ecosystem.

---

# CRITICAL WORKING RULE

Do NOT immediately generate the entire website.

Do NOT produce 12 mediocre sections.

Do NOT begin by filling the repository with generic React components.

First:

1. research
2. recover original Tierplay content/media
3. establish design language
4. establish technical architecture
5. create documentation
6. create performance strategy
7. create one exceptional cinematic prototype
8. review it
9. improve it
10. only then expand the website

The first 15–20 seconds of the finished experience must establish the quality ceiling for everything else.

If the Hero + Cabinet + Portal system is mediocre, DO NOT continue building later sections.

Improve it first.

---

# PART 0 — FIRST ACTION: INSTALL/ENABLE AGENT CAPABILITIES

Before implementation, inspect the environment and install or enable appropriate agent skills.

Prefer project-scoped skills where possible.

Run or adapt:

```bash
npx motion-ai

npx skills add https://github.com/greensock/gsap-skills

npx skills add Jakubantalik/Libraries.dev

npx skills add Jakubantalik/transitions.dev

npx skills add jakubkrehel/skills

npx skills add vercel-labs/agent-skills

npx skills add cesartevisual/threejs-skills
```

Where a repository contains multiple skills, inspect:

```bash
npx skills add <repo> --list
```

and install the useful subset.

Prioritize skills relating to:

- GSAP
- ScrollTrigger
- Motion
- animation performance
- React
- Next.js
- composition patterns
- WebGL
- R3F
- Three.js
- GLTF
- shaders
- lighting
- postprocessing
- performance
- accessibility
- responsive design
- interface review
- visual variants
- component stress testing

Also inspect current component/reference ecosystems including:

- React Bits
- React Bits `llms.txt`
- Motion examples
- Motion UI
- useLayouts
- Libraries.dev
- 21st.dev
- high-quality shadcn registries where relevant

These are SOURCE MATERIAL.

They are not the Tierplay design system.

Never paste trendy components indiscriminately.

---

# PART 1 — CREATE PROJECT GOVERNANCE BEFORE CODING

Create these files:

```text
AGENTS.md

docs/
├── DESIGN.md
├── MOTION.md
├── WEBGL.md
├── PERFORMANCE.md
├── CONTENT-MAP.md
├── MEDIA-RECOVERY.md
├── MEDIA-BRIEFS.md
├── RESPONSIVE.md
├── ACCESSIBILITY.md
├── SEO.md
├── STATUS.md
└── ADR/
```

Populate them BEFORE serious implementation.

They become the persistent knowledge layer allowing:

- Astra
- Codex
- Claude
- Cursor
- Antigravity
- future coding agents

to continue the project without hallucinating architecture or redesigning things arbitrarily.

---

# PART 2 — AGENTS.MD GOVERNING RULES

Create `AGENTS.md`.

It must establish these rules.

## Mission

Tierplay V2 is a cinematic interactive technology experience, not a template site.

## Mandatory reading

Every agent reads:

```text
AGENTS.md
DESIGN.md
MOTION.md
WEBGL.md
PERFORMANCE.md
STATUS.md
relevant ADRs
```

before making architecture-level changes.

## One animation owner per property

GSAP:

- cinematic sequences
- ScrollTrigger
- long-form choreography
- DOM/WebGL synchronization

Motion:

- component transitions
- menus
- navigation
- buttons
- layouts
- selectors
- UI interaction

Three.js / R3F:

- camera
- 3D models
- shaders
- lighting
- materials
- scene objects
- particles

CSS:

- simple micro-interactions

Never let Motion and GSAP fight over the same transform.

## One CameraDirector

No arbitrary component is allowed to control the global camera.

## Persistent canvas

Prefer one shared WebGL renderer.

## Design consistency

No new visual style without consulting DESIGN.md.

## Effects libraries

React Bits/useLayouts/Libraries.dev/etc. are implementation references.

Every borrowed primitive must be customized.

## No one-pass generation

Build milestone by milestone.

## Performance

Every expensive effect requires a fallback.

## Mobile

Mobile receives separate art direction.

## Documentation

Update `STATUS.md` after meaningful work.

---

# PART 3 — OLD TIERPLAY FORENSIC RECOVERY

Before designing replacement media, perform a thorough recovery operation.

The previous Tierplay WordPress site may be unavailable directly.

However indexed pages and what appears to be an older/staging copy have existed at locations including:

```text
tierplay.com
electronhubs.com
```

Do not assume those are complete or authoritative.

Use them as recovery leads.

Search:

- indexed Tierplay pages
- image indexes
- WordPress media URLs
- `/wp-content/uploads/`
- sitemap files
- image filenames
- cached pages where legally accessible
- public archive snapshots
- public search caches
- linked PDFs
- flyers
- publicly exposed media
- previous Tierplay social/marketing material where available

DO NOT bypass authentication.

DO NOT exploit private infrastructure.

Only recover publicly accessible material.

---

# PART 4 — CREATE A MEDIA INVENTORY

Build:

```text
docs/MEDIA-RECOVERY.md
```

For every discovered media item capture:

```text
Asset name
Original URL
Recovery source
File type
Dimensions
File size
Page used on
Likely purpose
Quality
Usability
Copyright/ownership assumption
Replacement required?
Notes
```

Organize into:

```text
brand/
cabinets/
sunscape/
games/
technology/
jackpot/
player-journey/
company/
icons/
logos/
backgrounds/
video/
pdf/
unknown/
```

Download publicly accessible Tierplay-owned assets into:

```text
assets/source-recovery/
```

DO NOT optimize originals in place.

Preserve raw copies.

Create production derivatives separately.

---

# PART 5 — KNOWN RECOVERY LEADS

Search specifically for media and references with names or concepts like:

```text
Tierplay logo
Home-about-big-image
Home About Small Image
3-games-cabinets-updated
curved_cabinets
vertical cabinet
Sunscape 01
Sunscape 02
Sunscape 03
Sunscape 04
Sunscape 05
Sunscape 06
1_sunscape
2_sunscape
4_sunscape
6_sunscape
Bison Showdown
Tiki Twist
Sinister Show
Frozen War
Eagle Strike
Bandit Bounty
Rich Times
Gang of Evils
Rise of the Dragon
Sunscape-01-Gangs-of-Evil-Bonus-1
Rise-of-Dragon-Free-spins
Sunscape flyer
Altitude Console
Pinnacle Console
TCM
Tierplay Link Jackpot
TLJ
```

Do not assume spelling is perfect.

Search variants.

---

# PART 6 — CONTENT THAT SHOULD BE PRESERVED/VERIFIED

Use old-site content as source material but rewrite weak marketing copy professionally.

Known Tierplay subject matter includes:

## Company

20+ years of gaming experience/innovation.

Verify before publishing exact claims.

## Cabinets

Altitude Console.

Pinnacle Console.

Known themes/specifications appearing publicly include:

- 43-inch displays
- vertical cabinet
- curved/flat display configurations
- 4K resolution
- PCAP touchscreen
- modular construction
- U.S. manufacturing/craftsmanship claims
- JCM UBA validators
- ticketing systems
- ambient lighting
- inductive charging
- dual bash buttons
- remote management
- diagnostics
- data/statistics
- audio
- support

Verify every production specification with Tierplay before final publication.

Do not invent specs.

## Games

Six Sunscape boards have existed publicly.

Known game titles include examples such as:

Sunscape 1:

- Rich Times
- Gang of Evils
- Rise of the Dragon

Other publicly indexed names include:

- Bison Showdown
- Tiki Twist
- Sinister Show
- Frozen War
- Eagle Strike
- Bandit Bounty

Verify titles before final publication.

## Technology

Tierplay Collection Management — TCM.

Tierplay Link Jackpot — TLJ.

Remote machine control.

Route management.

Loyalty functionality.

Jackpot systems.

Data visibility.

## Player Journey

Themes include:

- game discovery
- engagement
- jackpots
- bonuses
- free spins
- linked jackpots
- loyalty
- repeat visits

## Market/legal text

The old site has displayed restrictions such as:

```text
not available for Georgia market
```

Do not remove, modify or reinterpret regulatory/legal availability language without client/legal approval.

Create placeholders where verification is required.

---

# PART 7 — MEDIA DECISION TREE

For every visual asset follow this decision tree.

## A. Excellent original available

Use original.

Optimize:

- crop
- color
- resolution
- compression
- alpha cleanup
- WebP/AVIF
- responsive derivatives

## B. Original exists but low resolution

Preserve identity.

Then:

- upscale carefully
- remove compression artifacts
- repair edges
- clean background
- rebuild missing transparency
- adjust color
- reconstruct depth layers if needed

Do not alter recognizable game artwork unnecessarily.

## C. Partial artwork exists

Use it as the source of truth.

Reconstruct surrounding environment around it.

Do not redesign core game identity unless approved.

## D. No usable asset exists

Create a new Tierplay visual inspired by:

- actual product
- actual game
- actual logo
- actual colors
- actual game title

The redesign must feel plausible as Tierplay.

Do not create generic slot-machine imagery.

---

# PART 8 — MEDIA GENERATION PRINCIPLE

Generated media supplements Tierplay.

It does not replace Tierplay.

Priority:

```text
real Tierplay product
>
restored Tierplay artwork
>
recomposed Tierplay artwork
>
new supporting artwork
>
generic synthetic media
```

Generic synthetic media is the last resort.

---

# PART 9 — IMAGE RECONSTRUCTION PROMPTS

When original media is insufficient, use the following prompt templates with an image-generation system.

Insert the recovered Tierplay source image as reference whenever possible.

---

## PROMPT A — CABINET HERO PRODUCT SHOT

Create a premium cinematic product visualization of the supplied Tierplay gaming cabinet.

Preserve the exact physical proportions, screen geometry, buttons, cabinet silhouette, logos and identifiable hardware from the source reference.

Do NOT redesign the physical cabinet.

Presentation direction:

high-end automotive product photography,
luxury industrial design campaign,
near-black graphite studio,
subtle reflective floor,
extremely controlled red Tierplay rim lighting,
soft white key light,
brushed-metal highlights,
realistic glass reflections,
physically plausible materials,
deep blacks without crushed detail,
high dynamic range,
premium hardware advertisement.

Camera:

low three-quarter hero angle,
50–70mm product-photography feel,
slight perspective compression,
cabinet fills approximately 65% of composition.

Background:

minimal,
dark,
architectural,
very subtle atmospheric depth,
no casino floor,
no generic neon tunnel.

Do not add:

people,
coins,
roulette wheels,
playing cards,
random slot symbols,
cyberpunk city,
purple SaaS gradients,
excessive smoke,
excessive bloom.

Output must look photographically believable enough to serve as reference for a real-time WebGL scene.

---

## PROMPT B — CABINET MACRO

Create an extreme macro product photograph based on the supplied Tierplay cabinet reference.

Focus on:

brushed metal,
paint finish,
display glass,
edge lighting,
button construction,
precise seams,
premium material transitions.

The image should initially feel abstract.

The viewer should not immediately see the full cabinet.

Direction:

Apple-grade macro product photography,
cinematic darkness,
Tierplay red reflections,
physically realistic textures,
controlled depth of field,
high-end studio lighting.

No generic gaming symbols.

---

## PROMPT C — SUNSCAPE WORLD EXTENSION

Use the supplied original Tierplay Sunscape/game artwork as the central source.

Do not alter:

game logo,
recognizable characters,
key iconography,
primary composition identity.

Extend the artwork beyond its original boundaries into a cinematic 16:9 environment.

Create:

foreground depth,
midground environmental elements,
background architecture/landscape appropriate to the game's theme,
atmospheric particles,
volumetric depth,
light shafts where appropriate.

The final environment must feel like entering the original game's artwork rather than replacing it.

Maintain visual consistency with the source.

Leave safe composition areas for website typography.

Do not insert unrelated casino imagery.

---

## PROMPT D — DRAGON WORLD

Using Tierplay Rise of the Dragon source art as reference, extend it into a premium cinematic environment.

Preserve the game's identifiable dragon design/logo/style.

Build depth through:

foreground ornamental architecture,
midground dramatic environment,
distant atmospheric landscape,
controlled embers,
subtle volumetric haze,
gold/red illumination,
deep shadow.

Avoid generic Chinese fantasy stereotypes not present in source material.

Create an environment suitable for multi-plane parallax and WebGL depth reconstruction.

---

## PROMPT E — BISON SHOWDOWN WORLD

Expand the supplied Bison Showdown art into an immersive Western/high-plains game environment consistent with the original artwork.

Preserve actual Tierplay branding and game identity.

Use:

cinematic golden-hour lighting,
dramatic plains,
dust,
environmental depth,
foreground natural elements,
subtle motion-ready particles.

Do not turn it into a generic cowboy movie poster.

---

## PROMPT F — TIKI TWIST WORLD

Extend original Tiki Twist artwork into a vivid premium tropical game environment.

Preserve the original visual language.

Use controlled:

tropical vegetation,
warm sunset light,
volcanic/tiki ambience if supported by source,
foreground leaves,
mist,
water/reflection where contextually correct.

Avoid cheap cartoon beach-stock aesthetics.

---

## PROMPT G — FROZEN WAR

Extend Frozen War source artwork into a large cinematic frozen environment.

Use:

ice,
cold atmospheric depth,
subtle snow,
blue-white environmental lighting,
strong subject separation,
controlled contrast.

Preserve source characters/art direction.

Avoid generic fantasy replacements.

---

## PROMPT H — TCM VISUAL

Create a sophisticated enterprise technology visual for Tierplay Collection Management.

Concept:

a physical gaming floor represented as a precise network topology.

Show:

clusters of gaming cabinets,
location nodes,
machine states,
remote connectivity,
status signals,
route-management structure.

Style:

luxury industrial technology,
dark graphite background,
white data elements,
controlled Tierplay red signals,
subtle glass only where useful,
realistic cabinet silhouettes.

Avoid:

hacker UI,
Matrix code,
cyberpunk,
random holographic circles,
fake sci-fi noise.

The system should feel believable enough to represent real operational software.

---

## PROMPT I — TIERPLAY LINK JACKPOT

Create a cinematic visualization explaining Tierplay Link Jackpot.

Start conceptually from:

multiple real gaming cabinets across one location.

Show a restrained visual network connecting the machines into a shared progressive jackpot.

Use:

energy pulses,
architectural connection lines,
central jackpot accumulation,
subtle red/gold signal,
premium dark environment.

Communication priority:

one machine
→ many machines
→ connected jackpot pool.

Do not use crypto/network clichés.

---

# PART 10 — 3D ASSET STRATEGY

Before modeling anything from scratch inspect whether Tierplay has:

- CAD
- STEP
- FBX
- OBJ
- GLB
- GLTF
- Blender
- Cinema4D
- 3ds Max
- product render
- orthographic photography

for Altitude and Pinnacle.

Ask client if needed.

Preferred production path:

```text
original CAD/high-quality source
↓
retopology
↓
UV cleanup
↓
baked detail
↓
PBR materials
↓
GLB
↓
Meshopt
↓
KTX2
↓
production scene
```

Do not use an unoptimized CAD model directly on the web.

---

# PART 11 — IF NO 3D MODEL EXISTS

Create a cabinet reconstruction brief.

Require:

- front view
- side view
- three-quarter images
- dimensions if available
- screen dimensions
- button geometry
- base
- top
- edge profile
- rear silhouette if needed

Model only what will be visible.

The website does not need engineering-grade internal geometry.

Prioritize silhouette + materials + interactive close-up quality.

---

# PART 12 — CREATIVE DIRECTION

Primary concept:

# ENTER THE TIER

Visual tone:

```text
premium
cinematic
physical
dark
precise
controlled
powerful
technological
high-value
```

Do NOT create:

- purple crypto gradients
- random neon cards
- excessive glass
- glowing borders everywhere
- constant particle storms
- generic slot casino imagery
- Web3 aesthetic
- giant orb backgrounds without meaning
- random liquid blobs
- trendy component soup

---

# PART 13 — COLOR DIRECTION

Primary environment:

```text
near-black
graphite
charcoal
smoked glass
dark metallic
```

Brand energy:

```text
Tierplay red/crimson
```

Supporting:

```text
warm white
neutral white
controlled amber/gold
```

Game worlds derive colors from actual game artwork.

Do not force Tierplay red over every game world.

---

# PART 14 — TYPOGRAPHY

Choose a premium display + UI combination after testing.

Characteristics:

Display:

- bold
- confident
- compact
- editorial
- large
- tight tracking

Interface:

- precise
- modern
- highly legible

Body:

- calm
- readable
- restrained

Do not automatically use Inter for everything.

Evaluate multiple type systems visually.

---

# PART 15 — MOTION LANGUAGE

Define four typography motion families.

## Monumental

Rare chapter moments.

Examples:

```text
SUNSCAPE
CONNECTED
PINNACLE
ALTITUDE
```

Potential:

- dimensional text
- depth extrusion
- environmental type
- mask transformation

## Cinematic

Hero statements.

Use:

- clips
- masks
- tracking
- opacity
- measured translation

## Technical

TCM/cabinet specs.

Use:

- line drawing
- grid activation
- numeric change
- precise directional motion

## Quiet

Body copy.

Use:

```text
opacity + 8–16px translation
```

or no animation.

---

# PART 16 — REACT BITS / DEPTH TEXT

The project may use React Bits components selectively.

For example, DepthText can be adapted for one or two monumental moments.

DO NOT use 34 DOM layers indiscriminately.

Desktop target:

```text
layers: 12–20
depth: 1–2px
tilt: restrained
autoOrbit: false
pointerTracking: only on fine pointer
```

Mobile:

```text
layers: 6–10
pointerTracking: false
autoOrbit: false
```

Pause RAF when offscreen.

MotionScore must evaluate it.

Use React Bits `llms.txt` to discover alternatives before forcing a component into an unsuitable context.

---

# PART 17 — HOMEPAGE STORYBOARD

Build the homepage as one connected cinematic narrative.

---

## SCENE 01 — BOOT

Near-black screen.

Minimal Tierplay signal.

Do not use a cliché percentage loader unless actual loading requires one.

Possible experience:

small Tierplay mark
+
thin signal line
+
subtle hardware power-up audio only if enabled.

Preload critical assets intelligently.

---

## SCENE 02 — CABINET MACRO

Camera is extremely close to physical cabinet material.

We see:

- glass
- metal
- red edge light
- curved surface

but not the complete object.

Very slow controlled camera movement.

Headline not yet dominant.

Create anticipation.

---

## SCENE 03 — CABINET REVEAL

Camera pulls back.

Tierplay cabinet becomes identifiable.

Lighting activates progressively:

```text
edge
controls
display
ambient light
```

Primary copy:

# THE NEXT TIER OF PLAY

Supporting copy should be short.

Possible:

Tierplay unifies games, cabinets and connected technology into one gaming ecosystem.

CTA:

```text
Explore Tierplay
For Operators
```

Do not overload hero with paragraphs.

---

# PART 18 — CABINET → SCREEN PORTAL

This is a signature Tierplay moment.

Scrolling moves camera toward cabinet screen.

Timeline concept:

```text
0.00 full cabinet
0.15 typography begins exiting
0.25 camera moves forward
0.45 cabinet screen dominates composition
0.60 bezel exceeds viewport
0.70 display develops dimensional depth
0.80 physical cabinet lighting disappears
0.90 game-world geometry emerges
1.00 user exists inside Sunscape world
```

NO generic glowing portal ring.

The SCREEN ITSELF becomes the portal.

---

# PART 19 — SUNSCAPE UNIVERSE

Create:

# THE SUNSCAPE UNIVERSE

Do not show six ordinary cards.

Create spatial worlds.

Concept:

selected world approximately 60–75% focus.

Neighboring worlds visible in depth.

Users can navigate using:

- scroll
- buttons
- drag where appropriate
- keyboard controls

Do not require drag.

Each world uses recovered original Tierplay artwork.

Transition through camera composition rather than hard carousel swaps.

---

# PART 20 — GAME WORLD TECHNIQUE

We do NOT need six huge real-time 3D game worlds.

Use intelligent hybrid scenes.

For each game:

```text
original 2D artwork
+
depth segmentation
+
foreground planes
+
midground planes
+
background
+
subtle geometry
+
particles
+
shader movement
+
lighting
+
camera parallax
```

Use depth maps where beneficial.

This can create AAA perception without AAA asset cost.

---

# PART 21 — JACKPOT TRANSITION

Transition naturally from game environment.

Example:

user sees jackpot/event inside a game.

A red/gold pulse exits the game frame.

Camera pulls backward.

We discover:

one cabinet.

Then:

multiple cabinets.

Then:

a whole installation.

Connection lines begin activating.

---

# PART 22 — TIERPLAY LINK JACKPOT

Narrative:

```text
ONE MACHINE
↓
ONE FLOOR
↓
ONE CONNECTED JACKPOT
```

Start with one cabinet.

Duplicate into a physically plausible gaming-floor arrangement.

Create connection network.

Pulse activity.

Visualize jackpot accumulation.

Use real product silhouettes.

Support copy explains:

Tierplay Link Jackpot connects machines at a location into a larger progressive experience.

Avoid unsupported performance/revenue claims unless approved.

---

# PART 23 — TCM TRANSITION

Transform the same network.

Entertainment energy becomes operational data.

Connection lines become topology.

Cabinets become nodes.

Camera changes from cinematic to precise.

Headline:

# CONTROL THE NETWORK

or another approved alternative.

TCM section should explain:

- remote control
- machine status
- route management
- operational visibility
- issue resolution

without pretending the website demo is real production software.

Label conceptual UI appropriately if required.

---

# PART 24 — TCM VISUAL LANGUAGE

TCM UI is:

```text
clean
technical
dark
precise
modular
information-dense
```

but not sci-fi.

Do NOT create:

- fake terminal code
- arbitrary graphs
- meaningless percentages
- impossible holograms

All mock data must clearly be representative.

---

# PART 25 — CABINET EXPERIENCE

Dedicated cabinet section/page.

Introduce:

# ALTITUDE

and

# PINNACLE

as premium hardware products.

Visual style closer to:

- automotive configurator
- premium display hardware
- industrial product campaign

than a normal gaming product grid.

---

# PART 26 — CABINET INTERACTION

Selecting a cabinet changes:

- camera
- lighting
- UI
- relevant specifications

Create contextual hotspots.

Possible hotspots:

```text
43" display
4K panel
PCAP touchscreen
control deck
dual bash buttons
ambient lighting
inductive charging
validator
cabinet geometry
```

Only display verified specs.

Never show ten hotspots simultaneously.

---

# PART 27 — PLAYER JOURNEY

Do not show five marketing cards.

Create one visual flow:

```text
DISCOVER
↓
PLAY
↓
REWARD
↓
LOYALTY
↓
RETURN
```

Use cabinet, UI signals, jackpots and mobile-message abstractions.

Avoid realistic human characters unless production quality supports them.

Prefer elegant silhouettes/hands/UI.

---

# PART 28 — ABOUT / COMPANY

The about section should provide a moment of visual calm.

After the intense interactive journey:

lighter visual density.

Strong typography.

Real manufacturing/product photography if available.

Talk about:

- Tierplay
- experience
- innovation
- hardware
- games
- operator relationships
- support

Use verified information.

---

# PART 29 — FINAL CTA

Final section should resolve narrative.

Potential:

cabinet returns into view.

Network fades.

Tierplay logo.

Headline:

# READY FOR THE NEXT TIER?

Actions:

```text
Become an Operator
Distribution Enquiry
Talk to Tierplay
```

Avoid generic:

```text
Get Started
```

unless contextually appropriate.

---

# PART 30 — SITE ARCHITECTURE

Initial routes:

```text
/
 /games
 /games/[slug]
 /cabinets
 /technology
 /player-journey
 /about
 /contact
```

Potential later:

```text
/resources
/news
/support
```

Do not recreate WordPress structure blindly.

---

# PART 31 — TECHNICAL STACK

Preferred baseline:

```text
Next.js
React
TypeScript
React Three Fiber
Three.js
@react-three/drei where useful
GSAP
ScrollTrigger
Motion
Zustand
Lenis only where justified
GLSL
postprocessing where justified
Playwright
Sentry
```

Use latest stable compatible versions.

Verify current APIs from official docs/skills rather than model memory.

---

# PART 32 — REPOSITORY ARCHITECTURE

Create approximately:

```text
tierplay-v2/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── games/
│   ├── cabinets/
│   ├── technology/
│   ├── player-journey/
│   ├── about/
│   └── contact/
│
├── components/
│   ├── ui/
│   ├── typography/
│   ├── navigation/
│   ├── media/
│   ├── sections/
│   └── transitions/
│
├── experience/
│   ├── ExperienceCanvas.tsx
│   │
│   ├── camera/
│   │   ├── CameraDirector.tsx
│   │   ├── cameraStates.ts
│   │   ├── cameraPaths.ts
│   │   └── cameraTypes.ts
│   │
│   ├── scenes/
│   │   ├── BootScene/
│   │   ├── CabinetHero/
│   │   ├── PortalScene/
│   │   ├── SunscapeUniverse/
│   │   ├── GameWorld/
│   │   ├── JackpotNetwork/
│   │   ├── TCMScene/
│   │   └── CabinetExplorer/
│   │
│   ├── models/
│   ├── shaders/
│   ├── materials/
│   ├── lighting/
│   ├── particles/
│   ├── postprocessing/
│   └── environment/
│
├── motion/
│   ├── tokens.ts
│   ├── gsap/
│   ├── scroll/
│   ├── transitions/
│   └── timelines/
│
├── systems/
│   ├── AssetManager/
│   ├── DeviceTier/
│   ├── ReducedMotion/
│   ├── ExperienceState/
│   ├── VisibilityManager/
│   ├── PerformanceMonitor/
│   └── AudioManager/
│
├── content/
│   ├── games.ts
│   ├── cabinets.ts
│   ├── technology.ts
│   └── company.ts
│
├── public/
│   ├── models/
│   ├── textures/
│   ├── games/
│   ├── video/
│   └── images/
│
├── assets/
│   └── source-recovery/
│
├── tests/
│   ├── e2e/
│   ├── visual/
│   └── performance/
│
└── docs/
```

Adjust intelligently if the framework requires.

Do not change structure frivolously.

---

# PART 33 — WEBGL.MD

Create `docs/WEBGL.md` containing the following principles.

---

## ONE PERSISTENT CANVAS

Use one main:

```tsx
<ExperienceCanvas />
```

for homepage cinematic rendering.

Do not create a WebGL context for every section.

---

## CAMERA DIRECTOR

Global camera state is controlled by:

```text
CameraDirector
```

Possible states:

```text
BOOT
CABINET_MACRO
CABINET_REVEAL
CABINET_HERO
PORTAL_APPROACH
PORTAL_TRANSITION
SUNSCAPE_WORLD
GAME_FOCUS
JACKPOT_PULLBACK
JACKPOT_NETWORK
TCM_OVERVIEW
CABINET_ALTITUDE
CABINET_PINNACLE
CTA
```

Individual sections request state.

They do not directly mutate camera.

---

## CAMERA STATE DEFINITION

Use typed structures conceptually like:

```ts
type CameraState = {
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
  roll?: number
  transition?: string
}
```

Where cinematic paths require curves, use:

- CatmullRomCurve3
- custom interpolation
- GSAP-controlled progress

Do not animate dozens of camera values independently without abstraction.

---

# PART 34 — SCENE SYSTEM

Scene modules should expose lifecycle/state.

Conceptually:

```text
preload
mount
activate
progress
deactivate
dispose
```

Avoid keeping every expensive scene fully active all the time.

---

# PART 35 — SCENE TRANSITIONS

Prefer continuous transformations.

Example:

CabinetScene does not disappear abruptly before SunscapeScene.

During transition:

```text
cabinet screen
→ masks world
→ game world appears
→ cabinet geometry leaves frustum
→ cabinet can deactivate
```

Maintain visual continuity.

---

# PART 36 — MATERIALS

Use PBR responsibly.

Cabinet:

```text
MeshStandardMaterial
or
MeshPhysicalMaterial where justified
```

Use expensive properties only when visually meaningful.

Potential:

- clearcoat on painted surfaces
- roughness variation
- realistic metalness
- screen emissive
- subtle glass

Avoid every surface being clearcoat/transmission.

---

# PART 37 — SCREEN MATERIAL

Cabinet screen needs dedicated treatment.

Potential:

```text
videoTexture
image sequence
dynamic material
controlled emissive
tone-mapped correctly
```

Screen should illuminate surrounding cabinet subtly.

Do not create unrealistically explosive bloom.

---

# PART 38 — REFLECTIONS

Prefer efficient reflection strategies.

Possible:

- baked environment
- HDR environment map
- static reflection probes
- limited CubeCamera where necessary

Do not run expensive live reflections everywhere.

---

# PART 39 — LIGHTING

Use cinematic lighting.

Hero may use:

```text
key
rim
fill
screen emissive
environment
```

Avoid dozens of dynamic lights.

Prefer lighting composition over brute force.

---

# PART 40 — SHADOWS

Real-time shadows only where perceptually valuable.

Use:

- optimized shadow map sizes
- limited casting objects
- contact shadows selectively
- baked shadows where possible

Do not let decorative meshes cast unnecessary shadows.

---

# PART 41 — POSTPROCESSING

Postprocessing is optional and controlled.

Possible:

- very restrained bloom
- subtle vignette
- SMAA/AA where appropriate
- color grading

Avoid:

- excessive chromatic aberration
- heavy film grain
- giant depth-of-field blur
- exaggerated bloom

Do not use effects to hide poor lighting/materials.

---

# PART 42 — PARTICLES

Particles communicate:

- atmosphere
- energy
- jackpot/network movement

Use instancing or efficient GPU techniques.

Do not spawn thousands of React components.

Pause/reduce offscreen.

---

# PART 43 — GAME WORLD PLANES

For reconstructed 2.5D worlds:

segment source artwork into:

```text
foreground
subject
midground
background
sky/environment
effects
```

Place planes in depth.

Use slight camera parallax.

Add custom shader deformation only where appropriate.

Never make the source image look like cardboard layers.

Use:

- depth haze
- lighting
- subtle displacement
- particles
- correct scale

to unify scene.

---

# PART 44 — NETWORK VISUALIZATION

Use efficient instanced cabinets.

For network connections investigate:

- Line2
- shader lines
- instanced paths
- GPU-driven particles traveling along curves

Do not create hundreds of DOM elements.

---

# PART 45 — R3F STATE

Avoid rerendering the React tree every animation frame.

Use refs for frame-level mutation.

Global application state goes to Zustand where useful.

Do not put high-frequency camera coordinates in React state.

---

# PART 46 — USEFRAME

Every `useFrame` must justify itself.

Do not create twenty separate full-frame loops when one manager can coordinate.

Pause expensive logic when inactive.

---

# PART 47 — ASSET LOADING

Create central AssetManager.

Support:

```text
preload critical hero
background-load upcoming scene
release unneeded memory where necessary
cache reusable assets
```

Never preload the entire website before showing Hero.

---

# PART 48 — GLTF

Optimize production models.

Targets:

- remove unseen geometry
- merge where sensible
- preserve semantic parts needed for animation
- Meshopt
- Draco where beneficial
- compressed textures
- reasonable vertex count
- reasonable material count

Use `gltf-transform` or appropriate tooling.

---

# PART 49 — TEXTURES

Use:

- KTX2/Basis where supported
- AVIF/WebP for DOM imagery
- correct color spaces
- mipmaps
- anisotropy only where needed

Do not ship giant 8K maps because source artwork happens to be 8K.

---

# PART 50 — WEBGPU

Do not make WebGPU required for V1.

WebGL is the compatibility baseline.

WebGPU/TSL may enhance capable devices later.

Feature-detect.

Never break Safari/older compatible environments merely to advertise WebGPU.

---

# PART 51 — PERFORMANCE.MD

Create `docs/PERFORMANCE.md`.

Performance is a design constraint.

---

## DEVICE TIERS

Implement adaptive tiers approximately:

```text
ULTRA
HIGH
BALANCED
LOW
STATIC
```

Determine based on sensible signals such as:

- device capability
- GPU/render characteristics where safely detectable
- DPR
- memory hints
- viewport
- reduced-motion preference
- runtime frame performance

Do not rely on user-agent sniffing alone.

---

# PART 52 — ULTRA

May receive:

- highest texture quality
- richer particles
- improved shadows
- subtle postprocessing
- richer reflections
- maximum scene density

Still optimize.

---

# PART 53 — HIGH

Default powerful desktop/laptop.

Nearly complete visual experience.

Slight reductions from Ultra.

---

# PART 54 — BALANCED

Mainstream devices.

Reduce:

- DPR
- particles
- postprocessing
- shadows
- reflection cost
- texture resolution

Preserve composition.

---

# PART 55 — LOW

Use:

- lower DPR
- simplified models
- very limited particles
- no expensive postprocessing
- baked lighting where possible
- simpler transitions

Preserve storytelling.

---

# PART 56 — STATIC

Fallback for:

- very weak hardware
- unsupported WebGL
- certain reduced-motion situations
- serious runtime performance failure

Use:

- premium stills
- pre-rendered video
- CSS transitions
- DOM composition

The site must remain excellent.

Static does not mean broken.

---

# PART 57 — TARGET PERFORMANCE

Aim for smooth 60fps on appropriate hardware.

Stable simplified rendering is better than oscillation between 60 and 15fps.

Runtime monitor can reduce quality if sustained frame time becomes poor.

Avoid disruptive visual quality switching during critical transitions.

---

# PART 58 — DPR

Do not blindly use:

```text
window.devicePixelRatio
```

Cap it.

Example target ranges:

```text
Ultra: up to ~2
High: ~1.5–2
Balanced: ~1–1.5
Low: ~1
```

Tune through actual profiling.

---

# PART 59 — DRAW CALLS

Profile scenes.

Aim to minimize:

- material fragmentation
- repeated geometry
- unique meshes where instancing works

Network scenes particularly should use instancing.

No arbitrary hard target without profiling, but treat hundreds/thousands of draw calls as a warning.

---

# PART 60 — HERO INITIAL PAYLOAD

The homepage must not require every game-world asset before interaction.

Prioritize:

```text
logo
hero cabinet
hero environment
essential typography
first screen media
```

Lazy-load later game worlds.

---

# PART 61 — LCP

Do not sacrifice web fundamentals because WebGL exists.

Ensure initial page can reach meaningful content quickly.

Use SSR/HTML for important hero copy.

WebGL can initialize progressively.

---

# PART 62 — MEMORY

Test:

- model memory
- texture memory
- video memory
- route transitions
- repeated navigation

Dispose unused Three.js resources intentionally.

Prevent leaks.

---

# PART 63 — VIDEO

When using video:

- provide WebM/AV1 where appropriate
- MP4 fallback
- appropriate resolution
- autoplay only muted
- pause when offscreen
- avoid giant hero video if WebGL already provides equivalent visual

---

# PART 64 — MOTIONSCORE

After each animation-heavy milestone:

run MotionScore/source/runtime analysis if available.

Audit:

- layout-triggering animations
- filters
- expensive paints
- duplicate RAF loops
- unnecessary continuous animation
- excessive main-thread work

Fix problems before proceeding.

---

# PART 65 — RESPONSIVE STRATEGY

Create `RESPONSIVE.md`.

Desktop and mobile are separate compositions.

---

## DESKTOP

Full cinematic canvas.

Deep camera movement.

Rich scene transitions.

---

## TABLET

Reduced:

- depth
- camera travel
- scene density
- hover dependence

---

## MOBILE

Do not simply shrink.

Recompose.

Examples:

Desktop Sunscape:

spatial 3D universe.

Mobile:

high-quality snap/gesture-driven gallery with selective depth.

Desktop Cabinet Explorer:

wide product + spec interface.

Mobile:

vertical product sequence with contextual close-ups.

Desktop portal:

long camera move.

Mobile:

short camera move + controlled visual transition.

---

# PART 66 — ACCESSIBILITY

Essential information stays in DOM.

WebGL is enhancement.

Ensure:

- semantic headings
- keyboard navigation
- focus states
- form labels
- sufficient contrast
- reduced motion
- alt text
- accessible game navigation
- screen-reader-accessible product content

Never place essential copy only inside canvas.

---

# PART 67 — REDUCED MOTION

Respect:

```css
prefers-reduced-motion: reduce
```

Replace:

- fly-through
- large parallax
- auto orbit
- particle storms
- long scroll pinning

with:

- static compositions
- fades
- short transforms
- cuts

Preserve narrative.

---

# PART 68 — SEO

Use semantic HTML.

Game/product information must remain crawlable.

Create:

- metadata
- OG images
- schema where relevant
- sitemap
- robots configuration
- canonical URLs

Do not hide entire site behind client-only rendering.

---

# PART 69 — CONTENT WRITING

Rewrite weak legacy copy.

Tone:

```text
confident
premium
technical
clear
concise
B2B-aware
```

Avoid:

```text
revolutionary
cutting-edge
game-changing
unparalleled
best-in-class
```

unless supported and genuinely necessary.

Prefer facts and product benefits.

---

# PART 70 — HOME COPY WORKING DIRECTION

Possible hero:

# THE NEXT TIER OF PLAY

Supporting:

Games, cabinets and connected technology engineered as one gaming ecosystem.

CTA:

```text
Explore Tierplay
For Operators
```

Treat as working copy.

Generate 3 strong alternatives before lock.

---

# PART 71 — SECTION COPY DIRECTION

Sunscape:

# ENTER SUNSCAPE

or

# SIX WORLDS. ONE ECOSYSTEM.

Jackpot:

# CONNECT THE FLOOR

TCM:

# CONTROL THE NETWORK

Cabinets:

# BUILT FOR THE FLOOR

Player Journey:

# DESIGNED TO BRING PLAYERS BACK

Final:

# READY FOR THE NEXT TIER?

These are working directions, not mandatory final copy.

Create alternatives and evaluate against visual system.

---

# PART 72 — COMPONENT SOURCING

Before creating a generic component, check whether a high-quality primitive exists from:

- Motion
- Motion UI
- React Bits
- useLayouts
- Libraries.dev
- 21st.dev

If yes:

inspect source.

Use only if:

- accessible
- appropriate
- performant
- maintainable

Rewrite its presentation to Tierplay.

---

# PART 73 — LIBRARIES.DEV

Particularly investigate effects such as:

- Metal FX
- Image FX

where they genuinely reinforce:

- cabinets
- hardware
- game media

Do not add:

- chatbot visuals
- random thinking orbs
- decorative beams

unless conceptually justified.

---

# PART 74 — UI EFFECT RULE

For every visual effect answer:

```text
What does this communicate?
Why does Tierplay need it?
Could removing it improve the page?
What does it cost at runtime?
How does it work on mobile?
```

If answers are weak, remove it.

---

# PART 75 — MOTION TOKENS

Create centralized motion constants.

Concept:

```ts
export const duration = {
  instant: 0.12,
  fast: 0.2,
  normal: 0.35,
  deliberate: 0.55,
  cinematic: 0.8,
  chapter: 1.2,
}
```

Create approved easings.

Do not scatter random cubic-beziers.

Use Motion transition editor/skills to refine them.

---

# PART 76 — SCROLL RULES

Not every section is pinned.

Pin only when narrative requires it.

Major sequences can occupy roughly:

```text
120vh–300vh
```

initially.

Tune by feel.

Do not create 800vh sequences just to look cinematic.

---

# PART 77 — LENIS

Use smooth scrolling only if it materially improves experience.

Do not break:

- accessibility
- native anchor navigation
- keyboard
- browser history
- touch behavior

Avoid over-smoothing.

---

# PART 78 — AUDIO

Optional.

Muted by default.

Possible:

- cabinet startup
- subtle electrical ambience
- network pulse
- small transition cue

Never rely on sound for information.

Provide control.

---

# PART 79 — FORMS

Operator/distributor forms must feel professional.

Potential fields:

```text
Name
Email
Company
State/Region
Role
Message
```

Role options might include:

```text
Distributor
Operator
Location Owner
Other
```

Verify with client.

Handle:

- validation
- errors
- success
- accessibility
- spam protection
- privacy

---

# PART 80 — ANALYTICS

Plan events for meaningful interactions:

```text
hero CTA
game exploration
game selected
cabinet selected
technology opened
operator CTA
form started
form submitted
```

Do not track every animation.

---

# PART 81 — TESTING

Use Playwright.

Test:

- navigation
- game switching
- cabinet switching
- forms
- responsive breakpoints
- keyboard use
- reduced motion
- WebGL fallback

---

# PART 82 — VISUAL REGRESSION

Capture:

```text
desktop 1440+
laptop
tablet
mobile 390-ish
mobile small
```

for critical views.

Prevent agents from accidentally destroying visual composition.

---

# PART 83 — PERFORMANCE TESTING

Measure:

- Lighthouse
- Web Vitals
- Chrome performance trace
- GPU/rendering profile
- memory
- dropped frames
- network waterfall
- MotionScore where available

Do not optimize only by Lighthouse score.

Real-time rendering requires runtime profiling.

---

# PART 84 — SECURITY

Keep dependencies current.

Avoid unsafe HTML injection.

Validate server-side form submissions.

Never expose secrets client-side.

Use CSP and appropriate security headers where compatible.

---

# PART 85 — ADR SYSTEM

Document architecture decisions.

Examples:

```text
0001-persistent-webgl-canvas.md
0002-camera-director.md
0003-gsap-motion-ownership.md
0004-device-tier-system.md
0005-sunscape-2-5d-worlds.md
0006-webgl-static-fallback.md
```

Each includes:

```text
Context
Decision
Alternatives
Consequences
Status
```

---

# PART 86 — STATUS.MD

After each meaningful work cycle update:

```text
COMPLETED

IN PROGRESS

KNOWN ISSUES

PERFORMANCE CONCERNS

VISUAL CONCERNS

ARCHITECTURE DECISIONS

ASSETS RECOVERED

ASSETS MISSING

NEXT TASK

FILES CHANGED
```

This is mandatory.

---

# PART 87 — MILESTONE 0

Do ONLY foundation.

Deliver:

- research
- Tierplay content recovery
- asset recovery
- skills/context
- repo
- docs
- design tokens
- motion tokens
- DeviceTier
- ReducedMotion
- AssetManager
- ExperienceState
- persistent canvas
- CameraDirector skeleton
- loading architecture
- test infrastructure

No massive homepage yet.

---

# PART 88 — MILESTONE 1: QUALITY CEILING

Build ONLY:

```text
BOOT
CABINET MACRO
CABINET REVEAL
HERO
SCREEN APPROACH
PORTAL TRANSITION
ONE SUNSCAPE WORLD
```

This is the most important milestone.

---

# PART 89 — MILESTONE 1 DESIGN EXPLORATION

Before final implementation, create THREE materially different Hero directions.

Example:

## Direction A — Industrial Cinematic

Cabinet is the hero.

Dark studio.

Macro material reveal.

## Direction B — Game Energy

Game light escapes from physical screen.

More colorful but controlled.

## Direction C — Architectural Technology

Cabinet presented within a dark spatial architecture/network environment.

Do not simply recolor the same layout.

Create materially different compositions.

Review them.

Choose the strongest.

---

# PART 90 — HERO ACCEPTANCE GATE

Do not proceed to Milestone 2 until:

- cabinet looks premium
- camera motion feels cinematic
- typography feels intentional
- portal transition works
- mobile composition exists
- reduced motion exists
- visual quality exceeds ordinary gaming websites
- performance is stable
- no major console issues
- visual review passes
- interface-review skill passes
- MotionScore audit is acceptable

If it fails, iterate.

---

# PART 91 — MILESTONE 2

Build:

```text
Sunscape universe
six board navigation
one polished full game-page pattern
game transitions
responsive version
```

Recover remaining artwork before generating replacements.

---

# PART 92 — MILESTONE 3

Build:

```text
jackpot event
camera pullback
cabinet instancing
Tierplay Link network
progressive visualization
supporting copy
```

---

# PART 93 — MILESTONE 4

Build:

```text
TCM scene
technical topology
operational UI
route-management explanation
remote-management storytelling
```

---

# PART 94 — MILESTONE 5

Build:

```text
Altitude
Pinnacle
3D cabinet explorer
hotspots
specifications
product page
```

---

# PART 95 — MILESTONE 6

Build:

```text
Player Journey
About
Contact
supporting pages
games index
SEO content
conversion system
```

---

# PART 96 — MILESTONE 7

Production hardening:

```text
performance
responsive QA
accessibility
SEO
security
analytics
visual regression
cross-browser
device testing
asset compression
cache strategy
error handling
Sentry
deployment
```

---

# PART 97 — DESIGN REVIEW

After every milestone run:

```text
interface review
responsive review
performance review
motion review
accessibility review
code review
```

Use available agent skills.

Do not self-approve based only on code correctness.

---

# PART 98 — VISUAL REVIEW QUESTIONS

Ask:

1. Could this belong to a generic gaming company?

If yes, improve brand specificity.

2. Is the actual Tierplay product visible?

3. Does movement communicate something?

4. Is there one dominant visual concept?

5. Is there enough visual silence?

6. Does this still look premium without bloom?

7. Is mobile deliberately designed?

8. Can weaker hardware experience the same story?

9. Does every effect justify its runtime cost?

10. Is this better than the previous milestone?

---

# PART 99 — CODE QUALITY

TypeScript strict where practical.

Avoid:

```text
any
giant components
magic numbers everywhere
duplicated timelines
global mutable spaghetti
untyped animation state
```

Extract reusable systems only when genuinely reusable.

Do not over-engineer trivial UI.

---

# PART 100 — DO NOT CREATE FAKE COMPLEXITY

Do not invent:

- fake APIs
- fake database
- fake CMS
- microservices
- backend systems

unless needed.

This is primarily a premium marketing/product experience.

Keep backend minimal unless business requirements demand otherwise.

---

# PART 101 — CMS

Initially model content locally using typed structures.

Move to headless CMS only when editorial requirements justify it.

Do not add a CMS simply because it sounds enterprise.

---

# PART 102 — CONTENT MODEL

Example:

```ts
type Game = {
  slug: string
  title: string
  board: string
  category: string
  availability?: string
  description: string
  features: string[]
  media: MediaAsset[]
}

type Cabinet = {
  slug: string
  title: string
  description: string
  specifications: Specification[]
  model?: string
  media: MediaAsset[]
}
```

Keep content separate from visual implementation.

---

# PART 103 — MEDIA MANIFEST

Create machine-readable asset manifest.

Example:

```text
id
source
original
production
type
width
height
compression
usage
copyrightStatus
recovered
generated
approved
```

This will stop future agents from generating replacements when originals already exist.

---

# PART 104 — GENERATED MEDIA LABELING

Store generated media separately from recovered originals.

Example:

```text
assets/source-recovery/
assets/generated/
assets/approved/
```

Never overwrite original Tierplay assets.

---

# PART 105 — DESIGN SYSTEM COMPONENTS

Create only necessary primitives first:

```text
Button
Link
Heading
Body
Eyebrow
Container
Section
MediaFrame
Navigation
Modal/Drawer
GameSelector
CabinetSelector
```

Do not create 50 components before the design exists.

---

# PART 106 — BUTTON DESIGN

Buttons should feel engineered.

Avoid giant pill buttons by default.

Possible characteristics:

```text
small radius
strong type
precise spacing
subtle border
directional icon
material/lighting hover
```

Motion:

fast and controlled.

---

# PART 107 — NAVIGATION

Desktop:

minimal persistent navigation.

Logo.

Games.

Cabinets.

Technology.

About.

Contact.

Possible operator CTA.

Mobile:

high-quality drawer.

Use Motion.

No generic hamburger animation circus.

---

# PART 108 — LOADING EXPERIENCE

Only create a loader if actual critical assets require loading.

Loader should communicate system activation.

Avoid fake loading percentages.

If real progress can be measured, show it subtly.

Allow DOM hero copy to appear while deeper scenes continue loading where possible.

---

# PART 109 — ERROR/FALLBACK

If WebGL initialization fails:

show premium static hero.

No blank canvas.

If cabinet model fails:

fallback to high-quality cabinet render.

If video fails:

fallback poster.

If game world assets fail:

fallback image composition.

---

# PART 110 — CROSS-BROWSER

Test modern:

```text
Chrome
Safari
Firefox
Edge
iOS Safari
Android Chrome
```

Do not rely on one Chrome-only rendering trick.

---

# PART 111 — FINAL EXPERIENCE PRINCIPLE

The website should evolve like this:

```text
OBJECT
↓
WORLD
↓
NETWORK
↓
SYSTEM
↓
PRODUCT
↓
PARTNERSHIP
```

This is the Tierplay narrative.

Protect it.

---

# PART 112 — INITIAL EXECUTION ORDER

After receiving this prompt:

DO NOT immediately output a giant code dump.

Perform the following sequence.

### Step 1

Audit the environment.

### Step 2

Install/inspect applicable skills.

### Step 3

Research/recover Tierplay pages/media.

### Step 4

Create recovery inventory.

### Step 5

Create:

```text
AGENTS.md
DESIGN.md
MOTION.md
WEBGL.md
PERFORMANCE.md
CONTENT-MAP.md
MEDIA-RECOVERY.md
RESPONSIVE.md
ACCESSIBILITY.md
STATUS.md
```

### Step 6

Create three Hero visual directions.

### Step 7

Document recommended direction and rationale.

### Step 8

Establish repository architecture.

### Step 9

Build Milestone 0.

### Step 10

Build Milestone 1 only.

### Step 11

Run visual + performance audit.

### Step 12

Iterate until quality threshold is met.

Only then begin Milestone 2.

---

# PART 113 — AUTONOMY

Do not interrupt implementation with unnecessary clarification questions if a sensible implementation decision can be made from this specification.

Record non-obvious decisions in ADRs.

Where business/legal facts are genuinely unknown:

use explicit TODO verification markers.

Do NOT invent facts.

---

# PART 114 — RESEARCH BEHAVIOR

When using inspiration sites:

analyze:

- hierarchy
- interaction principle
- transitions
- cinematography
- pacing
- asset treatment
- responsive strategy

Do not copy:

- source code
- proprietary assets
- distinctive branded artwork
- exact page compositions
- exact animations

Reinterpret principles specifically for Tierplay.

---

# PART 115 — CREATIVE QUALITY BAR

The site should not feel like:

"A developer added Three.js to a corporate website."

It should feel like:

"The entire brand experience was conceived in three dimensions."

However the 3D must serve Tierplay's story.

---

# PART 116 — FINAL PRODUCT TARGET

When complete, Tierplay V2 should communicate within the first minute:

1. Tierplay makes games.

2. Tierplay has real physical gaming cabinets.

3. Tierplay connects machines.

4. Tierplay has jackpot technology.

5. Tierplay has operational/management technology.

6. Tierplay understands player retention.

7. Tierplay is a serious gaming technology company.

And it should communicate those facts through experience rather than excessive explanatory text.

---

# FINAL NON-NEGOTIABLE

Do not optimize for quantity.

Do not optimize for how quickly every page can be marked "complete."

Optimize for:

```text
visual quality
brand specificity
interaction quality
technical maintainability
runtime performance
continuity
storytelling
```

The first cinematic system establishes the standard.

If the standard is not exceptional:

stop expanding.

Improve the standard.

Then continue.

# START NOW

Begin with:

**Phase 0 — research, asset recovery, skills, documentation and architecture.**

Then deliver a concise execution report showing:

```text
Recovered assets
Missing assets
Installed/available skills
Architecture decisions
Design directions
Performance strategy
Milestone 0 status
Milestone 1 plan
```

After that, proceed directly into Milestone 0 and Milestone 1 according to the rules above.

One thing I would **not** add to this prompt is a request for Astra to generate every missing image itself before it has audited the recoverable media. The old Tierplay index still identifies actual cabinet, Sunscape and supporting assets, and the surviving content gives us real TCM/TLJ and player-journey material. Those should remain the source of truth; AI reconstruction is the fallback, not the first move. 