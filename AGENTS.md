# Tierplay — current project state

This is the single current project document. Older briefs, milestone gates and design directions are retired. The source code is the authority for implementation details.

## What has been built

- A Next.js 16 / React 19 site with a cinematic Three.js homepage hero, responsive navigation, a Tierplay preloader and a shared closing invitation/footer.
- Public routes for Games, Games Collection, six Sunscape board pages, Cabinets, Products, Player Journey, Contact Sales, Support and Updates. The design-system and prototype routes remain for internal comparison.
- Tierplay content lives in `content/site.ts`. Recovered source artwork lives in `public/media/legacy/`; generated artwork lives in `public/media/generated/`. The official Tierplay SVG remains the brand logo.
- The site is a local review build. It has no live form backend. Current specifications and availability still need confirmation from Tierplay before public claims are made. Retain the visible market restriction exactly: `not available for Georgia market`.

## Latest changes

- **Campaign media:** `content/media.ts` maps seven promotional creatives in `public/media/generated/campaign-v6/`: Link Jackpot, standard progressive jackpots, loyalty, collection management, Sunscape, gaming floor and cabinets. Ink/violet artwork combines readable headlines, subdued oversized background words and the supplied Tierplay logo reference. These are illustrative campaign concepts, not product photography or confirmed prize values. Original game screenshots, board covers, cabinet models and homepage Three.js assets remain separate. Poster page openings, homepage cards and journey frames preserve the entire 4:3 composition instead of cropping or placing copy over baked-in text. Masters and generation prompts are saved under `output/media-review/`.

- **Smooth scrolling and page transitions** (`components/motion/SmoothScroll.tsx`, `scrollControl.ts`, `app/ds/motion.css`):
  - Lenis smooths wheel and trackpad scrolling (lerp .085) and is driven by GSAP's ticker, so ScrollTrigger scrubs, the WebGL hero and Lenis advance in the same frame. Touch keeps native momentum (`syncTouch: false`), and reduced motion keeps native scrolling.
  - `autoToggle` stops Lenis while the mobile menu locks the page. Dialogs (360° viewer) and the guide panel keep native scrolling and wheel handling. Horizontal rails carry `data-lenis-prevent-horizontal` so sideways swipes stay native.
  - Same-page anchors and programmatic scrolls (hero "See the experience", showroom index, tour chapters, `#altitude-3d`/`#pinnacle-3d`) go through `smoothScrollTo()`, which shares the wheel's expo-out easing.
  - Route changes: a React `ViewTransition` keyed by pathname in `SiteChrome.tsx`. The old page lifts away (0.32 s); the new page rises in from a slight blur (0.75 s). Header and guide have their own transition names and stay still. Inertia stops on internal links, and Back restores the previous position.
  - Scrubs are tightened now that Lenis smooths the input: hero 0.55 → 0.4, lineup 0.6 → 0.3.
  - Swiper was not added: native CSS scroll-snap is smoother on touch than a JS carousel, and every rail already uses it.
  - Measured on the production build in Chromium/Metal with real mouse-wheel input from top to bottom: home, cabinets, products and games all median 16.7 ms (60 fps). In repeat runs, p95 was 16.8 ms on home at desktop and phone sizes.
- **Hero performance and smoothness** (`PortalCanvas.tsx`, `BattleHero.tsx`):
  - Before the still image hands over to 3D, the scene compiles every shader (including objects that appear later), uploads every texture and draws everything once offscreen. It then times ~20 real frames and tunes itself for the device: balanced tier, then a resolution step-down, then post-processing relief (main bloom off, then the fire pass on alternate frames). It waits for the fireball's textures, so slow networks never mount it mid-scroll.
  - Weak GPUs (integrated/older mobile, by renderer string) and ≤4-core or ≤4 GB devices start on the balanced tier.
  - At runtime only resolution and pass toggles adapt, never lights, shadows or materials, so nothing recompiles while scrolling. The gateway's point lights now live outside the group that toggles visibility (toggling lights changed the light count and recompiled every lit shader halfway through the scroll).
  - The fire-only pass uses `scene.overrideMaterial` (plasma meshes opt out with `allowOverride = false`) instead of swapping materials on every mesh each frame.
  - Slow connections (`effectiveType` 2g/3g), Save-Data, or arriving already scrolled keep the designed still hero.
  - Measured on the production build in Chromium/Metal, scripted 6 s scroll down and back: desktop 1440×900 median 16.7 ms / p95 33 ms (was 33 / 67 ms with 1.3 s freezes); phone 390×844 median and p95 16.7 ms; phone with 4× CPU throttle median and p95 16.7 ms.
