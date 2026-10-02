import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ArrowUpRight, Check, type LucideProps } from "lucide-react";
import CinematicText from "@/components/motion/CinematicText";

type Icon = ComponentType<LucideProps>;

/** Small uppercase label with an optional icon: the "machine label" used across the system. */
export function Label({ icon: IconComponent, children, className = "" }: { icon?: Icon; children: ReactNode; className?: string }) {
  return <p className={`ds-label ${className}`}>{IconComponent ? <IconComponent aria-hidden="true" size={14} strokeWidth={1.5} /> : <i aria-hidden="true" />}<span>{children}</span></p>;
}

/** Every section opens the same way: label + hairline, title left, one-line blurb right. */
export function SectionHeader({ icon, label, title, blurb, as = "h2", id, align = "split", children }: {
  icon?: Icon; label: string; title: string; blurb?: ReactNode; as?: "h1" | "h2"; id?: string; align?: "split" | "center"; children?: ReactNode;
}) {
  return <header className={`ds-section-head ds-section-head--${align}`}>
    <div className="ds-section-head__rule"><Label icon={icon}>{label}</Label></div>
    <div className="ds-section-head__body">
      <CinematicText as={as} id={id} className="ds-section-head__title">{title}</CinematicText>
      {blurb ? <p className="ds-section-head__blurb">{blurb}</p> : null}
      {children}
    </div>
  </header>;
}

type ButtonProps = { href: string; children: ReactNode; variant?: "primary" | "ghost" | "link"; external?: boolean; className?: string; icon?: boolean };

/** Primary: dark fill inside an animated violet→amber ring. Ghost: hairline pill. Link: underline. */
export function Button({ href, children, variant = "primary", external = false, className = "", icon = true }: ButtonProps) {
  const body = <><span>{children}</span>{icon ? <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} /> : null}</>;
  const cls = `ds-button ds-button--${variant} ${className}`;
  if (external || /^(mailto|tel):/.test(href)) return <a className={cls} href={href}>{body}</a>;
  return <Link className={cls} href={href}>{body}</Link>;
}

/** Glass card: hairline border, soft internal glow, title and one line pinned bottom-left. */
export function GlassCard({ title, text, label, media, tone = "violet", href, className = "", children, titleAs: Title = "h3" }: {
  title: string; text?: ReactNode; label?: string; media?: ReactNode; tone?: "violet" | "amber" | "none"; href?: string; className?: string; children?: ReactNode; titleAs?: "h2" | "h3";
}) {
  const inner = <>
    {media ? <div className="ds-card__media">{media}</div> : null}
    <span className="ds-card__glow" aria-hidden="true" />
    <div className="ds-card__body">
      {label ? <span className="ds-card__label">{label}</span> : null}
      <Title className="ds-card__title">{title}</Title>
      {text ? <p className="ds-card__text">{text}</p> : null}
      {children}
    </div>
    {href ? <ArrowUpRight className="ds-card__arrow" aria-hidden="true" size={18} strokeWidth={1.5} /> : null}
  </>;
  const cls = `ds-card ds-card--${tone} ${href ? "ds-card--link" : ""} ${className}`;
  return href ? <Link href={href} className={cls}>{inner}</Link> : <article className={cls}>{inner}</article>;
}

export function Chip({ icon: IconComponent, children }: { icon?: Icon; children: ReactNode }) {
  return <span className="ds-chip">{IconComponent ? <IconComponent aria-hidden="true" size={14} strokeWidth={1.5} /> : null}{children}</span>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="ds-badge"><i aria-hidden="true" />{children}</span>;
}

export function CheckList({ items, columns = 1 }: { items: readonly string[]; columns?: 1 | 2 }) {
  return <ul className={`ds-checklist ds-checklist--${columns}`}>{items.map((item) => <li key={item}><Check aria-hidden="true" size={14} strokeWidth={2} /><span>{item}</span></li>)}</ul>;
}

/** Published facts only: label/value pairs, never invented metrics. */
export function StatBlock({ items }: { items: { label: string; value: ReactNode }[] }) {
  return <dl className="ds-stats">{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
}

/** Infinite marquee; pauses on hover/focus and becomes a static wrapped row under reduced motion. */
export function Marquee({ items, label }: { items: ReactNode[]; label: string }) {
  return <div className="ds-marquee" role="group" aria-label={label}>
    <div className="ds-marquee__track">
      {[0, 1].map((copy) => <div key={copy} className="ds-marquee__set" aria-hidden={copy === 1}>{items.map((item, i) => <div key={i} className="ds-marquee__item">{item}</div>)}</div>)}
    </div>
  </div>;
}

export function Note({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "market" }) {
  return <p className={`ds-note ds-note--${tone}`}>{children}</p>;
}
