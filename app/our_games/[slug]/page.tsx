import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Images, ListChecks, Sparkles } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import Reveal from "@/components/site/Reveal";
import GameplayGallery from "@/components/site/GameplayGallery";
import { Button, CheckList, GlassCard, Note, SectionHeader, StatBlock } from "@/components/ds/primitives";
import { boards, gameplay } from "@/content/site";

export function generateStaticParams() { return boards.map((board) => ({ slug: board.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const board = boards.find((item) => item.slug === slug);
  return { title: board?.title ?? "Game board", description: board?.intro };
}

export default async function GameBoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = boards.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const board = boards[index];
  const previous = boards[(index - 1 + boards.length) % boards.length];
  const next = boards[(index + 1) % boards.length];
  const titles = gameplay.filter((game) => game.board === board.slug);
  return <main id="main" className="ds-page">
    <PageHero badge={`Sunscape archive · ${board.number}`} title={board.title} intro="Published June 24, 2024" image={board.image} plate={board.image}
      actions={<><Button href="/contact-sales">Ask about this board</Button><Button href="/games" variant="ghost">All games</Button></>} />

    <section className="ds-section ds-container">
      <SectionHeader icon={Sparkles} label="The board" title={board.shortTitle} blurb={board.intro} />
      <Reveal><StatBlock items={[
        { label: "Game lineup", value: board.games.length ? board.games.join(" · ") : "Not provided in the public source" },
        { label: "Free-spin grid", value: board.grid },
        { label: "Jackpots", value: board.jackpot },
      ]} /></Reveal>
    </section>

    {titles.length ? <section className="ds-section ds-container">
      <SectionHeader icon={Images} label="In the game" title="See it in play." blurb="Artwork showing each game on a Tierplay cabinet. Select an image to enlarge it." />
      <GameplayGallery games={titles.map((game) => ({ title: game.title, logo: game.logo, shots: [...game.shots] }))} />
    </section> : null}

    <section className="ds-section ds-container">
      <SectionHeader icon={ListChecks} label="Features" title="Features at a glance." />
      <Reveal><CheckList items={board.features} columns={2} /></Reveal>
      <Note tone="market">not available for Georgia market</Note>
    </section>

    <nav className="ds-section ds-container ds-grid ds-grid--2" aria-label="Other game boards">
      <GlassCard href={`/our_games/${previous.slug}`} label="Previous board" title={previous.shortTitle} tone="violet" media={<Image src={previous.image} alt="" fill sizes="(max-width: 620px) 100vw, 50vw" />} />
      <GlassCard href={`/our_games/${next.slug}`} label="Next board" title={next.shortTitle} tone="amber" media={<Image src={next.image} alt="" fill sizes="(max-width: 620px) 100vw, 50vw" />} />
    </nav>
  </main>;
}
