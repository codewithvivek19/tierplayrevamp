"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from "three";

// Adapted from React Bits GridScan (TS + CSS): a raytraced grid tunnel swept by a scan band.
// Tierplay changes: webcam face tracking (face-api.js) removed in favour of pointer-driven skew;
// the `postprocessing` bloom/chromatic/noise chain is folded into the shader; rendering pauses
// off screen and under reduced motion draws a single still frame.
const fragment = /* glsl */ `
precision highp float;
uniform vec2 uResolution; uniform float uTime; uniform vec2 uSkew; uniform float uYaw; uniform float uTilt;
uniform vec3 uLines; uniform vec3 uScan; uniform float uGridScale; uniform float uThickness;
uniform float uScanOpacity; uniform float uBloom; uniform float uChroma; uniform float uNoise; uniform float uPortrait;

float smoother01(float a,float b,float x){float t=clamp((x-a)/max(1e-5,b-a),0.,1.);return t*t*t*(t*(t*6.-15.)+10.);}
float gridLine(vec2 g,float halfPx){
  vec2 f=fract(g); vec2 a=min(f,1.-f); vec2 w=fwidth(g);
  vec2 l=1.-smoothstep(halfPx*w,halfPx*w+w,a);
  return max(l.x,l.y);
}
vec3 shade(vec2 fragCoord,out float alpha){
  vec2 p=(2.*fragCoord-uResolution)/uResolution.y;
  // Portrait screens: frame the tunnel by width as a landscape view would, so its walls stay in frame
  // and the floor and ceiling grids fill the tall space instead of collapsing into a thin band.
  p=mix(p,(2.*fragCoord-uResolution)/uResolution.x*1.5,uPortrait);
  vec3 rd=normalize(vec3(p,2.));
  float cR=cos(uTilt),sR=sin(uTilt); rd.xy=mat2(cR,-sR,sR,cR)*rd.xy;
  float cY=cos(uYaw),sY=sin(uYaw); rd.xz=mat2(cY,-sY,sY,cY)*rd.xz;
  vec2 skew=clamp(uSkew,vec2(-.7),vec2(.7)); rd.xy+=skew*rd.z;
  float minT=1e20; vec2 uv=vec2(0.); float isYHit=1.;
  for(int i=0;i<4;i++){
    float isY=float(i<2);
    float pos=mix(-.2,.2,float(i))*isY+mix(-.5,.5,float(i-2))*(1.-isY);
    float den=isY*rd.y+(1.-isY)*rd.x;
    float t=pos/(abs(den)<1e-5?1e-5:den);
    vec3 h=rd*t; h.xy+=skew*.15*smoothstep(0.,3.,h.z);
    bool use=t>0.&&t<minT;
    uv=use?mix(h.zy,h.xz,isY)/uGridScale:uv; minT=use?t:minT; isYHit=use?isY:isYHit;
  }
  vec3 hit=rd*minT; float dist=length(hit);
  float lines=gridLine(uv,uThickness*(.5+uPortrait*.35));
  float fade=exp(-dist*2.);
  float dur=2.4,del=1.8; float cyc=mod(uTime,dur+del);
  float phase=clamp((cyc-del)/dur,0.,1.);
  float dz=abs(hit.z-phase*2.); float sigma=.09;
  float window=smoother01(0.,.2,phase)*(1.-smoother01(.8,1.,phase));
  float pulse=exp(-.5*dz*dz/(sigma*sigma))*window*uScanOpacity*(1.+uPortrait*.5);
  float aura=exp(-.5*dz*dz/(sigma*sigma*4.))*.25*window*uScanOpacity;
  vec3 col=uLines*(1.+uPortrait*1.6)*lines*fade+uScan*(pulse+aura)+uScan*lines*pulse*1.4;
  float glow=gridLine(uv,uThickness*1.6)*fade;
  alpha=clamp(max(max(lines*fade,pulse),glow*uBloom),0.,1.);
  return col;
}
void main(){
  float a0,a1,a2;
  vec2 c=gl_FragCoord.xy; vec2 dir=normalize(c-.5*uResolution+1e-4)*uChroma*uResolution.y;
  vec3 col=vec3(shade(c+dir,a0).r,shade(c,a1).g,shade(c-dir,a2).b);
  float n=fract(sin(dot(c+uTime*123.4,vec2(12.9898,78.233)))*43758.5453);
  col+=(n-.5)*uNoise;
  float alpha=max(a1,max(a0,a2));
  gl_FragColor=vec4(clamp(col,0.,1.)*alpha,alpha);
}`;

