import type { Metadata } from "next";
import Image from "next/image";
import InteriorHero from "@/components/site/InteriorHero";
import CabinetArtifact from "@/components/site/CabinetArtifact";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SignalLoop, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { cabinetCapabilities, cabinets, legacyNotice } from "@/content/site";

export const metadata: Metadata = { title: "Cabinets" };

export default function CabinetsPage() {
  return <main id="main">
    <InteriorHero eyebrow="Tierplay cabinets" title="Hardware with presence." intro="Altitude and Pinnacle are the two cabinet families documented in Tierplay’s public archive." image="/media/generated/theme-v3/cabinet-lineup-v3.webp" imageAlt="Three Tierplay cabinets presented together" />
    <SignalLoop label="Cabinet collection" items={["Altitude Console", "Vertical 43-inch display", "Pinnacle Console", "Curved 43-inch display", "4K display", "Modular build"]} />
    <section className="content-section section-pad">
      <Reveal className="section-lede"><p className="kicker">The consoles</p><KineticHeading>Two forms. One visual system.</KineticHeading><p>Move across each scene to explore its depth. The cabinet silhouettes are based on recovered Tierplay reference images; final 3D production still requires approved CAD or GLB assets.</p></Reveal>
      <div className="cabinet-showcase">{cabinets.map((cabinet, index) => <Reveal className="cabinet-showcase-row" key={cabinet.name}>
        <div className="cabinet-showcase-art"><CabinetArtifact name={cabinet.name} image={cabinet.image} stage={`/media/generated/theme-v3/cabinet-stage-${index === 0 ? "altitude" : "pinnacle"}-v5.webp`} sizes="(max-width: 860px) 100vw, 58vw" /><div className="cabinet-depth-label"><span aria-hidden="true">◇</span><b>Interactive 2.5D</b><small>Move your pointer to explore</small></div></div>
        <div className="cabinet-showcase-copy"><span>0{index + 1}</span><p className="kicker">{cabinet.label}</p><KineticHeading>{`${cabinet.name} Console`}</KineticHeading><p>{cabinet.copy}</p><ul>{cabinet.specifications.map((item) => <li key={item}>{item}</li>)}</ul><div className="source-thumb"><Image src={cabinet.sourceImage} alt={`${cabinet.name} source cabinet reference`} width={150} height={210} /><small>Recovered product reference</small></div></div>
      </Reveal>)}</div>
    </section>
    <section className="content-section section-pad capability-section">
      <Reveal className="section-lede split"><div><p className="kicker">Published capabilities</p><KineticHeading>Designed for the full floor.</KineticHeading></div><p>The original cabinet page lists these shared capabilities. They are not assigned to a specific model until Tierplay approves a current technical sheet.</p></Reveal>
      <div className="capability-grid">{cabinetCapabilities.map((item, index) => <Reveal key={item}><SpotlightPanel className="capability-card"><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></SpotlightPanel></Reveal>)}</div>
      <p className="archive-note">{legacyNotice}</p>
    </section>
  </main>;
}
