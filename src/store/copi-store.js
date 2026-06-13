import React from 'react';
import { loadDb, saveDb, seedDatabase, uid, IDS } from './copi-db.js';
import {
  autoAssignOnboarding,
  autoAssignLearningTracks,
  manualAssignModule,
  removeAssignment,
  assignVolumeCompat,
  unassignVolumeCompat,
} from './assignment-engine.js';

// ── Singleton ────────────────────────────────────────────────
let db = loadDb();
const subs = new Set();

function persist() { saveDb(db); }
function emit()    { persist(); subs.forEach((fn) => fn()); }

// ── Helpers ─────────────────────────────────────────────────
function userByEmail(email) {
  return Object.values(db.users).find((u) => u.email === email.toLowerCase().trim()) || null;
}
function userByEmailOrId(emailOrId) {
  return db.users[emailOrId] || userByEmail(emailOrId);
}
function userById(id) { return db.users[id] || null; }
function nameFor(emailOrId) {
  const u = userByEmailOrId(emailOrId);
  return u ? u.name : (emailOrId || 'Someone');
}

// ── Compat: curriculum helpers (reads from window.COPI_VOL*) ──
function getCurriculum() { return (window.COPI_CURRICULUM || []).filter(Boolean); }
function volById(id)     { return getCurriculum().find((v) => v.id === id) || null; }
function lessonById(lessonId) {
  for (const v of getCurriculum()) {
    const l = v.lessons.find((x) => x.id === lessonId);
    if (l) return { vol: v, lesson: l };
  }
  return null;
}
function moduleForVol(volId) {
  return Object.values(db.modules).find((m) => m.volId === volId) || null;
}

// ── Compat: progress helpers ─────────────────────────────────
function progressOf(userId) {
  if (!db.progress[userId]) db.progress[userId] = { lessons: {}, finals: {}, milestones: {} };
  return db.progress[userId];
}

function isAssignedByModule(userId, moduleId) {
  const id = `asgn-${userId}-${moduleId}`;
  return !!db.assignments[id];
}

function isAssignedVol(emailOrId, volId) {
  const user = userByEmailOrId(emailOrId);
  if (!user) return false;
  const mod = moduleForVol(volId);
  if (!mod) return false;
  return isAssignedByModule(user.id, mod.id);
}

