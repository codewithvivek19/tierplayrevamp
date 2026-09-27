export type ScenePhase = "BOOT" | "ENTRANCE" | "FLOOR" | "FOCUS" | "APPROACH" | "CROSSING" | "EXIT" | "STATIC";
export interface SceneState { phase: ScenePhase; operation: number; ready: boolean }
export type SceneEvent =
  | { type: "READY"; ready: boolean }
  | { type: "ENTER" }
  | { type: "SETTLED"; operation: number }
  | { type: "FOCUS" }
  | { type: "SELECT" }
  | { type: "CANCEL" }
  | { type: "SKIP" }
  | { type: "STATIC" }
  | { type: "RESET" };
export const initialScene: SceneState = { phase: "BOOT", operation: 0, ready: false };
const next: Partial<Record<ScenePhase, ScenePhase>> = { ENTRANCE: "FLOOR", APPROACH: "CROSSING", CROSSING: "EXIT" };
/** Semantic actions, not scroll coordinates. Completion must match its operation. */
export function sceneReducer(state: SceneState, event: SceneEvent): SceneState {
  const move = (phase: ScenePhase) => ({ ...state, phase, operation: state.operation + 1 });
  switch (event.type) {
    case "READY": return { ...state, ready: event.ready };
    case "ENTER": return state.ready && ["BOOT", "STATIC", "EXIT"].includes(state.phase) ? move("ENTRANCE") : state;
    case "SETTLED": return event.operation === state.operation && next[state.phase] ? move(next[state.phase]!) : state;
    case "FOCUS": return state.ready && state.phase === "FLOOR" ? move("FOCUS") : state;
    case "SELECT": return state.ready && state.phase === "FOCUS" ? move("APPROACH") : state;
    case "CANCEL": return ["APPROACH", "CROSSING", "EXIT"].includes(state.phase) ? move("FOCUS") : state.phase === "FOCUS" ? move("FLOOR") : state.phase === "ENTRANCE" ? move("BOOT") : state;
    case "SKIP": return state.ready ? move("FLOOR") : move("STATIC");
    case "STATIC": return move("STATIC");
    case "RESET": return { ...initialScene, operation: state.operation + 1 };
  }
}
