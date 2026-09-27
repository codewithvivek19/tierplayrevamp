# Blender handoff — TP-001 / TP-002 / TP-003 / TP-004

BLENDER ASSET REQUIRED. No high-quality production GLBs are present. The image-based prototype cannot supply true occlusion, materials, exploded parts or camera-plane crossing.

Input package: model-specific front/side/back/top orthographic photos, full dimensions, actual screen geometry/curvature, controls/payment/speaker closeups, real material swatches, approved Tierplay logo vector, manufacturer CAD if available. Confirm all manufacturing details with product owner. Keep conflicting source claims in SOURCE-CONFLICTS until resolved.

Hierarchy for each model: Altitude or Pinnacle root → Body, Trim, ScreenGlass, ScreenDisplay, Controls, Buttons, Validator, Speakers, Lighting, Base, InternalDetails. Add anchors ScreenCenter, ScreenNormal, FocusCameraTarget, GroundContact. World units meters, Y-up, applied transforms, base at y0, documented forward axis. Parts pivot on actual assembly axes. Never add unobserved internals to satisfy a label.

Materials: PBR base color/metallic/roughness/normal/AO with correct color-space flags; display replaceable without replacing cabinet mesh. Glass separate and minimal overlapping transmission layers. Match product photos under neutral lighting before dramatic art direction. UV islands non-overlapping for baked maps; consistent texel density; small brand decals remain legible. No baked game graphics on body texture.

Deliver editable .blend, licensed texture/HDRI sources, GLB LOD0/1/2, KTX2 compressed textures and uncompressed references. Choose Meshopt by measured transfer/decode; Draco only if it wins actual decode/perceptual tradeoff. Validate loaders and texture formats across target browsers. Preserve silhouette and screen UV mapping across LODs.

Acceptance: compare model screenshots to reference at front/side/3quarter, verify dimensions/bounds/ground contact, inspect glass sorting and screen pixel alignment, test mesh naming and material swap, inspect all LODs, report triangles/draw calls/texture allocation/compressed transfer/decode time. Browser context-loss/reload must reconstruct correctly. Budget targets are in ASSET-REQUESTS; no unsupported claim that these counts guarantee performance.

Exploded assembly TP-003 starts only after verified internal drawings. Environment TP-004 uses baked indirect lighting and shared materials, shadow/contact grounding, architectural occlusion, no neon tunnel. Camera start/entry/floor/focus/crossing paths are reviewed in previs against actual geometry. Deliver one approved product still for static fallback from the same asset.
