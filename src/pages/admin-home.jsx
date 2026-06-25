// ═════════════════════════════════════════════════════════
// ADMIN HOME — Dashboard landing page.
// Matches the Copi_Dashboard mockup: date eyebrow + "Good morning"
// title + supporting line + actions, Ask Cupper widget top-right,
// 4 stat cards, Team progress + Recent activity side-by-side,
// Onboarding steps + Current lessons side-by-side, weekly engagement
// bar chart. Animations + tokens come from admin-ui.jsx and styles.css.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';
import {
  PageHeader, PrimaryButton, SecondaryButton,
  StatCard, Card, SectionHeader, StatusChip, ProgressBar,
  ActivityItem, WeeklyBarChart, OnboardingStep, LessonRow, AskCupperCard,
  Avatar
} from './admin-ui.jsx';

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(d) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
}

// ── Seed data — realistic for a Vancouver third-wave shop ──
const TEAM_ROWS = [
  { name: 'Sofia Marin', role: 'Barista',    status: 'On track',   progress: 88 },
  { name: 'Liam Cho',    role: 'Barista',    status: 'Ahead',      progress: 95 },
  { name: 'Ava Reyes',   role: 'Shift lead', status: 'On track',   progress: 64 },
  { name: 'Noah Bauer',  role: 'Barista',    status: 'Behind',     progress: 31 },
  { name: 'Mia Russo',   role: 'New hire',   status: 'Onboarding', progress: 12 }
];

const ACTIVITY = [
  { kind: 'done',   body: <><b>Liam Cho</b> completed "Espresso extraction"</>, time: '12 min ago', pulse: true },
  { kind: 'active', body: <><b>Mia Russo</b> started onboarding</>,             time: '1 hour ago' },
  { kind: 'done',   body: <><b>Sofia Marin</b> scored 96% on "Milk steaming"</>, time: '3 hours ago' },
  { kind: 'system', body: <><b>You</b> published a new lesson: "Latte art basics"</>, time: 'Yesterday' },
  { kind: 'system', body: <><b>Noah Bauer</b> fell behind on "Origins"</>,       time: 'Yesterday' }
];

const ONBOARDING_STEPS = [
  { title: 'Intro to Milano',         state: 'done' },
  { title: 'Values in the workplace', state: 'done' },
  { title: 'Learning our products',   state: 'in-progress' },
  { title: 'How to use the machines', state: 'pending' }
];

const CURRENT_LESSONS = [
  { title: 'Coffee history', pct: 100 },
  { title: 'Origins',        pct: 72  },
  { title: 'Processing',     pct: 40  },
  { title: 'How to serve',   pct: 8   }
];

const WEEKLY_ENGAGEMENT = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 21 },
  { label: 'Sat', value: 9  },
  { label: 'Sun', value: 29 }
];

const ASK_CUPPER_PROMPTS = [
  'What should I train next?',
  'Refine the onboarding process',
  'Customize coffee education'
];

