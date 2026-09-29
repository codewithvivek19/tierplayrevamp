"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Shot = { mechanic: string; image: string };
type Game = { title: string; logo: string; shots: Shot[] };

/** Per-game gameplay gallery with a native dialog viewer (Escape closes, arrows step through). */
export default function GameplayGallery({ games }: { games: Game[] }) {
  const [game, setGame] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shots = games[game].shots;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open !== null && !element.open) element.showModal();
    if (open === null && element.open) element.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setOpen((value) => value === null ? value : (value + 1) % shots.length);
      if (event.key === "ArrowLeft") setOpen((value) => value === null ? value : (value + shots.length - 1) % shots.length);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, shots.length]);

  return <div className="gameplay-gallery">
    {games.length > 1 ? <div className="gameplay-gallery-games" role="group" aria-label="Choose a game">
      {games.map((item, index) => <button type="button" key={item.title} aria-pressed={index === game} onClick={() => setGame(index)}>
        <Image src={item.logo} alt={item.title} width={200} height={100} />
      </button>)}
    </div> : null}
    <ul className="gameplay-gallery-grid" key={game}>
      {shots.map((shot, index) => <li key={shot.image} style={{ animationDelay: `${index * 70}ms` }}>
        <button type="button" onClick={() => setOpen(index)} aria-label={`Enlarge ${games[game].title} ${shot.mechanic.toLowerCase()} image`}>
          <Image src={shot.image} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
          <span className="tp-label">{String(index + 1).padStart(2, "0")} / {shot.mechanic}</span>
        </button>
      </li>)}
    </ul>
    <dialog ref={dialog} className="gameplay-dialog" onClose={() => setOpen(null)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(null); }} aria-label={`${games[game].title} gameplay`}>
      {open !== null ? <figure>
        <div className="gameplay-dialog-image"><Image src={shots[open].image} alt={`${games[game].title}: ${shots[open].mechanic.toLowerCase()} on a Tierplay cabinet`} fill sizes="90vw" /></div>
        <figcaption><span className="tp-label">{games[game].title}</span><b>{shots[open].mechanic}</b></figcaption>
        <div className="gameplay-dialog-controls">
          <button type="button" onClick={() => setOpen((open + shots.length - 1) % shots.length)} aria-label="Previous image">←</button>
          <button type="button" onClick={() => setOpen((open + 1) % shots.length)} aria-label="Next image">→</button>
          <button type="button" onClick={() => setOpen(null)} className="gameplay-dialog-close">Close</button>
        </div>
      </figure> : null}
    </dialog>
  </div>;
}
