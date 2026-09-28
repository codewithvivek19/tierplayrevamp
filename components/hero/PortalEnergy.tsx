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

export default function PortalEnergy({ sequence, software }: { sequence: PortalState; software: boolean }) {
  const size = useThree(s => s.size);
  const framing = portalFraming(size.width, size.height);
  const volume = useRef<Group>(null);
  const landing = useRef<ShaderMaterial>(null);
  const light = useRef<PointLight>(null);
  const orbit = useRef<Group>(null);
  const orbitMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const impulse = useRef(0);
  const previous = useRef(sequence.progress);
  const landingUniforms = useMemo(() => ({ uTime: {value:0}, uOpacity: {value:0} }), []);
  const orbitUniforms = useMemo(() => ({ uTime: {value:0}, uOpacity:{value:1} }), []);
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
        light.current.intensity=25+stretch*23+impulse.current*8;
      }
    }
    if (orbit.current) {
      const opacity=1-MathUtils.smootherstep(p,.30,.63);
      orbit.current.visible=opacity>.001;
      orbit.current.position.set(framing.x*(1-travel),MathUtils.lerp(framing.y,3.8,travel),MathUtils.lerp(-1.5,-16,travel));
      orbit.current.scale.setScalar(framing.scale*(1+stretch*.25));
      orbit.current.rotation.set(0,p*.7+Math.sin(sequence.time*.12)*.08,-.24+p*.16);
      for (const m of orbitMaterials.current) if(m){m.uniforms.uTime.value=sequence.time;m.uniforms.uOpacity.value=opacity;}
    }
    if(landing.current){landing.current.uniforms.uTime.value=sequence.time;landing.current.uniforms.uOpacity.value=MathUtils.smootherstep(p,.60,.85)*.6;}
  }, -.5);
  return <>
    <group ref={volume}><Suspense fallback={null}><Fireball sequence={sequence} impulse={impulse} compact={software || size.width/size.height<1.05}/></Suspense></group>
    <group ref={orbit}>{[0,1,2].map(i=><group key={i} rotation={[1.08+i*.29,.12-i*.1,i*.32]}>
      <mesh><torusGeometry args={[4.7+i*.7,.009,4,180]}/><shaderMaterial ref={m=>{orbitMaterials.current[i]=m;}} vertexShader={vertex} fragmentShader={`varying vec2 vUv;uniform float uTime;uniform float uOpacity;void main(){float head=pow(fract(vUv.x-uTime*.045),18.);gl_FragColor=vec4(mix(vec3(.23,.2,.32),vec3(.9,.8,1.1),head),(.22+head*.7)*uOpacity);}`} uniforms={orbitUniforms} transparent depthWrite={false} blending={AdditiveBlending}/></mesh>
    </group>)}</group>
    <mesh position={[0,-3.65,-16]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[7,7]}/><shaderMaterial ref={landing} vertexShader={vertex} fragmentShader={landingFragment} uniforms={landingUniforms} transparent depthWrite={false} blending={AdditiveBlending}/></mesh>
    <pointLight ref={light} color="#c3b7ff" intensity={30} distance={22}/>
    <PointerRadiance sequence={sequence}/>
  </>;
}
