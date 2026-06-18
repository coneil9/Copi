// ═════════════════════════════════════════════════════════
// ADMIN HOME — Owner dashboard.
// Greeting + Cupper AI chat prompt + quick insights row +
// current onboarding steps + current lessons panels.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell, CupperMini } from './admin-shell.jsx';

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function MiniLineChart() {
  // Static SVG line chart — purely visual, mirrors the wireframe sketch.
  const points = '4,42 14,38 22,40 32,30 42,32 52,22 62,18 70,10';
  return (
    <svg viewBox="0 0 78 50" width="100%" height="64" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="#44704B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={`4,50 ${points} 70,50`} fill="rgba(68,112,75,0.12)" />
      {/* arrow head */}
      <path d="M 67 12 L 70 10 L 70 14" fill="none" stroke="#44704B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCell({ visual, value, label, isLast = false }) {
  return (
    <div style={{
      flex: 1,
      padding: '20px 24px',
      borderRight: isLast ? 'none' : '1px solid var(--copi-line)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 0
    }}>
      <div style={{ minHeight: 64, display: 'flex', alignItems: 'center' }}>{visual}</div>
      <div style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 28,
        color: 'var(--copi-ink)',
        lineHeight: 1
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        fontSize: 12,
        color: 'var(--copi-muted)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }}>
        {label}
      </div>
    </div>
  );
}

function ListPanel({ title, items }) {
  return (
    <section style={{
      background: '#FBF8F0',
      border: '1px solid var(--copi-line)',
      borderRadius: 14,
      padding: 24
    }}>
      <h3 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 17,
        color: 'var(--copi-ink)',
        margin: '0 0 16px 0'
      }}>
        {title}
      </h3>
      <ol style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {items.map((label, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              padding: '8px 0',
              borderBottom: i === items.length - 1 ? 'none' : '1px dashed var(--copi-line)',
              fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
              fontSize: 14,
              color: 'var(--copi-ink)'
            }}
          >
            <span style={{
              fontWeight: 600,
              color: '#44704B',
              flexShrink: 0,
              width: 22
            }}>
              {i + 1}.
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AdminHome({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  // Display name — fall back to "Brian" to match the wireframe greeting.
  const firstName = (user?.name || 'Brian').split(' ')[0];

  // Live team stats from the store, with friendly fallbacks.
  const teamMembers = store?.team || [];
  const employeeCount = teamMembers.length || 13;
  const completionPct = Math.round((store?.teamCompletion?.() || 0.72) * 100) || 72;

  const [prompt, setPrompt] = React.useState('');

  const onboardingSteps = [
    'Intro to Milano',
    'Values in the workplace',
    'Learning our products',
    'How to use the machines'
  ];

  const currentLessons = [
    'Coffee history',
    'Origins',
    'Processing',
    'How to serve'
  ];

  return (
    <AdminShell current="home" user={user} cafe={cafe}>
      {/* Greeting */}
      <h1 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 44,
        color: 'var(--copi-ink)',
        margin: '0 0 28px 0',
        letterSpacing: '-0.01em'
      }}>
        {greetingByHour()}, {firstName}.
      </h1>

      {/* Cupper + AI chat prompt */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 40
      }}>
        <div style={{ flexShrink: 0, marginTop: 4 }}>
          <CupperMini size={72} />
        </div>

        <div style={{
          flex: 1,
          background: '#FBF8F0',
          border: '1px solid var(--copi-line)',
          borderRadius: 14,
          padding: '16px 20px'
        }}>
          <div style={{
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--copi-ink)',
            marginBottom: 6
          }}>
            Ask Cupper anything…
          </div>
          <ul style={{
            margin: '0 0 12px 0',
            padding: '0 0 0 18px',
            color: 'var(--copi-muted)',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 13,
            lineHeight: 1.6
          }}>
            <li>try: <em>"what should I train next?"</em></li>
            <li>help me refine the onboarding process</li>
            <li>customize the coffee education</li>
          </ul>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Cupper…"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 999,
                border: '1px solid var(--copi-line)',
                background: '#F5F0E8',
                fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                fontSize: 13,
                color: 'var(--copi-ink)',
                outline: 'none'
              }}
            />
            <button
              onClick={() => setPrompt('')}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                background: '#2D5016',
                color: '#F5F0E8',
                fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ask
            </button>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{
          fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 22,
          color: 'var(--copi-ink)',
          margin: '0 0 16px 0'
        }}>
          Quick Insights
        </h2>

        <div style={{
          background: '#FBF8F0',
          border: '1px solid var(--copi-line)',
          borderRadius: 14,
          display: 'flex',
          overflow: 'hidden'
        }}>
          <StatCell
            visual={<MiniLineChart />}
            value="Trending up"
            label="Quality education"
          />
          <StatCell
            visual={
              <div style={{
                fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 56,
                color: '#2D5016',
                lineHeight: 1
              }}>
                #{employeeCount}
              </div>
            }
            value="Employees"
            label="Active teammates"
          />
          <StatCell
            visual={
              <div style={{
                fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 56,
                color: '#44704B',
                lineHeight: 1
              }}>
                {completionPct}<span style={{ fontSize: 28 }}>%</span>
              </div>
            }
            value="Completion"
            label="Across assigned tracks"
            isLast
          />
        </div>

        <div style={{
          textAlign: 'right',
          marginTop: 8,
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 12,
          color: 'var(--copi-muted)'
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#44704B',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}>
            customize ↗
          </button>
        </div>
      </section>

      {/* Two side-by-side panels */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24
      }}>
        <ListPanel title="Current onboarding steps" items={onboardingSteps} />
        <ListPanel title="Current lessons" items={currentLessons} />
      </section>
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminHome = AdminHome;
}

export default AdminHome;
