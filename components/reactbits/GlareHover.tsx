import type { CSSProperties, ReactNode } from "react";

/**
 * Adapted from React Bits GlareHover (TS + CSS). CSS-only sweep; sizing comes from the parent
 * layout instead of fixed width/height props, and keyboard focus plays the same glare.
 */
export default function GlareHover({ children, className = "", color = "255, 255, 255", opacity = 0.32, angle = -45 }: { children: ReactNode; className?: string; color?: string; opacity?: number; angle?: number }) {
  return <div className={`glare-hover ${className}`} style={{ "--gh-rgba": `rgba(${color}, ${opacity})`, "--gh-angle": `${angle}deg` } as CSSProperties}>{children}</div>;
}
