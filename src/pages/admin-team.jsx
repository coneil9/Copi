// ═════════════════════════════════════════════════════════
// ADMIN TEAM — Roster and Add Teammate, two sub-views.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';
import {
  PageHeader, Card, Avatar, ProgressBar, StatusChip,
  PrimaryButton, SecondaryButton
} from './admin-ui.jsx';

const SEED_ROSTER = [
  { id: 'r-lili',   name: 'Lili Turko',     position: 'Manager',       email: 'lili@milano.coffee',   onboarding: 100, education: 95,  status: 'Strong' },
  { id: 'r-linda',  name: 'Linda Marchetti', position: 'Owner / Admin', email: 'linda@milano.coffee',  onboarding: 100, education: 100, status: 'Strong' },
  { id: 'r-roman',  name: 'Roman Nguyen',    position: 'Barista',       email: 'roman@milano.coffee',  onboarding: 25,  education: 5,   status: 'At risk' },
  { id: 'r-carter', name: 'Carter Wong',     position: 'Lead Barista',  email: 'carter@milano.coffee', onboarding: 95,  education: 25,  status: 'On track' },
  { id: 'r-owen',   name: 'Owen Park',       position: 'Barista',       email: 'owen@milano.coffee',   onboarding: 35,  education: 4,   status: 'At risk' },
  { id: 'r-juno',   name: 'Juno Tremblay',   position: 'Host',          email: 'juno@milano.coffee',   onboarding: 60,  education: 18,  status: 'Onboarding' },
  { id: 'r-sofia',  name: 'Sofia Almeida',   position: 'Barista',       email: 'sofia@milano.coffee',  onboarding: 80,  education: 42,  status: 'On track' },
  { id: 'r-marco',  name: 'Marco Chen',      position: 'Barista',       email: 'marco@milano.coffee',  onboarding: 100, education: 88,  status: 'Ahead' }
];

const DIFFICULTIES = ['Easy', 'Intermediate', 'Advanced'];

// ── Curriculum content catalogue (display names only) ────
const VOL_LESSONS = {
  I:   [
    'Espresso Origins', 'The Four M\'s', 'Grinder Calibration',
    'Tamping & Distribution', 'Extraction Windows', 'Milk Science',
    'Steaming Technique', 'Drink Assembly', 'Bar Flow & Speed',
  ],
  II:  [
    'Pour-Over Fundamentals', 'Grind Settings for Pour-Over', 'Brew Ratios',
    'Immersion Methods', 'Cold Brew & Nitro', 'Batch Brewing', 'Service Standards',
  ],
  III: [
    'Coffee Origins & Terroir', 'Processing Methods', 'Varietals & Cultivars',
    'Roast Profiles', 'Sensory Evaluation', 'Water Chemistry',
    'Fermentation & Naturals', 'Cupping Protocol', 'Flavor Wheel Deep Dive',
    'Pairing & Menu Development', 'Specialty Certification Prep', 'Final Review',
  ],
};

const MILESTONE_TITLES = [
  'Complete barista orientation',
  'Pull your first espresso shot',
  'Steam milk for a flat white',
  'Shadow a senior barista for one shift',
  'Pass the quiz on cafe standards',
  'Complete first solo opening shift',
  'Earn your Vol. I certification',
];

