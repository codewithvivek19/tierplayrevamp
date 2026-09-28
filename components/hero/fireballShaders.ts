// Toon fireball 2 — Originkit, supplied 2026-09-29.
// Original palette, thresholds, polar coordinates and speed=36 clocks.
// Geometry placement and reveal adapt the effect to the shared scroll scene.
export const fireballVertex = `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export const fireballFragment = `
uniform sampler2D uPerlin; uniform sampler2D uSpark;
uniform float uTime; uniform float uMorph; uniform float uImpulse;
varying vec2 vUv;
void main(){
 float pct=distance(vUv,vec2(.5));
 vec3 color=mix(vec3(22.,14.,48.)/255.,vec3(73.,39.,126.)/255.,smoothstep(.16,.525,pct));
 vec2 delta=vUv-.5;
 vec2 polar=vec2(length(delta)*2.,atan(delta.x,delta.y)/6.28);
 vec2 flow=vec2(polar.x-uTime*.36,polar.x*.2+polar.y);
 float n=texture2D(uPerlin,mod(flow,1.)).r;
 float s=texture2D(uSpark,mod(flow,1.)).r;
 float tone0=1.-smoothstep(.3,.6,n);
 float tone1=smoothstep(.3,.6,s);
 if(tone1>=.49)color=vec3(164.,112.,244.)/255.;
 else if(tone0>=.29)color=vec3(1.);
 // Source RGB is display-encoded; decode for the shared linear renderer.
 color=mix(color/12.92,pow((color+.055)/1.055,vec3(2.4)),step(vec3(.04045),color));
 gl_FragColor=vec4(color,1.);
 #include <colorspace_fragment>
}
`;
export const flameVertex = `
uniform sampler2D uPerlin; uniform float uTime; uniform float uMorph; uniform float uLayer;
varying vec2 vUv;
void main(){
 vUv=uv;
 float t=-uTime*.12;
 float n=texture2D(uPerlin,mod(vec2(uv.y-t*2.,uv.x+t),1.)).r;
 vec3 p=position;
 float offset=mix(.64,.6,uLayer), upper=mix(.12,.16,uLayer), lower=mix(.79,.75,uLayer);
 float shape=p.y>=1.87 ? sin((p.y-offset)*1.27)-upper : sin((p.y/2.-.01)*.11)+lower;
 p.xz*=shape*mix(n,1.,uLayer);
 // Preserve the source profile and UVs; normalize its reversed axis so the
 // existing scroll choreography can turn the departing flame into a column.
 float h=(2.65-position.y)/5.3;
 vec2 column=normalize(position.xz+vec2(.00001))*(.48+.07*sin(h*15.-uTime*1.7));
 p.xz=mix(p.xz*2.,column,uMorph);
 p.y=mix((4.78-position.y*2.)/10.08,h,uMorph);
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}
`;
export const flameFragment = `
uniform sampler2D uPerlin; uniform float uTime; uniform float uMorph;
uniform float uLayer; uniform float uImpulse; uniform float uTail;
varying vec2 vUv;
void main(){
 float t=-uTime*.12;
 float n=texture2D(uPerlin,mod(vec2(vUv.y-t*2.,vUv.x+t),1.)).r;
 if(n<mix(.44,.5,uLayer))discard;
 float envelope=mix(smoothstep(.2,.628,vUv.y),(sin(vUv.y)-.1)*smoothstep(.3,.628,vUv.y),uLayer);
 vec3 color=mix(vec3(77.,39.,139.),vec3(239.,231.,255.),uLayer)/255.;
 color*=envelope;
 color=mix(color/12.92,pow((color+.055)/1.055,vec3(2.4)),step(vec3(.04045),color));
 gl_FragColor=vec4(color,n*envelope*uTail);
 #include <colorspace_fragment>
}
`;
