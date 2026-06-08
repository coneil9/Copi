# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Copi is a **cafe management and education platform** that digitizes the full staff journey from onboarding through advanced coffee knowledge. Cafe owners upload existing processes, and AI sets up their training environment automatically, fills gaps, and suggests improvements. Staff move through structured onboarding milestones, then into self-paced learning tracks tied to their role. Education is delivered through Duolingo-style lessons that turn Q-grade level coffee knowledge into bite-sized, gamified learning.

**Current state**: This is a functional prototype demonstrating the core learning experience (lessons, quizzes, progress tracking). The architecture is being evolved to support the full multi-location, role-based cafe management vision.

**Target market**: Small to mid-size cafe operators across North America running 1–4 locations, with architecture to scale to larger groups.

## Account Structure

**Cafe-centric model**: The cafe holds the master account. Individual staff log in as users underneath it, with permissions tied to their assigned role.

### Four User Roles

1. **Owner / Admin** - Account holder, full access across all locations (setup, staff, curriculum, billing, reporting). Only role that can add/remove staff.
2. **Manager / Shift Lead** - Scoped to a single location. Can view onboarding progress, mark milestones complete, communicate with team. Cannot access other locations, billing, or curriculum editing.
3. **Barista** - Scoped to a single location. Sees only their own onboarding milestones, learning progress, and feedback. Personal, task-focused view.
4. **Host** - Same as Barista (distinct label for role segmentation). Location-scoped.

### Location Scoping

- Every user except Owner/Admin is tied to ONE location at creation
- Owner/Admin bypass location filtering and see across all locations
- Owner dashboard includes location switcher (dropdown/tab) to filter staff and progress data
- All data queries filter by locationId except for Owner/Admin roles

## Tech Stack

- **React** 19.x (latest) - UI library
- **Vite** 6.x (latest) - Build tool and dev server
- **Supabase** 2.x (latest) - Backend (to be integrated for production multi-location support)
- **No routing library** - Custom event delegation via `copi-prototype-shell.jsx`
- **No state management library** - Global singleton pattern via `CopiStore`
- **Inline styles** - All styling via React style objects
- **localStorage** - Current data persistence (will migrate to Supabase for production)

### Fonts
- **Unna** - Display/heading serif
- **Yrsa** - Body serif
- **Lato** - Sans-serif for labels, UI

## Folder Structure

```
src/
├── App.jsx                    # Main app - 7000+ line concatenated prototype
├── main.jsx                   # Vite entry point
├── styles.css                 # Global styles and font imports (minimal)
├── lib/
│   └── supabaseClient.js      # Supabase client scaffold (to be connected)
└── prototype/                 # Extracted modules (loaded via App.jsx)
    ├── copi-store.jsx         # Global state singleton + curriculum assembly
    ├── copi-prototype-shell.jsx  # Navigation and login routing
    ├── lesson-player.jsx      # Learning experience (read → quiz → results)
    ├── content-volume-*.jsx   # Curriculum content (3 volumes)
    ├── *-dashboard.jsx        # Owner, manager, and barista dashboards
    ├── *-page.jsx             # Marketing pages (landing, pricing, about, curriculum)
    ├── *-modal.jsx            # Interactive modals
    ├── ui-atoms.jsx           # Shared utilities (PaperGrain, InkMark, ImagePlaceholder)
    └── pour-over-illustration.jsx  # Animated SVG illustration

public/
└── assets/                    # Static images
```

## Key Commands

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Supabase configuration (create `.env` in project root):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

See `.env.example` for template.

## Running Locally End-to-End

1. `npm install`
2. `npm run dev`
3. Open http://localhost:5173
4. Use demo credentials to log in:
   - **Owner**: admin@milano.coffee / copi2026 (full multi-location access)
   - **Manager**: manager@milano.coffee / copi2026 (single location access) [to be added]
   - **Barista**: lili@milano.coffee / copi2026 (personal progress view)
5. All progress persists to localStorage and survives refreshes

## Data Model (Evolving Architecture)

### Core Entities

**Locations**
```js
{
  id: 'loc-1',
  name: 'Milano Downtown',
  address: '123 Main St',
  cafeId: 'cafe-milano'
}
```

**Users** (staff members)
```js
{
  email: 'lili@milano.coffee',
  name: 'Lili Turko',
  role: 'barista' | 'host' | 'manager' | 'owner' | 'admin',
  locationId: 'loc-1',  // null for owner/admin
  joined: 'Aug 2025'
}
```

**Onboarding Milestones** (separate from lessons)
```js
{
  id: 'milestone-espresso-basics',
  title: 'Pull your first espresso',
  category: 'barista',
  order: 1,
  requiresManagerSignoff: true
}
```

**Learning Tracks** (role-specific curriculum paths)
```js
{
  id: 'track-barista',
  name: 'Barista Fundamentals',
  role: 'barista',
  volumes: ['vol-1', 'vol-2', 'vol-3']
}
```

