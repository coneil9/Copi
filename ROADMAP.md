# ROADMAP.md

## Project Structure

**This repository** (copi-vite-project):
- The Copi APPLICATION (app.copi.com)
- Built with Vite + React
- Authenticated user experience (owner, manager, barista, host dashboards)
- Currently localStorage prototype, migrating to Supabase backend

**Separate marketing site repository** (not in this repo):
- The Copi MARKETING SITE (copi.com)
- Built with Next.js (static or server-rendered)
- Public pages: landing, pricing, curriculum, about, signup
- Signup page integrates with Supabase Auth
- Redirects to app.copi.com after successful signup

**Both repositories share**:
- Supabase project (authentication + database)
- Same color palette and typography
- Same brand identity

## Current State of the Project

### What Is Built and Working (Prototype Phase)

**Core learning experience** (functional, being enhanced):
- ✅ Lesson Player with 3-phase flow (read → quiz → results)
- ✅ 22 lessons across 3 curriculum volumes (Vol I: History, Vol II: Processing, Vol III: Barista)
- ✅ Multiple-choice quizzes with immediate feedback
- ✅ Final tests with 70% passing requirement
- ✅ Progress tracking and lesson unlocking logic
- ✅ Certification badges (Foundations, Bar certified)

**Basic admin features** (working, being expanded):
- ✅ Admin dashboard (currently single-role "Roaster Dashboard")
- ✅ Team roster display
- ✅ Progress metrics (completion %, quiz scores)
- ✅ Activity feed

**Basic barista features** (working):
- ✅ "Today" dashboard with next lesson
- ✅ Library view (all assigned volumes)
- ✅ Profile view (badges, progress)

**Data & state** (working, being migrated to new model):
- ✅ Global state singleton (CopiStore)
- ✅ localStorage persistence
- ✅ Hardcoded demo credentials

**Marketing site** (separate Next.js repository):
- ✅ Landing page (copi.com)
- ✅ Curriculum showcase
- ✅ Pricing page
- ✅ About page
- ✅ Signup page (integrates with Supabase Auth)
- ✅ Static or server-rendered (Next.js)
- ✅ Redirects to app.copi.com after signup

### What Is Being Built (Active MVP Development)

**Authentication & signup** (in progress):
- 🔄 Supabase Auth integration (password + Google SSO)
- 🔄 Owner signup flow on marketing site (copi.com/signup)
- 🔄 Staff invite system with time-limited tokens (72-hour expiry)
- 🔄 CSV bulk upload for staff invites
- 🔄 Password reset flow
- 🔄 Email delivery via Supabase (invite links, password reset)
- 🔄 Invite validation and one-time use enforcement

**Multi-location architecture** (in progress):
- 🔄 Location management (add locations, assign staff to locations)
- 🔄 Location-scoped data queries (filter by locationId)
- 🔄 Owner dashboard with location switcher (dropdown to filter views)

**Role-based permissions** (in progress):
- 🔄 Four roles: Owner/Admin, Manager, Barista, Host
- 🔄 Permission checks in CopiStore methods
- 🔄 Role-specific dashboard routing

**Onboarding milestones** (in progress):
- 🔄 Milestone templates per role (barista, host, manager)
- 🔄 Milestone progress tracking (separate from lesson progress)
- 🔄 Manager approval workflow
- 🔄 Milestone completion in dashboards

**Manager dashboard** (in progress):
- 🔄 Location-scoped team view
- 🔄 Milestone approval interface
- 🔄 Staff progress monitoring (location-scoped)

**Enhanced owner dashboard** (in progress):
- 🔄 Location switcher UI
- 🔄 Multi-location analytics
- 🔄 Cross-location team roster

**Data model evolution** (in progress):
- 🔄 Cafes entity (top-level account)
- 🔄 Locations entity (belongs to cafe)
- 🔄 Users with role + locationId (except owners)
- 🔄 Invites entity (token-based staff invitations)
- 🔄 Onboarding milestones
- 🔄 Progress split: onboarding vs. lessons
- 🔄 Migration from v3 localStorage to Supabase

