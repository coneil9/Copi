// ═════════════════════════════════════════════════════════
// ADMIN UI — Shared components used across every dashboard page.
// All animations are driven by classes defined in styles.css and
// respect prefers-reduced-motion through the media query there.
// Tokens come from CSS custom properties — no hardcoded hexes.
// ═════════════════════════════════════════════════════════

import React from 'react';

// ── Hooks ────────────────────────────────────────────────
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else if (mq.removeListener) mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

// ── Animated number ──────────────────────────────────────
// Counts up from 0 to `to` over `duration` ms when mounted.
// Renders any non-numeric suffix verbatim (e.g. "%", "m", "A-").
export function AnimatedNumber({ value, duration = 800, decimals = 0, format }) {
  const reduced = useReducedMotion();
  const numeric = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = Number.isFinite(numeric);
  const suffix = isNumeric && typeof value === 'string'
    ? value.replace(/^[\d.,\-]+/, '')
    : '';

  const [current, setCurrent] = React.useState(reduced || !isNumeric ? numeric : 0);

  React.useEffect(() => {
    if (!isNumeric) return;
    if (reduced) { setCurrent(numeric); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(numeric * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [numeric, duration, reduced, isNumeric]);

  if (!isNumeric) return <>{value}</>;
  const display = format ? format(current) : current.toFixed(decimals);
  return <>{display}{suffix}</>;
}

// ── Progress bar ─────────────────────────────────────────
// Width animates 0 → pct on mount via the .dash-progress-fill class.
export function ProgressBar({
  pct = 0,
  height = 4,
  delay = 120,
  color,           // override fill color
  trackColor = 'rgba(31, 26, 20, 0.08)'
}) {
  const fill = color || (
    pct >= 80 ? 'var(--glade-green-deep)' :
    pct >= 50 ? 'var(--glade-green)' :
    pct >= 30 ? 'var(--ripe-lemon)' :
                'var(--danger-soft)'
  );
  const target = Math.max(0, Math.min(100, pct));
  return (
    <div style={{
      width: '100%',
      height,
      background: trackColor,
      borderRadius: 999,
      overflow: 'hidden'
    }}>
      <div
        className="dash-progress-fill"
        style={{
          height: '100%',
          background: fill,
          borderRadius: 999,
          '--dash-progress': `${target}%`,
          '--dash-delay': `${delay}ms`
        }}
      />
    </div>
  );
}

// ── Status chip ──────────────────────────────────────────
const CHIP_VARIANTS = {
  'On track':   { bg: 'rgba(111, 139, 95, 0.18)', fg: 'var(--glade-green-deep)' },
  'Ahead':      { bg: 'var(--ripe-lemon-soft)',   fg: 'var(--graphite)' },
  'Behind':     { bg: 'rgba(217, 168, 154, 0.55)', fg: 'var(--danger)' },
  'Onboarding': { bg: 'var(--pearl-bush)',         fg: 'var(--roman-coffee)' },
  'Strong':     { bg: 'var(--glade-green)',        fg: 'var(--white)' },
  'Watch':      { bg: 'rgba(130, 106, 76, 0.18)',  fg: 'var(--roman-coffee)' },
  'At risk':    { bg: 'rgba(156, 61, 39, 0.16)',   fg: 'var(--danger)' },
  'Done':       { bg: 'transparent',               fg: 'var(--roman-coffee)' },
  'In progress':{ bg: 'transparent',               fg: 'var(--glade-green-deep)' },
  'Up next':    { bg: 'transparent',               fg: 'var(--heathered-gray)' },
  'Active':     { bg: 'rgba(111, 139, 95, 0.18)',  fg: 'var(--glade-green-deep)' },
  'Paid':       { bg: 'var(--glade-green)',        fg: 'var(--white)' }
};

export function StatusChip({ label, variant, delay = 200, style = {} }) {
  const v = CHIP_VARIANTS[variant || label] || CHIP_VARIANTS['On track'];
  return (
    <span
      className="dash-chip-in"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 999,
        background: v.bg,
        color: v.fg,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        '--dash-delay': `${delay}ms`,
        ...style
      }}
    >
      {label}
    </span>
  );
}

// ── Delta badge (▲12% / ▼26%) ────────────────────────────
export function DeltaBadge({ value, tone = 'up' }) {
  const isDown = tone === 'down' || (typeof value === 'string' && value.startsWith('-'));
  const fg = isDown ? 'var(--danger)' : 'var(--glade-green-deep)';
  const bg = isDown ? 'rgba(156, 61, 39, 0.12)' : 'rgba(111, 139, 95, 0.18)';
  const arrow = isDown ? '▼' : '▲';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 9px',
      borderRadius: 999,
      background: bg,
      color: fg,
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.02em'
    }}>
      <span style={{ fontSize: 9 }}>{arrow}</span>
      {String(value).replace(/^[-+]/, '')}
    </span>
  );
}

