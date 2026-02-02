# Phoenix State

**Last updated:** 2026-02-02
**Project:** Phoenix Design System Monorepo Starter

## Project Reference

**Core Value:**
AI agents (Claude Code specifically) can add, modify, and extend components without human hand-holding — because the repo structure, naming, patterns, and rules are explicit and enforced.

**Current Focus:**
Phase 6 AI Integration - COMPLETE. All AI agent documentation validated and working.

## Current Position

**Phase:** 6 - AI Integration (6 of 6) - COMPLETE
**Plan:** 3 of 3 plans complete (06-01, 06-02, 06-03)
**Status:** Phase 6 complete - All phases shipped
**Last activity:** 2026-02-02 - Completed 06-03-PLAN.md (Accordion validation test)
**Progress:** █████████████████████████████████ 42/42 requirements (100%)

**Next Milestone:** Complete Phase 6 (remaining 2 plans)

## Performance Metrics

| Metric               | Value | Notes                                                                                                                                                                                                                                                        |
| -------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phases completed     | 6/6   | All phases complete: Foundation, Token System, Core Components, Documentation, Advanced Components, AI Integration.                                                                                                                                          |
| Requirements shipped | 42/42 | Foundation (10), Token System (7), Core Components (15/15), Documentation (5/5), Advanced Components (4/4), AI Integration (1/1 - AIML-06 validation complete)                                                                                               |
| Plans executed       | 18    | 01-01 (2min), 01-02 (4min), 01-03 (3.5min), 02-01 (5min), 02-02 (3min), 02-03 (2min), 03-01 (3min), 03-02 (2min), 03-03 (2min), 04-01 (4min), 04-02 (2min), 04-03 (4min), 05-01 (3min), 05-02 (2min), 05-03 (2min), 06-01 (3min), 06-02 (5min), 06-03 (3min) |
| Blockers             | 0     | —                                                                                                                                                                                                                                                            |
| Research flags       | 0     | Research complete (SUMMARY.md)                                                                                                                                                                                                                               |

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

**2026-02-01: CSF 3.0 format for all stories**

- Used `const meta = { ... } satisfies Meta<typeof Component>` for type safety
- All stories include `tags: ['autodocs']` for automatic prop table generation
- Enables better IntelliSense and compile-time type checking
- Pattern established in 04-02 for all 7 component stories

**2026-02-01: Compound component documentation pattern**

- Select, RadioGroup, and Dialog use `subcomponents` property in meta
- Enables auto-docs to generate prop tables for all sub-parts
- Follows Storybook best practice from research (Pitfall 2)
- Interactive triggers (DialogTrigger with Button) for real-world usage demonstration

**2026-02-01: Figma Code Connect placeholder scaffolding**

- Created figma.config.json at repo root with include glob for .figma.tsx files
- All 7 components have co-located .figma.tsx placeholder files
- Placeholder URLs: `https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID`
- ESLint ignores .figma.tsx files to prevent false errors
- Rationale: Design file doesn't exist yet, but infrastructure ready for future Figma integration

**2026-02-01: AI-optimized root README.md**

- Explicit note that README is optimized for AI agents (Claude Code and similar tools)
- Documents exact tech stack versions, all conventions, and architectural patterns
- Includes monorepo structure tree, dependency graph, and development workflow
- Covers scope renaming via script, token modification workflow, component addition steps
- Rationale: AI agents need explicit context about patterns, constraints, and conventions to work autonomously

**2026-02-02: Install all Phase 5 dependencies at once**

- Installed 7 dependencies in Plan 05-01: @radix-ui/react-dropdown-menu, @radix-ui/react-tabs, @radix-ui/react-tooltip, sonner, react-hook-form, zod, @hookform/resolvers
- More efficient than per-plan installation, avoids repeated package.json commits
- Plans 05-02 and 05-03 won't need dependency installation tasks