### What Is NOT Built Yet (Post-MVP)

**AI-powered features**:
- ❌ AI setup (upload handbook → generate milestones)
- ❌ AI content gap analysis
- ❌ AI suggestions for improvement

**Content management**:
- ❌ Owner can edit milestones
- ❌ Owner can create custom volumes
- ❌ Rich text editor for lessons
- ❌ Upload images/videos

**Advanced features**:
- ❌ In-app messaging
- ❌ Export progress reports (PDF, CSV)
- ❌ Mobile apps (web only)
- ❌ Reminders/notifications
- ❌ Email verification (beyond basic Supabase flow)
- ❌ Two-factor authentication

**Testing & quality**:
- ❌ Automated tests (unit, integration, E2E)
- ❌ Accessibility audit
- ❌ Performance benchmarks

## MVP Scope Definition

**MVP Goal**: Prove that cafe owners will pay for a combined onboarding + learning platform with multi-location support.

### Must-Have for MVP Launch

1. **Authentication & signup** (NEW):
   - Marketing site (Next.js) with signup page
   - Owner signup via email/password OR Google SSO
   - Supabase Auth integration (handles passwords, sessions, OAuth)
   - Staff invite system with time-limited tokens (72-hour expiry)
   - CSV bulk upload for staff invites
   - Password reset flow
   - One-time use invite tokens

2. **Multi-location support**:
   - Owner can add 2-4 locations during onboarding
   - Assign staff to locations via invites
   - Owner dashboard with location switcher
   - Location-scoped data for managers

3. **Four user roles**:
   - Owner/Admin (multi-location view)
   - Manager (single location view)
   - Barista/Host (personal view)
   - Role-based permissions enforced

4. **Onboarding milestones**:
   - Pre-built milestone templates for barista, host, manager roles
   - Manager can mark milestones complete
   - Barista sees onboarding checklist
   - Progress tracked separately from lessons

5. **Learning tracks** (existing, enhanced):
   - 22 lessons across 3 volumes (existing)
   - Role-based assignment (barista gets Vol I-III, host gets Vol I-II)
   - Certification badges

6. **Supabase backend**:
   - Replace localStorage with Postgres
   - Row-level security for location scoping + cafe scoping
   - Supabase Auth for all authentication
   - Email delivery for invites and password reset
   - Database schema (cafes, locations, users, invites, milestones, progress)

### Nice-to-Have for MVP (Deprioritized)

- AI-powered handbook upload → milestone generation (Phase 2)
- In-app messaging (Phase 2)
- Export reports (Phase 2)
- Mobile optimization (Phase 2)
- Advanced analytics (Phase 2)

## Timeline to MVP

### Phase 1: Core Architecture & Documentation (Current - 2 weeks)

**Goal**: Build multi-location + role foundation in localStorage prototype + document authentication architecture

**Documentation** (COMPLETED):
- ✅ Update CLAUDE.md with multi-location, roles, authentication flows
- ✅ Update ARCHITECTURE.md with signup flows, Supabase Auth, database schema
- ✅ Update PRODUCT.md with 8 user flows (signup, invites, CSV upload, etc.)
- ✅ Update ROADMAP.md with marketing site tasks
- ✅ Update CONVENTIONS.md with coding standards
- ✅ Update TESTING.md with testing strategy

**Code** (IN PROGRESS):
- 🔄 Migrate CopiStore to new data model (cafes, locations, roles, milestones, invites)
- 🔄 Implement location scoping in all query methods
- 🔄 Add onboarding milestones system
- 🔄 Build location switcher UI for owner dashboard
- 🔄 Create manager dashboard (location-scoped)
- 🔄 Update barista dashboard with onboarding checklist
- 🔄 Add hardcoded test data for 2 locations, 4 roles

**Deliverable**: Functioning prototype with multi-location, onboarding milestones, role-based permissions (localStorage only)

### Phase 2: Supabase Migration & Authentication (3-4 weeks)

