"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color, DoubleSide, Group, IcosahedronGeometry, InstancedMesh, MathUtils, Mesh, MeshStandardMaterial, Object3D, ShaderMaterial } from "three";
import { noise, vertex, mistFragment } from "./portalShaders";
import type { PortalState } from "./portalState";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const random = (n: number) => MathUtils.euclideanModulo(Math.sin(n * 127.1 + 311.7) * 43758.5453, 1);
const smooth = MathUtils.smoothstep;

// The same vertices travel from fractured orbital stone to architectural piers.
// Geometry and material belong to this component, including shader uniforms.
export function AssemblingMonoliths({ sequence }: { sequence: PortalState }) {
  const compact = useThree(state => state.size.width < 750);
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const resources = useMemo(() => {
    const geometry = new RoundedBoxGeometry(1, 1, 1, 4, .035);
    const positions = geometry.getAttribute("position");
    geometry.setAttribute("assembledPosition", positions.clone());
    geometry.setAttribute("assembledNormal", geometry.getAttribute("normal").clone());
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const taper = 1 - Math.abs(y) * .95;
      const ridge = .8 + Math.sin(y * 17 + z * 11) * .16 + Math.cos(x * 19 + y * 23) * .09;
      positions.setXYZ(i, x * taper * ridge + Math.sin(y * 9) * .1, y + Math.sin(x * 13 + z * 9) * .11, z * taper * ridge);
    }
    geometry.computeVertexNormals();
    const morph = { value: 0 };
    const material = new MeshStandardMaterial({ color: "#201c26", metalness: .24, roughness: .58, envMapIntensity: .8 });
    material.onBeforeCompile = shader => {
      shader.uniforms.uAssembly = morph;
      shader.vertexShader = `uniform float uAssembly; attribute vec3 assembledPosition; attribute vec3 assembledNormal; varying vec3 vMineral;\n${noise}\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <beginnormal_vertex>", `#include <beginnormal_vertex>\nobjectNormal = normalize(mix(normal, assembledNormal, uAssembly));`);
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        vMineral=(instanceMatrix*vec4(position,1.)).xyz;
        transformed=mix(position,assembledPosition,uAssembly);
      `);
      shader.fragmentShader = `varying vec3 vMineral;\n${noise}\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        float mineral=fbm(vMineral*.65);
        float vein=1.-smoothstep(.015,.065,abs(sin(vMineral.y*.9+vMineral.x*1.4+mineral*6.)));
        diffuseColor.rgb*=.8+mineral*.9;
        diffuseColor.rgb+=vec3(.06,.055,.067)*vein;
      `);
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor=.32+mineral*.25;");
    };
    material.customProgramCacheKey = () => "tierplay-transforming-mineral-v1";
    return { geometry, material, morph };
  }, []);
  useEffect(() => () => { resources.geometry.dispose(); resources.material.dispose(); }, [resources]);
  useFrame(() => {
    if (!mesh.current) return;
    const p = sequence.progress, a = smooth(p, .46, .79), t = sequence.time;
    resources.morph.value = a;
    for (let i = 0; i < 28; i++) {
      const angle = i / 28 * Math.PI * 2 + (random(i + 100) - .5) * .12;
      const r = (4.3 + random(i + 80) * .65) * (compact ? .72 : 1);
      const side = i % 2 ? 1 : -1, row = Math.floor(i / 2);
      const height = row < 3 ? 13.5 - row * 1.25 : 5.5 + random(i + 50) * 6;
      const tx = side * (4.3 + (row % 3) * 1.3 + (row > 2 ? 3.3 : 0));
      const tz = row < 3 ? -16 - row * 1.3 : -20 - row * 2.5;
      const delay = smooth(p, .44 + random(i + 9) * .09, .77 + random(i + 3) * .05);
      const drift = Math.sin(t * .22 + i * 1.9) * .085 * (1 - delay);
      const arc = Math.sin(delay * Math.PI);
      dummy.position.set(
        MathUtils.lerp((compact ? 0 : 3.9) + Math.cos(angle) * r + Math.sin(t * .13 + i) * .07, tx, delay) + side * arc * 1.3,
        MathUtils.lerp((compact ? 3.1 : .8) + Math.sin(angle) * r * 1.14 + drift, -3.8 + height / 2, delay) + arc * 2,
        MathUtils.lerp(-1.5 + (random(i + 12) - .5) * 5, tz, delay),
      );
      dummy.rotation.set((random(i + 3) - .5) * (1 - delay), ((random(i + 4) - .5) * 1.2 + Math.sin(t * .1 + i) * .08) * (1 - delay), angle * (1 - delay));
      dummy.scale.set(MathUtils.lerp(.45 + random(i + 6) * .5, row < 3 ? 1.25 : 1.7, delay), MathUtils.lerp(.8 + random(i + 7) * 1.2, height, delay), MathUtils.lerp(.24 + random(i + 50) * .4, 1.3, delay));
      dummy.updateMatrix(); mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[resources.geometry, resources.material, 28]} dispose={null} frustumCulled={false}/>;
}

const energy = /* glsl */ `varying vec2 vUv; uniform float uTime; uniform float uReveal;
${noise}
void main(){
 float x=abs(vUv.x-.5);
 float stream=fbm(vec3(vUv.x*19.,vUv.y*8.-uTime*.55,uTime*.1));
 float threads=pow(max(0.,sin(vUv.x*260.+stream*5.)),14.);
 float core=exp(-x*100.); float halo=exp(-x*13.);
 float ends=smoothstep(0.,.07,vUv.y)*(1.-smoothstep(.87,1.,vUv.y));
 vec3 color=mix(vec3(.37,.13,.85),vec3(1.,.76,1.),core);
 gl_FragColor=vec4(color*(1.+core*1.8),ends*(halo*.24+threads*halo*.52+core*.65)*uReveal);
}`;

const water = /* glsl */ `varying vec2 vUv; uniform float uTime;
${noise}
void main(){
 float ripple=noise3(vec3(vUv*vec2(15.,110.),uTime*.17));
 float glint=pow(max(0.,sin(vUv.y*320.+ripple*8.+uTime*.6)),18.);
 float reflection=exp(-abs(vUv.x-.5+sin(vUv.y*80.+uTime)*.04)*6.);
 vec3 color=vec3(.012,.009,.022)+vec3(.2,.095,.31)*glint*reflection;
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

export function GatewayArchitecture({ sequence }: { sequence: PortalState }) {
  const root = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const shaders = useRef<ShaderMaterial[]>([]);
  const cliff = useMemo(() => {
    const geometry = new IcosahedronGeometry(1, 3);
    const positions = geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const ridge = 1 + .24 * Math.sin(x * 7 + y * 4 + z * 5) + .09 * Math.sin(y * 23 + x * 17);
      positions.setXYZ(i, x * ridge, y * (1 + .1 * Math.sin(z * 12)), z * ridge);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  const material = useMemo(() => new MeshStandardMaterial({ color: "#514b5b", metalness: .55, roughness: .32 }), []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uReveal: { value: 0 } }), []);
  const light = useMemo(() => new Color(2.4, 1.05, 3.5), []);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => cliff.dispose(), [cliff]);
  useEffect(() => {
    const materials = new Set<ShaderMaterial>();
    root.current?.traverse(object => {
      if (object instanceof Mesh && object.material instanceof ShaderMaterial) materials.add(object.material);
    });
    shaders.current = [...materials];
    return () => { shaders.current = []; };
  }, []);
  useFrame(() => {
    const a = smooth(sequence.progress, .54, .83);
    if (root.current) { root.current.visible = a > .001; root.current.scale.y = Math.max(.001, a); }
    if (rings.current) rings.current.rotation.y = sequence.time * .035;
    uniforms.uTime.value = sequence.time; uniforms.uReveal.value = smooth(sequence.progress, .64, .87);
    // Update the actual material uniforms: each mounted shader owns its uniform map.
    for (const shader of shaders.current) {
      shader.uniforms.uTime.value = sequence.time;
      if (shader.uniforms.uReveal) shader.uniforms.uReveal.value = uniforms.uReveal.value;
    }
  });
  return <group ref={root} position={[0, -3.8, 0]}>
    {/* An environmental gateway, never a representation of a Tierplay cabinet. */}
    <mesh position={[0, 12.6, -16]} material={material}><boxGeometry args={[9.8, 1.6, 1.5]}/></mesh>
    <group ref={rings} position={[0, 9.5, -16]}>
      {[0, 1, 2].map(i => <group key={i} position={[0, -i * .8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={material}><torusGeometry args={[3.45 - i * .25, .22, 8, 80]}/></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[3.45 - i * .25, .018, 4, 80]}/><meshBasicMaterial color={light} toneMapped={false}/></mesh>
      </group>)}
    </group>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 5.2, -.015, -5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[4, 40]}/><shaderMaterial vertexShader={vertex} fragmentShader={water} uniforms={uniforms}/></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[side * (4.3 + i * 1.3 - .47), 6.3 - i * .6, -15.32 - i * 1.3]}>
        <boxGeometry args={[.023, 12.5 - i * 1.2, .025]}/><meshBasicMaterial color={i % 2 ? "#9872ff" : light} toneMapped={false}/>
      </mesh>)}
      <mesh position={[side * 2.8, .045, -4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.028, 37]}/><meshBasicMaterial color={[1.1, 1.1, 2.5]} toneMapped={false}/></mesh>
      {[0, 1, 2, 3, 4].map(i => <group key={i} position={[side * (3.3 + i * .08), .1, 7 - i * 5]}>
        <mesh material={material}><boxGeometry args={[.75, .2, .8]}/></mesh>
        <mesh position={[0, .25, 0]}><boxGeometry args={[.12, .4, .17]}/><meshBasicMaterial color={[2, 1.6, 1.3]} toneMapped={false}/></mesh>
      </group>)}
    </group>)}
    {[0, 1, 2, 3, 4, 5].map(i => <mesh key={i} material={material} position={[0, i * .09, -12 - i * .55]}><boxGeometry args={[8.5, .14, .6]}/></mesh>)}
    <mesh position={[0, 7, -16]}><planeGeometry args={[7, 16]}/><shaderMaterial vertexShader={vertex} fragmentShader={energy} uniforms={uniforms} transparent blending={AdditiveBlending} depthWrite={false} side={DoubleSide}/></mesh>
    <mesh position={[0, 6.5, -15.8]}><cylinderGeometry args={[.025, .055, 13, 8]}/><meshBasicMaterial color={[2.6, 1.3, 3.8]} toneMapped={false}/></mesh>
    {[-.31, -.12, .17, .36].map((x, i) => <mesh key={x} position={[x, 6, -16 + i * .12]}><cylinderGeometry args={[.007, .013, 12, 5]}/><meshBasicMaterial color={[1.2, .4, 2]} transparent opacity={.6} toneMapped={false}/></mesh>)}
    <mesh position={[0, .035, -2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3, 29]}/><shaderMaterial vertexShader={vertex} fragmentShader={energy} uniforms={uniforms} transparent blending={AdditiveBlending} depthWrite={false}/></mesh>
    <mesh position={[0, .08, -16]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.9, 64]}/><meshBasicMaterial color="#b252e7" transparent opacity={.18} blending={AdditiveBlending} depthWrite={false}/></mesh>
    <pointLight position={[0, 2.5, -15]} intensity={55} color="#b668f1" distance={22}/>
    <pointLight position={[0, 9, -14]} intensity={65} color="#dfb6ff" distance={20}/>
    {[-10, -22, -32].map((z, i) => <mesh key={z} position={[0, .8 + i * .4, z]} scale={[35, 4, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>)}
    {[-1, 1].map(side => <group key={`cliffs-${side}`}>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[side * (11 + random(i + 81) * 11), 0, -23 - i * 4]}>
        <mesh geometry={cliff} position={[0, 3, 0]} rotation={[0, i * 1.7, 0]} scale={[2 + random(i) * 2, 7 + random(i + 7) * 6, 3]}><meshStandardMaterial color="#393442" roughness={.76} metalness={.15}/></mesh>
        <mesh position={[.5, 4, 1.8]} scale={[1.5, 10, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={energy} uniforms={uniforms} transparent blending={AdditiveBlending} depthWrite={false}/></mesh>
      </group>)}
    </group>)}
  </group>;
}
