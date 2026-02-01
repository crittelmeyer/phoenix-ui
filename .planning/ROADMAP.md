# Phoenix Roadmap

**Project:** Phoenix Design System Monorepo Starter
**Created:** 2026-02-01
**Depth:** Standard (6 phases)

## Overview

Phoenix delivers an AI-first design system monorepo starter in 6 phases, following natural dependency order: foundation infrastructure → design tokens → core components → documentation → advanced components → AI integration. Every component uses the shadcn/ui pattern (CVA + Radix + semantic tokens), and the entire system is designed for Claude Code to work autonomously.

## Phases

### Phase 1: Foundation

**Goal:** Developer can clone, install, and run the monorepo with zero configuration.

**Status:** Complete (3/3 plans complete)

**Dependencies:** None (foundational)

**Plans:** 3 plans

Plans:

- [x] 01-01-PLAN.md — Root monorepo scaffolding + shared config packages + stub workspaces (complete 2026-02-01, 2min)
- [x] 01-02-PLAN.md — apps/web with Vite + React Router + Tailwind CSS 4 + welcome page (complete 2026-02-01, 4min)
- [x] 01-03-PLAN.md — Pre-commit hooks + rename script + full verification (complete 2026-02-01, 3.5min)

**Requirements:** FNDN-01, FNDN-02, FNDN-03, FNDN-04, FNDN-05, FNDN-06, FNDN-07, FNDN-08, FNDN-09, FNDN-10

**Success Criteria:**

1. Developer runs `pnpm install && pnpm dev` and sees working Vite dev server at localhost:5173
2. Pre-commit hooks block commits when lint, typecheck, or format:check fail
3. Turborepo correctly builds packages in dependency order (tokens → ui → apps)
4. ESLint catches arbitrary Tailwind values (mt-[13px]) and inline styles in packages/ui
5. All packages share TypeScript strict mode config and pass typecheck

**Scope:**

- pnpm 10 + Turborepo 2.7 monorepo scaffolding
- Workspace structure: apps/web, apps/storybook, packages/ui, packages/tokens
- React 18.3.0 pinned (Radix UI compatibility)
- Vite 7 + React Router 7 in apps/web
- TypeScript 5.9 with shared tsconfig base
- ESLint 9 + Prettier 3 with Tailwind class sorting
- ESLint rules: no arbitrary values, no inline styles in packages/ui
- Pre-commit hooks: lint, typecheck, format:check
- Turborepo pipeline with correct build ordering

---

### Phase 2: Token System

**Goal:** Components can reference semantic design tokens that work in light and dark modes.

**Status:** Planned (3 plans)

**Dependencies:** Phase 1 (requires monorepo build pipeline)

**Plans:** 3 plans

Plans:

- [ ] 02-01-PLAN.md — DTCG seed tokens + Style Dictionary build pipeline
- [ ] 02-02-PLAN.md — Tailwind v4 @theme integration + dark mode toggle in apps/web
- [ ] 02-03-PLAN.md — Token migration guide (Tokens Studio / Figma Variables)

**Requirements:** TOKN-01, TOKN-02, TOKN-03, TOKN-04, TOKN-05, TOKN-06, TOKN-07

**Success Criteria:**

1. Developer changes primary color in seed tokens, runs `pnpm build`, and sees updated color in CSS variables and Tailwind utilities
2. Toggling dark mode class on html element switches all semantic tokens (bg-surface, text-foreground) to dark values
3. apps/web can reference token-based Tailwind classes (bg-primary, text-foreground) in components
4. Style Dictionary build completes in under 2 seconds and outputs CSS variables; Tailwind v4 @theme directive maps these to utility classes
5. Documentation exists for migrating from seed tokens to Tokens Studio / Figma Variables

**Scope:**

- packages/tokens with Style Dictionary 5.1
- Seed token JSON files: colors (neutral, primary, destructive), spacing, typography, border radii
- Light and dark color schemes as separate token sets
- Style Dictionary transforms: JSON → CSS custom properties
- Tailwind v4 @theme directive in apps/web mapping token CSS variables to utility classes
- Dark mode via class strategy (class="dark")
- Migration guide: seed tokens → Tokens Studio / Figma Variables

---

### Phase 3: Core Components (Foundation)

**Goal:** Developer can build forms using Button, Input, Textarea, Select, Checkbox, and Radio components.

**Status:** Pending

**Dependencies:** Phase 2 (requires semantic tokens)

**Requirements:** COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, COMP-07, COMP-08

**Success Criteria:**

1. Developer imports Button from @phoenix/ui and uses variant="outline" size="lg" with full TypeScript autocomplete
2. All 6 components render with semantic tokens only (no arbitrary hex values in code)
3. Form inputs accept forwarded refs and work with uncontrolled Radix patterns
4. cn() utility correctly merges conflicting Tailwind classes (bg-red-500 + bg-blue-500 = bg-blue-500)
5. Components pass accessibility audit (keyboard navigation, ARIA labels, focus management)

**Scope:**

- cn() utility (clsx + tailwind-merge)
- Button component (CVA variants: default/outline/ghost, sizes: sm/md/lg)
- Input component (forwarded ref, semantic tokens)
- Textarea component (auto-resize option, semantic tokens)
- Select component (Radix Select primitive)
- Checkbox component (Radix Checkbox primitive)
- Radio component (Radix RadioGroup primitive)
- Dialog component (Radix Dialog primitive - included for early testing)
- All components use semantic tokens exclusively
- Barrel export from packages/ui/src/index.ts

