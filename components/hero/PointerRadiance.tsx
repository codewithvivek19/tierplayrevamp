"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, MathUtils, Mesh, Plane, Raycaster, ShaderMaterial, Vector2, Vector3, type PointLight } from "three";
import { radianceFragment } from "./plasmaShaders";
import { vertex } from "./portalShaders";
import type { PortalState } from "./portalState";

// GhostCursor's inertial trail and idle fade, in the existing world/canvas.
export default function PointerRadiance({sequence}:{sequence:PortalState}) {
  const meshes=useRef<(Mesh|null)[]>([]);
  const light=useRef<PointLight>(null);
  const state=useMemo(()=>({ray:new Raycaster(),plane:new Plane(new Vector3(0,0,1),0),pointer:new Vector2(),last:new Vector2(99,99),target:new Vector3(),points:Array.from({length:5},()=>new Vector3()),lastMove:-10,initialized:false}),[]);
  const uniforms=useMemo(()=>Array.from({length:5},()=>({uTime:{value:0},uOpacity:{value:0}})),[]);
  useFrame(({camera},delta)=>{
    if(sequence.paused) return;
    const p=sequence.progress, t=sequence.time;
    state.pointer.set(sequence.pointerX,-sequence.pointerY);
    if(sequence.pointerActive && state.pointer.distanceToSquared(state.last)>.000002){state.lastMove=t;state.last.copy(state.pointer);}
    const fade=sequence.pointerActive ? 1-MathUtils.smoothstep(t-state.lastMove,1,2.5) : 1-MathUtils.smoothstep(t-state.lastMove,.1,1.5);
    const travel=MathUtils.smootherstep(p,.32,.8);
    const z=MathUtils.lerp(-.5,-14.5,travel);
    state.plane.constant=-z;state.ray.setFromCamera(state.pointer,camera);
    state.ray.ray.intersectPlane(state.plane,state.target);
    // Keep the opening's typography clear; arrival fog can play over the piers.
    const region=MathUtils.lerp(MathUtils.smoothstep(sequence.pointerX,-.15,.3),1,travel);
    if(!state.initialized){state.points.forEach(v=>v.copy(state.target));state.initialized=true;}
    state.points.forEach((point,i)=>{
      const target=i===0?state.target:state.points[i-1];
      point.lerp(target,1-Math.exp(-Math.min(delta,.1)*(i===0?8:5)));
      const mesh=meshes.current[i];if(!mesh)return;
      mesh.position.copy(point);mesh.visible=fade*region>.002;
      const shader=mesh.material as ShaderMaterial;
      shader.uniforms.uTime.value=t+i*.3;
      shader.uniforms.uOpacity.value=fade*region*(1-i*.14)*.13;
    });
    if(light.current){light.current.position.copy(state.points[0]);light.current.intensity=fade*region*9;}
  });
  return <>
    {uniforms.map((u,i)=><mesh key={i} ref={m=>{meshes.current[i]=m;}} visible={false}>
      <planeGeometry args={[5,5]}/><shaderMaterial uniforms={u} vertexShader={vertex} fragmentShader={radianceFragment} transparent depthWrite={false} blending={AdditiveBlending}/>
    </mesh>)}
    <pointLight ref={light} color="#b497cf" intensity={0} distance={8}/>
  </>;
}
