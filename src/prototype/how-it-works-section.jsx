// ═════════════════════════════════════════════════════════
// HOW IT WORKS SECTION — 3-step setup process
// Eyebrow + h2 + 3-column numbered steps
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, SPACING } from './design-system.jsx';
import { Eyebrow, StepBadge } from './ui-components.jsx';

function HowItWorksSection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const steps = [
    {
      number: 1,
      title: 'Upload what you have',
      description: 'Drop in your handbook, recipes, and SOPs. PDFs and plain notes both work.'
    },
    {
      number: 2,
      title: 'Copi builds your tracks',
      description:
        'The AI maps your material into onboarding milestones and flags the gaps worth filling.'
    },
    {
      number: 3,
      title: 'Your team starts learning',
      description:
        'Invite staff, watch progress fill in by location, and sign off milestones from one dashboard.'
    }
  ];

  const sectionContainerStyle = {
    ...sectionStyle(),
    background: p.bg,
    scrollMarginTop: 80  // For smooth scroll offset
  };

  const sectionInnerStyle = {
    ...containerStyle(),
    textAlign: 'center'
  };

  const headlineStyle = {
    ...t.h2,
    color: p.textPrimary,
    margin: '0 0 48px 0'
  };

  const stepsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.xl,
    textAlign: 'left'
  };

  const stepStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  };

  const stepTitleStyle = {
    ...t.body,
    fontSize: 18,
    fontWeight: 600,
    color: p.textPrimary,
    margin: 0
  };

  const stepDescStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    lineHeight: 1.6,
    margin: 0
  };

  return (
    <section id="how-it-works" style={sectionContainerStyle}>
      <div style={sectionInnerStyle}>
        <Eyebrow style={{ marginBottom: 16 }}>SETUP</Eyebrow>

        <h2 style={headlineStyle}>
          Up and running in an afternoon.
        </h2>

        <div style={stepsGridStyle}>
          {steps.map((step) => (
            <div key={step.number} style={stepStyle}>
              <StepBadge number={step.number} />
              <h3 style={stepTitleStyle}>{step.title}</h3>
              <p style={stepDescStyle}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Export to window
window.HowItWorksSection = HowItWorksSection;

export default HowItWorksSection;
