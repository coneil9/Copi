import React from 'react';
import './admin-nav.jsx';

function AdminCurriculumNew({ user = {} }) {
  const th  = window.THEME      || {};
  const ty  = window.TYPOGRAPHY || {};
  const sh  = window.SHADOW     || {};
  const act = window.CopiActions || {};

  const store  = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe   = store.getDefaultCafe ? store.getDefaultCafe() : null;
  const AdminNav = window.AdminNav;

  // Live team progress for Copi volumes
  const curriculum = window.COPI_CURRICULUM || [];
  const fmtTime = (mins) => mins >= 60 ? `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m` : `${mins}m`;

  const volumes = curriculum.map((v) => {
    const ts = store.teamVolumeStats(v.id);
    const totalMins = v.lessons.reduce((a, l) => a + (l.minutes || 0), 0);
    return { id: v.id, vol: v.vol, name: v.name, cert: v.cert, tag: v.tag, lessonCount: v.lessons.length, duration: fmtTime(totalMins), assigned: ts.assigned, completed: ts.completed, inProgress: ts.inProgress };
  });

  // Cafe-specific modules (onboarding + custom tracks)
  const cafeModules = cafe ? Object.values(store.raw().modules || {}).filter(m => m.cafeId === cafe.id && m.status === 'published') : [];
  const onboardingModules = cafeModules.filter(m => m.type === 'onboarding');
  const trackModules = cafeModules.filter(m => m.type === 'learning_track');
  const setupDone = cafe?.setupComplete || cafe?.onboardingPublished;
  const latestAiJob = cafe ? store.getLatestAiJob(cafe.id) : null;

  // Activity feed
  const activity = store.activity(5);
  const relTime = (ts) => { const s = (Date.now()-ts)/1000; if(s<3600) return Math.round(s/60)+'m ago'; if(s<86400) return Math.round(s/3600)+'h ago'; return Math.round(s/86400)+'d ago'; };

  // Assign modal state
  const [assignVolId, setAssignVolId] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const openAssign = (volId) => {
    if (window.CopiActions?.openAssign) { window.CopiActions.openAssign(volId); }
  };

  const teamSize = store.team?.length || 0;
  const lessonsThisWeek = store.lessonsThisWeek();
  const teamCompletion = Math.round(store.teamCompletion() * 100);

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.ink }}>
      {AdminNav && <AdminNav current="admin-curriculum" user={user} cafe={cafe} />}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.accent, margin: '0 0 4px' }}>Owner · Curriculum</p>
            <h1 style={{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 38, fontWeight: 400, color: th.ink, margin: 0 }}>What your team is learning</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => act.navigate && act.navigate('ai-review')}
              style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, padding: '9px 18px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>
              ↑ Upload training docs
            </button>
            <button onClick={() => act.navigate && act.navigate('team')}
              style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, padding: '9px 18px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
              Assign to staff
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Volumes', value: curriculum.length, sub: `${onboardingModules.length} cafe + ${curriculum.length} standard`, color: th.ink },
            { label: 'Lessons / week', value: lessonsThisWeek, sub: 'team · last 7 days', color: th.gold },
            { label: 'Team completion', value: teamCompletion + '%', sub: 'across assigned volumes', color: th.accent },
            { label: 'Active staff', value: teamSize, sub: 'enrolled in curriculum', color: th.ink },
          ].map((s) => (
            <div key={s.label} style={{ background: th.bgCard, borderRadius: th.card, padding: '18px 20px', border: `1px solid ${th.line}`, boxShadow: sh.card }}>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: th.muted, margin: '0 0 4px' }}>{s.label}</p>
              <p style={{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontStyle: 'italic', fontSize: 32, color: s.color, margin: '0 0 2px', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: th.muted, margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Setup card if onboarding not done */}
        {!setupDone && (
          <div style={{ background: `${th.accent}0e`, border: `1.5px solid ${th.accent}55`, borderRadius: th.card, padding: '18px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: th.accent, margin: '0 0 3px' }}>Setup required</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: th.ink, margin: 0, fontWeight: 500 }}>
                {latestAiJob?.status === 'ready' ? '✓ AI review ready — approve and publish your onboarding.' : 'Upload your training materials to generate an onboarding track.'}
              </p>
            </div>
            <button onClick={() => act.navigate && act.navigate('ai-review')}
              style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer', flexShrink: 0 }}>
              {latestAiJob?.status === 'ready' ? 'Review & publish →' : 'Set up onboarding →'}
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Left: curriculum tracks */}
          <div>
            {/* Cafe onboarding modules */}
            {onboardingModules.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.muted, marginBottom: 12 }}>Your cafe · Onboarding</p>
                {onboardingModules.map((mod) => {
                  const assignments = store.getAssignmentsForModule(mod.id);
                  const done = assignments.filter(a => a.status === 'completed').length;
                  return (
                    <div key={mod.id} style={{ background: th.bgCard, borderRadius: th.card, padding: '18px 20px', border: `1px solid ${th.line}`, marginBottom: 10, boxShadow: sh.card }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.accent, background: `${th.accent}15`, padding: '2px 8px', borderRadius: 999 }}>Onboarding</span>
                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: th.muted }}>Cafe-specific</span>
                          </div>
                          <p style={{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 20, fontWeight: 400, color: th.ink, margin: '0 0 4px' }}>{mod.title}</p>
                          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: 0 }}>
                            {(mod.lessonIds || []).length} milestones · {assignments.length} staff assigned · {done} completed
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                          <button onClick={() => act.navigate && act.navigate('ai-review')}
                            style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* Copi standard curriculum */}
            <section>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.muted, marginBottom: 12 }}>Copi standard curriculum</p>
              {volumes.map((v, i) => {
                const pct = v.assigned > 0 ? Math.round((v.completed / v.assigned) * 100) : 0;
                const certifiedCount = store.teamSnapshot().filter(t => {
                  const s = store.volumeStats(t.email, v.id);
                  return s.certified;
                }).length;
                return (
                  <div key={v.id} style={{ background: th.bgCard, borderRadius: th.card, padding: '20px 22px', border: `1px solid ${th.line}`, marginBottom: 10, boxShadow: sh.card }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.muted, background: th.bgInset, padding: '2px 8px', borderRadius: 999 }}>{v.vol}</span>
                          {v.cert && <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: th.gold, background: `${th.gold}18`, padding: '2px 8px', borderRadius: 999 }}>→ {v.cert}</span>}
                        </div>
                        <p style={{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 20, fontWeight: 400, color: th.ink, margin: '0 0 4px' }}>{v.name}</p>
                        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: '0 0 10px' }}>
                          {v.lessonCount} lessons · {v.duration} · {v.assigned} assigned · {certifiedCount} certified
                        </p>
                        {v.assigned > 0 && (
                          <div style={{ background: th.bgInset, borderRadius: 999, height: 5, overflow: 'hidden', maxWidth: 320 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: th.accent, borderRadius: 999, transition: 'width 400ms' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                        {v.assigned < teamSize && (
                          <button onClick={() => openAssign(v.id)}
                            style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
                            Assign
                          </button>
                        )}
                        {v.assigned >= teamSize && v.assigned > 0 && (
                          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.accent, background: `${th.accent}12`, padding: '5px 12px', borderRadius: 999 }}>✓ All assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>

          {/* Right: activity + quick actions */}
          <div>
            <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden', boxShadow: sh.card, marginBottom: 16 }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: th.muted, margin: 0 }}>Lessons in motion</p>
              </div>
              {activity.length === 0 ? (
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: th.muted, padding: '20px 16px', textAlign: 'center', margin: 0 }}>No activity yet.</p>
              ) : activity.map((a, i) => (
                <div key={a.id || i} style={{ padding: '12px 16px', borderBottom: i < activity.length - 1 ? `1px solid ${th.line}` : 'none', display: 'flex', gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 99, background: a.kind === 'cert' ? th.gold : a.kind === 'complete' ? th.accent : th.muted, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.ink, margin: 0 }}><strong>{a.who}</strong> {a.action}</p>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: th.muted, margin: '1px 0 0', fontStyle: 'italic' }}>{a.label}</p>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: th.muted, margin: '2px 0 0', opacity: 0.65 }}>{relTime(a.ts)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: '16px', boxShadow: sh.card }}>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: th.muted, margin: '0 0 12px' }}>Quick actions</p>
              {[
                { label: 'Upload training materials', desc: 'Add SOPs, recipes, handbooks', action: () => act.navigate && act.navigate('ai-review'), icon: '↑' },
                { label: 'Manage staff assignments', desc: 'See who has what', action: () => act.navigate && act.navigate('team'), icon: '→' },
                { label: 'Edit curriculum (CMS)', desc: 'Internal Copi content editor', action: () => { localStorage.setItem('copi.route','cms'); location.hash='#/cms'; location.reload(); }, icon: '⊙' },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: `1px solid ${th.line}`, borderRadius: 10, padding: '11px 14px', cursor: 'pointer', marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center', transition: 'background 120ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = th.bgInset; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: th.accent, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: th.ink, margin: 0 }}>{item.label}</p>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: th.muted, margin: '1px 0 0' }}>{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AdminCurriculumNew = AdminCurriculumNew;
