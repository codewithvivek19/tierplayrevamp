"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { AgXToneMapping, CatmullRomCurve3, Color, Group, Vector3, InstancedMesh, MathUtils, MeshBasicMaterial, MeshStandardMaterial, Object3D, Vector2, WebGLRenderTarget, HalfFloatType, Mesh, Points, ShaderMaterial, Texture, type Material } from "three";
import { rockGeometry, type RockKind } from "./rockGeometry";
import { portalFraming } from "./portalFraming";
import { createWetSurface } from "./wetSurface";
import { mineralSurface, type EnergyUniforms } from "./mineralSurface";
import { CrystalCluster, Dais, EnergyArcs, PortalAtmosphere, SkyAndHorizon, Vortex } from "./OpeningWorld";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";
import PortalParticles from "./PortalParticles";
import { AssemblingMonoliths, GatewayArchitecture } from "./GatewayWorld";
import PortalEnergy from "./PortalEnergy";
import DustMotes from "./DustMotes";
import CosmicBackdrop from "./CosmicBackdrop";
import { mistFragment, noise, vertex } from "./portalShaders";
import type { PortalState } from "./portalState";
import { WALK_END, WALK_START, WALK_STRIDES, walkEase } from "./walk";

type Props = { sequence: PortalState; active: boolean; onReady: () => void; onFailure: () => void };
const rand = (i: number) => MathUtils.euclideanModulo(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1);
const smooth = MathUtils.smoothstep;

class Boundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function useRock(kind: RockKind, seed = 1, options?: Parameters<typeof mineralSurface>[1]) {
  const resources = useMemo(() => ({ geometry: rockGeometry(kind, seed), material: mineralSurface(false, options) }), [kind, seed, options]);
  // Geometry is a shared cache entry; only the material belongs to this consumer.
  useEffect(() => () => { resources.material.dispose(); }, [resources]);
  return resources;
}

const debrisStone = { octaves: 3, dust: .3 };
const foregroundStone = { dust: .8, scale: 1.3 };

const bell = (v: number, a: number, b: number) => Math.sin(MathUtils.clamp((v - a) / (b - a), 0, 1) * Math.PI);
// Smooth pseudo-random shake: summed incommensurate sines, cheaper than noise and deterministic.
const wobble = (t: number, seed: number) => Math.sin(t * 17.3 + seed) * .5 + Math.sin(t * 29.1 + seed * 2.1) * .3 + Math.sin(t * 47.7 + seed * 3.7) * .2;

// The walk: after the plasma lands, the viewer walks the processional path at eye height, climbs
// the steps, passes beneath the rings and through the arch into the light. Positions are authored in
// world space (floor y -3.8, gateway at z -16); the camera always aims a little ahead along its own
// route, the way a Steadicam operator walks a shot, so the move never reverses.
// The walk opens on the flight's own heading (the rail leaves the camera centred near (0, -1.1, 7),
// looking straight ahead and slightly up) so the hand-off continues the shot rather than turning it.
// The sightline stays on the gateway, so the camera tilts up only as fast as the approach demands.
const WALK_PATH: [number, number, number][] = [
  [-.2, -1.45, 3.6],    // ease down to eye height, continuing forward
  [-.7, -1.85, -2],     // the stone path between the boulders, drifting left: the gateway moves to the right third
  [-.6, -1.8, -7.5],    // the foot of the steps
  [-.25, -1.5, -11.6],  // climbing
  [0, -1.2, -14.2],     // the threshold
];
const WALK_AIM: [number, number, number][] = [
  [.15, 1.9, -16],      // the gateway, where the flight was already looking
  [.5, 2.6, -16],
  [.55, 3.4, -16],      // it grows over you
  [.15, 3.6, -22],      // up at the rings as you pass beneath
  [0, 2, -30],          // and ahead, into the column of light
];
// From the flight's lens down to a tighter push-in on the light.
const WALK_LENS = [44, 40, 38, 40, 33];

