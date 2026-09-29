"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type SwapItem = { key: string; image: string; alt: string; label?: string; content: ReactNode };

/** A sticky image column that crossfades to whichever step sits in the middle of the viewport. */
export default function StickySwap({ items, className = "" }: { items: SwapItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, [items.length]);

  return <div className={`sticky-swap ${className}`}>
    <div className="sticky-swap-media" aria-hidden="true">
      {items.map((item, index) => <div key={item.key} className="sticky-swap-frame" data-active={index === active}>
        <Image src={item.image} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
        {item.label ? <span>{item.label}</span> : null}
      </div>)}
      <div className="sticky-swap-progress"><i style={{ transform: `scaleY(${(active + 1) / items.length})` }} /></div>
    </div>
    <div className="sticky-swap-steps">
      {items.map((item, index) => <article key={item.key} ref={(node) => { steps.current[index] = node; }} data-index={index} data-active={index === active} className="sticky-swap-step">
        <div className="sticky-swap-inline"><Image src={item.image} alt={item.alt} fill sizes="100vw" /></div>
        {item.content}
      </article>)}
    </div>
  </div>;
}
