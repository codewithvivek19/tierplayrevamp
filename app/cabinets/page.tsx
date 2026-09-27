import type { Metadata } from "next";
import InteriorHero from "@/components/site/InteriorHero";
import ContactBand from "@/components/site/ContactBand";
import CabinetArtifact from "@/components/site/CabinetArtifact";
import Reveal from "@/components/site/Reveal";
import { cabinets } from "@/content/site";
export const metadata: Metadata = { title: "Cabinets" };
export default function CabinetsPage() {
  return <main id="main"><InteriorHero eyebrow="Tierplay cabinets" title="Hardware with presence." intro="Altitude and Pinnacle are presented as two distinct cabinet identities within one coherent system." image="/media/generated/theme-v3/cabinet-lineup-v3.webp" imageAlt="Three Tierplay cabinets presented together" />
    <section className="detail-list section-pad">{cabinets.map((cabinet, index) => <Reveal className="detail-row" key={cabinet.name}><div className="detail-image"><CabinetArtifact name={cabinet.name} image={cabinet.image} stage={`/media/generated/theme-v3/cabinet-stage-${index === 0 ? "altitude" : "pinnacle"}-v5.webp`} sizes="(max-width: 860px) 100vw, 62vw" /><div className="cabinet-depth-label"><span aria-hidden="true">◇</span><b>Interactive 2.5D</b><small>Move your pointer to explore the cabinet</small></div></div><div className="detail-copy"><span>0{index + 1}</span><p className="kicker">{cabinet.label}</p><h2>{cabinet.name}</h2><p>{cabinet.copy}</p><dl><div><dt>Display form</dt><dd>{index === 0 ? "Vertical" : "Curved"}</dd></div><div><dt>Presentation</dt><dd>Interactive 2.5D</dd></div></dl></div></Reveal>)}</section><ContactBand /></main>;
}
