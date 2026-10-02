"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from "three";
import type { PortalState } from "./portalState";
import { WALK_END, WALK_START } from "./walk";

const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/**
 * Dust hanging in the air along the walk, catching the gateway's light. One draw call; the motes drift
 * slowly and brighten toward the arch, so walking through them gives the scene depth and parallax.
 */
export default function DustMotes({ sequence, count }: { sequence: PortalState; count: number }) {
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const position = new Float32Array(count * 3), seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      position[i * 3] = (rand(i) - .5) * 9;
      position[i * 3 + 1] = -3.6 + Math.pow(rand(i + 31), 1.6) * 7;
      position[i * 3 + 2] = 5 - rand(i + 77) * 24;
      seed[i] = rand(i + 151);
    }
    g.setAttribute("position", new BufferAttribute(position, 3));
    g.setAttribute("seed", new BufferAttribute(seed, 1));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uFade: { value: 0 } }), []);

  useFrame(() => {
    uniforms.uTime.value = sequence.time;
    const walk = Math.min(1, Math.max(0, ((sequence.raw ?? 0) - WALK_START + .04) / (WALK_END - WALK_START)));
    uniforms.uFade.value = Math.min(1, walk * 5);
  });

  return <points geometry={geometry} frustumCulled={false} renderOrder={5}>
    <shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}
      vertexShader={`
        uniform float uTime; attribute float seed; varying float vGlow; varying float vSeed;
        void main(){
          vec3 p = position;
          p.x += sin(uTime * (.08 + seed * .1) + seed * 40.) * .35;
          p.y += sin(uTime * (.06 + seed * .07) + seed * 17.) * .25 + mod(uTime * .02 * (seed + .3), 1.2);
          p.z += cos(uTime * .05 + seed * 9.) * .2;
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mv;
          // Brighter near the gateway's light (x 0, z -16).
          vGlow = exp(-pow(length(vec2(p.x * .7, p.z + 15.5)) * .22, 2.)) * .9 + .12;
          vSeed = seed;
          gl_PointSize = (1.2 + seed * 2.6) * (220. / -mv.z);
        }`}
      fragmentShader={`
        uniform float uFade; uniform float uTime; varying float vGlow; varying float vSeed;
        void main(){
          float d = length(gl_PointCoord - .5);
          float a = smoothstep(.5, 0., d);
          float twinkle = .65 + .35 * sin(uTime * (1. + vSeed * 2.) + vSeed * 30.);
          gl_FragColor = vec4(vec3(.82, .72, 1.) * vGlow * twinkle, a * uFade * vGlow);
        }`} />
  </points>;
}
