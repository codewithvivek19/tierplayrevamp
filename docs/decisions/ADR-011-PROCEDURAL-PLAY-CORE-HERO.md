# ADR-011 — procedural Play Core hero

Date: 2026-09-27. Status: adopted from explicit user instruction.

## Context

The user requested a cabinet-free cinematic hero, authored in Three.js without requiring a Blender model, then explicitly requested implementation. This supersedes the earlier cabinet-led opening and audit-only limitation for the hero. ADR-010 continues to govern the rest of the website.

## Decision

Replace the homepage opening with an abstract chrome Play Core. Native scrolling controls three chapters: Ignite, Unfold, and Enter world. The nucleus fractures, gyroscope rings rotate and open, six recovered game-art artifacts appear, and a circular transition reveals the existing dragon-world artwork. The original Tierplay logo remains in the shared header.

- One lazy-loaded R3F canvas; no GLB, film, remote texture or environment dependency.
- GSAP owns scroll progress and HTML choreography. CSS sticky positioning retains native scrolling; there is no wheel interception or scroll hijacking.
- CameraDirector alone owns camera movement. Scene objects consume the shared progress ref without per-frame React state.
- Instanced particles and ring ticks; a locally generated PMREM environment; device pixel ratio capped at 1.5; demand rendering and visibility suspension.
- Chapter buttons and game-art selection remain semantic HTML, with current/selected states, keyboard support, and a polite selection label. Inactive chapter controls are inert.
- Mobile/tablet uses a shorter sequence and an independently positioned scene. Short viewports, reduced motion, save-data, explicit `?no-webgl`, and WebGL failure use the static SVG composition. Pause releases the canvas and resumes from the opening.

## Boundaries

The core is expressive brand artwork, not a physical product model or a claim about AI, NFT ownership, or a real gaming system's internals. Existing cabinet/film placeholders and all downstream content remain unchanged. The six orbiting images are game artwork, not an assertion that six boards share a hardware configuration.

## Validation

Production build and TypeScript checks, responsive browser tests, chapter selection/reversal, keyboard entry, pause/resume, reduced-motion and WebGL fallback audits, plus rendered desktop/tablet/phone review. Exact final results are recorded in `docs/review/HERO-REVIEW-2026-09-27.md`. Physical device, Safari/Firefox, GPU timing and screen-reader speech output are not validated here.
