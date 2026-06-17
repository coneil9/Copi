// ═════════════════════════════════════════════════════════
// HOW IT WORKS SECTION — 3-step setup process
// Parchment bg (returns to base palette after the forest section).
// Steps slide in from the left in sequence; "afternoon" is highlighted.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, SPACING } from './design-system.jsx';
import { Eyebrow, StepBadge } from './ui-components.jsx';
import { Reveal, Highlight } from './animations.jsx';

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
    ...sectionStyle({ paddingTop: 120, paddingBottom: 120 }),
    background: 'var(--copi-parchment)',
    scrollMarginTop: 80,
    position: 'relative'
  };

  const sectionInnerStyle = {
    ...containerStyle(),
    textAlign: 'center'
  };

  const headlineStyle = {
    ...t.h2,
    color: p.textPrimary,
    margin: '0 0 56px 0'
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
        <Reveal variant="fade-up">
          <Eyebrow style={{ marginBottom: 16 }}>SETUP</Eyebrow>
        </Reveal>

        <Reveal variant="fade-up" delay={60}>
          <h2 style={headlineStyle}>
            Up and running in an <Highlight>afternoon</Highlight>.
          </h2>
        </Reveal>

        <div style={stepsGridStyle}>
          {steps.map((step, i) => (
            <Reveal key={step.number} variant="slide-right" delay={140 + i * 120} duration={400}>
              <div style={stepStyle}>
                <StepBadge number={step.number} />
                <h3 style={stepTitleStyle}>{step.title}</h3>
                <p style={stepDescStyle}>{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

window.HowItWorksSection = HowItWorksSection;

export default HowItWorksSection;
