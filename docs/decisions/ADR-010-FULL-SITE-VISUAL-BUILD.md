# ADR-010 — full-site visual build with explicit production slots

Date: 2026-09-26. Status: adopted from explicit user instruction.

## Context

ADR-009 limited work to audit and planning, with later homepage sections waiting for prototype review. After the still-image pack was completed, the user explicitly requested the entire website design now while leaving placeholders for video and 3D assets.

## Decision

Build the complete responsive visual site across the preserved public information architecture. Use the approved generated stills as presentation media. Mark every future video and GLB location directly in the composition with a compact production-slot component. Keep the original recovered logo as the shared brand master.

The build includes the homepage, Games, Cabinets, Products, Player Journey, Contact Sales, 24/7 Support, Up to Date, Games Collection and six `/our_games/` detail routes. The historical `/prototype-01` and `/design-system` remain available as internal reference routes.

## Boundaries

- Generated cabinet stills do not verify physical geometry.
- No fake 3D model, gameplay video, backend, form delivery, technical specification or product claim is introduced.
- Contact uses the existing email path until a verified form destination and privacy text exist.
- The legacy market restriction remains verbatim.
- The real focus, screen-entry and exit sequence remains dependent on approved TP-001 geometry and final film assets.

## Validation

Next.js production build passes. The focused Playwright suite passes at 1440×900, 1024×768, 768×1024, 390×844 and 320×740, plus mobile menu keyboard behavior, core route rendering, reduced-motion behavior and an axe audit.