- **Hero finale: the walk** (`components/hero/PortalCanvas.tsx` `WALK_PATH`, timing in `components/hero/walk.ts`):
  - From raw scroll 0.66 the viewer walks into the scene: one continuous, never-reversing Steadicam move at eye height. It goes down the stone path, up the steps and beneath the rings, then tilts down into the column of light while the lens tightens.
  - The sightline leads the route. There's a slow float, a footfall bob tied to distance walked (so steps follow the scroll), and the head turns toward the pointer.
  - A screen-space light flood (`.portal-flood`) blooms from the gateway over the last stretch.
  - Dust motes (`DustMotes.tsx`, one draw call; 420 / 160 / 0 by tier) hang along the path and brighten near the light.
  - Hand-off without a jolt: the walk opens on the flight's own heading, and one `handoff` weight (smootherstep over the first 30% of the walk) fades the rail's handheld life out as the walk's look-ahead, pointer turn, float, bob and lens fade in. A critically damped "Steadicam mass" on position, aim and lens absorbs uneven scroll input. `walkEase` (in `walk.ts`) is continuous in position and speed at both ends, and path and aim are sampled by knot so each waypoint and its sightline arrive together.
  - Verified by logging the camera per scroll step (`window.__tpCamLog = []` before scrolling). The turn rate now ramps 0.07° → 0.3° per 0.005 of scroll through the hand-off, where before it jumped to 1.4°, and it tapers smoothly to rest at the end.
  - Everything before the landing is unchanged.
- **Footer** (`SiteFooter.tsx`, footer rules at the end of `app/ds/base.css`): drifting violet, amber and cyan aurora behind the call-to-action; a brighter scan grid; the TIERPLAY wordmark's gradient flows (SVG animateTransform) with a sweeping glint, a traced outline and rising embers; animated link underlines; a pulsing "Support live 24/7/365" status. Reduced motion stops the movement.
- **Hero score** (`components/hero/score.ts`, toggled by `PortalAudio.tsx`):
  - An original score synthesized live with the Web Audio API: no audio files to download and nothing to license. It loads only when the visitor presses Sound.
  - D-minor pad and drone at 84 BPM, with a generated reverb hall.
  - Story cues are quantized to the beat: a reverse-whoosh into a boom on the vortex collapse, a whoosh and kick on the launch, a boom on the landing, a bell as each ring ignites, and on stepping into the light the harmony resolves to D major with a bell arpeggio. At most one cue per beat, so fast scrolling still plays as a phrase.
  - A heartbeat pulse runs through the flight and walk, plus an eighth-note shimmer during the walk, wind that follows scroll speed, and stone footsteps on the camera's footfalls.
  - It fades out when paused, hidden or scrolled past. `?debug-audio` exposes the cue log for checks.
