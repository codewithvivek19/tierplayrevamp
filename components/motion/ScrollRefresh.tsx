"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Re-measures every ScrollTrigger when late content (hero readiness, images, fonts) changes the page height. */
export default function ScrollRefresh() {
  const pathname = usePathname();
  useEffect(() => {
    let height = document.documentElement.scrollHeight;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      const next = document.documentElement.scrollHeight;
      if (Math.abs(next - height) < 2) return;
      height = next;
      clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    observer.observe(document.body);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [pathname]);
  return null;
}
