# Architecture Patterns: Design System Monorepo

**Domain:** React Design System Monorepo
**Researched:** 2026-02-01
**Confidence:** HIGH

## Recommended Architecture

Phoenix follows the industry-standard three-tier design system monorepo architecture:

```
phoenix/
├── apps/                        # Consumer applications
│   ├── web/                     # Main application (Vite + React Router)
│   │   ├── components.json      # shadcn CLI config (app-specific components)
│   │   └── package.json         # deps: @phoenix/ui, @phoenix/tokens
│   └── storybook/               # Component documentation & testing
│       └── package.json         # deps: @phoenix/ui, Storybook 8.x
│
├── packages/                    # Shared packages (bottom-up dependency flow)
│   ├── tokens/                  # FOUNDATION LAYER (no internal deps)
│   │   ├── src/
│   │   │   ├── seed/           # Source of truth: JSON token files
│   │   │   └── config.js        # Style Dictionary build config
│   │   ├── dist/               # Generated outputs (gitignored)
│   │   │   ├── css/vars.css    # CSS custom properties
│   │   │   └── tailwind.preset.js  # Tailwind theme extension
│   │   └── package.json         # deps: style-dictionary, @tokens-studio/sd-transforms
│   │
│   ├── ui/                      # COMPONENT LAYER (depends on tokens)
│   │   ├── components.json      # shadcn CLI config (shared components)
│   │   ├── src/
│   │   │   ├── components/     # React components (shadcn pattern)
│   │   │   ├── lib/utils.ts    # cn() helper
│   │   │   ├── hooks/          # Shared hooks
│   │   │   └── index.ts        # Barrel exports
│   │   └── package.json         # deps: react, @radix-ui/*, tailwindcss, cva
│   │
│   ├── eslint-config/          # TOOLING LAYER (no runtime deps)
│   │   ├── base.js
│   │   ├── react.js
│   │   └── package.json         # peerDeps: eslint, typescript-eslint
│   │
│   └── tsconfig/               # TOOLING LAYER (no runtime deps)
│       ├── base.json
│       ├── react.json
│       └── package.json
│
├── .claude/                     # Claude-first AI guardrails
│   └── rules/                   # Path-scoped rule files
│       ├── 10-tokens.md         # Loads when: paths: ["packages/tokens/**"]
│       ├── 20-ui.md             # Loads when: paths: ["packages/ui/**"]
│       └── 30-apps.md           # Loads when: paths: ["apps/**"]
│
├── pnpm-workspace.yaml          # Workspace definition
├── turbo.json                   # Build pipeline orchestration
└── package.json                 # Root workspace scripts
```

## Package Boundaries & Responsibilities

| Package                    | Responsibility                                                     | Dependencies                                                                | Consumers                             | Confidence |
| -------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------- | ---------- |
| **packages/tokens**        | Design token transformation: seed → CSS vars + Tailwind preset     | style-dictionary, @tokens-studio/sd-transforms                              | @phoenix/ui, apps/web, apps/storybook | HIGH       |
| **packages/ui**            | React component library (CVA + Radix pattern)                      | @phoenix/tokens (Tailwind preset), react, @radix-ui/\*, cva, tailwind-merge | apps/web, apps/storybook              | HIGH       |
| **packages/eslint-config** | Shared linting rules (Tailwind class sorting, no arbitrary values) | eslint (peer), typescript-eslint (peer)                                     | All packages, all apps                | HIGH       |
| **packages/tsconfig**      | TypeScript configuration presets (paths, strictness)               | None                                                                        | All packages, all apps                | HIGH       |
| **apps/web**               | Main consumer application                                          | @phoenix/ui, @phoenix/tokens (Tailwind preset)                              | End users                             | HIGH       |
| **apps/storybook**         | Component documentation & visual regression                        | @phoenix/ui                                                                 | Developers                            | HIGH       |

### Critical Constraints

**No circular dependencies allowed.** Dependency flow is strictly bottom-up:

```
tokens (foundation) → ui (components) → apps (consumers)
      ↓                    ↓                 ↓
  tsconfig/eslint-config (tooling, orthogonal)
```

**Token pipeline is the source of truth.** CSS variables and Tailwind presets are generated artifacts, never manually edited. Seed token files in `packages/tokens/src/seed/` are the authoritative source.

