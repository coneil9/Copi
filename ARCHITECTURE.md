# ARCHITECTURE.md

## High-Level System Design

Copi is a **multi-location cafe management and education platform** with role-based permissions and location scoping. The architecture supports:

- **Account hierarchy**: Cafe → Locations → Users
- **Four user roles**: Owner/Admin (multi-location), Manager (single location), Barista/Host (single location, personal view)
- **Dual education systems**: Onboarding milestones (manager-approved) + Learning tracks (self-paced lessons)
- **Location filtering**: All data queries respect user's locationId except for Owner/Admin

**Current state**: localStorage-based prototype evolving toward Supabase backend with multi-tenant support.

### Data Flow

```
User Interaction (complete lesson, mark milestone, assign staff)
         ↓
Component calls CopiStore method (with current user context)
         ↓
CopiStore checks permissions (role + locationId)
         ↓
CopiStore updates internal state object
         ↓
CopiStore persists to localStorage (will migrate to Supabase)
         ↓
CopiStore notifies all subscribed components via emit()
         ↓
Components re-render via useCopiStore() hook
```

### Component Tree (Simplified)

```
CopiPrototype (App.jsx - root component)
├── TrialModal (cafe signup flow)
├── AddTeamModal (invite staff to location)
├── LessonPlayer (lesson experience)
├── AssignModal (assign curriculum to staff)
└── Current view (role-based routing):
    ├── LandingPage (marketing)
    ├── AboutPage (marketing)
    ├── PricingPage (marketing)
    ├── CurriculumPage (marketing)
    ├── OwnerDashboard (multi-location view with location switcher)
    │   ├── Location switcher (dropdown/tabs)
    │   ├── Analytics (aggregated or filtered by location)
    │   ├── Curriculum management
    │   ├── Team roster (all locations or filtered)
    │   ├── Onboarding milestone approvals
    │   └── Settings (billing, integrations)
    ├── ManagerDashboard (single location view)
    │   ├── Team roster (location-scoped)
    │   ├── Onboarding milestone approvals (location-scoped)
    │   ├── Staff progress (location-scoped)
    │   └── Communication tools
    └── BaristaDashboard ("Today" view - personal)
        ├── My onboarding milestones
        ├── My next lesson
        ├── My progress & badges
        └── My learning library
```

## Account and Permission Architecture

### Account Hierarchy

```
Cafe (master account)
  ├── cafeId: 'cafe-milano'
  ├── name: 'Milano Coffee'
  ├── billing info
  └── Locations[]
        ├── Location 1
        │   ├── locationId: 'loc-downtown'
        │   ├── name: 'Milano Downtown'
        │   ├── address: '123 Main St'
        │   └── Users[]
        │       ├── Manager (locationId: 'loc-downtown')
        │       ├── Barista 1 (locationId: 'loc-downtown')
        │       ├── Barista 2 (locationId: 'loc-downtown')
        │       └── Host (locationId: 'loc-downtown')
        └── Location 2
            ├── locationId: 'loc-westside'
            ├── name: 'Milano Westside'
            └── Users[]
                ├── Manager (locationId: 'loc-westside')
                └── Barista 3 (locationId: 'loc-westside')
  └── Owner/Admin users (locationId: null, see all locations)
```

### Role-Based Permissions Matrix

| Action | Owner/Admin | Manager | Barista | Host |
|--------|-------------|---------|---------|------|
| **Account Management** |
| View billing | ✅ | ❌ | ❌ | ❌ |
| Manage subscription | ✅ | ❌ | ❌ | ❌ |
| Add/remove locations | ✅ | ❌ | ❌ | ❌ |
| **Staff Management** |
| Add staff to account | ✅ | ❌ | ❌ | ❌ |
| Remove staff from account | ✅ | ❌ | ❌ | ❌ |
| View all staff (multi-location) | ✅ | ❌ | ❌ | ❌ |
| View staff at my location | ✅ | ✅ | ❌ | ❌ |
| **Onboarding** |
| Mark milestones complete (any location) | ✅ | ❌ | ❌ | ❌ |
| Mark milestones complete (my location) | ✅ | ✅ | ❌ | ❌ |
| View my onboarding progress | ✅ | ✅ | ✅ | ✅ |
| **Curriculum** |
| Edit lessons/volumes | ✅ | ❌ | ❌ | ❌ |
| Assign curriculum to staff | ✅ | ❌ | ❌ | ❌ |
| Complete lessons | ✅ | ✅ | ✅ | ✅ |
| View my progress | ✅ | ✅ | ✅ | ✅ |
| **Reporting** |
| View analytics (all locations) | ✅ | ❌ | ❌ | ❌ |
| View analytics (my location) | ✅ | ✅ | ❌ | ❌ |

### Location Scoping Implementation

**Key principle**: Every query filters by locationId unless user is Owner/Admin.

