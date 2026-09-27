"use client";
import { Component, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Object3D, Texture } from "three";
import { AssetManager } from "./assets/AssetManager";
import { decodeImage, decodeModel, disposeModel } from "./assets/decode";
import { makeCameraPaths } from "./camera/CameraPath";
import { CameraDirector } from "./camera/CameraDirector";
import { LightingDirector } from "./directors/LightingDirector";
import { newRuntime, TransitionDirector } from "./directors/TransitionDirector";
import { Cabinet } from "./entities/Cabinet";
import { PerformanceManager } from "./performance/PerformanceManager";
import { qualitySettings, type QualityTier } from "../config/performance.config";
import type { SceneEvent, SceneState } from "./state/SceneDirector";
interface Assets { cabinet: Object3D; room: Object3D; screen: Texture }
interface Props { manager: AssetManager; state: SceneState; dispatch: Dispatch<SceneEvent>; quality: QualityTier; active: boolean; onReady: () => void; onFailure: (message: string) => void; onQuality: (tier: QualityTier) => void }
class Boundary extends Component<{ children: ReactNode; onFailure: Props["onFailure"] }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onFailure(error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}
function Runtime({ assets, ...props }: Props & { assets: Assets }) {
  const { gl, invalidate, size } = useThree();
  const runtime = useRef(newRuntime());
  const mobile = size.width < 768;
  const paths = useMemo(() => {
    assets.room.updateMatrixWorld(true);
    const anchor = assets.room.getObjectByName("CabinetAnchor")!;
    anchor.getWorldPosition(assets.cabinet.position);
    anchor.getWorldQuaternion(assets.cabinet.quaternion);
    assets.cabinet.updateMatrixWorld(true);
    return makeCameraPaths(assets.room, assets.cabinet, mobile);
  }, [assets, mobile]);
  const sampler = useMemo(() => new PerformanceManager(props.quality), [props.quality]);
  const warmup = useRef(0);
  useFrame((_, delta) => {
    if (!runtime.current.moving || !props.active) return;
    warmup.current++;
    if (warmup.current < 30) return;
    const tier = sampler.sample(delta * 1000);
    if (tier !== props.quality) props.onQuality(tier);
  });
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); props.onFailure("The 3D view was interrupted. The reference view remains available."); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    props.onReady();
    invalidate();
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, invalidate, props.onReady, props.onFailure]);
  return <>
    <color attach="background" args={["#111312"]} />
    <primitive object={assets.room} dispose={null} />
    <Cabinet model={assets.cabinet} texture={assets.screen} runtime={runtime} dispatch={props.dispatch} />
    <CameraDirector paths={paths} runtime={runtime} />
    <LightingDirector runtime={runtime} />
    <TransitionDirector state={props.state} runtime={runtime} dispatch={props.dispatch} invalidate={invalidate} mobile={mobile} active={props.active} />
  </>;
}
export default function PrototypeCanvas(props: Props) {
  const [assets, setAssets] = useState<Assets | null>(null);
  useEffect(() => {
    let disposed = false;
    let owned: Assets | null = null;
    const cabinet = props.manager.get("TP-001"), room = props.manager.get("TP-004"), screen = props.manager.get("TP-005");
    if (!cabinet || !room || !screen) { props.onFailure("Required scene assets have not loaded."); return; }
    Promise.allSettled([decodeModel(cabinet), decodeModel(room), decodeImage(screen)]).then((results) => {
      const failed = results.find((result) => result.status === "rejected");
      if (disposed || failed) {
        results.forEach((result) => { if (result.status === "fulfilled") { if (result.value instanceof Texture) result.value.dispose(); else disposeModel(result.value); } });
        if (!disposed && failed?.status === "rejected") props.onFailure(failed.reason instanceof Error ? failed.reason.message : "Unable to decode the scene.");
        return;
      }
      owned = { cabinet: (results[0] as PromiseFulfilledResult<Object3D>).value, room: (results[1] as PromiseFulfilledResult<Object3D>).value, screen: (results[2] as PromiseFulfilledResult<Texture>).value };
      setAssets(owned);
    });
    return () => { disposed = true; if (owned) { disposeModel(owned.cabinet); disposeModel(owned.room); owned.screen.dispose(); } };
  }, [props.manager, props.onFailure]);
  if (!assets) return null;
  return <Boundary onFailure={props.onFailure}>
    <Canvas aria-hidden="true" frameloop={props.active ? "demand" : "never"} dpr={qualitySettings[props.quality].dpr} camera={{ near: 0.015, far: 80, fov: 42 }} gl={{ antialias: props.quality === "high", powerPreference: "low-power" }} fallback={<CanvasUnavailable onFailure={props.onFailure} />}>
      <Runtime {...props} assets={assets} />
    </Canvas>
  </Boundary>;
}
function CanvasUnavailable({ onFailure }: { onFailure: Props["onFailure"] }) {
  useEffect(() => { onFailure("This browser cannot display the 3D view."); }, [onFailure]);
  return null;
}
