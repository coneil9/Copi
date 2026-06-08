# PRODUCT.md

## What the Product Does

Copi is a **barista training platform** that helps independent coffee shops onboard and upskill their team through structured, editorial coffee education. It replaces ad-hoc training with a consistent curriculum covering coffee history, processing methods, and on-bar techniques.

## Who It Is For

**Primary users**:
1. **Roasters / Cafe owners / Managers** - Assign curriculum, track team progress, manage certifications
2. **Baristas** - Complete lessons, take quizzes, earn badges, prove knowledge

**Example cafe**: Milano, a specialty coffee shop with 6 baristas at different skill levels (from new hires to lead baristas).

## Core User Flows

### 1. Barista completes a lesson

**Goal**: Learn about coffee and prove understanding

1. Barista logs in (lili@milano.coffee / copi2026)
2. Sees "Today" dashboard with current lesson as a big card
3. Clicks card → Lesson Player opens
4. **Read phase**: Reads 2–3 editorial paragraphs (8–9 minutes of content)
5. Clicks "Take the check" → **Quiz phase**
6. Answers 3–4 multiple-choice questions
7. Submits each answer → sees immediate feedback (correct/incorrect + explanation)
8. **Results phase**: Sees score (e.g., "3/3 — Perfect score")
9. Clicks "Next lesson" or "Back to today"
10. Progress saved to localStorage, next lesson unlocked, activity feed updated

**Success**: Barista understands the topic, passes the check, and advances through the curriculum at their own pace.

### 2. Admin assigns a new volume to the team

**Goal**: Roll out advanced training to qualified baristas

1. Admin logs in (admin@milano.coffee / copi2026)
2. Sees Roaster Dashboard with team overview
3. Navigates to "Curriculum" tab
4. Clicks "Assign" on Vol III (Bar certified)
5. **Assign Modal** opens with team roster
6. Selects baristas (e.g., Linda, Reza - the lead baristas)
7. Clicks "Assign volume"
8. Modal closes, activity feed shows "Brian Turko assigned VOL · III → 2 baristas"
9. Assigned baristas now see Vol III in their library

**Success**: Admin controls who gets which training, ensuring baristas don't see advanced content before they're ready.

### 3. Barista earns a certification

**Goal**: Complete a volume and prove mastery

1. Barista completes all 9 lessons in Vol I (History of coffee)
2. Final test unlocks in their library
3. Clicks final test → Lesson Player opens in final mode
4. Takes 6-question comprehensive quiz (passing: 70%+)
5. Submits answers → sees results (e.g., "5/6 — 83% — Foundations certified")
6. Badge appears in profile: "Foundations"
7. Admin sees certification in team dashboard

**Success**: Barista proves knowledge, earns credential, cafe has documented training.

### 4. Admin reviews team progress

**Goal**: Understand who's ahead, who's behind, where to intervene

1. Admin logs in → Roaster Dashboard
2. Sees at-a-glance metrics:
   - Team completion: 58%
   - Lessons this week: 14
   - Average quiz score: 91%
3. Scrolls to team table
4. Sees each barista's progress:
   - Linda: 100%, Bar certified
   - Devi: 22%, Foundations (in progress)
5. Clicks "Analytics" tab for deeper dive
6. Sees completion breakdown per volume, per barista
7. Clicks team member → drill into their full history

**Success**: Admin knows exactly where the team stands and who needs support.

### 5. Marketing site visitor explores curriculum

**Goal**: Understand what training content Copi provides before signing up

1. Visitor lands on landing page
2. Clicks "Curriculum" in nav
3. Sees all three volumes laid out:
   - Vol I: History of coffee (9 lessons, 2h 14m, Foundations cert)
   - Vol II: Processing methods (7 lessons, 1h 58m, Foundations cert)
   - Vol III: Barista knowledge (6 lessons, 1h 32m, Bar certified)
4. Expands a volume → sees lesson titles:
   - "01 · Ethiopia, the cradle"
   - "02 · Yemen and the Sufi cup"
   - ...
5. Clicks "Try Copi free" → Trial signup modal opens

**Success**: Visitor understands the curriculum scope and quality before committing.

## Key Features and Their Purpose

### Lesson Player (Core Learning Experience)

**What it does**: Three-phase flow (read → quiz → results) for consuming lessons and final tests.

**Purpose**:
- Make learning feel editorial and intentional (not gamified or rushed)
- Give immediate feedback on quiz answers so mistakes are learning moments
- Track completion and scores to unlock progression

