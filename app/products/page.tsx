import type { Metadata } from "next";
import Image from "next/image";
import InteriorHero from "@/components/site/InteriorHero";
import ContactBand from "@/components/site/ContactBand";
import Reveal from "@/components/site/Reveal";
import { KineticHeading, SignalLoop, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { legacyNotice, productPillars, products } from "@/content/site";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <main id="main">
    <InteriorHero eyebrow="Tierplay products" title="The system behind the floor." intro="Collection management and linked jackpots connect operations, cabinets and the player experience." image="/media/legacy/Product-Banner.webp" imageAlt="Tierplay product network artwork" />
    <SignalLoop label="Tierplay systems" items={["Collection management", "Remote control", "Route management", "Link Jackpot", "Progressive rewards", "Loyalty"]} />
    <section className="content-section section-pad">
      <Reveal className="section-lede"><p className="kicker">Product architecture</p><KineticHeading>Connected by design.</KineticHeading><p>The public product story is organized around four layers, from jackpot experiences to operator tools and cabinet support.</p></Reveal>
      <div className="pillar-grid">{productPillars.map((pillar, index) => <Reveal key={pillar.title}><SpotlightPanel className="pillar-card"><span>0{index + 1}</span><h3>{pillar.title}</h3><p>{pillar.copy}</p></SpotlightPanel></Reveal>)}</div>
    </section>
    <section className="content-section section-pad product-deep-dive">
      {products.map((product, index) => <Reveal className="product-feature" key={product.code}>
        <div className="product-feature-art"><Image src={product.image} alt="" fill sizes="(max-width: 760px) 90vw, 48vw" /><span>{product.code}</span></div>
        <div className="product-feature-copy"><p className="kicker">Tierplay system / 0{index + 1}</p><KineticHeading>{product.name}</KineticHeading><p>{product.copy}</p><ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
      </Reveal>)}
      <p className="archive-note">{legacyNotice}</p>
    </section>
    <ContactBand />
  </main>;
}
