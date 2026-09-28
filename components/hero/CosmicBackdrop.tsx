"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderTarget } from "three";
import type { PortalState } from "./portalState";

// Adapted from the user-supplied Cosmic BG — Originkit. Its nested domain
// warping is evaluated at a bounded resolution, then shared by all scene passes.
const fragment = `
uniform float uTime; uniform vec2 uResolution;
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=rot(.5)*p*2.1;a*=.5;}return v;}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;
 p=rot(-.38+uTime*.0015)*p*1.45;
 float t=uTime*.022,dist=length(p);
 vec2 nebP=p*5.5;
 vec2 q=vec2(fbm(nebP+vec2(cos(t),sin(t))),fbm(nebP+1.2));
 vec2 r=vec2(fbm(nebP+4.*q+t),fbm(nebP+4.*q+2.8));
 float f=fbm(nebP+4.*r);
 float ring=smoothstep(.02,.32,dist)*(1.-smoothstep(.65,1.3,dist));
 vec3 color=mix(vec3(.055,.070,.12),vec3(.18,.10,.24),smoothstep(.2,.6,f));
 color=mix(color,vec3(.38,.33,.43),smoothstep(.48,.86,f));
 float dust=smoothstep(.3,.9,fbm(nebP*1.5+r));
 dust=mix(1.,dust,smoothstep(0.,.3,dist));
 vec3 nebula=color*(.3+ring)*pow(f,1.2)*mix(.38,1.,dust)*.24;
 nebula*=smoothstep(.38,.56,gl_FragCoord.y/uResolution.y);
 gl_FragColor=vec4(vec3(.006,.006,.012)+nebula,1.);
}`;

export default function CosmicBackdrop({ sequence, compact }: { sequence: PortalState; compact: boolean }) {
  const lastUpdate = useRef(-1);
  const resources = useMemo(() => {
    const width = compact ? 512 : 768, height = Math.round(width * .625);
    const target = new WebGLRenderTarget(width, height, { depthBuffer: false, stencilBuffer: false });
    const material = new ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uResolution: { value: new Vector2(width, height) } },
      vertexShader: 'void main(){gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: fragment, depthTest: false, depthWrite: false,
    });
    const geometry = new PlaneGeometry(2, 2), scene = new Scene();
    scene.add(new Mesh(geometry, material));
    return { target, material, geometry, scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1), drawn: false };
  }, [compact]);
  useEffect(() => () => { resources.target.dispose(); resources.material.dispose(); resources.geometry.dispose(); }, [resources]);
  useFrame(({ gl }) => {
    if (resources.drawn && (sequence.paused || sequence.time - lastUpdate.current < 1 / 24)) return;
    resources.material.uniforms.uTime.value = sequence.time;
    const previous = gl.getRenderTarget();
    gl.setRenderTarget(resources.target); gl.render(resources.scene, resources.camera); gl.setRenderTarget(previous);
    resources.drawn = true; lastUpdate.current = sequence.time;
  }, -.6);
  return <mesh name="cosmic-background" position={[0, 9, -70]} scale={[180, 120, 1]}>
    <planeGeometry/><meshBasicMaterial map={resources.target.texture} fog={false} depthWrite={false}/>
  </mesh>;
}
