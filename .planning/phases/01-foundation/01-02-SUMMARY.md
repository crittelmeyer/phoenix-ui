---
phase: 01-foundation
plan: 02
subsystem: infra
tags: [vite, react, react-router, tailwindcss-4, typescript]

# Dependency graph
requires:
  - phase: 01-01
    provides: Monorepo scaffold, shared TypeScript/ESLint configs, workspace packages
provides:
  - Vite dev server application at apps/web with React Router 7 and Tailwind CSS 4
  - Welcome page with Phoenix branding and project description
  - Route skeleton for future component library showcase
  - TypeScript project references working between apps/web and workspace packages
affects: [01-03, 02-tokens, 03-components, 04-docs, all future app development]

# Tech tracking
tech-stack:
  added:
    - Vite 6.0.11 (dev server and bundler)
    - React Router 7.1.3 (routing)
    - Tailwind CSS 4.0.13 (styling via @tailwindcss/vite)
    - @vitejs/plugin-react 4.3.4 (React HMR)
  patterns:
    - TypeScript project references for monorepo type checking
    - Vite config with React + Tailwind CSS 4 plugins
    - React Router 7 route definition pattern
    - Tailwind CSS 4 @import directive (no PostCSS config needed)
    - ESLint ignores pattern in flat config

key-files:
  created:
    - apps/web/vite.config.ts (Vite config with React + Tailwind plugins)
    - apps/web/src/App.tsx (React Router route definitions)
    - apps/web/src/routes/root.tsx (Welcome page with Phoenix branding)
    - apps/web/src/routes/components.tsx (Component library placeholder)
    - apps/web/src/index.css (Tailwind CSS 4 import)
    - apps/web/tsconfig.app.json (TypeScript config with project references)
  modified:
    - packages/ui/tsconfig.json (Added declaration emit for project references)
    - packages/tokens/tsconfig.json (Added declaration emit for project references)

key-decisions:
  - "Removed eslint-plugin-tailwindcss - incompatible with Tailwind CSS 4 beta"
  - "TypeScript composite projects require noEmit: false with declaration emit"
  - "Apps/web uses ESLint ignores in flat config (no .eslintignore in ESLint 9)"

patterns-established:
  - "Vite apps use React + Tailwind CSS 4 via @tailwindcss/vite plugin"
  - "Tailwind CSS 4 import via @import directive in CSS (no PostCSS config)"
  - "Apps reference workspace packages via TypeScript project references"
  - "ESLint ignores via ignores property in flat config array"

# Metrics
duration: 4min
completed: 2026-02-01
---

# Phase 1 Plan 2: Web App Summary

**Vite 6 dev server with React Router 7, Tailwind CSS 4, and Phoenix welcome page showcasing monorepo structure**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-01T17:51:06Z
- **Completed:** 2026-02-01T17:54:59Z
- **Tasks:** 2
- **Files modified:** 18

## Accomplishments

- Created apps/web Vite application with React Router 7 and Tailwind CSS 4 via @tailwindcss/vite plugin
- Built welcome page with Phoenix branding, project description, and feature grid
- Established route skeleton for future component showcase
- Fixed TypeScript project references to enable composite builds across workspace
- Removed eslint-plugin-tailwindcss due to Tailwind CSS 4 incompatibility

## Task Commits

Each task was committed atomically:

1. **Task 1: Create apps/web Vite application with React Router and Tailwind CSS 4** - `07cd277` (feat)
2. **Task 2: Create welcome page and route skeleton** - `ce57894` (feat)
3. **Deviation fix: Remove eslint-plugin-tailwindcss** - `6520626` (fix)

**Plan metadata:** (pending - will be committed with SUMMARY.md)

## Files Created/Modified

**apps/web configuration:**
- `apps/web/package.json` - Vite app dependencies (react-router, vite, @tailwindcss/vite)
- `apps/web/vite.config.ts` - Vite config with React and Tailwind CSS 4 plugins
- `apps/web/tsconfig.json` - Project references to app and node configs
- `apps/web/tsconfig.app.json` - TypeScript config extending @phoenix/typescript-config/react.json with project references
- `apps/web/tsconfig.node.json` - TypeScript config for Vite config file
- `apps/web/eslint.config.mjs` - ESLint config with ignores for dist folder
- `apps/web/index.html` - HTML entry point for Vite

