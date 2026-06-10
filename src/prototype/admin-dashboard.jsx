// ═════════════════════════════════════════════════════════
// ADMIN DASHBOARD — Redesigned to match new Figma aesthetic
// Clean, modern layout with warm cream background and white cards
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, RADIUS, SHADOW } from './design-system.jsx';
import NavNew from './nav-new.jsx';
import FooterNew from './footer-new.jsx';
import { Button, Eyebrow, Tag } from './ui-components.jsx';

function RoasterDashboard({ user = {}, theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const name = user.name || 'Brian';
  const cafe = user.cafe || 'Milano';

  // ── Team data helpers ──────────────────────────────────
  const store = window.useCopiStore();
  const relTime = (ts) => {
    if (!ts) return 'no activity';
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + 'd ago';
  };
  const lastActive = (email) => {
    const u = store.raw().users[email];
    if (!u) return 0;
    let m = 0;
    Object.values(u.lessons).forEach((r) => { if (r.ts > m) m = r.ts; });
    Object.values(u.finals || {}).forEach((r) => { if (r.ts > m) m = r.ts; });
    return m;
  };
  const roman = (num) => ({ '01': 'I', '02': 'II', '03': 'III' }[num] || '—');
  const shortName = (full) => {
    const parts = full.split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : full;
  };

  const team = store.teamSnapshot().map((t) => {
    const cur = store.currentLesson(t.email);
    const ts = lastActive(t.email);
    const hrs = ts ? (Date.now() - ts) / 3600000 : Infinity;
    const status = hrs < 6 ? 'active' : hrs < 72 ? 'studying' : 'paused';
    let pending = false, next = 'All caught up', vol = '—';
    if (cur) {
      vol = roman(cur.vol.num);
      if (cur.isFinal) { pending = true; next = `${cur.vol.name} — final test`; }
      else { next = cur.lesson.title; }
    }
    return {
      name: shortName(t.name),
      role: t.role,
      vol,
      prog: t.prog || t.pct,
      last: relTime(ts),
      next,
      status,
      pending,
      cert: t.cert,
      email: t.email
    };
  });

  const pendingSignoffs = team.filter((t) => t.pending);
  const activeNow = team.filter((t) => t.status === 'active');

  const volumeProgress = store.curriculum.map((v) => {
    const ts = store.teamVolumeStats(v.id);
    return { vol: v.vol, num: v.num, name: v.name, active: ts.inProgress, completed: ts.completed };
  });

  // ── Styles ────────────────────────────────────────────
  const pageStyle = {
    minHeight: '100vh',
    background: p.bg
  };

  const headerSectionStyle = {
    ...sectionStyle({ paddingTop: 80, paddingBottom: 64 }),
    background: p.bg
  };

  const headerInnerStyle = {
    ...containerStyle()
  };

  const greetingStyle = {
    ...t.h1,
    color: p.textPrimary,
    margin: '0 0 16px 0',
    fontSize: 64
  };

  const greetingAccentStyle = {
    fontStyle: 'italic',
    color: p.accent
  };

  const subGreetingStyle = {
    ...t.bodyLarge,
    color: p.textMuted,
    margin: 0
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginTop: 48
  };

  const statCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 32
  };

  const statLabelStyle = {
    ...t.eyebrow,
    color: p.textMuted,
    marginBottom: 16
  };

  const statValueStyle = {
    ...t.display,
    fontSize: 56,
    lineHeight: 1,
    color: p.textPrimary,
    marginBottom: 8
  };

  const statSubStyle = {
    ...t.bodySmall,
    color: p.textMuted
  };

  const teamSectionStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const sectionHeaderStyle = {
    marginBottom: 32
  };

  const sectionTitleStyle = {
    ...t.h2,
    fontSize: 42,
    color: p.textPrimary,
    margin: 0
  };

  const teamCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 40
  };

  const tableHeaderStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 0.5fr 1.2fr 1.8fr 0.7fr',
    gap: 24,
    paddingBottom: 16,
    borderBottom: `1px solid ${p.tagBorder}`,
    marginBottom: 16
  };

  const tableHeaderCellStyle = {
    ...t.eyebrow,
    color: p.textMuted
  };

  const tableRowStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 0.5fr 1.2fr 1.8fr 0.7fr',
    gap: 24,
    padding: '20px 0',
    borderBottom: `1px solid ${p.tagBorder}`,
    alignItems: 'center'
  };

  const memberInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  };

  const avatarStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: p.accent,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...t.body,
    fontSize: 14,
    fontWeight: 600
  };

  const memberNameStyle = {
    ...t.body,
    fontSize: 16,
    fontWeight: 500,
    color: p.textPrimary,
    marginBottom: 4
  };

  const memberRoleStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    fontSize: 13
  };

  const volumeBadgeStyle = {
    ...t.display,
    fontStyle: 'italic',
    fontSize: 24,
    color: p.accent
  };

  const progressContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  };

  const progressBarStyle = {
    height: 8,
    background: p.tagBg,
    borderRadius: 999,
    overflow: 'hidden'
  };

  const progressFillStyle = (prog) => ({
    height: '100%',
    width: `${prog}%`,
    background: p.accent,
    transition: 'width 0.3s ease'
  });

  const progressTextStyle = {
    ...t.bodySmall,
    color: p.textMuted
  };

  const nextLessonStyle = {
    ...t.body,
    fontSize: 15,
    color: p.textPrimary,
    marginBottom: 6
  };

  const statusPillStyle = (status) => {
    const styles = {
      active: { bg: p.accent, color: '#FFFFFF' },
      studying: { bg: p.tagBg, color: p.textPrimary },
      paused: { bg: p.tagBg, color: p.textMuted }
    };
    const s = styles[status] || styles.paused;
    return {
      ...t.eyebrow,
      fontSize: 9,
      padding: '4px 10px',
      borderRadius: RADIUS.pill,
      background: s.bg,
      color: s.color,
      display: 'inline-block'
    };
  };

  const lastActiveStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    textAlign: 'right'
  };

  const volumesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24
  };

  const volumeCardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 32
  };

  const volumeHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12
  };

  const volumeLabelStyle = {
    ...t.eyebrow,
    color: p.textMuted
  };

  const volumeNumStyle = {
    ...t.display,
    fontStyle: 'italic',
    fontSize: 64,
    lineHeight: 1,
    color: p.accent,
    opacity: 0.2
  };

  const volumeNameStyle = {
    ...t.h3,
    fontSize: 28,
    color: p.textPrimary,
    margin: '0 0 24px 0'
  };

  const volumeStatsBarStyle = {
    display: 'flex',
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    background: p.tagBg,
    marginBottom: 12
  };

  const completedSegmentStyle = (width) => ({
    width: `${width}%`,
    background: p.accent
  });

  const activeSegmentStyle = (width) => ({
    width: `${width}%`,
    background: p.progress
  });

  const volumeStatsTextStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    display: 'flex',
    justifyContent: 'space-between'
  };

  const signoffsSectionStyle = {
    ...sectionStyle(),
    background: p.bgCard,
    borderTop: `1px solid ${p.tagBorder}`,
    borderBottom: `1px solid ${p.tagBorder}`
  };

  const signoffsInnerStyle = {
    ...containerStyle()
  };

  const signoffCardStyle = {
    background: p.bg,
    borderRadius: RADIUS.card,
    border: `1px solid ${p.tagBorder}`,
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24
  };

  const signoffInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flex: 1
  };

  const signoffTextStyle = {
    ...t.body,
    fontSize: 16,
    color: p.textPrimary,
    marginBottom: 4
  };

  const signoffMetaStyle = {
    ...t.bodySmall,
    color: p.textMuted
  };

  // Helper to get initials
  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={pageStyle}>
      <NavNew theme={{ palette: p, typography: t }} />

      {/* Header with greeting and stats */}
      <section style={headerSectionStyle}>
        <div style={headerInnerStyle}>
          <Eyebrow style={{ marginBottom: 16 }}>ADMIN DASHBOARD</Eyebrow>

          <h1 style={greetingStyle}>
            Good morning, <span style={greetingAccentStyle}>{name}.</span>
          </h1>

          <p style={subGreetingStyle}>
            Here's what's happening with your team at {cafe} today.
          </p>

          {/* Stats cards */}
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Active Baristas</div>
              <div style={statValueStyle}>{store.team.length}</div>
              <div style={statSubStyle}>on Copi</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Lessons / Week</div>
              <div style={statValueStyle}>{store.lessonsThisWeek()}</div>
              <div style={statSubStyle}>last 7 days</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Ready to Certify</div>
              <div style={statValueStyle}>{pendingSignoffs.length}</div>
              <div style={statSubStyle}>awaiting sign-off</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Team Completion</div>
              <div style={statValueStyle}>{Math.round(store.teamCompletion() * 100)}%</div>
              <div style={statSubStyle}>assigned volumes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pending sign-offs (if any) */}
      {pendingSignoffs.length > 0 && (
        <section style={signoffsSectionStyle}>
          <div style={signoffsInnerStyle}>
            <div style={sectionHeaderStyle}>
              <Eyebrow style={{ marginBottom: 16, color: p.accent }}>AWAITING SIGN-OFF</Eyebrow>
              <h2 style={sectionTitleStyle}>
                {pendingSignoffs.length} {pendingSignoffs.length === 1 ? 'barista is' : 'baristas are'} ready for certification
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pendingSignoffs.map((member, i) => (
                <div key={i} style={signoffCardStyle}>
                  <div style={signoffInfoStyle}>
                    <div style={avatarStyle}>{getInitials(member.name)}</div>
                    <div>
                      <div style={signoffTextStyle}>
                        {member.name} — {member.next}
                      </div>
                      <div style={signoffMetaStyle}>
                        Vol. {member.vol} · Last active {member.last}
                      </div>
                    </div>
                  </div>
                  <Button variant="primary" style={{ whiteSpace: 'nowrap' }}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team table */}
      <section style={teamSectionStyle}>
        <div style={headerInnerStyle}>
          <div style={sectionHeaderStyle}>
            <Eyebrow style={{ marginBottom: 16 }}>YOUR TEAM</Eyebrow>
            <h2 style={sectionTitleStyle}>
              {team.length} {team.length === 1 ? 'barista' : 'baristas'} on the floor
            </h2>
          </div>

          <div style={teamCardStyle}>
            <div style={tableHeaderStyle}>
              <div style={tableHeaderCellStyle}>Barista</div>
              <div style={tableHeaderCellStyle}>Vol.</div>
              <div style={tableHeaderCellStyle}>Progress</div>
              <div style={tableHeaderCellStyle}>Next Entry</div>
              <div style={{ ...tableHeaderCellStyle, textAlign: 'right' }}>Last Active</div>
            </div>

            {team.map((member, i) => (
              <div key={i} style={tableRowStyle}>
                {/* Barista info */}
                <div style={memberInfoStyle}>
                  <div style={avatarStyle}>{getInitials(member.name)}</div>
                  <div>
                    <div style={memberNameStyle}>{member.name}</div>
                    <div style={memberRoleStyle}>{member.role}</div>
                  </div>
                </div>

                {/* Volume */}
                <div style={volumeBadgeStyle}>{member.vol}</div>

                {/* Progress */}
                <div style={progressContainerStyle}>
                  <div style={progressBarStyle}>
                    <div style={progressFillStyle(member.prog)} />
                  </div>
                  <div style={progressTextStyle}>{member.prog}% · {member.cert}</div>
                </div>

                {/* Next lesson */}
                <div>
                  <div style={nextLessonStyle}>{member.next}</div>
                  <span style={statusPillStyle(member.status)}>
                    {member.status.toUpperCase()}
                  </span>
                </div>

                {/* Last active */}
                <div style={lastActiveStyle}>{member.last}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volume progress */}
      <section style={teamSectionStyle}>
        <div style={headerInnerStyle}>
          <div style={sectionHeaderStyle}>
            <Eyebrow style={{ marginBottom: 16 }}>CURRICULUM</Eyebrow>
            <h2 style={sectionTitleStyle}>Volume progress across your team</h2>
          </div>

          <div style={volumesGridStyle}>
            {volumeProgress.map((volume, i) => {
              const total = 6; // Total team members
              const completedPct = (volume.completed / total) * 100;
              const activePct = (volume.active / total) * 100;

              return (
                <div key={i} style={volumeCardStyle}>
                  <div style={volumeHeaderStyle}>
                    <div style={volumeLabelStyle}>{volume.vol}</div>
                    <div style={volumeNumStyle}>{volume.num}</div>
                  </div>

                  <h3 style={volumeNameStyle}>{volume.name}</h3>

                  <div style={volumeStatsBarStyle}>
                    <div style={completedSegmentStyle(completedPct)} />
                    <div style={activeSegmentStyle(activePct)} />
                  </div>

                  <div style={volumeStatsTextStyle}>
                    <span>{volume.completed} completed</span>
                    <span>{volume.active} in progress</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterNew theme={{ palette: p, typography: t }} />
    </div>
  );
}

Object.assign(window, { RoasterDashboard });
