# Tierplay — current project state

This is the single current project document. Older briefs, milestone gates and design directions are retired. The source code is the authority for implementation details.

## What has been built

- A Next.js 16 / React 19 site with a cinematic Three.js homepage hero, responsive navigation, a Tierplay preloader and a shared closing invitation/footer.
- Public routes for Games, Games Collection, six Sunscape board pages, Cabinets, Products, Player Journey, Contact Sales, Support and Updates. The design-system and prototype routes remain for internal comparison.
- Tierplay content lives in `content/site.ts`. Recovered source artwork lives in `public/media/legacy/`; generated artwork lives in `public/media/generated/`. The official Tierplay SVG remains the brand logo.
- The site is a local review build. It has no live form backend. Current specifications and availability still need confirmation from Tierplay before public claims are made. Retain the visible market restriction exactly: `not available for Georgia market`.

## Latest changes

- **Cabinet delivery:** the Altitude tour, 360° viewer and homepage use the compressed `public/media/models/cabinet-altitude.glb` (913 KB). The former 5 MB copy was removed after visual checks of its screen art, Tierplay mark, LEDs and hardware.
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

Latest verified run (2026-09-30): `npm run typecheck`, `npm run build`, and all 47 Playwright tests passed with Metal and one worker. A separate review checked 15 public routes at 1440×900 and 390×844 in reduced-motion/no-WebGL mode with no horizontal overflow, browser-console errors, or axe violations. The production hero, Altitude tour and 360° dialog also rendered without CSP errors. Physical-device and other-browser checks were not run.

Run `npm run typecheck` and `npm run build` after code changes. Run the relevant Playwright tests and inspect desktop and mobile rendering when presentation changes. Do not report physical-device or cross-browser checks as passed unless they were actually run.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
