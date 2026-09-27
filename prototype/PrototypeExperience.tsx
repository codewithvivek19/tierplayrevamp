"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { altitude } from "../data/cabinets";
import { usePrototype } from "./usePrototype";
import styles from "./prototype.module.css";
const Scene = dynamic(() => import("./PrototypeCanvas"), { ssr: false });
export default function PrototypeExperience() {
  const p = usePrototype();
  const [referenceFocus, setReferenceFocus] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const ready = p.state.ready && p.quality !== "static";
  const loading = p.records.some((r) => r.status === "loading");
  const assetsAvailable = p.manifestReady && p.blocked.length === 0;
  const focus = p.state.phase === "FOCUS" || referenceFocus;
  const phaseLabel = { BOOT: "System entry", ENTRANCE: "Entrance", FLOOR: "Gaming floor", FOCUS: "Cabinet focus", APPROACH: "Screen approach", CROSSING: "Screen entry", EXIT: "Experience complete", STATIC: "Reference view" }[p.state.phase];
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menu) { setMenu(false); menuButton.current?.focus(); }
      else { setReferenceFocus(false); p.dispatch({ type: "CANCEL" }); }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menu, p.dispatch]);
  return <div className={styles.shell}>
    <a className={styles.skip} href="#prototype-main">Skip to cabinet</a>
    <header className={styles.header}>
      <a href="/prototype-01" aria-label="Tierplay prototype home"><img className={styles.logo} src="/media/tierplay.svg" alt="Tierplay" width="150" height="46" /></a>
      <span className={styles.edition}>SYSTEM STUDY <span>01 / 2026</span></span>
      <button ref={menuButton} className={styles.menuButton} aria-expanded={menu} aria-controls="prototype-menu" onClick={() => setMenu(!menu)}>{menu ? "Close −" : "Index +"}</button>
      {menu && <nav id="prototype-menu" className={styles.menu} aria-label="Study navigation">
        <a href="#prototype-main" onClick={() => setMenu(false)}>Cabinet study <span>01</span></a>
        <a href="/design-system">Interface system <span>02</span></a>
        <a href="/">Earlier concept <span>03</span></a>
      </nav>}
    </header>
    <main id="prototype-main" className={styles.main}>
      <div className={styles.intro}>
        <p className={styles.kicker}><span /> TIERPLAY GAMING SYSTEM</p>
        <h1>THE SYSTEM<br /><span>STARTS HERE.</span></h1>
        <p className={styles.lead}>Games. Hardware. Connected technology.<br />One physical point of entry.</p>
      </div>
      <section className={`${styles.stage} ${focus ? styles.focused : ""}`} aria-labelledby="cabinet-name">
        <div className={styles.stageLabel}><span>01 / CABINET STUDY</span><span>{phaseLabel}</span></div>
        <div className={styles.productTitle}><p>VERTICAL MONITOR CABINET</p><h2 id="cabinet-name">ALTITUDE</h2></div>
        <div className={styles.productImage}>
          <img src={altitude.referenceImage} width={189} height={500} alt="Original Tierplay Altitude vertical cabinet reference" fetchPriority="high" />
          <span>ORIGINAL PRODUCT REFERENCE</span>
        </div>
        {p.downloaded && p.quality !== "static" && !p.error && <div className={styles.canvas}><Scene key={p.attempt} manager={p.manager} state={p.state} dispatch={p.dispatch} quality={p.quality} active={p.active} onReady={p.onReady} onFailure={p.onFailure} onQuality={p.setQuality} /></div>}
        <div className={styles.productDetails}>
          <p className={styles.kicker}>HARDWARE / 01</p>
          <p>{focus ? "A closer look at the original cabinet." : "The cabinet is the beginning. The experience lives within."}</p>
          <button className={styles.textButton} aria-pressed={focus} onClick={() => { if (ready) p.dispatch({ type: focus ? "CANCEL" : "FOCUS" }); else setReferenceFocus(!referenceFocus); }}>{focus ? "Close inspection" : "Inspect reference"} <span aria-hidden="true">{focus ? "−" : "+"}</span></button>
          {focus && <div className={styles.inspection}><h3>Altitude</h3><p>{altitude.category}. This is the recovered product image, not a 3D model.</p><p>Model-specific specifications are still being verified against the original source.</p></div>}
        </div>
        {p.state.phase === "EXIT" && <div className={styles.exit}><p className={styles.kicker}>SCREEN ENTRY / COMPLETE</p><h2>YOU’RE IN.</h2><p>The first prototype ends here.</p><button className={styles.primary} onClick={() => p.dispatch({ type: "CANCEL" })}>Back to cabinet ↗</button></div>}
      </section>
      <section className={styles.entry} aria-label="Experience controls">
        <div className={styles.entryCopy}>
          <span className={styles.sectionNumber}>01—</span>
          <div><h2>Enter the experience.</h2><p>{p.blocked.length ? "The interface is ready for review. The architectural 3D sequence is waiting for its production assets." : "A single cabinet. A deliberate entrance. A world on the other side of the display."}</p></div>
        </div>
        <div className={styles.controls}>
          <button className={styles.primary} disabled={!assetsAvailable || loading || p.quality === "static"} aria-describedby="entry-status" onClick={() => { if (!p.downloaded) void p.load(); else if (p.state.phase === "FOCUS") p.dispatch({ type: "SELECT" }); else if (p.state.phase === "FLOOR") p.dispatch({ type: "FOCUS" }); else p.dispatch({ type: "ENTER" }); }}>{loading ? "Loading assets…" : !p.downloaded ? "Load experience" : !ready ? "Preparing scene…" : p.state.phase === "FOCUS" ? "Enter screen ↗" : p.state.phase === "FLOOR" ? "Focus cabinet ↗" : "Enter Tierplay ↗"}</button>
          <button className={styles.secondary} onClick={() => { p.dispatch({ type: "SKIP" }); setReferenceFocus(true); }}>Skip to cabinet</button>
          {!["BOOT", "STATIC", "FLOOR"].includes(p.state.phase) && <button className={styles.textButton} onClick={() => p.dispatch({ type: "CANCEL" })}>Back</button>}
        </div>
      </section>
      <div id="entry-status" className={styles.status} role="status">
        {!p.manifestReady && !p.error ? "Checking asset availability…" : p.error ? p.error : p.reduced ? "Reduced motion is enabled. Reference view is available without camera travel." : p.quality === "static" ? "Static view is active. Cabinet information and controls remain available." : p.blocked.length ? "3D entry is unavailable until the cabinet, environment and screen artwork are approved." : loading ? "Downloading required scene assets." : ready ? "Scene assets decoded. Ready to enter." : "Assets available. Load the experience when you are ready."}
      </div>
      <details className={styles.assetDetails}>
        <summary>Production readiness <span>{p.blocked.length ? `${p.blocked.length} assets required` : "Asset manifest"}</span></summary>
        <p className={styles.assetIntro}>Prototype review only. Missing production assets are not replaced with invented models.</p>
        <ul>{p.records.map((r) => <li key={r.id}><span><strong>{r.id}</strong> {r.label}</span><span>{r.status === "blocked" ? "Required" : r.status}{r.bytes > 0 ? ` · ${(r.bytes / 1024).toFixed(0)} KB` : ""}</span>{r.error && <p>{r.error}</p>}</li>)}</ul>
        {p.blocked.some((r) => r.id === "TP-001") && <p className={styles.assetNotice}>BLOCKED BY ASSET: TP-001 — approved Altitude GLB required.</p>}
        <button className={styles.textButton} onClick={p.retry}>Check assets again ↗</button>
      </details>
    </main>
    <footer className={styles.footer}><span>PROTOTYPE 01 / FOUNDATION</span><a href="/design-system">Review the interface system ↗</a><span>Boot → entrance → floor → focus → screen</span></footer>
  </div>;
}
