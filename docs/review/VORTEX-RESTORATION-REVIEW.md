# Vortex restoration review

2026-09-27. User-directed repair of the earlier hero and integration of supplied component resources.

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| High | components/hero/PortalCanvas.tsx | Vortex/orbits removed; slit and wipe substituted | Original vortex composition restored | Preserve the requested scene identity |
| Medium | components/hero/PortalEnergy.tsx | Removed shader animation component | Mounted shader uniforms updated from shared scene time | Make the energy visibly animate at fixed scroll |
| Medium | components/hero/PortalCanvas.tsx | Software rendering at 0.65 pixel ratio; time slowed above 40ms/frame | Native resolution floor; elapsed-time cap of 100ms | Preserve detail and animation pace |
| Medium | components/ui/Lamp.tsx | Static thin line approximation | Animated opposing conic beams and light spread | Use the supplied component's actual visual behavior |
| Low | components/ui/DepthText.tsx | Text-shadow approximation | Layered depth geometry with local pointer response | Retain the supplied depth treatment |
| Low | components/ui/ChromaGrid.tsx | Fixed hover gradient | GSAP-smoothed radial color spotlight | Use the supplied card interaction without replacing content |

Stationary desktop portal crop showed mean absolute RGB change of 16.03 between captures. Reviewed hero, 50% and 70% passage, arrival, mobile hero and lamp, plus active ChromaGrid. Evidence: `restored-vortex-*.png`, `restored-lamp*.png`, `restored-chroma-grid.png`. Mobile width overflow was zero at 390px. ChromaGrid tracking activates on mouse movement; touch/reduced-motion CSS disables the mask and keyboard focus removes it.

Production build and typecheck pass. Initial concurrent test run had 32 passes and one total-time timeout while screenshots competed for software rendering; all four portal checks passed in isolation, including exact paused canvas equality, forward/reverse scroll, fallback and remount. Final full serial test result is recorded in STATUS.md.

Approve inspected Chromium layout and interactions. Physical-device GPU, Safari/Firefox and 10%-speed browser animation-panel replay: not verified.
