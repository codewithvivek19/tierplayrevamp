"use client";

import { useEffect, useState, type RefObject } from "react";

export type StageMode = "pending" | "live" | "still" | "image";

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** live: animated 3D; still: one static 3D frame (reduced motion); image: no WebGL, Save-Data or ?no-webgl. */
export function useStageMode(): [StageMode, () => void] {
  const [mode, setMode] = useState<StageMode>("pending");
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      if (saveData || new URLSearchParams(location.search).has("no-webgl") || !webglAvailable()) setMode("image");
      else setMode(reduced.matches ? "still" : "live");
    };
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);
  return [mode, () => setMode("image")];
}

/** near: mount the canvas ahead of arrival; visible: keep the render loop running. */
export function useStageVisibility(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);
  // Re-observe when the referenced element changes (e.g. a component swaps its static and live markup).
  useEffect(() => { if (ref.current !== element) setElement(ref.current); });
  useEffect(() => {
    if (!element) return;
    const nearObserver = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: "600px 0px" });
    let onScreen = false;
    const sync = () => setVisible(onScreen && !document.hidden);
    const visibleObserver = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
    nearObserver.observe(element);
    visibleObserver.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => { nearObserver.disconnect(); visibleObserver.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [element]);
  return { near, visible };
}

/** Horizontal drag adds a temporary yaw offset; the stage eases it back on release. */
export function bindDrag(element: HTMLElement, write: (value: number) => void) {
  let start = 0, base = 0, id = -1, offset = 0;
  const down = (event: PointerEvent) => {
    if (event.button !== 0) return;
    id = event.pointerId; start = event.clientX; base = offset;
    element.setPointerCapture(id);
    element.dataset.dragging = "true";
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId !== id) return;
    offset = base + (event.clientX - start) * 0.009;
    write(offset);
  };
  const up = (event: PointerEvent) => {
    if (event.pointerId !== id) return;
    id = -1; offset = 0; write(0);
    delete element.dataset.dragging;
  };
  element.addEventListener("pointerdown", down);
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerup", up);
  element.addEventListener("pointercancel", up);
  return () => {
    element.removeEventListener("pointerdown", down);
    element.removeEventListener("pointermove", move);
    element.removeEventListener("pointerup", up);
    element.removeEventListener("pointercancel", up);
  };
}

type OrbitOptions = { pitch?: boolean; spring?: boolean; onStart?: () => void };

/**
 * ModelViewer-style orbit input (adapted from React Bits ModelViewer): mouse drags rotate
 * immediately; touch waits 8px to decide between rotating (horizontal) and page scroll
 * (vertical). Release keeps momentum with inertia; `spring` then eases back to rest.
 */
export function bindOrbit(element: HTMLElement, write: (yaw: number, pitch: number) => void, options: OrbitOptions = {}) {
  const state = { yaw: 0, pitch: 0, vy: 0, vp: 0 };
  let id = -1, mode: "idle" | "decide" | "rotate" = "idle", sx = 0, sy = 0, lx = 0, ly = 0, frame = 0, last = 0;
  const clampPitch = (value: number) => Math.max(-.35, Math.min(.9, value));
  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (mode !== "rotate") {
      state.yaw += state.vy; state.pitch = options.pitch ? clampPitch(state.pitch + state.vp) : 0;
      state.vy *= Math.pow(.925, dt * 60); state.vp *= Math.pow(.925, dt * 60);
      if (options.spring && Math.abs(state.vy) < .002) { state.yaw *= Math.exp(-dt * 1.6); state.pitch *= Math.exp(-dt * 1.6); }
      write(state.yaw, state.pitch);
      const moving = Math.abs(state.vy) > 1e-4 || Math.abs(state.vp) > 1e-4 || (options.spring && (Math.abs(state.yaw) > 1e-3 || Math.abs(state.pitch) > 1e-3));
      frame = moving ? requestAnimationFrame(loop) : 0;
      if (!moving && options.spring) { state.yaw = 0; state.pitch = 0; write(0, 0); }
    } else frame = 0;
  };
  const kick = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(loop); } };
  const down = (event: PointerEvent) => {
    // Pins and controls inside the stage keep their own clicks (capture would swallow them).
    if (event.button !== 0 || id !== -1 || (event.target as Element | null)?.closest("button, a")) return;
    id = event.pointerId; sx = lx = event.clientX; sy = ly = event.clientY;
    mode = event.pointerType === "touch" ? "decide" : "rotate";
    if (mode === "rotate") { element.setPointerCapture(id); element.dataset.dragging = "true"; options.onStart?.(); }
    state.vy = state.vp = 0;
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId !== id) return;
    if (mode === "decide") {
      const dx = event.clientX - sx, dy = event.clientY - sy;
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy)) { mode = "rotate"; element.setPointerCapture(id); element.dataset.dragging = "true"; options.onStart?.(); }
      else { mode = "idle"; id = -1; return; }
    }
    if (mode !== "rotate") return;
    const dx = event.clientX - lx, dy = event.clientY - ly; lx = event.clientX; ly = event.clientY;
    state.vy = dx * .006; state.vp = options.pitch ? dy * .004 : 0;
    state.yaw += state.vy; if (options.pitch) state.pitch = clampPitch(state.pitch + state.vp);
    write(state.yaw, state.pitch);
  };
  const up = (event: PointerEvent) => {
    if (event.pointerId !== id) return;
    id = -1; mode = "idle"; delete element.dataset.dragging; kick();
  };
  element.addEventListener("pointerdown", down);
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerup", up);
  element.addEventListener("pointercancel", up);
  return {
    reset() { state.yaw = state.pitch = state.vy = state.vp = 0; write(0, 0); },
    nudge(yaw: number, pitch = 0) { state.vy += yaw; state.vp += pitch; kick(); },
    dispose() {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointerdown", down); element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up); element.removeEventListener("pointercancel", up);
    },
  };
}
