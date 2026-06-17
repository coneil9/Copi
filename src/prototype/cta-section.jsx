// ═════════════════════════════════════════════════════════
// CTA SECTION — Final call to action with green background
// Deep forest bg + large headline + email input + mascot (right edge).
// Top diagonal divider from cream Curriculum above.
// The whole content group scales in slightly when entering view.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import CoffeeMascot from './coffee-mascot.jsx';
import { InputWithButton } from './ui-components.jsx';
import { Reveal, Highlight, SectionDivider } from './animations.jsx';

function CTASection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const handleEmailSubmit = (email) => {
    console.log('CTA waitlist signup:', email);
    if (window.CopiActions && window.CopiActions.openTrial) {
      window.CopiActions.openTrial();
    }
  };

  const sectionContainerStyle = {
    ...sectionStyle({ paddingTop: 120, paddingBottom: 120 }),
    background: 'var(--copi-forest)',
    position: 'relative',
    overflow: 'hidden'
  };

  const sectionInnerStyle = {
    ...containerStyle(),
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
  };

  const headlineStyle = {
    ...t.h2,
    color: p.textOnDark,
    margin: '0 0 20px 0',
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const bodyStyle = {
    ...t.bodyLarge,
    color: p.textOnDark,
    opacity: 0.9,
    margin: '0 0 40px 0',
    maxWidth: 520,
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const formWrapperStyle = {
    maxWidth: 480,
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const mascotWrapperStyle = {
    position: 'absolute',
    right: -40,
    bottom: -20,
    zIndex: 0,
    opacity: 0.6
  };

  return (
    <section style={sectionContainerStyle}>
      {/* Top divider — cream of Curriculum above flows into forest */}
      <SectionDivider fromColor="var(--copi-cream)" position="top" height={80} variant="curve" />

      <div style={sectionInnerStyle}>
        <Reveal variant="scale" duration={420}>
          <h2 style={headlineStyle}>
            Be <Highlight>first</Highlight> to put Copi in your cafe.
          </h2>

          <p style={bodyStyle}>
            We are onboarding a small group of Vancouver cafes to start. Add your
            email and we will reach out.
          </p>

          <div style={formWrapperStyle}>
            <InputWithButton
              placeholder="you@yourcafe.com"
              buttonText="Join the waitlist!"
              onSubmit={handleEmailSubmit}
              variant="cta"
              inputStyle={{
                background: p.bgCard,
                borderColor: 'transparent'
              }}
              buttonStyle={{
                background: 'var(--copi-yellow)',
                color: p.textPrimary,
                fontWeight: 600
              }}
            />
          </div>
        </Reveal>
      </div>

      {/* Coffee mascot peeking from right edge */}
      <div style={mascotWrapperStyle}>
        <div className="copi-float">
          <CoffeeMascot variant="cta" size={200} />
        </div>
      </div>
    </section>
  );
}

window.CTASection = CTASection;

export default CTASection;
