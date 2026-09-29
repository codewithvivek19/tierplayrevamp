import type { Metadata } from "next";
import Image from "next/image";
import { Dices, Grid2x2, LayoutGrid } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import Reveal from "@/components/site/Reveal";
import MechanicSwitcher from "@/components/site/MechanicSwitcher";
import GameLogoGrid from "@/components/site/GameLogoGrid";
import { Button, GlassCard, Note, SectionHeader } from "@/components/ds/primitives";
import { boards, gameplay, legacyNotice } from "@/content/site";

export const metadata: Metadata = { title: "Games", description: "Six Sunscape boards with fifteen named games across the first five releases." };

export default function GamesPage() {
  return <main id="main" className="ds-page">
    <PageHero badge="Sunscape series" title="Find your next game." intro="Six Sunscape boards with fifteen named games across the first five releases."
      image="/media/generated/theme-v3/dragon-world-v3.webp"
      actions={<><Button href="#boards">Browse the boards</Button><Button href="/games-collection" variant="ghost">Full collection</Button></>} />

    <section className="ds-section ds-container">
      <SectionHeader icon={LayoutGrid} label="Featured titles" title="Six worlds to play." blurb="The Sunscape 1 and 2 games, each with its own world. Choose a title to open its board." />
      <GameLogoGrid items={gameplay.map((game) => ({ title: game.title, logo: game.logo, href: `/our_games/${game.board}` }))} />
    </section>

    <section className="ds-section ds-container">
      <SectionHeader icon={Dices} label="Game mechanics" title="What happens in play." blurb="Free spins, nudges, bonuses and jackpots feature across the range. Choose a mechanic, then a game." />
      <Reveal><MechanicSwitcher /></Reveal>
    </section>

    <section className="ds-section ds-container" id="boards">
      <SectionHeader icon={Grid2x2} label="Board catalogue" title="Choose your Sunscape." blurb="Each board groups three games with shared features." />
      <div className="ds-grid ds-grid--3 ds-board-grid">
        {boards.map((board, i) => <Reveal key={board.slug}>
          <GlassCard href={`/our_games/${board.slug}`} title={board.shortTitle} label={`${board.number} / ${board.grid}`} tone={i % 2 ? "amber" : "violet"}
            text={board.games.length ? board.games.join(" · ") : "Game lineup to be announced"}
            media={<Image src={board.image} alt="" fill sizes="(max-width: 960px) 100vw, 33vw" />} />
        </Reveal>)}
      </div>
      <Note>{legacyNotice}</Note>
      <Note tone="market">not available for Georgia market</Note>
    </section>
  </main>;
}
