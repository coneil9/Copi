import React from 'react';

function BaristaProfileNew({ user = {} }) {
  const th = window.THEME || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW || {};
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const act   = window.CopiActions || {};

  const email    = user.email || 'lili@milano.coffee';
  const dbUser   = store.getUserByEmail ? store.getUserByEmail(email) : null;
  const cafe     = store.getDefaultCafe ? store.getDefaultCafe() : null;
  const locations = cafe ? store.getLocations(cafe.id) : [];
  const locName  = locations.find(l => l.id === (dbUser?.locationId || user.locationId))?.name || user.cafe || 'Milano';

  const joinedDate = dbUser?.joinedAt
    ? new Date(dbUser.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Aug 2025';

  // Real stats from store
  const curriculum = window.COPI_CURRICULUM || [];
  let lessonsDone = 0;
  let certifiedCount = 0;
  curriculum.forEach((v) => {
    const s = store.volumeStats(email, v.id);
    if (s.assigned) { lessonsDone += s.done; if (s.certified) certifiedCount++; }
  });

  // Certification progress
  const assignedVols = curriculum.filter(v => store.volumeStats(email, v.id).assigned);
  const nextVol = assignedVols.find(v => !store.volumeStats(email, v.id).certified);
  const nextStats = nextVol ? store.volumeStats(email, nextVol.id) : null;
  const certPct = nextStats ? Math.round(nextStats.pct * 100) : 100;
  const certLabel = nextVol?.cert || 'Bar Certified';
  const lessonsLeft = nextStats ? nextStats.total - nextStats.done : 0;

  // Settings state
  const displayName = dbUser?.name || user.name || 'Lili Turko';
  const [fullName, setFullName]       = React.useState(displayName);
  const [workEmail, setWorkEmail]     = React.useState(email);
  const [reminders, setReminders]     = React.useState(true);
  const [streakAlerts, setStreakAlerts] = React.useState(true);
  const [saved, setSaved]             = React.useState(false);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  // Monogram avatar
  const Mono = ({ name: n, size = 36 }) => {
    const initials = (n || 'L').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: th.accent, color: th.onDark,
        borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: size * 0.37, fontWeight: 700, letterSpacing: '0.04em',
      }}>{initials}</div>
    );
  };

  // Badge definitions
  const badges = [
    { icon: 'star',  label: 'First lesson',  sub: 'Complete your first lesson', earned: lessonsDone >= 1 },
    { icon: 'flame', label: '7-day streak',  sub: '7 days in a row',            earned: lessonsDone >= 7 },
    { icon: 'cup',   label: 'First cupping', sub: 'Complete Volume I',          earned: curriculum.length > 0 && store.volumeStats(email,'vol-1').certified },
    { icon: 'medal', label: certLabel,        sub: 'Complete Vol II',             earned: certifiedCount >= 2 },
  ];

  const BadgeIcon = ({ kind, color, size = 24 }) => {
    const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (kind === 'star')  return <svg {...c}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" /></svg>;
    if (kind === 'flame') return <svg {...c}><path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5-1-8z" /></svg>;
    if (kind === 'cup')   return <svg {...c}><path d="M5 8h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" /><path d="M16 9h2a2 2 0 0 1 0 4h-2" /><path d="M7 3v2M10 3v2M13 3v2" /></svg>;
    return <svg {...c}><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>;
  };

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick}
      style={{ width: 50, height: 28, flexShrink: 0, borderRadius: 999, background: on ? th.accent : th.bgInset, border: `1.5px solid ${on ? th.accent : th.line}`, position: 'relative', cursor: 'pointer', padding: 0, transition: 'all 160ms' }}
    >
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: on ? th.onDark : th.muted, transition: 'left 180ms cubic-bezier(.2,.7,.2,1)' }} />
    </button>
  );

  const overall = Math.round(store.overallPct(email) * 100);

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.ink }}>

      {/* ── Nav (matches BaristaDashboard) ─────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: `1px solid ${th.line}`, background: th.bgCard, position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic', fontSize: 26, color: th.accent, lineHeight: 1 }}>Copi.</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {[{ l: 'Today', active: false }, { l: 'Library', active: false }, { l: 'Profile', active: true }].map(x => (
            <a key={x.l} style={{
              fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 14, cursor: 'pointer',
              color: x.active ? th.ink : th.muted, fontWeight: x.active ? 600 : 400,
              borderBottom: x.active ? `2px solid ${th.accent}` : '2px solid transparent',
              paddingBottom: 4, textDecoration: 'none', transition: 'color 140ms',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: th.gold, color: th.ink }}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill={th.ink}><path d="M6 0 C 7 3.5, 10 4.5, 10 8.5 C 10 11.5, 8 14, 6 14 C 4 14, 2 11.5, 2 8.5 C 2 6, 3.5 5, 4.5 3.5 C 5 2, 5 1, 6 0 Z" /></svg>
            <span style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 700, fontSize: 13 }}>{overall}%</span>
          </div>
          <Mono name={fullName} size={36} />
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Identity */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Mono name={fullName} size={100} />
          </div>
          <h1 style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontSize: 48, fontWeight: 400, letterSpacing: '-0.02em', color: th.ink, margin: '0 0 8px' }}>{fullName}</h1>
          <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 17, color: th.muted, margin: 0, fontStyle: 'italic' }}>
            Barista at {locName} · joined {joinedDate}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { big: '12',                        label: 'day streak',   color: th.gold },
            { big: String(lessonsDone),          label: 'lessons done', color: th.accent },
            { big: String(certifiedCount + (lessonsDone >= 1 ? 1 : 0) + (lessonsDone >= 7 ? 1 : 0)), label: 'badges',  color: th.ink },
          ].map((s, i) => (
            <div key={i} style={{ background: th.bgCard, borderRadius: th.card, padding: '22px 16px', textAlign: 'center', border: `1px solid ${th.line}`, boxShadow: sh.card }}>
              <div style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic', fontSize: 46, lineHeight: 1, color: s.color, fontWeight: 400 }}>{s.big}</div>
              <div style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.muted, marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Certification card */}
        {nextVol && (
          <div style={{ background: th.accentDeep || '#34503A', color: th.onDark, borderRadius: th.card + 2, padding: '24px 26px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 10px' }}>◆ Certification</p>
              <p style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontSize: 28, fontWeight: 400, lineHeight: 1.2, margin: '0 0 8px' }}>
                Working toward <em style={{ fontStyle: 'italic', color: th.gold }}>{certLabel}.</em>
              </p>
              <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 14, opacity: 0.8, margin: 0 }}>
                {lessonsLeft > 0 ? `${lessonsLeft} lesson${lessonsLeft !== 1 ? 's' : ''} left in ${nextVol.vol} ${nextVol.name}.` : 'Take the final test to certify.'}
              </p>
            </div>
            <div style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic', fontSize: 26, fontWeight: 400, background: th.bgCard, color: th.accent, borderRadius: '50%', width: 80, height: 80, display: 'grid', placeItems: 'center', flexShrink: 0, border: `2px solid ${th.line}`, boxShadow: sh.card }}>
              {certPct}%
            </div>
          </div>
        )}
        {!nextVol && assignedVols.length > 0 && (
          <div style={{ background: th.accent, color: th.onDark, borderRadius: th.card + 2, padding: '20px 24px', marginBottom: 32, textAlign: 'center' }}>
            <p style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontSize: 24, margin: 0 }}>All tracks certified. 🏅</p>
          </div>
        )}

        {/* Badges */}
        <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.accent, textAlign: 'center', margin: '36px 0 18px' }}>◆ Badges</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
          {badges.map((b, i) => (
            <div key={i} style={{ background: th.bgCard, borderRadius: th.card, padding: '20px 10px 16px', textAlign: 'center', border: `1px solid ${th.line}`, boxShadow: sh.card, opacity: b.earned ? 1 : 0.45, transition: 'opacity 200ms' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', margin: '0 auto 10px', background: b.earned ? th.gold : th.bgInset, border: `2px solid ${b.earned ? th.gold + '88' : th.line}`, display: 'grid', placeItems: 'center' }}>
                <BadgeIcon kind={b.icon} color={b.earned ? th.ink : th.muted} size={22} />
              </div>
              <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, color: th.ink, margin: '0 0 3px', lineHeight: 1.2 }}>{b.label}</p>
              {!b.earned && <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.muted, margin: 0 }}>Locked</p>}
            </div>
          ))}
        </div>

        {/* Account settings */}
        <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.accent, textAlign: 'center', margin: '0 0 18px' }}>◆ Account</p>
        <div style={{ background: th.bgCard, borderRadius: th.card + 2, padding: '26px 26px', border: `1px solid ${th.line}`, boxShadow: sh.card, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.muted, display: 'block', marginBottom: 6 }}>Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              style={{ width: '100%', fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 15, padding: '10px 14px', background: th.bg, color: th.ink, border: `1.5px solid ${th.line}`, borderRadius: 10, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = th.accent; }}
              onBlur={e => { e.target.style.borderColor = th.line; }}
            />
          </div>
          <div>
            <label style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.muted, display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={workEmail} onChange={e => setWorkEmail(e.target.value)}
              style={{ width: '100%', fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 15, padding: '10px 14px', background: th.bg, color: th.ink, border: `1.5px solid ${th.line}`, borderRadius: 10, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = th.accent; }}
              onBlur={e => { e.target.style.borderColor = th.line; }}
            />
          </div>

          <div style={{ borderTop: `1px solid ${th.line}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Daily lesson reminders', desc: 'A nudge each day to keep your streak going.', on: reminders, set: setReminders },
              { label: 'Streak alerts', desc: "Let me know when my streak is about to break.", on: streakAlerts, set: setStreakAlerts },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div>
                  <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 15, fontWeight: 500, color: th.ink, margin: '0 0 2px' }}>{row.label}</p>
                  <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 13, color: th.muted, margin: 0 }}>{row.desc}</p>
                </div>
                <Toggle on={row.on} onClick={() => row.set(!row.on)} />
              </div>
            ))}
          </div>

          <button
            onClick={flashSaved}
            style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 14, fontWeight: 500, padding: '10px', borderRadius: 999, background: saved ? th.accent : th.bgInset, border: `1.5px solid ${saved ? th.accent : th.line}`, color: saved ? th.onDark : th.ink, cursor: 'pointer', transition: 'all 200ms', width: '100%' }}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>

        {/* Log out */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button data-app-action="logout" style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.muted, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

window.BaristaProfileNew = BaristaProfileNew;
