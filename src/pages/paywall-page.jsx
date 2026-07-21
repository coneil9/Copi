import React from 'react';
import { startCheckout, openBillingPortal } from '../lib/stripe-actions.js';

// Shown to owner/admin when their cafe's subscription is not in an
// allowed state (trialing, active, or past_due). Gated behind the
// VITE_STRIPE_PAYWALL_ENABLED feature flag in App.jsx.
export function PaywallPage({ user }) {
  const th = window.THEME || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW || {};

  const [loading, setLoading]     = React.useState(false);
  const [error, setError]         = React.useState('');
  const priceId = import.meta.env.VITE_STRIPE_DEFAULT_PRICE_ID || '';
  const trialDays = Number(import.meta.env.VITE_STRIPE_TRIAL_DAYS || 14);

  const status = user?.subscriptionStatus || 'none';
  const hasCustomer = ['past_due', 'unpaid', 'incomplete', 'canceled'].includes(status);

  const copy = (() => {
    switch (status) {
      case 'past_due':
      case 'unpaid':
        return { title: 'Payment issue', body: 'Your last payment didn\'t go through. Update your card to keep access.' };
      case 'canceled':
        return { title: 'Subscription cancelled', body: 'Reactivate any time to pick up where you left off.' };
      case 'incomplete':
      case 'incomplete_expired':
        return { title: 'Finish setting up billing', body: 'Your subscription didn\'t complete. Start it again to unlock the app.' };
      case 'paused':
        return { title: 'Subscription paused', body: 'Resume from the billing portal to restore access.' };
      default:
        return { title: 'Start your Copi trial', body: 'Add a card to start your free trial. Cancel any time.' };
    }
  })();

  const handleSubscribe = async () => {
    setError('');
    if (!priceId) {
      setError('Pricing isn\'t configured yet. Contact hello@copi.app to get started.');
      return;
    }
    setLoading(true);
    try {
      await startCheckout({ priceId, trialDays: trialDays || undefined });
    } catch (err) {
      setError(err.message || 'Could not start checkout.');
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setError('');
    setLoading(true);
    try {
      await openBillingPortal();
    } catch (err) {
      setError(err.message || 'Could not open billing portal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ ...ty.displayItalic, fontSize: 32, color: th.accent }}>Copi.</span>
        </div>

        <div style={{ background: th.bgCard, borderRadius: (th.card || 12) + 4, padding: 32, boxShadow: sh.card, border: `1px solid ${th.line}` }}>
          <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 8px' }}>{copy.title}</h2>
          <p style={{ ...ty.body, color: th.muted, margin: '0 0 24px' }}>{copy.body}</p>

          {error && (
            <p role="alert" style={{ ...ty.caption, color: th.danger, marginBottom: 16 }}>{error}</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              style={{ width: '100%', padding: '11px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill || 999, ...ty.button, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >{loading ? 'Working…' : (hasCustomer ? 'Restart subscription' : 'Start free trial')}</button>

            {hasCustomer && (
              <button
                onClick={handlePortal}
                disabled={loading}
                style={{ width: '100%', padding: '10px', background: 'transparent', color: th.accent, border: `1.5px solid ${th.accent}`, borderRadius: th.pill || 999, ...ty.button, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >Update payment method</button>
            )}

            <button
              data-app-action="logout"
              style={{ width: '100%', padding: '10px', background: 'transparent', color: th.muted, border: 'none', ...ty.caption, cursor: 'pointer' }}
            >Log out</button>
          </div>
        </div>

        <p style={{ ...ty.caption, color: th.muted, textAlign: 'center', marginTop: 20 }}>
          Questions? Email hello@copi.app.
        </p>
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  window.PaywallPage = PaywallPage;
}
