import type { Metadata } from "next";
import InteriorHero from "@/components/site/InteriorHero";
import ContactBand from "@/components/site/ContactBand";
import Reveal from "@/components/site/Reveal";
export const metadata: Metadata = { title: "Player Journey" };
const stages = [{n:"01",t:"Link jackpots",d:"Explore the benefits-led linked-jackpot journey preserved from the existing site."},{n:"02",t:"Standard progressive jackpots",d:"A separate progressive-jackpot path within the recovered player journey."},{n:"03",t:"Loyalty system",d:"Loyalty completes the existing journey architecture and its return loop."}];
export default function JourneyPage() { return <main id="main"><InteriorHero eyebrow="Player journey" title="Every moment connected." intro="A focused presentation of the existing journey across linked jackpots, progressive jackpots and loyalty." image="/media/generated/theme-v3/entrance-editorial-v5.webp" imageAlt="Tierplay illuminated architectural entrance" /><section className="journey-page section-pad"><div className="catalog-intro"><p className="kicker">Journey architecture</p><h2>Three connected layers.</h2></div>{stages.map((stage)=><Reveal className="journey-row" key={stage.n}><span>{stage.n}</span><h3>{stage.t}</h3><p>{stage.d}</p></Reveal>)}</section><ContactBand /></main>; }
