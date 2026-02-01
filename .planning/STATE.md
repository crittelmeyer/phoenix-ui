# Phoenix State

**Last updated:** 2026-02-01
**Project:** Phoenix Design System Monorepo Starter

## Project Reference

**Core Value:**
AI agents (Claude Code specifically) can add, modify, and extend components without human hand-holding — because the repo structure, naming, patterns, and rules are explicit and enforced.

**Current Focus:**
Phase 2 Token System COMPLETE - ready for Phase 3 (Core Components).

## Current Position

**Phase:** 3 - Core Components (3 of 6) - IN PROGRESS
**Plan:** 1 of 3 plans complete (03-01)
**Status:** In Progress
**Last activity:** 2026-02-01 - Completed 03-01-PLAN.md (Core component foundation)
**Progress:** ██████████████████░░ 25/38 requirements (66%)

**Next Milestone:** Continue Phase 3 (Form components - Select, Checkbox, Radio, Label)

## Performance Metrics

| Metric               | Value | Notes                                                                                              |
| -------------------- | ----- | -------------------------------------------------------------------------------------------------- |
| Phases completed     | 2/6   | Phase 1 and Phase 2 complete                                                                       |
| Requirements shipped | 25/38 | Foundation complete (10), Token System complete (7), Components started (4/15)                     |
| Plans executed       | 7     | 01-01 (2min), 01-02 (4min), 01-03 (3.5min), 02-01 (5min), 02-02 (3min), 02-03 (2min), 03-01 (3min) |
| Blockers             | 0     | —                                                                                                  |
| Research flags       | 0     | Research complete (SUMMARY.md)                                                                     |

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

**2026-02-01: Dual Style Dictionary instances for light/dark modes**

- Use separate StyleDictionary instances instead of single instance with filters
- Eliminates collision warnings between light and dark semantic tokens
- Light mode excludes .dark.json files, dark mode includes only .dark.json files
- Clearer separation of concerns, matches research pattern

**2026-02-01: OKLCH color format throughout token system**

- All color tokens use OKLCH format (e.g., "oklch(0.647 0.186 264.54)")
- Rationale: Perceptual uniformity, wide gamut P3 support, better accessibility
- Future-proof color system consistent with 2026 best practices

**2026-02-01: shadcn/ui semantic token convention**

- Follow shadcn/ui exactly: --background, --foreground, --primary-foreground, --muted, --accent, --destructive, --border, --input, --ring
- Enables zero translation layer for shadcn component adoption in Phase 3
- Ecosystem compatibility with existing shadcn patterns

**2026-02-01: 8px base spacing unit**

- 8px base with fractional multipliers (0.5, 1, 1.5, 2, 2.5...) up to 96 units
- Better visual rhythm than 4px, aligns with common design grids
- 33 spacing tokens covering micro (4px) to macro (768px) layouts

**2026-02-01: Tailwind v4 @theme comprehensive mapping**

- Map all semantic tokens AND full color scales in @theme directive
- Provides flexibility: semantic tokens (bg-primary) OR scale values (bg-primary-600)
- 185 lines in @theme directive for complete utility coverage
- Enables both design system constraints and granular control when needed

**2026-02-01: Class-based dark mode for manual control**

- Use .dark class toggle instead of media-query-only
- Gives users explicit control via ThemeToggle component
- Allows override of OS preference with localStorage persistence
- Single class toggle activates all dark mode token overrides

**2026-02-01: Flash prevention via synchronous inline script**

- Inline IIFE in head runs before any rendering
- Reads localStorage.theme and matchMedia for OS preference
- Applies .dark class synchronously to prevent white flash
- Zero FOUC (Flash of Unstyled Content) on dark mode page load

**2026-02-01: CVA for variant management**

- Use class-variance-authority for type-safe component variants
- Pattern: Define variants object with defaultVariants, extract VariantProps
- Provides IntelliSense autocomplete for variant/size props
- Eliminates manual className string concatenation
- Impact: All components with variants (Button, Select, Dialog) follow this pattern

**2026-02-01: Semantic token classes only in components**

