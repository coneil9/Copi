# TESTING.md

## Testing Strategy and Philosophy

**Current state**: This project has **no automated tests**.

The prototype prioritizes speed of iteration and visual fidelity over test coverage. All verification is manual:
- Open the app in a browser
- Click through user flows
- Verify localStorage state in DevTools
- Check console for errors

## What Gets Tested (Manually)

### Critical Paths to Verify After Changes

1. **Lesson completion flow**:
   - Log in as barista (lili@milano.coffee / copi2026)
   - Click current lesson on dashboard
   - Read content → take quiz → see results
   - Verify lesson marked complete in library
   - Verify next lesson unlocked
   - Verify activity feed shows completion
   - **Check**: `localStorage['copi.progress.v3']` shows updated lesson record

2. **Volume assignment flow**:
   - Log in as admin (admin@milano.coffee / copi2026)
   - Navigate to Curriculum tab
   - Click "Assign" on Vol III
   - Select baristas → click "Assign volume"
   - Log out, log in as assigned barista
   - Verify Vol III appears in library
   - **Check**: `localStorage['copi.progress.v3'].assignments['vol-3']` contains email

3. **Final test certification flow**:
   - Manually complete all 9 lessons in a volume (or edit localStorage)
   - Verify final test unlocks
   - Take final test, score 70%+
   - Verify certification badge appears in profile
   - Verify admin sees certification in team dashboard

4. **Progress calculation accuracy**:
   - Open console: `CopiStore.volumeStats('lili@milano.coffee', 'vol-1')`
   - Verify `{ done: 6, total: 9, pct: 0.666, certified: false }`
   - Verify matches what dashboard displays

5. **Data persistence**:
   - Complete a lesson
   - Refresh page
   - Verify lesson still marked complete
   - **Check**: Hard-refresh doesn't lose progress

## What Does Not Get Tested

- **Edge cases**: What if a quiz has 0 questions? (Doesn't happen in real content)
- **Error handling**: What if localStorage is full? (Not handled)
- **Browser compatibility**: Assumed modern Chrome/Safari/Firefox
- **Accessibility**: No ARIA labels, no keyboard nav testing
- **Performance**: No benchmarks for large team sizes (>100 baristas)
- **Security**: Passwords are hardcoded, no validation

These are acceptable for a prototype. If this becomes a production app, all of the above need testing.

## How to Run Tests

**There is no test runner.**

To verify the app works:

```bash
npm run dev
```

Then manually execute test scenarios in the browser.

## Test File Naming and Folder Conventions

Not applicable - no test files exist.

**If tests are added in the future**, recommended structure:

```
src/
├── __tests__/
│   ├── CopiStore.test.js       # Unit tests for store logic
│   ├── LessonPlayer.test.jsx   # Component tests
│   └── integration/
│       └── lesson-flow.test.js # End-to-end user flows
└── prototype/
    └── ...
```

Recommended tools:
- **Vitest** (Vite-native test runner)
- **React Testing Library** (component tests)
- **Playwright** (E2E tests)

## How to Write a New Test for This Project

### Unit Test Example (if Vitest were installed)

Testing `CopiStore.volumeStats()`:

```js
// src/__tests__/CopiStore.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import CopiStore from '../prototype/copi-store.jsx';

describe('CopiStore.volumeStats', () => {
  beforeEach(() => {
    CopiStore.resetAll(); // reset to seed state
  });

  it('calculates progress for a barista with partial completion', () => {
    const stats = CopiStore.volumeStats('pia@milano.coffee', 'vol-1');

    expect(stats).toEqual({
      done: 7,
      total: 9,
      pct: expect.closeTo(0.777, 2),
      certified: false,
      assigned: true
    });
  });

  it('shows certified: true when final test is passed', () => {
    const stats = CopiStore.volumeStats('linda@milano.coffee', 'vol-1');

    expect(stats.certified).toBe(true);
  });

  it('returns assigned: false for unassigned volumes', () => {
    const stats = CopiStore.volumeStats('devi@milano.coffee', 'vol-3');

    expect(stats.assigned).toBe(false);
  });
});
```

### Component Test Example (if React Testing Library were installed)

Testing `LessonPlayer` quiz flow:

```jsx
// src/__tests__/LessonPlayer.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LessonPlayer from '../prototype/lesson-player.jsx';

describe('LessonPlayer quiz phase', () => {
  it('shows correct feedback when answer is right', () => {
    const target = {
      kind: 'lesson',
      volId: 'vol-1',
      lessonId: 'v1l1'
    };

    render(
      <LessonPlayer
        open={true}
        email="test@example.com"
        target={target}
        onClose={() => {}}
      />
    );

    // Click through to quiz phase
    fireEvent.click(screen.getByText('Take the check'));

    // Select correct answer (index 2 for first question)
    const correctOption = screen.getByText('Southwestern Ethiopia');
    fireEvent.click(correctOption);

    // Submit
    fireEvent.click(screen.getByText('Submit answer'));

    // Verify feedback
    expect(screen.getByText(/Correct/i)).toBeInTheDocument();
  });
});
```

### Integration Test Example (if Playwright were installed)

Testing full lesson completion flow:

```js
// src/__tests__/integration/lesson-flow.test.js
import { test, expect } from '@playwright/test';

test('barista can complete a lesson and see progress update', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Log in as barista
  await page.fill('input[type="email"]', 'lili@milano.coffee');
  await page.fill('input[type="password"]', 'copi2026');
  await page.click('button:has-text("Log in")');

  // Click current lesson
  await page.click('text=Your next lesson');

  // Read phase
  await expect(page.locator('text=Ethiopia')).toBeVisible();
  await page.click('text=Take the check');

  // Quiz phase - answer all questions
  await page.click('text=Southwestern Ethiopia');
  await page.click('text=Submit answer');
  await page.click('text=Next question');

  // ... repeat for all questions ...

  // Results phase
  await expect(page.locator('text=Perfect score')).toBeVisible();
  await page.click('text=Back to today');

  // Verify progress updated
  const progress = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('copi.progress.v3'));
    return state.users['lili@milano.coffee'].lessons['v1l1'];
  });

  expect(progress.done).toBe(true);
});
```

## Testing Guidelines (for Future Contributors)

### What to Test

**Store logic** (highest priority):
- `CopiStore.lessonStatus()` - lesson locking/unlocking rules
- `CopiStore.volumeStats()` - progress calculation
- `CopiStore.completeLesson()` - state mutations
- `CopiStore.assignVolume()` - assignment logic

**Component behavior**:
- LessonPlayer quiz flow - correct/incorrect feedback
- Dashboard progress displays - reads store correctly
- Modals open/close - state management

**Integration**:
- Full lesson completion - all 3 phases
- Volume assignment - admin → barista visibility
- Certification - unlock final test, pass, badge appears

### What NOT to Test

- Inline styles (trust they render correctly)
- Marketing page content (visual QA only)
- Exact pixel positions (design can change)
- Browser-specific quirks (manual cross-browser testing)

### Test Data Strategy

Use the **seeded state** from `CopiStore.seedState()` as the baseline:
- Linda: fully certified
- Devi: new hire, minimal progress
- Pia: mid-progress

Reset before each test: `CopiStore.resetAll()`

### Mocking localStorage

If testing in Node (Vitest), mock localStorage:

```js
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
```

### Snapshot Testing (Not Recommended)

Don't snapshot entire component trees - they're too large and inline-styled. Snapshots will break on every minor design change.

Instead, **assert specific elements**:
```js
expect(screen.getByText('VOL · I')).toBeInTheDocument();
expect(screen.getByText('History of coffee')).toBeInTheDocument();
```
