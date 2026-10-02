// Adapted from React Bits ShinyText (TS + CSS). Tierplay changes: the sweep runs as a pure CSS
// animation instead of a per-frame Motion value, so it costs nothing on the main thread; colours
// come from the design tokens; it holds still under reduced motion.
export default function ShinyText({ text, className = "", speed = 2.4 }: { text: string; className?: string; speed?: number }) {
  return <span className={`shiny-text ${className}`} style={{ animationDuration: `${speed}s` }}>{text}</span>;
}
