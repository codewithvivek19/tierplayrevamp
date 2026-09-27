import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactBand from "@/components/site/ContactBand";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { boards, legacyNotice, supportCopy } from "@/content/site";

export function generateStaticParams() { return boards.map((board) => ({ slug: board.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: boards.find((item) => item.slug === slug)?.title ?? "Game board" };
}

export default async function GameBoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = boards.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const board = boards[index];
  const previous = boards[(index - 1 + boards.length) % boards.length];
  const next = boards[(index + 1) % boards.length];
  return <main id="main">
    <section className="game-detail-hero"><Image src={board.image} alt={`${board.shortTitle} artwork`} fill priority sizes="100vw" /><div className="game-detail-shade"/><div className="game-detail-copy"><p className="kicker">Sunscape archive / {board.number}</p><h1>{board.title}</h1><p>Published June 24, 2024</p></div></section>
    <section className="content-section section-pad board-profile">
      <Reveal className="board-profile-intro"><div><p className="kicker">Board profile</p><KineticHeading>{board.shortTitle}</KineticHeading></div><p>{board.intro}</p></Reveal>
      <div className="board-facts"><SpotlightPanel><span>01</span><b>Game lineup</b><p>{board.games.length ? board.games.join(" · ") : "Not provided in the public source"}</p></SpotlightPanel><SpotlightPanel><span>02</span><b>Free-spin grid</b><p>{board.grid}</p></SpotlightPanel><SpotlightPanel><span>03</span><b>Jackpot description</b><p>{board.jackpot}</p></SpotlightPanel></div>
    </section>
    <section className="content-section section-pad board-feature-section"><Reveal className="section-lede"><p className="kicker">Additional features</p><KineticHeading>The connected layer.</KineticHeading></Reveal><div className="capability-grid">{board.features.map((feature, featureIndex) => <Reveal key={feature}><SpotlightPanel className="capability-card"><span>{String(featureIndex + 1).padStart(2, "0")}</span><p>{feature}</p></SpotlightPanel></Reveal>)}</div></section>
    <section className="support-panel section-pad"><div><p className="kicker">Tech support</p><KineticHeading>Here around the clock.</KineticHeading></div><p>{supportCopy}</p><Link className="battle-button" href="/24-7-support">Visit support <span aria-hidden="true">↗</span></Link></section>
    <section className="supporting-assets section-pad"><div className="supporting-poster"><Image src={board.poster} alt={`${board.shortTitle} supporting artwork`} fill sizes="(max-width: 760px) 90vw, 38vw" /></div><div><p className="kicker">Supporting assets</p><KineticHeading>Sunscapes flyer.</KineticHeading><p>The public page referenced a downloadable Sunscapes flyer. No approved downloadable document was recovered, so the link remains withheld.</p><p className="archive-note">{legacyNotice}</p></div></section>
    <nav className="game-pagination" aria-label="Other game boards"><Link href={`/our_games/${previous.slug}`}><span>Previous</span><b>{previous.shortTitle}</b></Link><Link href={`/our_games/${next.slug}`}><span>Next</span><b>{next.shortTitle}</b></Link></nav>
    <ContactBand />
  </main>;
}
