# ADR-022 — Supplied cosmic background and fireball

Date: 2026-09-28. Status: implemented at the user's explicit request; visual approval pending.

## Scope and source
The user supplied Cosmic BG and Toon fireball 2 (both labelled Originkit) and requested their incorporation into the existing hero and pillar sequence. This supersedes ADR-021's folded ray-marched volume. It does not authorize changes to product geometry, page content or other sections.

Cosmic source: attachment `ccd983a6-6530-4abd-98b6-fc7751fb13ea/Pasted text.txt`. Fireball source: attachment `13b843b7-87a3-41c8-8eeb-ba35d261dfe5/Pasted text.txt`. Embedded Perlin, spark and water JPEGs were extracted byte-for-byte into `public/media/effects/originkit`; its provenance manifest records their hashes. These are supplied component textures, not generated media or recovered Tierplay assets.

## Integration
- One existing R3F canvas, renderer, camera director and GSAP progress source remain. No standalone component canvas, wheel interception, additional animation library or independent animation loop.
- CosmicBackdrop ports nested domain-warped noise into a 768×480 (512×320 compact/software) render target, updated at most 24 times per scene second. That texture is used by the distant world backdrop and existing reflection pass. Six noise octaves, restrained violet/silver colours and a low-horizon fade fit the current scene. The private orthographic camera only renders the texture; it never mutates the global camera.
- Fireball retains the supplied polar texture advection, sphere, displaced flame shell and independent water-noise vapour. Softer thresholds and a subdued palette replace the source's hard toon colour bands. The existing postprocessing handles bloom; the source's five-stage standalone bloom pipeline is not duplicated.
- PortalEnergy moves the same fireball toward the gateway. Its tilted tail rotates upright and changes from a cone to a gently varying column, while the core contracts and brightens. Existing progress windows, camera path, monolith assembly, orbit trails and pointer light remain.
- Fireball updates material-owned uniform descriptors through refs: installed Fiber 9.8 merges the JSX descriptors instead of retaining their scalar objects. A rendered test checks movement inside the sphere itself, rather than inferring it from surrounding particles.
- The sky is placed inside the camera far plane at both desktop and portrait opening distances. Opening cloud coverage and the upper arrival filament have rendered regression checks.
- All clocks use the existing paused/visible sequence time. Background resources and owned texture clones are disposed on unmount. Cached source textures stay loader-owned. Flame/steam share an explicitly owned geometry.
- The original still-image fallback, reduced-motion policy and native touch scrolling remain. Mobile uses fewer mesh segments and the smaller cosmic texture.

## Tradeoffs
This is an adapted mesh-and-texture fireball, not a volumetric fluid simulation. The surrounding procedural islands and architecture have not been rebuilt. Actual browser validation and performance observations are recorded in `docs/review/cosmic-fireball/REVIEW.md`; no claim of physical-mobile or cross-browser certification.

## Opening/departure refinement
The user's follow-up requests the sphere alone at rest. Flame and steam start hidden, then grow and fade in over progress .32–.48, matching the existing travel start at .32. Scroll reversal retracts them deterministically. Once revealed they persist through pauses in scrolling and morph into the pillar column. Continuous core animation remains active. Additional counter-flowing noise frequencies and derivative-filtered narrow filaments improve close detail; sphere tessellation increases modestly. This is shader detail, not a claim that the original supplied small JPEGs became 4K assets. A 3840×2160 rendered viewport is included in visual validation.
