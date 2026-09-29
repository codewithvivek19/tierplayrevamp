"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlareHover from "@/components/reactbits/GlareHover";
import DepthText from "@/components/reactbits/DepthText";
import type { games as gameList } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Desktop: a CSS-sticky stage whose track travels horizontally with vertical scroll.
 * Touch/narrow or reduced motion: a native scroll-snap rail.
 */
export default function GameReel({ games, header, footer }: { games: typeof gameList; header?: ReactNode; footer?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const element = root.current!, rail = track.current!;
      const distance = () => Math.max(0, rail.scrollWidth - innerWidth);
      const size = () => { element.style.height = `${distance() + innerHeight}px`; };
      size();
      element.dataset.travel = "true";
      const tween = gsap.to(rail, {
        x: () => -distance(), ease: "none",
        scrollTrigger: { trigger: element, start: "top top", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true, onRefreshInit: size },
      });
      rail.querySelectorAll<HTMLElement>(".game-reel-card img").forEach((image) => {
        gsap.fromTo(image, { xPercent: -6, scale: 1.12 }, { xPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: image.closest("li"), containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      return () => { element.style.removeProperty("height"); delete element.dataset.travel; };
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root} className="game-reel">
    <div className="game-reel-sticky">
      {header}
      <div className="game-reel-window">
        <ol ref={track} className="game-reel-track">
          {games.map((game) => <li key={game.slug}>
            <Link href={`/our_games/${game.slug}`} className="game-reel-card">
              <GlareHover><Image src={game.image} alt="" fill sizes="(max-width: 900px) 82vw, 40vw" /></GlareHover>
              <span className="game-reel-meta"><span className="tp-label">{game.index} / {game.board}</span><DepthText as="b" text={game.title} layers={10} depth={.6} tilt={5} /><i>Explore game <span aria-hidden="true">↗</span></i></span>
            </Link>
          </li>)}
        </ol>
      </div>
      {footer}
    </div>
  </div>;
}
