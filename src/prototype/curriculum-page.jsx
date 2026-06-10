// ═════════════════════════════════════════════════════════
// CURRICULUM PAGE — Redesigned to match new Figma aesthetic
// Clean, modern layout with warm cream background and forest green accents
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, RADIUS } from './design-system.jsx';
import NavNew from './nav-new.jsx';
import FooterNew from './footer-new.jsx';
import { Button, Eyebrow, Tag } from './ui-components.jsx';

function CurriculumPage({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const tracks = [
    {
      vol: 'VOL I',
      name: 'History of coffee',
      tag: 'Origins, trade routes, lineage',
      description: 'From Ethiopian highlands to the third-wave roaster — why what\'s in the hopper got there.',
      lessons: 9,
      time: '2h 14m',
      certification: 'Foundations'
    },
    {
      vol: 'VOL II',
      name: 'Processing methods',
      tag: 'Washed, natural, honey, anaerobic',
      description: 'How the cherry becomes the bean — and how every choice on the farm shows up in the cup.',
      lessons: 7,
      time: '1h 48m',
      certification: 'Foundations'
    },
    {
      vol: 'VOL III',
      name: 'Barista knowledge',
      tag: 'On bar, every shift, every drink',
      description: 'The on-bar craft, drilled with manager sign-off. Grind, dial, pull, steam, pour, recover.',
      lessons: 12,
      time: '3h 26m',
      certification: 'Bar certified'
    }
  ];

  const pageStyle = {
    minHeight: '100vh',
    background: p.bg
  };

  const headerSectionStyle = {
    ...sectionStyle({ paddingTop: 80, paddingBottom: 64 }),
    background: p.bg,
    textAlign: 'center'
  };

  const headerInnerStyle = {
    ...containerStyle(),
    maxWidth: 800
  };

  const headlineStyle = {
    ...t.h1,
    color: p.textPrimary,
    margin: '0 0 20px 0',
    fontSize: 64
  };

  const subheadStyle = {
    ...t.bodyLarge,
    color: p.textMuted,
    margin: 0,
    lineHeight: 1.6
  };

  const volumesContainerStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const volumesInnerStyle = {
    ...containerStyle(),
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  };

  const volumeCardStyle = (index) => ({
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 40,
    display: 'grid',
    gridTemplateColumns: '200px 1fr 280px',
    gap: 40,
    alignItems: 'center',
    position: 'relative'
  });

  const volumeNumStyle = {
    ...t.display,
    fontSize: 120,
    lineHeight: 1,
    color: p.accent,
    fontStyle: 'italic',
    opacity: 0.15,
    position: 'absolute',
    left: 20,
    top: 20,
    fontWeight: 400
  };

  const volumeLabelStyle = {
    ...t.eyebrow,
    color: p.textMuted,
    marginBottom: 12
  };

  const volumeTitleStyle = {
    ...t.h2,
    fontSize: 36,
    color: p.textPrimary,
    margin: '0 0 8px 0'
  };

  const volumeTagStyle = {
    ...t.body,
    fontSize: 15,
    fontStyle: 'italic',
    color: p.textMuted,
    margin: '0 0 16px 0'
  };

  const volumeDescStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    lineHeight: 1.6,
    margin: 0
  };

  const metaListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 0,
    margin: 0,
    listStyle: 'none'
  };

  const metaItemStyle = {
    ...t.bodySmall,
    color: p.textPrimary,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottom: `1px solid ${p.tagBorder}`
  };

  const metaLabelStyle = {
    color: p.textMuted
  };

  return (
    <div style={pageStyle}>
      <NavNew theme={{ palette: p, typography: t }} />

      {/* Header */}
      <section style={headerSectionStyle}>
        <div style={headerInnerStyle}>
          <Eyebrow style={{ marginBottom: 16 }}>THE CURRICULUM</Eyebrow>

          <h1 style={headlineStyle}>
            From the cherry to the cup.
          </h1>

          <p style={subheadStyle}>
            Three volumes, signed off by working baristas and Q-graders. Every entry ends in a hands-on drill with a calibrated rubric.
          </p>
        </div>
      </section>

      {/* Volumes */}
      <section style={volumesContainerStyle}>
        <div style={volumesInnerStyle}>
          {tracks.map((track, i) => (
            <article key={i} style={volumeCardStyle(i)}>
              <div style={volumeNumStyle}>0{i + 1}</div>

              {/* Left - Volume info */}
              <div>
                <div style={volumeLabelStyle}>{track.vol}</div>
              </div>

              {/* Middle - Content */}
              <div>
                <h2 style={volumeTitleStyle}>{track.name}</h2>
                <div style={volumeTagStyle}>{track.tag}</div>
                <p style={volumeDescStyle}>{track.description}</p>
              </div>

              {/* Right - Meta + CTA */}
              <div>
                <ul style={metaListStyle}>
                  <li style={metaItemStyle}>
                    <span style={metaLabelStyle}>Lessons</span>
                    <span>{track.lessons}</span>
                  </li>
                  <li style={metaItemStyle}>
                    <span style={metaLabelStyle}>Duration</span>
                    <span>{track.time}</span>
                  </li>
                  <li style={metaItemStyle}>
                    <span style={metaLabelStyle}>Certification</span>
                    <span>{track.certification}</span>
                  </li>
                </ul>

                <Button
                  data-volume-idx={i}
                  style={{ width: '100%', marginTop: 20 }}
                >
                  View volume
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FooterNew theme={{ palette: p, typography: t }} />
    </div>
  );
}

Object.assign(window, { CurriculumPage });
