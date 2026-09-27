"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { AdditiveBlending, Color, Group, IcosahedronGeometry, InstancedMesh, MathUtils, MeshStandardMaterial, Object3D, Vector2, type Mesh } from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import PortalParticles from "./PortalParticles";
import { atmosphereFragment, beamFragment, glowFragment, mistFragment, noise, portalFragment, vertex } from "./portalShaders";
import type { PortalState } from "./portalState";

type Props = { sequence: PortalState; active: boolean; onReady: () => void; onFailure: () => void };
const rand = (i: number) => MathUtils.euclideanModulo(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1);
const smooth = MathUtils.smoothstep;

class Boundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function rockGeometry() {
  const g = new IcosahedronGeometry(1, 3);
  const positions = g.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const strata = Math.sin(x * 13 + y * 6 + z * 9) * .07 + Math.sin(x * 29 - z * 19) * .025;
    const shape = 1 + .2 * Math.sin(x * 3.8 + y * 7.2 + z * 2.6) + strata;
    positions.setXYZ(i, x * shape, y * shape, z * shape);
  }
  g.computeVertexNormals();
  return g;
}

function useRock() {
  const resources = useMemo(() => {
    const geometry = rockGeometry();
    const material = new MeshStandardMaterial({ color: "#18171d", metalness: .5, roughness: .36, envMapIntensity: .75 });
    material.onBeforeCompile = shader => {
      shader.vertexShader = "varying vec3 vRock;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvRock=position;");
      shader.fragmentShader = "varying vec3 vRock;\n" + noise + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        float stone=noise3(vRock*12.); float veins=pow(1.-abs(sin(vRock.y*36.+stone*9.)),22.);
        diffuseColor.rgb*=.35+stone*1.25; diffuseColor.rgb+=vec3(.035,.012,.065)*veins;
      `);
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor=clamp(.23+stone*.6,.2,.85);");
    };
    material.customProgramCacheKey = () => "tierplay-obsidian-v1";
    return { geometry, material };
  }, []);
  useEffect(() => () => { resources.geometry.dispose(); resources.material.dispose(); }, [resources]);
  return resources;
}

// The only component allowed to mutate the scene camera.
function CameraDirector({ sequence }: { sequence: PortalState }) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  useFrame((_, delta) => {
    const p = sequence.progress, mobile = size.width < 750;
    pointer.current.x = MathUtils.damp(pointer.current.x, sequence.pointerX, 3, Math.min(delta, .05));
    pointer.current.y = MathUtils.damp(pointer.current.y, sequence.pointerY, 3, Math.min(delta, .05));
    const align = smooth(p, .08, .62), dive = smooth(p, .35, .87);
    camera.position.set(align * (mobile ? 0 : 3.7) + pointer.current.x * .2 * (1 - dive), 1 + align * (mobile ? 1.3 : -.15) - pointer.current.y * .12, (mobile ? 18.5 : 15) - dive * (mobile ? 17.7 : 14.2));
    camera.lookAt(mobile ? 0 : align * 3.7, mobile ? 1.3 + align : .35 + align * .5, -2);
  });
  return null;
}

function Fragments({ sequence, debris = false }: { sequence: PortalState; debris?: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const { geometry, material } = useRock();
  const dummy = useMemo(() => new Object3D(), []);
  const count = debris ? 120 : 38;
  const dynamics = useMemo(() => new Float32Array(count * 2), [count]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const t = sequence.time, p = sequence.progress;
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2 + (debris ? rand(i + 6) * 3 : (rand(i + 77) - .5) * .2) + p * (debris ? .15 : .1);
      const radius = debris ? 4.3 + rand(i + 44) * 4.3 : 3.3 + rand(i + 9) * .48 + (i % 3 === 0 ? 1.15 : 0);
      const target = smooth(p, .25, .79) * (debris ? 3.8 : 2.6) + Math.sin(t * (.2 + rand(i) * .12) + i) * .045;
      if (!sequence.paused) {
        const dt = Math.min(delta, .025), k = i * 2;
        dynamics[k + 1] = (dynamics[k + 1] + (target - dynamics[k]) * 22 * dt) * Math.exp(-7 * dt);
        dynamics[k] += dynamics[k + 1] * dt;
      }
      const release = dynamics[i * 2];
      dummy.position.set(Math.cos(angle) * (radius + release), Math.sin(angle) * (radius + release) * 1.14 + Math.sin(t * .25 + i) * .06, (rand(i + 12) - .5) * (debris ? 6 : 1.3) + release * Math.sin(i) * .4);
      dummy.rotation.set(rand(i + 8) * .45 + Math.sin(t * .12 + i) * .04, rand(i) * .8 + release * (rand(i + 1) - .5) * .4, angle + (rand(i + 3) - .5) * .65);
      const s = debris ? .016 + Math.pow(rand(i + 7), 4) * .2 : .24 + rand(i + 3) * .34;
      dummy.scale.set(s * .65, s * (debris ? 1.8 : 2.6), s * .38);
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[geometry, material, count]} dispose={null} frustumCulled={false}/>;
}

function PortalEnergy({ sequence }: { sequence: PortalState }) {
  const disc = useRef<Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 } }), []);
  const halo = useMemo(() => ({ uColor: { value: new Color("#7d36ea") } }), []);
  useFrame(() => { uniforms.uTime.value = sequence.time; uniforms.uProgress.value = sequence.progress; if (disc.current) disc.current.rotation.z = -.18 + sequence.progress * .4; });
  return <>
    <mesh position={[0, 0, -.7]} scale={[12, 13, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={glowFragment} uniforms={halo} transparent blending={AdditiveBlending} depthWrite={false}/></mesh>
    <mesh ref={disc} scale={[6.8, 7.8, 1]} position={[0, 0, -.12]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={portalFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>
    <mesh scale={[1, 1.15, 1]} rotation={[0, 0, -.18]}><torusGeometry args={[3.02, .013, 6, 192]}/><meshBasicMaterial color={[1.5, .55, 2.2]} toneMapped={false}/></mesh>
    <mesh scale={[7, 23, 1]} position={[0, 5, -.4]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={beamFragment} uniforms={uniforms} transparent blending={AdditiveBlending} depthWrite={false}/></mesh>
    <pointLight color="#aa70ed" intensity={38} distance={14} decay={2} position={[0, 0, 1.5]}/>
    <pointLight color="#bbc4ff" intensity={25} distance={11} position={[0, 2, -1]}/>
  </>;
}

function EnergyOrbits({ sequence }: { sequence: PortalState }) {
  const rings = useRef<Group>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(() => {
    if (!rings.current) return;
    rings.current.rotation.y = sequence.progress * .7 + Math.sin(sequence.time * .12) * .08;
    rings.current.rotation.z = -.24 + sequence.progress * .16;
    uniforms.uTime.value = sequence.time;
  });
  return <group ref={rings}>
    {[0, 1, 2].map(i => <group key={i} rotation={[1.08 + i * .29, .12 - i * .1, i * .32]}>
      <mesh><torusGeometry args={[4.7 + i * .7, .009, 4, 180]}/><shaderMaterial vertexShader={vertex} fragmentShader={`varying vec2 vUv; uniform float uTime; void main(){float head=pow(fract(vUv.x-uTime*.025),18.);gl_FragColor=vec4(mix(vec3(.32,.2,.6),vec3(1.8,.9,1.6),head),.22+head*.7);}`} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}/></mesh>
      <mesh><torusGeometry args={[4.7 + i * .7, .045, 4, 128]}/><meshBasicMaterial color="#aa35d5" transparent opacity={.055} depthWrite={false} blending={AdditiveBlending}/></mesh>
    </group>)}
  </group>;
}

function Island({ sequence, index }: { sequence: PortalState; index: number }) {
  const ref = useRef<Group>(null);
  const buildings = useRef<InstancedMesh>(null);
  const spires = useRef<InstancedMesh>(null);
  const { geometry, material } = useRock();
  const positions = [[-4.3, -1.2, 0], [-3.5, 3.4, -3.4], [4.8, 1.2, -2], [4.1, -2.2, 1.2]];
  const tint = ["#8cc9ff", "#baafff", "#7989ff", "#e7a487"][index];
  useEffect(() => {
    const dummy = new Object3D();
    for (let i = 0; i < 23; i++) {
      const a = i * 2.4, r = Math.sqrt(i / 23) * .7, h = .14 + Math.pow(rand(i + index * 30), 2) * .8;
      dummy.position.set(Math.cos(a) * r, .1 + h / 2, Math.sin(a) * r * .65);
      dummy.scale.set(.045 + rand(i) * .045, h, .05 + rand(i + 2) * .04); dummy.updateMatrix(); buildings.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.y = .1 + h + h * .16; dummy.scale.set(.07, h * .4, .07); dummy.updateMatrix(); spires.current?.setMatrixAt(i, dummy.matrix);
    }
    if (buildings.current) buildings.current.instanceMatrix.needsUpdate = true;
    if (spires.current) spires.current.instanceMatrix.needsUpdate = true;
  }, [index]);
  useFrame(() => {
    if (!ref.current) return;
    const [x, y, z] = positions[index], p = sequence.progress;
    ref.current.position.set(x * (1 + p * .28), y + Math.sin(sequence.time * .3 + index * 2) * .16, z + p * .9);
    ref.current.rotation.y = -.2 + Math.sin(sequence.time * .12 + index) * .06 + p * .2;
  });
  return <group ref={ref} scale={index === 1 ? .8 : 1}>
    <mesh geometry={geometry} material={material} scale={[.92, 1.3, .67]} position={[0, -.78, 0]} rotation={[0, .4, Math.PI]} dispose={null}/>
    <mesh><cylinderGeometry args={[.72, .8, .13, 7]}/><meshStandardMaterial color="#3a334e" metalness={.55} roughness={.36}/></mesh>
    <instancedMesh ref={buildings} args={[undefined, undefined, 23]}><boxGeometry/><meshStandardMaterial color="#34394d" metalness={.65} roughness={.29} emissive={tint} emissiveIntensity={.13}/></instancedMesh>
    <instancedMesh ref={spires} args={[undefined, undefined, 23]}><coneGeometry args={[1, 1, 4]}/><meshStandardMaterial color="#595d73" metalness={.6} roughness={.22} emissive={tint} emissiveIntensity={.12}/></instancedMesh>
    <pointLight position={[0, 1, .4]} color={tint} intensity={4} distance={4}/>
  </group>;
}

function Stars({ sequence }: { sequence: PortalState }) {
  const ref = useRef<Group>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(1050 * 3);
    for (let i = 0; i < 1050; i++) array.set([(rand(i) - .5) * 65, (rand(i + 1400) - .4) * 38, -12 - rand(i + 2700) * 20], i * 3);
    return array;
  }, []);
  useFrame(() => { if (ref.current) ref.current.rotation.z = sequence.time * .0007 + sequence.progress * .018; });
  return <group ref={ref}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]}/></bufferGeometry><pointsMaterial size={.028} color="#cfc6ec" transparent opacity={.6} sizeAttenuation depthWrite={false}/></points></group>;
}

function Foreground({ sequence, compact }: { sequence: PortalState; compact: boolean }) {
  const { geometry, material } = useRock();
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < 28; i++) {
      const x = (rand(i + 100) - .5) * 27;
      dummy.position.set(x, -3.9 + rand(i + 22) * .28, 4.5 + rand(i + 200) * 5 + sequence.progress * 2);
      dummy.rotation.set(.3, i * 1.3, .12);
      dummy.scale.set(1.3 + rand(i) * 2, .25 + rand(i + 2) * .5, .7 + rand(i + 3)); dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]}>
      <planeGeometry args={[100, 100]}/>
      {compact ? <meshStandardMaterial color="#14121d" metalness={.75} roughness={.28}/> : <MeshReflectorMaterial resolution={256} blur={[120, 60]} mixBlur={1} mixStrength={5} mirror={.75} color="#302a39" metalness={.65} roughness={.24} depthScale={.15} minDepthThreshold={.7} maxDepthThreshold={1.3}/>}
    </mesh>
    <instancedMesh ref={ref} args={[geometry, material, 28]} dispose={null} frustumCulled={false}/>
    {[5.4, 6, 6.8, 8.7, 11].map((r, i) => <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[3.5, -3.77 + i * .002, -1]}><ringGeometry args={[r, r + .023, 128]}/><meshBasicMaterial color="#78628c" transparent opacity={.24}/></mesh>)}
  </>;
}

function Scene({ sequence, onReady, onFailure, onQuality }: Omit<Props, "active"> & { onQuality: (software: boolean) => void }) {
  const { size, gl, invalidate } = useThree();
  const [balanced, setBalanced] = useState(false);
  const frameSample = useRef({ count: 0, duration: 0 });
  const root = useRef<Group>(null);
  const planet = useRef<Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const compact = size.width < 750;
  useEffect(() => {
    const context = gl.getContext();
    const debug = context.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software/i.test(renderer)) { setBalanced(true); onQuality(true); }
  }, [gl, onQuality]);
  useEffect(() => {
    sequence.invalidate = invalidate;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    invalidate();
    // Canvas is revealed after it has had a chance to compile and draw.
    let secondFrame = 0;
    const frame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(onReady); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame); sequence.invalidate = undefined; gl.domElement.removeEventListener("webglcontextlost", lost); };
  }, [gl, invalidate, onFailure, onReady, sequence]);
  useFrame((_, delta) => {
    if (!sequence.paused) { sequence.time += Math.min(delta, .04); invalidate(); }
    if (!balanced && !sequence.paused && delta < .5) {
      frameSample.current.count++; frameSample.current.duration += delta;
      if (frameSample.current.count === 90) {
        if (frameSample.current.duration / 90 > .035) { setBalanced(true); onQuality(false); }
        frameSample.current.count = 0; frameSample.current.duration = 0;
      }
    }
    uniforms.uTime.value = sequence.time;
    if (root.current) {
      root.current.position.set(compact ? 0 : 3.9, compact ? 3.1 : .8, -1.5);
      root.current.scale.setScalar(compact ? .72 : 1);
      root.current.rotation.y = -.15 + sequence.progress * .14;
    }
    if (planet.current) planet.current.rotation.y = sequence.time * .015 + sequence.progress * .2;
  }, -1);
  return <>
    <color attach="background" args={["#070810"]}/>
    <fog attach="fog" args={["#0b0915", 23, 65]}/>
    <ambientLight intensity={.17}/>
    <directionalLight position={[-4, 8, 3]} color="#c5c8ed" intensity={2.6}/>
    <directionalLight position={[7, 4, -3]} color="#b1a0d8" intensity={2.2}/>
    <Environment resolution={128} frames={1}>
      <Lightformer position={[0, 8, 3]} intensity={3} scale={[14, 5, 1]} color="#b9b9d5" rotation={[Math.PI / 2, 0, 0]}/>
      <Lightformer position={[5, 1, 3]} intensity={3} scale={[3, 12, 1]} color="#b490e8" rotation={[0, -Math.PI / 3, 0]}/>
      <Lightformer position={[-8, 3, 0]} intensity={1.5} scale={[4, 8, 1]} color="#b5c4e7" rotation={[0, Math.PI / 2, 0]}/>
    </Environment>
    <mesh position={[0, 3, -35]} scale={[85, 50, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={atmosphereFragment} uniforms={uniforms} depthWrite={false}/></mesh>
    <Stars sequence={sequence}/>
    <mesh ref={planet} position={[-4.4, 3.7, -8]} rotation={[.3, 0, .5]}><sphereGeometry args={[.45, 40, 24]}/><meshStandardMaterial color="#3a354e" metalness={.15} roughness={.9}/></mesh>
    <group ref={root}>
      <PortalEnergy sequence={sequence}/><Fragments sequence={sequence}/><Fragments sequence={sequence} debris/>
      <PortalParticles sequence={sequence} balanced={balanced}/>
      <EnergyOrbits sequence={sequence}/>
      {[0, 1, 2, 3].map(i => <Island key={i} index={i} sequence={sequence}/>)}
    </group>
    <Foreground sequence={sequence} compact={compact || balanced}/>
    <mesh position={[0, -2.6, -5]} scale={[55, 5, 1]}><planeGeometry/><shaderMaterial vertexShader={vertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>
    <CameraDirector sequence={sequence}/>
    <AtmosphericFinish compact={compact || balanced}/>
  </>;
}

function AtmosphericFinish({ compact }: { compact: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const pipeline = useMemo(() => {
    if (compact) return null;
    const composer = new EffectComposer(gl);
    const render = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new Vector2(256, 256), .28, .65, .85);
    const output = new OutputPass();
    composer.addPass(render); composer.addPass(bloom); composer.addPass(output);
    return { composer, render, bloom, output };
  }, [gl, scene, camera, compact]);
  useEffect(() => {
    if (!pipeline) return;
    pipeline.composer.setPixelRatio(1);
    pipeline.composer.setSize(size.width, size.height);
  }, [pipeline, size.width, size.height, compact]);
  useEffect(() => () => { if (pipeline) { pipeline.bloom.dispose(); pipeline.output.dispose(); pipeline.render.dispose(); pipeline.composer.dispose(); } }, [pipeline]);
  useFrame((_, delta) => { if (pipeline) pipeline.composer.render(delta); else gl.render(scene, camera); }, 1);
  return null;
}

export default function PortalCanvas({ sequence, active, onReady, onFailure }: Props) {
  const [quality, setQuality] = useState<"high" | "balanced" | "software">("high");
  const onQuality = useMemo(() => (software: boolean) => setQuality(software ? "software" : "balanced"), []);
  return <Boundary onFailure={onFailure}><Canvas frameloop={active ? "demand" : "never"} dpr={quality === "software" ? .65 : quality === "balanced" ? 1 : [1, 1.35]} camera={{ position: [0, 1, 15], fov: 46, near: .1, far: 100 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} fallback="The original Tierplay artwork is available without WebGL.">
    <Scene sequence={sequence} onReady={onReady} onFailure={onFailure} onQuality={onQuality}/>
  </Canvas></Boundary>;
}
