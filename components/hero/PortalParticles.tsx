"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, DynamicDrawUsage, MathUtils, type Points } from "three";
import type { PortalState } from "./portalState";

const random = (n: number) => MathUtils.euclideanModulo(Math.sin(n * 127.1 + 311.7) * 43758.5453, 1);
const particleVertex = /* glsl */ `
attribute float aSize; attribute float aHeat; attribute vec3 aVelocity;
varying float vHeat; varying float vStretch; varying float vAngle; varying float vAlpha;
uniform float uDpr; uniform float uProgress;
void main(){
 vec4 mv=modelViewMatrix*vec4(position,1.);
 vec3 velocity=mat3(modelViewMatrix)*aVelocity;
 vAngle=atan(velocity.y,velocity.x);vStretch=clamp(length(velocity)*.09,0.,.75);
 vHeat=aHeat;vAlpha=smoothstep(.3,2.,-mv.z)*(1.-smoothstep(28.,55.,-mv.z));
 gl_PointSize=clamp(aSize*uDpr*120./max(1.,-mv.z)*(1.+vStretch),1.,7.);
 gl_Position=projectionMatrix*mv;
}`;
const particleFragment = /* glsl */ `
varying float vHeat; varying float vStretch; varying float vAngle; varying float vAlpha;
uniform float uProgress;
void main(){
 vec2 p=gl_PointCoord-.5;
 float c=cos(vAngle),s=sin(vAngle);p=mat2(c,-s,s,c)*p;
 p.y*=1.+vStretch*4.;float d=length(p)*2.;
 float core=exp(-d*d*12.);float halo=exp(-d*d*5.)*.025;
 vec3 color=mix(vec3(.48,.55,.78),vec3(.75,.62,.8),vHeat);
 color=mix(color,vec3(.95,.86,.69),step(.94,vHeat));
 gl_FragColor=vec4(color*(1.+vHeat*.6),(core+halo)*vAlpha*.65*(1.-smoothstep(.65,.88,uProgress)*.65));
}`;

// Semi-implicit integration with capped substeps, drag, spring attraction and
// pointer repulsion. No React state or temporary vectors are allocated per frame.
export default function PortalParticles({ sequence, balanced = false }: { sequence: PortalState; balanced?: boolean }) {
  const ref = useRef<Points>(null);
  const { size, gl } = useThree();
  const count = size.width < 750 || balanced ? 950 : 2800;
  const field = useMemo(() => {
    const position = new Float32Array(count * 3), velocity = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4), sizes = new Float32Array(count), heat = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = random(i) * Math.PI * 2, radius = 2.7 + Math.pow(random(i + 100), 2) * 5.5;
      seeds.set([angle, radius, (random(i + 700) - .35) * 11, .04 + random(i + 1400) * .11], i * 4);
      position.set([Math.cos(angle) * radius, Math.sin(angle) * radius * .78, seeds[i * 4 + 2]], i * 3);
      sizes[i] = .07 + Math.pow(random(i + 2000), 6) * .35;
      heat[i] = random(i + 3000);
    }
    return { position, velocity, seeds, sizes, heat };
  }, [count]);
  const uniforms = useMemo(() => ({ uDpr: { value: 1 }, uProgress: { value: 0 } }), []);
  useFrame((_, delta) => {
    if (!ref.current || sequence.paused) return;
    const dt = Math.min(delta, .04), steps = Math.max(1, Math.ceil(dt / .016)), h = dt / steps;
    const pull = MathUtils.smoothstep(sequence.progress, .22, .68);
    const release = MathUtils.smoothstep(sequence.progress, .62, .92);
    const pointerX = sequence.pointerX * 8 - (size.width < 750 ? 0 : 3.7), pointerY = -sequence.pointerY * 5;
    for (let step = 0; step < steps; step++) {
      for (let i = 0; i < count; i++) {
        const j = i * 3, k = i * 4;
        const a = field.seeds[k] + sequence.time * field.seeds[k + 3] + pull * (1.8 + field.seeds[k + 3] * 3);
        const r = field.seeds[k + 1] * (1 - pull * .2 + release * .72);
        const settle = MathUtils.smoothstep(sequence.progress, .62, .84);
        const tx = MathUtils.lerp(Math.cos(a) * r, Math.cos(field.seeds[k]) * field.seeds[k + 1] * 1.2, settle);
        const ty = MathUtils.lerp(Math.sin(a) * r * .83, 7 - ((sequence.time * .23 + i * .37) % 11), settle);
        const tz = field.seeds[k + 2] + Math.sin(a * 2 + sequence.time * .12) * .5 + release * (i % 2 ? 7 : -5);
        const dx = field.position[j] - pointerX, dy = field.position[j + 1] - pointerY;
        const distance = dx * dx + dy * dy + .6;
        const repel = sequence.pointerActive ? 1.8 * Math.exp(-distance * .7) : 0;
        const drag = Math.exp(-3.4 * h);
        field.velocity[j] = (field.velocity[j] + ((tx - field.position[j]) * 7 + dx * repel) * h) * drag;
        field.velocity[j + 1] = (field.velocity[j + 1] + ((ty - field.position[j + 1]) * 7 + dy * repel) * h) * drag;
        field.velocity[j + 2] = (field.velocity[j + 2] + (tz - field.position[j + 2]) * 7 * h) * drag;
        field.position[j] += field.velocity[j] * h; field.position[j + 1] += field.velocity[j + 1] * h; field.position[j + 2] += field.velocity[j + 2] * h;
      }
    }
    (ref.current.geometry.attributes.position as BufferAttribute).needsUpdate = true;
    (ref.current.geometry.attributes.aVelocity as BufferAttribute).needsUpdate = true;
    uniforms.uDpr.value = gl.getPixelRatio(); uniforms.uProgress.value = sequence.progress;
  });
  return <points ref={ref} frustumCulled={false}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[field.position, 3]} usage={DynamicDrawUsage}/>
      <bufferAttribute attach="attributes-aVelocity" args={[field.velocity, 3]} usage={DynamicDrawUsage}/>
      <bufferAttribute attach="attributes-aSize" args={[field.sizes, 1]}/>
      <bufferAttribute attach="attributes-aHeat" args={[field.heat, 1]}/>
    </bufferGeometry>
    <shaderMaterial uniforms={uniforms} vertexShader={particleVertex} fragmentShader={particleFragment} transparent blending={AdditiveBlending} depthWrite={false}/>
  </points>;
}
