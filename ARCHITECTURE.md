# ARCHITECTURE.md

## High-Level System Design

Copi is a **multi-location cafe management and education platform** with role-based permissions and location scoping. The architecture supports:

- **Account hierarchy**: Cafe → Locations → Users
- **Four user roles**: Owner/Admin (multi-location), Manager (single location), Barista/Host (single location, personal view)
- **Dual education systems**: Onboarding milestones (manager-approved) + Learning tracks (self-paced lessons)
- **Location filtering**: All data queries respect user's locationId except for Owner/Admin
- **Separate surfaces**: Marketing site (Next.js) + Application (Vite React) are independent codebases

**Current state**: localStorage-based prototype evolving toward Supabase backend with multi-tenant support.

## Two Separate Surfaces

### Marketing Site (copi.com)
- **Technology**: Next.js (static export or SSR)
- **Repository**: Separate codebase from application
- **Purpose**: Public website, signup page, waitlist
- **Deployment**: Vercel (separate deployment)
- **Routing**: After signup, redirects to app.copi.com

### Application (app.copi.com)
- **Technology**: Vite + React SPA
- **Repository**: This codebase
- **Purpose**: Logged-in experience (dashboards, lessons, progress)
- **Deployment**: Vercel (separate deployment)
- **Authentication**: Supabase Auth with session management

**Key principle**: Treat these as two independent projects. They share a Supabase backend but have separate builds and deployments.

### Data Flow

```
User Interaction (complete lesson, mark milestone, invite staff)
         ↓
Component calls CopiStore method (with current user context)
         ↓
CopiStore checks permissions (role + locationId)
         ↓
CopiStore calls Supabase (queries, mutations)
         ↓
Supabase enforces Row-Level Security (RLS)
         ↓
Response returned to CopiStore
         ↓
CopiStore notifies all subscribed components via emit()
         ↓
Components re-render via useCopiStore() hook
```

### Component Tree (Simplified)

```
CopiPrototype (App.jsx - root component)
├── SignupFlow (cafe profile setup after auth)
├── InviteAcceptFlow (staff password setup)
├── AddTeamModal (manual staff entry or CSV upload)
├── LessonPlayer (lesson experience)
├── AssignModal (assign curriculum to staff)
└── Current view (role-based routing):
    ├── OwnerDashboard (multi-location view with location switcher)
    │   ├── Location switcher (dropdown/tabs)
    │   ├── Analytics (aggregated or filtered by location)
    │   ├── Curriculum management
    │   ├── Team roster (all locations or filtered)
    │   ├── Staff management (invite, CSV upload, resend invites)
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

## Signup and Authentication Architecture

### Owner Signup Flow

**Step 1: Marketing site signup** (copi.com/signup)
```
1. Owner enters email (or uses Google SSO)
2. Supabase Auth creates account in auth.users
3. Marketing site redirects to app.copi.com with session token
```

**Step 2: Cafe profile setup** (app.copi.com/setup)
```
1. App checks if user has cafe record
2. If not, shows cafe profile form:
   - Cafe name
   - Number of locations (default: 1)
   - First location name and address
3. Submit creates:
   - Cafe record (with ownerId = current user)
   - Location record (first location)
   - User record in public.users (role: owner, locationId: null)
4. Redirect to owner dashboard
```

**State transitions**:
- `auth.users` created → `public.cafes` created → `public.locations` created → `public.users` created → dashboard

### Staff Invite Flow

**Step 1: Owner invites staff**
```
Owner Dashboard → Add Staff → (Manual or CSV)
         ↓
Creates invite record in public.invites
         ↓
Supabase triggers email via Auth email templates
         ↓
Email sent with link: app.copi.com/invite/{token}
```

**Step 2: Staff accepts invite**
```
Staff clicks link → App validates token:
  - Token exists?
  - Not expired? (< 72 hours old)
  - Not already used?
         ↓
Shows password setup form
         ↓
Staff sets password → Supabase Auth creates auth.users
         ↓
