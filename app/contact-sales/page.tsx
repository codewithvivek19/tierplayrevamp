import type { Metadata } from "next";
import Link from "next/link";
import InteriorHero from "@/components/site/InteriorHero";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { company } from "@/content/site";

export const metadata: Metadata = { title: "Contact Sales" };

const audiences = ["Distributor", "Operator", "Location owner", "Other"];

export default function ContactPage() {
  return <main id="main">
    <InteriorHero eyebrow="Get in touch" title="Your partner for gaming innovation." intro="Start a conversation about games, cabinets, connected products or distribution." image="/media/generated/theme-v3/gaming-floor-editorial-v5.webp" imageAlt="Tierplay gaming floor" />
    <section className="contact-page section-pad"><Reveal><p className="kicker">Sales enquiry</p><KineticHeading>Tell us what you’re building.</KineticHeading><p>The legacy site invited distributors, operators, location owners and other partners to connect. Choose the route that fits, then contact Tierplay directly.</p><div className="audience-pills" aria-label="Enquiry types">{audiences.map((audience) => <span key={audience}>{audience}</span>)}</div></Reveal><Reveal className="contact-options"><a className="contact-option" href={`${company.emailHref}?subject=Tierplay%20sales%20enquiry`}><span>01</span><b>Email Tierplay</b><em>{company.email}</em><strong aria-hidden="true">↗</strong></a><a className="contact-option" href={company.phoneHref}><span>02</span><b>Call Tierplay</b><em>{company.phone}</em><strong aria-hidden="true">↗</strong></a><Link className="contact-option" href="/24-7-support"><span>03</span><b>Technical support</b><em>Visit support</em><strong aria-hidden="true">↗</strong></Link></Reveal></section>
    <section className="contact-location section-pad"><SpotlightPanel><p className="kicker">Tierplay</p><h2>Columbus, Georgia</h2><address>{company.address}</address><a href={company.emailHref}>{company.email}</a></SpotlightPanel></section>
  </main>;
}
