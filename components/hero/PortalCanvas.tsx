"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { Color, Group, IcosahedronGeometry, InstancedMesh, MathUtils, MeshBasicMaterial, MeshStandardMaterial, Object3D, Vector2, WebGLRenderTarget, HalfFloatType, Mesh, Points, type Material, type ShaderMaterial } from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { portalFraming } from "./portalFraming";
import { createWetSurface } from "./wetSurface";
import { mineralSurface } from "./mineralSurface";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import PortalParticles from "./PortalParticles";
import { AssemblingMonoliths, GatewayArchitecture } from "./GatewayWorld";
import PortalEnergy from "./PortalEnergy";
import CosmicBackdrop from "./CosmicBackdrop";
import { mistFragment, noise, vertex } from "./portalShaders";
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
  const g = new IcosahedronGeometry(1, 5);
  const positions = g.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const strata = Math.sin(x * 13 + y * 6 + z * 9) * .038 + Math.sin(x * 29 - z * 19) * .016;
    const shape = 1 + .12 * Math.sin(x * 3.8 + y * 3.2 + z * 2.6) + strata;
    positions.setXYZ(i, x * shape, y * shape, z * shape);
  }
  g.deleteAttribute("normal"); g.deleteAttribute("uv");
  const welded = mergeVertices(g, .0001); g.dispose();
  welded.computeVertexNormals();
  return welded;
}

function useRock() {
  const resources = useMemo(() => {
    const geometry = rockGeometry();
    const material = mineralSurface();
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
    const p = sequence.progress;
    const portrait = 1 - smooth(size.width / size.height, .85, 1.35);
    if (!sequence.paused) {
    pointer.current.x = MathUtils.damp(pointer.current.x, sequence.pointerX, 3, Math.min(delta, .05));
    pointer.current.y = MathUtils.damp(pointer.current.y, sequence.pointerY, 3, Math.min(delta, .05));
    }
    const align = MathUtils.smootherstep(p, .20, .45), dive = MathUtils.smootherstep(p, .25, .85), arrive = MathUtils.smootherstep(p, .48, .82);
    // Continuous rail: move into the rift, then settle as the architecture recedes.
    const x = (1 - portrait) * 2.6 * align * (1 - arrive);
    camera.position.set(x + pointer.current.x * .16 * (1 - dive * .85), MathUtils.lerp(1, -.5, arrive) - pointer.current.y * .08, MathUtils.lerp(15, 20, portrait) - dive * MathUtils.lerp(8, 7, portrait));
    camera.lookAt(((1 - portrait) * align * 3.4) * (1 - arrive), MathUtils.lerp(MathUtils.lerp(.8, 1.8, portrait), 2.2, arrive), MathUtils.lerp(-3, -16, arrive));
    camera.updateMatrixWorld();
  }, -.75);
  return null;
}

function Fragments({ sequence, debris = false }: { sequence: PortalState; debris?: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const { geometry, material } = useRock();
  const dummy = useMemo(() => new Object3D(), []);
  const count = debris ? 72 : 24;
  const dynamics = useMemo(() => new Float32Array(count * 2), [count]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const t = sequence.time, p = sequence.progress;
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2 + (debris ? rand(i + 6) * 3 : (rand(i + 77) - .5) * .2) + p * (debris ? .15 : .1);
      const radius = debris ? 4.3 + rand(i + 44) * 4.3 : 3.3 + rand(i + 9) * .48 + (i % 3 === 0 ? 1.15 : 0);
      const target = smooth(p, .25, .79) * (debris ? 3.8 : 2.6) + Math.sin(t * (.2 + rand(i) * .12) + i) * .045;
      if (!sequence.paused) {
        const dt = Math.min(delta, .1), k = i * 2, omega = 10;
        const displacement = dynamics[k] - target;
        const impulse = dynamics[k + 1] + omega * displacement;
        const decay = Math.exp(-omega * dt);
        dynamics[k] = target + (displacement + impulse * dt) * decay;
        dynamics[k + 1] = (dynamics[k + 1] - omega * impulse * dt) * decay;
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
  return <instancedMesh castShadow receiveShadow ref={ref} args={[geometry, material, count]} dispose={null} frustumCulled={false}/>;
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
    const retreat = smooth(p, .4, .82);
    ref.current.position.set(x * (1 + retreat * 2), y + Math.sin(sequence.time * .3 + index * 2) * .16 + retreat * 2, z - retreat * 14);
    ref.current.rotation.y = -.2 + Math.sin(sequence.time * .12 + index) * .06 + p * .2;
  });
  return <group ref={ref} scale={index === 1 ? .8 : 1}>
    <mesh castShadow receiveShadow geometry={geometry} material={material} scale={[.92, 1.3, .67]} position={[0, -.78, 0]} rotation={[0, .4, Math.PI]} dispose={null}/>
    <mesh><cylinderGeometry args={[.72, .8, .13, 7]}/><meshStandardMaterial color="#3a334e" metalness={.55} roughness={.36}/></mesh>
    <instancedMesh castShadow ref={buildings} args={[undefined, undefined, 23]}><boxGeometry/><meshStandardMaterial color="#1e2330" metalness={.32} roughness={.4} emissive={tint} emissiveIntensity={.025}/></instancedMesh>
    <instancedMesh castShadow ref={spires} args={[undefined, undefined, 23]}><coneGeometry args={[1, 1, 4]}/><meshStandardMaterial color="#343948" metalness={.48} roughness={.34} emissive={tint} emissiveIntensity={.035}/></instancedMesh>
    <pointLight position={[0, 1, .4]} color={tint} intensity={4} distance={4}/>
  </group>;
}

function Stars({ sequence }: { sequence: PortalState }) {
  const ref = useRef<Group>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(1050 * 3);
    for (let i = 0; i < 1050; i++) array.set([(rand(i) - .5) * 150, (rand(i + 1400) - .4) * 90, -60 - rand(i + 2700) * 20], i * 3);
    return array;
  }, []);
  useFrame(() => { if (ref.current) ref.current.rotation.z = sequence.time * .0007 + sequence.progress * .018; });
  return <group ref={ref}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]}/></bufferGeometry><pointsMaterial size={.028} color="#cfc6ec" transparent opacity={.6} sizeAttenuation depthWrite={false}/></points></group>;
}

