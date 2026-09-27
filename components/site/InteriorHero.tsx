import Image from "next/image";

export default function InteriorHero({ eyebrow, title, intro, image, imageAlt }: { eyebrow: string; title: string; intro: string; image?: string; imageAlt?: string }) {
  return (
    <section className={`interior-hero ${image ? "has-image" : ""}`}>
      {image ? <Image src={image} alt={imageAlt ?? ""} fill priority sizes="100vw" /> : null}
      <div className="interior-shade" />
      <div className="interior-hero-copy"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div>
      <span className="interior-index" aria-hidden="true">TIERPLAY / SYSTEM</span>
    </section>
  );
}
