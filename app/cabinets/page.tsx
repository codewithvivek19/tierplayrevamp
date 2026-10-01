import type { Metadata } from "next";
import { Columns2, Cpu } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import CabinetsHero from "@/components/cabinet3d/CabinetsHero";
import CabinetTour from "@/components/cabinet3d/CabinetTour";
import { Button, Note, SectionHeader } from "@/components/ds/primitives";
import { cabinetCapabilities, cabinets, legacyNotice } from "@/content/site";

export const metadata: Metadata = { title: "Cabinets", description: "Explore the upright Altitude and curved-screen Pinnacle consoles in 3D." };

const [altitude, pinnacle] = cabinets;
const rows = altitude.specifications.map((item, index) => [item, pinnacle.specifications[index]] as const);
// Specifications both consoles share; the first specification of each is what sets it apart.
const shared = altitude.specifications.filter((item) => (pinnacle.specifications as readonly string[]).includes(item));

// Capabilities listed for the cabinet range, grouped for reading. Every item comes from content/site.ts.
const pick = (...items: (typeof cabinetCapabilities)[number][]) => items;
const groups = [
  { id: "play", title: "Play", text: "What the player touches, sees and hears.",
    items: pick("Modern PCAP touchscreen", "Dual bash buttons and on-screen controls", "User-controlled audio", "Ambient monitor lighting", "Inductive phone charging") },
  { id: "pay", title: "Payments", text: "Validators and ticketing listed for the range.",
    items: pick("JCM UBA validators", "Epic Edge and Mothagoose ticketing") },
  { id: "promo", title: "Promotions", text: "Jackpots and offers that bring players back.",
    items: pick("Standard and linked jackpots", "Loyalty offers via SMS and email", "Free spins, bonus wheel and promotional media") },
  { id: "ops", title: "Operations", text: "Control, reporting and support behind the floor.",
    items: pick("Remote machine control", "Daily, weekly and archive game statistics", "Error logs and transaction reporting", "24/7/365 U.S.-based support") },
] as const;

function GroupArt({ kind }: { kind: string }) {
  // Decorative line illustrations; motion is CSS-only and stops under reduced motion.
  if (kind === "play") return <svg viewBox="0 0 200 120" className="cab-art" aria-hidden="true"><rect x="62" y="10" width="76" height="100" rx="8" /><circle className="cab-art__ripple" cx="100" cy="58" r="10" /><circle className="cab-art__ripple cab-art__ripple--late" cx="100" cy="58" r="10" /><circle cx="100" cy="58" r="3" className="cab-art__fill" /></svg>;
  if (kind === "pay") return <svg viewBox="0 0 200 120" className="cab-art" aria-hidden="true"><rect x="40" y="48" width="120" height="44" rx="8" /><line x1="62" y1="70" x2="138" y2="70" className="cab-art__slot" /><rect className="cab-art__ticket" x="78" y="16" width="44" height="30" rx="3" /></svg>;
  if (kind === "promo") return <svg viewBox="0 0 200 120" className="cab-art" aria-hidden="true"><circle cx="100" cy="60" r="44" /><circle cx="100" cy="60" r="32" className="cab-art__spin" /><path d="M100 40 L105 56 L121 56 L108 66 L113 82 L100 72 L87 82 L92 66 L79 56 L95 56 Z" className="cab-art__fill" /></svg>;
  return <svg viewBox="0 0 200 120" className="cab-art" aria-hidden="true"><circle cx="100" cy="60" r="10" className="cab-art__fill" />{[[40, 24], [160, 24], [40, 96], [160, 96]].map(([x, y]) => <g key={`${x}-${y}`}><line x1="100" y1="60" x2={x} y2={y} className="cab-art__link" /><circle cx={x} cy={y} r="7" /></g>)}</svg>;
}

export default function CabinetsPage() {
  return <main id="main" className="ds-page cab-page">
    <CabinetsHero />

    <section className="cab-band" aria-label="Shared console specifications">
      <p className="sr-only">Both consoles: {shared.join(", ")}.</p>
      {[0, 1].map((row) => <div key={row} className={`cab-band__row cab-band__row--${row}`} aria-hidden="true">
        <div className="cab-band__track">
          {[0, 1].map((copy) => <div key={copy} className="cab-band__set">
            {(row === 0 ? [altitude, pinnacle] : [pinnacle, altitude]).map((item) => <span key={item.name} className="cab-band__group">
              <span className="cab-band__name"><img src={item.image} alt="" loading="lazy" />{item.name}</span>
              <span className="cab-band__spec">{item.specifications[0]}</span>
              {shared.map((spec) => <span key={spec} className="cab-band__spec cab-band__spec--muted">{spec}</span>)}
            </span>)}
          </div>)}
        </div>
      </div>)}
    </section>

    <CabinetTour />

    <section className="ds-section ds-container" id="cabinet-compare">
      <SectionHeader icon={Columns2} label="Side by side" title="Same core. Two forms." blurb="Both consoles share the published core. The screen sets them apart." />
      <Reveal className="cab-compare">
        {[altitude, pinnacle].map((item, index) => <article key={item.name} className={`cab-compare__col cab-compare__col--${item.name.toLowerCase()}`}>
          <div className="cab-compare__art"><img src={item.image} alt={`${item.name} cabinet`} loading="lazy" /></div>
          <span className="ds-card__label">{String(index + 1).padStart(2, "0")} / {item.label}</span>
          <h3>{item.name}</h3>
          <p className="cab-compare__key"><span>Sets it apart</span>{item.specifications[0]}</p>
          <div className="ds-actions"><Button href={`#${item.name.toLowerCase()}-3d`} variant="ghost">Tour in 3D</Button><Button href="/contact-sales">Discuss {item.name}</Button></div>
        </article>)}
        <div className="cab-compare__shared">
          <span className="ds-card__label">Shared by both</span>
          <ul>{shared.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </Reveal>
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
      <div className="cab-groups">
        {groups.map((group, index) => <Reveal key={group.id} className={`cab-group cab-group--${group.id}`}>
          <GroupArt kind={group.id} />
          <span className="ds-card__label">{String(index + 1).padStart(2, "0")} / {group.items.length} listed</span>
          <h3>{group.title}</h3>
          <p>{group.text}</p>
          <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </Reveal>)}
      </div>
      <Note>{legacyNotice}</Note>
    </section>
  </main>;
}