function AdminHome({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;
  const firstName = (user?.name || 'Brian').split(' ')[0];
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // Mon-indexed (0..6)
  const totalLessons = WEEKLY_ENGAGEMENT.reduce((s, d) => s + d.value, 0);

  return (
    <AdminShell current="home" user={user} cafe={cafe} curriculumBadge={3}>
      {/* Greeting block */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--roman-coffee)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          {formatDate(today)}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 44,
          color: 'var(--graphite)',
          margin: '0 0 10px 0',
          letterSpacing: '-0.01em',
          lineHeight: 1.05
        }}>
          {greetingByHour()}, {firstName}.
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--graphite)',
          margin: '0 0 18px 0',
          maxWidth: 560,
          lineHeight: 1.55
        }}>
          Your team is <b>57% through</b> their assigned tracks. Two
          onboarding steps need your review today.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryButton onClick={() => window.CopiActions?.navigate?.('admin-team')}>
            Review onboarding
          </PrimaryButton>
          <SecondaryButton onClick={() => window.CopiActions?.navigate?.('admin-team')}>
            View team
          </SecondaryButton>
        </div>
      </div>

      {/* Ask Cupper — full-width hero card */}
      <div style={{ marginBottom: 32 }}>
        <AskCupperCard prompts={ASK_CUPPER_PROMPTS} onAsk={() => {}} />
      </div>

      {/* Quick insights */}
      <section style={{ marginBottom: 28 }}>
        <SectionHeader title="Quick insights" action={{ label: 'Customize ✎' }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14
        }}>
          <StatCard
            staggerIndex={0}
            label="QUALITY EDUCATION"
            value="A-"
            supporting="Score climbing 4 weeks"
            delta="12%"
            progress={88}
          />
          <StatCard
            staggerIndex={1}
            label="ACTIVE TEAMMATES"
            value="6"
            supporting="All on schedule"
            badge={
              <span style={{
                padding: '3px 9px',
                borderRadius: 999,
                background: 'var(--ripe-lemon-soft)',
                color: 'var(--graphite)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 700
              }}>+2 new</span>
            }
            progress={100}
            progressColor="var(--glade-green)"
          />
          <StatCard
            staggerIndex={2}
            label="COMPLETION"
            value="57%"
            supporting="Across assigned tracks"
            badge={
              <span style={{
                padding: '3px 9px',
                borderRadius: 999,
                background: 'rgba(111, 139, 95, 0.18)',
                color: 'var(--glade-green-deep)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 700
              }}>On track</span>
            }
            progress={57}
          />
          <StatCard
            staggerIndex={3}
            label="AVG. TIME / LESSON"
            value="14m"
            supporting="Down from 19m"
            delta="26%"
            deltaTone="down"
            progress={72}
            progressColor="var(--glade-green)"
          />
        </div>
      </section>

      {/* Team progress + Recent activity */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: 18,
        marginBottom: 28
      }}>
        <Card>
          <SectionHeader title="Team progress" action="View all 6" />
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.7fr) 100px minmax(0, 1.1fr)',
              gap: 16,
              padding: '0 0 10px 0',
              borderBottom: '1px solid var(--pearl-bush)',
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--heathered-gray)'
            }}>
              <span>Teammate</span>
              <span>Status</span>
              <span style={{ textAlign: 'right' }}>Progress</span>
            </div>
            {TEAM_ROWS.map((row, i) => (
              <div
                key={row.name}
                className="dash-stagger-item dash-row-hover"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.7fr) 100px minmax(0, 1.1fr)',
                  gap: 16,
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i === TEAM_ROWS.length - 1 ? 'none' : '1px solid var(--pearl-bush)',
                  '--dash-delay': `${i * 60 + 80}ms`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <Avatar name={row.name} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--graphite)'
                    }}>
                      {row.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--heathered-gray)'
                    }}>
                      {row.role}
                    </div>
                  </div>
                </div>
                <StatusChip label={row.status} delay={i * 60 + 240} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  justifyContent: 'flex-end'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--graphite)',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {row.progress}%
                  </span>
                  <div style={{ width: 90 }}>
                    <ProgressBar pct={row.progress} height={4} delay={i * 60 + 280} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Recent activity" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACTIVITY.map((a, i) => (
              <ActivityItem
                key={i}
                kind={a.kind}
                body={a.body}
                time={a.time}
                pulse={!!a.pulse}
                staggerIndex={i}
              />
            ))}
          </div>
        </Card>
      </section>

      {/* Onboarding steps + Current lessons */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 18,
        marginBottom: 28
      }}>
        <Card>
          <SectionHeader title="Onboarding steps" action="2 of 4 done" />
          <div>
            {ONBOARDING_STEPS.map((s, i) => (
              <OnboardingStep
                key={s.title}
                index={i + 1}
                title={s.title}
                state={s.state}
                staggerIndex={i}
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Current lessons" action={{ label: 'All curriculum' }} />
          <div>
            {CURRENT_LESSONS.map((l, i) => (
              <LessonRow
                key={l.title}
                index={i + 1}
                title={l.title}
                pct={l.pct}
                staggerIndex={i}
              />
            ))}
          </div>
        </Card>
      </section>

      {/* Weekly engagement */}
      <section style={{ marginBottom: 12 }}>
        <Card style={{ padding: 28 }}>
          <header style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 28
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 19,
                color: 'var(--graphite)',
                margin: '0 0 4px 0'
              }}>
                Weekly engagement
              </h2>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--roman-coffee)'
              }}>
                Lessons completed per day · last 7 days
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 26,
              color: 'var(--graphite)',
              lineHeight: 1
            }}>
              {totalLessons} <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--heathered-gray)',
                marginLeft: 4
              }}>total</span>
            </div>
          </header>
          <WeeklyBarChart data={WEEKLY_ENGAGEMENT} todayIndex={todayIndex} height={220} />
        </Card>
      </section>
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminHome = AdminHome;
}

export default AdminHome;