**Design principles**:
- No timers, no pressure - read at your own pace
- Explanations for every answer - "why" matters as much as "correct"
- Clean, paper-like aesthetic - feels like reading a well-designed manual

### CopiStore (Progress Engine)

**What it does**: Manages all assignments, progress, quiz scores, certifications, and activity.

**Purpose**:
- Single source of truth - no component calculates its own numbers
- Persist demo state across refreshes so visitors can explore without losing progress
- Seed realistic baseline data so the demo feels lived-in

**Why it matters**: A training platform is only useful if progress is accurate and trustworthy. The store ensures everyone sees the same numbers.

### Dashboard Views (Admin vs Barista)

**Admin (Roaster Dashboard)**:
- Team-wide view: who's ahead, who's behind, who's stuck
- Analytics: completion rates, quiz scores, certifications earned
- Curriculum management: assign volumes to specific people
- Team management: invite new baristas (scaffolded, not functional yet)

**Barista ("Today" Dashboard)**:
- One clear next action: "Your next lesson is..."
- Progress summary: overall %, lessons this week, badges earned
- Library: see all assigned volumes and lessons
- Profile: view own history and achievements

**Purpose**: Different roles need different views. Admins manage, baristas learn.

### Seeded Demo Data

**What it does**: Populates localStorage with believable progress for 6 baristas on first load.

**Purpose**:
- Show visitors a working team, not an empty state
- Make analytics and dashboards immediately understandable
- Demonstrate the product's value without requiring manual setup

**Example seed**:
- Linda (lead): 100% done, certified in Foundations and Bar
- Devi (new hire): 22% done, working through Vol I
- Recent activity: lessons completed in last 2–30 hours

### Three Curriculum Volumes

**Vol I - History of coffee** (9 lessons, Foundations cert)
- Ethiopia origins, Yemen trade, Ottoman coffeehouses, European expansion, waves of coffee
- **Why**: Understanding where coffee comes from makes baristas better storytellers and ambassadors for the product

**Vol II - Processing methods** (7 lessons, Foundations cert)
- Cherry anatomy, washed, natural, honey, anaerobic, experimental
- **Why**: Processing explains flavor - a barista who knows this can guide customers to what they'll love

**Vol III - Barista knowledge** (6 lessons, Bar certified)
- Reading the grinder, dialing espresso, pulled-shot rubric, milk steaming, latte art, recovery
- **Why**: On-bar craft that directly improves drink quality and consistency

Each volume ends with a **final test** (70% to pass) that certifies mastery.

## UX Principles and Design Goals

### Editorial, not gamified

The product feels like reading a **well-designed coffee manual**, not playing a quiz app. No points, no leaderboards, no badges for streaks. Just clean editorial design, thoughtful writing, and real learning.

**Visual language**:
- Beige paper background (#E8DDC2)
- Dark ink text (#1A1410)
- Moss green accents (#3F5A3A)
- Serif fonts (Unna for display, Yrsa for body)
- Subtle paper grain texture
- Almanac/record-keeping aesthetic

### Immediate feedback, no penalties

Every quiz answer shows **why it's right or wrong** immediately after submission. No "try again" loops, no lost progress. Mistakes are learning opportunities.

### Respect for time

Lessons show estimated minutes (8–9 min). Baristas can complete a lesson during a break or slow shift. No forced pacing, no timers.

### Mobile-first mental model (even if not implemented)

The design assumes baristas might do this on a phone in the back room. Large touch targets, readable fonts, simple navigation.

### Trust through transparency

Progress is visible at all times:
- Baristas see their own %, badges, next lesson
- Admins see team-wide completion, per-person breakdowns
- No hidden metrics, no mystery algorithms

## What Success Looks Like for a User

**For a barista**:
- "I understand why Ethiopian coffee tastes different from Brazilian now."
- "I can dial in espresso confidently instead of guessing."
- "I earned my Bar certification and my manager acknowledged it."
- "I did this during slow hours over 2 weeks - it didn't disrupt my shifts."

**For an admin**:
- "I can see that Devi is stuck on Vol I - I should check in with her."
- "Linda and Reza are ready for advanced training - I'll assign them Vol III."
- "Our team's average quiz score is 91% - they're actually learning this."
- "When health inspectors ask about training records, I have certified proof."

**For a cafe owner**:
- "Our drinks are more consistent because everyone learned the same fundamentals."
- "New hires onboard faster because there's a curriculum, not just shadowing."
- "Customers ask better questions now because baristas explain the coffee better."
