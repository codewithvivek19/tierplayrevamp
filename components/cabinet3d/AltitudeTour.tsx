"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { anchorOrder, defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit, useStageMode, useStageVisibility } from "./useStage";
import AltitudeExplorer, { type ExplorerPart } from "./AltitudeExplorer";
import type { AltitudeAnchor } from "./altitudeModel";
import { cabinets } from "@/content/site";

const explorerParts: ExplorerPart[] = [];
const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);

type Chapter = {
  label: string;
  title: string;
  copy: string;
  anchor: AltitudeAnchor | null;
  pose: Partial<StagePose>;
  mobile?: Partial<StagePose>;
};

const altitude = cabinets[0];

// Copy is limited to the published Altitude specifications and cabinet capabilities in content/site.ts.
const chapters: Chapter[] = [
  { label: "Overview", title: "Altitude Console", copy: altitude.copy, anchor: null,
    pose: { yaw: -0.5, pitch: 0.08, distance: 6.3, targetY: 1.2, offsetX: 0.95, glow: 1 },
    mobile: { distance: 7.4, targetY: 1.45, offsetX: 0 } },
  { label: "Display", title: "43-inch vertical touchscreen", copy: "A 4K resolution display, upright on the cabinet.", anchor: "screen",
    pose: { yaw: -0.14, pitch: 0.04, distance: 3.7, targetY: 1.74, offsetX: 0.55, glow: 1 },
    mobile: { distance: 4.4, targetY: 1.55, offsetX: 0 } },
  { label: "Lighting", title: "Ambient monitor lighting", copy: "Light lines trace the display edge, console and pedestal.", anchor: "ledEdge",
    pose: { yaw: 0.62, pitch: 0.06, distance: 4.1, targetY: 1.6, offsetX: 0.45, glow: 1.35 },
    mobile: { distance: 4.8, targetY: 1.45, offsetX: 0 } },
  { label: "Payments", title: "Validators and ticketing", copy: "Listed with JCM UBA validators and Epic Edge and Mothagoose ticketing systems.", anchor: "billAcceptor",
    pose: { yaw: -0.22, pitch: 0.34, distance: 2.7, targetY: 1.1, offsetX: 0.32, glow: 1 },
    mobile: { distance: 3.4, targetY: 0.95, offsetX: 0 } },
  { label: "Controls", title: "Dual bash buttons", copy: "Physical player buttons sit alongside on-screen controls.", anchor: "buttons",
    pose: { yaw: 0.3, pitch: 0.52, distance: 2.5, targetY: 1.04, offsetX: 0.3, glow: 1 },
    mobile: { distance: 3.2, targetY: 0.9, offsetX: 0 } },
  { label: "Build", title: "Modular, interchangeable build", copy: "Published as made in the USA.", anchor: "sidePanel",
    pose: { yaw: -1.38, pitch: 0.12, distance: 6.2, targetY: 1.22, offsetX: 0.7, glow: 0.9 },
    mobile: { distance: 6.2, targetY: 1.2, offsetX: 0 } },
  { label: "Floor", title: "Ready for the floor.", copy: "Talk to Tierplay about Altitude for your location.", anchor: null,
    pose: { yaw: -0.45 - Math.PI * 2, pitch: 0.1, distance: 6.4, targetY: 1.2, offsetX: 0.95, glow: 1.1 },
    mobile: { distance: 7.4, targetY: 1.45, offsetX: 0 } },
];

