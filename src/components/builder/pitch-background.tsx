/**
 * Static pitch markings shared by the interactive builder pitch and the
 * static formation diagrams on tactic article pages. No directives —
 * renders as RSC in server contexts and as a client component under the
 * builder (parent context decides).
 */
export function PitchBackground() {
  return (
    <>
      {/* Pitch outline */}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="#0A0E17"
        stroke="#1C2436"
        strokeWidth="0.5"
        rx="1"
      />

      {/* Center line */}
      <line x1="0" y1="50" x2="100" y2="50" stroke="#1C2436" strokeWidth="0.3" />

      {/* Center circle */}
      <circle cx="50" cy="50" r="12" fill="none" stroke="#1C2436" strokeWidth="0.3" />

      {/* Center dot */}
      <circle cx="50" cy="50" r="0.8" fill="#1C2436" />

      {/* Penalty areas */}
      <rect
        x="22"
        y="0"
        width="56"
        height="16"
        fill="none"
        stroke="#1C2436"
        strokeWidth="0.3"
      />
      <rect
        x="22"
        y="84"
        width="56"
        height="16"
        fill="none"
        stroke="#1C2436"
        strokeWidth="0.3"
      />

      {/* Goal areas */}
      <rect
        x="36"
        y="0"
        width="28"
        height="6"
        fill="none"
        stroke="#1C2436"
        strokeWidth="0.3"
      />
      <rect
        x="36"
        y="94"
        width="28"
        height="6"
        fill="none"
        stroke="#1C2436"
        strokeWidth="0.3"
      />

      {/* Goal posts */}
      <rect x="44" y="-0.5" width="12" height="1.5" fill="#1C2436" rx="0.5" />
      <rect x="44" y="99" width="12" height="1.5" fill="#1C2436" rx="0.5" />

      {/* Grid lines */}
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => (
        <line
          key={`h-${pct}`}
          x1="0"
          y1={pct}
          x2="100"
          y2={pct}
          stroke="#1C2436"
          strokeWidth="0.1"
          strokeDasharray="1,2"
          opacity="0.5"
        />
      ))}
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => (
        <line
          key={`v-${pct}`}
          x1={pct}
          y1="0"
          x2={pct}
          y2="100"
          stroke="#1C2436"
          strokeWidth="0.1"
          strokeDasharray="1,2"
          opacity="0.5"
        />
      ))}
    </>
  );
}
