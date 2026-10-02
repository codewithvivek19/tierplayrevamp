import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, legacyNotice, navigation } from "@/content/site";
import DepthText from "@/components/reactbits/DepthText";
import GridScan from "@/components/reactbits/GridScan";
import { Badge, Button } from "@/components/ds/primitives";

const company_links = [
  { label: "Games collection", href: "/games-collection" },
  { label: "Up to date", href: "/up-to-date" },
  { label: "24/7 support", href: "/24-7-support" },
  { label: "Contact sales", href: "/contact-sales" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-gridscan"><GridScan linesColor="#4A3570" scanColor="#F0B8FF" sensitivity={.55} lineThickness={1.1} gridScale={.1} scanOpacity={.5} bloomIntensity={.7} chromaticAberration={.0028} noiseIntensity={.012} /></div>

      <div className="footer-aurora" aria-hidden="true"><i /><i /><i /></div>
      <section className="ds-closing" aria-labelledby="closing-title">
        <div className="ds-closing__copy ds-container">
          <Badge>Your next installation</Badge>
          <h2 id="closing-title" className="ds-closing__title">Make room for <DepthText text="Tierplay." /></h2>
          <p className="ds-closing__text">Explore Sunscape games, Altitude and Pinnacle cabinets, and the systems that connect them. Tell us what your floor needs.</p>
          <div className="ds-actions ds-actions--center">
            <Button href="/contact-sales">Discuss your floor</Button>
            <Button href="/cabinets#cabinet-compare" variant="ghost">Compare Altitude &amp; Pinnacle</Button>
          </div>
        </div>
        <div className="ds-wordmark" aria-hidden="true">
          <span className="ds-wordmark__horizon" />
          <svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax meet">
            <defs>
              {/* The fill flows: a wide violet → light → amber gradient slides through the letters. */}
              <linearGradient id="wordmark-fill" x1="0" x2="1" y1="0" y2="0" spreadMethod="reflect" gradientTransform="translate(0 0)">
                <stop offset="0" stopColor="#9e05ff" /><stop offset=".3" stopColor="#c79bff" /><stop offset=".5" stopColor="#ffe8c2" /><stop offset=".7" stopColor="#ffac0a" /><stop offset="1" stopColor="#ff5fb0" />
                <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0" dur="14s" repeatCount="indefinite" />
              </linearGradient>
              <linearGradient id="wordmark-fade" x1="0" x2="0" y1="0" y2="1">
                <stop offset=".35" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              {/* A narrow band of light that sweeps across the wordmark. */}
              <linearGradient id="wordmark-glint" x1="0" x2="1" y1="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="translate(-700 0) skewX(-18)">
                <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".46" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".95" /><stop offset=".54" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
                <animateTransform attributeName="gradientTransform" type="translate" values="-900 0;1400 0;1400 0" keyTimes="0;.45;1" dur="6.5s" repeatCount="indefinite" />
              </linearGradient>
              <mask id="wordmark-mask"><rect width="1200" height="220" fill="url(#wordmark-fade)" /></mask>
            </defs>
            <g mask="url(#wordmark-mask)">
              <text className="ds-wordmark__fill" x="600" y="206" textAnchor="middle" fill="url(#wordmark-fill)">TIERPLAY</text>
              <text className="ds-wordmark__glint" x="600" y="206" textAnchor="middle" fill="url(#wordmark-glint)">TIERPLAY</text>
              <text className="ds-wordmark__line" x="600" y="206" textAnchor="middle" fill="none" stroke="url(#wordmark-fill)" strokeWidth="1.5">TIERPLAY</text>
            </g>
          </svg>
          <span className="ds-wordmark__sparks" />
        </div>
      </section>

      <div className="ds-footer ds-container">
        <div className="ds-footer__brand">
          <Link href="/" aria-label="Tierplay home"><img src="/media/generated/production-stills/tierplay-logo-official.svg" alt="Tierplay" width="160" height="48" /></Link>
          <p>Games, cabinets and connected systems for the gaming floor.</p>
        </div>
        <nav aria-label="Explore" className="ds-footer__col"><h2>Explore</h2>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <nav aria-label="Company" className="ds-footer__col"><h2>Company</h2>{company_links.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="ds-footer__col"><h2>Contact</h2>
          <span className="ds-footer__live"><i aria-hidden="true" />Support live 24/7/365</span>
          <a href={company.phoneHref}><Phone aria-hidden="true" size={14} strokeWidth={1.5} />{company.phone}</a>
          <a href={company.emailHref}><Mail aria-hidden="true" size={14} strokeWidth={1.5} />{company.email}</a>
          <span><MapPin aria-hidden="true" size={14} strokeWidth={1.5} />{company.address}</span>
        </div>
        <div className="ds-footer__bar">
          <span>© 2026 Tierplay</span>
          <span className="ds-footer__market">not available for Georgia market</span>
          <span className="ds-footer__legacy">{legacyNotice}</span>
        </div>
      </div>
    </footer>
  );
}
