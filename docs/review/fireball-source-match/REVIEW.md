# Supplied Toon fireball source matching

Source: user attachment `970a4c98-12ab-4393-8c0f-99c4113df15a/Pasted text.txt`, Toon fireball 2 — Originkit. All three embedded JPEGs match the preserved local assets by SHA-256. `source.png` renders the supplied raw-WebGL implementation with its default colors and speed; other captures show the integrated scene.

Restored original sphere polar coordinates, threshold ordering (.29/.49), blue core #001C56, blue trail #061D99, accent #2518B5 and white base. Original speed=36 produces sphere time −.36 seconds and flame time −.12 seconds. Restored source cylinder profile, .44 flame/.5 steam cutoffs, source envelope equations and normal-alpha blending. Removed invented lavender gradients, extra micro-noise, displacement and Fresnel shading from the sphere.

Shared-scene adaptation: source display colors decode into the scene's linear color space. Dedicated selective bloom uses the source radius/threshold with calibrated gain and blue contribution rather than copying display-space gain into HDR. Non-source mesh materials, points, background and shadow-update state restore in a finally block. Render-target texture identity is retained explicitly after ShaderPass clones uniforms. Bloom resolution caps at 1280 desktop / 640 compact, disabled on software and no-post paths. All render resources dispose on replacement/unmount.

Differences retained deliberately: website camera/framing, no tail at rest, scroll-grown departure tail, and straightened pillar arrival. Source reference has a permanent horizontal tail and its own camera; this integration does not claim pixel identity across those differing compositions or render pipelines. Geometry stays in the existing canvas. Five bloom levels add GPU cost; physical-phone performance remains unverified.

Validation: production build/typecheck pass; four portal checks pass (scroll/reverse, pause, context loss, reduced motion, mobile/remount). Desktop opening/departure/arrival and 390×844 opening inspected. 4K/no-tail check result recorded in STATUS. Original source and scene views retained in this directory.