- All component styling uses semantic tokens (bg-primary, text-foreground, border-input)
- Zero arbitrary values (no bg-[#hex] or text-[#hex])
- Ensures automatic dark mode support via CSS variable swapping
- Verified via grep check: no style= attributes, no arbitrary color values
- Impact: Components inherit theme changes automatically

**2026-02-01: Textarea autoResize pattern**

- Custom autoResize prop grows/shrinks textarea with content
- Reset-then-set pattern: height='auto' → height=scrollHeight prevents layout thrashing
- useLayoutEffect prevents visual flicker (runs before paint)
- Ref merging pattern: internal ref for measurement + forwarded ref for parent access
- Impact: Enhanced UX for multi-line inputs, pattern reusable for other auto-sizing needs

### Active TODOs

- [x] Monorepo scaffold (01-01 complete)
- [x] Web app with Vite + React Router (01-02 complete)
- [x] Complete Phase 1 with git hooks (01-03 complete)
- [x] DTCG tokens + Style Dictionary pipeline (02-01 complete)
- [x] Tailwind v4 @theme integration + dark mode (02-02 complete)
- [x] Token migration guide (02-03 complete)
- [x] Core component foundation (03-01 complete)
- [ ] Form components: Select, Checkbox, Radio, Label
- [ ] Validate browser support requirements for Tailwind CSS 4 migration decision
- [ ] Monitor eslint-plugin-tailwindcss for Tailwind CSS 4 support

### Blockers

None - Phase 3 Plan 1 complete, ready for Plan 2 (Form components).

### Research Notes

**Completed research:** research/SUMMARY.md

- Stack validated: pnpm 10, Turborepo 2.7, React 18.3.0, Tailwind CSS 4, Style Dictionary 5
- 12 critical pitfalls documented (React 19, Tailwind CSS 4 migration, Style Dictionary async)
- Phase structure validated against research recommendations

**Research flags for planning:**

- Phase 2 may need token spec research (DTCG compliance)
- Phase 5 may need form validation pattern research (react-hook-form + Zod)

## Session Continuity

**Last session:** 2026-02-01T20:40:15Z
**Stopped at:** Completed 03-01-PLAN.md (Core component foundation)
**Resume file:** None

**What you were doing:**
Completed Phase 3 Plan 1 - Created cn() utility and first 3 components (Button, Input, Textarea) establishing the component authoring pattern with CVA, forwardRef, and semantic tokens.

**What's next:**
Continue Phase 3: Plan 2 (Form components - Select, Checkbox, Radio, Label).

**Important context for next session:**

- Phase 1 COMPLETE: All 10 FNDN requirements shipped
- Phase 2 COMPLETE: All 7 TOKN requirements shipped
- Phase 3 STARTED: 4/15 COMP requirements shipped (COMP-01 through COMP-04)
- Component authoring pattern established: cn() + CVA + forwardRef + semantic tokens
- CVA proven with Button (6 variants, 4 sizes) and asChild polymorphism
- All Phase 3 dependencies installed (CVA, clsx, tailwind-merge, Radix UI packages)

**Key files created in Phase 3 Plan 1:**

- `packages/ui/src/lib/utils.ts` - cn() utility function
- `packages/ui/src/components/button.tsx` - Button with CVA variants + asChild
- `packages/ui/src/components/input.tsx` - Input with forwardRef
- `packages/ui/src/components/textarea.tsx` - Textarea with autoResize prop

**Files to reference:**

- `/Users/chris/Repos/phoenix/.planning/PROJECT.md` - Core value and constraints
- `/Users/chris/Repos/phoenix/.planning/REQUIREMENTS.md` - All 38 v1 requirements with IDs
- `/Users/chris/Repos/phoenix/.planning/ROADMAP.md` - 6-phase structure
- `/Users/chris/Repos/phoenix/.planning/research/SUMMARY.md` - Critical pitfalls and architecture
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-03-SUMMARY.md` - Phase 1 complete
- `/Users/chris/Repos/phoenix/.planning/phases/02-token-system/02-01-SUMMARY.md` - Token foundation
- `/Users/chris/Repos/phoenix/.planning/phases/02-token-system/02-02-SUMMARY.md` - Tailwind integration
- `/Users/chris/Repos/phoenix/.planning/phases/02-token-system/02-03-SUMMARY.md` - Migration guide
- `/Users/chris/Repos/phoenix/.planning/phases/03-core-components/03-01-SUMMARY.md` - Component foundation (latest)

---

_State updated: 2026-02-01 after Phase 3 Plan 1 completion (03-01)_
