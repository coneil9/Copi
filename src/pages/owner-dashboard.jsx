import React from 'react';

function OwnerDashboard({ user }) {
  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  const cafe = store.getDefaultCafe() || {};
  const cafeId = cafe.id;
  const locations = store.getLocations(cafeId);
  const [filterLoc, setFilterLoc] = React.useState(null);

  // Get staff (filtered by location if selected)
  const allStaff = store.getUsers(cafeId, filterLoc).filter((u) => ['barista','host','manager'].includes(u.role));
  const baristas = allStaff.filter((u) => ['barista','host'].includes(u.role));

  // Stats
  const avgCompletion = baristas.length
    ? Math.round(baristas.reduce((s, u) => s + store.overallPct(u.email), 0) / baristas.length * 100)
    : 0;
  const lessonsThisWeek = store.lessonsThisWeek();
  const activity = store.activity(6);

  // Setup state
  const setupDone = cafe.setupComplete || cafe.onboardingPublished;
  const aiJobs = store.getAiJobs(cafeId);
  const latestJob = aiJobs[aiJobs.length - 1] || null;

  // Product update modules
  const productUpdates = Object.values(store.raw().modules || {})
    .filter((m) => m.cafeId === cafeId && m.type === 'product_update' && m.status === 'published');
  const now = Date.now();

  // Barista detail modal
  const [detailUser, setDetailUser] = React.useState(null);

  // Assign module modal
  const [assignModal, setAssignModal] = React.useState(null); // { moduleId, type }
  const [assignTargets, setAssignTargets] = React.useState(new Set());
  const [deadlineHours, setDeadlineHours] = React.useState(72);

  // Product update create modal
  const [puModal, setPuModal] = React.useState(false);
  const [puTitle, setPuTitle] = React.useState('');
  const [puDeadline, setPuDeadline] = React.useState(48);
  const [toast, setToast]     = React.useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const handleAssign = () => {
    Array.from(assignTargets).forEach((uid) => {
      store.assignModule(uid, assignModal.moduleId, assignModal.type, deadlineHours);
    });
    showToast(`Assigned to ${assignTargets.size} staff.`);
    setAssignModal(null);
    setAssignTargets(new Set());
  };

  const handleCreateProductUpdate = () => {
    if (!puTitle.trim()) return;
    const mod = store.createModule({ cafeId, source: 'cafe', type: 'product_update', title: puTitle.trim(), roles: ['barista','host'], status: 'published', deadlineHours: puDeadline });
    // Assign to all baristas at selected location (or all)
    const targets = store.getUsers(cafeId, filterLoc).filter((u) => ['barista','host'].includes(u.role));
    targets.forEach((u) => store.assignModule(u.id, mod.id, 'product_update', puDeadline));
    setPuModal(false); setPuTitle('');
    showToast(`Product update pushed to ${targets.length} staff.`);
  };

  const getBaristaProgress = (u) => {
    const pct = Math.round(store.overallPct(u.email) * 100);
    const curr = store.currentLesson(u.email);
    return { pct, curr };
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg }}>
      {/* Nav */}
      <div style={{ background: th.bgCard, borderBottom: `1px solid ${th.line}`, padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>
        <span style={{ ...ty.displayItalic, fontSize: 22, color: th.accent, marginRight: 32, cursor: 'default' }}>Copi.</span>
        {['Dashboard','Team','Curriculum','Analytics','Billing','Settings'].map((label) => {
          const route = label.toLowerCase() === 'dashboard' ? 'dashboard' : label.toLowerCase() === 'team' ? 'team' : label.toLowerCase() === 'curriculum' ? 'admin-curriculum' : label.toLowerCase();
          return (
            <button key={label} onClick={() => window.CopiActions?.navigate(route)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, ...ty.nav, color: label === 'Dashboard' ? th.accent : th.muted, fontWeight: label === 'Dashboard' ? 600 : 400, backgroundColor: label === 'Dashboard' ? th.bgInset : 'transparent' }}>
              {label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <span style={{ ...ty.caption, color: th.muted, marginRight: 12 }}>{user?.name || 'Owner'} · {cafe.name || 'My Cafe'}</span>
        <button data-app-action="logout" style={{ ...ty.label, padding: '5px 12px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Log out</button>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header + location switcher */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 4 }}>Owner · {cafe.name || 'Dashboard'}</p>
            <h1 style={{ ...ty.h2, color: th.ink, margin: 0 }}>Dashboard</h1>
          </div>
          {/* Product update button */}
          <button onClick={() => setPuModal(true)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
            + Push product update
          </button>
        </div>

        {/* Location switcher */}
        {locations.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {[{id: null, name: 'All Locations'}, ...locations].map((loc) => (
              <button key={loc.id || 'all'} onClick={() => setFilterLoc(loc.id)}
                style={{ ...ty.label, padding: '5px 14px', borderRadius: 999, background: filterLoc === loc.id ? th.accent : th.bgInset, color: filterLoc === loc.id ? th.onDark : th.muted, border: 'none', cursor: 'pointer', transition: 'all 140ms' }}>
                {loc.name}
              </button>
            ))}
          </div>
        )}

        {/* Setup task card (persistent until complete) */}
        {!setupDone && (
          <div style={{ background: `${th.accent}0d`, border: `1.5px solid ${th.accent}55`, borderRadius: th.card, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 4 }}>Setup required</p>
              <h3 style={{ ...ty.h4, color: th.ink, margin: '0 0 4px' }}>
                {latestJob
                  ? latestJob.status === 'ready' ? '✓ AI review ready — approve and publish' : latestJob.status === 'processing' ? 'AI is processing your documents…' : 'Upload your training materials'
                  : 'Upload your training materials to get started'}
              </h3>
              <p style={{ ...ty.bodySmall, color: th.muted, margin: 0 }}>
                Drop in your handbook, recipes, and SOPs. The AI maps them into onboarding milestones for your team.
              </p>
            </div>
            <button onClick={() => window.CopiActions?.navigate('ai-review')}
              style={{ ...ty.button, padding: '9px 22px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer', flexShrink: 0 }}>
              {latestJob?.status === 'ready' ? 'Review & publish →' : 'Set up onboarding →'}
            </button>
          </div>
        )}

        {/* Product updates with deadlines */}
        {productUpdates.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 12 }}>Active product updates</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {productUpdates.map((mod) => {
                const assignments = store.getAssignmentsForModule(mod.id);
                const done = assignments.filter((a) => a.status === 'completed').length;
                const total = assignments.length;
                // Compute soonest deadline across assignments
                const soonest = assignments.reduce((min, a) => a.deadline && a.deadline < min ? a.deadline : min, Infinity);
                const hoursLeft = soonest < Infinity ? Math.max(0, Math.round((soonest - now) / 3600000)) : null;
                const urgent = hoursLeft !== null && hoursLeft <= 48;
                return (
                  <div key={mod.id} style={{ background: th.bgCard, borderRadius: th.card, border: `1.5px solid ${urgent ? th.urgent + '66' : th.line}`, padding: '14px 18px', minWidth: 180, boxShadow: sh.card }}>
                    <p style={{ ...ty.body, fontWeight: 500, color: th.ink, margin: '0 0 4px' }}>{mod.title}</p>
                    <p style={{ ...ty.caption, color: th.muted, margin: '0 0 8px' }}>{done}/{total} completed</p>
                    {hoursLeft !== null && (
                      <span style={{ ...ty.label, background: urgent ? `${th.urgent}18` : th.bgInset, color: urgent ? th.urgent : th.muted, padding: '2px 10px', borderRadius: 999 }}>
                        {urgent ? '⚡ ' : ''}{hoursLeft}h left
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Team completion', value: `${avgCompletion}%`, sub: 'avg across baristas', color: th.accent },
            { label: 'Lessons this week', value: lessonsThisWeek, sub: 'across all staff', color: th.gold },
            { label: 'Staff', value: baristas.length, sub: filterLoc ? `at ${locations.find(l=>l.id===filterLoc)?.name}` : 'total', color: th.ink },
            { label: 'Locations', value: locations.length, sub: 'in your account', color: th.ink },
          ].map((s) => (
            <div key={s.label} style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: '18px 20px', boxShadow: sh.card }}>
              <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 4 }}>{s.label}</p>
              <p style={{ ...ty.h2, color: s.color, margin: '0 0 2px', fontSize: 32 }}>{s.value}</p>
              <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Two column: staff list + activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          {/* Staff progress table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ ...ty.eyebrow, color: th.muted }}>Team progress</p>
              <button onClick={() => window.CopiActions?.navigate('team')} style={{ ...ty.caption, color: th.accent, background: 'none', border: 'none', cursor: 'pointer' }}>Manage team →</button>
            </div>
            <div style={{ borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 80px 160px 100px', background: th.bgInset, borderBottom: `1px solid ${th.line}`, padding: '0 4px' }}>
                {['Name','Progress','Current lesson','Status'].map((h) => (
                  <div key={h} style={{ ...ty.eyebrow, color: th.muted, padding: '9px 12px' }}>{h}</div>
                ))}
              </div>
              {baristas.length === 0 ? (
                <div style={{ ...ty.body, color: th.muted, padding: '24px 16px', textAlign: 'center', background: th.bgCard }}>
                  No baristas yet. <button onClick={() => window.CopiActions?.navigate('team')} style={{ color: th.accent, background: 'none', border: 'none', cursor: 'pointer', ...ty.body }}>Add staff →</button>
                </div>
              ) : baristas.map((u, i) => {
                const { pct, curr } = getBaristaProgress(u);
                const statusColor = pct === 100 ? th.accent : pct >= 50 ? th.gold : th.urgent;
                const statusLabel = pct === 100 ? 'Complete' : pct >= 50 ? 'On track' : 'Behind';
                return (
                  <div key={u.id} onClick={() => setDetailUser(u)}
                    style={{ display: 'grid', gridTemplateColumns: '1.5fr 80px 160px 100px', background: th.bgCard, borderBottom: i < baristas.length-1 ? `1px solid ${th.line}` : 'none', padding: '0 4px', cursor: 'pointer', transition: 'background 120ms' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = th.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = th.bgCard; }}>
                    <div style={{ padding: '11px 12px' }}>
                      <p style={{ ...ty.bodySmall, color: th.ink, margin: 0, fontWeight: 500 }}>{u.name}</p>
                      <p style={{ ...ty.caption, color: th.muted, margin: '1px 0 0' }}>{u.role}</p>
                    </div>
                    <div style={{ padding: '11px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                      <p style={{ ...ty.caption, color: th.ink, margin: 0, fontWeight: 500 }}>{pct}%</p>
                      <div style={{ background: th.bgInset, borderRadius: 999, height: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? th.accent : th.gold, borderRadius: 999 }} />
                      </div>
                    </div>
                    <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center' }}>
                      <p style={{ ...ty.caption, color: th.muted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {curr ? (curr.isFinal ? 'Final test' : curr.lesson?.title) : (pct === 100 ? 'All done ✓' : 'Not started')}
                      </p>
                    </div>
                    <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ ...ty.label, background: statusColor + '18', color: statusColor, padding: '3px 10px', borderRadius: 999 }}>{statusLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 14 }}>Recent activity</p>
            <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden', boxShadow: sh.card }}>
              {activity.length === 0 ? (
                <p style={{ ...ty.bodySmall, color: th.muted, padding: '20px 16px', textAlign: 'center', margin: 0 }}>No activity yet.</p>
              ) : activity.map((a, i) => (
                <div key={a.id || i} style={{ padding: '12px 16px', borderBottom: i < activity.length-1 ? `1px solid ${th.line}` : 'none', display: 'flex', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: a.kind === 'cert' ? th.gold : a.kind === 'assign' ? th.accent : th.muted, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ ...ty.caption, color: th.ink, margin: 0 }}><strong>{a.who}</strong> {a.action}</p>
                    <p style={{ ...ty.caption, color: th.muted, margin: '1px 0 0', fontStyle: 'italic' }}>{a.label}</p>
                    <p style={{ ...ty.caption, color: th.muted, margin: '2px 0 0', opacity: 0.6 }}>
                      {(() => { const d = (Date.now() - a.ts) / 3600000; return d < 1 ? 'Just now' : d < 24 ? `${Math.round(d)}h ago` : `${Math.round(d/24)}d ago`; })()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barista detail modal */}
      {detailUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(31,27,20,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetailUser(null); }}>
          <div style={{ background: th.bgCard, borderRadius: 18, boxShadow: sh.modal, width: '100%', maxWidth: 520, maxHeight: '85vh', overflow: 'auto' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ ...ty.h4, color: th.ink, margin: '0 0 2px' }}>{detailUser.name}</h3>
                <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{detailUser.role} · {locations.find(l=>l.id===detailUser.locationId)?.name}</p>
              </div>
              <button onClick={() => setDetailUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 22 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 18 }}>
                <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 8 }}>Learning progress</p>
                {(window.COPI_CURRICULUM || []).map((vol) => {
                  const stats = store.volumeStats(detailUser.email, vol.id);
                  if (!stats.assigned) return null;
                  return (
                    <div key={vol.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p style={{ ...ty.bodySmall, color: th.ink, margin: 0 }}>{vol.name}</p>
                        <p style={{ ...ty.caption, color: stats.certified ? th.accent : th.muted, margin: 0 }}>{stats.certified ? '✓ Certified' : `${stats.done}/${stats.total} lessons`}</p>
                      </div>
                      <div style={{ background: th.bgInset, borderRadius: 999, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round(stats.pct * 100)}%`, height: '100%', background: stats.certified ? th.accent : th.gold, borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Assign vol 3 (progression) */}
              {!store.isAssigned(detailUser.email, 'vol-3') && (
                <button onClick={() => { store.assignVolume('vol-3', [detailUser.email]); showToast(`Vol III assigned to ${detailUser.name}.`); setDetailUser(null); }}
                  style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
                  Assign Bar Certified track
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Push product update modal */}
      {puModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(31,27,20,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setPuModal(false); }}>
          <div style={{ background: th.bgCard, borderRadius: 18, boxShadow: sh.modal, width: '100%', maxWidth: 460 }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...ty.h4, color: th.ink, margin: 0 }}>Push product update</h3>
              <button onClick={() => setPuModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 22 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Update title</label>
                <input value={puTitle} onChange={(e) => setPuTitle(e.target.value)} placeholder="e.g. New autumn menu items"
                  style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: 10, color: th.ink, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...ty.label, display: 'block', marginBottom: 8, color: th.ink }}>Deadline for completion</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{h: 24, label: '24h'}, {h: 48, label: '48h'}, {h: 72, label: '3 days'}, {h: 168, label: '1 week'}].map((opt) => (
                    <button key={opt.h} onClick={() => setPuDeadline(opt.h)}
                      style={{ flex: 1, padding: '8px', borderRadius: 10, background: puDeadline === opt.h ? th.accent : th.bgInset, color: puDeadline === opt.h ? th.onDark : th.muted, border: puDeadline === opt.h ? 'none' : `1px solid ${th.line}`, ...ty.label, cursor: 'pointer', transition: 'all 140ms' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {puDeadline <= 48 && <p style={{ ...ty.caption, color: th.urgent, marginTop: 6 }}>⚡ 48h or less — will show as urgent for staff.</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setPuModal(false)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleCreateProductUpdate} disabled={!puTitle.trim()}
                  style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: puTitle.trim() ? 'pointer' : 'not-allowed', opacity: puTitle.trim() ? 1 : 0.5 }}>
                  Push update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: th.ink, color: th.onDark, padding: '12px 20px', borderRadius: 999, ...ty.bodySmall, maxWidth: 460, boxShadow: sh.modal }}>
          {toast}
        </div>
      )}
    </div>
  );
}

window.OwnerDashboard = OwnerDashboard;
