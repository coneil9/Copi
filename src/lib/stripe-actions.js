// Client-side helpers for talking to /api/stripe/*.
// Every call attaches the current Supabase session JWT so the server can
// verify the caller before doing anything privileged.

import { supabase } from './supabaseClient.js';

async function authedFetch(path, body) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('You need to be signed in.');
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body || {}),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload?.error) {
    throw new Error(payload?.message || `Request failed (${res.status})`);
  }
  return payload.data;
}

// Opens the Stripe Customer Portal in a new tab. Portal handles updating
// the payment method, viewing invoices, and cancelling the subscription.
export async function openBillingPortal() {
  const { url } = await authedFetch('/api/stripe/create-portal-session');
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Starts a Stripe Checkout session (subscription mode) and redirects the
// browser to it. `trialDays` is optional; if set, adds a card-up-front trial.
export async function startCheckout({ priceId, trialDays }) {
  const { url } = await authedFetch('/api/stripe/create-checkout-session', { priceId, trialDays });
  window.location.href = url;
}