// The only component allowed to mutate the scene camera.
// Opening to landing (unchanged): establishing entry, handheld breath, collapse push + roll,
// departure punch and shake, and a low tracking shot that leads the fireball.
// From the landing on, the viewer is in the scene: one continuous Steadicam walk at eye height (see
// WALK_PATH) that never reverses — down the processional path, up the steps, beneath the rings and
// through the arch into the light — with the sightline leading the route, a footfall bob tied to
// distance walked, and the head turning gently toward the pointer.
function CameraDirector({ sequence }: { sequence: PortalState }) {
  const { camera, size, scene } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const state = useRef({ trauma: 0, lastProgress: 0, fov: 46 });
  const target = useMemo(() => new Vector3(), []);
  const fire = useMemo(() => new Vector3(), []);
  const rig = useMemo(() => {
    const position = [new Vector3(), ...WALK_PATH.map(([x, y, z]) => new Vector3(x, y, z))];
    const aim = [new Vector3(), ...WALK_AIM.map(([x, y, z]) => new Vector3(x, y, z))];
    return {
      position, aim,
      path: new CatmullRomCurve3(position, false, "centripetal"),
      look: new CatmullRomCurve3(aim, false, "centripetal"),
      sample: new Vector3(), ahead: new Vector3(),
    };
  }, []);
  const core = useRef<Object3D | null>(null);
  // Steadicam inertia for the walk: the rig's position, aim and lens follow their targets through a
  // critically damped spring, which absorbs uneven scroll input the way a real rig's mass does.
  const rigMass = useMemo(() => ({ position: new Vector3(), aim: new Vector3(), fov: 46, primed: false }), []);
  useFrame((_, delta) => {
    const p = sequence.progress, t = sequence.time, dt = Math.min(delta, .05);
    const portrait = 1 - smooth(size.width / size.height, .85, 1.35), landscape = 1 - portrait;
    const s = state.current;
    if (!sequence.paused) {
      pointer.current.x = MathUtils.damp(pointer.current.x, sequence.pointerX, 3, dt);
      pointer.current.y = MathUtils.damp(pointer.current.y, sequence.pointerY, 3, dt);
    }
    const raw = sequence.raw ?? 0, collapse = sequence.intro ?? 0, finale = sequence.finale ?? 0;
    // Establishing shot: the first seconds after the reveal descend from high and wide into the opening frame.
    const entry = sequence.revealTime === undefined ? 1 : 1 - MathUtils.smootherstep(t - sequence.revealTime, 0, 3.2);
    const align = MathUtils.smootherstep(p, .20, .45), dive = MathUtils.smootherstep(p, .25, .85), arrive = MathUtils.smootherstep(p, .48, .82);
    const push = MathUtils.smootherstep(raw, 0, .2) * 1.6 * (1 - portrait * .5);
    const launch = bell(p, .28, .5), flight = bell(p, .42, .86);
    // Handheld life fades out as the ceremony begins: the finale is locked-off.
    // One hand-off weight for every layer that changes owner between the flight rail and the walk, so
    // nothing switches on (or off) in a single frame: the rail's handheld life fades out exactly as the
    // walk's Steadicam life fades in.
    const handoff = MathUtils.smootherstep(MathUtils.clamp((raw - WALK_START) / (WALK_END - WALK_START), 0, 1), 0, .3);
    const alive = 1 - handoff;

    let x = landscape * 2.6 * align * (1 - arrive);
    let y = MathUtils.lerp(1, -.5, arrive) - flight * 1.1;
    let z = MathUtils.lerp(15, 20, portrait) - dive * MathUtils.lerp(8, 7, portrait) - push * (1 - dive);
    x += entry * -2.5; y += entry * 3.6; z += entry * 7;
    x += pointer.current.x * .16 * (1 - dive * .85) * alive;
    y -= pointer.current.y * .08 * alive;
    // Handheld breath: always a little alive until the finale.
    x += Math.sin(t * .31) * .05 * alive; y += Math.sin(t * .47 + 1) * .04 * alive;

    target.set(landscape * align * 3.4 * (1 - arrive), MathUtils.lerp(MathUtils.lerp(.8, 1.8, portrait), 2.2, arrive), MathUtils.lerp(-3, -16, arrive));
    target.y += entry * -1.2;
    // During launch and flight the lens leads the fireball instead of the rail.
    core.current ??= scene.getObjectByName("fireball-core") ?? null;
    if (core.current) { core.current.getWorldPosition(fire); target.lerp(fire, (launch * .55 + flight * .35) * (1 - finale)); }

    // Rail lens: wide establishing, squeeze through the collapse, punch out on launch.
    let fov = 46 + entry * 8 - bell(collapse, .2, .95) * 5 + launch * 7 + flight * 2;

    const walk = MathUtils.clamp((raw - WALK_START) / (WALK_END - WALK_START), 0, 1);
    if (walk > 0) {
      const r = rig, u = Math.min(1, Math.max(0, walkEase(walk)));
      // The first knot is wherever the rail has the camera, so the hand-off is seamless.
      r.position[0].set(x, y, z); r.aim[0].copy(target);
      // Portrait screens keep the drift small so the gateway stays in frame.
      for (let i = 1; i < r.position.length; i++) r.position[i].x = WALK_PATH[i - 1][0] * MathUtils.lerp(1, .35, portrait);
      // Path and sightline are sampled by knot, not arc length, so each waypoint and its aim arrive together.
      r.path.getPoint(u, r.sample);
      x = r.sample.x; y = r.sample.y; z = r.sample.z;
      // Aim: the authored sightline, nudged toward where the path goes next.
      r.look.getPoint(u, target);
      r.path.getPoint(Math.min(1, u + .06), r.ahead);
      target.lerp(r.ahead.setY(r.ahead.y + 1.4), .18 * handoff);
      // Lens follows the walk.
      const lensAt = u * (WALK_LENS.length - 1), li = Math.min(WALK_LENS.length - 2, Math.floor(lensAt));
      const walkFov = MathUtils.lerp(WALK_LENS[li], WALK_LENS[li + 1], MathUtils.smoothstep(lensAt - li, 0, 1)) + portrait * 6;
      fov = MathUtils.lerp(fov, walkFov, handoff);
      // Living in the shot: a slow Steadicam float, a footfall bob tied to distance walked (so
      // steps follow the scroll), and the head turning gently toward the pointer.
      const strideAt = u * WALK_STRIDES;
      const step = Math.sin(strideAt * Math.PI * 2);
      x += (Math.sin(t * .37) * .05 + Math.sin(strideAt * Math.PI) * .03) * handoff;
      y += (Math.sin(t * .53 + 1) * .035 + Math.abs(step) * .028) * handoff;
      target.x += (pointer.current.x * 1.6 + Math.sin(t * .29) * .08) * handoff;
      target.y -= pointer.current.y * .9 * handoff;
    }
    // Before the walk the rail is already scrub-smoothed, so the spring is effectively stiff; it
    // softens as the walk takes over.
    const stiffness = MathUtils.lerp(80, 5.5, handoff);
    const m = rigMass;
    if (!m.primed || sequence.paused) { m.position.set(x, y, z); m.aim.copy(target); m.fov = fov; m.primed = true; }
    else {
      m.position.x = MathUtils.damp(m.position.x, x, stiffness, dt); m.position.y = MathUtils.damp(m.position.y, y, stiffness, dt); m.position.z = MathUtils.damp(m.position.z, z, stiffness, dt);
      m.aim.x = MathUtils.damp(m.aim.x, target.x, stiffness * .8, dt); m.aim.y = MathUtils.damp(m.aim.y, target.y, stiffness * .8, dt); m.aim.z = MathUtils.damp(m.aim.z, target.z, stiffness * .8, dt);
      m.fov = MathUtils.damp(m.fov, fov, stiffness * .7, dt);
    }
    fov = m.fov;
    camera.position.copy(m.position);
    camera.lookAt(m.aim);

    // Trauma: collapse flare and departure kick feed a decaying shake (none in the finale).
    const speed = Math.abs(p - s.lastProgress) / Math.max(dt, .008); s.lastProgress = p;
    const drive = bell(collapse, .45, 1) * .75 + launch * Math.min(1, speed * 2.5) * .9;
    s.trauma = Math.max(s.trauma * Math.exp(-dt * 2.2), drive);
    const shake = s.trauma * s.trauma * (sequence.paused ? 0 : 1) * alive;
    camera.rotateZ((Math.sin(collapse * Math.PI) * .045 + entry * -.05 + flight * Math.sin(t * .6) * .02 + wobble(t, 1) * shake * .02) * alive);
    camera.rotateX(wobble(t, 4) * shake * .012);
    camera.rotateY(wobble(t, 9) * shake * .012);

    if (Math.abs(fov - s.fov) > .01) { s.fov = fov; (camera as import("three").PerspectiveCamera).fov = fov; camera.updateProjectionMatrix(); }
    camera.updateMatrixWorld();
    // ?debug-camera: record the final camera each frame so motion can be checked for discontinuities.
    const log = (window as unknown as { __tpCamLog?: number[][] }).__tpCamLog;
    if (log) log.push([raw, camera.position.x, camera.position.y, camera.position.z, camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w, (camera as import("three").PerspectiveCamera).fov]);
  }, -.75);
  return null;
}

