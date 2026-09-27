import Link from "next/link";
import InteriorHero from "./InteriorHero";

export default function UtilityPage({ eyebrow, title, intro, note, actionLabel = "Contact Tierplay", actionHref = "/contact-sales" }: { eyebrow: string; title: string; intro: string; note: string; actionLabel?: string; actionHref?: string }) {
  return <main id="main"><InteriorHero eyebrow={eyebrow} title={title} intro={intro} /><section className="utility-body section-pad"><span className="utility-mark" aria-hidden="true">+</span><div><p className="kicker">Tierplay / information</p><h2>{note}</h2><p>Additional verified information will appear here when it is approved for publication.</p><Link className="arrow-button" href={actionHref}>{actionLabel}<span aria-hidden="true">↗</span></Link></div></section></main>;
}
