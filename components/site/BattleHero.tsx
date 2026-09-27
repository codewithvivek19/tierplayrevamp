"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BattleHero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".battle-hero-copy > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .8, ease: "power3.out" });
      gsap.to(".battle-hero-image", { yPercent: 12, scale: 1.06, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: .6 } });
    });
    return () => media.revert();
  }, { scope: root });
  return <section ref={root} className="battle-hero" aria-labelledby="hero-title">
    <div className="battle-hero-image" aria-hidden="true"><Image src="/media/generated/theme-v3/hero-multiverse-v4.webp" alt="" fill priority sizes="100vw" /></div>
    <div className="battle-hero-shade" />
    <div className="battle-container battle-hero-content">
      <div className="battle-hero-copy"><h1 id="hero-title">Enter the next<br />tier of play.</h1><p>Games, cabinets and connected technology. Discover the worlds of Tierplay and bring a new dimension to your gaming floor.</p><Link className="battle-button" href="/games">Explore our games <span aria-hidden="true">↗</span></Link></div>
      <nav className="hero-product-strip" aria-label="Explore Tierplay products">
        <Link href="/cabinets"><span className="product-emblem" aria-hidden="true">◇</span>Altitude</Link>
        <Link href="/cabinets"><span className="product-emblem" aria-hidden="true">◈</span>Pinnacle</Link>
        <Link href="/products"><span className="product-emblem bars" aria-hidden="true">≋</span>TCM</Link>
        <Link href="/products"><span className="product-emblem" aria-hidden="true">⬡</span>TLJ</Link>
      </nav>
    </div>
    <a href="#experience" className="hero-scroll-cue" aria-label="Discover the Tierplay experience">↓</a>
  </section>;
}
