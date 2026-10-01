"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit } from "./useStage";
import { anchorKeys, cabinetSpecs, type CabinetId } from "./cabinetModels";
import CabinetSwitch from "./CabinetSwitch";

const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });

/** The equivalent of `target` closest to `current`, so turns take the short way round. */
const nearest = (current: number, target: number) => current + Math.atan2(Math.sin(target - current), Math.cos(target - current));

export type ExplorerPart = { anchor: string; label: string; title: string };

const presets = [
  { value: 0, name: "Studio" },
  { value: 1, name: "Casino floor" },
  { value: 2, name: "Lights out" },
] as const;

/**
 * Free 360° viewer, inspired by React Bits ModelViewer: orbit with inertia, wheel/pinch/keyboard
 * zoom, double-click reset, slow auto-rotate until touched, and labelled parts that hide when
 * they face away. Visitors can swap cabinets and relight the stage; in "Lights out" the pointer
 * becomes a torch. Opens in a native dialog so it never competes with page scrolling.
 */
export default function CabinetExplorer({ open, onClose, cabinet, onCabinet, partsFor }: {
  open: boolean; onClose: () => void; cabinet: CabinetId; onCabinet: (id: CabinetId) => void; partsFor: (id: CabinetId) => ExplorerPart[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const pins = useRef<(HTMLButtonElement | null)[]>([]);
  const pose = useRef<StagePose>({ ...defaultPose(), yaw: -.55, pitch: .12, distance: 6.4, targetY: 1.2, float: .4 });
  const orbit = useRef<ReturnType<typeof bindOrbit> | null>(null);
  const auto = useRef(true);
  const spinYaw = useRef(-.55);
  const cabinetRef = useRef(cabinet);
  cabinetRef.current = cabinet;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [lights, setLights] = useState(0);
  const parts = partsFor(cabinet);
  const spec = cabinetSpecs[cabinet];

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const reset = useCallback(() => {
    auto.current = true; setFocus(null);
    spinYaw.current = nearest(pose.current.yaw, -.55);
    Object.assign(pose.current, { yaw: spinYaw.current, pitch: .12, distance: 6.4, targetY: 1.2, zoom: 1 });
    orbit.current?.reset();
  }, []);

  useEffect(() => { setFocus(null); }, [cabinet]);
  useEffect(() => { pose.current.lights = lights; }, [lights]);

  useEffect(() => {
    const element = area.current;
    if (!open || !element) return;
    orbit.current = bindOrbit(element, (yaw, pitch) => { pose.current.drag = yaw; pose.current.dragPitch = pitch; }, { pitch: true, onStart: () => { auto.current = false; } });
    let frame = 0, last = performance.now();
    const spin = (now: number) => {
      const dt = Math.min((now - last) / 1000, .05); last = now;
      if (auto.current) { spinYaw.current += dt * .22; pose.current.yaw = spinYaw.current; }
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    const zoomBy = (factor: number) => { pose.current.zoom = Math.max(.42, Math.min(1.6, pose.current.zoom * factor)); auto.current = false; };
    const wheel = (event: WheelEvent) => { event.preventDefault(); zoomBy(Math.exp(event.deltaY * .0012)); };
    const touches = new Map<number, { x: number; y: number }>();
    let pinch = 0, startZoom = 1;
    const tdown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touches.size === 2) { const [a, b] = [...touches.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); startZoom = pose.current.zoom; }
    };
    const tmove = (event: PointerEvent) => {
      // The pointer carries the torch light (mouse hover, or a finger while it is down).
      const box = element.getBoundingClientRect();
      pose.current.pointerX = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
      pose.current.pointerY = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
      const point = touches.get(event.pointerId);
      if (!point) return;
      point.x = event.clientX; point.y = event.clientY;
      if (touches.size === 2 && pinch) { const [a, b] = [...touches.values()]; pose.current.zoom = Math.max(.42, Math.min(1.6, startZoom * pinch / Math.hypot(a.x - b.x, a.y - b.y))); }
    };
    const tup = (event: PointerEvent) => { touches.delete(event.pointerId); if (touches.size < 2) pinch = 0; };
    const key = (event: KeyboardEvent) => {
      if ((event.target as Element | null)?.closest("button") && (event.key === "Enter" || event.key === " ")) return;
      if (event.key === "ArrowLeft") { auto.current = false; orbit.current?.nudge(-.05); }
      else if (event.key === "ArrowRight") { auto.current = false; orbit.current?.nudge(.05); }
      else if (event.key === "ArrowUp") { auto.current = false; orbit.current?.nudge(0, -.03); }
      else if (event.key === "ArrowDown") { auto.current = false; orbit.current?.nudge(0, .03); }
      else if (event.key === "+" || event.key === "=") zoomBy(.88);
      else if (event.key === "-") zoomBy(1.14);
      else if (event.key === "0") reset();
      else return;
      event.preventDefault();
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("pointerdown", tdown); element.addEventListener("pointermove", tmove);
    element.addEventListener("pointerup", tup); element.addEventListener("pointercancel", tup);
    element.addEventListener("dblclick", reset);
    // Like ModelViewer: auto-rotate yields the moment the visitor reaches for the model.
    const hold = (event: PointerEvent) => { if (event.pointerType === "mouse") auto.current = false; };
    element.addEventListener("pointerenter", hold);
    const dialogElement = dialog.current;
    dialogElement?.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame); orbit.current?.dispose(); orbit.current = null;
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("pointerdown", tdown); element.removeEventListener("pointermove", tmove);
      element.removeEventListener("pointerup", tup); element.removeEventListener("pointercancel", tup);
      element.removeEventListener("dblclick", reset);
      element.removeEventListener("pointerenter", hold);
      dialogElement?.removeEventListener("keydown", key);
    };
  }, [open, reset]);

  const place = useCallback((points: Float32Array, shown: CabinetId) => {
    const order = anchorKeys(shown);
    partsFor(cabinetRef.current).forEach((part, i) => {
      const pin = pins.current[i];
      if (!pin) return;
      const k = order.indexOf(part.anchor) * 3;
      pin.style.transform = `translate3d(${points[k]}px, ${points[k + 1]}px, 0)`;
      pin.dataset.visible = shown === cabinetRef.current && k >= 0 && points[k + 2] > .05 ? "true" : "false";
    });
  }, [partsFor]);

  // Hotspot: turn the part toward the viewer and move in close.
  const visit = (index: number) => {
    const part = parts[index];
    const [yaw, targetY, zoom] = spec.focus[part.anchor] ?? [0, 1.2, 1];
    auto.current = false; setFocus(index);
    orbit.current?.reset();
    Object.assign(pose.current, { yaw: nearest(pose.current.yaw + pose.current.drag, yaw), targetY, zoom, pitch: .12 });
  };

  const swap = (id: CabinetId) => { if (id !== cabinet) { reset(); pose.current.power = 1; onCabinet(id); } };
  const name = cabinet === "altitude" ? "Altitude" : "Pinnacle";

  return <dialog ref={dialog} className="altitude-explorer" data-lights={lights} aria-labelledby="altitude-explorer-title" onClose={onClose} onCancel={onClose}>
    <div className="altitude-explorer-head">
      <div>
        <p className="tp-label">360° / {name} Console</p>
        <h2 id="altitude-explorer-title">Explore the {name}</h2>
        <p className="altitude-explorer-hint">Drag to orbit · scroll or pinch to zoom · double-click to reset · arrow keys and + / − work too</p>
      </div>
      <div className="altitude-explorer-controls">
        <CabinetSwitch value={cabinet} onChange={swap} />
        <div className="light-switch" role="group" aria-label="Stage lighting">
          {presets.map((preset) => <button key={preset.value} type="button" aria-pressed={lights === preset.value} onClick={() => setLights(preset.value)}>
            <i data-preset={preset.value} aria-hidden="true" />{preset.name}
          </button>)}
        </div>
      </div>
    </div>
    <div ref={area} className="altitude-explorer-stage" data-ready={ready}>
      {open && !failed ? <CabinetStage cabinet={cabinet} pose={pose} active={open} onProjectAll={place} onReady={() => setReady(true)} onFailure={() => setFailed(true)} /> : null}
      {failed ? <p className="altitude-explorer-fallback">3D is unavailable on this device.</p> : null}
      {lights === 2 && !failed ? <p className="altitude-explorer-torch" aria-hidden="true">Move to shine a light</p> : null}
      {parts.map((part, i) => <button key={`${cabinet}-${part.anchor}`} ref={b => { pins.current[i] = b; }} type="button" className="altitude-explorer-pin" data-visible="false" onPointerEnter={() => { auto.current = false; }} onFocus={() => { auto.current = false; }} data-active={focus === i} onClick={() => visit(i)}>
        <i aria-hidden="true" /><span>{part.label}</span>
      </button>)}
    </div>
    <div className="altitude-explorer-foot">
      <p aria-live="polite">{focus === null ? "Select a highlighted part to inspect it." : parts[focus]?.title}</p>
      <div>
        <button type="button" className="tp-link" onClick={reset}>Reset view</button>
        <button type="button" className="tp-button" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
      </div>
    </div>
  </dialog>;
}