type ShellPiece = { dir: Vector3; radius: number; roll: number; w: number; h: number; spin: number };

// Fibonacci directions keep the broken sphere evenly populated; a clear window faces the camera.
function shellLayout(count: number, debris: boolean): ShellPiece[] {
  const pieces: ShellPiece[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const total = debris ? count : Math.round(count * 1.55);
  for (let i = 0; i < total; i++) {
    const y = 1 - (i / Math.max(1, total - 1)) * 2, rr = Math.sqrt(Math.max(0, 1 - y * y));
    const dir = new Vector3(Math.cos(i * golden) * rr, y, Math.sin(i * golden) * rr).normalize();
    // Leave the portal's face open, with a few plates drifting across it.
    if (!debris && dir.z > .34 && rand(i + 91) > .16) continue;
    const layer = debris ? 0 : i % 3;
    pieces.push({
      dir,
      radius: debris ? 3.4 + rand(i + 44) * 5.2 : 3.2 + layer * .5 + rand(i + 9) * .3,
      roll: rand(i + 3) * Math.PI * 2,
      w: debris ? .05 + Math.pow(rand(i + 7), 3) * .22 : .8 + rand(i + 5) * .85,
      h: debris ? .05 + Math.pow(rand(i + 8), 3) * .3 : 1.1 + rand(i + 6) * 1.4,
      spin: (rand(i + 13) - .5) * 2,
    });
  }
  return pieces;
}

function Fragments({ sequence, energy, debris = false, count }: { sequence: PortalState; energy: EnergyUniforms; debris?: boolean; count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const shell = useRef<Group>(null);
  const options = useMemo(() => ({ ...(debris ? debrisStone : { dust: .06, scale: 1.4, tint: "#57545f" }), energy }), [debris, energy]);
  const { geometry, material } = useRock(debris ? "chip" : "plate", debris ? 4 : 5, options);
  const dummy = useMemo(() => new Object3D(), []);
  const pieces = useMemo(() => shellLayout(count, debris), [count, debris]);
  const dynamics = useMemo(() => new Float32Array(pieces.length * 2), [pieces]);
  const forward = useMemo(() => new Vector3(0, 0, 1), []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const t = sequence.time, p = sequence.progress, collapse = sequence.intro ?? 0;
    if (shell.current) shell.current.rotation.set(Math.sin(t * .05) * .04, t * .018 + p * .35, 0);
    const contract = collapse * (debris ? .18 : .26);
    const shake = Math.sin(collapse * Math.PI);
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const target = smooth(p, .25, .79) * (debris ? 4.2 : 11) + Math.sin(t * (.2 + rand(i) * .12) + i) * .045;
      if (!sequence.paused) {
        const dt = Math.min(delta, .1), k = i * 2, omega = 7;
        const displacement = dynamics[k] - target;
        const impulse = dynamics[k + 1] + omega * displacement;
        const decay = Math.exp(-omega * dt);
        dynamics[k] = target + (displacement + impulse * dt) * decay;
        dynamics[k + 1] = (dynamics[k + 1] - omega * impulse * dt) * decay;
      }
      const release = dynamics[i * 2];
      const tremble = shake * .07 * Math.sin(t * 41 + i * 3.1);
      const breathe = Math.sin(t * .35 + i * 1.7) * (debris ? .08 : .05);
      const r = piece.radius * (1 - contract) + release + breathe + tremble;
      dummy.position.copy(piece.dir).multiplyScalar(r);
      if (debris) dummy.position.y += Math.sin(t * .2 + i) * .15;
      dummy.quaternion.setFromUnitVectors(forward, piece.dir);
      dummy.rotateZ(piece.roll + (debris ? t * .1 * piece.spin : 0));
      dummy.rotateX(release * piece.spin * .35);
      // The burst scatters the shell into the dark; it does not follow the journey to the gateway.
      const scatter = 1 - smooth(p, debris ? .45 : .3, debris ? .8 : .6);
      dummy.scale.set(piece.w * scatter + 1e-4, piece.h * scatter + 1e-4, (debris ? piece.w : 1) * scatter + 1e-4);
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  // The shell surrounds the point light: self-shadowing only produced stepped shadow-map texels.
  return <group ref={shell}><instancedMesh castShadow={debris} ref={ref} args={[geometry, material, pieces.length]} dispose={null} frustumCulled={false}/></group>;
}

const islands: { position: [number, number, number]; scale: number; crystal: [number, number, number]; light?: boolean }[] = [
  { position: [-4.9, -1.6, .6], scale: 1.05, crystal: [.35, .95, 2.6], light: true },
  { position: [-3.8, 3.3, -3.1], scale: .8, crystal: [.4, .8, 2.8] },
  { position: [5.3, 1.3, -1.6], scale: 1, crystal: [2.8, .95, .22], light: true },
  { position: [4.5, -2.4, 1.4], scale: .85, crystal: [.3, 1., 2.5] },
  { position: [-6.4, 1.4, -2.2], scale: .7, crystal: [.45, .85, 2.7] },
  { position: [2.4, 4.4, -3.8], scale: .6, crystal: [.5, .9, 2.8] },
];

function Island({ sequence, index, lights }: { sequence: PortalState; index: number; lights: boolean }) {
  const ref = useRef<Group>(null);
  const spec = islands[index];
  const { geometry, material } = useRock("island", 11 + index);
  const rubble = useRock("chip", 30 + index, debrisStone);
  const bits = useRef<InstancedMesh>(null);
  useEffect(() => {
    const dummy = new Object3D();
    for (let i = 0; i < 9; i++) {
      const a = rand(i + index * 20) * Math.PI * 2, r = .75 + rand(i + 3) * .5;
      dummy.position.set(Math.cos(a) * r, -.6 - rand(i + 9) * 1.4, Math.sin(a) * r * .7);
      dummy.rotation.set(rand(i) * 3, rand(i + 1) * 3, rand(i + 2) * 3);
      dummy.scale.setScalar(.04 + Math.pow(rand(i + 5), 2) * .12);
      dummy.updateMatrix(); bits.current?.setMatrixAt(i, dummy.matrix);
    }
    if (bits.current) bits.current.instanceMatrix.needsUpdate = true;
  }, [index]);
  useFrame(() => {
    if (!ref.current) return;
    const [x, y, z] = spec.position, p = sequence.progress;
    const retreat = smooth(p, .4, .82);
    ref.current.position.set(x * (1 + retreat * 2), y + Math.sin(sequence.time * .3 + index * 2) * .16 + retreat * 2, z - retreat * 14);
    ref.current.rotation.y = -.2 + Math.sin(sequence.time * .12 + index) * .06 + p * .2;
    if (bits.current) bits.current.rotation.y = sequence.time * .05;
  });
  return <group ref={ref} scale={spec.scale}>
    <mesh castShadow receiveShadow geometry={geometry} material={material} scale={[1.05, .9, .82]} rotation={[0, index * 1.3, 0]} dispose={null}/>
    <group position={[0, .27, 0]}><CrystalCluster sequence={sequence} color={spec.crystal} seed={index * 50} light={lights && !!spec.light}/></group>
    <instancedMesh castShadow ref={bits} args={[rubble.geometry, rubble.material, 9]} dispose={null}/>
  </group>;
}

function Stars({ sequence }: { sequence: PortalState }) {
  const ref = useRef<Group>(null);
  const layers = useMemo(() => [2600, 240].map((count, layer) => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const k = i + layer * 5000;
      // Concentrate stars along the Milky Way diagonal, upper left.
      const along = (rand(k) - .5) * 150, spread = (rand(k + 1400) - .5) * (rand(k + 900) < .55 ? 18 : 90);
      array.set([along * .85 - spread * .5 - 20, along * -.5 + spread * .85 + 18, -58 - rand(k + 2700) * 22], i * 3);
    }
    return array;
  }), []);
  useFrame(() => { if (ref.current) ref.current.rotation.z = sequence.time * .0007 + sequence.progress * .018; });
  return <group ref={ref}>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[layers[0], 3]}/></bufferGeometry><pointsMaterial size={.05} color="#cfcadf" transparent opacity={.55} sizeAttenuation depthWrite={false} fog={false}/></points>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[layers[1], 3]}/></bufferGeometry><pointsMaterial size={.14} color="#eeeaff" transparent opacity={.9} sizeAttenuation depthWrite={false} fog={false}/></points>
  </group>;
}

