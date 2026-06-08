# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Copi is a **cafe management and education platform** that digitizes the full staff journey from onboarding through advanced coffee knowledge. Cafe owners upload existing processes, and AI sets up their training environment automatically, fills gaps, and suggests improvements. Staff move through structured onboarding milestones, then into self-paced learning tracks tied to their role. Education is delivered through Duolingo-style lessons that turn Q-grade level coffee knowledge into bite-sized, gamified learning.

**Current state**: This repository contains the **application** (logged-in experience). The marketing site is a separate codebase built in Next.js.

**Target market**: Small to mid-size cafe operators across North America running 1–4 locations, with architecture to scale to larger groups.

## Project Structure: Two Separate Surfaces

### Marketing Site (Separate Codebase)
- **Technology**: Next.js (static or server-rendered)
- **Domain**: copi.com
- **Purpose**: Public website with landing page, pricing, about, curriculum preview
- **Hosts**: Signup page (creates account), waitlist capture
- **Deployment**: Vercel (separate deployment from app)

### Application (This Repository)
- **Technology**: Vite + React SPA
- **Domain**: app.copi.com
- **Purpose**: Logged-in experience for owners, managers, baristas
- **Contains**: Dashboards, lesson player, onboarding milestones, progress tracking
- **Deployment**: Vercel (separate deployment from marketing site)

**Developer note**: Treat these as two separate builds. They can share a domain with routing (copi.com vs app.copi.com) but have independent codebases. This repository is the **app only**.

## Account Structure

**Cafe-centric model**: The cafe holds the master account. Individual staff log in as users underneath it, with permissions tied to their assigned role.

### Three-Level Hierarchy

1. **Cafe Account** (top level)
   - Owns subscription, billing, all data
   - Created during owner signup
   - Example: "Milano Coffee"

2. **Locations** (under cafe)
   - Cafe has 1-N locations
   - Each location has its own staff roster and progress data
   - Example: "Milano Downtown", "Milano Westside"

3. **Users** (under location)
   - Every user except Owner/Admin is assigned to ONE location at creation
   - Owner/Admin have `locationId: null` (see all locations)
   - Example: Lili Turko (barista at Downtown location)

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

## Signup and Authentication

### Signup Flow (Cafe Owners)

1. Owner arrives at signup page from marketing site (copi.com/signup)
2. Creates account via:
   - **Email + Password** (standard signup)
   - **Google SSO** (OAuth via Supabase Auth)
3. After authenticating, prompted to set up cafe profile:
   - Cafe name
   - Number of locations (starts with 1, can add more later)
   - Owner's role (auto-set to "owner")
4. Master cafe account is created in database
5. Owner redirected to app.copi.com (app dashboard)

**Waitlist users**: If they signed up from waitlist, email is pre-filled and flow skips email capture.

### Adding Staff

Owners add staff via two methods:

