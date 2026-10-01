import { BufferAttribute, BufferGeometry, Color, Group, Mesh, Plane, Vector3, type Material, type MeshStandardMaterial, type Object3D } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type CabinetId = "altitude" | "pinnacle";

type Led = { intensity: number; phase: number; palette?: readonly string[] };

export type CabinetSpec = {
  id: CabinetId;
  url: string;
  /** Model height relative to the Altitude; camera poses are authored at Altitude scale and multiplied by this. */
  fit: number;
  screen: { match: (name: string) => boolean; intensity: number; y: readonly [number, number]; spill: { position: readonly [number, number, number]; size: readonly [number, number]; color: string; strength: number } };
  /** Environment reflection strength and base-colour scale for non-emissive surfaces. */
  envMap: number;
  albedo: number;
  led: (name: string) => Led | null;
  /** Hotspot positions (model space, metres) and the outward direction of each part. */
  anchors: Record<string, { position: Vector3; normal: Vector3 }>;
  /** Explorer close-ups: [yaw, targetY at Altitude scale, zoom]. */
  focus: Record<string, readonly [number, number, number]>;
  floorTint: string;
};

const anchor = (x: number, y: number, z: number, nx: number, nz: number) => ({ position: new Vector3(x, y, z), normal: new Vector3(nx, 0, nz).normalize() });

// Attract-mode colour cycle for the Pinnacle's white LED strips: Tierplay violet, blue and cyan.
const ATTRACT = ["#9e05ff", "#2a55ff", "#05e6ff", "#6d2bff"] as const;

export const cabinetSpecs: Record<CabinetId, CabinetSpec> = {
  altitude: {
    id: "altitude",
    url: "/media/models/cabinet-altitude.glb",
    fit: 1,
    screen: { match: (name) => name.startsWith("13"), intensity: 1.05, y: [1.239, 2.299], spill: { position: [0, 1.77, 0.34], size: [0.66, 1.04], color: "#8a7dff", strength: 1 } },
    envMap: 0.95,
    albedo: 1,
    led: (name) => {
      const code = name.slice(0, 2);
      const table: Record<string, Led> = {
        "07": { intensity: 4.2, phase: 0 }, "08": { intensity: 4.2, phase: 1.6 }, "09": { intensity: 3.8, phase: 3.1 },
        "10": { intensity: 3.8, phase: 4.4 }, "11": { intensity: 1.8, phase: 0 }, "12": { intensity: 3.2, phase: 2.2 },
      };
      return table[code] ?? null;
    },
    anchors: {
      screen: anchor(0, 1.77, 0.3, 0, 1),
      ledEdge: anchor(-0.39, 1.95, 0.29, -0.8, 0.6),
      billAcceptor: anchor(-0.265, 1.108, 0.33, -0.6, 0.8),
      ticketAcceptor: anchor(0.26, 1.11, 0.33, 0.6, 0.8),
      buttons: anchor(0.2, 1.05, 0.41, 0.45, 0.9),
      sidePanel: anchor(0.56, 0.72, 0.05, 1, 0.1),
      logo: anchor(0, 0.843, 0.52, 0, 1),
    },
    focus: {
      screen: [-0.1, 1.74, 0.6], ledEdge: [0.6, 1.6, 0.7], billAcceptor: [-0.2, 1.1, 0.45], ticketAcceptor: [0.2, 1.1, 0.45],
      buttons: [0.25, 1.04, 0.38], sidePanel: [-1.35, 0.9, 0.8], logo: [0, 0.9, 0.75],
    },
    floorTint: "#6d2bff",
  },
  pinnacle: {
    id: "pinnacle",
    url: "/media/models/cabinet-pinnacle.glb",
    fit: 0.78,
    screen: { match: (name) => name === "Display_CurvedLCD", intensity: 0.92, y: [0.901, 1.813], spill: { position: [0, 1.36, 0.02], size: [0.52, 0.9], color: "#7d8cff", strength: 0.22 } },
    envMap: 0.55,
    albedo: 0.5,
    led: (name) => {
      const table: Record<string, Led> = {
        LED_ScreenBezel: { intensity: 1.8, phase: 0, palette: ATTRACT },
        LED_ControlSides: { intensity: 1.6, phase: 0.9, palette: ATTRACT },
        LED_Pods: { intensity: 1.6, phase: 1.8, palette: ATTRACT },
        LED_DeckBar: { intensity: 1.5, phase: 2.7, palette: ATTRACT },
        LED_LowerFront: { intensity: 1.6, phase: 3.6, palette: ATTRACT },
        LED_LogoBorder: { intensity: 1.4, phase: 4.5, palette: ATTRACT },
        Button_Lit_White: { intensity: 0.4, phase: 1.2 },
        Service_Button_White: { intensity: 0.3, phase: 2 },
        Logo_Letters: { intensity: 1.1, phase: 0 },
        Logo_Tab_Blue: { intensity: 1, phase: 3 },
      };
      return table[name] ?? null;
    },
    anchors: {
      screen: anchor(0, 1.36, -0.02, 0, 1),
      lighting: anchor(0.31, 0.69, 0.26, 0.7, 0.7),
      buttons: anchor(0, 0.745, 0.13, 0, 1),
      speakers: anchor(-0.18, 0.545, 0.145, -0.2, 1),
      sidePanel: anchor(0.334, 1.12, 0, 1, 0.05),
      logo: anchor(0, 0.54, 0.146, 0, 1),
    },
    focus: {
      screen: [0, 1.74, 0.58], lighting: [0.6, 0.92, 0.5], buttons: [0.15, 0.98, 0.42], speakers: [-0.3, 0.72, 0.45],
      sidePanel: [-1.3, 1.25, 0.8], logo: [0, 0.72, 0.42],
    },
    floorTint: "#4b3cff",
  },
};

