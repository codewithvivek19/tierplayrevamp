"use client";
import { Suspense, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Group, MathUtils, ShaderMaterial, type PointLight } from "three";
import { vertex } from "./portalShaders";
import { landingFragment } from "./plasmaShaders";
import { portalFraming } from "./portalFraming";
import Fireball from "./Fireball";
import PointerRadiance from "./PointerRadiance";
import type { PortalState } from "./portalState";

export default function PortalEnergy({ sequence, software, shadows = false }: { sequence: PortalState; software: boolean; shadows?: boolean }) {
  const size = useThree(s => s.size);
  const framing = portalFraming(size.width, size.height);
  const volume = useRef<Group>(null);
  const landing = useRef<ShaderMaterial>(null);
  const light = useRef<PointLight>(null);
  const impulse = useRef(0);
  const previous = useRef(sequence.progress);
  const landingUniforms = useMemo(() => ({ uTime: {value:0}, uOpacity: {value:0} }), []);
  useFrame((_, delta) => {
    const p=sequence.progress;
    const travel=MathUtils.smootherstep(p,.32,.80);
    const stretch=MathUtils.smootherstep(p,.38,.84);
    if (!sequence.paused) {
      const speed=Math.min(1,Math.abs(p-previous.current)/Math.max(delta,.008)*3.5);
      impulse.current=MathUtils.damp(impulse.current,speed,5,Math.min(delta,.1));
    }
    previous.current=p;
    if (volume.current) {
      // The supplied fireball's tail progressively straightens into the pillar light.
      volume.current.position.set(framing.x*(1-travel),MathUtils.lerp(framing.y,-2.4,travel),MathUtils.lerp(-1.5,-16,travel));
      volume.current.scale.setScalar(MathUtils.lerp(framing.scale,1,stretch));
      volume.current.rotation.set(0,0,MathUtils.lerp(-.62,0,stretch));
      if (light.current) {
        light.current.position.copy(volume.current.position); light.current.position.y+=stretch*4; light.current.position.z+=1;
        light.current.intensity=(95+stretch*40+impulse.current*25)*MathUtils.lerp(.28,1,sequence.intro??1)*(1+Math.sin(sequence.time*9.1)*.03+Math.sin(sequence.time*23.7)*.02);
      }
    }
    if(landing.current){landing.current.uniforms.uTime.value=sequence.time;landing.current.uniforms.uOpacity.value=MathUtils.smootherstep(p,.60,.85)*.6;}
  }, -.5);
  return <>
    <group ref={volume}><Suspense fallback={null}><Fireball sequence={sequence} impulse={impulse} compact={software || size.width/size.height<1.05}/></Suspense></group>
    <mesh position={[0,-3.65,-16]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[7,7]}/><shaderMaterial ref={landing} vertexShader={vertex} fragmentShader={landingFragment} uniforms={landingUniforms} transparent depthWrite={false} blending={AdditiveBlending}/></mesh>
    <pointLight ref={light} color="#b99bff" intensity={95} distance={34} decay={2} castShadow={false} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-.002} shadow-normalBias={.05} shadow-radius={6} shadow-camera-near={.5} shadow-camera-far={34}/>
    <PointerRadiance sequence={sequence}/>
  </>;
}
