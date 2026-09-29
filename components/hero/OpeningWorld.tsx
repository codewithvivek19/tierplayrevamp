"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CatmullRomCurve3, Color, CylinderGeometry, DoubleSide, Group, InstancedMesh, LatheGeometry, MathUtils, Mesh, Object3D, ShaderMaterial, TubeGeometry, Vector2, Vector3 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { vertex } from "./portalShaders";
import { fireballVertex } from "./fireballShaders";
import { arcFragment, arcVertex, beamFragment, cloudFragment, crystalFragment, crystalVertex, fallsFragment, gridFragment, moonFragment, vortexFragment, vortexVertex } from "./vortexShaders";
import { mineralSurface } from "./mineralSurface";
import { rockNoiseTexture } from "./noiseTexture";

const textureNoise = { ROCK_TEXTURE: "" };
import type { PortalState } from "./portalState";

const rand = (i: number) => MathUtils.euclideanModulo(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1);
const smooth = MathUtils.smoothstep;

/** The spiral portal at the heart of the shard shell. Collapses into the fireball on scroll. */
export function Vortex({ sequence }: { sequence: PortalState }) {
  const group = useRef<Group>(null);
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const uniforms = useMemo(() => [0, 1].map(layer => ({ uTime: { value: 0 }, uCollapse: { value: 0 }, uLayer: { value: layer }, uOpacity: { value: 1 }, uRockNoise: { value: rockNoiseTexture() } })), []);
  useFrame(() => {
    const collapse = sequence.intro ?? 0;
    const gone = smooth(collapse, .9, 1);
    if (group.current) {
      group.current.visible = gone < .999;
      group.current.rotation.z = sequence.time * .015;
    }
    for (const material of materials.current) if (material) {
      material.uniforms.uTime.value = sequence.time;
      material.uniforms.uCollapse.value = collapse;
      material.uniforms.uOpacity.value = 1 - gone;
    }
  });
  return <group ref={group} rotation={[-.18, .32, 0]}>
    {[0, 1].map(layer => <mesh key={layer} name={layer === 0 ? "vortex" : undefined} userData={{ fireballBloom: true }} position={[0, 0, -.35 * layer]} rotation={[0, 0, layer * .9]} scale={layer ? 3.7 : 3.2} renderOrder={2}>
      <planeGeometry args={[2, 2]}/>
      <shaderMaterial ref={m => { materials.current[layer] = m; }} uniforms={uniforms[layer]} defines={textureNoise} vertexShader={vortexVertex} fragmentShader={vortexFragment} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} side={DoubleSide}/>
    </mesh>)}
  </group>;
}

/** Magenta orbital ribbons sweeping around the portal. */
export function EnergyArcs({ sequence, count = 5 }: { sequence: PortalState; count?: number }) {
  const group = useRef<Group>(null);
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const arcs = useMemo(() => Array.from({ length: count }, (_, i) => {
    const rx = 4.4 + rand(i + 3) * 1.8, ry = 1.1 + rand(i + 9) * 1.5;
    const points = Array.from({ length: 64 }, (_, k) => { const a = k / 64 * Math.PI * 2; return new Vector3(Math.cos(a) * rx, Math.sin(a) * ry, Math.sin(a * 2 + i) * .35); });
    const geometry = new TubeGeometry(new CatmullRomCurve3(points, true), 420, .016 + rand(i + 5) * .02, 6, true);
    return { geometry, rotation: [rand(i) * .9 - .45, rand(i + 1) * 1.2 - .6, rand(i + 2) * Math.PI] as [number, number, number], uniforms: { uTime: { value: 0 }, uSpeed: { value: .05 + rand(i + 7) * .06 }, uOffset: { value: rand(i + 11) }, uOpacity: { value: 1 } } };
  }), [count]);
  useEffect(() => () => arcs.forEach(arc => arc.geometry.dispose()), [arcs]);
  useFrame(() => {
    const collapse = sequence.intro ?? 0;
    const fade = (1 - smooth(collapse, .35, .85)) * (1 - smooth(sequence.progress, .1, .3));
    if (group.current) {
      group.current.visible = fade > .002;
      group.current.scale.setScalar(1 - collapse * .45);
      group.current.rotation.y = sequence.time * .02;
    }
    for (const material of materials.current) if (material) { material.uniforms.uTime.value = sequence.time; material.uniforms.uOpacity.value = fade; }
  });
  return <group ref={group}>
    {arcs.map((arc, i) => <mesh key={i} geometry={arc.geometry} rotation={arc.rotation} userData={{ fireballBloom: true }}>
      <shaderMaterial ref={m => { materials.current[i] = m; }} uniforms={arc.uniforms} vertexShader={arcVertex} fragmentShader={arcFragment} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}/>
    </mesh>)}
  </group>;
}

