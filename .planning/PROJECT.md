# Phoenix

## What This Is

A clone-and-go monorepo starter pack that becomes a living design system for whatever product you build. Ships with a design token pipeline, 12 core UI components (shadcn-style with Radix + CVA), Storybook docs, and Claude-first AI guardrails so agents can work autonomously within predictable patterns.

## Core Value

AI agents (Claude Code specifically) can add, modify, and extend components without human hand-holding — because the repo structure, naming, patterns, and rules are explicit and enforced.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] pnpm + Turborepo monorepo with apps/web, apps/storybook, packages/ui, packages/tokens
- [ ] Vite + React Router app in apps/web consuming @phoenix/ui
- [ ] Design token pipeline: seed tokens → Style Dictionary → CSS vars + Tailwind preset
- [ ] Documented path from Tokens Studio / Figma Variables to replace seed tokens
- [ ] Tailwind config consuming token preset, enforcing semantic token usage
- [ ] cn() helper (clsx + tailwind-merge)
- [ ] 12 core components: Button, Input, Textarea, Select, Checkbox, Radio, Dialog, DropdownMenu, Tabs, Tooltip, Toast/Sonner, Form wrapper (react-hook-form)
- [ ] Every component uses CVA variants, Radix primitives underneath, semantic tokens only
- [ ] Storybook app with 1 story per component + Tokens overview page
- [ ] ESLint + Prettier with tailwind class sorting, no arbitrary values in UI package, no inline styles
- [ ] Pre-commit + CI gates: lint, typecheck, format:check all must pass
- [ ] CLAUDE.md + .claude/rules/ hierarchy with path-scoped rules per package
- [ ] AGENTS.md at repo root for cross-tool compatibility (references CLAUDE.md)
- [ ] Barrel exports from packages/ui/src/index.ts
- [ ] Figma Code Connect mappings for all 12 components

### Out of Scope

- Figma MCP server setup — depends on user's Figma account and evolving tooling
- OAuth / auth system — this is a UI starter, not an app template
- Database / API layer — same reason
- Mobile / React Native — web-first starter
- CI/CD pipeline config — too environment-specific for a starter
- Figma file creation — users bring their own or start from seed tokens

## Context

- The shadcn/ui ecosystem (Radix + CVA + Tailwind + cn()) is the most Claude Code-friendly component pattern available. Claude has deep training on this pattern and replicates it reliably.
- Tokens Studio → @tokens-studio/sd-transforms → Style Dictionary is the intended modern path for design token transformation.
- Claude Code's `.claude/rules/` directory supports path-scoped frontmatter (`paths: ["packages/ui/**"]`) so rules only load when Claude is working in that area. This keeps context windows clean.
- lucide-react for icons (standard in shadcn ecosystem).
- ESLint + Prettier (Option A from blueprint) chosen over Biome because Tailwind class sorting plugin is mature and Claude knows the config patterns well.

## Constraints

- **Package scope**: `@phoenix/*` — all packages use this scope, rename on clone
- **Tech stack**: React 18.3.0, TypeScript, Tailwind CSS 4, Vite, pnpm — non-negotiable for this starter (React 19 blocked by Radix UI infinite loop bug, upgrade when fix lands)
- **Component pattern**: CVA + Radix + cn() — every component follows this exact pattern, no exceptions
- **Token enforcement**: UI components must use semantic tokens (bg-surface, text-foreground), never arbitrary hex/spacing values
- **AI-first**: Every structural decision should be evaluated through "can Claude Code work here without asking?"

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vite + React Router over Next.js | Lighter, faster dev, no SSR opinions — better for a design system starter | — Pending |
| ESLint + Prettier over Biome | Tailwind class sorting plugin is mature; Claude knows this config deeply | — Pending |
| .claude/rules/ with path scoping over single CLAUDE.md | Keeps context windows clean; rules only load when relevant | — Pending |
| Seed tokens with Figma upgrade path over Figma-required | Starter must work day-one without Figma; documented migration path when ready | — Pending |
| shadcn "own the code" over npm dependency | Components are committed source, not installed packages — full control | — Pending |
| React 18.3.0 over React 19 | Radix UI infinite loop bug with React 19 (Jan 2026, unresolved) — pin 18.3.0, upgrade when fixed | — Pending |

---
*Last updated: 2026-02-01 after research — pinned React 18.3.0*