const keys = ["yaw", "pitch", "distance", "targetY", "offsetX", "glow"] as const;
const hotspots = chapters.map((chapter, index) => ({ ...chapter, index })).filter((chapter): chapter is Chapter & { index: number; anchor: AltitudeAnchor } => chapter.anchor !== null);
explorerParts.push(...hotspots.map(({ anchor, label, title }) => ({ anchor, label, title })));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function AltitudeTour() {
  const root = useRef<HTMLElement>(null);
  const stageArea = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLOListElement>(null);
  const line = useRef<SVGLineElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const pose = useRef<StagePose>({ ...defaultPose(), ...chapters[0].pose });
  const compact = useRef(false);
  const cardBox = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const [mode, fail] = useStageMode();
  const { near, visible } = useStageVisibility(root);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [exploring, setExploring] = useState(false);
  const pinRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);
  const animated = mode === "live";

  useEffect(() => {
    if (mode === "still") Object.assign(pose.current, { yaw: -0.42, pitch: 0.1, distance: 6.6, targetY: 1.2, offsetX: 0, float: 0, anchor: null });
  }, [mode]);

  const poseFor = useCallback((index: number) => ({ ...chapters[index].pose, ...(compact.current ? chapters[index].mobile : {}) }), []);

  const apply = useCallback((progress: number) => {
    const span = progress * (chapters.length - 1);
    const index = Math.min(chapters.length - 2, Math.floor(span));
    const local = smooth(Math.min(1, Math.max(0, (span - index - 0.3) / 0.7)));
    const a = poseFor(index), b = poseFor(index + 1);
    keys.forEach((key) => { pose.current[key] = (a[key] ?? 0) + ((b[key] ?? 0) - (a[key] ?? 0)) * local; });
    const nearest = Math.round(span);
    const settled = Math.abs(span - nearest) < 0.22;
    pose.current.anchor = settled ? chapters[nearest].anchor : null;
    setActive((value) => (value === nearest ? value : nearest));
    activeRef.current = nearest;
    fills.current.forEach((fill, i) => { if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, span - i + 1)).toFixed(3)})`; });
    if (root.current) root.current.dataset.leader = pose.current.anchor ? "on" : "off";
  }, [poseFor]);

  useEffect(() => {
    const measure = () => {
      compact.current = innerWidth < 820;
      setIsCompact(compact.current);
      const stage = stageArea.current?.getBoundingClientRect();
      const card = cards.current?.querySelector<HTMLElement>("[data-active='true']")?.getBoundingClientRect();
      if (stage && card) cardBox.current = { x: card.left - stage.left, y: card.top - stage.top, w: card.width, h: card.height };
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [active, ready]);

  useGSAP(() => {
    if (!animated || !root.current) return;
    const trigger = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (self) => apply(self.progress), onRefresh: (self) => apply(self.progress) });
    return () => trigger.kill();
  }, { dependencies: [animated, apply], scope: root });

  useEffect(() => {
    if (!animated || !stageArea.current) return;
    const area = stageArea.current;
    const orbit = bindOrbit(area, (yaw) => { pose.current.drag = yaw; }, { spring: true });
    const release = () => orbit.dispose();
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pose.current.pointerX = event.clientX / innerWidth * 2 - 1;
      pose.current.pointerY = event.clientY / innerHeight * 2 - 1;
    };
    root.current?.addEventListener("pointermove", move);
    const section = root.current;
    return () => { release(); section?.removeEventListener("pointermove", move); };
  }, [animated]);

  const project = useCallback((points: Float32Array) => {
    // Every part carries a pin; the active chapter's pin also gets the leader line from its card.
    hotspots.forEach((spot, i) => {
      const pin = pinRefs.current[i];
      if (!pin) return;
      const k = anchorOrder.indexOf(spot.anchor) * 3;
      pin.style.transform = `translate3d(${points[k]}px, ${points[k + 1]}px, 0)`;
      // Hide pins that face away or would sit under the chapter nav.
      pin.dataset.visible = points[k + 2] > -.1 && points[k + 1] < innerHeight - 110 && points[k + 1] > 90 ? "true" : "false";
      pin.dataset.active = spot.index === activeRef.current && pose.current.anchor === spot.anchor ? "true" : "false";
    });
    const current = pose.current.anchor;
    const box = cardBox.current;
    if (!current || !line.current || !dot.current || !box.w) return;
    const k = anchorOrder.indexOf(current) * 3, x = points[k], y = points[k + 1];
    const fromX = compact.current ? box.x + box.w / 2 : box.x + box.w;
    const fromY = compact.current ? box.y : box.y + Math.min(box.h / 2, 60);
    line.current.setAttribute("x1", String(fromX));
    line.current.setAttribute("y1", String(fromY));
    line.current.setAttribute("x2", String(x));
    line.current.setAttribute("y2", String(y));
    dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const jump = (index: number) => {
    const section = root.current;
    if (!section) return;
    const distance = section.offsetHeight - innerHeight;
    scrollTo({ top: section.offsetTop + distance * (index / (chapters.length - 1)) + 2 });
  };

  const showStage = mode === "live" || mode === "still";

  return <section ref={root} className="altitude-tour" data-mode={mode} data-ready={ready} aria-labelledby="altitude-tour-title">
    <div className="altitude-tour-sticky">
      <div className="altitude-tour-glow" aria-hidden="true" />
      <div ref={stageArea} className="altitude-tour-stage">
        {showStage && near ? <CabinetStage pose={pose} active={visible && !exploring} still={mode === "still"} compact={isCompact} onProjectAll={animated ? project : undefined} onReady={() => setReady(true)} onFailure={fail} /> : null}
        {mode === "image" || !ready ? <img className="altitude-tour-fallback" src={altitude.image} alt="" aria-hidden="true" /> : null}
      </div>
      {animated ? <div className="altitude-tour-pins">{hotspots.map((spot, i) => <button key={spot.anchor} ref={b => { pinRefs.current[i] = b; }} type="button" tabIndex={-1} aria-hidden="true" className="altitude-tour-pin" onClick={() => jump(spot.index)} title={spot.label}><i /><span>{spot.label}</span></button>)}</div> : null}
      <svg className="altitude-tour-leader" aria-hidden="true"><line ref={line} /></svg>
      <span ref={dot} className="altitude-tour-dot" aria-hidden="true" />
      <header className="altitude-tour-head">
        <p className="tp-label">Interactive 3D / {altitude.label}</p>
        <h2 id="altitude-tour-title">Altitude, part by part.</h2>
        {animated ? <p className="altitude-tour-hint">Scroll to tour · drag to turn · select a part</p> : null}
        {showStage ? <button type="button" className="altitude-tour-explore" onClick={() => setExploring(true)}><span aria-hidden="true">⟳</span> Explore in 360°</button> : null}
      </header>
      <ol ref={cards} className="altitude-tour-cards">
        {chapters.map((chapter, index) => <li key={chapter.label} data-active={!animated || index === active}>
          <span className="tp-label">{String(index + 1).padStart(2, "0")} / {chapter.label}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.copy}</p>
          {index === chapters.length - 1 ? <div className="altitude-tour-actions"><Link className="tp-button" href="/contact-sales">Discuss Altitude <span aria-hidden="true">↗</span></Link><button type="button" className="tp-link" onClick={() => setExploring(true)}>Explore in 360°</button><a className="tp-link" href="#cabinet-compare">Compare with Pinnacle</a></div> : null}
        </li>)}
      </ol>
      {animated ? <nav className="altitude-tour-nav" aria-label="Altitude tour chapters">
        {chapters.map((chapter, index) => <button type="button" key={chapter.label} aria-current={index === active ? "step" : undefined} onClick={() => jump(index)}>
          <i className="altitude-tour-fill" ref={f => { fills.current[index] = f; }} aria-hidden="true" />
          <span>{String(index + 1).padStart(2, "0")}</span><b>{chapter.label}</b>
        </button>)}
      </nav> : null}
    </div>
    {showStage ? <AltitudeExplorer open={exploring} onClose={() => setExploring(false)} parts={explorerParts} /> : null}
  </section>;
}
