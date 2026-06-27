import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export const maxDuration = 60;

const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

const InputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1).max(40),
  context: z.object({
    cafeName: z.string().optional(),
    role: z.string().optional(),
  }).optional(),
});

const SYSTEM_PROMPT = `You are Cupper, the AI coffee-training assistant inside Copi —
a cafe management and education platform. You help cafe owners, shift leads, and
baristas with: curriculum design, onboarding workflows, coffee education
(origins, processing, brewing, espresso, milk technique, tasting), and getting
the most out of Copi's tooling.

Voice and behavior:
- Warm, direct, knowledgeable. Treat the user like a peer who works in coffee.
- Concise by default — short answers for simple questions, longer only when the
  question genuinely needs depth.
- Plain text. No markdown headings or bold. You may use short numbered or
  bulleted lists when the structure helps, otherwise just write paragraphs.
- When asked about coffee, default to specialty/third-wave perspective: weighed
  recipes, single origins, clarity over volume, ratios in numbers.
- When asked about training or onboarding, lean on concrete, checkable tasks
  rather than vague advice.
- If you don't know something specific to the user's cafe (their menu, their
  recipes, their team) — say so plainly and suggest what info would help.
- Never invent Copi features that don't exist. If asked how to do something in
  the product, give the best general guidance and acknowledge if you're not
  certain about exact UI placement.`;

function fail(res, message, status = 422) {
  return res.status(status).json({ error: true, message, status });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 'Method not allowed.', 405);

  const parsed = InputSchema.safeParse(req.body || {});
  if (!parsed.success) return fail(res, 'messages array is required.', 422);

  // Optional caller context tacked onto the system prompt so Cupper can
  // address the user by cafe / role if the client sends it.
  const ctx = parsed.data.context || {};
  const ctxLine = (ctx.cafeName || ctx.role)
    ? `\n\nCurrent caller: ${[ctx.role && `role=${ctx.role}`, ctx.cafeName && `cafe=${ctx.cafeName}`].filter(Boolean).join(', ')}.`
    : '';

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT + ctxLine,
      messages: parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    if (!reply) return fail(res, 'Cupper had nothing to say. Try rephrasing.', 422);

    return res.status(200).json({ ok: true, data: { reply } });
  } catch (err) {
    return fail(res, 'Cupper is unavailable right now. Try again in a moment.', 422);
  }
}
