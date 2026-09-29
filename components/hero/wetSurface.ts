import { DataTexture, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, RGBAFormat, SRGBColorSpace } from "three";

// Periodic value noise so the generated ground tiles without seams.
function periodicNoise(size: number, period: number, seed: number) {
  const lattice = new Float32Array(period * period);
  let s = seed * 16807 % 2147483647;
  for (let i = 0; i < lattice.length; i++) { s = s * 16807 % 2147483647; lattice[i] = s / 2147483647; }
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const fx = x / size * period, fy = y / size * period;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const at = (i: number, j: number) => lattice[((j % period) * period) + (i % period)];
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    out[y * size + x] = (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
  }
  return out;
}

/**
 * Wet volcanic ground: broad undulation, gravel grit and standing puddles.
 * Puddles are flat, dark and mirror-smooth; the surrounding stone is rough.
 */
export function createWetSurface(repeat = 7) {
  const size = 512;
  const layers = [
    { period: 4, weight: .5 }, { period: 8, weight: .25 }, { period: 16, weight: .13 },
    { period: 32, weight: .07 }, { period: 64, weight: .035 }, { period: 128, weight: .02 },
  ].map((layer, i) => ({ ...layer, data: periodicNoise(size, layer.period, 97 + i * 13) }));
  const heights = new Float32Array(size * size), puddle = new Float32Array(size * size), grit = periodicNoise(size, 256, 7);
  const water = periodicNoise(size, 2, 311), water2 = periodicNoise(size, 5, 53);
  for (let i = 0; i < heights.length; i++) {
    let h = 0;
    for (const layer of layers) h += layer.data[i] * layer.weight;
    const w = water[i] * .7 + water2[i] * .3;
    const m = Math.min(1, Math.max(0, (w - .64) / .14));
    puddle[i] = m * m * (3 - 2 * m);
    heights[i] = h * (1 - puddle[i] * .6) + grit[i] * .03 * (1 - puddle[i] * .7);
  }
  const normal = new Uint8Array(size * size * 4), rough = new Uint8Array(normal.length), albedo = new Uint8Array(normal.length);
  const at = (x: number, y: number) => heights[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x, o = i * 4;
    const nx = (at(x - 1, y) - at(x + 1, y)) * 5.5, ny = (at(x, y - 1) - at(x, y + 1)) * 5.5;
    const len = Math.sqrt(nx * nx + ny * ny + 1);
    normal[o] = 128 + nx / len * 127; normal[o + 1] = 128 + ny / len * 127; normal[o + 2] = 128 + 127 / len; normal[o + 3] = 255;
    const r = (.74 + grit[i] * .2) * (1 - puddle[i]) + .16 * puddle[i];
    rough[o] = rough[o + 1] = rough[o + 2] = Math.round(r * 255); rough[o + 3] = 255;
    const tone = (.55 + heights[i] * .7) * (1 - puddle[i] * .22);
    albedo[o] = Math.round(26 * tone); albedo[o + 1] = Math.round(25 * tone); albedo[o + 2] = Math.round(30 * tone); albedo[o + 3] = 255;
  }
  const make = (pixels: Uint8Array, color = false) => {
    const texture = new DataTexture(pixels, size, size, RGBAFormat);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.magFilter = LinearFilter; texture.minFilter = LinearMipmapLinearFilter;
    texture.generateMipmaps = true; texture.anisotropy = 8;
    if (color) texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };
  const normalMap = make(normal), roughMap = make(rough), colorMap = make(albedo, true);
  return { normal: normalMap, rough: roughMap, color: colorMap, dispose: () => { normalMap.dispose(); roughMap.dispose(); colorMap.dispose(); } };
}
