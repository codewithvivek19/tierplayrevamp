"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  AdditiveBlending, CanvasTexture, Color, DirectionalLight, Group, HalfFloatType, HemisphereLight, MathUtils, Mesh, MeshBasicMaterial,
  Object3D, PCFShadowMap, RectAreaLight, SRGBColorSpace, SpotLight, Vector2, Vector3, WebGLRenderTarget,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { anchorKeys, buildCabinet, cabinetSpecs, type BuiltCabinet, type CabinetId } from "./cabinetModels";

export type StagePose = {
  yaw: number;
  pitch: number;
  distance: number;
  targetY: number;
  offsetX: number;
  lift: number;
  glow: number;
  drag: number;
  dragPitch: number;
  zoom: number;
  pointerX: number;
  pointerY: number;
  float: number;
  /** 0 = off, 1 = on. The screen powers on with a scan line when this rises. */
  power: number;
  /** Lighting preset blend: 0 studio, 1 casino floor, 2 lights out (the pointer becomes a torch). */
  lights: number;
  anchor: string | null;
};

export const defaultPose = (): StagePose => ({
  yaw: -0.45, pitch: 0.1, distance: 6.2, targetY: 1.2, offsetX: 0, lift: 0, glow: 1,
  drag: 0, dragPitch: 0, zoom: 1, pointerX: 0, pointerY: 0, float: 1, power: 1, lights: 0, anchor: null,
});

/** Screen-space pins for every anchor of the shown cabinet: [x, y, facing] triples in `anchorKeys(cabinet)` order. */
export type ProjectAll = (points: Float32Array, cabinet: CabinetId) => void;

type StageProps = {
  cabinet: CabinetId;
  /** Show both cabinets side by side at equal height (lineup), instead of one at a time. */
  pair?: boolean;
  pose: MutableRefObject<StagePose>;
  active: boolean;
  still?: boolean;
  compact?: boolean;
  onProjectAll?: ProjectAll;
  onReady?: () => void;
  onFailure: () => void;
};

class StageBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,.5)");
  gradient.addColorStop(0.55, "rgba(255,255,255,.1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

type Entry = { built: BuiltCabinet; root: Group; mirror: Group | null; spill: RectAreaLight; floor: Mesh };
type Registry = Partial<Record<CabinetId, Entry>>;

function CabinetModel({ id, registry, compact, onLoaded }: { id: CabinetId; registry: MutableRefObject<Registry>; compact?: boolean; onLoaded: (id: CabinetId) => void }) {
  const spec = cabinetSpecs[id];
  const { scene } = useGLTF(spec.url);
  const { gl, invalidate } = useThree();
  const built = useMemo(() => buildCabinet(scene, spec), [scene, spec]);
  const glow = useMemo(glowTexture, []);
  const root = useRef<Group>(null);
  const mirror = useRef<Group>(null);
  const spill = useRef<RectAreaLight>(null);
  const floor = useRef<Mesh>(null);
  const loadedRef = useRef(onLoaded);
  loadedRef.current = onLoaded;

  useEffect(() => {
    built.materials.forEach((material) => {
      const map = (material as { emissiveMap?: { anisotropy: number } | null }).emissiveMap;
      if (map) map.anisotropy = gl.capabilities.getMaxAnisotropy();
    });
    registry.current[id] = { built, root: root.current!, mirror: mirror.current, spill: spill.current!, floor: floor.current! };
    loadedRef.current(id);
    invalidate();
    return () => {
      delete registry.current[id];
      built.geometries.forEach((g) => g.dispose());
      built.materials.forEach((m) => m.dispose());
      glow.dispose();
    };
  }, [built, glow, gl, id, registry, invalidate]);

  const { position, size, color } = spec.screen.spill;
  return <>
    <group ref={root} visible={false}>
      <primitive object={built.group} />
      {/* The screen washes the deck and controls in front of it. */}
      <rectAreaLight ref={spill} position={position as [number, number, number]} rotation-y={Math.PI} width={size[0]} height={size[1]} color={color} intensity={0} />
    </group>
    {!compact ? <group ref={mirror} visible={false} scale={[1, -1, 1]}><primitive object={built.mirror} /></group> : null}
    <mesh ref={floor} rotation-x={-Math.PI / 2} position-y={0.004} renderOrder={1} visible={false}>
      <planeGeometry args={[3.6 * spec.fit, 3.6 * spec.fit]} />
      <meshBasicMaterial map={glow} color={spec.floorTint} transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  </>;
}

/** Lighting presets, blended by `pose.lights`: studio, casino floor, lights out. */
const PRESETS = {
  hemi: [0.32, 0.1, 0.015],
  key: [3.3, 1.3, 0],
  rimViolet: [2.6, 3.8, 0.55],
  rimCyan: [2.1, 3.1, 0.4],
  fill: [0.45, 0.9, 0],
  env: [1, 0.42, 0.06],
  torch: [1.1, 1.6, 9],
  sweep: [1.1, 0.7, 0],
  spill: [2.4, 4.5, 6],
} as const;
const blend = (values: readonly number[], t: number) => {
  const i = Math.min(1, Math.floor(t)), f = MathUtils.clamp(t - i, 0, 1);
  return values[i] + (values[i + 1] - values[i]) * f;
};

function Bloom({ compact, gain }: { compact?: boolean; gain: MutableRefObject<number> }) {
  const { gl, scene, camera, size, viewport } = useThree();
  const [composer, bloom] = useMemo(() => {
    const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: compact ? 0 : 4 });
    const result = new EffectComposer(gl, target);
    result.addPass(new RenderPass(scene, camera));
    // Threshold 1 in linear HDR: only LED lenses and the brightest screen pixels bloom.
    const pass = new UnrealBloomPass(new Vector2(256, 256), 0.5, 0.42, 1);
    result.addPass(pass);
    result.addPass(new OutputPass());
    return [result, pass] as const;
  }, [gl, scene, camera, compact]);
  useEffect(() => {
    composer.setPixelRatio(viewport.dpr);
    composer.setSize(size.width, size.height);
  }, [composer, size, viewport.dpr]);
  useEffect(() => () => { composer.renderTarget1.dispose(); composer.renderTarget2.dispose(); composer.dispose(); }, [composer]);
  useFrame((_, delta) => { bloom.strength = 0.5 * gain.current; composer.render(delta); }, 1);
  return null;
}

