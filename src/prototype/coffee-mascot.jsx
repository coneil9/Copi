// ═════════════════════════════════════════════════════════
// COFFEE MASCOT (Cupper) — renders the official Cupper Ai.png asset.
// The component API is preserved (variant + size) so existing call sites
// in hero-section.jsx and cta-section.jsx don't need to change. The
// hero variant uses the full `size`; the cta variant scales to 85% to
// match the previous SVG footprint.
// ═════════════════════════════════════════════════════════

import React from 'react';

const CUPPER_SRC = '/assets/cupper-ai.png';
// Natural aspect of the asset (944 × 1108) → height ≈ width × 1.174.
const ASPECT = 1108 / 944;

function CoffeeMascot({ variant = 'hero', size = 300, ...props }) {
  const isHero = variant === 'hero';
  const width = isHero ? size : size * 0.85;

  return (
    <img
      src={CUPPER_SRC}
      alt="Cupper"
      width={width}
      height={Math.round(width * ASPECT)}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        background: 'transparent',
        ...props.style
      }}
      {...props}
    />
  );
}

window.CoffeeMascot = CoffeeMascot;

export default CoffeeMascot;
