// ═════════════════════════════════════════════════════════
// ASSIGN MODAL — admin assigns a volume to selected baristas.
// Writes straight to CopiStore; the barista's Today view and
// the analytics rollup update the moment it closes.
// ═════════════════════════════════════════════════════════

function AssignModal({ open, volId, onClose }) {
  const p = {
    bg: '#E8DDC2', fg: '#1A1410', accent: '#3F5A3A',
    cream: '#F4EBD2', sun: '#C68A3D', cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.CopiStore;
  const vol = volId ? store.volById(volId) : null;

  const [selected, setSelected] = React.useState(() => new Set());
  const [closing, setClosing] = React.useState(false);
  const [done, setDone] = React.useState(0); // count assigned, >0 shows success

  React.useEffect(() => {
    if (open && vol) {
      // Pre-check those already assigned.
      const pre = new Set(store.assignedEmails(vol.id));
      setSelected(pre);
      setDone(0); setClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, volId]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if ((!open && !closing) || !vol) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose && onClose(); }, 220);
  };

  const alreadyAssigned = new Set(store.assignedEmails(vol.id));
  const toggle = (email) => {
    const next = new Set(selected);
    if (next.has(email)) next.delete(email); else next.add(email);
    setSelected(next);
  };
  const allChecked = store.team.every((t) => selected.has(t.email));
  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(store.team.map((t) => t.email)));
  };

  const newlyAdded = store.team.filter((t) => selected.has(t.email) && !alreadyAssigned.has(t.email));

  const commit = () => {
    // additions
    const toAdd = store.team.filter((t) => selected.has(t.email) && !alreadyAssigned.has(t.email)).map((t) => t.email);
    const toRemove = store.team.filter((t) => !selected.has(t.email) && alreadyAssigned.has(t.email)).map((t) => t.email);
    if (toRemove.length) store.unassignVolume(vol.id, toRemove);
    if (toAdd.length) store.assignVolume(vol.id, toAdd);
    setDone(toAdd.length || -1); // -1 = saved with no new adds
  };

  const Mono = ({ name, size = 36 }) => {
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: p.accent, color: p.cream,
        border: `1px solid ${p.fg}`, display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9200,
        background: 'rgba(26,20,16,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(620px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: p.cream, border: `1.5px solid ${p.fg}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* top bar */}
        <div style={{
          flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: `1px solid ${p.fg}30`, ...lbl, opacity: 0.8,
        }}>
          <span>◆ ASSIGN · {vol.vol}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none' }}>ESC ✕</button>
        </div>

        {done !== 0 ? (
          <div style={{ padding: '52px 44px', textAlign: 'center' }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>◆ ASSIGNED</div>
            <h2 style={{ ...display, fontSize: 52, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 14px' }}>
              {vol.name} is <em style={{ fontStyle: 'italic', color: p.accent }}>out.</em>
            </h2>
            <p style={{ ...sub, fontSize: 20, lineHeight: 1.45, opacity: 0.8, fontWeight: 400, maxWidth: 420, margin: '0 auto' }}>
              {done > 0
                ? `${done} barista${done > 1 ? 's' : ''} just got ${vol.vol}. It shows up on their Today view, and their progress will land here as they go.`
                : `Saved. ${vol.vol} assignments are up to date.`}
            </p>
            <button onClick={handleClose} style={{
              marginTop: 30, ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.accent, color: p.cream, padding: '14px 26px', border: 'none', cursor: 'pointer',
            }}>Done</button>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ flex: '0 0 auto', padding: '28px 32px 18px' }}>
              <h2 style={{ ...display, fontSize: 40, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 8px' }}>
                Assign <em style={{ fontStyle: 'italic', color: p.accent }}>{vol.name}</em>
              </h2>
              <p style={{ ...sub, fontSize: 17, lineHeight: 1.4, opacity: 0.72, fontWeight: 400, margin: 0 }}>
                {vol.lessons.length} lessons · ends in a final test · earns {vol.cert}. Pick who should take it.
              </p>
            </div>

            <div style={{ flex: '0 0 auto', padding: '0 32px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...lbl, opacity: 0.6 }}>{selected.size} OF {store.team.length} SELECTED</span>
              <button onClick={toggleAll} style={{
                ...lbl, color: p.accent, cursor: 'pointer', background: 'none', border: 'none', padding: 4,
              }}>{allChecked ? 'CLEAR ALL' : 'SELECT ALL'}</button>
            </div>

            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 32px', borderTop: `1px solid ${p.fg}20` }}>
              {store.team.map((t, i) => {
                const checked = selected.has(t.email);
                const was = alreadyAssigned.has(t.email);
                const vs = store.volumeStats(t.email, vol.id);
                return (
                  <button
                    key={t.email}
                    onClick={() => toggle(t.email)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      display: 'grid', gridTemplateColumns: '24px 36px 1fr auto', gap: 14, alignItems: 'center',
                      padding: '16px 4px', background: 'transparent',
                      border: 'none', borderBottom: i < store.team.length - 1 ? `1px dashed ${p.fg}20` : 'none',
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 5, border: `1.5px solid ${p.fg}`,
                      background: checked ? p.accent : 'transparent',
                      display: 'grid', placeItems: 'center', flex: '0 0 auto',
                    }}>
                      {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>}
                    </span>
                    <Mono name={t.name} />
                    <div>
                      <div style={{ ...sub, fontSize: 18, fontWeight: 500, lineHeight: 1.1 }}>{t.name}</div>
                      <div style={{ ...lbl, fontSize: 8.5, opacity: 0.5, marginTop: 3 }}>{t.role.toUpperCase()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {was ? (
                        <span style={{ ...lbl, fontSize: 8.5, color: p.accent }}>
                          {vs.certified ? '\u25C6 CERTIFIED' : vs.done > 0 ? `${vs.done}/${vs.total} DONE` : 'ASSIGNED'}
                        </span>
                      ) : (
                        <span style={{ ...lbl, fontSize: 8.5, opacity: 0.4 }}>NOT ASSIGNED</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{
              flex: '0 0 auto', padding: '18px 24px', borderTop: `1.5px solid ${p.fg}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <button onClick={handleClose} style={{
                ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'transparent', color: p.fg, padding: '13px 20px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
              }}>Cancel</button>
              <button
                onClick={commit}
                style={{
                  ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: p.accent, color: p.cream, padding: '13px 24px', border: 'none', cursor: 'pointer',
                }}
              >
                {newlyAdded.length > 0
                  ? `Assign to ${newlyAdded.length} barista${newlyAdded.length > 1 ? 's' : ''} \u2192`
                  : 'Save assignments \u2192'}
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

window.AssignModal = AssignModal;
