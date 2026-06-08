# CONVENTIONS.md

## File and Folder Naming

### Pattern

- **Kebab-case for files**: `admin-dashboard.jsx`, `lesson-player.jsx`, `content-volume-history.jsx`
- **PascalCase for components**: `AdminDashboard`, `LessonPlayer`, `CopiStore`
- **Descriptive suffixes**:
  - `*-page.jsx` - Marketing pages (landing, pricing, about, curriculum)
  - `*-dashboard.jsx` - Main application views (admin, barista)
  - `*-modal.jsx` - Overlay modals (assign, barista-detail, add-team)
  - `content-*.jsx` - Curriculum content definitions
  - `*-illustration.jsx` - SVG graphics components

### Location Rules

- **All extracted modules** → `src/prototype/`
- **Main app** → `src/App.jsx` (monolith, do not split further)
- **Entry point** → `src/main.jsx` (do not modify)
- **Global styles** → `src/styles.css` (minimal, only fonts and resets)
- **Utilities** → `src/lib/` (currently only supabaseClient.js)
- **Static assets** → `public/assets/`

## Component/Module Structure Pattern

Every component follows the same structure:

```jsx
// ═════════════════════════════════════════════════════════
// COMPONENT NAME — One-line purpose statement
// Additional context about what this component does and
// how it fits into the app architecture.
// ═════════════════════════════════════════════════════════

function ComponentName({ prop1, prop2 }) {
  // 1. Color palette (always first)
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F',
    rule: '#7A6B4E'
  };

  // 2. Font style objects (always second)
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = {
    fontFamily: 'Lato',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontSize: 10
  };

  // 3. Store access (if needed)
  const store = window.useCopiStore();

  // 4. State
  const [state, setState] = React.useState(initialValue);

  // 5. Computed values

  // 6. Helper functions

  // 7. JSX return
  return (
    <div style={{ background: p.bg, color: p.fg }}>
      ...
    </div>
  );
}

// 8. Export to window (for modules loaded by App.jsx)
window.ComponentName = ComponentName;
```

### Modules in `src/prototype/`

All modules **export via `window`** and are **imported at the top of App.jsx**:

```jsx
// In src/prototype/lesson-player.jsx
function LessonPlayer({ ... }) { ... }
window.LessonPlayer = LessonPlayer;

// In src/App.jsx (top of file)
import './prototype/lesson-player.jsx';
// ... later in the file ...
const LessonPlayer = window.LessonPlayer;
```

This is intentional - preserves the original prototype's global namespace pattern.

## Import Ordering Conventions

Not applicable - there are almost no ES6 imports. All modules are loaded via script tags at the top of `App.jsx` and communicate via `window`.

**The one import you'll see**:
```jsx
import React from 'react';
```

**In main.jsx only**:
```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import CopiPrototype from './App.jsx';
```

## Variable and Function Naming

### Pattern

- **camelCase for variables and functions**: `currentLesson`, `lessonStatus`, `assignVolume`
- **PascalCase for components**: `LessonPlayer`, `BaristaDashboard`, `InkMark`
- **SCREAMING_SNAKE_CASE for constants**: `COPI_CURRICULUM`, `COPI_TEAM`, `STORE_KEY`, `PROTO_ADMIN`
- **Single letter for palette**: `const p = { ... }`
- **Descriptive names for store methods**: `isAssigned()`, `lessonStatus()`, `completeLesson()`

### Store Method Naming

**Read methods** (pure, no side effects):
- `isAssigned(email, volId)` - boolean checks
- `lessonStatus(email, volId, idx)` - status strings: 'locked' | 'current' | 'done'
- `volumeStats(email, volId)` - objects with computed stats
- `currentLesson(email)` - next action for a user

**Write methods** (mutate state + emit):
- `assignVolume(volId, emails)` - action verbs
- `completeLesson(email, lessonId, score, total)`
- `completeFinal(email, volId, score, total)`

**Never passive names like** `getLesson()`, `setLesson()` - use active voice.

