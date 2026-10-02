"use client";

import { useEffect, useRef, useState, type ComponentType, type HTMLAttributes, type Ref } from "react";

// Adapted from Planes "Cinematic Text" (useplanes.com/r/cinematic-text.json): each word drifts down
// out of a heavy blur and settles, like a camera pulling focus. Tierplay changes: CSS transitions
// instead of a Motion component per word (no per-frame JS); words stay real text for search and
// screen readers instead of an sr-only duplicate; hidden only once JavaScript has marked the page
// (html.js), with a late fallback reveal, so a headline can never stay invisible.
type Props = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  id?: string;
  className?: string;
  delay?: number;
  stagger?: number;
  blur?: number;
};

export default function CinematicText({ children, as = "h2", id, className = "", delay = .2, stagger = .11, blur = 28 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const Tag = as as unknown as ComponentType<HTMLAttributes<HTMLElement> & { ref: Ref<HTMLElement>; "data-in"?: string }>;
  const words = children.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShown(true); observer.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <Tag ref={ref} id={id} className={`cine ${className}`} data-in={shown ? "true" : undefined}
    style={{ ["--cine-delay" as string]: `${delay}s`, ["--cine-stagger" as string]: `${stagger}s`, ["--cine-blur" as string]: `${blur}px` }}>
    {words.map((word, i) => <span key={`${word}-${i}`}><span className="cine__w" style={{ ["--i" as string]: i }}>{word}</span>{i < words.length - 1 ? " " : ""}</span>)}
  </Tag>;
}
