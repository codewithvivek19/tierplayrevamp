"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit, useStageMode, useStageVisibility } from "./useStage";
import CabinetExplorer, { type ExplorerPart } from "./CabinetExplorer";
import { anchorKeys, type CabinetId } from "./cabinetModels";
import CabinetSwitch from "./CabinetSwitch";
import { cabinets } from "@/content/site";
import { smoothScrollTo } from "@/components/motion/scrollControl";

const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);

type Chapter = {
  label: string;
  title: string;
  copy: string;
  anchor: string | null;
  pose: Partial<StagePose>;
  mobile?: Partial<StagePose>;
};

const [altitude, pinnacle] = cabinets;
const info: Record<CabinetId, (typeof cabinets)[number]> = { altitude, pinnacle };

// Copy is limited to the published specifications and cabinet capabilities in content/site.ts.
const tours: Record<CabinetId, Chapter[]> = {
  altitude: [
    { label: "Overview", title: "Altitude Console", copy: altitude.copy, anchor: null,
      pose: { yaw: -0.5, pitch: 0.08, distance: 6.3, targetY: 1.2, offsetX: 0.95, glow: 1, lights: 0 },
      mobile: { distance: 7.4, targetY: 1.45, offsetX: 0 } },
    { label: "Display", title: "43-inch vertical touchscreen", copy: "A 4K resolution display, upright on the cabinet.", anchor: "screen",
      pose: { yaw: -0.14, pitch: 0.04, distance: 3.7, targetY: 1.74, offsetX: 0.55, glow: 1, lights: 0 },
      mobile: { distance: 4.4, targetY: 1.55, offsetX: 0 } },
    { label: "Lighting", title: "Ambient monitor lighting", copy: "Light lines trace the display edge, console and pedestal.", anchor: "ledEdge",
      pose: { yaw: 0.62, pitch: 0.06, distance: 4.1, targetY: 1.6, offsetX: 0.45, glow: 1.35, lights: 1.45 },
      mobile: { distance: 4.8, targetY: 1.45, offsetX: 0 } },
    { label: "Payments", title: "Validators and ticketing", copy: "Listed with JCM UBA validators and Epic Edge and Mothagoose ticketing systems.", anchor: "billAcceptor",
      pose: { yaw: -0.22, pitch: 0.34, distance: 2.7, targetY: 1.1, offsetX: 0.32, glow: 1, lights: 0 },
      mobile: { distance: 3.4, targetY: 0.95, offsetX: 0 } },
    { label: "Controls", title: "Dual bash buttons", copy: "Physical player buttons sit alongside on-screen controls.", anchor: "buttons",
      pose: { yaw: 0.3, pitch: 0.52, distance: 2.5, targetY: 1.04, offsetX: 0.3, glow: 1, lights: 0 },
      mobile: { distance: 3.2, targetY: 0.9, offsetX: 0 } },
    { label: "Build", title: "Modular, interchangeable build", copy: "Published as made in the USA.", anchor: "sidePanel",
      pose: { yaw: -1.38, pitch: 0.12, distance: 6.2, targetY: 1.22, offsetX: 0.7, glow: 0.9, lights: 0 },
      mobile: { distance: 6.2, targetY: 1.2, offsetX: 0 } },
    { label: "Floor", title: "Ready for the floor.", copy: "Talk to Tierplay about Altitude for your location.", anchor: null,
      pose: { yaw: -0.45 - Math.PI * 2, pitch: 0.1, distance: 6.4, targetY: 1.2, offsetX: 0.95, glow: 1.1, lights: 0.7 },
      mobile: { distance: 7.4, targetY: 1.45, offsetX: 0 } },
  ],
  pinnacle: [
    { label: "Overview", title: "Pinnacle Console", copy: pinnacle.copy, anchor: null,
      pose: { yaw: -0.5, pitch: 0.08, distance: 6.3, targetY: 1.2, offsetX: 0.95, glow: 1, lights: 0 },
      mobile: { distance: 7.4, targetY: 1.45, offsetX: 0 } },
    { label: "Display", title: "43-inch curved touchscreen", copy: "A 4K resolution display on a curved screen.", anchor: "screen",
      pose: { yaw: -0.12, pitch: 0.05, distance: 3.6, targetY: 1.74, offsetX: 0.55, glow: 1, lights: 0 },
      mobile: { distance: 4.4, targetY: 1.6, offsetX: 0 } },
    { label: "Lighting", title: "Ambient monitor lighting", copy: "Light lines trace the screen, console and deck.", anchor: "lighting",
      pose: { yaw: 0.7, pitch: 0.24, distance: 3.6, targetY: 1.0, offsetX: 0.45, glow: 1.35, lights: 1.45 },
      mobile: { distance: 4.4, targetY: 1.0, offsetX: 0 } },
    { label: "Controls", title: "Player controls", copy: "Physical buttons sit alongside on-screen controls on a modern PCAP touchscreen.", anchor: "buttons",
      pose: { yaw: 0.2, pitch: 0.55, distance: 2.6, targetY: 1.0, offsetX: 0.3, glow: 1, lights: 0 },
      mobile: { distance: 3.3, targetY: 0.9, offsetX: 0 } },
    { label: "Audio", title: "User-controlled audio", copy: "Audio is user-controlled, as listed for the cabinet range.", anchor: "speakers",
      pose: { yaw: -0.35, pitch: 0.2, distance: 2.8, targetY: 0.76, offsetX: 0.3, glow: 1, lights: 0.4 },
      mobile: { distance: 3.4, targetY: 0.72, offsetX: 0 } },
    { label: "Build", title: "Modular, interchangeable build", copy: "Published as made in the USA.", anchor: "sidePanel",
      pose: { yaw: -1.38, pitch: 0.12, distance: 6.2, targetY: 1.22, offsetX: 0.7, glow: 0.9, lights: 0 },
      mobile: { distance: 6.2, targetY: 1.2, offsetX: 0 } },
    { label: "Floor", title: "Ready for the floor.", copy: "Talk to Tierplay about Pinnacle for your location.", anchor: null,
      pose: { yaw: -0.45 - Math.PI * 2, pitch: 0.1, distance: 6.4, targetY: 1.2, offsetX: 0.95, glow: 1.1, lights: 0.7 },
      mobile: { distance: 7.4, targetY: 1.45, offsetX: 0 } },
  ],
};

