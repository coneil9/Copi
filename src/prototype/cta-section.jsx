// ═════════════════════════════════════════════════════════
// CTA SECTION — Final call to action with green background
// Deep green bg + large headline + email input + mascot (right edge)
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import CoffeeMascot from './coffee-mascot.jsx';
import { InputWithButton } from './ui-components.jsx';

function CTASection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const handleEmailSubmit = (email) => {
    console.log('CTA waitlist signup:', email);
    // Open trial modal if available
    if (window.CopiActions && window.CopiActions.openTrial) {
      window.CopiActions.openTrial();
    }
  };

  const sectionContainerStyle = {
    ...sectionStyle({ paddingTop: 80, paddingBottom: 80 }),
    background: p.bgCta,
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
      <div style={sectionInnerStyle}>
        <h2 style={headlineStyle}>
          Be first to put Copi in your cafe.
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
              background: '#F4C542',
              color: p.textPrimary,
              fontWeight: 600
            }}
          />
        </div>
      </div>

      {/* Coffee mascot peeking from right edge */}
      <div style={mascotWrapperStyle}>
        <CoffeeMascot variant="cta" size={200} />
      </div>
    </section>
  );
}

// Export to window
window.CTASection = CTASection;

export default CTASection;
