import Image from "next/image";
import Link from "next/link";
import { games } from "@/content/site";

export default function GameCard({ game }: { game: (typeof games)[number] }) {
  return <article className="battle-game-card textured-panel">
    <div className="game-card-copy">
      <div className="card-tags"><span>Sunscape</span><span>Game {game.index}</span></div>
      <h3>{game.title}</h3><p>Tierplay games collection</p>
      <Link className="battle-button" href={`/our_games/${game.slug}`} aria-label={`Explore ${game.title}`}>Explore game <span aria-hidden="true">↗</span></Link>
    </div>
    <Link className="battle-game-image" href={`/our_games/${game.slug}`} tabIndex={-1} aria-hidden="true"><Image src={game.image} alt="" fill sizes="(max-width: 650px) 90vw, (max-width: 1000px) 45vw, 30vw" /></Link>
  </article>;
}
