# ADR 016 — Supplied UI primitives in the existing site

Date: 2026-09-27

The user supplied LampContainer, DepthText, GradientWaves, WebThreads, ChromaGrid, GhostCursor, Lightning and LaserFlow examples and asked for an audit and selective integration into existing sections.

The source snippets' setup instructions are reference material, not a mandate to migrate this established TypeScript/Next site to Tailwind or shadcn. The shared footer uses a small CSS adaptation of LampContainer in `components/ui/Lamp.tsx`. The existing game cards gain ChromaGrid-style localized color on hover and keyboard focus. The existing ecosystem strip becomes a continuous CSS marquee with a static reduced-motion state. Existing sections receive Tierplay violet atmospheric gradients and the hero/closing headings have restrained type depth. No extra section, renderer or canvas was introduced.

GradientWaves, WebThreads, GhostCursor, Lightning and LaserFlow all add animated rendering or cursor effects that would compete with the persistent Three.js hero canvas and raise GPU cost. Their visual ideas are represented through CSS in existing surfaces where appropriate. The full multi-layer DepthText effect was also declined for legibility and motion cost; a shallow type shadow carries the useful depth cue. Motion remains owned by the existing scene and CSS microinteractions.

The hero audit removed miniature floating structures and ornamental floor rings, reduced debris, and replaced generic introductory copy with the verified six-game, two-cabinet range. The physical cabinet GLBs remain unavailable; no model is invented.
