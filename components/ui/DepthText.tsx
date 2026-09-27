"use client";
import { useRef, type CSSProperties } from "react";

/** Layer geometry from the supplied React Bits DepthText; local pointer tracking, no idle loop. */
export default function DepthText({ text }: { text: string }) {
  const root = useRef<HTMLSpanElement>(null);
  return <span ref={root} className="depth-text" onPointerMove={event => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    root.current?.style.setProperty("--depth-x", `${-(event.clientY - box.top - box.height / 2) / box.height * 7}deg`);
    root.current?.style.setProperty("--depth-y", `${(event.clientX - box.left - box.width / 2) / box.width * 7}deg`);
  }} onPointerLeave={() => { root.current?.style.setProperty("--depth-x", "-2deg"); root.current?.style.setProperty("--depth-y", "3deg"); }}>
    <span className="depth-text-stage">
      {Array.from({ length: 12 }, (_, i) => <span aria-hidden="true" key={i} className="depth-text-layer" style={{ transform: `translateZ(${-(12 - i) * .65}px)`, color: `color-mix(in srgb, #eadff3 ${i * 4}%, #614082)` } as CSSProperties}>{text}</span>)}
      <span className="depth-text-face">{text}</span>
    </span>
  </span>;
}
