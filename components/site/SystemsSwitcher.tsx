"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, CheckList } from "@/components/ds/primitives";
import { products } from "@/content/site";

type Mode = "TCM" | "TLJ";
type Point = { x: number; y: number };

// One set of eight machines and one hub rearrange between the two systems.
// Collection management: an operator hub (left) reaching three locations along a route.
// Link jackpot: the hub becomes the shared jackpot core, machines ring around it.
const MACHINES = 8;
const ring = Array.from({ length: MACHINES }, (_, i) => {
  const a = (i / MACHINES) * Math.PI * 2 - Math.PI / 2;
  return { x: 330 + Math.cos(a) * 205, y: 220 + Math.sin(a) * 140 };
});
const sites: Point[] = [{ x: 300, y: 104 }, { x: 488, y: 200 }, { x: 352, y: 336 }];
const siteOf = [0, 0, 0, 1, 1, 1, 2, 2];
const offsets: Point[] = [{ x: -42, y: 2 }, { x: 0, y: -30 }, { x: 42, y: 2 }, { x: -6, y: -42 }, { x: 40, y: -6 }, { x: -6, y: 36 }, { x: -30, y: 18 }, { x: 30, y: 18 }];
const layouts: Record<Mode, { hub: Point; machines: Point[] }> = {
  TLJ: { hub: { x: 330, y: 220 }, machines: ring },
  TCM: { hub: { x: 96, y: 220 }, machines: offsets.map((o, i) => ({ x: sites[siteOf[i]].x + o.x, y: sites[siteOf[i]].y + o.y })) },
};

const ease = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** The live diagram. Positions animate between modes; signals travel along the links every frame. */
function SystemsDiagram({ mode }: { mode: Mode }) {
  const svg = useRef<SVGSVGElement>(null);
  const state = useRef({ from: layouts[mode], to: layouts[mode], start: 0, current: { hub: { ...layouts[mode].hub }, machines: layouts[mode].machines.map((m) => ({ ...m })) } });
  const modeRef = useRef(mode);
  const kick = useRef<() => void>(() => undefined);

  useEffect(() => {
    const s = state.current;
    s.from = { hub: { ...s.current.hub }, machines: s.current.machines.map((m) => ({ ...m })) };
    s.to = layouts[mode];
    s.start = performance.now();
    modeRef.current = mode;
    svg.current?.setAttribute("data-mode", mode);
    kick.current();
  }, [mode]);

  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(sel: string) => [...root.querySelectorAll<T>(sel)];
    const machines = q<SVGGElement>("[data-machine]"), links = q<SVGLineElement>("[data-link]"), signals = q<SVGCircleElement>("[data-signal]");
    const hub = root.querySelector<SVGGElement>("[data-hub]")!, meter = root.querySelector<SVGCircleElement>("[data-meter]")!, burst = root.querySelector<SVGCircleElement>("[data-burst]")!;
    let frame = 0, visible = false, hitAt = performance.now() + 2600, hitMachine = 0;
    const draw = (now: number) => {
      const s = state.current;
      // Each machine starts a beat after the previous one, so the rearrangement reads as a sweep.
      for (let i = 0; i <= MACHINES; i++) {
        const local = reduced ? 1 : Math.min(1, Math.max(0, (now - s.start - i * 45) / 820));
        const k = ease(local);
        const from = i === MACHINES ? s.from.hub : s.from.machines[i], to = i === MACHINES ? s.to.hub : s.to.machines[i];
        const target = i === MACHINES ? s.current.hub : s.current.machines[i];
        target.x = from.x + (to.x - from.x) * k; target.y = from.y + (to.y - from.y) * k;
      }
      const h = s.current.hub;
      hub.setAttribute("transform", `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)})`);
      const tlj = modeRef.current === "TLJ";
      const t = now / 1000;
      machines.forEach((m, i) => {
        const p = s.current.machines[i];
        m.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        const hot = tlj && i === hitMachine && now > hitAt && now < hitAt + 1400;
        m.toggleAttribute("data-hot", hot);
      });
      links.forEach((line, i) => {
        const p = s.current.machines[i];
        line.setAttribute("x1", p.x.toFixed(1)); line.setAttribute("y1", p.y.toFixed(1));
        line.setAttribute("x2", h.x.toFixed(1)); line.setAttribute("y2", h.y.toFixed(1));
      });
      // Signals: contributions flow into the jackpot core; commands flow out from the operator.
      signals.forEach((dot, i) => {
        const p = s.current.machines[i];
        const phase = reduced ? .5 : (t * .55 + i * .37) % 1;
        const f = tlj ? phase : 1 - phase;
        dot.setAttribute("cx", (p.x + (h.x - p.x) * f).toFixed(1));
        dot.setAttribute("cy", (p.y + (h.y - p.y) * f).toFixed(1));
        dot.setAttribute("opacity", (Math.sin(phase * Math.PI) * .95).toFixed(2));
      });
      // Jackpot meter fills, then a hit bursts back out to one machine and the meter resets.
      if (tlj && !reduced) {
        if (now > hitAt + 1400) { hitAt = now + 3800; hitMachine = (hitMachine + 3) % MACHINES; }
        const fill = now < hitAt ? 1 - (hitAt - now) / 3800 : 1;
        meter.style.strokeDashoffset = String(289 * (1 - Math.min(1, Math.max(0, fill))));
        const b = now > hitAt ? Math.min(1, (now - hitAt) / 900) : 0;
        const target = s.current.machines[hitMachine];
        burst.setAttribute("cx", (h.x + (target.x - h.x) * b).toFixed(1));
        burst.setAttribute("cy", (h.y + (target.y - h.y) * b).toFixed(1));
        burst.setAttribute("opacity", b > 0 && b < 1 ? "1" : "0");
        root.toggleAttribute("data-hit", now > hitAt && now < hitAt + 600);
      } else { burst.setAttribute("opacity", "0"); meter.style.strokeDashoffset = tlj ? "0" : "289"; root.removeAttribute("data-hit"); }
      frame = visible && !reduced ? requestAnimationFrame(draw) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    observer.observe(root);
    // A mode change while the loop is idle (reduced motion, off screen) still redraws the new layout.
    kick.current = () => { if (!frame) frame = requestAnimationFrame((now) => { frame = 0; draw(now); }); };
    draw(performance.now());
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);


  return <svg ref={svg} className="systems-diagram" viewBox="0 0 600 440" data-mode={mode} aria-hidden="true">
    <defs>
      <radialGradient id="sys-core" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#c79bff" /><stop offset="1" stopColor="#9e05ff" stopOpacity="0" /></radialGradient>
      <radialGradient id="sys-amber" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff4dc" /><stop offset=".4" stopColor="#ffac0a" /><stop offset="1" stopColor="#ffac0a" stopOpacity="0" /></radialGradient>
    </defs>
    <g className="systems-diagram__grid">{Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="440" />)}{Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 60 + 10} x2="600" y2={i * 60 + 10} />)}</g>
    {/* Collection management: the route through each location. */}
    <g className="systems-diagram__route">
      <polyline points={[{ x: 96, y: 220 }, ...sites].map((p) => `${p.x},${p.y}`).join(" ")} />
      {sites.map((site, i) => <g key={i} transform={`translate(${site.x} ${site.y})`}><circle r="62" /><text y="-70" textAnchor="middle">Location {String.fromCharCode(65 + i)}</text></g>)}
    </g>
    {/* Link jackpot: the shared orbit. */}
    <ellipse className="systems-diagram__orbit" cx="330" cy="220" rx="205" ry="140" />
    {Array.from({ length: MACHINES }, (_, i) => <line key={i} data-link className="systems-diagram__link" />)}
    {Array.from({ length: MACHINES }, (_, i) => <circle key={i} data-signal className="systems-diagram__signal" r="3.2" />)}
    <circle data-burst className="systems-diagram__burst" r="9" fill="url(#sys-amber)" opacity="0" />
    <g data-hub className="systems-diagram__hub">
      <circle className="systems-diagram__halo" r="78" fill="url(#sys-core)" />
      <circle className="systems-diagram__track" r="46" />
      <circle data-meter className="systems-diagram__meter" r="46" strokeDasharray="289" strokeDashoffset="289" transform="rotate(-90)" />
      <circle className="systems-diagram__core" r="30" />
      <g className="systems-diagram__console"><rect x="-26" y="-18" width="52" height="34" rx="4" /><line x1="-16" y1="-6" x2="16" y2="-6" /><line x1="-16" y1="4" x2="6" y2="4" /><line x1="-10" y1="22" x2="10" y2="22" /></g>
      <text className="systems-diagram__label" y="66" textAnchor="middle">{mode === "TLJ" ? "Shared jackpot" : "Operator"}</text>
    </g>
    {Array.from({ length: MACHINES }, (_, i) => <g key={i} data-machine className="systems-diagram__machine">
      <rect x="-11" y="-17" width="22" height="34" rx="3" />
      <rect className="systems-diagram__screen" x="-7" y="-13" width="14" height="15" rx="1.5" style={{ animationDelay: `${i * .3}s` }} />
    </g>)}
  </svg>;
}

