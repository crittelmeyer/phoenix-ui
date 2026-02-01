# Phase 1: Foundation - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Monorepo scaffolding with pnpm 10 + Turborepo 2.7 that lets a developer clone, install, and run `pnpm dev` with zero configuration. Includes workspace structure, tooling, linting, formatting, pre-commit hooks, and a working Vite dev server. No components, no tokens — pure infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Workspace & package naming
- Package scope: `@phoenix` (e.g., `@phoenix/ui`, `@phoenix/tokens`)
- Include a rename script that replaces `@phoenix` with a custom scope across all files
- All packages start at version `0.0.0`
- License: MIT

### Dev server & app shell
- Minimal welcome page on first run: Phoenix logo, project name, link to Storybook
- Include React Router 7 with basic route skeleton: root route + `/components` route to show the routing pattern
- Include Tailwind CSS 4 + `@tailwindcss/vite` in Phase 1 — apps/web can use utility classes immediately (tokens preset comes in Phase 2)
- Node.js 22 LTS required (enforce via `engines` field)

### Linting & formatting strictness
- Arbitrary Tailwind values (`mt-[13px]`): **error** in `packages/ui`, **warning** in `apps/*`
- Enforce import sort order: React first, external packages, internal (`@phoenix/*`), relative
- Prettier: no semicolons, single quotes, trailing commas, + Tailwind class sorting plugin
- TypeScript: strict mode (`strict: true`), no additional strictness flags beyond standard strict

### Git & CI workflow
- Pre-commit hooks run all three: lint + typecheck + format:check
- Husky + lint-staged for pre-commit hook management (lint-staged runs on staged files only)
- Conventional Commits enforced (feat:, fix:, chore:, etc.)

### Claude's Discretion
- Whether to include a basic GitHub Actions CI workflow (lint + typecheck + build on PRs) or keep it local-hooks-only
- Exact welcome page design and styling
- lint-staged configuration details (which globs, which commands per file type)
- Turborepo pipeline configuration specifics
- tsconfig base structure and project references

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-02-01*
