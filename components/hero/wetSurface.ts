import { DataTexture, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, RGBAFormat } from "three";

// Small periodic material maps, generated once. All tiers use the same mineral
// microstructure; planar reflection is the optional expensive layer above it.
export function createWetSurface() {
  const size = 128, heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * Math.PI * 2, v = y / size * Math.PI * 2;
    heights[y * size + x] = Math.sin(u * 3 + Math.sin(v * 2)) * .32
      + Math.sin(v * 11 + Math.cos(u * 4)) * .13
      + Math.sin(u * 23 + v * 17) * .024;
  }
  const normals = new Uint8Array(size * size * 4), roughness = new Uint8Array(normals.length);
  const at = (x: number, y: number) => heights[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const nx = (at(x - 1, y) - at(x + 1, y)) * .22;
    const ny = (at(x, y - 1) - at(x, y + 1)) * .22;
    const length = Math.sqrt(nx * nx + ny * ny + 1);
    normals.set([128 + nx / length * 127, 128 + ny / length * 127, 128 + 127 / length, 255], i);
    const r = Math.round(160 + at(x, y) * 65);
    roughness.set([r, r, r, 255], i);
  }
  const make = (pixels: Uint8Array) => {
    const texture = new DataTexture(pixels, size, size, RGBAFormat);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 20);
    texture.magFilter = LinearFilter; texture.minFilter = LinearMipmapLinearFilter;
    texture.generateMipmaps = true; texture.needsUpdate = true;
    return texture;
  };
  const normal = make(normals), rough = make(roughness);
  return { normal, rough, dispose: () => { normal.dispose(); rough.dispose(); } };
}
