import type { Metadata } from "next";
import Image from "next/image";
import { Boxes, Layers, Sparkles } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import Reveal from "@/components/site/Reveal";
import SystemsSwitcher from "@/components/site/SystemsSwitcher";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Button, GlassCard, Label, Note, SectionHeader } from "@/components/ds/primitives";
import { legacyNotice, productPillars } from "@/content/site";

export const metadata: Metadata = { title: "Products", description: "Collection management for operators. Linked jackpots for the game floor." };

export default function ProductsPage() {
  return <main id="main" className="ds-page">
    <PageHero badge="Tierplay products" title="Connected systems." intro="Collection management for operators. Linked jackpots for the game floor."
      image="/media/generated/tierplay-system-landscape-v1.webp"
      actions={<><Button href="#systems">Explore the systems</Button><Button href="/contact-sales" variant="ghost">Talk to Tierplay</Button></>} />

    <section className="ds-section ds-container">
      <Label icon={Sparkles}>Product range</Label>
      <ScrollReveal as="h2" className="ds-statement">Jackpot experiences, operator tools and cabinet support in one product range.</ScrollReveal>
      <div className="ds-grid ds-grid--4">
        {productPillars.map((pillar, i) => <Reveal key={pillar.title}><GlassCard className="ds-card--compact" label={`0${i + 1}`} title={pillar.title} text={pillar.copy} tone={i % 2 ? "amber" : "violet"} /></Reveal>)}
      </div>
    </section>

    <section className="ds-section ds-container" id="systems">
      <SectionHeader icon={Boxes} label="The systems" title="What connects the floor." blurb="Two systems, each with a clear role. Switch between them to see how each one connects the floor." />
      <SystemsSwitcher action={false} />
    </section>

    <section className="ds-section ds-container">
      <SectionHeader icon={Layers} label="Next" title="See how it fits your floor." blurb="Pair the systems with Sunscape games and Tierplay cabinets." />
      <div className="ds-grid ds-grid--2">
        <GlassCard href="/games" label="Games" title="Sunscape boards" text="Six boards and fifteen named games." tone="violet" media={<Image src="/media/generated/theme-v3/gaming-floor-editorial-v5.webp" alt="" fill sizes="(max-width: 620px) 100vw, 50vw" />} />
        <GlassCard href="/cabinets" label="Cabinets" title="Altitude and Pinnacle" text="Two cabinet forms for the floor." tone="amber" media={<Image src="/media/generated/theme-v3/cabinet-lineup-v3.webp" alt="" fill sizes="(max-width: 620px) 100vw, 50vw" />} />
      </div>
      <Note>{legacyNotice}</Note>
    </section>
  </main>;
}
