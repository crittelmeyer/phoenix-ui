# Phase 1: Foundation - Research

**Researched:** 2026-02-01
**Domain:** Monorepo infrastructure (pnpm + Turborepo)
**Confidence:** HIGH

## Summary

Phase 1 establishes the monorepo foundation using pnpm 10 workspaces orchestrated by Turborepo 2.7, with comprehensive tooling for linting (ESLint 9), formatting (Prettier 3), and pre-commit validation. The 2026 ecosystem has converged on this stack as the standard for modern JavaScript monorepos, offering sub-second incremental builds via Rust-based task orchestration and deterministic dependency resolution through pnpm's symlink-based architecture.

The critical path involves: (1) workspace structure with strict separation of apps/ and packages/, (2) pnpm-workspace.yaml + turbo.json configuration with correct task dependencies, (3) shared tooling configs (TypeScript, ESLint, Prettier) extending from base packages, (4) pre-commit hooks via Husky + lint-staged running lint/typecheck/format on staged files only, and (5) React 18.3.0 pinning via pnpm.overrides to avoid the React 19 + Radix UI infinite loop bug.

Key technical decisions: ESLint 9 flat config format (eslint.config.mjs), Prettier 3 with Tailwind plugin loaded last, eslint-plugin-tailwindcss for no-arbitrary-value enforcement, Turborepo persistent tasks for dev servers, TypeScript project references for inter-package type awareness, and Conventional Commits enforcement via commitlint. The highest risk pitfall is TypeScript typechecking in lint-staged (tsc checks entire project graph, not just staged files) requiring careful performance tuning or alternative strategies.

