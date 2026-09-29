import type { Metadata } from "next";
import { CircleHelp, Headset, Sparkles } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import ContactActions from "@/components/ds/ContactActions";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Label, Note, SectionHeader } from "@/components/ds/primitives";
import { Accordion } from "@/components/ds/interactive";
import { legacyNotice, siteFaq, supportCopy } from "@/content/site";

export const metadata: Metadata = { title: "24/7 Support", description: "Reach Tierplay for technical support or a general enquiry." };

export default function SupportPage() {
  return <main id="main" className="ds-page">
    <PageHero compact badge="Support · 24/7/365" title="Keep the floor moving." intro="Reach Tierplay for technical support or a general enquiry." image="/media/generated/theme-v3/cabinet-stage-altitude-v5.webp" />
    <section className="ds-section ds-container">
      <Label icon={Sparkles}>Technical support</Label>
      <ScrollReveal className="ds-statement ds-statement--long">{supportCopy}</ScrollReveal>
      <Note>{legacyNotice}</Note>
    </section>
    <section className="ds-section ds-container">
      <SectionHeader icon={Headset} label="Support contact" title="Talk to support." blurb="Call or email the U.S.-based team." />
      <ContactActions actions={[{ kind: "phone" }, { kind: "email", subject: "Tierplay support request" }, { kind: "sales" }]} />
    </section>
    <section className="ds-section ds-container">
      <SectionHeader icon={CircleHelp} label="FAQ" title="Common questions." />
      <Accordion items={siteFaq} />
    </section>
  </main>;
}
