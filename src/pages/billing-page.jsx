import React from 'react';
import { calcPlan } from '../lib/billing.js';

function BillingPage({ user }) {
  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  const cafe = store.getDefaultCafe() || {};
  const cafeId = cafe.id;
  const locations = store.getLocations(cafeId);
  const allStaff = store.getUsers(cafeId).filter((u) => u.status !== 'inactive');
  const sub = cafe.subscription || {};

  const plan = calcPlan(allStaff.length, locations.length);

  const [simulating, setSimulating] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const renewsDate = sub.renewsAt ? new Date(sub.renewsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';
  const isActive = sub.status === 'active';

  const handleActivate = () => {
    setSimulating(true);
    setTimeout(() => {
      store.updateCafe(cafeId, { subscription: { ...sub, status: 'active', renewsAt: Date.now() + 1000*60*60*24*30 } });
      setSimulating(false);
      showToast('Subscription activated (simulated).');
    }, 1000);
  };

  const handleCancel = () => {
    store.updateCafe(cafeId, { subscription: { ...sub, status: 'cancelled' } });
    showToast('Subscription cancelled.');
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg }}>
      {/* Nav */}
      <div style={{ background: th.bgCard, borderBottom: `1px solid ${th.line}`, padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>
        <span onClick={() => window.CopiActions?.navigate('dashboard')} style={{ ...ty.displayItalic, fontSize: 22, color: th.accent, cursor: 'pointer', marginRight: 32 }}>Copi.</span>
        {['Dashboard','Team','Curriculum','Analytics','Billing','Settings'].map((label) => {
          const route = label.toLowerCase() === 'dashboard' ? 'dashboard' : label.toLowerCase() === 'team' ? 'team' : label.toLowerCase() === 'curriculum' ? 'admin-curriculum' : label.toLowerCase();
          return (
            <button key={label} onClick={() => window.CopiActions?.navigate(route)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, ...ty.nav, color: label === 'Billing' ? th.accent : th.muted, fontWeight: label === 'Billing' ? 600 : 400, backgroundColor: label === 'Billing' ? th.bgInset : 'transparent' }}>
              {label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button data-app-action="logout" style={{ ...ty.label, padding: '5px 12px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Log out</button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 4 }}>Owner · Billing</p>
          <h1 style={{ ...ty.h2, color: th.ink, margin: 0 }}>Subscription</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Plan summary */}
          <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: 24, boxShadow: sh.card }}>
            <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 8 }}>Current plan</p>
            <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 6px' }}>
              {plan.onFlatPlan ? 'Studio · Flat rate' : 'Studio · Per seat'}
            </h2>
            <p style={{ ...ty.body, color: th.muted, marginBottom: 20 }}>
              {plan.onFlatPlan
                ? `$${plan.flatRate}/mo — up to ${plan.flatLimit} staff`
                : `$${plan.flatRate}/mo base + $${plan.perSeatCharge}/mo for ${plan.extraSeats} extra seats`}
            </p>
            <div style={{ borderTop: `1px solid ${th.line}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <p style={{ ...ty.body, color: th.ink, margin: 0 }}>Monthly total</p>
              <p style={{ ...ty.h3, color: th.accent, margin: 0 }}>${plan.total}<span style={{ ...ty.caption, color: th.muted }}>/mo</span></p>
            </div>
          </div>

          {/* Status */}
          <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: 24, boxShadow: sh.card }}>
            <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 8 }}>Subscription status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: 99, background: isActive ? th.accent : th.urgent }} />
              <span style={{ ...ty.body, color: th.ink, fontWeight: 500, textTransform: 'capitalize' }}>{sub.status || 'Trial'}</span>
            </div>
            {sub.renewsAt && <p style={{ ...ty.caption, color: th.muted, marginBottom: 20 }}>Renews {renewsDate}</p>}
            {!isActive ? (
              <button onClick={handleActivate} disabled={simulating}
                style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: simulating ? 'wait' : 'pointer', opacity: simulating ? 0.7 : 1 }}>
                {simulating ? 'Processing…' : 'Activate subscription'}
              </button>
            ) : (
              <button onClick={handleCancel}
                style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: 'transparent', border: `1.5px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>
                Cancel subscription
              </button>
            )}
          </div>
        </div>

        {/* Seat breakdown */}
        <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, padding: 24, marginBottom: 20, boxShadow: sh.card }}>
          <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 16 }}>Seat calculation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: `Active staff (${allStaff.length} seats)`, value: `$${plan.flatRate}/mo`, note: `Flat rate covers first ${plan.flatLimit}` },
              ...( !plan.onFlatPlan ? [{ label: `${plan.extraSeats} extra seats × $${plan.perSeat}/mo`, value: `$${plan.perSeatCharge}/mo`, note: 'Above flat-rate limit' }] : [] ),
              { label: 'Total', value: `$${plan.total}/mo`, bold: true },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${th.line}` }}>
                <div>
                  <p style={{ ...ty.body, color: th.ink, margin: 0, fontWeight: row.bold ? 600 : 400 }}>{row.label}</p>
                  {row.note && <p style={{ ...ty.caption, color: th.muted, margin: '1px 0 0' }}>{row.note}</p>}
                </div>
                <p style={{ ...ty.body, color: row.bold ? th.accent : th.ink, margin: 0, fontWeight: row.bold ? 600 : 400 }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing explainer */}
        <div style={{ padding: '16px 20px', background: th.bgInset, borderRadius: th.card, border: `1px solid ${th.line}` }}>
          <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 6 }}>How pricing works</p>
          <p style={{ ...ty.bodySmall, color: th.muted, lineHeight: 1.6 }}>
            <strong style={{ color: th.ink }}>Up to 10 staff:</strong> $49/mo flat rate. Add as many baristas, hosts, and managers as you need up to 10 seats — no per-seat charges.
            {' '}<strong style={{ color: th.ink }}>Above 10 staff:</strong> $5/seat/mo for each additional team member.
            {' '}<strong style={{ color: th.ink }}>Multi-location pricing</strong> (coming soon): per-location billing for groups running 2+ cafes.
          </p>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: th.ink, color: th.onDark, padding: '12px 20px', borderRadius: 999, ...ty.bodySmall, maxWidth: 400, boxShadow: sh.modal }}>
          {toast}
        </div>
      )}
    </div>
  );
}

window.BillingPage = BillingPage;
