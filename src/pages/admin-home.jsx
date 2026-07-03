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

function EmptyBlock({ message, ctaLabel, ctaRoute }) {
  return (
    <div style={{
      padding: '28px 12px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--heathered-gray)',
        lineHeight: 1.5,
        maxWidth: 320,
      }}>
        {message}
      </div>
      {ctaLabel && ctaRoute && (
        <button
          type="button"
          onClick={() => window.CopiActions?.navigate?.(ctaRoute)}
          style={{
            background: 'var(--glade-green-deep)',
            color: 'var(--white)',
            border: 'none',
            padding: '9px 18px',
            borderRadius: 999,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {ctaLabel} →
        </button>
      )}
    </div>
  );
}

function AdminHome({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;
  const cafeId = user?.cafeId || cafe?.id || null;
  const firstName = (user?.name || 'Brian').split(' ')[0];
  // Only the seeded Milano demo login gets the polished mock content.
  // Every real cafe (fresh signup) sees an empty state with setup CTAs.
  const isDemo = /@milano\.coffee$/i.test(user?.email || '');
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // Mon-indexed (0..6)
  const weeklyData = isDemo ? WEEKLY_ENGAGEMENT : WEEKLY_ENGAGEMENT.map((d) => ({ ...d, value: 0 }));
  const totalLessons = weeklyData.reduce((s, d) => s + d.value, 0);

  // Persistent reminder when an owner skipped publishing during onboarding.
  const draft = cafeId && store?.getDraftCurriculumForCafe
    ? store.getDraftCurriculumForCafe(cafeId)
    : null;
  const draftTrackCount = draft && store?.getTracksForCurriculum
    ? store.getTracksForCurriculum(draft.id).length
    : 0;
  const draftLessonCount = draft && store?.getTracksForCurriculum
    ? store.getTracksForCurriculum(draft.id).reduce(
        (sum, t) => sum + store.getLessonsForTrack(t.id).length, 0)
    : 0;

  // Cupper chat drawer state — { initial: string, context: {...} } when open.
  const [cupperOpen, setCupperOpen] = React.useState(null);

  return (
    <AdminShell current="home" user={user} cafe={cafe} curriculumBadge={3}>
      {/* Draft curriculum reminder — surfaces the unpublished import. */}
      {draft && (
        <div
          className="copi-reveal copi-reveal--fade-up is-in"
          style={{
            background: 'var(--ripe-lemon-soft)',
            border: '1px solid var(--ripe-lemon)',
            borderRadius: 14,
            padding: '14px 20px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            transitionDuration: '300ms'
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--graphite)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 4
            }}>
              Draft curriculum waiting
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--graphite)',
              lineHeight: 1.5
            }}>
              {draft.shopName || 'Your imported roaster'} — {draftTrackCount} {draftTrackCount === 1 ? 'track' : 'tracks'},
              {' '}{draftLessonCount} {draftLessonCount === 1 ? 'lesson' : 'lessons'}. Review and publish to release it to your team.
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.CopiActions?.navigate?.('admin-curriculum-page')}
            className="dash-btn"
            style={{
              background: 'var(--glade-green-deep)',
              color: 'var(--white)',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Review draft →
          </button>
        </div>
      )}

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
          {isDemo ? (
            <>Your team is <b>57% through</b> their assigned tracks. Two onboarding steps need your review today.</>
          ) : (
            <>Welcome to Copi. Import your menu from a roaster website, then invite your team to start onboarding.</>
          )}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {isDemo ? (
            <>
              <PrimaryButton onClick={() => window.CopiActions?.navigate?.('admin-team')}>
                Review onboarding
              </PrimaryButton>
              <SecondaryButton onClick={() => window.CopiActions?.navigate?.('admin-team')}>
                View team
              </SecondaryButton>
              {!draft && (
                <SecondaryButton onClick={() => window.CopiActions?.navigate?.('import-roaster')}>
                  Import from a roaster website
                </SecondaryButton>
              )}
            </>
          ) : (
            <>
              <PrimaryButton onClick={() => window.CopiActions?.navigate?.('import-roaster')}>
                Import from a roaster website
              </PrimaryButton>
              <SecondaryButton onClick={() => window.CopiActions?.navigate?.('admin-team-add')}>
                Invite your team
              </SecondaryButton>
            </>
          )}
        </div>
      </div>

      {/* Ask Cupper — full-width hero card */}
      <div style={{ marginBottom: 32 }}>
        <AskCupperCard
          prompts={ASK_CUPPER_PROMPTS}
          onAsk={(text) => {
            const trimmed = (text || '').trim();
            if (!trimmed) return;
            setCupperOpen({
              initial: trimmed,
              context: { cafeName: cafe?.name, role: user?.role || 'owner' },
            });
          }}
        />
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
            value={isDemo ? 'A-' : '—'}
            supporting={isDemo ? 'Score climbing 4 weeks' : 'Available after first lesson'}
            delta={isDemo ? '12%' : undefined}
            progress={isDemo ? 88 : 0}
          />
          <StatCard
            staggerIndex={1}
            label="ACTIVE TEAMMATES"
            value={isDemo ? '6' : '0'}
            supporting={isDemo ? 'All on schedule' : 'No teammates yet'}
            badge={isDemo ? (
              <span style={{
                padding: '3px 9px',
                borderRadius: 999,
                background: 'var(--ripe-lemon-soft)',
                color: 'var(--graphite)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 700
              }}>+2 new</span>
            ) : null}
            progress={isDemo ? 100 : 0}
            progressColor="var(--glade-green)"
          />
          <StatCard
            staggerIndex={2}
            label="COMPLETION"
            value={isDemo ? '57%' : '—'}
            supporting={isDemo ? 'Across assigned tracks' : 'Import a menu to add lessons'}
            badge={isDemo ? (
              <span style={{
                padding: '3px 9px',
                borderRadius: 999,
                background: 'rgba(111, 139, 95, 0.18)',
                color: 'var(--glade-green-deep)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 700
              }}>On track</span>
            ) : null}
            progress={isDemo ? 57 : 0}
          />
          <StatCard
            staggerIndex={3}
            label="AVG. TIME / LESSON"
            value={isDemo ? '14m' : '—'}
            supporting={isDemo ? 'Down from 19m' : 'Available after first lesson'}
            delta={isDemo ? '26%' : undefined}
            deltaTone="down"
            progress={isDemo ? 72 : 0}
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
          <SectionHeader title="Team progress" action={isDemo ? 'View all 6' : undefined} />
          {isDemo ? (
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
          ) : (
            <EmptyBlock
              message="Invite your team so onboarding progress and lesson completion show up here."
              ctaLabel="Invite a teammate"
              ctaRoute="admin-team-add"
            />
          )}
        </Card>

        <Card>
          <SectionHeader title="Recent activity" />
          {isDemo ? (
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
          ) : (
            <EmptyBlock message="No activity yet. Lesson completions and onboarding sign-offs will appear here as your team gets started." />
          )}
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
          <SectionHeader title="Onboarding steps" action={isDemo ? '2 of 4 done' : undefined} />
          {isDemo ? (
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
          ) : (
            <EmptyBlock
              message="Once you invite teammates, their onboarding milestones will show up here for you to review and sign off on."
              ctaLabel="Invite a teammate"
              ctaRoute="admin-team-add"
            />
          )}
        </Card>

        <Card>
          <SectionHeader title="Current lessons" action={isDemo ? { label: 'All curriculum' } : undefined} />
          {isDemo ? (
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
          ) : (
            <EmptyBlock
              message="Import your menu from a roaster website and Copi will generate lesson tracks tailored to your cafe."
              ctaLabel="Import from a roaster website"
              ctaRoute="import-roaster"
            />
          )}
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
          <WeeklyBarChart data={weeklyData} todayIndex={todayIndex} height={220} />
        </Card>
      </section>

      {window.CupperChat && (
        <window.CupperChat
          open={!!cupperOpen}
          initialMessage={cupperOpen?.initial || null}
          context={cupperOpen?.context || null}
          onClose={() => setCupperOpen(null)}
        />
      )}
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminHome = AdminHome;
}

export default AdminHome;
