"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Plus } from "lucide-react";

export type TabItem = { id: string; label: string; icon?: ReactNode; content: ReactNode };

/** Pill tabs with roving focus (Arrow/Home/End), per WAI-ARIA tabs pattern. */
export function Tabs({ items, label, initial = 0 }: { items: readonly TabItem[]; label: string; initial?: number }) {
  const id = useId();
  const [active, setActive] = useState(initial);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const key = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1;
    const next = event.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : event.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? last : -1;
    if (next < 0) return;
    event.preventDefault(); setActive(next); refs.current[next]?.focus();
  };
  return <div className="ds-tabs">
    <div className="ds-tabs__list" data-lenis-prevent-horizontal role="tablist" aria-label={label}>
      {items.map((item, i) => <button key={item.id} ref={(b) => { refs.current[i] = b; }} id={`${id}-t-${i}`} role="tab" type="button" aria-selected={i === active} aria-controls={`${id}-p-${i}`} tabIndex={i === active ? 0 : -1} onKeyDown={key} onClick={() => setActive(i)}>
        {item.icon}{item.label}
      </button>)}
    </div>
    {items.map((item, i) => <div key={item.id} id={`${id}-p-${i}`} role="tabpanel" aria-labelledby={`${id}-t-${i}`} hidden={i !== active} className="ds-tabs__panel">{item.content}</div>)}
  </div>;
}

export type StepItem = { title: string; text: ReactNode; media?: ReactNode };

/** Numbered steps; the rule above each number fills as that step reaches the viewport centre. */
export function Steps({ items }: { items: readonly StepItem[] }) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [reached, setReached] = useState(-1);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setReached((value) => Math.max(value, Number((entry.target as HTMLElement).dataset.index))); });
    }, { rootMargin: "-40% 0px -40% 0px" });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [items.length]);
  return <ol className="ds-steps">
    {items.map((item, i) => <li key={item.title} ref={(n) => { refs.current[i] = n; }} data-index={i} data-reached={i <= reached}>
      <span className="ds-steps__rule" aria-hidden="true"><i /></span>
      <span className="ds-steps__index">{String(i + 1).padStart(2, "0")}.</span>
      {item.media ? <div className="ds-steps__media">{item.media}</div> : null}
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </li>)}
  </ol>;
}

export type FaqItem = { q: string; a: ReactNode };

/** Two-column FAQ on native disclosure buttons; one open at a time. */
export function Accordion({ items }: { items: readonly FaqItem[] }) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(null);
  return <div className="ds-accordion">
    {items.map((item, i) => <div key={item.q} className="ds-accordion__item" data-open={open === i}>
      <h3>
        <button type="button" id={`${id}-q-${i}`} aria-expanded={open === i} aria-controls={`${id}-a-${i}`} onClick={() => setOpen(open === i ? null : i)}>
          <span>{item.q}</span><Plus aria-hidden="true" size={16} strokeWidth={1.5} />
        </button>
      </h3>
      <div id={`${id}-a-${i}`} role="region" aria-labelledby={`${id}-q-${i}`} className="ds-accordion__panel"><div><p>{item.a}</p></div></div>
    </div>)}
  </div>;
}