**2026-02-02: CheckboxItem and RadioItem indicator pattern**

- CheckboxItem uses check path SVG matching Checkbox component for visual consistency
- RadioItem uses filled circle SVG matching RadioGroup pattern
- ItemIndicator primitive wraps SVG icon for automatic show/hide based on checked state
- Absolute positioning with left-2 and pl-8 padding for consistent alignment

**2026-02-02: DropdownMenu compound component pattern**

- 15 exported parts: Root, Trigger, Content, Item, CheckboxItem, RadioItem, Label, Separator, Shortcut, Group, Portal, Sub, SubContent, SubTrigger, RadioGroup
- Inset variant on MenuItem, SubTrigger, and Label for alignment with checkbox/radio items
- SubTrigger includes right chevron icon for visual affordance
- DropdownMenuShortcut as plain span (not forwardRef) for simplicity
- Most complex compound component to date, establishes pattern for future multi-part components

**2026-02-02: Underline-style tabs with border-bottom indicator**

- Active tab uses data-[state=active]:border-b-2 border-primary
- TabsContent does not use forceMount - hidden content unmounts from DOM
- Provides better performance than keeping all panels mounted
- Consistent with Dialog and overlay component unmounting behavior

**2026-02-02: Portal-wrapped tooltip with side-aware animations**

- TooltipContent rendered inside Portal for proper z-index stacking
- Side-aware slide animations using data-[side] attributes
- Default sideOffset of 4px for visual separation
- TooltipProvider enables shared delay configuration across components

**2026-02-02: Toast as Sonner wrapper with semantic tokens**

- Toaster component wraps Sonner with semantic token classNames
- Consumers import toast() from 'sonner' directly (not re-exported)
- Provides design system styling while maintaining third-party API
- Automatic dark mode support via semantic token CSS variables

**2026-02-02: Form component with dual React Context pattern**

- Form = direct re-export of FormProvider from react-hook-form
- FormFieldContext holds field name, FormItemContext holds auto-ID
- useFormField merges both contexts with react-hook-form state
- 8 exports: Form, FormField, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage, useFormField

**2026-02-02: Complete barrel export with 60+ named exports**

- All 13 component modules exported from index.ts
- Semantic token audit passed: zero hardcoded colors across library
- Zero inline styles in any component file

**2026-02-02: CLAUDE.md as comprehensive Claude Code reference**

- 492 lines covering all aspects of Phoenix project
- Loaded automatically when Claude Code starts session
- Points to .claude/rules/ for detailed templates (progressive disclosure)
- 12 critical pitfalls section prominent (React 18.3.0, no inline styles, semantic tokens only, etc.)

**2026-02-02: AGENTS.md as standalone cross-tool reference**

- 448 lines (comprehensive coverage, tool-agnostic)
- Follows Linux Foundation standard adopted by 60,000+ repos
- References CLAUDE.md 9 times for detailed patterns instead of duplicating content
- Tool-specific configuration sections for Cursor, Copilot, Claude, and other AI tools

**2026-02-02: Progressive disclosure documentation pattern**

- AGENTS.md: Quick start for any AI tool (tech stack, patterns, constraints)
- CLAUDE.md: Comprehensive reference for Claude Code (all details, pitfalls, decisions)
- .claude/rules/: Path-scoped templates for component/token/story authoring (future plans)
- Hierarchy enables AI agents to get oriented quickly and dive deeper as needed

**2026-02-02: Path-scoped rule files activate conditionally**

- Three rule files with YAML frontmatter glob patterns
- ui-components.md: packages/ui/src/components/\*\* and index.ts
- token-authoring.md: packages/tokens/src/tokens/\*\* and build.mjs
- storybook-stories.md: apps/storybook/stories/\*\*
- Rules load only when editing files in their scope, preventing context pollution

**2026-02-02: Component lifecycle checklist in ui-components.md**

