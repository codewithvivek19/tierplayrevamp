export type PortalState = {
  progress: number;
  pointerX: number;
  pointerY: number;
  pointerActive?: boolean;
  time: number;
  paused: boolean;
  invalidate?: () => void;
};
