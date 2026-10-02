"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUp, ArrowUpRight, Boxes, Gamepad2, House, LifeBuoy, Monitor, Sparkles, SquarePen, X } from "lucide-react";
import { answer, greeting, guidePrompts, guideTopics, starterChips, type GuideAnswer } from "@/content/guide";
import Wizard3D from "@/components/guide/Wizard3D";
import SparkBurst, { type SparkBurstHandle } from "@/components/reactbits/SparkBurst";
import ShinyText from "@/components/reactbits/ShinyText";

type Message = { id: number; from: "guide" | "you"; body: GuideAnswer | string; fresh?: boolean };
type Mood = "idle" | "listening" | "thinking" | "cast" | "wave";
const STORE = "tierplay-guide-v2";
const TEASE = "tierplay-guide-tease";
const topicIcons = { games: Gamepad2, cabinets: Monitor, systems: Boxes, support: LifeBuoy } as const;

// Anything a visitor reads or presses. Full-bleed artwork and canvases are backgrounds, not content.
const CONTENT = "a, button, input, select, textarea, label, h1, h2, h3, h4, h5, h6, p, li, dt, dd, figcaption, blockquote, table, img, video, [role='tab'], [role='button'], .lineup-card, .cab-hero__pick, .portal-controls, .ds-card, .ds-panel";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Replies read as plain text (no bubble), revealed word by word; extras settle in beneath. */
function Answer({ body, fresh }: { body: GuideAnswer; fresh?: boolean }) {
  const words = body.text.split(" ");
  const after = `${Math.min(words.length, 40) * 16 + 80}ms`;
  return <div className="gmsg__answer" data-fresh={fresh ? "true" : undefined} style={{ ["--after" as string]: after }}>
    <p className="gmsg__text">{words.map((word, i) => <span key={i}><span className="gmsg__word" style={{ ["--i" as string]: Math.min(i, 40) }}>{word}</span>{i < words.length - 1 ? " " : ""}</span>)}</p>
    {body.bullets?.length ? <ul className="gmsg__list">{body.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
    {body.media?.length ? <div className={`gmsg__media gmsg__media--${body.media[0].kind}`}>
      {body.media.map((item) => {
        const inner = <><span className="gmsg__thumb"><img src={item.image} alt="" loading="lazy" /></span><span className="gmsg__caption">{item.label}</span></>;
        return item.href ? <Link key={item.label} href={item.href} className="gmsg__tile">{inner}</Link> : <span key={item.label} className="gmsg__tile">{inner}</span>;
      })}
    </div> : null}
    {body.links?.length ? <div className="gmsg__links">{body.links.map((l) => l.href.startsWith("/")
      ? <Link key={l.href} href={l.href}>{l.label}<ArrowUpRight aria-hidden="true" size={13} strokeWidth={2} /></Link>
      : <a key={l.href} href={l.href}>{l.label}<ArrowUpRight aria-hidden="true" size={13} strokeWidth={2} /></a>)}</div> : null}
  </div>;
}

export default function TierplayGuide() {
  const pathname = usePathname();
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"home" | "chat">("home");
  const [tease, setTease] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [dock, setDock] = useState<"full" | "tucked">("full");
  const [teaseClear, setTeaseClear] = useState(true);
  const [mood, setMood] = useState<Mood>("idle");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "guide", body: greeting }]);
  const counter = useRef(1);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const teaseRef = useRef<HTMLDivElement>(null);
  const headAvatar = useRef<HTMLSpanElement>(null);
  const launchSparks = useRef<SparkBurstHandle>(null);
  const moodTimer = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;
  const panelId = useId();

  // Restore the conversation for this visit; tease once per session.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE);
      if (saved) { const parsed = JSON.parse(saved) as Message[]; if (parsed.length) { setMessages(parsed); counter.current = parsed.length + 1; if (parsed.length > 1) setView("chat"); } }
    } catch { /* storage unavailable */ }
    let timer = 0;
    try { if (!sessionStorage.getItem(TEASE)) timer = window.setTimeout(() => setTease(true), 6500); } catch { /* ignore */ }
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30).map(({ fresh: _fresh, ...m }) => m))); } catch { /* ignore */ } }, [messages]);
  useEffect(() => { if (view === "chat") log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduced() ? "auto" : "smooth" }); }, [messages, typing, view]);
  useEffect(() => {
    if (!open) return;
    setTease(false);
    try { sessionStorage.setItem(TEASE, "1"); } catch { /* ignore */ }
    const focus = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 60);
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); launcher.current?.focus(); } };
    addEventListener("keydown", key);
    // Phones get a full sheet: lock the page behind it (Lenis stops automatically).
    const sheet = innerWidth < 640;
    const html = document.documentElement, previous = html.style.overflow;
    if (sheet) html.style.overflow = "hidden";
    return () => { clearTimeout(focus); removeEventListener("keydown", key); if (sheet) html.style.overflow = previous; };
  }, [open]);
  useEffect(() => { if (openRef.current && innerWidth < 640) setOpen(false); }, [pathname]);
  // Auto-dismiss the teaser so it never lingers over the page.
  useEffect(() => { if (!tease) return; const t = window.setTimeout(() => setTease(false), 11000); return () => clearTimeout(t); }, [tease]);

  const pulse = useCallback((next: Mood, ms: number) => {
    setMood(next);
    clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms);
  }, []);
  const burstAt = (target: Element | null, handle: SparkBurstHandle | null, count = 12) => {
    if (!target || !handle) return;
    // Sparks fly from the staff orb, at (32%, 20%) of the wizard artwork.
    const art = (target.querySelector(".wiz__art") ?? target).getBoundingClientRect();
    handle.burst(art.left + art.width * .32, art.top + art.height * .2, count);
  };

  // Gaze and tilt: eyes follow the pointer (or glance around on touch); the body leans toward it.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const still = reduced();
    let frame = 0, gx = 0, gy = 0, tx = 0, ty = 0, cx = 0, cy = 0, sx = 0, sy = 0;
    const loop = () => {
      cx += (gx - cx) * .18; cy += (gy - cy) * .18; sx += (tx - sx) * .1; sy += (ty - sy) * .1;
      element.style.setProperty("--look-x", cx.toFixed(3));
      element.style.setProperty("--look-y", cy.toFixed(3));
      element.style.setProperty("--tilt-y", `${sx.toFixed(2)}deg`);
      element.style.setProperty("--tilt-x", `${sy.toFixed(2)}deg`);
      element.style.setProperty("--rim-x", `${(50 + sx * 3).toFixed(1)}%`);
      frame = Math.abs(gx - cx) + Math.abs(gy - cy) + Math.abs(tx - sx) + Math.abs(ty - sy) > .004 ? requestAnimationFrame(loop) : 0;
    };
    const aim = (x: number, y: number) => {
      const face = (openRef.current && headAvatar.current ? headAvatar.current : launcher.current)?.getBoundingClientRect();
      if (!face) return;
      const dx = x - (face.left + face.width / 2), dy = y - (face.top + face.height * .3);
      const d = Math.hypot(dx, dy) || 1, reach = Math.min(1, d / 160);
      gx = dx / d * reach; gy = dy / d * reach;
      tx = Math.max(-1, Math.min(1, dx / innerWidth * 2.4)) * 16; ty = Math.max(-1, Math.min(1, dy / innerHeight * 2.4)) * -10;
      if (!frame && !still) frame = requestAnimationFrame(loop);
    };
    const move = (event: PointerEvent) => { if (event.pointerType === "mouse") aim(event.clientX, event.clientY); };
    addEventListener("pointermove", move, { passive: true });
    // Touch screens: an occasional glance so he never looks frozen.
    const glance = window.setInterval(() => {
      if (still || matchMedia("(hover: hover)").matches) return;
      gx = (Math.random() - .5) * 1.4; gy = (Math.random() - .5) * .8;
      if (!frame) frame = requestAnimationFrame(loop);
    }, 2600);
    const look = (event: Event) => { const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail; gx = x; gy = y; if (!frame && !still) frame = requestAnimationFrame(loop); };
    element.addEventListener("guide-look", look);
    return () => { removeEventListener("pointermove", move); clearInterval(glance); element.removeEventListener("guide-look", look); cancelAnimationFrame(frame); };
  }, []);
  const lookAt = (x: number, y: number) => root.current?.dispatchEvent(new CustomEvent("guide-look", { detail: { x, y } }));

  // Smart dock: if the wizard (or its teaser) would sit over anything readable or pressable,
  // he tucks into a slim tab at the screen edge, and steps back out when the space is clear.
  useEffect(() => {
    let timer = 0, frame = 0, streak = 0, clearStreak = 0, tucked = false;
    const hits = (rect: DOMRect | null) => {
      if (!rect || !rect.width) return false;
      for (let ix = 0; ix < 4; ix++) for (let iy = 0; iy < 4; iy++) {
        const x = rect.left + 4 + (rect.width - 8) * ix / 3, y = rect.top + 4 + (rect.height - 8) * iy / 3;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
        for (const element of document.elementsFromPoint(x, y)) {
          if (element.closest(".guide, .ds-header, .skip-link")) continue;
          const hit = element.closest(CONTENT);
          if (!hit) continue;
          const box = hit.getBoundingClientRect();
          // Large decorative art (empty alt, or inside an aria-hidden backdrop) is scenery; real images count.
          const decorative = hit.tagName === "IMG" && ((hit as HTMLImageElement).alt === "" || Boolean(hit.closest("[aria-hidden='true']")));
          if (decorative && box.width > innerWidth * .6) continue;
          if (getComputedStyle(hit).visibility === "hidden" || Number(getComputedStyle(hit).opacity) < .2) continue;
          return true;
        }
      }
      return false;
    };
    const check = () => {
      frame = 0;
      if (openRef.current) { if (tucked) { tucked = false; setDock("full"); } return; }
      const node = root.current;
      if (!node) return;
      // Measure where the wizard stands when out, whatever his current state.
      const size = innerWidth < 640 ? { w: 58, h: 86 } : { w: 70, h: 104 };
      const left = Math.max(14, Number.parseFloat(getComputedStyle(node).left) || 14);
      const bottom = innerHeight - (Number.parseFloat(getComputedStyle(node).bottom) || 14);
      const home = new DOMRect(left, bottom - size.h, size.w, size.h);
      const over = hits(home);
      if (over) { streak++; clearStreak = 0; } else { clearStreak++; streak = 0; }
      if (!tucked && streak >= 2) { tucked = true; setDock("tucked"); }
      else if (tucked && clearStreak >= 2) { tucked = false; setDock("full"); }
      setTeaseClear(!hits(teaseRef.current?.getBoundingClientRect() ?? null));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { clearTimeout(timer); timer = window.setTimeout(check, 90); }); };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const poll = window.setInterval(check, 1200);
    const first = window.setTimeout(check, 400);
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); clearInterval(poll); clearTimeout(first); clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [pathname, tease]);

  // Every so often, when nobody is talking to him and he has room, he waves.
  useEffect(() => {
    if (reduced()) return;
    const timer = window.setInterval(() => { if (!openRef.current && dock === "full" && mood === "idle" && !document.hidden) pulse("wave", 1400); }, 15000);
    return () => clearInterval(timer);
  }, [dock, mood, pulse]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text || typing) return;
    setView("chat");
    setMessages((list) => [...list.map((m) => ({ ...m, fresh: false })), { id: counter.current++, from: "you", body: text }]);
    setDraft(""); setTyping(true); setMood("thinking"); lookAt(-.55, -.85);
    window.setTimeout(() => {
      setMessages((list) => [...list, { id: counter.current++, from: "guide", body: answer(text), fresh: true }]);
      setTyping(false);
      pulse("cast", 900);
      lookAt(0, .35);
    }, 650 + Math.min(700, text.length * 12));
  };
  const submit = (event: FormEvent) => { event.preventDefault(); ask(draft); };
  // The composer grows with its text, up to five lines.
  const grow = (area: HTMLTextAreaElement) => { area.style.height = "auto"; area.style.height = `${Math.min(area.scrollHeight, 120)}px`; };
  useEffect(() => { if (!draft && input.current) input.current.style.height = ""; }, [draft]);
  const reset = () => { setMessages([{ id: 0, from: "guide", body: greeting }]); counter.current = 1; setView("home"); input.current?.focus(); };
  const toggle = () => {
    const next = !open;
    if (next) { pulse("cast", 900); burstAt(launcher.current, launchSparks.current, 14); }
    setOpen(next);
  };
  const lastGuide = [...messages].reverse().find((m) => m.from === "guide")?.body as GuideAnswer | undefined;
  const chips = lastGuide?.chips ?? starterChips;

  return <div ref={root} className="guide" data-open={open} data-dock={dock} data-mood={mood} data-view={view}>
    <SparkBurst ref={launchSparks} className="guide__sparks" />
    <div className="guide__backdrop" aria-hidden="true" onClick={() => setOpen(false)} />

    <section ref={panel} id={panelId} className="guide__panel" role="dialog" aria-modal="false" aria-label="Tierplay guide" inert={!open} data-lenis-prevent>
      <div className="guide__head">
        <span ref={headAvatar} className="guide__avatar"><Wizard3D variant="face" uid={`${uid}h`} /></span>
        <div className="guide__title">
          <h2>Tierplay Guide</h2>
          <p>Answers from Tierplay’s published catalogue</p>
        </div>
        <div className="guide__actions">
          {view === "chat" ? <button type="button" className="guide__icon" aria-label="Back to topics" title="Topics" onClick={() => setView("home")}><House aria-hidden="true" size={16} strokeWidth={1.75} /></button> : null}
          {messages.length > 1 ? <button type="button" className="guide__icon" aria-label="Start a new conversation" title="New conversation" onClick={reset}><SquarePen aria-hidden="true" size={16} strokeWidth={1.75} /></button> : null}
          <button type="button" className="guide__icon" aria-label="Close guide" title="Close" onClick={() => { setOpen(false); launcher.current?.focus(); }}><X aria-hidden="true" size={17} strokeWidth={1.75} /></button>
        </div>
      </div>

      {view === "home" ? <div className="guide__home">
        <div className="guide__intro">
          <span className="guide__intro-mark"><Wizard3D variant="face" uid={`${uid}s`} /></span>
          <h3>How can I help?</h3>
          <p>Ask about Sunscape games, the Altitude and Pinnacle cabinets, connected systems or support.</p>
        </div>
        <div className="guide__topics" role="group" aria-label="Topics">
          {guideTopics.map((topic) => {
            const Icon = topicIcons[topic.icon];
            return <button key={topic.chip} type="button" className="guide__topic" onClick={() => ask(topic.chip)}>
              <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
              <b>{topic.title}</b><small>{topic.text}</small>
            </button>;
          })}
        </div>
        <div className="guide__prompts" role="group" aria-label="Example questions">
          {guidePrompts.map((prompt) => <button key={prompt} type="button" onClick={() => ask(prompt)}>{prompt}</button>)}
        </div>
        {messages.length > 1 ? <button type="button" className="guide__resume" onClick={() => setView("chat")}>Continue conversation<ArrowRight aria-hidden="true" size={14} strokeWidth={1.75} /></button> : null}
      </div> : <div ref={log} className="guide__log" aria-live="polite" aria-relevant="additions">
        {/* The home screen already greets; the conversation starts with the visitor's first question. */}
        {messages.filter((m) => m.id !== 0).map((m) => <div key={m.id} className={`gmsg gmsg--${m.from}`}>
          {typeof m.body === "string" ? <p className="gmsg__bubble">{m.body}</p> : <Answer body={m.body} fresh={m.fresh} />}
        </div>)}
        {typing ? <div className="gmsg gmsg--guide gmsg--typing" aria-label="The guide is typing"><ShinyText text="Thinking" /></div> : null}
      </div>}

      <div className="guide__composer">
        {view === "chat" ? <div className="guide__chips" role="group" aria-label="Suggested topics" data-lenis-prevent-horizontal>
          {chips.map((chip) => <button key={chip} type="button" onClick={() => ask(chip)}>{chip}</button>)}
        </div> : null}
        <form className="guide__form" onSubmit={submit}>
          <label className="sr-only" htmlFor={`${panelId}-q`}>Ask about Tierplay</label>
          <textarea ref={input} id={`${panelId}-q`} value={draft} rows={1} placeholder="Ask anything about Tierplay" autoComplete="off" maxLength={200}
            onChange={(e) => { setDraft(e.target.value); grow(e.currentTarget); if (!typing) { setMood(e.target.value ? "listening" : "idle"); if (e.target.value) lookAt(.2, .9); } }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); ask(draft); } }}
            onBlur={() => { if (!typing && mood === "listening") setMood("idle"); }} />
          <button type="submit" aria-label="Send" disabled={!draft.trim() || typing}><ArrowUp aria-hidden="true" size={16} strokeWidth={2.4} /></button>
        </form>
        <p className="guide__fine">The guide only knows Tierplay’s published information.</p>
      </div>
    </section>

    {tease && !open && dock === "full" ? <div ref={teaseRef} className="guide__tease" data-clear={teaseClear}>
      <button type="button" className="guide__tease-open" onClick={toggle}>Need a hand? <b>Ask me about Tierplay.</b></button>
      <button type="button" className="guide__tease-x" aria-label="Dismiss" onClick={() => { setTease(false); try { sessionStorage.setItem(TEASE, "1"); } catch { /* ignore */ } }}><X aria-hidden="true" size={14} strokeWidth={2} /></button>
    </div> : null}

    <button ref={launcher} type="button" className="guide__launcher" aria-expanded={open} aria-controls={panelId} aria-label={open ? "Close Tierplay guide" : "Open Tierplay guide"}
      onPointerEnter={() => { if (dock === "full" && mood === "idle") pulse("wave", 900); }} onClick={toggle}>
      <span className="guide__figure"><Wizard3D variant="figure" uid={`${uid}l`} /></span>
      <span className="guide__tab" aria-hidden="true"><Sparkles size={12} strokeWidth={2} /></span>
      <span className="guide__close-badge" aria-hidden="true"><X size={14} strokeWidth={2.2} /></span>
    </button>
  </div>;
}
