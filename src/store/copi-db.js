// copi-db.js — the ONLY localStorage touchpoint for copi.db.v4.
// Swap load/save here to move to Supabase.

export const DB_KEY = 'copi.db.v4';
export const DEMO_PW = 'copi2026';

export function uid() {
  return Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 9);
}

// ── Fixed IDs (stable across resets) ────────────────────────
export const IDS = {
  cafe:          'cafe-milano',
  locDowntown:   'loc-downtown',
  locWestside:   'loc-westside',
  owner:         'user-owner',
  marco:         'user-marco',
  sofia:         'user-sofia',
  linda:         'user-linda',
  reza:          'user-reza',
  pia:           'user-pia',
  lili:          'user-lili',
  jules:         'user-jules',
  devi:          'user-devi',
  modVol1:       'mod-vol-1',
  modVol2:       'mod-vol-2',
  modVol3:       'mod-vol-3',
};

// Lesson IDs mirrored from App.jsx COPI_VOL definitions
const VOL1_LESSONS = ['v1l1','v1l2','v1l3','v1l4','v1l5','v1l6','v1l7','v1l8','v1l9'];
const VOL2_LESSONS = ['v2l1','v2l2','v2l3','v2l4','v2l5','v2l6','v2l7'];
const VOL3_LESSONS = ['v3l1','v3l2','v3l3','v3l4','v3l5','v3l6','v3l7','v3l8','v3l9','v3l10','v3l11','v3l12'];