// ── Stat card ────────────────────────────────────────────
export function StatCard({
  label,
  value,
  supporting,
  delta,
  deltaTone,
  badge,            // alt to delta — pass a JSX node instead
  progress,         // 0-100, optional
  progressColor,
  staggerIndex = 0,
  baseDelay = 0
}) {
  return (
    <article
      className="dash-stagger-item dash-card-hover"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--pearl-bush)',
        borderRadius: 14,
        padding: '18px 20px 16px',
        boxShadow: '0 1px 2px rgba(31, 26, 20, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minWidth: 0,
        '--dash-delay': `${baseDelay + staggerIndex * 60}ms`
      }}
    >
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--heathered-gray)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>
          {label}
        </span>
        {badge ?? (delta != null && <DeltaBadge value={delta} tone={deltaTone} />)}
      </header>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 38,
        lineHeight: 1,
        color: 'var(--graphite)',
        letterSpacing: '-0.01em'
      }}>
        <AnimatedNumber value={value} />
      </div>

      {supporting && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--roman-coffee)'
        }}>
          {supporting}
        </div>
      )}

      {progress != null && (
        <div style={{ marginTop: 4 }}>
          <ProgressBar
            pct={progress}
            height={3}
            color={progressColor}
            delay={baseDelay + staggerIndex * 60 + 200}
          />
        </div>
      )}
    </article>
  );
}

// ── Surface card (generic panel) ─────────────────────────
export function Card({ children, style = {}, className = '' }) {
  return (
    <section
      className={`dash-card-hover ${className}`.trim()}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--pearl-bush)',
        borderRadius: 14,
        padding: 24,
        boxShadow: '0 1px 2px rgba(31, 26, 20, 0.03)',
        ...style
      }}
    >
      {children}
    </section>
  );
}

// ── Section header with optional right-aligned action link ──
export function SectionHeader({ title, action, actionHref }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 19,
        color: 'var(--graphite)',
        margin: 0,
        letterSpacing: '-0.005em'
      }}>
        {title}
      </h2>
      {action && (
        <button
          onClick={typeof action === 'object' ? action.onClick : undefined}
          className="dash-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--glade-green-deep)',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {typeof action === 'object' ? action.label : action} →
        </button>
      )}
    </header>
  );
}

