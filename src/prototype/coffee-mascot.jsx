// ═════════════════════════════════════════════════════════
// COFFEE MASCOT (Cupper) — SVG illustration of friendly coffee cup character
// Updated design: green to-go cup, beige lid + lower sleeve, single steam squiggle,
// two dot eyes + simple smile, thin black stick arms and legs with round feet.
// Two variants: 'hero' (full body, standing) and 'cta' (upper body, waving)
// ═════════════════════════════════════════════════════════

import React from 'react';

function CoffeeMascot({ variant = 'hero', size = 300, ...props }) {
  const cupColor = '#6F8E5A';      // warm muted green (matches new Cupper)
  const cupShade = '#5B7748';      // subtle shading on cup edges
  const lidColor = '#D9CBAE';      // beige lid / sleeve
  const lidShade = '#C3B496';      // beige shading
  const limbColor = '#1C1A17';     // near-black for arms, legs, eyes, mouth

  const isHero = variant === 'hero';
  const viewBoxHeight = isHero ? 420 : 300;
  const ctaScale = 0.85;

  return (
    <svg
      viewBox={`0 0 320 ${viewBoxHeight}`}
      width={isHero ? size : size * ctaScale}
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...props.style
      }}
      {...props}
    >
      {/* Single steam squiggle rising from lid */}
      <g>
        <path
          d="M 175 55 C 195 40, 145 30, 165 15 C 180 5, 155 -2, 170 -10"
          stroke={limbColor}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 2 -2; 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Lid — beige cap that wraps the top of the cup */}
      <ellipse cx="160" cy="72" rx="78" ry="12" fill={lidShade} />
      <path
        d="M 82 72 Q 82 50 160 50 Q 238 50 238 72 Q 238 88 160 88 Q 82 88 82 72 Z"
        fill={lidColor}
      />
      {/* lid sip hole hint */}
      <ellipse cx="160" cy="60" rx="14" ry="3" fill={lidShade} opacity="0.6" />

      {/* Cup body — green to-go cup, slightly tapered */}
      <path
        d="M 92 80 L 100 240 Q 100 252 112 252 L 208 252 Q 220 252 220 240 L 228 80 Z"
        fill={cupColor}
      />
      {/* subtle right-side shading on cup */}
      <path
        d="M 215 82 L 220 240 Q 220 248 212 250 L 210 250 L 215 82 Z"
        fill={cupShade}
        opacity="0.55"
      />
      {/* subtle left-side highlight */}
      <path
        d="M 100 90 Q 96 160 102 230"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Lower beige sleeve band */}
      <path
        d="M 100 195 L 220 195 L 218 215 L 102 215 Z"
        fill={lidColor}
      />
      <path
        d="M 100 195 L 220 195 L 219 200 L 101 200 Z"
        fill={lidShade}
        opacity="0.7"
      />

      {/* Face — two dot eyes */}
      <ellipse cx="138" cy="140" rx="6" ry="6.5" fill={limbColor} />
      <ellipse cx="182" cy="140" rx="6" ry="6.5" fill={limbColor} />

      {/* Simple smile */}
      <path
        d="M 142 165 Q 160 178 178 165"
        stroke={limbColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Arms — thin black sticks */}
      {isHero ? (
        <>
          {/* Left arm: down at side */}
          <path
            d="M 95 145 Q 78 165 72 195"
            stroke={limbColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left hand dot */}
          <circle cx="71" cy="198" r="4" fill={limbColor} />

          {/* Right arm: extended slightly out, holding something / relaxed */}
          <path
            d="M 225 145 Q 248 158 258 188"
            stroke={limbColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right hand dot */}
          <circle cx="259" cy="191" r="4" fill={limbColor} />
        </>
      ) : (
        <>
          {/* Left arm: down */}
          <path
            d="M 95 145 Q 80 160 76 180"
            stroke={limbColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="75" cy="183" r="4" fill={limbColor} />

          {/* Right arm: waving up */}
          <path
            d="M 225 145 Q 250 120 268 95"
            stroke={limbColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="270" cy="92" r="4" fill={limbColor} />
        </>
      )}

      {/* Legs and feet — thin black sticks with round shoes */}
      {isHero && (
        <>
          {/* Left leg */}
          <path
            d="M 130 252 L 128 320"
            stroke={limbColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left shoe — round black foot */}
          <ellipse cx="124" cy="335" rx="20" ry="13" fill={limbColor} />
          <ellipse cx="118" cy="332" rx="6" ry="3" fill="rgba(255,255,255,0.18)" />

          {/* Right leg */}
          <path
            d="M 190 252 L 192 320"
            stroke={limbColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right shoe */}
          <ellipse cx="196" cy="335" rx="20" ry="13" fill={limbColor} />
          <ellipse cx="202" cy="332" rx="6" ry="3" fill="rgba(255,255,255,0.18)" />
        </>
      )}
    </svg>
  );
}

window.CoffeeMascot = CoffeeMascot;

export default CoffeeMascot;
