"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { answer, greeting, starterChips, type GuideAnswer } from "@/content/guide";

type Message = { id: number; from: "guide" | "you"; body: GuideAnswer | string };
const STORE = "tierplay-guide-v1";
const TEASE = "tierplay-guide-tease";

/** The wizard mascot: 2.5D (pointer tilt, rim light, breath, blink, glowing staff), drawn from the recoloured SVG. */
function Wizard({ size = "button" }: { size?: "button" | "avatar" }) {
  return <span className={`wizard wizard--${size}`} aria-hidden="true">
    <span className="wizard__body">
      <img src="/media/mascot/wizard.svg" alt="" draggable={false} />
      <svg className="wizard__fx" viewBox="0 0 1000 1000">
        <defs><radialGradient id={`orb-${size}`}><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#e2c2ff" /><stop offset="1" stopColor="#9e05ff" stopOpacity="0" /></radialGradient></defs>
        <circle className="wizard__orb" cx="318" cy="205" r="70" fill={`url(#orb-${size})`} />
        <g className="wizard__lids" fill="#e8a88f">
          <ellipse cx="466" cy="331" rx="22" ry="20" />
          <ellipse cx="526" cy="331" rx="22" ry="20" />
        </g>
      </svg>
      <span className="wizard__rim" />
    </span>
  </span>;
}

function Answer({ body }: { body: GuideAnswer }) {
  return <>
    <p>{body.text}</p>
    {body.bullets?.length ? <ul>{body.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
    {body.links?.length ? <div className="guide__links">{body.links.map((l) => l.href.startsWith("/")
      ? <Link key={l.href} href={l.href}>{l.label} <span aria-hidden="true">↗</span></Link>
      : <a key={l.href} href={l.href}>{l.label} <span aria-hidden="true">↗</span></a>)}</div> : null}
  </>;
}

export default function TierplayGuide() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tease, setTease] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "guide", body: greeting }]);
  const counter = useRef(1);
  const root = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    try { const saved = sessionStorage.getItem(STORE); if (saved) { const parsed = JSON.parse(saved) as Message[]; setMessages(parsed); counter.current = parsed.length + 1; } } catch { /* storage unavailable */ }
    let timer = 0;
    try { if (!sessionStorage.getItem(TEASE)) timer = window.setTimeout(() => setTease(true), 7000); } catch { /* ignore */ }
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30))); } catch { /* ignore */ } }, [messages]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => { if (open) { setTease(false); try { sessionStorage.setItem(TEASE, "1"); } catch { /* ignore */ } input.current?.focus({ preventScroll: true }); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); launcher.current?.focus(); } };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open]);
  useEffect(() => { if (open && window.innerWidth < 560) setOpen(false); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pointer-driven 3D tilt, damped, mouse only.
  useEffect(() => {
    const element = root.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    let frame = 0, tx = 0, ty = 0, x = 0, y = 0;
    const loop = () => {
      x += (tx - x) * .12; y += (ty - y) * .12;
      element.style.setProperty("--tilt-x", `${y.toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${x.toFixed(2)}deg`);
      element.style.setProperty("--rim-x", `${(50 + x * 3).toFixed(1)}%`);
      frame = Math.abs(tx - x) + Math.abs(ty - y) > .02 ? requestAnimationFrame(loop) : 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = element.getBoundingClientRect();
      const dx = (event.clientX - (box.left + box.width / 2)) / innerWidth, dy = (event.clientY - (box.top + box.height / 2)) / innerHeight;
      tx = Math.max(-1, Math.min(1, dx * 2.4)) * 14; ty = Math.max(-1, Math.min(1, dy * 2.4)) * -10;
      if (!frame) frame = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text || typing) return;
    setMessages((list) => [...list, { id: counter.current++, from: "you", body: text }]);
    setDraft(""); setTyping(true);
    window.setTimeout(() => {
      setMessages((list) => [...list, { id: counter.current++, from: "guide", body: answer(text) }]);
      setTyping(false);
    }, 520 + Math.min(700, text.length * 12));
  };
  const submit = (event: FormEvent) => { event.preventDefault(); ask(draft); };
  const lastGuide = [...messages].reverse().find((m) => m.from === "guide")?.body as GuideAnswer | undefined;
  const chips = lastGuide?.chips ?? starterChips;
  const press = (event: ReactPointerEvent<HTMLButtonElement>) => { event.currentTarget.dataset.pressed = "true"; };

  return <div ref={root} className="guide" data-open={open}>
    <section id={panelId} className="guide__panel" role="dialog" aria-modal="false" aria-label="Tierplay guide" hidden={!open}>
      <div className="guide__head">
        <Wizard size="avatar" />
        <div><h2>Tierplay Guide</h2><p><i aria-hidden="true" />Answers from Tierplay’s published catalogue</p></div>
        <button type="button" className="guide__close" aria-label="Close guide" onClick={() => { setOpen(false); launcher.current?.focus(); }}><X aria-hidden="true" size={18} strokeWidth={1.75} /></button>
      </div>
      <div ref={log} className="guide__log" aria-live="polite" aria-relevant="additions">
        {messages.map((m) => <div key={m.id} className={`guide__msg guide__msg--${m.from}`}>
          {typeof m.body === "string" ? <p>{m.body}</p> : <Answer body={m.body} />}
        </div>)}
        {typing ? <div className="guide__msg guide__msg--guide guide__typing" aria-label="The guide is typing"><i /><i /><i /></div> : null}
      </div>
      <div className="guide__chips" role="group" aria-label="Suggested topics">
        {chips.map((chip) => <button key={chip} type="button" onClick={() => ask(chip)}><Sparkles aria-hidden="true" size={12} strokeWidth={1.75} />{chip}</button>)}
      </div>
      <form className="guide__form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`${panelId}-q`}>Ask about Tierplay</label>
        <input ref={input} id={`${panelId}-q`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about games, cabinets, support…" autoComplete="off" maxLength={200} />
        <button type="submit" aria-label="Send" disabled={!draft.trim() || typing}><ArrowUp aria-hidden="true" size={18} strokeWidth={2} /></button>
      </form>
    </section>

    {tease && !open ? <div className="guide__tease">
      <button type="button" className="guide__tease-open" onClick={() => setOpen(true)}>Need a hand? <b>Ask me about Tierplay.</b></button>
      <button type="button" className="guide__tease-x" aria-label="Dismiss" onClick={() => { setTease(false); try { sessionStorage.setItem(TEASE, "1"); } catch { /* ignore */ } }}>×</button>
    </div> : null}

    <button ref={launcher} type="button" className="guide__launcher" aria-expanded={open} aria-controls={panelId} aria-label={open ? "Close Tierplay guide" : "Open Tierplay guide"}
      onPointerDown={press} onPointerUp={(e) => { delete e.currentTarget.dataset.pressed; }} onPointerLeave={(e) => { delete e.currentTarget.dataset.pressed; }}
      onClick={() => setOpen((value) => !value)}>
      <span className="guide__ring" aria-hidden="true" />
      <Wizard />
    </button>
  </div>;
}
