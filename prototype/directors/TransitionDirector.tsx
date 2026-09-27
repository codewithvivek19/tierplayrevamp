"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Dispatch, MutableRefObject } from "react";
import { prototypeMotion } from "../../config/motion.config";
import type { SceneEvent, SceneState } from "../state/SceneDirector";
gsap.registerPlugin(useGSAP);
export interface SceneRuntime { entrance: number; focus: number; approach: number; crossing: number; moving: boolean }
export const newRuntime = (): SceneRuntime => ({ entrance: 0, focus: 0, approach: 0, crossing: 0, moving: false });
export function TransitionDirector({ state, runtime, dispatch, invalidate, mobile, active }: {
  state: SceneState; runtime: MutableRefObject<SceneRuntime>; dispatch: Dispatch<SceneEvent>; invalidate: () => void; mobile: boolean; active: boolean;
}) {
  useGSAP((context) => {
    const r = runtime.current;
    if (!active) return;
    const phase = state.phase;
    const target = phase === "ENTRANCE" ? { entrance: 1, focus: 0, approach: 0, crossing: 0 }
      : phase === "FLOOR" ? { entrance: 1, focus: 0, approach: 0, crossing: 0 }
      : phase === "FOCUS" ? { entrance: 1, focus: 1, approach: 0, crossing: 0 }
      : phase === "APPROACH" ? { entrance: 1, focus: 1, approach: 1, crossing: 0 }
      : phase === "CROSSING" || phase === "EXIT" ? { entrance: 1, focus: 1, approach: 1, crossing: 1 }
      : { entrance: 0, focus: 0, approach: 0, crossing: 0 };
    const duration = phase === "ENTRANCE" ? (mobile ? prototypeMotion.mobileEntrance : prototypeMotion.entrance)
      : phase === "APPROACH" ? prototypeMotion.approach : phase === "CROSSING" ? prototypeMotion.crossing : prototypeMotion.focus;
    r.moving = true;
    let tween: gsap.core.Tween;
    context.ignore(() => { tween = gsap.to(r, { ...target, duration, ease: prototypeMotion.ease, overwrite: true,
      onUpdate: invalidate,
      onComplete: () => { r.moving = false; invalidate(); dispatch({ type: "SETTLED", operation: state.operation }); },
    });
    });
    return () => { tween?.kill(); r.moving = false; };
  }, { dependencies: [state.phase, state.operation, active, mobile], revertOnUpdate: true });
  return null;
}