function Foreground({ sequence, compact, balanced }: { sequence: PortalState; compact: boolean; balanced: boolean }) {
  const { geometry, material } = useRock();
  const surfaceMaps = useMemo(createWetSurface, []);
  useEffect(() => () => surfaceMaps.dispose(), [surfaceMaps]);
  const floor = useMemo(() => {
    const arrival = { value: 0 };
    const surface = new MeshStandardMaterial({ color: "#10121b", metalness: .16, roughness: .42, normalMap: surfaceMaps.normal, roughnessMap: surfaceMaps.rough, normalScale: new Vector2(.18, .18) });
    surface.onBeforeCompile = shader => {
      shader.uniforms.uArrival = arrival;
      shader.vertexShader = "varying vec3 vFloor;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvFloor=(modelMatrix*vec4(position,1.)).xyz;");
      shader.fragmentShader = `varying vec3 vFloor; uniform float uArrival;\n${noise}\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        float mineral=noise3(vFloor*vec3(3.,1.,12.));
        vec2 tile=abs(fract(vFloor.xz/2.4)-.5);
        float seam=max(smoothstep(.485,.497,tile.x),smoothstep(.485,.497,tile.y));
        diffuseColor.rgb*=mix(.6+mineral,.24,seam*uArrival);
      `);
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor=.18+mineral*.23;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        float reflection=exp(-abs(vFloor.x+sin(vFloor.z*19.)*.15)*2.5)*(0.1+pow(mineral,3.));
        totalEmissiveRadiance+=vec3(.42,.16,.65)*reflection*uArrival;
      `);
    };
    surface.customProgramCacheKey = () => "tierplay-wet-floor-v1";
    return { surface, arrival };
  }, []);
  useEffect(() => () => floor.surface.dispose(), [floor]);
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  useFrame(() => {
    floor.arrival.value = smooth(sequence.progress, .54, .85);
    if (!ref.current) return;
    for (let i = 0; i < 28; i++) {
      const x = (rand(i + 100) - .5) * 27;
      const a = smooth(sequence.progress, .5, .82);
      dummy.position.set(MathUtils.lerp(x, (i % 2 ? 1 : -1) * (5 + rand(i) * 5), a), -3.9 + rand(i + 22) * .28, MathUtils.lerp(4.5 + rand(i + 200) * 5, 10 - Math.floor(i / 2) * 3, a));
      dummy.rotation.set(.3 * (1 - a), i * 1.3, .12 * (1 - a));
      dummy.scale.set(1.3 + rand(i) * 2, .25 + rand(i + 2) * .5 + a * rand(i + 9) * 1.5, .7 + rand(i + 3)); dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return <>
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]}>
      <planeGeometry args={[100, 100]}/>
      {balanced ? <primitive object={floor.surface} attach="material"/> : <MeshReflectorMaterial resolution={compact ? 256 : 768} blur={compact ? [0, 0] : [32, 16]} mixBlur={.55} mixStrength={1.25} mirror={.35} normalMap={surfaceMaps.normal} normalScale={new Vector2(.18, .18)} roughnessMap={surfaceMaps.rough} color="#10121b" metalness={.16} roughness={.42} depthScale={.25} minDepthThreshold={.5} maxDepthThreshold={1.4}/>}
    </mesh>
    <instancedMesh castShadow receiveShadow ref={ref} args={[geometry, material, 28]} dispose={null} frustumCulled={false}/>
  </>;
}

function Scene({ sequence, onReady, onFailure, onQuality }: Omit<Props, "active"> & { onQuality: (software: boolean) => void }) {
  const { size, gl, invalidate } = useThree();
  const [balanced, setBalanced] = useState(false);
  const [software, setSoftware] = useState(false);
  const frameSample = useRef({ count: 0, duration: 0 });
  const root = useRef<Group>(null);
  const planet = useRef<Mesh>(null);
  const mist = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const compact = size.width / size.height < 1.05;
  const framing = portalFraming(size.width, size.height);
  useEffect(() => { gl.domElement.dataset.quality = balanced ? "balanced" : compact ? "mobile" : "high"; }, [gl, balanced, compact]);
  useEffect(() => {
    const context = gl.getContext();
    const debug = context.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software/i.test(renderer)) { setBalanced(true); setSoftware(true); onQuality(true); }
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
    if (!sequence.paused) { sequence.time += Math.min(delta, .1); invalidate(); }
    if (!balanced && !sequence.paused && delta < .5) {
      frameSample.current.count++; frameSample.current.duration += delta;
      if (frameSample.current.count === 90) {
        if (frameSample.current.duration / 90 > .035) { setBalanced(true); onQuality(false); }
        frameSample.current.count = 0; frameSample.current.duration = 0;
      }
    }
    uniforms.uTime.value = sequence.time;
    if (mist.current) mist.current.uniforms.uTime.value = sequence.time;
    if (root.current) {
      const a = smooth(sequence.progress, .46, .8);
      root.current.position.set(framing.x * (1 - a), MathUtils.lerp(framing.y, .8, a), MathUtils.lerp(-1.5, -16, a));
      root.current.scale.setScalar(MathUtils.lerp(framing.scale, 1, a));
      root.current.rotation.y = -.15 * (1 - a);
    }
    if (planet.current) planet.current.rotation.y = sequence.time * .015 + sequence.progress * .2;
  }, -1);
  return <>
    <color attach="background" args={["#070810"]}/>
    <fog attach="fog" args={["#0b0915", 23, 65]}/>
    <ambientLight intensity={.07}/>
    <directionalLight position={[-8, 14, 8]} color="#e1e5ef" intensity={2.7} castShadow={!balanced} shadow-mapSize-width={compact ? 512 : 2048} shadow-mapSize-height={compact ? 512 : 2048} shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={22} shadow-camera-bottom={-22} shadow-camera-far={70} shadow-normalBias={.035} shadow-bias={-.0002}/>
    <directionalLight position={[7, 7, -15]} color="#b9c9ec" intensity={2.1}/>
    <hemisphereLight args={["#a8b0ce", "#18101e", .24]}/>
    <Environment resolution={256} frames={1}>
      <Lightformer position={[0, 8, 3]} intensity={3} scale={[14, 5, 1]} color="#b9b9d5" rotation={[Math.PI / 2, 0, 0]}/>
      <Lightformer position={[5, 1, 3]} intensity={2.3} scale={[1.1, 12, 1]} color="#c5bbdf" rotation={[0, -Math.PI / 3, 0]}/>
      <Lightformer position={[-8, 3, 0]} intensity={1.5} scale={[4, 8, 1]} color="#b5c4e7" rotation={[0, Math.PI / 2, 0]}/>
    </Environment>
    <CosmicBackdrop sequence={sequence} compact={compact || software}/>
    <Stars sequence={sequence}/>
    <mesh ref={planet} position={[-9, 9, -35]} rotation={[.3, 0, .5]}><sphereGeometry args={[1.2, 40, 24]}/><meshStandardMaterial color="#3a354e" metalness={.15} roughness={.9}/></mesh>
    <group ref={root}>
      <Fragments sequence={sequence} debris/>
      <PortalParticles sequence={sequence} balanced={balanced}/>
      {[0, 1, 2, 3].map(i => <Island key={i} index={i} sequence={sequence}/>)}
    </group>
    <PortalEnergy sequence={sequence} software={software}/>
    <AssemblingMonoliths sequence={sequence}/>
    <GatewayArchitecture sequence={sequence}/>
    <Foreground sequence={sequence} compact={compact} balanced={balanced}/>
    <mesh position={[0, -2.6, -5]} scale={[55, 5, 1]}><planeGeometry/><shaderMaterial ref={mist} vertexShader={vertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>
    <CameraDirector sequence={sequence}/>
    <AtmosphericFinish compact={compact || balanced} disabled={software}/>
  </>;
}

function AtmosphericFinish({ compact, disabled }: { compact: boolean; disabled: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const pipeline = useMemo(() => {
    if (disabled || new URLSearchParams(window.location.search).has("no-post")) return null;
    const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 2 });
    const composer = new EffectComposer(gl, target);
    const render = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new Vector2(256, 256), .16, .35, 1.25);
    const fireComposer = new EffectComposer(gl, new WebGLRenderTarget(1, 1, { type: HalfFloatType }));
    fireComposer.renderToScreen = false;
    const fireRender = new RenderPass(scene, camera);
    // The source blooms display RGB. Calibrate its 130% glow to the shared
    // linear HDR pipeline; copying that gain directly whites out the core.
    const fireBloom = new UnrealBloomPass(new Vector2(256, 256), .55, .1, 0);
    fireComposer.addPass(fireRender); fireComposer.addPass(fireBloom);
    const combine = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, tFire: { value: fireBloom.renderTargetsHorizontal[0].texture } },
      vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "uniform sampler2D tDiffuse;uniform sampler2D tFire;varying vec2 vUv;void main(){vec4 base=texture2D(tDiffuse,vUv);gl_FragColor=vec4(base.rgb+texture2D(tFire,vUv).rgb*vec3(.32,.6,1.),base.a);}",
    });
    const black = new MeshBasicMaterial({ color: 0, side: 2 });
    // ShaderPass clones input uniforms. A render-target texture must retain its
    // GPU attachment identity rather than the empty clone created by that copy.
    combine.uniforms.tFire.value = fireBloom.renderTargetsHorizontal[0].texture;
    const background = new Color(0);
    const output = new OutputPass();
    composer.addPass(render); if (!compact) composer.addPass(bloom); composer.addPass(combine); composer.addPass(output);
    return { composer, render, bloom, output, fireComposer, fireRender, fireBloom, combine, black, background };
  }, [gl, scene, camera, compact, disabled]);
  useEffect(() => {
    if (!pipeline) return;
    pipeline.composer.setPixelRatio(Math.min(gl.getPixelRatio(), 1.5));
    pipeline.composer.setSize(size.width, size.height);
    pipeline.fireComposer.setPixelRatio(1);
    const fireScale = Math.min(1, (compact ? 640 : 1280) / Math.max(size.width, size.height));
    pipeline.fireComposer.setSize(size.width * fireScale, size.height * fireScale);
  }, [pipeline, size.width, size.height, compact, gl]);
  useEffect(() => () => { if (pipeline) {
    pipeline.bloom.dispose(); pipeline.output.dispose(); pipeline.render.dispose(); pipeline.composer.dispose();
    pipeline.fireRender.dispose(); pipeline.fireBloom.dispose(); pipeline.fireComposer.dispose(); pipeline.combine.dispose(); pipeline.black.dispose();
  } }, [pipeline]);
  useFrame((_, delta) => {
    if (!pipeline) { gl.render(scene, camera); return; }
    const replaced: [Mesh, Material | Material[]][] = [];
    const hidden: Points[] = [];
    const background = scene.background;
    const shadowUpdate = gl.shadowMap.autoUpdate;
    // Restore every borrowed scene property even if the offscreen render fails.
    try {
      scene.background = pipeline.background;
      gl.shadowMap.autoUpdate = false;
      scene.traverseVisible(object => {
        if (object instanceof Mesh && !object.userData.fireballBloom) {
          replaced.push([object, object.material]); object.material = pipeline.black;
        } else if (object instanceof Points) { hidden.push(object); object.visible = false; }
      });
      pipeline.fireComposer.render(delta);
    } finally {
      for (const [mesh, material] of replaced) mesh.material = material;
      for (const points of hidden) points.visible = true;
      scene.background = background;
      gl.shadowMap.autoUpdate = shadowUpdate;
    }
    pipeline.composer.render(delta);
  }, 1);
  return null;
}

export default function PortalCanvas({ sequence, active, onReady, onFailure }: Props) {
  const [quality, setQuality] = useState<"high" | "balanced" | "software">("high");
  const onQuality = useMemo(() => (software: boolean) => setQuality(software ? "software" : "balanced"), []);
  return <Boundary onFailure={onFailure}><Canvas shadows frameloop={active ? "demand" : "never"} dpr={quality === "high" ? [1, 1.75] : 1} camera={{ position: [0, 1, 15], fov: 46, near: .1, far: 100 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} fallback="The original Tierplay artwork is available without WebGL.">
    <Scene sequence={sequence} onReady={onReady} onFailure={onFailure} onQuality={onQuality}/>
  </Canvas></Boundary>;
}
