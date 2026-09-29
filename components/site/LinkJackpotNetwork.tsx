const machines = Array.from({ length: 8 }, (_, index) => {
  const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
  return { x: 300 + Math.cos(angle) * 220, y: 210 + Math.sin(angle) * 150 };
});

/** Decorative diagram: machines at one location feeding one shared progressive jackpot. */
export default function LinkJackpotNetwork() {
  return <figure className="link-network">
    <svg viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <radialGradient id="link-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#b56bff" />
          <stop offset="100%" stopColor="#b56bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="link-network-orbit" cx="300" cy="210" rx="220" ry="150" />
      {machines.map((m, index) => <g key={index}>
        <line className="link-network-path" x1={m.x} y1={m.y} x2="300" y2="210" />
        <line className="link-network-pulse" x1={m.x} y1={m.y} x2="300" y2="210" style={{ animationDelay: `${index * 0.35}s` }} />
        <rect className="link-network-machine" x={m.x - 11} y={m.y - 17} width="22" height="34" rx="3" />
        <rect className="link-network-screen" x={m.x - 7} y={m.y - 13} width="14" height="15" rx="1.5" />
      </g>)}
      <circle className="link-network-halo" cx="300" cy="210" r="74" fill="url(#link-core)" />
      <circle className="link-network-ring" cx="300" cy="210" r="46" />
      <circle className="link-network-ring link-network-ring-2" cx="300" cy="210" r="46" />
      <circle className="link-network-core" cx="300" cy="210" r="30" />
    </svg>
    <figcaption>Illustration: machines at one location connected to one shared progressive jackpot.</figcaption>
  </figure>;
}
