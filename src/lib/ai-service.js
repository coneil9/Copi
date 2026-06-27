// ai-service.js — Simulated AI pipeline for onboarding setup.
// The service layer is promise-based so a real Claude API is drop-in.
// Actual API calls would go here; for the prototype we simulate latency
// and generate structured output from templates + uploaded doc heuristics.

import { STANDARD_MILESTONES, GAP_MESSAGES } from './onboarding-templates.js';

// ── Helpers ────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10); }

function extractKeywords(text) {
  const lower = text.toLowerCase();
  return {
    hasCulture:    /culture|values|expectations|norms|handbook/.test(lower),
    hasEquipment:  /equipment|machine|grinder|espresso|calibrat/.test(lower),
    hasEspresso:   /espresso|shot|extraction|dose|yield|recipe/.test(lower),
    hasMilk:       /milk|steam|foam|microfoam|latte|cappuccino/.test(lower),
    hasHealth:     /health|safety|allergen|hygi|sanit|haccp/.test(lower),
    hasOpening:    /opening|open procedure|start of day/.test(lower),
    hasClosing:    /closing|close procedure|end of day|shutdown/.test(lower),
    hasScheduling: /schedule|rota|shift|roster/.test(lower),
    hasIncidents:  /incident|complaint|escalat|refund/.test(lower),
  };
}

// Simulate async delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ── Main API ───────────────────────────────────────────────

/**
 * Simulate uploading and processing documents.
 * Returns a job ID immediately; callers should poll / subscribe to store updates.
 *
 * In production: send files to a server endpoint that calls Claude API with
 * a structured prompt, then writes results back to DB.
 */
export async function simulateUpload(cafeId, files, onProgress) {
  const store = window.CopiStore;
  if (!store) throw new Error('Store not available');

  // Cap extracted text at 2KB per file for localStorage
  const processedFiles = files.map((f) => ({
    name: f.name,
    extractedText: (f.text || '').slice(0, 2000),
  }));

  const job = store.createAiJob(cafeId, processedFiles);

  // Phase 1: queued → processing (2s)
  await delay(2000);
  if (onProgress) onProgress('processing');
  store.updateAiJob(job.id, { status: 'processing' });

  // Phase 2: processing → ready (6s more)
  await delay(6000);

  if (import.meta.env.VITE_USE_REAL_AI === 'true') {
    // Real backend branch
    const resp = await fetch('/api/ai/milestones', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        cafeId,
        files: processedFiles.map((f) => ({ name: f.name, text: f.extractedText })),
      }),
    });
    const body = await resp.json();
    if (body.error) {
      store.updateAiJob(job.id, { status: 'error' });
      if (onProgress) onProgress('error');
      return job.id;
    }
    let order = 0;
    const generatedMilestones = body.data.milestones.map((m) => ({
      id: uid(), cafeId, role: m.role, order: order++,
      title: m.title, desc: m.desc, source: m.source,
      status: 'suggested', fromGap: m.fromGap,
    }));
    const gaps = body.data.gaps;
    const db = store.raw();
    generatedMilestones.forEach((ms) => { db.milestones[ms.id] = ms; });
    store.updateAiJob(job.id, {
      status: 'ready',
      output: { milestoneIds: generatedMilestones.map((m) => m.id), gaps },
    });
    if (onProgress) onProgress('ready');
    return job.id;
  }

  // Simulated fallback (rollback path) — unchanged behavior.
  // Analyse uploaded content
  const combinedText = processedFiles.map((f) => f.extractedText).join(' ');
  const keywords = extractKeywords(combinedText);

  // Generate milestones
  const generatedMilestones = [];
  const gaps = [];
  let order = 0;

  const process = (role, templates) => {
    templates.forEach((tmpl) => {
      const key = Object.keys(GAP_MESSAGES).find((k) => tmpl.title.toLowerCase().includes(k));
      const covered = !key ||
        (key === 'cafe culture' && keywords.hasCulture) ||
        (key === 'equipment' && keywords.hasEquipment) ||
        (key === 'espresso' && keywords.hasEspresso) ||
        (key === 'milk' && keywords.hasMilk) ||
        (key === 'health' && keywords.hasHealth) ||
        (key === 'opening' && keywords.hasOpening) ||
        (key === 'closing' && keywords.hasClosing);

      const id = uid();
      generatedMilestones.push({
        id, cafeId, role, order: order++,
        title: tmpl.title,
        desc: covered
          ? tmpl.desc + (combinedText.length > 100 ? ' (mapped from your uploaded document.)' : '')
          : tmpl.desc,
        source: covered ? 'extracted' : 'template',
        status: 'suggested',
        fromGap: !covered,
      });

      if (!covered && GAP_MESSAGES[key]) {
        gaps.push({ role, title: tmpl.title, message: GAP_MESSAGES[key] });
      }
    });
  };

  process('barista', STANDARD_MILESTONES.barista);
  process('host',    STANDARD_MILESTONES.host);
  process('manager', STANDARD_MILESTONES.manager);

  // Write generated milestones to store
  const db = store.raw();
  generatedMilestones.forEach((ms) => { db.milestones[ms.id] = ms; });

  // Update job as ready
  store.updateAiJob(job.id, {
    status: 'ready',
    output: { milestoneIds: generatedMilestones.map((m) => m.id), gaps },
  });

  if (onProgress) onProgress('ready');
  return job.id;
}