**Primary recommendation:** Follow Turborepo's official design-system example structure, configure pnpm.overrides for React pinning early, use eslint-config-prettier to prevent Prettier conflicts, and run typecheck as a separate Turborepo task rather than in lint-staged for optimal pre-commit performance.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| pnpm | 10.x | Package manager + workspace protocol | Fastest install speed, strict dependency resolution prevents phantom deps, workspace:* protocol for local packages, 2026 industry standard for monorepos |
| Turborepo | 2.7.x | Task orchestration + caching | Rust-based performance (100x faster incremental builds), remote caching, automatic task parallelization, Vercel-maintained with design-system examples |
| TypeScript | 5.9.x | Type system | Latest stable, avoid TS 7 beta, project references for monorepos, strict mode standard in 2026 |
| ESLint | 9.x | Code linting | Flat config format (eslint.config.mjs), CSS support added 2025, ecosystem plugins mature |
| Prettier | 3.x | Code formatting | ESM-only, deterministic formatting, integrates with Tailwind plugin, industry standard |
| Husky | 9.x | Git hook management | .husky/ directory, prepare script auto-install, Conventional Commits ecosystem |
| lint-staged | 16.x | Staged file linting | Monorepo-ready (auto-discovers configs), filters staged files for performance, TS config support |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| eslint-plugin-tailwindcss | 3.17.x | Tailwind linting rules | Enforce no-arbitrary-value in packages/ui, classnames-order can conflict with Prettier |
| prettier-plugin-tailwindcss | 0.6.x | Tailwind class sorting | MUST load last in plugins array, official sorting algorithm, requires Prettier 3 |
| @commitlint/cli | 19.x | Commit message linting | Conventional Commits enforcement, integrates with Husky commit-msg hook |
| @commitlint/config-conventional | 19.x | Standard commit types | Defines feat/fix/chore/docs/etc., Angular convention-based |
| eslint-config-prettier | 9.x | Disable conflicting ESLint rules | ESSENTIAL to prevent ESLint + Prettier conflicts, especially with Tailwind plugins |
| @ianvs/prettier-plugin-sort-imports | 4.x | Import statement sorting | React first, external, internal (@phoenix/*), relative order |
| Vite | 7.3.x | Build tool | 100x faster than webpack, native ESM, @tailwindcss/vite integration |
| React Router | 7.13.x | SPA routing | Library mode (not framework), BrowserRouter for client-side routing |
| Tailwind CSS | 4.1.x | Utility-first CSS | @import "tailwindcss" syntax, @tailwindcss/vite plugin, 5x faster builds |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pnpm | Yarn Berry (v4) | Yarn has Plug'n'Play but more complex, pnpm simpler and faster in 2026 benchmarks |
| Turborepo | Nx | Nx more features (generators, migrations) but heavier, Turborepo lighter for pure build orchestration |
| Husky | Lefthook | Lefthook faster (Go-based) but smaller ecosystem, Husky more integrations |
| lint-staged | pre-commit (Python) | pre-commit language-agnostic but adds Python dependency, lint-staged native to JS ecosystem |

**Installation:**

```bash
# Package manager
npm install -g pnpm@10

# Root dependencies (dev)
pnpm add -D turbo husky lint-staged

# Shared tooling packages (create separate packages)
# packages/eslint-config/package.json
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier eslint-plugin-tailwindcss

# packages/typescript-config/package.json
# (no dependencies, just tsconfig.json files)

# Root Prettier + plugins
pnpm add -D prettier prettier-plugin-tailwindcss @ianvs/prettier-plugin-sort-imports

# Commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

## Architecture Patterns

### Recommended Project Structure

```
phoenix/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Optional: lint + typecheck + build on PRs
├── .husky/
│   ├── commit-msg                    # commitlint hook
│   └── pre-commit                    # lint-staged hook
├── apps/
│   ├── web/                          # Vite + React Router app
│   │   ├── src/
│   │   ├── package.json              # Depends on @phoenix/ui
│   │   ├── tsconfig.json             # Extends @phoenix/typescript-config/react.json
│   │   └── vite.config.ts            # @tailwindcss/vite plugin
│   └── storybook/                    # (Phase 4)
├── packages/
│   ├── ui/                           # (Phase 3+)
│   ├── tokens/                       # (Phase 2)
│   ├── eslint-config/
│   │   ├── base.mjs                  # Shared ESLint rules
│   │   ├── react.mjs                 # React-specific rules
│   │   └── package.json              # name: "@phoenix/eslint-config"
│   └── typescript-config/
│       ├── base.json                 # Shared compiler options
│       ├── react.json                # extends base.json, adds jsx
│       └── package.json              # name: "@phoenix/typescript-config"
├── .npmrc                            # engine-strict=true, public-hoist-pattern
├── .prettierrc.json                  # plugins array, importOrder config
├── commitlint.config.mjs             # extends @commitlint/config-conventional
├── package.json                      # private: true, pnpm.overrides for React
├── pnpm-workspace.yaml               # packages: ["apps/*", "packages/*"]
├── turbo.json                        # tasks: build, dev, lint, typecheck, format
└── README.md                         # Clone + install + dev instructions
```

### Pattern 1: Workspace Configuration (pnpm-workspace.yaml)

**What:** Defines which directories contain packages in the monorepo

**When to use:** Required at repository root for pnpm workspaces

**Example:**

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Critical:** Turborepo does NOT support nested globs like `packages/**`. Use flat patterns only (`packages/*`, `packages/group/*`).

### Pattern 2: Workspace Protocol for Internal Dependencies

**What:** `workspace:*` ensures local package resolution during development

**When to use:** All internal dependencies between packages

**Example:**

```json
// apps/web/package.json
{
  "name": "@phoenix/web",
  "dependencies": {
    "@phoenix/ui": "workspace:*",
    "@phoenix/tokens": "workspace:*"
  }
}
```

**Why:** Prevents downloading from npm registry, ensures symlinks to local packages, version published correctly (`workspace:*` becomes actual version in published package).

### Pattern 3: Turborepo Task Configuration

**What:** Define task dependencies, outputs, and caching in turbo.json

**When to use:** All tasks that should be cached or orchestrated (build, lint, test, typecheck)

**Example:**

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
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
    },
    "format:check": {
      "cache": false
    }
  }
}
```

**Key:** `^build` means "wait for dependencies' build tasks to complete first" (dependencies before dependents). Persistent tasks (dev servers) disable caching and allow simultaneous execution.

### Pattern 4: React Version Pinning (pnpm.overrides)

**What:** Force all packages to use React 18.3.0 to avoid Radix UI infinite loop bug

**When to use:** Immediately in root package.json

**Example:**

```json
// package.json (root)
{
  "private": true,
  "engines": {
    "node": ">=22.0.0"
  },
  "pnpm": {
    "overrides": {
      "react": "18.3.0",
      "react-dom": "18.3.0",
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0"
    }
  }
}
```

**Why:** React 19 + Radix UI triggers "Maximum update depth exceeded" errors (GitHub issue radix-ui/primitives#3799). pnpm.overrides forces all transitive dependencies to use specified versions.

### Pattern 5: ESLint 9 Flat Config with TypeScript + React

**What:** Modern eslint.config.mjs format with plugins as imported objects

**When to use:** ESLint 9+ (default in 2026)

**Example:**

```javascript
// packages/eslint-config/react.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tailwindPlugin from 'eslint-plugin-tailwindcss'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      tailwindcss: tailwindPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'tailwindcss/no-arbitrary-value': 'error', // packages/ui
      'tailwindcss/no-custom-classname': 'off',
    },
  },
  prettier // MUST be last to disable conflicting rules
)
```

**Consumption:**

```javascript
// apps/web/eslint.config.mjs
import baseConfig from '@phoenix/eslint-config/react.mjs'

export default [...baseConfig]
```

### Pattern 6: Prettier with Import Sorting + Tailwind Plugin

**What:** Configure plugins array with Tailwind plugin last for correct execution order

**When to use:** Root .prettierrc.json for entire monorepo

**Example:**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrder": [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "^@phoenix/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

**Critical:** prettier-plugin-tailwindcss MUST be last in plugins array. ESM-only in v0.5+, requires Prettier 3.

### Pattern 7: Husky + lint-staged Pre-commit Hook

**What:** Run lint/typecheck/format on staged files only before commit

**When to use:** Developer quality gates before code enters git history

**Setup:**

```bash
# Initialize Husky
pnpm exec husky init
```

```bash
# .husky/pre-commit
pnpm lint-staged
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,mdx,css}": [
      "prettier --write"
    ]
  }
}
```

**Note:** Do NOT run `tsc` in lint-staged (typechecks entire project graph). Instead, run typecheck as separate Turborepo task or use `turbo run typecheck --filter=[HEAD^1]` in pre-commit.

### Pattern 8: TypeScript Shared Config with Project References

**What:** Base tsconfig extended by all packages, project references for monorepo type awareness

**When to use:** All TypeScript packages

**Example:**

```json
// packages/typescript-config/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

```json
// packages/typescript-config/react.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2023", "DOM", "DOM.Iterable"]
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "@phoenix/typescript-config/react.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/tokens" }
  ]
}
```

**Why:** `composite: true` enables incremental builds and project references. References array allows cross-package type checking without rebuilding.

### Pattern 9: Vite + Tailwind CSS 4 + React Router 7

**What:** Modern dev server with Tailwind Vite plugin and library-mode React Router

**When to use:** apps/web (Phase 1 foundation)

**Example:**

```typescript
// apps/web/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

```css
/* apps/web/src/index.css */
@import "tailwindcss";
```

```tsx
// apps/web/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

**Why:** @tailwindcss/vite eliminates PostCSS config, automatic content detection, 5x faster builds. React Router 7 library mode (not framework mode) for SPA with BrowserRouter.

### Pattern 10: Conventional Commits Enforcement

**What:** commitlint validates commit messages against Conventional Commits spec

**When to use:** commit-msg hook for all commits

**Setup:**

```bash
# .husky/commit-msg
pnpm commitlint --edit $1
```

```javascript
// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
}
```

**Allowed types:** feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert

**Format:** `type(scope): subject` (e.g., `feat(ui): add Button component`)

### Anti-Patterns to Avoid

- **No lockfile:** Turborepo behavior unpredictable without pnpm-lock.yaml, always commit it
- **Nested package globs:** `packages/**` breaks Turborepo, use flat globs (`packages/*`)
- **Cross-package file access:** Writing `../../packages/ui/src/Button.tsx` from apps/web violates package boundaries, use imports
- **TypeScript in lint-staged:** Running `tsc` on staged files doesn't work (checks entire project), use separate Turborepo task
- **shamefully-hoist:** Enables phantom dependencies, use public-hoist-pattern sparingly if needed
- **Arbitrary task ordering:** Define explicit dependsOn in turbo.json, don't rely on execution order
- **Prettier before Tailwind plugin:** Tailwind plugin MUST be last in plugins array or sorting breaks
- **Missing eslint-config-prettier:** ESLint + Prettier will conflict on formatting rules

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Commit message validation | Custom git hook script | commitlint + @commitlint/config-conventional | 200+ commit types edge cases (merge commits, reverts, breaking changes), semver integration, changelog generation compatibility |
| Workspace task orchestration | bash scripts with package manager | Turborepo | Dependency graph analysis, incremental builds, remote caching, parallelization, 100x faster than manual scripts |
| Pre-commit file filtering | Custom git diff logic | lint-staged | Handles renames, deletions, binary files, supports multiple config files in monorepo, escapes special chars in filenames |
| Import statement sorting | Manual ESLint rule | @ianvs/prettier-plugin-sort-imports | Type-aware sorting, side-effect imports handling, namespace imports, 50+ edge cases |
| Package scope renaming | Find-replace + sed scripts | Use official tools (e.g., @manypkg/cli) or vetted community scripts | Package.json patching, lockfile updates, git history preservation, import path rewriting |
| TypeScript config sharing | Copy-paste tsconfig | @phoenix/typescript-config package | Version pinning, consistent options, incremental updates, project references setup |
| ESLint config sharing | Copy-paste rules | @phoenix/eslint-config package | Plugin version compatibility, rule presets, TypeScript parser config |
| Node version enforcement | README warning | engines field + .npmrc engine-strict=true | Hard failure on wrong version, CI integration, automatic tooling (nvm, volta) detection |

**Key insight:** Monorepo tooling has matured in 2024-2026. The "simple bash script" approach scales poorly and misses edge cases discovered by ecosystem tools. The time cost of hand-rolling is higher than learning standard tools.

## Common Pitfalls

### Pitfall 1: TypeScript Typechecking in lint-staged

**What goes wrong:** Adding `tsc --noEmit` to lint-staged causes slow pre-commit hooks and checks unstaged files

**Why it happens:** TypeScript must analyze entire project graph to type-check any file (imports, exports, type references). Passing staged file paths as `tsc file1.ts file2.ts` doesn't work - tsc ignores tsconfig.json and treats them as isolated files.

**How to avoid:**
- **Option A (Recommended):** Run typecheck as separate Turborepo task (`turbo run typecheck`), not in pre-commit hook
- **Option B:** Use `turbo run typecheck --filter=[HEAD^1]` in pre-commit to check only affected packages
- **Option C:** Accept whole-project typecheck in pre-commit, optimize with incremental builds

**Warning signs:** Pre-commit hook takes >10 seconds, typecheck reports errors in unstaged files

### Pitfall 2: pnpm Hoisting Breaking Radix UI Types

**What goes wrong:** TypeScript can't find `@types/react` in Radix UI packages, causing phantom dependency errors

**Why it happens:** pnpm's strict dependency resolution prevents transitive dependencies from being hoisted to node_modules root. Radix UI expects @types/react from React's peer dependency resolution.

**How to avoid:**

```ini
# .npmrc
public-hoist-pattern[]=@types/react
public-hoist-pattern[]=@types/react-dom
```

**Why this works:** public-hoist-pattern hoists matching packages to root node_modules, making them accessible to all packages (unlike hoist-pattern which uses hidden virtual store).

**Warning signs:** TS2307 errors for @types/react in @radix-ui packages, compilation works with npm/yarn but fails with pnpm

### Pitfall 3: Prettier + ESLint Formatting Conflicts

**What goes wrong:** ESLint --fix and Prettier --write produce different formatting, infinite loop in pre-commit hooks

**Why it happens:** ESLint has formatting rules (quotes, semi, indent) that conflict with Prettier's opinionated style

**How to avoid:**

```bash
pnpm add -D eslint-config-prettier
```

```javascript
// eslint.config.mjs
import prettier from 'eslint-config-prettier'

export default [
  // ... other configs
  prettier, // MUST be last to disable conflicting rules
]
```

**Why this works:** eslint-config-prettier disables all ESLint rules that conflict with Prettier (formatting, not code quality).

**Warning signs:** Files change back and forth between `eslint --fix` and `prettier --write`, CI fails inconsistently

### Pitfall 4: Tailwind Plugin Load Order in Prettier

**What goes wrong:** Tailwind classes not sorted correctly, or import sorting breaks

**Why it happens:** Prettier plugins execute in array order. Tailwind plugin rewrites class attributes - if it runs before import sorter, imports get corrupted.

**How to avoid:**

```json
{
  "plugins": [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ]
}
```

**Critical:** prettier-plugin-tailwindcss MUST be last in plugins array.

**Warning signs:** Imports contain Tailwind class names, classes sorted alphabetically instead of Tailwind convention

### Pitfall 5: Missing Turborepo Cache Invalidation for Token Changes

**What goes wrong:** Modifying design tokens in packages/tokens doesn't trigger rebuild of packages/ui, stale CSS used

**Why it happens:** Turborepo's default inputs glob only tracks package's own files, not upstream dependencies' output files

**How to avoid:**

```json
// packages/ui/turbo.json (package-specific config)
{
  "$schema": "https://turborepo.dev/schema.json",
  "extends": ["//"],
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "../tokens/dist/**/*.css", "../tokens/dist/**/*.json"]
    }
  }
}
```

**Why this works:** Explicit inputs globs add token dist files to cache key hash, forcing rebuild when tokens change.

**Warning signs:** Components use old token values after token changes, `turbo run build --force` fixes it

### Pitfall 6: Vite HMR Not Working for Monorepo Packages

**What goes wrong:** Changing code in packages/ui doesn't trigger HMR in apps/web, requires manual refresh

**Why it happens:** Vite loads bundled code from packages/ui/dist, doesn't watch source files. Every change requires rebuild.

**How to avoid:**
- **Option A (Development):** Export source TypeScript from packages/ui: `"main": "src/index.ts"` in dev mode
- **Option B (Production-like):** Use Vite's `optimizeDeps.exclude: ['@phoenix/ui']` to force Vite to re-bundle on changes
- **Option C (Watcher):** Run `turbo run build --watch` in parallel with dev server

**Recommended for Phase 1:** Option A (source exports) for fastest DX during initial setup.

**Warning signs:** Changes to packages/ui require manual browser refresh, no HMR overlay

### Pitfall 7: Node.js Version Not Enforced

**What goes wrong:** Developer uses Node 20, encounters errors in dependencies requiring Node 22 features

**Why it happens:** package.json engines field is advisory only, doesn't block installation

**How to avoid:**

```json
// package.json (root)
{
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=10.0.0"
  }
}
```

```ini
# .npmrc
engine-strict=true
```

**Why this works:** engine-strict=true makes pnpm throw error if Node/pnpm version doesn't match engines field.

**Additional:** Add .node-version or .nvmrc file for automatic version switching with nvm/volta.

**Warning signs:** "Works on my machine" issues, CI failures with different Node version

### Pitfall 8: Turborepo Not Ignoring .env Files

**What goes wrong:** Changing .env.local invalidates Turborepo cache, forces rebuild of all tasks

**Why it happens:** Turborepo tracks all git-tracked files by default. If .env files committed (bad practice), they invalidate hashes.

**How to avoid:**

```json
// turbo.json
{
  "globalDependencies": [
    "!**/.env*"
  ],
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "!.env*"]
    }
  }
}
```

**Best practice:** Never commit .env files. Use .env.example as template, add .env* to .gitignore.

**Warning signs:** Turborepo cache misses on every run, FULL_TURBO output never appears

### Pitfall 9: React Router 7 Framework Mode Instead of Library Mode

**What goes wrong:** Following React Router 7 default docs installs framework mode (SSR, file-based routing), not SPA library mode

**Why it happens:** React Router 7 defaults to framework mode (Remix successor). Phase 1 needs library mode (BrowserRouter, code-based routing).

**How to avoid:**

```bash
# DON'T use create-react-router (framework mode)
# DO use standard Vite + manual React Router install

pnpm create vite apps/web --template react-ts
cd apps/web
pnpm add react-router
```

Use BrowserRouter, not createBrowserRouter/RouterProvider (data routers are framework mode).

**Warning signs:** Project has react-router.config.ts, routes.ts files, @react-router/dev dependency

### Pitfall 10: Circular Dependencies Between Packages

**What goes wrong:** packages/ui imports from packages/tokens, packages/tokens imports utilities from packages/ui, Turborepo can't determine build order

**Why it happens:** Sloppy package boundaries - utilities belong in separate packages/utils package

**How to avoid:**
- Strict dependency hierarchy: tokens (no deps) → ui (depends on tokens) → apps (depends on ui)
- Never import from higher layers to lower layers
- Extract shared utilities to separate packages/utils package

**Validation:** Run `pnpm list --depth=Infinity | grep @phoenix` to visualize dependency tree.

**Warning signs:** Turborepo errors "circular dependency detected", build order non-deterministic

## Code Examples

Verified patterns from official sources:

### Complete pnpm Workspace Setup

```yaml
# pnpm-workspace.yaml
# Source: https://pnpm.io/workspaces
packages:
  - "apps/*"
  - "packages/*"
```

```json
// package.json (root)
{
  "name": "phoenix",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=10.0.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  },
  "devDependencies": {
    "turbo": "^2.7.0",
    "prettier": "^3.8.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "@ianvs/prettier-plugin-sort-imports": "^4.4.0",
    "husky": "^9.0.0",
    "lint-staged": "^16.1.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0"
  },
  "pnpm": {
    "overrides": {
      "react": "18.3.0",
      "react-dom": "18.3.0",
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,mdx,css}": [
      "prettier --write"
    ]
  }
}
```

```ini
# .npmrc
# Source: https://pnpm.io/npmrc
engine-strict=true
auto-install-peers=true
public-hoist-pattern[]=@types/react
public-hoist-pattern[]=@types/react-dom
```

### Complete Turborepo Configuration

```json
// turbo.json
// Source: https://turborepo.dev/docs/reference/configuration
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": [
    "!**/.env*"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
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
    },
    "format:check": {
      "cache": false
    }
  }
}
```

### ESLint 9 Flat Config for packages/ui

```javascript
// packages/eslint-config/react.mjs
// Source: https://typescript-eslint.io/getting-started
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tailwindPlugin from 'eslint-plugin-tailwindcss'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      tailwindcss: tailwindPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      // ERROR in packages/ui, WARNING in apps/*
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off', // Prettier handles this
    },
  },
  prettier
)
```

```javascript
// packages/ui/eslint.config.mjs
import baseConfig from '@phoenix/eslint-config/react.mjs'

export default baseConfig
```

```javascript
// apps/web/eslint.config.mjs
import baseConfig from '@phoenix/eslint-config/react.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...baseConfig,
  {
    rules: {
      // Downgrade to warning in apps
      'tailwindcss/no-arbitrary-value': 'warn',
    },
  }
)
```

### Prettier Configuration with Plugins

```json
// .prettierrc.json
// Source: https://github.com/tailwindlabs/prettier-plugin-tailwindcss
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "plugins": [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrder": [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "^@phoenix/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

### Husky + lint-staged Setup

```bash
# Initialize Husky
# Source: https://typicode.github.io/husky/
pnpm exec husky init
```

```bash
#!/usr/bin/env sh
# .husky/pre-commit
pnpm lint-staged
```

```bash
#!/usr/bin/env sh
# .husky/commit-msg
pnpm commitlint --edit $1
```

```javascript
// commitlint.config.mjs
// Source: https://commitlint.js.org/
export default {
  extends: ['@commitlint/config-conventional'],
}
```

### Vite + Tailwind CSS 4 Configuration

```typescript
// apps/web/vite.config.ts
// Source: https://vite.dev/guide/ + https://tailwindcss.com/docs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

```css
/* apps/web/src/index.css */
/* Source: https://tailwindcss.com/docs/installation/framework-guides/vite */
@import "tailwindcss";
```

### Rename Script for Package Scope

```javascript
// scripts/rename-scope.mjs
// Community pattern for renaming @phoenix to custom scope
import { readFileSync, writeFileSync } from 'fs'
import { globSync } from 'glob'

const oldScope = '@phoenix'
const newScope = process.argv[2]

if (!newScope) {
  console.error('Usage: node scripts/rename-scope.mjs @yourscope')
  process.exit(1)
}

const files = globSync('**/{package.json,*.ts,*.tsx,*.js,*.jsx,*.md}', {
  ignore: ['**/node_modules/**', '**/dist/**'],
})

files.forEach((file) => {
  const content = readFileSync(file, 'utf-8')
  const updated = content.replaceAll(oldScope, newScope)
  if (content !== updated) {
    writeFileSync(file, updated)
    console.log(`Updated: ${file}`)
  }
})

console.log(`Renamed ${oldScope} to ${newScope}`)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ESLint .eslintrc.json | ESLint 9 flat config (eslint.config.mjs) | ESLint 9.0 (2024) | Plugins as imports, better TypeScript support, breaking change |
| Prettier 2 (CJS) | Prettier 3 (ESM-only) | Prettier 3.0 (2023) | Faster, requires `type: module` or .mjs files |
| Tailwind v3 + PostCSS | Tailwind v4 + @tailwindcss/vite | Tailwind 4.0 (2024) | 5x faster builds, CSS-first config, no tailwind.config.js |
| npm/yarn workspaces | pnpm workspaces | Industry shift (2022-2024) | Faster installs, strict deps prevent phantom issues |
| Lerna for task running | Turborepo | Vercel acquisition + Turborepo 2.0 (2024) | 100x faster, better caching, simpler config |
| React Router v6 | React Router v7 (Remix merge) | React Router 7.0 (2024) | Framework mode (SSR) + library mode (SPA), breaking API changes |
| TypeScript 5.x | TypeScript 5.9 (stable for 2026) | Avoid TS 7 beta | TS 7 too unstable for production use |
| Manual hook scripts | Husky 9 | Husky 9.0 (2024) | Simpler setup (husky init), better DX |

**Deprecated/outdated:**
- **create-react-app:** Officially deprecated, use Vite instead
- **Lerna for task orchestration:** Still maintained for versioning but Turborepo preferred for builds
- **@tailwind directives:** Use `@import "tailwindcss"` in Tailwind v4
- **.eslintrc:** Use flat config (eslint.config.mjs) in ESLint 9+
- **Yarn 1 (Classic):** Yarn 4 (Berry) exists but pnpm more popular in monorepos as of 2026

## Open Questions

Things that couldn't be fully resolved:

1. **GitHub Actions CI Workflow**
   - What we know: Standard setup is checkout → setup-node → pnpm install → turbo run lint/typecheck/build
   - What's unclear: Whether Phoenix needs CI at all (starter template, not SaaS product), cost/benefit for local-hooks-only vs full CI
   - Recommendation: Leave to Claude's discretion during planning. Include as optional task with simple example (lint + typecheck on PR only).

2. **Welcome Page Design**
   - What we know: Minimal page showing "Phoenix", logo, link to Storybook
   - What's unclear: Exact styling, whether to use Tailwind utilities or wait for tokens (Phase 2)
   - Recommendation: Use basic Tailwind utilities (bg-slate-900, text-white, etc.) for Phase 1. Refactor to token-based in Phase 2 as demonstration.

3. **Typecheck in Pre-commit Hook**
   - What we know: Running tsc in lint-staged is slow and checks whole project
   - What's unclear: Best practice for monorepos (skip typecheck, use turbo affected, accept whole-project check)
   - Recommendation: Run `turbo run typecheck` as separate task, NOT in lint-staged. Typecheck on CI only. Document as performance decision.

4. **Package Exports Strategy**
   - What we know: packages/ui should export from dist/ in production, but src/ exports better for HMR during development
   - What's unclear: Whether to use conditional exports (`"development": "src/index.ts"`, `"production": "dist/index.js"`) or keep it simple
   - Recommendation: Phase 1 uses src/ exports for simplest setup. Phase 3 (when building ui package) can add conditional exports if needed.

## Sources

### Primary (HIGH confidence)

- [Turborepo Structuring a Repository](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository) — Monorepo structure best practices
- [Turborepo Configuring Tasks](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks) — Task dependencies and caching
- [pnpm Workspaces](https://pnpm.io/workspaces) — Workspace protocol and configuration
- [pnpm Settings (.npmrc)](https://pnpm.io/9.x/npmrc) — Configuration options including public-hoist-pattern
- [ESLint-plugin-tailwindcss no-arbitrary-value](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-arbitrary-value.md) — Rule configuration
- [React Router Installation](https://reactrouter.com/start/library/installation) — Library mode setup with Vite
- [Commitlint GitHub](https://github.com/conventional-changelog/commitlint) — Configuration and Husky integration
- [Tailwind CSS Installing with Vite](https://tailwindcss.com/docs) — @tailwindcss/vite plugin setup
- [TypeScript-ESLint Getting Started](https://typescript-eslint.io/getting-started/) — ESLint 9 flat config with TypeScript
- [Prettier Plugin Tailwind CSS](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) — Plugin load order and compatibility

### Secondary (MEDIUM confidence)

- [Setting Up a Scalable Monorepo With Turborepo and PNPM](https://dev.to/hexshift/setting-up-a-scalable-monorepo-with-turborepo-and-pnpm-4doh) — Monorepo setup patterns
- [How we configured pnpm and Turborepo for our monorepo](https://nhost.io/blog/how-we-configured-pnpm-and-turborepo-for-our-monorepo) — Real-world configuration
- [Everything You Need to Know About TypeScript Project References](https://nx.dev/blog/typescript-project-references) — Monorepo TypeScript setup
- [Conventional commits with Commitizen and Commitlint](https://mhx.be/blog/conventional-commits) — Commit enforcement setup
- [Install Tailwind CSS with Vite (v4 Plugin Guide)](https://tailkits.com/blog/install-tailwind-css-with-vite/) — Tailwind 4 migration
- [How to Setup Tailwind and Sort Imports Prettier Plugins](https://www.franciscomoretti.com/blog/how-to-setup-tailwind-and-sort-imports-prettier-plugins) — Plugin configuration
- [Linting, Formatting, and Type Checking in Nx Monorepo](https://www.thisdot.co/blog/linting-formatting-and-type-checking-commits-in-an-nx-monorepo-with-husky) — Pre-commit hooks best practices
- [Build Ultra-Fast Dev Loops with Vite & Monorepos](https://medium.com/@Modexa/build-ultra-fast-dev-loops-with-vite-monorepos-6e64d9f9ace7) — HMR in monorepos

### Tertiary (LOW confidence)

- Optimal lint-staged typecheck strategy — Multiple approaches exist, no consensus on "best" for all monorepo sizes
- Package scope renaming automation — Community scripts vary, no official tool from pnpm/Turborepo
- GitHub Actions vs local-hooks-only — Project-specific decision, no universal answer

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All versions verified via official npm releases and documentation
- Architecture: HIGH — Official Turborepo examples, pnpm docs, ESLint/Prettier official guides
- Pitfalls: HIGH — React 18 pinning from project SUMMARY.md (verified GitHub issue), ESLint conflicts documented in official eslint-config-prettier, typecheck in lint-staged well-documented problem

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - stable monorepo tooling, low churn)