Creates public.users record (copies data from invite)
         ↓
Marks invite as used (usedAt = now)
         ↓
Redirects to staff dashboard
```

**Security**:
- Token is cryptographically random (UUID or crypto.randomBytes)
- One-time use (usedAt prevents reuse)
- Time-limited (expiresAt enforced at validation)
- Invite email stored in both invites table and later in users table (ensures uniqueness)

### CSV Upload Flow

```
Owner uploads CSV file
         ↓
Frontend parses CSV rows
         ↓
Validates each row:
  - Email format valid?
  - Role is manager|barista|host?
  - Location exists in cafe?
  - Email not already in use?
         ↓
If ANY row fails → show errors, don't create anything (atomic)
         ↓
If all valid → batch create invite records
         ↓
Trigger batch email send via Supabase
         ↓
Show success summary: "10 invites sent"
```

**CSV format**:
```csv
name,email,role,location
Lili Turko,lili@milano.coffee,barista,Downtown
Jules Patel,jules@milano.coffee,barista,Downtown
Sarah Chen,sarah@milano.coffee,manager,Westside
```

### Authentication Methods

| User Type | Email/Password | Google SSO | Password Reset |
|-----------|----------------|------------|----------------|
| Owner | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ |
| Manager | ✅ | ❌ (MVP) | ✅ |
| Barista | ✅ | ❌ (MVP) | ✅ |
| Host | ✅ | ❌ (MVP) | ✅ |

**Post-MVP**: Add Google SSO for all roles.

## Account and Permission Architecture

### Account Hierarchy

```
Cafe (master account)
  ├── cafeId: 'cafe-uuid'
  ├── name: 'Milano Coffee'
  ├── ownerId: 'user-uuid' (FK to auth.users)
  ├── billing info
  └── Locations[]
        ├── Location 1
        │   ├── locationId: 'loc-uuid'
        │   ├── name: 'Milano Downtown'
        │   ├── address: '123 Main St'
        │   └── Users[]
        │       ├── Manager (locationId: 'loc-uuid')
        │       ├── Barista 1 (locationId: 'loc-uuid')
        │       ├── Barista 2 (locationId: 'loc-uuid')
        │       └── Host (locationId: 'loc-uuid')
        └── Location 2
            ├── locationId: 'loc-uuid-2'
            ├── name: 'Milano Westside'
            └── Users[]
                ├── Manager (locationId: 'loc-uuid-2')
                └── Barista 3 (locationId: 'loc-uuid-2')
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
| Invite staff (manual or CSV) | ✅ | ❌ | ❌ | ❌ |
| Resend invite | ✅ | ❌ | ❌ | ❌ |
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

### Supabase Auth Integration

**Supabase Auth handles**:
- Password hashing (bcrypt)
- Session management (JWT tokens)
- Email delivery (invites, password resets)
- OAuth providers (Google, GitHub, etc.)
- Token refresh

**Application responsibilities**:
- Create cafe/location/user records after auth
- Check if user has completed cafe setup
- Validate invite tokens before password set
- Enforce role-based UI routing

**Session flow**:
```
1. User logs in → Supabase Auth returns JWT
2. JWT stored in localStorage (via Supabase client)
3. Every API request includes JWT in Authorization header
4. Supabase validates JWT and sets auth.uid() for RLS
5. RLS policies enforce location scoping
```

### State Management Pattern

**Global singleton** - `CopiStore` (defined in `copi-store.jsx`):

