# Copi Prototype

This is a Vite + React version of the standalone Copi HTML prototype. The original bundled JSX has been preserved and moved into a deployable project structure.

## Run locally

```bash
npm install
npm run dev
```

## Environment variables on a fresh clone

`.env` is gitignored (it holds secrets like `ANTHROPIC_API_KEY`). Vercel is the single source of truth for env vars — pull them down after cloning:

```bash
npm i -g vercel        # one-time, global
vercel link            # once per clone: connects the folder to the Copi Vercel project
vercel env pull        # writes current Vercel env vars into .env (Development scope by default)
```

Re-run `vercel env pull` whenever env vars change in Vercel. `.env.example` documents the required variable names.

## Build for Vercel

```bash
npm run build
```

Deploy the repository to Vercel as a Vite project. Env vars live in Vercel Project Settings > Environment Variables (see the Environment Variables section in `CLAUDE.md` for the exact list).

## File map

- `src/App.jsx` — faithful concatenated React prototype, preserving page routing, modals, dashboards, local progress store, and lesson flows.
- `src/main.jsx` — app entry point.
- `src/styles.css` — global styles and font imports.
- `src/lib/supabaseClient.js` — ready-to-use Supabase client scaffold.
- `src/prototype/*` — cleanly named source modules extracted from the original bundle for easier future refactoring.
- `public/assets/*` — image assets extracted from the prototype.
