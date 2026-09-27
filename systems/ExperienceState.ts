import { create } from "zustand";
export type Chapter = "CABINET_HERO" | "PORTAL_APPROACH" | "SUNSCAPE_WORLD";
type State = { chapter: Chapter; setChapter: (chapter: Chapter) => void };
export const useExperienceState = create<State>((set) => ({
  chapter: "CABINET_HERO",
  setChapter: (chapter) => set({ chapter }),
}));
export type Sequence = {
  progress: number;
  pointerX: number;
  pointerY: number;
  energy: number;
};
