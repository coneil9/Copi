// ═════════════════════════════════════════════════════════
// PROBLEM SECTION — The current state of cafe training
// Eyebrow + h2 + quote pills + body paragraph
// Cream background (separates from parchment hero above).
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import { Eyebrow } from './ui-components.jsx';
import { Reveal, Highlight } from './animations.jsx';

function ProblemSection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const quotes = [
    "It's all in my head.",
    "I don't have time to train.",
    "Sink or swim.",
    "I repeat myself every six weeks.",
    "Inconsistent across shifts."
  ];

  const sectionContainerStyle = {
    ...sectionStyle({ paddingTop: 100, paddingBottom: 100 }),
    background: 'var(--copi-cream)',
    position: 'relative'
  };

  const sectionInnerStyle = {
    ...containerStyle(),
    maxWidth: 800,
    textAlign: 'center'
  };

  const headlineStyle = {
    ...t.h2,
    color: p.textPrimary,
    margin: '0 0 32px 0'
  };

  const quotesContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 32
  };

  const quoteStyle = {
    ...t.bodySmall,
    padding: '10px 18px',
    borderRadius: 999,
    background: p.bgCard,
    border: `1.5px solid ${p.tagBorder}`,
    color: p.textMuted,
    fontStyle: 'italic'
  };

  const bodyStyle = {
    ...t.body,
    color: p.textMuted,
    lineHeight: 1.7,
    margin: 0
  };

  return (
    <section style={sectionContainerStyle}>
      <div style={sectionInnerStyle}>
        <Reveal variant="fade-up">
          <Eyebrow style={{ marginBottom: 16 }}>
            THE WAY IT WORKS TODAY
          </Eyebrow>
        </Reveal>

        <Reveal variant="fade-up" delay={60}>
          <h2 style={headlineStyle}>
            Most cafes train by <Highlight>memory</Highlight>, and it walks out the door.
          </h2>
        </Reveal>

        <div style={quotesContainerStyle}>
          {quotes.map((quote, i) => (
            <Reveal key={i} variant="slide-up" delay={120 + i * 70} duration={320}>
              <div style={quoteStyle}>
                "{quote}"
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade-up" delay={120 + quotes.length * 70}>
          <p style={bodyStyle}>
            A binder, a Google Doc, and a senior barista to shadow. It rarely
            sticks, it never scales, and it tracks nothing. Every time someone
            leaves, the knowledge leaves with them, and you start over on the
            next hire.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

window.ProblemSection = ProblemSection;

export default ProblemSection;
