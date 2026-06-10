// ═════════════════════════════════════════════════════════
// CURRICULUM SECTION — Real coffee education showcase
// Two-column: left (copy + tags + badge), right (lesson cards)
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import { Eyebrow, Tag, LessonCard } from './ui-components.jsx';

function CurriculumSection({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const categories = [
    'Espresso fundamentals',
    'Milk science',
    'Brewing',
    'Coffee origins',
    'Sensory'
  ];

  const lessons = [
    { title: 'Dialing in espresso', status: 'complete', progress: 1 },
    { title: 'Milk texture and stretch', status: 'complete', progress: 1 },
    { title: 'Origin and tasting notes', status: 'in-progress', progress: 0.6 },
    { title: 'Sensory and cupping', status: 'locked', progress: 0 }
  ];

  const sectionContainerStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const sectionInnerStyle = {
    ...containerStyle(),
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 64,
    alignItems: 'center'
  };

  const leftColumnStyle = {
    maxWidth: 480
  };

  const headlineStyle = {
    ...t.h2,
    color: p.textPrimary,
    margin: '0 0 20px 0'
  };

  const bodyStyle = {
    ...t.body,
    color: p.textMuted,
    lineHeight: 1.7,
    margin: '0 0 24px 0'
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  };

  const badgeStyle = {
    ...t.bodySmall,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: p.textMuted,
    marginTop: 8
  };

  const rightColumnStyle = {
    background: p.tagBg,
    borderRadius: 16,
    padding: 24
  };

  return (
    <section style={sectionContainerStyle}>
      <div style={sectionInnerStyle}>
        {/* Left column - Copy and tags */}
        <div style={leftColumnStyle}>
          <Eyebrow style={{ marginBottom: 16 }}>CURRICULUM</Eyebrow>

          <h2 style={headlineStyle}>
            Real coffee education, in bite-sized lessons.
          </h2>

          <p style={bodyStyle}>
            Copi carries staff past grind, pull, and steam into origin,
            extraction, milk, and sensory skill. It is structured on the SCA
            Coffee Skills framework, the recognized barista standard, and
            delivered the way Duolingo teaches a language, so the knowledge
            actually gets finished.
          </p>

          <div style={tagsContainerStyle}>
            {categories.map((category, i) => (
              <Tag key={i}>{category}</Tag>
            ))}
          </div>

          <div style={badgeStyle}>
            <span>⊙</span>
            <span>Built on the SCA Coffee Skills framework</span>
          </div>
        </div>

        {/* Right column - Lesson cards */}
        <div style={rightColumnStyle}>
          {lessons.map((lesson, i) => (
            <LessonCard
              key={i}
              title={lesson.title}
              status={lesson.status}
              progress={lesson.progress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Export to window
window.CurriculumSection = CurriculumSection;

export default CurriculumSection;
