// ═════════════════════════════════════════════════════════
// BARISTA DASHBOARD — Redesigned to match new Figma aesthetic
// Clean, modern layout showing current lesson and volume progress
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, RADIUS } from './design-system.jsx';
import NavNew from './nav-new.jsx';
import FooterNew from './footer-new.jsx';
import { Button, Eyebrow } from './ui-components.jsx';

function BaristaDashboard({ user = {}, theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const store = window.useCopiStore();
  const email = user.email || 'lili@milano.coffee';
  const name = (user.name || 'Lili').split(' ')[0];
  const fullName = user.name || 'Lili';

  const assignedVols = store.assignedVolumes(email);
  const current = store.currentLesson(email);
  const overall = Math.round(store.overallPct(email) * 100);

  // this week stats
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const raw = store.raw().users[email] || { lessons: {}, finals: {} };
  const thisWeek = Object.values(raw.lessons).filter((r) => r.done && r.ts >= weekAgo).length;
  const badges = ['vol-1', 'vol-2', 'vol-3'].filter((v) => store.volumeStats(email, v).certified).length;

  const act = window.CopiActions || {};

  // The volume that holds the current action
  const focusVol = current ? current.vol : assignedVols[0] || null;

  const openCurrent = () => {
    if (!current) return;
    if (current.isFinal) act.openFinal && act.openFinal(current.vol.id);
    else act.openLesson && act.openLesson(current.vol.id, current.lesson.id);
  };

  // Helper to get initials
  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // ── Styles ────────────────────────────────────────────
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
    maxWidth: 700
  };

  const greetingStyle = {
    ...t.h1,
    color: p.textPrimary,
    margin: '0 0 16px 0',
    fontSize: 56
  };

  const greetingAccentStyle = {
    fontStyle: 'italic',
    color: p.accent
  };

  const subGreetingStyle = {
    ...t.bodyLarge,
    color: p.textMuted,
    fontStyle: 'italic',
    margin: 0
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 40
  };

  const statCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 24,
    textAlign: 'center'
  };

  const statValueStyle = {
    ...t.display,
    fontStyle: 'italic',
    fontSize: 48,
    lineHeight: 1,
    color: p.accent,
    marginBottom: 8
  };

  const statLabelStyle = {
    ...t.eyebrow,
    color: p.textMuted,
    fontSize: 9
  };

  const currentSectionStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const currentInnerStyle = {
    ...containerStyle(),
    maxWidth: 800
  };

  const currentCardStyle = {
    background: p.accent,
    color: p.textOnDark,
    borderRadius: RADIUS.card,
    padding: 48,
    border: `1px solid ${p.accentHover}`,
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  };

  const currentEyebrowStyle = {
    ...t.eyebrow,
    color: p.textOnDark,
    opacity: 0.8,
    marginBottom: 24
  };

  const currentTitleStyle = {
    ...t.display,
    fontSize: 56,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    color: p.textOnDark,
    marginBottom: 32
  };

  const currentFooterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const currentStatsStyle = {
    ...t.bodySmall,
    color: p.textOnDark,
    opacity: 0.9
  };

  const emptyCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 48,
    textAlign: 'center'
  };

  const emptyTitleStyle = {
    ...t.display,
    fontSize: 42,
    lineHeight: 1.2,
    color: p.textPrimary,
    marginBottom: 16
  };

  const emptyBodyStyle = {
    ...t.body,
    color: p.textMuted,
    fontSize: 17
  };

  const volumeSectionStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const volumeInnerStyle = {
    ...containerStyle(),
    maxWidth: 800
  };

  const volumeHeaderStyle = {
    textAlign: 'center',
    marginBottom: 32
  };

  const volumeTitleStyle = {
    ...t.h2,
    fontSize: 36,
    color: p.textPrimary,
    margin: '0 0 12px 0'
  };

  const volumeSubtitleStyle = {
    ...t.body,
    color: p.textMuted,
    fontStyle: 'italic'
  };

  const lessonsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  };

  const lessonCardStyle = (status) => ({
    background: status === 'current' ? p.bgCard : 'transparent',
    border: status === 'current' ? `2px solid ${p.accent}` : `1px solid ${p.tagBorder}`,
    borderRadius: RADIUS.card,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: status === 'locked' ? 'not-allowed' : 'pointer',
    opacity: status === 'locked' ? 0.5 : 1,
    transition: 'all 0.2s ease'
  });

  const lessonIconStyle = (status) => {
    const isDone = status === 'done';
    const isCurrent = status === 'current';

    return {
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: isDone ? p.accent : isCurrent ? p.progress : p.tagBg,
      color: isDone ? '#FFFFFF' : p.textPrimary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...t.display,
      fontStyle: 'italic',
      fontSize: 20,
      flexShrink: 0
    };
  };

  const lessonInfoStyle = {
    flex: 1,
    minWidth: 0
  };

  const lessonTitleStyle = {
    ...t.body,
    fontSize: 18,
    fontWeight: 500,
    color: p.textPrimary,
    marginBottom: 4
  };

  const lessonMetaStyle = {
    ...t.eyebrow,
    fontSize: 9,
    color: p.textMuted
  };

  const lessonActionStyle = {
    ...t.eyebrow,
    fontSize: 10,
    color: p.accent
  };

  const finalCardStyle = (status) => ({
    background: status === 'current' ? p.bgCard : 'transparent',
    border: status === 'current' ? `2px solid ${p.accent}` : `1px dashed ${p.tagBorder}`,
    borderRadius: RADIUS.card,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: status === 'locked' ? 'not-allowed' : 'pointer',
    opacity: status === 'locked' ? 0.5 : 1,
    marginTop: 8
  });

  return (
    <div style={pageStyle}>
      <NavNew theme={{ palette: p, typography: t }} />

      {/* Header with greeting and stats */}
      <section style={headerSectionStyle}>
        <div style={headerInnerStyle}>
          <h1 style={greetingStyle}>
            Hi <span style={greetingAccentStyle}>{name}</span> —
          </h1>

          <p style={subGreetingStyle}>
            {current
              ? 'ready to pick up where you left off?'
              : assignedVols.length
                ? 'you're all caught up.'
                : 'nothing assigned yet.'}
          </p>

          {/* Stats */}
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{overall}%</div>
              <div style={statLabelStyle}>Overall</div>
            </div>

            <div style={statCardStyle}>
              <div style={statValueStyle}>{thisWeek}</div>
              <div style={statLabelStyle}>Lessons This Week</div>
            </div>

            <div style={statCardStyle}>
              <div style={statValueStyle}>{badges}</div>
              <div style={statLabelStyle}>Badges Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current lesson card */}
      <section style={currentSectionStyle}>
        <div style={currentInnerStyle}>
          {current ? (
            <div style={currentCardStyle} onClick={openCurrent}>
              <div style={currentEyebrowStyle}>
                {current.isFinal
                  ? `${current.vol.vol} · FINAL TEST · EARN ${current.vol.cert.toUpperCase()}`
                  : `${current.vol.vol} · LESSON ${current.lesson.num} · ${current.lesson.minutes} MIN`}
              </div>

              <h2 style={currentTitleStyle}>
                {current.isFinal
                  ? `${current.vol.name} — final test.`
                  : `${current.lesson.title}.`}
              </h2>

              <div style={currentFooterStyle}>
                <div style={currentStatsStyle}>
                  {(() => {
                    const s = store.volumeStats(email, current.vol.id);
                    return `${s.done} of ${s.total} lessons done in this volume`;
                  })()}
                </div>
                <Button
                  variant="cta"
                  style={{
                    background: p.bgCard,
                    color: p.accent
                  }}
                >
                  {current.isFinal ? 'Take the test' : 'Start lesson'} →
                </Button>
              </div>
            </div>
          ) : (
            <div style={emptyCardStyle}>
              <Eyebrow style={{ marginBottom: 16, color: p.accent }}>
                {assignedVols.length ? 'ALL CAUGHT UP' : 'WAITING ON YOUR MANAGER'}
              </Eyebrow>

              <h2 style={emptyTitleStyle}>
                {assignedVols.length
                  ? <React.Fragment>You've finished everything <span style={greetingAccentStyle}>assigned.</span></React.Fragment>
                  : <React.Fragment>No volumes <span style={greetingAccentStyle}>yet.</span></React.Fragment>}
              </h2>

              <p style={emptyBodyStyle}>
                {assignedVols.length
                  ? 'Nicely done. Your manager will assign the next volume soon.'
                  : 'Once your manager assigns a volume, it'll show up right here.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Volume path */}
      {focusVol && (
        <section style={volumeSectionStyle}>
          <div style={volumeInnerStyle}>
            <div style={volumeHeaderStyle}>
              <Eyebrow style={{ marginBottom: 12, color: p.accent }}>
                {focusVol.vol} · {focusVol.name.toUpperCase()}
              </Eyebrow>
              <h2 style={volumeTitleStyle}>Your learning path</h2>
              <p style={volumeSubtitleStyle}>
                {focusVol.lessons.length} lessons, then a final test for your {focusVol.cert} badge.
              </p>
            </div>

            <div style={lessonsListStyle}>
              {/* Lessons */}
              {focusVol.lessons.map((lesson, i) => {
                const status = store.lessonStatus(email, focusVol.id, i);
                const isDone = status === 'done';
                const isCurrent = status === 'current';
                const isLocked = status === 'locked';

                return (
                  <div
                    key={lesson.id}
                    style={lessonCardStyle(status)}
                    onClick={() => { if (!isLocked) act.openLesson && act.openLesson(focusVol.id, lesson.id); }}
                  >
                    <div style={lessonIconStyle(status)}>
                      {isDone ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      ) : isLocked ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="11" width="14" height="10" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                      ) : (
                        lesson.num
                      )}
                    </div>

                    <div style={lessonInfoStyle}>
                      <div style={lessonTitleStyle}>{lesson.title}</div>
                      <div style={lessonMetaStyle}>
                        {isDone ? 'COMPLETE' : isCurrent ? 'UP NEXT · TAP TO START' : `LESSON ${lesson.num} · LOCKED`}
                      </div>
                    </div>

                    {!isLocked && (
                      <div style={lessonActionStyle}>
                        {isDone ? 'REVIEW' : 'START'} →
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Final test */}
              {(() => {
                const fstat = store.finalStatus(email, focusVol.id);
                const fdone = fstat === 'done';
                const fcurrent = fstat === 'current';
                const flocked = fstat === 'locked';

                return (
                  <div
                    style={finalCardStyle(fstat)}
                    onClick={() => { if (!flocked) act.openFinal && act.openFinal(focusVol.id); }}
                  >
                    <div style={lessonIconStyle(fstat)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M9 13l-2 8 5-3 5 3-2-8" />
                      </svg>
                    </div>

                    <div style={lessonInfoStyle}>
                      <div style={lessonTitleStyle}>Final test — {focusVol.cert}</div>
                      <div style={lessonMetaStyle}>
                        {fdone ? 'CERTIFIED' : fcurrent ? 'READY · TAP TO TAKE IT' : 'FINISH ALL LESSONS TO UNLOCK'}
                      </div>
                    </div>

                    {!flocked && (
                      <div style={lessonActionStyle}>
                        {fdone ? 'PASSED' : 'TAKE'} →
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      <FooterNew theme={{ palette: p, typography: t }} />
    </div>
  );
}

Object.assign(window, { BaristaDashboard });
