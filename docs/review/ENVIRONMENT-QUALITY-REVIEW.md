# Environment rendering refinement

Scope: visual rendering only; retain the accepted scroll sequence and camera path.

Reworked portal shading into broad rotating turbulence with fine internal detail and a warm focal core. Removed the hard bright perimeter and reduced overall emission. Particle size is now capped at seven drawing-buffer pixels, with much smaller seeds and subdued halos. Stone uses world-space mineral seams rather than high-frequency glitter. Hero fragments taper and fracture before assembly. Irregular cliff geometry replaces stretched smooth primitives. Warm key light, cool edge light and hemisphere fill reveal the surfaces; bloom has a higher threshold and smaller radius.

Build/typecheck passed. Initial desktop rendering showed no shader compilation errors. Final desktop/mobile renders and portal regression results are recorded after verification. High-tier physical GPU, Safari and Firefox testing remain unavailable; software-renderer screenshots demonstrate the balanced path only.

Final verification: 12/12 focused Chromium checks passed in 26.9 seconds, including reverse scroll, exact paused-canvas pixel equality, context loss, mobile remount, responsive layouts, reduced motion and axe. Desktop 1440×900 and mobile 390×844 screenshots were reviewed (`environment-quality-hero.png`, `environment-quality-gateway.png`, `environment-quality-mobile.png`). Capture reported zero console errors and no mobile horizontal overflow. Production preview refreshed at http://localhost:3004. These changes improve procedural rendering; they do not establish photo-exact fidelity to the supplied artwork.