/** The shaft of light falling from above, and light streams falling beneath the shell. */
export function PortalAtmosphere({ sequence, floorY }: { sequence: PortalState; floorY: number }) {
  const beam = useRef<Mesh>(null);
  const beamMaterial = useRef<ShaderMaterial>(null);
  const falls = useRef<(ShaderMaterial | null)[]>([]);
  const beamUniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: 1 } }), []);
  const eye = useMemo(() => new Vector3(), []);
  const fallUniforms = useMemo(() => [0, 1, 2, 3, 4].map(i => ({ uTime: { value: 0 }, uOpacity: { value: 1 }, uSeed: { value: i * 3.7 } })), []);
  useFrame(({ camera }) => {
    const collapse = sequence.intro ?? 0, p = sequence.progress;
    if (beam.current) {
      // Cylindrical billboard: turn about Y toward the camera.
      const world = beam.current.parent;
      if (world) {
        world.worldToLocal(eye.copy(camera.position));
        beam.current.rotation.y = Math.atan2(eye.x - beam.current.position.x, eye.z - beam.current.position.z);
      }
    }
    if (beamMaterial.current) {
      beamMaterial.current.uniforms.uTime.value = sequence.time;
      beamMaterial.current.uniforms.uOpacity.value = (1 - collapse * .75) * (1 - smooth(p, .15, .4));
    }
    const fallOpacity = (1 - collapse * .6) * (1 - smooth(p, .2, .45));
    for (const m of falls.current) if (m) { m.uniforms.uTime.value = sequence.time; m.uniforms.uOpacity.value = fallOpacity; }
  });
  const depth = floorY + 1.4;
  return <>
    <mesh ref={beam} position={[.2, 15, -1.4]} userData={{ fireballBloom: true }}>
      <planeGeometry args={[1.8, 30]}/>
      <shaderMaterial ref={beamMaterial} uniforms={beamUniforms} vertexShader={vertex} fragmentShader={beamFragment} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}/>
    </mesh>
    {fallUniforms.map((u, i) => <mesh key={i} position={[(i - 2) * .9 + (rand(i) - .5) * .6, (-2 + depth) / 2 - .4, (rand(i + 4) - .5) * 2]} rotation={[0, (rand(i + 8) - .5) * .8, 0]}>
      <planeGeometry args={[1.4 + rand(i + 2), Math.abs(depth) + 2]}/>
      <shaderMaterial ref={m => { falls.current[i] = m; }} uniforms={u} vertexShader={vertex} fragmentShader={fallsFragment} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} side={DoubleSide}/>
    </mesh>)}
  </>;
}

