import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { DirectionalLight } from "three";
import type { SceneRuntime } from "./TransitionDirector";
export function LightingDirector({ runtime }: { runtime: MutableRefObject<SceneRuntime> }) {
  const key = useRef<DirectionalLight>(null);
  useFrame(() => { if (key.current) key.current.intensity = 2.2 - runtime.current.focus * 0.6; });
  return <><ambientLight intensity={0.35} /><directionalLight ref={key} position={[-3, 5, 4]} intensity={2.2} /><directionalLight position={[3, 3, -2]} intensity={1.1} /></>;
}
