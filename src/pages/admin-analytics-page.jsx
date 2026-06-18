// ═════════════════════════════════════════════════════════
// ANALYTICS PAGE — Team performance dashboard.
// Matches the redesign mockup: OWNER · ANALYTICS eyebrow, Team performance
// title, 4 stat cards with alternating Glade Green / Roman Coffee numbers,
// Individual Progress table, and a Knowledge Gaps right panel.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';

const ROSTER = [
  { name: 'Linda Turko', role: 'barista', progress: 100, cert: 'Foundations', status: 'Strong',   trend: 'flat', lastActive: '7d ago' },
  { name: 'Reza Mehta',  role: 'barista', progress: 100, cert: 'Foundations', status: 'Strong',   trend: 'up',   lastActive: '5d ago' },
  { name: 'Pia Olsen',   role: 'barista', progress: 56,  cert: 'Not yet',     status: 'On track', trend: 'up',   lastActive: '4d ago' },
  { name: 'Lili Turko',  role: 'barista', progress: 44,  cert: 'Not yet',     status: 'Watch',    trend: 'up',   lastActive: '3d ago' },
  { name: 'Jules Patel', role: 'barista', progress: 31,  cert: 'Not yet',     status: 'At risk',  trend: 'up',   lastActive: '3d ago' },
  { name: 'Devi Shah',   role: 'barista', progress: 13,  cert: 'Not yet',     status: 'At risk',  trend: 'up',   lastActive: '2d ago' },
];

const STATS = [
  { label: 'TEAM COMPLETION', value: '57%', sub: 'across assigned volumes', tone: 'green' },
  { label: 'LESSONS / WEEK',  value: '37',  sub: 'last 7 days',             tone: 'coffee' },
  { label: 'AVG QUIZ SCORE',  value: '95%', sub: 'across all attempts',     tone: 'green' },
  { label: 'NEEDS ATTENTION', value: '2',   sub: 'baristas under 35%',      tone: 'coffee' },
];

