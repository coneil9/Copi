// ═════════════════════════════════════════════════════════
// BARISTA PROFILE — typical profile page. Identity, stats,
// badges earned, certification status, and a few simple
// account settings. Same rounded, friendly aesthetic as the
// Today and Library views.
// ═════════════════════════════════════════════════════════

function BaristaProfile({ user = {} }) {
  const p = {
    bg:     '#E8DDC2',
    fg:     '#1A1410',
    accent: '#3F5A3A',
    cream:  '#F4EBD2',
    sun:    '#C68A3D',
    cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub     = { fontFamily: 'Yrsa' };
  const sans    = { fontFamily: 'Lato' };
  const lbl     = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const name = user.name || 'Lili Turko';
  const cafe = user.cafe || 'Milano';
  const email = user.email || 'barista@milano.coffee';

  const [fullName, setFullName] = React.useState(name);
  const [workEmail, setWorkEmail] = React.useState(email);
  const [reminders, setReminders] = React.useState(true);
  const [streakAlerts, setStreakAlerts] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  const Mono = ({ name: n, size = 28, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        borderRadius: '50%', display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const stats = [
    { big: '12', label: 'day streak',   tint: p.sun    },
    { big: '12', label: 'lessons done', tint: p.accent },
    { big: '3',  label: 'badges',       tint: p.fg     },
  ];

  // Earned + locked badges
  const badges = [
    { icon: 'star',   label: 'First lesson',   earned: true  },
    { icon: 'flame',  label: '7-day streak',   earned: true  },
    { icon: 'cup',    label: 'First cupping',  earned: true  },
    { icon: 'medal',  label: 'Foundations',    earned: false },
  ];

  const BadgeIcon = ({ kind, color }) => {
    const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (kind === 'star')  return <svg {...common}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" /></svg>;
    if (kind === 'flame') return <svg {...common}><path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5-1-8z" /></svg>;
    if (kind === 'cup')   return <svg {...common}><path d="M5 8h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" /><path d="M16 9h2a2 2 0 0 1 0 4h-2" /><path d="M7 3v2M10 3v2M13 3v2" /></svg>;
    return <svg {...common}><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>;
  };

  const inputStyle = {
    ...sans, fontSize: 16, fontWeight: 400,
    width: '100%', padding: '13px 16px',
    background: p.bg, color: p.fg,
    border: `1.5px solid ${p.fg}30`, borderRadius: 14,
    outline: 'none',
  };

  const Toggle = ({ on, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 52, height: 30, flex: '0 0 auto', borderRadius: 999,
        background: on ? p.accent : `${p.fg}25`, border: 'none',
        position: 'relative', cursor: 'pointer', padding: 0,
        transition: 'background 160ms ease',
      }}
      aria-pressed={on}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 25 : 3,
        width: 24, height: 24, borderRadius: '50%', background: p.cream,
        transition: 'left 180ms cubic-bezier(.2,.7,.2,1)',
      }} />
    </button>
  );

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg }}>

      {/* ── TOP NAV ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }}>
        <span style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1 }}>Copi</span>
        <div style={{ display: 'flex', gap: 36, ...sans, fontSize: 13 }}>
          {[
            { l: 'Today',   active: false },
            { l: 'Library', active: false },
            { l: 'Profile', active: true  },
          ].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.55,
              fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `2px solid ${p.fg}` : 'none',
              paddingBottom: 4, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: p.sun, color: p.fg }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill={p.fg} aria-hidden="true">
              <path d="M7 0 C 8 4, 12 5, 12 10 C 12 13.5, 9.5 16, 7 16 C 4.5 16, 2 13.5, 2 10 C 2 7, 4 6, 5 4 C 6 2, 6 1, 7 0 Z" />
            </svg>
            <span style={{ ...sans, fontWeight: 700, fontSize: 14 }}>12</span>
          </div>
          <Mono name={fullName} size={36} />
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Identity */}
        <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Mono name={fullName} size={104} />
          </div>
          <h1 style={{ ...display, fontSize: 52, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            {fullName}
          </h1>
          <p style={{ ...sub, fontSize: 20, opacity: 0.7, fontWeight: 400, margin: '10px 0 0', fontStyle: 'italic' }}>
            Barista at {cafe} · joined Aug 2025
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: p.cream, borderRadius: 20, padding: '22px 16px', textAlign: 'center',
              border: `1.5px solid ${p.fg}20`, boxShadow: `0 5px 0 ${p.fg}12`,
            }}>
              <div style={{ ...display, fontStyle: 'italic', fontSize: 48, lineHeight: 1, color: s.tint, fontWeight: 400 }}>{s.big}</div>
              <div style={{ ...lbl, opacity: 0.7, marginTop: 8, fontSize: 9 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Certification status */}
        <div style={{
          marginTop: 18, background: p.accent, color: p.cream, borderRadius: 24,
          padding: '26px 28px', boxShadow: `0 6px 0 ${p.fg}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ ...lbl, opacity: 0.8, marginBottom: 8 }}>◆ CERTIFICATION</div>
            <div style={{ ...display, fontSize: 34, lineHeight: 1, fontWeight: 400 }}>
              Working toward <em style={{ fontStyle: 'italic', color: p.sun }}>Foundations.</em>
            </div>
            <div style={{ ...sans, fontSize: 13.5, opacity: 0.85, marginTop: 8 }}>
              4 lessons left in Volume II.
            </div>
          </div>
          <div style={{
            ...display, fontStyle: 'italic', fontSize: 30, fontWeight: 400,
            background: p.cream, color: p.accent, borderRadius: '50%',
            width: 84, height: 84, display: 'grid', placeItems: 'center', flex: '0 0 auto',
            border: `2px solid ${p.fg}`,
          }}>64%</div>
        </div>

        {/* Badges */}
        <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '52px 0 22px' }}>◆ BADGES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              background: p.cream, borderRadius: 20, padding: '22px 10px 16px', textAlign: 'center',
              border: `1.5px solid ${p.fg}20`,
              opacity: b.earned ? 1 : 0.5,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
                background: b.earned ? p.sun : `${p.fg}15`,
                border: `2px solid ${b.earned ? p.fg : `${p.fg}40`}`,
                display: 'grid', placeItems: 'center',
              }}>
                <BadgeIcon kind={b.icon} color={b.earned ? p.fg : `${p.fg}70`} />
              </div>
              <div style={{ ...sans, fontSize: 11.5, fontWeight: 600, lineHeight: 1.2 }}>{b.label}</div>
              {!b.earned && <div style={{ ...lbl, fontSize: 8, opacity: 0.6, marginTop: 4 }}>LOCKED</div>}
            </div>
          ))}
        </div>

        {/* Account settings */}
        <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '52px 0 22px' }}>◆ ACCOUNT</div>
        <div style={{
          background: p.cream, borderRadius: 24, padding: '28px 28px',
          border: `1.5px solid ${p.fg}20`, boxShadow: `0 6px 0 ${p.fg}12`,
          display: 'grid', gap: 20,
        }}>
          <label style={{ display: 'block' }}>
            <div style={{ ...lbl, marginBottom: 8 }}>NAME</div>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ ...lbl, marginBottom: 8 }}>EMAIL</div>
            <input type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} style={inputStyle} />
          </label>

          <div style={{ height: 1, background: `${p.fg}18` }} />

          {[
            { label: 'Daily lesson reminders', desc: 'A nudge each day to keep your streak.', on: reminders, set: setReminders },
            { label: 'Streak alerts', desc: 'Let me know when my streak is about to break.', on: streakAlerts, set: setStreakAlerts },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.1 }}>{row.label}</div>
                <div style={{ ...sans, fontSize: 13, opacity: 0.6, marginTop: 3 }}>{row.desc}</div>
              </div>
              <Toggle on={row.on} onClick={() => row.set(!row.on)} />
            </div>
          ))}

          <button
            onClick={flashSaved}
            style={{
              marginTop: 6, width: '100%', background: p.accent, color: p.cream,
              border: 'none', borderRadius: 999, padding: '15px 24px',
              ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: `0 5px 0 ${p.fg}`,
            }}
          >
            {saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>

        {/* Sign out */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <span data-app-action="logout" style={{ ...lbl, color: p.cherry, opacity: 0.8, cursor: 'pointer', fontSize: 11 }}>
            LOG OUT
          </span>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { BaristaProfile });
