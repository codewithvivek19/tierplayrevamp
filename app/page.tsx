import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import MediaSlot from "@/components/site/MediaSlot";
import BattleHero from "@/components/site/BattleHero";
import CabinetArtifact from "@/components/site/CabinetArtifact";
import GameCard from "@/components/site/GameCard";
import ChromaGrid from "@/components/ui/ChromaGrid";
import { KineticHeading, SignalLoop, SpotlightPanel } from "@/components/site/InteractivePrimitives";
import { cabinets, games, products } from "@/content/site";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return <main id="main" className="battle-home">
    <BattleHero />
    <SignalLoop label="Tierplay ecosystem" items={["Games", "Cabinets", "Collection management", "Link Jackpot", "Player journey", "24/7 support"]} />
    <section className="battle-section battle-container home-about">
      <Reveal className="home-about-copy"><p className="kicker">About us</p><KineticHeading>Games, cabinets and connected systems.</KineticHeading><p>Tierplay brings together Sunscape game boards, Altitude and Pinnacle cabinets, collection management and linked jackpots. Explore the range by product or follow the player journey.</p><Link className="battle-button" href="/products">Explore the technology <Arrow /></Link></Reveal>
      <Reveal className="home-about-art"><SpotlightPanel><div className="home-about-image large"><Image src="/media/legacy/Home-about-big-image.webp" alt="Tierplay legacy gaming artwork" fill sizes="(max-width: 760px) 90vw, 44vw" /></div><div className="home-about-image small"><Image src="/media/legacy/Home-About-Small-Image.webp" alt="" fill sizes="180px" /></div><span>Public archive / 2024</span></SpotlightPanel></Reveal>
    </section>
    <section className="battle-section battle-container experience-overview" id="experience">
      <Reveal className="battle-heading split">
        <div><p className="kicker">The Tierplay experience</p><h2>Explore the<br />Tierplay range.</h2></div>
        <Link className="battle-button" href="/cabinets">Explore our cabinets <Arrow /></Link>
      </Reveal>
      <div className="experience-triptych">
        {[
          { image: "/media/generated/theme-v3/entrance-editorial-v5.webp", title: "Step inside.", label: "The entrance", href: "/player-journey" },
          { image: "/media/generated/theme-v3/gaming-floor-editorial-v5.webp", title: "Find your world.", label: "The gaming floor", href: "/games" },
          { image: "/media/generated/theme-v3/cabinet-lineup-v3.webp", title: "Meet the system.", label: "The cabinets", href: "/cabinets" },
        ].map((item) => <Reveal className="experience-tile" key={item.title}><Link href={item.href}><Image src={item.image} alt={item.label} fill sizes="(max-width: 650px) calc(100vw - 40px), (max-width: 900px) 31vw, 400px"/><div className="tile-shade"/><div className="tile-caption"><span>{item.label}</span><h3>{item.title}</h3><b aria-hidden="true">↗</b></div></Link></Reveal>)}
      </div>
    </section>
    <section className="battle-section battle-container" id="cabinets">
      <Reveal className="battle-heading centered"><p className="kicker">Cabinet collection</p><h2>Altitude & Pinnacle.</h2><p>Compare the two cabinets and explore their individual specifications.</p></Reveal>
      <div className="cabinet-timeline">
        <div className="cabinet-film"><Image src="/media/generated/theme-v3/gaming-floor-editorial-v5.webp" alt="Tierplay gaming floor concept" fill sizes="(max-width: 900px) 90vw, 45vw"/><MediaSlot kind="VIDEO" label="Inside the gaming floor" detail="Film preview coming soon"/></div>
        <div className="cabinet-timeline-cards">{cabinets.map((cabinet, index) => <Reveal className="timeline-item" key={cabinet.name}>
          <span className="timeline-dot" aria-hidden="true"/>
          <article className="cabinet-reference-card textured-panel">
            <div className="cabinet-reference-art"><CabinetArtifact name={cabinet.name} image={cabinet.image} stage={`/media/generated/theme-v3/cabinet-stage-${index === 0 ? "altitude" : "pinnacle"}-v5.webp`} sizes="(max-width: 900px) 70vw, 30vw" /></div>
            <div className="card-ribbon">{cabinet.name} <span>{cabinet.label}</span></div>
            <div className="reference-card-body"><h3>{index === 0 ? "A new perspective on play." : "A different curve. A distinct presence."}</h3><p>{cabinet.copy}</p><Link className="text-action" href="/cabinets">Discover {cabinet.name} <Arrow /></Link></div>
          </article>
        </Reveal>)}</div>
      </div>
    </section>
    <section className="battle-section battle-container" id="systems">
      <Reveal className="battle-heading split"><div><p className="kicker">Connected products</p><h2>The technology<br />behind the floor.</h2></div><p>Explore collection management and linked jackpots within the Tierplay ecosystem.</p></Reveal>
      <ChromaGrid className="battle-system-grid">{products.map((product,index) => <Reveal key={product.code} className="battle-system-card"><div className="system-visual" aria-hidden="true"><Image src={`/media/generated/theme-v3/${index === 0 ? "tcm-system" : "tlj-system"}-v4.webp`} alt="" fill sizes="(max-width: 650px) 180px, 22vw"/></div><div className="system-card-content"><p className="kicker">{product.code}</p><h3>{product.name}</h3><p>{product.copy}</p><Link className="text-action" href="/products">Explore {product.name} <Arrow /></Link></div></Reveal>)}</ChromaGrid>
    </section>
    <section className="battle-container world-banner"><Image src="/media/generated/theme-v3/dragon-world-v3.webp" alt="Rise of the Dragon world" fill sizes="90vw"/><div className="world-banner-shade"/><Reveal className="world-banner-copy"><p className="kicker">Sunscape games</p><h2>Find your next game.</h2><p>Browse the Sunscape boards<br/>and their game lineups.</p><Link className="battle-button" href="/games">Discover the collection <Arrow /></Link></Reveal></section>
    <section className="battle-section battle-container" id="games">
      <Reveal className="battle-heading centered"><p className="kicker">Sunscape collection</p><h2>Six worlds.<br/>One collection.</h2></Reveal>
      <ChromaGrid>{games.map(game => <Reveal key={game.slug}><GameCard game={game}/></Reveal>)}</ChromaGrid>
      <div className="section-action"><Link className="battle-button" href="/games">View all games <Arrow /></Link></div>
      <p className="market-note">not available for Georgia market</p>
    </section>
    <section className="battle-section battle-container" id="journey">
      <Reveal className="battle-heading split"><div><p className="kicker">Player journey</p><h2>From first play<br/>to the next return.</h2></div><Link className="battle-button" href="/player-journey">Explore the journey <Arrow /></Link></Reveal>
      <ChromaGrid className="battle-journey-grid">{[
        {title:"Link jackpots",copy:"Shared jackpots connect play across the floor.",image:"/media/generated/theme-v3/tlj-system-v4.webp"},
        {title:"Progressive jackpots",copy:"Progressive rewards build anticipation from game to game.",image:"/media/generated/theme-v3/rich-times-v3.webp"},
        {title:"Loyalty system",copy:"Offers and rewards give players a reason to return.",image:"/media/generated/theme-v3/entrance-editorial-v5.webp"},
      ].map((item,index)=><Reveal key={item.title}><Link href="/player-journey" className="battle-journey-card"><div className="journey-card-art"><Image src={item.image} alt="" fill sizes="(max-width: 650px) 90vw, 30vw"/></div><div className="journey-card-copy"><span className="journey-number">0{index+1}</span><h3>{item.title}</h3><p>{item.copy}</p><b>Explore the journey <Arrow /></b></div></Link></Reveal>)}</ChromaGrid>
    </section>
  </main>;
}
