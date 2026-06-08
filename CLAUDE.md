# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (local)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Overview

This is a Vite + React prototype for Copi, a barista training platform. The original bundled JSX prototype has been preserved and moved into a deployable structure.

### Core Architecture Pattern

**Single-file monolith with module extraction:** The main application logic lives in `src/App.jsx` as a faithful concatenation of the original prototype. Individual modules have been extracted to `src/prototype/*` for future refactoring, but `App.jsx` remains the primary integration point.

**Global state singleton:** All application state is managed through `CopiStore` (defined in `src/prototype/copi-store.jsx`), a singleton that:
- Manages curriculum data assembled from `content-volume-*.jsx` files
- Tracks team roster, assignments, lesson progress, quiz scores, and certifications
- Persists to localStorage (key: `copi.progress.v3`)
- Exposes a React hook `useCopiStore()` for component subscriptions
- **Critical:** Components should NEVER invent their own numbers or state—always read from and write to CopiStore

### Key Architectural Components

**Curriculum content volumes:**
- `content-volume-barista.jsx` — Vol III (Barista knowledge)
- `content-volume-history.jsx` — Vol I (Coffee history)
- `content-volume-processing.jsx` — Vol II (Coffee processing)
- Each defines lessons with read content, quizzes, and final tests
- Assembled into `window.COPI_CURRICULUM` by CopiStore

**Navigation & routing:**
- Implemented through `copi-prototype-shell.jsx` using event delegation (no React Router)
- Handles landing page navigation (Curriculum, Pricing, About)
- Manages trial signup modal flow
- Controls admin vs barista login routing

**Lesson player:**
- `lesson-player.jsx` — The core learning experience
- Three-phase flow: read → quiz → results
- Handles both regular lessons and final tests
- Updates CopiStore on completion

**User roles:**
- **Admin** (admin@milano.coffee / copi2026) — Routes to roaster dashboard
- **Barista** (lili@milano.coffee / copi2026) — Routes to barista "Today" view
- Credentials defined in `copi-prototype-shell.jsx`

### Data Flow

1. Components render using data from `CopiStore` via `useCopiStore()` hook
2. User actions (lesson completion, assignments) call CopiStore methods
3. CopiStore updates internal state, persists to localStorage, and notifies subscribers
4. Components re-render with fresh data

### Supabase Integration

Supabase client scaffold exists at `src/lib/supabaseClient.js` but is currently optional:
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
- Returns `null` if credentials are not provided
- Not currently integrated into the prototype's localStorage-based flow

## File Organization

- `src/App.jsx` — Main application entry (concatenated prototype)
- `src/main.jsx` — Vite/React mount point
- `src/styles.css` — Global styles and font imports
- `src/lib/supabaseClient.js` — Supabase client configuration
- `src/prototype/` — Extracted modules:
  - `copi-store.jsx` — Global state singleton
  - `copi-prototype-shell.jsx` — Navigation and routing
  - `lesson-player.jsx` — Learning experience player
  - `content-volume-*.jsx` — Curriculum content
  - `*-dashboard.jsx` — Admin and barista dashboards
  - `*-page.jsx` — Marketing and content pages
  - `*-modal.jsx` — Interactive modals
  - `ui-atoms.jsx` — Shared UI utilities (PaperGrain, InkMark, ImagePlaceholder)
- `public/assets/` — Image assets

## Deployment

This project is designed for Vercel deployment:
1. Deploy as a Vite project
2. Add Supabase environment variables through Vercel Project Settings > Environment Variables (optional)
3. The build command (`npm run build`) produces static assets for deployment
