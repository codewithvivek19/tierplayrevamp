export type PortalState = {
  /** Story progress (departure → flight → assembly), 0..1. Existing scene thresholds read this. */
  progress: number;
  /** Raw hero scroll, 0..1. */
  raw?: number;
  /** Opening vortex collapse, 0..1. */
  intro?: number;
  /** Gateway ceremony after assembly, 0..1. */
  finale?: number;
  pointerX: number;
  pointerY: number;
  pointerActive?: boolean;
  time: number;
  paused: boolean;
  invalidate?: () => void;
};
