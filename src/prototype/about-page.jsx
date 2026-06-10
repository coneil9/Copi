// ═════════════════════════════════════════════════════════
// ABOUT PAGE — Redesigned to match new Figma aesthetic
// Clean, modern layout showcasing team and principles
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, RADIUS } from './design-system.jsx';
import NavNew from './nav-new.jsx';
import FooterNew from './footer-new.jsx';
import { Eyebrow } from './ui-components.jsx';

function AboutPage({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  // Team members
  const RES = (id, path) => (window.__resources && window.__resources[id]) || path;
  const editors = [
    {
      initials: 'OM',
      name: 'Owen McRann',
      role: 'Copi CEO',
      src: RES('owenPortrait', 'uploads/owen-mcrann-portrait.png'),
      bio: 'Green coffee importer. Founder of AIS, sourcing direct from Indonesian origins. 5 years in specialty coffee trade.'
    },
    {
      initials: 'MA',
      name: 'Miguel Arte',
      role: 'Curriculum Lead',
      src: RES('miguelPortrait', 'uploads/miguel-arte-portrait.png'),
      bio: '10 years across origin, roasting, and bar. Coffee grower, importer, roaster, and working barista.'
    }
  ];

  // Principles
  const principles = [
    { num: '01', title: 'Education for everyone', description: 'Coffee knowledge shouldn\'t sit behind a $1,500 course or a senior title. Everyone working in the industry deserves a real education, regardless of their role or what they can afford.' },
    { num: '02', title: 'Built around your level', description: 'No two employees start in the same place. Copi adapts to where each person is, what their role requires, and what their team actually needs to know.' },
    { num: '03', title: 'Quality lives in every role', description: 'Your reputation isn\'t built by your best barista alone. It\'s carried by everyone on the floor, from the front bar to the back of house. Every person needs to know their part.' },
    { num: '04', title: 'Managers deserve breathing room', description: 'The industry is demanding and managers carry most of that weight. Copi handles structured training so they can focus on running the business, not repeating themselves every six weeks.' },
    { num: '05', title: 'Built by people who\'ve done it', description: 'Every module is designed by certified Q-graders, working baristas, roasters, and importers — people who have worked every side of the industry, not just written about it.' },
    { num: '06', title: 'Learning never stops', description: 'The coffee industry evolves constantly. Education shouldn\'t have a finish line. Copi is built to grow with your team as the industry grows around you.' }
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
    margin: '0 0 24px 0',
    fontSize: 64
  };

  const subheadStyle = {
    ...t.bodyLarge,
    color: p.textMuted,
    margin: 0,
    lineHeight: 1.7,
    maxWidth: 680,
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const teamSectionStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const teamInnerStyle = {
    ...containerStyle(),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 32
  };

  const teamCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 32,
    display: 'flex',
    gap: 24
  };

  const portraitStyle = {
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: p.tagBg,
    flexShrink: 0,
    overflow: 'hidden',
    border: `2px solid ${p.accent}`
  };

  const portraitImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const portraitPlaceholderStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...t.display,
    fontSize: 36,
    fontStyle: 'italic',
    color: p.accent
  };

  const teamInfoStyle = {
    flex: 1
  };

  const teamNameStyle = {
    ...t.h3,
    fontSize: 24,
    color: p.textPrimary,
    margin: '0 0 4px 0'
  };

  const teamRoleStyle = {
    ...t.eyebrow,
    color: p.textMuted,
    marginBottom: 16
  };

  const teamBioStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    lineHeight: 1.6,
    margin: 0
  };

  const principlesSectionStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const principlesInnerStyle = {
    ...containerStyle()
  };

  const principlesTitleStyle = {
    ...t.h2,
    fontSize: 42,
    color: p.textPrimary,
    textAlign: 'center',
    margin: '0 0 48px 0'
  };

  const principlesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24
  };

  const principleCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 32
  };

  const principleNumStyle = {
    ...t.display,
    fontSize: 48,
    lineHeight: 1,
    color: p.accent,
    opacity: 0.3,
    marginBottom: 16
  };

  const principleTitleStyle = {
    ...t.body,
    fontSize: 18,
    fontWeight: 600,
    color: p.textPrimary,
    margin: '0 0 12px 0'
  };

  const principleDescStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    lineHeight: 1.6,
    margin: 0
  };

  return (
    <div style={pageStyle}>
      <NavNew theme={{ palette: p, typography: t }} />

      {/* Header */}
      <section style={headerSectionStyle}>
        <div style={headerInnerStyle}>
          <Eyebrow style={{ marginBottom: 16 }}>ABOUT COPI</Eyebrow>

          <h1 style={headlineStyle}>
            Built by people who've done it.
          </h1>

          <p style={subheadStyle}>
            We believe everyone in coffee deserves a real education — not passed-down knowledge from whoever was on shift. Every module is designed by certified Q-graders, working baristas, roasters, and importers.
          </p>
        </div>
      </section>

      {/* Team */}
      <section style={teamSectionStyle}>
        <div style={{ ...containerStyle(), marginBottom: 48 }}>
          <Eyebrow style={{ textAlign: 'center', marginBottom: 16 }}>THE TEAM</Eyebrow>
          <h2 style={{ ...t.h2, fontSize: 36, color: p.textPrimary, textAlign: 'center', margin: 0 }}>
            Meet the editors
          </h2>
        </div>

        <div style={teamInnerStyle}>
          {editors.map((editor, i) => (
            <div key={i} style={teamCardStyle}>
              <div style={portraitStyle}>
                {editor.src ? (
                  <img src={editor.src} alt={editor.name} style={portraitImgStyle} />
                ) : (
                  <div style={portraitPlaceholderStyle}>{editor.initials}</div>
                )}
              </div>

              <div style={teamInfoStyle}>
                <h3 style={teamNameStyle}>{editor.name}</h3>
                <div style={teamRoleStyle}>{editor.role}</div>
                <p style={teamBioStyle}>{editor.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section style={principlesSectionStyle}>
        <div style={principlesInnerStyle}>
          <Eyebrow style={{ textAlign: 'center', marginBottom: 16 }}>OUR PRINCIPLES</Eyebrow>
          <h2 style={principlesTitleStyle}>
            What we believe
          </h2>

          <div style={principlesGridStyle}>
            {principles.map((principle, i) => (
              <div key={i} style={principleCardStyle}>
                <div style={principleNumStyle}>{principle.num}</div>
                <h3 style={principleTitleStyle}>{principle.title}</h3>
                <p style={principleDescStyle}>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterNew theme={{ palette: p, typography: t }} />
    </div>
  );
}

Object.assign(window, { AboutPage });
