import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import InteriorHero from "@/components/site/InteriorHero";
import { games } from "@/content/site";
export const metadata: Metadata = { title: "Games Collection" };
export default function CollectionPage() { return <main id="main"><InteriorHero eyebrow="Games collection" title="Amazing gaming experience." intro="A preserved collection route for the complete Tierplay game catalogue." image="/media/generated/theme-v3/dragon-world-v3.webp" imageAlt="Rise of the Dragon artwork" /><section className="collection-strip section-pad">{games.map(game=><Link href={`/our_games/${game.slug}`} key={game.slug}><div className="collection-art"><Image src={game.image} alt="" fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1000px) 48vw, 32vw"/></div><span>{game.index}</span><b>{game.title}</b></Link>)}</section></main>; }
