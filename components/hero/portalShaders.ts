// Shared, deterministic world-space noise: no image or external texture dependency.
export const noise = /* glsl */ `
float hash(vec3 p) { p=fract(p*.3183099+vec3(.1,.2,.3)); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<4;i++){v+=a*noise3(p);p=p*2.03+11.7;a*=.5;}return v; }
`;
export const vertex = /* glsl */ `varying vec2 vUv; void main(){ vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
export const portalFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime; uniform float uProgress;
${noise}
void main(){
  vec2 p=(vUv-.5)*2.; float r=length(p); float a=atan(p.y,p.x);
  float t=uTime*.24+uProgress*2.;
  vec2 curl=vec2(cos(a-r*3.4+t),sin(a-r*3.4+t))*r;
  float cloud=fbm(vec3(curl*5.,t*.22));
  float turbulence=fbm(vec3(curl*13.+cloud*2.5,t*.31));
  float fine=fbm(vec3(curl*32.+turbulence,t*.15));
  float envelope=smoothstep(.12,.40,r)*(1.-smoothstep(.75,1.,r));
  float veins=pow(max(0.,1.-abs(turbulence-.48)*6.),4.);
  float dust=pow(fine,3.)*envelope;
  float inner=exp(-r*19.);
  float rim=exp(-pow((r-.79+(cloud-.5)*.24)*14.,2.));
  vec3 color=vec3(.009,.008,.023);
  color+=mix(vec3(.08,.035,.19),vec3(.28,.13,.48),cloud)*envelope*(.4+turbulence);
  color+=mix(vec3(.19,.26,.55),vec3(.62,.32,.59),fine)*veins*envelope*.9;
  color+=vec3(.27,.38,.64)*dust*1.1;
  float thread=1.-smoothstep(.012,.035+fwidth(fine),abs(fine-.47));
  color+=vec3(.33,.24,.52)*thread*envelope*pow(turbulence,2.)*.8;
  color+=vec3(.24,.14,.42)*rim*(.12+turbulence*.48);
  color+=vec3(1.,.76,.64)*inner*2.8;
  float flare=exp(-abs(p.y+.16*p.x)*170.)*exp(-abs(p.x)*4.);
  color+=vec3(.6,.35,.5)*flare*.7;
  float alpha=(1.-smoothstep(.9,1.,r));
  gl_FragColor=vec4(color*.92,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
export const atmosphereFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime;
${noise}
void main(){
 vec2 p=vUv;float n=fbm(vec3(p*6.,uTime*.012));
 float mist=pow(n,2.)*exp(-abs(p.y-.55)*4.);
 vec3 col=mix(vec3(.003,.004,.009),vec3(.12,.085,.17),mist*2.);
 float haze=exp(-length((p-vec2(.68,.6))*vec2(3.,2.))*3.);
 col+=vec3(.04,.032,.057)*haze;
 col=mix(vec3(.0034,.0027,.0075),col,smoothstep(.39,.7,p.y));
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const glowFragment = /* glsl */ `varying vec2 vUv; uniform vec3 uColor; void main(){ float d=length((vUv-.5)*2.);gl_FragColor=vec4(uColor,pow(max(0.,1.-d),3.)*.6); }`;
export const mistFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime; ${noise}
void main(){
 float n=fbm(vec3(vUv*vec2(9.,3.),uTime*.02));
 // Guard interpolated edge UVs: NaN alpha can poison the entire HDR bloom chain.
 float falloff=pow(max(0.,1.-abs(vUv.y-.5)*2.),3.)*sqrt(max(0.,sin(clamp(vUv.x,0.,1.)*3.14159265)));
 gl_FragColor=vec4(vec3(.2,.19,.25),n*falloff*.2);
}`;
export const beamFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime; ${noise}
void main(){
 float beam=exp(-abs(vUv.x-.5)*30.); float strand=pow(max(0.,sin(vUv.x*125.+fbm(vec3(vUv*8.,uTime*.08))*7.)),8.);
 gl_FragColor=vec4(vec3(.62,.45,.94),beam*(.04+strand*.12)*sin(vUv.y*3.14159));
}`;
