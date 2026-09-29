import { rockNoise } from "./rockNoise";

export const vortexVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

// A spiral portal seen almost face-on: logarithmic arms, dust lanes advected in the
// rotating frame, a tunnel of rings at the throat and a white-hot core. uCollapse
// winds the arms tight, shrinks the disc and fires a single flare before it vanishes.
export const vortexFragment = /* glsl */ `
#define ROCK_OCTAVES 4
${rockNoise}
uniform float uTime; uniform float uCollapse; uniform float uLayer; uniform float uOpacity;
varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.;
  float c=uCollapse;
  float radius=mix(1.,.06,smoothstep(.15,.95,c));
  float r=length(p)/radius;
  if(r>1.15) discard;
  float a=atan(p.y,p.x+1e-5);
  float t=uTime*(1.+c*5.)+uLayer*7.;
  float wind=mix(2.4,9.,c)+uLayer*.6;
  float phase=a+log(r+.015)*wind-t*.32;
  vec2 q=vec2(cos(phase),sin(phase))*r;
  float turbulence=rkFbm(vec3(q*2.6+uLayer*3.,t*.04));
  float arms=pow(.5+.5*cos(phase*2.+turbulence*2.2),2.4);
  float filaments=pow(.5+.5*cos(phase*9.+turbulence*6.),14.);
  float dust=smoothstep(.1,.55,rkFbm(vec3(q*5.5+turbulence,t*.03+uLayer)));
  float throat=.45+.55*pow(.5+.5*sin(log(r+.02)*20.-uTime*2.2),3.);
  float body=exp(-r*2.)*smoothstep(1.,.62,r);
  float core=exp(-r*r*70.);
  float flare=smoothstep(.5,.78,c)*(1.-smoothstep(.78,1.,c));
  vec3 outer=vec3(.05,.22,1.6), mid=vec3(.85,.14,1.9), inner=vec3(2.2,.95,2.6);
  vec3 col=mix(outer,mid,smoothstep(.85,.3,r));
  col=mix(col,inner,smoothstep(.2,.0,r));
  float light=(arms*.95+turbulence*.35+.18)*body*(1.-dust*.62)*mix(1.,throat,smoothstep(.55,.1,r));
  light+=filaments*body*.55;
  light+=core*(1.8+flare*18.);
  vec3 o=col*light*uOpacity*mix(1.,.55,uLayer);
  gl_FragColor=vec4(o,1.);
}`;

export const arcVertex = /* glsl */ `
varying vec2 vUv; varying float vFacing;
void main(){
  vUv=uv;
  vec4 mv=modelViewMatrix*vec4(position,1.);
  vFacing=abs(dot(normalize(normalMatrix*normal),normalize(-mv.xyz)));
  gl_Position=projectionMatrix*mv;
}`;

// Orbital energy ribbons: a faint continuous filament carrying bright comet heads.
export const arcFragment = /* glsl */ `
uniform float uTime; uniform float uSpeed; uniform float uOffset; uniform float uOpacity;
varying vec2 vUv; varying float vFacing;
void main(){
  float s=fract(vUv.x*2.-uTime*uSpeed+uOffset);
  float head=pow(s,40.)*2.2;
  float tail=pow(s,4.)*.9;
  float base=.28;
  float soft=pow(clamp(vFacing,0.,1.),1.3);
  float taper=smoothstep(0.,.12,vUv.x)*smoothstep(1.,.88,vUv.x);
  vec3 col=mix(vec3(1.5,.18,.95),vec3(2.6,1.6,2.8),pow(s,30.));
  float a=(base+tail+head)*soft*uOpacity;
  gl_FragColor=vec4(col*a,a);
}`;

export const beamFragment = /* glsl */ `
#define ROCK_OCTAVES 3
${rockNoise}
uniform float uTime; uniform float uOpacity;
varying vec2 vUv;
void main(){
  float x=abs(vUv.x-.5)*2.;
  float flow=rkFbm(vec3(vUv.x*6.,vUv.y*3.-uTime*.25,uTime*.05))*.5+.5;
  float core=exp(-x*x*60.);
  float glow=exp(-x*x*7.)*(.35+flow*.65);
  float ends=smoothstep(0.,.25,vUv.y)*smoothstep(1.,.55,vUv.y);
  float a=(core*1.4+glow*.45)*ends*uOpacity;
  gl_FragColor=vec4(vec3(.95,.7,1.6)*a,a);
}`;

// Falling light: thin streams sliding down with broken, uneven density.
export const fallsFragment = /* glsl */ `
#define ROCK_OCTAVES 3
${rockNoise}
uniform float uTime; uniform float uOpacity; uniform float uSeed;
varying vec2 vUv;
void main(){
  float column=snoise(vec3(vUv.x*38.+uSeed,0.,uSeed));
  float streams=pow(smoothstep(.2,1.,column),2.);
  float fall=rkFbm(vec3(vUv.x*20.+uSeed,vUv.y*5.+uTime*1.3,uSeed))*.5+.5;
  float fade=smoothstep(0.,.35,vUv.y)*smoothstep(1.,.7,vUv.y)*smoothstep(0.,.2,vUv.x)*smoothstep(1.,.8,vUv.x);
  float a=streams*fall*fade*uOpacity;
  gl_FragColor=vec4(vec3(.6,.42,1.3)*a,a);
}`;

