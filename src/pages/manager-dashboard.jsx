import React from 'react';

function ManagerDashboard({ user }) {
  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  const cafe = store.getDefaultCafe() || {};
  const cafeId = cafe.id;
  const locationId = user?.locationId;
  const location = store.getLocations(cafeId).find((l) => l.id === locationId);

  // Staff at this location
  const staff = store.getUsers(cafeId, locationId).filter((u) => ['barista','host'].includes(u.role));

  // Milestones for barista role
  const milestones = store.getMilestones(cafeId, 'barista').filter((m) => m.status === 'approved');

  // Signoff modal
  const [signoffModal, setSignoffModal] = React.useState(null); // { userId, milestoneId }
  const [signoffNote, setSignoffNote]   = React.useState('');
  const [toast, setToast]               = React.useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSignoff = () => {
    if (!signoffModal) return;
    store.completeMilestone(signoffModal.userId, signoffModal.milestoneId, user?.id || 'manager', signoffNote.trim());
    setSignoffModal(null);
    setSignoffNote('');
    showToast('Milestone signed off.');
  };

  const getMilestoneStatus = (userId, milestoneId) => {
    const prog = store.getProgress(userId);
    return prog?.milestones?.[milestoneId] || null;
  };

  const getOnboardingPct = (userId) => {
    if (!milestones.length) return 0;
    const prog = store.getProgress(userId);
    const done = milestones.filter((m) => prog?.milestones?.[m.id]?.done).length;
    return Math.round((done / milestones.length) * 100);
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg }}>
      {/* Nav */}
      <div style={{ background: th.bgCard, borderBottom: `1px solid ${th.line}`, padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>
        <span style={{ ...ty.displayItalic, fontSize: 22, color: th.accent, cursor: 'pointer', marginRight: 32 }}>Copi.</span>
        {['Dashboard', 'Team'].map((label) => (
          <button key={label} onClick={() => window.CopiActions?.navigate(label === 'Dashboard' ? 'manager-dashboard' : 'manager-team')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, ...ty.nav, color: label === 'Dashboard' ? th.accent : th.muted, fontWeight: label === 'Dashboard' ? 600 : 400, backgroundColor: label === 'Dashboard' ? th.bgInset : 'transparent' }}>
            {label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ ...ty.caption, color: th.muted, marginRight: 12 }}>{user?.name} · {location?.name}</span>
        <button data-app-action="logout" style={{ ...ty.label, padding: '5px 12px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Log out</button>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 4 }}>Manager · {location?.name || 'Your location'}</p>
          <h1 style={{ ...ty.h2, color: th.ink, margin: '0 0 6px' }}>Team onboarding</h1>
          <p style={{ ...ty.body, color: th.muted }}>Track progress and sign off milestones for your team.</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Team members', value: staff.length, sub: `at ${location?.name || 'your location'}` },
            { label: 'Avg onboarding', value: staff.length ? `${Math.round(staff.reduce((s, u) => s + getOnboardingPct(u.id), 0) / staff.length)}%` : '—', sub: 'across all baristas' },
            { label: 'Milestones', value: milestones.length, sub: 'in the onboarding checklist' },
          ].map((c) => (
            <div key={c.label} style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: '20px 22px', boxShadow: sh.card }}>
              <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 4 }}>{c.label}</p>
              <p style={{ ...ty.h2, color: th.accent, margin: '0 0 4px', fontSize: 34 }}>{c.value}</p>
              <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Staff roster with onboarding progress */}
        {staff.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: th.muted }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>☕</div>
            <h3 style={{ ...ty.h4, color: th.ink, margin: '0 0 8px' }}>No staff at this location yet.</h3>
            <p style={{ ...ty.body, color: th.muted }}>Ask your owner to add staff and assign them here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {staff.map((u) => {
              const pct = getOnboardingPct(u.id);
              return (
                <div key={u.id} style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: 20, boxShadow: sh.card }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <p style={{ ...ty.body, fontWeight: 500, color: th.ink, margin: '0 0 2px' }}>{u.name}</p>
                      <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{u.role} · joined {new Date(u.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...ty.label, color: pct === 100 ? th.accent : th.muted, margin: '0 0 4px' }}>{pct}% complete</p>
                      <div style={{ background: th.bgInset, borderRadius: 999, height: 6, width: 120, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? th.accent : th.gold, borderRadius: 999, transition: 'width 400ms ease' }} />
                      </div>
                    </div>
                  </div>

                  {milestones.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {milestones.map((ms) => {
                        const status = getMilestoneStatus(u.id, ms.id);
                        const done = !!status?.done;
                        return (
                          <div key={ms.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: done ? `${th.accent}0d` : th.bg, border: `1px solid ${done ? th.accent + '33' : th.line}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 18, height: 18, borderRadius: 99, background: done ? th.accent : 'transparent', border: `2px solid ${done ? th.accent : th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {done && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
                              </div>
                              <div>
                                <p style={{ ...ty.bodySmall, color: th.ink, margin: 0, fontWeight: done ? 400 : 500, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>{ms.title}</p>
                                {done && status.note && <p style={{ ...ty.caption, color: th.muted, margin: '1px 0 0' }}>Note: {status.note}</p>}
                              </div>
                            </div>
                            {!done && (
                              <button
                                onClick={() => { setSignoffModal({ userId: u.id, milestoneId: ms.id, staffName: u.name, milestoneTitle: ms.title }); setSignoffNote(''); }}
                                style={{ ...ty.label, padding: '5px 12px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer', flexShrink: 0 }}>
                                Sign off
                              </button>
                            )}
                            {done && <span style={{ ...ty.caption, color: th.muted, flexShrink: 0 }}>{new Date(status.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signoff modal */}
      {signoffModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(31,27,20,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSignoffModal(null); }}>
          <div style={{ background: th.bgCard, borderRadius: 18, boxShadow: sh.modal, width: '100%', maxWidth: 460 }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...ty.h4, color: th.ink, margin: 0 }}>Sign off milestone</h3>
              <button onClick={() => setSignoffModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 22, lineHeight: 1, padding: '2px 6px' }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ ...ty.body, color: th.ink, marginBottom: 4 }}><strong>{signoffModal.staffName}</strong></p>
              <p style={{ ...ty.bodySmall, color: th.muted, marginBottom: 20 }}>{signoffModal.milestoneTitle}</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>Add a note (optional)</label>
                <textarea
                  value={signoffNote} onChange={(e) => setSignoffNote(e.target.value)}
                  placeholder="e.g. Great first pull — took initiative on grind adjustment"
                  rows={3}
                  style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: 10, color: th.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = th.line; }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setSignoffModal(null)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSignoff} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Confirm sign-off</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: th.ink, color: th.onDark, padding: '12px 20px', borderRadius: 999, ...ty.bodySmall, maxWidth: 400, boxShadow: sh.modal }}>
          {toast}
        </div>
      )}
    </div>
  );
}

window.ManagerDashboard = ManagerDashboard;
