"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/** Adapted from the supplied ChromaGrid, retaining the existing semantic game cards. */
export default function ChromaGrid({ children, className = "battle-games-grid" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  useEffect(() => { const target = position.current; return () => { gsap.killTweensOf(target); }; }, []);
  return <div ref={root} className={`${className} chroma-grid`} onPointerMove={event => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.dataset.tracking = "true";
    gsap.to(position.current, { x: event.clientX - bounds.left, y: event.clientY - bounds.top, duration: .3, ease: "power3.out", overwrite: true, onUpdate: () => {
      root.current?.style.setProperty("--chroma-x", `${position.current.x}px`);
      root.current?.style.setProperty("--chroma-y", `${position.current.y}px`);
    } });
  }} onPointerLeave={() => { if (root.current) delete root.current.dataset.tracking; }}>
    {children}<div className="chroma-overlay" aria-hidden="true"/>
  </div>;
}
