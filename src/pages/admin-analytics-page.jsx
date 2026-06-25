// ═════════════════════════════════════════════════════════
// ANALYTICS PAGE — Team performance dashboard.
// Uses the shared admin-ui components so the visual language
// matches the Home page (StatCard, StatusChip, ProgressBar, etc.).
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';
import {
  PageHeader, Card, SectionHeader,
  StatCard, StatusChip, ProgressBar, Avatar
} from './admin-ui.jsx';

const ROSTER = [
  { name: 'Linda Turko', role: 'Barista', progress: 100, cert: 'Foundations', status: 'Strong',   trend: 'flat', lastActive: '7d ago' },
  { name: 'Reza Mehta',  role: 'Barista', progress: 100, cert: 'Foundations', status: 'Strong',   trend: 'up',   lastActive: '5d ago' },
  { name: 'Pia Olsen',   role: 'Barista', progress: 56,  cert: 'Not yet',     status: 'On track', trend: 'up',   lastActive: '4d ago' },
  { name: 'Lili Turko',  role: 'Barista', progress: 44,  cert: 'Not yet',     status: 'Watch',    trend: 'up',   lastActive: '3d ago' },
  { name: 'Jules Patel', role: 'Barista', progress: 31,  cert: 'Not yet',     status: 'At risk',  trend: 'up',   lastActive: '3d ago' },
  { name: 'Devi Shah',   role: 'Barista', progress: 13,  cert: 'Not yet',     status: 'At risk',  trend: 'up',   lastActive: '2d ago' },
];

const GAPS = [
  { tag: 'HIGH', vol: 'VOL · I',  title: 'History of coffee',   pct: 25 },
  { tag: 'HIGH', vol: 'VOL · II', title: 'Processing methods',  pct: 25 },
];

function TrendIcon({ trend }) {
  if (trend === 'flat') {
    return (
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 18,
        color: 'var(--heathered-gray)',
        fontWeight: 600
      }}>—</span>
    );
  }
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-label="trend up">
      <path
        d="M 1 11 L 6 8 L 10 10 L 14 4 L 21 1"
        stroke="var(--glade-green-deep)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KnowledgeGapCard({ tag, vol, title, pct, staggerIndex = 0 }) {
  return (
    <article
      className="dash-stagger-item dash-card-hover"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--pearl-bush)',
        borderRadius: 14,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        '--dash-delay': `${staggerIndex * 60 + 80}ms`
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: 6,
            background: 'rgba(156, 61, 39, 0.16)',
            color: 'var(--danger)',
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em'
          }}>{tag}</span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.08em'
          }}>{vol}</span>
        </div>
        <button className="dash-btn" style={{
          background: 'none',
          border: 'none',
          color: 'var(--glade-green-deep)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0
        }}>
          Drill →
        </button>
      </header>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 17,
        fontWeight: 700,
        color: 'var(--graphite)',
        margin: 0
      }}>
        {title}
      </h4>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--roman-coffee)'
      }}>
        {pct}% of team completed
      </div>
    </article>
  );
}

function AdminAnalyticsPage({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  return (
    <AdminShell current="analytics" user={user} cafe={cafe}>
      <PageHeader
        eyebrow="OWNER · ANALYTICS"
        title="Team performance"
      />

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 32
      }}>
        <StatCard staggerIndex={0} label="TEAM COMPLETION" value="57%" supporting="across assigned volumes" delta="8%" progress={57} />
        <StatCard staggerIndex={1} label="LESSONS / WEEK"  value="37"  supporting="last 7 days"             delta="14%" progress={68} progressColor="var(--glade-green)" />
        <StatCard staggerIndex={2} label="AVG QUIZ SCORE"  value="95%" supporting="across all attempts"     delta="2%"  progress={95} />
        <StatCard staggerIndex={3} label="NEEDS ATTENTION" value="2"   supporting="baristas under 35%"      delta="1" deltaTone="down" progress={20} progressColor="var(--danger-soft)" />
      </div>

      {/* Two-column body: Individual Progress + Knowledge Gaps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 18,
        alignItems: 'flex-start'
      }}>
        {/* Individual progress */}
        <Card>
          <SectionHeader title="Individual progress" />
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.6fr) 1.1fr 0.9fr 1fr 60px 90px',
              gap: 12,
              padding: '0 0 10px 0',
              borderBottom: '1px solid var(--pearl-bush)',
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--heathered-gray)'
            }}>
              <span>Name</span>
              <span>Progress</span>
              <span>Certification</span>
              <span>Status</span>
              <span>Trend</span>
              <span style={{ textAlign: 'right' }}>Last active</span>
            </div>
            {ROSTER.map((row, i) => (
              <div
                key={row.name}
                className="dash-stagger-item dash-row-hover"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.6fr) 1.1fr 0.9fr 1fr 60px 90px',
                  gap: 12,
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i === ROSTER.length - 1 ? 'none' : '1px solid var(--pearl-bush)',
                  '--dash-delay': `${i * 60 + 80}ms`
                }}
              >
                {/* Name + avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <Avatar name={row.name} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--graphite)'
                    }}>{row.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--heathered-gray)'
                    }}>{row.role}</div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--graphite)',
                    marginBottom: 6,
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {row.progress}%
                  </div>
                  <ProgressBar pct={row.progress} delay={i * 60 + 240} />
                </div>

                {/* Cert */}
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: row.cert === 'Not yet' ? 'var(--heathered-gray)' : 'var(--graphite)',
                  fontWeight: row.cert === 'Not yet' ? 400 : 600
                }}>
                  {row.cert}
                </div>

                {/* Status */}
                <div>
                  <StatusChip label={row.status} delay={i * 60 + 200} />
                </div>

                {/* Trend */}
                <div>
                  <TrendIcon trend={row.trend} />
                </div>

                {/* Last active */}
                <div style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--heathered-gray)'
                }}>
                  {row.lastActive}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Knowledge gaps */}
        <section>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--heathered-gray)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 12
          }}>
            KNOWLEDGE GAPS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {GAPS.map((g, i) => <KnowledgeGapCard key={g.title} {...g} staggerIndex={i} />)}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminAnalyticsPageNew = AdminAnalyticsPage;
}

export default AdminAnalyticsPage;