## Styling Conventions

### Inline Styles Only

Every component defines the same palette and font objects, then uses them inline:

```jsx
const p = {
  bg: '#E8DDC2',     // beige paper background
  fg: '#1A1410',     // dark ink text
  accent: '#3F5A3A', // moss green
  cream: '#F4EBD2',  // cream
  sun: '#C68A3D',    // ochre/gold
  cherry: '#7A2B1F', // error red
  rule: '#7A6B4E'    // separator brown
};

return (
  <div style={{
    background: p.bg,
    color: p.fg,
    padding: '20px 48px'
  }}>
    <h1 style={{
      ...display,
      fontSize: 48,
      color: p.accent
    }}>
      Title
    </h1>
  </div>
);
```

### Style Object Spreading

Font styles are objects that get spread:

```jsx
const display = { fontFamily: 'Unna' };
const lbl = {
  fontFamily: 'Lato',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontSize: 10
};

<div style={{ ...display, fontSize: 32, fontStyle: 'italic' }}>
<div style={{ ...lbl, color: p.accent }}>
```

### No CSS Classes

The only CSS file is `src/styles.css`:
```css
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; margin: 0; }
body { background: #E8DDC2; font-family: -apple-system, ..., 'Lato', sans-serif; }
button, input, textarea, select { font: inherit; }
a { color: inherit; }
```

That's it. Everything else is inline.

### Color Comments

When defining the palette, include semantic comments:

```jsx
const p = {
  bg: '#E8DDC2',     // beige paper
  fg: '#1A1410',     // dark ink
  accent: '#3F5A3A', // moss
  ...
};
```

This makes the palette self-documenting.

## Git Commit Message Format

Not specified in the codebase. Use conventional commits if adopting a standard:

```
feat: add lesson completion animation
fix: quiz score calculation for peaberry question
docs: update CLAUDE.md with routing pattern
refactor: extract seed data to separate function
```

## Project-Specific Patterns

### Store Access Pattern

Never store the result of store calls in component state:

```jsx
// ❌ BAD - caching store data in state
const [progress, setProgress] = React.useState(store.overallPct(email));

// ✅ GOOD - read directly from store
const progress = store.overallPct(email);
```

The store already handles re-render triggers via `useCopiStore()`.

### Modal Open/Close Pattern

Modals are controlled by state in the parent component:

```jsx
const [lessonOpen, setLessonOpen] = React.useState(false);
const [lessonTarget, setLessonTarget] = React.useState(null);

const openLesson = (volId, lessonId) => {
  setLessonTarget({ kind: 'lesson', volId, lessonId });
  setLessonOpen(true);
};

<LessonPlayer
  open={lessonOpen}
  email={email}
  target={lessonTarget}
  onClose={() => setLessonOpen(false)}
/>
```

All modals follow this pattern: `open` prop, `onClose` callback.

### Activity Feed Pattern

When adding activity entries, prepend to the array and slice to 30:

```js
state.activity.unshift({
  who: nameFor(email),
  action: 'completed',
  label: `II-05 Anaerobic`,
  kind: 'complete',
  ts: Date.now()
});
state.activity = state.activity.slice(0, 30);
```

### Relative Time Display

Every dashboard has a `relTime()` helper:

```js
const relTime = (ts) => {
  if (!ts) return 'no activity';
  const s = (Date.now() - ts) / 1000;
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
  if (s < 86400) return Math.round(s / 3600) + 'h ago';
  const d = Math.round(s / 86400);
  return d <= 1 ? 'yesterday' : d + 'd ago';
};
```

Copy this pattern when showing timestamps.

### Percentage Display

Always round to whole numbers:

```js
const pct = Math.round(store.overallPct(email) * 100);
return <div>{pct}%</div>;
```

### Quiz Answer Format

Quiz questions always follow this structure:

```js
{
  q: 'Question text?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  answer: 2,  // zero-indexed
  why: 'Explanation of why this is correct.'
}
```

`answer` is the index into `options`, not the text.
