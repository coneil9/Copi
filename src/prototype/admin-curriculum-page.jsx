// ═════════════════════════════════════════════════════════
// ADMIN CURRICULUM PAGE — Coffee roaster's curriculum console
// Different from the landing page: workflow-driven, not editorial.
// Custom tracks (built with Bloom), standard library w/ team progress,
// and a "lessons in motion" feed showing what the team is doing now.
// ═════════════════════════════════════════════════════════

function AdminCurriculumPage({ user = {} }) {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F'
  };
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono = { fontFamily: 'Lato', fontVariantNumeric: 'tabular-nums' };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';

  const store = window.useCopiStore();
  const relTime = (ts) => {
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + ' days ago';
  };
  const fmtTime = (mins) => mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;

  // ── Custom tracks built for this café ──────────────────────
  const customTracks = [
  {
    name: 'The Milano bar manual',
    blurb: 'Your bar manual, drilled. Built by Bloom from the PDF you uploaded.',
    lessons: 12, time: '2h 40m', assigned: 6, completed: 2,
    source: 'milano_bar_manual_v3.pdf',
    updated: '4 days ago'
  },
  {
    name: 'Milano single-origins · Fall ’26',
    blurb: 'The five lots on bar this season — origin, processing, dial-in notes.',
    lessons: 5, time: '1h 12m', assigned: 6, completed: 0,
    source: 'fall-26-greenbook.md + tasting notes',
    updated: 'yesterday'
  }];


  // ── Standard Copi library with live team progress ──────────
  const library = store.curriculum.map((v) => {
    const ts = store.teamVolumeStats(v.id);
    const mins = v.lessons.reduce((a, l) => a + (l.minutes || 0), 0);
    return {
      id: v.id, vol: v.vol, num: v.num, name: v.name, lessons: v.lessons.length,
      time: fmtTime(mins), assigned: ts.assigned, completed: ts.completed,
      inProgress: ts.inProgress, cert: v.cert,
    };
  });

  // ── Lessons in motion (live activity feed) ─────────────────
  const motion = store.activity(6).map((a) => ({
    who: a.who, action: a.action, lesson: a.label, when: relTime(a.ts), kind: a.kind,
  }));

  // ── Top-level stats ────────────────────────────────────────
  const certifiedCount = store.teamSnapshot().filter((t) => t.cert !== '\u2014').length;
  const stats = [
    { label: 'VOLUMES', big: String(store.curriculum.length + customTracks.length), sub: `${customTracks.length} custom · ${store.curriculum.length} standard` },
    { label: 'LESSONS / WEEK', big: String(store.lessonsThisWeek()), sub: 'team · last 7 days' },
    { label: 'CERTIFIED', big: String(certifiedCount), sub: `of ${store.team.length} baristas`, alert: certifiedCount === 0 },
    { label: 'TEAM COMPLETION', big: Math.round(store.teamCompletion() * 100) + '%', sub: 'across assigned volumes' },
  ];


  // Initials monogram
  const Mono = ({ name: n, size = 26, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`,
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em',
        flex: '0 0 auto'
      }}>{initials}</div>);

  };

  // Progress bar — hatched almanac style
  const Bar = ({ value, color = p.fg, height = 6 }) =>
  <div style={{ width: '100%', height, background: `${p.fg}15`, border: `1px solid ${p.fg}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: color }} />
    </div>;


  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── TOP NAV (matches dashboard) ─────────────────────────── */}
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
          { l: 'Dashboard', active: false },
          { l: 'Team', active: false },
          { l: 'Curriculum', active: true },
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
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}>
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
            padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
          }}>
            + Invite barista
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADING + STATS ─────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 40px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'end' }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ CURRICULUM · NOV 2026</div>
            <h1 style={{
              ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0
            }}>
              What your team<br />
              <em style={{ fontStyle: 'italic', color: p.accent }}>is learning.</em>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 16 }}>
            <span style={{ ...sub, fontSize: 17, opacity: 0.7, fontStyle: 'italic', maxWidth: 280, textAlign: 'right' }}>
              Custom tracks live on top of the Copi library. Bloom keeps both in sync with what's on bar.
            </span>
          </div>
        </div>

        <div style={{
          marginTop: 56,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: `1.5px solid ${p.fg}`
        }}>
          {stats.map((s, i) =>
          <div key={i} style={{
            padding: '24px 28px',
            borderRight: i < stats.length - 1 ? `1px solid ${p.fg}30` : 'none',
            background: s.alert ? `${p.cherry}10` : 'transparent',
            position: 'relative'
          }}>
              {s.alert &&
            <span style={{
              position: 'absolute', top: 14, right: 14,
              width: 7, height: 7, borderRadius: 99, background: p.cherry
            }} />
            }
              <div style={{ ...lbl, opacity: 0.6, marginBottom: 10 }}>{s.label}</div>
              <div style={{ ...display, fontSize: 64, lineHeight: 0.95, letterSpacing: '-0.03em', color: s.alert ? p.cherry : p.fg, ...mono }}>
                {s.big}
              </div>
              <div style={{ ...sub, fontSize: 14, opacity: 0.65, marginTop: 6, fontStyle: 'italic' }}>{s.sub}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── CUSTOM TRACKS (Bloom-built) ─────────────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 14, height: 1, background: p.accent }} />
              CUSTOM · BUILT WITH BLOOM
            </div>
            <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
              For <em style={{ fontStyle: 'italic', color: p.accent }}>{cafe}</em> only.
            </h2>
          </div>
          <button
            onClick={() => alert('Open Bloom to draft a new custom track.')}
            style={{
              ...sans, fontSize: 14, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.fg, color: p.cream,
              padding: '16px 22px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10
            }}>+ BUILD WITH COPI AI


          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {customTracks.map((t, i) =>
          <article key={i} style={{
            background: p.cream, border: `1.5px solid ${p.fg}`,
            padding: '28px 28px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
            position: 'relative'
          }}>
              {/* corner tag */}
              <div style={{
              position: 'absolute', top: -12, left: 24,
              background: p.sun, color: p.fg,
              ...lbl, fontSize: 9, padding: '5px 10px',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
                <InkMark size={11} color={p.fg} />
                CUSTOM TRACK
              </div>

              <div style={{ marginTop: 6 }}>
                <h3 style={{
                ...display, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 400, margin: 0
              }}>{t.name}</h3>
                <p style={{ ...sub, fontSize: 16, lineHeight: 1.45, opacity: 0.78, marginTop: 10, fontWeight: 400 }}>
                  {t.blurb}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 24, ...lbl, fontSize: 9, opacity: 0.7 }}>
                <span>{t.lessons} LESSONS</span>
                <span>· {t.time.toUpperCase()}</span>
                <span>· UPDATED {t.updated.toUpperCase()}</span>
              </div>

              {/* progress: assigned vs completed */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', ...lbl, fontSize: 8.5, opacity: 0.7, marginBottom: 6 }}>
                  <span>{t.completed} OF {t.assigned} COMPLETED</span>
                  <span>{Math.round(t.completed / t.assigned * 100)}%</span>
                </div>
                <Bar value={t.completed / t.assigned} color={p.accent} />
              </div>

              <div style={{ ...lbl, opacity: 0.5, fontSize: 8.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, background: p.accent, borderRadius: 99 }} />
                SOURCE · {t.source.toUpperCase()}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                onClick={() => alert(`Edit "${t.name}" with Bloom.`)}
                style={{
                  ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: 'transparent', color: p.fg,
                  padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                }}>
                Edit with Bloom</button>
                <button
                onClick={() => alert(`Assign "${t.name}" to baristas.`)}
                style={{
                  ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: p.accent, color: p.cream,
                  padding: '10px 14px', border: `1.5px solid ${p.accent}`, cursor: 'pointer'
                }}>
                Assign →</button>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* ── STANDARD LIBRARY w/ team progress ───────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 14, height: 1, background: p.accent }} />
            THE COPI LIBRARY · TEAM PROGRESS
          </div>
          <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            Three <em style={{ fontStyle: 'italic', color: p.accent }}>volumes</em>, calibrated by Q-graders.
          </h2>
        </div>

        <div style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
          {/* header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px minmax(220px, 1.6fr) 1fr 1.4fr 0.9fr 130px',
            gap: 18, padding: '14px 24px',
            borderBottom: `1.5px solid ${p.fg}`,
            ...lbl, fontSize: 9, opacity: 0.7
          }}>
            <span>VOLUME</span>
            <span>NAME</span>
            <span>SCOPE</span>
            <span>TEAM PROGRESS</span>
            <span>CERT</span>
            <span></span>
          </div>

          {library.map((l, i) =>
          <div key={l.num} style={{
            display: 'grid',
            gridTemplateColumns: '110px minmax(220px, 1.6fr) 1fr 1.4fr 0.9fr 130px',
            gap: 18, padding: '24px 24px',
            alignItems: 'center',
            borderBottom: i < library.length - 1 ? `1px dashed ${p.fg}25` : 'none'
          }}>
              <div>
                <div style={{ ...lbl, opacity: 0.55, fontSize: 9 }}>{l.vol}</div>
                <div style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1, color: p.accent, fontWeight: 400, ...mono }}>
                  {l.num}
                </div>
              </div>

              <div>
                <div style={{ ...display, fontSize: 26, lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.015em' }}>{l.name}</div>
                <div style={{ ...lbl, opacity: 0.55, fontSize: 8.5, marginTop: 6 }}>{l.lessons} LESSONS · {l.time.toUpperCase()}</div>
              </div>

              <div style={{ ...sans, fontSize: 12, ...mono }}>
                <div><strong style={{ fontWeight: 700 }}>{l.assigned}</strong> <span style={{ opacity: 0.6 }}>assigned</span></div>
                <div style={{ marginTop: 4 }}><strong style={{ fontWeight: 700 }}>{l.completed}</strong> <span style={{ opacity: 0.6 }}>completed</span></div>
                <div style={{ marginTop: 4 }}><strong style={{ fontWeight: 700 }}>{l.inProgress}</strong> <span style={{ opacity: 0.6 }}>in progress</span></div>
              </div>

              <div>
                <Bar value={l.assigned ? l.completed / l.assigned : 0} color={p.accent} height={8} />
                <div style={{ display: 'flex', justifyContent: 'space-between', ...lbl, fontSize: 8.5, opacity: 0.6, marginTop: 6 }}>
                  <span>{l.assigned ? Math.round(l.completed / l.assigned * 100) : 0}% COMPLETE</span>
                  <span>{l.assigned ? Math.round(l.inProgress / l.assigned * 100) : 0}% ACTIVE</span>
                </div>
              </div>

              <div style={{ ...lbl, color: p.accent, fontSize: 9 }}>◆ {l.cert.toUpperCase()}</div>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button
                onClick={() => window.CopiActions && window.CopiActions.openLesson(l.id, store.volById(l.id).lessons[0].id)}
                style={{
                  ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: 'transparent', color: p.fg,
                  padding: '8px 10px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                }}>
                Preview</button>
                <button
                onClick={() => window.CopiActions && window.CopiActions.openAssign(l.id)}
                style={{
                  ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: p.fg, color: p.cream,
                  padding: '8px 10px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                }}>
                Assign</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button
            style={{
              ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg,
              padding: '14px 28px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
            }}>
            Browse other volumes →</button>
        </div>
      </div>

      {/* ── LESSONS IN MOTION ───────────────────────────────────── */}
      <div style={{ padding: '64px 48px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 14, height: 1, background: p.accent }} />
              LESSONS IN MOTION
            </div>
            <h2 style={{ ...display, fontSize: 44, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
              What happened <em style={{ fontStyle: 'italic', color: p.accent }}>this week.</em>
            </h2>
          </div>
          <a data-app-nav="Team" style={{
            ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', borderBottom: `1px solid ${p.fg}40`, paddingBottom: 2
          }}>SEE ALL ACTIVITY →</a>
        </div>

        <div>
          {motion.map((m, i) => {
            const kindStyle = ({
              complete: { bg: p.accent, fg: p.cream, label: 'COMPLETED' },
              cert: { bg: p.accent, fg: p.cream, label: 'CERTIFIED' },
              assign: { bg: p.sun, fg: p.fg, label: 'ASSIGNED' },
              active: { bg: p.bg, fg: p.fg, label: 'IN PROGRESS', dashed: true },
              review: { bg: p.sun, fg: p.fg, label: 'SUBMITTED' }
            })[m.kind] || { bg: p.bg, fg: p.fg, label: (m.action || '').toUpperCase(), dashed: true };
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '38px 1fr auto auto auto',
                gap: 18, alignItems: 'center',
                padding: '18px 0',
                borderTop: `1px dashed ${p.fg}30`,
                borderBottom: i === motion.length - 1 ? `1px dashed ${p.fg}30` : 'none'
              }}>
                <Mono name={m.who} size={32} bg={p.accent} />
                <div>
                  <div style={{ ...sub, fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>
                    {m.who} <span style={{ opacity: 0.6, fontWeight: 400 }}>{m.action}</span> {m.lesson}
                  </div>
                </div>
                <span style={{
                  ...lbl, fontSize: 9, padding: '4px 9px',
                  background: kindStyle.bg, color: kindStyle.fg,
                  border: kindStyle.dashed ? `1px dashed ${p.fg}55` : 'none'
                }}>{kindStyle.label}</span>
                <span style={{ ...sans, fontSize: 11, opacity: 0.55, minWidth: 88, textAlign: 'right' }}>{m.when}</span>
                {m.pending ?
                <button
                  onClick={() => alert(`Review ${m.who}'s submission`)}
                  style={{
                    ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: p.fg, color: p.cream,
                    padding: '7px 11px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                  }}>
                  Review →</button> :

                <span style={{ ...lbl, opacity: 0.4, fontSize: 9, minWidth: 80, textAlign: 'right' }}>—</span>
                }
              </div>);

          })}
        </div>
      </div>
    </div>);

}

Object.assign(window, { AdminCurriculumPage });