- 4-step checklist ensures complete component workflow
- Step 1: Create component file in packages/ui/src/components/
- Step 2: Create Figma mapping (.figma.tsx)
- Step 3: Create story in apps/storybook/stories/
- Step 4: Update barrel export in packages/ui/src/index.ts
- Enables autonomous component addition without missing steps

**2026-02-02: OKLCH color format enforced in token-authoring.md**

- All color tokens MUST use OKLCH format: oklch(L C H)
- L (Lightness): 0-1, C (Chroma): 0-0.4, H (Hue): 0-360
- No hex, RGB, or HSL formats allowed
- Provides perceptual uniformity, P3 wide gamut support, better accessibility
- Anti-pattern section shows WRONG (hex) vs CORRECT (OKLCH) with explanations

**2026-02-02: Anti-pattern documentation structure in all rule files**

- All three rule files follow WRONG/CORRECT/WHY pattern
- Shows incorrect approach, correct approach, and detailed explanation
- ui-components.md: 7 anti-patterns (inline styles, arbitrary values, missing forwardRef/displayName/cn, color scales, hardcoded spacing)
- token-authoring.md: 6 anti-patterns (hex colors, missing units, hardcoded component values, editing dist/, RGB/HSL, missing $type)
- storybook-stories.md: 6 anti-patterns (Meta<any>, missing autodocs, hardcoded hex, default exports, missing subcomponents, inline functions)

**2026-02-02: CSF 3.0 with satisfies Meta pattern in storybook-stories.md**

- Enforces `satisfies Meta<typeof Component>` instead of `satisfies Meta<any>`
- Provides type checking for argTypes and enables IntelliSense
- `tags: ['autodocs']` required for automatic prop table generation
- `subcomponents` property required for compound component stories
- Story naming conventions: Default, AllVariants, WithDisabled, [SpecificFeature]

**2026-02-02: Accordion validation proves AI documentation sufficiency**

- Claude created Accordion component autonomously by following CLAUDE.md and .claude/rules/
- Zero prior Phoenix context beyond documentation files
- Component correct on first attempt: forwardRef, cn(), semantic tokens, displayName on all parts
- Zero inline styles, zero arbitrary values, full component lifecycle completed
- Validates Phoenix core value: AI agents can add components without human hand-holding
- Pattern proven scalable for future component additions

**2026-02-02: CSS keyframes for Radix animations**

- Added accordion-down and accordion-up @keyframes to both web and storybook apps
- Uses --radix-accordion-content-height CSS variable for smooth height transitions
- Pattern reusable for other Radix components with dynamic height (Collapsible, NavigationMenu)
- Enables smooth expand/collapse animations without JavaScript

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
- [x] Component stories for all 7 core components (04-02 complete)
- [x] Figma Code Connect scaffolding and root README (04-03 complete)
- [x] DropdownMenu component with Phase 5 dependencies (05-01 complete)
- [x] Tabs, Tooltip, Toast components (05-02 complete)
- [x] Form component and barrel exports (05-03 complete)
- [x] CLAUDE.md and AGENTS.md AI agent documentation (06-01 complete)
- [x] .claude/rules/ directory with path-scoped templates (06-02 complete)
- [x] Accordion validation test proves AI documentation sufficiency (06-03 complete)
- [ ] Validate browser support requirements for Tailwind CSS 4 migration decision
- [ ] Monitor eslint-plugin-tailwindcss for Tailwind CSS 4 support

### Blockers

None - All 6 phases complete. Phoenix v1 shipped.

### Research Notes

**Completed research:** research/SUMMARY.md

- Stack validated: pnpm 10, Turborepo 2.7, React 18.3.0, Tailwind CSS 4, Style Dictionary 5
- 12 critical pitfalls documented (React 19, Tailwind CSS 4 migration, Style Dictionary async)
- Phase structure validated against research recommendations

**Research flags for planning:**

