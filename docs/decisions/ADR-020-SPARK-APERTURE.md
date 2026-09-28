# ADR-020: Replace only the vortex energy with a spark aperture

Date: 2026-09-28. Status: implemented under the user's explicit request.

The user approved the surrounding environment and choreography, but requested a faster metal-cutting/chakra energy effect and scroll-triggered lightning instead of the soft cloudy vortex. This supersedes the old vortex's shader appearance only.

## Decision

Keep PortalEnergy in the existing scene hierarchy and retain its scale/visibility envelope, orbit trails and beam. Replace the cloudy disc with thin moving filament tracks, a small white-blue focal caustic and a dark aperture. Gold/white sparks cool toward amber and occasional violet, complementing the established violet environment.

PortalSparks draws 1,800 desktop or 850 portrait instanced ribbons in one draw call. Deterministic seeds drive rotating emitters, independent ballistic release, gravitational drop, tapered streaks and cooling on the GPU. This is an artistic ballistic approximation, not a rigid-body simulation or collision system. It needs no external assets or CPU particle loop.

Scroll speed is derived from the existing sequence progress in either direction, then damped into an energy value. It brightens sparse branching rim arcs and increases spark speed/length; it never owns scroll or the camera. Pausing freezes sequence time and the energy envelope. Existing reduced-motion, save-data, context-loss and static-image fallbacks remain intact.

Shader edge inputs to fractional powers are clamped: raster interpolation can otherwise produce negative values and NaNs, which spread through bloom without a console error. A rendered-pixel regression check samples successive frames and checks both scene detail and actual animation.

## Verification

See `docs/review/spark-portal/REVIEW.md` and `metal-review.json`. No change to the hero copy/layout, stones, islands, assembly timeline or destination architecture was made for this request. Physical phone, Safari and Firefox validation remains unavailable.
