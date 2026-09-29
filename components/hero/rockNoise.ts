// GLSL: 3D simplex noise by Ian McEwan / Stefan Gustavson (Ashima Arts, MIT),
// plus fBm, ridged multifractal and F1/F2 cellular noise used by the stone shaders.
export const rockNoise = /* glsl */ `
#ifdef ROCK_TEXTURE
uniform highp sampler3D uRockNoise;
// Baked tileable noise: R = value noise (16 cells per tile), G = cellular edge (8 cells per tile).
float snoise(vec3 p){ return (texture(uRockNoise, p * .0625).r * 2. - 1.) * 1.3; }
float rkEdge(vec3 p){ return texture(uRockNoise, p * .125).g; }
#else

vec3 rk289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 rk289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 rkPerm(vec4 x){return rk289(((x*34.)+10.)*x);}
vec4 rkTaylor(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=rk289(i);
  vec4 p=rkPerm(rkPerm(rkPerm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=rkTaylor(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
vec3 rkHash3(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.xxy+p.yxx)*p.zyx);}
vec2 rkCells(vec3 p){
  vec3 i=floor(p),f=fract(p); float d1=8.,d2=8.;
  for(int z=-1;z<=1;z++)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec3 g=vec3(float(x),float(y),float(z)); vec3 r=g+rkHash3(i+g)-f; float d=dot(r,r);
    if(d<d1){d2=d1;d1=d;}else if(d<d2){d2=d;}
  }
  return vec2(sqrt(d1),sqrt(d2));
}

float rkEdge(vec3 p){ vec2 c = rkCells(p); return clamp((c.y - c.x) * 1.6, 0., 1.); }
#endif
#ifndef ROCK_OCTAVES
#define ROCK_OCTAVES 5
#endif
float rkFbm(vec3 p){float v=0.,a=.5;for(int i=0;i<ROCK_OCTAVES;i++){v+=a*snoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}
float rkRidged(vec3 p){float v=0.,a=.55,w=1.;for(int i=0;i<4;i++){float n=1.-abs(snoise(p));n*=n*w;w=clamp(n*1.6,0.,1.);v+=a*n;p=p*2.11+vec3(4.1,.7,2.3);a*=.5;}return v;}
`;

// JS counterpart for geometry: smooth 3D value noise (quintic), fBm and ridged.
const hash = (x: number, y: number, z: number, seed: number) => {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647 + seed * 144665) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
export function valueNoise(x: number, y: number, z: number, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz, seed);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  ) * 2 - 1;
}
export function fbm3(x: number, y: number, z: number, seed = 0, octaves = 4) {
  let v = 0, a = .5, f = 1;
  for (let i = 0; i < octaves; i++) { v += a * valueNoise(x * f, y * f, z * f, seed + i * 31); f *= 2.03; a *= .5; }
  return v;
}
export function ridged3(x: number, y: number, z: number, seed = 0, octaves = 4) {
  let v = 0, a = .55, f = 1, w = 1;
  for (let i = 0; i < octaves; i++) {
    let n = 1 - Math.abs(valueNoise(x * f, y * f, z * f, seed + i * 17));
    n = n * n * w; w = Math.min(1, Math.max(0, n * 1.6));
    v += a * n; f *= 2.11; a *= .5;
  }
  return v;
}
