"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useDeviceTier } from "@/systems/DeviceTier";
import { media, preloadImage } from "@/systems/AssetManager";
import { Sequence, useExperienceState } from "@/systems/ExperienceState";
const CinematicCanvas = dynamic(() => import("./ExperienceCanvas"), {
  ssr: false,
});
gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const sequence = useRef<Sequence>({
    progress: 0,
    pointerX: 0,
    pointerY: 0,
    energy: 0,
  });
  const { reduced, tier, dpr } = useDeviceTier();
  const [ready, setReady] = useState(false);
  const [enhance, setEnhance] = useState(false);
  const [still, setStill] = useState(false);
  const [active, setActive] = useState(true);
  const [gpuReady, setGpuReady] = useState(false);
  const [gpuFailed, setGpuFailed] = useState(false);
  const [selected, setSelected] = useState<"cabinet" | "world">("cabinet");
  const [noWebgl, setNoWebgl] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const chapter = useExperienceState((s) => s.chapter);
  const staticMode = reduced || tier === "low" || still;
  useEffect(() => {
    let live = true;
    setNoWebgl(new URLSearchParams(location.search).has("no-webgl"));
    Promise.all([
      preloadImage(window.innerWidth < 768 ? media.mobile : media.cabinet),
      preloadImage(media.world),
    ])
      .then(() => {
        if (live) setReady(true);
      })
      .catch(() => {
        if (live) setLoadFailed(true);
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (!ready || staticMode || noWebgl) return;
    const enable = () => setEnhance(true);
    if (!matchMedia("(pointer: coarse)").matches && window.innerWidth >= 768) {
      const timer = window.setTimeout(enable, 600);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("pointerdown", enable, {
      once: true,
      passive: true,
    });
    window.addEventListener("scroll", enable, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("scroll", enable);
    };
  }, [ready, staticMode, noWebgl]);
  const applyProgress = (p: number) => {
    sequence.current.progress = p;
    const next =
      p > 0.78
        ? "SUNSCAPE_WORLD"
        : p > 0.12
          ? "PORTAL_APPROACH"
          : "CABINET_HERO";
    if (useExperienceState.getState().chapter !== next)
      useExperienceState.getState().setChapter(next);
  };
  useGSAP(
    () => {
      if (staticMode) {
        applyProgress(selected === "world" ? 1 : 0);
        return;
      }
      if (!ready) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          onUpdate: (self) => applyProgress(self.progress),
        },
      });
      tl.to(".hero-copy", { autoAlpha: 0, y: -65, duration: 0.24 }, 0.06)
        .to(".hero-side-note", { autoAlpha: 0, duration: 0.15 }, 0.03)
        .fromTo(
          ".world-copy",
          { autoAlpha: 0, y: 55 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          0.66,
        )
        .to(".travel-line", { scaleX: 1, duration: 1, ease: "none" }, 0);
      return () => {
        applyProgress(0);
      };
    },
    { scope: root, dependencies: [ready, staticMode], revertOnUpdate: true },
  );
  const go = (world: boolean) => {
    setSelected(world ? "world" : "cabinet");
    if (staticMode) {
      applyProgress(world ? 1 : 0);
      return;
    }
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: world ? top + el.offsetHeight - window.innerHeight : top,
      behavior: "smooth",
    });
  };
  const worldVisible = staticMode
    ? selected === "world"
    : chapter === "SUNSCAPE_WORLD";
  const heroVisible = staticMode
    ? selected === "cabinet"
    : chapter !== "SUNSCAPE_WORLD";
  return (
    <section
      id="cabinet"
      ref={root}
      className={`experience ${staticMode ? "is-static" : ""} ${worldVisible ? "world-selected" : ""}`}
      aria-label="Enter the Tierplay experience"
    >
      <div
        className="stage"
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" && !staticMode) {
            const box = e.currentTarget.getBoundingClientRect();
            sequence.current.pointerX =
              ((e.clientX - box.left) / box.width) * 2 - 1;
            sequence.current.pointerY =
              (-(e.clientY - box.top) / box.height) * 2 + 1;
          }
        }}
        onPointerLeave={() => {
          sequence.current.pointerX = 0;
          sequence.current.pointerY = 0;
        }}
      >
        <div className="cinematic-media" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={worldVisible ? media.world : media.mobile}
            />
            <img
              className={`hero-backdrop ${gpuReady && !gpuFailed && !staticMode ? "gpu-backed" : ""}`}
              src={worldVisible ? media.world : media.cabinet}
              alt=""
              width="1672"
              height="941"
              fetchPriority="high"
            />
          </picture>
          {ready && enhance && !staticMode && !noWebgl && !gpuFailed && (
            <CinematicCanvas
              sequence={sequence.current}
              dpr={dpr}
              active={active}
              onReady={() => setGpuReady(true)}
              onFailure={() => {
                setGpuFailed(true);
                setGpuReady(false);
              }}
            />
          )}
        </div>
        <div className="cinematic-shade" aria-hidden="true" />
        <div className="hero-coordinate" aria-hidden="true">
          TIERPLAY / IMMERSIVE SERIES — 01
        </div>
        <div className="hero-copy" inert={!heroVisible}>
          <p className="eyebrow">
            <span className="signal-dot" />
            BEYOND THE SCREEN
          </p>
          <h1>
            ENTER
            <br />
            <span>THE TIER.</span>
          </h1>
          <p className="hero-description">
            Real hardware. Extraordinary worlds.
            <br />
            An entirely new dimension of play.
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              disabled={!ready && !loadFailed}
              onClick={() => go(true)}
            >
              Enter Sunscape <span aria-hidden="true">↗</span>
            </button>
            <a className="quiet-link" href="#operators">
              For operators <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="world-copy" inert={!worldVisible}>
          <p className="eyebrow">
            <span className="signal-dot" />
            SUNSCAPE / WORLD 01
          </p>
          <h2>
            RISE OF
            <br />
            <span>THE DRAGON.</span>
          </h2>
          <p>
            Leave the ordinary behind.
            <br />
            Welcome to the world inside.
          </p>
          <a className="button primary" href="#sunscape">
            Discover the world <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-side-note">
          <span className="crosshair" aria-hidden="true">
            +
          </span>
          <span>
            PHYSICAL.
            <br />
            DIGITAL.
            <br />
            EXTRAORDINARY.
          </span>
        </div>
        <div className="scene-toolbar">
          <div className="scene-choice" aria-label="Experience scenes">
            <button aria-pressed={!worldVisible} onClick={() => go(false)}>
              <span>01</span> Cabinet
            </button>
            <span className="choice-divider" />
            <button
              aria-pressed={worldVisible}
              onClick={() => go(true)}
              disabled={!ready && !loadFailed}
            >
              <span>02</span> World
            </button>
          </div>
          <span className="motion-hint">
            {worldVisible
              ? "YOU’RE INSIDE SUNSCAPE"
              : "MOVE TO EXPLORE · SCROLL TO ENTER"}
          </span>
          <button
            className="motion-control"
            disabled={reduced}
            onClick={() => {
              setSelected(worldVisible ? "world" : "cabinet");
              setStill(!still);
            }}
          >
            {reduced
              ? "Reduced motion"
              : still
                ? "Play motion"
                : "Pause motion"}
            <span aria-hidden="true">{still ? "○" : "◉"}</span>
          </button>
        </div>
        <div className="travel-track" aria-hidden="true">
          <div className="travel-line" />
        </div>
        {loadFailed && (
          <p className="asset-error" role="status">
            The immersive view couldn’t load.{" "}
            <button onClick={() => location.reload()}>Try again</button>, or{" "}
            <a href="#sunscape">continue to Sunscape</a>.
          </p>
        )}
      </div>
    </section>
  );
}
