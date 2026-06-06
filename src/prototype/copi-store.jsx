// ═════════════════════════════════════════════════════════
// COPI STORE — the single source of truth for the whole app.
//
// Assembles the curriculum (from copi-content-*.jsx), holds the
// canonical team roster, and runs the progress engine: who is
// assigned what, which lessons are done, quiz scores, final
// tests, certifications. Everything persists to localStorage so
// a demo survives refreshes and login switches.
//
// Surfaces never invent their own numbers — they read CopiStore
// and subscribe via useCopiStore().
// ═════════════════════════════════════════════════════════

// ── Canonical curriculum (order matters) ────────────────────
const COPI_CURRICULUM = [window.COPI_VOL1, window.COPI_VOL2, window.COPI_VOL3].filter(Boolean);
window.COPI_CURRICULUM = COPI_CURRICULUM;

function volById(id) { return COPI_CURRICULUM.find((v) => v.id === id); }
function lessonById(lessonId) {
  for (const v of COPI_CURRICULUM) {
    const l = v.lessons.find((x) => x.id === lessonId);
    if (l) return { vol: v, lesson: l };
  }
  return null;
}

// ── Canonical team roster (shared by every admin surface) ───
const COPI_TEAM = [
  { name: 'Linda Turko', email: 'linda@milano.coffee', role: 'Lead barista', joined: 'Mar 2025' },
  { name: 'Reza Mehta',  email: 'reza@milano.coffee',  role: 'Lead barista', joined: 'May 2025' },
  { name: 'Pia Olsen',   email: 'pia@milano.coffee',   role: 'Barista',      joined: 'Sep 2025' },
  { name: 'Lili Turko',  email: 'lili@milano.coffee',  role: 'Barista',      joined: 'Aug 2025' },
  { name: 'Jules Patel', email: 'jules@milano.coffee', role: 'Barista',      joined: 'Jul 2025' },
  { name: 'Devi Shah',   email: 'devi@milano.coffee',  role: 'New hire',     joined: 'Oct 2025' },
];

const STORE_KEY = 'copi.progress.v3';

// ── Seed a believable baseline ──────────────────────────────
// Vol I + II assigned to everyone with a spread of progress.
// Vol III (Bar certified) is deliberately NOT assigned — the
// admin demo is to assign it and watch completion land.
function seedState() {
  const state = { assignments: {}, users: {}, activity: [], seeded: true };

  // Assign Vol I and Vol II to the whole team.
  state.assignments['vol-1'] = COPI_TEAM.map((t) => t.email);
  state.assignments['vol-2'] = COPI_TEAM.map((t) => t.email);
  state.assignments['vol-3'] = []; // unassigned on purpose

  // How far each person got: [vol1 lessons done, vol1 final?, vol2 lessons done, vol2 final?]
  const plan = {
    'linda@milano.coffee': [9, true,  7, true],
    'reza@milano.coffee':  [9, true,  7, false],
    'pia@milano.coffee':   [7, false, 2, false],
    'lili@milano.coffee':  [6, false, 1, false],
    'jules@milano.coffee': [5, false, 0, false],
    'devi@milano.coffee':  [2, false, 0, false],
  };

  const vol1 = volById('vol-1');
  const vol2 = volById('vol-2');
  let seedClock = Date.now() - 1000 * 60 * 60 * 24 * 9; // 9 days ago, marching forward

  COPI_TEAM.forEach((t) => {
    const [n1, f1, n2, f2] = plan[t.email] || [0, false, 0, false];
    const u = { lessons: {}, finals: {} };
    const mark = (vol, count) => {
      for (let i = 0; i < count; i++) {
        const lesson = vol.lessons[i];
        const total = lesson.quiz.length;
        // believable score: mostly full marks, occasional miss
        const score = (i % 4 === 3) ? total - 1 : total;
        seedClock += 1000 * 60 * 60 * 3;
        u.lessons[lesson.id] = { done: true, score, total, ts: seedClock };
      }
    };
    mark(vol1, n1);
    mark(vol2, n2);
    if (f1) u.finals['vol-1'] = { passed: true, score: 6, total: 6, ts: seedClock };
    if (f2) u.finals['vol-2'] = { passed: true, score: 5, total: 6, ts: seedClock };
    state.users[t.email] = u;
  });

  // A little recent activity for "lessons in motion".
  state.activity = [
    { who: 'Reza Mehta',  action: 'completed', label: 'II-05 Anaerobic and experimental', kind: 'complete', ts: Date.now() - 1000 * 60 * 60 * 2 },
    { who: 'Pia Olsen',   action: 'completed', label: 'II-02 Washed process',              kind: 'complete', ts: Date.now() - 1000 * 60 * 60 * 6 },
    { who: 'Lili Turko',  action: 'completed', label: 'II-01 The cherry, anatomy of',      kind: 'complete', ts: Date.now() - 1000 * 60 * 60 * 26 },
    { who: 'Jules Patel', action: 'completed', label: 'I-05 Plantations and empire',       kind: 'complete', ts: Date.now() - 1000 * 60 * 60 * 30 },
  ];

  return state;
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY));
    if (raw && raw.seeded) return raw;
  } catch (_e) {}
  const fresh = seedState();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(fresh)); } catch (_e) {}
  return fresh;
}

