import { Box3, Mesh, Object3D, Texture, TextureLoader, Material, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { LoadedAsset } from "./AssetManager";
import { requiredModelNodes } from "./contract";
export function validateModel(root: Object3D, id: keyof typeof requiredModelNodes) {
  const missing = requiredModelNodes[id].filter((name) => !root.getObjectByName(name));
  if (missing.length) throw new Error(`${id}: missing ${missing.join(", ")}.`);
  root.updateMatrixWorld(true);
  const size = new Box3().setFromObject(root).getSize(new Vector3());
  if (![size.x, size.y, size.z].every(Number.isFinite) || size.length() === 0) throw new Error(`${id}: invalid model bounds.`);
  if (id === "TP-001") {
    for (const name of ["Body", "ScreenGlass", "ScreenDisplay", "Base"]) {
      if (!(root.getObjectByName(name) instanceof Mesh)) throw new Error(`${id}: ${name} must be a mesh.`);
    }
    const screen = root.getObjectByName("ScreenDisplay") as Mesh;
    if (!screen.geometry.getAttribute("uv")) throw new Error("TP-001: the display needs UV coordinates.");
    if (size.y < 0.5 || size.y > 4) throw new Error("TP-001: model must be exported in real-world meters.");
  }
}
/** Owned resources only. This loader does not use R3F's shared model cache. */
export function disposeModel(root: Object3D) {
  const textures = new Set<Texture>();
  const materials = new Set<Material>();
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.geometry.dispose();
    const list = Array.isArray(node.material) ? node.material : [node.material];
    list.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value: unknown) => { if (value instanceof Texture) textures.add(value); });
    });
  });
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => { texture.dispose(); if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) texture.image.close(); });
}
export async function decodeModel(asset: LoadedAsset): Promise<Object3D> {
  const bytes = new DataView(asset.data);
  if (bytes.byteLength < 20 || bytes.getUint32(0, true) !== 0x46546c67) throw new Error(`${asset.definition.id}: expected a binary GLB.`);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const model = await loader.parseAsync(asset.data, "/media/production/");
  try { validateModel(model.scene, asset.definition.id as keyof typeof requiredModelNodes); }
  catch (error) { disposeModel(model.scene); throw error; }
  return model.scene;
}
export async function decodeImage(asset: LoadedAsset): Promise<Texture> {
  const url = URL.createObjectURL(new Blob([asset.data]));
  try { return await new TextureLoader().loadAsync(url); }
  finally { URL.revokeObjectURL(url); }
}
