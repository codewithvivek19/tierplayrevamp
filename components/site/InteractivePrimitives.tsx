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
          initial={reduced ? false : { opacity: 0, y: ".2em" }}
          animate={visible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : index * 0.02, ease: [0.22, 1, 0.36, 1] }}
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
  return (
    <div className="signal-loop" role="group" aria-label={label}>
      <div className="signal-loop-track">
        {[0, 1].map(copy => <div className="signal-loop-set" aria-hidden={copy === 1} key={copy}>{items.map(item => <span key={item}>{item}</span>)}</div>)}
      </div>
    </div>
  );
}

export function NumberBadge({ value, label }: { value: string; label: string }) {
  return <div className="number-badge"><strong>{value}</strong><span>{label}</span></div>;
}
