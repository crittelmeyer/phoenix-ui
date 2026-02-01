# Phoenix State

**Last updated:** 2026-02-01
**Project:** Phoenix Design System Monorepo Starter

## Project Reference

**Core Value:**
AI agents (Claude Code specifically) can add, modify, and extend components without human hand-holding — because the repo structure, naming, patterns, and rules are explicit and enforced.

**Current Focus:**
Phase 4 Documentation Infrastructure IN PROGRESS - Storybook foundation complete.

## Current Position

**Phase:** 4 - Documentation Infrastructure (4 of 6) - IN PROGRESS
**Plan:** 1 of 3 plans complete (04-01)
**Status:** In Progress
**Last activity:** 2026-02-01 - Completed 04-01-PLAN.md (Storybook foundation)
**Progress:** ███████████████████████ 31/38 requirements (82%)

**Next Milestone:** Complete Phase 4 documentation infrastructure

## Performance Metrics

| Metric               | Value | Notes                                                                                                                                        |
| -------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Phases completed     | 3/6   | Foundation, Token System, and Core Components complete                                                                                       |
| Requirements shipped | 31/38 | Foundation (10), Token System (7), Core Components (11/15), Documentation (1/3)                                                              |
| Plans executed       | 10    | 01-01 (2min), 01-02 (4min), 01-03 (3.5min), 02-01 (5min), 02-02 (3min), 02-03 (2min), 03-01 (3min), 03-02 (2min), 03-03 (2min), 04-01 (4min) |
| Blockers             | 0     | —                                                                                                                                            |
| Research flags       | 0     | Research complete (SUMMARY.md)                                                                                                               |

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

**2026-02-01: Inline SVG icons instead of icon library**

- Use inline SVG paths for Select chevrons, Checkbox check, RadioGroup circle
- Avoid lucide-react dependency (1MB+ for just 3 icons)
- Self-contained components with no external icon dependencies
- Tradeoff: Slight code duplication vs. bundle size

**2026-02-01: Select compound component pattern**

- Export 10 separate parts from single file (Root, Trigger, Content, Item, etc.)
- Follows shadcn/ui convention for maximum composition flexibility
- Each part independently stylable and customizable
- Matches Radix UI primitive structure exactly

**2026-02-01: Radix Dialog primitive for Dialog component**

- Use @radix-ui/react-dialog for focus trap, Escape key, portal, accessibility
- Built-in ARIA attributes (aria-modal, role=dialog, aria-labelledby)
- Automatic focus return to trigger on close
- Zero custom focus management code needed

**2026-02-01: Default X close button in DialogContent**

- Include DialogPrimitive.Close button with X icon in top-right corner
- Follows shadcn/ui convention for better UX
- Users can override via children prop if different pattern needed
- Provides visual close affordance beyond Escape key

**2026-02-01: Dialog size via className prop (not variants)**

- No built-in size prop (sm/md/lg) on DialogContent
- Users apply max-w-sm/max-w-lg/max-w-[90vw] via className prop
- More flexible than CVA size variants, leverages cn() merging
- Simpler component API, full Tailwind utility flexibility

**2026-02-01: Barrel export timing in Phase 3**

- Created packages/ui/src/index.ts in Plan 03-03
- Re-exports all 7 components + cn utility (30+ named exports)
- Enables `import { Button, Input, Dialog } from "@phoenix/ui"` pattern
- Single source of truth for component imports established early

**2026-02-01: Storybook 8.6 instead of 10.x**

- Plan 04-01 specified Storybook 10.1.0, but version doesn't exist yet (latest is 8.6.15)
- Used @storybook packages at ^8.6.0 version range
- No functional impact - Storybook 8.6 has all needed features (Vite builder, addon-themes, MDX)
- Will upgrade to Storybook 10+ when released

**2026-02-01: Duplicate CSS for Storybook**

- Created apps/storybook/stories/index.css mirroring apps/web/src/index.css
- UI package has no index.css to import (source exports only via main: "src/index.ts")
- Duplicated all @import statements and @theme mappings (185 lines)
- Ensures Storybook has identical token setup to web app for accurate preview

**2026-02-01: Async Tailwind CSS plugin import in Storybook**

- @tailwindcss/vite is ESM-only package
- Used `await import('@tailwindcss/vite')` in viteFinal hook
- Matches web app pattern from Phase 2
- CJS deprecation warning expected and cosmetic (research Pitfall 1)

### Active TODOs

- [x] Monorepo scaffold (01-01 complete)
- [x] Web app with Vite + React Router (01-02 complete)
- [x] Complete Phase 1 with git hooks (01-03 complete)
- [x] DTCG tokens + Style Dictionary pipeline (02-01 complete)
- [x] Tailwind v4 @theme integration + dark mode (02-02 complete)
- [x] Token migration guide (02-03 complete)
- [x] Core component foundation (03-01 complete)
- [x] Form components: Select, Checkbox, Radio, Label (03-02 complete)
- [x] Dialog component and barrel export (03-03 complete)
- [x] Storybook foundation with Vite builder and tokens page (04-01 complete)
- [ ] Validate browser support requirements for Tailwind CSS 4 migration decision
- [ ] Monitor eslint-plugin-tailwindcss for Tailwind CSS 4 support

