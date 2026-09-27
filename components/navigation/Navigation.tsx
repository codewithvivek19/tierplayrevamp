"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { duration } from "@/motion/tokens";
const links = [
  ["The cabinet", "#cabinet"],
  ["Sunscape", "#sunscape"],
  ["For operators", "#operators"],
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <a href="#cabinet" className="brand" aria-label="Tierplay home">
          <img
            src="/media/tierplay.svg"
            alt="Tierplay"
            width="164"
            height="50"
          />
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([name, href]) => (
            <a href={href} key={href}>
              {name}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="mailto:info@tierplay.com">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menu}
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="mobile-nav"
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : duration.fast }}
          >
            {links.map(([name, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => {
                  setOpen(false);
                  toggle.current?.focus();
                }}
              >
                {name}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
            <a href="mailto:info@tierplay.com">Let’s talk ↗</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
