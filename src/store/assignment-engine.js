// assignment-engine.js — the 4 module assignment triggers.
// Called by copi-store when state transitions happen.
import { uid, IDS } from './copi-db.js';

// volId → moduleId map (stable IDs)
const VOL_TO_MOD = {
  'vol-1': IDS.modVol1,
  'vol-2': IDS.modVol2,
  'vol-3': IDS.modVol3,
};

export function autoAssignOnboarding(db, userId) {
  const user = db.users[userId];
  if (!user) return false;
  const cafeId = user.cafeId;
  let changed = false;
  // Find all published onboarding modules for this cafe
  Object.values(db.modules).forEach((mod) => {
    if (mod.source !== 'cafe') return;
    if (mod.type !== 'onboarding') return;
    if (mod.cafeId !== cafeId) return;
    if (mod.status !== 'published') return;
    if (mod.roles && !mod.roles.includes(user.role)) return;
    const existingId = `asgn-${userId}-${mod.id}`;
    if (!db.assignments[existingId]) {
      db.assignments[existingId] = {
        id: existingId,
        moduleId: mod.id,
        userId,
        trigger: 'onboarding_auto',
        assignedAt: Date.now(),
        deadline: null,
        status: 'not_started',
      };
      changed = true;
    }
  });
  return changed;
}

export function autoAssignLearningTracks(db, userId) {
  // Called when a user completes all onboarding milestones.
  // Assigns the copi-source learning_track modules.
  const user = db.users[userId];
  if (!user) return false;
  let changed = false;
  Object.values(db.modules).forEach((mod) => {
    if (mod.source !== 'copi') return;
    if (mod.type !== 'learning_track') return;
    if (mod.status !== 'published') return;
    if (mod.roles && !mod.roles.includes(user.role)) return;
    const existingId = `asgn-${userId}-${mod.id}`;
    if (!db.assignments[existingId]) {
      db.assignments[existingId] = {
        id: existingId,
        moduleId: mod.id,
        userId,
        trigger: 'track_auto',
        assignedAt: Date.now(),
        deadline: null,
        status: 'not_started',
      };
      changed = true;
    }
  });
  return changed;
}

export function manualAssignModule(db, userId, moduleId, trigger = 'manual', deadlineHours = null) {
  const id = `asgn-${userId}-${moduleId}`;
  const existing = db.assignments[id];
  if (existing) return false;
  db.assignments[id] = {
    id,
    moduleId,
    userId,
    trigger,
    assignedAt: Date.now(),
    deadline: deadlineHours ? Date.now() + deadlineHours * 3600 * 1000 : null,
    status: 'not_started',
  };
  return true;
}

export function removeAssignment(db, userId, moduleId) {
  const id = `asgn-${userId}-${moduleId}`;
  if (!db.assignments[id]) return false;
  delete db.assignments[id];
  return true;
}

// ── Compat: vol-based assignment (wraps module-based logic) ──
export function assignVolumeCompat(db, volId, emails, userByEmail) {
  const moduleId = VOL_TO_MOD[volId];
  if (!moduleId) return 0;
  let added = 0;
  emails.forEach((email) => {
    const user = userByEmail(email);
    if (!user) return;
    if (manualAssignModule(db, user.id, moduleId, 'track_auto')) added++;
  });
  return added;
}

export function unassignVolumeCompat(db, volId, emails, userByEmail) {
  const moduleId = VOL_TO_MOD[volId];
  if (!moduleId) return;
  emails.forEach((email) => {
    const user = userByEmail(email);
    if (!user) return;
    removeAssignment(db, user.id, moduleId);
  });
}
