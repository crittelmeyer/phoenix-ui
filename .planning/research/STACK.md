# Technology Stack

**Project:** Phoenix Design System Monorepo Starter
**Researched:** 2026-02-01
**Overall Confidence:** HIGH

## Executive Summary

The 2025/2026 React design system monorepo stack has stabilized around React 19, Tailwind CSS 4, and modern build tooling. Key compatibility concerns between React 19 and ecosystem libraries have been resolved. Tailwind CSS 4 represents a significant architectural shift requiring CSS-first configuration and modern browser support.

**Critical Compatibility Note:** All recommended packages are verified compatible with React 19 as of February 2026. Tailwind CSS 4 requires Safari 16.4+, Chrome 111+, and Firefox 128+.

---

## Recommended Stack

### Monorepo Infrastructure

| Technology    | Version  | Purpose             | Why                                                                                                                                                                             | Confidence |
| ------------- | -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **pnpm**      | ^10.28.0 | Package manager     | Fastest package manager in 2026 with workspace support, content-addressable storage, and strict dependency isolation. Superior to npm/yarn for monorepos.                       | HIGH       |
| **Turborepo** | ^2.7.5   | Build orchestration | Industry standard for JS/TS monorepos. Written in Rust for performance. Remote caching, task pipelines, and incremental builds. 2.7+ includes devtools for graph visualization. | HIGH       |

**Rationale:** pnpm + Turborepo is the 2026 standard for React monorepos. pnpm's workspace protocol handles inter-package dependencies cleanly, while Turborepo's caching prevents redundant builds. This combination significantly outperforms npm/yarn + Nx for React-focused projects.

**Installation:**

```bash
npm install -g pnpm@10.28.0
pnpm add -D turbo@2.7.5
```

---

### Core Framework

| Technology     | Version | Purpose     | Why                                                                                                                                                                              | Confidence |
| -------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **React**      | ^19.2.4 | UI library  | React 19.2.4 (latest stable) includes Activity component, enhanced DevTools, and Server Actions security. Ecosystem compatibility fully resolved as of Q4 2024.                  | HIGH       |
| **TypeScript** | ^5.9.3  | Type system | TypeScript 5.9.3 is current stable. TypeScript 7.0 (Go rewrite) in beta but not recommended for production. Stick with 5.9.x for stability.                                      | HIGH       |
| **Vite**       | ^7.3.1  | Build tool  | Vite 7.3.1 is stable. Vite 8 beta (Rolldown-powered) available but not production-ready. v7 offers 100x+ faster incremental builds than webpack. First-party Tailwind v4 plugin. | HIGH       |

**React 19 Migration Notes:**

- React 19 is fully stable (released Dec 2024)
- Server Components, Actions, and new hooks (useFormStatus, useOptimistic) are production-ready
- All major ecosystem packages (Radix UI, React Router, Storybook) have React 19 support

**Vite vs Alternatives:**

- **Not Next.js:** Project explicitly uses Vite + React Router for non-SSR design system docs
- **Not Webpack:** Vite's dev server and HMR are orders of magnitude faster
- **Not Vite 8:** Beta status; wait for stable release

**Installation:**

```bash
pnpm add react@19.2.4 react-dom@19.2.4
pnpm add -D typescript@5.9.3 vite@7.3.1 @vitejs/plugin-react@latest
```

---

### Routing

| Technology       | Version | Purpose             | Why                                                                                                                                    | Confidence |
| ---------------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **React Router** | ^7.13.0 | Client-side routing | React Router v7 (Jan 2026) merges v6 + Remix capabilities. Non-breaking upgrade from v6. SPA mode perfect for design system docs site. | HIGH       |

**Why React Router v7:**

- Non-breaking upgrade from v6 (maintains existing API)
- Adds Remix features (loaders, actions) as opt-in, not required
- SPA mode ideal for static design system documentation
- Active development (7.13.0 released Jan 23, 2026)

**Not Needed:**

- TanStack Router: Overkill for design system docs
- Wouter: Too minimal, lacks data fetching patterns

**Installation:**

```bash
pnpm add react-router@7.13.0 react-router-dom@7.13.0
```

---

### Styling

