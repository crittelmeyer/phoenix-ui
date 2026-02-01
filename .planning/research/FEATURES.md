# Feature Landscape

**Domain:** React Design System Monorepo Starter
**Researched:** 2026-02-01
**Confidence:** MEDIUM (WebSearch findings cross-referenced across multiple sources)

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Core Component Set** | shadcn/ui has 50+ components; starters need essential building blocks | Medium | Phoenix plans 12 core components - this is minimum viable set |
| **Type-Safe Component Variants (CVA)** | CVA is the standard pattern for shadcn-style systems; 62% type-safe workflows in 2026 | Low | Using `cva()` for variant management is now expected pattern |
| **Accessible Primitives (Radix UI)** | Radix provides WAI-ARIA compliant foundations; accessibility is non-negotiable | Low | Radix handles ARIA, focus, keyboard nav - table stakes foundation |
| **Tailwind Integration** | Tailwind + shadcn is 2026 standard for modern starters; emerged as frontrunner | Low | Utility-first CSS is expected; competitors all use Tailwind |
| **Dark Mode Support** | 70%+ users expect dark mode in 2026; system preference detection mandatory | Medium | CSS variables + `prefers-color-scheme` + theme switcher |
| **TypeScript Throughout** | 100% of modern starters are TypeScript-first; type safety is baseline expectation | Low | No JS-only option; TS is table stakes for credibility |
| **Monorepo Structure** | Design systems are distributed packages; monorepo tooling is expected | Medium | Turborepo/pnpm workspaces standard for 2026 starters |
| **Component Documentation** | Users need to know how to use components; undocumented = unusable | Medium | Storybook or equivalent interactive docs required |
| **Design Tokens** | Semantic tokens for colors, spacing, typography; consistency foundation | Medium | CSS variables via Tailwind theme or @theme directive |
| **Form Validation Integration** | react-hook-form + Zod is 2026 validation standard; forms need first-class support | Medium | Form wrapper component must handle validation, error display |
| **Basic Testing Setup** | Vitest + RTL is 2026 testing baseline; untested components = low trust | Medium | Test infrastructure + example tests for core components |
| **Package Exports** | Components must be importable as npm packages; monorepo sharing required | Low | Proper package.json exports, build outputs, tree-shakeable |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI/Claude-First Architecture** | "shadcn revolutionized UI with copy-paste; AI needs predictable patterns" | Low | Phoenix's unique angle - documented patterns for LLM code generation |
| **Compound Component Patterns** | Factory functions + useContext for composable APIs; superior DX vs prop-heavy | Medium | Type-safe compound components (2026 pattern) vs boolean prop hell |
| **Design Token Migration Path** | Tailwind 4 @theme support; CSS variables bridge to token platforms | Medium | Future-proof token architecture; most starters stuck on v3 patterns |
| **Zero-Config Monorepo** | "Clone and go" vs multi-step setup; Turborepo caching pre-configured | Medium | Competitor starters require manual configuration; Phoenix is turnkey |
| **Living Documentation** | Storybook + MDX with design guidelines, not just prop tables | High | Most starters have basic docs; Phoenix includes usage patterns, rationale |
| **Component Composition Examples** | Real-world patterns: forms, dashboards, data tables using core primitives | Medium | Starters give primitives; Phoenix shows how to compose them |
| **Consistent Error Boundaries** | react-hook-form error display patterns; Toast integration for async errors | Medium | Most systems handle errors inconsistently; Phoenix has patterns |
| **Workspace-Aware Tooling** | ESLint, Prettier, TypeScript configs shared as internal packages | Low | Reduces config drift across monorepo apps |
| **Changesets Integration** | Automated versioning and changelogs for component packages | Medium | Professional publishing workflow; competitors use manual versioning |
| **Visual Regression Testing** | Chromatic or Playwright component screenshots; prevent UI regressions | High | Few starters include; high value for maintaining consistency |
| **Performance Budgets** | Bundle size tracking, tree-shaking verification per component | Medium | Most starters don't measure; Phoenix could enforce standards |

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Premature Abstraction** | "Kill more patterns than you create" - over-abstracting early creates complexity debt | Wait for patterns to emerge from real usage; document decisions, don't enforce frameworks |
| **Custom Build System** | Turborepo/Vite/tsup are battle-tested; custom builds = maintenance burden | Use standard tooling; differentiate on architecture, not build config |
| **Proprietary Token Format** | CSS variables and Tailwind theme work everywhere; custom formats lock users in | Use web standards (CSS vars) + Tailwind conventions |
| **Complete Component Library** | shadcn has 50+ components; starters that try to compete end up half-finished | Focus on 12-15 essential components done excellently vs 50+ mediocre |
| **Framework Lock-in** | Vue, Angular, Svelte support sounds good but dilutes focus; unstyled means React-only | Embrace React focus; Radix is React-only, so is shadcn pattern |
| **Custom CSS-in-JS** | "CSS-in-TS isn't for everyone" - CVA exists because styled-components lost | Tailwind + CVA is the winning pattern; don't build alternatives |
| **Dedicated Design System Team** | "Don't hire a DS team before PMF" - starters are for small teams | Design for 1-3 devs maintaining; avoid enterprise-scale processes |
| **Figma-First Workflow** | Design drift happens when design and code aren't synced; Figma creates false starts | Code-first with Storybook as living docs; Figma as communication layer |
| **Over-Engineered State Management** | Components should be uncontrolled by default (Radix principle) | Use Radix defaults; only add state when needed; avoid Redux/Zustand in primitives |
| **Custom Accessibility Layer** | Radix handles ARIA/keyboard/focus; reinventing this is bug-prone | Trust Radix primitives; document usage, don't reimplement a11y |
| **Breaking shadcn/ui Patterns** | shadcn is the reference implementation; deviating confuses users | Follow shadcn conventions; innovate on composition, not base patterns |
| **Git-Based Component Distribution** | CLI copy-paste (shadcn style) sounds cool but complicates versioning | Use npm packages; monorepo workspace imports for internal sharing |

