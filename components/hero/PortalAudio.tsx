"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { PortalState } from "./portalState";

/** Optional synthesized atmosphere. Audio starts only after a deliberate click. */
export default function PortalAudio({ sequence, active, paused }: { sequence: PortalState; active: boolean; paused: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const engine = useRef<{ context: AudioContext; gain: GainNode; tone: OscillatorNode } | null>(null);
  const toggle = () => {
    if (!engine.current) {
      try {
        const context = new AudioContext();
        const gain = context.createGain(); gain.gain.value = 0; gain.connect(context.destination);
        const tone = context.createOscillator(); tone.type = "sine"; tone.frequency.value = 65;
        const harmonic = context.createOscillator(); harmonic.type = "sine"; harmonic.frequency.value = 97.5;
        const harmonicGain = context.createGain(); harmonicGain.gain.value = .18;
        tone.connect(gain); harmonic.connect(harmonicGain); harmonicGain.connect(gain);
        tone.start(); harmonic.start(); engine.current = { context, gain, tone };
      } catch { return; }
    }
    void engine.current.context.resume().catch(() => setEnabled(false));
    setEnabled(value => !value);
  };
  useEffect(() => {
    const tick = () => {
      if (!engine.current) return;
      const { context, gain, tone } = engine.current;
      const p = sequence.progress;
      const crossing = Math.exp(-Math.pow((p - .53) * 9, 2));
      gain.gain.setTargetAtTime(enabled && active && !paused ? .025 + crossing * .025 : 0, context.currentTime, .25);
      tone.frequency.setTargetAtTime(65 + crossing * 32 + p * 8, context.currentTime, .2);
    };
    tick(); const timer = window.setInterval(tick, 120);
    return () => clearInterval(timer);
  }, [enabled, active, paused, sequence]);
  useEffect(() => () => { void engine.current?.context.close(); engine.current = null; }, []);
  const label = enabled ? "Mute sound" : "Enable sound";
  return <button type="button" className="portal-icon-button" aria-pressed={enabled} aria-label={label} title={label} onClick={toggle}>{enabled ? <Volume2 aria-hidden="true" size={15} strokeWidth={1.75}/> : <VolumeX aria-hidden="true" size={15} strokeWidth={1.75}/>}</button>;
}
