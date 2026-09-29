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
      <div className="footer-gridscan"><GridScan linesColor="#2F293A" scanColor="#E39BFF" sensitivity={.55} lineThickness={1} gridScale={.1} scanOpacity={.55} bloomIntensity={.6} chromaticAberration={.002} noiseIntensity={.01} /></div>

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
              <linearGradient id="wordmark-fill" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#9e05ff" /><stop offset=".45" stopColor="#e7c8ff" /><stop offset=".62" stopColor="#ffcd7d" /><stop offset="1" stopColor="#ffac0a" />
              </linearGradient>
              <linearGradient id="wordmark-fade" x1="0" x2="0" y1="0" y2="1">
                <stop offset=".35" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id="wordmark-mask"><rect width="1200" height="220" fill="url(#wordmark-fade)" /></mask>
            </defs>
            <text x="600" y="206" textAnchor="middle" fill="url(#wordmark-fill)" mask="url(#wordmark-mask)">TIERPLAY</text>
          </svg>
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