## Feature Dependencies

```
Foundation Layer:
  Monorepo Setup (Turborepo + pnpm)
    ↓
  TypeScript + Tailwind Config
    ↓
  Design Tokens (CSS Variables)
    ↓
Component Layer:
  Radix Primitives
    ↓
  CVA Variant System
    ↓
  Core Components (Button, Input, etc)
    ↓
Composition Layer:
  Compound Components
    ↓
  Form Patterns (react-hook-form + Zod)
    ↓
  Composite Examples (forms, dashboards)
    ↓
Quality Layer:
  Storybook Documentation
    ↓
  Testing Setup (Vitest + RTL)
    ↓
  Visual Regression
    ↓
Distribution Layer:
  Package Exports
    ↓
  Changesets
```

**Critical Path:**
Monorepo → TypeScript/Tailwind → Design Tokens → Radix + CVA → Core Components

**Parallel Tracks:**
- Documentation (Storybook) can develop alongside components
- Testing can start once 2-3 components exist
- AI patterns are architectural (no dependencies)

## MVP Recommendation

For MVP, prioritize:

### Phase 1: Foundation (Week 1)
1. **Monorepo Structure** - Turborepo + pnpm workspaces
2. **TypeScript + Tailwind** - Base configuration + shared configs
3. **Design Tokens** - Color scales, spacing, typography CSS variables
4. **Dark Mode** - Theme switcher with system preference

### Phase 2: Core Components (Week 2-3)
5. **Radix Integration** - Install primitives, document patterns
6. **CVA Setup** - Variant patterns, type-safe factories
7. **First 6 Components** - Button, Input, Textarea, Select, Checkbox, Radio
   - These have no dependencies on each other
   - Cover form primitives (most common use case)

### Phase 3: Composition (Week 3-4)
8. **Form Pattern** - react-hook-form wrapper, Zod integration
9. **Next 6 Components** - Dialog, DropdownMenu, Tabs, Tooltip, Toast, Form
   - Dialog/DropdownMenu/Tooltip depend on overlay patterns
   - Toast for error handling
   - Form wrapper demonstrates composition

### Phase 4: Documentation (Week 4-5)
10. **Storybook** - Interactive docs for all 12 components
11. **Compound Component Examples** - Show composition patterns
12. **AI Pattern Guide** - Document predictable structures for LLMs

Defer to post-MVP:

- **Visual Regression Testing**: High value but can validate manually early on
- **Performance Budgets**: Important for scale, not for initial validation
- **Changesets**: Manual versioning acceptable until external users
- **Advanced Compositions**: Dashboard/data table examples nice-to-have
- **Design Token Migration**: Tailwind 4 @theme can wait for v4 stable release

## Feature Complexity Matrix

| Feature Category | Table Stakes Count | Differentiator Count | Risk Level |
|------------------|-------------------|---------------------|------------|
| Core Components | 12 components | 0 | Low (Radix handles complexity) |
| Type System | 3 (TS, CVA, exports) | 2 (compound, factories) | Medium (TS patterns well-known) |
| Theming | 2 (tokens, dark mode) | 1 (migration path) | Medium (CSS vars + Tailwind) |
| Testing | 1 (Vitest setup) | 1 (visual regression) | Low (standard patterns) |
| Documentation | 1 (Storybook) | 1 (living docs) | Medium (content creation effort) |
| Tooling | 2 (monorepo, configs) | 3 (zero-config, changesets, budgets) | Medium (integration complexity) |
| Forms | 1 (react-hook-form) | 1 (error patterns) | Medium (validation edge cases) |

