# Domain Pitfalls: React Design System Monorepo

**Domain:** React design system with Tailwind CSS, Radix UI, Style Dictionary, Turborepo
**Stack:** pnpm + Turborepo, Vite + React Router, React 19, Tailwind CSS 4, Radix UI, CVA, Style Dictionary, Storybook
**Researched:** 2026-02-01
**Updated:** 2026-02-06 (Figma Integration section added)

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

## Figma Integration Pitfalls

Specific pitfalls when adding Figma Variables/Tokens Studio and Code Connect to an existing Style Dictionary pipeline.

**Added:** 2026-02-06
**Context:** Phoenix has working DTCG token pipeline with OKLCH colors, adding Figma as variable source.

### Figma Pitfall 1: OKLCH to RGB Conversion at Figma Boundary

**Severity:** Critical
**Phase:** Token Pipeline Integration

**What happens:**
Figma's Variables API only accepts RGB/Hex colors. Phoenix tokens use OKLCH values (`oklch(0.647 0.186 264.54)`). Direct export fails or produces incorrect colors.

**Warning signs:**

- Colors look wrong or washed out in Figma
- P3 gamut colors clip to sRGB incorrectly
- Export scripts fail with "invalid color format" errors

**Why it's specific to Phoenix:**
Your `colors.json` has 77 color tokens, all in OKLCH. The semantic references (`{color.primary.600}`) resolve to OKLCH values. This is a strength for CSS (wider gamut) but creates a boundary problem with Figma.

**Prevention:**

1. Add OKLCH-to-RGB conversion transform in Style Dictionary build
2. Use `culori` or `colorjs.io` for accurate color space conversion
3. Verify P3 colors convert correctly (Figma has known bugs with P3 profile interpretation)
4. Consider outputting both: OKLCH for CSS, RGB for Figma exports

**Detection:**

```javascript
// In token build script, verify no oklch values leak to Figma export
tokens.forEach((t) => {
  if (t.$value?.includes('oklch')) {
    throw new Error(`OKLCH found in Figma export: ${t.name}`)
  }
})
```

**Sources:**

