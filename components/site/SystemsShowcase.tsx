"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { systems } from "@/content/site";

const DWELL = 7000;
type System = (typeof systems)[number];

/**
 * Connected systems as a poster stage. One large campaign poster at a time wipes in over the last
 * (with a slow push-in while it holds); a vertical index beside it expands the active system's copy.
 * The progressive-jackpot slide layers real in-game jackpot screens over the poster as proof. It
 * advances like stories while on screen, and stops for good once the visitor takes control.
 */
export default function SystemsShowcase({ action = true }: { action?: boolean }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);

  const go = useCallback((index: number, manual = false) => {
    setActive((current) => {
      if (index === current) return current;
      setPrevious(current);
      return index;
    });
    setCycle((value) => value + 1);
    if (manual) setAuto(false);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 });
    observer.observe(element);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    return () => observer.disconnect();
  }, []);

  // Story-style advance, driven by the active progress bar's own CSS animation: it pauses while off
  // screen, hovered or focused, and the poster changes exactly when the bar completes.
  const paused = !visible || held;
  const advance = () => { if (auto) go((active + 1) % systems.length); };

  // A gentle pointer parallax: the poster drifts one way, the proof cards the other.
  useEffect(() => {
    const element = stage.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    let frame = 0, tx = 0, ty = 0, x = 0, y = 0;
    const loop = () => {
      x += (tx - x) * .08; y += (ty - y) * .08;
      element.style.setProperty("--px", x.toFixed(3)); element.style.setProperty("--py", y.toFixed(3));
      frame = Math.abs(tx - x) + Math.abs(ty - y) > .001 ? requestAnimationFrame(loop) : 0;
    };
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      tx = (event.clientX - box.left) / box.width - .5; ty = (event.clientY - box.top) / box.height - .5;
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const leave = () => { tx = 0; ty = 0; if (!frame) frame = requestAnimationFrame(loop); };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); cancelAnimationFrame(frame); };
  }, []);

  const keys = (event: KeyboardEvent) => {
    const next = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: systems.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const index = (next + systems.length) % systems.length;
    go(index, true);
    tabs.current[index]?.focus();
  };

  const current: System = systems[active];

  return <div ref={root} className="showcase" data-auto={auto} data-paused={paused} style={{ ["--dwell" as string]: `${DWELL}ms` }} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
    <div ref={stage} className="showcase__stage" aria-live="polite">
      {systems.map((system, i) => <figure key={system.id} className="showcase__slide" data-state={i === active ? "active" : i === previous ? "previous" : "idle"} aria-hidden={i !== active}>
        <div className="showcase__poster">
          <Image src={system.poster.src} alt={i === active ? system.poster.alt : ""} fill sizes="(max-width: 960px) 100vw, 58vw" priority={i === 0} />
        </div>
        {"proof" in system ? <div className="showcase__proof" aria-hidden="true">
          {system.proof.map((shot, n) => <span key={shot.src} className="showcase__shot" style={{ ["--n" as string]: n }}>
            <Image src={shot.src} alt="" fill sizes="160px" />
          </span>)}
        </div> : null}
      </figure>)}
      <div className="showcase__caption">
        <span>{String(active + 1).padStart(2, "0")} / {String(systems.length).padStart(2, "0")}</span>
        <span>{"proof" in current ? "Poster with in-game jackpot screens" : "Campaign poster"}</span>
      </div>
    </div>

    <div className="showcase__index" role="group" aria-label="Tierplay systems" onKeyDown={keys}>
      {systems.map((system, i) => {
        const selected = i === active;
        return <div key={system.id} className="showcase__item" data-active={selected}>
          <button ref={(b) => { tabs.current[i] = b; }} type="button" id={`${uid}-tab-${i}`} aria-expanded={selected} aria-controls={`${uid}-panel-${i}`} onClick={() => go(i, true)}>
            <span className="showcase__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="showcase__name">{system.tab}</span>
            <span className="showcase__code">{system.code}</span>
            <span className="showcase__bar" aria-hidden="true"><i key={selected ? cycle : -1} onAnimationEnd={selected ? advance : undefined} /></span>
          </button>
          <div className="showcase__panel" role="region" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} inert={!selected}>
            <div className="showcase__body">
              <h3>{system.name}</h3>
              <p>{system.copy}</p>
              <ul>{system.features.map((feature) => <li key={feature}><Check aria-hidden="true" size={14} strokeWidth={2} />{feature}</li>)}</ul>
              {"stats" in system ? <div className="showcase__stats">
                <dl>{system.stats.map((stat) => <div key={stat.label}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}</dl>
                <p>{system.statsNote}</p>
              </div> : null}
              {"note" in system ? <p className="showcase__note">{system.note}</p> : null}
              {action ? <Link className="showcase__link" href={system.href}>Learn more<ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} /></Link> : null}
            </div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}
