// ═════════════════════════════════════════════════════════
// VALUE PROPS SECTION — Key benefits of using Copi
// Forest-green full-bleed section with cream text, dark cards,
// staggered card reveal, and diagonal dividers above and below.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, SPACING, RADIUS } from './design-system.jsx';
import { Eyebrow } from './ui-components.jsx';
import { Reveal, Highlight, SectionDivider } from './animations.jsx';

function ValuePropsSection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const valueProps = [
    {
      icon: '⏱',
      title: 'A faster, steadier ramp',
      description:
        'New hires move through clear milestones built from your own standards, so every shift runs to the same bar from week one.'
    },
    {
      icon: '🎓',
      title: 'Depth that keeps people',
      description:
        'Short, gamified lessons built on the SCA Coffee Skills framework, layered onto your coffees. Staff who can speak to the cup are staff who stay.'
    },
    {
      icon: '⚙️',
      title: 'Your time back',
      description:
        'Copi turns your manual and notes into the track in an afternoon. After that the team learns while you check in instead of re-explaining.'
    }
  ];

  const sectionContainerStyle = {
    ...sectionStyle({ paddingTop: 140, paddingBottom: 140 }),
    background: 'var(--copi-forest)',
    color: p.textOnDark,
    position: 'relative',
    overflow: 'hidden'
  };

  const sectionInnerStyle = {
    ...containerStyle(),
    textAlign: 'center',
    position: 'relative',
    zIndex: 2
  };

  const eyebrowDarkStyle = {
    color: 'rgba(239, 233, 218, 0.65)'
  };

  const headlineStyle = {
    ...t.h2,
    color: p.textOnDark,
    margin: '0 0 56px 0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.lg,
    textAlign: 'left'
  };

  const darkCardStyle = {
    background: 'rgba(245, 240, 232, 0.06)',
    border: '1px solid rgba(245, 240, 232, 0.16)',
    borderRadius: RADIUS.card,
    padding: 28,
    backdropFilter: 'blur(2px)'
  };

  const cardTitleStyle = {
    ...t.body,
    fontSize: 18,
    fontWeight: 600,
    color: p.textOnDark,
    margin: '0 0 12px 0'
  };

  const cardBodyStyle = {
    ...t.bodySmall,
    color: 'rgba(239, 233, 218, 0.78)',
    lineHeight: 1.6
  };

  const iconStyle = {
    fontSize: 32,
    marginBottom: 16,
    filter: 'saturate(1.1)'
  };

  return (
    <section style={sectionContainerStyle}>
      {/* Top divider — cream of the previous section flows into forest */}
      <SectionDivider fromColor="var(--copi-cream)" position="top" height={80} variant="diagonal" />

      <div style={sectionInnerStyle}>
        <Reveal variant="fade-up">
          <Eyebrow style={{ ...eyebrowDarkStyle, marginBottom: 16 }}>
            WHAT COPI GIVES YOU
          </Eyebrow>
        </Reveal>

        <Reveal variant="fade-up" delay={60}>
          <h2 style={headlineStyle}>
            A <Highlight>trained team</Highlight> without you in the room.
          </h2>
        </Reveal>

        <div style={gridStyle}>
          {valueProps.map((prop, i) => (
            <Reveal key={i} variant="fade-up" delay={140 + i * 110} duration={400}>
              <div style={darkCardStyle}>
                <div style={iconStyle}>{prop.icon}</div>
                <h3 style={cardTitleStyle}>{prop.title}</h3>
                <p style={{ ...cardBodyStyle, margin: 0 }}>{prop.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Bottom divider — parchment of HowItWorks below flows back up */}
      <SectionDivider fromColor="var(--copi-parchment)" position="bottom" height={80} variant="diagonal" />
    </section>
  );
}

window.ValuePropsSection = ValuePropsSection;

export default ValuePropsSection;
