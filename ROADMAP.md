# ROADMAP.md

## Current State of the Project

### What Is Built and Working

**Core learning experience**:
- ✅ Lesson Player with 3-phase flow (read → quiz → results)
- ✅ 22 lessons across 3 curriculum volumes (Vol I: History, Vol II: Processing, Vol III: Barista)
- ✅ Multiple-choice quizzes with immediate feedback
- ✅ Final tests with 70% passing requirement
- ✅ Progress tracking and lesson unlocking logic
- ✅ Certification badges (Foundations, Bar certified)

**Admin features**:
- ✅ Roaster dashboard with team overview
- ✅ Analytics page (team completion %, lessons this week, quiz scores)
- ✅ Curriculum page (assign volumes to specific baristas)
- ✅ Team page (roster with progress per person)
- ✅ Settings page (cafe info, placeholder for integrations)
- ✅ Volume assignment modal
- ✅ Activity feed (recent completions and assignments)

**Barista features**:
- ✅ "Today" dashboard with next lesson card
- ✅ Library view (all assigned volumes and lessons)
- ✅ Profile view (badges, progress history)
- ✅ Barista detail modal (deep dive into one person's progress)

**Marketing site**:
- ✅ Landing page with value prop and CTA
- ✅ Curriculum page (full volume and lesson list)
- ✅ Pricing page (3 tiers: Trial, Studio, Roastery)
- ✅ About page (product story, team)

**Data & state**:
- ✅ Global state singleton (CopiStore)
- ✅ localStorage persistence (survives refresh)
- ✅ Seeded demo data (6 baristas with realistic progress)
- ✅ Hardcoded credentials for admin and barista login

**Infrastructure**:
- ✅ Vite dev server and build pipeline
- ✅ Deployment-ready for Vercel
- ✅ Supabase client scaffold (not connected)

### What Is NOT Built

**Authentication**:
- ❌ Real user accounts (currently hardcoded credentials)
- ❌ Signup flow (trial modal opens but doesn't create accounts)
- ❌ Password reset, email verification
- ❌ Multi-cafe support (only "Milano" cafe exists)

**Backend integration**:
- ❌ Supabase database (tables not created)
- ❌ API calls (everything is localStorage)
- ❌ Multi-device sync
- ❌ Team invites via email (modal exists but doesn't send emails)

**Content management**:
- ❌ Admin UI to add/edit lessons (lessons are hardcoded in JSX)
- ❌ WYSIWYG editor for lesson content
- ❌ Upload images/videos to lessons
- ❌ Lesson versioning

**Advanced features**:
- ❌ Reminders/notifications (no email, no push)
- ❌ Team chat or notes
- ❌ Export progress reports (PDF, CSV)
- ❌ Integration with POS systems
- ❌ Mobile apps (web only)

**Testing & quality**:
- ❌ Unit tests, integration tests, E2E tests (no test suite)
- ❌ Accessibility audit (no ARIA labels, no screen reader testing)
- ❌ Performance benchmarks
- ❌ Error boundaries (app crashes on unhandled errors)

## What Is Actively Being Worked On

**Currently**: Nothing - this is a **completed prototype** as of the last commit.

The prototype successfully demonstrates:
- Core learning loop (lesson → quiz → certification)
- Admin management (assign, track, analyze)
- Two-sided product (admin view vs barista view)
- Full curriculum (22 lessons, 3 volumes)

## What Is Planned Next

### Phase 1: Backend Integration (Q2 2026)

**Goal**: Replace localStorage with Supabase so teams can use this in production.

**Tasks**:
1. Create Supabase schema:
   - `organizations` (cafes)
   - `profiles` (users with role: admin | barista)
   - `assignments` (volume assignments)
   - `progress` (lesson completion records)
   - `quiz_attempts` (detailed quiz history)
2. Implement signup flow:
   - Trial signup creates organization + first admin user
   - Email verification via Supabase Auth
3. Migrate CopiStore methods to Supabase:
   - `assignVolume()` → insert into `assignments` table
   - `completeLesson()` → insert into `progress` table
   - All read methods → Supabase queries
4. Add team invites:
   - Admin can invite baristas by email
   - Send invite link via Supabase email templates
5. Test migration:
   - Seed production DB with demo data
   - Verify all flows work with real backend

**Success criteria**: A cafe can sign up, invite their team, assign lessons, and track progress - all persisted to Supabase.

### Phase 2: Mobile Optimization (Q3 2026)

**Goal**: Make the app usable on phones (currently desktop-only).

**Tasks**:
1. Responsive design audit:
   - Test all views on 375px viewport
   - Fix layout breaks (dashboards, modals, lesson player)
2. Touch interactions:
   - Larger tap targets (44x44px minimum)
   - Swipe to navigate lessons
   - Pull-to-refresh on dashboards
3. Offline support:
   - Cache lesson content in IndexedDB
   - Queue quiz submissions when offline
   - Sync when connection returns
4. Mobile-specific UX:
   - Bottom nav for baristas (Today, Library, Profile)
   - Collapsible admin sidebar
   - Simplified tables on small screens

**Success criteria**: Baristas can complete lessons on their phones during breaks without frustration.

### Phase 3: Content Management (Q4 2026)

**Goal**: Let admins create custom lessons beyond the default 22.

**Tasks**:
1. Lesson editor UI:
   - Rich text editor for read paragraphs
   - Quiz builder (add/remove questions, set correct answer)
   - Drag-to-reorder lessons within volumes
2. Image/video uploads:
   - Supabase Storage for media
   - Embed images in lesson content
   - Optional video lessons
3. Custom volumes:
   - Admins can create "Vol IV: House Standards"
   - Assign custom volumes to specific teams
4. Version control:
   - Edit lessons without breaking in-progress learners
   - "Publish" vs "Draft" state

**Success criteria**: A cafe can add a custom lesson about their espresso blend and assign it to their team.

### Phase 4: Advanced Analytics (Q1 2027)

**Goal**: Give admins deeper insights into team learning.

**Tasks**:
1. Quiz analytics:
   - Which questions are hardest? (low pass rate)
   - Which baristas struggle with specific topics?
   - Time-to-complete per lesson
2. Retention metrics:
   - How many baristas start Vol I but don't finish?
   - How long between assignments and first lesson attempt?
3. Comparative benchmarks:
   - How does this cafe compare to others?
   - What's the average completion rate across all Copi cafes?
4. Export reports:
   - Generate PDF progress reports per barista
   - CSV export for HR records

**Success criteria**: Admins can identify struggling baristas early and intervene.

### Phase 5: Certification Platform (Q2 2027)

**Goal**: Make Copi certifications recognized industry-wide.

**Tasks**:
1. Public certification badges:
   - Shareable URLs (linkedin.com/in/barista?cert=copi-foundations)
   - Embeddable badges for cafe websites
2. Third-party integrations:
   - SCA (Specialty Coffee Association) partnership
   - Link Copi certs to SCA credentials
3. Advanced certifications:
   - Vol IV: Roasting fundamentals
   - Vol V: Cafe management
   - Vol VI: Sensory training (cupping)
4. Continuing education:
   - Recertification every 2 years
   - New content keeps certifications current

**Success criteria**: "Copi certified" on a resume means something to hiring managers.

## Known Issues and Technical Debt

### Critical (blocks production use)

1. **No error handling** - App crashes on unhandled errors (e.g., localStorage full, JSON parse fails)
2. **No auth** - Hardcoded credentials are a security risk
3. **No backend** - Can't deploy for real teams

### High (quality issues)

4. **No tests** - Refactoring is risky without test coverage
5. **7000-line monolith** - `App.jsx` is hard to navigate
6. **No accessibility** - Screen reader users can't use the app
7. **No mobile layout** - Unusable on phones

### Medium (tech debt)

8. **Inline styles repetition** - Every component redefines palette and fonts
9. **No TypeScript** - Easy to pass wrong props, break store contract
10. **No code splitting** - Entire 7000-line app loads upfront
11. **No image optimization** - Portrait PNGs are large, should be WebP
12. **window.* exports** - Non-standard module pattern

### Low (nice-to-have)

13. **No animations** - Modal open/close is instant (slightly jarring)
14. **No dark mode** - Locked to beige/paper aesthetic
15. **No i18n** - English only
16. **No keyboard shortcuts** - Power users can't navigate faster

### Accepted limitations (by design)

- **No real-time collaboration** - One barista can't see another's progress live (not needed)
- **No chat** - Training is async, not social (by design)
- **No gamification** - No points, leaderboards, streaks (editorial product, not a game)

## How to Prioritize Future Work

**Guiding principle**: "What gets cafes to pay for this?"

1. **Must-have for launch**: Backend integration, auth, mobile optimization
2. **Differentiators**: Content management (custom lessons), certification platform
3. **Revenue drivers**: Advanced analytics (upsell to higher tiers), integrations (POS, payroll)
4. **Quality gates**: Testing, accessibility, performance (before scaling)

**Not planned**:
- Social features (comments, chat)
- Gamification (points, streaks)
- Consumer-facing product (this is B2B for cafes, not B2C for individual baristas)
