// Ported verbatim from src/lib/roaster-import-service.js — keep messages identical.
export function validateUrl(input) {
  if (typeof input !== 'string' || !input.trim()) {
    return { valid: false, message: 'A roaster website URL is required.' };
  }
  const trimmed = input.trim();
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (_) {
    return { valid: false, message: 'That doesn\'t look like a valid URL.' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, message: 'URL must start with http:// or https://' };
  }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(parsed.hostname)) {
    return { valid: false, message: 'That hostname doesn\'t look reachable.' };
  }
  return { valid: true, url: parsed.toString(), host: parsed.hostname.replace(/^www\./, '') };
}