**Method 1: Manual Entry**
- Owner enters one staff member at a time:
  - Name
  - Email
  - Role (manager, barista, host)
  - Location assignment (dropdown of cafe's locations)
- Triggers invite email immediately

**Method 2: CSV Upload**
- Owner uploads CSV file with columns: name, email, role, location
- Platform provides downloadable CSV template
- Bulk processing: validates rows, creates user records, triggers invite emails
- Shows success/error summary after upload

### Staff Invite Flow

1. Staff member added → receives email invite with unique link
2. Link format: `app.copi.com/invite/{token}`
3. Link is **time-limited**: expires after 72 hours
4. Clicking link prompts staff to:
   - Set their own password
   - Confirm their details (name, email, role, location)
5. After password set → lands directly in their staff dashboard
6. If link expires → owner can resend invite from staff management panel

**Invite token storage**:
- Token stored in database with expiry timestamp
- Invalidated on first use
- One-time use only

### Authentication Methods

**Owners**:
- Email + Password (via Supabase Auth)
- Google SSO (via Supabase Auth OAuth)

**Staff** (MVP):
- Email + Password only
- (Google SSO can be added post-MVP)

**Password Reset**:
- Standard email reset flow for all users
- "Forgot password" → email with reset link → set new password
- Handled by Supabase Auth

### Supabase Auth Integration

**Why Supabase Auth**:
- Handles password hashing automatically
- Session management built-in
- SSO integration (Google, GitHub, etc.) out of the box
- Email delivery for invites and resets
- JWT tokens for API authentication

**Database relationships**:
- `auth.users` table (Supabase Auth managed)
- `public.users` table (application data) with foreign key to `auth.users.id`
- Account, location, and user records in main app database
- Invite tokens stored in `public.invites` table with expiry

## Tech Stack

- **React** 19.x (latest) - UI library
- **Vite** 6.x (latest) - Build tool and dev server
- **Supabase** 2.x (latest) - Backend (Auth + Database + Storage)
- **Supabase Auth** - Authentication (email/password, Google SSO, password reset)
- **PostgreSQL** (via Supabase) - Database with Row-Level Security (RLS)
- **No routing library** - Custom event delegation via `copi-prototype-shell.jsx`
- **No state management library** - Global singleton pattern via `CopiStore`
- **Inline styles** - All styling via React style objects
- **localStorage** - Current prototype persistence (will migrate to Supabase)

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
│   └── supabaseClient.js      # Supabase client (Auth + Database)
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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `.env.example` for template.

## Running Locally End-to-End

1. `npm install`
2. Create `.env` with Supabase credentials (or use localStorage mode for prototype)
3. `npm run dev`
4. Open http://localhost:5173
5. **With Supabase**: Sign up creates real account, invites send real emails
6. **Without Supabase (prototype)**: Use demo credentials:
   - **Owner**: admin@milano.coffee / copi2026 (full multi-location access)
   - **Manager**: manager@milano.coffee / copi2026 (single location access) [to be added]
   - **Barista**: lili@milano.coffee / copi2026 (personal progress view)
7. All progress persists to Supabase or localStorage

## Data Model (Evolving Architecture)

### Core Entities

**Cafes**
```js
{
  id: 'cafe-uuid',
  name: 'Milano Coffee',
  ownerId: 'user-uuid',  // Reference to auth.users
  createdAt: '2025-06-01'
}
```

**Locations**
```js
{
  id: 'loc-uuid',
  cafeId: 'cafe-uuid',
  name: 'Milano Downtown',
  address: '123 Main St',
  createdAt: '2025-06-01'
}
```

**Users** (staff members)
```js
{
  id: 'user-uuid',  // Matches auth.users.id
  cafeId: 'cafe-uuid',
  locationId: 'loc-uuid',  // null for owner/admin
  email: 'lili@milano.coffee',
  name: 'Lili Turko',
  role: 'barista' | 'host' | 'manager' | 'owner' | 'admin',
  joined: 'Aug 2025'
}
```

**Invites** (for staff onboarding)
```js
{
  id: 'invite-uuid',
  cafeId: 'cafe-uuid',
  locationId: 'loc-uuid',
  email: 'newstaff@milano.coffee',
  role: 'barista',
  token: 'unique-token-string',
  expiresAt: '2025-06-10T12:00:00Z',  // 72 hours from creation
  usedAt: null,  // null until used
  createdBy: 'user-uuid'
}
```

**Onboarding Milestones** (separate from lessons)
```js
{
  id: 'milestone-uuid',
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
  userId: 'user-uuid',
  locationId: 'loc-uuid',
  onboardingMilestones: {
    'milestone-uuid': {
      completed: true,
      completedBy: 'manager-uuid',
      note: 'Great first pull!',
      completedAt: '2025-06-05T14:30:00Z'
    }
  },
  lessons: { /* existing structure */ },
  finals: { /* existing structure */ }
}
```

## Deployment

### Application (This Repository)
- **Platform**: Vercel
- **Domain**: app.copi.com
- **Build**: `npm run build` → static SPA in `dist/`
- **Environment**: Add Supabase env vars via Vercel Project Settings

### Marketing Site (Separate Repository)
- **Platform**: Vercel
- **Domain**: copi.com
- **Build**: Next.js static export or SSR
- **Routing**: Signup page redirects to app.copi.com after account creation

## Critical Architectural Rules

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

### NEVER skip invite flow for staff
Staff must be invited with time-limited token. They cannot "sign up" directly - only owners can create cafe accounts.

### NEVER store passwords in application database
Supabase Auth handles all password hashing and storage in `auth.users` table. Application database only stores user metadata.

### NEVER send invite emails from application code
Use Supabase Auth email templates for invites. Configure templates in Supabase dashboard.

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

## CSV Upload Format for Staff Import

When implementing CSV upload, use this format:

```csv
name,email,role,location
Lili Turko,lili@milano.coffee,barista,Downtown
Jules Patel,jules@milano.coffee,barista,Downtown
Sarah Chen,sarah@milano.coffee,manager,Westside
```

**Validation rules**:
- Email must be valid format
- Role must be one of: manager, barista, host
- Location must match existing location name for the cafe
- Duplicate emails rejected (one user per email)

**Error handling**:
- Show which rows failed validation
- Allow owner to fix and re-upload
- Don't create any users if ANY row fails (atomic operation)
