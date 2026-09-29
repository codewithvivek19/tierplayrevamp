import type { Metadata } from "next";
import { CircleHelp, MessagesSquare } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import ContactActions from "@/components/ds/ContactActions";
import { SectionHeader } from "@/components/ds/primitives";
import { Accordion } from "@/components/ds/interactive";
import { siteFaq } from "@/content/site";

export const metadata: Metadata = { title: "Contact Sales", description: "Speak with the team about games, cabinets, connected products or distribution." };

export default function ContactPage() {
  return <main id="main" className="ds-page">
    <PageHero compact badge="Get in touch" title="Let’s talk Tierplay." intro="Speak with the team about games, cabinets, connected products or distribution." image="/media/generated/theme-v3/gaming-floor-editorial-v5.webp" />
    <section className="ds-section ds-container">
      <SectionHeader icon={MessagesSquare} label="Sales enquiry" title="Start a conversation." blurb="For distributors, operators and location owners, the team is a call or email away." />
      <ContactActions actions={[{ kind: "email", subject: "Tierplay sales enquiry" }, { kind: "phone" }, { kind: "support" }]} />
    </section>
    <section className="ds-section ds-container">
      <SectionHeader icon={CircleHelp} label="FAQ" title="Before you ask." blurb="Answers drawn from Tierplay’s published catalogue." />
      <Accordion items={siteFaq} />
    </section>
  </main>;
}