- **CinematicText** (`components/motion/CinematicText.tsx`), adapted from Planes' cinematic-text: words drift down out of a blur and settle, using CSS transitions with a 4 s fallback reveal. It is used by every `SectionHeader`, the cabinets hero, the showroom and the lineup title. `app/layout.tsx` adds an `html.js` class (with `suppressHydrationWarning`) so headings start hidden only when JavaScript runs.
- **Homepage lineup** (`GameReel.tsx`, `app/ds/lineup.css`): a pinned heading column with a live 01/06 counter and progress bar, and portrait game cards using the official game logos; the centre card comes forward. Touch/narrow/reduced motion get a snap rail.
- **Connected systems** (`components/site/SystemsShowcase.tsx`, `app/ds/showcase.css`, content `systems` in `content/site.ts`), on the homepage and products page:
  - A poster stage covers four systems: Collection Management, Link Jackpot, Standard Progressive Jackpots and Loyalty, using the `campaign-v6` posters. Each new poster wipes in over the dimmed previous one with a travelling light edge and a slow push-in, with gentle pointer parallax.
  - The progressive slide fans four real in-game jackpot screens (`public/media/legacy/*-Jackpot*.webp`) over the poster as proof.
  - A vertical accordion index beside it expands the active system's copy, checks and links. Auto-advance is story-style: the progress bar's own CSS animation advances the slide, so it pauses on hover, focus or off screen, and stops for good once the visitor chooses. Arrow keys work. Reduced motion is static.
  - The copy follows Tierplay's published product text. The progressive-jackpot figures (up to 3× more jackpots per machine, 25% faster growth, 40% higher engagement) are shown as Tierplay's own published comparison with the industry average, plus a "confirm current figures" note.
  - The legacy loyalty phone screenshot was not used: it shows another brand (CGL9). Replaces `SystemsSwitcher.tsx`.
- **Cabinets page band:** the spec marquee is replaced by a two-row kinetic band. Outlined cabinet names with their cutouts lead each row; the rows drift in opposite directions and pause on hover. The spec list stays available to screen readers.
- **Two 3D cabinets:** `public/media/models/cabinet-altitude.glb` (913 KB) and `cabinet-pinnacle.glb` (724 KB, meshopt + WebP from the supplied 5.5 MB "CABINET 2.glb"). Per-cabinet anchors, LED roles, screen bounds, framing scale (`fit`) and explorer close-ups live in `components/cabinet3d/cabinetModels.ts`.
  - **Cabinet tour** (`CabinetTour.tsx`, `/cabinets`) has an Altitude/Pinnacle switcher. Each cabinet has 7 fact-only chapters. On a switch, one cabinet spins down through the floor and the other rises and powers on. `#altitude-3d` / `#pinnacle-3d` links open the tour on a cabinet.
  - **360° viewer** (`CabinetExplorer.tsx`) swaps cabinets and has three lighting presets: Studio, Casino floor and Lights out. In Lights out the pointer is a torch.
  - **Homepage showroom** (`CabinetShowroom.tsx`, `app/ds/showroom.css`): a pinned section that gives both consoles equal billing. An index names both from the start. Scrolling turns the Altitude, then hands over to the Pinnacle with the swap transition. Each cabinet has an outlined name, a floor grid and a scan line behind it. Static two-card fallback for reduced motion and no WebGL.
  - **Cabinets page** (`app/cabinets/page.tsx`, `app/ds/cabinets.css`): `CabinetsHero.tsx` stands both consoles side by side in one 3D stage (`pair` mode, equal height) with "Tour in 3D" cards. Below it: a shared-spec ribbon, the tour (thumbnail console picker, "console 1 of 2", and a "Next console" handoff in the final chapter), a "Same core. Two forms." comparison with the published table, and capabilities grouped into Play, Payments, Promotions and Operations with animated line art.
  - **Footer on phones:** GridScan frames its tunnel by width on portrait screens, brightens its lines, drifts on its own without a mouse, and sits behind the closing call to action.
  - **Stage** (`CabinetStage.tsx`): one canvas holds either cabinet.
    - Lighting: studio strip-softbox environment, a pointer-following key light ("move to light it"), a periodic specular sweep, screen-spill area light, and a mirrored floor reflection clipped at the floor.
    - Motion: screen power-on scan line and LED attract-mode colour cycling.
    - Bloom: alpha-preserving `UnrealBloomPass` (threshold 1, eased in close-ups).
    - Measured at 60 fps (16.7 ms median and p95) at 1440×900 and 390×844 on the dev Mac, Chromium/Metal.
