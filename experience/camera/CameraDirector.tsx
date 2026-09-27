import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Sequence } from "@/systems/ExperienceState";
export function CameraDirector({ sequence }: { sequence: Sequence }) {
  useFrame(({ camera }, delta) => {
    camera.position.x = MathUtils.damp(
      camera.position.x,
      sequence.pointerX * 0.035,
      4,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      sequence.pointerY * 0.025,
      4,
      delta,
    );
    camera.lookAt(0, 0, 0);
  });
  return null;
}
