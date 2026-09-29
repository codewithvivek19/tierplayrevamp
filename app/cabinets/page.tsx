import type { Metadata } from "next";
import Image from "next/image";
import { Columns2, Cpu, MonitorSmartphone } from "lucide-react";
import PageHero from "@/components/ds/PageHero";
import Reveal from "@/components/site/Reveal";
import AltitudeTour from "@/components/cabinet3d/AltitudeTour";
import TiltedCard from "@/components/reactbits/TiltedCard";
import { Button, CheckList, Note, SectionHeader } from "@/components/ds/primitives";
import { cabinetCapabilities, cabinets, legacyNotice } from "@/content/site";

export const metadata: Metadata = { title: "Cabinets", description: "Explore the upright Altitude and curved-screen Pinnacle consoles." };

const [altitude, pinnacle] = cabinets;
const rows = altitude.specifications.map((item, index) => [item, pinnacle.specifications[index]] as const);

export default function CabinetsPage() {
  return <main id="main" className="ds-page">
    <PageHero badge="Tierplay cabinets" title="Altitude and Pinnacle." intro="Explore the upright Altitude and curved-screen Pinnacle consoles."
      image="/media/generated/theme-v3/cabinet-lineup-v3.webp"
      actions={<><Button href="#altitude-tour-title">Tour the Altitude</Button><Button href="#cabinet-compare" variant="ghost">Compare cabinets</Button></>} />

    <AltitudeTour />

    <section className="ds-section ds-container">
      <SectionHeader icon={MonitorSmartphone} label="The second console" title={`${pinnacle.name} Console`} blurb={pinnacle.copy} />
      <div className="ds-panel">
        <Reveal className="ds-cabinet-art">
          <TiltedCard>
            <Image src="/media/generated/theme-v3/cabinet-stage-pinnacle-v5.webp" alt="" fill sizes="(max-width: 960px) 100vw, 48vw" className="v2-pinnacle-stage" />
            <Image src={pinnacle.image} alt={`${pinnacle.name} cabinet`} fill sizes="(max-width: 960px) 100vw, 48vw" className="v2-pinnacle-product" />
          </TiltedCard>
        </Reveal>
        <div>
          <span className="ds-card__label">02 / {pinnacle.label}</span>
          <h3>{pinnacle.name}</h3>
          <p className="ds-panel__text">{pinnacle.copy}</p>
          <CheckList items={pinnacle.specifications} />
          <div className="ds-actions" style={{ marginTop: "var(--s-5)" }}><Button href="/contact-sales">Discuss Pinnacle</Button></div>
        </div>
      </div>
    </section>

    <section className="ds-section ds-container" id="cabinet-compare">
      <SectionHeader icon={Columns2} label="Side by side" title="Compare the consoles." blurb="Published specifications for both cabinets." />
      <Reveal>
        <div className="ds-table-wrap" role="region" aria-label="Cabinet specifications table" tabIndex={0}>
          <table className="ds-table">
            <caption className="sr-only">Altitude and Pinnacle published specifications</caption>
            <thead><tr><th scope="col"><span className="sr-only">Specification</span></th><th scope="col">{altitude.name}<small>{altitude.label}</small></th><th scope="col">{pinnacle.name}<small>{pinnacle.label}</small></th></tr></thead>
            <tbody>{rows.map(([a, b], index) => <tr key={a}><th scope="row">{String(index + 1).padStart(2, "0")}</th><td>{a}</td><td>{b}</td></tr>)}</tbody>
          </table>
        </div>
      </Reveal>
    </section>

    <section className="ds-section ds-container">
      <SectionHeader icon={Cpu} label="Cabinet capabilities" title="Made for the floor." blurb="Capabilities listed for the cabinet range. Confirm model-specific details with Tierplay." />
      <Reveal><CheckList items={cabinetCapabilities} columns={2} /></Reveal>
      <Note>{legacyNotice}</Note>
    </section>
  </main>;
}
