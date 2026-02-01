# Phoenix Design System

A production-ready monorepo starter for building design systems with React, TypeScript, and Tailwind CSS 4. Ships with 7 core components, a complete design token pipeline, and Storybook documentation.

Note: This README is optimized for AI agents (Claude Code and similar tools).

## Overview

Phoenix is a clone-and-go design system starter that provides:

- 7 core UI components: Button, Input, Textarea, Select, Checkbox, RadioGroup, Label, Dialog
- Complete design token system with Style Dictionary pipeline (OKLCH color format)
- Tailwind CSS 4 integration with semantic token enforcement
- Storybook 8.6 for component documentation
- TypeScript monorepo with pnpm workspaces and Turborepo
- ESLint + Prettier with pre-commit hooks
- Figma Code Connect scaffolding ready for design integration

Key features:

- Class-based dark mode with manual toggle and localStorage persistence
- Source exports for instant HMR during development
- CVA + Radix UI component pattern for type-safe variants
- Semantic tokens only in components (no arbitrary values)
- Pre-configured git hooks for lint, typecheck, and format checks

## Architecture

### Monorepo Structure

```
phoenix/
├── apps/
│   ├── web/                  # Vite + React Router demo app
│   └── storybook/            # Storybook documentation site
├── packages/
│   ├── ui/                   # Component library (@phoenix/ui)
│   ├── tokens/               # Design token pipeline (@phoenix/tokens)
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript configuration
├── scripts/
│   └── rename-scope.mjs      # Automated scope renaming utility
└── figma.config.json         # Figma Code Connect configuration
```

### Technology Stack

- **Runtime**: Node.js 22+
- **Package Manager**: pnpm 10.0.0
- **Build Tool**: Turborepo 2.7.0
- **Framework**: React 18.3.0 (pinned due to Radix UI compatibility)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.0.18
- **Build**: Vite 7.3.1
- **Components**: Radix UI primitives + class-variance-authority
- **Tokens**: Style Dictionary 5.0.0
- **Linting**: ESLint 9.20.0 + Prettier 3.8.0
- **Documentation**: Storybook 8.6.15
- **Git Hooks**: Husky 9.0.0 + lint-staged 16.1.0

### Package Dependency Graph

```
apps/web → @phoenix/ui → @phoenix/tokens
apps/storybook → @phoenix/ui → @phoenix/tokens

All packages → @phoenix/eslint-config
All packages → @phoenix/typescript-config
```

## Key Conventions

### Design Tokens

- **Color format**: OKLCH (perceptual uniformity, P3 gamut support)
- **Semantic tokens only**: Components use `bg-primary`, `text-foreground`, etc. (never `bg-blue-500` or arbitrary values)
- **@theme mapping**: All tokens mapped in `@theme` directive for Tailwind utilities
- **Dark mode**: Class-based (`.dark` class) with manual toggle, not media query
- **Token pipeline**: JSON seed tokens → Style Dictionary → CSS variables → Tailwind CSS

Token files:

- `packages/tokens/src/tokens/*.json` - DTCG-compliant token definitions
- `packages/tokens/src/build.mjs` - Style Dictionary build script
- `packages/tokens/dist/tokens.css` - Generated light mode CSS
- `packages/tokens/dist/tokens.dark.css` - Generated dark mode CSS

### Component Patterns

All components follow the same pattern:

1. **CVA for variants**: `class-variance-authority` provides type-safe variant props
2. **Radix UI primitives**: Accessible, unstyled primitives underneath
3. **cn() helper**: `clsx` + `tailwind-merge` for className composition
4. **forwardRef**: All components forward refs for composition
5. **Semantic tokens**: Only use token-based classes (no `bg-[#hex]` or arbitrary values)
6. **Source exports**: `main: "src/index.ts"` for instant HMR

