# PRODUCT.md

## What the Product Does

Copi is a **cafe management and education platform** that digitizes the full staff journey from day-one onboarding through advanced coffee knowledge. Cafe owners upload their existing processes (PDFs, employee handbooks, training documents), and AI sets up their training environment automatically, fills in gaps with industry best practices, and suggests improvements.

The platform serves two critical needs that independent cafes struggle with:

1. **Structured onboarding** - Staff move through manager-approved milestones (shadow shifts, first espresso pull, POS training) with clear checkpoints and accountability
2. **Ongoing education** - Self-paced learning tracks turn Q-grade level coffee knowledge into Duolingo-style lessons that staff actually complete

This goes beyond simple onboarding or LMS platforms by combining both systems into one staff development journey.

## Who It Is For

**Primary customers**: Small to mid-size cafe operators across North America running 1–4 locations

**User personas**:

### Cafe Owner / Admin
- Owns the account, pays the subscription
- Manages multiple locations from a single dashboard
- Sets up training environment, assigns staff, views cross-location analytics
- Needs: Centralized visibility, consistent training across locations, documented proof of training for compliance

### Shift Lead / Manager
- Manages one location
- Approves onboarding milestones for their team (e.g., "Lili completed her first espresso pull")
- Monitors team progress, communicates with staff in-app
- Needs: Simple tools to track who's ready for bar, who needs support

### Barista / Host
- Completes onboarding milestones with manager approval
- Works through self-paced lessons during slow hours
- Earns certifications that prove knowledge
- Needs: Clear next steps, learn without disrupting shifts, tangible credentials

## Core User Flows

### 1. Cafe owner sets up account (AI-powered onboarding)

**Goal**: Go from "just signed up" to "team is training" in under 10 minutes

1. Owner signs up, creates cafe account ("Milano Coffee")
2. Adds locations (Downtown, Westside)
3. **Uploads existing training materials** (employee handbook PDF, opening checklist, espresso recipe card)
4. **AI analyzes documents and generates onboarding milestones**:
   - Extracts: "Staff must complete register training before solo shifts"
   - Suggests: "Add milestone: Complete POS training (requires manager signoff)"
   - Fills gaps: "You don't have milk steaming training - we recommend adding this milestone"
5. Owner reviews AI-generated milestones, edits, approves
6. Owner invites staff via email, assigns them to locations and roles
7. Staff receive email invite with login link

**Success**: Owner has a working training system without building it from scratch

**AI value**: Turns a blank slate into a structured program in minutes, not hours

### 2. New barista completes onboarding (manager-approved milestones)

**Goal**: Complete day-1 through day-30 tasks with manager oversight

