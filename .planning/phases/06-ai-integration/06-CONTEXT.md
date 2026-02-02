# Phase 6: AI Integration - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Create AI agent instruction files so Claude Code (and other AI tools) can add, modify, and extend components without human guidance. Deliverables: CLAUDE.md, path-scoped rule files in .claude/rules/, AGENTS.md, and a validation test proving autonomous capability.

</domain>

<decisions>
## Implementation Decisions

### CLAUDE.md scope & depth

- Comprehensive reference — full directory tree, every package's purpose, file naming conventions, import patterns
- Points to rule files for detailed patterns (no duplication of component recipes)
- Includes dedicated pitfalls section with critical gotchas (React 18 pin, Tailwind CSS 4 quirks, Style Dictionary async, etc.)
- Includes full development workflow commands (pnpm commands, turbo pipelines, what to run before committing)

### Rule file granularity

- Strict template approach — exact file structure, exact imports, exact patterns for Claude to follow
- ui-components.md covers the full lifecycle: component file + story file + .figma.tsx + barrel export update — one complete checklist
- Includes anti-patterns alongside correct patterns ("don't do this" examples for inline styles, arbitrary values, missing forwardRef, etc.)
- token-authoring.md covers both editing existing tokens AND creating new token categories (full autonomy)
- storybook-stories.md scoped to story authoring patterns

### Cross-tool compatibility (AGENTS.md)

- Comprehensive standalone document — any AI tool can use it without Claude-specific features
- References CLAUDE.md for details rather than duplicating content
- Includes tool-specific sections for Cursor (.cursorrules mapping) and GitHub Copilot (copilot-instructions.md)

### Validation approach

- Test component: Accordion (Radix Accordion primitive — compound component, exercises key patterns)
- Success = full deliverable: component + story + figma mapping + barrel export + typecheck passes + Storybook renders
- Must be done in a fresh Claude Code session (no prior context) — proves docs are self-sufficient
- If validation fails: iterate on docs, fix where Claude got stuck, re-run — docs must work before shipping

### Claude's Discretion

- Exact section ordering within CLAUDE.md
- How to structure the pitfalls section (table vs. list vs. callouts)
- Level of detail in Cursor/Copilot mapping sections
- Whether to include a "quick start" summary at top of CLAUDE.md

</decisions>

<specifics>
## Specific Ideas

- The core value of Phoenix is that AI agents can work autonomously — the validation test is the proof point for this entire project
- Rule files should feel like a "recipe card" — strict enough that following it mechanically produces a correct result
- Anti-patterns are important because Claude sometimes defaults to common web patterns (inline styles, arbitrary values) that violate Phoenix conventions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 06-ai-integration_
_Context gathered: 2026-02-01_