**Component pattern is non-negotiable.** Every component in `packages/ui` must follow the shadcn pattern: Radix primitives + CVA variants + semantic tokens only (no arbitrary hex/spacing values).

## Data Flow: Token Pipeline

### Phase 1: Authoring (Source of Truth)

```
packages/tokens/src/seed/*.json  →  Seed token files (JSON)
                                    - colors.json
                                    - typography.json
                                    - spacing.json
                                    - semantic.json
```

**Format:** JSON files structured using Category/Type/Item (CTI) pattern. Style Dictionary performs deep merge of all token files.

**Future upgrade path:** Replace seed files with Figma Variables export via Tokens Studio plugin. Pipeline remains identical.

### Phase 2: Transformation (Build Step)

```
pnpm build:tokens  →  Style Dictionary reads config.js
                   →  Applies @tokens-studio/sd-transforms
                   →  Generates platform-specific outputs
```

**Transforms applied:**

- Token name formatting (camelCase → kebab-case)
- Value resolution (semantic tokens referencing base tokens)
- Platform-specific conversions (px → rem, hex → rgba)

### Phase 3: Distribution (Generated Artifacts)

```
packages/tokens/dist/
├── css/vars.css              →  :root { --color-bg-surface: #fff; }
└── tailwind.preset.js        →  theme: { extend: { colors: {...} } }
```

**Consumption:**

1. **Tailwind preset imported by tailwind.config.js** in `packages/ui` and all apps
2. **CSS variables imported by global.css** in apps/web and apps/storybook
3. **Both automatically stay in sync** when tokens rebuild

### Phase 4: Consumption (Components & Apps)

```typescript
// packages/ui/src/components/button.tsx
import { cva } from 'class-variance-authority'

// Uses semantic tokens (from Tailwind preset)
const buttonVariants = cva('rounded-md font-medium transition-colors', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent',
    },
  },
})
```

**Key insight:** Components never use arbitrary values like `bg-[#3b82f6]`. Tailwind preset makes semantic tokens available as utility classes (`bg-primary`, `text-foreground`).

## Build Order & Dependencies

### Turborepo Pipeline Configuration

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

**The `^build` syntax means:** "Before building this package, build all packages it depends on."

### Build Order (Automatic, Based on Dependencies)

```
1. packages/tokens     (no internal deps)
   → pnpm build        → Style Dictionary generates dist/

2. packages/ui         (depends on @phoenix/tokens)
   → pnpm build        → tsup compiles src/ → dist/ (ESM + CJS + .d.ts)

3. apps/web            (depends on @phoenix/ui, @phoenix/tokens)
   → pnpm build        → Vite bundles for production

4. apps/storybook      (depends on @phoenix/ui)
   → pnpm build-storybook  → Static Storybook site
```

**Turborepo automatically resolves this order** from pnpm workspace dependencies. No manual orchestration needed.

### Development Mode (pnpm dev)

```
Parallel execution:
- packages/tokens     → pnpm build --watch  (rebuilds on token changes)
- packages/ui         → pnpm build --watch  (rebuilds on component changes)
- apps/web            → vite dev            (HMR, proxies to other packages)
- apps/storybook      → storybook dev       (HMR, imports from @phoenix/ui)
```

**Hot Module Replacement (HMR):** Changes to UI components automatically reflect in both apps/web and apps/storybook without full rebuilds.

## Component Export Strategy

### Barrel Exports Pattern

```typescript
// packages/ui/src/index.ts
export { Button } from './components/button'
export { Input } from './components/input'
export { cn } from './lib/utils'
export { useTheme } from './hooks/use-theme'
```

**Why barrel exports:**

- Single import point for consumers: `import { Button, Input } from "@phoenix/ui"`
- Clear public API surface (internal files not exported = private)
- Tree-shaking works (modern bundlers eliminate unused exports)

### Package.json Exports Field

```json
{
  "name": "@phoenix/ui",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./components/button": {
      "types": "./dist/components/button.d.ts",
      "import": "./dist/components/button.mjs",
      "require": "./dist/components/button.js"
    }
  }
}
```

**Dual format support:** Consumers automatically get ESM or CJS based on their module system. TypeScript gets accurate type definitions.

## Workspace Protocol & Version Management

