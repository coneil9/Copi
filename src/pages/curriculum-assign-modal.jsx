// ═════════════════════════════════════════════════════════
// CURRICULUM ASSIGN MODAL — Opens before a draft curriculum
// is published. Owner picks "all employees" or a specific
// subset. On confirm, the parent runs the actual publish
// flow with the chosen userIds.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { createPortal } from 'react-dom';

export function CurriculumAssignModal({
  open,
  curriculum,            // the draft curriculum object (for title/source)
  cafeId,
  onCancel,
  onConfirm,             // ({ mode: 'all' | 'selected', userIds: string[] }) => void
  busy = false,
  initialUserIds = null, // when provided, modal opens in 'selected' mode pre-checked
  submitLabel = null,    // overrides the default button text (used for "Manage access")
}) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const [mode, setMode]               = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState(() => new Set());
  const [closing, setClosing]         = React.useState(false);

  const targets = React.useMemo(() => {
    if (!cafeId || !store) return [];
    return store.getUsers(cafeId)
      .filter((u) => ['barista', 'host'].includes(u.role))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [cafeId, store, open]);

  // Reset on open. If initialUserIds is provided, jump straight to
  // "selected" mode with those pre-checked (used by Manage access).
  React.useEffect(() => {
    if (!open) return;
    if (initialUserIds && initialUserIds.length >= 0) {
      setMode('selected');
      setSelectedIds(new Set(initialUserIds));
    } else {
      setMode('all');
      setSelectedIds(new Set());
    }
    setClosing(false);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && !busy) attemptClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy]);

  if (!open && !closing) return null;

  const attemptClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onCancel?.(); }, 180);
  };

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(targets.map((u) => u.id)));
  const selectNone = () => setSelectedIds(new Set());

  const confirm = () => {
    if (mode === 'all') {
      onConfirm?.({ mode: 'all', userIds: targets.map((u) => u.id) });
    } else {
      onConfirm?.({ mode: 'selected', userIds: Array.from(selectedIds) });
    }
  };

  // For Manage access, an empty selection IS valid (means unassign everyone).
  const canConfirm = mode === 'all' || (initialUserIds !== null) || selectedIds.size > 0;

  return createPortal((
    <div
      data-proto-ui
      onClick={(e) => { if (e.target === e.currentTarget && !busy) attemptClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9600,
        background: 'rgba(28,28,26,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1,
        transition: 'opacity 180ms ease',
      }}
    >
      <div style={{
        width: 'min(560px, 100%)',
        maxHeight: 'calc(100vh - 48px)',
        background: 'var(--alabaster)',
        borderRadius: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.985)' : 'translateY(0) scale(1)',
        transition: 'transform 180ms cubic-bezier(.2,.7,.2,1)',
      }}>
        <header style={{
          padding: '20px 24px',
          background: 'var(--white)',
          borderBottom: '1px solid var(--pearl-bush)',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--glade-green-deep)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Publish curriculum
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--graphite)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Who should see {curriculum?.shopName || 'this curriculum'}?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--roman-coffee)',
            margin: '6px 0 0 0',
            lineHeight: 1.5,
          }}>
            Once published, the people you choose will see it in their library.
            You can change who has access at any time.
          </p>
        </header>

        <section style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { v: 'all', label: 'All employees', sub: `${targets.length} ${targets.length === 1 ? 'person' : 'people'}` },
              { v: 'selected', label: 'Choose specific', sub: 'pick from your roster' },
            ].map((opt) => {
              const active = mode === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setMode(opt.v)}
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: active ? 'var(--glade-green-deep)' : 'var(--white)',
                    color: active ? 'var(--white)' : 'var(--graphite)',
                    border: active ? '1.5px solid var(--glade-green-deep)' : '1.5px solid var(--pearl-bush)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{
                    fontSize: 11.5,
                    opacity: active ? 0.85 : 0.7,
                    marginTop: 2,
                  }}>{opt.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Roster (only when "Choose specific") */}
          {mode === 'selected' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--roman-coffee)',
                }}>
                  {selectedIds.size} selected
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={selectAll}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--glade-green-deep)',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >Select all</button>
                  <button
                    type="button"
                    onClick={selectNone}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--roman-coffee)',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >Clear</button>
                </div>
              </div>
              {targets.length === 0 && (
                <div style={{
                  padding: 16,
                  borderRadius: 10,
                  background: 'var(--pearl-bush)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--roman-coffee)',
                }}>
                  No baristas or hosts in your cafe yet. Invite teammates from the Team page first.
                </div>
              )}
              <div style={{
                border: '1px solid var(--pearl-bush)',
                borderRadius: 10,
                overflow: 'hidden',
                maxHeight: 280,
                overflowY: 'auto',
                background: 'var(--white)',
              }}>
                {targets.map((u) => {
                  const checked = selectedIds.has(u.id);
                  return (
                    <label
                      key={u.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--pearl-bush)',
                        background: checked ? 'rgba(111, 139, 95, 0.08)' : 'transparent',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(u.id)}
                        style={{ accentColor: 'var(--glade-green-deep)', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: 'var(--graphite)',
                        }}>{u.name}</div>
                        <div style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11.5,
                          color: 'var(--roman-coffee)',
                          textTransform: 'capitalize',
                        }}>{u.role}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <footer style={{
          padding: '14px 24px',
          background: 'var(--white)',
          borderTop: '1px solid var(--pearl-bush)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}>
          <button
            type="button"
            onClick={attemptClose}
            disabled={busy}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              color: 'var(--graphite)',
              border: '1.5px solid var(--pearl-bush)',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer',
            }}
          >Cancel</button>
          <button
            type="button"
            onClick={confirm}
            disabled={!canConfirm || busy}
            style={{
              padding: '10px 22px',
              background: canConfirm && !busy ? 'var(--glade-green-deep)' : 'var(--heathered-gray)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              cursor: canConfirm && !busy ? 'pointer' : 'not-allowed',
            }}
          >
            {busy
              ? 'Publishing…'
              : submitLabel
                ? submitLabel
                : mode === 'all'
                  ? `Publish to all (${targets.length})`
                  : `Publish to ${selectedIds.size}`}
          </button>
        </footer>
      </div>
    </div>
  ), document.body);
}

if (typeof window !== 'undefined') {
  window.CurriculumAssignModal = CurriculumAssignModal;
}

export default CurriculumAssignModal;