- **Production headers:** `next.config.ts` sets a self-hosted CSP that permits local `blob:` texture reads and WebAssembly decoding for the cabinet, plus Permissions-Policy, production-only HSTS, image formats and media cache rules. The production hero and cabinet viewer were checked in a browser with no CSP errors.
- **Responsive/accessibility QA:** tablet homepage cabinet overflow and 320 px prototype overflow were corrected; mobile cabinet fallback stays centered. The guide no longer introduces a duplicate banner landmark, scrollable specifications are keyboard reachable, inactive journey text remains readable, and dim labels meet contrast checks. The portal pause test isolates the WebGL canvas from independently animated page chrome.
- **Design system**, modelled on the cosmoq.framer.website reference (patterns only; no assets copied):
  - Tokens: `app/ds/tokens.css`.
  - Base and chrome: `app/ds/base.css`.
  - Components: `app/ds/components.css` + `components/ds/*` (SectionHeader, Button, GlassCard, Chip, Badge, CheckList, StatBlock, Marquee, Tabs, Steps, Accordion, PageHero, ContactActions).
  - Interactive pieces: `app/ds/interactive.css`.
  - Page compositions: `app/ds/pages.css`.
  - The legacy layers (globals/battlez/brain-theme/content-experience/editorial-refinement/site-redesign) were removed. Total CSS dropped from about 194 KB to about 81 KB.
- **Type:** Inter 4 variable with optical sizing, self-hosted from `app/fonts/InterVariable.woff2` via `next/font/local`.
- **Accents:** violet `#9E05FF` + amber `#FFAC0A`; cyan is used only for focus and interaction states.
- **Every page** follows PageHero → SectionHeader-led sections → the shared closing CTA ("Make room for Tierplay.", with a gradient wordmark over the GridScan footer).
- **Navigation** is a floating glass pill that hides on scroll-down. On mobile it opens a focus-trapped full-screen sheet.
- **Homepage hero copy** is decluttered to a badge, H1, one line and two buttons. The controls sit in one glass pill. Copy safe zones are set per aspect ratio in `components/hero/portal.css`.
- **Guide** (`components/site/TierplayGuide.tsx`, `components/guide/Wizard3D.tsx`, `app/ds/guide.css`): a 3D wizard at the bottom-left and a guided chat. Answers come only from `content/guide.ts`, which draws on `content/site.ts`. There is no AI and no network.
  - **Wizard:** full body on a glowing pedestal (`public/media/mascot/wizard-800.webp`, rasterised from the SVG). Six stacked darkened copies give real thickness when he turns. Pupils track the cursor inside clipped eye openings traced from the artwork, and glance around on touch. He blinks, bobs, leans toward the pointer and carries a rim light; sparks orbit his waist in 3D and the staff orb glows. Moods: hops on hover, waves every 15 s when idle, spins and casts sparks when opened or answering, and looks up while thinking or down at the input while you type.
  - **Smart dock:** every scroll he samples the page under his spot. If he would cover anything readable or pressable he tucks into a 14 px glowing tab at the screen edge, and he steps back out when the space is clear. Hovering or focusing the tab brings him out. The teaser bubble hides when it would cover content and dismisses itself after 11 s.
  - **Chat:** ChatGPT/Lovable-style restraint: neutral surfaces, one border colour, no gradients or glows inside the panel. It opens beside him on desktop and as a bottom sheet with a grab handle on phones (page scroll locked). Home is a centred "How can I help?" with four plain topic cards and example-question pills. Your messages sit in a soft grey bubble; replies are plain text (word-by-word fade) with bullet lists, framed logo or cabinet thumbnails and small link buttons. The composer is a rounded field that grows to five lines (Enter sends, Shift+Enter adds a new line) with a white send button. The thinking state is a shimmering "Thinking".
  - Next's development badge is moved to bottom-right in `next.config.ts` so it doesn't cover the wizard.
