// In-memory per-instance limiter keyed by ip:shopId.
// NOTE: serverless instances are ephemeral — counts reset on cold start.
// This is defense-in-depth; the client sessionStorage guard is the primary limit.
// To make durable, replace the Map with Vercel KV / Upstash (same check signature).
const WINDOW_MS = 1000 * 60 * 60; // 1 hour
const hits = new Map(); // key -> { count, resetAt }

export function checkRateLimit(key, max = 3) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { allowed: false, remaining: 0 };
  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

export function clientKey(req, shopId) {
  const fwd = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim() || 'unknown';
  return `${ip}:${shopId}`;
}