**Highest Complexity:** Living Documentation (content creation), Visual Regression (tooling setup)
**Lowest Complexity:** TypeScript, Tailwind, CVA (established patterns with good docs)
**Highest Risk:** Over-engineering composition patterns before validating primitives
**Lowest Risk:** Using Radix primitives as-is with minimal wrapping

## AI/Claude-First Considerations

Phoenix's unique differentiator requires these patterns:

1. **Predictable File Structure**
   - Components in `packages/ui/src/components/[name]/`
   - Each component: `index.tsx`, `[name].stories.tsx`, `[name].test.tsx`
   - Consistent exports: named export for component, type exports

2. **Documented Variant Patterns**
   - CVA variant objects use consistent naming: `variant`, `size`, `state`
   - Default variants always specified
   - Compound variants documented with examples

3. **Composition Contracts**
   - Compound components use factory pattern with clear parent-child relationships
   - Context types exported for extension
   - Props interfaces extend HTML element props predictably

4. **Error Handling Patterns**
   - Form errors: react-hook-form conventions
   - Async errors: Toast integration
   - Runtime errors: Error boundaries with fallback UI

5. **Testing Patterns**
   - RTL queries prioritize accessibility (getByRole, getByLabelText)
   - User interaction patterns (userEvent, not fireEvent)
   - Snapshot tests avoided (brittle for AI generation)

**Why This Matters:**
LLMs excel at mimicry. Show 2-3 examples of a pattern, they continue it. Phoenix's value is providing those reference implementations so Claude Code can extend the system autonomously without breaking conventions.

## Sources

**Design System Landscape:**
- [shadcn/ui Introduction](https://ui.shadcn.com/docs)
- [Untitled UI — React Component Library](https://www.untitledui.com/blog/react-component-libraries)
- [Choosing the Right UI Framework in 2026](https://lalatenduswain.medium.com/choosing-the-right-ui-framework-in-2026-tailwind-css-vs-bootstrap-vs-material-ui-vs-shadcn-ui-c5842f4c7e91)

**Monorepo Architecture:**
- [Monorepo Architecture: The Ultimate Guide for 2025](https://feature-sliced.design/blog/frontend-monorepo-explained)
- [Scaling Your Frontend: A Monorepo and Design System Playbook](https://medium.com/@satnammca/scaling-your-frontend-a-monorepo-and-design-system-playbook-957e38c8c9e4)
- [Turborepo Design System](https://vercel.com/templates/react/turborepo-design-system)

**Component Patterns:**
- [Radix Primitives Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [CVA (Class Variance Authority) Docs](https://cva.style/docs)
- [The Anatomy of shadcn/ui Components](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components)
- [Building Type-Safe Compound Components](https://tkdodo.eu/blog/building-type-safe-compound-components)

**Theming & Tokens:**
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Dark Mode Design Best Practices in 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- [Color tokens: guide to light and dark modes](https://medium.com/design-bootcamp/color-tokens-guide-to-light-and-dark-modes-in-design-systems-146ab33023ac)

**Forms & Validation:**
- [React Hook Form with Zod: Complete Guide for 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)
- [Building Type-Safe Forms with React Hook Form](https://medium.com/@Yasirgaji/building-type-safe-forms-with-react-hook-form-a-pattern-based-approach-6a1ec37cf8f4)

**Testing:**
- [How to Unit Test React Components with Vitest](https://oneuptime.com/blog/post/2026-01-15-unit-test-react-vitest-testing-library/view)
- [Testing in 2026: Jest, React Testing Library, and Full Stack Testing Strategies](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)

**Documentation:**
- [4 ways to document your design system with Storybook](https://storybook.js.org/blog/4-ways-to-document-your-design-system-with-storybook/)
- [MDX | Storybook docs](https://storybook.js.org/docs/writing-docs/mdx)

**Anti-Patterns:**
- [How I'd build a design system if I started over in 2026](https://learn.thedesignsystem.guide/p/how-id-build-a-design-system-if-i)
- [Design Systems in 2026: Predictions, Pitfalls, and Power Moves](https://rydarashid.medium.com/design-systems-in-2026-predictions-pitfalls-and-power-moves-f401317f7563)

**AI/LLM Patterns:**
- [My LLM coding workflow going into 2026](https://addyosmani.com/blog/ai-coding-workflow/)
- [Agentic AI Design Patterns (2026 Edition)](https://medium.com/@dewasheesh.rana/agentic-ai-design-patterns-2026-ed-e3a5125162c5)
