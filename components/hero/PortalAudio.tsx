"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { PortalState } from "./portalState";
import type { Score } from "./score";

/**
 * The hero's score (see score.ts). It starts only on a deliberate click, follows the story clocks
 * every frame, and fades out when paused, hidden, or once the visitor has scrolled past the hero.
 */
export default function PortalAudio({ sequence, active, paused }: { sequence: PortalState; active: boolean; paused: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const score = useRef<Score | null>(null);

  const toggle = async () => {
    if (!score.current) {
      try { const { Score } = await import("./score"); score.current = new Score(); } catch { return; }
      if (new URLSearchParams(location.search).has("debug-audio")) (window as unknown as { __tierplayScore: Score }).__tierplayScore = score.current;
    }
    const next = !enabled;
    if (next) await score.current.start().catch(() => undefined);
    setEnabled(next);
  };

  useEffect(() => {
    const engine = score.current;
    if (!engine) return;
    let frame = 0;
    const audible = () => enabled && active && !paused && !document.hidden;
    const tick = () => {
      engine.update({ raw: sequence.raw ?? 0, progress: sequence.progress, intro: sequence.intro ?? 0, finale: sequence.finale ?? 0 });
      frame = requestAnimationFrame(tick);
    };
    const level = () => engine.setLevel(audible() ? 1 : 0);
    level();
    if (enabled) frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", level);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", level); };
  }, [enabled, active, paused, sequence]);
  useEffect(() => () => { score.current?.close(); score.current = null; }, []);

  const label = enabled ? "Mute sound" : "Enable sound";
  return <button type="button" className="portal-icon-button portal-sound" data-on={enabled} aria-pressed={enabled} aria-label={label} title={label} onClick={toggle}>
    {enabled ? <Volume2 aria-hidden="true" size={15} strokeWidth={1.75}/> : <VolumeX aria-hidden="true" size={15} strokeWidth={1.75}/>}
    <span className="portal-sound__text" aria-hidden="true">{enabled ? "Sound on" : "Sound"}</span>
    {enabled ? <span className="portal-sound__eq" aria-hidden="true"><i /><i /><i /></span> : null}
  </button>;
}