### Blockers

None - Phase 4 Plan 1 complete. Ready for Plan 2 (component stories).

### Research Notes

**Completed research:** research/SUMMARY.md

- Stack validated: pnpm 10, Turborepo 2.7, React 18.3.0, Tailwind CSS 4, Style Dictionary 5
- 12 critical pitfalls documented (React 19, Tailwind CSS 4 migration, Style Dictionary async)
- Phase structure validated against research recommendations

**Research flags for planning:**

- Phase 2 may need token spec research (DTCG compliance)
- Phase 5 may need form validation pattern research (react-hook-form + Zod)

## Session Continuity

**Last session:** 2026-02-01T22:36:24Z
**Stopped at:** Completed 04-01-PLAN.md (Storybook foundation)
**Resume file:** None

**What you were doing:**
Completed Phase 4 Plan 1 - Set up Storybook 8.6 with Vite builder, Tailwind CSS 4 integration, dark mode theme toggle, and tokens visualization page. Dev server runs on localhost:6006 with working theme switching.

**What's next:**
Continue Phase 4 with Plan 2 (component stories for basic components) or Plan 3 (compound component stories).

**Important context for next session:**

- Phase 1 COMPLETE: All 10 FNDN requirements shipped
- Phase 2 COMPLETE: All 7 TOKN requirements shipped
- Phase 3 COMPLETE: 11/15 COMP requirements shipped (remaining are docs/testing)
- Phase 4 IN PROGRESS: 1/3 DOCS requirements shipped (Storybook foundation)
- All 7 core components built: Button, Input, Textarea, Select, Checkbox, RadioGroup, Label, Dialog
- Barrel export enables: `import { Button, Input, Select, Dialog } from "@phoenix/ui"`
- Storybook environment ready: localhost:6006 with Tailwind CSS 4 and dark mode toggle
- Component pattern proven: forwardRef + cn() + semantic tokens + CVA (when needed)

**Key files created in Phase 3:**

- `packages/ui/src/lib/utils.ts` - cn() utility function
- `packages/ui/src/components/button.tsx` - Button with CVA variants + asChild
- `packages/ui/src/components/input.tsx` - Input with forwardRef
- `packages/ui/src/components/textarea.tsx` - Textarea with autoResize prop
- `packages/ui/src/components/select.tsx` - Select compound component (10 parts)
- `packages/ui/src/components/checkbox.tsx` - Checkbox with inline SVG check
- `packages/ui/src/components/radio-group.tsx` - RadioGroup compound (2 parts)
- `packages/ui/src/components/label.tsx` - Label with Radix primitive
- `packages/ui/src/components/dialog.tsx` - Dialog compound component (10 parts)
- `packages/ui/src/index.ts` - Barrel export (30+ named exports)

**Key files created in Phase 4 Plan 1:**

- `apps/storybook/.storybook/main.ts` - Storybook config with viteFinal hook
- `apps/storybook/.storybook/preview.ts` - Theme decorator with withThemeByClassName
- `apps/storybook/stories/index.css` - Duplicate of web app CSS with @theme mappings
- `apps/storybook/stories/Tokens.mdx` - Token visualization page

**Files to reference:**

- `/Users/chris/Repos/phoenix/.planning/PROJECT.md` - Core value and constraints
- `/Users/chris/Repos/phoenix/.planning/REQUIREMENTS.md` - All 38 v1 requirements with IDs
- `/Users/chris/Repos/phoenix/.planning/ROADMAP.md` - 6-phase structure
- `/Users/chris/Repos/phoenix/.planning/research/SUMMARY.md` - Critical pitfalls and architecture
- `/Users/chris/Repos/phoenix/.planning/phases/01-foundation/01-03-SUMMARY.md` - Phase 1 complete
- `/Users/chris/Repos/phoenix/.planning/phases/02-token-system/02-01-SUMMARY.md` - Token foundation
- `/Users/chris/Repos/phoenix/.planning/phases/02-token-system/02-02-SUMMARY.md` - Tailwind integration
- `/Users/chris/Repos/phoenix/.planning/phases/02-token-system/02-03-SUMMARY.md` - Migration guide
- `/Users/chris/Repos/phoenix/.planning/phases/03-core-components/03-01-SUMMARY.md` - Component foundation
- `/Users/chris/Repos/phoenix/.planning/phases/03-core-components/03-02-SUMMARY.md` - Form components
- `/Users/chris/Repos/phoenix/.planning/phases/03-core-components/03-03-SUMMARY.md` - Dialog and barrel export
- `/Users/chris/Repos/phoenix/.planning/phases/04-documentation-infrastructure/04-01-SUMMARY.md` - Storybook foundation (latest)

---

_State updated: 2026-02-01 after Phase 4 Plan 1 completion (04-01)_
