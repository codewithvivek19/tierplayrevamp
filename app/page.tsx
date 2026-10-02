import Image from "next/image";
import { Boxes, Gamepad2, Layers, Route, Sparkles } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import BattleHero from "@/components/site/BattleHero";
import CabinetShowroom from "@/components/cabinet3d/CabinetShowroom";
import GameReel from "@/components/site/GameReel";
import SystemsShowcase from "@/components/site/SystemsShowcase";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Button, GlassCard, Label, Marquee, Note, SectionHeader } from "@/components/ds/primitives";
import { Steps } from "@/components/ds/interactive";
import { gameplay, games, journey } from "@/content/site";
import { campaignMedia } from "@/content/media";
import CinematicText from "@/components/motion/CinematicText";


const pillars = [
  { title: "Sunscape games", text: "Six boards and fifteen named games, each with its own world.", href: "/games", media: campaignMedia.sunscape, tone: "violet" as const, label: "01 / Games" },
  { title: "Altitude and Pinnacle", text: "Two cabinet forms with 43-inch touchscreens and 4K displays.", href: "/cabinets", media: campaignMedia.cabinets, tone: "amber" as const, label: "02 / Cabinets" },
  { title: "Connected systems", text: "Collection management and linked jackpots behind the floor.", href: "/products", media: campaignMedia.management, tone: "violet" as const, label: "03 / Systems" },
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
      <div className="ds-bento ds-bento--posters">
        {pillars.map((item, i) => <Reveal key={item.title} className={`ds-bento__cell ds-bento__cell--${i}`}>
          <GlassCard className="ds-card--poster" href={item.href} title={item.title} text={item.text} label={item.label} tone={item.tone} media={<Image src={item.media.src} alt={item.media.alt} fill sizes="(max-width: 960px) 100vw, 33vw" />} />
        </Reveal>)}
      </div>
    </section>

    <CabinetShowroom />

    <section className="ds-home-games" id="games">
      <GameReel games={games}
        aside={<>
          <Label icon={Gamepad2}>Selected games</Label>
          <CinematicText className="lineup__title">The Sunscape lineup.</CinematicText>
          <p className="lineup__blurb">Six boards, fifteen named games. Each game features free spins, nudges, bonus rounds and jackpots.</p>
          <Button href="/games-collection" variant="ghost">View all boards</Button>
        </>}
        footer={<div className="lineup__note"><Note tone="market">not available for Georgia market</Note></div>} />
    </section>

    <section className="ds-section ds-container" id="systems">
      <SectionHeader icon={Boxes} label="Connected products" title="Behind every play." blurb="Operator control, linked and progressive jackpots, and loyalty: the systems that keep a floor connected." />
      <SystemsShowcase />
    </section>

    <section className="ds-section ds-container" id="journey">
      <SectionHeader icon={Route} label="Player journey" title="Play. Connect. Return." blurb={<>Three ways the floor keeps players connected. <a className="ds-inline-link" href="/player-journey">Follow the journey</a></>} />
      <Steps items={journey.map((stage) => ({ title: stage.title, text: stage.copy, media: <Image className="campaign-poster" src={stage.image} alt={stage.imageAlt} fill sizes="(max-width: 960px) 100vw, 33vw" /> }))} />
    </section>
  </main>;
}