| Technology                         | Version | Purpose                   | Why                                                                                                                           | Confidence |
| ---------------------------------- | ------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Tailwind CSS**                   | ^4.1.x  | Utility-first CSS         | Tailwind v4 (stable Jan 2025) offers 5x faster builds, CSS-first config, and modern CSS features. Requires migration from v3. | HIGH       |
| **@tailwindcss/vite**              | ^4.1.x  | Vite integration          | First-party Vite plugin. Replaces PostCSS plugin for better performance and automatic content detection.                      | HIGH       |
| **CVA (class-variance-authority)** | ^0.7.1  | Variant management        | Industry standard for type-safe component variants. Works seamlessly with Tailwind. No major updates needed (stable).         | MEDIUM     |
| **tailwind-merge**                 | ^3.4.0  | Class conflict resolution | v3.4.0 supports Tailwind v4.0-4.1. Essential for design system components that accept className props.                        | HIGH       |
| **clsx**                           | ^2.1.1  | Conditional classes       | Lightweight, battle-tested. Often combined with tailwind-merge as `cn()` utility.                                             | HIGH       |

**Tailwind CSS 4 Breaking Changes:**

1. **CSS Import (REQUIRED):**

   ```css
   /* v3 */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* v4 */
   @import 'tailwindcss';
   ```

2. **Vite Plugin (RECOMMENDED):**

   ```typescript
   // vite.config.ts
   import tailwindcss from '@tailwindcss/vite'

   export default {
     plugins: [tailwindcss()],
   }
   ```

3. **Browser Requirements:**
   - Safari 16.4+, Chrome 111+, Firefox 128+
   - Uses `@property`, `color-mix()`, cascade layers
   - **No polyfill path for older browsers**

4. **Configuration Migration:**
   - JavaScript config deprecated
   - Use CSS `@theme` directive:

     ```css
     @import 'tailwindcss';

     @theme {
       --color-brand: oklch(0.5 0.2 200);
     }
     ```

5. **Utility Renames:**
   - `shadow` → `shadow-sm`
   - `shadow-sm` → `shadow-xs`
   - `outline-none` → `outline-hidden`
   - `!flex` → `flex!` (important modifier moves to end)

**Migration Tool:**

```bash
npx @tailwindcss/upgrade
```

This automates most v3→v4 changes.

**Installation:**

```bash
pnpm add -D tailwindcss@latest @tailwindcss/vite@latest
pnpm add class-variance-authority@0.7.1 tailwind-merge@3.4.0 clsx@2.1.1
```

**CN Utility Pattern:**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### UI Primitives

| Technology              | Version  | Purpose             | Why                                                                                                                                     | Confidence |
| ----------------------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Radix UI Primitives** | ^1.1.x   | Headless components | Full React 19 + RSC compatibility (June 2024). Industry standard for accessible primitives. Individual packages (not @radix-ui/themes). | HIGH       |
| **lucide-react**        | ^0.562.0 | Icon library        | 1000+ SVG icons, tree-shakable, fully typed. Superior to react-icons (better types) and heroicons (more icons).                         | HIGH       |

**Radix UI Compatibility:**

- Full React 19 support as of June 2024
- React Server Component (RSC) compatible
- Peer dependency warnings removed (Jan 2025)
- Use individual packages (`@radix-ui/react-dialog`, etc.) not `@radix-ui/themes`

**Why Radix over Alternatives:**

- **Headless UI:** Radix has larger component library
- **React Aria:** Radix has simpler API, better DX
- **MUI/Chakra:** Not headless, doesn't fit "own the code" pattern

**Installation:**

```bash
# Install primitives individually as needed
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover
pnpm add lucide-react@0.562.0
```

---

### Design Tokens

| Technology                       | Version | Purpose                   | Why                                                                                              | Confidence |
| -------------------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| **Style Dictionary**             | ^5.1.3  | Token transformation      | v5.1.3 (Feb 2026) supports DTCG spec. Build system for cross-platform tokens. Industry standard. | HIGH       |
| **@tokens-studio/sd-transforms** | ^2.0.1  | Tokens Studio integration | v2.0+ stable with Style Dictionary v5. Essential for Figma → code pipeline.                      | HIGH       |

