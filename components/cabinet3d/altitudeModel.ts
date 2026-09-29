import { BufferAttribute, BufferGeometry, Group, Mesh, MeshStandardMaterial, Vector3, type Material, type Object3D } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const ALTITUDE_MODEL = "/media/models/cabinet-altitude.glb";

// Model-space anchors (metres, front faces +Z) measured from the supplied GLB node bounds.
export const altitudeAnchors = {
  screen: new Vector3(0, 1.77, 0.3),
  ledEdge: new Vector3(-0.39, 1.95, 0.29),
  billAcceptor: new Vector3(-0.265, 1.108, 0.33),
  ticketAcceptor: new Vector3(0.26, 1.11, 0.33),
  buttons: new Vector3(0.2, 1.05, 0.41),
  sidePanel: new Vector3(0.56, 0.72, 0.05),
  logo: new Vector3(0, 0.843, 0.52),
} as const;
export type AltitudeAnchor = keyof typeof altitudeAnchors;

// LED and lettering lenses that receive emissive glow sprites.
export const altitudeGlows: { position: [number, number, number]; color: string; scale: number }[] = [
  { position: [-0.38, 1.77, 0.3], color: "#9e05ff", scale: 0.55 },
  { position: [0.38, 1.77, 0.3], color: "#2a55ff", scale: 0.55 },
  { position: [0, 2.36, 0.17], color: "#9e05ff", scale: 0.45 },
  { position: [0, 1.17, 0.3], color: "#2a55ff", scale: 0.4 },
  { position: [0, 0.967, 0.61], color: "#05e6ff", scale: 0.38 },
  { position: [0.26, 1.118, 0.32], color: "#ff1840", scale: 0.16 },
  { position: [-0.41, 0.91, 0.39], color: "#9e05ff", scale: 0.28 },
  { position: [0.41, 0.91, 0.39], color: "#2a55ff", scale: 0.28 },
  { position: [0, 0.843, 0.52], color: "#dfe6ff", scale: 0.2 },
];

const EMISSIVE: Record<string, number> = {
  "07": 5.5, "08": 5.5, "09": 5, "10": 5, "11": 2.6, "12": 4.5, "13": 1.25,
};

type Built = { group: Group; materials: MeshStandardMaterial[]; geometries: BufferGeometry[] };

/**
 * Bakes the 882 source meshes into one mesh per material (~13 draw calls).
 * The GLB cache owns the source scene, so only the merged copies are returned for disposal.
 */
export function buildAltitude(source: Object3D): Built {
  source.updateMatrixWorld(true);
  const buckets = new Map<Material, BufferGeometry[]>();
  source.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const material = mesh.material as Material;
    const geometry = mesh.geometry.clone();
    // Compressed (KHR_mesh_quantization) attributes are normalized integers: expand to float before transforming/merging.
    for (const name of Object.keys(geometry.attributes)) {
      const attribute = geometry.getAttribute(name) as BufferAttribute;
      if (attribute.array instanceof Float32Array) continue;
      const floats = new Float32Array(attribute.count * attribute.itemSize);
      for (let i = 0; i < attribute.count; i++) for (let c = 0; c < attribute.itemSize; c++) floats[i * attribute.itemSize + c] = attribute.getComponent(i, c);
      geometry.setAttribute(name, new BufferAttribute(floats, attribute.itemSize));
    }
    geometry.applyMatrix4(mesh.matrixWorld);
    const list = buckets.get(material) ?? [];
    list.push(geometry);
    buckets.set(material, list);
  });

  const group = new Group();
  const materials: MeshStandardMaterial[] = [];
  const geometries: BufferGeometry[] = [];
  buckets.forEach((list, sourceMaterial) => {
    const shared = Object.keys(list[0].attributes).filter((name) => list.every((g) => g.getAttribute(name)));
    list.forEach((g) => Object.keys(g.attributes).forEach((name) => { if (!shared.includes(name)) g.deleteAttribute(name); }));
    const allIndexed = list.every((g) => g.index);
    const normalized = allIndexed ? list : list.map((g) => (g.index ? g.toNonIndexed() : g));
    const merged = mergeGeometries(normalized, false);
    list.forEach((g) => g.dispose());
    if (!merged) return;
    const material = (sourceMaterial as MeshStandardMaterial).clone();
    const code = material.name.slice(0, 2);
    if (EMISSIVE[code]) {
      material.emissiveIntensity = EMISSIVE[code];
      material.toneMapped = code === "13";
    } else {
      material.envMapIntensity = code === "05" || code === "06" ? 1.35 : 0.9;
    }
    const mesh = new Mesh(merged, material);
    mesh.castShadow = !EMISSIVE[code];
    mesh.receiveShadow = true;
    mesh.name = material.name;
    group.add(mesh);
    materials.push(material);
    geometries.push(merged);
  });
  return { group, materials, geometries };
}
