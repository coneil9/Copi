import { stripe } from '../_lib/stripeClient.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { getAuthUser } from '../_lib/authUser.js';

export const maxDuration = 30;

function fail(res, message, status = 422) {
  return res.status(status).json({ error: true, message, status });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 'Method not allowed.', 405);

  const user = await getAuthUser(req);
  if (!user) return fail(res, 'Not authenticated.', 401);

  const { data: row, error: rowErr } = await supabaseAdmin
    .from('users')
    .select('role, cafes!inner(id, stripe_customer_id)')
    .eq('id', user.id)
    .maybeSingle();
  if (rowErr || !row) return fail(res, 'No cafe found for this user.', 404);
  if (!['owner', 'admin'].includes(row.role)) return fail(res, 'Only owners can manage billing.', 403);

  const customerId = row.cafes.stripe_customer_id;
  if (!customerId) return fail(res, 'No subscription yet. Start a trial first.', 400);

  const origin = req.headers.origin;
  if (!origin) return fail(res, 'Missing origin header.', 400);

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/`,
    });
    return res.status(200).json({ ok: true, data: { url: session.url } });
  } catch (err) {
    console.error('[stripe] billingPortal.sessions.create failed', err.message);
    return fail(res, err.message || 'Could not open billing portal.', 422);
  }
}
