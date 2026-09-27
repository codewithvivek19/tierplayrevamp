import Link from "next/link";
import { navigation, games } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-callout">
        <p className="kicker">Start a conversation</p>
        <h2>Bring the next tier<br />to your floor.</h2>
        <Link className="arrow-button light" href="/contact-sales">Contact sales <span aria-hidden="true">↗</span></Link>
        <div className="footer-orbit" aria-hidden="true">{games.map(game => <img key={game.slug} src={game.image} alt="" width="100" height="100" loading="lazy"/>)}</div>
      </div>
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
          <span>Gaming technology</span>
          <span>Cabinets · Games · Systems</span>
          <span>© 2026 Tierplay</span>
        </div>
      </div>
    </footer>
  );
}