### pnpm Workspace Dependencies

```json
// apps/web/package.json
{
  "dependencies": {
    "@phoenix/ui": "workspace:*",
    "@phoenix/tokens": "workspace:*"
  }
}
```

**The `workspace:*` protocol:**

- Ensures pnpm resolves to local workspace packages (never npm registry)
- Changes to `@phoenix/ui` immediately available in `apps/web` during dev
- On publish, `workspace:*` converts to actual version number

**Recommended approach (HIGH confidence):** Always use `workspace:*` for internal monorepo dependencies. This is the 2025-2026 best practice for pnpm monorepos.

### Version Alignment

**Option A: Independent versioning (Recommended for Phoenix)**

- Each package has its own version
- Use Changesets for automated versioning and changelogs
- Apps pin to `workspace:*` (always latest local version)

**Option B: Unified versioning**

- All packages share single version number
- Simpler, but overkill for a starter template

## shadcn/ui CLI Integration

### Monorepo-Aware Component Installation

Phoenix has **two `components.json` files** with different roles:

```
apps/web/components.json           # App-specific components (login-form, etc.)
packages/ui/components.json        # Shared components (button, input, etc.)
```

**shadcn CLI behavior:**

- Run from `apps/web/`: Installs base components to `packages/ui`, specialized components to `apps/web`
- Automatically rewrites imports: `@/components/button` → `@phoenix/ui/components/button`

### Alias Configuration

```json
// packages/ui/components.json
{
  "aliases": {
    "components": "@phoenix/ui/components",
    "utils": "@phoenix/ui/lib/utils",
    "hooks": "@phoenix/ui/hooks"
  }
}

// apps/web/components.json
{
  "aliases": {
    "components": "@/components",
    "ui": "@phoenix/ui/components",
    "utils": "@phoenix/ui/lib/utils"
  }
}
```

**Critical requirement:** Both files must have matching `style`, `iconLibrary`, and `baseColor` settings. Mismatches cause component incompatibility.

## Claude-First Architecture

### Path-Scoped Rules with .claude/rules/

Phoenix uses **numbered rule files with frontmatter scoping**:

```markdown
---
name: token-pipeline-rules
description: Style Dictionary token authoring and transformation rules
paths:
  - 'packages/tokens/**'
---

# Token Pipeline Rules

When working in packages/tokens/:

- NEVER manually edit files in dist/ (generated artifacts)
- Seed tokens are source of truth (src/seed/\*.json)
- Run pnpm build to regenerate after token changes
```

**How Claude uses this:**

- When Claude opens `packages/tokens/src/seed/colors.json`, only `10-tokens.md` loads
- When Claude opens `packages/ui/src/components/button.tsx`, only `20-ui.md` loads
- Context window stays clean; rules only load when relevant

**File naming convention:**

```
10-tokens.md     (loads for packages/tokens/**)
20-ui.md         (loads for packages/ui/**)
30-apps.md       (loads for apps/**)
```

**Numbering indicates priority** if multiple rules match. Lower numbers load first.

## Patterns to Follow

### Pattern 1: Token-First Component Design

**What:** Start with semantic tokens, never hardcode values.

**When:** Every component in `packages/ui/`

**Example:**

```typescript
// CORRECT: Uses semantic tokens
const buttonVariants = cva(
  'bg-primary text-primary-foreground hover:bg-primary/90',
)

// INCORRECT: Arbitrary values bypass token system
const buttonVariants = cva('bg-[#3b82f6] text-white hover:bg-[#2563eb]')
```

**Enforcement:** ESLint rule `no-arbitrary-values` in `packages/ui/.eslintrc.js`

### Pattern 2: Dependency Direction Enforcement

**What:** Packages in lower layers never import from higher layers.

**When:** Always. Violations break the build order.

**Valid:**

```typescript
// packages/ui/src/components/button.tsx
import '@phoenix/tokens/dist/css/vars.css' // Lower layer → OK
```

**Invalid:**

```typescript
// packages/tokens/src/config.js
import { Button } from '@phoenix/ui' // Higher layer → CIRCULAR DEP
```

**Enforcement:** pnpm refuses to resolve circular workspace dependencies.

### Pattern 3: Generated Artifacts in .gitignore

