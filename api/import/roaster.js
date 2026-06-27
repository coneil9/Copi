import Anthropic from '@anthropic-ai/sdk';
import { stripFences } from '../_lib/stripFences.js';
import { validateUrl } from '../_lib/validateUrl.js';
import { checkRateLimit, clientKey } from '../_lib/rateLimit.js';

export const maxDuration = 60; // web_search does multiple round-trips; default 10s is not enough

const ANTHROPIC_MODEL = 'claude-sonnet-4-6';
const RATE_LIMIT_MAX = 3;

// Claude sometimes wraps JSON in prose ("Here's the JSON: { ... }")
// even when told not to. Find the outermost { ... } block and parse it.
function extractJsonObject(text) {
  if (typeof text !== 'string') return null;
  const stripped = stripFences(text);
  // Fast path — already pure JSON.
  try { return JSON.parse(stripped); } catch (_) { /* fall through */ }
  // Slow path — find the first { and matching final }, parse the slice.
  const first = stripped.indexOf('{');
  const last  = stripped.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return null;
  const slice = stripped.slice(first, last + 1);
  try { return JSON.parse(slice); } catch (_) { return null; }
}

// KEEP IN SYNC with SYSTEM_PROMPT in src/lib/roaster-import-service.js (lines ~34–58).
const SYSTEM_PROMPT = `You are a coffee shop training content specialist. You will be given a coffee roaster's website URL. Fetch and read the site thoroughly, including any pages about: their coffees, origins, processing methods, brew guides, about/story page, and any educational content.

Extract all training-relevant information and return ONLY a valid JSON object with no markdown, no preamble, and no explanation. Use this exact schema:

{
  "shop_name": "string",
  "tagline": "string or null",
  "logo_url": "string or null",
  "about": "string — 2-3 sentence brand summary",
  "tracks": [
    {
      "title": "string — track name e.g. 'Origins & Sourcing'",
      "description": "string",
      "lessons": [
        {
          "title": "string",
          "content": "string — full lesson content, written as training material for a barista. Minimum 100 words. Written in second person, practical and educational.",
          "estimated_minutes": number
        }
      ]
    }
  ]
}

Generate between 2 and 4 tracks. Each track should have between 2 and 5 lessons. Prioritize: origin stories, processing methods, brew recipes, tasting notes, brand values, and any unique techniques or products this roaster is known for. If the site has limited content, infer reasonable barista training content from what is available and note it is suggested content. Never return empty lessons.`;

const WEB_SEARCH_TOOL = { type: 'web_search_20250305', name: 'web_search', max_uses: 5 };

function fail(res, message, status = 422) {
  return res.status(status).json({ error: true, message, status });
}

async function runClaude(client, userText) {
  const base = {
    model: ANTHROPIC_MODEL,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    tools: [WEB_SEARCH_TOOL],
  };
  const messages = [{ role: 'user', content: userText }];
  let response = await client.messages.create({ ...base, messages });

  // web_search runs server-side; the only loop we handle is pause_turn
  // (server tool sampling-loop cap). Re-send accumulated content to resume.
  let guard = 0;
  while (response.stop_reason === 'pause_turn' && guard < 5) {
    messages.push({ role: 'assistant', content: response.content });
    response = await client.messages.create({ ...base, messages });
    guard += 1;
  }

  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 'Method not allowed.', 405);

  const { url, shopId } = req.body || {};

  // 1) Validation — identical messages to the client contract
  const v = validateUrl(url);
  if (!v.valid) return fail(res, v.message, 422);
  if (!shopId) return fail(res, 'shopId is required.', 422);

  // 2) Rate limit (defense-in-depth; client sessionStorage is primary)
  const rl = checkRateLimit(clientKey(req, shopId), RATE_LIMIT_MAX);
  if (!rl.allowed) {
    return fail(
      res,
      `Import limit reached for this session (${RATE_LIMIT_MAX} per session). Refresh the page to try a different URL.`,
      422
    );
  }

  // 3) Claude + web_search
  let raw = '';
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[api/import/roaster] ANTHROPIC_API_KEY is not set in the server environment.');
      return fail(res, 'Server is missing ANTHROPIC_API_KEY. Add it to .env and restart vercel dev.', 422);
    }
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
    raw = await runClaude(client, `Roaster URL: ${v.url}\n\nUse web_search to read this site, then return the JSON object as specified.`);
  } catch (err) {
    console.error('[api/import/roaster] Claude call failed:', err?.status, err?.message, err?.error || err);
    const status = err?.status;
    let message = 'We couldn\'t read that site. Try a different URL, or skip this step and build your curriculum manually.';
    if (status === 401) message = 'Claude rejected the API key (401). Check that ANTHROPIC_API_KEY is correct.';
    else if (status === 429) message = 'Claude rate-limited the request (429). Wait a minute and try again.';
    else if (status === 400 && /web_search|tool/i.test(err?.message || '')) {
      message = 'web_search tool is not enabled on this Anthropic account. Enable it in the Anthropic console.';
    }
    return fail(res, message, 422);
  }

  const json = extractJsonObject(raw);
  if (!json || !Array.isArray(json.tracks) || json.tracks.length === 0) {
    console.error('[api/import/roaster] Claude reply was not parseable JSON or had no tracks. First 400 chars:\n',
      (raw || '').slice(0, 400));
    return fail(
      res,
      'Claude replied but the result was not valid curriculum JSON. Try a different URL.',
      422
    );
  }
  return res.status(200).json({ ok: true, data: json });
}
