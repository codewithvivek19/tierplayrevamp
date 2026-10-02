"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

// Adapted from React Bits ClickSpark (TS + CSS). Tierplay changes: an imperative `burst(x, y)` so the
// mascot can cast on demand (not only on click); a two-colour palette with varied length and reach;
// device-pixel-ratio aware; the canvas exists only while sparks are flying and its loop stops with
// them (the source kept a canvas and a frame loop alive forever); nothing under reduced motion.
type Spark = { x: number; y: number; angle: number; reach: number; size: number; color: string; start: number };
/** `burst` takes viewport (client) coordinates. */
export type SparkBurstHandle = { burst: (clientX: number, clientY: number, count?: number) => void };
type Pending = { clientX: number; clientY: number; count: number };

const SparkBurst = forwardRef<SparkBurstHandle, { colors?: string[]; radius?: number; duration?: number; className?: string }>(
  function SparkBurst({ colors = ["#e7c8ff", "#ffcd7d", "#ffffff"], radius = 34, duration = 620, className = "" }, ref) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const sparks = useRef<Spark[]>([]);
    const pending = useRef<Pending[]>([]);
    const frame = useRef(0);
    const [live, setLive] = useState(false);

    const draw = useCallback((now: number) => {
      const element = canvas.current;
      const context = element?.getContext("2d");
      if (!element || !context) { frame.current = 0; return; }
      const dpr = Math.min(devicePixelRatio || 1, 2);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, element.width, element.height);
      sparks.current = sparks.current.filter((spark) => {
        const t = Math.max(0, (now - spark.start) / duration);
        if (t >= 1) return false;
        const eased = 1 - Math.pow(1 - t, 3);
        const distance = eased * spark.reach;
        const length = spark.size * (1 - eased);
        const cos = Math.cos(spark.angle), sin = Math.sin(spark.angle);
        context.strokeStyle = spark.color;
        context.globalAlpha = 1 - t * .6;
        context.lineWidth = 2;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(spark.x + distance * cos, spark.y + distance * sin);
        context.lineTo(spark.x + (distance + length) * cos, spark.y + (distance + length) * sin);
        context.stroke();
        return true;
      });
      context.globalAlpha = 1;
      if (sparks.current.length) frame.current = requestAnimationFrame(draw);
      else { frame.current = 0; setLive(false); }
    }, [duration]);

    // Turn queued bursts into sparks relative to the canvas, then make sure the loop is running.
    const flush = useCallback(() => {
      const element = canvas.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      const now = performance.now();
      for (const { clientX, clientY, count } of pending.current.splice(0)) {
        const x = clientX - box.left, y = clientY - box.top;
        for (let i = 0; i < count; i++) {
          sparks.current.push({
            x, y, start: now + (i % 3) * 30,
            angle: (Math.PI * 2 * i) / count + (Math.random() - .5) * .4,
            reach: radius * (.7 + Math.random() * .6),
            size: 7 + Math.random() * 7,
            color: colors[i % colors.length],
          });
        }
      }
      if (!frame.current) frame.current = requestAnimationFrame(draw);
    }, [colors, draw, radius]);

    // When the canvas mounts, size it to its CSS box and start.
    useEffect(() => {
      const element = canvas.current;
      if (!live || !element) return;
      const box = element.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.max(1, Math.round(box.width * dpr)); element.height = Math.max(1, Math.round(box.height * dpr));
      flush();
    }, [live, flush]);
    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    useImperativeHandle(ref, () => ({
      burst(clientX, clientY, count = 10) {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        pending.current.push({ clientX, clientY, count });
        if (canvas.current) flush(); else setLive(true);
      },
    }), [flush]);

    return live ? <canvas ref={canvas} className={`spark-burst ${className}`} aria-hidden="true" /> : null;
  },
);

export default SparkBurst;
