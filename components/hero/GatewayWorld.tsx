"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Group, InstancedMesh, MathUtils, Mesh, MeshDepthMaterial, RGBADepthPacking, Object3D, ShaderMaterial, Vector3, type Material, type MeshBasicMaterial, type PointLight } from "three";
import { vertex, mistFragment } from "./portalShaders";
import type { PortalState } from "./portalState";
import { rockGeometry } from "./rockGeometry";
import { fbm3, ridged3 } from "./rockNoise";
import { portalFraming } from "./portalFraming";
import { mineralSurface } from "./mineralSurface";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const random = (n: number) => MathUtils.euclideanModulo(Math.sin(n * 127.1 + 311.7) * 43758.5453, 1);
const smooth = MathUtils.smoothstep;

// The same vertices travel from fractured orbital stone to architectural piers.
// Geometry and material belong to this component, including shader uniforms.
export function AssemblingMonoliths({ sequence }: { sequence: PortalState }) {
  const size = useThree(state => state.size);
  const framing = portalFraming(size.width, size.height);
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const resources = useMemo(() => {
    const geometry = new RoundedBoxGeometry(1, 1, 1, 9, .03);
    const positions = geometry.getAttribute("position");
    const assembled = positions.clone();
    const cuts = [[.7, .5, .5], [-.6, .4, -.7], [.5, -.6, .6], [-.4, -.5, -.8], [.8, .1, -.6], [-.7, .2, .7]].map(([x, y, z]) => ({ n: new Vector3(x, y, z).normalize(), o: .2 + random(x * 9 + y) * .12 }));
    const v = new Vector3();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      // Assembled pier: dressed stone with slight entasis and tool-worn irregularity.
      const wear = fbm3(x * 6, y * 22, z * 6, 3, 3) * .012;
      const entasis = 1 + .03 * Math.cos(y * Math.PI);
      assembled.setXYZ(i, x * entasis + wear * Math.sign(x), y, z * entasis + wear * Math.sign(z));
      // In flight: a fractured shard, chipped by planes and roughened by ridged noise.
      v.set(x, y, z);
      const taper = 1 - Math.abs(y) * .55;
      v.x *= taper; v.z *= taper;
      const relief = fbm3(x * 3.1, y * 3.1, z * 3.1, 8) * .09 + ridged3(x * 5, y * 5, z * 5, 12, 3) * .05;
      v.multiplyScalar(1 + relief);
      for (const cut of cuts) { const e = v.dot(cut.n) - cut.o; if (e > 0) v.addScaledVector(cut.n, -e * .96); }
      positions.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.setAttribute("assembledPosition", assembled);
    geometry.computeVertexNormals();
    const fracturedNormal = geometry.getAttribute("normal").clone();
    geometry.setAttribute("position", assembled.clone());
    geometry.computeVertexNormals();
    geometry.setAttribute("assembledNormal", geometry.getAttribute("normal").clone());
    geometry.setAttribute("position", positions);
    geometry.setAttribute("normal", fracturedNormal);
    const morph = { value: 0 };
    const material = mineralSurface(true);
    const mineralCompile = material.onBeforeCompile.bind(material);
    material.onBeforeCompile = (shader, renderer) => {
      mineralCompile(shader, renderer);
      shader.uniforms.uAssembly = morph;
      shader.vertexShader = "uniform float uAssembly; attribute vec3 assembledPosition; attribute vec3 assembledNormal;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nobjectNormal = normalize(mix(normal, assembledNormal, uAssembly));");
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed=mix(position,assembledPosition,uAssembly);");
    };
    material.customProgramCacheKey = () => "tierplay-assembly-mineral-relief-v3";
    // Shadow silhouette must follow the same assembly deformation as the lit mesh.
    const depth = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
    depth.onBeforeCompile = shader => {
      shader.uniforms.uAssembly = morph;
      shader.vertexShader = "uniform float uAssembly; attribute vec3 assembledPosition;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed=mix(position,assembledPosition,uAssembly);");
    };
    depth.customProgramCacheKey = () => "tierplay-assembly-depth-v2";
    return { geometry, material, depth, morph };
  }, []);
  useEffect(() => () => { resources.geometry.dispose(); resources.material.dispose(); resources.depth.dispose(); }, [resources]);
  useFrame(() => {
    if (!mesh.current) return;
    const p = sequence.progress, a = MathUtils.smootherstep(p, .46, .79), t = sequence.time;
    resources.morph.value = a;
    for (let i = 0; i < 28; i++) {
      const angle = i / 28 * Math.PI * 2 + (random(i + 100) - .5) * .12;
      const r = (4.3 + random(i + 80) * .65) * framing.scale;
      const side = i % 2 ? 1 : -1, row = Math.floor(i / 2);
      const height = row < 3 ? 13.5 - row * 1.25 : 5.5 + random(i + 50) * 6;
      const tx = side * (4.3 + (row % 3) * 1.3 + (row > 2 ? 3.3 : 0));
      const tz = row < 3 ? -16 - row * 1.3 : -20 - row * 2.5;
      const delay = MathUtils.smootherstep(p, .44 + random(i + 9) * .09, .77 + random(i + 3) * .05);
      const drift = Math.sin(t * .22 + i * 1.9) * .085 * (1 - delay);
      const arc = Math.sin(delay * Math.PI);
      dummy.position.set(
        MathUtils.lerp(framing.x + Math.cos(angle) * r + Math.sin(t * .13 + i) * .07, tx, delay) + side * arc * 1.3,
        MathUtils.lerp(framing.y + Math.sin(angle) * r * 1.14 + drift, -3.8 + height / 2, delay) + arc * 2,
        MathUtils.lerp(-1.5 + (random(i + 12) - .5) * 5, tz, delay),
      );
      dummy.rotation.set((random(i + 3) - .5) * (1 - delay), ((random(i + 4) - .5) * 1.2 + Math.sin(t * .1 + i) * .08) * (1 - delay), angle * (1 - delay));
      dummy.scale.set(MathUtils.lerp(.45 + random(i + 6) * .5, row < 3 ? 1.25 : 1.7, delay), MathUtils.lerp(.8 + random(i + 7) * 1.2, height, delay), MathUtils.lerp(.24 + random(i + 50) * .4, 1.3, delay));
      dummy.updateMatrix(); mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh castShadow receiveShadow ref={mesh} customDepthMaterial={resources.depth} args={[resources.geometry, resources.material, 28]} dispose={null} frustumCulled={false}/>;
}

export function GatewayArchitecture({ sequence }: { sequence: PortalState }) {
  const root = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const ringGlow = useRef<(MeshBasicMaterial | null)[]>([]);
  const seams = useRef<(Group | null)[]>([]);
  const lowLight = useRef<PointLight>(null), highLight = useRef<PointLight>(null);
  const shaders = useRef<ShaderMaterial[]>([]);
  const surfaces = useRef<{ material: Material; opacity: number }[]>([]);
  const cliff = useMemo(() => rockGeometry("cliff", 41), []);
  const stones = useMemo(() => rockGeometry("boulder", 57), []);
  const material = useMemo(() => mineralSurface(true), []);
  const cliffMaterial = useMemo(() => mineralSurface(false, { scale: .9, dust: .7 }), []);
  const lintel = useMemo(() => new RoundedBoxGeometry(9.8, 1.6, 1.5, 3, .06), []);
  useEffect(() => () => { cliffMaterial.dispose(); lintel.dispose(); }, [cliffMaterial, lintel]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uReveal: { value: 0 } }), []);
  const light = useMemo(() => new Color(1.1, .55, 1.9), []);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    const materials = new Set<ShaderMaterial>();
    const solids = new Set<Material>();
    root.current?.traverse(object => {
      if (object instanceof Mesh) {
        const list=Array.isArray(object.material)?object.material:[object.material];
        for(const m of list) { if(m instanceof ShaderMaterial) materials.add(m); else solids.add(m); }
      }
    });
    shaders.current = [...materials];
    surfaces.current = [...solids].map(material => { const opacity=material.opacity; material.transparent=true; material.needsUpdate=true; return {material,opacity}; });
    return () => { shaders.current = []; };
  }, []);
  useFrame(() => {
    const a = smooth(sequence.progress, .54, .83);
    if (root.current) { root.current.visible = a > .001; root.current.position.y = -3.8 - (1-a)*1.5; }
    for(const surface of surfaces.current) surface.material.opacity=surface.opacity*a;
    if (rings.current) {
      rings.current.rotation.y = sequence.time * .035;
      rings.current.position.y = 9.5 + Math.sin(sequence.time * .3) * .065;
    }
    // Ceremony: rings ignite one by one, light climbs the seams, the gateway swells.
    const finale = sequence.finale ?? 0;
    ringGlow.current.forEach((m, i) => { if (m) m.color.copy(light).multiplyScalar(.3 + smooth(finale, .06 + i * .13, .26 + i * .13) * 4.2); });
    const climb = smooth(finale, .2, .68);
    seams.current.forEach(g => { if (g) g.scale.y = .04 + climb * .96; });
    if (lowLight.current) lowLight.current.intensity = 32 * (1 + finale * 1.6);
    if (highLight.current) highLight.current.intensity = 52 * (1 + finale * 1.2);
    uniforms.uTime.value = sequence.time; uniforms.uReveal.value = smooth(sequence.progress, .64, .87);
    // Update the actual material uniforms: each mounted shader owns its uniform map.
    for (const shader of shaders.current) {
      shader.uniforms.uTime.value = sequence.time;
      if (shader.uniforms.uReveal) shader.uniforms.uReveal.value = uniforms.uReveal.value;
    }
  });
  return <group ref={root} position={[0, -3.8, 0]}>
    {/* An environmental gateway, never a representation of a Tierplay cabinet. */}
    <mesh castShadow receiveShadow position={[0, 12.6, -16]} material={material} geometry={lintel} dispose={null}/>
    <group ref={rings} position={[0, 9.5, -16]}>
      {[0, 1, 2].map(i => <group key={i} position={[0, -i * .8, 0]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} material={material}><torusGeometry args={[3.45 - i * .25, .24, 28, 180]}/></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -.12, 0]}><torusGeometry args={[3.45 - i * .25 - .17, .028, 6, 180]}/><meshBasicMaterial ref={m => { ringGlow.current[i] = m; }} color={light} toneMapped={false}/></mesh>
      </group>)}
    </group>
    {[-1, 1].map(side => <group key={side}>
      {[0, 1, 2].map(i => <group key={i} ref={g => { seams.current[(side + 1) / 2 * 3 + i] = g; }} position={[side * (4.3 + i * 1.3 - .47), 0, -15.32 - i * 1.3]}>
        <mesh position={[0, (12.5 - i * 1.2) / 2 + i * .6 * 0, 0]}><boxGeometry args={[.012, 12.5 - i * 1.2, .014]}/><meshBasicMaterial color={i % 2 ? "#5b40b0" : light} toneMapped={false}/></mesh>
      </group>)}
      {[0, 1, 2, 3, 4].map(i => <mesh key={i} castShadow receiveShadow geometry={stones} material={cliffMaterial} dispose={null} position={[side * (3.4 + random(i + side) * .8), .05, 7 - i * 5]} rotation={[random(i) * 2, i * 1.9, random(i + 4)]} scale={[.45 + random(i + 7) * .4, .22 + random(i + 2) * .2, .4 + random(i + 3) * .3]}/>)}
    </group>)}
    {[0, 1, 2, 3, 4, 5].map(i => <mesh castShadow receiveShadow key={i} material={material} position={[0, i * .09, -12 - i * .55]}><boxGeometry args={[8.5, .14, .6]}/></mesh>)}
    <pointLight ref={lowLight} position={[0, 2.5, -15]} intensity={32} color="#b7a0d3" distance={22}/>
    <pointLight ref={highLight} position={[0, 9, -14]} intensity={52} color="#e3ddf6" distance={20}/>
    {[-10, -22, -32].map((z, i) => <mesh key={z} position={[0, .8 + i * .4, z]} scale={[35, 4, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>)}
    {[-1, 1].map(side => <group key={`cliffs-${side}`}>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[side * (11 + random(i + 81) * 11), 0, -23 - i * 4]}>
        <mesh castShadow receiveShadow geometry={cliff} material={cliffMaterial} dispose={null} position={[0, 3, 0]} rotation={[0, i * 1.7, 0]} scale={[2.4 + random(i) * 2.2, 8 + random(i + 7) * 7, 3.2]}/>
      </group>)}
    </group>)}
  </group>;
}
