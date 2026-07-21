import { stripe } from '../_lib/stripeClient.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';

export const maxDuration = 30;

// Stripe signature verification requires the raw request body, not JSON.
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function tsToIso(unix) {
  return unix ? new Date(unix * 1000).toISOString() : null;
}

async function applySubscriptionToCafe(sub) {
  const cafeId = sub.metadata?.cafeId;
  if (!cafeId) {
    console.warn('[stripe webhook] subscription missing cafeId metadata', sub.id);
    return;
  }
  const item = sub.items?.data?.[0];
  const updates = {
    stripe_subscription_id: sub.id,
    subscription_status: sub.status,
    subscription_price_id: item?.price?.id || null,
    current_period_end: tsToIso(item?.current_period_end),
    trial_end: tsToIso(sub.trial_end),
    cancel_at_period_end: !!sub.cancel_at_period_end,
  };
  const { error } = await supabaseAdmin.from('cafes').update(updates).eq('id', cafeId);
  if (error) console.error('[stripe webhook] update cafe failed', cafeId, error);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ error: 'Webhook secret not configured.' });

  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return res.status(400).json({ error: `Signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await applySubscriptionToCafe(sub);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed': {
        await applySubscriptionToCafe(event.data.object);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[stripe webhook] handler error', event.type, err);
    // Return 500 so Stripe retries; a 200 would drop the event.
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ received: true });
}
