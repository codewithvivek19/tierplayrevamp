import type { Metadata } from "next";
import { Library } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import Reveal from "@/components/site/Reveal";
import FlowingMenu from "@/components/reactbits/FlowingMenu";
import { Note, SectionHeader } from "@/components/ds/primitives";
import { boards } from "@/content/site";
import { campaignMedia } from "@/content/media";

export const metadata: Metadata = { title: "Games Collection", description: "Browse every Sunscape board and its game lineup." };

export default function CollectionPage() {
  return <main id="main" className="ds-page">
    <PageHero poster badge="Games collection" title="The Sunscape boards." intro="Browse every board and its game lineup." image={campaignMedia.sunscape.src} imageAlt={campaignMedia.sunscape.alt} />
    <section className="ds-section ds-container">
      <SectionHeader icon={Library} label="Complete catalogue" title="All six boards." blurb="Fifteen named games across the first five boards. The sixth lineup has yet to be published." />
      <Reveal>
        <FlowingMenu items={boards.map((board) => ({
          href: `/our_games/${board.slug}`, label: board.shortTitle, index: board.number, image: board.image,
          detail: board.games.length ? board.games.join(" · ") : "Lineup to be announced",
        }))} />
      </Reveal>
      <Note tone="market">not available for Georgia market</Note>
    </section>
  </main>;
}