1. Barista (Lili) logs in on day 1, sees "Welcome to Milano Downtown"
2. Dashboard shows onboarding checklist:
   - ✅ Shadow a shift (completed by Sarah Chen on May 2)
   - ⏳ Pull your first espresso (in progress)
   - 🔒 Complete POS training (locked - do #2 first)
   - 🔒 Steam milk to 140-150°F (locked)
3. Lili works a shift, pulls her first espresso under manager supervision
4. Manager (Sarah) opens her dashboard, sees "Lili is ready for milestone approval: Pull your first espresso"
5. Sarah marks it complete in-app, adds note: "Great first pull, dial was spot-on"
6. Lili sees checkmark appear, next milestone unlocks
7. After 2 weeks, all onboarding milestones are complete
8. Dashboard shows "Onboarding complete! Start your learning track: Barista Fundamentals"

**Success**: Lili knows exactly what's expected, manager knows she's bar-ready, owner has proof of training

**Differentiator**: Most platforms are either onboarding checklists OR learning content, not both with handoff between phases

### 3. Barista advances through learning track (self-paced lessons)

**Goal**: Build coffee knowledge during slow hours without manager babysitting

1. Lili completes onboarding, sees "Start Vol I: History of coffee"
2. Clicks lesson "Ethiopia, the cradle" (8 min)
3. **Read phase**: Reads 2 editorial paragraphs about arabica origins
4. **Quiz phase**: Answers 3 multiple-choice questions
5. Submits first answer → sees immediate feedback: "✓ Correct! Arabica grew wild in Ethiopian highlands long before cultivation elsewhere"
6. Completes quiz (3/3), sees "Perfect score - lesson complete"
7. Next lesson unlocks automatically
8. After 9 lessons, takes final test (70% to pass)
9. Passes with 5/6 → Earns "Foundations" certification badge
10. Badge appears in profile, visible to manager and owner

**Success**: Lili understands why Ethiopian coffee tastes different from Brazilian, manager sees proof of knowledge, owner knows team is educated

**Design principle**: Duolingo-style gamification (immediate feedback, bite-sized, visual progress) applied to Q-grade coffee knowledge

### 4. Manager reviews team progress at their location

**Goal**: Understand who's ahead, who's stuck, where to intervene

1. Manager (Sarah) logs in at Milano Downtown
2. Sees dashboard **scoped to Downtown location only** (can't see Westside):
   - Team completion: 62%
   - Onboarding milestones pending approval: 2
   - Lessons completed this week: 7
3. Scrolls to team roster (Downtown staff only):
   - Lili: 45% complete, needs milestone approval for "Steam milk"
   - Jules: 18% complete, stuck on Vol I Lesson 5 for 3 days
   - Reza: 89% complete, almost done with Vol II
4. Clicks Lili's row → sees full progress:
   - Onboarding: 4/5 milestones done
   - Vol I: 9/9 lessons, certified
   - Vol II: 3/7 lessons in progress
5. Clicks "Approve milestone" for Lili's milk steaming
6. Sends in-app message to Jules: "Hey, stuck on anything? Let me know if you need help with Vol I"

**Success**: Sarah knows exactly where her team stands, can intervene early, doesn't have to manually track spreadsheets

**Key UX**: Manager ONLY sees their location - can't access Westside data (enforced at data layer)

### 5. Owner views cross-location analytics with location switcher

**Goal**: Compare locations, identify top performers, spot problem locations

1. Owner (Brian) logs in, sees Owner Dashboard
2. **Location switcher at top**: Dropdown shows "All Locations | Downtown | Westside"
3. Selects "All Locations" (default):
   - Total staff: 12
   - Average completion: 58%
   - Certifications earned: 8 Foundations, 2 Bar Certified
   - Recent activity feed (all locations)
4. Switches to "Downtown":
   - Staff: 7
   - Average completion: 62%
   - Team roster filtered to Downtown only
   - Milestone approvals filtered to Downtown only
5. Switches to "Westside":
   - Staff: 5
   - Average completion: 51%
   - Notices: Westside is lagging behind Downtown
   - Drills into Westside team, sees 2 staff haven't started onboarding
6. Sends message to Westside manager: "Let's get the new hires started on onboarding"

**Success**: Brian has full visibility without separate logins, can compare locations, intervene at either location

**Key UX**: Location switcher is prominent, persists selection, makes multi-location management effortless

### 6. AI suggests improvements to onboarding (future feature)

**Goal**: Continuously improve training based on data

1. After 3 months, owner sees notification: "AI insights available"
2. Opens AI insights panel:
   - "82% of baristas get stuck on Lesson 3: The Ottoman coffeehouse"
   - Suggestion: "Add a visual timeline to this lesson, or split into two shorter lessons"
   - "Baristas who complete onboarding in under 14 days score 23% higher on Vol I final test"
   - Suggestion: "Set a recommended onboarding pace: 2 milestones per week"
3. Owner clicks "Apply suggestion" → AI updates lesson content
4. Next cohort of baristas complete Lesson 3 faster

**Success**: Platform gets smarter over time, adapts to each cafe's needs

## Key Features and Their Purpose

### AI-Powered Setup (Differentiator)

**What it does**: Upload employee handbook, espresso recipe card, opening checklist → AI generates onboarding milestones

**Purpose**:
- Eliminates "blank page syndrome" - owners don't have to build training from scratch
- Extracts existing institutional knowledge that's trapped in PDFs
- Fills gaps by comparing to industry best practices
- Makes Copi immediately useful on day 1

**Why it matters**: Competing platforms force owners to manually create every checklist item. Copi's AI does the heavy lifting.

### Onboarding Milestones (Manager-Approved)

**What it does**: Checklists of real-world tasks ("Pull first espresso", "Shadow shift", "POS training") that require manager signoff

**Purpose**:
- Bridges the gap between "hired" and "bar-ready"
- Creates accountability (manager must verify task completion)
- Gives managers visibility into readiness
- Documents training for compliance/insurance

**Why separate from lessons**: Onboarding is social (requires manager interaction) and practical (real-world tasks). Lessons are solo and knowledge-based.

### Learning Tracks (Self-Paced Lessons)

**What it does**: Duolingo-style lessons with read → quiz → results flow, organized into volumes (History, Processing, Barista Techniques)

**Purpose**:
- Teaches Q-grade level knowledge without boring staff
- Self-paced so staff learn during slow hours
- Gamified progress (badges, certifications) motivates completion
- Differentiates trained staff from untrained

**Design**: Editorial writing quality (not dry training docs), immediate feedback on quizzes (not "try again" loops), paper aesthetic (not corporate LMS).

### Location Scoping & Role-Based Permissions

**What it does**: Owner sees all locations, Manager sees one location, Barista sees only themselves

**Purpose**:
- Security boundary - Manager at Location A can't see Location B payroll/progress
- Simplifies manager experience (no clutter from other locations)
- Scales to multi-location groups without complexity

**Why it matters**: Competitors either force separate accounts per location (annoying) or give everyone full access (security risk). Copi's scoping is the sweet spot.

### Owner Dashboard with Location Switcher

**What it does**: Dropdown at top of dashboard filters all data to selected location or shows aggregated "All Locations" view

**Purpose**:
- Centralized multi-location management without separate logins
- Compare locations side-by-side
- Drill into problem locations quickly

**Why it's critical**: Multi-location operators (70% of target market) need this to justify paying for Copi.

## UX Principles and Design Goals

### Editorial, Not Corporate

The product feels like **reading a well-designed coffee manual**, not clicking through an LMS.

- Beige paper background, moss green accents, serif fonts
- Thoughtful writing (not auto-generated training speak)
- Paper grain texture, almanac aesthetic
- No gamification for its own sake (no points, no leaderboards)

**Why**: Coffee people care about craft and quality. The UX should reflect that.

### Respect for Time

Baristas complete lessons during breaks or slow shifts. The platform never wastes their time:
- Lessons show minutes (8 min, 9 min)
- No forced videos, no timers, no locks ("watch for 60 seconds to continue")
- Immediate feedback on quiz answers (no "try again" loops)
- Can pause mid-lesson, resume later

**Why**: Baristas are busy. If the platform feels like homework, they'll ignore it.

### Manager as Approver, Not Admin

Managers approve milestones and view progress. They do NOT:
- Add/remove staff (owner-only)
- Edit curriculum (owner-only)
- Access billing (owner-only)
- See other locations (location-scoped)

**Why**: Managers are shift leads, not IT admins. Keep their role simple and focused.

### Data-Driven, Not Gut-Feel

Every decision is backed by data owners can see:
- "Team completion: 58%" not "Your team is doing okay"
- "Jules stuck on Lesson 5 for 3 days" not "Jules might need help"
- "5/6 baristas certified in Foundations" not "Most of your team knows coffee"

**Why**: Cafe owners are operators. They need actionable metrics, not vague dashboards.

## What Success Looks Like for a User

**For a cafe owner**:
- "I set up Copi in 10 minutes by uploading our handbook, and it built our entire onboarding program"
- "I can see that Downtown is outperforming Westside - I need to spend more time training the Westside manager"
- "When our insurance asked for proof of training, I exported a report showing 100% onboarding completion"
- "New hires are bar-ready in 2 weeks instead of 4"

**For a manager**:
- "I know exactly who's ready for bar and who isn't - no more guessing"
- "Approving milestones takes 10 seconds, and I can add notes for context"
- "I can see that Jules is stuck on a lesson and check in with him"

**For a barista**:
- "I completed my onboarding in 10 days, and my manager signed off on everything - I know I'm ready"
- "I earned my Foundations certification by finishing Vol I and Vol II - it's on my profile"
- "I actually learned why washed Ethiopian coffee tastes different from natural Brazilian - I can explain it to customers now"
- "I did my lessons during slow afternoon shifts - didn't disrupt my work"

**For the cafe business**:
- Consistent drink quality across locations (everyone trained the same way)
- Faster onboarding (data shows 30% reduction in time-to-bar-ready)
- Higher retention (staff feel invested in their development)
- Better customer experience (educated baristas answer questions confidently)
