// The finale walk's timing, shared by the camera (PortalCanvas) and the score (score.ts) so that
// footsteps you hear land on the footfalls you see.
export const WALK_START = .66;
export const WALK_END = 1;
/** Footfall cycles over the whole walk (two steps per cycle). */
export const WALK_STRIDES = 18;
/** Gentle at both ends, steady in the middle: walking pace follows scroll pace. */
// Constant-velocity middle with quadratic ease-in and ease-out of length A; continuous in position and
// speed at both joins, reaching exactly 1 at t = 1.
const A = .14;
export const walkEase = (t: number) => (t < A ? (t * t) / (2 * A) : t > 1 - A ? 1 - A - ((1 - t) * (1 - t)) / (2 * A) : t - A / 2) / (1 - A);
export const walkAt = (raw: number) => Math.min(1, Math.max(0, walkEase(Math.min(1, Math.max(0, (raw - WALK_START) / (WALK_END - WALK_START))))));