export function seedDatabase() {
  const now = Date.now();
  const { cafe, locDowntown, locWestside, owner, marco, sofia, linda, reza, pia, lili, jules, devi, modVol1, modVol2, modVol3 } = IDS;

  // ── Seed progress for baristas (mirrors old copi.progress.v3 plan) ──
  // [vol1 lessons done, vol1 final passed, vol2 lessons done, vol2 final passed]
  const progressPlan = {
    [linda]: [9, true,  7, true,  0, false],
    [reza]:  [9, true,  7, false, 0, false],
    [pia]:   [7, false, 2, false, 0, false],
    [lili]:  [6, false, 1, false, 0, false],
    [jules]: [5, false, 0, false, 0, false],
    [devi]:  [2, false, 0, false, 0, false],
  };

  const progress = {};
  let seedClock = now - 1000 * 60 * 60 * 24 * 9;

  const baristas = [linda, reza, pia, lili, jules, devi];

  baristas.forEach((uid) => {
    const [n1, f1, n2, f2] = progressPlan[uid] || [0,false,0,false];
    const lessons = {};
    const finals = {};
    const milestones = {};

    const markLessons = (lessonIds, count) => {
      for (let i = 0; i < count; i++) {
        const id = lessonIds[i];
        const total = 3;
        const score = (i % 4 === 3) ? total - 1 : total;
        seedClock += 1000 * 60 * 60 * 3;
        lessons[id] = { done: true, score, total, ts: seedClock };
      }
    };

    markLessons(VOL1_LESSONS, n1);
    markLessons(VOL2_LESSONS, n2);
    if (f1) finals['vol-1'] = { passed: true, score: 6, total: 6, ts: seedClock };
    if (f2) finals['vol-2'] = { passed: true, score: 5, total: 6, ts: seedClock };

    progress[uid] = { lessons, finals, milestones };
  });

  // ── Assignments: vol-1 and vol-2 to all baristas, vol-3 unassigned ──
  const assignments = {};
  const assignId = (userId, modId) => {
    const id = `asgn-${userId}-${modId}`;
    assignments[id] = {
      id,
      moduleId: modId,
      userId,
      trigger: 'track_auto',
      assignedAt: now - 1000 * 60 * 60 * 24 * 60,
      deadline: null,
      status: 'in_progress',
    };
  };

  baristas.forEach((uid) => {
    assignId(uid, modVol1);
    assignId(uid, modVol2);
    // vol3 intentionally NOT assigned — demo is to assign it
  });
  // Managers too
  [marco, sofia].forEach((uid) => {
    assignId(uid, modVol1);
    assignId(uid, modVol2);
  });

  // ── Onboarding milestones for the cafe (standard template) ──
  const milestones = {};
  const mtemplate = [
    { role: 'barista', title: 'Cafe culture and expectations', desc: 'Complete orientation with your manager. Covers house rules, scheduling, and team norms.' },
    { role: 'barista', title: 'Equipment walk-through', desc: 'Hands-on tour of all equipment: espresso machine, grinder, brew bar, and POS.' },
    { role: 'barista', title: 'First espresso pull', desc: 'Pull and taste an espresso shot under manager supervision. Dial in grind and dose.' },
    { role: 'barista', title: 'Milk steaming to standard', desc: 'Steam microfoam to correct texture and temperature for standard milk drinks.' },
    { role: 'barista', title: 'Build all house drinks from memory', desc: 'Prepare the full house menu without reference. Assessed by manager.' },
    { role: 'barista', title: 'Health & safety sign-off', desc: 'Review allergen matrix, cleaning schedule, and opening/closing procedures.' },
    { role: 'manager', title: 'Shadow a full shift', desc: 'Observe a complete opening or closing shift with an experienced team member.' },
    { role: 'manager', title: 'Run floor independently', desc: 'Manage a shift solo. Manager confirms readiness.' },
    { role: 'manager', title: 'Complete scheduling module', desc: 'Build next week\'s schedule using the cafe\'s template.' },
  ];
  mtemplate.forEach((m, i) => {
    const id = `ms-template-${i}`;
    milestones[id] = { id, cafeId: cafe, role: m.role, title: m.title, desc: m.desc, source: 'template', status: 'approved', order: i };
  });

  // ── Activity feed ──
  const names = { [linda]:'Linda Turko', [reza]:'Reza Mehta', [pia]:'Pia Olsen', [lili]:'Lili Turko', [jules]:'Jules Patel', [devi]:'Devi Shah' };
  const activity = [
    { id: uid(), who: names[reza],  action: 'completed', label: 'II-05 Anaerobic and experimental', kind: 'complete', ts: now - 1000*60*60*2 },
    { id: uid(), who: names[pia],   action: 'completed', label: 'II-02 Washed process',              kind: 'complete', ts: now - 1000*60*60*6 },
    { id: uid(), who: names[lili],  action: 'completed', label: 'II-01 The cherry, anatomy of',      kind: 'complete', ts: now - 1000*60*60*26 },
    { id: uid(), who: names[jules], action: 'completed', label: 'I-05 Plantations and empire',       kind: 'complete', ts: now - 1000*60*60*30 },
  ];

  return {
    version: 4,
    cafes: {
      [cafe]: {
        id: cafe, name: 'Milano Coffee',
        createdAt: now - 1000*60*60*24*90,
        plan: 'flat',
        subscription: { status: 'trial', seats: 9, renewsAt: now + 1000*60*60*24*25 },
        setupComplete: false,
      },
    },
    locations: {
      [locDowntown]: { id: locDowntown, cafeId: cafe, name: 'Downtown' },
      [locWestside]: { id: locWestside, cafeId: cafe, name: 'Westside' },
    },
    users: {
      [owner]: { id: owner, cafeId: cafe, locationId: null,         name: 'Brian Turko',  email: 'admin@milano.coffee',  password: DEMO_PW, role: 'owner',   status: 'active', joinedAt: now-1000*60*60*24*90 },
      [marco]: { id: marco, cafeId: cafe, locationId: locDowntown,  name: 'Marco Reyes',  email: 'marco@milano.coffee',  password: DEMO_PW, role: 'manager', status: 'active', joinedAt: now-1000*60*60*24*60 },
      [sofia]: { id: sofia, cafeId: cafe, locationId: locWestside,  name: 'Sofia Novak',  email: 'sofia@milano.coffee',  password: DEMO_PW, role: 'manager', status: 'active', joinedAt: now-1000*60*60*24*45 },
      [linda]: { id: linda, cafeId: cafe, locationId: locDowntown,  name: 'Linda Turko',  email: 'linda@milano.coffee',  password: DEMO_PW, role: 'barista', status: 'active', joinedAt: now-1000*60*60*24*70 },
      [reza]:  { id: reza,  cafeId: cafe, locationId: locDowntown,  name: 'Reza Mehta',   email: 'reza@milano.coffee',   password: DEMO_PW, role: 'barista', status: 'active', joinedAt: now-1000*60*60*24*50 },
      [pia]:   { id: pia,   cafeId: cafe, locationId: locDowntown,  name: 'Pia Olsen',    email: 'pia@milano.coffee',    password: DEMO_PW, role: 'barista', status: 'active', joinedAt: now-1000*60*60*24*40 },
      [lili]:  { id: lili,  cafeId: cafe, locationId: locWestside,  name: 'Lili Turko',   email: 'lili@milano.coffee',   password: DEMO_PW, role: 'barista', status: 'active', joinedAt: now-1000*60*60*24*35 },
      [jules]: { id: jules, cafeId: cafe, locationId: locWestside,  name: 'Jules Patel',  email: 'jules@milano.coffee',  password: DEMO_PW, role: 'barista', status: 'active', joinedAt: now-1000*60*60*24*30 },
      [devi]:  { id: devi,  cafeId: cafe, locationId: locWestside,  name: 'Devi Shah',    email: 'devi@milano.coffee',   password: DEMO_PW, role: 'barista', status: 'active', joinedAt: now-1000*60*60*24*10 },
    },
    invites: {},
    modules: {
      [modVol1]: { id: modVol1, cafeId: null, source: 'copi', type: 'learning_track', title: 'History of Coffee', roles: ['barista','host','manager'], lessonIds: VOL1_LESSONS, finalId: 'vol-1-final', volId: 'vol-1', status: 'published' },
      [modVol2]: { id: modVol2, cafeId: null, source: 'copi', type: 'learning_track', title: 'Processing Methods', roles: ['barista','host','manager'], lessonIds: VOL2_LESSONS, finalId: 'vol-2-final', volId: 'vol-2', status: 'published' },
      [modVol3]: { id: modVol3, cafeId: null, source: 'copi', type: 'learning_track', title: 'Barista Knowledge', roles: ['barista','host','manager'], lessonIds: VOL3_LESSONS, finalId: 'vol-3-final', volId: 'vol-3', status: 'published' },
    },
    // Demo blocks for v1l1 (Ethiopia lesson) to showcase flashcard + drag-drop
    lessons: {
      'v1l1-demo': {
        id: 'v1l1-demo', moduleId: modVol1, title: 'Ethiopia, the cradle',
        minutes: 9, blockIds: ['blk-fc-1', 'blk-dd-1'], quiz: [], passMark: 0.6,
      },
    },
    blocks: {
      'blk-fc-1': {
        id: 'blk-fc-1', lessonId: 'v1l1-demo', type: 'flashcard',
        data: {
          cards: [
            { front: 'Where did Coffea arabica originate?', back: 'The highland forests of southwestern Ethiopia — where it still grows wild today.' },
            { front: 'Why do Ethiopian coffees taste so varied?', back: 'Ethiopia\'s genetic diversity: thousands of uncatalogued wild heirloom varieties, each expressing different flavour profiles.' },
            { front: 'What is a "natural process" coffee?', back: 'The cherry is dried whole before the bean is extracted, giving fruity, fermented notes — contrast with washed, where pulp is removed first.' },
          ],
        },
      },
      'blk-dd-1': {
        id: 'blk-dd-1', lessonId: 'v1l1-demo', type: 'drag_and_drop',
        data: {
          mode: 'order',
          prompt: 'Put the waves of coffee in the correct historical order.',
          items: ['First wave — mass commodity', 'Second wave — espresso & café culture', 'Third wave — provenance & craft'],
        },
      },
    },
    milestones,
    assignments,
    progress,
    attempts: [],
    aiJobs: [],
    activity,
    // Roaster-import curricula → tracks → lessons hierarchy.
    // Separate from `modules` so the existing learning-track system is untouched.
    curricula: {},   // { id, cafeId, status: 'draft'|'published', sourceUrl, shopName, tagline, about, logoUrl, importedAt, createdAt }
    tracks: {},      // { id, curriculumId, title, description, position }
    trackLessons: {}, // { id, trackId, title, content, estimatedMinutes, position, aiGenerated }
    curriculumAssignments: {} // { id, curriculumId, userId, assignedAt }
  };
}

// ── Schema migration: any existing localStorage payload missing the
// new curricula/tracks/trackLessons tables gets them filled in lazily.
// Called from loadDb() so an upgrade in place doesn't lose seed data.
export function migrateDb(db) {
  if (!db || typeof db !== 'object') return db;
  if (!db.curricula)             db.curricula             = {};
  if (!db.tracks)                db.tracks                = {};
  if (!db.trackLessons)          db.trackLessons          = {};
  if (!db.curriculumAssignments) db.curriculumAssignments = {};
  return db;
}

export function loadDb() {
  try {
    const raw = JSON.parse(localStorage.getItem(DB_KEY));
    if (raw && raw.version === 4) return migrateDb(raw);
  } catch (_) {}
  const fresh = seedDatabase();
  saveDb(fresh);
  return fresh;
}

export function saveDb(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (_) {}
}
