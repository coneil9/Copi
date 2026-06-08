# ROADMAP.md

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

**Marketing site** (complete):
- ✅ Landing page, curriculum, pricing, about pages

### What Is Being Built (Active MVP Development)

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
- 🔄 Locations entity
- 🔄 Users with role + locationId
- 🔄 Onboarding milestones
- 🔄 Progress split: onboarding vs. lessons
- 🔄 Migration from v3 to v4 localStorage schema

### What Is NOT Built Yet (Post-MVP)

**AI-powered features**:
- ❌ AI setup (upload handbook → generate milestones)
- ❌ AI content gap analysis
- ❌ AI suggestions for improvement

**Authentication & backend**:
- ❌ Real user accounts (Supabase Auth)
- ❌ Signup flow (creates cafe + first owner)
- ❌ Supabase database (tables, RLS policies)
- ❌ Password reset, email verification
- ❌ Team invites via email

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

**Testing & quality**:
- ❌ Automated tests (unit, integration, E2E)
- ❌ Accessibility audit
- ❌ Performance benchmarks

## MVP Scope Definition

**MVP Goal**: Prove that cafe owners will pay for a combined onboarding + learning platform with multi-location support.

### Must-Have for MVP Launch

1. **Multi-location support**:
   - Owner can add 2-4 locations
   - Assign staff to locations
   - Owner dashboard with location switcher
   - Location-scoped data for managers

2. **Four user roles**:
   - Owner/Admin (multi-location view)
   - Manager (single location view)
   - Barista/Host (personal view)
   - Role-based permissions enforced

3. **Onboarding milestones**:
   - Pre-built milestone templates for barista, host, manager roles
   - Manager can mark milestones complete
   - Barista sees onboarding checklist
   - Progress tracked separately from lessons

4. **Learning tracks** (existing, enhanced):
   - 22 lessons across 3 volumes (existing)
   - Role-based assignment (barista gets Vol I-III, host gets Vol I-II)
   - Certification badges

5. **Supabase backend**:
   - Replace localStorage with Postgres
   - Row-level security for location scoping
   - Supabase Auth for login
   - Email invites for team

6. **Basic signup flow**:
   - Owner creates cafe account
   - Adds first location
   - Invites first staff member
   - (No AI setup at MVP - owner manually adds milestones)

### Nice-to-Have for MVP (Deprioritized)

- AI-powered handbook upload → milestone generation (Phase 2)
- In-app messaging (Phase 2)
- Export reports (Phase 2)
- Mobile optimization (Phase 2)
- Advanced analytics (Phase 2)

## Timeline to MVP

### Phase 1: Core Architecture (Current - 2 weeks)

**Goal**: Build multi-location + role foundation in localStorage prototype

- ✅ Update documentation (CLAUDE.md, ARCHITECTURE.md, PRODUCT.md, ROADMAP.md)
- 🔄 Migrate CopiStore to new data model (locations, roles, milestones)
- 🔄 Implement location scoping in all query methods
- 🔄 Add onboarding milestones system
- 🔄 Build location switcher UI for owner dashboard
- 🔄 Create manager dashboard (location-scoped)
- 🔄 Update barista dashboard with onboarding checklist
- 🔄 Add hardcoded test data for 2 locations, 4 roles

**Deliverable**: Functioning prototype with multi-location, onboarding milestones, role-based permissions (localStorage only)

### Phase 2: Supabase Migration (2-3 weeks)

**Goal**: Replace localStorage with production backend

- Create Supabase project
- Define schema (cafes, locations, users, milestones, progress)
- Implement Row-Level Security policies
- Migrate CopiStore methods to Supabase queries
- Replace hardcoded credentials with Supabase Auth
- Test location scoping at database level

**Deliverable**: Prototype working with Supabase backend, multi-tenant ready

### Phase 3: Signup & Invites (1-2 weeks)

**Goal**: Let owners create accounts and invite team

- Build signup flow (create cafe, add location, set up owner account)
- Implement team invite system (email with login link)
- Add location management UI (add/edit locations)
- Add staff management UI (invite, assign role, assign location)

**Deliverable**: Owners can sign up, add locations, invite staff without developer intervention

### Phase 4: Polish & Launch Prep (2 weeks)

**Goal**: Make MVP production-ready

- Mobile responsiveness audit
- Cross-browser testing
- Performance optimization
- Error handling & validation
- Onboarding tutorial for new owners
- Deploy to production (Vercel)
- Beta test with 3-5 cafes

**Deliverable**: Production-ready MVP

**Total to MVP**: ~8 weeks

## What Is Actively Being Worked On (This Week)

**Documentation** (just completed):
- ✅ Updated CLAUDE.md with multi-location architecture
- ✅ Updated ARCHITECTURE.md with roles, permissions, location scoping
- ✅ Updated PRODUCT.md with cafe management vision
- ✅ Updated ROADMAP.md with MVP scope

**Code (in progress)**:
- 🔄 Migrate CopiStore data model to v4 schema (locations, roles, milestones)
- 🔄 Add location management methods to CopiStore
- 🔄 Implement onboarding milestones system
- 🔄 Add location switcher to owner dashboard
- 🔄 Create manager dashboard component
- 🔄 Update seed data for multi-location demo

## What Is Planned Next (After This Week)

**Week 2-3**: Complete localStorage prototype with all MVP features
- Finish manager dashboard
- Add milestone approval workflow
- Test all 4 roles with location scoping
- Validate UX with stakeholders

**Week 4-6**: Supabase migration
- Set up Supabase project
- Create schema + RLS policies
- Migrate CopiStore to Supabase
- Test multi-tenancy

**Week 7-8**: Signup + polish
- Build signup flow
- Add team invites
- Polish UI
- Beta test

## Known Issues and Technical Debt

### Critical (blocks MVP)

1. **No backend** - localStorage can't support real multi-tenant deployment
2. **No auth** - Hardcoded credentials don't scale
3. **No location data** - Current schema doesn't support locations

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