**Goal**: Replace localStorage with production backend + implement full authentication

**Supabase setup** (Week 1):
- Create Supabase project
- Configure Supabase Auth (email/password + Google OAuth provider)
- Set up email templates (invite, password reset)
- Define database schema (cafes, locations, users, invites, milestones, progress)
- Implement Row-Level Security policies (cafe-scoped + location-scoped)

**Application backend** (Week 2-3):
- Migrate CopiStore methods to Supabase queries
- Implement authentication methods (signup, login, logout, resetPassword)
- Implement invite methods (inviteStaff, inviteStaffBulk, validateInviteToken, acceptInvite)
- Add CSV parsing and validation for bulk invites
- Test location scoping and cafe scoping at database level
- Test RLS policies for all 4 roles

**Marketing site** (Week 3-4):
- Build Next.js marketing site (separate repository)
- Create signup page with Supabase Auth integration
- Implement Google SSO button
- Add redirect to app.copi.com after signup
- Deploy marketing site to Vercel (copi.com)

**Application changes** (Week 4):
- Build invite acceptance page (app.copi.com/invite/{token})
- Build password reset page
- Remove hardcoded credentials
- Add session management
- Test full signup → invite → login flow

**Deliverable**: Prototype working with Supabase backend, full authentication, multi-tenant ready

### Phase 3: Onboarding & Staff Management UI (2 weeks)

**Goal**: Complete owner onboarding experience and staff management tools

**Owner onboarding flow** (Week 1):
- Build 3-step setup wizard after signup:
  - Step 1: Create cafe (name, type)
  - Step 2: Add first location (name, address)
  - Step 3: Invite first staff members (name, email, role)
- Redirect to owner dashboard after setup complete
- Allow skipping Step 3 (can invite later)

**Staff management UI** (Week 2):
- Build location management page (add/edit/delete locations)
- Build staff roster with invite status (pending, accepted, expired)
- Build CSV upload interface with validation feedback
- Add resend invite button for expired/pending invites
- Add edit staff role and location assignment

**Deliverable**: Owners can sign up, complete onboarding, add locations, invite staff without developer intervention

### Phase 4: Polish & Launch Prep (2 weeks)

**Goal**: Make MVP production-ready

**Quality assurance** (Week 1):
- Mobile responsiveness audit (test on iOS/Android)
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Performance optimization (bundle size, lazy loading)
- Error handling & validation (all forms, all flows)
- Security audit (RLS policies, input sanitization, CSRF protection)

**Launch prep** (Week 2):
- Onboarding tutorial for new owners (in-app walkthrough)
- Deploy marketing site to Vercel (copi.com)
- Deploy application to Vercel (app.copi.com)
- Set up monitoring (Sentry for errors, analytics)
- Beta test with 3-5 cafes

**Deliverable**: Production-ready MVP

**Total to MVP**: ~10-11 weeks

## What Is Actively Being Worked On (This Week)

**Documentation** (COMPLETED):
- ✅ Updated CLAUDE.md with multi-location architecture, authentication flows, CSV upload
- ✅ Updated ARCHITECTURE.md with signup flows, Supabase Auth, database schema with RLS
- ✅ Updated PRODUCT.md with 8 user flows (signup, invites, CSV, password reset, etc.)
- ✅ Updated ROADMAP.md with marketing site separation and authentication tasks
- ✅ Updated CONVENTIONS.md with coding standards (completed earlier)
- ✅ Updated TESTING.md with testing strategy (completed earlier)

**Code (NEXT UP)**:
- 🔄 Migrate CopiStore data model to v4 schema (cafes, locations, roles, milestones, invites)
- 🔄 Add location management methods to CopiStore
- 🔄 Implement onboarding milestones system
- 🔄 Add location switcher to owner dashboard
- 🔄 Create manager dashboard component
- 🔄 Update seed data for multi-location demo with 2 locations, 4 roles

## What Is Planned Next (After This Week)

