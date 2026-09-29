"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState, type CSSProperties } from "react";

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = "tierplay-preloader-seen-v1";
const MIN_DURATION = 3200;
const SCENE_WAIT = 3200;

/**
 * Ignition: one point of light gathers energy while the scene compiles, then flares open
 * into the portal behind it. Waits (bounded) for the hero canvas so the reveal never lands on black.
 */
export default function TierplayPreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"checking" | "visible" | "closing" | "hidden">("checking");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const forced = query.has("preloader");
    const disabled = query.has("no-preloader");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (disabled || (!forced && (reduced || connection?.saveData || sessionStorage.getItem(STORAGE_KEY)))) {
      setStatus("hidden");
      return;
    }
    setStatus("visible");
  }, []);

  useEffect(() => {
    if (status !== "visible") return;
    const start = performance.now();
    let frame = 0, last = 0;
    const sceneReady = () => {
      const hero = document.querySelector(".portal-hero");
      return !hero || !hero.classList.contains("portal-live") || hero.getAttribute("data-scene") === "webgl";
    };
    const tick = (now: number) => {
      const elapsed = now - start;
      const timed = Math.min(elapsed / MIN_DURATION, 1);
      const ready = sceneReady() || elapsed > MIN_DURATION + SCENE_WAIT;
      // Time carries the count to 92%; the last stretch waits for the scene.
      const value = ready ? timed : Math.min(timed, .92);
      const eased = 1 - Math.pow(1 - value, 2.2);
      if (now - last > 40 || (ready && timed === 1)) { setProgress(Math.round(eased * 100)); last = now; }
      if (timed === 1 && ready) { window.setTimeout(() => setStatus("closing"), 180); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status]);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    if (status === "visible") gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: .5, ease: "power2.out" });
    if (status !== "closing") return;
    gsap.timeline({ onComplete: () => { sessionStorage.setItem(STORAGE_KEY, "1"); setStatus("hidden"); } })
      .to(root.querySelectorAll(".tpl-ui"), { autoAlpha: 0, y: 10, duration: .35, ease: "power2.in", stagger: .04 }, 0)
      .to(root.querySelector(".tpl-ignition"), { scale: 7, filter: "blur(18px)", duration: 1.05, ease: "expo.in" }, .15)
      .to(root.querySelector(".tpl-streak"), { scaleX: 3, opacity: 0, duration: .9, ease: "expo.in" }, .15)
      .to(root.querySelector(".tpl-flash"), { opacity: 1, duration: .55, ease: "power2.in" }, .55)
      .to(root, { autoAlpha: 0, duration: .75, ease: "power2.out" }, 1.1);
  }, { scope: rootRef, dependencies: [status] });

  if (status === "checking" || status === "hidden") return null;

  const skip = () => { setProgress(100); setStatus("closing"); };

  return (
    <div ref={rootRef} className="tierplay-preloader" role="status" aria-label={`Loading Tierplay experience, ${progress} percent`} style={{ "--p": progress / 100 } as CSSProperties}>
      <div className="tpl-grain" aria-hidden="true" />
      <div className="tpl-frame" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="tpl-stage" aria-hidden="true">
        <div className="tpl-streak" />
        <div className="tpl-ignition"><span className="tpl-halo" /><span className="tpl-core" /></div>
      </div>
      <div className="tpl-flash" aria-hidden="true" />
      <div className="tpl-meta">
        <img className="tpl-ui tpl-logo" src="/media/generated/production-stills/tierplay-logo-official.svg" alt="Tierplay" />
        <p className="tpl-ui tpl-line">Entering the Tierplay universe</p>
        <div className="tpl-ui tpl-bar" aria-hidden="true"><i /></div>
        <p className="tpl-ui tpl-count" aria-hidden="true">{String(progress).padStart(3, "0")}</p>
      </div>
      <button className="tpl-ui tpl-skip" type="button" onClick={skip}>Skip intro</button>
    </div>
  );
}
