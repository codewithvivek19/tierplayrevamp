"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CoreFallback from "./CoreFallback";
import { worlds, type CoreState } from "./coreState";
import "./hero.css";

const CoreCanvas = dynamic(() => import("./PlayCoreCanvas"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PlayCoreHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sequence = useRef<CoreState>({ progress: 0, pointerX: 0, pointerY: 0, selected: 0 });
  const [policy, setPolicy] = useState({ checked: false, reduced: false, blocked: false, compact: false });
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [selected, setSelected] = useState(0);
  const staticMode = policy.reduced || policy.blocked || policy.compact || failed;
  const still = staticMode || paused;
  const onFailure = useCallback(() => setFailed(true), []);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-height: 600px)");
    const update = () => {
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      setPolicy({ checked: true, reduced: preference.matches, compact: compact.matches, blocked: Boolean(saveData) || new URLSearchParams(location.search).has("no-webgl") });
    };
    update();
    preference.addEventListener("change", update);
    compact.addEventListener("change", update);
    return () => { preference.removeEventListener("change", update); compact.removeEventListener("change", update); };
  }, []);

  useGSAP(() => {
    if (!policy.checked || still) return;
    const element = root.current;
    if (!element) return;
    const intro = element.querySelector(".core-intro");
    const unfold = element.querySelector(".core-unfold");
    const world = element.querySelector(".core-world-copy");
    const artwork = element.querySelector(".core-world-art");
    const scene = element.querySelector(".core-scene");
    const meter = element.querySelector(".core-meter-fill");
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: element, start: "top top", end: "bottom bottom", scrub: .65,
        onUpdate: self => {
          const next = self.progress < .3 ? 0 : self.progress < .73 ? 1 : 2;
          setChapter(value => value === next ? value : next);
        },
      },
    });
    timeline.to(sequence.current, { progress: 1, duration: 1, onUpdate: () => sequence.current.invalidate?.() }, 0)
      .to(intro, { opacity: 0, y: -55, duration: .12 }, .16)
      .fromTo(unfold, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .1 }, .3)
      .to(unfold, { opacity: 0, y: -45, duration: .1 }, .62)
      .fromTo(artwork, { clipPath: "circle(0% at 63% 48%)", scale: 1.15, opacity: 0 }, { clipPath: "circle(115% at 63% 48%)", scale: 1, opacity: 1, duration: .25 }, .72)
      .to(scene, { opacity: 0, duration: .12 }, .79)
      .fromTo(world, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: .1 }, .87)
      .fromTo(meter, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    return () => { sequence.current.progress = 0; sequence.current.invalidate?.(); };
  }, { scope: root, dependencies: [policy.checked, still], revertOnUpdate: true });

  const go = (progress: number) => {
    if (still) { document.getElementById(progress === 1 ? "games" : "experience")?.scrollIntoView({ behavior: "auto" }); return; }
    const element = root.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (element.offsetHeight - innerHeight) * progress, behavior: "smooth" });
  };
  const selectWorld = (index: number) => {
    setSelected(index);
    sequence.current.selected = index;
    sequence.current.invalidate?.();
  };

  return (
    <section ref={root} className={`play-core-hero ${still ? "core-still" : ""} ${ready && !still ? "core-ready" : ""}`} aria-label="Explore the Tierplay play engine" data-chapter={still ? 0 : chapter}>
      <div className="core-stage" ref={stage} onPointerMove={event => {
        if (event.pointerType !== "mouse" || still) return;
        const rect = event.currentTarget.getBoundingClientRect();
        sequence.current.pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
        sequence.current.pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
        sequence.current.invalidate?.();
      }} onPointerLeave={() => { sequence.current.pointerX = 0; sequence.current.pointerY = 0; sequence.current.invalidate?.(); }}>
        <div className="core-grid" aria-hidden="true"/>
        <div className="core-scene" aria-hidden="true">
          <CoreFallback />
          {policy.checked && !still ? <CoreCanvas sequence={sequence.current} onReady={onReady} onFailure={onFailure}/> : null}
        </div>
        <div className="core-world-art" aria-hidden="true"><img src="/media/dragon-world-v2.webp" alt="" width="1672" height="941" loading="lazy"/><div/></div>
        <div className="core-topline"><span><i/> THE INFINITE PLAY ENGINE</span><span>TIERPLAY / ENTER THE EXPERIENCE</span></div>

        <div className="core-intro" inert={!still && chapter !== 0}>
          <p className="core-overline">A new dimension of play</p>
          <h1 id="hero-title">PLAY<br/><span>BEYOND<span className="core-period">.</span></span></h1>
          <p className="core-description">One spark. Infinite possibilities.<br/>Step inside the worlds of Tierplay.</p>
          <div className="core-actions"><button className="core-enter" onClick={() => go(.42)}>Enter the system <span aria-hidden="true">↗</span></button><Link href="/games" className="core-browse">Explore games <span aria-hidden="true">↗</span></Link></div>
        </div>

        <div className="core-object-label" aria-hidden="true"><span>01 / PLAY CORE</span><span className="core-label-line"/><b>ENERGY IN MOTION</b></div>

        <div className="core-unfold" inert={still || chapter !== 1}>
          <p className="core-overline">The collection, unleashed</p>
          <h2>WORLDS<br/><span>WITHIN.</span></h2>
          <p className="core-description">Every fragment holds another possibility.<br/>Choose a world. Keep scrolling to go deeper.</p>
          <div className="core-world-picker" aria-label="Featured game artwork">
            {worlds.map((world, index) => <button key={world.name} aria-pressed={selected === index} aria-label={world.name} onClick={() => selectWorld(index)} style={{ "--world-color": world.color } as React.CSSProperties}><span>{String(index + 1).padStart(2,"0")}</span></button>)}
          </div>
          <p className="core-selected-title" aria-live="polite">{worlds[selected].name}</p>
        </div>

        <div className="core-world-copy" inert={still || chapter !== 2}>
          <p className="core-overline">Sunscape / featured world</p>
          <h2>BEYOND<br/>THE <span>SCREEN.</span></h2>
          <p className="core-description">Rise of the Dragon.<br/>A world waiting to be discovered.</p>
          <Link href="/games" className="core-enter">Discover the collection <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="core-bottom">
          <div className="core-chapters" aria-label="Experience chapters">{["Ignite", "Unfold", "Enter world"].map((name, index) => <button key={name} onClick={() => go([0, .45, .98][index])} aria-current={(still ? 0 : chapter) === index ? "step" : undefined}><span>0{index+1}</span>{name}</button>)}</div>
          <div className="core-scroll-note" aria-hidden="true"><span className="core-scroll-line"/>{still ? "EXPLORE AT YOUR PACE" : "SCROLL TO UNFOLD"}</div>
          <div className="core-controls"><a href="#experience">Skip intro ↘</a>{!staticMode ? <button onClick={() => {
            const top = root.current ? root.current.getBoundingClientRect().top + window.scrollY : 0;
            setPaused(value => !value); setReady(false); setChapter(0);
            requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
          }}>{paused ? "Resume motion" : "Pause motion"}</button> : <span>Still view</span>}</div>
        </div>
        <div className="core-meter" aria-hidden="true"><div className="core-meter-fill"/></div>
      </div>
    </section>
  );
}