- Phase 2 may need token spec research (DTCG compliance)
- Phase 5 may need form validation pattern research (react-hook-form + Zod)

## Session Continuity

**Last session:** 2026-02-02T13:15:06Z
**Stopped at:** Completed 06-03-PLAN.md (Accordion validation test)
**Resume file:** None

**What you were doing:**
Completed Phase 6 Plan 3 - Created Accordion component autonomously by following CLAUDE.md and .claude/rules/. Validated that AI documentation enables component additions without human hand-holding. Added CSS keyframes for accordion animations. Human verification confirmed component works correctly in Storybook.

**What's next:**
Phoenix v1 complete. All 6 phases shipped, all 42 requirements satisfied. Core value validated: AI agents can add components autonomously.

**Important context for next session:**

- Phase 1 COMPLETE: All 10 FNDN requirements shipped
- Phase 2 COMPLETE: All 7 TOKN requirements shipped
- Phase 3 COMPLETE: All 15 COMP requirements shipped
- Phase 4 COMPLETE: All 5 DOCS requirements shipped
- Phase 5 COMPLETE: All 4 advanced component requirements shipped
- Phase 6 COMPLETE: All 1 AI Integration requirements shipped (AIML-06 validated)
- All 14 components built with Storybook stories and Figma Code Connect mappings (13 planned + Accordion validation)
- Barrel export: 64 named exports from `@phoenix/ui`
- Semantic token audit passed: zero hardcoded colors across all components
- Component pattern proven: forwardRef + cn() + semantic tokens + CVA (when needed)
- Story pattern proven: CSF 3.0 with tags: ['autodocs'] and subcomponents
- AI documentation foundation: CLAUDE.md (492 lines) and AGENTS.md (448 lines) at repo root
- Progressive disclosure pattern established: AGENTS → CLAUDE → .claude/rules/
- AI rule files: ui-components.md (423 lines), token-authoring.md (426 lines), storybook-stories.md (344 lines)
- Path-scoped rules with YAML frontmatter for conditional activation
- AI autonomy validated: Claude created Accordion component from documentation alone

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
- `packages/ui/src/components/dropdown-menu.tsx` - DropdownMenu compound component (15 parts)
- `packages/ui/src/index.ts` - Barrel export (45+ named exports)

**Key files created in Phase 4:**

- `apps/storybook/.storybook/main.ts` - Storybook config with viteFinal hook (04-01)
- `apps/storybook/.storybook/preview.ts` - Theme decorator with withThemeByClassName (04-01)
- `apps/storybook/stories/index.css` - Duplicate of web app CSS with @theme mappings (04-01)
- `apps/storybook/stories/Tokens.mdx` - Token visualization page (04-01)
- `apps/storybook/stories/Button.stories.tsx` - Button stories with all variants and sizes (04-02)
- `apps/storybook/stories/Input.stories.tsx` - Input stories with types and states (04-02)
- `apps/storybook/stories/Textarea.stories.tsx` - Textarea stories with autoResize (04-02)
- `apps/storybook/stories/Checkbox.stories.tsx` - Checkbox stories with checked states (04-02)
- `apps/storybook/stories/Select.stories.tsx` - Select compound component stories (04-02)
- `apps/storybook/stories/RadioGroup.stories.tsx` - RadioGroup stories with layouts (04-02)
- `apps/storybook/stories/Dialog.stories.tsx` - Dialog compound component stories (04-02)
- `figma.config.json` - Figma Code Connect root configuration (04-03)
- `packages/ui/src/components/*.figma.tsx` - 7 Figma Code Connect placeholder mappings (04-03)
- `README.md` - Comprehensive root documentation optimized for AI agents (04-03)

**Key files created in Phase 5:**

