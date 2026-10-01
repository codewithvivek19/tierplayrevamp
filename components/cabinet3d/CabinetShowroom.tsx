"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Monitor } from "lucide-react";
import { defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit, useStageMode, useStageVisibility } from "./useStage";
import type { CabinetId } from "./cabinetModels";
import { Button, Label } from "@/components/ds/primitives";
import { cabinets } from "@/content/site";

const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);

const [altitude, pinnacle] = cabinets;
const consoles: { id: CabinetId; info: (typeof cabinets)[number]; highlight: string }[] = [
  { id: "altitude", info: altitude, highlight: altitude.specifications[0] },
  { id: "pinnacle", info: pinnacle, highlight: pinnacle.specifications[0] },
];
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };

/**
 * Homepage hardware showroom: one pinned stage presents both consoles with equal weight, one after
 * the other. Scrolling turns the current cabinet; halfway through it spins down and the next one
 * rises and powers on. The index names both consoles from the start so neither is a footnote.
 */
export default function CabinetShowroom() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const words = useRef<HTMLDivElement>(null);
  const compact = useRef(false);
  const pose = useRef<StagePose>({ ...defaultPose(), yaw: -0.85, pitch: 0.1, distance: 6.6, targetY: 1.15, offsetX: 0.9, power: 0, float: 0.6 });
  const [mode, fail] = useStageMode();
  const { near, visible } = useStageVisibility(root);
  const [active, setActive] = useState<CabinetId>("altitude");
  const [ready, setReady] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const animated = mode === "live";

  useEffect(() => {
    const measure = () => { compact.current = innerWidth < 820; setIsCompact(compact.current); };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);

  useEffect(() => { if (visible) pose.current.power = 1; }, [visible]);

  const apply = useCallback((progress: number) => {
    const second = progress >= 0.5;
    const local = second ? (progress - 0.5) / 0.5 : progress / 0.5;
    const turn = smooth(local);
    Object.assign(pose.current, compact.current
      ? { yaw: (second ? -0.5 : -0.75) + turn * 1.15, distance: 6.3, targetY: 1.05, offsetX: 0, pitch: 0.06 }
      : { yaw: (second ? -0.55 : -0.85) + turn * 1.35, distance: 6.5 - Math.sin(local * Math.PI) * 0.5, targetY: 1.15, offsetX: 0.95, pitch: 0.1 });
    setActive(second ? "pinnacle" : "altitude");
    fills.current[0]?.style.setProperty("transform", `scaleX(${clamp01(progress / 0.5).toFixed(3)})`);
    fills.current[1]?.style.setProperty("transform", `scaleX(${clamp01((progress - 0.5) / 0.5).toFixed(3)})`);
    words.current?.style.setProperty("--drift", `${(local * -8).toFixed(2)}%`);
  }, []);

  useGSAP(() => {
    if (!animated || !root.current) return;
    const trigger = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (self) => apply(self.progress), onRefresh: (self) => apply(self.progress) });
    return () => trigger.kill();
  }, { dependencies: [animated, apply], scope: root });

  useEffect(() => {
    const element = stage.current;
    if (!animated || !element) return;
    const orbit = bindOrbit(element, (yaw) => { pose.current.drag = yaw; }, { spring: true });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pose.current.pointerX = event.clientX / innerWidth * 2 - 1;
      pose.current.pointerY = event.clientY / innerHeight * 2 - 1;
    };
    const section = root.current;
    section?.addEventListener("pointermove", move);
    return () => { orbit.dispose(); section?.removeEventListener("pointermove", move); };
  }, [animated]);

  const go = (index: number) => {
    const section = root.current;
    if (!section) return;
    const distance = section.offsetHeight - innerHeight;
    scrollTo({ top: section.offsetTop + distance * (index === 0 ? 0.18 : 0.72), behavior: "smooth" });
  };

  // Reduced motion, Save-Data and no WebGL: both consoles side by side at the same size.
  if (mode !== "live") {
    return <section ref={root} className={`showroom showroom--static ds-section ds-container`} id="cabinets" data-mode={mode} aria-labelledby="showroom-title">
      <div className="showroom__intro">
        <Label icon={Monitor}>The hardware</Label>
        <h2 id="showroom-title" className="showroom__title">Two consoles. One floor.</h2>
      </div>
      <div className="showroom__pair">
        {consoles.map(({ id, info }, index) => <article key={id} className="showroom__card">
          <div className="showroom__card-art"><img src={info.image} alt={`${info.name} cabinet`} /></div>
          <span className="ds-card__label">{String(index + 1).padStart(2, "0")} / {info.label}</span>
          <h3>{info.name}</h3>
          <p>{info.copy}</p>
          <Button href={`/cabinets#${id}-3d`} variant="ghost">Tour the {info.name}</Button>
        </article>)}
      </div>
    </section>;
  }

  return <section ref={root} className="showroom" id="cabinets" data-mode={mode} data-ready={ready} data-active={active} aria-labelledby="showroom-title">
    <div className="showroom__sticky">
      <div className="showroom__backdrop" aria-hidden="true">
        <div ref={words} className="showroom__words">
          {consoles.map(({ id, info }) => <span key={id} data-id={id}>{info.name}</span>)}
        </div>
        <svg className="showroom__floor" viewBox="0 0 1600 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="showroom-floor-fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".9" /></linearGradient>
            <mask id="showroom-floor-mask"><rect width="1600" height="400" fill="url(#showroom-floor-fade)" /></mask>
          </defs>
          <g mask="url(#showroom-floor-mask)" stroke="#b58cff" strokeOpacity=".22" strokeWidth="1" fill="none">
            {Array.from({ length: 25 }, (_, i) => <line key={`v${i}`} x1={800 + (i - 12) * 22} y1="0" x2={800 + (i - 12) * 190} y2="400" />)}
            {[18, 44, 78, 122, 180, 256, 352].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="1600" y2={y} />)}
          </g>
        </svg>
        <span className="showroom__scan" />
      </div>
      <div ref={stage} className="showroom__stage">
        {near ? <CabinetStage cabinet={active} pose={pose} active={visible} compact={isCompact} onReady={() => setReady(true)} onFailure={fail} /> : null}
        {!ready ? <img className="showroom__fallback" src={consoles.find((c) => c.id === active)!.info.image} alt="" aria-hidden="true" /> : null}
      </div>

      <div className="showroom__copy">
        <Label icon={Monitor}>The hardware</Label>
        <h2 id="showroom-title" className="showroom__title">Two consoles.{" "}<br />One floor.</h2>
        <div className="showroom__index" role="group" aria-label="Consoles">
          {consoles.map(({ id, info }, index) => <button key={id} type="button" aria-pressed={active === id} onClick={() => go(index)}>
            <i className="showroom__fill" ref={(f) => { fills.current[index] = f; }} aria-hidden="true" />
            <span>{String(index + 1).padStart(2, "0")}</span><b>{info.name}</b><small>{info.label.replace(" monitor cabinet", "")}</small>
          </button>)}
        </div>
        <div className="showroom__details">
          {consoles.map(({ id, info, highlight }, index) => <article key={id} data-active={active === id} inert={active !== id}>
            <span className="ds-card__label">{String(index + 1).padStart(2, "0")} / {info.label}</span>
            <h3>{info.name}</h3>
            <p>{info.copy}</p>
            <ul className="showroom__chips">
              <li>{highlight}</li><li>{info.specifications[1]}</li>
            </ul>
            <div className="showroom__actions">
              <Button href={`/cabinets#${id}-3d`}>Tour the {info.name} in 3D</Button>
            </div>
          </article>)}
        </div>
      </div>
      <p className="showroom__hint" aria-hidden="true">Scroll to meet both · drag to turn</p>
    </div>
  </section>;
}