const keys = ["yaw", "pitch", "distance", "targetY", "offsetX", "glow", "lights"] as const;
const hotspotsFor = (id: CabinetId) => tours[id].map((chapter, index) => ({ ...chapter, index })).filter((chapter): chapter is Chapter & { index: number; anchor: string } => chapter.anchor !== null);
const partsFor = (id: CabinetId): ExplorerPart[] => hotspotsFor(id).map(({ anchor, label, title }) => ({ anchor, label, title }));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function CabinetTour() {
  const root = useRef<HTMLElement>(null);
  const stageArea = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLOListElement>(null);
  const line = useRef<SVGLineElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [cabinet, setCabinet] = useState<CabinetId>("altitude");
  const cabinetRef = useRef<CabinetId>("altitude");
  const pose = useRef<StagePose>({ ...defaultPose(), ...tours.altitude[0].pose, power: 0 });
  const compact = useRef(false);
  const cardBox = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const progress = useRef(0);
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
  const chapters = tours[cabinet];
  const hotspots = hotspotsFor(cabinet);
  const model = info[cabinet];
  const other: CabinetId = cabinet === "altitude" ? "pinnacle" : "altitude";

  useEffect(() => {
    if (mode === "still") Object.assign(pose.current, { yaw: -0.42, pitch: 0.1, distance: 6.6, targetY: 1.2, offsetX: 0, float: 0, anchor: null, power: 1, lights: 0 });
  }, [mode]);

  // The screen powers on the first time the tour comes into view.
  useEffect(() => { if (visible) pose.current.power = 1; }, [visible]);

  const poseFor = useCallback((index: number) => {
    const list = tours[cabinetRef.current];
    return { ...list[index].pose, ...(compact.current ? list[index].mobile : {}) };
  }, []);

  const apply = useCallback((value: number) => {
    progress.current = value;
    const list = tours[cabinetRef.current];
    const span = value * (list.length - 1);
    const index = Math.min(list.length - 2, Math.floor(span));
    const local = smooth(Math.min(1, Math.max(0, (span - index - 0.3) / 0.7)));
    const a = poseFor(index), b = poseFor(index + 1);
    keys.forEach((key) => { pose.current[key] = (a[key] ?? 0) + ((b[key] ?? 0) - (a[key] ?? 0)) * local; });
    const nearest = Math.round(span);
    const settled = Math.abs(span - nearest) < 0.22;
    pose.current.anchor = settled ? list[nearest].anchor : null;
    setActive((current) => (current === nearest ? current : nearest));
    activeRef.current = nearest;
    fills.current.forEach((fill, i) => { if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, span - i + 1)).toFixed(3)})`; });
    if (root.current) root.current.dataset.leader = pose.current.anchor ? "on" : "off";
  }, [poseFor]);

  const animatedRef = useRef(false);
  animatedRef.current = animated;
  const choose = useCallback((id: CabinetId) => {
    cabinetRef.current = id;
    setCabinet(id);
    // Still mode keeps its single framing; only the scroll tour re-poses for the new cabinet's chapter.
    if (animatedRef.current) apply(progress.current);
  }, [apply]);

  // /cabinets#pinnacle-3d (and #altitude-3d) open the tour on that cabinet.
  useEffect(() => {
    const read = () => {
      const match = location.hash.match(/^#(altitude|pinnacle)-3d$/);
      if (!match) return;
      choose(match[1] as CabinetId);
      if (root.current) smoothScrollTo(root.current);
    };
    // next/link updates the hash with pushState (no hashchange), so same-page links are caught on click.
    const click = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href*='-3d']");
      const match = link?.hash.match(/^#(altitude|pinnacle)-3d$/);
      if (!link || !match || link.pathname !== location.pathname) return;
      event.preventDefault();
      event.stopPropagation();
      history.replaceState(history.state, "", link.hash);
      read();
    };
    read();
    addEventListener("hashchange", read);
    document.addEventListener("click", click, true);
    return () => { removeEventListener("hashchange", read); document.removeEventListener("click", click, true); };
  }, [choose]);

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
  }, [active, ready, cabinet]);

  useGSAP(() => {
    if (!animated || !root.current) return;
    const trigger = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (self) => apply(self.progress), onRefresh: (self) => apply(self.progress) });
    return () => trigger.kill();
  }, { dependencies: [animated, apply], scope: root });

  useEffect(() => {
    if (!animated || !stageArea.current) return;
    const area = stageArea.current;
    const orbit = bindOrbit(area, (yaw) => { pose.current.drag = yaw; }, { spring: true });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pose.current.pointerX = event.clientX / innerWidth * 2 - 1;
      pose.current.pointerY = event.clientY / innerHeight * 2 - 1;
    };
    const section = root.current;
    section?.addEventListener("pointermove", move);
    return () => { orbit.dispose(); section?.removeEventListener("pointermove", move); };
  }, [animated]);

  const project = useCallback((points: Float32Array, shown: CabinetId) => {
    const spots = hotspotsFor(cabinetRef.current), order = anchorKeys(shown);
    const matches = shown === cabinetRef.current;
    // Every part carries a pin; the active chapter's pin also gets the leader line from its card.
    spots.forEach((spot, i) => {
      const pin = pinRefs.current[i];
      if (!pin) return;
      const k = order.indexOf(spot.anchor) * 3;
      pin.style.transform = `translate3d(${points[k]}px, ${points[k + 1]}px, 0)`;
      // Hide pins that face away, sit under the chapter nav, or belong to a cabinet mid-swap.
      pin.dataset.visible = matches && k >= 0 && points[k + 2] > -.1 && points[k + 1] < innerHeight - 110 && points[k + 1] > 90 ? "true" : "false";
      pin.dataset.active = spot.index === activeRef.current && pose.current.anchor === spot.anchor ? "true" : "false";
    });
    const current = pose.current.anchor;
    const box = cardBox.current;
    const k = current ? order.indexOf(current) * 3 : -1;
    if (root.current) root.current.dataset.leader = matches && k >= 0 && points[k + 2] > -1 ? "on" : "off";
    if (!current || k < 0 || !line.current || !dot.current || !box.w) return;
    const x = points[k], y = points[k + 1];
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
    smoothScrollTo(section.offsetTop + distance * (index / (chapters.length - 1)) + 2, { duration: 1.2 });
  };

  const showStage = mode === "live" || mode === "still";

  return <section ref={root} className="altitude-tour" data-mode={mode} data-ready={ready} data-cabinet={cabinet} aria-labelledby="altitude-tour-title">
    <div className="altitude-tour-sticky">
      <div className="altitude-tour-glow" aria-hidden="true" />
      <div ref={stageArea} className="altitude-tour-stage">
        {showStage && near ? <CabinetStage cabinet={cabinet} pose={pose} active={visible && !exploring} still={mode === "still"} compact={isCompact} onProjectAll={animated ? project : undefined} onReady={() => setReady(true)} onFailure={fail} /> : null}
        {mode === "image" || !ready ? <img className="altitude-tour-fallback" src={model.image} alt="" aria-hidden="true" /> : null}
      </div>
      {animated ? <div className="altitude-tour-pins">{hotspots.map((spot, i) => <button key={`${cabinet}-${spot.anchor}`} ref={b => { pinRefs.current[i] = b; }} type="button" tabIndex={-1} aria-hidden="true" className="altitude-tour-pin" data-visible="false" onClick={() => jump(spot.index)} title={spot.label}><i /><span>{spot.label}</span></button>)}</div> : null}
      <svg className="altitude-tour-leader" aria-hidden="true"><line ref={line} /></svg>
      <span ref={dot} className="altitude-tour-dot" aria-hidden="true" />
      <header className="altitude-tour-head">
        <p className="tp-label">Interactive 3D · console {cabinet === "altitude" ? 1 : 2} of 2</p>
        <h2 id="altitude-tour-title">{model.name}, part by part.</h2>
        <CabinetSwitch value={cabinet} onChange={choose} large />
        {animated ? <p className="altitude-tour-hint">Scroll to tour · drag to turn · move to light it · select a part</p> : null}
        {showStage ? <button type="button" className="altitude-tour-explore" onClick={() => setExploring(true)}><span aria-hidden="true">⟳</span> Explore in 360°</button> : null}
      </header>
      <ol ref={cards} className="altitude-tour-cards" aria-live="polite">
        {chapters.map((chapter, index) => <li key={`${cabinet}-${chapter.label}`} data-active={!animated || index === active}>
          <span className="tp-label">{String(index + 1).padStart(2, "0")} / {chapter.label}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.copy}</p>
          {index === chapters.length - 1 ? <div className="altitude-tour-actions">
            <button type="button" className="tp-button altitude-tour-next" onClick={() => { choose(other); jump(0); }}>Next console: {info[other].name} <span aria-hidden="true">→</span></button>
            <Link className="tp-link" href="/contact-sales">Discuss {model.name}</Link>
            <button type="button" className="tp-link" onClick={() => setExploring(true)}>Explore in 360°</button>
          </div> : null}
        </li>)}
      </ol>
      {animated ? <nav className="altitude-tour-nav" aria-label={`${model.name} tour chapters`}>
        {chapters.map((chapter, index) => <button type="button" key={chapter.label} aria-current={index === active ? "step" : undefined} onClick={() => jump(index)}>
          <i className="altitude-tour-fill" ref={f => { fills.current[index] = f; }} aria-hidden="true" />
          <span>{String(index + 1).padStart(2, "0")}</span><b>{chapter.label}</b>
        </button>)}
      </nav> : null}
    </div>
    {showStage ? <CabinetExplorer open={exploring} onClose={() => setExploring(false)} cabinet={cabinet} onCabinet={choose} partsFor={partsFor} /> : null}
  </section>;
}
