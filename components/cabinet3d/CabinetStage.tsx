"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, Group, MathUtils, SRGBColorSpace, Vector3, type Mesh, type MeshStandardMaterial, type SpriteMaterial } from "three";
import { ALTITUDE_MODEL, altitudeAnchors, altitudeGlows, buildAltitude, type AltitudeAnchor } from "./altitudeModel";

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
  anchor: AltitudeAnchor | null;
};

export const defaultPose = (): StagePose => ({
  yaw: -0.45, pitch: 0.1, distance: 6.2, targetY: 1.2, offsetX: 0, lift: 0, glow: 1,
  drag: 0, dragPitch: 0, zoom: 1, pointerX: 0, pointerY: 0, float: 1, anchor: null,
});

type Projection = (x: number, y: number) => void;
/** Screen-space pins for every anchor: [x, y, facing] triples in `anchorOrder`. */
export type ProjectAll = (points: Float32Array) => void;
export const anchorOrder = Object.keys(altitudeAnchors) as AltitudeAnchor[];

type StageProps = {
  pose: MutableRefObject<StagePose>;
  active: boolean;
  still?: boolean;
  compact?: boolean;
  onProject?: Projection;
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
  gradient.addColorStop(0.18, "rgba(255,255,255,.55)");
  gradient.addColorStop(0.5, "rgba(255,255,255,.12)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Altitude({ pose, still, onProject, onProjectAll, onReady }: Pick<StageProps, "pose" | "still" | "onProject" | "onProjectAll" | "onReady">) {
  const { scene } = useGLTF(ALTITUDE_MODEL);
  const { camera, size, gl } = useThree();
  const root = useRef<Group>(null);
  const floor = useRef<Mesh>(null);
  const current = useRef<StagePose>({ ...pose.current });
  const built = useMemo(() => buildAltitude(scene), [scene]);
  const glow = useMemo(glowTexture, []);
  const emissive = useMemo(() => built.materials.filter((m) => m.emissiveIntensity > 0 && /^(0[7-9]|1[0-2])/.test(m.name)).map((m) => [m, m.emissiveIntensity] as const), [built]);
  const sprites = useRef<SpriteMaterial[]>([]);
  const probe = useMemo(() => new Vector3(), []);
  const facing = useMemo(() => new Vector3(), []);
  const toCamera = useMemo(() => new Vector3(), []);
  const pins = useMemo(() => new Float32Array(anchorOrder.length * 3), []);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    built.materials.forEach((material: MeshStandardMaterial) => {
      if (material.emissiveMap) material.emissiveMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    });
    readyRef.current?.();
    return () => {
      built.geometries.forEach((g) => g.dispose());
      built.materials.forEach((m) => m.dispose());
      glow.dispose();
    };
  }, [built, glow, gl]);

  useFrame((state, delta) => {
    const target = pose.current, c = current.current, dt = Math.min(delta, 0.05);
    const k = still ? 1 : 1 - Math.exp(-4.2 * dt);
    const lerp = (key: Exclude<keyof StagePose, "anchor">, rate = k) => { c[key] = c[key] + (target[key] - c[key]) * rate; };
    (["yaw", "pitch", "distance", "targetY", "offsetX", "lift", "glow", "pointerX", "pointerY", "float", "zoom"] as const).forEach((key) => lerp(key));
    // Direct manipulation stays tight to the finger; inertia/spring live in the input binding.
    lerp("drag", still ? 1 : 1 - Math.exp(-14 * dt));
    lerp("dragPitch", still ? 1 : 1 - Math.exp(-14 * dt));
    const t = still ? 0 : state.clock.elapsedTime;
    if (root.current) {
      // Hover tilt (ModelViewer): the cabinet leans a few degrees toward the pointer.
      root.current.rotation.y = c.yaw + c.drag + Math.sin(t * 0.35) * 0.035 * c.float + c.pointerX * 0.1;
      root.current.rotation.x = c.pointerY * 0.035;
      root.current.position.y = c.lift + Math.sin(t * 0.8) * 0.035 * c.float;
    }
    if (floor.current) floor.current.scale.setScalar(1 - Math.min(0.35, Math.max(0, c.lift) * 0.25));
    const px = c.pointerX * 0.28, py = c.pointerY * 0.16;
    const pitch = MathUtils.clamp(c.pitch + c.dragPitch, -0.35, 1.05), distance = c.distance * c.zoom;
    camera.position.set(-c.offsetX + px, c.targetY + Math.sin(pitch) * distance + py, Math.cos(pitch) * distance);
    camera.lookAt(-c.offsetX + px * 0.35, c.targetY, 0);
    const level = MathUtils.clamp(c.glow, 0, 1.4);
    emissive.forEach(([material, base]) => { material.emissiveIntensity = base * (0.18 + 0.82 * level); });
    sprites.current.forEach((material) => { material.opacity = 0.85 * level; });
    if (onProject && target.anchor && root.current) {
      probe.copy(altitudeAnchors[target.anchor]).applyMatrix4(root.current.matrixWorld).project(camera);
      onProject((probe.x + 1) / 2 * size.width, (1 - probe.y) / 2 * size.height);
    }
    if (onProjectAll && root.current) {
      anchorOrder.forEach((key, i) => {
        const anchor = altitudeAnchors[key];
        probe.copy(anchor).applyMatrix4(root.current!.matrixWorld);
        // Outward direction of the part (horizontal), turned with the cabinet, against the view ray.
        facing.set(anchor.x, 0, anchor.z).normalize().applyEuler(root.current!.rotation);
        toCamera.copy(camera.position).sub(probe).normalize();
        pins[i * 3 + 2] = facing.dot(toCamera);
        probe.project(camera);
        pins[i * 3] = (probe.x + 1) / 2 * size.width;
        pins[i * 3 + 1] = (1 - probe.y) / 2 * size.height;
      });
      onProjectAll(pins);
    }
  });

  return <>
    <group ref={root}>
      <primitive object={built.group} />
      {altitudeGlows.map((item, index) => <sprite key={index} position={item.position} scale={item.scale} renderOrder={2}>
        <spriteMaterial ref={(m: SpriteMaterial | null) => { if (m) sprites.current[index] = m; }} map={glow} color={item.color} blending={AdditiveBlending} depthWrite={false} transparent toneMapped={false} />
      </sprite>)}
    </group>
    <mesh ref={floor} rotation-x={-Math.PI / 2} position-y={0.004} renderOrder={1}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial map={glow} color="#6d2bff" transparent opacity={0.34} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  </>;
}

