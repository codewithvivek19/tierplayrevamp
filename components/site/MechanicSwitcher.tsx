"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";
import { gameMechanics, gameplay } from "@/content/site";

const mechanics = gameMechanics.map((item) => item.title);

/** Two-axis browser over the recovered gameplay artwork: choose a mechanic, then a game. */
export default function MechanicSwitcher() {
  const id = useId();
  const [mechanic, setMechanic] = useState(0);
  const [game, setGame] = useState(0);
  const current = gameplay[game];
  const shot = current.shots.find((item) => item.mechanic === mechanics[mechanic]) ?? current.shots[0];

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (mechanic + (event.key === "ArrowRight" ? 1 : mechanics.length - 1)) % mechanics.length;
    setMechanic(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return <div className="mechanic-switcher">
    <div className="mechanic-switcher-tabs" role="tablist" aria-label="Game mechanics">
      {mechanics.map((title, index) => <button key={title} id={`${id}-tab-${index}`} role="tab" type="button" aria-selected={index === mechanic} aria-controls={`${id}-panel`} tabIndex={index === mechanic ? 0 : -1} onKeyDown={onKey} onClick={() => setMechanic(index)}>
        <span>0{index + 1}</span>{title}
      </button>)}
    </div>
    <div className="mechanic-switcher-body" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mechanic}`}>
      <div className="mechanic-switcher-stage">
        {current.shots.map((candidate) => {
          const visible = candidate.mechanic === shot.mechanic;
          return <div key={candidate.image} className="mechanic-switcher-shot" data-active={visible} aria-hidden={!visible}>
            <Image src={candidate.image} alt={visible ? `${current.title}: ${candidate.mechanic.toLowerCase()} on a Tierplay cabinet` : ""} fill sizes="(max-width: 860px) 100vw, 46vw" />
          </div>;
        })}
        <div className="mechanic-switcher-caption"><span className="tp-label">{current.title}</span><b>{shot.mechanic}</b></div>
      </div>
      <div className="mechanic-switcher-side">
        <p className="mechanic-switcher-copy">{gameMechanics[mechanic].copy}</p>
        <div className="mechanic-switcher-games" role="group" aria-label="Choose a game">
          {gameplay.map((item, index) => <button key={item.title} type="button" aria-pressed={index === game} onClick={() => setGame(index)}>
            <Image src={item.logo} alt={item.title} width={220} height={110} />
          </button>)}
        </div>
      </div>
    </div>
  </div>;
}
