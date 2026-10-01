import Image from "next/image";
import { Boxes, Gamepad2, Layers, Route, Sparkles } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import BattleHero from "@/components/site/BattleHero";
import CabinetShowroom from "@/components/cabinet3d/CabinetShowroom";
import GameReel from "@/components/site/GameReel";
import SystemsSwitcher from "@/components/site/SystemsSwitcher";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Button, GlassCard, Label, Marquee, Note, SectionHeader } from "@/components/ds/primitives";
import { Steps } from "@/components/ds/interactive";
import { gameplay, games, journey } from "@/content/site";


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

    <CabinetShowroom />

    <section className="ds-home-games" id="games">
      <GameReel games={games}
        aside={<>
          <Label icon={Gamepad2}>Selected games</Label>
          <h2 className="lineup__title">The Sunscape lineup.</h2>
          <p className="lineup__blurb">Six boards, fifteen named games. Each game features free spins, nudges, bonus rounds and jackpots.</p>
          <Button href="/games-collection" variant="ghost">View all boards</Button>
        </>}
        footer={<div className="lineup__note"><Note tone="market">not available for Georgia market</Note></div>} />
    </section>

    <section className="ds-section ds-container" id="systems">
      <SectionHeader icon={Boxes} label="Connected products" title="Behind every play." blurb="Collection management and linked jackpots support different parts of the floor." />
      <SystemsSwitcher />
    </section>

    <section className="ds-section ds-container" id="journey">
      <SectionHeader icon={Route} label="Player journey" title="Play. Connect. Return." blurb={<>Three ways the floor keeps players connected. <a className="ds-inline-link" href="/player-journey">Follow the journey</a></>} />
      <Steps items={journey.map((stage) => ({ title: stage.title, text: stage.copy, media: <Image src={stage.image} alt="" fill sizes="(max-width: 960px) 100vw, 33vw" /> }))} />
    </section>
  </main>;
}
