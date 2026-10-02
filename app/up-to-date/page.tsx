import type { Metadata } from "next";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import { Button, SectionHeader } from "@/components/ds/primitives";
import { games } from "@/content/site";
import { campaignMedia } from "@/content/media";

export const metadata: Metadata = { title: "Up to Date", description: "Product and game stories will appear here as they are released." };

export default function UpdatePage() {
  return <main id="main" className="ds-page">
    <PageHero poster badge="Up to date" title="Tierplay updates." intro="Product and game stories will appear here as they are released." image={campaignMedia.sunscape.src} imageAlt={campaignMedia.sunscape.alt} />
    <section className="ds-section ds-container">
      <SectionHeader icon={Newspaper} label="Updates" title="More to come." blurb="There are no published stories here yet." />
      <div className="ds-empty">
        <div className="ds-empty__stack" aria-hidden="true">{games.slice(0, 3).map((game, index) => <div key={game.slug} style={{ "--i": index } as React.CSSProperties}><Image src={game.image} alt="" fill sizes="(max-width: 960px) 80vw, 30vw" /></div>)}</div>
        <div className="ds-empty__copy">
          <h3>Nothing published yet.</h3>
          <p>Explore the current games while we prepare the next update.</p>
          <div className="ds-actions"><Button href="/games">Explore games</Button><Button href="/contact-sales" variant="ghost">Contact Tierplay</Button></div>
        </div>
      </div>
    </section>
  </main>;
}