function Foreground({ sequence, compact, balanced }: { sequence: PortalState; compact: boolean; balanced: boolean }) {
  const { geometry, material } = useRock("boulder", 21, foregroundStone);
  const surfaceMaps = useMemo(() => createWetSurface(5), []);
  useEffect(() => () => surfaceMaps.dispose(), [surfaceMaps]);
  const floor = useMemo(() => {
    const arrival = { value: 0 };
    const surface = new MeshStandardMaterial({ map: surfaceMaps.color, metalness: 0, roughness: 1, normalMap: surfaceMaps.normal, roughnessMap: surfaceMaps.rough, normalScale: new Vector2(.55, .55), envMapIntensity: .9 });
    return { surface, arrival };
  }, [surfaceMaps]);
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
      {balanced ? <primitive object={floor.surface} attach="material"/> : <MeshReflectorMaterial resolution={compact ? 256 : 384} blur={compact ? [60, 20] : [140, 50]} mixBlur={.85} mixStrength={4.2} mixContrast={1.2} mirror={.82} map={surfaceMaps.color} normalMap={surfaceMaps.normal} normalScale={new Vector2(.55, .55)} roughnessMap={surfaceMaps.rough} distortionMap={surfaceMaps.rough} distortion={.08} color="#ffffff" metalness={0} roughness={1} depthScale={.6} minDepthThreshold={.35} maxDepthThreshold={1.6} envMapIntensity={.9}/>}
    </mesh>
    <instancedMesh castShadow receiveShadow ref={ref} args={[geometry, material, 28]} dispose={null} frustumCulled={false}/>
  </>;
}

const lavaRocks: [number, number, number, number][] = [[-8.6, -3.55, 1.2, 1.2], [-6.4, -3.7, 3.2, .8], [-11.4, -3.45, -1.6, 1.6], [10.6, -3.6, 1.8, 1]];

/** Foreground boulders split by molten seams, as in the reference's lower-left corner. */
function LavaRocks({ sequence, lights }: { sequence: PortalState; lights: boolean }) {
  const lava = useMemo(() => ({ value: 0 }), []);
  const options = useMemo(() => ({ lava, dust: .4, scale: 1.2 }), [lava]);
  const { geometry, material } = useRock("boulder", 63, options);
  useFrame(() => { lava.value = sequence.time; });
  return <>
    {lavaRocks.map(([x, y, z, s], i) => <mesh key={i} castShadow receiveShadow geometry={geometry} material={material} dispose={null} position={[x, y, z]} rotation={[rand(i) * 2, i * 2.1, rand(i + 5)]} scale={[s * 1.3, s * .7, s]}/>)}
    {lights ? <pointLight position={[-7.2, -2.4, 2.6]} color="#ff7a2a" intensity={14} distance={8} decay={2}/> : null}
  </>;
}

