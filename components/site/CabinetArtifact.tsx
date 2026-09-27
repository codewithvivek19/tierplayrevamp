"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { useRef } from "react";

type CabinetArtifactProps = {
  name: string;
  image: string;
  stage: string;
  sizes: string;
};

export default function CabinetArtifact({ name, image, stage, sizes }: CabinetArtifactProps) {
  const root = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = root.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    element.style.setProperty("--cab-rx", `${(0.5 - y) * 5}deg`);
    element.style.setProperty("--cab-ry", `${(x - 0.5) * 7}deg`);
    element.style.setProperty("--cab-x", `${(x - 0.5) * 12}px`);
    element.style.setProperty("--cab-y", `${(y - 0.5) * 8}px`);
    element.style.setProperty("--cab-px", `${x * 100}%`);
    element.style.setProperty("--cab-py", `${y * 100}%`);
  }

  function reset() {
    const element = root.current;
    if (!element) return;
    element.style.setProperty("--cab-rx", "0deg");
    element.style.setProperty("--cab-ry", "0deg");
    element.style.setProperty("--cab-x", "0px");
    element.style.setProperty("--cab-y", "0px");
    element.style.setProperty("--cab-px", "50%");
    element.style.setProperty("--cab-py", "42%");
  }

  return (
    <div ref={root} className="cabinet-artifact" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <div className="cabinet-artifact-scene">
        <Image className="cabinet-artifact-stage" src={stage} alt="" fill sizes={sizes} />
        <span className="cabinet-artifact-depth" aria-hidden="true" />
        <Image className="cabinet-artifact-product" src={image} alt={`${name} cabinet`} fill sizes={sizes} />
        <span className="cabinet-artifact-glint" aria-hidden="true" />
      </div>
    </div>
  );
}