function StudioLight({ compact }: { compact?: boolean }) {
  return <>
    <hemisphereLight args={["#cfd6ff", "#120c1c", 0.35]} />
    <spotLight position={[1.6, 5.2, 3.6]} angle={0.52} penumbra={0.85} intensity={4.2} decay={0} color="#fff3ea" castShadow={!compact}
      shadow-mapSize={[1024, 1024]} shadow-bias={-0.00025} shadow-normalBias={0.02} />
    <directionalLight position={[-3.5, 2.6, -3]} intensity={2.6} color="#8f3dff" />
    <directionalLight position={[3.4, 2.2, -2.6]} intensity={2.1} color="#25d7ff" />
    <directionalLight position={[-2.5, 0.8, 3]} intensity={0.45} color="#ff2d8a" />
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#b58cff" position={[-4, 1.5, 0]} rotation-y={Math.PI / 2} scale={[1.2, 5, 1]} />
      <Lightformer form="rect" intensity={1.3} color="#6fe8ff" position={[4, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[1.2, 5, 1]} />
      <Lightformer form="ring" intensity={1.1} color="#ff5fb0" position={[0, 1.4, -5]} scale={3.2} />
    </Environment>
  </>;
}

export default function CabinetStage({ pose, active, still, compact, onProject, onProjectAll, onReady, onFailure }: StageProps) {
  return <Canvas
    className="cabinet-stage-canvas"
    shadows={!compact}
    dpr={compact ? [1, 1.25] : [1, 1.75]}
    frameloop={still ? "demand" : active ? "always" : "never"}
    camera={{ position: [0, 1.4, 6.2], fov: 28, near: 0.1, far: 40 }}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.toneMappingExposure = 1.08;
      gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); onFailure(); }, { once: true });
    }}
    aria-hidden="true"
  >
    <StageBoundary onFailure={onFailure}>
      <StudioLight compact={compact} />
      <Suspense fallback={null}>
        <Altitude pose={pose} still={still} onProject={onProject} onProjectAll={onProjectAll} onReady={onReady} />
        <ContactShadows position={[0, 0.002, 0]} opacity={0.72} scale={4.2} blur={2.6} far={2.6} resolution={compact ? 256 : 512} color="#05030a" frames={still ? 1 : Infinity} />
      </Suspense>
    </StageBoundary>
  </Canvas>;
}

useGLTF.preload(ALTITUDE_MODEL);
