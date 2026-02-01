# Domain Pitfalls: React Design System Monorepo

**Domain:** React design system with Tailwind CSS, Radix UI, Style Dictionary, Turborepo
**Stack:** pnpm + Turborepo, Vite + React Router, React 19, Tailwind CSS 4, Radix UI, CVA, Style Dictionary, Storybook
**Researched:** 2026-02-01

---

## Critical Pitfalls

Mistakes that cause rewrites, major bugs, or complete blockers.

### Pitfall 1: React 19 + Radix UI Infinite Loop Bug

**What goes wrong:** Radix UI components trigger "Maximum update depth exceeded" errors in React 19, causing complete application failure with infinite render loops.

**Why it happens:** React 19 changed ref callback behavior to support cleanup functions. The `setRef` function in `@radix-ui/react-compose-refs` recursively triggers itself because it doesn't account for this new behavior, creating an infinite loop.

**Consequences:**

- Application completely breaks at runtime
- Affects ALL Radix UI components (Dialog, Popover, Select, etc.)
- No error boundaries can catch it (React internal error)
- Issue is OPEN as of January 26, 2026 with no official fix

**Prevention:**

1. **Pin React to v18** until Radix UI releases official React 19 support
2. Use `peerDependencies` constraint: `"react": "^18.3.0"`
3. Add `.npmrc` with `strict-peer-dependencies=true` to prevent accidental upgrades
4. Monitor [radix-ui/primitives#3799](https://github.com/radix-ui/primitives/issues/3799) for resolution

**Detection:**

- Runtime error: "Maximum update depth exceeded"
- Error occurs in `@radix-ui/react-compose-refs`
- Happens on component mount/update
- Console shows recursive setRef calls

**Phase impact:** **Phase 1 (Foundation)** - Must address during initial setup or all components will break.

**Confidence:** HIGH - Verified from [official GitHub issue](https://github.com/radix-ui/primitives/issues/3799) dated January 26, 2026.

---

### Pitfall 2: Tailwind CSS 4 Breaking Changes Cascade

**What goes wrong:** Migrating to Tailwind CSS 4 breaks existing components in 12+ different ways, requiring systematic refactoring across entire design system.

**Why it happens:** Tailwind CSS 4 is a complete architectural rewrite using modern CSS features (`@property`, `color-mix()`), removing deprecated utilities, renaming core utilities, and changing fundamental syntax patterns.

**Consequences:**

- **Browser support drops drastically** (Safari 16.4+, Chrome 111+, Firefox 128+ ONLY)
- **All configuration** must migrate from JS to CSS (`@import "tailwindcss"` instead of `@tailwind` directives)
- **Renamed utilities** break existing components (e.g., `shadow-sm` → `shadow-xs`, `rounded-sm` → `rounded-xs`)
- **Border/ring defaults changed** (`gray-200` → `currentColor`, ring from 3px → 1px)
- **CSS variable syntax** breaks (`bg-[--brand]` → `bg-(--brand)`)
- **Arbitrary value commas** break grid templates (must use underscores)
- **Variant stacking order reversed** (right-to-left → left-to-right)

**Prevention:**

1. **Use official migration tool:** `npx @tailwindcss/upgrade` automates most changes
2. **Audit browser support requirements FIRST** - If you need Safari <16.4, DO NOT migrate
3. **Create migration branch** and test systematically:
   - Run upgrade tool
   - Test Storybook stories visually
   - Check border/ring colors explicitly
   - Verify CSS variable usage
   - Test arbitrary values in grid layouts
4. **Update build tooling simultaneously:**
   - PostCSS: `@tailwindcss/postcss`
   - Vite: `@tailwindcss/vite`
   - CLI: `@tailwindcss/cli`
5. **Document migration in ADR** with before/after examples

**Detection:**

- Build errors about `@tailwind` directives not recognized
- Visual regressions in component borders/shadows/rings
- CSS variables not resolving (`--` syntax errors)
- Grid layouts breaking with comma-separated values
- Variants not applying in expected order

**Phase impact:** **Phase 1 (Foundation)** - Complete migration before building components, or **Phase 0 (Setup)** - decide to stay on v3 if browser support is blocker.

**Confidence:** HIGH - Verified from [official Tailwind CSS upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

**Key breaking changes reference:**

| Category      | v3                                    | v4                             | Impact            |
| ------------- | ------------------------------------- | ------------------------------ | ----------------- |
| **Imports**   | `@tailwind base/components/utilities` | `@import "tailwindcss"`        | Build breaks      |
| **Shadows**   | `shadow-sm/shadow`                    | `shadow-xs/shadow-sm`          | Visual regression |
| **Borders**   | Default `gray-200`                    | Default `currentColor`         | Visual regression |
| **Ring**      | 3px width, `blue-500` color           | 1px width, `currentColor`      | Visual regression |
| **CSS vars**  | `bg-[--color]`                        | `bg-(--color)`                 | Build breaks      |
| **Arbitrary** | `grid-cols-[1fr,auto]`                | `grid-cols-[1fr_auto]`         | Build breaks      |
| **Variants**  | `first:*:pt-0` (right-to-left)        | `*:first:pt-0` (left-to-right) | Logic errors      |

---

### Pitfall 3: Style Dictionary v4 Async Everything

**What goes wrong:** Style Dictionary v4 changed ALL core methods to async, breaking synchronous token generation pipelines in Turborepo build tasks.

**Why it happens:** v4 rewrote to ES Modules with full async support for all hooks (parsers, transforms, formats). Previously synchronous operations like `buildAllPlatforms()` now require `await`.

**Consequences:**

- **Build scripts fail** with "Cannot use await outside async function"
- **Turborepo tasks deadlock** if not configured for async operations
- **Token generation blocks** entire monorepo build
- **Migration is NOT backward compatible** - can't gradually migrate

**Prevention:**

1. **Migrate build scripts to async/await:**

   ```javascript
   // NEW (v4)
   import StyleDictionary from 'style-dictionary'

   // OLD (v3)
   const StyleDictionary = require('style-dictionary')
   StyleDictionary.buildAllPlatforms()

   const sd = new StyleDictionary(config)
   await sd.hasInitialized
   await sd.buildAllPlatforms()
   ```

2. **Update package.json to ESM:**

   ```json
   {
     "type": "module"
   }
   ```

   OR use `.mjs` file extensions

3. **Configure Turborepo for async tasks:**

   ```json
   {
     "tasks": {
       "tokens:build": {
         "cache": true,
         "dependsOn": ["^tokens:build"],
         "outputs": ["src/tokens/**"]
       }
     }
   }
   ```

4. **Pin Style Dictionary version** in root `package.json` to prevent accidental upgrades:

   ```json
   "resolutions": {
     "style-dictionary": "^4.0.0"
   }
   ```

5. **Migrate hooks to new structure:**

   ```javascript
   // OLD
   StyleDictionary.registerTransform({
     name: 'custom',
     type: 'value',
     transformer: (token) => token.value,
   })

   // NEW
   const sd = new StyleDictionary({
     hooks: {
       transforms: {
         custom: {
           type: 'value',
           transform: async (token) => token.value,
         },
       },
     },
   })
   ```

**Detection:**

- Build errors: "Cannot use await outside async function"
- TypeError: "StyleDictionary is not a constructor"
- Import errors: "Named export not found"
- `hasInitialized` promise never resolves

**Phase impact:** **Phase 2 (Tokens)** - Must complete async migration before token generation works. Blocks all token-dependent work.

**Confidence:** HIGH - Verified from [official Style Dictionary v4 migration guide](https://styledictionary.com/versions/v4/migration/).

**Full breaking changes:**

| Area          | v3                     | v4                    | Migration                     |
| ------------- | ---------------------- | --------------------- | ----------------------------- |
| **Init**      | Object                 | Class with `new`      | `new StyleDictionary(config)` |
| **Methods**   | Sync                   | Async                 | Add `await` everywhere        |
| **Modules**   | CommonJS               | ESM                   | Add `"type": "module"`        |
| **Hooks**     | Singular (`transform`) | Plural (`transforms`) | Rename properties             |
| **Types**     | Path-based (CTI)       | `token.type` property | Add `type` to all tokens      |
| **Reference** | `{ref.foo}`            | `{ref.foo}`           | No custom syntax allowed      |
| **Node**      | v16+                   | v18+                  | Upgrade runtime               |

---

### Pitfall 4: Turborepo Cache Doesn't Invalidate on Token Changes

**What goes wrong:** Modifying design tokens doesn't trigger cache invalidation for dependent packages, causing components to use stale token values even after rebuild.

**Why it happens:** Turborepo's cache key generation doesn't automatically track transitive file dependencies across workspace boundaries. Token files in `@repo/tokens` changing don't invalidate cache for `@repo/ui` components that import them.

**Consequences:**

- Components render with old token values
- Visual regressions appear in production
- Developers waste hours debugging "phantom" bugs
- CI/CD publishes incorrect component versions
- Design system and Figma tokens drift out of sync

**Prevention:**

1. **Explicit input glob patterns in turbo.json:**

   ```json
   {
     "tasks": {
       "build": {
         "dependsOn": ["^build"],
         "inputs": [
           "$TURBO_DEFAULT$",
           "../tokens/src/**/*.json",
           "../tokens/dist/**/*.css",
           "../tokens/dist/**/*.js"
         ]
       }
     }
   }
   ```

2. **Use hash-based cache keys for tokens package:**

   ```json
   {
     "tasks": {
       "tokens:build": {
         "outputs": ["dist/**"],
         "cache": true,
         "inputs": ["src/**/*.json", "src/**/*.tokens"]
       }
     }
   }
   ```

3. **Add token hash to consuming package builds:**

   ```javascript
   // In component package build script
   import { createHash } from 'crypto'
   import { readFileSync } from 'fs'

   const tokenHash = createHash('sha256')
     .update(readFileSync('../tokens/dist/tokens.css'))
     .digest('hex')
     .slice(0, 8)

   process.env.TOKEN_HASH = tokenHash
   ```

4. **Configure environment variable in turbo.json:**

   ```json
   {
     "tasks": {
       "build": {
         "env": ["TOKEN_HASH"]
       }
     }
   }
   ```

5. **Verify cache behavior with debug flag:**
   ```bash
   pnpm turbo run build --force --summarize
   ```

**Detection:**

- Components showing old colors/spacing after token changes
- `turbo run build` shows "cache hit" even after token modifications
- Manual `--force` flag fixes the issue
- Inconsistent builds between local and CI
- `turbo run build --dry` shows no changes detected

**Phase impact:** **Phase 2 (Tokens) → Phase 3 (Components)** - Configure cache rules when setting up token generation, validate before building components.

**Confidence:** MEDIUM - Inferred from [Turborepo cache invalidation issues](https://github.com/vercel/turborepo/issues/1274) and design system patterns. Needs validation in project.

---

### Pitfall 5: Storybook + Vite + Tailwind CSS 4 Configuration Hell

**What goes wrong:** Tailwind CSS directives (`@import "tailwindcss"`) aren't processed in Storybook, causing complete loss of styling in component stories.

**Why it happens:** Storybook uses its own Vite instance that doesn't include the `@tailwindcss/vite` plugin by default. The Tailwind directives pass through unprocessed, generating no utility classes.

**Consequences:**

- All components render unstyled in Storybook
- Design system documentation is broken
- Component development workflow blocked
- Visual regression testing impossible
- Stakeholders see broken component library

**Prevention:**

1. **Install Tailwind CSS 4 Vite plugin:**

   ```bash
   pnpm add -D @tailwindcss/vite
   ```

2. **Configure `.storybook/main.ts` with viteFinal hook:**

   ```typescript
   import type { StorybookConfig } from '@storybook/react-vite'
   import tailwindcss from '@tailwindcss/vite'

   const config: StorybookConfig = {
     framework: '@storybook/react-vite',
     stories: ['../src/**/*.stories.tsx'],

     async viteFinal(config) {
       const { mergeConfig } = await import('vite')

       return mergeConfig(config, {
         plugins: [tailwindcss()],
       })
     },
   }

   export default config
   ```

3. **Import Tailwind CSS in `.storybook/preview.ts`:**

   ```typescript
   import '../src/index.css' // Contains @import "tailwindcss"
   ```

4. **Handle PostCSS deprecation warning:**
   The configuration above causes: "The CJS build of Vite's Node API is deprecated"

   **Workaround:** This is a known issue with Tailwind CSS 4 + Storybook. Monitor [tailwindcss#16687](https://github.com/tailwindlabs/tailwindcss/discussions/16687) for official fix. Warning is non-breaking.

5. **Exclude stories from production builds:**
   ```json
   {
     "tasks": {
       "build": {
         "inputs": ["$TURBO_DEFAULT$", "!**/*.stories.{tsx,jsx,mdx}"]
       },
       "build:storybook": {
         "dependsOn": ["^build"],
         "outputs": ["storybook-static/**"]
       }
     }
   }
   ```

**Detection:**

- Storybook renders components without any Tailwind classes applied
- Browser DevTools show `@import "tailwindcss"` in CSS unchanged
- Console warnings about unrecognized CSS syntax
- Vite CJS deprecation warning in Storybook startup logs

**Phase impact:** **Phase 3 (Components)** - Configure before creating first component story. Blocks entire component development workflow.

**Confidence:** HIGH - Verified from [Tailwind + Storybook discussions](https://github.com/tailwindlabs/tailwindcss/discussions/16687) and [Storybook recipes](https://storybook.js.org/recipes/tailwindcss).

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or require refactoring.

### Pitfall 6: CVA Class Conflicts Without tailwind-merge

**What goes wrong:** CVA-generated class combinations conflict (e.g., `px-3 pr-4`), with later classes not overriding earlier ones due to CSS specificity, causing visual bugs.

**Why it happens:** CVA concatenates class strings but doesn't intelligently merge conflicting Tailwind utilities. The order in the HTML class attribute doesn't guarantee CSS specificity.

**Consequences:**

- Components render with unintended spacing/sizing
- Variant combinations produce unexpected results
- Responsive variants behave inconsistently
- Debugging requires inspecting computed styles

**Prevention:**

1. **Install tailwind-merge:**

   ```bash
   pnpm add tailwind-merge
   ```

2. **Wrap CVA with twMerge:**

   ```typescript
   import { cva, type VariantProps } from 'class-variance-authority';
   import { twMerge } from 'tailwind-merge';

   const buttonVariants = cva(
     'font-medium rounded',
     {
       variants: {
         size: {
           sm: 'px-3 py-1.5 text-sm',
           md: 'px-4 py-2 text-base',
         },
       },
     }
   );

   export function Button({
     size,
     className,
     ...props
   }: VariantProps<typeof buttonVariants> & { className?: string }) {
     return (
       <button
         className={twMerge(buttonVariants({ size }), className)}
         {...props}
       />
     );
   }
   ```

3. **Create reusable cn() utility:**

   ```typescript
   // lib/utils.ts
   import { clsx, type ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }

   // Usage
   className={cn(buttonVariants({ size }), className)}
   ```

4. **Document pattern in component guidelines:**

   ```markdown
   ## Component Patterns

   Always use `cn()` utility for className composition:

   - Prevents Tailwind class conflicts
   - Handles conditional classes via clsx
   - Merges variant classes intelligently
   ```

**Detection:**

- Spacing/sizing doesn't match expected variant
- DevTools show multiple conflicting Tailwind utilities
- Responsive variants partially working
- Custom className prop doesn't override variant styles

**Phase impact:** **Phase 3 (Components)** - Implement in component foundation utilities before building variants.

**Confidence:** HIGH - Verified from [CVA documentation](https://cva.style/docs) and [Tailwind merge patterns](https://medium.com/@settahkader/mastering-tailwind-css-resolving-class-conflicts-with-twmerge-and-custom-configurations-5ff2853abf2d).

---

### Pitfall 7: pnpm Hoisting Breaks Radix UI Type Resolution

**What goes wrong:** TypeScript fails to find type definitions for React in Radix UI packages, causing build errors: "Cannot find declaration file for 'react'".

**Why it happens:** pnpm's strict dependency isolation prevents Radix UI from accessing `@types/react` unless explicitly declared as a dependency. pnpm doesn't hoist by default like npm/yarn.

**Consequences:**

- TypeScript compilation fails
- IDE shows type errors for all Radix components
- Build tasks hang on type checking
- Cannot import Radix components without type errors

**Prevention:**

1. **Install @types/react as direct dependency in consuming packages:**

   ```bash
   # In each package that uses Radix UI
   pnpm add -D @types/react @types/react-dom
   ```

2. **Configure .npmrc with selective hoisting:**

   ```ini
   # .npmrc
   public-hoist-pattern[]=@radix-ui/*
   public-hoist-pattern[]=@types/*
   ```

3. **OR use node-linker=hoisted for full hoisting:**

   ```ini
   # .npmrc
   node-linker=hoisted
   ```

   **Trade-off:** Loses pnpm's strict dependency isolation benefits.

4. **Verify with pnpm why:**

   ```bash
   pnpm why @types/react
   pnpm why @radix-ui/react-dialog
   ```

5. **Document in CONTRIBUTING.md:**

   ```markdown
   ## Adding Radix UI Components

   When importing new Radix UI primitives, ensure the package has:

   1. `@types/react` and `@types/react-dom` in devDependencies
   2. Radix UI primitive in dependencies
   3. React version matches root constraint (^18.3.0)
   ```

**Detection:**

- TypeScript error: "Cannot find declaration file for 'react'"
- Error occurs when importing `@radix-ui/react-*` packages
- `pnpm why @types/react` shows package not in node_modules
- IDE type hints broken for Radix components

**Phase impact:** **Phase 1 (Foundation)** - Configure hoisting rules before installing dependencies. OR **Phase 3 (Components)** - manifest when first Radix component is added.

**Confidence:** MEDIUM - Inferred from [Radix UI phantom dependency issue](https://github.com/radix-ui/primitives/issues/1896) and [pnpm hoisting behavior](https://pnpm.io/workspaces). Specific to pnpm + TypeScript.

---

### Pitfall 8: Vite Fast Refresh Breaks with Mixed Exports

**What goes wrong:** Modifying a `.tsx` file causes full page reload instead of hot module replacement (HMR), destroying component state and slowing development.

**Why it happens:** Vite's React Fast Refresh requires `.tsx` files to ONLY export React components (PascalCase). Exporting hooks, utilities, or constants invalidates the module, triggering full reload.

**Consequences:**

- Component state resets on every file save
- Form inputs lose values during development
- Development experience significantly degraded
- Developers waste time re-entering test data

**Prevention:**

1. **Separate components from hooks/utilities:**

   ```typescript
   // ❌ BAD: Button.tsx (breaks Fast Refresh)
   export function Button() {
     /*...*/
   }
   export function useButton() {
     /*...*/
   }
   export const BUTTON_SIZES = {
     /*...*/
   }

   // ✅ GOOD: Split into multiple files
   // Button.tsx
   export function Button() {
     /*...*/
   }

   // useButton.ts
   export function useButton() {
     /*...*/
   }

   // constants.ts
   export const BUTTON_SIZES = {
     /*...*/
   }
   ```

2. **Use barrel exports carefully:**

   ```typescript
   // index.ts (non-.tsx, can export anything)
   export { Button } from './Button'
   export { useButton } from './useButton'
   export { BUTTON_SIZES } from './constants'
   ```

3. **Configure ESLint rule:**

   ```json
   {
     "rules": {
       "react-refresh/only-export-components": [
         "warn",
         { "allowConstantExport": true }
       ]
     }
   }
   ```

4. **Enable HMR debugging:**

   ```bash
   pnpm vite --debug hmr
   ```

5. **Document in component guidelines:**

   ```markdown
   ## Fast Refresh Requirements

   To maintain HMR (Hot Module Replacement):

   - `.tsx` files MUST only export React components
   - Hooks go in separate `.ts` files
   - Constants/types go in separate `.ts` files
   - Use `index.ts` for barrel exports
   ```

**Detection:**

- Full page reload on every file save
- Vite console: "Could not Fast Refresh"
- Browser console: "Unable to preserve local component state"
- Link to vite-plugin-react docs appears in console

**Phase impact:** **Phase 3 (Components)** - Establish pattern in first component, enforce with ESLint.

**Confidence:** HIGH - Verified from [Vite Fast Refresh issues](https://github.com/vitejs/vite-plugin-react/issues/411) and [official troubleshooting](https://vite.dev/guide/troubleshooting).

---

### Pitfall 9: Independent Versioning Without Dependency Constraints

**What goes wrong:** Publishing design system packages with independent versions causes downstream applications to install incompatible package combinations (e.g., `@repo/tokens@2.0.0` with `@repo/ui@1.0.0` built against tokens@1.0.0).

**Why it happens:** Independent versioning allows packages to evolve at different rates, but doesn't automatically enforce inter-package compatibility. Semantic versioning works per-package, not across the dependency graph.

**Consequences:**

- Runtime errors from token format mismatches
- Visual regressions from missing token values
- Type errors from mismatched interfaces
- Breaking changes cascade unexpectedly
- Consumers can't determine compatible versions

**Prevention:**

1. **Choose versioning strategy explicitly:**

   **Option A: Fixed/Unified Versioning** (Recommended for design systems)

   ```json
   // All packages share same version
   {
     "@repo/tokens": "2.1.0",
     "@repo/ui": "2.1.0",
     "@repo/icons": "2.1.0"
   }
   ```

   **Pros:** Clear compatibility, simple for consumers
   **Cons:** All packages bump version even if unchanged

   **Option B: Independent with Pinned Dependencies**

   ```json
   // @repo/ui package.json
   {
     "name": "@repo/ui",
     "version": "1.3.0",
     "dependencies": {
       "@repo/tokens": "2.1.0" // Exact version, not ^2.1.0
     }
   }
   ```

   **Pros:** Packages evolve independently
   **Cons:** Complex compatibility matrix

2. **Configure changesets for fixed versioning:**

   ```json
   // .changeset/config.json
   {
     "fixed": [["@repo/tokens", "@repo/ui", "@repo/icons"]],
     "linked": [],
     "changelog": "@changesets/cli/changelog"
   }
   ```

3. **OR configure semantic-release with namespace tags:**

   ```json
   // package.json for each package
   {
     "release": {
       "tagFormat": "@repo/ui-v${version}"
     }
   }
   ```

4. **Document compatibility in README:**

   ```markdown
   ## Version Compatibility

   | @repo/ui | @repo/tokens | @repo/icons |
   | -------- | ------------ | ----------- |
   | 2.x      | 2.x          | 2.x         |
   | 1.x      | 1.x          | 1.x         |
   ```

5. **Add version check script:**

   ```javascript
   // scripts/check-versions.js
   import { readFileSync } from 'fs'
   import { glob } from 'glob'

   const packages = glob.sync('packages/*/package.json')
   const versions = new Set()

   packages.forEach((path) => {
     const pkg = JSON.parse(readFileSync(path))
     versions.add(pkg.version)
   })

   if (versions.size > 1) {
     throw new Error('Version mismatch detected')
   }
   ```

**Detection:**

- Runtime errors: "Token not found" or "undefined is not an object"
- Type errors after updating single package
- Different behavior in local dev vs production
- Consumers reporting incompatibility issues
- Multiple versions of same package in node_modules

**Phase impact:** **Phase 0 (Setup)** - Decision must be made before first release. Cannot easily change later.

**Confidence:** HIGH - Verified from [monorepo versioning strategies](https://amarchenko.dev/blog/2023-09-26-versioning/) and [semantic-release limitations](https://github.com/pmowrer/semantic-release-monorepo).

---

### Pitfall 10: ESLint + Prettier + Tailwind Plugin Conflicts

**What goes wrong:** ESLint auto-fixes Tailwind class order one way, Prettier auto-formats it another way, causing infinite format loops on save.

**Why it happens:** `eslint-plugin-tailwindcss` and `prettier-plugin-tailwindcss` both sort classes but use different algorithms. Without `eslint-config-prettier`, ESLint formatting rules conflict with Prettier.

**Consequences:**

- File changes on every save (format loop)
- Git diffs show class reordering noise
- Pre-commit hooks fail repeatedly
- Developer frustration and wasted time
- Inconsistent formatting across team

**Prevention:**

1. **Install all three packages:**

   ```bash
   pnpm add -D \
     eslint-plugin-tailwindcss \
     prettier-plugin-tailwindcss \
     eslint-config-prettier
   ```

2. **Configure ESLint with prettier LAST:**

   ```json
   // .eslintrc.json
   {
     "extends": [
       "next/core-web-vitals",
       "plugin:tailwindcss/recommended",
       "prettier" // MUST be last
     ],
     "plugins": ["tailwindcss"],
     "rules": {
       "tailwindcss/no-custom-classname": "warn",
       "tailwindcss/classnames-order": "warn"
     }
   }
   ```

3. **Configure Prettier:**

   ```json
   // .prettierrc
   {
     "plugins": ["prettier-plugin-tailwindcss"],
     "tailwindConfig": "./tailwind.config.ts"
   }
   ```

4. **Disable format-on-save for ESLint, enable for Prettier:**

   ```json
   // .vscode/settings.json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit"
     },
     "eslint.rules.customizations": [{ "rule": "*", "severity": "warn" }]
   }
   ```

5. **Verify no conflicts:**

   ```bash
   # Should show no rules
   npx eslint-config-prettier .eslintrc.json
   ```

6. **Note Tailwind CSS 4 limitation:**
   - `eslint-plugin-tailwindcss` v4 support is in BETA
   - May get false positives for `no-contradicting-classname` rule
   - Monitor [francoismassart/eslint-plugin-tailwindcss#325](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325)

**Detection:**

- File content changes on every save
- Git shows class order changes with no other changes
- ESLint and Prettier both show formatting suggestions
- Pre-commit hook fails with formatting errors
- Conflicts between team members' formatters

**Phase impact:** **Phase 1 (Foundation)** - Configure during tooling setup, before any component code.

**Confidence:** HIGH - Verified from [ESLint + Prettier conflicts](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/278) and [Tailwind v4 support status](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325).

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixable.

### Pitfall 11: React Router v7 Type Generation Requires Build

**What goes wrong:** TypeScript shows type errors for route loaders/actions until running dev server, because type definitions are generated in `.react-router/` directory on first build.

**Why it happens:** React Router v7 generates types dynamically based on route files discovered during build process. These types don't exist until the dev server runs.

**Consequences:**

- Initial IDE setup shows red squiggles
- Type-checking fails in CI before build step
- New contributors confused by "missing types"
- Pre-commit type check fails

**Prevention:**

1. **Run dev server once after cloning:**

   ```bash
   pnpm dev
   # Wait for "ready in X ms"
   # Types generated in .react-router/
   ```

2. **Add postinstall script:**

   ```json
   {
     "scripts": {
       "postinstall": "react-router typegen"
     }
   }
   ```

3. **Exclude .react-router/ from git, include in npm package:**

   ```gitignore
   # .gitignore
   .react-router/
   ```

   ```json
   // package.json
   {
     "files": [".react-router"]
   }
   ```

4. **Document in CONTRIBUTING.md:**

   ```markdown
   ## First-Time Setup

   After `pnpm install`, run `pnpm dev` once to generate React Router types.
   ```

**Detection:**

- TypeScript errors: "Module not found: .react-router/types"
- IDE shows missing type definitions
- Types appear after running dev server
- `.react-router/` directory doesn't exist

**Phase impact:** **Phase 1 (Foundation)** - Document in setup guide, add postinstall script.

**Confidence:** HIGH - Verified from [React Router v7 guide](https://blog.logrocket.com/react-router-v7-guide/) and [official docs](https://remix.run/blog/react-router-v7).

---

### Pitfall 12: Turborepo + Storybook Build Order Race Condition

**What goes wrong:** Running `pnpm turbo run build:storybook` fails because component package hasn't built yet, even with `dependsOn` configured.

**Why it happens:** Turborepo runs tasks concurrently by default. If `build:storybook` task starts before `^build` completes, Storybook can't find compiled component files.

**Consequences:**

- Storybook build fails in CI
- Cannot deploy component documentation
- Race condition is intermittent (fails 30% of the time)
- Developers resort to running builds twice

**Prevention:**

1. **Configure explicit dependency chain in turbo.json:**

   ```json
   {
     "tasks": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": ["dist/**"]
       },
       "build:storybook": {
         "dependsOn": ["^build", "build"],
         "outputs": ["storybook-static/**"]
       }
     }
   }
   ```

   Note: `"^build"` means "parent packages", `"build"` means "this package"

2. **Use topological graph to verify order:**

   ```bash
   pnpm turbo run build:storybook --graph
   ```

3. **Add build verification in Storybook build script:**

   ```json
   {
     "scripts": {
       "prebuild:storybook": "test -d ../ui/dist || (echo 'Component package not built' && exit 1)",
       "build:storybook": "storybook build"
     }
   }
   ```

4. **Configure package build configurations:**
   ```json
   // packages/storybook/turbo.json
   {
     "extends": ["//"],
     "tasks": {
       "build:storybook": {
         "dependsOn": ["^build:storybook"],
         "outputs": ["storybook-static/**"]
       }
     }
   }
   ```

**Detection:**

- Storybook build fails: "Cannot find module '@repo/ui'"
- Error occurs in CI but not locally (timing-dependent)
- Manual `pnpm build && pnpm build:storybook` works
- `--force` flag doesn't fix it

**Phase impact:** **Phase 4 (Documentation)** - Manifest when setting up Storybook deployment.

**Confidence:** MEDIUM - Inferred from [Turborepo build order issues](https://github.com/vercel/turborepo/issues/591) and [Storybook configuration patterns](https://turborepo.dev/docs/guides/tools/storybook).

---

## Phase-Specific Warnings

| Phase                      | Topic              | Likely Pitfall                                 | Mitigation                                                 |
| -------------------------- | ------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| **Phase 0: Setup**         | React version      | React 19 + Radix UI incompatibility            | Pin React to v18.3.0 in root package.json                  |
| **Phase 0: Setup**         | Browser support    | Tailwind CSS 4 requires Safari 16.4+           | Audit browser requirements, consider staying on v3         |
| **Phase 0: Setup**         | Versioning         | Independent vs fixed versioning decision       | Choose fixed versioning for design systems                 |
| **Phase 1: Foundation**    | pnpm config        | Radix UI type resolution failures              | Configure public-hoist-pattern for @types/\*               |
| **Phase 1: Foundation**    | Tailwind migration | 12+ breaking changes cascade                   | Run `npx @tailwindcss/upgrade` systematically              |
| **Phase 1: Foundation**    | Linting            | ESLint + Prettier class order conflicts        | Use eslint-config-prettier, configure both plugins         |
| **Phase 2: Tokens**        | Style Dictionary   | Async migration required for v4                | Migrate build scripts to ESM + async/await                 |
| **Phase 2: Tokens**        | Turborepo cache    | Token changes don't invalidate component cache | Add explicit input globs for token files                   |
| **Phase 3: Components**    | Storybook          | Tailwind directives not processed              | Add @tailwindcss/vite to viteFinal hook                    |
| **Phase 3: Components**    | CVA                | Class conflicts without merge utility          | Wrap CVA with tailwind-merge                               |
| **Phase 3: Components**    | Vite HMR           | Mixed exports break Fast Refresh               | Separate components, hooks, constants into different files |
| **Phase 4: Documentation** | Build order        | Storybook builds before components             | Configure dependsOn: ["^build", "build"]                   |
| **Phase 4: Documentation** | Type generation    | React Router types missing on fresh clone      | Add postinstall script to generate types                   |
| **Phase 5+: Publishing**   | Versioning         | Incompatible package combinations              | Use fixed versioning or pinned dependencies                |

---

## Deep Research Flags

Areas requiring phase-specific investigation before implementation:

### Phase 2: Tokens System

- **Tokens Studio plugin integration:** Specific transform configurations for Figma → Style Dictionary
- **Token theming strategy:** CSS variables vs Tailwind config, dark mode approach
- **Token naming conventions:** DTCG spec compliance, migration from CTI structure

### Phase 3: Component Development

- **Radix UI React 19 workarounds:** Monitor for official fix, potential fork if needed
- **Compound component patterns:** CVA + Radix asChild API interactions
- **Accessibility testing:** @storybook/addon-a11y with Radix primitives

### Phase 4: Documentation

- **Storybook 8 + Vite 6 compatibility:** Check for regressions with Tailwind CSS 4
- **MDX 3 migration:** Story format updates, frontmatter changes
- **Visual regression testing:** Chromatic integration with Turborepo cache

### Phase 5: Publishing Strategy

- **Provenance attestation:** npm publish with --provenance flag
- **Package exports mapping:** Conditional exports for ESM/CJS consumers
- **Peer dependency ranges:** Acceptable React 18/19 version constraints

---

## Sources

**React 19 + Radix UI:**

- [Maximum update depth exceeded issue](https://github.com/radix-ui/primitives/issues/3799) - HIGH confidence
- [React 19 compatibility discussion](https://github.com/radix-ui/primitives/issues/2900)

**Tailwind CSS 4:**

- [Official upgrade guide](https://tailwindcss.com/docs/upgrade-guide) - HIGH confidence
- [Migration guide articles](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)
- [Storybook integration issue](https://github.com/tailwindlabs/tailwindcss/discussions/16687)

**Style Dictionary v4:**

- [Official migration guide](https://styledictionary.com/versions/v4/migration/) - HIGH confidence
- [V4 release plans](https://tokens.studio/blog/style-dictionary-v4-plan)

**Storybook + Vite + Tailwind:**

- [Tailwind CSS integration issue](https://github.com/tailwindlabs/tailwindcss/discussions/16451)
- [Official Storybook recipes](https://storybook.js.org/recipes/tailwindcss)

**pnpm + Turborepo:**

- [Radix UI phantom dependencies](https://github.com/radix-ui/primitives/issues/1896)
- [pnpm hoisting documentation](https://pnpm.io/workspaces)
- [Turborepo cache invalidation](https://github.com/vercel/turborepo/issues/1274)
- [Storybook configuration guide](https://turborepo.dev/docs/guides/tools/storybook)

**CVA + Tailwind Merge:**

- [CVA documentation](https://cva.style/docs)
- [Class conflict patterns](https://medium.com/@settahkader/mastering-tailwind-css-resolving-class-conflicts-with-twmerge-and-custom-configurations-5ff2853abf2d)

**Vite Fast Refresh:**

- [Export restrictions issue](https://github.com/vitejs/vite-plugin-react/issues/411)
- [Official troubleshooting](https://vite.dev/guide/troubleshooting)

**Monorepo Versioning:**

- [Version strategies guide](https://amarchenko.dev/blog/2023-09-26-versioning/)
- [Semantic release limitations](https://github.com/pmowrer/semantic-release-monorepo)
- [Monorepo anti-patterns](https://www.infoq.com/presentations/monorepo-mistakes/)

**ESLint + Prettier:**

- [Class order conflicts](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/278)
- [Tailwind v4 support status](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325)

**React Router v7:**

- [Official guide](https://blog.logrocket.com/react-router-v7-guide/)
- [React Router v7 announcement](https://remix.run/blog/react-router-v7)