- **Hero performance:** stone, vortex and cloud noise read a baked 3D noise texture (`components/hero/noiseTexture.ts`). The fireball point-light shadow was removed and the sun shadow updates every other frame. Median frame time fell from about 55–80 ms to about 17–26 ms on the dev Mac.
- **Hero camera** (`CameraDirector`): establishing descent, handheld breath, collapse squeeze and roll, launch punch with trauma shake, a low tracking flight that leads the fireball, then a ground hero angle, crane and push through the gateway. God rays sample a sharp snapshot of the fireball, and fire bloom eases while the plasma passes behind foreground rock.

## Three.js scene and animation contract

- Keep one persistent canvas for the active hero. Only `CameraDirector` in `PortalCanvas.tsx` changes the global camera.
- `BattleHero` owns the single ScrollTrigger over a 700svh stage (480svh on mobile). It derives four clocks into `PortalState`:

  | Clock | Range | Drives |
  |---|---|---|
  | `raw` | 0–1 | Overall scroll position |
  | `intro` | vortex collapse | The opening collapse |
  | `progress` | story | Departure, flight and assembly; the existing thresholds read this |
  | `finale` | gateway ceremony | The closing sequence |

- The sequence runs in six beats:
  1. **Opening** (matches the supplied reference): a spiral vortex (`Vortex`) inside a broken shell of obsidian plates. The shell is lit magenta through its fractures. Around it sit six floating islands crowned with crystals (cyan, one amber), orbital energy arcs, a sky beam, falling light, a crescent moon, a Milky Way band, a stone dais, a horizon grid and lava-seamed foreground rocks.
  2. **Collapse:** the arms wind in, the shell contracts and trembles, and the core flares into the fireball.
  3. **Departure:** the shell bursts and scatters into the dark.
  4. **Flight and assembly:** unchanged.
  5. **Finale:** the camera cranes around the gateway, the rings ignite in sequence, light climbs the pier seams, and the camera pushes to the threshold.
- Materials:
  - Stone is procedural (`mineralSurface.ts`: basalt/dressed variants, plus `energy` and `lava` options) on fractured geometry (`rockGeometry.ts`).
  - The fireball is a plasma star with a billboard corona (`fireballShaders.ts`).
  - Opening elements live in `OpeningWorld.tsx` + `vortexShaders.ts`.
- Rendering pipeline:
  1. AgX tone mapping.
  2. A NaN/Inf scrub pass before bloom.
  3. Selective fireball bloom.
  4. Occlusion-aware god rays.
  5. Grade: split tone, S-curve, lens aberration, vignette and grain.
- Loading and fallbacks:
  - The canvas is revealed only after `compileAsync`. The preloader waits (bounded) for that before its ignition flare.
  - `hero-portal-still-v1.webp` is the rendered fallback still for reduced motion, Save-Data and no-WebGL.
- Preserve pause/resume, optional muted sound, responsive camera framing and the static fallbacks. Keep high-cost effects conditional on the `balanced`/`compact`/`software` tiers.

## Practical checks

Campaign media check (2026-10-01): typecheck and production build passed; 10 existing content/experience Playwright tests passed in Chromium/Metal. A separate 20-page media check covered Games, Products, Player Journey, Contact Sales and Home at 320, 390, 768 and 1440 px, with no broken campaign images, horizontal overflow or cropped poster frames. Desktop/mobile screenshots were inspected. These are browser viewport checks, not physical-device checks.

Latest verified run (2026-10-01, after adding Lenis smooth scrolling and route transitions): `npm run typecheck`, `npm run build`, and all 49 Playwright tests passed against the production build (`PLAYWRIGHT_BASE_URL=http://localhost:3005`) with Metal and one worker. Earlier (2026-09-30): A separate review checked 15 public routes at 1440×900 and 390×844 in reduced-motion/no-WebGL mode with no horizontal overflow, browser-console errors, or axe violations. The production hero, Altitude tour and 360° dialog also rendered without CSP errors. Physical-device and other-browser checks were not run.

Run `npm run typecheck` and `npm run build` after code changes. Run the relevant Playwright tests and inspect desktop and mobile rendering when presentation changes. Do not report physical-device or cross-browser checks as passed unless they were actually run.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
