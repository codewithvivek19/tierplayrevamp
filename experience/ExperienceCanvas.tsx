"use client";
import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  SRGBColorSpace,
  MathUtils,
  ShaderMaterial,
  TextureLoader,
  Vector2,
} from "three";
import type { ReactNode } from "react";
import type { Sequence } from "@/systems/ExperienceState";
import { CameraDirector } from "./camera/CameraDirector";
import { media } from "@/systems/AssetManager";
class Boundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment = `
uniform sampler2D uHero;uniform sampler2D uWorld;uniform float uAspect;uniform float uHeroAspect;uniform float uMobile;uniform float uProgress;uniform float uTime;uniform vec2 uPointer;varying vec2 vUv;
vec2 cover(vec2 uv,float imageAspect,float center){vec2 scale=vec2(min(uAspect/imageAspect,1.),min(imageAspect/uAspect,1.));return (uv-.5)*scale+vec2(center,.5);}
void main(){
 float p=smoothstep(.04,.96,uProgress);
 vec2 uv=cover(vUv,uHeroAspect,.5);
 float depth=smoothstep(.1,.9,uv.x)*.7+(1.-uv.y)*.3;
 vec2 offset=uPointer*.018*depth;
 vec2 focal=mix(vec2(.668,.64),vec2(.59,.7),uMobile);
 vec2 heroUv=(uv-focal)/(1.+p*.75)+focal+offset;
 heroUv.y+=sin(uv.x*16.+uTime*.5)*.0005*(1.-uv.y);
 vec2 worldBase=cover(vUv,1.7768,mix(.5,.7,uMobile));
 vec2 worldUv=(worldBase-.5)/(1.045+(1.-p)*.12)+.5+offset*1.4;
 vec4 hero=texture2D(uHero,clamp(heroUv,.001,.999));
 vec4 world=texture2D(uWorld,clamp(worldUv,.001,.999));
 float distanceFromScreen=length((vUv-vec2(.67,.6))*vec2(uAspect,1.));
 float radius=smoothstep(.25,.9,p)*2.4;
 float reveal=(1.-smoothstep(radius-.25,radius+.15,distanceFromScreen))*smoothstep(.18,.5,p);
 vec3 color=mix(hero.rgb,world.rgb,reveal);
 float edge=exp(-abs(distanceFromScreen-radius)*20.)*sin(p*3.14159)*.11;
 color+=vec3(1.,.22,.035)*edge;
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
function World({
  sequence,
  onReady,
}: {
  sequence: Sequence;
  onReady: () => void;
}) {
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;
  const textures = useLoader(TextureLoader, [
    isMobile ? media.mobile : media.cabinet,
    media.world,
  ]);
  textures.forEach((texture) => {
    texture.colorSpace = SRGBColorSpace;
  });
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uHero: { value: textures[0] },
      uWorld: { value: textures[1] },
      uAspect: { value: 1 },
      uHeroAspect: { value: isMobile ? 0.5628 : 1.7768 },
      uMobile: { value: isMobile ? 1 : 0 },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new Vector2() },
    }),
    [textures, isMobile],
  );
  useEffect(() => {
    onReady();
  }, [onReady]);
  useFrame(({ clock }, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uAspect.value = size.width / size.height;
    u.uProgress.value = sequence.progress;
    u.uTime.value = clock.elapsedTime;
    u.uPointer.value.x = MathUtils.damp(
      u.uPointer.value.x,
      sequence.pointerX,
      3,
      delta,
    );
    u.uPointer.value.y = MathUtils.damp(
      u.uPointer.value.y,
      sequence.pointerY,
      3,
      delta,
    );
  });
  return (
    <mesh>
      <planeGeometry args={[viewport.width * 1.025, viewport.height * 1.025]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        toneMapped={false}
      />
    </mesh>
  );
}
function Embers() {
  const ref = useRef<ShaderMaterial>(null);
  const { viewport } = useThree();
  const points = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.sin(i * 127.1) * 43758.5453) % 1;
      arr[i * 3 + 1] = (Math.sin(i * 311.7) * 17231.31) % 1;
      arr[i * 3 + 2] = i / 80;
    }
    return arr;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: new Vector2() } }),
    [],
  );
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = clock.elapsedTime;
      ref.current.uniforms.uSize.value.set(viewport.width, viewport.height);
    }
  });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={ref}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexShader={`uniform float uTime;uniform vec2 uSize;varying float vAlpha;void main(){vec3 p=position;p.x=p.x*uSize.x*.65+sin(uTime*.17+p.z*30.)*.14;p.y=(fract(p.y*.5+.5+uTime*(.015+p.z*.018))-.5)*uSize.y*1.15;p.z=.15+position.z*.4;vAlpha=.25+position.z*.5;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=2.+position.z*4.;gl_Position=projectionMatrix*mv;}`}
        fragmentShader={`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.08,d)*vAlpha;gl_FragColor=vec4(1.,.25,.045,a);}`}
      />
    </points>
  );
}
function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}
export default function ExperienceCanvas({
  sequence,
  dpr,
  active,
  onReady,
  onFailure,
}: {
  sequence: Sequence;
  dpr: number;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  return (
    <Boundary onFailure={onFailure}>
      <Canvas
        aria-hidden="true"
        frameloop={active ? "always" : "never"}
        dpr={[1, Math.min(dpr, 1.5)]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        fallback={<span />}
      >
        <Suspense fallback={null}>
          <World sequence={sequence} onReady={onReady} />
          <Embers />
        </Suspense>
        <CameraDirector sequence={sequence} />
        <ContextGuard onFailure={onFailure} />
      </Canvas>
    </Boundary>
  );
}
