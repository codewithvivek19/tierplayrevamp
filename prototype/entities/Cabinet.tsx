import { useEffect, useMemo, type Dispatch, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Object3D, SRGBColorSpace, Texture } from "three";
import { createCabinetScreenMaterial } from "../shaders/CabinetScreenMaterial";
import type { SceneRuntime } from "../directors/TransitionDirector";
import type { SceneEvent } from "../state/SceneDirector";
export function Cabinet({ model, texture, runtime, dispatch }: { model: Object3D; texture: Texture; runtime: MutableRefObject<SceneRuntime>; dispatch: Dispatch<SceneEvent> }) {
  const display = model.getObjectByName("ScreenDisplay") as Mesh;
  const material = useMemo(() => { texture.colorSpace = SRGBColorSpace; return createCabinetScreenMaterial(texture); }, [texture]);
  useEffect(() => {
    const original = display.material;
    display.material = material;
    return () => { display.material = original; material.dispose(); };
  }, [display, material]);
  useFrame(() => {
    material.uniforms.uFocus.value = runtime.current.focus;
    material.uniforms.uApproach.value = runtime.current.approach;
    material.uniforms.uCrossing.value = runtime.current.crossing;
  });
  return <primitive object={model} dispose={null} onPointerOver={(e: { stopPropagation: () => void }) => { e.stopPropagation(); dispatch({ type: "FOCUS" }); }} onClick={(e: { stopPropagation: () => void }) => { e.stopPropagation(); dispatch({ type: "FOCUS" }); }} />;
}
