"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function KineticHeading({ children, className = "", as = "h2" }: { children: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const visible = useInView(ref, { once: true, margin: "-12%" });
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const words = children.split(" ");

  return (
    <Tag ref={ref} className={`kinetic-heading ${className}`} aria-label={children}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="kinetic-word"
          key={`${word}-${index}`}
          initial={reduced ? false : { opacity: 0, y: ".7em", filter: "blur(10px)" }}
          animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: reduced ? 0 : 0.72, delay: reduced ? 0 : index * 0.045, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </Tag>
  );
}

export function SpotlightPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };
  return <div ref={ref} onPointerMove={move} className={`spotlight-panel ${className}`}>{children}</div>;
}

export function TiltSurface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${y * -5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 7}deg`);
  };
  const reset = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };
  return <div onPointerMove={move} onPointerLeave={reset} className={`tilt-surface ${className}`}>{children}</div>;
}

export function SignalLoop({ items, label }: { items: readonly string[]; label: string }) {
  const doubled = [...items, ...items];
  return (
    <div className="signal-loop" aria-label={label}>
      <div className="signal-loop-track">
        {doubled.map((item, index) => <span key={`${item}-${index}`} aria-hidden={index >= items.length}>{item}<i aria-hidden="true">✦</i></span>)}
      </div>
    </div>
  );
}

export function NumberBadge({ value, label }: { value: string; label: string }) {
  return <div className="number-badge"><strong>{value}</strong><span>{label}</span></div>;
}
