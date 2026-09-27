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
  float t=uTime*.12+uProgress*2.;
  float cloud=fbm(vec3(p*5.,t*.3));
  vec2 curl=vec2(cos(a+r*4.-t),sin(a+r*4.-t))*r;
  float turbulence=fbm(vec3(curl*16.,t*.4));
  float fine=fbm(vec3(curl*52.,t*.25));
  float spiral=sin(r*69.-a*5.-t*3.+cloud*18.+turbulence*7.);
  float filaments=pow(max(0.,spiral),28.)*pow(turbulence+.25,2.);
  float inner=exp(-r*24.); float rim=exp(-pow((r-.86+(cloud-.5)*.12)*38.,2.));
  float web=pow(max(0.,1.-abs(fine-.48)*12.),10.)*turbulence;
  vec3 violet=mix(vec3(.014,.006,.065),vec3(.12,.025,.38),cloud);
  vec3 color=violet*(.3+turbulence*1.1)+vec3(.14,.21,.68)*web*.8;
  color+=vec3(.23,.3,1.)*filaments*2.2;
  color+=vec3(.48,.07,.7)*rim*(.12+turbulence*.8)+vec3(1.,.52,.88)*inner*5.;
  float flare=pow(max(0.,1.-abs(p.y+.20*p.x)),230.)*exp(-abs(p.x)*2.8);
  color+=vec3(.85,.18,.55)*flare*1.6;
  float alpha=(1.-smoothstep(.9,1.,r));
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
export const atmosphereFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime;
${noise}
void main(){
 vec2 p=vUv;float n=fbm(vec3(p*6.,uTime*.012));
 float mist=pow(n,3.)*exp(-abs(p.y-.5)*3.);
 vec3 col=mix(vec3(.003,.004,.009),vec3(.11,.085,.15),mist*2.);
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
 float falloff=pow(max(0.,1.-abs(vUv.y-.5)*2.),3.)*pow(sin(vUv.x*3.14159),.5);
 gl_FragColor=vec4(vec3(.24,.18,.34),n*falloff*.33);
}`;
export const beamFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime; ${noise}
void main(){
 float beam=exp(-abs(vUv.x-.5)*30.); float strand=pow(max(0.,sin(vUv.x*125.+fbm(vec3(vUv*8.,uTime*.08))*7.)),8.);
 gl_FragColor=vec4(vec3(.62,.45,.94),beam*(.04+strand*.12)*sin(vUv.y*3.14159));
}`;