**Progress** (per user)
```js
{
  userId: 'lili@milano.coffee',
  locationId: 'loc-1',
  onboardingMilestones: {
    'milestone-espresso-basics': {
      completed: true,
      completedBy: 'manager@milano.coffee',
      ts: 1234567890
    }
  },
  lessons: { /* existing structure */ },
  finals: { /* existing structure */ }
}
```

## Deployment

Designed for Vercel:
1. Deploy as Vite project
2. Add Supabase env vars via Vercel Project Settings
3. `npm run build` produces static assets in `dist/`

## Critical Architectural Rules

### Location Scoping is Mandatory

Every data query must respect location scoping:
- **Owner/Admin**: Bypass location filter, see all locations
- **Manager**: Filter by their assigned locationId
- **Barista/Host**: Filter by their assigned locationId, see only their own data

```js
// CORRECT
const getStaffForUser = (currentUser) => {
  if (currentUser.role === 'owner' || currentUser.role === 'admin') {
    return allStaff; // no filter
  }
  return allStaff.filter(s => s.locationId === currentUser.locationId);
};

// INCORRECT - doesn't respect location scoping
const getStaffForUser = () => allStaff;
```

### Role-Based Permissions

Four roles with distinct permissions:

| Permission | Owner/Admin | Manager | Barista/Host |
|------------|-------------|---------|--------------|
| View all locations | ✅ | ❌ | ❌ |
| Add/remove staff | ✅ | ❌ | ❌ |
| Edit curriculum | ✅ | ❌ | ❌ |
| Access billing | ✅ | ❌ | ❌ |
| Mark milestones complete | ✅ | ✅ | ❌ |
| View staff progress (location) | ✅ | ✅ | ❌ |
| View own progress | ✅ | ✅ | ✅ |
| Complete lessons | ✅ | ✅ | ✅ |

### Onboarding vs. Learning

**Onboarding milestones** are manager-signed tasks that happen first (day 1-30):
- "Shadow a shift"
- "Pull your first espresso"
- "Complete POS training"
- Require manager approval to mark complete
- Role-specific (barista milestones ≠ host milestones)

**Learning tracks** are self-paced lessons that happen after onboarding:
- Vol I: Coffee History
- Vol II: Processing Methods
- Vol III: Barista Knowledge
- Self-assessed via quizzes
- Lead to certifications

These are separate systems that both contribute to overall staff development.

## Gotchas and Never-Do's

### NEVER modify state outside CopiStore
All components must read from and write to `CopiStore`. The store is the single source of truth.

### NEVER bypass location filtering
Unless the current user is Owner/Admin, all queries must filter by locationId. This is a security boundary.

### NEVER hardcode a single cafe
The architecture must support multiple cafes (each with multiple locations). Use cafeId and locationId throughout.

### NEVER mix onboarding and learning progress
Onboarding milestones and lesson progress are separate concepts with different completion mechanics (manager signoff vs. self-assessed).

### NEVER add users without a role and locationId
Every user except Owner/Admin must have:
- `role` - one of: owner, admin, manager, barista, host
- `locationId` - which location they belong to
- Owner/Admin have `locationId: null` (they see all locations)

### The curriculum is assembled at runtime
`COPI_CURRICULUM` is built from `window.COPI_VOL1`, `window.COPI_VOL2`, `window.COPI_VOL3` in `copi-store.jsx`. Don't break this dependency chain.

### All styling is inline
There is no CSS-in-JS library, no Tailwind, no CSS modules. Everything is `style={{}}` objects. Follow this pattern.

### Color palette is consistent
Every component uses the same palette object:
```js
const p = {
  bg: '#E8DDC2',     // beige paper
  fg: '#1A1410',     // dark ink
  accent: '#3F5A3A', // moss green
  cream: '#F4EBD2',  // cream
  sun: '#C68A3D',    // ochre/gold
  cherry: '#7A2B1F', // error red
  rule: '#7A6B4E'    // separator brown
};
```

## Development Workflow for Multi-Location Features

When adding new features, follow this pattern:

1. **Add to data model in CopiStore** - Define the new entity (location, milestone, etc.)
2. **Implement location filtering** - Ensure queries respect current user's locationId
3. **Update permissions** - Check role before allowing actions
4. **Add UI in appropriate dashboard** - Owner sees switcher, Manager sees location-scoped, Barista sees own
5. **Test with multiple roles** - Verify Owner sees all, Manager sees location, Barista sees self

## Owner Dashboard Location Switcher

The location switcher is a critical UX element:
- **Position**: Top of owner dashboard (dropdown or tab bar)
- **Default**: "All Locations" (aggregated view)
- **Options**: Each location + "All Locations"
- **Behavior**: Filters all staff lists, progress metrics, milestone approvals to selected location
- **Persistence**: Remember selection in component state (or localStorage for convenience)

This gives owners full visibility without separate logins and keeps permission logic clean.
