"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Interior hero image: settles in on load, then drifts and deepens as the page scrolls away. */
export default function HeroMedia({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const element = root.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(element, { scale: 1.12, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out" });
    gsap.to(element, { yPercent: 14, ease: "none", scrollTrigger: { trigger: element.parentElement, start: "top top", end: "bottom top", scrub: true } });
  }, { scope: root });
  return <div ref={root} className="v2-hero-media">{children}</div>;
}
