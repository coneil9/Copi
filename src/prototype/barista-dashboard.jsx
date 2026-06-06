// ═════════════════════════════════════════════════════════
// BARISTA DASHBOARD — "Today". One clear next action, the
// current volume's path, and real progress. Reads everything
// from CopiStore; the big card launches the lesson player.
// ═════════════════════════════════════════════════════════

function BaristaDashboard({ user = {} }) {
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
  const name = (user.name || 'Lili').split(' ')[0];

  const assignedVols = store.assignedVolumes(email);
  const current = store.currentLesson(email);
  const overall = Math.round(store.overallPct(email) * 100);

  // this week (per user)
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const raw = store.raw().users[email] || { lessons: {}, finals: {} };
  const thisWeek = Object.values(raw.lessons).filter((r) => r.done && r.ts >= weekAgo).length;
  const badges = ['vol-1', 'vol-2', 'vol-3'].filter((v) => store.volumeStats(email, v).certified).length;

  const act = window.CopiActions || {};

  // Initials monogram
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

  // The volume that holds the current action (for the path display)
  const focusVol = current ? current.vol : assignedVols[0] || null;

  // ── Big card content ──────────────────────────────────────
  const openCurrent = () => {
    if (!current) return;
    if (current.isFinal) act.openFinal && act.openFinal(current.vol.id);
    else act.openLesson && act.openLesson(current.vol.id, current.lesson.id);
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg }}>

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }}>
        <span style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1 }}>Copi</span>
        <div style={{ display: 'flex', gap: 36, ...sans, fontSize: 13 }}>
          {[{ l: 'Today', active: true }, { l: 'Library', active: false }, { l: 'Profile', active: false }].map((x) => (
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
            <span style={{ ...sans, fontWeight: 700, fontSize: 14 }}>{overall}%</span>
          </div>
          <Mono name={user.name} size={36} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 40 }}>
          <h1 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            Hi <em style={{ fontStyle: 'italic', color: p.accent }}>{name}</em> —
          </h1>
          <p style={{ ...sub, fontSize: 22, opacity: 0.7, fontWeight: 400, margin: '12px 0 0', fontStyle: 'italic' }}>
            {current ? 'ready to pick up where you left off?' : assignedVols.length ? 'you\u2019re all caught up.' : 'nothing assigned yet.'}
          </p>
        </div>

        {/* ── BIG CARD ───────────────────────────────────────── */}
        {current ? (
          <button
            onClick={openCurrent}
            style={{
              width: '100%', background: p.accent, color: p.cream, border: 'none', borderRadius: 28,
              padding: '44px 36px 40px', boxShadow: `0 6px 0 ${p.fg}`, cursor: 'pointer', textAlign: 'left', display: 'block',
              transition: 'transform 120ms ease, box-shadow 120ms ease',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = `0 3px 0 ${p.fg}`; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 0 ${p.fg}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 0 ${p.fg}`; }}
          >
            <div style={{ ...lbl, opacity: 0.75, marginBottom: 18 }}>
              {current.isFinal
                ? `${current.vol.vol} · FINAL TEST · EARN ${current.vol.cert.toUpperCase()}`
                : `${current.vol.vol} · LESSON ${current.lesson.num} · ${current.lesson.minutes} MIN`}
            </div>
            <div style={{ ...display, fontSize: 64, lineHeight: 0.96, letterSpacing: '-0.03em', fontWeight: 400 }}>
              {current.isFinal ? `${current.vol.name} — final test.` : `${current.lesson.title}.`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }}>
              <div style={{ ...sans, fontSize: 14, opacity: 0.85 }}>
                {(() => { const s = store.volumeStats(email, current.vol.id); return `${s.done} of ${s.total} lessons done in this volume`; })()}
              </div>
              <span style={{
                background: p.cream, color: p.accent, padding: '14px 24px', borderRadius: 999,
                ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>
                {current.isFinal ? 'Take the test →' : 'Start lesson →'}
              </span>
            </div>
          </button>
        ) : (
          <div style={{
            width: '100%', background: p.cream, borderRadius: 28, padding: '44px 36px',
            border: `1.5px solid ${p.fg}20`, boxShadow: `0 6px 0 ${p.fg}15`, textAlign: 'center',
          }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 14 }}>
              {assignedVols.length ? '◆ ALL CAUGHT UP' : '◆ WAITING ON YOUR MANAGER'}
            </div>
            <div style={{ ...display, fontSize: 44, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400 }}>
              {assignedVols.length
                ? <React.Fragment>You&rsquo;ve finished everything <em style={{ fontStyle: 'italic', color: p.accent }}>assigned.</em></React.Fragment>
                : <React.Fragment>No volumes <em style={{ fontStyle: 'italic', color: p.accent }}>yet.</em></React.Fragment>}
            </div>
            <p style={{ ...sub, fontSize: 19, opacity: 0.7, marginTop: 14, fontWeight: 400 }}>
              {assignedVols.length ? 'Nicely done. Your manager will assign the next volume soon.' : 'Once your manager assigns a volume, it\u2019ll show up right here.'}
            </p>
          </div>
        )}

        {/* ── PATH (current volume) ──────────────────────────── */}
        {focusVol && (
          <div style={{ marginTop: 60 }}>
            <div style={{ ...lbl, color: p.accent, textAlign: 'center', marginBottom: 8 }}>◆ {focusVol.vol} · {focusVol.name.toUpperCase()}</div>
            <p style={{ ...sub, fontSize: 16, fontStyle: 'italic', opacity: 0.6, textAlign: 'center', margin: '0 0 28px', fontWeight: 400 }}>
              {focusVol.lessons.length} lessons, then a final test for your {focusVol.cert} badge.
            </p>

            <div style={{ display: 'grid', gap: 10 }}>
              {focusVol.lessons.map((lesson, i) => {
                const status = store.lessonStatus(email, focusVol.id, i);
                const isDone = status === 'done';
                const isCurrent = status === 'current';
                const isLocked = status === 'locked';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => { if (!isLocked) act.openLesson && act.openLesson(focusVol.id, lesson.id); }}
                    disabled={isLocked}
                    style={{
                      width: '100%', textAlign: 'left', cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: isCurrent ? p.cream : 'transparent',
                      border: isCurrent ? `2.5px solid ${p.fg}` : `1.5px solid ${p.fg}20`,
                      borderRadius: 18, padding: '16px 20px', opacity: isLocked ? 0.55 : 1,
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: isCurrent ? `0 4px 0 ${p.fg}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flex: '0 0 auto',
                      background: isDone ? p.accent : isCurrent ? p.sun : `${p.fg}15`,
                      color: isDone ? p.cream : p.fg, border: `2px solid ${p.fg}`,
                      display: 'grid', placeItems: 'center',
                      ...display, fontStyle: 'italic', fontSize: 22, fontWeight: 400,
                    }}>
                      {isDone ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                        : isLocked ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2" opacity="0.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                        : lesson.num}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>{lesson.title}</div>
                      <div style={{ ...lbl, fontSize: 8.5, opacity: 0.5, marginTop: 4 }}>
                        {isDone ? 'COMPLETE' : isCurrent ? '◆ UP NEXT · TAP TO START' : `LESSON ${lesson.num} · LOCKED`}
                      </div>
                    </div>
                    {!isLocked && <span style={{ ...lbl, color: isDone ? p.accent : p.sun, fontSize: 10 }}>{isDone ? 'REVIEW' : 'START'} →</span>}
                  </button>
                );
              })}

              {/* Final test node */}
              {(() => {
                const fstat = store.finalStatus(email, focusVol.id);
                const fdone = fstat === 'done';
                const fcurrent = fstat === 'current';
                const flocked = fstat === 'locked';
                return (
                  <button
                    onClick={() => { if (!flocked) act.openFinal && act.openFinal(focusVol.id); }}
                    disabled={flocked}
                    style={{
                      width: '100%', textAlign: 'left', cursor: flocked ? 'not-allowed' : 'pointer',
                      background: fcurrent ? p.cream : 'transparent',
                      border: fcurrent ? `2.5px solid ${p.fg}` : `1.5px dashed ${p.fg}35`,
                      borderRadius: 18, padding: '16px 20px', opacity: flocked ? 0.5 : 1, marginTop: 4,
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: fcurrent ? `0 4px 0 ${p.fg}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flex: '0 0 auto',
                      background: fdone ? p.accent : fcurrent ? p.sun : `${p.fg}12`,
                      border: `2px solid ${p.fg}`, display: 'grid', placeItems: 'center',
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fdone ? p.cream : p.fg} strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>Final test — {focusVol.cert}</div>
                      <div style={{ ...lbl, fontSize: 8.5, opacity: 0.5, marginTop: 4 }}>
                        {fdone ? '◆ CERTIFIED' : fcurrent ? '◆ READY · TAP TO TAKE IT' : 'FINISH ALL LESSONS TO UNLOCK'}
                      </div>
                    </div>
                    {!flocked && <span style={{ ...lbl, color: p.accent, fontSize: 10 }}>{fdone ? 'PASSED' : 'TAKE'} →</span>}
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── STAT CHIPS ─────────────────────────────────────── */}
        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { big: `${overall}%`, label: 'overall', tint: p.accent },
            { big: String(thisWeek), label: 'lessons this week', tint: p.sun },
            { big: String(badges), label: 'badges earned', tint: p.fg },
          ].map((s, i) => (
            <div key={i} style={{ background: p.cream, borderRadius: 20, padding: '20px 16px', textAlign: 'center', border: `1.5px solid ${p.fg}20` }}>
              <div style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1, color: s.tint, fontWeight: 400 }}>{s.big}</div>
              <div style={{ ...lbl, opacity: 0.7, marginTop: 8, fontSize: 9 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <span data-app-action="logout" style={{ ...lbl, opacity: 0.4, cursor: 'pointer', fontSize: 9 }}>LOG OUT</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BaristaDashboard });
