export type AssetKind = "image" | "model";
export type AssetBundle = "critical" | "cabinet-altitude" | "gaming-floor";
export interface AssetDefinition {
  id: string;
  label: string;
  kind: AssetKind;
  bundle: AssetBundle;
  url: string | null;
  approved: boolean;
  required: boolean;
}
export interface ProductionManifest {
  version: 1;
  assets: AssetDefinition[];
}
export const requiredModelNodes = {
  "TP-001": ["Body", "ScreenGlass", "ScreenDisplay", "Controls", "Base", "ScreenCenter", "ScreenNormal"],
  "TP-004": ["CabinetAnchor", "EntryCamera", "EntryWaypoint", "EntryLookAt", "FloorCamera", "FloorLookAt", "FocusCamera", "FocusLookAt", "MobileFloorCamera", "MobileFocusCamera"],
} as const;
export function parseManifest(value: unknown): ProductionManifest {
  if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1 || !("assets" in value) || !Array.isArray(value.assets)) {
    throw new Error("The asset manifest is invalid.");
  }
  const ids = new Set<string>();
  const assets = value.assets.map((item: unknown): AssetDefinition => {
    if (!item || typeof item !== "object") throw new Error("Invalid asset entry.");
    const a = item as Record<string, unknown>;
    if (typeof a.id !== "string" || ids.has(a.id) || typeof a.label !== "string" || !["image", "model"].includes(String(a.kind)) || !["critical", "cabinet-altitude", "gaming-floor"].includes(String(a.bundle)) || typeof a.approved !== "boolean" || typeof a.required !== "boolean") throw new Error("Invalid or duplicate asset entry.");
    if (a.url !== null && (typeof a.url !== "string" || !/^\/media\/[a-zA-Z0-9/_\-.]+$/.test(a.url) || a.url.includes(".."))) throw new Error("Assets must use a local media path.");
    ids.add(a.id);
    return a as unknown as AssetDefinition;
  });
  for (const id of ["TP-001", "TP-004", "TP-005"]) {
    const a = assets.find((item) => item.id === id);
    if (!a?.required || a.kind !== (id === "TP-005" ? "image" : "model")) throw new Error(`Required asset ${id} is missing from the contract.`);
  }
  return { version: 1, assets };
}
