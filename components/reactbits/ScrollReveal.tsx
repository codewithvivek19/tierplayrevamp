"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Adapted from React Bits ScrollReveal (TS + CSS): words brighten as the statement scrolls
 * through the viewport. Cleanup is scoped to this element (the source killed every trigger).
 */
export default function ScrollReveal({ children, as = "p", className = "" }: { children: string; as?: "p" | "h2"; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => children.split(/(\s+)/).map((word, index) => /^\s+$/.test(word) ? word : <span className="scroll-reveal-word" key={index}>{word}</span>), [children]);

  useGSAP(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(element.querySelectorAll(".scroll-reveal-word"), { opacity: 0.14 }, {
      opacity: 1, ease: "none", stagger: 0.05,
      scrollTrigger: { trigger: element, start: "top 85%", end: "bottom 45%", scrub: true },
    });
  }, { dependencies: [children], scope: ref });

  const Tag = as;
  return <Tag ref={ref} className={`scroll-reveal ${className}`}>{words}</Tag>;
}
