from pathlib import Path
def w(p,s):Path(p).write_text(s.strip()+'\n')
files={
'DESIGN-SYSTEM':'Draft M02 input, not an implemented or approved design system. Precision showroom: product geometry leads, architecture supports, DOM tells the facts. Use semantic tokens rather than values scattered across components. Reuse installed fonts for isolated comparisons before buying/replacing type. Controls use clear labels, rectangular geometry, visible focus and consistent hierarchy. No flashy library-driven identity. Test cabinet stage, catalogue row, technical annotation and both forms in isolation.',
'TYPE-SYSTEM':'Draft. Existing local Manrope for body/UI and Barlow Condensed for selective display are available. Compare large Manrope vs condensed display in M02. Body16–18px, line-height1.5–1.65; captions minimum14px where space allows; main display clamp48–112px with mobile line breaks authored. Keep factual text readable at200% zoom, body measure60–70ch, tabular numerals for approved specifications. Monospace only asset/readiness labels, never all content. No speculative metrics.',
'COLOR-SYSTEM':'Draft. Near-black #0b0c0e, graphite #181a1e, warm-white #f3f0e9, muted #a9aaad; source brand logo determines eventual accent. Existing red #ed342f is provisional action accent, not a recovered brand standard. Game color belongs within screen/active media. Tokens: background, surface, text-primary, text-secondary, action, focus, error, status. Measure every actual text/control contrast in M02; no approval inferred from palette alone. Avoid using color as the only state signal.',
'SPACING-SYSTEM':'Draft. Base4px; intended steps4/8/12/16/24/32/48/64/96/128. Body groups use16–24; section rhythm64–128 desktop and40–72 mobile. Touch targets≥44px, preferably48. Product stage clearance based on cabinet bounds and DOM safe regions rather than fixed screenshots. Do not pad every section into a card.',
'GRID-SYSTEM':'Draft. Desktop12 columns, tablet8, mobile4; gutters24/20/16; outer margin clamp20–80px; content max1440px with stage permitted full bleed. Hero cabinet and text occupy separate safe zones. At ultrawide retain product scale and widen breathing room; at portrait stack product and content. Long technical copy has narrower independent measure. Test landscape tablet and small laptop, not only desktop/mobile.',
'MOTION-SYSTEM':'Draft. See MOTION-DIRECTION and WEBGL-ARCHITECTURE. Micro150–300ms; UI250–500ms; section500–1200ms; camera800–3000ms; cinematics2–8s maximum envelope. Use deliberate easing with continuous velocity. Camera/lighting/screen are separately owned; one writer per property. Every long transition has skip/cancel and reduced-motion cut. Runtime constants centralized at M02/M03.',
'INTERACTION-SYSTEM':'Draft. A cabinet is idle, focused or selected; hover and keyboard focus expose same metadata. Tap focuses, labelled Enter selects. Enter/Space activate controls, Escape cancels focus/inspection, native navigation always reachable. No model scale on hover. Forms use visible labels, required indicators, inline errors plus error summary, pending and genuine server success. Menu closes with Escape and returns focus; modals, if used, trap focus and restore it. No canvas-only controls.',
'RESPONSIVE-SYSTEM':'Draft. Composition tests:2560×1080,1440×900,1280×800,1024×768,768×1024,430×932,390×844,320×740; include200% zoom/orientation changes. Mobile camera path shorter and product centered; first tap focus/second explicit CTA entry. One visible video, lower texture/LOD, baked shadows. Reduced motion is a separate preference from performance tier. Static keeps exact content/navigation/forms. Quality tiers ULTRA/HIGH/BALANCED/LOW/STATIC are proposed capabilities, not viewport breakpoints; frame sampling and hysteresis before enabling extra effects.'}
for n,s in files.items():w('docs/design/'+n+'.md','# '+n.replace('-',' ').title()+'\n\n'+s)
w('docs/decisions/ADR-009-AUDIT-FIRST-RESET.md','''# ADR009 — new master specification governs scope

Date2026-09-26. Status: adopted from explicit user instruction, not visual approval.

Issue/evidence: new spec requires forensic preservation and a real cabinet showroom, while current app is a single 2.5D concept with three anchors/mailto. Prior route recovery omitted /our_games/ details and published contact/support/collection routes. No verified GLB exists.

Decision: finish M00 public audit and M01 planning only. Preserve current app/source assets as history; no app redesign in this turn. New docs under audit/design/assets plus continuity files supersede old M1 scope and ADR0008 for future work. Old test and Lighthouse results are historical observations, not acceptance of new requirements.

Smallest change: documentation, source snapshots and audit utilities only. No runtime refactor, package installation, publishing or generated media. Regression risk: none to app behavior; stale-document ambiguity mitigated by pointers. Keep existing files instead of deleting history.

Asset dependency: approved Altitude geometry needed before flagship visual prototype; TP-001 blocks it. Asset briefs do not authorize placeholder product geometry. All later homepage sections await prototype review.
''')
w('PROJECT_STATE.md','''# Project state

2026-09-26: New master specification adopted. Audit/planning only completed this turn; app untouched.

Public recovery:9pages +6game entries +1default post; no public production GLBs. Source TLS mismatch recorded, form delivery not tested. Correct /our_games/ routes recovered; previous guessed routes are not evidence. Full artifacts in docs/audit, docs/design, docs/assets and docs/MILESTONE-PLAN.md.

Current runtime is a historical 2.5D dragon/cabinet concept at port3001, not Prototype-01 under the new spec. Prior10tests pass and86/100/100 local Lighthouse are historical; no new runtime test run needed for documentation-only work. Main blocker: TP-001 approved Altitude model; additional source conflicts and operational content holds listed in KNOWN_ISSUES.

What changed: source snapshots, forensic matrices, concrete reference map, proposed homepage order, design-system drafts, architecture/asset briefs/milestone plan and continuity. Why: preserve real business/IA and stop substituting concepts for production assets. Performance implication: none to current app. Proposed future budgets documented, not measured.
''')
w('CURRENT_MILESTONE.md','''# Current milestone

M00 forensic audit + M01 reference/direction planning delivered for review. No site implementation authorized within the FIRST ASSIGNMENT. Public evidence coverage complete for recovered published records; content verification, reference interaction depth and model production remain outstanding.

Next implementation: M02 isolated design/control proofs, then M03 foundation. M04 stops strictly at Boot → Entrance → Gaming Floor → ONE Altitude → Focus → Screen Entry → Exit. Later homepage sections must wait for prototype review. BLOCKED BY ASSET: TP-001 for physical cabinet prototype.
''')
w('DECISIONS.md','''# Decisions index

- Current governing spec: docs/MASTER-SPEC-2026-09-26.md.
- docs/decisions/ADR-009-AUDIT-FIRST-RESET.md supersedes earlier M1 and image-based hero acceptance assumptions.
- Preserve actual legacy paths, including /contact-sales/, /24-7-support/, /games-collection/ and /our_games/*.
- Preserve factual claims with provenance; resolve conflicts before publishing, never invent substitutes.
- Deprecate default WordPress post and placeholder testimonials explicitly; retain source evidence.
- Prototype requires actual product geometry, one camera owner, semantic DOM parity and no unskippable movie.
- No new dependencies, generated images, runtime refactors or publishing in this assignment.
''')
w('KNOWN_ISSUES.md','''# Known issues

1. TP-001/002: approved Altitude/Pinnacle GLBs and dimensions unavailable. True screen entry/inspection blocked.
2. TP-003: no verified internal assembly for exploded views; no fictional internals allowed.
3. Source conflicts: jackpot counts, sixth board title/content, shared cabinet HD/4K/curvature claims, legacy phone numbers and support claims. See docs/audit/SOURCE-CONFLICTS.md.
4. Missing valid flyers, legal/social destinations, authentic testimonials/partners and operational form configuration. Contact Sales has real legacy AJAX action but delivery untested; no submissions sent.
5. Games Collection contains additional image-only identities (sugar_rush, spirit_of_76, sea_world, gemstone_cavern, full_throttle, yetis_terror), not verified as Tierplay-owned games. Preserve evidence and clarify catalogue relationship.
6. Public legacy host certificate mismatch; ordinary secure fetch fails. Recovered content is public snapshot evidence, not proof of secure operation or current business validity.
7. Current app lacks legacy business routes and forms; current generated art not identity-approved. No boot/architectural floor/product GLB.
8. Prior throttled LCP4.3s exceeds2.5s target. Hardware GPU/memory/cross-browser/field INP testing unavailable; previous rAF sample is not GPU timing.
9. Active Theory Work control failed during observation; exact camera behavior not verified. Other reference proposals are explicitly separated from observed evidence.
10. No production hostname/redirect deployment plan approved. Keep prototype noindex.
''')
w('NEXT_ACTIONS.md','''# Next actions

1. Review docs/audit/README.md, SOURCE-CONFLICTS and route/content matrices. Resolve sixth board and source-image identity gaps with owner documentation; do not edit factual copy by guess.
2. Review docs/design/REFERENCE-MAP.md and PROPOSED-HOMEPAGE-SEQUENCE.md. Confirm added homepage teasers as explicit IA changes.
3. Acquire TP-001 measured Altitude reference package/GLB and TP-004 room; commission briefs in docs/assets. Approved still required for static proof.
4. Implement M02 isolated typography/navigation/entry/focus/form controls only after analysis review; no full home build.
5. Build M03 deterministic directors/loading/error lifecycle, then M04 one cabinet prototype when assets satisfy contract.
6. Record actual visual/motion/mobile/CPU/GPU evidence and stop at screen entry for review. Do not expand because a build/test passes.
''')
p=Path('AGENTS.md');s=p.read_text();s=s.replace('Build milestone by milestone. Scope now: foundation and one cabinet → screen → Sunscape prototype. Do not expand beyond M1 until the acceptance gate has evidence.','Build milestone by milestone. Current governing specification: docs/MASTER-SPEC-2026-09-26.md. Read CURRENT_MILESTONE.md, PROJECT_STATE.md and docs/decisions/ADR-009-AUDIT-FIRST-RESET.md first. Current assignment is forensic audit/reference planning only; do not implement the site. Next prototype must be boot → entrance → gaming floor → one real Altitude → focus → screen entry → exit. No later sections until review. New audit/design/assets docs supersede older 2.5D scope; missing cabinet GLBs require explicit asset briefs, not invented models.')
p.write_text(s)
p=Path('docs/STATUS.md');s=p.read_text();p.write_text('# Current status — audit-first reset\n\nSee ../PROJECT_STATE.md and ../CURRENT_MILESTONE.md. The new 2026-09-26 master specification supersedes the earlier concept scope. Audit/reference/asset-planning deliverables created; no runtime changes this turn. TP-001 approved Altitude model blocks physical flagship prototype.\n\n---\n\n## Historical concept report (not approval under new spec)\n\n'+s)
# Append precise late discoveries.
p=Path('docs/audit/GAME-MATRIX.md');p.write_text(p.read_text()+'''\n## Additional image-only catalogue evidence\n\n/games-collection/ contains slider-1/2/3.png,61253.png and sugar_rush.webp, spirit_of_76.webp, sea_world.webp, gemstone_cavern.webp, full_throttle.webp, yetis_terror.webp, repeated in a media strip. These filenames are evidence of displayed assets, not validated product ownership/names/board membership. PRESERVED in the audit and asset inventory; do not silently discard this page or add these as confirmed Tierplay games. Request catalogue relationship and licensed source files.\n''')
p=Path('docs/audit/EXISTING-CTA-MATRIX.md');p.write_text(p.read_text()+'''\nContact Sales specific contract: required Name, required Email, optional contact-number telephone field, required Message; Send Message. Legacy POST action is https://electronhubs.com/wp-admin/admin-ajax.php with element_pack_contact_form action. Captured plugin nonce must not be reused as production configuration. Recipient/delivery/retention and spam protection unverified. Source class says without-recaptcha; that alone does not establish all server protection. No form sent.\n''')
print('Continuity and draft design documents written')