// ── Deterministic stats from seeded member data ───────────
function buildMemberStats(member) {
  const seedVal = member.id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  const srand = (i) => (((seedVal * 1664525 + i * 22695477) >>> 0) % 100) / 100;

  const V1 = VOL_LESSONS.I.length;
  const V2 = VOL_LESSONS.II.length;
  const V3 = VOL_LESSONS.III.length;
  const totalLessons = V1 + V2 + V3;

  const totalDone = Math.round((member.education / 100) * totalLessons);
  const v1Done = Math.min(V1, totalDone);
  const v2Done = Math.min(V2, Math.max(0, totalDone - V1));
  const v3Done = Math.min(V3, Math.max(0, totalDone - V1 - V2));

  const milestonesDone = Math.round((member.onboarding / 100) * MILESTONE_TITLES.length);
  const milestones = MILESTONE_TITLES.map((title, i) => ({ title, done: i < milestonesDone }));

  const avgScore = member.education > 0
    ? Math.max(60, Math.min(98, Math.round(member.education * 0.88 + srand(7) * 12 + 8)))
    : 0;

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();
  const maxPerDay = member.education > 70 ? 3 : member.education > 30 ? 2 : member.education > 5 ? 1 : 0;
  const weekActivity = DAYS.map((label, i) => ({
    label,
    value: maxPerDay > 0 ? Math.min(4, Math.floor(srand(i) * (maxPerDay + 1))) : 0,
    isToday: i === todayIdx,
  }));

  const recentActivity = [];
  if (v3Done > 0) recentActivity.push({ kind: 'lesson', label: `Completed "${VOL_LESSONS.III[v3Done - 1]}"`, time: '1d ago' });
  if (v2Done === V2) recentActivity.push({ kind: 'cert', label: 'Earned Vol. II Brew Methods certification', time: '3d ago' });
  else if (v2Done > 0) recentActivity.push({ kind: 'lesson', label: `Completed "${VOL_LESSONS.II[v2Done - 1]}"`, time: '2d ago' });
  if (v1Done === V1) recentActivity.push({ kind: 'cert', label: 'Earned Vol. I Espresso Foundations certification', time: '1w ago' });
  else if (v1Done > 0) recentActivity.push({ kind: 'lesson', label: `Completed "${VOL_LESSONS.I[v1Done - 1]}"`, time: `${2 + Math.floor(srand(9) * 4)}d ago` });
  if (milestonesDone > 0) recentActivity.push({ kind: 'milestone', label: `Milestone signed off: "${MILESTONE_TITLES[milestonesDone - 1]}"`, time: `${3 + Math.floor(srand(11) * 4)}d ago` });
  recentActivity.push({ kind: 'system', label: 'Joined and accepted invite', time: '2w ago' });

  let nextLesson = null;
  if (v1Done < V1) nextLesson = { vol: 'I', name: VOL_LESSONS.I[v1Done] };
  else if (v2Done < V2) nextLesson = { vol: 'II', name: VOL_LESSONS.II[v2Done] };
  else if (v3Done < V3) nextLesson = { vol: 'III', name: VOL_LESSONS.III[v3Done] };

  return {
    v1: { done: v1Done, total: V1, certified: v1Done === V1 },
    v2: { done: v2Done, total: V2, certified: v2Done === V2 },
    v3: { done: v3Done, total: V3, certified: v3Done === V3 },
    milestones,
    avgScore,
    weekActivity,
    todayIdx,
    recentActivity,
    lessonsCompleted: totalDone,
    totalLessons,
    nextLesson,
  };
}