const nextFrame = () => new Promise<number>(resolve => requestAnimationFrame(resolve));
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// Integrated and older mobile GPUs: start on the balanced tier rather than discovering it mid-scroll.
const WEAK_GPU = /swiftshader|llvmpipe|software|intel\(r\) (hd|uhd)|intel.*(hd|uhd) graphics|mali-[gt]\d|adreno \(tm\) [3-5]\d\d|powervr|apple a(9|10|11)\b/i;

function Scene({ sequence, onReady, onFailure, onQuality, startBalanced, dprCap }: Omit<Props, "active"> & { onQuality: (software: boolean) => void; startBalanced: boolean; dprCap: number }) {
  const { size, gl, invalidate, scene, camera } = useThree();
  const setDpr = useThree(state => state.setDpr);
  const [balanced, setBalanced] = useState(startBalanced);
  const balancedRef = useRef(startBalanced);
  balancedRef.current = balanced;
  const [software, setSoftware] = useState(false);
  // Runtime adaptation only changes resolution: anything that alters lights, shadows or materials
  // would recompile every shader and freeze the scroll.
  const adapt = useRef({ revealed: false, count: 0, sum: 0, good: 0, dpr: dprCap, frame: 0 });
  useEffect(() => { adapt.current.dpr = dprCap; adapt.current.good = 0; }, [dprCap]);
  const root = useRef<Group>(null);
  const mist = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const energy = useMemo<EnergyUniforms>(() => ({ uEnergyCenter: { value: new Vector3() }, uEnergy: { value: 1 } }), []);
  const compact = size.width / size.height < 1.05;
  const framing = portalFraming(size.width, size.height);
  useEffect(() => { gl.domElement.dataset.quality = balanced ? "balanced" : compact ? "mobile" : "high"; }, [gl, balanced, compact]);
  useEffect(() => {
    const context = gl.getContext();
    const debug = context.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software/i.test(renderer)) { setBalanced(true); setSoftware(true); onQuality(true); }
    else if (WEAK_GPU.test(renderer) && !balancedRef.current) { setBalanced(true); onQuality(false); }
  }, [gl, onQuality]);
  useEffect(() => {
    sequence.invalidate = invalidate;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    invalidate();
    let cancelled = false;
    // Compile every program up front, including objects that only appear later in the scroll
    // (gateway, flame, steam); otherwise they compile on first sight and stall the scroll.
    const precompile = async () => {
      const hidden: Object3D[] = [];
      scene.traverse(object => { if (!object.visible) { hidden.push(object); object.visible = true; } });
      const compiling = gl.compileAsync(scene, camera);
      for (const object of hidden) object.visible = false;
      await compiling.catch(() => undefined);
      // Upload every texture now too: a first upload on first sight (the fireball's noise maps
      // as it emerges) is the other cause of a mid-scroll stall.
      const textures = new Set<Texture>();
      const collect = (value: unknown) => { if (value instanceof Texture) textures.add(value); };
      scene.traverse(object => {
        const material = (object as Mesh).material;
        if (!material) return;
        for (const item of Array.isArray(material) ? material : [material]) {
          for (const value of Object.values(item)) collect(value);
          const uniforms = (item as ShaderMaterial).uniforms;
          if (uniforms) for (const uniform of Object.values(uniforms)) collect(uniform?.value);
        }
      });
      for (const texture of textures) { try { gl.initTexture(texture); } catch { /* unsupported formats upload on first use */ } }
      // Draw everything once offscreen, culling off and shadows on, so geometry buffers and shadow
      // programs for later objects (the gateway, the assembled piers) are on the GPU before the scroll.
      const culled: Object3D[] = [];
      scene.traverse(object => {
        if (!object.visible) { hidden.push(object); object.visible = true; }
        if (object.frustumCulled) { culled.push(object); object.frustumCulled = false; }
      });
      const warm = new WebGLRenderTarget(64, 64, { type: HalfFloatType });
      const previous = gl.getRenderTarget();
      try {
        gl.shadowMap.needsUpdate = true;
        gl.setRenderTarget(warm);
        gl.render(scene, camera);
      } finally {
        gl.setRenderTarget(previous);
        for (const object of hidden) object.visible = false;
        for (const object of culled) object.frustumCulled = true;
        warm.dispose();
      }
    };
    // A short hidden warm-up measures this device with the real pipeline before anyone scrolls.
    const measure = async (frames: number) => {
      for (let i = 0; i < 6; i++) await nextFrame();
      let last = await nextFrame(), total = 0;
      for (let i = 0; i < frames; i++) { const now = await nextFrame(); total += now - last; last = now; }
      return total / frames;
    };
    (async () => {
      await wait(120);
      // On slow networks the fireball's textures arrive late; wait for it (the still image stays up)
      // so it never mounts, compiles and uploads in the middle of someone's scroll.
      for (let i = 0; i < 1200 && !cancelled && !scene.getObjectByName("fireball-core"); i++) await nextFrame();
      if (cancelled) return;
      await precompile();
      if (cancelled) return;
      // Tune for this device while the still image is showing, so nothing resizes mid-scroll:
      // a slow device drops to the balanced tier, then resolution steps down, then post relief.
      let frameMs = await measure(20);
      if (!balancedRef.current && frameMs > 40) {
        setBalanced(true); onQuality(false);
        await wait(60);
        if (cancelled) return;
        await precompile();
        frameMs = await measure(16);
      }
      const floor = balancedRef.current ? .6 : .7;
      while (!cancelled && frameMs > 22 && adapt.current.dpr > floor) {
        adapt.current.dpr = Math.max(floor, +(adapt.current.dpr - .25).toFixed(2));
        setDpr(adapt.current.dpr); gl.domElement.dataset.dpr = String(adapt.current.dpr);
        frameMs = await measure(16);
      }
      while (!cancelled && frameMs > 22 && (sequence.relief ?? 0) < 2) {
        sequence.relief = (sequence.relief ?? 0) + 1; gl.domElement.dataset.relief = String(sequence.relief);
        frameMs = await measure(16);
      }
      await nextFrame(); await nextFrame();
      if (cancelled) return;
      sequence.revealTime = sequence.time;
      adapt.current.revealed = true;
      onReady();
    })();
    return () => { cancelled = true; sequence.invalidate = undefined; gl.domElement.removeEventListener("webglcontextlost", lost); };
  }, [gl, scene, camera, invalidate, onFailure, onReady, sequence, setDpr]);
  useFrame((_, delta) => {
    if (!sequence.paused) { sequence.time += Math.min(delta, .1); invalidate(); }
    const adaptive = adapt.current;
    // Shadows move slowly relative to the frame rate: refresh the sun's map every third frame.
    gl.shadowMap.autoUpdate = false;
    adaptive.frame = (adaptive.frame + 1) % 3;
    if (adaptive.frame === 0 || sequence.paused) gl.shadowMap.needsUpdate = true;
    // Adaptive resolution: step down quickly when frames run long, step back up slowly with headroom.
    if (adaptive.revealed && !sequence.paused && delta < .25) {
      adaptive.count++; adaptive.sum += delta;
      if (adaptive.count % 40 === 0) {
        const average = adaptive.sum / 40; adaptive.sum = 0;
        const floor = balanced ? .6 : .7;
        if (average > .024 && adaptive.dpr > floor) { adaptive.dpr = Math.max(floor, +(adaptive.dpr - .25).toFixed(2)); adaptive.good = 0; setDpr(adaptive.dpr); gl.domElement.dataset.dpr = String(adaptive.dpr); }
        // At the resolution floor, relieve post-processing (pass toggles only, never a recompile).
        else if (average > .024 && (sequence.relief ?? 0) < 2) { sequence.relief = (sequence.relief ?? 0) + 1; adaptive.good = 0; gl.domElement.dataset.relief = String(sequence.relief); }
        else if (average < .0135) {
          adaptive.good++;
          if (adaptive.good >= 4 && adaptive.dpr < dprCap) { adaptive.dpr = Math.min(dprCap, +(adaptive.dpr + .25).toFixed(2)); adaptive.good = 0; setDpr(adaptive.dpr); gl.domElement.dataset.dpr = String(adaptive.dpr); }
        } else adaptive.good = 0;
      }
    }
    uniforms.uTime.value = sequence.time;
    if (mist.current) mist.current.uniforms.uTime.value = sequence.time;
    if (root.current) {
      const a = smooth(sequence.progress, .46, .8);
      root.current.position.set(framing.x * (1 - a), MathUtils.lerp(framing.y, .8, a), MathUtils.lerp(-1.5, -16, a));
      root.current.scale.setScalar(MathUtils.lerp(framing.scale, 1, a));
      root.current.rotation.y = -.15 * (1 - a);
      root.current.getWorldPosition(energy.uEnergyCenter.value);
      const collapse = sequence.intro ?? 0;
      energy.uEnergy.value = (1 - smooth(sequence.progress, .28, .6)) * (.85 + Math.sin(collapse * Math.PI) * .9);
    }
  }, -1);
  return <>
    <color attach="background" args={["#040409"]}/>
    <fogExp2 attach="fog" args={["#09090d", .02]}/>
    <hemisphereLight args={["#8b8f9f", "#0a090c", .1]}/>
    {/* Cold moonlight from behind-left rims every stone; faces stay in shadow for the fireball to light. */}
    <directionalLight position={[-11, 14, -13]} color="#c7cfe2" intensity={3.1} castShadow={!balanced} shadow-mapSize-width={compact ? 1024 : 1536} shadow-mapSize-height={compact ? 1024 : 1536} shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-far={80} shadow-normalBias={.04} shadow-bias={-.0003} shadow-radius={4}/>
    <directionalLight position={[7, 5, 14]} color="#5f6070" intensity={.28}/>
    <Environment resolution={256} frames={1}>
      <Lightformer position={[0, 9, -6]} intensity={1.1} scale={[16, 4, 1]} color="#a4abc2" rotation={[Math.PI / 2, 0, 0]}/>
      <Lightformer position={[-9, 2, -4]} intensity={.7} scale={[3, 10, 1]} color="#9c7fe0" rotation={[0, Math.PI / 2, 0]}/>
      <Lightformer position={[9, 1, 2]} intensity={.35} scale={[3, 8, 1]} color="#c9c3d6" rotation={[0, -Math.PI / 2, 0]}/>
      <Lightformer position={[0, -1, 12]} intensity={.18} scale={[20, 2, 1]} color="#3b3552"/>
    </Environment>
    <CosmicBackdrop sequence={sequence} compact={compact || software}/>
    <Stars sequence={sequence}/>
    <SkyAndHorizon sequence={sequence}/>
    <group ref={root}>
      <Vortex sequence={sequence}/>
      <EnergyArcs sequence={sequence} count={compact ? 3 : 5}/>
      <PortalAtmosphere sequence={sequence} floorY={(-3.8 - framing.y) / framing.scale}/>
      <Fragments sequence={sequence} energy={energy} count={compact ? 30 : 46}/>
      <Fragments sequence={sequence} energy={energy} debris count={balanced || compact ? 90 : 170}/>
      <PortalParticles sequence={sequence} balanced={balanced}/>
      {islands.map((_, i) => <Island key={i} index={i} sequence={sequence} lights={!balanced && !compact}/>)}
    </group>
    <Dais sequence={sequence} center={[framing.x * .85, -3.8, -3]}/>
    <LavaRocks sequence={sequence} lights={!balanced}/>
    <PortalEnergy sequence={sequence} software={software} shadows={!balanced && !compact}/>
    <AssemblingMonoliths sequence={sequence}/>
    <DustMotes sequence={sequence} count={software ? 0 : balanced || compact ? 160 : 420}/>
    <GatewayArchitecture sequence={sequence}/>
    <Foreground sequence={sequence} compact={compact} balanced={balanced}/>
    <mesh position={[0, -2.6, -5]} scale={[55, 5, 1]}><planeGeometry/><shaderMaterial ref={mist} vertexShader={vertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false}/></mesh>
    <CameraDirector sequence={sequence}/>
    <AtmosphericFinish sequence={sequence} compact={compact || balanced} disabled={software}/>
  </>;
}

