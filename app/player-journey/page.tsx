import type { Metadata } from "next";
import Image from "next/image";
import { Route } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import StickySwap from "@/components/motion/StickySwap";
import { Button, Note, SectionHeader } from "@/components/ds/primitives";
import { journey, legacyNotice } from "@/content/site";
import { campaignMedia } from "@/content/media";

export const metadata: Metadata = { title: "Player Journey", description: "Linked jackpots, progressive rewards and loyalty form the journey." };

export default function JourneyPage() {
  return <main id="main" className="ds-page">
    <PageHero badge="Player journey" title="From play to return." intro="Linked jackpots, progressive rewards and loyalty form the journey."
      poster image={campaignMedia.loyalty.src} imageAlt={campaignMedia.loyalty.alt}
      actions={<><Button href="#sequence">Follow the journey</Button><Button href="/products" variant="ghost">See the products</Button></>} />

    <section className="ds-section ds-container" id="sequence">
      <SectionHeader icon={Route} label="The sequence" title="Three ways to connect." blurb="Follow the experience from a shared jackpot to the next visit." />
      <StickySwap className="ds-journey ds-journey--posters" items={journey.map((stage) => ({
        key: stage.number, image: stage.image, alt: stage.imageAlt,
        content: <div key={stage.number} className="ds-journey__step">
          <span className="ds-steps__index">{stage.number}.</span>
          <h3>{stage.title}</h3>
          <p>{stage.copy}</p>
        </div>,
      }))} />
      <Note>{legacyNotice}</Note>
    </section>

    <section className="ds-section ds-container">
      <div className="ds-cta-card ds-cta-card--poster">
        <div className="ds-cta-card__poster"><Image src={campaignMedia.floor.src} alt={campaignMedia.floor.alt} width={1448} height={1086} sizes="(max-width: 960px) 100vw, 50vw" /></div>
        <div className="ds-cta-card__copy">
          <h2>Bring the journey to your floor.</h2>
          <p>Talk to Tierplay about linked jackpots, progressive rewards and loyalty.</p>
          <div className="ds-actions"><Button href="/contact-sales">Contact sales</Button><Button href="/products" variant="ghost">See the products</Button></div>
        </div>
      </div>
    </section>
  </main>;
}
