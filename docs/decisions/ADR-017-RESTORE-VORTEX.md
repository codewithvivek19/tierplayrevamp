# ADR 017 — Restore the vortex and integrate supplied effects

2026-09-27. Supersedes ADR 015's removal of the vortex and ADR 016's decision to approximate all supplied effects with static CSS.

The user explicitly rejected the last two visual revisions and requested repair of the earlier hero composition. Git history and saved renders show that the vortex and energy orbits had been removed, replaced by a vertical fracture and foreground stone wipe. This was a design regression, not simply a failed asset request.

Restored the original portal, energy orbit trails, floating islands and orbital stone arrangement. Retained the working destination architecture, single canvas, GSAP progress ownership and semantic controls. The new PortalEnergy component updates the mounted shader materials directly through refs. Atmosphere and mist use the same direct uniform update approach. Removed the replacement slit/wipe from the rendered tree. Animation elapsed time now tolerates frames up to 100ms rather than slowing time above 40ms. The balanced/software resolution floor is native pixel resolution, with a higher cap for capable devices; expensive reflection/bloom still has a balanced fallback.

The attached resources are treated as reusable effects, not instructions to rebuild the project stack. Lamp now animates its original opposing conic beams in the shared footer using the installed Motion package. DepthText uses the supplied layered text geometry, local pointer tracking and no idle loop. ChromaGrid retains its GSAP-smoothed spotlight and grayscale mask while wrapping the existing semantic game cards. Touch, keyboard focus and reduced motion retain full-color usable content. Other shader demos are deferred to avoid competing renderers and redundant effects.

Restored the earlier hero headline. Product routes, product evidence and market restrictions are retained. Physical-device GPU and non-Chromium browser testing remain unavailable.
