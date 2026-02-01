# Phoenix State

**Last updated:** 2026-02-01
**Project:** Phoenix Design System Monorepo Starter

## Project Reference

**Core Value:**
AI agents (Claude Code specifically) can add, modify, and extend components without human hand-holding — because the repo structure, naming, patterns, and rules are explicit and enforced.

**Current Focus:**
Building Phase 1 Foundation - monorepo scaffold and development environment complete, ready for final plan (git hooks).

## Current Position

**Phase:** 1 - Foundation (1 of 6)
**Plan:** 01-02 complete (2 of 3 in phase)
**Status:** In progress
**Last activity:** 2026-02-01 - Completed 01-02-PLAN.md (Web app with Vite + React Router)
**Progress:** ██░░░░░░░░░░░░░░░░░░ 2/38 requirements (5%)

**Next Milestone:** Complete Phase 1 (Foundation) - 8 remaining requirements

## Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Phases completed | 0/6 | Phase 1 in progress |
| Requirements shipped | 2/38 | Monorepo + web app complete |
| Plans executed | 2/? | 01-01 (2min), 01-02 (4min) |
| Blockers | 0 | — |
| Research flags | 0 | Research complete (SUMMARY.md) |

## Accumulated Context

### Decisions Made

**2026-02-01: Roadmap structure**
- 6 phases following natural dependency order
- Foundation → Tokens → Components → Docs → Advanced Components → AI
- Standard depth (5-8 phases) applied based on config.json

**2026-02-01: React version constraint**
- React pinned to 18.3.0 due to Radix UI + React 19 infinite loop bug
- Documented in research/SUMMARY.md (Pitfall #1)
- Upgrade path: monitor GitHub issue #3799

**2026-02-01: Component split strategy**
- Phase 3: First 6 components (Button, Input, Textarea, Select, Checkbox, Radio, Dialog)
- Phase 5: Final 6 components (DropdownMenu, Tabs, Tooltip, Toast, Form, barrel exports)
- Rationale: Simple form primitives before complex overlay components

**2026-02-01: Source exports for HMR**
- All workspace packages use `main: "src/index.ts"` instead of dist builds
- Enables HMR during development (research recommendation)
- Build step will be added in later phase

**2026-02-01: ESLint strictness for token enforcement**
- Inline style ban via `react/forbid-dom-props` and `react/forbid-component-props`
- Forces developers to use Tailwind classes instead of inline styles
- Note: eslint-plugin-tailwindcss removed (incompatible with Tailwind CSS 4)

**2026-02-01: Tailwind CSS 4 ESLint plugin incompatibility**
- eslint-plugin-tailwindcss removed from shared ESLint config
- Plugin tries to import `resolveConfig` which doesn't exist in Tailwind CSS 4 architecture
- Inline style bans still enforce Tailwind usage
- Will re-evaluate when plugin updates for Tailwind CSS 4

**2026-02-01: TypeScript project references for monorepo**
- Workspace packages must set `noEmit: false` with `declaration: true` for composite builds
- Apps reference workspace packages via tsconfig references array
- Enables type checking across workspace boundaries

### Active TODOs

- [x] Monorepo scaffold (01-01 complete)
- [x] Web app with Vite + React Router (01-02 complete)
- [ ] Complete Phase 1 with final plan (Husky/git hooks)
- [ ] Validate browser support requirements for Tailwind CSS 4 migration decision
- [ ] Monitor eslint-plugin-tailwindcss for Tailwind CSS 4 support

### Blockers

None - ready to begin Phase 1 planning.

### Research Notes

**Completed research:** research/SUMMARY.md
- Stack validated: pnpm 10, Turborepo 2.7, React 18.3.0, Tailwind CSS 4, Style Dictionary 5
- 12 critical pitfalls documented (React 19, Tailwind CSS 4 migration, Style Dictionary async)
- Phase structure validated against research recommendations

**Research flags for planning:**
- Phase 2 may need token spec research (DTCG compliance)
- Phase 5 may need form validation pattern research (react-hook-form + Zod)

## Session Continuity

**Last session:** 2026-02-01T17:54:59Z
**Stopped at:** Completed 01-02-PLAN.md (Web app with Vite + React Router)
**Resume file:** None

**What you were doing:**
Executing Phase 1 Plan 2 - Created apps/web Vite application with React Router 7, Tailwind CSS 4, and Phoenix welcome page.

**What's next:**
Continue Phase 1 with Plan 3 (Husky/git hooks setup with commitlint and lint-staged).

**Important context for next session:**
- Vite dev server working at localhost:5173 with React Router and Tailwind CSS 4
- eslint-plugin-tailwindcss removed (incompatible with Tailwind CSS 4)
- TypeScript project references functional between apps/web and workspace packages
- Inline style bans enforce Tailwind class usage via react/forbid-dom-props
- Welcome page showcases Phoenix branding and monorepo features

**Key files created:**
- `.planning/phases/01-foundation/01-02-SUMMARY.md` - Execution summary with full context
- apps/web/vite.config.ts, apps/web/src/App.tsx, apps/web/src/routes/root.tsx
- apps/web/src/routes/components.tsx (placeholder for Phase 3)

**Files to reference:**
- `/Users/chris/Repos/phoenix/.planning/PROJECT.md` - Core value and constraints
- `/Users/chris/Repos/phoenix/.planning/REQUIREMENTS.md` - All 38 v1 requirements with IDs
- `/Users/chris/Repos/phoenix/.planning/ROADMAP.md` - 6-phase structure
- `/Users/chris/Repos/phoenix/.planning/research/SUMMARY.md` - Critical pitfalls and architecture
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-01-SUMMARY.md` - Monorepo scaffold execution
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-02-SUMMARY.md` - Latest execution context

---

*State updated: 2026-02-01 after plan 01-01 execution*
