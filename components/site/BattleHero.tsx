"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortalState } from "@/components/hero/portalState";
import PortalAudio from "@/components/hero/PortalAudio";
import DepthText from "@/components/reactbits/DepthText";
import { Badge, Button } from "@/components/ds/primitives";
import { ArrowDown, Pause, Play } from "lucide-react";
import "@/components/hero/portal.css";
const PortalCanvas = dynamic(() => import("@/components/hero/PortalCanvas"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);
const smooth = (p: number, a: number, b: number) => { const t = Math.max(0, Math.min(1, (p - a) / (b - a))); return t * t * (3 - 2 * t); };

export default function BattleHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const travel = useRef({ progress: 0 });
  const sequence = useRef<PortalState>({ progress: 0, raw: 0, intro: 0, finale: 0, pointerX: 0, pointerY: 0, time: 0, paused: false });
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
    const raw = travel.current.progress;
    // One scroll source, three clocks: the vortex collapse, the approved story, the gateway ceremony.
    const p = Math.max(0, Math.min(1, (raw - .16) / .64));
    sequence.current.raw = raw;
    sequence.current.intro = smooth(raw, .04, .2);
    sequence.current.finale = smooth(raw, .78, 1);
    sequence.current.progress = p; sequence.current.invalidate?.();
    const next = raw < .16 ? 0 : raw < .86 ? 1 : 2;
    setChapter(value => value === next ? value : next);
    const style = stage.current?.style;
    if (!style) return;
    const leave = smooth(raw, .07, .17), arrival = smooth(raw, .8, .9), title = smooth(raw, .86, .93);
    style.setProperty("--portal-progress", String(raw));
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
    travel.current.progress = 0;
    sync();
    gsap.to(travel.current, { progress: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${Math.max(1, (root.current?.offsetHeight ?? innerHeight) - (stage.current?.offsetHeight ?? innerHeight))}`, scrub: .55, invalidateOnRefresh: true }, onUpdate: sync });
    // Reveal owns the overview's children; this timeline owns only its wrapper.
    const overview = document.getElementById("experience");
    if (overview) gsap.fromTo(overview, { y: 70, opacity: .35 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: overview, start: "top bottom", end: "top 55%", scrub: .7 } });
    return () => { sequence.current.progress = 0; travel.current.progress = 0; stage.current?.removeAttribute("style"); };
  }, { scope: root, dependencies: [live, sync], revertOnUpdate: true });

  const enter = () => {
    if (!live || paused) { document.getElementById("experience")?.scrollIntoView({ behavior: "auto" }); return; }
    const element = root.current;
    if (element) window.scrollTo({ top: element.getBoundingClientRect().top + scrollY + (element.offsetHeight - (stage.current?.offsetHeight ?? innerHeight)) * .96, behavior: "smooth" });
  };

  return <section ref={root} className={`battle-hero portal-hero ${live ? "portal-live" : "portal-static"} ${live && ready ? "portal-ready" : ""}`} aria-labelledby="hero-title" data-scene={live && ready ? "webgl" : "still"} data-chapter={live ? chapter : 0}>
    <div ref={stage} className="portal-stage" onPointerMove={event => {
      if (!live || paused || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      sequence.current.pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
      sequence.current.pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
      sequence.current.pointerActive = true;
    }} onPointerLeave={() => { sequence.current.pointerX = 0; sequence.current.pointerY = 0; sequence.current.pointerActive = false; }}>
      <div className="battle-hero-image" aria-hidden="true"><Image src="/media/generated/theme-v3/hero-portal-still-v1.webp" alt="" fill priority sizes="100vw"/></div>
      {live && <div className="portal-canvas" aria-hidden="true"><PortalCanvas sequence={sequence.current} active={active} onReady={onReady} onFailure={onFailure}/></div>}
      <div className="battle-hero-shade"/>
      <div className="hero-copy-layer" inert={live && chapter !== 0}>
        <div className="hero-copy">
          <Badge>Sunscape · Altitude · Pinnacle</Badge>
          <DepthText as="h1" id="hero-title" text={"Play beyond\nthe screen."} accent="screen." />
          <p className="portal-description">Games, cabinets and connected systems for the gaming floor.</p>
          <div className="ds-actions">
            <Button href="/games">Explore the games</Button>
            <button type="button" className="ds-button ds-button--ghost" onClick={enter}><span>See the experience</span><ArrowDown aria-hidden="true" size={16} strokeWidth={1.75} /></button>
          </div>
        </div>
      </div>
      {live && <>
        <div className="portal-passage" aria-hidden="true"><p>Entering the system.</p></div>
        <div className="portal-arrival-copy" inert={chapter !== 2}>
          <DepthText as="h2" text={"Every world\nstarts here."} accent="here." />
          <Button href="#experience" variant="link" icon={false}>Discover the Tierplay experience</Button>
        </div>
      </>}
      <div className="portal-controls" role="group" aria-label="Hero controls">
        {live && ready && <PortalAudio sequence={sequence.current} active={active} paused={paused}/>}
        {live && ready && <button type="button" className="portal-icon-button" aria-pressed={paused} aria-label={paused ? "Resume motion" : "Pause motion"} title={paused ? "Resume motion" : "Pause motion"} onClick={() => { const next = !paused; sequence.current.paused = next; setPaused(next); if (!next) sync(); sequence.current.invalidate?.(); }}>{paused ? <Play aria-hidden="true" size={15} strokeWidth={1.75}/> : <Pause aria-hidden="true" size={15} strokeWidth={1.75}/>}</button>}
        <a className="portal-skip" href="#experience">{live ? "Skip to explore" : "Explore Tierplay"}<ArrowDown aria-hidden="true" size={14} strokeWidth={1.75}/></a>
      </div>
      <div className="portal-progress" aria-hidden="true"/>
    </div>
    {!live && <div className="portal-static-gateway"><Image src="/media/generated/theme-v3/entrance-editorial-v5.webp" alt="An obsidian gateway illuminated by violet light, opening into the Tierplay world." fill sizes="100vw"/><div><Badge>The gateway</Badge><h2>Every world starts here.</h2><Button href="#experience">Discover Tierplay</Button></div></div>}
  </section>;
}
