import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InteriorHero from "@/components/site/InteriorHero";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { boards } from "@/content/site";

export const metadata: Metadata = { title: "Games Collection" };

export default function CollectionPage() {
  return <main id="main">
    <InteriorHero eyebrow="Games collection" title="Amazing gaming experience." intro="A visual index of every recoverable Sunscape board and its published game lineup." image="/media/generated/theme-v3/dragon-world-v3.webp" imageAlt="Rise of the Dragon artwork" />
    <section className="content-section section-pad">
      <Reveal className="section-lede"><p className="kicker">Complete catalogue</p><KineticHeading>All six boards.</KineticHeading><p>Fifteen distinct game names appear across the first five public board descriptions. The sixth entry remains incomplete in the source archive.</p></Reveal>
      <div className="collection-masonry">{boards.map((board, index) => <Reveal key={board.slug}><SpotlightPanel className={`collection-board collection-board-${index + 1}`}><Link href={`/our_games/${board.slug}`}><div className="collection-board-art"><Image src={board.image} alt={`${board.shortTitle} artwork`} fill sizes="(max-width: 760px) 100vw, 45vw" /></div><span>{board.number}</span><h2>{board.shortTitle}</h2><p>{board.games.length ? board.games.join(" · ") : "Archive details pending"}</p><b aria-hidden="true">↗</b></Link></SpotlightPanel></Reveal>)}</div>
    </section>
  </main>;
}