```js
// CopiStore method example
getStaffForCurrentUser(currentUser) {
  const allStaff = this.team;

  // Owner/Admin bypass location filtering
  if (currentUser.role === 'owner' || currentUser.role === 'admin') {
    return allStaff;
  }

  // Manager sees staff at their location
  if (currentUser.role === 'manager') {
    return allStaff.filter(s => s.locationId === currentUser.locationId);
  }

  // Barista/Host see only themselves
  return allStaff.filter(s => s.email === currentUser.email);
}
```

## Frontend Architecture

### No Real Frontend/Backend Split (Current)

There is no API currently. Supabase client exists at `src/lib/supabaseClient.js` but is not connected. All reads/writes go directly to localStorage.

**When Supabase integration happens** (near-term future):
- CopiStore methods call Supabase instead of localStorage
- Row-level security (RLS) enforces location scoping at database level
- `useCopiStore()` hook remains unchanged
- Components don't need to change

### State Management Pattern

**Global singleton** - `CopiStore` (defined in `copi-store.jsx`):

```js
const CopiStore = (function () {
  let state = loadState(); // from localStorage
  const subs = new Set();  // React components subscribed to changes

  function emit() {
    persist();              // write to localStorage
    subs.forEach(fn => fn()); // trigger re-renders
  }

  return {
    // --- Location management ---
    getLocations(currentUser),
    addLocation(cafeId, name, address),

    // --- User/Staff management ---
    getStaff(currentUser, locationId),  // respects scoping
    addStaff(email, name, role, locationId),
    removeStaff(email),

    // --- Onboarding milestones ---
    getMilestones(role),
    getMilestoneProgress(email),
    completeMilestone(email, milestoneId, completedBy),

    // --- Learning (existing) ---
    isAssigned(email, volId),
    lessonStatus(email, volId, idx),
    completeLesson(email, lessonId, score, total),
    completeFinal(email, volId, score, total),

    // --- Permissions ---
    canViewStaff(currentUser, targetUser),
    canMarkMilestone(currentUser, targetUser),
    canAssignCurriculum(currentUser),

    // --- React integration ---
    subscribe(fn),
  };
})();
```

### Routing Pattern

**No React Router** - event delegation via `copi-prototype-shell.jsx`:

The shell component renders the appropriate dashboard based on logged-in user's role:
- Owner/Admin → `OwnerDashboard`
- Manager → `ManagerDashboard`
- Barista/Host → `BaristaDashboard`

Role is determined at login from hardcoded credentials (prototype) or Supabase user metadata (production).

## Data Model

### State Object Structure (localStorage)

Stored at `localStorage['copi.progress.v4']` (versioned up from v3):

```js
{
  seeded: true,
  cafeId: 'cafe-milano',
  cafeName: 'Milano Coffee',

  // --- Locations ---
  locations: [
    { id: 'loc-downtown', name: 'Milano Downtown', address: '123 Main St', cafeId: 'cafe-milano' },
    { id: 'loc-westside', name: 'Milano Westside', address: '456 Oak Ave', cafeId: 'cafe-milano' }
  ],

  // --- Users (staff) ---
  users: [
    {
      email: 'admin@milano.coffee',
      name: 'Brian Turko',
      role: 'owner',
      locationId: null,  // Owner sees all locations
      joined: 'Jan 2025'
    },
    {
      email: 'manager@milano.coffee',
      name: 'Sarah Chen',
      role: 'manager',
      locationId: 'loc-downtown',
      joined: 'Feb 2025'
    },
    {
      email: 'lili@milano.coffee',
      name: 'Lili Turko',
      role: 'barista',
      locationId: 'loc-downtown',
      joined: 'Aug 2025'
    }
  ],

  // --- Onboarding milestones (role-specific templates) ---
  milestones: {
    barista: [
      { id: 'm-barista-1', title: 'Shadow a shift', order: 1, requiresSignoff: true },
      { id: 'm-barista-2', title: 'Pull your first espresso', order: 2, requiresSignoff: true },
      { id: 'm-barista-3', title: 'Complete POS training', order: 3, requiresSignoff: true }
    ],
    host: [
      { id: 'm-host-1', title: 'Shadow a shift', order: 1, requiresSignoff: true },
      { id: 'm-host-2', title: 'Learn seating system', order: 2, requiresSignoff: true }
    ],
    manager: [
      { id: 'm-mgr-1', title: 'Complete opening procedures', order: 1, requiresSignoff: false },
      { id: 'm-mgr-2', title: 'Complete closing procedures', order: 2, requiresSignoff: false }
    ]
  },

  // --- Progress (per user) ---
  progress: {
    'lili@milano.coffee': {
      locationId: 'loc-downtown',
      onboarding: {
        'm-barista-1': { completed: true, completedBy: 'manager@milano.coffee', ts: 1234567890 },
        'm-barista-2': { completed: false }
      },
      lessons: {
        'v1l1': { done: true, score: 3, total: 3, ts: 1234567900 }
      },
      finals: {}
    }
  },

  // --- Volume assignments (unchanged) ---
  assignments: {
    'vol-1': ['lili@milano.coffee', 'reza@milano.coffee'],
    'vol-2': ['lili@milano.coffee']
  },

  // --- Activity feed ---
  activity: [
    {
      who: 'Sarah Chen',
      action: 'completed milestone',
      label: 'Lili Turko: Pull your first espresso',
      kind: 'milestone',
      ts: Date.now()
    }
  ]
}
```