// ── The store singleton ─────────────────────────────────────
const CopiStore = (function () {
  let state = loadState();
  const subs = new Set();

  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_e) {}
  }
  function emit() { persist(); subs.forEach((fn) => fn()); }

  function userRec(email) {
    if (!state.users[email]) state.users[email] = { lessons: {}, finals: {} };
    return state.users[email];
  }

  function nameFor(email) {
    const t = COPI_TEAM.find((x) => x.email === email);
    return t ? t.name : (email || 'Someone');
  }

  return {
    team: COPI_TEAM,
    curriculum: COPI_CURRICULUM,
    volById, lessonById,

    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    raw() { return state; },

    // ── Assignment ──────────────────────────────────────────
    isAssigned(email, volId) {
      return (state.assignments[volId] || []).includes(email);
    },
    assignedVolumes(email) {
      return COPI_CURRICULUM.filter((v) => (state.assignments[v.id] || []).includes(email));
    },
    assignedEmails(volId) {
      return (state.assignments[volId] || []).slice();
    },
    assignVolume(volId, emails) {
      const set = new Set(state.assignments[volId] || []);
      let added = 0;
      emails.forEach((e) => { if (!set.has(e)) { set.add(e); added++; } });
      state.assignments[volId] = Array.from(set);
      if (added) {
        const v = volById(volId);
        state.activity.unshift({
          who: 'Brian Turko', action: 'assigned', label: `${v.vol} ${v.name} \u2192 ${added} barista${added > 1 ? 's' : ''}`,
          kind: 'assign', ts: Date.now(),
        });
      }
      emit();
      return added;
    },
    unassignVolume(volId, emails) {
      const set = new Set(state.assignments[volId] || []);
      emails.forEach((e) => set.delete(e));
      state.assignments[volId] = Array.from(set);
      emit();
    },

    // ── Lesson / final progress ─────────────────────────────
    lessonRecord(email, lessonId) {
      return userRec(email).lessons[lessonId] || null;
    },
    finalRecord(email, volId) {
      return userRec(email).finals[volId] || null;
    },

    // status of lesson at index i within a volume for a user
    lessonStatus(email, volId, idx) {
      if (!this.isAssigned(email, volId)) return 'locked';
      const v = volById(volId);
      const lesson = v.lessons[idx];
      const rec = userRec(email).lessons[lesson.id];
      if (rec && rec.done) return 'done';
      if (idx === 0) return 'current';
      const prev = v.lessons[idx - 1];
      const prevRec = userRec(email).lessons[prev.id];
      return (prevRec && prevRec.done) ? 'current' : 'locked';
    },
    finalStatus(email, volId) {
      if (!this.isAssigned(email, volId)) return 'locked';
      const fin = userRec(email).finals[volId];
      if (fin && fin.passed) return 'done';
      const v = volById(volId);
      const allDone = v.lessons.every((l) => (userRec(email).lessons[l.id] || {}).done);
      return allDone ? 'current' : 'locked';
    },

    completeLesson(email, lessonId, score, total) {
      const found = lessonById(lessonId);
      if (!found) return;
      const u = userRec(email);
      const already = u.lessons[lessonId] && u.lessons[lessonId].done;
      u.lessons[lessonId] = { done: true, score, total, ts: Date.now() };
      if (!already) {
        state.activity.unshift({
          who: nameFor(email), action: 'completed',
          label: `${found.vol.num === '01' ? 'I' : found.vol.num === '02' ? 'II' : 'III'}-${found.lesson.num} ${found.lesson.title}`,
          kind: 'complete', ts: Date.now(),
        });
        state.activity = state.activity.slice(0, 30);
      }
      emit();
    },
    completeFinal(email, volId, score, total) {
      const v = volById(volId);
      const passed = score / total >= (v.finalTest.passMark || 0.7);
      userRec(email).finals[volId] = { passed, score, total, ts: Date.now() };
      state.activity.unshift({
        who: nameFor(email), action: passed ? 'passed' : 'attempted',
        label: `${v.vol} final test \u2014 ${score}/${total}`,
        kind: passed ? 'cert' : 'review', ts: Date.now(),
      });
      state.activity = state.activity.slice(0, 30);
      emit();
      return passed;
    },

    // ── Stats ───────────────────────────────────────────────
    volumeStats(email, volId) {
      const v = volById(volId);
      const u = userRec(email);
      const done = v.lessons.filter((l) => (u.lessons[l.id] || {}).done).length;
      const total = v.lessons.length;
      const fin = u.finals[volId];
      const certified = !!(fin && fin.passed);
      return { done, total, pct: total ? done / total : 0, certified, assigned: this.isAssigned(email, volId) };
    },

    // overall completion across a user's assigned volumes (0..1)
    overallPct(email) {
      const vols = COPI_CURRICULUM.filter((v) => this.isAssigned(email, v.id));
      if (!vols.length) return 0;
      let done = 0, total = 0;
      vols.forEach((v) => { const s = this.volumeStats(email, v.id); done += s.done; total += s.total; });
      return total ? done / total : 0;
    },

    // the next lesson a barista should do (first current across assigned vols)
    currentLesson(email) {
      for (const v of COPI_CURRICULUM) {
        if (!this.isAssigned(email, v.id)) continue;
        for (let i = 0; i < v.lessons.length; i++) {
          if (this.lessonStatus(email, v.id, i) === 'current') {
            return { vol: v, lesson: v.lessons[i], idx: i };
          }
        }
        if (this.finalStatus(email, v.id) === 'current') {
          return { vol: v, lesson: null, idx: -1, isFinal: true };
        }
      }
      return null;
    },

    // team rollup for one volume
    teamVolumeStats(volId) {
      const assigned = this.assignedEmails(volId);
      let completed = 0, inProgress = 0;
      assigned.forEach((e) => {
        const s = this.volumeStats(e, volId);
        if (s.certified || (s.done === s.total && s.total > 0)) completed++;
        else if (s.done > 0) inProgress++;
      });
      return { assigned: assigned.length, completed, inProgress };
    },

    // team-wide average completion across assigned volumes (0..1)
    teamCompletion() {
      const vals = COPI_TEAM.map((t) => this.overallPct(t.email));
      const active = vals.filter((_v, i) => COPI_CURRICULUM.some((v) => this.isAssigned(COPI_TEAM[i].email, v.id)));
      if (!active.length) return 0;
      return active.reduce((a, b) => a + b, 0) / active.length;
    },

    // per-barista snapshot for analytics table
    teamSnapshot() {
      return COPI_TEAM.map((t) => {
        const pct = Math.round(this.overallPct(t.email) * 100);
        // highest cert earned
        let cert = '\u2014';
        if (this.volumeStats(t.email, 'vol-3').certified) cert = 'Bar certified';
        else if (this.volumeStats(t.email, 'vol-1').certified || this.volumeStats(t.email, 'vol-2').certified) cert = 'Foundations';
        return { ...t, pct, cert };
      });
    },

    activity(limit = 8) { return (state.activity || []).slice(0, limit); },

    // lessons completed in the last 7 days, across the team
    lessonsThisWeek() {
      const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
      let n = 0;
      COPI_TEAM.forEach((t) => {
        const u = state.users[t.email];
        if (!u) return;
        Object.values(u.lessons).forEach((r) => { if (r.done && r.ts >= weekAgo) n++; });
      });
      return n;
    },

    // average first-attempt quiz pass rate across all recorded lessons (0..1)
    avgScore() {
      let score = 0, total = 0;
      COPI_TEAM.forEach((t) => {
        const u = state.users[t.email];
        if (!u) return;
        Object.values(u.lessons).forEach((r) => { score += r.score; total += r.total; });
      });
      return total ? score / total : 0;
    },

    resetAll() {
      state = seedState();
      emit();
    },
  };
})();

window.CopiStore = CopiStore;

// React hook — re-render any component on store change.
function useCopiStore() {
  const [, force] = React.useState(0);
  React.useEffect(() => CopiStore.subscribe(() => force((n) => n + 1)), []);
  return CopiStore;
}
window.useCopiStore = useCopiStore;
