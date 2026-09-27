import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InteriorHero from "@/components/site/InteriorHero";
import ContactBand from "@/components/site/ContactBand";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SignalLoop, SpotlightPanel, TiltSurface } from "@/components/site/InteractivePrimitives";
import { boards, gameMechanics, legacyNotice } from "@/content/site";

export const metadata: Metadata = { title: "Games" };

export default function GamesPage() {
  return <main id="main">
    <InteriorHero eyebrow="Sunscape series" title="Six boards. Fifteen named games." intro="Explore every game board and title recovered from Tierplay’s public catalogue." image="/media/generated/theme-v3/dragon-world-v3.webp" imageAlt="Rise of the Dragon game world" />
    <SignalLoop label="Named games in the Sunscape archive" items={boards.flatMap((board) => board.games)} />
    <section className="content-section section-pad">
      <Reveal className="section-lede"><p className="kicker">Board catalogue</p><KineticHeading>Choose your Sunscape.</KineticHeading><p>Each board is preserved as its own release, with the game names and feature language published on the original site.</p></Reveal>
      <div className="board-grid">
        {boards.map((board) => <Reveal key={board.slug}><SpotlightPanel className="board-card">
          <TiltSurface className="board-card-media"><Image src={board.image} alt={`${board.shortTitle} game board artwork`} fill sizes="(max-width: 760px) 100vw, 46vw" /></TiltSurface>
          <div className="board-card-copy"><span>{board.number}</span><p className="kicker">Skill game board</p><h2>{board.shortTitle}</h2><p>{board.games.length ? board.games.join(" · ") : "Published catalogue details pending"}</p><Link className="battle-button" href={`/our_games/${board.slug}`}>Enter board <span aria-hidden="true">↗</span></Link></div>
        </SpotlightPanel></Reveal>)}
      </div>
      <p className="archive-note">{legacyNotice}</p><p className="market-note">not available for Georgia market</p>
    </section>
    <section className="content-section section-pad mechanic-section">
      <Reveal className="section-lede split"><div><p className="kicker">Incredible features</p><KineticHeading>Built around the moment.</KineticHeading></div><p>Free spins, nudge, bonuses and jackpots are the recurring mechanics named throughout the recovered Sunscape material.</p></Reveal>
      <div className="mechanic-grid">{gameMechanics.map((item) => <Reveal key={item.title}><SpotlightPanel className="mechanic-card"><div className="mechanic-art"><Image src={item.image} alt="" fill sizes="(max-width: 650px) 90vw, 24vw" /></div><div><h3>{item.title}</h3><p>{item.copy}</p></div></SpotlightPanel></Reveal>)}</div>
    </section>
    <ContactBand />
  </main>;
}