```js
const CopiStore = (function () {
  const supabase = window.supabase;
  const subs = new Set();

  function emit() {
    subs.forEach(fn => fn()); // trigger re-renders
  }

  return {
    // --- Authentication ---
    async signup(email, password),
    async signupWithGoogle(),
    async login(email, password),
    async logout(),
    async resetPassword(email),
    getCurrentUser(),

    // --- Cafe setup ---
    async createCafe(name, ownerId),
    async createLocation(cafeId, name, address),
    getCafe(cafeId),

    // --- Location management ---
    async getLocations(currentUser),
    async addLocation(cafeId, name, address),

    // --- Staff management ---
    async inviteStaff(cafeId, locationId, name, email, role),
    async inviteStaffBulk(cafeId, csvRows),
    async validateInviteToken(token),
    async acceptInvite(token, password),
    async resendInvite(inviteId),
    getStaff(currentUser, locationId),

    // --- Onboarding milestones ---
    getMilestones(role),
    getMilestoneProgress(email),
    async completeMilestone(email, milestoneId, completedBy, note),

    // --- Learning (existing) ---
    isAssigned(email, volId),
    lessonStatus(email, volId, idx),
    async completeLesson(email, lessonId, score, total),
    async completeFinal(email, volId, score, total),

    // --- Permissions ---
    canViewStaff(currentUser, targetUser),
    canMarkMilestone(currentUser, targetUser),
    canInviteStaff(currentUser),

    // --- React integration ---
    subscribe(fn),
  };
})();
```

### Routing Pattern

**No React Router** - event delegation via `copi-prototype-shell.jsx`:

The shell component renders the appropriate view based on logged-in user state:

```js
// Routing logic
if (!currentUser) {
  return <LoginPage />;
}

if (!currentUser.cafeId) {
  // Owner just signed up, needs to set up cafe
  return <CafeSetupFlow />;
}

if (inviteToken) {
  // Staff accepting invite
  return <InviteAcceptFlow token={inviteToken} />;
}

// Role-based dashboard routing
switch (currentUser.role) {
  case 'owner':
  case 'admin':
    return <OwnerDashboard user={currentUser} />;
  case 'manager':
    return <ManagerDashboard user={currentUser} />;
  case 'barista':
  case 'host':
    return <BaristaDashboard user={currentUser} />;
}
```

## Data Model

### State Object Structure (Supabase PostgreSQL)

### Database Schema

**auth.users** (Supabase Auth managed)
```sql
-- Managed by Supabase Auth
-- Contains: id (UUID), email, encrypted_password, created_at, etc.
```

**public.cafes**
```sql
CREATE TABLE cafes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy: Users can only see their own cafe
CREATE POLICY cafes_select_policy ON cafes
  FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT cafe_id FROM users WHERE id = auth.uid())
  );
```

**public.locations**
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy: Users can only see locations from their cafe
CREATE POLICY locations_select_policy ON locations
  FOR SELECT
  USING (
    cafe_id IN (SELECT id FROM cafes WHERE owner_id = auth.uid())
    OR cafe_id IN (SELECT cafe_id FROM users WHERE id = auth.uid())
  );
```

**public.users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations(id),  -- NULL for owner/admin
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'barista', 'host')),
  joined_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy: Users see themselves + their cafe owner sees everyone
CREATE POLICY users_select_policy ON users
  FOR SELECT
  USING (
    id = auth.uid()  -- See yourself
    OR cafe_id IN (SELECT id FROM cafes WHERE owner_id = auth.uid())  -- Owner sees all
    OR location_id = (SELECT location_id FROM users WHERE id = auth.uid())  -- Same location
  );
```

**public.invites**
```sql
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations(id) NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'barista', 'host')),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Constraint: can't have multiple pending invites for same email
  UNIQUE(cafe_id, email) WHERE used_at IS NULL
);

-- RLS Policy: Only cafe owner can see invites
CREATE POLICY invites_select_policy ON invites
  FOR SELECT
  USING (cafe_id IN (SELECT id FROM cafes WHERE owner_id = auth.uid()));

-- RLS Policy: Only cafe owner can create invites
CREATE POLICY invites_insert_policy ON invites
  FOR INSERT
  WITH CHECK (cafe_id IN (SELECT id FROM cafes WHERE owner_id = auth.uid()));
```

