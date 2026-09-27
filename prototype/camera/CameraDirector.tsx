import { useMemo } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import type { makeCameraPaths } from "./CameraPath";
import type { SceneRuntime } from "../directors/TransitionDirector";
/** The sole camera writer. No raw scroll values enter this component. */
export function CameraDirector({ paths, runtime }: { paths: ReturnType<typeof makeCameraPaths>; runtime: MutableRefObject<SceneRuntime> }) {
  const scratch = useMemo(() => ({ position: new Vector3(), target: new Vector3(), forward: new Vector3() }), []);
  useFrame(({ camera }) => {
    const r = runtime.current;
    paths.entrance.getPointAt(r.entrance, scratch.position);
    scratch.position.lerp(paths.focus, r.focus).lerp(paths.near, r.approach).lerp(paths.inside, r.crossing);
    scratch.target.copy(paths.entryTarget).lerp(paths.floorTarget, r.entrance).lerp(paths.focusTarget, r.focus).lerp(paths.screen, r.approach);
    // Keep looking through the display after crossing, rather than flipping back toward it.
    if (r.crossing > 0) scratch.target.copy(paths.inside).add(scratch.forward.copy(paths.inside).sub(paths.near).normalize());
    camera.position.copy(scratch.position);
    camera.lookAt(scratch.target);
    if (camera instanceof PerspectiveCamera) {
      const fov = MathUtils.lerp(42, 37, r.approach);
      if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    }
  });
  return null;
}
