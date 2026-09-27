# WebGL
Current homepage: ADR-012's procedural PortalCanvas, one deferred R3F canvas. Real geometry for portal stones, debris, cities, stars, planet, trails and foreground; shader discs for energy and atmosphere. Original still stays beneath the canvas until readiness and returns on renderer failure. No product cabinet is modeled. Environment lighting is local/procedural; planar floor reflections are desktop only. CameraDirector remains the sole camera writer.

One persistent ExperienceCanvas mounted inside the homepage stage. One CameraDirector; typed BOOT, CABINET_MACRO, CABINET_REVEAL, CABINET_HERO, PORTAL_APPROACH, PORTAL_TRANSITION, SUNSCAPE_WORLD states.
No CAD or verified GLB currently supplied. Use authentic product image for silhouette, not invented box geometry presented as product. M1 uses an image-based 2.5D cabinet composition; true material macro and orbit await original CAD/orthographic views.
Demand renderer; camera frame mutations are refs, not React state. Scenes preload/mount/activate/progress/deactivate/dispose. Use loader cache deliberately; do not dispose shared textures from a child. Error boundary and context-loss handling return to DOM image, never blank screen.
Start without shadows/postprocessing. No giant textures, realtime reflections or bloom to conceal poor media. Next worlds stay unloaded. Observe visibility and pause work in hidden tabs.

## V2 rendering
Single full-stage plane with image-depth parallax shader; two generated textures transition from cabinet screen origin into dragon world. Real depth-bearing ember points cross the frame. This is explicitly a 2.5D experience, not an articulated 3D product model. CameraDirector handles camera, shader owns image displacement; no duplicate DOM transform ownership. Continuous subtle atmospheric updates only while visible/motion-enabled. DOM fallback always beneath the canvas.