export const anchorKeys = (id: CabinetId) => Object.keys(cabinetSpecs[id].anchors);

export type LedRig = { materials: MeshStandardMaterial[]; base: number; phase: number; palette: Color[] | null };
export type BuiltCabinet = {
  group: Group;
  mirror: Group;
  materials: Material[];
  geometries: BufferGeometry[];
  leds: LedRig[];
  power: { value: number };
};

/** Clipping planes shared by every cabinet: the cabinet rises out of the floor, its reflection sinks below it. */
export const floorClip = { above: new Plane(new Vector3(0, 1, 0), 0), below: new Plane(new Vector3(0, -1, 0), 0) };

/**
 * Screen power-on: the panel lights from the bottom up behind a bright scan line, and stays dark (not
 * lit artwork) while off. Mirror copies fade with depth below the floor.
 */
function patch(material: MeshStandardMaterial, options: { power?: { value: number }; screenY?: readonly [number, number]; mirror?: boolean }) {
  const { power, screenY, mirror } = options;
  material.onBeforeCompile = (shader) => {
    if (power && screenY) {
      shader.uniforms.uPower = power;
      shader.uniforms.uScreenY = { value: screenY };
    }
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vCabY;\nvarying float vCabWorldY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvCabY = position.y;\nvCabWorldY = (modelMatrix * vec4(position, 1.0)).y;");
    let fragment = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vCabY;\nvarying float vCabWorldY;\nuniform float uPower;\nuniform vec2 uScreenY;");
    if (power) {
      fragment = fragment
        .replace("#include <map_fragment>", `#include <map_fragment>
          float cabH = clamp((vCabY - uScreenY.x) / (uScreenY.y - uScreenY.x), 0.0, 1.0);
          float cabFront = uPower * 1.2 - 0.1;
          float cabLit = smoothstep(cabFront, cabFront - 0.05, cabH);
          float cabScan = exp(-abs(cabH - cabFront) * 80.0) * (1.0 - step(0.999, uPower)) * step(0.001, uPower);
          diffuseColor.rgb *= mix(0.03, 1.0, cabLit);`)
        .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
          totalEmissiveRadiance = totalEmissiveRadiance * cabLit + vec3(0.6, 0.78, 1.0) * cabScan * 3.0;`);
    }
    if (mirror) fragment = fragment.replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a *= 0.2 * smoothstep(-0.7, 0.0, vCabWorldY);");
    shader.fragmentShader = fragment;
  };
  material.customProgramCacheKey = () => `cabinet-${power ? "screen" : "body"}-${mirror ? "mirror" : "solid"}`;
}

/**
 * Bakes the source meshes into one mesh per material and a mirrored, fading copy for the floor
 * reflection that shares the merged geometry. The GLB cache owns the source scene, so only the
 * merged copies are returned for disposal.
 */
export function buildCabinet(source: Object3D, spec: CabinetSpec): BuiltCabinet {
  source.updateMatrixWorld(true);
  const buckets = new Map<Material, BufferGeometry[]>();
  source.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
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
    const list = buckets.get(mesh.material as Material) ?? [];
    list.push(geometry);
    buckets.set(mesh.material as Material, list);
  });

  const group = new Group();
  const mirror = new Group();
  const materials: Material[] = [];
  const geometries: BufferGeometry[] = [];
  const leds: LedRig[] = [];
  const power = { value: 0 };
  buckets.forEach((list, sourceMaterial) => {
    const shared = Object.keys(list[0].attributes).filter((name) => list.every((g) => g.getAttribute(name)));
    list.forEach((g) => Object.keys(g.attributes).forEach((name) => { if (!shared.includes(name)) g.deleteAttribute(name); }));
    const normalized = list.every((g) => g.index) ? list : list.map((g) => (g.index ? g.toNonIndexed() : g));
    const merged = mergeGeometries(normalized, false);
    list.forEach((g) => g.dispose());
    if (!merged) return;
    const material = (sourceMaterial as MeshStandardMaterial).clone();
    const led = spec.led(material.name);
    const isScreen = spec.screen.match(material.name);
    if (isScreen) {
      // The artwork lives in the emissive map; a dark, glassy base keeps it from washing out under the studio lights.
      material.emissiveIntensity = spec.screen.intensity;
      material.color.setScalar(0.04);
      material.envMapIntensity = 0.35;
    } else if (led) {
      material.emissiveIntensity = led.intensity;
      // Colour-cycling strips: a dark diffuser lets the emitted colour, not white plastic, read.
      if (led.palette) material.color.setScalar(0.06);
    }
    else {
      material.envMapIntensity = material.metalness > 0.5 ? spec.envMap * 1.45 : spec.envMap;
      if (material.metalness < 0.5) material.color.multiplyScalar(spec.albedo);
    }
    material.clippingPlanes = [floorClip.above];
    const reflection = material.clone();
    reflection.transparent = true;
    reflection.clippingPlanes = [floorClip.below];
    patch(material, isScreen ? { power, screenY: spec.screen.y } : {});
    patch(reflection, isScreen ? { power, screenY: spec.screen.y, mirror: true } : { mirror: true });
    if (led) leds.push({ materials: [material, reflection], base: led.intensity, phase: led.phase, palette: led.palette ? led.palette.map((c) => new Color(c)) : null });

    const mesh = new Mesh(merged, material);
    mesh.castShadow = !led && !isScreen;
    mesh.receiveShadow = true;
    mesh.name = material.name;
    group.add(mesh);
    const copy = new Mesh(merged, reflection);
    copy.renderOrder = -1;
    mirror.add(copy);
    materials.push(material, reflection);
    geometries.push(merged);
  });
  return { group, mirror, materials, geometries, leds, power };
}