**What:** Never commit Style Dictionary outputs or tsup build artifacts.

**When:** Always.

**Why:** Generated files create merge conflicts and stale builds.

```
# packages/tokens/.gitignore
dist/

# packages/ui/.gitignore
dist/
```

**Enforcement:** Pre-commit hook checks for committed build artifacts.

### Pattern 4: Turborepo Task Dependencies

**What:** Explicitly declare task dependencies in `turbo.json`

**When:** Setting up new packages or tasks

**Example:**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // Build deps first
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"] // Test requires built artifacts
    }
  }
}
```

**Why:** Turborepo's caching and parallelization rely on correct dependency graphs.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Importing from src/ Instead of dist/

**What:** Importing source files directly instead of built artifacts.

```typescript
// INCORRECT

// CORRECT
import { Button } from '@phoenix/ui'
import { Button } from '@phoenix/ui/src/components/button'
```

**Why bad:** Bypasses the build step, breaks TypeScript types, causes bundler errors.

**Detection:** Import path contains `/src/` for workspace packages.

**Prevention:** Configure `package.json` exports field to only expose `dist/`.

### Anti-Pattern 2: Manual CSS Variable Definitions

**What:** Defining CSS custom properties manually instead of using generated vars.css.

```css
/* INCORRECT: Manual definition in packages/ui/global.css */
:root {
  --color-primary: #3b82f6;
}

/* CORRECT: Import generated vars */
@import '@phoenix/tokens/dist/css/vars.css';
```

**Why bad:** Creates drift between design tokens and actual styles. Token changes don't propagate.

**Prevention:** ESLint rule forbidding `--color-*`, `--spacing-*` definitions outside `packages/tokens/`.

### Anti-Pattern 3: Re-exporting External Dependencies

**What:** Re-exporting third-party libraries through `packages/ui/index.ts`.

```typescript
// INCORRECT
export { default as clsx } from 'clsx'