const combineFragment = /* glsl */ `
uniform sampler2D tDiffuse; uniform sampler2D tFire; uniform sampler2D tRays;
uniform vec2 uLight; uniform float uRays; varying vec2 vUv;
void main(){
  vec4 base=texture2D(tDiffuse,vUv);
  // Occlusion-aware light shafts: the fireball-only pass renders every other object black.
  vec2 delta=(vUv-uLight)*(1./48.)*.92; vec2 uv=vUv; float decay=1.; vec3 shafts=vec3(0.);
  for(int i=0;i<48;i++){ uv-=delta; shafts+=texture2D(tRays,clamp(uv,0.,1.)).rgb*decay; decay*=.957; }
  shafts*=uRays/48.;
  vec3 fire=texture2D(tFire,vUv).rgb;
  vec3 o=base.rgb+fire*vec3(.3,.24,.52)+shafts*vec3(.6,.48,1.);
  // A single non-finite HDR sample turns black after AgX; never let one reach the output.
  if(any(isnan(o))||any(isinf(o))) o=any(isnan(base.rgb))||any(isinf(base.rgb)) ? vec3(0.) : base.rgb;
  gl_FragColor=vec4(clamp(o,0.,64.),1.);
}`;

const gradeFragment = /* glsl */ `
uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uResolution; varying vec2 vUv;
float grain(vec2 p){ p=fract(p*vec2(.1031,.103)); p+=dot(p,p.yx+33.33); return fract((p.x+p.y)*p.x); }
void main(){
  vec2 d=vUv-.5; float r2=dot(d,d);
  // Lens: slight radial chromatic aberration toward the frame edge.
  vec3 c=vec3(texture2D(tDiffuse,vUv-d*r2*.007).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv+d*r2*.007).b);
  float l=dot(c,vec3(.2126,.7152,.0722));
  // Split tone: cool blue-violet shadows, faintly warm highlights.
  c=mix(c*vec3(.9,.98,1.06),c,smoothstep(.02,.35,l));
  c=mix(c,c*vec3(1.05,1.,.95),smoothstep(.5,1.,l));
  // Black point and a filmic S-curve restore depth after AgX's gentle shoulder.
  c=max(c-.012,0.)*1.02;
  c=mix(c,c*c*(3.-2.*c),.42);
  // Optical vignette.
  c*=mix(.42,1.,smoothstep(1.08,.28,length(d*vec2(1.,.82))*1.4));
  // Luminance-weighted film grain, re-seeded every frame.
  float g=grain(vUv*uResolution+fract(uTime*61.)*vec2(911.,577.))-.5;
  c+=g*.045*(1.-l*.7);
  gl_FragColor=vec4(max(c,0.),1.);
}`;

