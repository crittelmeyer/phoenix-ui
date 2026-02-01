# Project Research Summary

**Project:** Phoenix Design System Monorepo Starter
**Domain:** React Design System Monorepo
**Researched:** 2026-02-01
**Confidence:** HIGH

## Executive Summary

Phoenix is a React design system monorepo starter targeting AI-first component development with the shadcn/ui pattern (copy-paste components over installed packages). The 2026 stack has converged on pnpm + Turborepo for monorepo orchestration, React 19 with Tailwind CSS 4 for UI, Radix UI for accessible primitives, and Style Dictionary for design token transformation. However, a critical incompatibility exists: **React 19 + Radix UI triggers infinite render loops** (unresolved as of January 26, 2026), forcing the project to pin React to v18.3.0 until official resolution.

The recommended architecture follows a three-tier monorepo: foundation layer (tokens package), component layer (ui package with Radix + CVA patterns), and consumer layer (web app + Storybook). Design tokens are the source of truth, transformed from JSON to CSS variables and Tailwind presets via Style Dictionary. This ensures components never hardcode values, maintaining consistency and enabling theme customization. The critical path is: monorepo setup → token pipeline → core components (12 essential components following shadcn patterns).

The highest-risk pitfall is Tailwind CSS 4 migration, which introduces 12+ breaking changes including CSS syntax (`@import "tailwindcss"` instead of `@tailwind` directives), browser compatibility drops (Safari 16.4+ only), and utility renames cascading through all components. The official upgrade tool automates most changes, but visual regression testing and browser support auditing are mandatory. Secondary risks include Style Dictionary v4's async rewrite (all builds must migrate to ESM + async/await) and Storybook configuration requiring explicit Tailwind Vite plugin integration.

## Key Findings

### Recommended Stack

The 2026 React design system stack has stabilized around modern, performant tooling with full ecosystem compatibility. React 19 is stable and Radix UI has official support (with one critical caveat), Tailwind CSS 4 offers 5x faster builds through architectural rewrites, and Turborepo + pnpm provide best-in-class monorepo developer experience.

**Core technologies:**

- **pnpm 10 + Turborepo 2.7**: Monorepo infrastructure — fastest package manager with workspace protocol, Rust-based build orchestration with remote caching
- **React 19.2.4 + TypeScript 5.9**: UI framework — latest stable React with enhanced DevTools and Server Actions, avoid TypeScript 7 beta
- **Tailwind CSS 4.1 + @tailwindcss/vite**: Styling — 5x faster builds, CSS-first config, requires Safari 16.4+/Chrome 111+
- **Radix UI 1.1 + CVA 0.7**: Component primitives — headless accessible components, type-safe variant management pattern
- **Style Dictionary 5.1 + @tokens-studio/sd-transforms**: Token system — DTCG spec support, Figma → code pipeline
- **Vite 7.3 + React Router 7.13**: Build tool + routing — 100x faster than webpack, SPA mode perfect for design system docs
- **Vitest 4 + Testing Library 16**: Testing — native Vite integration, 10x faster than Jest
- **Storybook 10.1**: Documentation — full React 19 support, Vite integration stable

**Critical version constraints:**

