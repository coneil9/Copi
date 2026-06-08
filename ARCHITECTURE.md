# ARCHITECTURE.md

## High-Level System Design

Copi is a **single-page application** with no backend - all data lives in the browser's localStorage. The architecture is a **monolithic React app** with a global state singleton pattern.

### Data Flow

```
User Interaction (click lesson, submit quiz, assign volume)
         ↓
Component calls CopiStore method (e.g., store.completeLesson())
         ↓
CopiStore updates internal state object
         ↓
CopiStore persists to localStorage (key: copi.progress.v3)
         ↓
CopiStore notifies all subscribed components via emit()
         ↓
Components re-render via useCopiStore() hook
```

### Component Tree (Simplified)

```
CopiPrototype (App.jsx - root component)
├── TrialModal (signup flow - not yet functional)
├── AddTeamModal (invite teammate)
├── LessonPlayer (lesson experience)
├── AssignModal (assign volume to baristas)
└── Current view (one of:)
    ├── LandingPage (marketing)
    ├── AboutPage (marketing)
    ├── PricingPage (marketing)
    ├── CurriculumPage (marketing - shows all 3 volumes)
    ├── RoasterDashboard (admin home - team overview)
    │   └── Admin tabs: Analytics, Curriculum, Team, Settings
    └── BaristaDashboard ("Today" view - next lesson)
        └── Barista tabs: Library, Profile
```

## Frontend Architecture

### No Real Frontend/Backend Split

There is no API. Supabase client exists at `src/lib/supabaseClient.js` but is not connected. All reads/writes go directly to localStorage.

When Supabase integration happens (future work), the pattern would be:
- CopiStore methods call Supabase instead of localStorage
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
    // Read methods (pure, no side effects)
    isAssigned(email, volId),
    lessonStatus(email, volId, idx),
    volumeStats(email, volId),
    currentLesson(email),

    // Write methods (mutate state + emit)
    assignVolume(volId, emails),
    completeLesson(email, lessonId, score, total),
    completeFinal(email, volId, score, total),

    // React integration
    subscribe(fn),
  };
})();
```

**React hook** - `useCopiStore()`:
```js
function useCopiStore() {
  const [, force] = React.useState(0);
  React.useEffect(() => CopiStore.subscribe(() => force(n => n + 1)), []);
  return CopiStore;
}
```

Components call the hook once, then read from the store:
```js
const store = useCopiStore();
const progress = store.overallPct(email);
```

### Routing Pattern

**No React Router** - event delegation via `copi-prototype-shell.jsx`:

The shell component (`CopiPrototypeShell`) renders the landing page and intercepts clicks:
- Nav links ("Curriculum", "Pricing", "About") → set view state
- "Try Copi free" button → open trial modal
- Login form submit → check credentials, route to dashboard based on role

State is a simple string: `'landing' | 'curriculum' | 'pricing' | 'about' | 'admin' | 'barista'`

No URLs change. No browser history. This is intentional for the prototype.

## Key Third-Party Services

### Supabase (planned, not integrated)

- **Client**: `@supabase/supabase-js` v2.x
- **Location**: `src/lib/supabaseClient.js`
- **Current status**: Scaffolded but returns `null` if env vars are missing
- **Planned use**: Replace localStorage with Postgres tables for teams, users, progress, assignments

**Future schema** (not implemented):
- `profiles` - user accounts
- `teams` - cafe organizations
- `assignments` - volume assignments to users
- `progress` - lesson completion records
- `quiz_results` - quiz scores

## Data Model (localStorage)

### State Object Structure

Stored at `localStorage['copi.progress.v3']`:

```js
{
  seeded: true,           // whether seed data has been loaded
  assignments: {          // volume assignments
    'vol-1': ['linda@milano.coffee', 'reza@milano.coffee', ...],
    'vol-2': ['linda@milano.coffee', ...],
    'vol-3': []
  },
  users: {                // per-user progress
    'linda@milano.coffee': {
      lessons: {
        'v1l1': { done: true, score: 3, total: 3, ts: 1234567890 },
        'v1l2': { done: true, score: 2, total: 3, ts: 1234567900 },
        ...
      },
      finals: {
        'vol-1': { passed: true, score: 6, total: 6, ts: 1234568000 }
      }
    },
    ...
  },
  activity: [             // recent activity feed (max 30 items)
    { who: 'Reza Mehta', action: 'completed', label: 'II-05 Anaerobic', kind: 'complete', ts: ... },
    ...
  ]
}
```

### Curriculum Structure

Defined in `content-volume-*.jsx` files, assembled in `copi-store.jsx`:

```js
window.COPI_VOL1 = {
  id: 'vol-1',
  vol: 'VOL · I',
  num: '01',
  name: 'History of coffee',
  tag: 'Origins, trade routes, lineage.',
  cert: 'Foundations',
  blurb: '...',
  lessons: [
    {
      id: 'v1l1',
      num: '01',
      title: 'Ethiopia, the cradle',
      minutes: 9,
      read: ['paragraph 1', 'paragraph 2', ...],
      quiz: [
        { q: 'question text', options: ['A', 'B', 'C', 'D'], answer: 2, why: 'explanation' },
        ...
      ]
    },
    ...
  ],
  finalTest: {
    title: 'Foundations final',
    passMark: 0.7,  // 70% to pass
    quiz: [...]     // same format as lesson quiz
  }
};

