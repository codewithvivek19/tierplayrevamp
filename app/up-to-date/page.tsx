import type { Metadata } from "next";
import Link from "next/link";
import InteriorHero from "@/components/site/InteriorHero";
import { KineticHeading, SignalLoop, SpotlightPanel } from "@/components/site/InteractivePrimitives";

export const metadata: Metadata = { title: "Up to Date" };

export default function UpdatePage() {
  return <main id="main"><InteriorHero eyebrow="Up to date" title="The latest from Tierplay." intro="The original public route contains no published article body, so this page stays honest about what is available." image="/media/generated/theme-v3/dragon-world-v3.webp" imageAlt="Tierplay game world" /><SignalLoop label="Tierplay updates" items={["Games", "Cabinets", "Products", "Player journey", "Support"]} /><section className="empty-editorial section-pad"><SpotlightPanel><span>Archive status / 00</span><KineticHeading>No published updates yet.</KineticHeading><p>New games and Tierplay updates can appear here once the stories, dates and media are approved. Until then, explore the complete recovered catalogue.</p><div><Link className="battle-button" href="/games">Explore games <span aria-hidden="true">↗</span></Link><Link className="text-action" href="/contact-sales">Contact Tierplay <span aria-hidden="true">↗</span></Link></div></SpotlightPanel></section></main>;
}
