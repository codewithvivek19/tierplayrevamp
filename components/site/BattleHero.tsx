"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortalState } from "@/components/hero/portalState";
import PortalAudio from "@/components/hero/PortalAudio";
import "@/components/hero/portal.css";
const PortalCanvas = dynamic(() => import("@/components/hero/PortalCanvas"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);
const smooth = (p: number, a: number, b: number) => { const t = Math.max(0, Math.min(1, (p - a) / (b - a))); return t * t * (3 - 2 * t); };

export default function BattleHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const travel = useRef({ progress: 0 });
  const sequence = useRef<PortalState>({ progress: 0, pointerX: 0, pointerY: 0, time: 0, paused: false });
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [chapter, setChapter] = useState(0);
  const live = enabled && !failed;
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const onReady = useCallback(() => setReady(true), []);
  const sync = useCallback(() => {
    if (sequence.current.paused) return;
    const p = travel.current.progress;
    sequence.current.progress = p; sequence.current.invalidate?.();
    const next = p < .36 ? 0 : p < .8 ? 1 : 2;
    setChapter(value => value === next ? value : next);
    const style = stage.current?.style;
    if (!style) return;
    const leave = smooth(p, .23, .36), arrival = smooth(p, .66, .86), title = smooth(p, .82, .94);
    style.setProperty("--portal-progress", String(p));
    style.setProperty("--intro-opacity", String(1 - leave));
    style.setProperty("--intro-y", `${-leave * 65}px`);
    style.setProperty("--passage-opacity", String(smooth(p, .66, .7) * (1 - smooth(p, .76, .8))));
    style.setProperty("--arrival-opacity", String(arrival));
    style.setProperty("--arrival-radius", `${arrival * 145}%`);
    style.setProperty("--arrival-scale", String(1.22 - arrival * .22));
    style.setProperty("--arrival-title", String(title));
    style.setProperty("--arrival-y", `${(1 - title) * 45}px`);
    style.setProperty("--scene-opacity", "1");
  }, []);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      setReady(false); setChapter(0);
      setEnabled(!reduced.matches && !saveData && !new URLSearchParams(location.search).has("no-webgl"));
    };
    update(); reduced.addEventListener("change", update);
    let visible = true;
    const visibility = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", visibility);
    return () => { reduced.removeEventListener("change", update); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useGSAP(() => {
    if (!live) return;
    gsap.to(travel.current, { progress: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: .9, invalidateOnRefresh: true }, onUpdate: sync });
    // Reveal owns the overview's children; this timeline owns only its wrapper.
    const overview = document.getElementById("experience");
    if (overview) gsap.fromTo(overview, { y: 70, opacity: .35 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: overview, start: "top bottom", end: "top 55%", scrub: .7 } });
    return () => { sequence.current.progress = 0; travel.current.progress = 0; stage.current?.removeAttribute("style"); };
  }, { scope: root, dependencies: [live, sync], revertOnUpdate: true });

  const enter = () => {
    if (!live || paused) { document.getElementById("experience")?.scrollIntoView({ behavior: "auto" }); return; }
    const element = root.current;
    if (element) window.scrollTo({ top: element.getBoundingClientRect().top + scrollY + (element.offsetHeight - innerHeight) * .96, behavior: "smooth" });
  };

  return <section ref={root} className={`battle-hero portal-hero ${live ? "portal-live" : "portal-static"} ${live && ready ? "portal-ready" : ""}`} aria-labelledby="hero-title" data-scene={live && ready ? "webgl" : "still"} data-chapter={live ? chapter : 0}>
    <div ref={stage} className="portal-stage" onPointerMove={event => {
      if (!live || paused || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      sequence.current.pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
      sequence.current.pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
      sequence.current.pointerActive = true;
    }} onPointerLeave={() => { sequence.current.pointerX = 0; sequence.current.pointerY = 0; sequence.current.pointerActive = false; }}>
      <div className="battle-hero-image" aria-hidden="true"><Image src="/media/generated/theme-v3/hero-multiverse-v4.webp" alt="" fill priority sizes="100vw"/></div>
      {live && <div className="portal-canvas" aria-hidden="true"><PortalCanvas sequence={sequence.current} active={active} onReady={onReady} onFailure={onFailure}/></div>}
      <div className="battle-hero-shade"/>
      <div className="portal-caption" aria-hidden="true"><span className="portal-signal"/> THE TIERPLAY UNIVERSE <span>0{(live ? chapter : 0) + 1} — 03</span></div>
      <div className="battle-container battle-hero-content" inert={live && chapter !== 0}>
        <div className="battle-hero-copy">
          <p className="portal-eyebrow">Tierplay / The collection</p>
          <h1 id="hero-title"><span>Play beyond</span><span>the <em>screen.</em></span></h1>
          <p className="portal-description">Sunscape games. Altitude and Pinnacle cabinets.<br className="portal-desktop-break"/> Connected systems for the gaming floor.</p>
          <div className="portal-actions"><Link className="battle-button" href="/games">Explore the games <span aria-hidden="true">↗</span></Link><button className="portal-enter" onClick={enter}>See the experience <span aria-hidden="true">↓</span></button></div>
        </div>
        <nav className="hero-product-strip" aria-label="Explore Tierplay products">
          {[{name:"Altitude",href:"/cabinets"},{name:"Pinnacle",href:"/cabinets"},{name:"TCM",href:"/products"},{name:"TLJ",href:"/products"}].map((item,index) => <Link key={item.name} href={item.href}><span>0{index+1}</span>{item.name}<b aria-hidden="true">↗</b></Link>)}
        </nav>
      </div>
      {live && <>
        <div className="portal-passage" aria-hidden="true"><span>02 / Reassembly</span><p>Entering the system.</p></div>
        <div className="portal-arrival-copy" inert={chapter !== 2}><p className="portal-eyebrow">03 / The gateway</p><h2>Every world<br/>starts <em>here.</em></h2><a href="#experience">Discover the Tierplay experience <span aria-hidden="true">↘</span></a></div>
      </>}
      <div className="portal-controls">
        {live && ready && <PortalAudio sequence={sequence.current} active={active} paused={paused}/>}
        {live && ready && <button aria-pressed={paused} onClick={() => { const next = !paused; sequence.current.paused = next; setPaused(next); if (!next) sync(); sequence.current.invalidate?.(); }}>{paused ? "Resume motion" : "Pause motion"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>}
        <a href="#experience">{live ? "Skip to explore" : "Explore Tierplay"}<span aria-hidden="true">↘</span></a>
      </div>
      {live && <div className="portal-scroll-label" aria-hidden="true"><span className="portal-scroll-glyph">↓</span><span>{["SCROLL TO EXPLORE", "THE STRUCTURE UNFOLDS", "EXPLORE THE COLLECTION"][chapter]}</span></div>}
      <div className="portal-progress" aria-hidden="true"/>
    </div>
    {!live && <div className="portal-static-gateway"><Image src="/media/generated/theme-v3/entrance-editorial-v5.webp" alt="An obsidian gateway illuminated by violet light, opening into the Tierplay world." fill sizes="100vw"/><div><p className="portal-eyebrow">The gateway</p><h2>Every world starts here.</h2><a className="battle-button" href="#experience">Discover Tierplay <span aria-hidden="true">↘</span></a></div></div>}
  </section>;
}
