// ═════════════════════════════════════════════════════════
// ADMIN ANALYTICS — what the manager needs to coach the floor.
// Team progress, where knowledge is thin, and a concrete
// on-bar drill for each gap. Almanac styling, matches the
// dashboard / curriculum console.
// ═════════════════════════════════════════════════════════

function AdminAnalyticsPage({ user = {} }) {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub     = { fontFamily: 'Yrsa' };
  const sans    = { fontFamily: 'Lato' };
  const lbl     = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono    = { fontFamily: 'Lato', fontVariantNumeric: 'tabular-nums' };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';

  // ── Top stats ──────────────────────────────────────────────
  const store = window.useCopiStore();
  const relTime = (ts) => {
    if (!ts) return 'no activity yet';
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + ' days ago';
  };
  const lastActive = (email) => {
    const u = store.raw().users[email];
    if (!u) return 0;
    let m = 0;
    Object.values(u.lessons).forEach((r) => { if (r.ts > m) m = r.ts; });
    Object.values(u.finals || {}).forEach((r) => { if (r.ts > m) m = r.ts; });
    return m;
  };
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const snapshot = store.teamSnapshot();
  const needsAttention = snapshot.filter((t) => t.pct < 35).length;

  const stats = [
    { label: 'TEAM COMPLETION', big: Math.round(store.teamCompletion() * 100) + '%', sub: 'across assigned volumes' },
    { label: 'LESSONS / WEEK',  big: String(store.lessonsThisWeek()), sub: 'team · last 7 days' },
    { label: 'AVG QUIZ SCORE',  big: Math.round(store.avgScore() * 100) + '%', sub: 'across all checks' },
    { label: 'NEEDS ATTENTION', big: String(needsAttention), sub: 'baristas under 35%', alert: needsAttention > 0 },
  ];

  // ── Per-barista progress (live) ────────────────────────────
  const team = snapshot.map((t) => {
    const ts = lastActive(t.email);
    const flag = t.pct >= 80 ? 'strong' : t.pct >= 55 ? 'ok' : t.pct >= 35 ? 'watch' : 'risk';
    const trend = ts >= weekAgo ? 'up' : flag === 'risk' ? 'down' : 'steady';
    return { name: t.name, role: t.role, cert: t.cert, prog: t.pct, trend, active: relTime(ts), flag };
  });

  // ── Knowledge gaps + how to train them on bar ──────────────
  // Milano's own onboarding knowledge — the stuff Brian used to teach
  // off a laminated sheet — now tracked alongside the coffee skills.
  const gaps = [
    {
      topic: 'Introduction to Milano', vol: 'MILANO · CAFÉ', pass: 41, sev: 'HIGH',
      note: "New hires can't yet tell a customer what makes Milano different — the story, the blends, the why.",
      drill: 'At pre-shift, each new hire gives the 60-second Milano story to the team. The lead coaches it until it lands naturally with a customer.',
    },
    {
      topic: 'Milano standards & expectations', vol: 'MILANO · CAFÉ', pass: 49, sev: 'HIGH',
      note: 'The non-negotiables that used to live on the laminated sheet — service, cleanliness, ticket times — are inconsistent shift to shift.',
      drill: 'Walk the standards checklist together on the first shift and sign off each line. Re-check one section at every handover for the first two weeks.',
    },
    {
      topic: 'The house recipes', vol: 'MILANO · BAR', pass: 55, sev: 'MED',
      note: 'Cognac and Butter aren’t dialed to the house spec consistently — shots drift between baristas.',
      drill: 'Morning dial-in against the Milano recipe card: pull Cognac and Butter to spec, taste together, and only open the bar once both match the target.',
    },
    {
      topic: 'Knowing the menu', vol: 'MILANO · BAR', pass: 58, sev: 'MED',
      note: 'Team struggles to describe Cognac vs. Butter vs. Brian’s Summertime to a customer in plain language.',
      drill: 'At handover, each barista pitches one blend to the group in two sentences — no jargon. Rotate which blend each day.',
    },
    {
      topic: 'Origin & history', vol: 'VOL · I', pass: 73, sev: 'LOW',
      note: 'Solid overall — a few new hires still shaky on regions.',
      drill: 'Put a one-line origin story next to each coffee on the menu board this week. Rotate who writes it.',
    },
  ];

  const sevColor = (s) => s === 'HIGH' ? p.cherry : s === 'MED' ? p.sun : p.accent;

  // ── Initials monogram ──────────────────────────────────────
  const Mono = ({ name: n, size = 26, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`, display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const Bar = ({ value, color = p.fg, height = 8 }) => (
    <div style={{ width: '100%', height, background: `${p.fg}15`, border: `1px solid ${p.fg}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value)}%`, height: '100%', background: color }} />
    </div>
  );

  const Trend = ({ dir }) => {
    const c = dir === 'up' ? p.accent : dir === 'down' ? p.cherry : `${p.fg}70`;
    const d = dir === 'up' ? 'M3 13l5-6 4 4 6-7' : dir === 'down' ? 'M3 5l5 6 4-4 6 7' : 'M3 10h16';
    return (
      <svg width="22" height="16" viewBox="0 0 22 18" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
        {dir !== 'steady' && <path d={dir === 'up' ? 'M14 4h5v5' : 'M14 14h5v-5'} />}
      </svg>
    );
  };

  const flagMap = {
    strong: { label: 'STRONG', bg: p.accent, fg: p.cream },
    ok:     { label: 'ON TRACK', bg: 'transparent', fg: p.fg, border: true },
    watch:  { label: 'WATCH', bg: p.sun, fg: p.fg },
    risk:   { label: 'AT RISK', bg: p.cherry, fg: p.cream },
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── TOP NAV ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
          <span style={{ ...lbl, opacity: 0.55, paddingLeft: 14, borderLeft: `1px solid ${p.fg}40`, alignSelf: 'center' }}>
            FOR ROASTERIES · {cafe.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {[
            { l: 'Dashboard',  active: false },
            { l: 'Team',       active: false },
            { l: 'Curriculum', active: false },
            { l: 'Analytics',  active: true  },
            { l: 'Settings',   active: false },
          ].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.7,
              fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `1.5px solid ${p.fg}` : 'none',
              paddingBottom: 2, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
            <span style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, borderRadius: 99, background: p.cherry, border: `1.5px solid ${p.bg}` }} />
          </button>
          <button data-app-action="invite" style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg, padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
          }}>+ Invite barista</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADING + STATS ──────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 40px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ ANALYTICS · NOV 2026</div>
        <h1 style={{ ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0 }}>
          Where your team<br /><em style={{ fontStyle: 'italic', color: p.accent }}>stands.</em>
        </h1>
        <p style={{ ...sub, fontSize: 22, lineHeight: 1.4, opacity: 0.75, marginTop: 18, fontWeight: 400, maxWidth: 680 }}>
          What everyone's learned, where the knowledge is thin, and exactly how to close each gap on the bar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 44, border: `1.5px solid ${p.fg}` }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '24px 24px',
              borderRight: i < 3 ? `1px solid ${p.fg}30` : 'none',
              background: s.alert ? 'rgba(122,43,31,0.10)' : 'transparent',
            }}>
              <div style={{ ...lbl, fontSize: 9, opacity: 0.65 }}>{s.label}</div>
              <div style={{ ...display, fontSize: 60, lineHeight: 0.95, marginTop: 10, fontWeight: 400, color: s.alert ? p.cherry : p.fg, ...mono }}>{s.big}</div>
              <div style={{ ...sans, fontSize: 12, opacity: 0.6, marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TEAM PROGRESS ────────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 1, background: p.accent }} />TEAM PROGRESS
        </div>
        <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 28px' }}>
          Everyone, <em style={{ fontStyle: 'italic', color: p.accent }}>at a glance.</em>
        </h2>

        <div style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.6fr 0.7fr 1fr',
            gap: 18, padding: '14px 24px', borderBottom: `1.5px solid ${p.fg}`, ...lbl, fontSize: 9, opacity: 0.7,
          }}>
            <span>BARISTA</span><span>CERT</span><span>OVERALL PROGRESS</span><span>TREND</span><span>STATUS</span>
          </div>
          {team.map((t, i) => {
            const fm = flagMap[t.flag];
            return (
              <div key={t.name} style={{
                display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.6fr 0.7fr 1fr',
                gap: 18, padding: '18px 24px', alignItems: 'center',
                borderBottom: i < team.length - 1 ? `1px dashed ${p.fg}25` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Mono name={t.name} size={32} bg={t.flag === 'risk' ? p.cherry : p.accent} />
                  <div>
                    <div style={{ ...sub, fontSize: 18, fontWeight: 500, lineHeight: 1.05 }}>{t.name}</div>
                    <div style={{ ...lbl, fontSize: 8, opacity: 0.5, marginTop: 2 }}>{t.role.toUpperCase()} · {t.active.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ ...lbl, fontSize: 9, color: t.cert === '—' ? `${p.fg}50` : p.accent }}>
                  {t.cert === '—' ? '—' : `◆ ${t.cert.toUpperCase()}`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}><Bar value={t.prog} color={t.flag === 'risk' ? p.cherry : p.accent} /></div>
                  <span style={{ ...mono, fontSize: 14, fontWeight: 700, minWidth: 38, textAlign: 'right' }}>{t.prog}%</span>
                </div>
                <div><Trend dir={t.trend} /></div>
                <div>
                  <span style={{
                    ...lbl, fontSize: 8.5, padding: '4px 9px',
                    background: fm.bg, color: fm.fg,
                    border: fm.border ? `1px solid ${p.fg}40` : 'none',
                  }}>{fm.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── KNOWLEDGE GAPS + HOW TO TRAIN ────────────────────────── */}
      <div style={{ padding: '64px 48px 80px' }}>
        <div style={{ ...lbl, color: p.cherry, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 1, background: p.cherry }} />KNOWLEDGE GAPS · RANKED
        </div>
        <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 12px' }}>
          What's <em style={{ fontStyle: 'italic', color: p.cherry }}>thin</em> — and how to fix it.
        </h2>
        <p style={{ ...sub, fontSize: 19, lineHeight: 1.4, opacity: 0.72, margin: '0 0 36px', fontWeight: 400, maxWidth: 620 }}>
          Sorted by where the team struggles most. Each one comes with a drill you can run on the floor this week.
        </p>

        <div style={{ display: 'grid', gap: 18 }}>
          {gaps.map((g, i) => (
            <div key={i} style={{ border: `1.5px solid ${p.fg}`, background: p.cream, display: 'grid', gridTemplateColumns: '1.1fr 1.4fr' }}>
              {/* Left — the gap */}
              <div style={{ padding: '26px 28px', borderRight: `1.5px solid ${p.fg}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div style={{ ...lbl, fontSize: 9, opacity: 0.55 }}>{g.vol}</div>
                  <span style={{ ...lbl, fontSize: 8.5, padding: '4px 9px', background: sevColor(g.sev), color: g.sev === 'MED' ? p.fg : p.cream }}>
                    {g.sev} GAP
                  </span>
                </div>
                <h3 style={{ ...display, fontSize: 34, lineHeight: 1.0, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>{g.topic}</h3>
                <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.4, opacity: 0.7, marginTop: 12 }}>{g.note}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
                  <div style={{ flex: 1 }}><Bar value={g.pass} color={sevColor(g.sev)} height={8} /></div>
                  <span style={{ ...mono, fontSize: 14, fontWeight: 700 }}>{g.pass}%</span>
                </div>
                <div style={{ ...lbl, fontSize: 8, opacity: 0.5, marginTop: 6 }}>FIRST-ATTEMPT PASS RATE</div>
              </div>
              {/* Right — the drill */}
              <div style={{ padding: '26px 28px', background: 'rgba(63,90,58,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ ...lbl, color: p.accent, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 12, height: 1, background: p.accent }} />ON-BAR DRILL
                </div>
                <p style={{ ...sub, fontSize: 21, lineHeight: 1.4, fontWeight: 400 }}>{g.drill}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  <button style={{
                    ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: p.accent, color: p.cream, padding: '11px 18px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
                  }}>Assign drill →</button>
                  <button style={{
                    ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: 'transparent', color: p.fg, padding: '11px 18px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
                  }}>See lesson</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { AdminAnalyticsPage });
