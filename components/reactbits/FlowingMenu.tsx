"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export type FlowingItem = { href: string; label: string; index: string; detail: string; image: string };

/**
 * Adapted from React Bits FlowingMenu (TS + CSS). Rows are real links with visible detail text.
 * The image marquee only runs while a row is hovered or focused, entering from the nearest edge.
 */
export default function FlowingMenu({ items }: { items: FlowingItem[] }) {
  return <ul className="flowing-menu">{items.map((item) => <FlowingRow key={item.href} {...item} />)}</ul>;
}

function FlowingRow({ href, label, index, detail, image }: FlowingItem) {
  const row = useRef<HTMLLIElement>(null);
  const marquee = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);
  useEffect(() => () => { loop.current?.kill(); if (marquee.current) gsap.killTweensOf(marquee.current); if (inner.current) gsap.killTweensOf(inner.current); }, []);

  const edge = (clientY?: number) => {
    const box = row.current!.getBoundingClientRect();
    return clientY === undefined || clientY - box.top < box.height / 2 ? "top" : "bottom";
  };
  const enter = (clientY?: number) => {
    if (!marquee.current || !inner.current || matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const from = edge(clientY) === "top";
    gsap.timeline({ defaults: { duration: 0.6, ease: "expo.out" } })
      .set(marquee.current, { yPercent: from ? -101 : 101 }, 0)
      .set(inner.current, { yPercent: from ? 101 : -101 }, 0)
      .to([marquee.current, inner.current], { yPercent: 0 }, 0);
    const part = inner.current.firstElementChild as HTMLElement | null;
    if (part && !loop.current) loop.current = gsap.to(inner.current, { x: -part.offsetWidth, duration: 9, ease: "none", repeat: -1 });
    loop.current?.play();
  };
  const leave = (clientY?: number) => {
    if (!marquee.current || !inner.current) return;
    const to = edge(clientY) === "top";
    gsap.timeline({ defaults: { duration: 0.6, ease: "expo.out" }, onComplete: () => { loop.current?.pause(); } })
      .to(marquee.current, { yPercent: to ? -101 : 101 }, 0)
      .to(inner.current, { yPercent: to ? 101 : -101 }, 0);
  };

  return <li ref={row} className="flowing-menu-row" onPointerEnter={(e) => e.pointerType === "mouse" && enter(e.clientY)} onPointerLeave={(e) => e.pointerType === "mouse" && leave(e.clientY)}>
    <Link href={href} className="flowing-menu-link" onFocus={() => enter()} onBlur={() => leave()}>
      <span className="flowing-menu-index">{index}</span>
      <span className="flowing-menu-label">{label}</span>
      <span className="flowing-menu-detail">{detail}</span>
      <span className="flowing-menu-thumb" aria-hidden="true" style={{ backgroundImage: `url(${image})` }} />
      <b aria-hidden="true">↗</b>
    </Link>
    <div ref={marquee} className="flowing-menu-marquee" aria-hidden="true">
      <div ref={inner} className="flowing-menu-track">
        {[0, 1, 2, 3].map((copy) => <div className="flowing-menu-part" key={copy}>
          <span>{label}</span><i style={{ backgroundImage: `url(${image})` }} />
          <span>{detail}</span><i style={{ backgroundImage: `url(${image})` }} />
        </div>)}
      </div>
    </div>
  </li>;
}
