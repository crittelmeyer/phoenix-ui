# Phoenix State

**Last updated:** 2026-02-01
**Project:** Phoenix Design System Monorepo Starter

## Project Reference

**Core Value:**
AI agents (Claude Code specifically) can add, modify, and extend components without human hand-holding — because the repo structure, naming, patterns, and rules are explicit and enforced.

**Current Focus:**
Phase 1 Foundation COMPLETE - ready for Phase 2 (Design Tokens).

## Current Position

**Phase:** 2 - Token System (2 of 6) - IN PROGRESS
**Plan:** 02-03 complete (1 of 3 in phase)
**Status:** In progress
**Last activity:** 2026-02-01 - Completed 02-03-PLAN.md (Token migration guide)
**Progress:** ███████████░░░░░░░░░ 11/38 requirements (29%)

**Next Milestone:** Complete Phase 2 plans 02-01 and 02-02 (running in parallel)

## Performance Metrics

| Metric               | Value | Notes                                                    |
| -------------------- | ----- | -------------------------------------------------------- |
| Phases completed     | 1/6   | Phase 1 complete, Phase 2 in progress                    |
| Requirements shipped | 11/38 | Foundation complete, TOKN-07 shipped                     |
| Plans executed       | 4/?   | 01-01 (2min), 01-02 (4min), 01-03 (3.5min), 02-03 (2min) |
| Blockers             | 0     | —                                                        |
| Research flags       | 0     | Research complete (SUMMARY.md)                           |

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

**2026-02-01: Pre-commit hook strategy**

- lint-staged runs prettier on staged files only
- Separate `pnpm turbo run typecheck` runs on all packages
- Rationale: TypeScript checks project graph, not individual files
- Commit-msg hook enforces Conventional Commits via commitlint

**2026-02-01: lint-staged simplified to prettier only**

- Original plan had ESLint + prettier in lint-staged
- ESLint not available at root level (workspace package tool)
- Solution: Prettier in lint-staged, ESLint via turbo in CI/manual
- Tradeoff: Staged files not linted immediately, but formatted

**2026-02-01: Three-path migration strategy for design tokens**

- Token migration guide documents Tokens Studio (bidirectional), Figma Variables (native), and seed-only (AI-first) workflows
- Rationale: AI-agent-first core value means JSON-only workflow is equally valid for developer/AI teams
- OKLCH compatibility caveat included (cutting-edge format may lag in design tool support)

### Active TODOs

- [x] Monorepo scaffold (01-01 complete)
- [x] Web app with Vite + React Router (01-02 complete)
- [x] Complete Phase 1 with git hooks (01-03 complete)
- [x] Token migration guide (02-03 complete)
- [ ] Complete Phase 2 plans 02-01 and 02-02 (parallel execution)
- [ ] Validate browser support requirements for Tailwind CSS 4 migration decision
- [ ] Monitor eslint-plugin-tailwindcss for Tailwind CSS 4 support

### Blockers

None - Phase 2 in progress (plan 02-03 complete, plans 02-01 and 02-02 running in parallel).

### Research Notes

**Completed research:** research/SUMMARY.md

- Stack validated: pnpm 10, Turborepo 2.7, React 18.3.0, Tailwind CSS 4, Style Dictionary 5
- 12 critical pitfalls documented (React 19, Tailwind CSS 4 migration, Style Dictionary async)
- Phase structure validated against research recommendations

**Research flags for planning:**

- Phase 2 may need token spec research (DTCG compliance)
- Phase 5 may need form validation pattern research (react-hook-form + Zod)

## Session Continuity

**Last session:** 2026-02-01T18:56:38Z
**Stopped at:** Completed 02-03-PLAN.md (Token migration guide)
**Resume file:** None

**What you were doing:**
Executing Phase 2 Plan 3 - Created token migration guide documenting DTCG-to-Tokens Studio and DTCG-to-Figma Variables migration paths, plus AI-first seed-only workflow.

**What's next:**
Wait for parallel plans 02-01 and 02-02 to complete (DTCG tokens + Style Dictionary pipeline).

**Important context for next session:**

- Phase 1 COMPLETE: All 10 FNDN requirements shipped
- Phase 2 in progress: Plan 02-03 complete (TOKN-07 shipped)
- Plans 02-01 and 02-02 running in parallel with 02-03
- Token migration guide covers three paths: Tokens Studio (bidirectional), Figma Variables (native), seed-only (AI-first)
- OKLCH format caveat documented for design tool compatibility

**Key files created:**

- `docs/token-migration.md` - 224-line migration guide with DTCG format explanation, Tokens Studio and Figma Variables paths, and comparison table
- `.planning/phases/02-token-system/02-03-SUMMARY.md` - Execution summary

**Files to reference:**

- `/Users/chris/Repos/phoenix/.planning/PROJECT.md` - Core value and constraints
- `/Users/chris/Repos/phoenix/.planning/REQUIREMENTS.md` - All 38 v1 requirements with IDs
- `/Users/chris/Repos/phoenix/.planning/ROADMAP.md` - 6-phase structure
- `/Users/chris/Repos/phoenix/.planning/research/SUMMARY.md` - Critical pitfalls and architecture
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-01-SUMMARY.md` - Monorepo scaffold
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-02-SUMMARY.md` - Web app setup
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-03-SUMMARY.md` - Git hooks (latest)

---

_State updated: 2026-02-01 after plan 01-03 execution_
