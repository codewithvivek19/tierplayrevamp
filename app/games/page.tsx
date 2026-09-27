import type { Metadata } from "next";
import InteriorHero from "@/components/site/InteriorHero";
import ContactBand from "@/components/site/ContactBand";
import Reveal from "@/components/site/Reveal";
import { games } from "@/content/site";
import GameCard from "@/components/site/GameCard";
export const metadata: Metadata = { title: "Games" };
export default function GamesPage() {
  return <main id="main"><InteriorHero eyebrow="Sunscape series" title="Six distinct game worlds." intro="Explore the recovered Tierplay game collection through its original identities and artwork." image="/media/generated/theme-v3/dragon-world-v3.webp" imageAlt="Rise of the Dragon game world" />
    <section className="catalog-section section-pad"><div className="catalog-intro"><p className="kicker">Games collection</p><h2>Choose a world.</h2></div><div className="battle-games-grid">{games.map((game) => <Reveal key={game.slug}><GameCard game={game}/></Reveal>)}</div><p className="market-note">not available for Georgia market</p></section><ContactBand /></main>;
}