/** Copies the sharp, already-occluded fireball render so light shafts start only from visible plasma. */
class SnapshotPass extends Pass {
  target = new WebGLRenderTarget(1, 1, { type: HalfFloatType });
  private quad = new FullScreenQuad(new ShaderMaterial({ uniforms: { tDiffuse: { value: null }, opacity: { value: 1 } }, vertexShader: CopyShader.vertexShader, fragmentShader: CopyShader.fragmentShader }));
  constructor() { super(); this.needsSwap = false; }
  setSize(width: number, height: number) { this.target.setSize(width, height); }
  render(renderer: import("three").WebGLRenderer, _write: WebGLRenderTarget, read: WebGLRenderTarget) {
    (this.quad.material as ShaderMaterial).uniforms.tDiffuse.value = read.texture;
    renderer.setRenderTarget(this.target); this.quad.render(renderer);
  }
  dispose() { this.target.dispose(); this.quad.dispose(); (this.quad.material as ShaderMaterial).dispose(); }
}

function AtmosphericFinish({ sequence, compact, disabled }: { sequence: PortalState; compact: boolean; disabled: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const pipeline = useMemo(() => {
    if (disabled || new URLSearchParams(window.location.search).has("no-post")) return null;
    const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, target);
    const render = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new Vector2(256, 256), .22, .38, 1.15);
    const fireComposer = new EffectComposer(gl, new WebGLRenderTarget(1, 1, { type: HalfFloatType }));
    fireComposer.renderToScreen = false;
    const fireRender = new RenderPass(scene, camera);
    const fireBloom = new UnrealBloomPass(new Vector2(256, 256), .34, .16, 0);
    const snapshot = new SnapshotPass();
    fireComposer.addPass(fireRender); fireComposer.addPass(snapshot); fireComposer.addPass(fireBloom);
    const combine = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, tFire: { value: null }, tRays: { value: null }, uLight: { value: new Vector2(.5, .5) }, uRays: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: combineFragment,
    });
    // ShaderPass clones input uniforms; assign render-target textures after construction.
    combine.uniforms.tFire.value = fireBloom.renderTargetsHorizontal[0].texture;
    combine.uniforms.tRays.value = snapshot.target.texture;
    const grade = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uResolution: { value: new Vector2(1, 1) } },
      vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: gradeFragment,
    });
    const black = new MeshBasicMaterial({ color: 0, side: 2 });
    const background = new Color(0);
    const output = new OutputPass();
    // A single non-finite pixel would be smeared across the frame by bloom; scrub before any blur.
    const sanitize = new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c=texture2D(tDiffuse,vUv); bvec4 bad=bvec4(any(isnan(c)),any(isinf(c)),false,false); gl_FragColor=(bad.x||bad.y)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(256.)),c.a); }",
    });
    composer.addPass(render); composer.addPass(sanitize); if (!compact) composer.addPass(bloom); composer.addPass(combine); composer.addPass(output); composer.addPass(grade);
    return { composer, render, sanitize, bloom, output, fireComposer, fireRender, fireBloom, snapshot, combine, grade, black, background, light: new Vector3(), core: null as Object3D | null, points: [] as Points[], pointsVisible: new Uint8Array(0), scanned: -1, tick: 0 };
  }, [gl, scene, camera, compact, disabled]);
  const dpr = useThree(state => state.viewport.dpr);
  useEffect(() => {
    if (!pipeline) return;
    pipeline.composer.setPixelRatio(Math.min(gl.getPixelRatio(), 1.5));
    pipeline.composer.setSize(size.width, size.height);
    pipeline.fireComposer.setPixelRatio(1);
    const fireScale = Math.min(1, (compact ? 560 : 820) / Math.max(size.width, size.height));
    pipeline.fireComposer.setSize(size.width * fireScale, size.height * fireScale);
    pipeline.grade.uniforms.uResolution.value.set(size.width, size.height);
  }, [pipeline, size.width, size.height, compact, gl, dpr]);
  useEffect(() => () => { if (pipeline) {
    pipeline.bloom.dispose(); pipeline.output.dispose(); pipeline.render.dispose(); pipeline.composer.dispose();
    pipeline.fireRender.dispose(); pipeline.fireBloom.dispose(); pipeline.fireComposer.dispose(); pipeline.combine.dispose(); pipeline.grade.dispose(); pipeline.sanitize.dispose(); pipeline.snapshot.dispose(); pipeline.black.dispose();
  } }, [pipeline]);
  useFrame((state, delta) => {
    if (!pipeline) { gl.render(scene, camera); return; }
    // Fire-only pass: everything except the plasma draws black through scene.overrideMaterial (the
    // plasma materials opt out with allowOverride = false). The scene is scanned every two seconds,
    // never per frame, so this pass allocates nothing while scrolling.
    // Relief level 2: refresh the fire-only pass on alternate frames (its blur hides the one-frame lag).
    pipeline.tick = (pipeline.tick + 1) % 2;
    const refreshFire = (sequence.relief ?? 0) < 2 || pipeline.tick === 0;
    if (refreshFire && (pipeline.scanned < 0 || state.clock.elapsedTime - pipeline.scanned > 2)) {
      pipeline.scanned = state.clock.elapsedTime;
      pipeline.points.length = 0;
      scene.traverse(object => {
        if (object instanceof Points) pipeline.points.push(object);
        else if (object instanceof Mesh && object.userData.fireballBloom) {
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.allowOverride = false;
        }
      });
      if (pipeline.pointsVisible.length < pipeline.points.length) pipeline.pointsVisible = new Uint8Array(pipeline.points.length * 2);
    }
    const background = scene.background;
    const fog = scene.fog;
    const shadowUpdate = gl.shadowMap.autoUpdate;
    // Restore every borrowed scene property even if the offscreen render fails.
    if (refreshFire) try {
      scene.background = pipeline.background;
      scene.fog = null;
      scene.overrideMaterial = pipeline.black;
      gl.shadowMap.autoUpdate = false;
      for (let i = 0; i < pipeline.points.length; i++) { pipeline.pointsVisible[i] = pipeline.points[i].visible ? 1 : 0; pipeline.points[i].visible = false; }
      pipeline.fireComposer.render(delta);
    } finally {
      for (let i = 0; i < pipeline.points.length; i++) pipeline.points[i].visible = pipeline.pointsVisible[i] === 1;
      scene.overrideMaterial = null;
      scene.background = background;
      scene.fog = fog;
      gl.shadowMap.autoUpdate = shadowUpdate;
    }
    pipeline.core ??= scene.getObjectByName("fireball-core") ?? null;
    const relief = sequence.relief ?? 0;
    pipeline.bloom.enabled = relief < 1;
    let rays = 0;
    if (pipeline.core) {
      pipeline.core.getWorldPosition(pipeline.light).project(camera);
      const onScreen = pipeline.light.z < 1 ? 1 - MathUtils.smoothstep(Math.max(Math.abs(pipeline.light.x), Math.abs(pipeline.light.y)), .95, 1.6) : 0;
      pipeline.combine.uniforms.uLight.value.set(pipeline.light.x * .5 + .5, pipeline.light.y * .5 + .5);
      rays = onScreen * (compact ? .22 : .3);
    }
    // While the plasma passes behind foreground rock, halos should not paint over the stone.
    const crossing = MathUtils.smoothstep(sequence.progress, .4, .55) * (1 - MathUtils.smoothstep(sequence.progress, .75, .88));
    pipeline.fireBloom.strength = .34 * (1 - crossing * .55);
    pipeline.combine.uniforms.uRays.value = rays * (1 - crossing * .5);
    pipeline.grade.uniforms.uTime.value = state.clock.elapsedTime;
    pipeline.composer.render(delta);
  }, 1);
  return null;
}