const GAPS = [
  { tag: 'HIGH', vol: 'VOL · I',  title: 'History of coffee',   pct: 25 },
  { tag: 'HIGH', vol: 'VOL · II', title: 'Processing methods',  pct: 25 },
];

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function StatusPill({ status }) {
  const tones = {
    'Strong':   { bg: 'var(--glade-green)',           fg: 'var(--white)',     border: 'transparent' },
    'On track': { bg: 'var(--pearl-bush)',            fg: 'var(--graphite)',  border: 'var(--heathered-gray)' },
    'Watch':    { bg: 'rgba(130, 106, 76, 0.18)',     fg: 'var(--roman-coffee)', border: 'transparent' },
    'At risk':  { bg: 'rgba(156, 61, 39, 0.16)',      fg: 'var(--danger)',    border: 'transparent' }
  };
  const t = tones[status] || tones['On track'];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '5px 14px',
      borderRadius: 999,
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.border}`,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.01em'
    }}>
      {status}
    </span>
  );
}

function TrendIcon({ trend }) {
  if (trend === 'flat') {
    return (
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 18,
        color: 'var(--roman-coffee)',
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

function ProgressBar({ pct }) {
  const fill =
    pct >= 80 ? 'var(--glade-green)' :
    pct >= 50 ? '#C7A14A' :          // amber midtone
    pct >= 35 ? 'var(--danger-soft)' :
                'var(--danger)';
  const width = Math.max(6, Math.min(100, pct));
  return (
    <div style={{
      width: 116,
      height: 4,
      borderRadius: 999,
      background: 'rgba(31, 26, 20, 0.08)',
      overflow: 'hidden'
    }}>
      <div style={{ width: `${width}%`, height: '100%', background: fill, borderRadius: 999 }} />
    </div>
  );
}

function StatCard({ label, value, sub, tone }) {
  const numColor = tone === 'green' ? 'var(--glade-green-deep)' : 'var(--roman-coffee)';
  return (
    <div style={{
      background: 'var(--alabaster)',
      border: '1px solid var(--heathered-gray)',
      borderRadius: 14,
      padding: '20px 24px',
      flex: 1,
      minWidth: 0
    }}>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--roman-coffee)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 8
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 800,
        fontSize: 44,
        lineHeight: 1,
        color: numColor,
        marginBottom: 6
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--roman-coffee)'
      }}>
        {sub}
      </div>
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'var(--glade-green-deep)',
      color: 'var(--alabaster)',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.04em',
      flexShrink: 0
    }}>
      {initials(name)}
    </div>
  );
}

function KnowledgeGapCard({ tag, vol, title, pct }) {
  return (
    <article style={{
      background: 'var(--alabaster)',
      border: '1px solid var(--heathered-gray)',
      borderRadius: 14,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
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
        <button style={{
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
      {/* Eyebrow + title */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--glade-green-deep)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        marginBottom: 10
      }}>
        OWNER · ANALYTICS
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 48,
        color: 'var(--graphite)',
        margin: '0 0 28px 0',
        letterSpacing: '-0.01em'
      }}>
        Team performance
      </h1>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 40
      }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two-column body: Individual Progress + Knowledge Gaps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 28,
        alignItems: 'flex-start'
      }}>
        {/* Individual progress */}
        <section>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 10
          }}>
            INDIVIDUAL PROGRESS
          </div>

          <div style={{
            background: 'var(--alabaster)',
            border: '1px solid var(--heathered-gray)',
            borderRadius: 14,
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-body)'
            }}>
              <thead>
                <tr style={{ background: 'var(--pearl-bush)' }}>
                  {['Name', 'Progress', 'Certification', 'Status', 'Trend', 'Last Active'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '14px 18px',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--roman-coffee)',
                      borderBottom: '1px solid var(--heathered-gray)'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROSTER.map((row, i) => (
                  <tr key={row.name} style={{
                    borderBottom: i === ROSTER.length - 1 ? 'none' : '1px solid rgba(181, 163, 139, 0.4)',
                    background: i % 2 === 0 ? 'var(--alabaster)' : 'rgba(232, 221, 200, 0.4)'
                  }}>
                    {/* Name + avatar */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={row.name} />
                        <div>
                          <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--graphite)'
                          }}>{row.name}</div>
                          <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            color: 'var(--roman-coffee)'
                          }}>{row.role}</div>
                        </div>
                      </div>
                    </td>
                    {/* Progress */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--graphite)',
                        marginBottom: 6,
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {row.progress}%
                      </div>
                      <ProgressBar pct={row.progress} />
                    </td>
                    {/* Cert */}
                    <td style={{
                      padding: '14px 18px',
                      fontSize: 13,
                      color: row.cert === 'Not yet' ? 'var(--roman-coffee)' : 'var(--graphite)',
                      fontWeight: row.cert === 'Not yet' ? 400 : 600
                    }}>
                      {row.cert}
                    </td>
                    {/* Status */}
                    <td style={{ padding: '14px 18px' }}>
                      <StatusPill status={row.status} />
                    </td>
                    {/* Trend */}
                    <td style={{ padding: '14px 18px' }}>
                      <TrendIcon trend={row.trend} />
                    </td>
                    {/* Last active */}
                    <td style={{
                      padding: '14px 18px',
                      fontSize: 13,
                      color: 'var(--roman-coffee)'
                    }}>
                      {row.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Knowledge gaps */}
        <section>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 10
          }}>
            KNOWLEDGE GAPS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {GAPS.map((g) => <KnowledgeGapCard key={g.title} {...g} />)}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  // Renamed to avoid colliding with the legacy inline AdminAnalyticsPage in App.jsx.
  window.AdminAnalyticsPageNew = AdminAnalyticsPage;
}

export default AdminAnalyticsPage;
