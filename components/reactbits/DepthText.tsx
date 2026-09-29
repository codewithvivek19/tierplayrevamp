"use client";

import { Fragment, useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Adapted from React Bits DepthText (TS + CSS). Extruded, pointer-tilting type.
 * Tierplay changes: inherits the heading's own font/size/colour (the approved type
 * system stays in CSS); supports line breaks ("\n") and an accent phrase; wraps on
 * narrow screens; only the face is exposed to assistive tech; the rAF loop runs only
 * while the heading is on screen; reduced motion renders a static, gently angled stack.
 */
export default function DepthText({
  text,
  as = "span",
  accent,
  layers = 14,
  depth = .7,
  depthColor = "#24104f",
  tilt = 6,
  orbitSpeed = .12,
  className = "",
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "span" | "b" | "p";
  accent?: string;
  layers?: number;
  depth?: number;
  depthColor?: string;
  tilt?: number;
  orbitSpeed?: number;
  className?: string;
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const count = Math.max(2, Math.min(40, Math.round(layers)));
  const base = useMemo(() => ({ x: -tilt * .32, y: tilt * .42 }), [tilt]);

  const content = useMemo<ReactNode>(() => text.split("\n").map((line, i, all) => {
    const parts = accent && line.includes(accent) ? line.split(accent) : [line];
    return <Fragment key={i}>
      <span className="depth-text__line">
        {parts.map((part, j) => <Fragment key={j}>{part}{j < parts.length - 1 ? <em>{accent}</em> : null}</Fragment>)}
      </span>
      {i < all.length - 1 ? " " : null}
    </Fragment>;
  }), [text, accent]);

  useEffect(() => {
    const element = root.current, target = stage.current;
    if (!element || !target) return;
    const set = (x: number, y: number) => { target.style.transform = `rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`; };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { set(base.x, base.y); return; }
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const current = { ...base }, goal = { ...base };
    let pointer = false, frame = 0, visible = false;
    const start = performance.now();
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      if (!box.width) return;
      pointer = true;
      const x = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (box.width * .8)));
      const y = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / (box.height * 2.5)));
      goal.x = base.x - y * tilt; goal.y = base.y + x * tilt;
    };
    const leave = () => { pointer = false; };
    const tick = (now: number) => {
      if (!pointer) {
        const orbit = (now - start) / 1000 * orbitSpeed * Math.PI * 2;
        goal.x = base.x + Math.sin(orbit) * tilt * .22;
        goal.y = base.y + Math.cos(orbit * .85) * tilt * .22;
      }
      current.x += (goal.x - current.x) * .12;
      current.y += (goal.y - current.y) * .12;
      set(current.x, current.y);
      frame = visible ? requestAnimationFrame(tick) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    if (fine) { addEventListener("pointermove", move, { passive: true }); addEventListener("blur", leave); document.documentElement.addEventListener("pointerleave", leave); }
    set(base.x, base.y);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      removeEventListener("pointermove", move); removeEventListener("blur", leave); document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [base, tilt, orbitSpeed]);

  // One polymorphic element; all supported tags share HTMLElement's ref shape.
  const Tag = as as "span";
  return <Tag ref={root as React.RefObject<HTMLSpanElement>} id={id} className={`depth-text ${className}`} style={{ "--depth-color": depthColor } as CSSProperties}>
    <span ref={stage} className="depth-text__stage">
      {Array.from({ length: count }, (_, i) => {
        const index = count - i;
        const mix = Math.round((1 - (index / count) ** 2) * 72 + 4);
        // Layers draw their text via CSS generated content: invisible to textContent, search and copy.
        return <span key={index} aria-hidden="true" className="depth-text__layer" data-text={text} style={{ transform: `translateZ(${(-index * depth).toFixed(2)}px)`, color: `color-mix(in srgb, currentColor ${mix}%, var(--depth-color))` }} />;
      })}
      <span className="depth-text__face">{content}</span>
    </span>
  </Tag>;
}
