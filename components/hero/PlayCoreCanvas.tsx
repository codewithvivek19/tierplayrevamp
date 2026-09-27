"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { AdditiveBlending, BufferAttribute, DoubleSide, Group, IcosahedronGeometry, InstancedMesh, MathUtils, Mesh, MeshStandardMaterial, Object3D, PMREMGenerator, SRGBColorSpace, TextureLoader } from "three";
import { type CoreState, worlds } from "./coreState";

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const smooth = (value: number, min: number, max: number) => MathUtils.smoothstep(value, min, max);

function CameraDirector({ sequence }: { sequence: CoreState }) {
  const { camera, size, invalidate } = useThree();
  const position = useRef({ p: 0, x: 0, y: 0 });
  useFrame((_, delta) => {
    const state = position.current;
    state.p = MathUtils.damp(state.p, sequence.progress, 9, Math.min(delta, .05));
    state.x = MathUtils.damp(state.x, sequence.pointerX, 5, Math.min(delta, .05));
    state.y = MathUtils.damp(state.y, sequence.pointerY, 5, Math.min(delta, .05));
    const mobile = size.width < 900;
    const dive = smooth(state.p, .65, .87);
    camera.position.set(state.x * .22 + dive * (mobile ? 0 : 1.8), -state.y * .13, 9 - dive * 5);
    camera.lookAt(mobile ? 0 : dive * 1.5, 0, 0);
    if (Math.abs(state.p - sequence.progress) + Math.abs(state.x - sequence.pointerX) + Math.abs(state.y - sequence.pointerY) > .0004) invalidate();
  });
  return null;
}

function SceneEnvironment({ sequence, onReady, onFailure }: { sequence: CoreState; onReady: () => void; onFailure: () => void }) {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, .04);
    const previous = scene.environment;
    scene.environment = target.texture;
    room.dispose(); generator.dispose();
    sequence.invalidate = invalidate;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    invalidate(); onReady();
    return () => {
      scene.environment = previous; target.dispose();
      sequence.invalidate = undefined;
      gl.domElement.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, scene, invalidate, sequence, onReady, onFailure]);
  return null;
}

