"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { anchorOrder, defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit } from "./useStage";
import type { AltitudeAnchor } from "./altitudeModel";

const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });

/** The equivalent of `target` closest to `current`, so turns take the short way round. */
const nearest = (current: number, target: number) => current + Math.atan2(Math.sin(target - current), Math.cos(target - current));

export type ExplorerPart = { anchor: AltitudeAnchor; label: string; title: string };

/**
 * Free 360° viewer, inspired by React Bits ModelViewer: orbit with inertia, wheel/pinch/keyboard
 * zoom, double-click reset, slow auto-rotate until touched, and labelled parts that hide when
 * they face away. Opens in a native dialog so it never competes with page scrolling.
 */
export default function AltitudeExplorer({ open, onClose, parts }: { open: boolean; onClose: () => void; parts: ExplorerPart[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const pins = useRef<(HTMLButtonElement | null)[]>([]);
  const pose = useRef<StagePose>({ ...defaultPose(), yaw: -.55, pitch: .12, distance: 6.4, targetY: 1.2, float: .4 });
  const orbit = useRef<ReturnType<typeof bindOrbit> | null>(null);
  const auto = useRef(true);
  const spinYaw = useRef(-.55);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);

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
      const point = touches.get(event.pointerId);
      if (!point) return;
      point.x = event.clientX; point.y = event.clientY;
      if (touches.size === 2 && pinch) { const [a, b] = [...touches.values()]; pose.current.zoom = Math.max(.42, Math.min(1.6, startZoom * pinch / Math.hypot(a.x - b.x, a.y - b.y))); }
    };
    const tup = (event: PointerEvent) => { touches.delete(event.pointerId); if (touches.size < 2) pinch = 0; };
    const key = (event: KeyboardEvent) => {
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
    dialog.current?.addEventListener("keydown", key);
    const dialogElement = dialog.current;
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

  const place = useCallback((points: Float32Array) => {
    parts.forEach((part, i) => {
      const pin = pins.current[i];
      if (!pin) return;
      const k = anchorOrder.indexOf(part.anchor) * 3;
      pin.style.transform = `translate3d(${points[k]}px, ${points[k + 1]}px, 0)`;
      pin.dataset.visible = points[k + 2] > .05 ? "true" : "false";
    });
  }, [parts]);

  // Hotspot: turn the part toward the viewer and move in close.
  const visit = (index: number) => {
    const part = parts[index];
    auto.current = false; setFocus(index);
    const anchor = { screen: [-.1, 1.74, .6], ledEdge: [.6, 1.6, .7], billAcceptor: [-.2, 1.1, .45], ticketAcceptor: [.2, 1.1, .45], buttons: [.25, 1.04, .38], sidePanel: [-1.35, .9, .8], logo: [0, .9, .75] }[part.anchor];
    orbit.current?.reset();
    Object.assign(pose.current, { yaw: nearest(pose.current.yaw + pose.current.drag, anchor[0]), targetY: anchor[1], zoom: anchor[2], pitch: .12 });
  };

  return <dialog ref={dialog} className="altitude-explorer" aria-labelledby="altitude-explorer-title" onClose={onClose} onCancel={onClose}>
    <div className="altitude-explorer-head">
      <p className="tp-label">360° / Altitude Console</p>
      <h2 id="altitude-explorer-title">Explore the Altitude</h2>
      <p className="altitude-explorer-hint">Drag to orbit · scroll or pinch to zoom · double-click to reset · arrow keys and + / − work too</p>
    </div>
    <div ref={area} className="altitude-explorer-stage" data-ready={ready}>
      {open && !failed ? <CabinetStage pose={pose} active={open} onProjectAll={place} onReady={() => setReady(true)} onFailure={() => setFailed(true)} /> : null}
      {failed ? <p className="altitude-explorer-fallback">3D is unavailable on this device.</p> : null}
      {parts.map((part, i) => <button key={part.anchor} ref={b => { pins.current[i] = b; }} type="button" className="altitude-explorer-pin" onPointerEnter={() => { auto.current = false; }} onFocus={() => { auto.current = false; }} data-active={focus === i} onClick={() => visit(i)}>
        <i aria-hidden="true" /><span>{part.label}</span>
      </button>)}
    </div>
    <div className="altitude-explorer-foot">
      <p aria-live="polite">{focus === null ? "Select a highlighted part to inspect it." : parts[focus].title}</p>
      <div>
        <button type="button" className="tp-link" onClick={reset}>Reset view</button>
        <button type="button" className="tp-button" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
      </div>
    </div>
  </dialog>;
}
