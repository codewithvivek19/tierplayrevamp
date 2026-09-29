import { Data3DTexture, LinearFilter, RGFormat, RepeatWrapping, UnsignedByteType } from "three";

const SIZE = 64;
let shared: Data3DTexture | null = null;

/**
 * Tileable 3D noise baked once and shared by every stone/sky shader.
 * R: smooth value noise (16-cell period), G: cellular F2-F1 edge distance (8-cell period).
 * One texture fetch replaces a simplex (~40 ALU) or a 27-tap Worley search per octave.
 */
export function rockNoiseTexture() {
  if (shared) return shared;
  const data = new Uint8Array(SIZE * SIZE * SIZE * 2);
  const P = 16, C = 8;
  const hash = (x: number, y: number, z: number, s: number) => {
    let h = (x * 374761393 + y * 668265263 + z * 1274126177 + s * 2246822519) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const lattice = new Float32Array(P * P * P);
  for (let i = 0; i < lattice.length; i++) lattice[i] = hash(i % P, Math.floor(i / P) % P, Math.floor(i / (P * P)), 7);
  const at = (x: number, y: number, z: number) => lattice[((z % P + P) % P) * P * P + ((y % P + P) % P) * P + ((x % P + P) % P)];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const points: number[] = [];
  for (let z = 0; z < C; z++) for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) points.push(x + hash(x, y, z, 1), y + hash(x, y, z, 2), z + hash(x, y, z, 3));
  let o = 0;
  for (let z = 0; z < SIZE; z++) for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const fx = x / SIZE * P, fy = y / SIZE * P, fz = z / SIZE * P;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), z0 = Math.floor(fz);
    const u = fade(fx - x0), v = fade(fy - y0), w = fade(fz - z0);
    const l = (a: number, b: number, t: number) => a + (b - a) * t;
    const n = l(l(l(at(x0, y0, z0), at(x0 + 1, y0, z0), u), l(at(x0, y0 + 1, z0), at(x0 + 1, y0 + 1, z0), u), v),
      l(l(at(x0, y0, z0 + 1), at(x0 + 1, y0, z0 + 1), u), l(at(x0, y0 + 1, z0 + 1), at(x0 + 1, y0 + 1, z0 + 1), u), v), w);
    const cx = x / SIZE * C, cy = y / SIZE * C, cz = z / SIZE * C;
    const ix = Math.floor(cx), iy = Math.floor(cy), iz = Math.floor(cz);
    let d1 = 9, d2 = 9;
    for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const gx = ix + dx, gy = iy + dy, gz = iz + dz;
      const k = ((((gz % C) + C) % C) * C * C + (((gy % C) + C) % C) * C + (((gx % C) + C) % C)) * 3;
      const px = points[k] - ((((gx % C) + C) % C)) + gx, py = points[k + 1] - ((((gy % C) + C) % C)) + gy, pz = points[k + 2] - ((((gz % C) + C) % C)) + gz;
      const d = Math.hypot(px - cx, py - cy, pz - cz);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    data[o++] = Math.round(n * 255);
    data[o++] = Math.round(Math.min(1, (d2 - d1) * 1.6) * 255);
  }
  const texture = new Data3DTexture(data, SIZE, SIZE, SIZE);
  texture.format = RGFormat;
  texture.type = UnsignedByteType;
  texture.minFilter = texture.magFilter = LinearFilter;
  texture.wrapS = texture.wrapT = texture.wrapR = RepeatWrapping;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;
  shared = texture;
  return texture;
}
