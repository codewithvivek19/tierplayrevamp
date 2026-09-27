export type QualityTier = "high" | "balanced" | "low" | "static";
export const qualitySettings = {
  high: { dpr: 1.5, maxFrameMs: 22 },
  balanced: { dpr: 1.25, maxFrameMs: 30 },
  low: { dpr: 1, maxFrameMs: 42 },
  static: { dpr: 1, maxFrameMs: Infinity },
} as const;
export const performanceBudget = {
  sampleFrames: 90,
  slowWindows: 2,
  maxAssetBytes: 12 * 1024 * 1024,
  timeoutMs: 20000,
  criticalBytes: 2 * 1024 * 1024,
} as const;
