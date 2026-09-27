export default function CoreFallback() {
  return (
    <svg className="core-fallback" viewBox="0 0 800 800" aria-hidden="true">
      <defs>
        <radialGradient id="core-halo"><stop stopColor="#2bbccc" stopOpacity=".16"/><stop offset="1" stopColor="#06090c" stopOpacity="0"/></radialGradient>
        <linearGradient id="core-metal" x2="1" y2="1"><stop stopColor="#c3d9df"/><stop offset=".3" stopColor="#273942"/><stop offset=".55" stopColor="#b2c2c6"/><stop offset=".7" stopColor="#121e28"/><stop offset="1" stopColor="#75838a"/></linearGradient>
      </defs>
      <circle cx="400" cy="400" r="390" fill="url(#core-halo)"/>
      <g fill="none" stroke="url(#core-metal)" strokeWidth="14">
        <ellipse cx="400" cy="400" rx="280" ry="210" transform="rotate(-32 400 400)"/>
        <ellipse cx="400" cy="400" rx="260" ry="125" transform="rotate(57 400 400)"/>
        <ellipse cx="400" cy="400" rx="215" ry="190" transform="rotate(16 400 400)"/>
      </g>
      <g fill="none" stroke="#5be7e6" strokeWidth="1" opacity=".65"><circle cx="400" cy="400" r="298" strokeDasharray="1 12"/><ellipse cx="400" cy="400" rx="280" ry="213" transform="rotate(-32 400 400)"/></g>
      <path d="M400 238 527 355 490 505 345 549 270 393Z" fill="url(#core-metal)" stroke="#b8e9e6"/>
      <path d="m400 238-55 311 182-194-257 38 220 112Z" fill="none" stroke="#4bd9d2" opacity=".7"/>
    </svg>
  );
}
