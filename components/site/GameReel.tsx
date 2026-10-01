"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { games as gameList } from "@/content/site";
import { gameplay } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const logoFor = (title: string) => gameplay.find((game) => game.title === title)?.logo;

/**
 * The Sunscape lineup. Desktop: a pinned two-column stage, the heading and a live counter on the
 * left, and a rail of portrait cards that travels with vertical scroll; the card crossing the
 * centre comes forward. Touch, narrow screens and reduced motion: a native scroll-snap rail.
 */
export default function GameReel({ games, aside, footer }: { games: typeof gameList; aside?: ReactNode; footer?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const total = String(games.length).padStart(2, "0");

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const element = root.current!, rail = track.current!, view = windowRef.current!;
      const cards = [...rail.querySelectorAll<HTMLElement>("li")];
      const distance = () => Math.max(0, rail.scrollWidth - view.clientWidth);
      const size = () => { element.style.height = `${distance() + innerHeight * 1.05}px`; };
      size();
      element.dataset.travel = "true";
      const mark = (index: number) => {
        cards.forEach((card, i) => { card.dataset.active = i === index ? "true" : "false"; });
        if (counter.current) counter.current.textContent = String(index + 1).padStart(2, "0");
      };
      mark(0);
      const tween = gsap.to(rail, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: element, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: size,
          onUpdate: (self) => {
            bar.current?.style.setProperty("transform", `scaleX(${self.progress.toFixed(3)})`);
            mark(Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1))));
          },
        },
      });
      cards.forEach((card) => {
        const image = card.querySelector(".lineup-card__art img");
        if (image) gsap.fromTo(image, { xPercent: -5 }, { xPercent: 5, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      return () => { element.style.removeProperty("height"); delete element.dataset.travel; cards.forEach((card) => delete card.dataset.active); };
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root} className="lineup">
    <div className="lineup__sticky">
      <div className="lineup__aside">
        <div className="lineup__heading">{aside}</div>
        <div className="lineup__count" aria-hidden="true">
          <span ref={counter} className="lineup__now">01</span><span className="lineup__total">/ {total}</span>
          <span className="lineup__bar"><span ref={bar} /></span>
        </div>
      </div>
      <div ref={windowRef} className="lineup__window">
        <ol ref={track} className="lineup__track">
          {games.map((game) => {
            const logo = logoFor(game.title);
            return <li key={game.slug}>
              <Link href={`/our_games/${game.slug}`} className="lineup-card" aria-label={`${game.title}, ${game.board}`}>
                <span className="lineup-card__art"><Image src={game.image} alt="" fill sizes="(max-width: 900px) 74vw, 26vw" /></span>
                <span className="lineup-card__chip">{game.index} · {game.board}</span>
                <span className="lineup-card__foot">
                  {logo ? <Image className="lineup-card__logo" src={logo} alt="" width={440} height={220} /> : <b>{game.title}</b>}
                  <span className="lineup-card__go">Explore game <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} /></span>
                </span>
              </Link>
            </li>;
          })}
          <li className="lineup__end" aria-hidden="true" />
        </ol>
      </div>
      {footer}
    </div>
  </div>;
}
