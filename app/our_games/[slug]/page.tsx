import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MediaSlot from "@/components/site/MediaSlot";
import ContactBand from "@/components/site/ContactBand";
import { games } from "@/content/site";

export function generateStaticParams() { return games.map((game) => ({ slug: game.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const game = games.find((item) => item.slug === slug); return { title: game?.title ?? "Game" }; }

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = games.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const game = games[index];
  const previous = games[(index - 1 + games.length) % games.length];
  const next = games[(index + 1) % games.length];
  return <main id="main"><section className="game-detail-hero"><Image src={index === 0 ? "/media/generated/theme-v3/dragon-world-v3.webp" : game.image} alt={`${game.title} artwork`} fill priority sizes="100vw" /><div className="game-detail-shade"/><div className="game-detail-copy"><p className="kicker">Sunscape / {game.index}</p><h1>{game.title}</h1><p>Tierplay Sunscape skill game board.</p></div><MediaSlot kind="VIDEO" label={`${game.title} game world`} detail="Approved gameplay or cinematic media replaces this still" /></section><section className="game-info section-pad"><div><p className="kicker">Game profile</p><h2>A world within the Sunscape collection.</h2></div><div><p>This page preserves the published game identity and supporting-asset structure. Feature descriptions, technical support details and downloadable material require final verification.</p><p className="market-note">not available for Georgia market</p></div></section><nav className="game-pagination" aria-label="Other games"><Link href={`/our_games/${previous.slug}`}><span>Previous</span><b>{previous.title}</b></Link><Link href={`/our_games/${next.slug}`}><span>Next</span><b>{next.title}</b></Link></nav><ContactBand /></main>;
}
