"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, setLenis, smoothScrollTo } from "./scrollControl";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis drives wheel and trackpad scrolling; GSAP's ticker drives Lenis, so ScrollTrigger scrubs,
 * the WebGL hero and Lenis advance in the same frame and never fight. Touch keeps the device's own
 * momentum (smoother than any JS emulation), and reduced motion keeps native scrolling.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: .085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: .95,
      // Stop automatically while something locks the page (the mobile menu sets overflow: hidden).
      autoToggle: true,
      // Clicking an internal link stops any glide so the next page never inherits momentum.
      stopInertiaOnNavigate: true,
      // Scrollable panels and dialogs keep native scrolling and their own wheel handling.
      prevent: (node) => node.tagName === "DIALOG" || node.classList.contains("guide__panel"),
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchors glide with the same easing as the wheel.
    const anchors = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href*='#']");
      if (!link || link.origin !== location.origin || link.pathname !== location.pathname || !link.hash) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      history.pushState(history.state, "", link.hash);
      smoothScrollTo(target, { offset: target.id === "main" ? 0 : -12 });
      if (target.id === "main" || target.tabIndex >= 0 || target.matches("a, button, input, textarea, select")) target.focus({ preventScroll: true });
    };
    document.addEventListener("click", anchors);

    return () => {
      document.removeEventListener("click", anchors);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Route changes: Next places the new page (top for links, restored position for Back); Lenis drops
  // any inertia from the previous page and adopts that position, then measures the new page.
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      second = requestAnimationFrame(() => { lenis.resize(); ScrollTrigger.refresh(); });
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [pathname]);

  return null;
}
