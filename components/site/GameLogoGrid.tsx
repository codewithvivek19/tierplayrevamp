"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";

type Item = { title: string; logo: string; href: string };

/** Game title grid: the hovered tile lifts in 3D and its neighbours ripple with it. */
export default function GameLogoGrid({ items }: { items: Item[] }) {
  const grid = useRef<HTMLUListElement>(null);
  const columns = 3;
  const lift = (index: number | null) => {
    const tiles = grid.current?.querySelectorAll<HTMLElement>(".logo-grid-tile");
    tiles?.forEach((tile, i) => {
      if (index === null) { tile.style.removeProperty("--lift"); return; }
      const dx = Math.abs((i % columns) - (index % columns)), dy = Math.abs(Math.floor(i / columns) - Math.floor(index / columns));
      const distance = dx + dy;
      tile.style.setProperty("--lift", distance === 0 ? "1" : distance === 1 ? ".38" : "0");
    });
  };
  const move = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--grid-rx", `${((event.clientY - box.top) / box.height - 0.5) * -6}deg`);
    event.currentTarget.style.setProperty("--grid-ry", `${((event.clientX - box.left) / box.width - 0.5) * 8}deg`);
  };
  return <ul ref={grid} className="logo-grid" onPointerMove={move} onPointerLeave={(event) => { lift(null); event.currentTarget.style.removeProperty("--grid-rx"); event.currentTarget.style.removeProperty("--grid-ry"); }}>
    {items.map((item, index) => <li key={item.title} className="logo-grid-tile" onPointerEnter={() => lift(index)} onFocus={() => lift(index)} onBlur={() => lift(null)}>
      <Link href={item.href}>
        <Image src={item.logo} alt={item.title} width={320} height={160} />
        <span className="tp-label">{String(index + 1).padStart(2, "0")}</span>
      </Link>
    </li>)}
  </ul>;
}
