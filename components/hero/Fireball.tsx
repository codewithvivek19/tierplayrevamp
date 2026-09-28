"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { CylinderGeometry, DoubleSide, Group, MathUtils, Mesh, RepeatWrapping, ShaderMaterial } from "three";
import { fireballVertex, fireballFragment, flameVertex, flameFragment } from "./fireballShaders";
import type { PortalState } from "./portalState";

export default function Fireball({ sequence, impulse, compact }: { sequence: PortalState; impulse: React.RefObject<number>; compact: boolean }) {
  const source = useTexture(["/media/effects/originkit/perlin.jpg", "/media/effects/originkit/spark.jpg", "/media/effects/originkit/water.jpg"]);
  // Own sampler configuration; never mutate or dispose the loader's shared cache.
  const textures = useMemo(() => source.map(t => { const clone = t.clone(); clone.wrapS = clone.wrapT = RepeatWrapping; clone.needsUpdate = true; return clone; }), [source]);
  useEffect(() => () => textures.forEach(t => t.dispose()), [textures]);
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const core = useRef<Mesh>(null), flame = useRef<Group>(null), steam = useRef<Group>(null);
  const cone = useMemo(() => new CylinderGeometry(1, 0, 5.3, compact ? 32 : 50, compact ? 32 : 50, true), [compact]);
  useEffect(() => () => cone.dispose(), [cone]);
  const uniforms = useMemo(() => [0,1,2].map(i => ({
    uTime: {value:0}, uMorph: {value:0}, uImpulse: {value:0}, uLayer:{value:i === 2 ? 1 : 0}, uTail:{value:0},
    uPerlin:{value:textures[i === 2 ? 2 : 0]}, uSpark:{value:textures[1]},
  })), [textures]);
  useFrame(() => {
    const morph = MathUtils.smootherstep(sequence.progress,.38,.84);
    // Match PortalEnergy's departure window. Progress owns the reveal so it
    // reverses cleanly and does not flicker when the visitor stops scrolling.
    const tail = MathUtils.smootherstep(sequence.progress,.32,.48);
    // Fiber 9.8 merges uniform descriptors into material-owned objects.
    // Animate those live uniforms, not the original JSX input descriptors.
    for(const material of materials.current)if(material){
      material.uniforms.uTime.value=sequence.time;
      material.uniforms.uMorph.value=morph;
      material.uniforms.uImpulse.value=impulse.current;
      material.uniforms.uTail.value=tail;
    }
    if(core.current)core.current.scale.set(MathUtils.lerp(1.68,.36,morph),MathUtils.lerp(1.68,.36,morph),MathUtils.lerp(1.68,.36,morph));
    if(flame.current){flame.current.visible=tail>.0001;flame.current.position.y=MathUtils.lerp(.22,-.3,morph);flame.current.scale.set(MathUtils.lerp(1.3,.66,morph),MathUtils.lerp(1.,MathUtils.lerp(5.9,13.7,morph),tail),MathUtils.lerp(1.3,.66,morph));}
    if(steam.current){steam.current.visible=tail>.0001;steam.current.position.y=MathUtils.lerp(.12,-.6,morph);steam.current.scale.set(MathUtils.lerp(1.58,1.22,morph),MathUtils.lerp(1.,MathUtils.lerp(6.8,14.9,morph),tail),MathUtils.lerp(1.58,1.22,morph));}
  }, -.4);
  return <>
    <mesh ref={core} name="fireball-core" userData={{ fireballBloom: true }}><sphereGeometry args={[1,compact ? 48 : 96,compact ? 32 : 64]}/>
      <shaderMaterial toneMapped={false} ref={m=>{materials.current[0]=m;}} uniforms={uniforms[0]} vertexShader={fireballVertex} fragmentShader={fireballFragment}/>
    </mesh>
    <group ref={flame} visible={false}><mesh name="fireball-flame" userData={{ fireballBloom: true }}><primitive object={cone} attach="geometry" dispose={null}/>
      <shaderMaterial toneMapped={false} ref={m=>{materials.current[1]=m;}} uniforms={uniforms[1]} vertexShader={flameVertex} fragmentShader={flameFragment} transparent side={DoubleSide} depthWrite={false}/>
    </mesh></group>
    <group ref={steam} visible={false}><mesh name="fireball-steam" userData={{ fireballBloom: true }}><primitive object={cone} attach="geometry" dispose={null}/>
      <shaderMaterial toneMapped={false} ref={m=>{materials.current[2]=m;}} uniforms={uniforms[2]} vertexShader={flameVertex} fragmentShader={flameFragment} transparent side={DoubleSide} depthWrite={false}/>
    </mesh></group>
  </>;
}
