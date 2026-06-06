# Copi Prototype

This is a Vite + React version of the standalone Copi HTML prototype. The original bundled JSX has been preserved and moved into a deployable project structure.

## Run locally

```bash
npm install
npm run dev
```

## Build for Vercel

```bash
npm run build
```

Deploy the repository to Vercel as a Vite project. Add Supabase keys through Vercel Project Settings > Environment Variables.

## File map

- `src/App.jsx` — faithful concatenated React prototype, preserving page routing, modals, dashboards, local progress store, and lesson flows.
- `src/main.jsx` — app entry point.
- `src/styles.css` — global styles and font imports.
- `src/lib/supabaseClient.js` — ready-to-use Supabase client scaffold.
- `src/prototype/*` — cleanly named source modules extracted from the original bundle for easier future refactoring.
- `public/assets/*` — image assets extracted from the prototype.