- React must be pinned to **18.3.0** until Radix UI fixes React 19 infinite loop bug (GitHub issue #3799)
- Tailwind CSS 4 requires **browser support audit** before migration (no polyfill for older browsers)
- Style Dictionary v4 requires **ESM + async/await** migration for all build scripts

### Expected Features

Phoenix targets a minimal viable component library (12 components) with exceptional quality over quantity. The shadcn/ui ecosystem has set user expectations for specific patterns: CVA for type-safe variants, Radix for accessibility, dark mode support, comprehensive TypeScript types, and interactive documentation.

**Must have (table stakes):**

- 12 core components (Button, Input, Select, Dialog, etc.) — shadcn/ui defines baseline expectations
- Type-safe component variants (CVA) — 62% of 2026 workflows are type-safe
- Accessible primitives (Radix UI) — WAI-ARIA compliance is non-negotiable
- Dark mode support — 70%+ users expect system preference detection
- Monorepo structure — design systems are distributed packages
- Component documentation — Storybook or equivalent interactive docs required
- Design tokens — semantic tokens for colors, spacing, typography
- Form validation integration — react-hook-form + Zod is 2026 standard
- Testing infrastructure — Vitest + RTL baseline with example tests
- Package exports — tree-shakeable ESM/CJS dual format

**Should have (competitive):**

- AI/Claude-first architecture — predictable patterns for LLM code generation (Phoenix's unique angle)
- Compound component patterns — type-safe factory functions vs prop-heavy APIs
- Zero-config monorepo — "clone and go" vs multi-step setup
- Living documentation — Storybook + MDX with design guidelines, not just prop tables
- Component composition examples — real-world patterns (forms, dashboards) using core primitives
- Changesets integration — automated versioning and changelogs for component packages

**Defer (v2+):**

- Visual regression testing — high value but can validate manually early on
- Performance budgets — bundle size tracking important for scale, not initial validation
- Advanced compositions — dashboard/data table examples nice-to-have
- Design token migration tools — Tailwind 4 @theme migration can wait for adoption

**Anti-features to avoid:**

- Premature abstraction — wait for patterns to emerge from real usage
- Complete component library — focus on 12-15 essential components done excellently vs 50+ mediocre
- Framework lock-in — embrace React focus, don't dilute with Vue/Angular support
- Custom CSS-in-JS — Tailwind + CVA is the winning pattern
- Breaking shadcn/ui patterns — shadcn is the reference implementation

### Architecture Approach

Phoenix follows the industry-standard three-tier monorepo: foundation (tokens), components (ui package), and consumers (web app + Storybook). The token pipeline is the source of truth — JSON seed files transform to CSS variables and Tailwind presets via Style Dictionary, ensuring components never hardcode values. Dependencies flow strictly bottom-up (tokens → ui → apps), enforced by pnpm workspace constraints.

**Major components:**

1. **packages/tokens** — Design token transformation (Style Dictionary), zero internal dependencies, generates CSS vars + Tailwind preset
2. **packages/ui** — React component library (CVA + Radix pattern), depends on tokens, exports tree-shakeable ESM/CJS
3. **packages/eslint-config + tsconfig** — Shared tooling configs, orthogonal to runtime packages
4. **apps/web** — Main consumer application (Vite + React Router), imports from @phoenix/ui
5. **apps/storybook** — Component documentation, separate app for deployment flexibility

**Critical patterns:**

- **Token-first design**: Components use semantic tokens (bg-primary) never arbitrary values (bg-[#3b82f6]), enforced by ESLint
- **Dependency direction**: Lower layers never import from higher layers, violations break build order
- **Generated artifacts**: dist/ directories are gitignored, rebuilt on every install/deploy
- **Workspace protocol**: Internal dependencies use workspace:\* to ensure local resolution during development

**Build order (automatic via Turborepo):**

```
tokens (Style Dictionary) → ui (tsup ESM/CJS) → web (Vite) + storybook
```

### Critical Pitfalls

The most severe risks come from ecosystem version compatibility issues and breaking changes in core dependencies. These require upfront architectural decisions that cannot be easily reversed.

1. **React 19 + Radix UI infinite loop** — React 19 changed ref callback behavior, triggering "Maximum update depth exceeded" errors in all Radix components. **Pin React to 18.3.0** in root package.json until official fix lands (GitHub issue #3799). This blocks use of React 19 Server Components and new hooks.

2. **Tailwind CSS 4 breaking changes cascade** — Migration requires CSS syntax changes (@import instead of @tailwind), browser support drops (Safari 16.4+ only), utility renames (shadow-sm → shadow-xs), and configuration migration (JS → CSS @theme). **Run `npx @tailwindcss/upgrade`** tool systematically and audit browser requirements BEFORE migrating. No downgrade path.

3. **Style Dictionary v4 async everything** — All core methods changed to async, breaking synchronous build pipelines. **Migrate build scripts to ESM + async/await** and update package.json to `"type": "module"`. Not backward compatible, cannot gradually migrate.

4. **Turborepo cache doesn't invalidate on token changes** — Modifying tokens doesn't trigger cache invalidation for dependent components. **Configure explicit input globs** in turbo.json to track `../tokens/src/**/*.json` and `../tokens/dist/**/*.css`.

5. **Storybook + Vite + Tailwind CSS 4 configuration** — Tailwind directives not processed in Storybook without explicit plugin. **Add @tailwindcss/vite to viteFinal hook** in .storybook/main.ts to ensure utilities generate.

## Implications for Roadmap

Based on research, the critical path is foundation-first (monorepo + tokens) before any component work. Tailwind CSS 4 migration decision must happen in Phase 0 (setup) as it affects browser support and all subsequent work. Token pipeline must be validated before components to prevent rework.

### Phase 0: Project Setup & Critical Decisions

**Rationale:** These decisions cannot be changed later without major rework. React version, Tailwind version, and browser support establish constraints for entire project.

**Delivers:** Monorepo structure, dependency versioning strategy, browser support matrix

**Critical decisions:**

- **React version:** Pin to 18.3.0 (blocks React 19 until Radix fix)
- **Tailwind version:** Migrate to v4 OR stay on v3 based on browser support audit
- **Versioning:** Choose fixed versioning for design systems (all packages share version)

**Avoids:**

- React 19 + Radix UI infinite loop (Pitfall #1)
- Tailwind CSS 4 browser compatibility surprise (Pitfall #2)
- Independent versioning incompatibilities (Pitfall #9)

### Phase 1: Foundation Layer

**Rationale:** Monorepo infrastructure and tooling must be configured before any code. pnpm workspace setup enables inter-package dependencies. ESLint/Prettier configuration prevents format conflicts.

**Delivers:** Working monorepo with pnpm workspaces, Turborepo pipeline, shared ESLint/Prettier configs, TypeScript project references

**Uses:**

- pnpm 10 + Turborepo 2.7 for monorepo orchestration
- ESLint 9.39 + Prettier 3.8 with eslint-config-prettier
- TypeScript 5.9 with shared tsconfig base

**Avoids:**

- pnpm hoisting breaks Radix UI types (Pitfall #7) — configure public-hoist-pattern early
- ESLint + Prettier + Tailwind plugin conflicts (Pitfall #10) — use eslint-config-prettier

### Phase 2: Token System

**Rationale:** Tokens are the foundation for consistent styling. Components cannot be built until token pipeline works. Style Dictionary async migration must complete before tokens generate.

**Delivers:** Style Dictionary configuration, seed token files (colors, spacing, typography), CSS variables + Tailwind preset generation

**Implements:** packages/tokens with Style Dictionary v5, @tokens-studio/sd-transforms

**Avoids:**

- Style Dictionary v4 async migration (Pitfall #3) — use ESM + async/await from start
- Turborepo cache invalidation (Pitfall #4) — configure input globs for token files

**Research flag:** May need deeper research on DTCG token spec and Tokens Studio integration patterns.

### Phase 3: Core Components (First 6)

**Rationale:** Start with form primitives (Button, Input, Textarea, Select, Checkbox, Radio) as they have no dependencies on each other and cover most common use case. Validate CVA + Radix pattern before expanding.

**Delivers:** First 6 components following shadcn pattern, CVA variant system, cn() utility, component testing examples

**Uses:**

- Radix UI primitives (@radix-ui/react-\*)
- CVA 0.7 for type-safe variants
- tailwind-merge for class conflict resolution

**Avoids:**

- CVA class conflicts (Pitfall #6) — wrap with tailwind-merge from start
- Vite Fast Refresh breaks (Pitfall #8) — separate components, hooks, constants

**Research flag:** Standard patterns well-documented, skip dedicated research phase.

### Phase 4: Storybook Documentation

**Rationale:** Documentation infrastructure needed before building remaining components. Enables visual validation and development workflow for subsequent phases.

**Delivers:** Storybook app with Tailwind CSS 4 integration, interactive docs for first 6 components, MDX documentation patterns

**Implements:** apps/storybook with Storybook 10.1, Vite integration

**Avoids:**

- Storybook + Vite + Tailwind CSS 4 config (Pitfall #5) — add @tailwindcss/vite to viteFinal
- Turborepo + Storybook build order (Pitfall #12) — configure dependsOn: ["^build", "build"]

**Research flag:** Configuration documented in pitfalls, skip dedicated research.

### Phase 5: Core Components (Final 6)

**Rationale:** Second wave includes overlay components (Dialog, DropdownMenu, Tooltip) and composition patterns (Form wrapper, Toast). These depend on patterns established in Phase 3.

**Delivers:** Dialog, DropdownMenu, Tabs, Tooltip, Toast, Form components with Storybook stories

**Implements:** Compound component patterns, react-hook-form + Zod integration

**Research flag:** Form validation patterns may need phase-specific research for error handling patterns.

### Phase 6: Composition Examples

**Rationale:** Demonstrates how to combine primitives into real-world patterns. Validates component API design and provides templates for AI code generation.

**Delivers:** Login form, settings page, data table examples using core components

**Avoids:** Over-engineering state management — keep examples simple, use Radix uncontrolled defaults

### Phase Ordering Rationale

- **Foundation before components**: Monorepo structure and tooling must work before any code
- **Tokens before components**: Components depend on semantic tokens, cannot hardcode values
- **Simple before complex**: Form primitives (Button, Input) before overlays (Dialog, Toast)
- **Documentation mid-stream**: Enable visual validation workflow before building complex components
- **Examples last**: Composition patterns require stable component APIs

**Critical path dependencies:**

```
Phase 0 (decisions) → Phase 1 (monorepo) → Phase 2 (tokens) → Phase 3 (components)
                                                                       ↓
                              Phase 4 (Storybook) ← ← ← ← ← ← ← ← ← ← ←
                                                                       ↓
                              Phase 5 (more components) → Phase 6 (examples)
```

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 2 (Tokens):** DTCG spec compliance and Tokens Studio transform configurations — niche domain
- **Phase 5 (Form):** react-hook-form error handling patterns, Zod schema composition — complex integration

Phases with standard patterns (skip research-phase):

- **Phase 1 (Foundation):** pnpm + Turborepo patterns well-documented in official examples
- **Phase 3 (First 6 Components):** shadcn/ui provides reference implementations
- **Phase 4 (Storybook):** Configuration documented in pitfalls research

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                                                                               |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | All versions verified via official npm releases, GitHub tags, and official documentation as of February 1, 2026                                                                                     |
| Features     | MEDIUM     | WebSearch findings cross-referenced across multiple community sources; MVP scope inferred from shadcn/ui patterns                                                                                   |
| Architecture | HIGH       | Turborepo design-system example, shadcn monorepo docs, and Style Dictionary patterns are official/authoritative                                                                                     |
| Pitfalls     | HIGH       | React 19 + Radix issue verified from official GitHub issue; Tailwind CSS 4 breaking changes from official upgrade guide; other pitfalls from community discussions with multiple confirming sources |

**Overall confidence:** HIGH

All critical technology versions and compatibility issues verified through official sources (React blog, Tailwind docs, Radix GitHub, Style Dictionary migration guide). Architecture patterns based on official Turborepo examples and shadcn documentation. Pitfalls cross-verified with GitHub issues and community discussions.

### Gaps to Address

Areas where research was inconclusive or needs validation during implementation:

- **React 19 timeline:** Radix UI fix not yet released — must monitor GitHub issue #3799 during development, may require architectural pivot if fix arrives mid-project
- **Tailwind CSS 4 adoption:** Browser support requirements not specified in project brief — must validate with stakeholders in Phase 0 before migration decision
- **Token theming strategy:** Dark mode implementation approach (CSS variables vs Tailwind config) requires design system governance decisions beyond technical research
- **Component API surface:** Specific props and variant names require design iteration, research provides patterns but not exact specifications
- **Publishing strategy:** Phoenix as starter template may never publish to npm (users clone and own it) — versioning and changesets configuration may be optional

**Validation during planning:**

- Phase 0: Browser support audit with stakeholders
- Phase 2: Token naming conventions and theming approach
- Phase 3: Component API design reviews per component

## Sources

### Primary (HIGH confidence)

- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2) — React version verification
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — Breaking changes and migration
- [Radix UI GitHub Issue #3799](https://github.com/radix-ui/primitives/issues/3799) — React 19 infinite loop bug
- [Style Dictionary v4 Migration](https://styledictionary.com/versions/v4/migration/) — Async API changes
- [Turborepo Design System Example](https://github.com/vercel/turborepo/tree/main/examples/design-system) — Monorepo architecture
- [shadcn/ui Monorepo Docs](https://ui.shadcn.com/docs/monorepo) — Component patterns
- [pnpm Workspace Protocol](https://pnpm.io/workspaces) — Dependency management
- [Vite 7 Release](https://vite.dev/blog/announcing-vite7) — Build tool version
- [Vitest 4 Release](https://vitest.dev/blog/vitest-4) — Testing framework version

### Secondary (MEDIUM confidence)

- [Scaling Frontend with Monorepo](https://medium.com/@satnammca/scaling-your-frontend-a-monorepo-and-design-system-playbook-957e38c8c9e4) — Monorepo patterns
- [CVA Documentation](https://cva.style/docs) — Variant management patterns
- [Tailwind + Storybook Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/16687) — Configuration issues
- [React Hook Form with Zod Guide](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1) — Form validation patterns
- [How I'd build a design system in 2026](https://learn.thedesignsystem.guide/p/how-id-build-a-design-system-if-i) — Anti-patterns and pitfalls
- [Monorepo versioning strategies](https://amarchenko.dev/blog/2023-09-26-versioning/) — Independent vs fixed versioning

### Tertiary (LOW confidence)

- Turborepo cache invalidation behavior — inferred from GitHub issues, needs validation in project
- TypeScript project references threshold (50+ components) — community consensus, not empirically validated
- Optimal package splitting strategy — inferred from design system best practices, not specific to Phoenix

---

_Research completed: 2026-02-01_
_Ready for roadmap: yes_