function startingQuality() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8, memory = nav.deviceMemory ?? 8;
  const balanced = cores <= 4 || memory <= 4;
  const compact = innerWidth / innerHeight < 1.05;
  const cap = balanced ? 1 : Math.min(devicePixelRatio || 1, compact ? 1.5 : 1.75);
  return { balanced, cap };
}

export default function PortalCanvas({ sequence, active, onReady, onFailure }: Props) {
  const start = useMemo(startingQuality, []);
  const [quality, setQuality] = useState<"high" | "balanced" | "software">(start.balanced ? "balanced" : "high");
  const onQuality = useMemo(() => (software: boolean) => setQuality(software ? "software" : "balanced"), []);
  const cap = quality === "high" ? start.cap : 1;
  return <Boundary onFailure={onFailure}><Canvas shadows="soft" onCreated={({ gl }) => { gl.toneMapping = AgXToneMapping; gl.toneMappingExposure = 1.2; }} frameloop={active ? "demand" : "never"} dpr={cap} camera={{ position: [0, 1, 15], fov: 46, near: .1, far: 100 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} fallback="The original Tierplay artwork is available without WebGL.">
    <Scene sequence={sequence} onReady={onReady} onFailure={onFailure} onQuality={onQuality} startBalanced={start.balanced} dprCap={cap}/>
  </Canvas></Boundary>;
}
