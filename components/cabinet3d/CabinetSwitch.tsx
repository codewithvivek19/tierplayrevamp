"use client";

import type { CabinetId } from "./cabinetModels";

const options: { id: CabinetId; name: string; label: string; thumb: string }[] = [
  { id: "altitude", name: "Altitude", label: "Vertical", thumb: "/media/generated/theme-v3/altitude-cutout-v3.png" },
  { id: "pinnacle", name: "Pinnacle", label: "Curved", thumb: "/media/generated/theme-v3/pinnacle-cutout-v3.png" },
];

/** Segmented control that swaps the cabinet on the stage. */
export default function CabinetSwitch({ value, onChange, className = "", large = false }: { value: CabinetId; onChange: (id: CabinetId) => void; className?: string; large?: boolean }) {
  return <div className={`cabinet-switch ${large ? "cabinet-switch--large" : ""} ${className}`} role="group" aria-label="Choose a cabinet" data-value={value}>
    <i className="cabinet-switch__thumb" aria-hidden="true" />
    {options.map((option, index) => <button key={option.id} type="button" aria-pressed={value === option.id} onClick={() => onChange(option.id)}>
      {large ? <img src={option.thumb} alt="" aria-hidden="true" /> : null}
      <span><b>{option.name}</b><small>{large ? `0${index + 1} · ` : ""}{option.label}</small></span>
    </button>)}
  </div>;
}
