# Component ecosystem review

Planning only; no packages added.

| Source | Useful problem | Decision | Cost/mobile/accessibility |
|---|---|---|---|
| Motion https://motion.dev/docs/react-animation | Menu enter/exit and form status | Reuse installed AnimatePresence where needed | Small transform/opacity; reduced motion; preserve focus |
| Radix/shadcn https://www.radix-ui.com/primitives/docs/components/dialog | Catalogue filters/lightbox dialog | Evaluate focused primitive at M07, not whole theme | Portal/focus/escape behavior; touch targets; measure bundle |
| 21st.dev https://21st.dev/community/components/anubra266/dialog-2/feedback-dialog | Dialog pattern reference | Review semantics/license before import; custom styling | No stylistic transplant; mobile sizing and focus audit |
| React Bits https://reactbits.dev/ | Effect discovery | No hero component selected; custom screen shader solves actual geometry problem | Reject decorative particle/text effects; unknown cost until isolated test |
| Motion Primitives https://motion-primitives.com/ | Disclosure/transition pattern | Candidate for small DOM sections only | Installed Motion may already suffice; avoid duplicate packages |
| transitions.dev https://transitions.dev/ | Dropdown, disclosure, icon transition | Project skill available; use when interaction implemented | CSS transform/opacity; reduced-motion path |
| useLayouts https://uselayouts.com/ | Editorial grouping references | Composition study only; not a layout stack | DOM readability and breakpoint fit |
| Libraries.dev https://libraries.dev/ | Media loading/reveal | Only if real loading problem needs it; no glow/bot/orb pattern | Existing image fallback likely simpler |
| Magic UI / Aceternity | Common visual patterns | No current dependency justified | Reject decorative beam, bento and effect-led identity |

Public Motion/21st pages checked this turn; other ecosystem entries are candidates/catalog links, not vetted implementations. Each adoption requires concrete problem, Tierplay fit, custom alternative comparison, measured payload/frame impact, touch behavior, accessible fallback and license review. Bespoke product/camera/screen interaction remains custom.