const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Lineup spacing (Altitude-scale metres) and the inward turn of each cabinet toward the centre.
const PAIR_X = 0.82, PAIR_TURN = 0.24;
const BOTH: CabinetId[] = ["altitude", "pinnacle"];

function Rig({ cabinet, pair, pose, still, compact, onProjectAll, onReady, gain }: Omit<StageProps, "active" | "onFailure"> & { gain: MutableRefObject<number> }) {
  const { camera, size, scene } = useThree();
  const registry = useRef<Registry>({});
  const [mounted, setMounted] = useState<CabinetId[]>(pair ? BOTH : [cabinet]);
  const current = useRef<StagePose>({ ...pose.current, power: 0 });
  const shown = useRef<CabinetId | null>(null);
  const swap = useRef({ out: 0, in: 1 });
  const fit = useRef(cabinetSpecs[cabinet].fit);
  const lights = useRef<{ hemi: HemisphereLight | null; key: SpotLight | null; violet: DirectionalLight | null; cyan: DirectionalLight | null; fill: DirectionalLight | null; torch: SpotLight | null; sweep: SpotLight | null }>({ hemi: null, key: null, violet: null, cyan: null, fill: null, torch: null, sweep: null });
  const focus = useMemo(() => new Object3D(), []);
  const probe = useMemo(() => new Vector3(), []);
  const facing = useMemo(() => new Vector3(), []);
  const toCamera = useMemo(() => new Vector3(), []);
  const color = useMemo(() => new Color(), []);
  const pins = useMemo(() => ({ altitude: new Float32Array(anchorKeys("altitude").length * 3), pinnacle: new Float32Array(anchorKeys("pinnacle").length * 3) }), []);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => { setMounted((list) => (list.includes(cabinet) ? list : [...list, cabinet])); }, [cabinet]);
  useEffect(() => { scene.add(focus); return () => { scene.remove(focus); }; }, [scene, focus]);

  const loaded = (id: CabinetId) => {
    if (pair ? BOTH.every((key) => registry.current[key]) : id === cabinet || !shown.current) readyRef.current?.();
  };

  useFrame((state, delta) => {
    const target = pose.current, c = current.current, dt = Math.min(delta, 0.05);
    const k = still ? 1 : 1 - Math.exp(-4.2 * dt);
    const lerp = (key: Exclude<keyof StagePose, "anchor">, rate = k) => { c[key] = c[key] + (target[key] - c[key]) * rate; };
    (["yaw", "pitch", "distance", "targetY", "offsetX", "lift", "glow", "pointerX", "pointerY", "float", "zoom"] as const).forEach((key) => lerp(key));
    lerp("lights", still ? 1 : 1 - Math.exp(-2.6 * dt));
    // Direct manipulation stays tight to the finger; inertia/spring live in the input binding.
    lerp("drag", still ? 1 : 1 - Math.exp(-14 * dt));
    lerp("dragPitch", still ? 1 : 1 - Math.exp(-14 * dt));
    // Power ramps linearly so the scan line travels at a readable pace; powering down is quicker.
    c.power = still ? target.power : c.power + MathUtils.clamp(target.power - c.power, -dt * 2.2, dt * 0.85);

    // Cabinet swap: the shown cabinet spins down through the floor, the next one rises and powers on.
    const s = swap.current;
    if (pair) {
      if (!shown.current && BOTH.every((key) => registry.current[key])) { shown.current = cabinet; s.in = still ? 1 : 0; if (still) c.power = target.power; }
      else if (shown.current && s.in < 1) s.in = still ? 1 : Math.min(1, s.in + dt / 1.6);
    } else if (shown.current !== cabinet) {
      if (!shown.current || still) {
        // First appearance rises out of the floor (frames only run while on screen); still mode just shows it.
        if (registry.current[cabinet]) { shown.current = cabinet; s.out = 0; s.in = still ? 1 : 0; if (still) c.power = target.power; }
      } else {
        s.out = Math.min(1, s.out + dt / 0.55);
        if (s.out >= 1 && registry.current[cabinet]) { shown.current = cabinet; s.out = 0; s.in = 0; c.power = 0; }
      }
    } else if (s.in < 1) s.in = still ? 1 : Math.min(1, s.in + dt / 1.05);
    if (still && shown.current !== cabinet) state.invalidate();
    const out = pair ? 0 : easeIn(s.out), rise = 1 - easeOut(s.in);
    const entry = shown.current ? registry.current[shown.current] : undefined;
    const spec = cabinetSpecs[shown.current ?? cabinet];
    fit.current += ((pair ? 1 : spec.fit) - fit.current) * (still ? 1 : 1 - Math.exp(-3 * dt));
    const f = fit.current;

    const t = still ? 0 : state.clock.elapsedTime;
    const power = c.power * (1 - out);
    const level = MathUtils.clamp(c.glow, 0, 1.4);
    const animate = (item: Entry, id: CabinetId, x: number, scale: number, turn: number, rise: number, phase: number) => {
      const itemSpec = cabinetSpecs[id];
      const yaw = c.yaw + c.drag + turn + Math.sin(t * 0.35 + phase) * 0.035 * c.float + c.pointerX * 0.1 + out * 1.6 - rise * 1.2;
      const tilt = c.pointerY * 0.035;
      const y = c.lift + Math.sin(t * 0.8 + phase) * 0.035 * c.float - (out * 1.15 + rise * 1.15) * 2.4 * f;
      item.root.rotation.set(tilt, yaw, 0);
      item.root.position.set(x, y, 0);
      item.root.scale.setScalar(scale);
      if (item.mirror) { item.mirror.rotation.set(-tilt, yaw, 0); item.mirror.position.set(x, -y, 0); item.mirror.scale.set(scale, -scale, scale); }
      item.floor.position.x = x;
      item.floor.scale.setScalar(scale * MathUtils.clamp(1 - Math.max(0, c.lift) * 0.25 - (out + rise) * 0.5, 0.2, 1));
      const itemPower = power * (1 - rise);
      (item.floor.material as MeshBasicMaterial).opacity = 0.3 * (0.35 + 0.65 * itemPower) * level;

      // Screen, LEDs and spill light. LEDs wake first (attract mode), then the screen scans on.
      item.built.power.value = itemPower;
      const ledsOn = MathUtils.clamp(itemPower * 3, 0, 1);
      item.built.leds.forEach((led) => {
        const pulse = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * 1.7 - led.phase));
        const intensity = led.base * (0.12 + 0.88 * level) * pulse * ledsOn;
        if (led.palette) {
          const cycle = ((t * 0.09 + led.phase * 0.07) % 1 + 1) % 1 * led.palette.length;
          const i = Math.floor(cycle);
          color.copy(led.palette[i]).lerp(led.palette[(i + 1) % led.palette.length], cycle - i);
        }
        led.materials.forEach((material) => {
          material.emissiveIntensity = intensity;
          if (led.palette) material.emissive.copy(color);
        });
      });
      item.spill.intensity = blend(PRESETS.spill, c.lights) * itemPower * itemSpec.screen.spill.strength * scale;
    };

    (Object.keys(registry.current) as CabinetId[]).forEach((id) => {
      const item = registry.current[id]!;
      const visible = pair ? Boolean(shown.current) : id === shown.current;
      item.root.visible = visible;
      if (item.mirror) item.mirror.visible = visible;
      item.floor.visible = visible;
    });

    if (pair && shown.current) {
      // Lineup: equal height, turned slightly toward each other; the Pinnacle rises a beat after the Altitude.
      BOTH.forEach((id, i) => {
        const item = registry.current[id];
        if (!item) return;
        const side = i === 0 ? -1 : 1;
        const local = 1 - easeOut(MathUtils.clamp((s.in - i * 0.25) / 0.75, 0, 1));
        animate(item, id, side * PAIR_X, 1 / cabinetSpecs[id].fit, -side * PAIR_TURN, local, i * 1.7);
      });
    } else if (entry && shown.current) animate(entry, shown.current, 0, 1, 0, rise, 0);

    // Lighting rig.
    const L = lights.current, preset = c.lights;
    if (L.hemi) L.hemi.intensity = blend(PRESETS.hemi, preset);
    if (L.key) L.key.intensity = blend(PRESETS.key, preset);
    if (L.violet) L.violet.intensity = blend(PRESETS.rimViolet, preset);
    if (L.cyan) L.cyan.intensity = blend(PRESETS.rimCyan, preset);
    if (L.fill) L.fill.intensity = blend(PRESETS.fill, preset);
    scene.environmentIntensity = blend(PRESETS.env, preset);
    focus.position.set(0, 1.15 * f, 0);
    if (L.torch) {
      // The visitor's pointer holds a light: move it and the reflections follow across the chrome and gloss.
      L.torch.position.set(c.pointerX * 3.2, (1.35 - c.pointerY * 1.4) * f + 0.4, 3.4);
      L.torch.intensity = blend(PRESETS.torch, preset);
      L.torch.angle = preset > 1 ? MathUtils.lerp(0.62, 0.2, preset - 1) : 0.62;
    }
    if (L.sweep) {
      // A slow light bar travels across the front every few seconds for moving specular glints.
      const phase = (t * 0.16) % 1;
      L.sweep.position.set(MathUtils.lerp(-4.5, 4.5, phase), 3.4 * f, 2.6);
      L.sweep.intensity = blend(PRESETS.sweep, preset) * Math.sin(phase * Math.PI) ** 2 * (still ? 0 : 1);
    }

    // Camera: poses are authored at Altitude scale, so framing follows the shown cabinet's height.
    const px = c.pointerX * 0.28, py = c.pointerY * 0.16;
    const pitch = MathUtils.clamp(c.pitch + c.dragPitch, -0.35, 1.05), distance = c.distance * c.zoom * f;
    const ty = c.targetY * f, ox = c.offsetX * f;
    // Bloom passes whole bright pixels, so close-ups (where LEDs fill the frame) get a gentler glow.
    gain.current = MathUtils.clamp((c.distance * c.zoom - 1.8) / 4, 0.3, 1);
    camera.position.set(-ox + px, ty + Math.sin(pitch) * distance + py, Math.cos(pitch) * distance);
    camera.lookAt(-ox + px * 0.35, ty, 0);

    if (onProjectAll && entry && shown.current && !pair) {
      const keys = anchorKeys(shown.current), points = pins[shown.current];
      entry.root.updateMatrixWorld();
      keys.forEach((key, i) => {
        const anchor = spec.anchors[key];
        probe.copy(anchor.position).applyMatrix4(entry.root.matrixWorld);
        facing.copy(anchor.normal).applyEuler(entry.root.rotation);
        toCamera.copy(camera.position).sub(probe).normalize();
        points[i * 3 + 2] = s.out > 0 || s.in < 0.85 ? -1 : facing.dot(toCamera);
        probe.project(camera);
        points[i * 3] = (probe.x + 1) / 2 * size.width;
        points[i * 3 + 1] = (1 - probe.y) / 2 * size.height;
      });
      onProjectAll(points, shown.current);
    }
  });

  return <>
    <hemisphereLight ref={(l) => { lights.current.hemi = l; }} args={["#cfd6ff", "#120c1c", 0.32]} />
    <spotLight ref={(l) => { lights.current.key = l; if (l) l.target = focus; }} position={[1.6, 5.2, 3.6]} angle={0.52} penumbra={0.85} intensity={4.2} decay={0} color="#fff3ea" castShadow={!compact}
      shadow-mapSize={[1024, 1024]} shadow-bias={-0.00025} shadow-normalBias={0.02} />
    <directionalLight ref={(l) => { lights.current.violet = l; }} position={[-3.5, 2.6, -3]} intensity={2.6} color="#8f3dff" />
    <directionalLight ref={(l) => { lights.current.cyan = l; }} position={[3.4, 2.2, -2.6]} intensity={2.1} color="#25d7ff" />
    <directionalLight ref={(l) => { lights.current.fill = l; }} position={[-2.5, 0.8, 3]} intensity={0.45} color="#ff6a2d" />
    <spotLight ref={(l) => { lights.current.torch = l; if (l) l.target = focus; }} position={[0, 1.6, 3.4]} angle={0.62} penumbra={0.9} intensity={1.1} decay={0} color="#ffe2c4" />
    <spotLight ref={(l) => { lights.current.sweep = l; if (l) l.target = focus; }} position={[0, 3.4, 2.6]} angle={0.16} penumbra={0.6} intensity={0} decay={0} color="#ffffff" />
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[6, 3, 1]} />
      {/* Tall strip softboxes give long, clean highlights down the bezels and curved glass. */}
      <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-3, 1.6, 2.4]} rotation-y={Math.PI / 3} scale={[0.5, 6, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[3, 1.6, 2.4]} rotation-y={-Math.PI / 3} scale={[0.5, 6, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#b58cff" position={[-4, 1.5, -1]} rotation-y={Math.PI / 2} scale={[1.2, 5, 1]} />
      <Lightformer form="rect" intensity={1.3} color="#6fe8ff" position={[4, 1.5, -1]} rotation-y={-Math.PI / 2} scale={[1.2, 5, 1]} />
      <Lightformer form="ring" intensity={1.4} color="#ffac0a" position={[0, 1.4, -5]} scale={3.2} />
    </Environment>
    {mounted.map((id) => <Suspense key={id} fallback={null}><CabinetModel id={id} registry={registry} compact={compact} onLoaded={loaded} /></Suspense>)}
  </>;
}

let rectAreaReady = false;

export default function CabinetStage({ cabinet, pair, pose, active, still, compact, onProjectAll, onReady, onFailure }: StageProps) {
  const gain = useRef(1);
  if (!rectAreaReady && typeof window !== "undefined") { RectAreaLightUniformsLib.init(); rectAreaReady = true; }
  return <Canvas
    className="cabinet-stage-canvas"
    shadows={compact ? false : { type: PCFShadowMap }}
    dpr={compact ? [1, 1.25] : [1, 1.75]}
    frameloop={still ? "demand" : active ? "always" : "never"}
    camera={{ position: [0, 1.4, 6.2], fov: 28, near: 0.1, far: 40 }}
    gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.localClippingEnabled = true;
      gl.toneMappingExposure = 1.08;
      gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); onFailure(); }, { once: true });
    }}
    aria-hidden="true"
  >
    <StageBoundary onFailure={onFailure}>
      <Rig cabinet={cabinet} pair={pair} pose={pose} still={still} compact={compact} onProjectAll={onProjectAll} onReady={onReady} gain={gain} />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.72} scale={pair ? 5.4 : 4.2} blur={2.6} far={2.6} resolution={compact ? 256 : 512} color="#05030a" frames={still ? 1 : Infinity} />
      <Bloom compact={compact} gain={gain} />
    </StageBoundary>
  </Canvas>;
}

useGLTF.preload(cabinetSpecs.altitude.url);
useGLTF.preload(cabinetSpecs.pinnacle.url);