export default function GridScan({ linesColor = "#2F293A", scanColor = "#FF9FFC", sensitivity = .55, lineThickness = 1, gridScale = .1, scanOpacity = .4, bloomIntensity = .6, chromaticAberration = .002, noiseIntensity = .01, className = "" }: {
  linesColor?: string; scanColor?: string; sensitivity?: number; lineThickness?: number; gridScale?: number;
  scanOpacity?: number; bloomIntensity?: number; chromaticAberration?: number; noiseIntensity?: number; className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    // No WebGL context until the footer is close: the hero keeps the page's only canvas.
    let teardown: (() => void) | undefined;
    const gate = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || teardown) return;
      gate.disconnect();
      teardown = start(element);
    }, { rootMargin: "500px 0px" });
    gate.observe(element);
    return () => { gate.disconnect(); teardown?.(); };
  }, [linesColor, scanColor, sensitivity, lineThickness, gridScale, scanOpacity, bloomIntensity, chromaticAberration, noiseIntensity]);

  function start(element: HTMLDivElement) {
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power", premultipliedAlpha: true }); }
    catch { return undefined; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    element.appendChild(renderer.domElement);
    const toVec = (hex: string) => { const c = new Color(hex); return new Vector3(c.r, c.g, c.b); };
    const material = new ShaderMaterial({
      vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}",
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uResolution: { value: new Vector2(1, 1) }, uTime: { value: 0 }, uSkew: { value: new Vector2() }, uYaw: { value: 0 }, uTilt: { value: 0 },
        uLines: { value: toVec(linesColor) }, uScan: { value: toVec(scanColor) }, uGridScale: { value: gridScale }, uThickness: { value: lineThickness },
        uScanOpacity: { value: scanOpacity }, uBloom: { value: bloomIntensity }, uChroma: { value: chromaticAberration }, uNoise: { value: noiseIntensity }, uPortrait: { value: 0 },
      },
    });
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene(); scene.add(new Mesh(geometry, material));
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
      material.uniforms.uPortrait.value = height > width * 1.15 ? 1 : 0;
    };
    resize();
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(element);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const goal = new Vector2(), skew = new Vector2();
    let lastMouse = -1e9;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastMouse = performance.now();
      const box = element.getBoundingClientRect();
      goal.set(((event.clientX - box.left) / box.width - .5) * sensitivity * .9, -((event.clientY - box.top) / box.height - .5) * sensitivity * .5);
    };
    let frame = 0, visible = false, last = performance.now(), time = 0;
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, .05); last = now; time += dt;
      // Touch screens (or an idle mouse) get a slow autonomous drift so the grid keeps moving.
      if (now - lastMouse > 2500) goal.set(Math.sin(time * .32) * sensitivity * .3, Math.cos(time * .23) * sensitivity * .06);
      skew.lerp(goal, 1 - Math.exp(-dt * (now - lastMouse > 2500 ? 1.2 : 4)));
      material.uniforms.uTime.value = time;
      material.uniforms.uSkew.value.copy(skew);
      material.uniforms.uYaw.value = skew.x * .35;
      renderer.render(scene, camera);
      frame = visible && !document.hidden ? requestAnimationFrame(draw) : 0;
    };
    const wake = () => { if (!frame && visible && !document.hidden && !reduced) { last = performance.now(); frame = requestAnimationFrame(draw); } };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }, { rootMargin: "100px" });
    observer.observe(element);
    if (reduced) { material.uniforms.uTime.value = 3.4; renderer.render(scene, camera); }
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", wake);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect();
      removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", wake);
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }
  return <div ref={host} className={`grid-scan ${className}`} aria-hidden="true" />;
}
