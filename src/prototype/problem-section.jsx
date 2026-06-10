// ═════════════════════════════════════════════════════════
// PROBLEM SECTION — The current state of cafe training
// Eyebrow + h2 + quote pills + body paragraph
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import { Eyebrow, Tag } from './ui-components.jsx';

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
    ...sectionStyle(),
    background: p.bg
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
    background: 'transparent',
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
        <Eyebrow style={{ marginBottom: 16 }}>
          THE WAY IT WORKS TODAY
        </Eyebrow>

        <h2 style={headlineStyle}>
          Most cafes train by memory, and it walks out the door.
        </h2>

        <div style={quotesContainerStyle}>
          {quotes.map((quote, i) => (
            <div key={i} style={quoteStyle}>
              "{quote}"
            </div>
          ))}
        </div>

        <p style={bodyStyle}>
          A binder, a Google Doc, and a senior barista to shadow. It rarely
          sticks, it never scales, and it tracks nothing. Every time someone
          leaves, the knowledge leaves with them, and you start over on the
          next hire.
        </p>
      </div>
    </section>
  );
}

// Export to window
window.ProblemSection = ProblemSection;

export default ProblemSection;
