// A bounded emissive volume: the same field changes from a sphere into a column.
// Inspired by the supplied plasma film and the light/fog separation in LaserFlow.
export const plasmaVertex = /* glsl */ `
uniform mat4 uWorldToLocal;
varying vec3 vLocal; varying vec3 vEye;
void main(){vLocal=position;vEye=(uWorldToLocal*vec4(cameraPosition,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export const plasmaFragment = /* glsl */ `
varying vec3 vEye;
uniform float uTime;
uniform float uMorph;
uniform float uImpulse;
varying vec3 vLocal;
mat2 turn(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float waves(vec3 q){return sin(q.x*3.2+sin(q.z*2.8))*sin(q.y*2.7+q.z*.7);}
void main(){
  vec3 rd=normalize(vLocal-vEye);
  vec3 safe=sign(rd)*max(abs(rd),vec3(.00001));
  safe+=vec3(equal(safe,vec3(0.)))*.00001;
  vec3 t0=(-vec3(1.)-vEye)/safe,t1=(vec3(1.)-vEye)/safe;
  vec3 nearT=min(t0,t1),farT=max(t0,t1);
  float start=max(0.,max(nearT.x,max(nearT.y,nearT.z)));
  float end=min(farT.x,min(farT.y,farT.z));
  if(end<=start) discard;
  float stepSize=(end-start)/float(PLASMA_STEPS);
  // Smooth fields with deterministic midpoint integration: no noisy film grain.
  vec3 sum=vec3(0.); float transmittance=1.;
  float t=uTime*.48;
  for(int i=0;i<PLASMA_STEPS;i++){
    vec3 p=vEye+rd*(start+(float(i)+.5)*stepSize);
    float orb=0.,hot=0.,column=0.,core=0.;
    vec3 q=p;
    if(uMorph<.72){
      float orbMask=1.-smoothstep(.78,.89,length(p));
      q.xz=turn(t*.65)*q.xz;
      q.xy=turn(sin(t*.43)*.55)*q.xy;
      q+=sin(q.yzx*3.+vec3(t,-t*.8,t*.6))*.14;
      float fold=q.y+.36*sin(q.x*3.5+t)+q.z*.48;
      // Gaussian sheets remain smooth between integration samples (no ridged bands).
      float veil=exp(-fold*fold*100.);
      float thread=exp(-fold*fold*300.);
      float fold2=q.x+.30*sin(q.z*4.-t*.7)-q.y*.45;
      float second=exp(-fold2*fold2*180.)*.24;
      orb=(veil*.28+thread*.15+second*.6)*orbMask*exp(-q.z*q.z*5.);
      hot=thread*orbMask;
    }
    if(uMorph>.001){
      vec3 b=p; b.xz=turn(p.y*2.2-t*.8)*b.xz;
      b.x+=sin(p.y*5.-t*1.8)*.032; b.z+=cos(p.y*4.+t)*.028;
      float rr=dot(b.xz,b.xz);
      core=exp(-rr*300.);
      float cloud=exp(-rr*9.)*(.4+.6*waves(b*2.+vec3(0.,-t*.6,t*.25)));
      float curl=.30*sin(b.y*8.-t*2.1)+.05*sin(b.y*23.+t*3.);
      float ribbon=exp(-((b.x+curl)*(b.x+curl))*300.)*exp(-rr*7.);
      float wisp=exp(-((b.z-.23*cos(b.y*11.+t*2.))*(b.z-.23*cos(b.y*11.+t*2.)))*350.)*exp(-rr*9.);
      float flow=.6+.4*sin(b.y*27.-t*7.+b.x*12.);
      float ends=1.-smoothstep(.78,.99,abs(p.y));
      column=(core*1.5+max(0.,cloud)*.16+ribbon*.2+wisp*flow*.15)*ends;
    }
    float field=mix(orb,column,smoothstep(0.,.72,uMorph));
    vec3 colorPoint=mix(q,p,smoothstep(0.,.6,uMorph));
    float hue=.5+.5*sin(colorPoint.x*2.6+colorPoint.z*2.+t*.6+p.y*uMorph*2.);
    vec3 tint=mix(vec3(.045,.19,1.8),vec3(1.65,.025,.48),hue);
    tint=mix(tint,vec3(1.4,1.45,1.8),clamp(mix(hot*.12,core*.25,uMorph),0.,.25));
    float density=field*stepSize*4.2;
    sum+=transmittance*tint*density*(2.8+uImpulse*.32);
    transmittance*=exp(-density*.8);
  }
  float closest=max(0.,-dot(vEye,rd));
  float silhouette=length(vEye+rd*closest);
  float edge=exp(-abs(silhouette-.815)*90.)*(1.-smoothstep(0.,.6,uMorph));
  vec3 normal=normalize(vEye+rd*closest+vec3(.00001));
  float edgeHue=.5+.5*sin(normal.y*2.+normal.x*2.-t*.4);
  vec3 rimTint=mix(vec3(.12,.45,2.),vec3(1.8,.12,.6),edgeHue);
  sum+=rimTint*edge*.75;
  gl_FragColor=vec4(sum,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const radianceFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime; uniform float uOpacity;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x),mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x),f.y);}
float cloud(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise2(p);p=mat2(.86,.5,-.5,.86)*p*2.03+17.1;a*=.5;}return v;}
void main(){
 vec2 p=(vUv-.5)*2.; float r=length(p);
 vec2 flow=p*3.+vec2(uTime*.16,-uTime*.12);
 float warp=cloud(flow+vec2(cloud(flow+3.1),cloud(flow-7.3))*1.2);
 float fog=exp(-r*r*4.)*(.3+warp*.7)*(1.-smoothstep(.65,1.,r));
 gl_FragColor=vec4(mix(vec3(.22,.12,.6),vec3(.58,.43,.85),warp),fog*uOpacity);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

export const landingFragment = /* glsl */ `
varying vec2 vUv; uniform float uTime; uniform float uOpacity;
void main(){
 vec2 p=(vUv-.5)*2.; float r=length(p);
 float rays=.65+.35*sin(atan(p.y,p.x)*16.+uTime*.5+r*12.);
 float halo=exp(-r*5.)*.4+exp(-r*18.)*2.;
 gl_FragColor=vec4(vec3(.62,.30,1.1)*(halo+rays*exp(-r*8.)*.2),uOpacity*(1.-smoothstep(.65,1.,r)));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
