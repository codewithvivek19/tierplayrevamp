export type CoreState = {
  progress: number;
  pointerX: number;
  pointerY: number;
  selected: number;
  invalidate?: () => void;
};

export const worlds = [
  { name: "Rise of the Dragon", image: "/media/games/rise-of-the-dragon.webp", color: "#f1a855" },
  { name: "Rich Times", image: "/media/games/rich-times.webp", color: "#e7cf92" },
  { name: "Gang of Evils", image: "/media/games/gangs-of-evil.webp", color: "#ff5848" },
  { name: "Bison Showdown", image: "/media/games/bison-showdown.webp", color: "#9eaeb1" },
  { name: "Sinister Show", image: "/media/games/sinister-show.webp", color: "#ad99ff" },
  { name: "Tiki Twist", image: "/media/games/tiki-twist.webp", color: "#66dbc8" },
] as const;
