import { BufferGeometry, IcosahedronGeometry, Vector3 } from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { fbm3, ridged3 } from "./rockNoise";

export type RockKind = "shard" | "boulder" | "island" | "cliff" | "chip" | "plate";

const presets: Record<RockKind, { detail: number; cuts: number; relief: number; ridge: number; cut: [number, number] }> = {
  shard: { detail: 5, cuts: 7, relief: .2, ridge: .14, cut: [.42, .72] },
  boulder: { detail: 5, cuts: 5, relief: .26, ridge: .1, cut: [.55, .82] },
  island: { detail: 6, cuts: 4, relief: .22, ridge: .16, cut: [.6, .85] },
  cliff: { detail: 5, cuts: 6, relief: .16, ridge: .2, cut: [.5, .8] },
  chip: { detail: 2, cuts: 5, relief: .18, ridge: .08, cut: [.35, .65] },
  plate: { detail: 4, cuts: 9, relief: .14, ridge: .1, cut: [.5, .82] },
};

const cache = new Map<string, BufferGeometry>();

function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

/**
 * Stone built the way stone breaks: a noisy mass, chipped by planar fractures,
 * then shaped per kind (tapering island undersides, fluted cliff faces).
 * Results are cached per kind/seed and shared; callers must not dispose them.
 */
export function rockGeometry(kind: RockKind, seed = 1): BufferGeometry {
  const key = `${kind}:${seed}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const preset = presets[kind];
  const source = new IcosahedronGeometry(1, preset.detail);
  source.deleteAttribute("normal"); source.deleteAttribute("uv");
  const geometry = mergeVertices(source, 1e-5);
  source.dispose();
  const random = seeded(seed);
  const planes = Array.from({ length: preset.cuts }, () => {
    const n = new Vector3(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize();
    if (kind === "island") n.y = Math.abs(n.y) < .5 ? n.y : n.y * .4;
    // Plates break around their rim: cut planes lie roughly in the slab's own plane.
    if (kind === "plate") { n.z *= .15; n.normalize(); }
    return { n, offset: preset.cut[0] + random() * (preset.cut[1] - preset.cut[0]) };
  });
  if (kind === "island") planes.push({ n: new Vector3(0, 1, 0), offset: .32 });
  const position = geometry.getAttribute("position");
  const p = new Vector3();
  const s = seed * 7.13;
  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i);
    const d = p.clone();
    let r = 1 + fbm3(d.x * 1.4 + s, d.y * 1.4, d.z * 1.4, seed) * preset.relief
      + ridged3(d.x * 2.7, d.y * 2.7 + s, d.z * 2.7, seed + 9) * preset.ridge
      + fbm3(d.x * 7, d.y * 7, d.z * 7 + s, seed + 3, 3) * .025;
    if (kind === "cliff") r += fbm3(d.x * 5, d.y * .6, d.z * 5, seed + 5) * .18;
    p.copy(d).multiplyScalar(r);
    for (const plane of planes) {
      const excess = p.dot(plane.n) - plane.offset;
      // Leave a faint conchoidal ripple on the fracture instead of a CAD-flat face.
      if (excess > 0) p.addScaledVector(plane.n, -excess * (.94 + fbm3(p.x * 9, p.y * 9, p.z * 9, seed + 2, 2) * .05));
    }
    if (kind === "island" && p.y < 0) {
      const depth = -p.y;
      p.y = -depth * (1.9 + fbm3(p.x * 3, 0, p.z * 3, seed + 4) * .6);
      const taper = 1 / (1 + depth * .9);
      p.x *= taper; p.z *= taper;
    }
    if (kind === "plate") {
      // A curved slab of a broken sphere: thin, slightly cupped, thicker toward its centre.
      const cup = (p.x * p.x + p.y * p.y) * .16;
      p.z = p.z * (.2 + .06 * fbm3(p.x * 4, p.y * 4, 0, seed + 6)) - cup;
    }
    position.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  cache.set(key, geometry);
  return geometry;
}
