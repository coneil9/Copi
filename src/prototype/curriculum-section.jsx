// ═════════════════════════════════════════════════════════
// CURRICULUM SECTION — Real coffee education showcase
// Cream bg (alternates with the parchment HowItWorks above).
// Two-column: left (copy + tags + badge), right (lesson cards).
// Lessons stagger from the right; in-progress bar counts up to 60%.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';
import { Eyebrow, Tag, LessonCard } from './ui-components.jsx';
import { Reveal, Highlight, useInView, useReducedMotion } from './animations.jsx';

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

  // Right column comes into view → in-progress lesson progress animates from 0 to 0.6
  const reduced = useReducedMotion();
  const [rightRef, rightInView] = useInView({ threshold: 0.3, once: true });
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (!rightInView) return;
    if (reduced) { setProgress(0.6); return; }
    let raf;
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const tt = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - tt, 3);
      setProgress(0.6 * eased);
      if (tt < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rightInView, reduced]);

  const lessons = [
    { title: 'Dialing in espresso', status: 'complete', progress: 1 },
    { title: 'Milk texture and stretch', status: 'complete', progress: 1 },
    { title: 'Origin and tasting notes', status: 'in-progress', progress },
    { title: 'Sensory and cupping', status: 'locked', progress: 0 }
  ];

  const sectionContainerStyle = {
    ...sectionStyle({ paddingTop: 120, paddingBottom: 120 }),
    background: 'var(--copi-cream)',
    position: 'relative'
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
    background: p.bgCard,
    borderRadius: 16,
    padding: 24,
    border: `1px solid ${p.tagBorder}`
  };

  return (
    <section style={sectionContainerStyle}>
      <div style={sectionInnerStyle}>
        {/* Left column - Copy and tags */}
        <div style={leftColumnStyle}>
          <Reveal variant="slide-right">
            <Eyebrow style={{ marginBottom: 16 }}>CURRICULUM</Eyebrow>
            <h2 style={headlineStyle}>
              Real coffee education, in <Highlight>bite-sized</Highlight> lessons.
            </h2>
          </Reveal>

          <Reveal variant="fade-up" delay={120}>
            <p style={bodyStyle}>
              Copi carries staff past grind, pull, and steam into origin,
              extraction, milk, and sensory skill. It is structured on the SCA
              Coffee Skills framework, the recognized barista standard, and
              delivered the way Duolingo teaches a language, so the knowledge
              actually gets finished.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={180}>
            <div style={tagsContainerStyle}>
              {categories.map((category, i) => (
                <Tag key={i}>{category}</Tag>
              ))}
            </div>

            <div style={badgeStyle}>
              <span>⊙</span>
              <span>Built on the SCA Coffee Skills framework</span>
            </div>
          </Reveal>
        </div>

        {/* Right column - Lesson cards (each staggers in) */}
        <div ref={rightRef} style={rightColumnStyle}>
          {lessons.map((lesson, i) => (
            <Reveal key={i} variant="slide-left" delay={120 + i * 90} duration={360}>
              <LessonCard
                title={lesson.title}
                status={lesson.status}
                progress={lesson.progress}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

window.CurriculumSection = CurriculumSection;

export default CurriculumSection;
