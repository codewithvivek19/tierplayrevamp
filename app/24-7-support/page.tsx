import type { Metadata } from "next";
import Link from "next/link";
import InteriorHero from "@/components/site/InteriorHero";
import { KineticHeading, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { company, legacyNotice, supportCopy } from "@/content/site";

export const metadata: Metadata = { title: "24/7 Support" };

export default function SupportPage() {
  return <main id="main"><InteriorHero eyebrow="Support" title="24/7 support." intro="A direct path to Tierplay for technical concerns and general enquiries." image="/media/generated/theme-v3/cabinet-stage-altitude-v5.webp" imageAlt="Tierplay Altitude cabinet stage" /><section className="support-hub section-pad"><div><p className="kicker">Technical support</p><KineticHeading>Keep the floor moving.</KineticHeading><p>{supportCopy}</p><p className="archive-note">{legacyNotice}</p></div><SpotlightPanel className="support-contact-card"><span>Always on</span><h2>Contact Tierplay</h2><a href={company.phoneHref}>{company.phone}</a><a href={company.emailHref}>{company.email}</a><Link className="battle-button" href="/contact-sales">Sales enquiries <span aria-hidden="true">↗</span></Link></SpotlightPanel></section></main>;
}