function FracturedNucleus({ sequence }: { sequence: CoreState }) {
  const mesh = useRef<Mesh>(null);
  const uniform = useMemo(() => ({ value: .02 }), []);
  const { geometry, material } = useMemo(() => {
    const geometry = new IcosahedronGeometry(1.1, 1);
    const vertices = geometry.getAttribute("position");
    const centroids = new Float32Array(vertices.count * 3);
    for (let i = 0; i < vertices.count; i += 3) {
      const x = (vertices.getX(i) + vertices.getX(i + 1) + vertices.getX(i + 2)) / 3;
      const y = (vertices.getY(i) + vertices.getY(i + 1) + vertices.getY(i + 2)) / 3;
      const z = (vertices.getZ(i) + vertices.getZ(i + 1) + vertices.getZ(i + 2)) / 3;
      for (let j = 0; j < 3; j++) centroids.set([x, y, z], (i + j) * 3);
    }
    geometry.setAttribute("aCentroid", new BufferAttribute(centroids, 3));
    const material = new MeshStandardMaterial({ color: "#64777f", metalness: .96, roughness: .2, flatShading: true, side: DoubleSide, envMapIntensity: 1.25 });
    material.onBeforeCompile = shader => {
      shader.uniforms.uOpen = uniform;
      shader.vertexShader = "attribute vec3 aCentroid; uniform float uOpen;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "vec3 transformed = aCentroid + (position - aCentroid) * .94 + normalize(aCentroid) * uOpen;");
    };
    material.customProgramCacheKey = () => "tierplay-fractured-core-v1";
    return { geometry, material };
  }, [uniform]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame(() => {
    const p = sequence.progress;
    uniform.value = .025 + smooth(p, .18, .55) * .25 + smooth(p, .62, .86) * 3.5;
    if (mesh.current) mesh.current.rotation.set(.3 + p * 1.4, -.4 + p * 2.1, .15 + sequence.pointerX * .04);
  });
  return <group>
    <mesh ref={mesh} geometry={geometry} material={material} dispose={null}/>
    <mesh><icosahedronGeometry args={[.94, 2]}/><meshBasicMaterial color="#30d2db"/></mesh>
    <mesh scale={1.08}><icosahedronGeometry args={[1.1, 1]}/><meshBasicMaterial color="#98ffff" wireframe transparent opacity={.09} blending={AdditiveBlending} depthWrite={false}/></mesh>
  </group>;
}

function OrbitalRing({ index, sequence }: { index: number; sequence: CoreState }) {
  const group = useRef<Group>(null);
  const ticks = useRef<InstancedMesh>(null);
  const radius = 1.65 + index * .42;
  const transform = useMemo(() => new Object3D(), []);
  useEffect(() => {
    if (!ticks.current) return;
    for (let i = 0; i < 64; i++) {
      const angle = i / 64 * Math.PI * 2;
      transform.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      transform.rotation.set(0, 0, angle);
      transform.scale.set(i % 8 === 0 ? .16 : .07, .018, .055);
      transform.updateMatrix(); ticks.current.setMatrixAt(i, transform.matrix);
    }
    ticks.current.instanceMatrix.needsUpdate = true;
  }, [radius, transform]);
  useFrame(() => {
    if (!group.current) return;
    const p = sequence.progress;
    const open = smooth(p, .2, .65);
    group.current.rotation.set(.45 + index * .65 + p * (index % 2 ? -1.8 : 1.4), -.3 + index * .48 + p * .8, -.6 + index * .7 + p * 1.7);
    group.current.position.z = Math.sin(index * 2) * open * 1.2;
    group.current.scale.setScalar(1 + open * .2 + smooth(p, .7, .9) * 1.2);
  });
  return <group ref={group}>
    <mesh><torusGeometry args={[radius, .072 - index * .01, 8, 128]}/><meshStandardMaterial color="#74858d" metalness={1} roughness={.27} envMapIntensity={2}/></mesh>
    <mesh position={[0,0,.032]}><torusGeometry args={[radius + .035, .008, 4, 128, Math.PI * 1.7]}/><meshBasicMaterial color={index === 1 ? "#ffbd79" : "#6cfff1"}/></mesh>
    <mesh rotation={[0,0,1.8]}><torusGeometry args={[radius - .08, .017, 4, 100, Math.PI * .8]}/><meshBasicMaterial color="#27363d"/></mesh>
    <instancedMesh ref={ticks} args={[undefined, undefined, 64]} frustumCulled={false}><boxGeometry args={[1,1,1]}/><meshStandardMaterial color="#c3ccce" metalness={.8} roughness={.35}/></instancedMesh>
  </group>;
}

function ShardField({ sequence }: { sequence: CoreState }) {
  const ref = useRef<InstancedMesh>(null);
  const transform = useMemo(() => new Object3D(), []);
  useFrame(() => {
    if (!ref.current) return;
    const p = sequence.progress;
    for (let i = 0; i < 100; i++) {
      const angle = i * 2.399963 + p * .7;
      const radius = 2.65 + (i % 11) * .19 + smooth(p, .65, .87) * 8;
      transform.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * .7, Math.sin(i * 8.13) * 1.8 - .7);
      transform.rotation.set(i + p, angle, i * .33);
      const size = .006 + (i % 7) * .0025;
      transform.scale.set(size, size * (i % 9 === 0 ? 4 : 1.4), size);
      transform.updateMatrix(); ref.current.setMatrixAt(i, transform.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[undefined,undefined,100]} frustumCulled={false}><octahedronGeometry args={[1,0]}/><meshBasicMaterial color="#497b7b"/></instancedMesh>;
}

function GameArtifact({ index, sequence }: { index: number; sequence: CoreState }) {
  const texture = useLoader(TextureLoader, worlds[index].image);
  const group = useRef<Group>(null);
  useEffect(() => { texture.colorSpace = SRGBColorSpace; }, [texture]);
  useFrame(() => {
    const object = group.current;
    if (!object) return;
    const p = sequence.progress;
    const show = smooth(p,.22,.38) * (1 - smooth(p,.65,.78));
    const a = index / 6 * Math.PI * 2 + .25 + p * .35;
    const chosen = sequence.selected === index;
    object.visible = show > .001;
    object.position.set(Math.cos(a) * 3.1, Math.sin(a) * 2.55, chosen ? 1.2 : -.5);
    object.rotation.set(-.12, Math.cos(a) * -.25, Math.sin(a) * .08);
    object.scale.setScalar(show * (chosen ? 1.12 : .78));
  });
  return <group ref={group}>
    <mesh><boxGeometry args={[1.22,1.04,.09]}/><meshStandardMaterial color={worlds[index].color} metalness={.85} roughness={.22}/></mesh>
    <mesh position={[0,0,.051]}><planeGeometry args={[1.14,.956]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
    <mesh position={[0,-.59,0]}><boxGeometry args={[.35,.015,.01]}/><meshBasicMaterial color={worlds[index].color}/></mesh>
  </group>;
}

function PlayCore({ sequence }: { sequence: CoreState }) {
  const group = useRef<Group>(null);
  const { size } = useThree();
  useFrame(() => {
    if (!group.current) return;
    const mobile = size.width < 900;
    const p = sequence.progress;
    group.current.position.set(mobile ? 0 : 1.95 - smooth(p,.2,.5) * .25, mobile ? 1.4 : .12, 0);
    group.current.rotation.set(sequence.pointerY * .035, sequence.pointerX * .08, -.06);
    const unfold = smooth(p, .2, .43);
    group.current.scale.setScalar(mobile ? Math.min(.62, size.width / size.height * 1.2) - unfold * .15 : 1 - unfold * .2);
  });
  return <group ref={group}>
    <FracturedNucleus sequence={sequence}/>
    {[0,1,2].map(index => <OrbitalRing key={index} index={index} sequence={sequence}/>)}
    <ShardField sequence={sequence}/>
    <Suspense fallback={null}>{worlds.map((_,index) => <GameArtifact key={index} index={index} sequence={sequence}/>)}</Suspense>
  </group>;
}

export default function PlayCoreCanvas({ sequence, onReady, onFailure }: { sequence: CoreState; onReady: () => void; onFailure: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useVisibility(container);
  return <SceneBoundary onFailure={onFailure}><div ref={container} className="core-canvas"><Canvas
    frameloop={active ? "demand" : "never"} dpr={[1,1.5]} camera={{ position: [0,0,9], fov: 42, near: .1, far: 60 }}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} fallback="Interactive 3D artwork unavailable."
    onCreated={({ gl }) => { gl.setClearColor(0x000000,0); setActive(!document.hidden); }}>
    <ambientLight intensity={.3}/><directionalLight position={[1,5,5]} intensity={3} color="#dae8f5"/>
    <pointLight position={[5,1,3]} intensity={24} color="#3af5dd"/><pointLight position={[-3,-2,2]} intensity={18} color="#ff984c"/>
    <PlayCore sequence={sequence}/><CameraDirector sequence={sequence}/><SceneEnvironment sequence={sequence} onReady={onReady} onFailure={onFailure}/>
  </Canvas></div></SceneBoundary>;
}

function useVisibility(ref: RefObject<HTMLDivElement | null>) {
  const [active,setActive] = useState(true);
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange",update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange",update); };
  }, [ref]);
  return [active,setActive] as const;
}
