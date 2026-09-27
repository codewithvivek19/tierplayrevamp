# ADR-018: Editorial card system

Date: 2026-09-27

## Decision

Keep the approved hero unchanged and rebuild the existing content sections around an editorial, image-led card language. The homepage player journey uses one anchor story with two compact continuation stories instead of three equal template cards. Connected products become campaign panels using the existing TCM and TLJ artwork. Interior product, cabinet-capability and player-journey cards share restrained violet light, precise dividers, large typography and pointer-local response.

The supplied React Bits references are treated as interaction primitives. ChromaGrid supplies localized pointer focus, Lamp supplies the closing architectural light wash and DepthText appears only in the closing Tierplay wordmark. No new section, WebGL canvas, fabricated product claim or decorative cursor is added.

The shared footer is the single closing sales action on every route. Repeated `ContactBand` instances are removed from interior pages because they duplicated the same action immediately above the footer.

## Rationale

Equal cards with repeated copy made the journey and capability content feel generic. Asymmetric composition, real product media and a consistent surface system create hierarchy without overwhelming the content or competing with the cinematic hero. CSS and Motion are sufficient below the hero and preserve the single-canvas performance architecture.

## Responsive and accessible behavior

The editorial journey returns to a single column below 900px. Hover light and image motion are removed for touch and reduced-motion users. Cards remain semantic links where navigation exists, focus rings stay visible, and controls keep a minimum 44px target.