**apps/web source:**
- `apps/web/src/main.tsx` - React app entry point with BrowserRouter
- `apps/web/src/App.tsx` - React Router route definitions (/ and /components)
- `apps/web/src/index.css` - Tailwind CSS 4 @import directive
- `apps/web/src/vite-env.d.ts` - Vite client types reference
- `apps/web/src/routes/root.tsx` - Welcome page with Phoenix logo, branding, description, and feature grid
- `apps/web/src/routes/components.tsx` - Placeholder for future component library

**Workspace package fixes:**
- `packages/ui/tsconfig.json` - Added noEmit: false, declaration emit for project references
- `packages/tokens/tsconfig.json` - Added noEmit: false, declaration emit for project references
- `packages/eslint-config/react.mjs` - Removed eslint-plugin-tailwindcss (Tailwind CSS 4 incompatible)
- `packages/eslint-config/package.json` - Removed eslint-plugin-tailwindcss dependency
- `pnpm-lock.yaml` - Updated after dependency changes

## Decisions Made

**Removed eslint-plugin-tailwindcss:** The plugin is incompatible with Tailwind CSS 4 beta. It tries to import `resolveConfig` which doesn't exist in Tailwind CSS 4's new architecture. We still enforce no inline styles via `react/forbid-dom-props` and `react/forbid-component-props`. This was a necessary fix to unblock lint commands.

**TypeScript project references require declaration emit:** When using TypeScript project references with `composite: true`, referenced projects must have `noEmit: false` with `declaration: true` to emit type declarations. Updated ui and tokens packages to enable this.

**ESLint 9 uses ignores in flat config:** ESLint 9 flat config doesn't support .eslintignore files. Added ignores property to eslint.config.mjs to exclude dist folder from linting.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TypeScript project references for composite builds**
- **Found during:** Task 1 verification (pnpm --filter @phoenix/web typecheck)
- **Issue:** Referenced projects (ui, tokens) had noEmit: true inherited from base config, blocking composite builds with error "may not disable emit"
- **Fix:** Added noEmit: false, declaration: true, declarationMap: true, outDir: "dist" to ui and tokens tsconfig.json
- **Files modified:** packages/ui/tsconfig.json, packages/tokens/tsconfig.json
- **Verification:** `pnpm --filter @phoenix/web typecheck` passed
- **Committed in:** 07cd277 (Task 1 commit)

**2. [Rule 3 - Blocking] Removed eslint-plugin-tailwindcss (incompatible with Tailwind CSS 4)**
- **Found during:** Task verification (pnpm --filter @phoenix/web lint)
- **Issue:** eslint-plugin-tailwindcss tries to import `resolveConfig` from tailwindcss package, but Tailwind CSS 4 doesn't export it (new architecture). Error: "Package subpath './resolveConfig' is not defined by exports"
- **Fix:** Removed eslint-plugin-tailwindcss from packages/eslint-config, removed tailwindcss rules, added ignores to apps/web eslint.config.mjs. Inline style ban still enforces Tailwind usage.
- **Files modified:** packages/eslint-config/react.mjs, packages/eslint-config/package.json, apps/web/eslint.config.mjs, pnpm-lock.yaml
- **Verification:** `pnpm --filter @phoenix/web lint` passed with no errors
- **Committed in:** 6520626 (separate fix commit)

---

**Total deviations:** 2 auto-fixed (2 blocking issues)
**Impact on plan:** Both fixes necessary to enable TypeScript compilation and ESLint execution. No scope creep - just compatibility fixes for Tailwind CSS 4 beta and TypeScript composite projects.

## Issues Encountered

None beyond the auto-fixed blocking issues above. Both were expected edge cases when using Tailwind CSS 4 beta and TypeScript project references in a monorepo.

## User Setup Required

None - no external service configuration required. This is a local Vite dev server.

## Next Phase Readiness

**Ready for Phase 1 Plan 3 (Husky + git hooks):**
- ✅ Vite dev server working at localhost:5173
- ✅ React Router navigation functional between routes
- ✅ Tailwind CSS 4 utility classes rendering correctly
- ✅ TypeScript compilation passing
- ✅ ESLint running successfully
- ✅ Welcome page displays Phoenix branding

**Ready for Phase 2 (Design Tokens):**
- ✅ Tailwind CSS 4 configured and working
- ✅ Workspace package references functional
- ✅ UI can consume tokens package via project references

**No blockers.**

**Next steps:**
- Plan 01-03 will add Husky git hooks with commitlint and lint-staged
- Phase 2 will create design tokens with Style Dictionary
- Phase 3 will build component library consuming these tokens

---
*Phase: 01-foundation*
*Completed: 2026-02-01*
