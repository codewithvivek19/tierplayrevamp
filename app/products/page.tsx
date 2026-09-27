import type { Metadata } from "next";
import Image from "next/image";
import InteriorHero from "@/components/site/InteriorHero";
import ContactBand from "@/components/site/ContactBand";
import Reveal from "@/components/site/Reveal";
import { products } from "@/content/site";
export const metadata: Metadata = { title: "Products" };
export default function ProductsPage() {
  return <main id="main"><InteriorHero eyebrow="Tierplay products" title="Technology behind the experience." intro="The preserved Tierplay product architecture spans collection management and linked jackpots." image="/media/generated/theme-v3/gaming-floor-editorial-v5.webp" imageAlt="Connected Tierplay gaming floor" />
    <section className="product-list section-pad"><div className="catalog-intro"><p className="kicker">Connected systems</p><h2>Business-oriented products.</h2></div>{products.map((product, index) => <Reveal className="product-row" key={product.code}><span>0{index + 1}</span><b>{product.code}</b><h3>{product.name}</h3><p>{product.copy}</p><div className="product-row-art" aria-hidden="true"><Image src={`/media/generated/theme-v3/${index === 0 ? "tcm-system" : "tlj-system"}-v4.webp`} alt="" fill sizes="(max-width: 760px) 160px, 180px"/><div className="product-signal"><i /><i /><i /></div></div></Reveal>)}<aside className="verification-note"><b>Product information</b><p>Technical specifications and feature availability remain subject to Tierplay confirmation before publication.</p></aside></section><ContactBand /></main>;
}
