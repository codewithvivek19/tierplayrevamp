import { rockNoise } from "./rockNoise";

// Plasma star. Replaces the supplied toon bands with physically motivated emission:
// convection granulation, magnetic filaments, limb brightening and a flaring corona.
// Output is linear HDR so the selective bloom and god-ray passes can resolve it.
export const fireballVertex = /* glsl */ `
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
void main(){
  vObj=position;
  vec4 mv=modelViewMatrix*vec4(position,1.);
  vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz);
  gl_Position=projectionMatrix*mv;
}`;

export const fireballFragment = /* glsl */ `
#define ROCK_OCTAVES 4
${rockNoise}
uniform float uTime; uniform float uMorph; uniform float uImpulse;
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
void main(){
  float nv=clamp(dot(normalize(vN),normalize(vV)),0.,1.);
  float t=uTime;
  vec3 p=vObj*2.1;
  vec3 warp=vec3(snoise(p+vec3(0.,0.,t*.22)),snoise(p+vec3(5.2,1.3,-t*.19)),snoise(p+vec3(2.1,8.7,t*.17)));
  float cells=rkCells(p*2.4+warp*.9+vec3(0.,t*.12,0.)).x;
  float granules=1.-smoothstep(.05,.75,cells);
  float churn=rkFbm(p*1.6+warp*1.3+vec3(t*.08,-t*.11,t*.05))*.5+.5;
  float filaments=pow(1.-abs(snoise(p*3.2+warp*1.1-vec3(0.,0.,t*.35))),7.);
  float heat=clamp(churn*.5+granules*.42+filaments*.6-.12,0.,1.);
  vec3 deep=vec3(.16,.02,.62), violet=vec3(.95,.2,1.9), white=vec3(3.,2.45,3.1);
  vec3 c=mix(deep,violet,smoothstep(.25,.62,heat));
  c=mix(c,white,smoothstep(.72,.98,heat));
  // Optically thick core: the centre reads hotter, the limb glows through thinner plasma.
  c*=mix(.62,1.25,pow(nv,.7));
  c+=vec3(.9,.28,1.9)*pow(1.-nv,2.6)*1.1;
  c*=1.+uImpulse*.4+uMorph*.25;
  gl_FragColor=vec4(c,1.);
}`;

export const coronaVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv=uv;
  // Camera-facing quad centred on the star: keep scale, drop rotation.
  vec4 centre=modelViewMatrix*vec4(0.,0.,0.,1.);
  float s=length(modelMatrix[0].xyz);
  gl_Position=projectionMatrix*(centre+vec4(position.xy*s,0.,0.));
}`;

export const coronaFragment = /* glsl */ `
#define ROCK_OCTAVES 3
${rockNoise}
uniform float uTime; uniform float uImpulse; uniform float uOpacity;
varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.; float r=length(p); float a=atan(p.y,p.x+1e-5);
  float t=uTime;
  vec2 ring=vec2(cos(a),sin(a));
  // Streamers: angular noise stretched radially and advected outward.
  float streamers=rkFbm(vec3(ring*2.4,r*1.2-t*.18))*.5+.5;
  float fine=pow(1.-abs(snoise(vec3(ring*7.,r*2.-t*.4))),6.);
  float inner=.33;
  float falloff=exp(-max(r-inner,0.)*7.5)*smoothstep(inner-.04,inner+.03,r);
  float halo=exp(-r*r*14.)*.22;
  float glow=(falloff*(.35+streamers*.85+fine*.5)+halo)*(1.-smoothstep(.8,1.,r));
  vec3 c=mix(vec3(.3,.06,.95),vec3(1.2,.5,2.1),streamers*falloff);
  float alpha=glow*uOpacity*(.85+uImpulse*.3);
  gl_FragColor=vec4(c*alpha,alpha);
}`;

export const flameVertex = /* glsl */ `
uniform sampler2D uPerlin; uniform float uTime; uniform float uMorph; uniform float uLayer;
varying vec2 vUv; varying float vFacing;
void main(){
  vUv=uv;
  float t=-uTime*.12;
  float n=texture2D(uPerlin,mod(vec2(uv.y-t*2.,uv.x+t),1.)).r;
  vec3 p=position;
  float offset=mix(.64,.6,uLayer), upper=mix(.12,.16,uLayer), lower=mix(.79,.75,uLayer);
  float shape=p.y>=1.87 ? sin((p.y-offset)*1.27)-upper : sin((p.y/2.-.01)*.11)+lower;
  p.xz*=shape*mix(n,1.,uLayer);
  float h=(2.65-position.y)/5.3;
  vec2 column=normalize(position.xz+vec2(.00001))*(.48+.07*sin(h*15.-uTime*1.7));
  p.xz=mix(p.xz*2.,column,uMorph);
  p.y=mix((4.78-position.y*2.)/10.08,h,uMorph);
  vec4 mv=modelViewMatrix*vec4(p,1.);
  vec3 radial=normalize(mat3(modelViewMatrix)*vec3(position.x,0.,position.z)+vec3(.00001));
  vFacing=clamp(abs(dot(radial,normalize(-mv.xyz+vec3(.00001)))),0.,1.);
  gl_Position=projectionMatrix*mv;
}`;

// Soft, emission-only exhaust: no discards, density falls off toward the silhouette.
export const flameFragment = /* glsl */ `
uniform sampler2D uPerlin; uniform float uTime; uniform float uMorph;
uniform float uLayer; uniform float uImpulse; uniform float uTail;
varying vec2 vUv; varying float vFacing;
void main(){
  float t=uTime;
  float n1=texture2D(uPerlin,vec2(vUv.x*2.+t*.03,vUv.y*.9-t*.55)).r;
  float n2=texture2D(uPerlin,vec2(vUv.x*5.+.37,vUv.y*2.4-t*1.1)).r;
  float n3=texture2D(uPerlin,vec2(vUv.x*11.+.71,vUv.y*5.-t*1.8)).r;
  float density=smoothstep(.28,.95,n1*.55+n2*.32+n3*.2);
  float soft=pow(clamp(vFacing,.0001,1.),mix(1.6,2.4,uLayer));
  float envelope=smoothstep(.02,.35,vUv.y)*(1.-smoothstep(.78,1.,vUv.y));
  envelope=mix(envelope,smoothstep(.05,.6,vUv.y),uLayer);
  vec3 hot=mix(vec3(2.4,1.7,3.4),vec3(1.2,1.1,1.6),uLayer);
  vec3 cool=mix(vec3(.38,.1,1.3),vec3(.3,.22,.55),uLayer);
  vec3 c=mix(cool,hot,density*soft);
  float a=soft*envelope*uTail*(.15+density*.85)*mix(.9,.35,uLayer)*(1.+uImpulse*.35);
  a=clamp(a,0.,1.);
  gl_FragColor=vec4(max(c,0.)*a,a);
}`;
