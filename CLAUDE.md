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

### Auth wiring status (as of 2026-06-30)

The login modal and app-root user state are now backed by real Supabase auth. Key decisions:

- **`handleAuth` in `App.jsx`** tries three paths in order: (1) `supabase.auth.signInWithPassword` (real users, creates a real session), (2) hardcoded CMS team login, (3) `CopiStore.authenticate` in-memory fallback (preserves the sales/prototype roster until CopiStore data reads are migrated). It returns `{ ok, error }` so `LoginModal` can render inline errors instead of failing silently.
- **`supabase.auth.onAuthStateChange`** listener at the app root drives `user` state for real sessions. On mount, `getSession()` rehydrates any existing session and lands the user on their role's home surface. `SIGNED_OUT` clears `user`; token refreshes are no-ops (SDK-managed).
- **`hydrateSupabaseUser(authUser)`** does the join from `auth.users.id` → `public.users` row → `cafes.name`, producing the same `{ id, cafeId, locationId, email, name, role, kind, cafe }` shape the rest of the app already expects. Users tagged `authProvider: 'supabase'` skip our `copi.user` localStorage write (the Supabase SDK handles session persistence).
- **`handleLogout`** now calls `supabase.auth.signOut()` before clearing local state.
- **Demo credentials in `LoginModal`** are now literal `DEMO_CREDENTIALS` matching the seeded Supabase users; they go through real auth, not a mocked bypass. The `PROTO_ADMIN` / `PROTO_BARISTA` constants and their credential-check branches are gone.

**What still uses localStorage / in-memory data** (intentionally deferred to later sessions):
- `CopiStore` — the entire prototype roster (Milano users beyond the 3 seeded, milestones, lesson catalog, progress) still lives in memory and is read by every dashboard.
- `copi.route` — persisted so a refresh lands you on the same page. Kept.
- `copi.user` — retained ONLY for CMS team logins and CopiStore fallback logins (which have no Supabase session to hydrate from). Real Supabase users bypass this path.
- Owner signup, invite acceptance, milestone signoff, lesson progress writes — all still hit `CopiStore`, not Supabase.

**Next migration steps** (in order): ~~owner signup writes to `public.cafes` + `public.users`~~ (done — see below) → dashboard reads swap `CopiStore.getUsers()` for `supabase.from('users').select()` → invite flow through `supabase.auth.admin.inviteUserByEmail` in an edge function → progress writes to `public.onboarding_progress` + `public.lesson_progress`.

### Owner signup wiring status (as of 2026-06-30)

The full owner signup flow now writes real rows in Supabase. Sign up → cafe setup → dashboard.