// A cloud deck behind the portal, back-lit where it thins toward the energy.
export const cloudFragment = /* glsl */ `
#define ROCK_OCTAVES 5
${rockNoise}
uniform float uTime; uniform vec2 uGlow; uniform float uOpacity;
varying vec2 vUv;
void main(){
  vec2 p=vUv*vec2(3.2,1.6);
  vec2 w=vec2(rkFbm(vec3(p,uTime*.01)),rkFbm(vec3(p+4.3,uTime*.012)));
  float d=rkFbm(vec3(p*1.4+w*1.6,uTime*.008))*.5+.5;
  float density=smoothstep(.45,.9,d)*.55;
  float glow=exp(-length((vUv-uGlow)*vec2(1.6,2.4))*3.2);
  vec3 lit=mix(vec3(.035,.035,.045),vec3(.34,.2,.62),glow);
  float silver=smoothstep(.42,.5,d)*(1.-smoothstep(.5,.62,d))*glow*1.6;
  float fade=smoothstep(0.,.25,vUv.y)*smoothstep(1.,.6,vUv.y)*smoothstep(0.,.15,vUv.x)*smoothstep(1.,.85,vUv.x);
  float a=density*fade*uOpacity;
  gl_FragColor=vec4((lit*density+vec3(1.,.6,1.4)*silver)*fade*uOpacity,a*.85);
}`;

// Hexagonal crystals: faceted Fresnel, a glow that gathers toward the tip, and sparkle.
export const crystalVertex = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying float vH; varying vec3 vObj;
void main(){
  vec4 local=vec4(position,1.);
  #ifdef USE_INSTANCING
  local=instanceMatrix*local;
  vN=normalize(normalMatrix*mat3(instanceMatrix)*normal);
  #else
  vN=normalize(normalMatrix*normal);
  #endif
  vH=position.y; vObj=position;
  vec4 mv=modelViewMatrix*local; vV=normalize(-mv.xyz);
  gl_Position=projectionMatrix*mv;
}`;

export const crystalFragment = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uOpacity;
varying vec3 vN; varying vec3 vV; varying float vH; varying vec3 vObj;
void main(){
  vec3 n=normalize(vN); vec3 v=normalize(vV);
  float nv=clamp(abs(dot(n,v)),0.,1.);
  float fres=pow(1.-nv,2.4);
  float rise=smoothstep(0.,2.9,vH);
  vec3 l=normalize(vec3(-.4,.8,.45));
  float spark=pow(max(dot(reflect(-v,n),l),0.),80.)*2.5;
  float pulse=.85+.15*sin(uTime*1.3+vObj.x*9.+vObj.z*7.);
  vec3 deep=uColor*.08;
  vec3 c=deep+uColor*(rise*rise*.95*pulse+fres*.8)+vec3(.9)*spark;
  gl_FragColor=vec4(c*uOpacity,1.);
}`;

// A small moon with its own sun: crater albedo and a soft terminator.
export const moonFragment = /* glsl */ `
#define ROCK_OCTAVES 5
${rockNoise}
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
void main(){
  vec3 n=normalize(vObj);
  float maria=smoothstep(-.1,.4,rkFbm(n*1.6));
  vec2 craters=rkCells(n*7.);
  float rim=smoothstep(.06,.0,abs(craters.x-.28))*.25;
  float albedo=mix(.62,.34,maria)*(1.+rim)*(.85+.15*snoise(n*24.));
  vec3 sun=normalize(vec3(.95,.25,.3));
  float lambert=max(dot(n,sun),0.);
  float terminator=smoothstep(-.05,.35,dot(n,sun));
  vec3 c=vec3(.9,.88,.95)*albedo*lambert*terminator*1.6;
  float nv=clamp(dot(normalize(vN),normalize(vV)),0.,1.);
  c+=vec3(.25,.22,.4)*pow(1.-nv,4.)*terminator*.6;
  gl_FragColor=vec4(c,1.);
}`;

// Distant ground plane: faint survey grid dissolving into fog toward the horizon.
export const gridFragment = /* glsl */ `
uniform float uOpacity;
varying vec3 vWorld;
void main(){
  vec2 g=vWorld.xz/3.;
  vec2 w=fwidth(g);
  vec2 line=1.-smoothstep(vec2(0.),w*1.4,abs(fract(g-.5)-.5));
  float grid=max(line.x,line.y);
  float dist=length(vWorld.xz-vec2(0.,8.));
  float fade=smoothstep(4.,16.,dist)*exp(-dist*.028);
  float left=smoothstep(4.,-6.,vWorld.x);
  float a=grid*fade*left*uOpacity*.22;
  gl_FragColor=vec4(vec3(.55,.5,.75)*a,a);
}`;