**public.milestones**
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('manager', 'barista', 'host')),
  title TEXT NOT NULL,
  "order" INT NOT NULL,
  requires_signoff BOOLEAN DEFAULT TRUE
);
```

**public.milestone_progress**
```sql
CREATE TABLE milestone_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES users(id),
  note TEXT,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, milestone_id)
);

-- RLS Policy: See own progress + manager sees location's progress
CREATE POLICY milestone_progress_select_policy ON milestone_progress
  FOR SELECT
  USING (
    user_id = auth.uid()  -- See own progress
    OR user_id IN (  -- Manager sees their location's staff
      SELECT id FROM users
      WHERE location_id = (SELECT location_id FROM users WHERE id = auth.uid())
    )
    OR EXISTS (  -- Owner sees all
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

**public.lesson_progress**
```sql
CREATE TABLE lesson_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INT,
  total INT,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

-- Similar RLS policy to milestone_progress
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

### Why separate marketing site from app?

**Decision**: Two independent codebases (Next.js for marketing, Vite React for app).

**Rationale**:
- Different optimization goals (SEO/static for marketing, SPA for app)
- Marketing site can iterate independently without touching app logic
- Simpler deploys (marketing changes don't require app rebuild)
- Signup page on marketing site → redirects to app after account creation
- Clear separation of public vs. authenticated surfaces

**Trade-off**: Can't share React components between sites, but they have different UX paradigms anyway.

### Why Supabase Auth instead of custom auth?

**Decision**: Use Supabase Auth for all authentication, email delivery, and session management.

**Rationale**:
- Password hashing handled securely (bcrypt)
- Session tokens (JWT) with automatic refresh
- Email templates for invites and password resets
- OAuth providers (Google SSO) out of the box
- Battle-tested, audited implementation
- Saves ~2 weeks of development time

**Trade-off**: Vendor lock-in to Supabase, but migration path exists (export users, rebuild auth).

### Why time-limited invite tokens (72 hours)?

**Decision**: Invite links expire after 72 hours.

**Rationale**:
- Security: Prevents old invite links from being used maliciously
- UX: Forces timely onboarding (owner can resend if needed)
- Cleanup: Expired invites can be auto-archived
- Industry standard (most SaaS products use 24-72 hour invite expiry)

**Trade-off**: Adds complexity (need UI to resend invites), but improves security.

### Why atomic CSV validation?

**Decision**: If ANY row in CSV fails validation, don't create ANY invites.

**Rationale**:
- Prevents partial import ("some staff got invited, others didn't" is confusing)
- Owner can fix errors in CSV and re-upload
- Clear success/failure state
- Easier to troubleshoot

**Trade-off**: Owner must fix all errors before any invites send, but this forces data quality.

### Why separate auth.users from public.users?

**Decision**: Supabase Auth owns `auth.users`, application owns `public.users` with FK relationship.

**Rationale**:
- Auth table contains sensitive data (password hashes) - kept in secure schema
- App table contains business data (cafe, location, role) - kept in public schema
- Supabase Auth can manage its own migrations without touching app data
- FK relationship ensures referential integrity

**Trade-off**: Two tables instead of one, but separation of concerns is worth it.

## Migration Path to Supabase

**Current**: localStorage singleton
**Target**: Supabase PostgreSQL + Auth

### Phase 1: Set up Supabase project
- Create Supabase project
- Define schema (tables above)
- Configure Row-Level Security policies
- Set up Auth email templates

### Phase 2: Implement signup flow
- Owner signup via Supabase Auth
- Cafe profile setup (creates cafe + location + user records)
- Test end-to-end signup on staging

### Phase 3: Implement invite flow
- Manual staff invite (creates invite record + sends email)
- Invite accept (validates token, creates user)
- CSV bulk upload

### Phase 4: Migrate existing features
- Lesson completion → lesson_progress table
- Milestone completion → milestone_progress table
- Team roster → users table
- Location switcher → queries locations table

### Phase 5: Deploy
- Migrate localStorage prototype users to Supabase (optional)
- Deploy to production (app.copi.com)
- Monitor for errors
