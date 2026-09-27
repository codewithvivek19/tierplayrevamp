import { qualitySettings, performanceBudget, type QualityTier } from "../../config/performance.config";
export interface DeviceHints { reduced: boolean; saveData: boolean; memory?: number; coarse: boolean; noWebgl: boolean }
export function initialQuality(hints: DeviceHints): QualityTier {
  if (hints.reduced || hints.saveData || hints.noWebgl || (hints.memory !== undefined && hints.memory <= 2)) return "static";
  return hints.coarse || (hints.memory !== undefined && hints.memory <= 4) ? "balanced" : "high";
}
/** Downgrade only after sustained pressure. No oscillating upgrades during a scene. */
export class PerformanceManager {
  private samples: number[] = [];
  private slow = 0;
  constructor(public tier: QualityTier) {}
  sample(milliseconds: number): QualityTier {
    // Exclude background/resume pauses; warmup handled by caller.
    if (milliseconds <= 0 || milliseconds > 200 || this.tier === "static") return this.tier;
    this.samples.push(milliseconds);
    if (this.samples.length < performanceBudget.sampleFrames) return this.tier;
    const sorted = this.samples.sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    this.samples = [];
    this.slow = p95 > qualitySettings[this.tier].maxFrameMs ? this.slow + 1 : 0;
    if (this.slow >= performanceBudget.slowWindows) {
      this.tier = this.tier === "high" ? "balanced" : this.tier === "balanced" ? "low" : "static";
      this.slow = 0;
    }
    return this.tier;
  }
}
