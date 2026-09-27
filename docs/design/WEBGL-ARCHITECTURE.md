# Proposed WebGL architecture

No implementation in this assignment. Reuse existing infrastructure only where it meets the new contract.

BOOT → ENTRANCE → FLOOR_REVEAL → CABINET_IDLE → CABINET_FOCUS → SCREEN_APPROACH → SCREEN_CROSSING → EXIT.

Each transition has enter, update, settle, cancel, exit and cleanup. Focus can return to idle; approach can cancel to focus; Exit ends Prototype-01. User skip reaches floor or DOM equivalent; direct routes bypass cinematics. Transition promises carry an operation id so stale asset completion cannot change current state.

- ExperienceCanvas: single canvas within immersive route group, error boundary and DOM fallback. No hidden second renderer.
- SceneDirector: typed phase and mounted resource ownership; inactive objects stop updates.
- CameraDirector + CameraPath: one writer for pose, target, FOV; authored splines computed from model screen anchors. Delta-time damping only for small user offsets. Semantic progress maps to distance/phase, not raw scrollY.
- LightingDirector: baked room/environment map plus small dynamic key/emission changes; no arbitrary light collection.
- InteractionDirector: raycast cabinet maps to same focus/select commands as HTML buttons and keyboard. Touch focus is distinct from entering.
- TransitionDirector: cabinet screen plane supplies crossing normal/UVs; RGB grid resolves near surface then destination replaces it. Transition material only mounted while needed; not a black fade.
- Cabinet entity: vetted GLB node/material contract and LOD. Never substitute boxes or a flat generated image as production hardware.
- CabinetScreenMaterial: replaceable ScreenDisplay material; separate ScreenGlass. GameMediaController sequences poster/video using ScreenMediaManager decode/cleanup. ScreenTransitionMaterial owns RGB grid/crossing uniforms. One active video, mute by default.
- AssetManager: critical/hero/gaming-floor/cabinet-altitude/cabinet-pinnacle/game-media/technology/secondary-pages bundles; readiness from actual fetch/decode. Progress fraction only if manifest byte totals accurate; otherwise named resource readiness. Abort unused requests and preserve retryable cache semantics.
- PerformanceManager: sample frame durations with hysteresis, use save-data/motion/memory/pointer hints; downgrade DPR, texture/LOD and effects; STATIC always selectable. No precise capability inference from viewport alone.
- AudioDirector: optional after explicit unmute gesture; fades synchronized with phase; suspension on hidden tab and no surprise restart.
- DOM: source content, status, navigation, skip/focus/enter/return, error retry and specifications remain outside canvas. Canvas decorative to assistive technology; same state powers textual controls.

Folder targets: experience/, camera/, scenes/{BootScene,EntranceScene,GamingFloorScene,CabinetScene}, entities/{Cabinet,GameScreen,Environment}, directors/, shaders/, performance/, data/. Do not create empty future scene scaffolding. Later technology and jackpot modules enter only at their milestones.

Central config targets: motion.config.ts, camera.config.ts, scene.config.ts, performance.config.ts. Typed content uses id, legacyUrl, sourceSnapshot, factualCopy, marketingCopy, approvalState, conflicts and assetIds; preserve source data separate from render code.

Native scroll remains baseline. Lenis is optional only after comparative prototype evidence; GSAP governs choreography, Motion small DOM interactions. No new physics or postprocessing dependency without measured need. Context loss or model/video failure reveals approved still + complete HTML with retry. If an approved still is also missing, record asset blocker during development; never replace required media with generic visuals.
