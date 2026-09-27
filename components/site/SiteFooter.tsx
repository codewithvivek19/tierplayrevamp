import Link from "next/link";
import { navigation, cabinets, company } from "@/content/site";
import Lamp from "@/components/ui/Lamp";
import DepthText from "@/components/ui/DepthText";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <section className="floor-invitation" aria-labelledby="floor-invitation-title">
        <Lamp><div className="floor-invitation-copy"><p className="kicker">Your next installation</p>
          <h2 id="floor-invitation-title">Make room for <DepthText text="Tierplay."/></h2>
          <p>Explore Sunscape games, Altitude and Pinnacle cabinets, and the systems that connect them. Tell us what your floor needs.</p>
          <Link className="arrow-button light" href="/contact-sales">Discuss your floor <span aria-hidden="true">↗</span></Link>
          <Link className="floor-secondary" href="/cabinets">Compare Altitude & Pinnacle <span aria-hidden="true">→</span></Link>
        </div></Lamp>
        <div className="floor-product-stage">
          {cabinets.map(cabinet => <Link href="/cabinets" key={cabinet.name} className="floor-product"><img src={cabinet.sourceImage} alt={`${cabinet.name} cabinet`} loading="lazy"/><span>{cabinet.name}<b aria-hidden="true">↗</b></span></Link>)}
        </div>
      </section>
      <div className="footer-grid">
        <Link className="footer-brand" href="/" aria-label="Tierplay home">
          <img src="/media/generated/production-stills/tierplay-logo-official.svg" alt="Tierplay" width="205" height="62" />
        </Link>
        <nav aria-label="Footer navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <nav aria-label="Company links">
          <Link href="/games-collection">Games collection</Link>
          <Link href="/up-to-date">Up to date</Link>
          <Link href="/24-7-support">24/7 support</Link>
          <Link href="/contact-sales">Contact sales</Link>
        </nav>
        <div className="footer-note">
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={company.emailHref}>{company.email}</a>
          <span>{company.address}</span>
          <span>© 2026 Tierplay</span>
        </div>
      </div>
    </footer>
  );
}
