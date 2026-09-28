"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = "tierplay-preloader-seen-v1";

type Particle = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

function ArcNumbers({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const width = 560;
    const height = 86;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.font = "500 9px Inter, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";

    const centerX = width / 2;
    const centerY = 150;
    const radius = 132;
    const count = 21;
    for (let index = 0; index < count; index += 1) {
      const value = Math.round((index / (count - 1)) * 100);
      const angle = Math.PI * 1.12 + (Math.PI * 0.76 * index) / (count - 1);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const isActive = value <= progress + 1;
      context.fillStyle = isActive ? "rgba(238, 229, 255, .92)" : "rgba(171, 163, 196, .38)";
      context.fillText(String(value).padStart(3, "0"), x, y);
    }
  }, [progress]);

  return <canvas ref={canvasRef} className="tierplay-preloader__arc" aria-hidden="true" />;
}

export default function TierplayPreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const [status, setStatus] = useState<"checking" | "visible" | "closing" | "hidden">("checking");
  const [progress, setProgress] = useState(0);
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        left: 7 + ((index * 37) % 86),
        top: 8 + ((index * 61) % 77),
        size: 1 + (index % 3) * 0.7,
        delay: -((index * 0.31) % 4),
        duration: 2.2 + (index % 5) * 0.55,
        opacity: 0.18 + (index % 4) * 0.11,
      })),
    [],
  );

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const forced = query.has("preloader");
    const disabled = query.has("no-preloader");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (disabled || (!forced && (reduced || connection?.saveData || sessionStorage.getItem(STORAGE_KEY)))) {
      setStatus("hidden");
      return;
    }
    setStatus("visible");
  }, []);

  useGSAP(
    () => {
      if (status !== "visible") return;
      gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65, ease: "power2.out" });
    },
    { scope: rootRef, dependencies: [status] },
  );

  useEffect(() => {
    if (status !== "visible") return;
    startedAt.current = performance.now();
    let frame = 0;
    let lastPaint = 0;
    const duration = 4200;
    const tick = (now: number) => {
      const elapsed = now - startedAt.current;
      const linear = Math.min(elapsed / duration, 1);
      const eased = linear < 0.78 ? linear * 0.89 : 0.694 + ((linear - 0.78) / 0.22) * 0.306;
      if (now - lastPaint > 32 || linear === 1) {
        setProgress(Math.min(100, Math.round(eased * 100)));
        lastPaint = now;
      }
      if (linear < 1) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setStatus("closing"), 260);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status]);

  useGSAP(
    () => {
      if (status !== "closing") return;
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setStatus("hidden");
        },
      });
    },
    { scope: rootRef, dependencies: [status] },
  );

  const skip = () => {
    setProgress(100);
    setStatus("closing");
  };

  if (status === "checking" || status === "hidden") return null;

  return (
    <div ref={rootRef} className="tierplay-preloader" role="status" aria-label="Loading Tierplay experience">
      <div className="tierplay-preloader__bloom tierplay-preloader__bloom--one" />
      <div className="tierplay-preloader__bloom tierplay-preloader__bloom--two" />
      <div className="tierplay-preloader__particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <i
            key={index}
            className="tierplay-preloader__particle"
            style={
              {
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="tierplay-preloader__stage">
        <svg className="tierplay-preloader__orbit" viewBox="0 0 500 260" aria-hidden="true">
          <ellipse cx="250" cy="132" rx="218" ry="92" fill="none" stroke="rgba(202,188,255,.2)" strokeWidth="1" strokeDasharray="2 12" />
          <ellipse cx="250" cy="132" rx="170" ry="66" fill="none" stroke="rgba(150,137,207,.22)" strokeWidth="1" strokeDasharray="1 8" transform="rotate(-17 250 132)" />
          <path d="M36 151c95 35 174 43 285 12s130-49 150-79" fill="none" stroke="rgba(231,221,255,.28)" strokeWidth="1" strokeDasharray="3 10" />
        </svg>
        <div className="tierplay-preloader__core" aria-hidden="true">
          <span className="tierplay-preloader__ring tierplay-preloader__ring--outer" />
          <span className="tierplay-preloader__ring tierplay-preloader__ring--inner" />
          <span className="tierplay-preloader__sphere" />
          <span className="tierplay-preloader__flare tierplay-preloader__flare--left" />
          <span className="tierplay-preloader__flare tierplay-preloader__flare--right" />
        </div>
        <div className="tierplay-preloader__logo-wrap">
          <img className="tierplay-preloader__logo" src="/media/generated/production-stills/tierplay-logo-official.svg" alt="Tierplay" />
          <span className="tierplay-preloader__logo-sweep" aria-hidden="true" />
        </div>
        <p className="tierplay-preloader__eyebrow">SYSTEM INITIALIZATION / PLAYER NETWORK</p>
        <p className="tierplay-preloader__percent"><strong>{String(progress).padStart(3, "0")}</strong><span>%</span></p>
        <ArcNumbers progress={progress} />
        <div className="tierplay-preloader__dots" aria-hidden="true"><i /><i /><i /></div>
      </div>

      <div className="tierplay-preloader__edges" aria-hidden="true">
        <span className="tierplay-preloader__edge tierplay-preloader__edge--tl" />
        <span className="tierplay-preloader__edge tierplay-preloader__edge--tr" />
        <span className="tierplay-preloader__edge tierplay-preloader__edge--bl" />
        <span className="tierplay-preloader__edge tierplay-preloader__edge--br" />
      </div>
      <button className="tierplay-preloader__skip" type="button" onClick={skip}>Skip intro</button>
      <p className="tierplay-preloader__legal">TIERPLAY / CONNECTED PLAY SYSTEMS</p>
    </div>
  );
}
