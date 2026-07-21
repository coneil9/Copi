import { z } from 'zod';
import { stripe } from '../_lib/stripeClient.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { getAuthUser } from '../_lib/authUser.js';

export const maxDuration = 30;

const InputSchema = z.object({
  priceId: z.string().regex(/^price_/, 'priceId must start with "price_"'),
  trialDays: z.number().int().min(0).max(90).optional(),
});

function fail(res, message, status = 422) {
  return res.status(status).json({ error: true, message, status });
}

function integrationTag() {
  return 'copi-signup-' + Math.random().toString(36).slice(2, 10);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 'Method not allowed.', 405);

  const user = await getAuthUser(req);
  if (!user) return fail(res, 'Not authenticated.', 401);

  const parsed = InputSchema.safeParse(req.body || {});
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || 'Invalid input.', 422);

  const { data: row, error: rowErr } = await supabaseAdmin
    .from('users')
    .select('id, email, name, role, cafes!inner(id, name, stripe_customer_id)')
    .eq('id', user.id)
    .maybeSingle();
  if (rowErr || !row) return fail(res, 'No cafe found for this user.', 404);
  if (!['owner', 'admin'].includes(row.role)) return fail(res, 'Only owners can subscribe.', 403);

  const cafe = row.cafes;
  const origin = req.headers.origin;
  if (!origin) return fail(res, 'Missing origin header.', 400);

  let customerId = cafe.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: row.email,
      name: row.name,
      metadata: { cafeId: cafe.id, supabaseUserId: user.id },
    });
    customerId = customer.id;
    const { error: updateErr } = await supabaseAdmin
      .from('cafes')
      .update({ stripe_customer_id: customerId })
      .eq('id', cafe.id);
    if (updateErr) console.error('[stripe] persist customer_id failed', updateErr);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: cafe.id,
      line_items: [{ price: parsed.data.priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: parsed.data.trialDays,
        metadata: { cafeId: cafe.id },
      },
      metadata: { cafeId: cafe.id },
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      integration_identifier: integrationTag(),
    });
    return res.status(200).json({ ok: true, data: { url: session.url } });
  } catch (err) {
    console.error('[stripe] checkout.sessions.create failed', err.message);
    return fail(res, err.message || 'Could not start checkout.', 422);
  }
}