---

### Phase 4: Documentation Infrastructure

**Goal:** Developer can view interactive documentation for all components in Storybook.

**Status:** Pending

**Dependencies:** Phase 3 (requires first 6 components to document)

**Requirements:** DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05

**Success Criteria:**

1. Developer runs `pnpm storybook` and sees interactive docs for Button, Input, Textarea, Select, Checkbox, Radio at localhost:6006
2. Each component story shows all variants and sizes with controls to toggle props
3. Tokens overview page visualizes all colors, spacing values, typography scales, and border radii
4. Figma Code Connect mappings link React components to Figma component definitions for all 6 components
5. README includes clone instructions, scope rename guide (@phoenix → @yourscope), and development workflow

**Scope:**

- Storybook 10.1 app in apps/storybook
- Vite integration with @tailwindcss/vite plugin (Tailwind CSS 4 support)
- One story per component (Button, Input, Textarea, Select, Checkbox, Radio)
- Stories demonstrate all variants, sizes, and states
- Tokens overview page with color swatches, spacing scale, typography samples
- Figma Code Connect mappings for 6 components
- README.md with setup, rename, and workflow instructions

---

### Phase 5: Core Components (Advanced)

**Goal:** Developer can build complex UIs with overlays, navigation, notifications, and forms.

**Status:** Pending

**Dependencies:** Phase 4 (requires Storybook for visual validation)

**Requirements:** COMP-09, COMP-10, COMP-11, COMP-12, COMP-13, COMP-14, COMP-15

**Success Criteria:**

1. Developer builds dropdown menu with nested items and keyboard navigation working correctly
2. Toast notifications appear/dismiss with animations and stack correctly
3. Form wrapper integrates react-hook-form with all input components and shows validation errors
4. All 12 components export from packages/ui/src/index.ts with tree-shakeable imports
5. Every component has Storybook story and Figma Code Connect mapping

**Scope:**

- DropdownMenu component (Radix DropdownMenu primitive)
- Tabs component (Radix Tabs primitive)
- Tooltip component (Radix Tooltip primitive)
- Toast component (Sonner integration)
- Form wrapper (react-hook-form integration with Zod)
- Update barrel exports in packages/ui/src/index.ts
- Enforce semantic tokens across all components (COMP-15)
- Storybook stories for all 6 new components
- Figma Code Connect mappings for all 6 new components

---

### Phase 6: AI Integration

**Goal:** Claude Code can add or modify components without human guidance.

**Status:** Pending

**Dependencies:** Phase 5 (requires complete component library to document patterns)

**Requirements:** AIML-01, AIML-02, AIML-03, AIML-04, AIML-05, AIML-06

**Success Criteria:**

1. CLAUDE.md at repo root explains project structure, conventions, and component authoring pattern
2. Path-scoped rules in .claude/rules/ activate only when working in specific packages (packages/ui, packages/tokens, apps/storybook)
3. Claude Code can add a new Accordion component following documented patterns without asking clarifying questions
4. AGENTS.md provides cross-tool compatibility for non-Claude AI agents
5. Token authoring rules prevent hardcoded values and enforce semantic token naming

**Scope:**

- CLAUDE.md at repo root (project overview, high-level conventions)
- .claude/rules/ui-components.md (component authoring pattern for packages/ui)
- .claude/rules/token-authoring.md (token constraints for packages/tokens)
- .claude/rules/storybook-stories.md (story authoring pattern for apps/storybook)
- AGENTS.md at repo root (cross-tool AI compatibility)
- Validation test: Claude adds new component following patterns (AIML-06)

---

## Progress

| Phase                            | Status   | Requirements | Completion    |
| -------------------------------- | -------- | ------------ | ------------- |
| 1 - Foundation                   | Complete | 10           | 100% (10 req) |
| 2 - Token System                 | Planned  | 7            | 0%            |
| 3 - Core Components (Foundation) | Pending  | 8            | 0%            |
| 4 - Documentation Infrastructure | Pending  | 5            | 0%            |
| 5 - Core Components (Advanced)   | Pending  | 7            | 0%            |
| 6 - AI Integration               | Pending  | 6            | 0%            |

**Total:** 38 requirements mapped across 6 phases

---

## Critical Path

```
Phase 1 (Foundation)
    ↓
Phase 2 (Token System)
    ↓
Phase 3 (Core Components Foundation) ← Must complete before Storybook
    ↓
Phase 4 (Documentation Infrastructure) ← Enables visual validation
    ↓
Phase 5 (Core Components Advanced) ← Uses Storybook for development
    ↓
Phase 6 (AI Integration) ← Requires complete component library
```

**Key Dependencies:**

- Tokens must build before components (semantic token references)
- Components must exist before Storybook (documentation target)
- Storybook enables workflow for remaining components
- AI rules require stable patterns from complete library

---

## Risk Flags

**Phase 1:**

- React 18.3.0 pinning required (Radix UI + React 19 infinite loop bug)
- Tailwind CSS 4 migration decision impacts browser support (Safari 16.4+)

**Phase 2:**

- Style Dictionary v5 requires ESM + async/await in build scripts
- Turborepo cache invalidation must track token file changes

**Phase 4:**

- Storybook requires explicit @tailwindcss/vite plugin for Tailwind CSS 4
- Figma Code Connect mappings depend on Figma file structure

**Phase 5:**

- react-hook-form + Zod integration needs error handling pattern research

---

_Last updated: 2026-02-01 after phase 02 plan revision (TOKN-04 clarified for @theme approach)_
