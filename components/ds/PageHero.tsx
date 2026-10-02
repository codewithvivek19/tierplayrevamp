import Image from "next/image";
import type { ReactNode } from "react";
import HeroMedia from "@/components/motion/HeroMedia";
import DepthText from "@/components/reactbits/DepthText";
import { Badge } from "./primitives";

/** Interior page opening: badge, extruded title, one-line intro, optional actions and art. */
export default function PageHero({ badge, title, intro, image, imageAlt = "", plate, actions, compact = false, poster = false }: {
  badge: string; title: string; intro?: ReactNode; image?: string; imageAlt?: string; plate?: string; actions?: ReactNode; compact?: boolean; poster?: boolean;
}) {
  if (poster && image) return <section className="ds-page-hero ds-page-hero--poster">
    <div className="ds-container ds-page-hero__editorial">
      <div className="ds-page-hero__copy">
        <Badge>{badge}</Badge>
        <div className="ds-page-hero__title"><DepthText as="h1" text={title} /></div>
        {intro ? <p className="ds-page-hero__intro">{intro}</p> : null}
        {actions ? <div className="ds-actions">{actions}</div> : null}
      </div>
      <div className="ds-page-hero__poster">
        <Image src={image} alt={imageAlt} width={1448} height={1086} priority sizes="(max-width: 960px) 100vw, 55vw" />
      </div>
    </div>
  </section>;
  return <section className={`ds-page-hero ${compact ? "ds-page-hero--compact" : ""} ${plate ? "ds-page-hero--plate" : ""}`}>
    {image ? <HeroMedia><Image src={image} alt={imageAlt} fill priority sizes="100vw" className={plate ? "is-ambient" : undefined} /></HeroMedia> : null}
    <div className="ds-page-hero__scrim" aria-hidden="true" />
    {plate ? <div className="ds-page-hero__plate" aria-hidden="true"><Image src={plate} alt="" fill sizes="(max-width: 700px) 90vw, 40vw" /></div> : null}
    <div className="ds-page-hero__copy ds-container">
      <Badge>{badge}</Badge>
      <div className="ds-page-hero__title"><DepthText as="h1" text={title} /></div>
      {intro ? <p className="ds-page-hero__intro">{intro}</p> : null}
      {actions ? <div className="ds-actions">{actions}</div> : null}
    </div>
  </section>;
}
