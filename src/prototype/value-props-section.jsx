// ═════════════════════════════════════════════════════════
// VALUE PROPS SECTION — Key benefits of using Copi
// Eyebrow + h2 + 3-column card grid with icons
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, SPACING } from './design-system.jsx';
import { Eyebrow, Card } from './ui-components.jsx';

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
    ...sectionStyle(),
    background: p.bg
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.cardGap,
    textAlign: 'left'
  };

  return (
    <section style={sectionContainerStyle}>
      <div style={sectionInnerStyle}>
        <Eyebrow style={{ marginBottom: 16 }}>
          WHAT COPI GIVES YOU
        </Eyebrow>

        <h2 style={headlineStyle}>
          A trained team without you in the room.
        </h2>

        <div style={gridStyle}>
          {valueProps.map((prop, i) => (
            <Card
              key={i}
              icon={prop.icon}
              title={prop.title}
            >
              {prop.description}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Export to window
window.ValuePropsSection = ValuePropsSection;

export default ValuePropsSection;
