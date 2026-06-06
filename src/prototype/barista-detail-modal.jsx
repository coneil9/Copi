// ═════════════════════════════════════════════════════════
// BARISTA DETAIL — the manager's per-person view. Opens from
// the Team table, Analytics, or the dashboard. Reads CopiStore:
// volume-by-volume progress, every quiz score, certifications,
// and a clear "what to coach next." Unassigned volumes can be
// assigned right here.
//
// Opened via window.CopiActions.openBarista(email).
// ═════════════════════════════════════════════════════════

function BaristaDetailModal({ open, email, onClose }) {
  const p = {
    bg: '#E8DDC2', fg: '#1A1410', accent: '#3F5A3A',
    cream: '#F4EBD2', sun: '#C68A3D', cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono = { fontFamily: 'Lato', fontVariantNumeric: 'tabular-nums' };

  const store = window.useCopiStore();
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) { setClosing(false); document.body.style.overflow = 'hidden'; }
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if ((!open && !closing) || !email) return null;
  const person = store.team.find((t) => t.email === email);
  if (!person) return null;

  const handleClose = () => { setClosing(true); setTimeout(() => { setClosing(false); onClose && onClose(); }, 220); };

  const pct = Math.round(store.overallPct(email) * 100);
  const snap = store.teamSnapshot().find((t) => t.email === email) || {};
  const cert = snap.cert || '—';

  // last active
  const u = store.raw().users[email] || { lessons: {}, finals: {} };
  let lastTs = 0;
  Object.values(u.lessons).forEach((r) => { if (r.ts > lastTs) lastTs = r.ts; });
  Object.values(u.finals || {}).forEach((r) => { if (r.ts > lastTs) lastTs = r.ts; });
  const relTime = (ts) => {
    if (!ts) return 'no activity yet';
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + ' days ago';
  };

  const current = store.currentLesson(email);

  // weakest completed lesson (lowest score ratio)
  let weakest = null;
  Object.entries(u.lessons).forEach(([lid, r]) => {
    if (!r.done) return;
    const ratio = r.score / r.total;
    if (!weakest || ratio < weakest.ratio) {
      const found = store.lessonById(lid);
      if (found) weakest = { ratio, score: r.score, total: r.total, ...found };
    }
  });
  if (weakest && weakest.ratio === 1) weakest = null; // only flag if they actually missed something

  const Mono = ({ size = 64 }) => {
    const initials = person.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: pct < 35 ? p.cherry : p.accent, color: p.cream,
        border: `1.5px solid ${p.fg}`, display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const Bar = ({ value, color = p.accent, height = 8 }) => (
    <div style={{ width: '100%', height, background: `${p.fg}15`, border: `1px solid ${p.fg}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: color }} />
    </div>
  );

  const act = window.CopiActions || {};

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9300,
        background: 'rgba(26,20,16,0.58)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(760px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: p.bg, border: `1.5px solid ${p.fg}`, boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.985)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* top bar */}
        <div style={{
          flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: `1px solid ${p.fg}30`, background: p.cream, ...lbl, opacity: 0.85,
        }}>
          <span>◆ BARISTA · {person.role.toUpperCase()}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none' }}>ESC ✕</button>
        </div>

        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
          {/* header */}
          <div style={{
            padding: '32px 32px', borderBottom: `1.5px solid ${p.fg}`, background: p.cream,
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center',
          }}>
            <Mono size={72} />
            <div>
              <h2 style={{ ...display, fontSize: 48, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>{person.name}</h2>
              <div style={{ ...sans, fontSize: 13, opacity: 0.65, marginTop: 6 }}>
                {person.email} · joined {person.joined}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ ...lbl, fontSize: 9, padding: '5px 10px', background: cert === '—' ? 'transparent' : p.accent, color: cert === '—' ? p.fg : p.cream, border: cert === '—' ? `1px solid ${p.fg}40` : 'none' }}>
                  {cert === '—' ? 'NO CERT YET' : `◆ ${cert.toUpperCase()}`}
                </span>
                <span style={{ ...lbl, fontSize: 9, padding: '5px 10px', border: `1px solid ${p.fg}40`, opacity: 0.7 }}>
                  ACTIVE {relTime(lastTs).toUpperCase()}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...display, fontStyle: 'italic', fontSize: 60, lineHeight: 1, color: pct < 35 ? p.cherry : p.accent, fontWeight: 400, ...mono }}>{pct}%</div>
              <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginTop: 2 }}>OVERALL</div>
            </div>
          </div>

          {/* what to coach next */}
          <div style={{ padding: '26px 32px', borderBottom: `1px solid ${p.fg}20`, background: 'rgba(63,90,58,0.06)' }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 12 }}>◆ WHAT TO WORK ON NEXT</div>
            <div style={{ display: 'grid', gridTemplateColumns: weakest ? '1fr 1fr' : '1fr', gap: 20 }}>
              <div>
                <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginBottom: 6 }}>UP NEXT</div>
                <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>
                  {current
                    ? (current.isFinal ? `${current.vol.vol} · Final test (${current.vol.cert})` : `${current.vol.vol} · ${current.lesson.title}`)
                    : 'All assigned volumes complete.'}
                </div>
              </div>
              {weakest && (
                <div>
                  <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginBottom: 6 }}>WEAKEST CHECK</div>
                  <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>
                    {weakest.lesson.title} <span style={{ ...mono, color: p.cherry, fontWeight: 700, fontSize: 16 }}>{weakest.score}/{weakest.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* volumes */}
          <div style={{ padding: '28px 32px 36px' }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ VOLUME BY VOLUME</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {store.curriculum.map((v) => {
                const assigned = store.isAssigned(email, v.id);
                const vs = store.volumeStats(email, v.id);
                const fstat = store.finalStatus(email, v.id);
                return (
                  <div key={v.id} style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
                    {/* vol header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', padding: '16px 20px', borderBottom: assigned ? `1px solid ${p.fg}20` : 'none' }}>
                      <div style={{ ...display, fontStyle: 'italic', fontSize: 34, color: p.accent, ...mono, lineHeight: 1 }}>{v.num}</div>
                      <div>
                        <div style={{ ...display, fontSize: 24, lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.015em' }}>{v.name}</div>
                        <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginTop: 4 }}>{v.vol} · {v.cert.toUpperCase()}</div>
                      </div>
                      {assigned ? (
                        <div style={{ textAlign: 'right', minWidth: 120 }}>
                          <Bar value={vs.total ? vs.done / vs.total : 0} color={vs.certified ? p.accent : p.sun} />
                          <div style={{ ...lbl, fontSize: 8.5, opacity: 0.6, marginTop: 6 }}>
                            {vs.certified ? '◆ CERTIFIED' : `${vs.done}/${vs.total} LESSONS`}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => act.openAssign && act.openAssign(v.id)}
                          style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: p.fg, color: p.cream, padding: '9px 14px', border: 'none', cursor: 'pointer' }}
                        >Assign →</button>
                      )}
                    </div>

                    {/* lessons */}
                    {assigned && (
                      <div style={{ padding: '6px 20px 14px' }}>
                        {v.lessons.map((lesson, i) => {
                          const st = store.lessonStatus(email, v.id, i);
                          const rec = store.lessonRecord(email, lesson.id);
                          const dot = st === 'done' ? p.accent : st === 'current' ? p.sun : `${p.fg}25`;
                          return (
                            <div key={lesson.id} style={{ display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: `1px dashed ${p.fg}15` }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot }} />
                              <span style={{ ...sans, fontSize: 13.5, opacity: st === 'locked' ? 0.45 : 0.9 }}>
                                <span style={{ ...mono, opacity: 0.5, marginRight: 8 }}>{lesson.num}</span>{lesson.title}
                              </span>
                              <span style={{ ...mono, fontSize: 12, fontWeight: 700, color: rec ? (rec.score === rec.total ? p.accent : p.sun) : `${p.fg}40` }}>
                                {rec ? `${rec.score}/${rec.total}` : st === 'current' ? 'NEXT' : '—'}
                              </span>
                            </div>
                          );
                        })}
                        {/* final */}
                        <div style={{ display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 12, alignItems: 'center', padding: '10px 0 2px' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: fstat === 'done' ? p.accent : fstat === 'current' ? p.sun : `${p.fg}25` }} />
                          <span style={{ ...sub, fontSize: 15, fontWeight: 500, opacity: fstat === 'locked' ? 0.5 : 1 }}>Final test — {v.cert}</span>
                          <span style={{ ...lbl, fontSize: 8.5, color: fstat === 'done' ? p.accent : fstat === 'current' ? p.sun : `${p.fg}50` }}>
                            {fstat === 'done' ? 'PASSED' : fstat === 'current' ? 'READY' : 'LOCKED'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ flex: '0 0 auto', padding: '16px 24px', borderTop: `1.5px solid ${p.fg}`, background: p.cream, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={handleClose} style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', color: p.fg, padding: '12px 20px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

window.BaristaDetailModal = BaristaDetailModal;
