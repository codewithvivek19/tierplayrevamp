"use client";
import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { AssetManager, type AssetRecord } from "./assets/AssetManager";
import { parseManifest } from "./assets/contract";
import { initialScene, sceneReducer } from "./state/SceneDirector";
import { initialQuality } from "./performance/PerformanceManager";
import type { QualityTier } from "../config/performance.config";
const empty: AssetRecord[] = [];
export function usePrototype() {
  const [manager] = useState(() => new AssetManager());
  const records = useSyncExternalStore(manager.subscribe, manager.snapshot, () => empty);
  const [state, dispatch] = useReducer(sceneReducer, initialScene);
  const [quality, setQuality] = useState<QualityTier>("static");
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manifestReady, setManifestReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      const next = initialQuality({ reduced: media.matches, saveData: !!nav.connection?.saveData, memory: nav.deviceMemory, coarse: matchMedia("(pointer: coarse)").matches, noWebgl: new URLSearchParams(location.search).has("no-webgl") });
      setReduced(media.matches); setQuality(next);
      if (next === "static") dispatch({ type: "STATIC" });
    };
    update(); media.addEventListener("change", update);
    const visible = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", visible);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visible); };
  }, []);
  useEffect(() => {
    const abort = new AbortController(); controller.current = abort;
    setManifestReady(false); setError(null); dispatch({ type: "RESET" });
    fetch("/media/production/manifest.json", { signal: abort.signal, cache: "no-store" })
      .then(async (response) => { if (!response.ok) throw new Error("The asset list is unavailable."); return parseManifest(await response.json()); })
      .then((manifest) => { if (!abort.signal.aborted) { manager.configure(manifest.assets); setManifestReady(true); } })
      .catch((e: unknown) => { if (!abort.signal.aborted) setError(e instanceof Error ? e.message : "Unable to check assets."); });
    return () => { abort.abort(); manager.cancel(); };
  }, [manager, attempt]);
  // No models fetched until a user explicitly requests entry.
  const load = useCallback(async () => {
    setError(null);
    const request = controller.current;
    await manager.load("critical");
    if (request !== controller.current || request?.signal.aborted) return;
    if (manager.snapshot().some((a) => a.bundle === "critical" && a.status === "error")) return;
    await Promise.all([manager.load("cabinet-altitude"), manager.load("gaming-floor")]);
  }, [manager]);
  const onReady = useCallback(() => { ["TP-001", "TP-004", "TP-005"].forEach((id) => manager.markReady(id)); dispatch({ type: "READY", ready: true }); }, [manager]);
  const onFailure = useCallback((message: string) => { setError(message); dispatch({ type: "READY", ready: false }); dispatch({ type: "STATIC" }); }, []);
  const retry = useCallback(() => { setAttempt((value) => value + 1); }, []);
  const blocked = records.filter((r) => r.required && r.status === "blocked");
  const downloaded = records.length > 0 && records.filter((r) => r.required).every((r) => r.status === "downloaded" || r.status === "ready");
  return { manager, records, state, dispatch, quality, setQuality, reduced, active, error, manifestReady, blocked, downloaded, load, onReady, onFailure, retry, attempt };
}