### Curriculum Structure (unchanged)

Defined in `content-volume-*.jsx` files, assembled in `copi-store.jsx`:

```js
window.COPI_VOL1 = {
  id: 'vol-1',
  vol: 'VOL · I',
  name: 'History of coffee',
  lessons: [...],
  finalTest: {...}
};

window.COPI_CURRICULUM = [window.COPI_VOL1, window.COPI_VOL2, window.COPI_VOL3];
```

## Key Architectural Decisions

### Why location scoping at the query level?

**Decision**: Filter by locationId in every CopiStore method that returns user data.

**Rationale**:
- Enforces security boundary - Manager at Location A cannot see Location B data
- Simple to implement correctly from the start
- When migrating to Supabase, this becomes Row-Level Security (RLS) policies
- Prevents accidental data leaks

**Trade-off**: Slight performance overhead (filtering arrays), but negligible at MVP scale (<100 staff per cafe).

### Why separate onboarding milestones from lessons?

**Decision**: Two distinct progress systems - milestones (manager-approved) and lessons (self-assessed).

**Rationale**:
- Onboarding is social (requires manager interaction) vs. learning is solo
- Milestones track real-world tasks ("shadow a shift") vs. lessons track knowledge
- Completion mechanics differ (external approval vs. quiz score)
- Product differentiator - most platforms only have one or the other

**Trade-off**: More complex data model, but matches real cafe workflows.

### Why Owner/Admin bypass location filtering?

**Decision**: Owner and Admin roles have `locationId: null` and see all locations without filtering.

**Rationale**:
- Multi-location operators need centralized visibility
- Avoids needing separate login per location
- Supports "regional manager" use case (admin role, not owner)
- Owner dashboard can filter UI by location via switcher, but backend returns all data

**Trade-off**: Owner queries return more data (all locations), but this is acceptable for the owner role.

### Why role stored on user record, not separate role table?

**Decision**: `role` is a string field directly on user object: 'owner' | 'admin' | 'manager' | 'barista' | 'host'

**Rationale**:
- At MVP scale, roles are simple and don't change frequently
- Avoids JOIN complexity in Supabase queries
- Easier to understand for developers
- Fast permission checks (just read user.role)

**Trade-off**: Harder to add granular permissions (e.g., "can edit curriculum but not billing"), but that's not an MVP requirement.

### Why cafe-centric account structure?

**Decision**: Cafe is the billing entity. All users belong to one cafe. Locations belong to one cafe.

**Rationale**:
- Matches real-world: cafe owner pays, staff work for that cafe
- Simplifies billing (one subscription per cafe, not per location or per user)
- Prevents multi-tenancy complexity (staff can't belong to multiple cafes at MVP)

**Trade-off**: Barista who works at two different cafe chains would need two separate accounts, but this edge case is acceptable at MVP.

## Migration Path to Supabase

**Current**: localStorage singleton
**Target**: Supabase PostgreSQL with RLS

### Supabase Schema (planned)

```sql
-- Cafes (master accounts)
CREATE TABLE cafes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Locations (belong to cafes)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_id UUID REFERENCES cafes(id),
  name TEXT NOT NULL,
  address TEXT
);

-- Users (staff members)
CREATE TABLE users (
  id UUID PRIMARY KEY,  -- Supabase Auth user ID
  cafe_id UUID REFERENCES cafes(id),
  location_id UUID REFERENCES locations(id),  -- NULL for owner/admin
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'barista', 'host')),
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding milestone templates
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  title TEXT NOT NULL,
  "order" INT NOT NULL,
  requires_signoff BOOLEAN DEFAULT TRUE
);

-- Onboarding progress
CREATE TABLE milestone_progress (
  user_id UUID REFERENCES users(id),
  milestone_id UUID REFERENCES milestones(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES users(id),
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, milestone_id)
);

-- Lesson progress (existing structure)
CREATE TABLE lesson_progress (
  user_id UUID REFERENCES users(id),
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INT,
  total INT,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

-- Row-Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see users at their location (or all if owner/admin)
CREATE POLICY users_select_policy ON users
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('owner', 'admin'))
    OR location_id = (SELECT location_id FROM users WHERE id = auth.uid())
  );

-- Similar RLS policies for milestone_progress, lesson_progress, etc.
```

### Migration Steps

1. **Phase 1: Add Supabase alongside localStorage** (dual-write)
   - CopiStore writes to both localStorage AND Supabase
   - Reads still from localStorage
   - Verify data consistency

2. **Phase 2: Switch reads to Supabase** (dual-write continues)
   - CopiStore reads from Supabase
   - Still writes to both (fallback safety)

3. **Phase 3: Remove localStorage** (Supabase only)
   - Remove localStorage writes
   - Delete old migration code

This gives a safe rollback path if Supabase integration has issues.
