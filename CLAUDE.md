# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Copi is a barista training platform prototype built as a Vite + React SPA. It provides structured coffee education through interactive lessons, quizzes, and progress tracking for coffee shops. The prototype supports two user roles: roasters/admins who manage teams and assign curriculum, and baristas who complete lessons and earn certifications.

This is a faithful port of a standalone HTML bundle into a deployable Vite project structure. The original monolithic code has been preserved in `src/App.jsx` with modules extracted to `src/prototype/*` for future refactoring.

## Tech Stack

- **React** 19.x (latest) - UI library
- **Vite** 6.x (latest) - Build tool and dev server
- **Supabase** 2.x (latest) - Backend client (scaffolded, not yet integrated)
- **No routing library** - Custom event delegation via `copi-prototype-shell.jsx`
- **No state management library** - Global singleton pattern via `CopiStore`
- **Inline styles** - All styling via React style objects, no CSS modules or styled-components
- **localStorage** - All data persistence (key: `copi.progress.v3`)

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
│   └── supabaseClient.js      # Supabase client scaffold (optional)
└── prototype/                 # Extracted modules (loaded via App.jsx)
    ├── copi-store.jsx         # Global state singleton + curriculum assembly
    ├── copi-prototype-shell.jsx  # Navigation and login routing
    ├── lesson-player.jsx      # Learning experience (read → quiz → results)
    ├── content-volume-*.jsx   # Curriculum content (3 volumes)
    ├── *-dashboard.jsx        # Admin and barista dashboards
    ├── *-page.jsx             # Marketing pages (landing, pricing, about, curriculum)
    ├── *-modal.jsx            # Interactive modals
    ├── ui-atoms.jsx           # Shared utilities (PaperGrain, InkMark, ImagePlaceholder)
    └── pour-over-illustration.jsx  # Animated SVG illustration

public/
└── assets/                    # Static images (owenPortrait.png, miguelPortrait.png)
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

Optional Supabase configuration (create `.env` in project root):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

If not provided, the app runs in localStorage-only mode (current prototype behavior).

See `.env.example` for template.

## Running Locally End-to-End

1. `npm install`
2. `npm run dev`
3. Open http://localhost:5173
4. Click "Try Copi free" to trigger signup flow (just closes modal, doesn't persist)
5. Use demo credentials to log in:
   - **Admin**: admin@milano.coffee / copi2026 (routes to roaster dashboard)
   - **Barista**: lili@milano.coffee / copi2026 (routes to barista "Today" view)
6. All progress persists to localStorage and survives refreshes

## Deployment

Designed for Vercel:
1. Deploy as Vite project
2. Optionally add Supabase env vars via Vercel Project Settings
3. `npm run build` produces static assets in `dist/`

## Gotchas and Never-Do's

### NEVER modify state outside CopiStore
All components must read from and write to `CopiStore`. Never invent your own numbers, cache state in component state that duplicates store data, or calculate progress independently. The store is the single source of truth.

### NEVER add a real routing library
Navigation is intentionally handled via event delegation in `copi-prototype-shell.jsx` to preserve the original prototype's architecture. Don't add React Router.

### NEVER split App.jsx arbitrarily
`App.jsx` is a 7000-line monolith by design. Modules are already extracted to `src/prototype/*` and loaded at the top of App.jsx. If you need to refactor, extract to a NEW file in `prototype/`, export via `window`, and import at the top of App.jsx.

### Login credentials are hardcoded
Admin and barista credentials are defined in `copi-prototype-shell.jsx`. This is intentional for the prototype. Don't connect them to Supabase auth without explicit instruction.

### The curriculum is assembled at runtime
`COPI_CURRICULUM` is built from `window.COPI_VOL1`, `window.COPI_VOL2`, `window.COPI_VOL3` in `copi-store.jsx`. These are set by the content files. Don't break this dependency chain.

### localStorage key is versioned
The key is `copi.progress.v3`. If you change the data structure, increment the version or add migration logic. Otherwise users' demo data will break on refresh.

### All styling is inline
There is no CSS-in-JS library, no Tailwind, no CSS modules. Everything is `style={{}}` objects. Follow this pattern - don't introduce new styling systems.

### The team roster is canonical
`COPI_TEAM` in `copi-store.jsx` is the source of truth for all team members. Don't add team members in UI that aren't in this array.

### Color palette is consistent
Every component uses the same palette object:
```js
const p = {
  bg: '#E8DDC2',     // beige paper
  fg: '#1A1410',     // dark ink
  accent: '#3F5A3A', // moss green
  cream: '#F4EBD2',  // cream
  sun: '#C68A3D',    // ochre/gold
  cherry: '#7A2B1F', // error red (used less frequently)
  rule: '#7A6B4E'    // separator brown
};
```
Don't introduce new colors without updating all components.