window.COPI_CURRICULUM = [window.COPI_VOL1, window.COPI_VOL2, window.COPI_VOL3];
```

### Team Roster

Hardcoded in `copi-store.jsx`:

```js
const COPI_TEAM = [
  { name: 'Linda Turko', email: 'linda@milano.coffee', role: 'Lead barista', joined: 'Mar 2025' },
  { name: 'Reza Mehta',  email: 'reza@milano.coffee',  role: 'Lead barista', joined: 'May 2025' },
  { name: 'Pia Olsen',   email: 'pia@milano.coffee',   role: 'Barista',      joined: 'Sep 2025' },
  { name: 'Lili Turko',  email: 'lili@milano.coffee',  role: 'Barista',      joined: 'Aug 2025' },
  { name: 'Jules Patel', email: 'jules@milano.coffee', role: 'Barista',      joined: 'Jul 2025' },
  { name: 'Devi Shah',   email: 'devi@milano.coffee',  role: 'New hire',     joined: 'Oct 2025' },
];
```

All team surfaces (admin dashboard, analytics, team page) read from this array.

## Architectural Decisions

### Why a global singleton instead of Context or Redux?

**Decision**: Use a vanilla JS singleton exposed via `window.CopiStore` with a thin React hook.

**Rationale**:
- Prototype originally had no build step - everything was global
- Porting to Vite while preserving original structure
- Avoids Context re-render cascades
- Simple mental model: "one store, one source of truth"
- Easy to debug: `window.CopiStore.raw()` in console shows full state

**Trade-off**: Not idiomatic React, but matches the prototype's architecture.

### Why no routing library?

**Decision**: Event delegation instead of React Router.

**Rationale**:
- Original prototype was a single HTML file with modal overlays
- Adding React Router would require restructuring the entire app
- Navigation is simple: 6 views, no nested routes, no URL params
- Preserves the original UX (no URL changes)

**Trade-off**: Can't deep-link to specific views (acceptable for prototype).

### Why inline styles instead of CSS?

**Decision**: All styling via React `style={{}}` objects.

**Rationale**:
- Original prototype had all styles inline
- Color palette is tightly controlled (same object in every component)
- No cascading issues, no naming conflicts
- Component styles are colocated with markup

**Trade-off**: No media queries, repetitive palette definitions (but palette is small and consistent).

### Why localStorage instead of Supabase now?

**Decision**: Defer Supabase integration until post-prototype.

**Rationale**:
- Demo needs to work instantly without backend setup
- Progress persisting across refreshes is enough for prototype fidelity
- Supabase client is scaffolded and ready for future work

**Trade-off**: Multi-device sync not possible, but not required for demo.

### Why seed data on first load?

**Decision**: `seedState()` in `copi-store.jsx` creates believable baseline progress for 6 baristas.

**Rationale**:
- Demo needs to show a working team, not an empty state
- Visitors should see realistic progress, recent activity, varied completion
- Seeded data makes admin features (analytics, curriculum, team) immediately understandable

**Pattern**:
- Vol I and Vol II pre-assigned to everyone
- Vol III unassigned (so demo can assign it and watch completion)
- Varied progress: some baristas ahead, some behind
- Recent activity in last 2–30 hours

This makes the prototype feel lived-in from first load.
