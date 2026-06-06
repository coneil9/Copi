// ═════════════════════════════════════════════════════════
// ROASTER DASHBOARD — First screen after login
// Almanac aesthetic · Editorial workspace
// Built for a roastery admin: their team, sign-offs, lessons
// ═════════════════════════════════════════════════════════

function RoasterDashboard({ user = {} }) {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F',
    rule: '#7A6B4E'
  };
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono = { fontFamily: 'Lato', fontVariantNumeric: 'tabular-nums' };

  const name = user.name || 'Brian';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';

  // ── Fake team for the demo ─────────────────────────────────
  const store = window.useCopiStore();
  const relTime = (ts) => {
    if (!ts) return 'no activity';
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + 'd ago';
  };
  const lastActive = (email) => {
    const u = store.raw().users[email];
    if (!u) return 0;
    let m = 0;
    Object.values(u.lessons).forEach((r) => { if (r.ts > m) m = r.ts; });
    Object.values(u.finals || {}).forEach((r) => { if (r.ts > m) m = r.ts; });
    return m;
  };
  const roman = (num) => ({ '01': 'I', '02': 'II', '03': 'III' }[num] || '—');
  const shortName = (full) => {
    const parts = full.split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : full;
  };

  const team = store.teamSnapshot().map((t) => {
    const cur = store.currentLesson(t.email);
    const ts = lastActive(t.email);
    const hrs = ts ? (Date.now() - ts) / 3600000 : Infinity;
    const status = hrs < 6 ? 'on-bar' : hrs < 72 ? 'studying' : 'paused';
    let pending = false, next = 'All caught up', vol = '—';
    if (cur) {
      vol = roman(cur.vol.num);
      if (cur.isFinal) { pending = true; next = `${cur.vol.name} — final test`; }
      else { next = cur.lesson.title; }
    }
    return { name: shortName(t.name), role: t.role, vol, prog: t.prog || t.pct, last: relTime(ts), next, status, pending, cert: t.cert };
  });

  const pendingSignoffs = team.filter((t) => t.pending);
  const onBarNow = team.filter((t) => t.status === 'on-bar');

  const stats = [
  { label: 'ACTIVE BARISTAS', big: String(store.team.length), sub: 'on Copi' },
  { label: 'LESSONS / WEEK', big: String(store.lessonsThisWeek()), sub: 'last 7 days' },
  { label: 'READY TO CERTIFY', big: String(pendingSignoffs.length), sub: 'final tests unlocked', alert: pendingSignoffs.length > 0 },
  { label: 'TEAM COMPLETION', big: Math.round(store.teamCompletion() * 100) + '%', sub: 'assigned volumes' }];


  const volumeProgress = store.curriculum.map((v) => {
    const ts = store.teamVolumeStats(v.id);
    return { vol: v.vol, num: v.num, name: v.name, active: ts.inProgress, completed: ts.completed };
  });


  // Avatar — a monogram tile
  const Mono = ({ name: n, size = 28, accent }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: accent || p.bg,
        border: `1px solid ${p.fg}`,
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700,
        color: accent ? p.cream : p.fg,
        letterSpacing: '0.04em', flex: '0 0 auto'
      }}>{initials}</div>);

  };

  const statusPill = (s) => {
    const map = {
      'on-bar': { bg: p.accent, fg: p.cream, label: 'ON BAR' },
      'studying': { bg: p.bg, fg: p.fg, label: 'STUDYING' },
      'paused': { bg: '#00000018', fg: p.fg, label: 'PAUSED' }
    }[s];
    return (
      <span style={{
        ...lbl, fontSize: 9, padding: '3px 7px',
        background: map.bg, color: map.fg,
        border: s === 'studying' ? `1px solid ${p.fg}30` : 'none'
      }}>{map.label}</span>);

  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── LOGGED-IN NAV ───────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
          <span style={{ ...lbl, opacity: 0.55, paddingLeft: 14, borderLeft: `1px solid ${p.fg}40`, alignSelf: 'center' }}>
            FOR ROASTERIES · {cafe.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {[
          { l: 'Dashboard', active: true },
          { l: 'Team', active: false },
          { l: 'Curriculum', active: false },
          { l: 'Analytics', active: false },
          { l: 'Settings', active: false }].
          map((x) =>
          <a key={x.l} data-app-nav={x.l} style={{
            opacity: x.active ? 1 : 0.7,
            fontWeight: x.active ? 700 : 400,
            borderBottom: x.active ? `1.5px solid ${p.fg}` : 'none',
            paddingBottom: 2, cursor: 'pointer'
          }}>{x.l}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Bell with badge */}
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 7, height: 7, borderRadius: 99, background: p.cherry,
              border: `1.5px solid ${p.bg}`
            }} />
          </button>
          <button data-app-action="invite" style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg,
            padding: '10px 14px', border: `1.5px solid ${p.fg}`
          }}>
            + Invite barista
          </button>
          {/* User pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} accent={p.accent} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GREETING + STATS ───────────────────────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'end' }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ TODAY · A WORKING DAY</div>
            <h1 style={{
              ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0
            }}>
              Good morning,<br />
              <em style={{ fontStyle: 'italic', color: p.accent }}>{name}.</em>
            </h1>
          </div>

          {/* Right-side Copi AI panel — no box; fluid & abstract by design */}
          <aside style={{
            padding: '8px 4px 0 24px',
            display: 'flex', flexDirection: 'column', gap: 34
          }}>
            {/* Bloom — Copi's AI editor. Wordmark + Ink Splash mark, breathing on the page */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
              <span style={{
                ...display, fontStyle: 'italic', fontSize: 108, lineHeight: 0.85,
                letterSpacing: '-0.04em', color: p.fg
              }}>Copi AI

              </span>
              <svg width="84" height="84" viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
                {/* Inkblot */}
                <path
                  d="M 12 6 C 16 6, 18.7 8, 18.7 12 C 18.7 16.7, 15.3 18.7, 12 18.7 C 8 18.7, 5.3 16, 5.3 12 C 5.3 8, 8.3 6, 12 6 Z"
                  fill={p.fg} />
                
                {/* Splash droplets — moss pair + sun pair */}
                <circle cx="19.5" cy="4.5" r="1" fill={p.accent} />
                <circle cx="4.5" cy="20" r="0.85" fill={p.accent} />
                <circle cx="21.4" cy="18.7" r="0.7" fill={p.sun} />
                <circle cx="2.6" cy="7.4" r="0.7" fill={p.sun} />
                {/* Cross spark in the center */}
                <path
                  d="M 12 9.6 L 12 14.4 M 9.6 12 L 14.4 12"
                  stroke={p.cream}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none" />
                
              </svg>
            </div>

            {/* Three flowing actions — no rectangles, no rigid grid.
                   Italic numerals, italic serif copy, hairline dashed dividers,
                   and a small ink-drop bullet whose size varies per row so the
                   column feels like splashed thought rather than a UI list. */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
              { l: 'Upload business context', num: 'i', drop: 8 },
              { l: 'Customize curriculum', num: 'ii', drop: 5 },
              { l: 'Team insights', num: 'iii', drop: 10 }].
              map((b, i, arr) =>
              <button
                key={i}
                data-copi-action={b.num}
                style={{
                  appearance: 'none',
                  background: 'transparent',
                  border: 'none',
                  borderTop: `1px dashed ${p.fg}55`,
                  borderBottom: i === arr.length - 1 ? `1px dashed ${p.fg}55` : 'none',
                  padding: '20px 0 22px',
                  display: 'grid',
                  gridTemplateColumns: '38px 14px 1fr auto',
                  columnGap: 14,
                  alignItems: 'baseline',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: p.fg
                }}>
                
                  <span style={{
                  ...display, fontStyle: 'italic', fontSize: 26,
                  color: p.accent, lineHeight: 1, letterSpacing: '-0.01em'
                }}>
                    {b.num}
                  </span>
                  {/* tiny ink-drop bullet — irregular size = irregular thought */}
                  <span style={{
                  display: 'inline-block',
                  width: b.drop, height: b.drop,
                  background: i === 1 ? p.sun : p.fg,
                  borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
                  transform: `translateY(${-b.drop / 3}px) rotate(${i * 22}deg)`
                }} />
                  <span style={{
                  ...display, fontStyle: 'italic', fontSize: 26, fontWeight: 400,
                  lineHeight: 1.15, letterSpacing: '-0.012em'
                }}>
                    {b.l}
                  </span>
                  <span style={{ ...sans, fontSize: 18, opacity: 0.55 }}>→</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── MILANO'S COFFEE → CUSTOM CURRICULUM ─────────────────── */}
      <div style={{ padding: '56px 48px', borderBottom: `1.5px solid ${p.fg}`, borderTop: `1.5px solid ${p.fg}`, background: p.cream }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 8 }}>◆ BUILT FROM YOUR COFFEE</div>
            <h2 style={{ ...display, fontSize: 42, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
              Milano's blends, <em style={{ fontStyle: 'italic', color: p.accent }}>turned into lessons.</em>
            </h2>
            <p style={{ ...sub, fontSize: 17, lineHeight: 1.4, opacity: 0.7, marginTop: 10, fontWeight: 400, maxWidth: 560 }}>
              Bloom reads your coffee list and writes a lesson for each one — so your team learns the coffee they actually pour.
            </p>
          </div>
          <button data-app-action="openlesson" style={{
            ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg, padding: '11px 16px', border: `1.5px solid ${p.fg}`, cursor: 'pointer', whiteSpace: 'nowrap'
          }}>Edit coffee list →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: `1.5px solid ${p.fg}` }}>
          {[
            {
              name: 'Cognac', price: 'from CA$27.50', notes: ['Anise', 'Vanilla', 'Burnt Orange'],
              blurb: "A nine-bean mix of micro-region, climate-specific washed, natural and honey'd single origins. A boozy fruit-and-spice espresso blend with a rich finish.",
              lessons: 3,
            },
            {
              name: 'Butter', price: 'from CA$27.50', notes: ['Complex Caramels', 'Rich Texture'],
              blurb: 'A fusion of 10 single-origin coffees. Rich, buttery, sublime texture and body — a balanced, round and smooth espresso blend.',
              lessons: 3,
            },
            {
              name: "Brian's Summertime", price: 'from CA$24.50', notes: ['Complex', 'Juicy', 'Refreshing'],
              blurb: 'A full spectrum of fruit and flower flavours and aromas. Rich with proteins and fats, leading to an amazing body.',
              lessons: 2,
            },
          ].map((c, i) => (
            <div key={c.name} style={{
              padding: '26px 26px',
              borderRight: i < 2 ? `1px solid ${p.fg}30` : 'none',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                <h3 style={{ ...display, fontSize: 34, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>{c.name}</h3>
                <span style={{ ...lbl, fontSize: 9, opacity: 0.55, whiteSpace: 'nowrap' }}>{c.price}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {c.notes.map((n) => (
                  <span key={n} style={{
                    ...lbl, fontSize: 8.5, padding: '4px 8px',
                    border: `1px solid ${p.fg}40`, color: p.fg, opacity: 0.85,
                  }}>{n}</span>
                ))}
              </div>
              <p style={{ ...sans, fontSize: 13, lineHeight: 1.45, opacity: 0.72, marginTop: 14, flex: 1 }}>{c.blurb}</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, paddingTop: 14,
                borderTop: `1px dashed ${p.fg}30`,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent, flex: '0 0 auto' }} />
                <span style={{ ...lbl, fontSize: 9, color: p.accent }}>{c.lessons} LESSONS GENERATED</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BODY — TEAM TABLE + RIGHT RAIL ──────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 0,
        borderBottom: `1.5px solid ${p.fg}`
      }}>
        {/* LEFT — TEAM TABLE */}
        <section style={{ padding: '48px 48px', borderRight: `1.5px solid ${p.fg}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <div>
              <div style={{ ...lbl, color: p.accent, marginBottom: 6 }}>◆ YOUR TEAM</div>
              <h2 style={{ ...display, fontSize: 42, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
                Six baristas <em style={{ fontStyle: 'italic', color: p.accent }}>pouring.</em>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {['All', 'On bar', 'Studying', 'Paused'].map((f, i) =>
              <button key={f} style={{
                ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 12px',
                background: i === 0 ? p.fg : 'transparent',
                color: i === 0 ? p.cream : p.fg,
                border: `1px solid ${p.fg}`
              }}>{f}</button>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
            {/* header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1.6fr 0.5fr 1.4fr 1.6fr 0.7fr',
              gap: 16, padding: '12px 18px',
              ...lbl, opacity: 0.55,
              borderBottom: `1px solid ${p.fg}30`
            }}>
              <span>BARISTA</span>
              <span>VOL.</span>
              <span>PROGRESS</span>
              <span>NEXT ENTRY</span>
              <span style={{ textAlign: 'right' }}>LAST</span>
            </div>
            {team.map((t, i) =>
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.6fr 0.5fr 1.4fr 1.6fr 0.7fr',
              gap: 16, padding: '16px 18px', alignItems: 'center',
              borderBottom: i < team.length - 1 ? `1px dashed ${p.fg}25` : 'none',
              cursor: 'pointer'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Mono name={t.name} size={32} />
                  <div>
                    <div style={{ ...sub, fontSize: 17, fontWeight: 500, lineHeight: 1.1 }}>{t.name}</div>
                    <div style={{ ...lbl, fontSize: 9, opacity: 0.55, marginTop: 4 }}>{t.role.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ ...display, fontStyle: 'italic', fontSize: 22, color: p.accent, ...mono }}>
                  {t.vol}
                </div>
                <div>
                  <div style={{ height: 6, background: `${p.fg}15`, position: 'relative', marginBottom: 6 }}>
                    <div style={{
                    position: 'absolute', inset: 0,
                    width: `${t.prog}%`,
                    background: t.prog >= 80 ? p.accent : t.prog >= 50 ? p.sun : p.fg
                  }} />
                  </div>
                  <div style={{ ...sans, fontSize: 11, opacity: 0.65, ...mono }}>{t.prog}% · {t.cert}</div>
                </div>
                <div>
                  <div style={{ ...sub, fontSize: 15, fontWeight: 400, lineHeight: 1.2 }}>{t.next}</div>
                  <div style={{ marginTop: 6 }}>{statusPill(t.status)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...sans, fontSize: 12, opacity: 0.65 }}>{t.last}</div>
                  {t.pending &&
                <div style={{ ...lbl, fontSize: 9, color: p.cherry, marginTop: 6 }}>
                      ◆ AWAITING YOU
                    </div>
                }
                </div>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            ...lbl, opacity: 0.5, marginTop: 14
          }}>
            <span>◆ {team.length} BARISTAS · LIVE</span>
            <span>SEATS REMAINING · 2 OF 8</span>
          </div>
        </section>

        {/* RIGHT — SIGN-OFFS + QUICK ACTIONS */}
        <section style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Pending sign-offs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div style={{ ...lbl, color: p.cherry }}>◆ AWAITING SIGN-OFF</div>
              <div style={{ ...lbl, opacity: 0.55 }}>{pendingSignoffs.length}</div>
            </div>
            <div style={{ borderTop: `1px solid ${p.fg}30` }}>
              {pendingSignoffs.map((t, i) =>
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center',
                padding: '16px 0', borderBottom: `1px dashed ${p.fg}25`
              }}>
                  <Mono name={t.name} size={36} accent={p.cherry} />
                  <div>
                    <div style={{ ...sub, fontSize: 17, fontWeight: 500, lineHeight: 1.15 }}>
                      {t.name} <span style={{ opacity: 0.5, ...sans, fontSize: 12, fontWeight: 400 }}>on</span> {t.next}
                    </div>
                    <div style={{ ...lbl, fontSize: 9, opacity: 0.55, marginTop: 4 }}>
                      VOL · {t.vol} · {t.last.toUpperCase()}
                    </div>
                  </div>
                  <button style={{
                  ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: p.accent, color: p.cream, padding: '9px 12px'
                }}>Review →</button>
                </div>
              )}
            </div>
          </div>

          {/* On bar now */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div style={{ ...lbl, color: p.accent }}>◆ ON BAR NOW</div>
              <div style={{ ...lbl, opacity: 0.55 }}>LIVE</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {onBarNow.map((t, i) =>
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', background: p.cream, border: `1px solid ${p.fg}30`
              }}>
                  <span style={{
                  width: 8, height: 8, borderRadius: 99, background: p.accent,
                  boxShadow: `0 0 0 4px ${p.accent}25`
                }} />
                  <Mono name={t.name} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...sub, fontSize: 16, fontWeight: 500, lineHeight: 1.1 }}>{t.name}</div>
                    <div style={{ ...sans, fontSize: 11, opacity: 0.6 }}>logged in {t.last}</div>
                  </div>
                  <div style={{ ...display, fontStyle: 'italic', fontSize: 20, color: p.accent }}>{t.vol}</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
              { l: 'Assign a volume', d: 'Push a track to selected baristas', onClick: () => window.CopiActions && window.CopiActions.openAssign('vol-3') },
              { l: 'Open a drill', d: 'Run a cupping or pour-over session', onClick: () => window.CopiActions && window.CopiActions.navigate('admin-curriculum') },
              { l: 'Add wholesale cafe', d: 'Invite a partner to your library' },
              { l: 'Export progress', d: 'CSV for your roastery records' }].
              map((a, i) =>
              <button key={i} onClick={a.onClick} style={{
                textAlign: 'left', padding: '14px 16px',
                background: 'transparent', border: `1.5px solid ${p.fg}`,
                cursor: 'pointer'
              }}>
                  <div style={{ ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {a.l} →
                  </div>
                  <div style={{ ...sub, fontSize: 14, opacity: 0.7, lineHeight: 1.3 }}>{a.d}</div>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── CURRICULUM AT A GLANCE ─────────────────────────────── */}
      <div style={{ padding: '64px 48px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 6 }}>◆ CURRICULUM · AT A GLANCE</div>
            <h2 style={{ ...display, fontSize: 42, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
              Where the team <em style={{ fontStyle: 'italic', color: p.accent }}>stands.</em>
            </h2>
          </div>
          <a style={{ ...lbl, color: p.accent, cursor: 'pointer' }}>VIEW ALL VOLUMES →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {volumeProgress.map((v, i) =>
          <article key={i} style={{
            background: p.cream, border: `1.5px solid ${p.fg}`,
            padding: '24px 26px 22px', position: 'relative'
          }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ ...lbl, opacity: 0.6 }}>{v.vol}</div>
                <div style={{ ...display, fontStyle: 'italic', fontSize: 56, color: p.accent, lineHeight: 0.9, ...mono }}>
                  {v.num}
                </div>
              </div>
              <h3 style={{ ...display, fontSize: 30, lineHeight: 0.96, letterSpacing: '-0.02em', fontWeight: 400, marginBottom: 18 }}>
                {v.name}.
              </h3>

              {/* Stacked bar */}
              <div style={{ display: 'flex', height: 10, border: `1px solid ${p.fg}`, marginBottom: 10 }}>
                <div style={{ width: `${v.completed / 6 * 100}%`, background: p.accent }} />
                <div style={{ width: `${v.active / 6 * 100}%`, background: p.sun }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...sans, fontSize: 11, ...mono }}>
                <span><span style={{ color: p.accent, fontWeight: 700 }}>● {v.completed}</span> <span style={{ opacity: 0.6 }}>completed</span></span>
                <span><span style={{ color: p.sun, fontWeight: 700 }}>● {v.active}</span> <span style={{ opacity: 0.6 }}>in progress</span></span>
                <span style={{ opacity: 0.55 }}>of 6</span>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* Footer band */}
      <div style={{
        ...lbl, opacity: 0.55, display: 'flex', justifyContent: 'space-between',
        padding: '20px 48px', borderTop: `1.5px solid ${p.fg}`, background: p.cream
      }}>
        <span>◆ COPI · WORKSPACE · {cafe.toUpperCase()}</span>
        <span>SAVED · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
        <span data-app-action="logout" style={{ cursor: 'pointer' }}>LOG OUT →</span>
      </div>
    </div>);

}

Object.assign(window, { RoasterDashboard });