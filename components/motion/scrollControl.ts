import type Lenis from "lenis";

/** The page's single Lenis instance (null under reduced motion, before mount, or on the study routes). */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => { instance = lenis; };
export const getLenis = () => instance;

const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
// Expo-out: a decisive start that settles softly, the same feel as wheel scrolling under Lenis.
const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Scroll the page to a number or element. Goes through Lenis when it is running so programmatic
 * scrolls share the wheel's easing; otherwise falls back to native scrolling.
 */
export function smoothScrollTo(target: number | HTMLElement, options: { offset?: number; duration?: number; immediate?: boolean } = {}) {
  const { offset = 0, duration, immediate = false } = options;
  if (instance && !reduced()) {
    const distance = Math.abs((typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY + offset) - scrollY);
    // Long trips take a little longer, never so long that the page feels like it is being driven.
    const time = duration ?? Math.min(1.8, Math.max(.7, .55 + distance / 4200));
    instance.scrollTo(target, { offset, duration: time, easing: expoOut, immediate, force: true });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY + offset;
  scrollTo({ top, behavior: immediate || reduced() ? "auto" : "smooth" });
}
