# Milestone v1: Phoenix Design System Monorepo Starter

**Status:** SHIPPED 2026-02-02
**Phases:** 1-6
**Total Plans:** 18

## Overview

Phoenix delivers an AI-first design system monorepo starter in 6 phases, following natural dependency order: foundation infrastructure, design tokens, core components, documentation, advanced components, AI integration. Every component uses the shadcn/ui pattern (CVA + Radix + semantic tokens), and the entire system is designed for Claude Code to work autonomously.

## Phases

### Phase 1: Foundation

**Goal:** Developer can clone, install, and run the monorepo with zero configuration.
**Depends on:** None (foundational)
**Plans:** 3 plans

Plans:

- [x] 01-01: Root monorepo scaffolding + shared config packages + stub workspaces
- [x] 01-02: apps/web with Vite + React Router + Tailwind CSS 4 + welcome page
- [x] 01-03: Pre-commit hooks + rename script + full verification

**Scope:** pnpm 10 + Turborepo 2.7, React 18.3.0 pinned, Vite 7 + React Router 7, TypeScript 5.9, ESLint 9 + Prettier 3, pre-commit hooks

**Requirements:** FNDN-01 through FNDN-10

---

### Phase 2: Token System

**Goal:** Components can reference semantic design tokens that work in light and dark modes.
**Depends on:** Phase 1
**Plans:** 3 plans

Plans:

- [x] 02-01: DTCG seed tokens + Style Dictionary build pipeline
- [x] 02-02: Tailwind v4 @theme integration + dark mode toggle in apps/web
- [x] 02-03: Token migration guide (Tokens Studio / Figma Variables)

**Scope:** Style Dictionary 5.1, DTCG JSON format, OKLCH colors, light/dark schemes, Tailwind v4 @theme directive, class-based dark mode

**Requirements:** TOKN-01 through TOKN-07

---

### Phase 3: Core Components (Foundation)

**Goal:** Developer can build forms using Button, Input, Textarea, Select, Checkbox, and Radio components.
**Depends on:** Phase 2
**Plans:** 3 plans

Plans:

- [x] 03-01: Install deps, cn() utility, Button, Input, Textarea
- [x] 03-02: Select, Checkbox, RadioGroup, Label (Radix form primitives)
- [x] 03-03: Dialog compound component + barrel exports

**Scope:** cn() utility, Button (CVA), Input, Textarea (autoResize), Select (10 parts), Checkbox, Radio, Dialog (10 parts), barrel export

**Requirements:** COMP-01 through COMP-08

---

### Phase 4: Documentation Infrastructure

**Goal:** Developer can view interactive documentation for all components in Storybook.
**Depends on:** Phase 3
**Plans:** 3 plans

Plans:

- [x] 04-01: Storybook app setup with Vite + Tailwind CSS 4 + dark mode + tokens overview page
- [x] 04-02: Component stories for all 7 components
- [x] 04-03: Figma Code Connect scaffolding + root README.md

**Scope:** Storybook 8.6, CSF 3.0 stories, Tokens overview page, Figma Code Connect mappings, README.md

**Requirements:** DOCS-01 through DOCS-05

---

### Phase 5: Core Components (Advanced)

**Goal:** Developer can build complex UIs with overlays, navigation, notifications, and forms.
**Depends on:** Phase 4
**Plans:** 3 plans

Plans:

- [x] 05-01: DropdownMenu component + story + Figma Code Connect
- [x] 05-02: Tabs + Tooltip + Toast components + stories + Figma Code Connect
- [x] 05-03: Form wrapper (react-hook-form + Zod) + barrel exports + semantic token audit

**Scope:** DropdownMenu (15 parts), Tabs, Tooltip, Toast (Sonner), Form (react-hook-form + Zod), barrel exports, semantic token audit

**Requirements:** COMP-09 through COMP-15

---

### Phase 6: AI Integration

**Goal:** Claude Code can add or modify components without human guidance.
**Depends on:** Phase 5
**Plans:** 3 plans

Plans:

- [x] 06-01: CLAUDE.md + AGENTS.md at repo root
- [x] 06-02: Path-scoped .claude/rules/ (ui-components, token-authoring, storybook-stories)
- [x] 06-03: Validation test: Accordion component added following documented patterns

**Scope:** CLAUDE.md (492 lines), AGENTS.md (448 lines), 3 path-scoped rule files, Accordion validation test

**Requirements:** AIML-01 through AIML-06

---

## Milestone Summary

**Key Decisions:**

- React 18.3.0 pinned (Radix UI + React 19 infinite loop bug)
- Tailwind CSS 4 with @theme directive (not tailwind.config.js)
- eslint-plugin-tailwindcss removed (incompatible with Tailwind CSS 4)
- Source exports for HMR (main: "src/index.ts")
- OKLCH color format throughout token system
- shadcn/ui semantic token convention
- CVA for variant management
- Inline SVG icons instead of icon library dependency
- Storybook 8.6 (10.x not yet released)
- Duplicate CSS for Storybook (UI package has no CSS)
- Progressive disclosure AI documentation pattern (AGENTS → CLAUDE → .claude/rules/)

**Issues Resolved:**

- Tailwind CSS 4 ESLint plugin incompatibility (removed plugin)
- Storybook ESM-only @tailwindcss/vite import (async import pattern)
- Style Dictionary dual instances for light/dark modes
- Compound component Storybook argTypes (manual argTypes for Radix Root re-exports)

**Issues Deferred:**

- FNDN-07: eslint-plugin-tailwindcss (waiting for Tailwind CSS 4 support)
- Browser support validation for Tailwind CSS 4

**Technical Debt Incurred:**

- No build step for packages/ui (source exports only, production build needed later)
- Manual argTypes in compound component stories (docgen can't resolve Radix Root types)

---

_For current project status, see .planning/PROJECT.md_