**Style Dictionary v5 Updates:**

- Forward-compatible with Design Tokens Community Group (DTCG) spec
- Supports nested color spaces, typography composites
- Breaking changes from v4 (migration guide available)

**Token Pipeline:**

```
Tokens Studio (Figma) → JSON → Style Dictionary + sd-transforms → CSS/JS/TS
```

**Installation:**

```bash
pnpm add -D style-dictionary@5.1.3 @tokens-studio/sd-transforms@2.0.1
```

---

### Documentation

| Technology    | Version  | Purpose        | Why                                                                                                                                 | Confidence |
| ------------- | -------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Storybook** | ^10.1.11 | Component docs | Storybook 10 has full React 19 support. Industry standard for design systems. v10 offers improved performance and Vite integration. | MEDIUM     |

**Storybook React 19 Status:**

- Full support in Storybook 10.1.x
- Some peer dependency warnings with npm (use pnpm to avoid)
- Vite integration stable and recommended over webpack

**Why Storybook:**

- Industry standard for design system documentation
- MDX support for rich documentation
- Play functions for interaction testing
- Addons ecosystem (a11y, interactions, etc.)

**Not Ladle/Histoire:** Less mature, smaller ecosystems

**Installation:**

```bash
pnpm dlx storybook@latest init
```

**Note:** Use `--force` or `--legacy-peer-deps` with npm if peer dependency warnings appear. pnpm handles this gracefully.

---

### Code Quality

| Technology            | Version | Purpose            | Why                                                                                                                         | Confidence |
| --------------------- | ------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **ESLint**            | ^9.39.2 | Linting            | ESLint v10 in RC (Jan 2026) but v9.x stable. Flat config required. Use `@eslint/js` + `typescript-eslint` for modern setup. | HIGH       |
| **Prettier**          | ^3.8.1  | Formatting         | Latest stable (Jan 2026). Supports Angular 21.1+. Standard choice for React projects.                                       | HIGH       |
| **typescript-eslint** | ^8.x    | TypeScript linting | v8+ supports ESLint v9 flat config. Essential for TS projects.                                                              | HIGH       |

**ESLint v9 Migration:**

- Requires flat config (`eslint.config.js`)
- eslintrc format deprecated (removed in v10)
- Use `@eslint/js` + `typescript-eslint` packages

**Why Not Biome:**

- Project spec explicitly requires ESLint + Prettier
- Biome still maturing (formatter stable, linter catching up)
- Ecosystem has more ESLint plugins for React/a11y

**Installation:**

```bash
pnpm add -D eslint@9.39.2 prettier@3.8.1
pnpm add -D typescript-eslint@8 @eslint/js
pnpm add -D eslint-plugin-react@latest eslint-plugin-react-hooks@latest
pnpm add -D eslint-plugin-jsx-a11y@latest
```

---

### Testing

| Technology                    | Version | Purpose       | Why                                                                                                     | Confidence |
| ----------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| **Vitest**                    | ^4.0.17 | Test runner   | Vitest 4 (stable) with Browser Mode out of experimental. Native Vite integration, 10x faster than Jest. | HIGH       |
| **@testing-library/react**    | ^16.3.1 | React testing | v16.3.1 requires `@testing-library/dom` as peer dep. Industry standard for component testing.           | HIGH       |
| **@testing-library/jest-dom** | ^6.x    | DOM matchers  | Provides `toBeInTheDocument()`, etc. Still maintained despite name (works with Vitest).                 | HIGH       |

**Vitest 4 Features:**

- Browser Mode stable (removed experimental tag)
- Visual regression testing support
- Separate provider packages: `@vitest/browser-playwright`
- Coverage improvements (coverage.all removed)

**Why Vitest over Jest:**

- Native Vite integration (no transform config)
- 10x+ faster in monorepos
- ESM-first (Jest still has ESM pain points)
- Compatible with Testing Library ecosystem

**Installation:**

```bash
pnpm add -D vitest@4.0.17 @vitest/ui@latest
pnpm add -D @testing-library/react@16.3.1 @testing-library/dom@latest
pnpm add -D @testing-library/jest-dom@6 @testing-library/user-event@latest
```

