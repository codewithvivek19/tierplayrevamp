"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { defaultPose, type StagePose } from "./CabinetStage";
import { bindOrbit, useStageMode, useStageVisibility } from "./useStage";

const CabinetStage = dynamic(() => import("./CabinetStage"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);

const smooth = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };

/** The homepage Altitude: rises into the section, powers its lights, and turns as the visitor passes. */
export default function FloatingAltitude({ fallback }: { fallback: string }) {
  const root = useRef<HTMLDivElement>(null);
  const pose = useRef<StagePose>({ ...defaultPose(), yaw: -1.6, lift: -1.6, glow: 0, distance: 6.6, targetY: 1.25 });
  const [mode, fail] = useStageMode();
  const { near, visible } = useStageVisibility(root);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const animated = mode === "live";

  useEffect(() => {
    const measure = () => setCompact(innerWidth < 820);
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (mode === "still") Object.assign(pose.current, { yaw: -0.4, lift: 0, glow: 1, float: 0 });
  }, [mode]);

  useGSAP(() => {
    if (!animated || !root.current) return;
    const apply = ({ progress }: { progress: number }) => {
      const rise = smooth(progress / 0.5), drift = smooth((progress - 0.5) / 0.5);
      Object.assign(pose.current, {
        lift: -1.6 * (1 - rise) + drift * 0.18,
        yaw: -1.6 + rise * 1.2 + drift * 0.75,
        glow: smooth((progress - 0.12) / 0.3),
        pitch: 0.16 - rise * 0.08,
      });
    };
    const trigger = ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "bottom top", onUpdate: apply, onRefresh: apply });
    return () => trigger.kill();
  }, { dependencies: [animated], scope: root });

  useEffect(() => {
    const element = root.current;
    if (!animated || !element) return;
    const orbit = bindOrbit(element, (yaw) => { pose.current.drag = yaw; }, { spring: true });
    const release = () => orbit.dispose();
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = element.getBoundingClientRect();
      pose.current.pointerX = (event.clientX - box.left) / box.width * 2 - 1;
      pose.current.pointerY = (event.clientY - box.top) / box.height * 2 - 1;
    };
    const leave = () => { pose.current.pointerX = 0; pose.current.pointerY = 0; };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => { release(); element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); };
  }, [animated]);

  const showStage = (mode === "live" || mode === "still") && near;
  return <div ref={root} className="floating-altitude" data-mode={mode} data-ready={ready}>
    <div className="floating-altitude-light" aria-hidden="true" />
    <div className="floating-altitude-canvas">
      {showStage ? <CabinetStage pose={pose} active={visible} still={mode === "still"} compact={compact} onReady={() => setReady(true)} onFailure={fail} /> : null}
    </div>
    {mode === "image" || !ready ? <img className="floating-altitude-fallback" src={fallback} alt="" aria-hidden="true" /> : null}
    {animated ? <span className="floating-altitude-hint" aria-hidden="true">Drag to turn</span> : null}
  </div>;
}
