// ═════════════════════════════════════════════════════════
// LANDING PAGE NEW — Complete marketing landing page
// Combines all sections: Nav → Hero → Problem → Value Props
// → How It Works → Curriculum → CTA → Footer
// ═════════════════════════════════════════════════════════

import React from 'react';
import NavNew from './nav-new.jsx';
import HeroSection from './hero-section.jsx';
import ProblemSection from './problem-section.jsx';
import ValuePropsSection from './value-props-section.jsx';
import HowItWorksSection from './how-it-works-section.jsx';
import CurriculumSection from './curriculum-section.jsx';
import CTASection from './cta-section.jsx';
import FooterNew from './footer-new.jsx';
import DESIGN_SYSTEM from './design-system.jsx';

function LandingPageNew() {
  const pageStyle = {
    minHeight: '100vh',
    background: DESIGN_SYSTEM.palette.bg
  };

  return (
    <div style={pageStyle}>
      <NavNew theme={DESIGN_SYSTEM} />
      <HeroSection theme={DESIGN_SYSTEM} />
      <ProblemSection theme={DESIGN_SYSTEM} />
      <ValuePropsSection theme={DESIGN_SYSTEM} />
      <HowItWorksSection theme={DESIGN_SYSTEM} />
      <CurriculumSection theme={DESIGN_SYSTEM} />
      <CTASection theme={DESIGN_SYSTEM} />
      <FooterNew theme={DESIGN_SYSTEM} />
    </div>
  );
}

// Export to window
window.LandingPageNew = LandingPageNew;

export default LandingPageNew;