Example pattern:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const componentVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', destructive: '...' },
    size: { default: '...', sm: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

interface ComponentProps extends VariantProps<typeof componentVariants> {
  // ... props
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
```

### Styling Rules

- **No inline styles**: ESLint forbids `style` prop on all elements and components
- **No arbitrary values in packages/ui**: Components must use semantic tokens only
- **Arbitrary values allowed in apps**: Applications can use `bg-[#hex]` or `w-[500px]` when needed
- **Compound components**: Complex components (Select, Dialog) export multiple parts for composition

## Getting Started

### Prerequisites

- Node.js 22.0.0 or higher
- pnpm 10.0.0 or higher

### Installation

```bash
git clone <your-fork>
cd phoenix
pnpm install
```

### Development

Start all development servers:

```bash
pnpm dev
```

This runs:

- Web app at http://localhost:5173
- Storybook at http://localhost:6006

### Viewing Documentation

Option 1 - Run all dev servers:

```bash
pnpm dev
```

Then visit http://localhost:6006

Option 2 - Run Storybook only:

```bash
cd apps/storybook
pnpm dev
```

Storybook includes:

- Component stories with interactive controls
- Tokens visualization page showing all colors, spacing, typography
- Dark mode toggle in toolbar

## Customization

### Renaming the Scope

All packages use the `@phoenix` scope by default. To rename:

```bash
node scripts/rename-scope.mjs @yourscope
```

This updates:

- All `package.json` files
- All import statements
- All configuration files
- Workspace references

After renaming, run `pnpm install` to update lockfile.

### Modifying Tokens

To customize colors, spacing, or typography:

1. Edit token files in `packages/tokens/src/tokens/`
   - `color/neutral.json` - Neutral color scale
   - `color/semantic.json` - Semantic color mappings
   - `color/semantic.dark.json` - Dark mode overrides
   - `spacing.json` - Spacing scale (8px base)
   - `typography.json` - Font sizes, families, weights
   - `radius.json` - Border radius values

2. Rebuild tokens:

```bash
pnpm --filter @phoenix/tokens build
```

3. Restart dev server to see changes

Token format (DTCG-compliant):

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "oklch(0.647 0.186 264.54)",
        "$type": "color"
      }
    }
  }
}
```

## Development Workflow

### Adding a Component

1. Create component file in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts` barrel export
3. Create story in `apps/storybook/stories/`
4. Create Figma mapping in `packages/ui/src/components/*.figma.tsx`

### Running Tasks

```bash
pnpm dev           # Start all dev servers
pnpm build         # Build all packages
pnpm lint          # Lint all packages
pnpm typecheck     # Type check all packages
pnpm format        # Format all files with Prettier
pnpm format:check  # Check formatting without writing
```

Turbo caches task outputs for faster subsequent runs.

### Pre-commit Hooks

Husky runs these checks before each commit:

1. **lint-staged**: Prettier formats staged files
2. **turbo typecheck**: Type checks all packages
3. **commitlint**: Validates commit message (Conventional Commits format)

Expected commit format:

```
feat(scope): add new component
fix(scope): correct button padding
docs: update README
chore: upgrade dependencies
```

## Components

### Available Components

- **Button**: 6 variants (default, destructive, outline, secondary, ghost, link), 4 sizes, disabled state
- **Input**: Text, email, password, number types, placeholder, disabled state
- **Textarea**: Auto-resize option, placeholder, disabled state
- **Select**: Compound component with Trigger, Content, Item, Label, Separator parts
- **Checkbox**: Checked/unchecked states, disabled state, works with Label
- **RadioGroup**: Compound component with RadioGroup root and RadioGroupItem parts
- **Label**: Accessible label component for form elements
- **Dialog**: Modal dialog with Trigger, Content, Header, Title, Description, Footer parts

All components support:

- Dark mode (automatic via semantic tokens)
- Full TypeScript support with exported types
- Accessible (ARIA attributes, keyboard navigation)
- Composable (forwardRef, className override, asChild where applicable)

Import pattern:

```tsx
import { Button, Input, Dialog } from '@phoenix/ui'
```

For full documentation with interactive examples, run `pnpm dev` and visit http://localhost:6006

## Prior Decisions

### React 18.3.0 Pinning

Radix UI has an infinite loop bug with React 19 (as of January 2026). React is pinned to 18.3.0 via pnpm overrides until the issue is resolved. See [radix-ui/primitives#3799](https://github.com/radix-ui/primitives/issues/3799).

### Tailwind CSS 4

Uses Tailwind CSS 4 with Vite plugin and `@theme` directive. Note: `eslint-plugin-tailwindcss` removed due to incompatibility (plugin expects `resolveConfig` which doesn't exist in Tailwind CSS 4 architecture). Inline style bans still enforce Tailwind usage.

### Class-based Dark Mode

Uses `.dark` class toggle instead of `prefers-color-scheme` media query. Provides manual control via theme toggle component with localStorage persistence. Inline script in HTML prevents flash of incorrect theme on page load.

### OKLCH Color Format

All colors use OKLCH format (e.g., `oklch(0.647 0.186 264.54)`) for perceptual uniformity, wide gamut P3 support, and better accessibility. Future-proof color system consistent with modern CSS color standards.

### ESLint + Prettier over Biome

Chose ESLint + Prettier because:

- Tailwind class sorting plugin is mature and well-supported
- Claude Code has deep training on ESLint/Prettier configuration patterns
- Wider ecosystem compatibility

## License

MIT

Copyright (c) 2026 Phoenix Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
