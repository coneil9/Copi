// cupper-service.js — client-side wrapper for POST /api/ai/cupper.
// Same envelope as the other AI services (ok/error). Behind the same
// VITE_USE_REAL_AI flag so the simulated fallback works for demos
// without an API key.

const CANNED_REPLIES = [
  "I'm running in demo mode right now (no API key wired). Once your backend is live I'll answer for real — for now, here's a thought: when staff are stuck, the fastest fix is almost always to retaste the espresso side-by-side with a known-good shot.",
  "Demo response. With a live backend I'd reply substantively here. If you're triaging onboarding, the highest-leverage milestone is usually the first espresso pull — it's where confidence locks in.",
  "Demo mode answer. I'd dig deeper with a real Claude call. Quick tip: when team progress stalls, look at lesson 5 of any volume — that's typically where falloff begins.",
];

let cannedIdx = 0;
function nextCanned() {
  const r = CANNED_REPLIES[cannedIdx % CANNED_REPLIES.length];
  cannedIdx += 1;
  return r;
}

export async function askCupper({ messages, context } = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: true, message: 'No messages provided.', status: 422 };
  }

  if (import.meta.env.VITE_USE_REAL_AI === 'true') {
    try {
      const resp = await fetch('/api/ai/cupper', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages, context }),
      });
      const body = await resp.json();
      if (body.error) return body;
      return body;
    } catch (err) {
      return {
        error: true,
        message: 'Cupper is unavailable right now. Try again in a moment.',
        status: 422,
      };
    }
  }

  // Simulated fallback (rollback path).
  await new Promise((res) => setTimeout(res, 700));
  return { ok: true, data: { reply: nextCanned() } };
}

if (typeof window !== 'undefined') {
  window.askCupper = askCupper;
}
