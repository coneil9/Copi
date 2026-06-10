// ═════════════════════════════════════════════════════════
// COFFEE MASCOT — SVG illustration of friendly coffee cup character
// Two variants: 'hero' (full body, standing) and 'cta' (upper body, waving)
// ═════════════════════════════════════════════════════════

import React from 'react';

function CoffeeMascot({ variant = 'hero', size = 300, ...props }) {
  const cupColor = '#4A7C59';      // Mid forest green
  const lidColor = '#F0EDE4';      // Cream
  const sleeveColor = '#E8E4D8';   // Light beige
  const faceColor = '#1C1C1A';     // Dark for eyes/smile
  const steamColor = '#B8AFA0';    // Light brown for steam

  // Scale factor for CTA variant (smaller, upper body only)
  const ctaScale = 0.85;
  const viewBoxHeight = variant === 'cta' ? 300 : 400;

  return (
    <svg
      viewBox={`0 0 300 ${viewBoxHeight}`}
      width={variant === 'cta' ? size * ctaScale : size}
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...props.style
      }}
      {...props}
    >
      {/* Steam wisps */}
      <g opacity="0.6">
        <path
          d="M 120 30 Q 115 15 110 5"
          stroke={steamColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M 120 30 Q 115 15 110 5; M 120 30 Q 118 15 115 5; M 120 30 Q 115 15 110 5"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 150 25 Q 150 10 150 0"
          stroke={steamColor}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M 150 25 Q 150 10 150 0; M 150 25 Q 152 10 155 0; M 150 25 Q 150 10 150 0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 180 30 Q 185 15 190 5"
          stroke={steamColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M 180 30 Q 185 15 190 5; M 180 30 Q 182 15 185 5; M 180 30 Q 185 15 190 5"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Lid */}
      <ellipse cx="150" cy="45" rx="75" ry="20" fill={lidColor} />
      <ellipse cx="150" cy="45" rx="70" ry="15" fill={lidColor} />
      {/* Lid rim shadow */}
      <ellipse cx="150" cy="48" rx="72" ry="18" fill="rgba(0,0,0,0.05)" />

      {/* Cup body - main green cup */}
      <path
        d="M 80 50 L 90 200 Q 90 215 105 215 L 195 215 Q 210 215 210 200 L 220 50 Z"
        fill={cupColor}
      />

      {/* Cup sleeve - textured band */}
      <path
        d="M 82 110 L 86 150 L 214 150 L 218 110 Z"
        fill={sleeveColor}
        opacity="0.9"
      />
      {/* Sleeve texture lines */}
      <line x1="85" y1="120" x2="88" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="95" y1="118" x2="98" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="105" y1="117" x2="108" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="150" y1="116" x2="150" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="195" y1="117" x2="192" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="205" y1="118" x2="202" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />
      <line x1="215" y1="120" x2="212" y2="145" stroke={cupColor} strokeWidth="1.5" opacity="0.3" />

      {/* Cup highlights */}
      <path
        d="M 85 60 Q 95 70 95 100 Q 95 140 90 180"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Face - friendly eyes */}
      <circle cx="125" cy="110" r="6" fill={faceColor} />
      <circle cx="175" cy="110" r="6" fill={faceColor} />
      {/* Eye highlights */}
      <circle cx="127" cy="108" r="2" fill="rgba(255,255,255,0.9)" />
      <circle cx="177" cy="108" r="2" fill="rgba(255,255,255,0.9)" />

      {/* Smile */}
      <path
        d="M 130 135 Q 150 150 170 135"
        stroke={faceColor}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Arms */}
      {variant === 'hero' ? (
        // Hero variant - arms at sides
        <>
          {/* Left arm */}
          <path
            d="M 75 100 Q 60 110 55 130 L 50 145"
            stroke={faceColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left hand */}
          <circle cx="50" cy="148" r="7" fill={faceColor} />

          {/* Right arm */}
          <path
            d="M 225 100 Q 240 110 245 130 L 250 145"
            stroke={faceColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right hand */}
          <circle cx="250" cy="148" r="7" fill={faceColor} />
        </>
      ) : (
        // CTA variant - right arm waving
        <>
          {/* Left arm (lower) */}
          <path
            d="M 75 100 Q 60 110 55 130"
            stroke={faceColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="55" cy="133" r="7" fill={faceColor} />

          {/* Right arm (waving up) */}
          <path
            d="M 225 100 Q 240 85 260 70"
            stroke={faceColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="262" cy="68" r="7" fill={faceColor} />
        </>
      )}

      {/* Legs and feet (hero variant only) */}
      {variant === 'hero' && (
        <>
          {/* Left leg */}
          <path
            d="M 115 215 L 115 260"
            stroke={faceColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left foot */}
          <ellipse cx="120" cy="265" rx="18" ry="10" fill={faceColor} />

          {/* Right leg */}
          <path
            d="M 185 215 L 185 260"
            stroke={faceColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right foot */}
          <ellipse cx="180" cy="265" rx="18" ry="10" fill={faceColor} />

          {/* Foot highlights */}
          <ellipse cx="122" cy="263" rx="6" ry="3" fill="rgba(255,255,255,0.2)" />
          <ellipse cx="182" cy="263" rx="6" ry="3" fill="rgba(255,255,255,0.2)" />
        </>
      )}
    </svg>
  );
}

// Export to window
window.CoffeeMascot = CoffeeMascot;

export default CoffeeMascot;
