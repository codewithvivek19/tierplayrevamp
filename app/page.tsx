import Image from "next/image";
import { Boxes, Gamepad2, Layers, Monitor, Route, Sparkles } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import BattleHero from "@/components/site/BattleHero";
import FloatingAltitude from "@/components/cabinet3d/FloatingAltitude";
import GameReel from "@/components/site/GameReel";
import LinkJackpotNetwork from "@/components/site/LinkJackpotNetwork";
import TiltedCard from "@/components/reactbits/TiltedCard";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Button, CheckList, GlassCard, Label, Marquee, Note, SectionHeader } from "@/components/ds/primitives";
import { Steps, Tabs } from "@/components/ds/interactive";
import { cabinets, gameplay, games, journey, products } from "@/content/site";

const [altitude, pinnacle] = cabinets;

const pillars = [
  { title: "Sunscape games", text: "Six boards and fifteen named games, each with its own world.", href: "/games", image: "/media/generated/theme-v3/gaming-floor-editorial-v5.webp", tone: "violet" as const, label: "01 / Games" },
  { title: "Altitude and Pinnacle", text: "Two cabinet forms with 43-inch touchscreens and 4K displays.", href: "/cabinets", image: "/media/generated/theme-v3/cabinet-lineup-v3.webp", tone: "amber" as const, label: "02 / Cabinets" },
  { title: "Connected systems", text: "Collection management and linked jackpots behind the floor.", href: "/products", image: "/media/generated/tierplay-floor-network-v1.webp", tone: "violet" as const, label: "03 / Systems" },
];

export default function Home() {
  return <main id="main" className="battle-home ds-home">
    <BattleHero />

    <section className="ds-section ds-container ds-home-intro" id="experience">
      <Label icon={Sparkles}>The Tierplay system</Label>
      <ScrollReveal as="h2" className="ds-statement">Explore the games players see, the cabinets they play, and the connected systems behind them.</ScrollReveal>
      <Marquee label="Sunscape games" items={gameplay.map((game) => <Image key={game.title} src={game.logo} alt={game.title} width={220} height={110} />)} />
    </section>

    <section className="ds-section ds-container">
      <SectionHeader icon={Layers} label="What sets Tierplay apart" title="One floor, many worlds." blurb="Games, hardware and connected systems, designed to work together." />
      <div className="ds-bento">
        {pillars.map((item, i) => <Reveal key={item.title} className={`ds-bento__cell ds-bento__cell--${i}`}>
          <GlassCard href={item.href} title={item.title} text={item.text} label={item.label} tone={item.tone} media={<Image src={item.image} alt="" fill sizes="(max-width: 960px) 100vw, 50vw" />} />
        </Reveal>)}
      </div>
    </section>

    <section className="ds-section ds-container" id="cabinets">
      <SectionHeader icon={Monitor} label="The hardware" title="Altitude. Pinnacle." blurb="Turn the Altitude in 3D, then meet the curved-screen Pinnacle." />
      <div className="ds-home-hardware">
        <div className="ds-home-hardware__altitude">
          <FloatingAltitude fallback={altitude.image} />
          <div className="ds-home-hardware__copy">
            <span className="ds-card__label">01 / {altitude.label}</span>
            <h3>{altitude.name}</h3>
            <p>{altitude.copy}</p>
            <Button href="/cabinets" variant="ghost">Tour the Altitude</Button>
          </div>
        </div>
        <Reveal className="ds-home-hardware__pinnacle">
          <TiltedCard>
            <Image src="/media/generated/theme-v3/cabinet-stage-pinnacle-v5.webp" alt="" fill sizes="(max-width: 960px) 100vw, 36vw" className="v2-pinnacle-stage" />
            <Image src={pinnacle.image} alt={`${pinnacle.name} cabinet`} fill sizes="(max-width: 960px) 100vw, 36vw" className="v2-pinnacle-product" />
          </TiltedCard>
          <div className="ds-home-hardware__copy">
            <span className="ds-card__label">02 / {pinnacle.label}</span>
            <h3>{pinnacle.name}</h3>
            <p>{pinnacle.copy}</p>
            <Button href="/cabinets#cabinet-compare" variant="ghost">Compare cabinets</Button>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="ds-section ds-home-games" id="games">
      <GameReel games={games}
        header={<div key="reel-header" className="ds-container"><SectionHeader icon={Gamepad2} label="Selected games" title="The Sunscape lineup." blurb={<>Six boards, fifteen named games. <a className="ds-inline-link" href="/games-collection">View all boards</a></>} /></div>}
        footer={<div key="reel-footer" className="ds-container"><Note tone="market">not available for Georgia market</Note></div>} />
    </section>

    <section className="ds-section ds-container" id="systems">
      <SectionHeader icon={Boxes} label="Connected products" title="Behind every play." blurb="Collection management and linked jackpots support different parts of the floor." />
      <Tabs label="Tierplay systems" items={products.map((product, i) => ({
        id: product.code,
        label: product.code === "TCM" ? "Collection management" : "Link Jackpot",
        content: <div className="ds-panel">
          <div>
            <span className="ds-card__label">0{i + 1} / {product.code}</span>
            <h3>{product.name}</h3>
            <p className="ds-panel__text">{product.copy}</p>
            <CheckList items={product.features} />
            <div className="ds-actions" style={{ marginTop: "var(--s-5)" }}><Button href="/products" variant="ghost">Explore products</Button></div>
          </div>
          <div className="ds-panel__media">{product.code === "TLJ" ? <div className="ds-panel__svg"><LinkJackpotNetwork /></div> : <Image src={product.image} alt="" fill sizes="(max-width: 960px) 100vw, 50vw" />}</div>
        </div>,
      }))} />
    </section>

    <section className="ds-section ds-container" id="journey">
      <SectionHeader icon={Route} label="Player journey" title="Play. Connect. Return." blurb={<>Three ways the floor keeps players connected. <a className="ds-inline-link" href="/player-journey">Follow the journey</a></>} />
      <Steps items={journey.map((stage) => ({ title: stage.title, text: stage.copy, media: <Image src={stage.image} alt="" fill sizes="(max-width: 960px) 100vw, 33vw" /> }))} />
    </section>
  </main>;
}
