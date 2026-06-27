import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export const maxDuration = 60;

const ANTHROPIC_MODEL = 'claude-sonnet-4-6'; // swap to claude-haiku-4-5 for cheaper/faster

const InputSchema = z.object({
  cafeId: z.string().min(1),
  files: z.array(z.object({
    name: z.string().optional(),
    text: z.string().default(''),
  })).default([]),
});

const SYSTEM_PROMPT = `You are an onboarding specialist for cafes. You are given the
text of a cafe's existing staff handbook / training documents. Produce a structured set
of onboarding milestones for three roles: barista, host, and manager.

For each milestone decide whether the uploaded text actually covers it ("extracted") or
whether it is a standard best-practice you are filling in because the docs don't cover it
("template", and set fromGap=true). Write each milestone as a concrete, checkable task.
Cover at least: cafe culture, equipment, espresso, milk technique, health & safety,
opening, and closing. Return 4–8 milestones per role.`;

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    milestones: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          role: { type: 'string', enum: ['barista', 'host', 'manager'] },
          title: { type: 'string' },
          desc: { type: 'string' },
          source: { type: 'string', enum: ['extracted', 'template'] },
          fromGap: { type: 'boolean' },
        },
        required: ['role', 'title', 'desc', 'source', 'fromGap'],
      },
    },
    gaps: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          role: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['role', 'title', 'message'],
      },
    },
  },
  required: ['milestones', 'gaps'],
};

function fail(res, message, status = 422) {
  return res.status(status).json({ error: true, message, status });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 'Method not allowed.', 405);

  const parsed = InputSchema.safeParse(req.body || {});
  if (!parsed.success) return fail(res, 'cafeId and files are required.', 422);

  const combined = parsed.data.files.map((f) => (f.text || '').slice(0, 2000)).join('\n\n');

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
      messages: [{
        role: 'user',
        content: `Here is the uploaded handbook text. Generate the milestones.\n\n${combined || '(no document provided — produce template milestones for all roles)'}`,
      }],
    });

    const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    const data = JSON.parse(text); // structured outputs → already clean JSON
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return fail(res, 'We couldn\'t process those documents. Try again or set up milestones manually.', 422);
  }
}