**Vitest Config Example:**

```typescript
// vitest.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test-setup.ts',
  },
})
```

---

### Version Management

| Technology     | Version | Purpose             | Why                                                                                                        | Confidence |
| -------------- | ------- | ------------------- | ---------------------------------------------------------------------------------------------------------- | ---------- |
| **Changesets** | ^2.x    | Monorepo versioning | Purpose-built for monorepos. Semver automation, inter-package dependency management, changelog generation. | HIGH       |

**Why Changesets:**

- Documents changes during PR (not at release time)
- Automatic version bumps based on semver impact
- Handles inter-package dependencies in monorepo
- CI/CD integration for automated publishing
- Industry standard (used by Radix, shadcn, many others)

**Workflow:**

```bash
# Add changeset during PR
pnpm changeset

# Version and publish (CI or manual)
pnpm changeset version
pnpm changeset publish
```

**Installation:**

```bash
pnpm add -D @changesets/cli@latest
pnpm changeset init
```

---

## Alternatives Considered

### Package Manager

| Category        | Recommended   | Alternative | Why Not                                                     |
| --------------- | ------------- | ----------- | ----------------------------------------------------------- |
| Package Manager | **pnpm 10.x** | npm         | Slower, less efficient disk usage, weaker workspace support |
| Package Manager | **pnpm 10.x** | yarn        | pnpm faster, stricter dependency isolation                  |
| Package Manager | **pnpm 10.x** | Bun         | Still maturing, compatibility issues with some packages     |

### Monorepo Build Tool

| Category           | Recommended   | Alternative | Why Not                                                                            |
| ------------------ | ------------- | ----------- | ---------------------------------------------------------------------------------- |
| Build Orchestrator | **Turborepo** | Nx          | Nx optimized for Angular/full-stack. Turborepo simpler, faster for React monorepos |
| Build Orchestrator | **Turborepo** | Lerna       | Deprecated for build orchestration (use Lerna + Nx or switch to Turborepo)         |
| Build Orchestrator | **Turborepo** | Rush        | Microsoft-focused, steeper learning curve                                          |

### Styling

| Category      | Recommended     | Alternative       | Why Not                                                                           |
| ------------- | --------------- | ----------------- | --------------------------------------------------------------------------------- |
| CSS Framework | **Tailwind v4** | Tailwind v3       | v4 offers 5x faster builds, modern CSS features. Migration required but automated |
| CSS Framework | **Tailwind v4** | CSS Modules       | Less design system velocity, no utility-first benefits                            |
| CSS Framework | **Tailwind v4** | Styled Components | Runtime overhead, harder for AI to modify, not in project spec                    |
| CSS Framework | **Tailwind v4** | Panda CSS         | Less mature, smaller ecosystem than Tailwind                                      |

### UI Primitives

| Category    | Recommended  | Alternative | Why Not                                                          |
| ----------- | ------------ | ----------- | ---------------------------------------------------------------- |
| Headless UI | **Radix UI** | Headless UI | Smaller component library, Tailwind Labs focused on Catalyst now |
| Headless UI | **Radix UI** | React Aria  | More complex API, steeper learning curve                         |
| Headless UI | **Radix UI** | MUI/Chakra  | Not headless, doesn't fit "own the code" shadcn pattern          |

### Testing

| Category    | Recommended  | Alternative                  | Why Not                                                       |
| ----------- | ------------ | ---------------------------- | ------------------------------------------------------------- |
| Test Runner | **Vitest 4** | Jest                         | Slower, ESM support still painful, no native Vite integration |
| Test Runner | **Vitest 4** | Playwright Component Testing | Overkill for unit tests, slower than Vitest                   |

### Linting

| Category         | Recommended           | Alternative               | Why Not                                                        |
| ---------------- | --------------------- | ------------------------- | -------------------------------------------------------------- |
| Linter/Formatter | **ESLint + Prettier** | Biome                     | Project spec requires ESLint + Prettier. Biome still maturing. |
| Linter/Formatter | **ESLint + Prettier** | ESLint only (no Prettier) | Prettier offloads formatting, reduces ESLint config complexity |

---

## Installation Guide

### Initial Setup

