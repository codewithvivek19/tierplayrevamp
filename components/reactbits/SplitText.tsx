"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Adapted from React Bits SplitText (TS + CSS). Text renders normally and stays readable
 * if scripting, fonts or the split fail; the masked line reveal only runs once split.
 */
export default function SplitText({ text, as = "h2", className = "", id, delay = 0, immediate = false }: {
  text: string; as?: Tag; className?: string; id?: string; delay?: number; immediate?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => { if (alive) setFontsReady(true); });
    return () => { alive = false; };
  }, []);

  useGSAP(() => {
    const element = ref.current;
    if (!element || !fontsReady || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tween: gsap.core.Tween | undefined;
    const split = new GSAPSplitText(element, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit: (self) => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = gsap.from(self.lines, {
          yPercent: 108,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.09,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: element, start: "top 88%", once: true },
        });
        return tween;
      },
    });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); split.revert(); };
  }, { dependencies: [text, fontsReady, delay, immediate], scope: ref });

  const Tag = as;
  return <Tag ref={ref} id={id} className={`split-text ${className}`}>{text}</Tag>;
}
