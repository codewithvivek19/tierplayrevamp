"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Adapted from React Bits Magnet (TS + CSS). Writes transforms directly instead of React state
 * per mouse move, ignores touch/pen, and stays still under reduced motion.
 */
export default function Magnet({ children, padding = 60, strength = 3.2, className = "" }: { children: ReactNode; padding?: number; strength?: number; className?: string }) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = outer.current, target = inner.current;
    if (!element || !target || matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    let active = false;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = element.getBoundingClientRect();
      const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
      const inside = Math.abs(event.clientX - cx) < box.width / 2 + padding && Math.abs(event.clientY - cy) < box.height / 2 + padding;
      if (inside) {
        active = true;
        target.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1)";
        target.style.transform = `translate3d(${(event.clientX - cx) / strength}px, ${(event.clientY - cy) / strength}px, 0)`;
      } else if (active) {
        active = false;
        target.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
        target.style.transform = "translate3d(0,0,0)";
      }
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, [padding, strength]);
  return <span ref={outer} className={`magnet ${className}`}><span ref={inner} className="magnet-inner">{children}</span></span>;
}