```bash
# 1. Initialize pnpm workspace
mkdir phoenix && cd phoenix
pnpm init

# 2. Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << EOF
packages:
  - 'packages/*'
  - 'apps/*'
EOF

# 3. Install monorepo tooling
pnpm add -D turbo@2.7.5

# 4. Create turbo.json
cat > turbo.json << EOF
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
EOF
```

### Core Dependencies (Example Package)

```bash
# Navigate to package
cd packages/ui

# React + TypeScript
pnpm add react@19.2.4 react-dom@19.2.4
pnpm add -D typescript@5.9.3 @types/react@latest @types/react-dom@latest

# Vite
pnpm add -D vite@7.3.1 @vitejs/plugin-react@latest

# Tailwind CSS 4
pnpm add -D tailwindcss@latest @tailwindcss/vite@latest

# Styling utilities
pnpm add class-variance-authority@0.7.1 tailwind-merge@3.4.0 clsx@2.1.1

# Radix UI (example components)
pnpm add @radix-ui/react-dialog@latest @radix-ui/react-dropdown-menu@latest

# Icons
pnpm add lucide-react@0.562.0
```

### Dev Tooling

```bash
# Root workspace
cd ../..

# ESLint + Prettier
pnpm add -D eslint@9.39.2 prettier@3.8.1
pnpm add -D typescript-eslint@8 @eslint/js
pnpm add -D eslint-plugin-react@latest eslint-plugin-react-hooks@latest
pnpm add -D eslint-plugin-jsx-a11y@latest

# Testing
pnpm add -D vitest@4.0.17 @vitest/ui@latest
pnpm add -D @testing-library/react@16.3.1 @testing-library/dom@latest
pnpm add -D @testing-library/jest-dom@6 @testing-library/user-event@latest

# Version management
pnpm add -D @changesets/cli@latest
pnpm changeset init

# Storybook (in docs package)
cd apps/docs
pnpm dlx storybook@latest init
```

### Design Tokens

```bash
# In tokens package
cd ../../packages/tokens
pnpm add -D style-dictionary@5.1.3 @tokens-studio/sd-transforms@2.0.1
```

---

## Critical Compatibility Matrix

| Package                | React 19                    | Tailwind v4 | TypeScript 5.9 | Notes                                  |
| ---------------------- | --------------------------- | ----------- | -------------- | -------------------------------------- |
| @radix-ui/\*           | ✅ Full support (June 2024) | ✅ CSS-only | ✅             | Peer dep warnings removed Jan 2025     |
| lucide-react           | ✅                          | ✅          | ✅             | Tree-shakable, no compatibility issues |
| react-router           | ✅ v7.x                     | N/A         | ✅             | v7.13.0 tested with React 19           |
| Storybook              | ✅ v10.x                    | ✅          | ✅             | Some npm peer warnings (use pnpm)      |
| Vitest                 | ✅                          | N/A         | ✅             | Native ESM, no issues                  |
| @testing-library/react | ✅ v16.x                    | N/A         | ✅             | Requires @testing-library/dom peer dep |
| tailwind-merge         | N/A                         | ✅ v3.4.0   | ✅             | Explicitly supports Tailwind v4.0-4.1  |
| CVA                    | ✅                          | ✅          | ✅             | Framework-agnostic, no issues          |

**Key Takeaway:** All ecosystem packages have resolved React 19 compatibility as of Q4 2024 / Q1 2025. Tailwind v4 compatibility is CSS-level (not package-level) for most libraries.

---

## Migration Checklist

When setting up Phoenix or migrating an existing design system:

### React 19

- [ ] Verify all dependencies support React 19 (all listed packages do)
- [ ] Update component code for new JSX transform (automatic with React 19)
- [ ] Replace deprecated patterns (e.g., `defaultProps` → default parameters)
- [ ] Test Server Components if using React Router v7 SSR features

### Tailwind CSS 4

- [ ] Run `npx @tailwindcss/upgrade` migration tool
- [ ] Update CSS imports from `@tailwind` directives to `@import "tailwindcss"`
- [ ] Migrate to Vite plugin in `vite.config.ts`
- [ ] Convert JavaScript config to CSS `@theme` directive
- [ ] Update utility class names (shadow, outline-none, etc.)
- [ ] Test on target browsers (Safari 16.4+, Chrome 111+, Firefox 128+)
- [ ] Update important modifier syntax from `!flex` to `flex!`