// ── Page header (eyebrow + Playpen title) ───────────────
export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--roman-coffee)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          {eyebrow}
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 24,
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 40,
            color: 'var(--graphite)',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.05
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--roman-coffee)',
              margin: '10px 0 0 0',
              maxWidth: 560,
              lineHeight: 1.5
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Button primitives ────────────────────────────────────
export function PrimaryButton({ children, onClick, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="dash-btn"
      style={{
        background: 'var(--glade-green-deep)',
        color: 'var(--white)',
        border: 'none',
        padding: '11px 22px',
        borderRadius: 999,
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="dash-btn"
      style={{
        background: 'transparent',
        color: 'var(--glade-green-deep)',
        border: '1.5px solid var(--glade-green-deep)',
        padding: '10px 20px',
        borderRadius: 999,
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  );
}

// ── Avatar with initials ─────────────────────────────────
export function Avatar({ name, size = 36, bg = 'var(--glade-green-deep)' }) {
  const initials = (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      color: 'var(--alabaster)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: size * 0.32,
      letterSpacing: '0.04em',
      flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

// ── Activity item ────────────────────────────────────────
const ACTIVITY_DOT_COLOR = {
  done:    'var(--glade-green)',
  active:  'var(--ripe-lemon)',
  system:  'var(--heathered-gray)'
};

export function ActivityItem({ kind = 'done', body, time, pulse = false, staggerIndex = 0 }) {
  return (
    <div
      className="dash-stagger-item"
      style={{
        display: 'flex',
        gap: 12,
        padding: '8px 0',
        '--dash-delay': `${staggerIndex * 60 + 100}ms`
      }}
    >
      <span
        className={pulse ? 'dash-dot-pulse' : ''}
        style={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: ACTIVITY_DOT_COLOR[kind] || ACTIVITY_DOT_COLOR.done,
          marginTop: 7,
          flexShrink: 0,
          display: 'block'
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--graphite)',
          lineHeight: 1.45
        }}>
          {body}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--heathered-gray)',
          marginTop: 2
        }}>
          {time}
        </div>
      </div>
    </div>
  );
}

// ── Weekly bar chart ─────────────────────────────────────
export function WeeklyBarChart({ data, todayIndex = -1, height = 220 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${data.length}, 1fr)`,
      gap: 14,
      alignItems: 'end',
      height
    }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 50);
        const isToday = i === todayIndex;
        return (
          <div key={d.label} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            height: '100%',
            justifyContent: 'flex-end'
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--graphite)'
            }}>
              {d.value}
            </span>
            <div
              className="dash-bar-grow"
              style={{
                width: '70%',
                maxWidth: 64,
                height: h,
                minHeight: 6,
                borderRadius: 8,
                background: isToday ? 'var(--glade-green-deep)' : 'var(--glade-green-sage)',
                '--dash-delay': `${100 + i * 40}ms`
              }}
            />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--heathered-gray)',
              letterSpacing: '0.04em'
            }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Onboarding step row ──────────────────────────────────
export function OnboardingStep({ index, title, state = 'done', staggerIndex = 0 }) {
  const isDone = state === 'done';
  const isProgress = state === 'in-progress';
  const stateLabel = isDone ? 'Done' : isProgress ? 'In progress' : 'Up next';

  return (
    <div
      className="dash-stagger-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 0',
        borderTop: index === 1 ? 'none' : '1px solid var(--pearl-bush)',
        '--dash-delay': `${(staggerIndex) * 60 + 100}ms`
      }}
    >
      {isDone ? (
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--glade-green)',
          color: 'var(--white)',
          display: 'grid', placeItems: 'center',
          flexShrink: 0
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6.5L4.8 9L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: isProgress ? 'transparent' : 'transparent',
          border: `1.5px solid ${isProgress ? 'var(--glade-green-deep)' : 'var(--heathered-gray)'}`,
          color: isProgress ? 'var(--glade-green-deep)' : 'var(--heathered-gray)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0
        }}>
          {index}
        </div>
      )}
      <div style={{
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: isDone ? 'var(--graphite)' : isProgress ? 'var(--graphite)' : 'var(--heathered-gray)',
        fontWeight: isProgress ? 600 : 400,
        textDecoration: isDone ? 'none' : 'none'
      }}>
        {title}
      </div>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: isProgress ? 600 : 400,
        color: isDone
          ? 'var(--heathered-gray)'
          : isProgress
            ? 'var(--glade-green-deep)'
            : 'var(--heathered-gray)'
      }}>
        {stateLabel}
      </span>
    </div>
  );
}

// ── Current-lesson row ───────────────────────────────────
export function LessonRow({ index, title, pct, staggerIndex = 0 }) {
  return (
    <div
      className="dash-stagger-item"
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr 56px',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        '--dash-delay': `${staggerIndex * 60 + 100}ms`
      }}
    >
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--heathered-gray)',
        fontWeight: 600
      }}>
        {index}
      </span>
      <div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--graphite)',
          marginBottom: 6,
          fontWeight: 500
        }}>
          {title}
        </div>
        <ProgressBar pct={pct} height={3} delay={staggerIndex * 60 + 220} />
      </div>
      <span style={{
        textAlign: 'right',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--graphite)',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }}>
        {pct}%
      </span>
    </div>
  );
}

// ── Ask Cupper widget ────────────────────────────────────
// Wide horizontal layout: Cupper + title block on the left, prompt
// chips + input on the right. Designed to span the full content width
// at the top of a page (the home dashboard hero spot).
export function AskCupperCard({ prompts = [], onAsk }) {
  const [value, setValue] = React.useState('');
  return (
    <Card style={{ padding: 24 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
        gap: 32,
        alignItems: 'center'
      }}>
        {/* Left: Cupper + title block */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
          <img
            src="/assets/cupper-ai.png"
            alt="Cupper"
            width={72}
            height={Math.round(72 * (1108 / 944))}
            style={{ display: 'block', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 4
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 19,
                color: 'var(--graphite)'
              }}>
                Ask Cupper
              </div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 10px',
                borderRadius: 999,
                background: 'rgba(111, 139, 95, 0.16)',
                color: 'var(--glade-green-deep)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--glade-green)'
                }} />
                Online
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--roman-coffee)',
              lineHeight: 1.4
            }}>
              Your coffee-training copilot
            </div>
          </div>
        </div>

        {/* Right: prompt chips + input row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }}>
            {prompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setValue(p)}
                className="dash-chip-btn"
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'var(--alabaster)',
                  border: '1px solid var(--pearl-bush)',
                  color: 'var(--graphite)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{
            display: 'flex',
            gap: 8,
            background: 'var(--alabaster)',
            border: '1px solid var(--pearl-bush)',
            borderRadius: 999,
            padding: 4
          }}>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask Cupper anything…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '10px 18px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--graphite)'
              }}
            />
            <button
              type="button"
              onClick={() => { onAsk && onAsk(value); setValue(''); }}
              className="dash-btn"
              style={{
                background: 'var(--glade-green-deep)',
                color: 'var(--white)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 999,
                fontFamily: 'var(--font-body)',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Expose for any inline-JSX call sites in App.jsx (none currently, but consistent with rest of app).
if (typeof window !== 'undefined') {
  window.AdminUI = {
    AnimatedNumber, ProgressBar, StatusChip, DeltaBadge,
    StatCard, Card, SectionHeader, PageHeader,
    PrimaryButton, SecondaryButton, Avatar,
    ActivityItem, WeeklyBarChart, OnboardingStep, LessonRow, AskCupperCard,
    useReducedMotion
  };
}
