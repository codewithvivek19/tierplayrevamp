"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/** CSS adaptation of the supplied LampContainer, using Tierplay's violet palette. */
export default function Lamp({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { once: true, amount: .2 });
  const reduced = useReducedMotion();
  const light = { opacity: visible || reduced ? 1 : .35, scaleX: visible || reduced ? 1 : .45 };
  return <div ref={root} className="tierplay-lamp">
    <div className="tierplay-lamp-light" aria-hidden="true">
      <motion.i initial={false} animate={light} transition={{ duration: reduced ? 0 : .8, ease: "easeInOut" }} className="tierplay-lamp-cone tierplay-lamp-cone-left"/>
      <motion.i initial={false} animate={light} transition={{ duration: reduced ? 0 : .8, ease: "easeInOut" }} className="tierplay-lamp-cone tierplay-lamp-cone-right"/>
      <i className="tierplay-lamp-core"/>
      <motion.i initial={false} animate={{ scaleX: visible || reduced ? 1 : .5 }} transition={{ duration: reduced ? 0 : .8 }} className="tierplay-lamp-line"/>
    </div>
    <div className="tierplay-lamp-content">{children}</div>
  </div>;
}
