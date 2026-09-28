# Material and lighting refinement

Visual contract: preserve the supplied fireball, its departure-only tail, the orbital assembly and the gateway camera path. Separate fractured rock from polished obsidian; keep the luminous subject legible against a quieter sky. No new product geometry or page sections.

Applied the installed threejs-skill-router, procedural-materials and visual-validation guidance. Material color, relief and roughness derive from shared geological fields. Object-local coordinates retain orientation and account for object/instance scale. Filter microstructure by screen footprint and increase roughness for normal variance. Obsidian uses a restrained dielectric clearcoat rather than high metalness. Neutral key/rim lighting, narrower reflection sources and darker wet-floor response reduce the plastic appearance.

Diagnostics: `?no-preloader&no-post` disables postprocessing; `&surface-debug=roughness` and `&surface-debug=veins` inspect material fields. Existing deterministic geometry seeds, camera path and progress values are retained. Captures cover progress 0, .55 and .97, desktop 1440×900 and portrait 390×844. results.json records eight captures with no console errors or horizontal overflow. Mobile retains the cheaper rendering tier; no new render target or asset download is introduced. High-tier shadow map increases from 1024² to 2048².

Typecheck and production build pass. The rendered 4K/no-tail/reverse-scroll check passes. Four portal regressions pass, including pause, scroll reversal, context loss, reduced motion and mobile route remount. The initial two failures were caused by old tests selecting the preloader's new 2D canvas; the scene suite now disables that unrelated intro explicitly.

Limits: these are procedural real-time materials, not scanned production assets or offline VFX. Existing city silhouettes and the supplied mesh fireball remain stylized. No claim of photorealism, 100× performance, physical-device validation or measured GPU frame time. Safari and Firefox are unverified. The preexisting automatic quality downgrade can still change reflection appearance under load.