// ── The public store API ─────────────────────────────────────
const CopiStore = {
  // ── Subscribe/emit ───────────────────────────────────────
  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  raw() { return db; },

  // ── Auth ─────────────────────────────────────────────────
  authenticate(email, password) {
    const u = userByEmail(email);
    if (!u || u.password !== password) return null;
    if (u.status === 'invited') return null; // must use invite link
    return u;
  },

  // ── Cafes ────────────────────────────────────────────────
  getCafe(cafeId) { return db.cafes[cafeId] || null; },
  getDefaultCafe() { return Object.values(db.cafes)[0] || null; },
  updateCafe(cafeId, updates) {
    if (!db.cafes[cafeId]) return;
    Object.assign(db.cafes[cafeId], updates);
    emit();
  },

  // ── Locations ────────────────────────────────────────────
  getLocations(cafeId) {
    return Object.values(db.locations).filter((l) => l.cafeId === cafeId);
  },
  createLocation(cafeId, name) {
    const id = uid();
    db.locations[id] = { id, cafeId, name };
    emit();
    return db.locations[id];
  },
  updateLocation(id, updates) {
    if (!db.locations[id]) return;
    Object.assign(db.locations[id], updates);
    emit();
  },
  deleteLocation(id) {
    delete db.locations[id];
    emit();
  },

  // ── Users ────────────────────────────────────────────────
  getUsers(cafeId, locationId = undefined) {
    return Object.values(db.users).filter((u) => {
      if (u.cafeId !== cafeId) return false;
      if (locationId !== undefined && locationId !== null) return u.locationId === locationId;
      return true;
    });
  },
  getUserById(id)      { return db.users[id] || null; },
  getUserByEmail(email){ return userByEmail(email); },

  createUser({ cafeId, locationId, name, email, password, role }) {
    const id = uid();
    db.users[id] = {
      id, cafeId, locationId: locationId || null,
      name, email: email.toLowerCase().trim(),
      password: password || uid(), // temp password until invite accepted
      role, status: 'invited', joinedAt: Date.now(),
    };
    emit();
    return db.users[id];
  },
  updateUser(id, updates) {
    if (!db.users[id]) return;
    Object.assign(db.users[id], updates);
    emit();
  },
  deactivateUser(id) {
    if (!db.users[id]) return;
    db.users[id].status = 'inactive';
    emit();
  },

  // ── Invites ──────────────────────────────────────────────
  createInvite(userId, cafeId) {
    const token = uid() + uid();
    db.invites[token] = {
      token, userId, cafeId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 72 * 3600 * 1000,
      usedAt: null,
    };
    emit();
    return token;
  },
  getInvite(token) { return db.invites[token] || null; },
  consumeInvite(token, newPassword) {
    const inv = db.invites[token];
    if (!inv) return { error: 'not_found' };
    if (inv.usedAt) return { error: 'already_used' };
    if (Date.now() > inv.expiresAt) return { error: 'expired' };
    inv.usedAt = Date.now();
    const user = db.users[inv.userId];
    if (user) {
      user.password = newPassword;
      user.status = 'active';
      user.joinedAt = Date.now();
    }
    emit();
    return { ok: true, user };
  },
  resendInvite(userId) {
    const user = db.users[userId];
    if (!user) return null;
    // Invalidate old tokens for this user
    Object.values(db.invites).forEach((inv) => {
      if (inv.userId === userId && !inv.usedAt) inv.usedAt = Date.now();
    });
    return this.createInvite(userId, user.cafeId);
  },
  getPendingInvitesForUser(userId) {
    return Object.values(db.invites).filter((inv) => inv.userId === userId && !inv.usedAt && Date.now() < inv.expiresAt);
  },

  // ── Modules ──────────────────────────────────────────────
  getModules(cafeId) {
    return Object.values(db.modules).filter((m) => m.cafeId === cafeId || m.cafeId === null);
  },
  getModule(id)  { return db.modules[id] || null; },
  createModule(data) {
    const id = uid();
    db.modules[id] = { id, lessonIds: [], status: 'draft', createdAt: Date.now(), ...data };
    emit();
    return db.modules[id];
  },
  updateModule(id, updates) {
    if (!db.modules[id]) return;
    Object.assign(db.modules[id], updates);
    emit();
  },
  publishModule(id) {
    if (!db.modules[id]) return;
    db.modules[id].status = 'published';
    emit();
  },
  deleteModule(id) {
    delete db.modules[id];
    emit();
  },

  // ── Lessons / Blocks / Quiz ──────────────────────────────
  getLesson(id) { return db.lessons[id] || null; },
  getLessonsForModule(moduleId) {
    const mod = db.modules[moduleId];
    if (!mod) return [];
    return mod.lessonIds.map((id) => db.lessons[id]).filter(Boolean);
  },
  createLesson(moduleId, { title, minutes = 10, passMark = 0.6 }) {
    const id = uid();
    db.lessons[id] = { id, moduleId, title, minutes, blockIds: [], quiz: [], passMark };
    const mod = db.modules[moduleId];
    if (mod) mod.lessonIds.push(id);
    emit();
    return db.lessons[id];
  },
  updateLesson(id, updates) {
    if (!db.lessons[id]) return;
    Object.assign(db.lessons[id], updates);
    emit();
  },
  deleteLesson(id) {
    const lesson = db.lessons[id];
    if (!lesson) return;
    const mod = db.modules[lesson.moduleId];
    if (mod) mod.lessonIds = mod.lessonIds.filter((lid) => lid !== id);
    lesson.blockIds.forEach((bid) => delete db.blocks[bid]);
    delete db.lessons[id];
    emit();
  },
  createBlock(lessonId, { type, data }) {
    const id = uid();
    db.blocks[id] = { id, lessonId, type, data };
    const lesson = db.lessons[lessonId];
    if (lesson) lesson.blockIds.push(id);
    emit();
    return db.blocks[id];
  },
  updateBlock(id, updates) {
    if (!db.blocks[id]) return;
    Object.assign(db.blocks[id], updates);
    emit();
  },
  deleteBlock(id) {
    const block = db.blocks[id];
    if (!block) return;
    const lesson = db.lessons[block.lessonId];
    if (lesson) lesson.blockIds = lesson.blockIds.filter((bid) => bid !== id);
    delete db.blocks[id];
    emit();
  },
  addQuizQuestion(lessonId, question) {
    const lesson = db.lessons[lessonId];
    if (!lesson) return;
    lesson.quiz = [...(lesson.quiz || []), question];
    emit();
  },
  updateQuizQuestion(lessonId, index, question) {
    const lesson = db.lessons[lessonId];
    if (!lesson || !lesson.quiz[index]) return;
    lesson.quiz[index] = question;
    emit();
  },
  removeQuizQuestion(lessonId, index) {
    const lesson = db.lessons[lessonId];
    if (!lesson) return;
    lesson.quiz = lesson.quiz.filter((_, i) => i !== index);
    emit();
  },

  // ── Milestones ───────────────────────────────────────────
  getMilestones(cafeId, role = null) {
    return Object.values(db.milestones)
      .filter((m) => m.cafeId === cafeId && (role ? m.role === role : true))
      .sort((a, b) => a.order - b.order);
  },
  createMilestone(cafeId, { role, title, desc, source = 'manual', order }) {
    const id = uid();
    const existing = Object.values(db.milestones).filter((m) => m.cafeId === cafeId);
    db.milestones[id] = { id, cafeId, role, title, desc, source, status: 'suggested', order: order ?? existing.length };
    emit();
    return db.milestones[id];
  },
  updateMilestone(id, updates) {
    if (!db.milestones[id]) return;
    Object.assign(db.milestones[id], updates);
    emit();
  },
  approveMilestone(id) {
    if (!db.milestones[id]) return;
    db.milestones[id].status = 'approved';
    emit();
  },
  dismissMilestone(id) {
    if (!db.milestones[id]) return;
    db.milestones[id].status = 'dismissed';
    emit();
  },
  publishMilestones(cafeId) {
    // Approve all suggested milestones, create onboarding module, assign to users
    Object.values(db.milestones).forEach((m) => {
      if (m.cafeId === cafeId && m.status === 'suggested') m.status = 'approved';
    });
    // Mark cafe setup as having onboarding published
    if (db.cafes[cafeId]) {
      db.cafes[cafeId].onboardingPublished = true;
      db.cafes[cafeId].setupComplete = true;
    }
    emit();
  },

  // ── Assignments ──────────────────────────────────────────
  getAssignments(userId) {
    return Object.values(db.assignments).filter((a) => a.userId === userId);
  },
  getAssignmentsForModule(moduleId) {
    return Object.values(db.assignments).filter((a) => a.moduleId === moduleId);
  },
  assignModule(userId, moduleId, trigger = 'manual', deadlineHours = null) {
    const changed = manualAssignModule(db, userId, moduleId, trigger, deadlineHours);
    if (changed) emit();
    return changed;
  },
  unassignModule(userId, moduleId) {
    const changed = removeAssignment(db, userId, moduleId);
    if (changed) emit();
    return changed;
  },
  updateAssignmentStatus(assignmentId, status) {
    if (!db.assignments[assignmentId]) return;
    db.assignments[assignmentId].status = status;
    emit();
  },

  // ── Progress ─────────────────────────────────────────────
  getProgress(userId) { return progressOf(userId); },

  completeMilestone(userId, milestoneId, signedOffBy, note = '') {
    const prog = progressOf(userId);
    prog.milestones[milestoneId] = { done: true, signedOffBy, note, ts: Date.now() };
    // Check if all approved milestones for this user's cafe/role are done
    const user = userById(userId);
    if (user) {
      const approved = Object.values(db.milestones)
        .filter((m) => m.cafeId === user.cafeId && m.role === user.role && m.status === 'approved');
      const allDone = approved.every((m) => prog.milestones[m.id]?.done);
      if (allDone && approved.length > 0) {
        // Auto-assign learning tracks
        autoAssignLearningTracks(db, userId);
      }
    }
    db.activity.unshift({ id: uid(), who: nameFor(userId), action: 'completed milestone', label: db.milestones[milestoneId]?.title || milestoneId, kind: 'milestone', ts: Date.now() });
    db.activity = db.activity.slice(0, 30);
    emit();
  },

  recordLessonAttempt(userId, lessonId, score, total, passed) {
    db.attempts.push({ id: uid(), userId, lessonId, score, total, passed, ts: Date.now() });
    const prog = progressOf(userId);
    if (passed) {
      prog.lessons[lessonId] = { done: true, score, total, ts: Date.now() };
      const user = userById(userId);
      const found = lessonById(lessonId);
      if (found) {
        const label = `${found.vol.num === '01' ? 'I' : found.vol.num === '02' ? 'II' : 'III'}-${found.lesson.num} ${found.lesson.title}`;
        db.activity.unshift({ id: uid(), who: nameFor(userId), action: 'completed', label, kind: 'complete', ts: Date.now() });
        db.activity = db.activity.slice(0, 30);
      }
    }
    emit();
    return passed;
  },

  recordFinalAttempt(userId, volId, score, total) {
    const v = volById(volId);
    const passed = v ? score / total >= (v.finalTest?.passMark || 0.7) : false;
    db.attempts.push({ id: uid(), userId, lessonId: `${volId}-final`, score, total, passed, ts: Date.now() });
    const prog = progressOf(userId);
    prog.finals = prog.finals || {};
    prog.finals[volId] = { passed, score, total, ts: Date.now() };
    db.activity.unshift({ id: uid(), who: nameFor(userId), action: passed ? 'passed' : 'attempted', label: `${v?.vol} final test — ${score}/${total}`, kind: passed ? 'cert' : 'review', ts: Date.now() });
    db.activity = db.activity.slice(0, 30);
    emit();
    return passed;
  },

  // ── AI Jobs ──────────────────────────────────────────────
  createAiJob(cafeId, files) {
    const id = uid();
    const job = { id, cafeId, files, status: 'queued', createdAt: Date.now(), output: null };
    db.aiJobs.push(job);
    emit();
    return job;
  },
  updateAiJob(jobId, updates) {
    const job = db.aiJobs.find((j) => j.id === jobId);
    if (!job) return;
    Object.assign(job, updates);
    emit();
  },
  getAiJobs(cafeId) { return db.aiJobs.filter((j) => j.cafeId === cafeId); },
  getLatestAiJob(cafeId) {
    const jobs = db.aiJobs.filter((j) => j.cafeId === cafeId);
    return jobs[jobs.length - 1] || null;
  },

  // ── Activity ─────────────────────────────────────────────
  getActivity(limit = 8) { return (db.activity || []).slice(0, limit); },

  // ── Reset (demo utility) ─────────────────────────────────
  resetAll() {
    db = seedDatabase();
    saveDb(db);
    emit();
  },

  // ════════════════════════════════════════════════════════
  // COMPAT SHIMS — keep the inline App.jsx pages working
  // while they still reference the old vol/email-based API.
  // ════════════════════════════════════════════════════════

  get team() {
    return Object.values(db.users).filter((u) => ['barista','host'].includes(u.role));
  },
  get curriculum() { return getCurriculum(); },
  volById,
  lessonById,

  isAssigned(email, volId) { return isAssignedVol(email, volId); },

  assignedVolumes(email) {
    const user = userByEmail(email);
    if (!user) return [];
    const curriculum = getCurriculum();
    return curriculum.filter((v) => isAssignedVol(email, v.id));
  },

  assignedEmails(volId) {
    const mod = moduleForVol(volId);
    if (!mod) return [];
    return Object.values(db.assignments)
      .filter((a) => a.moduleId === mod.id)
      .map((a) => db.users[a.userId]?.email)
      .filter(Boolean);
  },

  assignVolume(volId, emails) {
    const added = assignVolumeCompat(db, volId, emails, userByEmail);
    if (added) {
      const v = volById(volId);
      db.activity.unshift({ id: uid(), who: 'Brian Turko', action: 'assigned', label: `${v?.vol} ${v?.name} → ${added} barista${added > 1 ? 's' : ''}`, kind: 'assign', ts: Date.now() });
      emit();
    }
    return added;
  },

  unassignVolume(volId, emails) {
    unassignVolumeCompat(db, volId, emails, userByEmail);
    emit();
  },

  lessonRecord(email, lessonId) {
    const user = userByEmail(email);
    if (!user) return null;
    return progressOf(user.id).lessons[lessonId] || null;
  },

  finalRecord(email, volId) {
    const user = userByEmail(email);
    if (!user) return null;
    return (progressOf(user.id).finals || {})[volId] || null;
  },

  lessonStatus(email, volId, idx) {
    if (!isAssignedVol(email, volId)) return 'locked';
    const v = volById(volId);
    if (!v) return 'locked';
    const user = userByEmail(email);
    if (!user) return 'locked';
    const prog = progressOf(user.id);
    const lesson = v.lessons[idx];
    const rec = prog.lessons[lesson.id];
    if (rec && rec.done) return 'done';
    if (idx === 0) return 'current';
    const prev = v.lessons[idx - 1];
    const prevRec = prog.lessons[prev.id];
    return (prevRec && prevRec.done) ? 'current' : 'locked';
  },

  finalStatus(email, volId) {
    if (!isAssignedVol(email, volId)) return 'locked';
    const v = volById(volId);
    if (!v) return 'locked';
    const user = userByEmail(email);
    if (!user) return 'locked';
    const prog = progressOf(user.id);
    const fin = (prog.finals || {})[volId];
    if (fin && fin.passed) return 'done';
    const allDone = v.lessons.every((l) => (prog.lessons[l.id] || {}).done);
    return allDone ? 'current' : 'locked';
  },

  completeLesson(email, lessonId, score, total) {
    const user = userByEmail(email);
    if (!user) return;
    const found = lessonById(lessonId);
    if (!found) return;
    const prog = progressOf(user.id);
    const already = prog.lessons[lessonId]?.done;
    prog.lessons[lessonId] = { done: true, score, total, ts: Date.now() };
    if (!already) {
      const label = `${found.vol.num === '01' ? 'I' : found.vol.num === '02' ? 'II' : 'III'}-${found.lesson.num} ${found.lesson.title}`;
      db.activity.unshift({ id: uid(), who: nameFor(email), action: 'completed', label, kind: 'complete', ts: Date.now() });
      db.activity = db.activity.slice(0, 30);
    }
    emit();
  },

  completeFinal(email, volId, score, total) {
    const user = userByEmail(email);
    if (!user) return false;
    const v = volById(volId);
    if (!v) return false;
    const passed = score / total >= (v.finalTest?.passMark || 0.7);
    const prog = progressOf(user.id);
    prog.finals = prog.finals || {};
    prog.finals[volId] = { passed, score, total, ts: Date.now() };
    db.activity.unshift({ id: uid(), who: nameFor(email), action: passed ? 'passed' : 'attempted', label: `${v.vol} final test — ${score}/${total}`, kind: passed ? 'cert' : 'review', ts: Date.now() });
    db.activity = db.activity.slice(0, 30);
    emit();
    return passed;
  },

  volumeStats(email, volId) {
    const v = volById(volId);
    if (!v) return { done: 0, total: 0, pct: 0, certified: false, assigned: false };
    const user = userByEmail(email);
    const prog = user ? progressOf(user.id) : { lessons: {}, finals: {} };
    const done = v.lessons.filter((l) => (prog.lessons[l.id] || {}).done).length;
    const total = v.lessons.length;
    const fin = (prog.finals || {})[volId];
    const certified = !!(fin && fin.passed);
    return { done, total, pct: total ? done / total : 0, certified, assigned: isAssignedVol(email, volId) };
  },

  overallPct(email) {
    const curriculum = getCurriculum();
    const vols = curriculum.filter((v) => isAssignedVol(email, v.id));
    if (!vols.length) return 0;
    let done = 0, total = 0;
    vols.forEach((v) => { const s = this.volumeStats(email, v.id); done += s.done; total += s.total; });
    return total ? done / total : 0;
  },

  currentLesson(email) {
    const curriculum = getCurriculum();
    for (const v of curriculum) {
      if (!isAssignedVol(email, v.id)) continue;
      for (let i = 0; i < v.lessons.length; i++) {
        if (this.lessonStatus(email, v.id, i) === 'current') return { vol: v, lesson: v.lessons[i], idx: i };
      }
      if (this.finalStatus(email, v.id) === 'current') return { vol: v, lesson: null, idx: -1, isFinal: true };
    }
    return null;
  },

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

  teamCompletion() {
    const team = this.team;
    const curriculum = getCurriculum();
    const active = team.filter((t) => curriculum.some((v) => isAssignedVol(t.email, v.id)));
    if (!active.length) return 0;
    return active.reduce((sum, t) => sum + this.overallPct(t.email), 0) / active.length;
  },

  teamSnapshot() {
    return this.team.map((t) => {
      const pct = Math.round(this.overallPct(t.email) * 100);
      let cert = '—';
      if (this.volumeStats(t.email, 'vol-3').certified) cert = 'Bar certified';
      else if (this.volumeStats(t.email, 'vol-1').certified || this.volumeStats(t.email, 'vol-2').certified) cert = 'Foundations';
      return { ...t, pct, cert };
    });
  },

  activity(limit = 8) { return (db.activity || []).slice(0, limit); },

  lessonsThisWeek() {
    const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
    let n = 0;
    this.team.forEach((t) => {
      const user = userByEmail(t.email);
      if (!user) return;
      Object.values(progressOf(user.id).lessons).forEach((r) => { if (r.done && r.ts >= weekAgo) n++; });
    });
    return n;
  },

  avgScore() {
    let score = 0, total = 0;
    this.team.forEach((t) => {
      const user = userByEmail(t.email);
      if (!user) return;
      Object.values(progressOf(user.id).lessons).forEach((r) => { score += r.score; total += r.total; });
    });
    return total ? score / total : 0;
  },
};

// ── Expose globals ────────────────────────────────────────
window.CopiStore = CopiStore;
window.__copiDbHelpers = { uid, saveDb: (db) => saveDb(db) };

function useCopiStore() {
  const [, force] = React.useState(0);
  React.useEffect(() => CopiStore.subscribe(() => force((n) => n + 1)), []);
  return CopiStore;
}
window.useCopiStore = useCopiStore;

export { CopiStore, useCopiStore };
