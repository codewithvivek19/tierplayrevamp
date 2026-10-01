"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight } from "lucide-react";
import { defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit, useStageMode, useStageVisibility } from "./useStage";
import { Badge } from "@/components/ds/primitives";
import { cabinets } from "@/content/site";

const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });
const [altitude, pinnacle] = cabinets;

/** Cabinets page opener: both consoles stand side by side at equal height, each with its own entry into the 3D tour. */
export default function CabinetsHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pose = useRef<StagePose>({ ...defaultPose(), yaw: 0, pitch: 0.06, distance: 6.3, targetY: 1.12, float: 0.7, power: 0 });
  const [mode, fail] = useStageMode();
  const { near, visible } = useStageVisibility(root);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const live = mode === "live" || mode === "still";

  useEffect(() => {
    const measure = () => {
      setCompact(innerWidth < 820);
      Object.assign(pose.current, innerWidth < 820 ? { distance: 7.6, targetY: 1.1 } : { distance: 6.3, targetY: 1.12 });
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);
  useEffect(() => { if (visible || mode === "still") pose.current.power = 1; }, [visible, mode]);

  useEffect(() => {
    const element = stage.current;
    if (mode !== "live" || !element) return;
    const orbit = bindOrbit(element, (yaw) => { pose.current.drag = yaw; }, { spring: true });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = element.getBoundingClientRect();
      pose.current.pointerX = (event.clientX - box.left) / box.width * 2 - 1;
      pose.current.pointerY = (event.clientY - box.top) / box.height * 2 - 1;
    };
    const leave = () => { pose.current.pointerX = 0; pose.current.pointerY = 0; };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => { orbit.dispose(); element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); };
  }, [mode]);

  return <section ref={root} className="cab-hero" data-mode={mode} data-ready={ready} aria-labelledby="cab-hero-title">
    <div className="cab-hero__backdrop" aria-hidden="true">
      <span className="cab-hero__beam cab-hero__beam--left" />
      <span className="cab-hero__beam cab-hero__beam--right" />
      <svg className="cab-hero__floor" viewBox="0 0 1600 360" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cab-floor-fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".7" stopColor="#fff" stopOpacity=".8" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <mask id="cab-floor-mask"><rect width="1600" height="360" fill="url(#cab-floor-fade)" /></mask>
        </defs>
        <g mask="url(#cab-floor-mask)" stroke="#b58cff" strokeOpacity=".2" fill="none">
          {Array.from({ length: 31 }, (_, i) => <line key={`v${i}`} x1={800 + (i - 15) * 16} y1="0" x2={800 + (i - 15) * 150} y2="360" />)}
          {[14, 34, 62, 100, 152, 222, 312].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="1600" y2={y} />)}
        </g>
      </svg>
    </div>

    <header className="cab-hero__head ds-container">
      <Badge>Tierplay cabinets · 2 consoles</Badge>
      <h1 id="cab-hero-title" className="cab-hero__title">Two consoles.<br />Built for the floor.</h1>
      <p className="cab-hero__intro">The upright Altitude and the curved-screen Pinnacle. Both are listed with a 43-inch touchscreen and a 4K display. Tour each one in 3D.</p>
    </header>

    <div ref={stage} className="cab-hero__stage">
      {live && near ? <CabinetStage cabinet="altitude" pair pose={pose} active={visible} still={mode === "still"} compact={compact} onReady={() => setReady(true)} onFailure={fail} /> : null}
      {!live || !ready ? <div className="cab-hero__fallback" aria-hidden="true"><img src={altitude.image} alt="" /><img src={pinnacle.image} alt="" /></div> : null}
    </div>

    <nav className="cab-hero__picks ds-container" aria-label="Choose a console to tour">
      {[altitude, pinnacle].map((item, index) => <a key={item.name} href={`#${item.name.toLowerCase()}-3d`} className="cab-hero__pick">
        <span className="cab-hero__num">{String(index + 1).padStart(2, "0")}</span>
        <span className="cab-hero__name"><b>{item.name}</b><small>{item.label}</small></span>
        <span className="cab-hero__go">Tour in 3D <ArrowDownRight aria-hidden="true" size={16} strokeWidth={1.75} /></span>
      </a>)}
    </nav>
  </section>;
}
