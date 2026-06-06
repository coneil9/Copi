// ═════════════════════════════════════════════════════════
// BARISTA LIBRARY — the full map of what to learn and how far
// you've come. Reads CopiStore; tapping a volume opens its next
// lesson in the player. Refreshers are lessons already passed.
// ═════════════════════════════════════════════════════════

function BaristaLibrary({ user = {} }) {
  const p = {
    bg: '#E8DDC2', fg: '#1A1410', accent: '#3F5A3A',
    cream: '#F4EBD2', sun: '#C68A3D', cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub     = { fontFamily: 'Yrsa' };
  const sans    = { fontFamily: 'Lato' };
  const lbl     = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.useCopiStore();
  const email = user.email || 'lili@milano.coffee';
  const act = window.CopiActions || {};

  const vols = store.curriculum;
  const assignedVols = vols.filter((v) => store.isAssigned(email, v.id));
  let totalDone = 0, totalLessons = 0;
  assignedVols.forEach((v) => { const s = store.volumeStats(email, v.id); totalDone += s.done; totalLessons += s.total; });
  const pct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;

  // Refreshers — most recently completed lessons.
  const raw = store.raw().users[email] || { lessons: {} };
  const refreshers = Object.entries(raw.lessons)
    .filter(([, r]) => r.done)
    .sort((a, b) => b[1].ts - a[1].ts)
    .slice(0, 3)
    .map(([lessonId]) => store.lessonById(lessonId))
    .filter(Boolean);

  const Mono = ({ name: n, size = 36 }) => {
    const initials = (n || 'L').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: p.accent, color: p.cream, borderRadius: '50%',
        display: 'grid', placeItems: 'center', ...sans, fontSize: size * 0.38, fontWeight: 700,
        letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const Dots = ({ total, done, on }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: i < done ? on : `${p.fg}20` }} />
      ))}
    </div>
  );

  const openVolume = (v) => {
    // open the first actionable lesson, else its final, else first lesson for review
    for (let i = 0; i < v.lessons.length; i++) {
      if (store.lessonStatus(email, v.id, i) === 'current') { act.openLesson(v.id, v.lessons[i].id); return; }
    }
    if (store.finalStatus(email, v.id) === 'current') { act.openFinal(v.id); return; }
    act.openLesson(v.id, v.lessons[0].id); // all done → review from the top
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg }}>

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }}>
        <span style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1 }}>Copi</span>
        <div style={{ display: 'flex', gap: 36, ...sans, fontSize: 13 }}>
          {[{ l: 'Today', active: false }, { l: 'Library', active: true }, { l: 'Profile', active: false }].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.55, fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `2px solid ${p.fg}` : 'none', paddingBottom: 4, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: p.sun, color: p.fg }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill={p.fg} aria-hidden="true">
              <path d="M7 0 C 8 4, 12 5, 12 10 C 12 13.5, 9.5 16, 7 16 C 4.5 16, 2 13.5, 2 10 C 2 7, 4 6, 5 4 C 6 2, 6 1, 7 0 Z" />
            </svg>
            <span style={{ ...sans, fontWeight: 700, fontSize: 14 }}>{pct}%</span>
          </div>
          <Mono name={user.name} size={36} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 36 }}>
          <h1 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            Your <em style={{ fontStyle: 'italic', color: p.accent }}>library</em>
          </h1>
          <p style={{ ...sub, fontSize: 22, opacity: 0.7, fontWeight: 400, margin: '12px 0 0', fontStyle: 'italic' }}>
            everything there is to learn — and how far you&rsquo;ve come.
          </p>
        </div>

        {/* Overall progress */}
        <div style={{
          background: p.cream, borderRadius: 28, padding: '32px', border: `1.5px solid ${p.fg}20`,
          boxShadow: `0 6px 0 ${p.fg}15`, display: 'flex', alignItems: 'center', gap: 28,
        }}>
          <div style={{ position: 'relative', width: 104, height: 104, flex: '0 0 auto' }}>
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="46" fill="none" stroke={`${p.fg}18`} strokeWidth="10" />
              <circle cx="52" cy="52" r="46" fill="none" stroke={p.accent} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - pct / 100)}
                transform="rotate(-90 52 52)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', ...display, fontStyle: 'italic', fontSize: 34, color: p.accent, fontWeight: 400 }}>{pct}%</div>
          </div>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 10 }}>◆ YOUR PROGRESS</div>
            <div style={{ ...sub, fontSize: 26, fontWeight: 500, lineHeight: 1.15 }}>{totalDone} of {totalLessons} lessons done.</div>
            <div style={{ ...sans, fontSize: 14, opacity: 0.65, marginTop: 6 }}>
              Across {assignedVols.length} assigned {assignedVols.length === 1 ? 'volume' : 'volumes'}.
            </div>
          </div>
        </div>

        {/* Volumes */}
        <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '56px 0 24px' }}>◆ YOUR VOLUMES</div>

        <div style={{ display: 'grid', gap: 18 }}>
          {vols.map((v) => {
            const assigned = store.isAssigned(email, v.id);
            const s = store.volumeStats(email, v.id);
            const complete = s.certified || (assigned && s.done === s.total && s.total > 0);
            const tint = complete ? p.accent : assigned ? p.sun : p.fg;
            return (
              <button
                key={v.id}
                onClick={() => { if (assigned) openVolume(v); }}
                disabled={!assigned}
                style={{
                  width: '100%', textAlign: 'left', background: p.cream, borderRadius: 24,
                  border: assigned && !complete ? `2.5px solid ${p.fg}` : `1.5px solid ${p.fg}20`,
                  boxShadow: assigned ? `0 5px 0 ${p.fg}${complete ? '15' : ''}` : 'none',
                  padding: '26px', cursor: assigned ? 'pointer' : 'not-allowed', opacity: assigned ? 1 : 0.6,
                  display: 'flex', gap: 22, alignItems: 'center',
                }}
              >
                <div style={{
                  width: 76, height: 76, borderRadius: '50%', flex: '0 0 auto',
                  background: complete ? p.accent : assigned ? p.sun : `${p.fg}18`,
                  color: complete ? p.cream : p.fg, border: `2px solid ${p.fg}`,
                  display: 'grid', placeItems: 'center', ...display, fontStyle: 'italic', fontSize: 34, fontWeight: 400,
                }}>
                  {complete ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                    : !assigned ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2" opacity="0.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                    : v.num}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ ...lbl, opacity: 0.5, fontSize: 9 }}>{v.vol}</div>
                    <div style={{ ...lbl, color: tint, fontSize: 9 }}>
                      {complete ? '✓ COMPLETE' : assigned ? 'IN PROGRESS' : 'NOT ASSIGNED'}
                    </div>
                  </div>
                  <div style={{ ...display, fontSize: 32, lineHeight: 1.0, letterSpacing: '-0.02em', fontWeight: 400, marginTop: 4 }}>{v.name}</div>
                  <div style={{ ...sans, fontSize: 13.5, opacity: 0.65, marginTop: 8, lineHeight: 1.35 }}>{v.blurb}</div>
                  {assigned && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
                      <Dots total={s.total} done={s.done} on={tint} />
                      <span style={{ ...sans, fontSize: 12, fontWeight: 700, opacity: 0.6, whiteSpace: 'nowrap' }}>{s.done}/{s.total}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Refreshers */}
        {refreshers.length > 0 && (
          <React.Fragment>
            <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '56px 0 10px' }}>◆ REFRESHERS</div>
            <p style={{ ...sub, fontSize: 17, fontStyle: 'italic', opacity: 0.65, textAlign: 'center', margin: '0 0 24px', fontWeight: 400 }}>
              lessons you&rsquo;ve already passed — worth another look.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {refreshers.map(({ vol, lesson }, ri) => (
                <button
                  key={ri}
                  onClick={() => act.openLesson(vol.id, lesson.id)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'transparent', borderRadius: 18,
                    border: `1.5px dashed ${p.fg}40`, padding: '16px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flex: '0 0 auto', border: `1.5px solid ${p.fg}`, display: 'grid', placeItems: 'center', background: p.cream }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.1 }}>
                      <span style={{ opacity: 0.5, fontFamily: 'Lato', fontWeight: 700, fontSize: 13, marginRight: 8 }}>{vol.vol}</span>
                      {lesson.title}
                    </div>
                    <div style={{ ...sans, fontSize: 12, opacity: 0.55, marginTop: 3 }}>passed · tap to review</div>
                  </div>
                  <span style={{ ...lbl, color: p.accent, fontSize: 10 }}>REFRESH →</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        )}

      </div>
    </div>
  );
}

Object.assign(window, { BaristaLibrary });