- `packages/ui/src/components/dropdown-menu.tsx` - DropdownMenu compound component with 15 parts (05-01)
- `packages/ui/src/components/dropdown-menu.figma.tsx` - DropdownMenu Figma Code Connect mapping (05-01)
- `apps/storybook/stories/DropdownMenu.stories.tsx` - DropdownMenu stories with checkbox, radio, and submenu examples (05-01)
- `packages/ui/src/components/tabs.tsx` - Tabs compound component with 4 parts (05-02)
- `packages/ui/src/components/tabs.figma.tsx` - Tabs Figma Code Connect mapping (05-02)
- `apps/storybook/stories/Tabs.stories.tsx` - Tabs stories with disabled and full-width variants (05-02)
- `packages/ui/src/components/tooltip.tsx` - Tooltip compound component with 5 parts (05-02)
- `packages/ui/src/components/tooltip.figma.tsx` - Tooltip Figma Code Connect mapping (05-02)
- `apps/storybook/stories/Tooltip.stories.tsx` - Tooltip stories with arrow and position variants (05-02)
- `packages/ui/src/components/toast.tsx` - Toaster wrapper for Sonner (05-02)
- `packages/ui/src/components/toast.figma.tsx` - Toast Figma Code Connect mapping (05-02)
- `apps/storybook/stories/Toast.stories.tsx` - Toast stories with variants and actions (05-02)
- `packages/ui/src/components/form.tsx` - Form component with react-hook-form context (05-03)
- `packages/ui/src/components/form.figma.tsx` - Form Figma Code Connect mapping (05-03)
- `apps/storybook/stories/Form.stories.tsx` - Form stories with Zod validation (05-03)

**Key files created in Phase 6:**

- `CLAUDE.md` - Comprehensive Claude Code reference (492 lines) at repo root (06-01)
- `AGENTS.md` - Cross-tool AI agent reference (448 lines) at repo root (06-01)
- `.claude/rules/ui-components.md` - Component authoring templates and checklist (423 lines) (06-02)
- `.claude/rules/token-authoring.md` - DTCG token format and OKLCH color rules (426 lines) (06-02)
- `.claude/rules/storybook-stories.md` - CSF 3.0 story templates and conventions (344 lines) (06-02)
- `packages/ui/src/components/accordion.tsx` - Accordion compound component validation (06-03)
- `packages/ui/src/components/accordion.figma.tsx` - Accordion Figma Code Connect mapping (06-03)
- `apps/storybook/stories/Accordion.stories.tsx` - Accordion CSF 3.0 stories (06-03)

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
- `/Users/chris/Repos/phoenix/.planning/phases/04-documentation-infrastructure/04-01-SUMMARY.md` - Storybook foundation
- `/Users/chris/Repos/phoenix/.planning/phases/04-documentation-infrastructure/04-02-SUMMARY.md` - Component stories
- `/Users/chris/Repos/phoenix/.planning/phases/04-documentation-infrastructure/04-03-SUMMARY.md` - Figma Code Connect and root README
- `/Users/chris/Repos/phoenix/.planning/phases/05-core-components-advanced/05-01-SUMMARY.md` - DropdownMenu component and Phase 5 dependencies
- `/Users/chris/Repos/phoenix/.planning/phases/05-core-components-advanced/05-02-SUMMARY.md` - Tabs, Tooltip, and Toast components
- `/Users/chris/Repos/phoenix/.planning/phases/05-core-components-advanced/05-03-SUMMARY.md` - Form component and barrel exports
- `/Users/chris/Repos/phoenix/.planning/phases/06-ai-integration/06-01-SUMMARY.md` - CLAUDE.md and AGENTS.md documentation
- `/Users/chris/Repos/phoenix/.planning/phases/06-ai-integration/06-02-SUMMARY.md` - AI rule files
- `/Users/chris/Repos/phoenix/.planning/phases/06-ai-integration/06-03-SUMMARY.md` - Accordion validation test (latest)

---

_State updated: 2026-02-02 after Phase 6 Plan 3 completion (06-03) - All phases complete, Phoenix v1 shipped_