**Week 2-3 (Phase 1 completion)**: Complete localStorage prototype with all MVP features
- Finish manager dashboard
- Add milestone approval workflow
- Test all 4 roles with location scoping
- Validate UX with stakeholders

**Week 4-7 (Phase 2)**: Supabase migration + authentication
- Set up Supabase project (Auth + Database)
- Configure Google OAuth and email templates
- Create database schema + RLS policies
- Migrate CopiStore to Supabase queries
- Build Next.js marketing site with signup
- Build invite acceptance and password reset pages
- Test full authentication flows

**Week 8-9 (Phase 3)**: Owner onboarding + staff management UI
- Build 3-step owner onboarding wizard
- Build location management UI
- Build staff roster with invite status
- Add CSV upload interface
- Test complete signup → onboarding → invite flow

**Week 10-11 (Phase 4)**: Polish + beta test
- Mobile responsiveness audit
- Cross-browser testing
- Error handling & validation
- Performance optimization
- Beta test with 3-5 cafes

## Known Issues and Technical Debt

### Critical (blocks MVP, being addressed in Phase 2)

1. **No backend** - localStorage can't support real multi-tenant deployment → migrating to Supabase
2. **No auth** - Hardcoded credentials don't scale → implementing Supabase Auth + invite system
3. **No location data** - Current schema doesn't support locations → adding cafes, locations, invites tables
4. **No marketing site** - Need separate Next.js site for signup → building in Phase 2

### High (quality issues)

4. **No tests** - Refactoring is risky without test coverage
5. **No mobile layout** - Unusable on phones
6. **No error handling** - App crashes on unhandled errors
7. **7000-line monolith** - App.jsx is hard to navigate

### Medium (tech debt)

8. **Inline styles repetition** - Every component redefines palette
9. **No TypeScript** - Easy to break store contract
10. **window.* exports** - Non-standard module pattern
11. **No code splitting** - Entire app loads upfront

### Low (nice-to-have)

12. **No animations** - Modal open/close is instant
13. **No dark mode** - Locked to beige/paper aesthetic
14. **No i18n** - English only

### Accepted limitations (by design)

- **No real-time collaboration** - Not needed for async training
- **No social features** - Training is personal, not social
- **No gamification** - Editorial product, not a game

## Future Vision (Beyond MVP)

### Phase 5: AI-Powered Setup (Q3 2026)

- Upload handbook → AI generates milestones
- AI content gap analysis
- AI suggests improvements based on completion data
- "Smart milestones" that adapt to cafe type (espresso bar vs. full service)

### Phase 6: Advanced Manager Tools (Q4 2026)

- In-app messaging (manager ↔ barista)
- Shift scheduling integration
- Progress reports (export PDF for HR)
- Bulk milestone approval

### Phase 7: Certification Platform (Q1 2027)

- Public certification badges (shareable LinkedIn URLs)
- SCA (Specialty Coffee Association) partnership
- Advanced certifications (roasting, cafe management, cupping)
- Continuing education requirements

### Phase 8: Multi-Cafe Groups (Q2 2027)

- Scale beyond 1-4 locations to 5-20+ locations
- Regional manager role (manages multiple locations)
- Cross-location reporting and benchmarks
- White-label for large chains

## Success Metrics for MVP

**Activation** (Did they set up?):
- 80% of signups add at least 1 location
- 60% of signups invite at least 3 staff members
- 50% of signups create at least 1 custom milestone

**Engagement** (Are they using it?):
- 70% of invited staff log in within 7 days
- 40% of baristas complete at least 1 onboarding milestone in first week
- 30% of baristas complete at least 1 lesson in first month

**Retention** (Do they keep using it?):
- 60% of cafes have at least 1 active staff member after 30 days
- 40% of managers approve at least 1 milestone per week
- Owner logs in at least 2x per month to check progress

**Value** (Will they pay?):
- 10% of beta testers convert to paid ($25/month) after 30-day trial
- 50% of paid users stay subscribed after 3 months
- NPS > 40 from cafe owners

If we hit these metrics, Copi is validated and ready to scale.
