import { supabaseAdmin } from './supabaseAdmin.js';

// Verify a caller's Supabase JWT and return the auth user, or null.
// Every mutating /api/stripe/* handler must call this before doing work.
export async function getAuthUser(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const jwt = header.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(jwt);
  if (error || !data?.user) return null;
  return data.user;
}
