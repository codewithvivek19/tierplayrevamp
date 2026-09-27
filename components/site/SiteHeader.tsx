"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link className="site-brand" href="/" aria-label="Tierplay home">
          <img src="/media/generated/production-stills/tierplay-logo-official.svg" alt="Tierplay" width="205" height="62" />
        </Link>
        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-action" href="/contact-sales">Talk to Tierplay <span aria-hidden="true">↗</span></Link>
        <button ref={toggle} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
          <span>{open ? "Close" : "Menu"}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            className="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: reduced ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            {[{ label: "Home", href: "/" }, ...navigation, { label: "Contact sales", href: "/contact-sales" }].map((item, index) => (
              <Link key={item.href} href={item.href}><span>0{index + 1}</span>{item.label}<b aria-hidden="true">↗</b></Link>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
