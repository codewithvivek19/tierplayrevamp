import { MathUtils } from "three";

// One composition shared by the energy group and the independently instanced
// stones, so resizing cannot split the portal into two different arrangements.
export function portalFraming(width: number, height: number) {
  const portrait = 1 - MathUtils.smoothstep(width / height, .85, 1.35);
  const shortPortrait = portrait * (1 - MathUtils.smoothstep(height, 600, 780));
  return {
    portrait,
    x: 3.9 * (1 - portrait),
    y: MathUtils.lerp(.8, 3.1, portrait) + shortPortrait * 1.25,
    scale: MathUtils.lerp(1, .72, portrait) - shortPortrait * .09,
  };
}
