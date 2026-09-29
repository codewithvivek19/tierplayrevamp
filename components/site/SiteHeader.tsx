"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { company, navigation } from "@/content/site";

const secondary = [
  { label: "Games collection", href: "/games-collection" },
  { label: "24/7 support", href: "/24-7-support" },
  { label: "Up to date", href: "/up-to-date" },
];

/** Floating glass pill. Transparent over the hero, solid after it; hides on scroll down, returns on scroll up. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = scrollY, frame = 0;
    const update = () => {
      frame = 0;
      const y = scrollY, element = header.current;
      if (!element) return;
      element.dataset.solid = y > 40 ? "true" : "false";
      if (y < last - 4 || y < 160) element.dataset.hidden = "false";
      else if (y > last + 4 && !open) element.dataset.hidden = "true";
      last = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const focusables = () => [...(sheet.current?.querySelectorAll<HTMLElement>("a, button") ?? [])];
    focusables()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const items = [toggle.current!, ...focusables()];
      const first = items[0], lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); lastItem.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { root.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header ref={header} className="ds-header" data-open={open}>
        <div className="ds-header__pill">
          <Link className="ds-header__brand" href="/" aria-label="Tierplay home">
            <img src="/media/generated/production-stills/tierplay-logo-official.svg" alt="Tierplay" width="132" height="40" />
          </Link>
          <nav className="ds-header__nav" aria-label="Primary navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
          </nav>
          <Link className="ds-button ds-button--primary ds-header__cta" href="/contact-sales"><span>Talk to Tierplay</span><ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} /></Link>
          <button ref={toggle} className="ds-header__toggle menu-button" type="button" aria-expanded={open} aria-controls="mobile-sheet" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            {open ? <X aria-hidden="true" size={20} strokeWidth={1.5} /> : <Menu aria-hidden="true" size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </header>
      <div ref={sheet} id="mobile-sheet" className="ds-sheet" data-open={open} hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Mobile navigation" className="ds-sheet__primary">
          {[{ label: "Home", href: "/" }, ...navigation].map((item, index) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} style={{ transitionDelay: `${60 + index * 40}ms` }}>
            <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
          </Link>)}
        </nav>
        <nav aria-label="More" className="ds-sheet__secondary">{secondary.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="ds-sheet__contact">
          <a href={company.emailHref}><Mail aria-hidden="true" size={16} strokeWidth={1.5} />{company.email}</a>
          <a href={company.phoneHref}><Phone aria-hidden="true" size={16} strokeWidth={1.5} />{company.phone}</a>
          <Link className="ds-button ds-button--primary" href="/contact-sales"><span>Talk to Tierplay</span><ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} /></Link>
        </div>
      </div>
    </>
  );
}
