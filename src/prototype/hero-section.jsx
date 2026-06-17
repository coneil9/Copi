// ═════════════════════════════════════════════════════════
// HERO SECTION — Landing page hero with two-column layout
// Left: eyebrow + h1 + body + email input/button + trust line
// Right: Coffee mascot with circular halo background, idle bob
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import CoffeeMascot from './coffee-mascot.jsx';
import { Eyebrow, InputWithButton } from './ui-components.jsx';
import { Reveal, Highlight } from './animations.jsx';

function HeroSection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const handleEmailSubmit = (email) => {
    console.log('Waitlist signup:', email);
    if (window.CopiActions && window.CopiActions.openTrial) {
      window.CopiActions.openTrial();
    }
  };

  const heroContainerStyle = {
    ...sectionStyle({ paddingTop: 80, paddingBottom: 120 }),
    background: p.bg
  };

  const heroInnerStyle = {
    ...containerStyle(),
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 64,
    alignItems: 'center'
  };

  const leftColumnStyle = {
    maxWidth: 520
  };

  const headlineStyle = {
    ...t.h1,
    color: p.textPrimary,
    margin: '0 0 24px 0'
  };

  const bodyStyle = {
    ...t.bodyLarge,
    color: p.textMuted,
    margin: '0 0 32px 0',
    lineHeight: 1.6
  };

  const trustLineStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  };

  const rightColumnStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400
  };

  const haloStyle = {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${p.tagBg} 0%, transparent 70%)`,
    opacity: 0.6,
    zIndex: 0
  };

  const mascotWrapperStyle = {
    position: 'relative',
    zIndex: 1
  };

  return (
    <section style={heroContainerStyle}>
      <div style={heroInnerStyle}>
        {/* Left column - Text content (headline visible immediately) */}
        <div style={leftColumnStyle}>
          <Eyebrow style={{ marginBottom: 16 }}>
            FOR INDEPENDENT CAFES
          </Eyebrow>

          <h1 style={headlineStyle}>
            <Highlight>AI onboarding</Highlight> for small and medium cafes.
          </h1>

          <Reveal variant="fade-up" delay={80}>
            <p style={bodyStyle}>
              Copi turns your handbook, recipes, and house standards into a
              training track your team finishes on their phone. Set it up once
              and step back off the floor.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={160}>
            <InputWithButton
              placeholder="you@yourcafe.com"
              buttonText="Join the waitlist"
              onSubmit={handleEmailSubmit}
            />

            <div style={trustLineStyle}>
              <span>⏱</span>
              <span>
                Onboarding Vancouver cafes first. No card, no setup call.
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right column - Coffee mascot with halo + idle float */}
        <div style={rightColumnStyle}>
          <div style={haloStyle} />
          <div style={mascotWrapperStyle}>
            <div className="copi-float">
              <CoffeeMascot variant="hero" size={320} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.HeroSection = HeroSection;

export default HeroSection;