### ESLint v9

- [ ] Migrate from eslintrc to flat config (`eslint.config.js`)
- [ ] Update to `@eslint/js` and `typescript-eslint` v8
- [ ] Remove deprecated plugins/rules

### Vitest 4

- [ ] Install `@testing-library/dom` peer dependency
- [ ] Update coverage config (coverage.all removed)
- [ ] Migrate to new provider packages if using Browser Mode

### TypeScript

- [ ] Stay on TypeScript 5.9.x (do not upgrade to v7 beta)
- [ ] Use `moduleResolution: "bundler"` in tsconfig
- [ ] Enable `verbatimModuleSyntax` for better ESM output

---

## Performance Optimization

### Build Performance

1. **Use Vite plugin for Tailwind** (not PostCSS)
   - 5x faster builds than v3
   - Automatic content detection

2. **Enable Turborepo caching**

   ```json
   // turbo.json
   {
     "tasks": {
       "build": {
         "outputs": ["dist/**"],
         "cache": true
       }
     }
   }
   ```

3. **Use `pnpm --filter` for targeted builds**
   ```bash
   pnpm --filter @phoenix/ui build
   ```

### Runtime Performance

1. **Tree-shake lucide-react**

   ```typescript
   // Good: Only bundles ChevronDown
   import { ChevronDown } from 'lucide-react'
   // Bad: Bundles entire library
   import * as Icons from 'lucide-react'
   ```

2. **Use CSS-only Radix primitives** (no JS for styling)
   - Radix provides unstyled primitives
   - Style with Tailwind classes
   - No runtime CSS-in-JS overhead

3. **Code-split Storybook stories**
   - Lazy load heavy components
   - Use dynamic imports in `.stories.tsx`

---

## Security Considerations

### React 19 Server Actions

React 19.2.4+ includes security mitigations for Server Actions:

- CSRF protection hardened
- Server Component security updates
- **Note:** Only relevant if using React Router v7 SSR features

### Dependency Auditing

```bash
# Check for vulnerabilities
pnpm audit

# Update to patch versions
pnpm update --latest
```

### Package Provenance

All recommended packages have:

- Active maintenance (updated within last 3 months)
- Large user bases (Radix: 100k+ weekly downloads)
- Trusted maintainers (Vercel, Radix Team, Remix Team)

---

## AI Agent Considerations

Phoenix's core value: **AI agents can add/modify/extend components without human hand-holding.**

### Why This Stack Enables AI Modification

1. **Tailwind CSS:** Utility classes are predictable, no runtime CSS-in-JS to debug
2. **CVA + cn():** Variants follow consistent pattern AI can replicate
3. **Radix Primitives:** Documented API contracts, predictable prop patterns
4. **TypeScript:** Type errors guide AI to correct patterns
5. **shadcn pattern:** Components live in codebase, not node_modules (AI can read + modify)

### Stack Decisions for AI-Friendliness

- ✅ **Utility-first CSS:** AI can compose classes without CSS files
- ✅ **Type-safe variants:** CVA provides pattern AI can follow
- ✅ **Explicit over magic:** No hidden abstractions
- ❌ **Avoided CSS-in-JS:** Runtime complexity, harder to reason about
- ❌ **Avoided complex state managers:** Keep component state local

---

## Version Pinning Strategy

### Exact Versions (package.json)

```json
{
  "dependencies": {
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "class-variance-authority": "0.7.1"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "vite": "7.3.1",
    "tailwindcss": "4.1.x"
  }
}
```

### Caret Ranges for Tools

Use `^` for build tools that don't affect runtime:

- `^` for ESLint, Prettier, Vitest (tooling)
- Exact for React, Radix, CVA (public API)

### Renovate/Dependabot Config

```json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["^@radix-ui/", "^react"],
      "groupName": "React ecosystem"
    },
    {
      "matchPackagePatterns": ["^eslint", "^prettier"],
      "groupName": "Code quality tools"
    }
  ]
}
```

