"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Group, MathUtils, ShaderMaterial } from "three";
import { beamFragment, glowFragment, portalFragment, vertex } from "./portalShaders";
import type { PortalState } from "./portalState";

// Restore the original energy composition; mutate the mounted materials, not a props snapshot.
export default function PortalEnergy({ sequence }: { sequence: PortalState }) {
  const root = useRef<Group>(null);
  const disc = useRef<ShaderMaterial>(null);
  const beam = useRef<ShaderMaterial>(null);
  const orbit = useRef<Group>(null);
  const orbitMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 } }), []);
  const halo = useMemo(() => ({ uColor: { value: new Color("#7d36ea") } }), []);
  useFrame(() => {
    const p = sequence.progress;
    if (root.current) {
      root.current.visible = p < .78;
      root.current.scale.setScalar(1 - MathUtils.smoothstep(p, .48, .78) * .98);
    }
    for (const material of [disc.current, beam.current, ...orbitMaterials.current]) {
      if (!material) continue;
      material.uniforms.uTime.value = sequence.time;
      if (material.uniforms.uProgress) material.uniforms.uProgress.value = p;
    }
    if (orbit.current) {
      orbit.current.rotation.y = p * .7 + Math.sin(sequence.time * .12) * .08;
      orbit.current.rotation.z = -.24 + p * .16;
    }
  });
  return <group ref={root}>
    <mesh position={[0, 0, -.7]} scale={[12, 13, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={glowFragment} uniforms={halo} transparent blending={AdditiveBlending} depthWrite={false}/></mesh>
    <mesh scale={[6.8, 7.8, 1]} rotation={[0, 0, -.18]} position={[0, 0, -.12]}><planeGeometry/><shaderMaterial ref={disc} vertexShader={vertex} fragmentShader={portalFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>
    <mesh scale={[7, 23, 1]} position={[0, 5, -.4]}><planeGeometry/><shaderMaterial ref={beam} vertexShader={vertex} fragmentShader={beamFragment} uniforms={uniforms} transparent blending={AdditiveBlending} depthWrite={false}/></mesh>
    <group ref={orbit}>{[0, 1, 2].map(i => <group key={i} rotation={[1.08 + i * .29, .12 - i * .1, i * .32]}>
      <mesh><torusGeometry args={[4.7 + i * .7, .009, 4, 180]}/><shaderMaterial ref={m => { orbitMaterials.current[i] = m; }} vertexShader={vertex} fragmentShader={`varying vec2 vUv; uniform float uTime; void main(){float head=pow(fract(vUv.x-uTime*.045),18.);gl_FragColor=vec4(mix(vec3(.32,.2,.6),vec3(1.8,.9,1.6),head),.22+head*.7);}`} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}/></mesh>
    </group>)}</group>
    <pointLight color="#aa70ed" intensity={38} distance={14} position={[0, 0, 1.5]}/>
    <pointLight color="#bbc4ff" intensity={25} distance={11} position={[0, 2, -1]}/>
  </group>;
}
