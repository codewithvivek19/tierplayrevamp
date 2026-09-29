"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type SpringOptions } from "motion/react";

const spring: SpringOptions = { damping: 30, stiffness: 110, mass: 1.6 };

/**
 * Adapted from React Bits TiltedCard (TS + CSS). Wraps arbitrary media, drops the mobile
 * warning and tooltip, and is inert for touch and reduced motion.
 */
export default function TiltedCard({ children, overlay, amplitude = 9, scaleOnHover = 1.035, className = "" }: { children: ReactNode; overlay?: ReactNode; amplitude?: number; scaleOnHover?: number; className?: string }) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);
  return <figure className={`tilted-card ${className}`}
    onPointerMove={(event) => {
      if (reduced || event.pointerType !== "mouse") return;
      const box = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5, y = (event.clientY - box.top) / box.height - 0.5;
      rotateX.set(y * -amplitude * 2); rotateY.set(x * amplitude * 2);
    }}
    onPointerEnter={(event) => { if (!reduced && event.pointerType === "mouse") scale.set(scaleOnHover); }}
    onPointerLeave={() => { rotateX.set(0); rotateY.set(0); scale.set(1); }}>
    <motion.div className="tilted-card-inner" style={{ rotateX, rotateY, scale }}>
      {children}
      {overlay ? <div className="tilted-card-overlay">{overlay}</div> : null}
    </motion.div>
  </figure>;
}