/** Cloud deck behind the portal, the Milky Way's companion moon, and the horizon survey grid. */
export function SkyAndHorizon({ sequence }: { sequence: PortalState }) {
  const cloud = useRef<ShaderMaterial>(null);
  const cloudUniforms = useMemo(() => ({ uTime: { value: 0 }, uGlow: { value: new Vector2(.64, .46) }, uOpacity: { value: 1 }, uRockNoise: { value: rockNoiseTexture() } }), []);
  const gridUniforms = useMemo(() => ({ uOpacity: { value: 1 } }), []);
  const grid = useRef<ShaderMaterial>(null);
  useFrame(() => {
    if (cloud.current) { cloud.current.uniforms.uTime.value = sequence.time; cloud.current.uniforms.uOpacity.value = 1 - smooth(sequence.progress, .12, .38); }
    if (grid.current) grid.current.uniforms.uOpacity.value = 1 - smooth(sequence.progress, .3, .6);
  });
  return <>
    <mesh position={[6, 4, -50]} scale={[110, 46, 1]}>
      <planeGeometry/>
      <shaderMaterial ref={cloud} uniforms={cloudUniforms} defines={textureNoise} vertexShader={vertex} fragmentShader={cloudFragment} transparent depthWrite={false}/>
    </mesh>
    <mesh position={[-13, 10.5, -44]} scale={1.15}>
      <sphereGeometry args={[1, 64, 48]}/>
      <shaderMaterial vertexShader={fireballVertex} fragmentShader={moonFragment}/>
    </mesh>
    <mesh position={[0, -3.785, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[240, 240]}/>
      <shaderMaterial ref={grid} uniforms={gridUniforms} transparent depthWrite={false}
        vertexShader={"varying vec3 vWorld; void main(){ vec4 w=modelMatrix*vec4(position,1.); vWorld=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }"}
        fragmentShader={gridFragment}/>
    </mesh>
  </>;
}

/** The circular stone dais beneath the portal; it sinks away once the journey begins. */
export function Dais({ sequence, center }: { sequence: PortalState; center: [number, number, number] }) {
  const group = useRef<Group>(null);
  const grooves = useRef<(Mesh | null)[]>([]);
  const geometry = useMemo(() => {
    const profile = [[6.4, -.2], [6.4, .22], [7.3, .22], [7.3, .1], [8.5, .1], [8.5, .38], [9.3, .38], [9.3, -.2]].map(([x, y]) => new Vector2(x, y));
    return new LatheGeometry(profile, 220);
  }, []);
  const material = useMemo(() => mineralSurface(true, { scale: 1.6, dust: .15 }), []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  const glow = useMemo(() => new Color(.9, .35, 1.8), []);
  useFrame(() => {
    const sink = smooth(sequence.progress, .3, .7);
    if (group.current) { group.current.position.y = center[1] - sink * 1.4; group.current.visible = sink < .999; }
    grooves.current.forEach((m, i) => { if (m) (m.material as import("three").MeshBasicMaterial).color.copy(glow).multiplyScalar((.55 + .25 * Math.sin(sequence.time * .8 + i * 2)) * (1 - sink)); });
  });
  return <group ref={group} position={center}>
    <mesh geometry={geometry} material={material} castShadow receiveShadow dispose={null}/>
    {[7.02, 8.9].map((r, i) => <mesh key={r} ref={m => { grooves.current[i] = m; }} rotation={[Math.PI / 2, 0, 0]} position={[0, i ? .39 : .23, 0]}>
      <torusGeometry args={[r, .012, 4, 260]}/><meshBasicMaterial color={glow} toneMapped={false}/>
    </mesh>)}
  </group>;
}

function crystalGeometry() {
  const body = new CylinderGeometry(.5, .55, 2, 6, 1).translate(0, 1, 0);
  const tip = new CylinderGeometry(0, .5, .9, 6, 1).translate(0, 2.45, 0);
  const merged = mergeGeometries([body.toNonIndexed(), tip.toNonIndexed()])!;
  body.dispose(); tip.dispose();
  merged.computeVertexNormals();
  return merged;
}
let sharedCrystal: ReturnType<typeof crystalGeometry> | null = null;

/** A cluster of hexagonal crystals growing from an island's crown. */
export function CrystalCluster({ sequence, color, seed, count = 15, light = false }: { sequence: PortalState; color: [number, number, number]; seed: number; count?: number; light?: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => (sharedCrystal ??= crystalGeometry()), []);
  const uniforms = useMemo(() => ({ uColor: { value: new Vector3(...color) }, uTime: { value: 0 }, uOpacity: { value: 1 } }), [color]);
  useEffect(() => {
    const dummy = new Object3D();
    for (let i = 0; i < count; i++) {
      const a = rand(seed + i) * Math.PI * 2, r = i === 0 ? 0 : Math.sqrt(rand(seed + i + 40)) * .42;
      dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r * .8);
      const tilt = i === 0 ? .05 : .15 + r * 1.1;
      dummy.rotation.set(Math.sin(a) * tilt, rand(seed + i + 9) * Math.PI, -Math.cos(a) * tilt);
      const h = (i === 0 ? .5 : .14 + rand(seed + i + 20) * .3) * (1 - r * .6);
      const w = .05 + rand(seed + i + 30) * .06;
      dummy.scale.set(w, h, w);
      dummy.updateMatrix(); mesh.current?.setMatrixAt(i, dummy.matrix);
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, seed]);
  useFrame(() => { uniforms.uTime.value = sequence.time; });
  return <group>
    <instancedMesh ref={mesh} args={[geometry, undefined, count]} dispose={null} frustumCulled={false}>
      <shaderMaterial uniforms={uniforms} vertexShader={crystalVertex} fragmentShader={crystalFragment} toneMapped={false}/>
    </instancedMesh>
    {light ? <pointLight position={[0, .6, 0]} color={new Color(color[0], color[1], color[2]).multiplyScalar(.4)} intensity={4} distance={3.5} decay={2}/> : null}
  </group>;
}
