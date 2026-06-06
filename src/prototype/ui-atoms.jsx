// Shared utilities for all directions

const PaperGrain = ({ opacity = 0.05 }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    opacity, mixBlendMode: 'multiply',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
  }} />
);

function ImagePlaceholder({ label, bg, fg, height = 280 }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <div style={{
      width: '100%', height, borderRadius: 10,
      background: bg, color: fg, border: `1px solid ${fg}22`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <defs>
          <pattern id={`p-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={fg} strokeWidth="0.6" opacity="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${id})`} />
      </svg>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Lato', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', opacity: 0.7, marginBottom: 6,
        }}>
          {label}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `1px dashed ${fg}`, opacity: 0.4,
          margin: '0 auto', display: 'grid', placeItems: 'center',
          fontSize: 14,
        }}>
          ▢
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// InkMark — the Copi AI Editor mark (logo #9 · "Ink Splash")
// A slightly-irregular inkblot with two pairs of splash droplets
// (moss + sun) and a center cross-spark. Used wherever the AI Editor
// is represented across the product — dashboards, mailroom cards,
// transcripts, editor's notes, sidebar.
//
// `size`  — pixel size of the square mark (default 14)
// `color` — fill of the central inkblot. The cross + droplets adapt:
//           dark inks get a cream cross, light inks (sun/cream) get a
//           dark cross, so the mark stays legible on either ground.
// ──────────────────────────────────────────────────────────
function InkMark({ size = 14, color = '#1A1410' }) {
  const PAL = { fg: '#1A1410', accent: '#3F5A3A', sun: '#C68A3D', cream: '#F4EBD2' };
  const isLight = color === PAL.sun || color === PAL.cream;
  const sparkColor = isLight ? PAL.fg : PAL.cream;
  // Droplet palette pairs — moss + sun on dark inkblot, moss + dark on light inkblot
  const dropA = PAL.accent;
  const dropB = isLight ? PAL.fg : PAL.sun;
  const stroke = Math.max(1.1, Math.min(2.2, size / 8));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: 'middle', flex: 'none' }}
      aria-hidden="true"
    >
      {/* Slightly-irregular inkblot — drawn, not geometric */}
      <path
        d="M 12 6 C 16 6, 18.7 8, 18.7 12 C 18.7 16.7, 15.3 18.7, 12 18.7 C 8 18.7, 5.3 16, 5.3 12 C 5.3 8, 8.3 6, 12 6 Z"
        fill={color}
      />
      {/* Splash droplets — moss pair (NE + SW), accent pair (SE + NW) */}
      <circle cx="19.5" cy="4.5"  r="1"    fill={dropA} />
      <circle cx="4.5"  cy="20"   r="0.85" fill={dropA} />
      <circle cx="21.4" cy="18.7" r="0.7"  fill={dropB} />
      <circle cx="2.6"  cy="7.4"  r="0.7"  fill={dropB} />
      {/* Center cross-spark */}
      <path
        d="M 12 9.6 L 12 14.4 M 9.6 12 L 14.4 12"
        stroke={sparkColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

Object.assign(window, { PaperGrain, ImagePlaceholder, InkMark });