- [Figma Forum: Support OKLab and OKLCH](https://forum.figma.com/suggest-a-feature-11/support-oklab-and-oklch-8257)
- [Figmalion: Syncing variables to tokens](https://figmalion.com/issue/137)

---

### Figma Pitfall 2: sd-transforms Version Lock with Style Dictionary

**Severity:** Critical
**Phase:** Token Pipeline Integration

**What happens:**
`@tokens-studio/sd-transforms` has strict version requirements:

- sd-transforms 1.0.0+ requires Style Dictionary 4.0.0+
- sd-transforms for SD5 is NOT compatible with SD4

Phoenix uses Style Dictionary 5 (per your `build.mjs`). Using wrong sd-transforms version causes:

- Silent preprocessing failures
- Token type mismatches
- Build completes but output is wrong

**Warning signs:**

- Token values not transforming (px units missing, opacity as 50% instead of 0.5)
- `originalType` extension missing from output
- Build succeeds but CSS has raw JSON values

**Prevention:**

```bash
# Verify compatible versions
npm ls style-dictionary @tokens-studio/sd-transforms

# Required pairing:
# Style Dictionary 5.x -> sd-transforms 1.x (latest)
# Style Dictionary 4.x -> sd-transforms 0.x
```

Add to `build.mjs`:

```javascript
import { register } from '@tokens-studio/sd-transforms'

// Register preprocessors and transforms
register(StyleDictionary)

const sd = new StyleDictionary({
  preprocessors: ['tokens-studio'],
  // ... rest of config
})
```

**Detection:**

- Check that dimension tokens have `px` units in output
- Verify opacity transforms (50% -> 0.5)
- Confirm `$extensions['studio.tokens'].originalType` exists for transformed tokens

**Sources:**

- [sd-transforms GitHub: Version compatibility](https://github.com/tokens-studio/sd-transforms)
- [Tokens Studio Blog: Style Dictionary v4 plan](https://tokens.studio/blog/style-dictionary-v4-plan)

---

### Figma Pitfall 3: Code Connect Node-ID Staleness (Silent Failures)

**Severity:** Critical
**Phase:** Code Connect Publishing

**What happens:**
Your `.figma.tsx` files have placeholder URLs:

```tsx
'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID'
```

When these are replaced with real node-IDs:

- If component moves/deletes in Figma, Code Connect publishes succeed silently
- Dev Mode shows "Failed to load Code Connect example"
- No CLI warning or error indicates the mismatch

**Warning signs:**

- `npx figma connect publish` succeeds but Dev Mode shows errors
- Designers report Code Connect not working for specific components
- Component in Figma was recently restructured or renamed

**Prevention:**

1. Add validation step before publish:

```bash
# Validate node-IDs exist before publishing
npx figma connect parse --dry-run 2>&1 | grep -i error
```

2. Create a node-ID manifest and check periodically:

```json
// figma-manifest.json
{
  "Button": "123:456",
  "Input": "123:789",
  "_lastValidated": "2026-02-06"
}
```

3. When updating Figma components, update `.figma.tsx` files in same PR

**Phase recommendation:** Add "Validate Code Connect" step to CI after Code Connect is published

**Sources:**

- [GitHub Issue: Validation for non-existent node-id](https://github.com/figma/code-connect/issues/337)
- [GitHub Issue: Monitoring for prop changes](https://github.com/figma/code-connect/issues/291)

---

### Figma Pitfall 4: Tokens Studio Export Format Mismatch

**Severity:** High
**Phase:** Token Pipeline Integration

**What happens:**
Tokens Studio can export in legacy or W3C DTCG format. Phoenix already uses DTCG (`$value`, `$type`). If Tokens Studio is set to legacy format:

- Property names differ (`value` vs `$value`)
- Type names differ (`color` vs `color` is same, but `boxShadow` vs `shadow`)
- Style Dictionary preprocessing fails

**Warning signs:**

- Build errors about missing `$value` property
- Token references not resolving
- Composite tokens (shadow, typography) not expanding

**Prevention:**

1. In Tokens Studio settings, verify "Token Format" is set to "W3C DTCG"
2. Add format validation to build script:

```javascript
// Validate DTCG format
if (token.value && !token.$value) {
  throw new Error(
    `Legacy format detected for ${token.name}. Enable W3C DTCG in Tokens Studio.`,
  )
}
```

3. Document Tokens Studio settings in team wiki

**Sources:**

- [Tokens Studio: Token Format - W3C DTCG vs Legacy](https://docs.tokens.studio/manage-settings/token-format)
- [Style Dictionary: DTCG support](https://styledictionary.com/info/dtcg/)

---

### Figma Pitfall 5: Figma Variables Collection/Mode Limits

**Severity:** High
**Phase:** Tokens Studio Setup

**What happens:**
Figma has hard limits:

- 5000 variables per collection (hard limit)
- Mode limits vary by plan:
  - Starter: 1 mode
  - Professional: 4 modes
  - Organization: 4 modes
  - Enterprise: 40 modes

Phoenix Professional plan = 4 modes max. If you need light/dark + brand variations, you may hit mode limits.

**Warning signs:**

- "Variables skipped" warning during export
- Only partial token sets appear in Figma
- Mode dropdown missing expected options

**Prevention:**

1. Audit token count before export: Phoenix has ~77 color tokens + spacing/typography. Should be well under 5000.
2. Plan mode structure early:
   - Mode 1: Light
   - Mode 2: Dark
   - Mode 3-4: Reserved for brand theming
3. For 4+ brands, use separate collections or consider Organization plan

**Detection:**

```bash
# Count tokens in Phoenix (rough estimate)
grep -r '"$type"' packages/tokens/src/tokens/*.json | wc -l
# Phoenix current: ~100 tokens (well under 5000)
```

**Sources:**

- [Tokens Studio: Variables Skipped on Export](https://docs.tokens.studio/figma/export/variables-skipped)
- [Tokens Studio: Variables Overview](https://docs.tokens.studio/figma/variables-overview)

---

### Figma Pitfall 6: Code Connect Authentication Scope

**Severity:** High
**Phase:** Code Connect Setup

**What happens:**
Personal Access Token (PAT) requires specific scopes:

- **Code Connect: Write** (to publish)
- **File content: Read** (to access components)

Missing scopes cause 403 Forbidden errors. Token only displays once at creation - if you miss copying it, you must regenerate.

**Warning signs:**

- 403 errors on `npx figma connect publish`
- "Couldn't find a Figma access token" error
- Authentication works for some operations but not Code Connect

**Prevention:**

1. When creating PAT, explicitly enable:
   - Code Connect scope: Write
   - File content scope: Read
2. Store in `.env` or environment variable:

```bash
export FIGMA_ACCESS_TOKEN=figd_xxxxx
```

3. Add to CI secrets for automated publishing

**Detection:**

```bash
# Test token validity
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/me"
```

**Sources:**

- [Figma: Manage personal access tokens](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)
- [Code Connect: Getting started](https://www.figma.com/code-connect-docs/quickstart-guide/)

---

### Figma Pitfall 7: Variant Prop Naming Mismatch

**Severity:** High
**Phase:** Code Connect Mapping

**What happens:**
Your `.figma.tsx` files map Figma variant names to code props:

```tsx
variant: figma.enum('Variant', {
  Default: 'default',
  Destructive: 'destructive',
  // ...
})
```

If Figma component uses different variant names (e.g., "Style" instead of "Variant", or "Primary" instead of "Default"), mapping silently fails.

**Warning signs:**

- Props not populated in generated code snippets
- Wrong variant values appearing
- "undefined" in Code Connect preview

**Prevention:**

1. Before writing mappings, document exact Figma variant names:

```
Component: Button
Variant property name: "Type" (not "Variant")
Options: "Primary", "Secondary", "Danger" (not "Default", "Destructive")
```

2. Use `npx figma connect create` to scaffold from actual Figma component
3. When designer renames variant, update `.figma.tsx` in same sprint

**Detection:** Compare Figma Inspector panel variant names with `.figma.tsx` `figma.enum()` first parameter

**Sources:**

- [GitHub Issue: Figma Props mapping based on condition](https://github.com/figma/code-connect/issues/40)
- [Figma Docs: Connecting Web components](https://developers.figma.com/docs/code-connect/html/)

---

### Figma Pitfall 8: Composite Token Expansion Issues

**Severity:** Medium
**Phase:** Token Pipeline Integration

**What happens:**
Typography and shadow tokens in Tokens Studio are composite (object values). Style Dictionary needs to either:

- Expand them into separate tokens (`typography.heading.fontSize`, `typography.heading.lineHeight`)
- Or transform them to CSS shorthand

Tokens Studio uses slightly different property names than DTCG (`boxShadow` vs `shadow`, `x`/`y` vs `offsetX`/`offsetY`).

**Warning signs:**

- Typography or shadow tokens output as `[object Object]`
- CSS shorthand missing font properties
- Shadow tokens missing spread/blur values

**Prevention:**

```javascript
// In Style Dictionary config with sd-transforms
import { expandTypesMap } from '@tokens-studio/sd-transforms'

const sd = new StyleDictionary({
  expand: {
    typesMap: expandTypesMap, // Handles TS-specific names
  },
})
```

**Sources:**

- [GitHub Issue: DTCG typography composition token issues](https://github.com/style-dictionary/style-dictionary/issues/1494)
- [sd-transforms: expandTypesMap usage](https://github.com/tokens-studio/sd-transforms)

---

### Figma Pitfall 9: Token Naming Convention Conflicts

**Severity:** Medium
**Phase:** Tokens Studio Setup

**What happens:**
Tokens Studio uses `.` for grouping, Figma uses `/`:

- Token: `color.primary.500`
- Figma Variable: `color/primary/500`

Phoenix uses kebab-case in semantic names (`card-foreground`). Some restrictions:

- Forward slashes (`/`) create unintentional groups
- `$` prefix not allowed
- Emojis/special characters break code generation

**Warning signs:**

- Variables appear in wrong groups in Figma
- Token names include unexpected prefixes
- Style Dictionary references don't resolve

**Prevention:**

1. Audit existing token names for Figma compatibility
2. Avoid forward slashes in token names (let Tokens Studio convert `.` to `/`)
3. Document naming convention for team

**Phoenix audit:**

```bash
# Check for problematic characters
grep -r '\$value' packages/tokens/src/tokens/*.json | grep -E '[$/]' | head -5
# Phoenix uses valid names: color.semantic.primary-foreground (safe)
```

**Sources:**

- [Tokens Studio: Token Name Technical Specs](https://docs.tokens.studio/manage-tokens/token-names/technical-specs)
- [Tokens Studio: Naming Design Tokens guide](https://docs.tokens.studio/guides/naming-design-tokens)

---

### Figma Pitfall 10: API Rate Limiting on Batch Operations

**Severity:** Medium
**Phase:** Token Pipeline Integration (if using Variables API directly)

**What happens:**
Figma API has rate limits (tiered by plan):

- Professional plan: 50/min for Tier 2, 100/min for Tier 3
- Variables import with 600+ tokens can trigger 429 errors

**Warning signs:**

- 429 Too Many Requests during token sync
- Partial variable imports
- Retry-After headers in API responses

**Prevention:**

1. Use Tokens Studio plugin (handles batching internally) rather than direct API calls
2. If using API directly, implement exponential backoff:

```javascript
async function syncWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (e.status === 429) {
        const retryAfter = e.headers.get('Retry-After') || 60
        await sleep(retryAfter * 1000)
      } else throw e
    }
  }
}
```

3. Batch variable updates rather than individual calls

**Sources:**

- [Figma: Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/)
- [GitHub Issue: 429 rate limit errors](https://github.com/GLips/Figma-Context-MCP/issues/258)

---

### Figma Pitfall 11: Code Connect 413 Upload Size Limit

**Severity:** Medium
**Phase:** Code Connect Publishing

**What happens:**
Large Code Connect payloads (many components) can exceed upload limits, causing 413 errors.

**Warning signs:**

- `npx figma connect publish` fails with 413 error
- Publish works for some components but fails for batch

**Prevention:**

```bash
# Use --batch-size for large component libraries
npx figma connect publish --batch-size 50

# If still failing, reduce further
npx figma connect publish --batch-size 25
```

**Detection:** Phoenix has 14 components - should be well under limits. Only applies if library grows significantly.

**Sources:**

- [Code Connect: Common Issues](https://developers.figma.com/docs/code-connect/common-issues/)

---

### Figma Pitfall 12: figma.config.json Structure Errors

**Severity:** Medium
**Phase:** Code Connect Setup

**What happens:**
Your current `figma.config.json`:

```json
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React"
  },
  "documentUrlSubstitutions": {} // <-- Wrong nesting!
}
```

`documentUrlSubstitutions` must be inside `codeConnect` object, not at root level.

**Warning signs:**

- URL substitutions not working
- "documentUrlSubstitutions is not nested" error
- Configuration parsing warnings

**Prevention:**
Correct structure:

```json
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React",
    "documentUrlSubstitutions": {}
  }
}
```

**Sources:**

- [Figma Forum: documentUrlSubstitutions config](https://forum.figma.com/ask-the-community-7/question-around-documenturlsubstitutions-for-code-connect-config-36102)
- [Figma Docs: Configuring your project](https://developers.figma.com/docs/code-connect/api/config-file/)

---

### Figma Pitfall 13: Drafts Folder Variables Limitation

**Severity:** Low
**Phase:** Tokens Studio Setup

**What happens:**
Files in Figma's Drafts folder cannot use variable modes. Tokens export as single-mode collections.

**Prevention:** Ensure Figma file is in a Project, not Drafts.

---

### Figma Pitfall 14: ESM-Only sd-transforms Package

**Severity:** Low
**Phase:** Token Pipeline Integration

**What happens:**
`@tokens-studio/sd-transforms` is ESM-only. CommonJS imports fail.

**Prevention:** Phoenix already uses `.mjs` for build script (correct). Ensure no CJS imports.

---

### Figma Pitfall 15: Network/Proxy Blocking api.figma.com

**Severity:** Low
**Phase:** Code Connect Setup

**What happens:**
Corporate proxies or security software block Code Connect CLI.

**Prevention:** Allow `https://api.figma.com/` in network configuration.

---

## Figma-Specific Gotchas

Quick tips that don't warrant full sections:

- **Figma file must be saved** before Code Connect can read component node-IDs
- **Component instances** don't work for Code Connect - must select the main component
- **Token type "OTHER"** not exportable as Figma Variables (only color, number, string, boolean)
- **AUTO line-height** skipped during variable export (Figma requires numeric values)
- **Percentage values** in number tokens skipped (Figma Variables must be unitless)
- **Box shadow "spread" property** - Tokens Studio uses different name than DTCG spec
- **Theme groups** required for multi-mode collections (token sets create single-mode collections)
- **Color tokens** cannot export to both Variables and Styles simultaneously

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

### Figma Integration Phase Warnings

| Phase                      | Key Pitfalls to Address                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Token Pipeline Integration | OKLCH conversion (Figma #1), sd-transforms version (Figma #2), Format mismatch (Figma #4), Composite expansion (Figma #8) |
| Tokens Studio Setup        | Collection/mode limits (Figma #5), Naming conflicts (Figma #9), Drafts limitation (Figma #13)                             |
| Code Connect Setup         | Authentication (Figma #6), Config structure (Figma #12), Network (Figma #15)                                              |
| Code Connect Mapping       | Node-ID staleness (Figma #3), Variant naming (Figma #7)                                                                   |
| Code Connect Publishing    | Upload size (Figma #11)                                                                                                   |
| Ongoing Maintenance        | Node-ID validation, Prop change monitoring                                                                                |

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

## Confidence Assessment (Figma Integration)

| Pitfall Category            | Confidence | Basis                                                              |
| --------------------------- | ---------- | ------------------------------------------------------------------ |
| OKLCH compatibility         | HIGH       | Verified via Figma Forum feature requests and plugin documentation |
| sd-transforms versioning    | HIGH       | Official GitHub releases and npm documentation                     |
| Code Connect node-ID issues | HIGH       | GitHub issues from real users (#337, #291)                         |
| Tokens Studio export        | MEDIUM     | Documentation cross-referenced with GitHub issues                  |
| Rate limiting               | MEDIUM     | Official Figma docs, but specific Variable API tier unclear        |

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

### Figma Integration Sources

**Official Documentation:**

- [Figma: Code Connect Common Issues](https://developers.figma.com/docs/code-connect/common-issues/)
- [Figma: Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/)
- [Figma: Personal Access Tokens](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)
- [Tokens Studio: Token Format](https://docs.tokens.studio/manage-settings/token-format)
- [Tokens Studio: Variables Overview](https://docs.tokens.studio/figma/variables-overview)
- [Tokens Studio: Variables Skipped](https://docs.tokens.studio/figma/export/variables-skipped)
- [Tokens Studio: Export Options](https://docs.tokens.studio/figma/export/options)
- [Tokens Studio: Token Names Technical Specs](https://docs.tokens.studio/manage-tokens/token-names/technical-specs)
- [Style Dictionary: DTCG](https://styledictionary.com/info/dtcg/)

**GitHub Issues and Repositories:**

- [sd-transforms: GitHub](https://github.com/tokens-studio/sd-transforms)
- [Code Connect: Node-ID validation issue #337](https://github.com/figma/code-connect/issues/337)
- [Code Connect: Prop change monitoring #291](https://github.com/figma/code-connect/issues/291)
- [Code Connect: Prop mapping issue #40](https://github.com/figma/code-connect/issues/40)
- [Style Dictionary: Typography composite issue #1494](https://github.com/style-dictionary/style-dictionary/issues/1494)

**Community Resources:**

- [Figma Forum: OKLCH support request](https://forum.figma.com/suggest-a-feature-11/support-oklab-and-oklch-8257)
- [Figma Forum: documentUrlSubstitutions config](https://forum.figma.com/ask-the-community-7/question-around-documenturlsubstitutions-for-code-connect-config-36102)
- [Figmalion: Syncing variables to tokens](https://figmalion.com/issue/137)
