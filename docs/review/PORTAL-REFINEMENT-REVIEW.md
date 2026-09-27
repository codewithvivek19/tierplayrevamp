# Portal refinement — 2026-09-27

Preview: http://localhost:3004. Decision: ADR-013.

## Delivered
The hero now moves through three states: an editorial opening, a camera passage through the portal, and the approved entrance image. The outgoing text and links leave before the camera advances. The entrance expands from the portal aperture and settles into the overview below. The sequence reverses on upward scroll. “Enter the experience” provides a native button alternative; skip and pause controls stay available.

Particle dynamics use spring attraction, drag, pointer repulsion and velocity-oriented glints, with 2,800 particles on the high setting and 950 on mobile/balanced settings. Stone separation now has damped inertia. Ring fragments form a more cohesive broken silhouette. Moving highlights travel around the orbital paths. Desktop postprocessing adds restrained bloom, with original violet/obsidian lighting and an independently composed mobile view.

## Reference limits
https://activetheory.net/ was inspected in a browser. The rendered reference exposed atmospheric particles and a central dimensional identity but displayed “Your browser is not supported”; its full navigation and transitions could not be inspected. Tierplay's implementation is original and uses its own environment, identity and assets.

## Validation
Production build and typecheck passed. The final production run on localhost:3004 passed all 14 focused Chromium tests in 17.0 seconds. Browser verification covers five responsive widths, menu keyboard/focus behavior, route navigation, reduced-motion axe, forward/reverse passage, arrival visibility, outgoing inert links, pause pixel stability, context loss, live preference changes, and single-canvas remount. The earlier arrival test used the exact fade endpoint and failed at opacity 0.999998; it now advances beyond that endpoint and passes.

Screenshots: [opening](portal-refinement/desktop.png), [passage](portal-refinement/passage.png), [threshold](portal-refinement/threshold.png), [entrance](portal-refinement/arrival.png), [overview](portal-refinement/overview.png), [390px](portal-refinement/mobile-390.png), [320px](portal-refinement/mobile-320.png), [still](portal-refinement/still.png).

## Performance and remaining limits
The automated browser uses SwiftShader software rendering, not the host's physical GPU. A first 1440×900 sample measured median 116.6ms / p95 133.3ms frame intervals and exposed resolution being reset by the Canvas parent. Quality is now owned by PortalCanvas so software mode consistently uses 0.65 DPR; both software and mobile/balanced settings omit bloom and live reflection. The final 100-frame sample measured median 66.6ms / p95 66.7ms at a 936×585 drawing buffer. That is an improvement but still about 15fps on this software renderer, not a smoothness pass. Raw sample: [performance.json](portal-refinement/performance.json). These are software-renderer observations, not a claim of 60fps or physical-device performance.

Geometry remains a procedural interpretation of the source image. Particle/fragment forces are art-directed dynamics without collision simulation. The entrance is an image-based reveal, not a modeled room. Physical devices, Safari/Firefox, screen-reader use and field Web Vitals remain unverified.
