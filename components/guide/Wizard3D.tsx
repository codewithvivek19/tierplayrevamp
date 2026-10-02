const ART = "/media/mascot/wizard-800.webp";

// Eye openings and irises traced from the supplied artwork (1000-unit viewBox). New irises are drawn
// inside a clip of each opening, so they can follow the pointer without leaving the eye.
const EYES = [
  { id: "l", iris: [466, 335.5, 11] as const, opening: "458.8,322 454.5,324.5 452,327 450,329.5 448.8,332 447.8,334.5 447.3,337 446.8,339.5 447.8,342 451,344.5 472.8,344.5 474.8,342 476,339.5 476.5,337 476.3,334.5 475.3,332 473.5,329.5 472.8,327 471,324.5 467,322" },
  { id: "r", iris: [526, 335.5, 10.6] as const, opening: "525.3,320 518.3,322.5 515.3,325 513.3,327.5 512,330 511,332.5 510.3,335 510,337.5 511,340 513,342.5 523,345 528.3,345 539.8,342.5 543,340 543.5,337.5 543,335 542,332.5 541,330 539.5,327.5 537.5,325 534.5,322.5 527.5,320" },
];
const DEPTH = 6;

/**
 * The Tierplay wizard as a small 3D character. `figure` is the full body on a glowing pedestal with
 * stacked extrusion layers for thickness, orbiting sparks and a staff orb; `face` is a round avatar.
 * Gaze, tilt and mood come from CSS custom properties and data attributes set by the guide, so the
 * character never re-renders while it moves.
 */
export default function Wizard3D({ variant = "figure", uid }: { variant?: "figure" | "face"; uid: string }) {
  const figure = variant === "figure";
  return <span className={`wiz wiz--${variant}`} aria-hidden="true">
    {figure ? <span className="wiz__pedestal"><i /><i /></span> : null}
    {figure ? <span className="wiz__shadow" /> : null}
    <span className="wiz__float"><span className="wiz__body">
      {figure ? Array.from({ length: DEPTH }, (_, i) => <img key={i} className="wiz__slice" src={ART} alt="" draggable={false} style={{ ["--z" as string]: `${-(i + 1) * .9}px` }} />) : null}
      <img className="wiz__art" src={ART} alt="" draggable={false} />
      <svg className="wiz__fx" viewBox="0 0 1000 1000">
        <defs>
          <radialGradient id={`wiz-orb-${uid}`}><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#e2c2ff" /><stop offset="1" stopColor="#9e05ff" stopOpacity="0" /></radialGradient>
          {EYES.map((eye) => <clipPath key={eye.id} id={`wiz-eye-${eye.id}-${uid}`}><polygon points={eye.opening} /></clipPath>)}
        </defs>
        {EYES.map((eye) => <g key={eye.id} clipPath={`url(#wiz-eye-${eye.id}-${uid})`}>
          <polygon points={eye.opening} fill="#fff" />
          <g className="wiz__iris">
            <circle cx={eye.iris[0]} cy={eye.iris[1]} r={eye.iris[2]} fill="#784aa0" stroke="#452e58" strokeWidth="1.6" />
            <circle cx={eye.iris[0]} cy={eye.iris[1]} r={eye.iris[2] * .48} fill="#24202c" />
            <circle cx={eye.iris[0] - 4.6} cy={eye.iris[1] - 3.4} r="2.4" fill="#f4f2f0" />
          </g>
        </g>)}
        <g className="wiz__lids" fill="#e8a88f">
          <ellipse cx="462" cy="331" rx="19" ry="17" />
          <ellipse cx="527" cy="331" rx="19" ry="17" />
        </g>
        <circle className="wiz__orb" cx="318" cy="205" r="74" fill={`url(#wiz-orb-${uid})`} />
      </svg>
      <span className="wiz__rim" />
      {figure ? <span className="wiz__orbit"><i /><i /><i /><i /></span> : null}
    </span></span>
  </span>;
}
