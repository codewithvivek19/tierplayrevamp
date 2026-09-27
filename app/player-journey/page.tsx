import type { Metadata } from "next";
import Image from "next/image";
import InteriorHero from "@/components/site/InteriorHero";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SignalLoop, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { journey, legacyNotice } from "@/content/site";

export const metadata: Metadata = { title: "Player Journey" };

export default function JourneyPage() {
  return <main id="main">
    <InteriorHero eyebrow="Player journey" title="Every moment connected." intro="The recovered journey moves through linked jackpots, standard progressives and the loyalty return loop." image="/media/generated/theme-v3/entrance-editorial-v5.webp" imageAlt="Tierplay illuminated architectural entrance" />
    <SignalLoop label="Player journey" items={["Discover", "Play", "Link", "Reward", "Return"]} />
    <section className="content-section section-pad journey-story">
      <Reveal className="section-lede"><p className="kicker">Journey architecture</p><KineticHeading>Three connected layers.</KineticHeading><p>The legacy site presents a benefits-led sequence. This page keeps that order and gives each part room to breathe.</p></Reveal>
      <div className="journey-stack">{journey.map((stage) => <Reveal key={stage.number}><SpotlightPanel className="journey-stage"><div className="journey-stage-art"><Image src={stage.image} alt="" fill sizes="(max-width: 760px) 90vw, 45vw" /></div><div className="journey-stage-copy"><span>{stage.number}</span><KineticHeading as="h3">{stage.title}</KineticHeading><p>{stage.copy}</p></div></SpotlightPanel></Reveal>)}</div>
      <aside className="legacy-metrics"><p className="kicker">Legacy performance claims</p><h2>Approval required before publication.</h2><p>The old site also claimed “up to 3× more jackpots,” “25% faster” jackpot growth and “40%” higher engagement. The audit preserves those figures, but this redesign does not present them as verified results.</p></aside>
      <p className="archive-note">{legacyNotice}</p>
    </section>
  </main>;
}