/** Collection management and link jackpot on one stage: tabs on the left, one live diagram on the right. */
export default function SystemsSwitcher({ action = true }: { action?: boolean }) {
  const [mode, setMode] = useState<Mode>("TCM");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const product = products.find((item) => item.code === mode)!;
  const index = products.findIndex((item) => item.code === mode);
  const keys = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? products.length - 1 : (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : products.length - 1)) % products.length;
    setMode(products[next].code); tabs.current[next]?.focus();
  };

  return <div className="systems" data-mode={mode}>
      <div className="systems__tabs" role="tablist" aria-label="Tierplay systems" onKeyDown={keys}>
        {products.map((item, i) => <button key={item.code} ref={(b) => { tabs.current[i] = b; }} type="button" role="tab" id={`systems-tab-${item.code}`} aria-controls="systems-panel" aria-selected={mode === item.code} tabIndex={mode === item.code ? 0 : -1} onClick={() => setMode(item.code)}>
          <span className="systems__code">{item.code}</span>
          <span className="systems__name">{item.code === "TCM" ? "Collection management" : "Link Jackpot"}</span>
          <i className="systems__tab-glow" aria-hidden="true" />
        </button>)}
      </div>
      <div className="systems__panel" role="tabpanel" id="systems-panel" aria-labelledby={`systems-tab-${mode}`} key={mode}>
        <span className="ds-card__label">0{index + 1} / {product.code}</span>
        <h3>{product.name}</h3>
        <p className="ds-panel__text">{product.copy}</p>
        <CheckList items={product.features} />
        {action ? <div className="ds-actions" style={{ marginTop: "var(--s-5)" }}><Button href="/products" variant="ghost">Explore products</Button></div> : null}
      </div>
    <figure className="systems__stage">
      <SystemsDiagram mode={mode} />
      <figcaption>{mode === "TLJ" ? "Illustration: machines at one location feeding one shared progressive jackpot." : "Illustration: an operator reaching machines at several locations remotely."}</figcaption>
    </figure>
  </div>;
}
