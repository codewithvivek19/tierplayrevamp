# Tierplay V2 governance
Mission: a cinematic interactive technology experience, never a template site.
Read this file, docs/DESIGN.md, MOTION.md, WEBGL.md, PERFORMANCE.md, STATUS.md and relevant docs/ADR entries before architecture changes.
Build milestone by milestone. Current governing specification: docs/MASTER-SPEC-2026-09-26.md. Read CURRENT_MILESTONE.md, PROJECT_STATE.md and docs/decisions/ADR-009-AUDIT-FIRST-RESET.md first. Current assignment is forensic audit/reference planning only; do not implement the site. Next prototype must be boot → entrance → gaming floor → one real Altitude → focus → screen entry → exit. No later sections until review. New audit/design/assets docs supersede older 2.5D scope; missing cabinet GLBs require explicit asset briefs, not invented models.
One animation owner per property: GSAP owns choreography, scroll and DOM/WebGL synchronization; Motion owns menus/buttons/component transitions; Three/R3F owns scene objects/materials; CSS owns simple micro-interactions. Only CameraDirector mutates the global camera. One persistent canvas. Do not introduce a new style without DESIGN.md.
Reference libraries supply primitives, never the design identity. Preserve original recovered assets; derivatives go in public/media. Generated assets remain separate. Verify every product specification and legal claim before publishing. Retain the legacy market restriction verbatim.
Every expensive effect needs a fallback. Mobile is independently composed. Essential content stays semantic HTML. Update docs/STATUS.md after meaningful work. Record non-obvious architecture decisions. No fake backend, telemetry, models or product claims.
Validation: typecheck, production build, Playwright desktop/mobile/reduced-motion/fallback, rendered screenshots and interface review. Never report unavailable physical-device, GPU or cross-browser tests as passed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
