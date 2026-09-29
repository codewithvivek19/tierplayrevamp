# Component provenance

Imported UI primitives, where they came from, and how they were changed for Tierplay.

## React Bits

- **Source:** official registry `https://reactbits.dev/r/<Name>-TS-CSS.json`, TypeScript + CSS variants.
- **Retrieved:** 2026-09-29.
- **License:** MIT with Commons Clause. See https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md. Components may be used in this product. Do not resell or redistribute them as a component library.

| Component | Local file | Used on | Adaptations |
|---|---|---|---|
| SplitText | `components/reactbits/SplitText.tsx` | Interior hero titles, every `KineticHeading` | Masked line reveal instead of chars. Text stays readable if the split, fonts or script fail. Cleanup is scoped to its own tween. Skipped under reduced motion. |
| ScrollReveal | `components/reactbits/ScrollReveal.tsx` | Home intro, Products lede, Support statement | Cleanup kills only its own triggers; the source killed every ScrollTrigger on the page, which would break the hero. The invalid `h2 > p` nesting and the blur/rotation were removed. |
| Magnet | `components/reactbits/Magnet.tsx` | Primary CTAs, contact and support links | Writes transforms directly instead of calling `setState` on every mouse move. Mouse only; inert for touch and reduced motion. |
| GlareHover | `components/reactbits/GlareHover.tsx` | Home bento, game reel, board art | Parent-sized instead of fixed width/height props. The glare also plays on keyboard focus of the parent link. |
| TiltedCard | `components/reactbits/TiltedCard.tsx` | Pinnacle cards, board catalogue art | Wraps any media. The mobile warning and tooltip were removed. Inert for touch and reduced motion. |
| FlowingMenu | `components/reactbits/FlowingMenu.tsx` | `/games-collection` | Rows are real Next links with visible detail text and thumbnails. The marquee runs only while a row is hovered or focused; the source animated every row forever. Tweens are killed on unmount. |

| DepthText | `components/reactbits/DepthText.tsx` | Homepage h1 and gateway h2, every interior h1, board rows, game reel titles, footer "Tierplay." | Inherits each heading's font, size and colour instead of fixed props. Supports line breaks and an accent phrase, and wraps on narrow screens. Layers draw through CSS `attr(data-text)`, so textContent, search and copy see the text once. The loop runs only while on screen. Reduced motion shows a static angle. The prop names match the React Bits API. |
| GridScan | `components/reactbits/GridScan.tsx` | Footer background | Webcam face tracking (`face-api.js`) removed in favour of pointer skew. The `postprocessing` bloom, chromatic aberration and noise are folded into the shader, so neither dependency is added. Plain three.js with no React Three Fiber. The WebGL context is created only when the footer comes near and pauses off screen. Reduced motion draws one still frame. |
| ModelViewer (reference) | `components/cabinet3d/useStage.ts` `bindOrbit`, `AltitudeExplorer.tsx` | Cabinets tour, homepage Altitude, 360° viewer | Interaction model only; no code copied wholesale. It borrows inertia orbit (0.925 decay), the 8px touch decision between rotate and scroll, hover tilt, wheel and pinch zoom, fade-in, and auto-rotate that stops on interaction. Custom additions: a spring back to the scroll-tour pose, clickable part hotspots with shortest-turn focus, keyboard orbit and zoom, and double-click reset. |

Masonry was retrieved for evaluation but not used.

## Originkit

- **Access:** the MCP server `https://mcp.originkit.dev/mcp`, used with the account's free-tier bearer token.
- **Terms:** https://www.originkit.dev/docs/licensing.
- **Status on 2026-09-29:** the daily allowance of 10 fetches was used up while browsing the catalogue, before any full source was retrieved. No Originkit source is in the codebase. No local component is presented as Originkit code.

Free components identified for this site:
- `skew-in-text-effect`
- `floating-gallery`
- `interactive-grid`
- `smooth-scroll-slider`

Paid components found in the catalogue, not available on this plan:
- `scroll-text-reveal`
- `kinetic-text`
- `depth-gallery`
- `pixelcard`
- `domino-text-fall`

Two local components solve related problems. Both are Tierplay code written for this site:
- `components/site/GameLogoGrid.tsx` is a 3D lifting tile grid.
- `components/site/GameReel.tsx` is a scroll-driven horizontal reel.

The Smooth Scroll Slider takes over wheel input inside its rail. Review that behaviour before adopting it for page-level content.

## Three.js cabinet

- **Model:** `public/media/models/cabinet-altitude.glb`, a compressed copy of the Tierplay-supplied Altitude cabinet. The former 5 MB copy was removed after checking the tour, 360° viewer and homepage rendering.
- **Embedded screen artwork:** `titan-link-6-flat-screen`.
- `components/cabinet3d/altitudeModel.ts` merges the 882 source meshes into one mesh per material, 13 in total.
- **Lighting:** drei `Environment` with `Lightformer`s, rendered locally with no CDN HDRI; a key spotlight; rim lights; contact shadows; additive LED glow sprites.

## Design reference and icons

- **cosmoq.framer.website** was used as a pattern reference only: the section-header rhythm, glass cards, pill nav, glow-ring buttons, steps, FAQ layout and the closing wordmark. No code, copy or assets were copied.
- **lucide-react** (ISC license) supplies the icons in labels, chips, controls and the guide.
- **Mascot:** `public/media/mascot/wizard.svg` is Tierplay-supplied artwork. Its blues were remapped to violet and its yellows to amber, and the metadata was stripped. The 2.5D effects (tilt, rim light, blink, orb, breath) are layered in `TierplayGuide.tsx` and `app/ds/guide.css`.
