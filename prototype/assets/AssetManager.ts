import { performanceBudget } from "../../config/performance.config";
import type { AssetDefinition } from "./contract";
export type AssetStatus = "queued" | "loading" | "downloaded" | "ready" | "blocked" | "error";
export interface AssetRecord extends AssetDefinition {
  status: AssetStatus;
  bytes: number;
  error?: string;
}
export interface LoadedAsset { definition: AssetDefinition; data: ArrayBuffer }
/** One manager per mounted experience. Fetch ownership never crosses a route. */
export class AssetManager {
  private generation = 0;
  private controllers = new Set<AbortController>();
  private resources = new Map<string, LoadedAsset>();
  private records: AssetRecord[] = [];
  private listeners = new Set<() => void>();
  readonly subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  readonly snapshot = () => this.records;
  get(id: string) { return this.resources.get(id); }
  private patch(id: string, patch: Partial<AssetRecord>) {
    this.records = this.records.map((r) => r.id === id ? { ...r, ...patch } : r);
    this.listeners.forEach((listener) => listener());
  }
  configure(assets: AssetDefinition[]) {
    this.cancel();
    this.records = assets.map((a) => ({ ...a, bytes: 0, status: !a.url || !a.approved ? "blocked" : "queued" }));
    this.listeners.forEach((listener) => listener());
  }
  async load(bundle: AssetDefinition["bundle"]) {
    const generation = this.generation;
    const entries = this.records.filter((r) => r.bundle === bundle && (r.status === "queued" || r.status === "error"));
    await Promise.all(entries.map(async (entry) => {
      if (!entry.url || !entry.approved) return;
      const controller = new AbortController();
      this.controllers.add(controller);
      const timer = setTimeout(() => controller.abort(), performanceBudget.timeoutMs);
      this.patch(entry.id, { status: "loading", error: undefined, bytes: 0 });
      try {
        const response = await fetch(entry.url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Asset request failed (${response.status}).`);
        const total = Number(response.headers.get("content-length"));
        if (total > performanceBudget.maxAssetBytes) throw new Error("Asset exceeds the transfer budget.");
        let data: ArrayBuffer;
        if (response.body) {
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let bytes = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            bytes += value.byteLength;
            if (bytes > performanceBudget.maxAssetBytes) { await reader.cancel(); throw new Error("Asset exceeds the transfer budget."); }
            chunks.push(value);
            if (generation === this.generation) this.patch(entry.id, { bytes });
          }
          const joined = new Uint8Array(bytes);
          let offset = 0;
          for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length; }
          data = joined.buffer;
        } else data = await response.arrayBuffer();
        if (data.byteLength > performanceBudget.maxAssetBytes || data.byteLength === 0) throw new Error("Invalid asset size.");
        if (generation !== this.generation) return;
        this.resources.set(entry.id, { definition: entry, data });
        this.patch(entry.id, { status: "downloaded", bytes: data.byteLength });
      } catch (error) {
        if (generation === this.generation) this.patch(entry.id, { status: "error", error: controller.signal.aborted ? "Loading timed out. Retry when ready." : error instanceof Error ? error.message : "Unable to load asset." });
      } finally { clearTimeout(timer); this.controllers.delete(controller); }
    }));
  }
  markReady(id: string) { this.patch(id, { status: "ready" }); }
  markError(id: string, error: string) { this.patch(id, { status: "error", error }); }
  cancel() {
    this.generation++;
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
    this.resources.clear();
  }
}