- **Signup step** (`src/pages/signup-page.jsx`): `supabase.auth.signUp({ email, password, options: { data: { name } } })` creates the `auth.users` row. Google button calls `supabase.auth.signInWithOAuth({ provider: 'google' })` — surfaces a friendly "not configured" message until Google OAuth is enabled in the Supabase dashboard.
- **Cafe setup step** (`src/pages/cafe-setup-page.jsx`): calls a Postgres RPC `public.bootstrap_owner_cafe(p_cafe_name, p_owner_name, p_first_location_name, p_first_location_address)` which does **all three inserts in one transaction** (cafes → locations → public.users). This avoids the `locations_insert` RLS ordering gotcha (the caller isn't `is_owner_or_admin()` yet at insert time) and guarantees no orphaned partial state.
- **Idempotency**: the RPC checks `public.users` for the caller's `auth.uid()` first. If a row already exists, it returns the existing `cafe_id` + first `location_id` with `already_existed=true`. Safe to retry after a network drop or if the user closes the browser mid-setup and comes back.
- **`bootstrap_owner_cafe` is SECURITY DEFINER + `search_path = public, pg_temp`**. `EXECUTE` is revoked from `public`/`anon` and granted only to `authenticated`. An anon caller gets `permission denied for function bootstrap_owner_cafe` (verified).
- **After RPC returns**, `App.jsx:handleCafeSetupComplete` calls `hydrateSupabaseUser(session.user)` — same helper the login flow uses — to build the `{ id, cafeId, locationId, email, name, role, kind: 'admin', cafe, authProvider: 'supabase' }` shape and set `user`. New owner then flows into the `import-roaster` step and onward to the dashboard.
- **Error handling**: both pages have `friendlySignupError`/`friendlyBootstrapError` mapping helpers that translate Supabase error codes/messages (duplicate email, weak password, rate limit, network failure, permission denied, provider-not-enabled) into user-facing copy. Errors render inline in the existing design-system tokens (`th.danger`).

### ⚠️ Live-demo risks — read before demoing

1. **"Confirm email" MUST be OFF in the Supabase dashboard for the demo to flow smoothly.** With it ON (Supabase default), `signUp` succeeds but returns `session: null`, and the user hits a "Check your email" screen instead of landing in the dashboard. Signup won't be able to progress to cafe-setup because there's no authenticated session yet. To disable: **Dashboard → Authentication → Providers → Email → toggle "Confirm email" OFF**. Do this before every live demo unless you've already switched to a fully wired production email flow.
2. **A freshly signed-up owner sees stale Milano demo data on the dashboard.** Their `user.cafeId` is their new cafe (RLS-correct), but the dashboards still read from `CopiStore` in memory (the Milano prototype roster). This is confusing — a new "Ember & Oak" owner will see Sarah Chen, Lili Turko, etc. as if they were their own staff. **Do not go to the staff/dashboard views during a live signup demo until the CopiStore reads are migrated.** Safest demo script for now: sign up → land in the "Import your roaster" step → stop there and switch back to the seeded Milano admin login to show the working dashboard.
3. **Google SSO is not enabled.** Clicking "Continue with Google" shows a friendly "not configured yet" error. To enable: Supabase Dashboard → Authentication → Providers → Google, then paste OAuth client ID/secret from Google Cloud Console.
4. **Signup emails go to Supabase's default sender + are rate-limited (~4/hour per project on the free tier).** Configure custom SMTP before doing many demo signups back-to-back.

### Next migration step

Migrate dashboard reads so a new owner sees an empty (or newly-imported) roster, not the Milano prototype's in-memory data. Concretely: swap `CopiStore.getUsers(cafeId)` for `supabase.from('users').select().eq('cafe_id', cafeId)` in `admin-team.jsx`, `owner-dashboard.jsx`, and the staff detail views. Everything else (milestones, lessons, progress) stays on `CopiStore` for now — that's a bigger surface and belongs in its own session.

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

**Vercel is the single source of truth.** `.env` is gitignored so secrets never enter git history. On a fresh clone, pull env vars down from Vercel instead of hand-editing `.env`:

```bash
npm i -g vercel        # one-time, global
vercel link            # once per clone
vercel env pull        # writes current Vercel env into .env
```

`.env.example` in the repo lists the required variable names.

### Variables the app expects

| Name | Scope | Source | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Client | Supabase → Settings → API | Not a secret; safe in the browser bundle |
| `VITE_SUPABASE_ANON_KEY` | Client | Supabase → Settings → API | Publishable/anon key; safe in the browser bundle. RLS is what protects data |
| `ANTHROPIC_API_KEY` | **Server only** | Anthropic console | Must NOT have `VITE_` prefix — that would ship it to the client bundle |
| `VITE_USE_REAL_AI` | Client | Feature flag | `true` to hit real /api backend; unset/`false` to use simulated services |

Rule of thumb: `VITE_*` = shipped to browser, safe for public keys only. Anything without the prefix stays server-side.

## Running Locally End-to-End

1. `npm install`
2. `vercel env pull` to populate `.env` (or copy `.env.example` and fill in values manually for prototype mode)
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