---

## Future-Proofing

### Watch for These Releases

1. **TypeScript 7.0** (Go rewrite)
   - Currently in beta (@typescript/native-preview)
   - Promises 8-10x faster project loads
   - Wait for stable (est. mid-late 2026)

2. **Vite 8.0** (Rolldown)
   - Beta available (8.0.0-beta.0)
   - Significantly faster production builds
   - Wait for stable (Q1/Q2 2026)

3. **ESLint 10.0**
   - RC available (v10.0.0-rc.1)
   - Requires Node 20.19.0+
   - Removes eslintrc completely
   - Expected stable Jan 2026

### Deprecation Warnings

1. **Tailwind v3:** End of life imminent (v4 released Jan 2025)
2. **ESLint eslintrc:** Removed in v10 (use flat config)
3. **React defaultProps:** Deprecated (use default parameters)
4. **Vite CJS config:** Use ESM (`vite.config.ts`)

---

## Sources

### Official Documentation

- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2 Announcement](https://react.dev/blog/2025/10/01/react-19-2)
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Radix UI Releases](https://www.radix-ui.com/primitives/docs/overview/releases)
- [Vite 7 Release](https://vite.dev/blog/announcing-vite7)
- [shadcn/ui React 19 Docs](https://ui.shadcn.com/docs/react-19)
- [Style Dictionary](https://styledictionary.com/)
- [Vitest 4 Release](https://vitest.dev/blog/vitest-4)

### Version Sources (npm/GitHub)

- [pnpm Releases](https://github.com/pnpm/pnpm/releases)
- [Turborepo Releases](https://github.com/vercel/turborepo/releases)
- [React Releases](https://github.com/facebook/react/releases)
- [React Router Releases](https://github.com/remix-run/react-router/releases)
- [TypeScript Releases](https://github.com/microsoft/TypeScript/releases)
- [ESLint Releases](https://github.com/eslint/eslint/releases)
- [Prettier Releases](https://github.com/prettier/prettier/releases)
- [lucide-react npm](https://www.npmjs.com/package/lucide-react)
- [tailwind-merge npm](https://www.npmjs.com/package/tailwind-merge)
- [CVA npm](https://www.npmjs.com/package/class-variance-authority)
- [@tokens-studio/sd-transforms](https://www.npmjs.com/package/@tokens-studio/sd-transforms)
- [@testing-library/react](https://www.npmjs.com/package/@testing-library/react)

### Community Resources

- [Design System Monorepo Best Practices](https://medium.com/@satnammca/scaling-your-frontend-a-monorepo-and-design-system-playbook-957e38c8c9e4)
- [Changesets Documentation](https://changesets-docs.vercel.app/)
- [Radix UI React 19 Compatibility](https://github.com/radix-ui/primitives/issues/2900)
- [Tailwind v4 Migration Guide](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)

---

## Confidence Assessment

| Category              | Confidence | Reason                                                                                  |
| --------------------- | ---------- | --------------------------------------------------------------------------------------- |
| **Monorepo Tools**    | HIGH       | pnpm + Turborepo verified as 2026 standard via official releases and community adoption |
| **React Ecosystem**   | HIGH       | All versions verified via official React blog and GitHub releases (19.2.4 stable)       |
| **Tailwind CSS**      | HIGH       | Official v4 docs, upgrade guide, and migration tool confirm breaking changes            |
| **Radix UI**          | HIGH       | Official releases page confirms React 19 + RSC support as of June 2024                  |
| **Build Tools**       | HIGH       | Vite 7.3.1 stable verified; TypeScript 5.9.3 current stable                             |
| **Testing**           | HIGH       | Vitest 4, RTL 16.x versions confirmed via npm and official docs                         |
| **Styling Utilities** | MEDIUM     | CVA 0.7.1 last update 1 year ago (stable but not actively developed)                    |
| **Documentation**     | MEDIUM     | Storybook 10.1.11 React 19 support confirmed but some peer dep warnings reported        |

**Overall Confidence: HIGH**

All critical package versions verified via official sources (npm, GitHub releases, official docs) as of February 1, 2026. Compatibility matrix cross-verified with official release notes and community discussions.
