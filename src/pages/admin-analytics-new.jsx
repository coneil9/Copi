import React from 'react';
import './admin-nav.jsx';

function AdminAnalyticsNew({ user = {} }) {
  const th  = window.THEME      || {};
  const ty  = window.TYPOGRAPHY || {};
  const sh  = window.SHADOW     || {};

  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store.getDefaultCafe ? store.getDefaultCafe() : null;
  const AdminNav = window.AdminNav;

  const relTime = (ts) => {
    if (!ts) return 'no activity yet';
    const s = (Date.now()-ts)/1000;
    if (s < 3600) return Math.round(s/60)+'m ago';
    if (s < 86400) return Math.round(s/3600)+'h ago';
    const d = Math.round(s/86400); return d <= 1 ? 'yesterday' : d+'d ago';
  };

  const lastActive = (email) => {
    const u = store.getUserByEmail ? store.getUserByEmail(email) : null;
    const prog = u ? (store.raw().progress[u.id] || {}) : null;
    if (!prog) return 0;
    let m = 0;
    Object.values(prog.lessons || {}).forEach(r => { if (r.ts > m) m = r.ts; });
    Object.values(prog.finals  || {}).forEach(r => { if (r.ts > m) m = r.ts; });
    return m;
  };

  const weekAgo = Date.now() - 1000*60*60*24*7;
  const snapshot = store.teamSnapshot();
  const needsAttention = snapshot.filter(t => t.pct < 35).length;

  const summaryStats = [
    { label: 'Team completion', value: Math.round(store.teamCompletion()*100)+'%', sub: 'across assigned volumes', color: th.accent },
    { label: 'Lessons / week',  value: String(store.lessonsThisWeek()), sub: 'last 7 days', color: th.gold },
    { label: 'Avg quiz score',  value: Math.round(store.avgScore()*100)+'%', sub: 'across all attempts', color: th.ink },
    { label: 'Needs attention', value: String(needsAttention), sub: 'baristas under 35%', color: needsAttention > 0 ? th.danger : th.accent },
  ];

  const team = snapshot.map(t => {
    const ts = lastActive(t.email);
    const flag = t.pct >= 80 ? 'strong' : t.pct >= 55 ? 'ok' : t.pct >= 35 ? 'watch' : 'risk';
    const trend = ts >= weekAgo ? 'up' : flag === 'risk' ? 'down' : 'steady';
    return { name: t.name, email: t.email, role: t.role, cert: t.cert, pct: t.pct, trend, active: relTime(ts), flag };
  });

  const flagStyle = {
    strong: { bg: `${th.accent}18`, color: th.accent,  label: 'Strong'   },
    ok:     { bg: th.bgInset,        color: th.muted,   label: 'On track' },
    watch:  { bg: `${th.gold}22`,    color: th.gold,    label: 'Watch'    },
    risk:   { bg: `${th.danger}14`,  color: th.danger,  label: 'At risk'  },
  };

  const Trend = ({ dir }) => {
    const color = dir === 'up' ? th.accent : dir === 'down' ? th.danger : th.muted;
    const path  = dir === 'up' ? 'M3 12l4-5 4 3 5-7' : dir === 'down' ? 'M3 6l4 5 4-3 5 7' : 'M2 10h14';
    return <svg width="20" height="14" viewBox="0 0 20 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
  };

  const Mono = ({ name: n, size = 28 }) => {
    const initials = (n||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return <div style={{ width: size, height: size, borderRadius: '50%', background: th.accent, color: th.onDark, display: 'grid', placeItems: 'center', fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: size*0.37, fontWeight: 700, flexShrink: 0 }}>{initials}</div>;
  };

  // Knowledge gaps — seeded from store + real vol pass rates
  const curriculum = window.COPI_CURRICULUM || [];
  const gaps = [];
  curriculum.forEach(v => {
    const ts = store.teamVolumeStats(v.id);
    if (!ts.assigned) return;
    const completedPct = ts.assigned > 0 ? Math.round((ts.completed / ts.assigned)*100) : 0;
    if (completedPct < 70) {
      gaps.push({ topic: v.name, vol: v.vol, pct: completedPct, sev: completedPct < 40 ? 'HIGH' : completedPct < 60 ? 'MED' : 'LOW' });
    }
  });

  const sevColor = (s) => s === 'HIGH' ? th.danger : s === 'MED' ? th.gold : th.accent;
  const [expandedGap, setExpandedGap] = React.useState(null);

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.ink }}>
      {AdminNav && <AdminNav current="analytics" user={user} cafe={cafe} />}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.accent, margin: '0 0 4px' }}>Owner · Analytics</p>
          <h1 style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontSize: 38, fontWeight: 400, color: th.ink, margin: 0 }}>Team performance</h1>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {summaryStats.map(s => (
            <div key={s.label} style={{ background: th.bgCard, borderRadius: th.card, padding: '18px 20px', border: `1px solid ${th.line}`, boxShadow: sh.card }}>
              <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: th.muted, margin: '0 0 4px' }}>{s.label}</p>
              <p style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic', fontSize: 34, color: s.color, margin: '0 0 2px', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, color: th.muted, margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
          {/* Team progress table */}
          <div>
            <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.muted, marginBottom: 12 }}>Individual progress</p>
            <div style={{ borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 110px 100px 90px 80px', background: th.bgInset, borderBottom: `1px solid ${th.line}`, padding: '0 4px' }}>
                {['Name','Progress','Certification','Status','Trend','Last active'].map(h => (
                  <div key={h} style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: th.muted, padding: '9px 10px' }}>{h}</div>
                ))}
              </div>

              {team.length === 0 ? (
                <div style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 14, color: th.muted, padding: '24px', textAlign: 'center', background: th.bgCard }}>No staff enrolled yet.</div>
              ) : team.map((t, i) => {
                const fs = flagStyle[t.flag] || flagStyle.ok;
                return (
                  <div key={t.email} style={{ display: 'grid', gridTemplateColumns: '2fr 90px 110px 100px 90px 80px', background: th.bgCard, borderBottom: i < team.length-1 ? `1px solid ${th.line}` : 'none', padding: '0 4px', alignItems: 'center' }}>
                    {/* Name */}
                    <div style={{ padding: '12px 10px', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Mono name={t.name} size={28} />
                      <div>
                        <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 13, fontWeight: 500, color: th.ink, margin: 0 }}>{t.name}</p>
                        <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, color: th.muted, margin: '1px 0 0' }}>{t.role}</p>
                      </div>
                    </div>
                    {/* Progress */}
                    <div style={{ padding: '12px 10px' }}>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 13, fontWeight: 600, color: th.ink, margin: '0 0 4px' }}>{t.pct}%</p>
                      <div style={{ background: th.bgInset, borderRadius: 999, height: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${t.pct}%`, height: '100%', background: t.pct >= 80 ? th.accent : t.pct >= 50 ? th.gold : th.danger, borderRadius: 999 }} />
                      </div>
                    </div>
                    {/* Certification */}
                    <div style={{ padding: '12px 10px' }}>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 12, color: t.cert === '—' ? th.muted : th.accent }}>{t.cert === '—' ? 'Not yet' : t.cert}</p>
                    </div>
                    {/* Status */}
                    <div style={{ padding: '12px 10px' }}>
                      <span style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, background: fs.bg, color: fs.color, padding: '3px 9px', borderRadius: 999 }}>{fs.label}</span>
                    </div>
                    {/* Trend */}
                    <div style={{ padding: '12px 10px' }}>
                      <Trend dir={t.trend} />
                    </div>
                    {/* Last active */}
                    <div style={{ padding: '12px 10px' }}>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, color: th.muted }}>{t.active}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Knowledge gaps */}
          <div>
            <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.muted, marginBottom: 12 }}>Knowledge gaps</p>
            {gaps.length === 0 ? (
              <div style={{ background: th.bgCard, borderRadius: th.card, padding: '24px', border: `1px solid ${th.line}`, textAlign: 'center' }}>
                <p style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontSize: 18, color: th.accent, margin: '0 0 4px' }}>Looking strong.</p>
                <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 13, color: th.muted, margin: 0 }}>No significant gaps detected.</p>
              </div>
            ) : gaps.map((g, i) => {
              const expanded = expandedGap === i;
              return (
                <div key={i} style={{ background: th.bgCard, borderRadius: th.card, padding: '14px 16px', border: `1px solid ${th.line}`, marginBottom: 10, boxShadow: sh.card }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 700, color: sevColor(g.sev), background: `${sevColor(g.sev)}18`, padding: '2px 7px', borderRadius: 999 }}>{g.sev}</span>
                        <span style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, color: th.muted }}>{g.vol}</span>
                      </div>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 14, fontWeight: 500, color: th.ink, margin: '0 0 4px' }}>{g.topic}</p>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 12, color: th.muted, margin: 0 }}>{g.pct}% of team completed</p>
                    </div>
                    <button onClick={() => setExpandedGap(expanded ? null : i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.accent, fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 12, padding: '2px 6px', flexShrink: 0 }}>
                      {expanded ? 'Less' : 'Drill →'}
                    </button>
                  </div>
                  {expanded && (
                    <div style={{ marginTop: 12, padding: '12px 14px', background: `${th.accent}0a`, borderRadius: 10, border: `1px solid ${th.accent}22` }}>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.accent, margin: '0 0 6px' }}>Floor drill</p>
                      <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 13, color: th.ink, lineHeight: 1.55, margin: 0 }}>
                        Run a 5-minute check on {g.topic.toLowerCase()} at your next pre-shift. Ask each barista to answer one key question — it surfaces gaps fast and makes the lesson content stick.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Product update status */}
            {cafe && (() => {
              const puMods = Object.values(store.raw().modules || {}).filter(m => m.cafeId === cafe.id && m.type === 'product_update' && m.status === 'published');
              if (!puMods.length) return null;
              return (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.muted, marginBottom: 8 }}>Product updates</p>
                  {puMods.map(mod => {
                    const asgns = store.getAssignmentsForModule(mod.id);
                    const done = asgns.filter(a => a.status === 'completed').length;
                    const pct = asgns.length ? Math.round((done/asgns.length)*100) : 0;
                    const urgentDeadline = asgns.find(a => a.deadline && (a.deadline - Date.now()) < 48*3600*1000);
                    return (
                      <div key={mod.id} style={{ background: th.bgCard, borderRadius: 10, padding: '12px 14px', border: `1px solid ${urgentDeadline ? th.urgent||th.danger : th.line}`, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 13, fontWeight: 500, color: th.ink, margin: 0 }}>{mod.title}</p>
                          <p style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 12, color: pct === 100 ? th.accent : th.muted, margin: 0 }}>{done}/{asgns.length}</p>
                        </div>
                        <div style={{ background: th.bgInset, borderRadius: 999, height: 5, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? th.accent : th.gold, borderRadius: 999 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

window.AdminAnalyticsNew = AdminAnalyticsNew;