// ── Mini stat card (used in Overview tab) ────────────────
function MiniStat({ label, value, sub, color, delay = 0 }) {
  return (
    <div
      className="dash-stagger-item"
      style={{
        '--dash-delay': `${delay}ms`,
        background: 'var(--alabaster)',
        borderRadius: 12,
        padding: '16px 18px',
        border: '1px solid var(--pearl-bush)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--heathered-gray)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: color || 'var(--graphite)', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--roman-coffee)' }}>
        {sub}
      </div>
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────
function OverviewTab({ stats, member }) {
  const mDone = stats.milestones.filter((m) => m.done).length;
  const maxBar = Math.max(...stats.weekActivity.map((d) => d.value), 1);

  const coachNote = {
    'Strong':     `${member.name.split(' ')[0]} is tracking ahead of the team — consider unlocking advanced content or giving them a mentorship role.`,
    'On track':   `${member.name.split(' ')[0]} is progressing steadily at ${member.education}% education. Keep the momentum going.`,
    'Ahead':      `${member.name.split(' ')[0]} is outpacing the team and could be a great resource for newer staff.`,
    'Onboarding': `${member.name.split(' ')[0]} is still in onboarding at ${member.onboarding}%. Follow up on any incomplete milestones.`,
    'At risk':    `${member.name.split(' ')[0]} needs attention — ${member.education}% education and ${member.onboarding}% onboarding. Schedule a check-in soon.`,
    'Watch':      `Activity has slowed for ${member.name.split(' ')[0]}. A quick nudge or 1:1 might help re-engage them.`,
  }[member.status] || `Check in with ${member.name.split(' ')[0]} to see how they are tracking.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <MiniStat
          label="Onboarding"
          value={`${member.onboarding}%`}
          sub={`${mDone} of ${MILESTONE_TITLES.length} milestones`}
          color={member.onboarding === 100 ? 'var(--glade-green-deep)' : member.onboarding >= 60 ? 'var(--roman-coffee)' : 'var(--danger)'}
          delay={0}
        />
        <MiniStat
          label="Education"
          value={`${member.education}%`}
          sub={`${stats.lessonsCompleted} of ${stats.totalLessons} lessons`}
          color={member.education >= 80 ? 'var(--glade-green-deep)' : member.education >= 40 ? 'var(--roman-coffee)' : 'var(--danger)'}
          delay={60}
        />
        <MiniStat
          label="Avg quiz score"
          value={stats.avgScore > 0 ? `${stats.avgScore}%` : '—'}
          sub={stats.avgScore > 0 ? 'across all attempts' : 'no attempts yet'}
          color={stats.avgScore >= 80 ? 'var(--glade-green-deep)' : stats.avgScore >= 65 ? 'var(--roman-coffee)' : 'var(--danger)'}
          delay={120}
        />
      </div>

      {/* Weekly activity bar chart */}
      <div style={{ background: 'var(--alabaster)', borderRadius: 12, padding: '18px 20px', border: '1px solid var(--pearl-bush)' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--heathered-gray)', marginBottom: 14 }}>
          Weekly activity
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, alignItems: 'end', height: 88 }}>
          {stats.weekActivity.map((d, i) => {
            const barH = Math.max(5, (d.value / maxBar) * 52);
            return (
              <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--heathered-gray)', height: 14, lineHeight: '14px', textAlign: 'center' }}>
                  {d.value > 0 ? d.value : ''}
                </div>
                <div
                  className="dash-bar-grow"
                  style={{
                    width: '68%', height: barH, borderRadius: 4,
                    background: d.isToday ? 'var(--glade-green-deep)' : d.value > 0 ? 'var(--glade-green-sage)' : 'var(--pearl-bush)',
                    '--dash-delay': `${100 + i * 30}ms`,
                  }}
                />
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: d.isToday ? 'var(--glade-green-deep)' : 'var(--heathered-gray)', fontWeight: d.isToday ? 700 : 400 }}>
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Up next */}
      {stats.nextLesson && (
        <div style={{ background: 'rgba(86, 114, 63, 0.06)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(86, 114, 63, 0.2)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--glade-green-deep)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--glade-green-deep)', marginBottom: 2 }}>Up next</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--graphite)' }}>{stats.nextLesson.name}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--roman-coffee)' }}>Vol. {stats.nextLesson.vol}</div>
          </div>
        </div>
      )}

      {/* Manager note */}
      <div style={{ background: 'rgba(130, 106, 76, 0.06)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(130, 106, 76, 0.16)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--roman-coffee)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--roman-coffee)', marginBottom: 4 }}>Manager note</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--graphite)', lineHeight: 1.5 }}>{coachNote}</div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Learning ─────────────────────────────────────────
function LearningTab({ stats }) {
  const vols = [
    { key: 'v1', ...stats.v1, num: 'I',   name: 'Espresso Foundations', lessons: VOL_LESSONS.I },
    { key: 'v2', ...stats.v2, num: 'II',  name: 'Brew Methods',         lessons: VOL_LESSONS.II },
    { key: 'v3', ...stats.v3, num: 'III', name: 'Advanced Sensory',     lessons: VOL_LESSONS.III },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {vols.map((v, i) => {
        const pct = Math.round((v.done / v.total) * 100);
        const isLocked = v.done === 0 && i > 0 && !vols[i - 1].certified;
        return (
          <div
            key={v.key}
            className="dash-stagger-item"
            style={{ '--dash-delay': `${i * 80}ms`, background: 'var(--alabaster)', borderRadius: 12, padding: '18px 20px', border: '1px solid var(--pearl-bush)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--heathered-gray)' }}>
                    Vol. {v.num}
                  </span>
                  {v.certified && <StatusChip label="Certified" variant="Strong" />}
                  {isLocked && (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--heathered-gray)' }}>Locked</span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: isLocked ? 'var(--heathered-gray)' : 'var(--graphite)' }}>
                  {v.name}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: isLocked ? 'var(--heathered-gray)' : 'var(--graphite)', lineHeight: 1 }}>
                  {v.done}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--heathered-gray)' }}>/{v.total}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--heathered-gray)' }}>lessons</div>
              </div>
            </div>

            <ProgressBar pct={pct} height={5} delay={i * 80 + 160} />

            {!isLocked && v.done > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--heathered-gray)', marginBottom: 7 }}>Lesson progress</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {v.lessons.map((name, li) => {
                    const done = li < v.done;
                    const current = li === v.done;
                    return (
                      <span
                        key={name}
                        title={name}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11,
                          padding: '3px 9px',
                          borderRadius: 999,
                          background: done
                            ? 'rgba(111, 139, 95, 0.18)'
                            : current
                              ? 'rgba(86, 114, 63, 0.1)'
                              : 'transparent',
                          color: done
                            ? 'var(--glade-green-deep)'
                            : current
                              ? 'var(--glade-green-deep)'
                              : 'var(--heathered-gray)',
                          border: current
                            ? '1px dashed var(--glade-green-sage)'
                            : '1px solid transparent',
                          fontWeight: current ? 600 : done ? 500 : 400,
                        }}
                      >
                        {current ? '→ ' : ''}{name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {!isLocked && v.done === v.total && (
              <div style={{ marginTop: 8, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--glade-green-deep)', fontWeight: 500 }}>
                All {v.total} lessons complete
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Milestones ───────────────────────────────────────
function MilestonesTab({ stats }) {
  const done = stats.milestones.filter((m) => m.done).length;
  const total = stats.milestones.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--graphite)', fontWeight: 500 }}>
            {done} of {total} milestones complete
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: pct === 100 ? 'var(--glade-green-deep)' : 'var(--graphite)' }}>
            {pct}%
          </div>
        </div>
        <ProgressBar pct={pct} height={6} delay={80} />
      </div>

      {stats.milestones.map((m, i) => (
        <div
          key={i}
          className="dash-stagger-item"
          style={{
            '--dash-delay': `${i * 50 + 60}ms`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 0',
            borderBottom: i < total - 1 ? '1px solid var(--pearl-bush)' : 'none',
          }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: m.done ? 'var(--glade-green)' : 'transparent',
            border: m.done ? 'none' : '1.5px solid var(--heathered-gray)',
            display: 'grid', placeItems: 'center',
          }}>
            {m.done && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5L4.8 9L10 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div style={{
            flex: 1,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: m.done ? 'var(--graphite)' : 'var(--heathered-gray)',
            fontWeight: m.done ? 500 : 400,
          }}>
            {m.title}
          </div>
          {m.done && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--glade-green-deep)', fontWeight: 600 }}>Done</span>
          )}
          {!m.done && i === done && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--roman-coffee)', fontWeight: 600 }}>Up next</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Activity ─────────────────────────────────────────
function ActivityTab({ stats }) {
  const dotColor = {
    cert:      'var(--ripe-lemon)',
    lesson:    'var(--glade-green)',
    milestone: 'var(--glade-green-sage)',
    system:    'var(--heathered-gray)',
  };
  const kindLabel = {
    cert:      'Certification',
    lesson:    'Lesson complete',
    milestone: 'Milestone',
    system:    'Account',
  };

  if (!stats.recentActivity.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--heathered-gray)', marginBottom: 4 }}>No activity yet</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--heathered-gray)' }}>Check back after they start their first lesson.</div>
      </div>
    );
  }

  return (
    <div>
      {stats.recentActivity.map((a, i) => (
        <div
          key={i}
          className="dash-stagger-item"
          style={{ '--dash-delay': `${i * 55}ms`, display: 'flex', gap: 16 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor[a.kind] || dotColor.lesson, marginTop: 4, flexShrink: 0 }} />
            {i < stats.recentActivity.length - 1 && (
              <div style={{ width: 1, flex: 1, background: 'var(--pearl-bush)', marginTop: 5, minHeight: 24 }} />
            )}
          </div>
          <div style={{
            flex: 1,
            paddingBottom: 16,
            borderBottom: i < stats.recentActivity.length - 1 ? '1px solid var(--pearl-bush)' : 'none',
            marginBottom: i < stats.recentActivity.length - 1 ? 0 : 0,
          }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: dotColor[a.kind] || dotColor.lesson, marginBottom: 3 }}>
              {kindLabel[a.kind] || 'Event'}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--graphite)', lineHeight: 1.4, marginBottom: 2 }}>
              {a.label}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--heathered-gray)' }}>{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Staff stats modal ─────────────────────────────────────
function StaffStatsModal({ member, onClose }) {
  const [tab, setTab] = React.useState('overview');
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = React.useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 260);
  }, [onClose]);

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  const stats = buildMemberStats(member);
  const TABS = ['Overview', 'Learning', 'Milestones', 'Activity'];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(31, 26, 20, 0.5)',
          zIndex: 500,
          opacity: visible ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: `translate(-50%, ${visible ? '-50%' : '-47%'}) scale(${visible ? 1 : 0.96})`,
          width: 'min(700px, 94vw)',
          maxHeight: '86vh',
          background: 'var(--white)',
          borderRadius: 20,
          boxShadow: '0 32px 80px rgba(31, 26, 20, 0.28), 0 8px 24px rgba(31, 26, 20, 0.12)',
          zIndex: 501,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease',
        }}
      >
        {/* Header */}
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--pearl-bush)', display: 'flex', alignItems: 'flex-start', gap: 16, flexShrink: 0 }}>
          <Avatar name={member.name} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, color: 'var(--graphite)' }}>
                {member.name}
              </h2>
              <StatusChip label={member.status} />
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--roman-coffee)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>{member.position}</span>
              <span style={{ color: 'var(--pearl-bush)' }}>·</span>
              <span>{member.email}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'var(--alabaster)', border: '1px solid var(--pearl-bush)',
              borderRadius: '50%', width: 32, height: 32,
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              color: 'var(--roman-coffee)', fontSize: 20, lineHeight: 1, flexShrink: 0,
              fontFamily: 'var(--font-body)',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 2, padding: '10px 20px', borderBottom: '1px solid var(--pearl-bush)', background: 'var(--alabaster)', flexShrink: 0 }}>
          {TABS.map((t) => {
            const active = tab === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setTab(t.toLowerCase())}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none',
                  background: active ? 'var(--glade-green-deep)' : 'transparent',
                  color: active ? 'var(--white)' : 'var(--roman-coffee)',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>
          {tab === 'overview'   && <OverviewTab stats={stats} member={member} />}
          {tab === 'learning'   && <LearningTab stats={stats} />}
          {tab === 'milestones' && <MilestonesTab stats={stats} />}
          {tab === 'activity'   && <ActivityTab stats={stats} />}
        </div>
      </div>
    </>
  );
}

// ── Roster view ───────────────────────────────────────────
function RosterView() {
  const [selected, setSelected] = React.useState(() => new Set());
  const [filter, setFilter] = React.useState('All roles');
  const [toast, setToast] = React.useState(null);
  const [statsTarget, setStatsTarget] = React.useState(null);

  const filters = ['All roles', 'Manager', 'Lead Barista', 'Barista', 'Host'];
  const filteredRoster = filter === 'All roles'
    ? SEED_ROSTER
    : SEED_ROSTER.filter((r) => r.position.includes(filter));

  const toggleAll = () => {
    if (selected.size === filteredRoster.length) setSelected(new Set());
    else setSelected(new Set(filteredRoster.map((r) => r.id)));
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const analyzeStats = () => {
    if (selected.size === 0) {
      showToast('Select a teammate first to analyze their stats.');
      return;
    }
    if (selected.size > 1) {
      showToast('Select just one teammate to view their individual stats.');
      return;
    }
    const id = [...selected][0];
    const member = SEED_ROSTER.find((r) => r.id === id);
    if (member) setStatsTarget(member);
  };

  const bulkAction = (label) => {
    if (selected.size === 0) showToast('Pick at least one teammate first.');
    else showToast(`${label} queued for ${selected.size} teammate${selected.size === 1 ? '' : 's'}.`);
  };

  return (
    <>
      <PageHeader
        eyebrow="OWNER · TEAM"
        title="Here are your employees"
        subtitle="Watch onboarding and education progress at a glance, and run bulk actions from one place."
        actions={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--pearl-bush)',
              borderRadius: 999,
              padding: '8px 16px',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--graphite)'
            }}
          >
            {filters.map((f) => <option key={f}>{f}</option>)}
          </select>
        }
      />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(0, 1.4fr) 1fr 1.2fr 1fr 1fr',
          gap: 16,
          padding: '14px 24px',
          background: 'var(--alabaster)',
          borderBottom: '1px solid var(--pearl-bush)',
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--heathered-gray)'
        }}>
          <input
            type="checkbox"
            checked={selected.size === filteredRoster.length && filteredRoster.length > 0}
            onChange={toggleAll}
            aria-label="Select all"
          />
          <span>Teammate</span>
          <span>Email</span>
          <span>Status</span>
          <span>Onboarding</span>
          <span style={{ textAlign: 'right' }}>Education</span>
        </div>

        {filteredRoster.map((r, i) => {
          const checked = selected.has(r.id);
          return (
            <div
              key={r.id}
              className="dash-stagger-item dash-row-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '40px minmax(0, 1.4fr) 1fr 1.2fr 1fr 1fr',
                gap: 16,
                alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i === filteredRoster.length - 1 ? 'none' : '1px solid var(--pearl-bush)',
                background: checked ? 'rgba(111, 139, 95, 0.08)' : 'transparent',
                '--dash-delay': `${i * 50 + 60}ms`
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOne(r.id)}
                aria-label={`Select ${r.name}`}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Avatar name={r.name} size={32} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--graphite)' }}>{r.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--heathered-gray)' }}>{r.position}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--roman-coffee)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.email}
              </div>
              <div>
                <StatusChip label={r.status} delay={i * 50 + 220} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--graphite)', marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
                  {r.onboarding}%
                </div>
                <ProgressBar pct={r.onboarding} delay={i * 50 + 260} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--graphite)', marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
                  {r.education}%
                </div>
                <ProgressBar pct={r.education} delay={i * 50 + 300} />
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <SecondaryButton onClick={analyzeStats}>Analyze stats</SecondaryButton>
        <SecondaryButton onClick={() => bulkAction('Assign lessons')}>Assign lessons</SecondaryButton>
        <SecondaryButton onClick={() => bulkAction('Send reminder')}>Send reminder</SecondaryButton>
      </div>

      {statsTarget && (
        <StaffStatsModal member={statsTarget} onClose={() => setStatsTarget(null)} />
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--glade-green-deep)', color: 'var(--alabaster)',
          padding: '10px 18px', borderRadius: 999,
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 24px rgba(31, 26, 20, 0.24)', zIndex: 300,
          animation: 'fadeInUp 200ms ease both',
        }}>
          {toast}
        </div>
      )}
    </>
  );
}

// ── Add teammate view ─────────────────────────────────────
function AddTeammateView() {
  const [name, setName] = React.useState('');
  const [position, setPosition] = React.useState('Barista');
  const [email, setEmail] = React.useState('');
  const [picked, setPicked] = React.useState(['Easy', 'Intermediate']);
  const [context, setContext] = React.useState('');
  const [confirmation, setConfirmation] = React.useState(null);

  const togglePick = (d) => {
    setPicked((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setConfirmation({ kind: 'error', text: 'Name and email are required.' });
      return;
    }
    setConfirmation({
      kind: 'ok',
      text: `Invite sent to ${email.trim()} with ${picked.length} difficulty level${picked.length === 1 ? '' : 's'} assigned.`
    });
    setName(''); setEmail(''); setContext('');
  };

  return (
    <>
      <PageHeader
        eyebrow="OWNER · ADD TEAMMATE"
        title="Let's grow your team"
        subtitle="Send an invite and Copi will tailor a starting curriculum to the level you choose."
      />

      <form onSubmit={submit}>
        <Card style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Employee first + last name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Carter Wong" style={inputStyle} />
            </Field>
            <Field label="Employee position">
              <select value={position} onChange={(e) => setPosition(e.target.value)} style={inputStyle}>
                <option>Barista</option>
                <option>Lead Barista</option>
                <option>Host</option>
                <option>Manager</option>
              </select>
            </Field>
            <Field label="Beginning assigned difficulty">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DIFFICULTIES.map((d) => {
                  const on = picked.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => togglePick(d)}
                      className="dash-btn"
                      style={{
                        padding: '8px 14px', borderRadius: 999,
                        background: on ? 'var(--glade-green-deep)' : 'var(--alabaster)',
                        color: on ? 'var(--white)' : 'var(--graphite)',
                        border: on ? '1.5px solid var(--glade-green-deep)' : '1.5px solid var(--pearl-bush)',
                        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 8
                      }}
                    >
                      {d}
                      {on && <span style={{ opacity: 0.85 }}>×</span>}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Employee email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@milano.coffee" style={inputStyle} />
            </Field>
            <Field label="What should Copi know about this employee?">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={5}
                placeholder="e.g. has worked at a third-wave shop for two years, comfortable on bar but new to pour-over."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <PrimaryButton type="submit">+ Send invite</PrimaryButton>
          </div>

          {confirmation && (
            <div style={{
              marginTop: 20, padding: '12px 16px', borderRadius: 10,
              background: confirmation.kind === 'ok' ? 'rgba(111, 139, 95, 0.12)' : 'rgba(156, 61, 39, 0.10)',
              color: confirmation.kind === 'ok' ? 'var(--glade-green-deep)' : 'var(--danger)',
              fontFamily: 'var(--font-body)', fontSize: 13
            }}>
              {confirmation.text}
            </div>
          )}
        </Card>
      </form>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'flex-start', gap: 20 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--graphite)', paddingTop: 10 }}>
        {label}
      </span>
      <div>{children}</div>
    </label>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid var(--pearl-bush)', background: 'var(--alabaster)',
  fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--graphite)', outline: 'none'
};

// ── Combined page ─────────────────────────────────────────
function EmptyRosterView() {
  return (
    <>
      <PageHeader
        eyebrow="OWNER · TEAM"
        title="Your team roster"
        subtitle="Invite teammates to see onboarding and education progress here."
      />
      <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--heathered-gray)',
          maxWidth: 420,
          margin: '0 auto 20px',
          lineHeight: 1.55,
        }}>
          You haven't added any teammates yet. Invite your first barista, host, or manager to start tracking their onboarding and lesson progress.
        </div>
        <PrimaryButton onClick={() => window.CopiActions?.navigate?.('admin-team-add')}>
          Invite a teammate
        </PrimaryButton>
      </Card>
    </>
  );
}

function AdminTeam({ user = {}, view = 'roster' }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;
  const isDemo = /@milano\.coffee$/i.test(user?.email || '');

  const subnav = [
    { label: 'Roster',       route: 'admin-team',     active: view === 'roster' },
    { label: 'Add teammate', route: 'admin-team-add', active: view === 'add' }
  ];

  return (
    <AdminShell current="team" subnav={subnav} user={user} cafe={cafe}>
      {view === 'add' ? <AddTeammateView /> : (isDemo ? <RosterView /> : <EmptyRosterView />)}
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminTeam = AdminTeam;
}

export default AdminTeam;
