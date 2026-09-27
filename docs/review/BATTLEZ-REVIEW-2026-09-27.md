# Battlez adaptation review

Reference: https://battlez-template.framer.website/. Scope: Tierplay homepage redesign, shared visual styling, game catalog cards, navigation and responsive behavior. Reference inspected live for actual colors, Inter font weights, card silhouettes, gradient surfaces, section arrangements and closing orbit panel. Tierplay imagery and content intentionally differ; this is not a pixel-identical copy of the reference's assets or content.

## Reviewed

- Desktop hero, experience triptych, cabinet timeline, game cards and footer screenshots.
- Phone hero and game cards at 390 and 320px; five-width homepage overflow checks.
- Native route links, mobile menu Escape/focus restoration, reduced motion, no-WebGL path, heading structure and automated accessibility audit.
- Fixed mobile header action overriding the existing breakpoint, and decorative glow causing horizontal overflow. Image capture waits for hero decode to avoid misleading blank-media captures.

## Validation

- `npm run build`: pass, 19 generated routes.
- `npm run typecheck`: pass.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3004 npx playwright test tests/experience.spec.ts tests/battlez.spec.ts --workers=2`: 10/10 pass.
- `node scripts/capture-battlez.mjs`: completed, no page errors.
- Screenshot evidence: battlez-desktop.png, battlez-experience.png, battlez-cabinets.png, battlez-games.png, battlez-footer.png, battlez-mobile-390.png, battlez-mobile-320.png, battlez-games-390.png, battlez-games-320.png.

Local preview: http://localhost:3004. No deployment performed. Film and approved cabinet models remain production dependencies. Physical devices, Safari/Firefox, actual screen-reader speech and field performance are not verified. Automated contrast checks cannot establish every image-background contrast combination.
