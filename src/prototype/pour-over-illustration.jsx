// Vintage technical-illustration of a pour-over brewing setup
// Single-ink line drawing, callout annotations — like a field manual figure.
// Reusable across templates that want the same hero.
function PourOver({
  size = 540,
  ink = '#1A1410',
  paper = '#F4EBD2',
  brew = '#1A1410',
  spark = null // optional warm accent (set to a hex for T4 cherry); null for plain
}) {
  const w = size;
  const h = 600;
  const cx = w / 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}
    style={{ filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.12))' }}>

      {/* FIG label — top right */}
      <g transform={`translate(${w - 140}, 28)`}>
        <text style={{ fontFamily: 'Lato', fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', fill: ink, opacity: 0.6 }}>
          FIG. I
        </text>
        <text y="18" style={{ fontFamily: 'Yrsa', fontStyle: 'italic', fontSize: 16, fill: ink }}>
          The pour-over
        </text>
        <line x1="0" y1="26" x2="110" y2="26" stroke={ink} strokeWidth="0.6" opacity="0.5" />
      </g>

      {/* Counter line (twin rule, almanac-style) */}
      <line x1="40" y1="540" x2={w - 40} y2="540" stroke={ink} strokeWidth="1.2" />
      <line x1="40" y1="546" x2={w - 40} y2="546" stroke={ink} strokeWidth="0.4" opacity="0.5" />

      {/* Scale */}
      <rect x={cx - 110} y="510" width="220" height="30" fill={paper} stroke={ink} strokeWidth="1.3" />
      <rect x={cx + 50} y="518" width="50" height="14" fill="none" stroke={ink} strokeWidth="0.6" opacity="0.7" />
      <text x={cx + 75} y="530" textAnchor="middle"
      style={{ fontFamily: 'Lato', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', fill: ink, fontVariantNumeric: 'tabular-nums' }}>
        324 g
      </text>
      {/* scale platform line */}
      <line x1={cx - 95} y1="510" x2={cx + 30} y2="510" stroke={ink} strokeWidth="0.5" opacity="0.4" />

      {/* Carafe / server — glass cylinder, slightly tapered, with handle */}
      <path d={`
        M ${cx - 72} 380
        L ${cx - 78} 495
        Q ${cx - 78} 510 ${cx - 60} 510
        L ${cx + 60} 510
        Q ${cx + 78} 510 ${cx + 78} 495
        L ${cx + 72} 380
        Z
      `} fill={paper} stroke={ink} strokeWidth="1.3" />
      {/* carafe top rim */}
      <ellipse cx={cx} cy="380" rx="72" ry="7" fill={paper} stroke={ink} strokeWidth="1.3" />
      <ellipse cx={cx} cy="380" rx="64" ry="4" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />

      {/* coffee fill inside carafe */}
      <path d={`
        M ${cx - 76} 455
        L ${cx - 78} 495
        Q ${cx - 78} 510 ${cx - 60} 510
        L ${cx + 60} 510
        Q ${cx + 78} 510 ${cx + 78} 495
        L ${cx + 76} 455
        Z
      `} fill={brew} opacity="0.85" />
      <ellipse cx={cx} cy="455" rx="77" ry="4.5" fill={brew} opacity="0.85" />

      {/* carafe handle */}
      <path d={`M ${cx + 76} 405 Q ${cx + 112} 415 ${cx + 110} 445 Q ${cx + 108} 470 ${cx + 78} 472`}
      fill="none" stroke={ink} strokeWidth="1.3" />

      {/* ── DRIPPER ── */}
      {/* V60 cone outline */}
      <path d={`
        M ${cx - 100} 246
        L ${cx - 22} 372
        L ${cx + 22} 372
        L ${cx + 100} 246
        Z
      `} fill={paper} stroke={ink} strokeWidth="1.4" />
      {/* top rim */}
      <ellipse cx={cx} cy="246" rx="100" ry="9" fill={paper} stroke={ink} strokeWidth="1.4" />
      <ellipse cx={cx} cy="246" rx="92" ry="5" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />
      {/* spiral ridges hint */}
      {[0.18, 0.36, 0.54, 0.72].map((t, i) => {
        const y = 246 + (372 - 246) * t;
        const rx = 100 - (100 - 22) * t;
        return <ellipse key={i} cx={cx} cy={y} rx={rx} ry={rx * 0.08}
        fill="none" stroke={ink} strokeWidth="0.4" opacity="0.45" />;
      })}
      {/* handle */}
      <path d={`M ${cx + 95} 260 Q ${cx + 125} 274 ${cx + 122} 300 Q ${cx + 116} 315 ${cx + 84} 318`}
      fill="none" stroke={ink} strokeWidth="1.3" />
      {/* filter paper edge (interior, lighter line) */}
      <path d={`M ${cx - 88} 248 L ${cx - 18} 370 L ${cx + 18} 370 L ${cx + 88} 248`}
      fill="none" stroke={ink} strokeWidth="0.45" opacity="0.4" />

      {/* coffee drip from dripper into carafe */}
      <line x1={cx} y1="372" x2={cx} y2="378" stroke={brew} strokeWidth="1.6" />
      <ellipse cx={cx} cy="382" rx="1.6" ry="2.4" fill={brew} />

      {/* ── GOOSENECK KETTLE ── pouring into the dripper from the left */}
      <g transform="translate(58, 232)">
        {/* body */}
        <path d={`
          M 20 30
          L 14 84
          Q 14 102 32 102
          L 142 102
          Q 160 102 160 84
          L 154 30
          Q 152 18 140 18
          L 34 18
          Q 22 18 20 30 Z
        `} fill={paper} stroke={ink} strokeWidth="1.3" />
        {/* lid + finial */}
        <ellipse cx="87" cy="18" rx="55" ry="5" fill={paper} stroke={ink} strokeWidth="1.3" />
        <ellipse cx="87" cy="18" rx="46" ry="3" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />
        <rect x="83" y="6" width="8" height="12" rx="1.5" fill={paper} stroke={ink} strokeWidth="1" />
        {/* gooseneck spout: long, curving toward the dripper top */}
        <path d={`
          M 160 44
          C 200 44, 232 56, 252 84
          C 262 100, 268 120, 270 138
        `} fill="none" stroke={ink} strokeWidth="1.4" />
        <path d={`
          M 160 60
          C 198 60, 226 70, 244 90
          C 252 102, 258 118, 262 135
        `} fill="none" stroke={ink} strokeWidth="1.4" />
        {/* spout tip */}
        <line x1="262" y1="135" x2="270" y2="138" stroke={ink} strokeWidth="1.4" />
        {/* handle, on the left */}
        <path d={`M 20 46 Q -14 56 -14 80 Q -14 102 22 100`}
        fill="none" stroke={ink} strokeWidth="1.3" />
        <path d={`M 22 56 Q -2 64 -2 82 Q -2 94 24 92`}
        fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />
      </g>

      {/* water stream from kettle spout into dripper */}
      <path d={`M 328 370 Q 320 320 ${cx - 28} 248`}
      fill="none" stroke={ink} strokeWidth="0.6" opacity="0.55"
      strokeDasharray="1.5 3" />

      {/* steam wisps above the dripper */}
      {[
      { x: cx - 34, y0: 234, y1: 178, sway: 9 },
      { x: cx + 2, y0: 228, y1: 162, sway: -11 },
      { x: cx + 32, y0: 236, y1: 184, sway: 7 }].
      map((s, i) =>
      <path key={i}
      d={`M ${s.x} ${s.y0} Q ${s.x + s.sway} ${(s.y0 + s.y1) / 2} ${s.x} ${s.y1}`}
      fill="none" stroke={ink} strokeWidth="0.6" opacity="0.4" />
      )}

      {/* ── ANNOTATIONS — vintage callouts ── */}
      {/* 60° cone, right of dripper */}
      <g>
        <line x1={cx + 100} y1="278" x2={cx + 165} y2="252" stroke={ink} strokeWidth="0.5" opacity="0.7" />
        <circle cx={cx + 100} cy="278" r="1.6" fill={ink} opacity="0.7" />
        <text x={cx + 168} y="244"
        style={{ fontFamily: 'Lato', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', fill: ink, opacity: 0.8 }}>
          60° CONE
        </text>
        <text x={cx + 168} y="259"
        style={{ fontFamily: 'Yrsa', fontStyle: 'italic', fontSize: 12, fill: ink, opacity: 0.7 }}>
          bloom 45 s
        </text>
      </g>

      {/* 94°C, left of kettle */}
      <g>
        <line x1="158" y1="262" x2="60" y2="200" stroke={ink} strokeWidth="0.5" opacity="0.7" />
        <circle cx="158" cy="262" r="1.6" fill={ink} opacity="0.7" />
        <text x="22" y="188"
        style={{ fontFamily: 'Lato', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', fill: ink, opacity: 0.8 }}>
          GOOSENECK · 94°C
        </text>
        <text x="22" y="203"
        style={{ fontFamily: 'Yrsa', fontStyle: 'italic', fontSize: 12, fill: ink, opacity: 0.7 }}>
          steady, slow pour
        </text>
      </g>

      {/* RATIO 1:16, on the carafe */}
      <g>
        <line x1={cx - 78} y1="455" x2="60" y2="478" stroke={ink} strokeWidth="0.5" opacity="0.7" />
        {spark ?
        <circle cx={cx - 78} cy="455" r="3.5" fill={spark} stroke={ink} strokeWidth="0.5" /> :
        <circle cx={cx - 78} cy="455" r="1.6" fill={ink} opacity="0.7" />}
        <text x="22" y="476"
        style={{ fontFamily: 'Lato', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', fill: ink, opacity: 0.8 }}>
          RATIO 1 : 16
        </text>
        <text x="22" y="491"
        style={{ fontFamily: 'Yrsa', fontStyle: 'italic', fontSize: 12, fill: ink, opacity: 0.7 }}>
          20 g coffee · 320 g water
        </text>
      </g>
    </svg>);

}

Object.assign(window, { PourOver });