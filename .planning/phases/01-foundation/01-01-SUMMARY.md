---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [pnpm, turborepo, typescript, eslint, prettier, tailwindcss, monorepo]

# Dependency graph
requires:
  - phase: research
    provides: Stack validation, pitfall identification, React 18.3.0 constraint
provides:
  - Complete pnpm workspace with 6 packages (root, ui, tokens, storybook, typescript-config, eslint-config)
  - Turborepo task orchestration with correct dependency ordering
  - Shared TypeScript strict mode configuration
  - Shared ESLint config with React + Tailwind rules (no-arbitrary-value, inline style ban)
  - Prettier with import sorting and Tailwind class sorting
  - React 18.3.0 pinned via pnpm.overrides
affects: [02-tokens, 03-components, 04-docs, 05-advanced, all future phases]

# Tech tracking
tech-stack:
  added:
    - pnpm 10.0.0 (workspace package manager)
    - Turborepo 2.8.1 (build orchestration)
    - TypeScript 5.9.3 (strict mode)
    - ESLint 9.39.2 (flat config)
    - Prettier 3.8.1 (code formatting)
    - prettier-plugin-tailwindcss 0.6.14 (class sorting)
    - @ianvs/prettier-plugin-sort-imports 4.7.0 (import sorting)
    - husky 9.1.7 (git hooks)
    - lint-staged 16.2.7 (pre-commit linting)
    - commitlint 19.8.1 (conventional commits)
    - React 18.3.0 (UI library, pinned)
  patterns:
    - Workspace packages with @phoenix/* scope
    - Source exports (main: src/index.ts) for HMR during development
    - Shared configs via workspace packages
    - ESLint 9 flat config pattern
    - Prettier plugin ordering (sort-imports first, tailwindcss last)

key-files:
  created:
    - package.json (root monorepo config)
    - pnpm-workspace.yaml (workspace discovery)
    - turbo.json (task orchestration)
    - .prettierrc.json (code formatting rules)
    - commitlint.config.mjs (commit message linting)
    - packages/typescript-config/base.json (strict mode base)
    - packages/typescript-config/react.json (React + DOM libs)
    - packages/eslint-config/base.mjs (base ESLint config)
    - packages/eslint-config/react.mjs (React + Tailwind rules)
    - packages/ui/package.json (UI component library stub)
    - packages/tokens/package.json (design token library stub)
    - apps/storybook/package.json (Storybook app stub)
  modified: []

key-decisions:
  - "React pinned to 18.3.0 via pnpm.overrides (Radix UI + React 19 bug)"
  - "Source exports (main: src/index.ts) for HMR during development"
  - "ESLint no-arbitrary-value rule set to error (enforce token usage)"
  - "ESLint inline style ban (enforce Tailwind classes)"
  - "Prettier Tailwind plugin MUST be last in plugins array"

patterns-established:
  - "Package scope: All workspace packages use @phoenix/* naming"
  - "Shared configs: typescript-config and eslint-config are workspace packages"
  - "Dependency ordering: tokens → ui → apps"
  - "Flat config only: ESLint 9 flat config (.mjs files)"
  - "Strict TypeScript: All packages extend base strict config"

# Metrics
duration: 2min
completed: 2026-02-01
---

# Phase 1 Plan 1: Monorepo Scaffold Summary

**Complete pnpm 10 monorepo with Turborepo 2 orchestration, strict TypeScript configs, ESLint 9 flat configs with Tailwind rules (no-arbitrary-value error, inline style ban), and React 18.3.0 pinned**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-01T17:44:58Z
- **Completed:** 2026-02-01T17:47:11Z
- **Tasks:** 2
- **Files modified:** 24

## Accomplishments

- Root monorepo configuration with pnpm workspaces and Turborepo task orchestration
- Shared TypeScript and ESLint configurations as workspace packages
- Stub workspace packages (ui, tokens, storybook) with correct dependency chain
- React 18.3.0 pinned across all packages via pnpm.overrides
- Prettier configured with import sorting + Tailwind class sorting (plugin ordering validated)
- ESLint rules enforce token usage (no-arbitrary-value: error) and ban inline styles

## Task Commits

Each task was committed atomically:

1. **Task 1: Create root monorepo configuration and shared tooling packages** - `405c8da` (chore)
2. **Task 2: Create stub workspace packages (ui, tokens, storybook)** - `7a03ff6` (feat)

**Plan metadata:** `2c4d7af` (docs: complete plan)

## Files Created/Modified

**Root configuration:**

- `package.json` - Root monorepo config with pnpm 10, Turborepo 2.7, React 18.3.0 overrides
- `pnpm-workspace.yaml` - Workspace package discovery (apps/_, packages/_)
- `.npmrc` - Engine strictness, auto-install-peers, public-hoist-pattern for React types
- `turbo.json` - Task orchestration with dependency ordering (^build)
- `.gitignore` - Standard ignores (node_modules, dist, .turbo, .env\*)
- `.prettierrc.json` - Formatting rules with plugin ordering (sort-imports, tailwindcss)
- `.prettierignore` - Ignore patterns
- `commitlint.config.mjs` - Conventional commits

**Shared tooling packages:**

- `packages/typescript-config/package.json` - TypeScript config package
- `packages/typescript-config/base.json` - Strict mode base config
- `packages/typescript-config/react.json` - React + DOM libs extending base
- `packages/eslint-config/package.json` - ESLint config package
- `packages/eslint-config/base.mjs` - Base ESLint flat config
- `packages/eslint-config/react.mjs` - React + Tailwind rules with no-arbitrary-value (error), inline style ban

**Workspace packages:**

- `packages/ui/package.json` - UI component library stub
- `packages/ui/src/index.ts` - Empty export with comment
- `packages/ui/tsconfig.json` - Extends @phoenix/typescript-config/react.json
- `packages/ui/eslint.config.mjs` - Extends @phoenix/eslint-config/react.mjs
- `packages/tokens/package.json` - Design token library stub
- `packages/tokens/src/index.ts` - Empty export with comment
- `packages/tokens/tsconfig.json` - Extends @phoenix/typescript-config/base.json
- `packages/tokens/eslint.config.mjs` - Extends @phoenix/eslint-config/base.mjs
- `apps/storybook/package.json` - Storybook app stub
- `apps/storybook/tsconfig.json` - Extends @phoenix/typescript-config/react.json
- `pnpm-lock.yaml` - Lockfile from successful install (4048 lines)

## Decisions Made

**React version constraint:** React pinned to 18.3.0 via pnpm.overrides due to Radix UI + React 19 infinite loop bug. This decision was documented in research phase and applied here.

**Source exports:** All workspace packages use `main: "src/index.ts"` instead of dist builds. This enables HMR during development as recommended in research findings.

**ESLint strictness:** Set `tailwindcss/no-arbitrary-value` to `error` (not warning) to enforce design token usage. Added inline style ban via `react/forbid-dom-props` and `react/forbid-component-props` to force Tailwind class usage.

**Prettier plugin ordering:** Tailwind plugin MUST be last in plugins array to ensure class sorting doesn't conflict with import sorting.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid Turborepo globalDependencies pattern**

- **Found during:** Task 2 (pnpm turbo run build --dry-run verification)
- **Issue:** turbo.json had `globalDependencies: ["!**/.env*"]` which caused "failed to parse glob expression" error
- **Fix:** Removed globalDependencies field entirely (negation patterns not supported in Turborepo 2.8.1)
- **Files modified:** turbo.json
- **Verification:** `pnpm turbo run build --dry-run` succeeded, showed correct task ordering
- **Committed in:** 7a03ff6 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Bug fix necessary for Turborepo to function. No scope creep.

## Issues Encountered

None - plan executed smoothly after fixing the Turborepo glob pattern.

## User Setup Required

None - no external service configuration required. This is pure local monorepo setup.

## Next Phase Readiness

**Ready for Phase 2 (Design Tokens):**

- ✅ pnpm workspace functional with all 6 packages
- ✅ Turborepo recognizes dependency chain (tokens → ui → apps)
- ✅ TypeScript strict mode shared across all packages
- ✅ ESLint rules ready to enforce token usage
- ✅ React 18.3.0 resolved consistently

**No blockers.**

**Next steps:**

- Phase 2 will install Style Dictionary 5 in tokens package
- Phase 2 will create token definitions and build pipeline
- Phase 3 will consume generated tokens in ui package

---

_Phase: 01-foundation_
_Completed: 2026-02-01_