// CORRECT
// Consumers install clsx themselves if needed
```

**Why bad:** Locks all consumers to the same version, inflates bundle size, violates single responsibility.

**Exception:** `cn()` utility is allowed (thin wrapper, not pure re-export).

### Anti-Pattern 4: Cross-App Imports

**What:** One app importing from another app.

```typescript
// apps/web/src/pages/home.tsx
import { Dashboard } from '../../storybook/stories/dashboard' // WRONG
```

**Why bad:** Apps are deployment units, not shared packages. Creates coupling and breaks independent builds.

**Instead:** Extract shared logic to `packages/ui` or a new shared package.

### Anti-Pattern 5: Committing node_modules or .turbo Cache

**What:** Accidentally committing cached build outputs.

**Why bad:** Bloats repository, causes stale cache issues.

**Prevention:**

```gitignore
node_modules/
.turbo/
dist/
build/
```

## Scalability Considerations

| Concern                 | At 12 Components (MVP) | At 50 Components                                      | At 200 Components                             |
| ----------------------- | ---------------------- | ----------------------------------------------------- | --------------------------------------------- |
| **Build time**          | < 10s for full build   | < 30s with Turborepo caching                          | Requires remote caching (Vercel Remote Cache) |
| **Type checking**       | Instant                | Use TypeScript project references (`composite: true`) | Require incremental builds                    |
| **Component discovery** | Storybook sufficient   | Add search/filter to Storybook                        | Need dedicated docs site (Docusaurus, Nextra) |
| **Token management**    | Flat token files OK    | Organize by category (color.json, spacing.json)       | Introduce token groups, aliasing              |
| **Package split**       | Single @phoenix/ui     | Split by domain (layout, forms, feedback)             | Micro-packages per component                  |

**Phoenix targets MVP scale** (12 components). Architecture supports growth to 50+ components without changes.

## Integration Points

### Figma Code Connect

**What:** Metadata files linking Figma components to code components.

**Location:** `packages/ui/src/components/button.figma.tsx`

**Purpose:** Figma Dev Mode shows actual React code for components.

**Build impact:** None (metadata files, not imported by runtime code).

### Pre-commit Hooks

**What:** Husky + lint-staged runs checks before commit.

**Enforces:**

- `pnpm lint` (ESLint)
- `pnpm format:check` (Prettier)
- `pnpm typecheck` (TypeScript)

**Build impact:** Prevents broken code from entering repository. Runs only on staged files (fast).

### CI Pipeline

**What:** GitHub Actions runs on every push.

**Steps:**

1. Install dependencies (`pnpm install`)
2. Build all packages (`pnpm build`)
3. Lint (`pnpm lint`)
4. Typecheck (`pnpm typecheck`)
5. Test (`pnpm test`)

**Build caching:** Turborepo remote cache (Vercel) speeds up CI by reusing previous builds.

## Technical Decisions

### Why tsup Over Rollup/esbuild Directly?

**Decision:** Use tsup for building `packages/ui`

**Rationale:**

- Zero-config for TypeScript libraries
- Dual ESM/CJS output with single command
- Automatic .d.ts generation
- Built on esbuild (extremely fast)
- Standard in Turborepo ecosystem

**Alternative considered:** Raw esbuild (more config, same speed)

### Why Style Dictionary Over Vanilla CSS Variables?

**Decision:** Use Style Dictionary for token transformation

**Rationale:**

- Platform-agnostic (can generate iOS, Android tokens later)
- Transformation pipeline (references, aliasing, math)
- Figma integration via @tokens-studio/sd-transforms
- Industry standard for design systems

**Alternative considered:** Hand-write CSS variables (no upgrade path, no transforms)

### Why Storybook as Separate App?

**Decision:** `apps/storybook/` instead of `packages/ui/.storybook/`

**Rationale:**

- Keeps `packages/ui` lean (no dev dependencies)
- Can import from `@phoenix/ui` like real consumers
- Easier to deploy as standalone docs site
- Matches Turborepo design-system example pattern

**Alternative considered:** Storybook inside `packages/ui` (tighter coupling, harder to deploy)

### Why Numbered .claude/rules/ Files?

**Decision:** `10-tokens.md`, `20-ui.md` instead of single `CLAUDE.md`

**Rationale:**

- Path scoping keeps context windows clean
- Only relevant rules load per package
- Numbering indicates load priority
- Supports fine-grained rule organization

**Alternative considered:** Single CLAUDE.md (too large, all rules load always)

## Open Questions & Future Research

### Question 1: TypeScript Project References

**Status:** Not implemented in Phoenix MVP

**When needed:** > 50 components, slow type checking

**What it is:** TypeScript `composite` flag + `references` array enables incremental builds across packages.

**Research needed:** Performance impact, impact on IDE experience.

### Question 2: Remote Caching Strategy

**Status:** Not configured in Phoenix MVP

**When needed:** CI builds > 2 minutes, team > 3 developers

**What it is:** Turborepo Remote Cache (Vercel) shares build artifacts across machines.

**Research needed:** Setup for private repositories, cost analysis.

### Question 3: Component Versioning Strategy

**Status:** Independent versioning assumed, not implemented

**When needed:** Before first npm publish

**What it is:** Changesets automates version bumps, changelogs, and npm publishing.

**Research needed:** Phoenix as starter template may never publish to npm (users rename and own it).

## Sources

**HIGH Confidence (Official Documentation):**

- [Turborepo Design System Example](https://github.com/vercel/turborepo/tree/main/examples/design-system)
- [shadcn/ui Monorepo Documentation](https://ui.shadcn.com/docs/monorepo)
- [Style Dictionary Design Tokens](https://styledictionary.com/info/tokens/)
- [pnpm Workspace Protocol](https://pnpm.io/workspaces)
- [Turborepo Pipeline Configuration](https://turbo.build/repo/docs/handbook/linting/eslint)

**MEDIUM Confidence (Community Best Practices):**

- [Scaling Frontend with Monorepo and Design Systems](https://medium.com/@satnammca/scaling-your-frontend-a-monorepo-and-design-system-playbook-957e38c8c9e4)
- [Complete Monorepo Guide 2026](https://jsdev.space/complete-monorepo-guide/)
- [Style Dictionary + Tailwind Integration](https://github.com/style-dictionary/style-dictionary/tree/main/examples/advanced/tailwind-preset)
- [Turborepo Build Order Management](https://www.luisball.com/blog/turborepo-prepare-tasks)

**LOW Confidence (Requires Validation):**

- Figma Code Connect impact on build performance (not documented)
- Optimal threshold for package splitting (50 vs 200 components)
