# Tierplay — current project state

This is the single current project document. Older briefs, milestone gates and design directions are retired. The source code is the authority for implementation details.

## What has been built

- A Next.js 16 / React 19 site with a cinematic Three.js homepage hero, responsive navigation, a Tierplay preloader and a shared closing invitation/footer.
- Public routes for Games, Games Collection, six Sunscape board pages, Cabinets, Products, Player Journey, Contact Sales, Support and Updates. The design-system and prototype routes remain for internal comparison.
- Tierplay content lives in `content/site.ts`. Recovered source artwork lives in `public/media/legacy/`; generated artwork lives in `public/media/generated/`. The official Tierplay SVG remains the brand logo.
- The site is a local review build. It has no live form backend. Current specifications and availability still need confirmation from Tierplay before public claims are made. Retain the visible market restriction exactly: `not available for Georgia market`.

## Latest changes

- **Hero performance and smoothness** (`PortalCanvas.tsx`, `BattleHero.tsx`):
  - Before the still image hands over to 3D, the scene compiles every shader (including objects that appear later), uploads every texture and draws everything once offscreen. It then times ~20 real frames and tunes itself for the device: balanced tier, then a resolution step-down, then post-processing relief (main bloom off, then the fire pass on alternate frames). It waits for the fireball's textures, so slow networks never mount it mid-scroll.
  - Weak GPUs (integrated/older mobile, by renderer string) and ≤4-core or ≤4 GB devices start on the balanced tier.
  - At runtime only resolution and pass toggles adapt, never lights, shadows or materials, so nothing recompiles while scrolling. The gateway's point lights now live outside the group that toggles visibility (toggling lights changed the light count and recompiled every lit shader halfway through the scroll).
  - The fire-only pass uses `scene.overrideMaterial` (plasma meshes opt out with `allowOverride = false`) instead of swapping materials on every mesh each frame.
  - Slow connections (`effectiveType` 2g/3g), Save-Data, or arriving already scrolled keep the designed still hero.
  - Measured on the production build in Chromium/Metal, scripted 6 s scroll down and back: desktop 1440×900 median 16.7 ms / p95 33 ms (was 33 / 67 ms with 1.3 s freezes); phone 390×844 median and p95 16.7 ms; phone with 4× CPU throttle median and p95 16.7 ms.
- **Hero finale camera:** after the plasma lands and becomes the pillar light, the camera is one continuous centripetal-spline move with a level horizon and no handheld noise. Beats: ground-level hero angle on a longer lens with the gateway on the right third (Deakins/Villeneuve), a crane up as the light climbs the seams, then a centred one-point push through the arch with a slow dolly-zoom (Kubrick). Everything before the landing is unchanged.
- **Homepage lineup** (`GameReel.tsx`, `app/ds/lineup.css`): a pinned heading column with a live 01/06 counter and progress bar, and portrait game cards using the official game logos; the centre card comes forward. Touch/narrow/reduced motion get a snap rail.
- **Connected products** (`SystemsSwitcher.tsx`, `app/ds/systems.css`), on the homepage and products page: accessible tabs (arrow keys, Home/End). One live SVG diagram rearranges its eight machines and hub between the systems. Collection management shows an operator console reaching three locations along a route, with commands flowing out. Link Jackpot shows machines in a ring feeding a shared jackpot core; its meter fills, a hit bursts back to one machine, and the cycle repeats. Replaces `LinkJackpotNetwork.tsx`.
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
- **Guide:** `components/site/TierplayGuide.tsx` is a wizard mascot (the recoloured `public/media/mascot/wizard.svg`, 2.5D tilt/blink/orb) and a guided chat. Its answers come only from `content/guide.ts`, which draws on `content/site.ts`. There is no AI and no network.
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

Latest verified run (2026-10-01, after the hero performance, finale camera, lineup, systems and band work): `npm run typecheck`, `npm run build`, and all 49 Playwright tests passed with Metal and one worker. Earlier (2026-09-30): A separate review checked 15 public routes at 1440×900 and 390×844 in reduced-motion/no-WebGL mode with no horizontal overflow, browser-console errors, or axe violations. The production hero, Altitude tour and 360° dialog also rendered without CSP errors. Physical-device and other-browser checks were not run.

Run `npm run typecheck` and `npm run build` after code changes. Run the relevant Playwright tests and inspect desktop and mobile rendering when presentation changes. Do not report physical-device or cross-browser checks as passed unless they were actually run.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
