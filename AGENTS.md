# Phoenix Design System - AI Agent Documentation

**Purpose:** This file provides cross-tool AI agent documentation following the Linux Foundation standard adopted by 60,000+ repositories.

**For Claude Code:** See `CLAUDE.md` for comprehensive patterns and `.claude/rules/` for path-scoped templates.

---

## Project Overview

**Phoenix Design System Monorepo Starter**

A production-ready design system demonstrating how AI agents can autonomously add, modify, and extend components without human hand-holding.

**Built with:**

- 13 components on Radix UI primitives (accessibility built-in)
- Design token system using Style Dictionary (DTCG format)
- Tailwind CSS 4 with semantic tokens only (automatic dark mode)
- Component documentation in Storybook 8.6
- Figma Code Connect scaffolding for design-code sync

**Core principle:** Explicit structure, naming, patterns, and rules enable AI autonomy.

---

## Tech Stack

| Technology       | Version | Purpose                               |
| ---------------- | ------- | ------------------------------------- |
| React            | 18.3.0  | UI library (pinned - see Constraints) |
| TypeScript       | 5.x     | Type safety                           |
| Tailwind CSS     | 4       | Utility-first styling                 |
| Radix UI         | Latest  | Accessible component primitives       |
| CVA              | 0.7     | Type-safe variant management          |
| Style Dictionary | 5.x     | Design token build system             |
| pnpm             | 10      | Package manager                       |
| Turborepo        | 2.7     | Monorepo build system                 |
| Vite             | Latest  | Build tool + dev server               |
| Storybook        | 8.6     | Component documentation               |

---

## Monorepo Structure

```
phoenix/
├── apps/
│   ├── web/              # Vite + React Router demo app
│   └── storybook/        # Storybook 8.6 documentation
├── packages/
│   ├── ui/               # Component library (@phoenix/ui)
│   │   ├── src/components/  # 13 component .tsx files
│   │   ├── src/lib/         # cn() utility
│   │   └── src/index.ts     # Barrel export (60+ named exports)
│   ├── tokens/           # Design tokens (@phoenix/tokens)
│   │   ├── src/tokens/      # DTCG JSON source files
│   │   ├── src/build.mjs    # Style Dictionary build script
│   │   └── dist/            # Generated light.css + dark.css
│   ├── eslint-config/    # Shared ESLint configuration
│   └── tsconfig/         # Shared TypeScript configuration
├── CLAUDE.md             # Claude Code comprehensive reference
├── AGENTS.md             # This file (cross-tool documentation)
├── README.md             # User-facing project documentation
└── figma.config.json     # Figma Code Connect root config
```

---

## Development Commands

**Install dependencies:**

```bash
pnpm install
```

**Start all dev servers (web + storybook):**

```bash
pnpm dev
```

**Build all packages:**

```bash
pnpm build
```

**Type check all packages:**

```bash
pnpm typecheck
```

**Lint all packages:**

```bash
pnpm lint
```

**Format code:**

```bash
pnpm format
```

**Format check (CI):**

```bash
pnpm format:check
```

**Rebuild tokens after editing:**

```bash
cd packages/tokens && pnpm build
```

**Pre-commit validation:**

```bash
pnpm typecheck && pnpm lint && pnpm format:check
```

---

## Code Patterns

### Component Pattern

**Location:** `packages/ui/src/components/[name].tsx`

**Structure:**

1. React forwardRef wrapping component implementation
2. CVA for variants (if needed)
3. cn() utility for className merging
4. Semantic tokens only (bg-primary, NOT bg-[#hex])
5. displayName assignment for React DevTools

**Example:**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Story Pattern

**Location:** `apps/storybook/stories/[Name].stories.tsx`

**Structure:** CSF 3.0 format with `satisfies Meta<typeof Component>`

**Example:**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@phoenix/ui'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Click me',
  },
}
```

### Token Pattern

**Location:** `packages/tokens/src/tokens/[category].json`

**Format:** DTCG (Design Tokens Community Group) JSON

**Example:**

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": "oklch(0.647 0.186 264.54)"
    }
  }
}
```

**Dark mode tokens:** Separate files with `.dark.json` suffix

**For comprehensive patterns:** See `CLAUDE.md` and `.claude/rules/` directory

---

## Adding a New Component

1. **Install Radix primitive if needed:**

   ```bash
   pnpm add @radix-ui/react-[primitive] --filter @phoenix/ui
   ```

2. **Create component file:**

   ```bash
   # packages/ui/src/components/[name].tsx
   ```

3. **Create Figma mapping file:**

   ```bash
   # packages/ui/src/components/[name].figma.tsx
   ```

4. **Create Storybook story:**

   ```bash
   # apps/storybook/stories/[Name].stories.tsx
   ```

5. **Update barrel export:**

   ```typescript
   // packages/ui/src/index.ts
   export { ComponentName } from './components/component-name'
   ```

6. **Verify:**
   ```bash
   pnpm typecheck
   ```

---

## Critical Constraints

### React 18.3.0 Pinned

**DO NOT upgrade to React 19.** Radix UI + React 19 causes infinite render loop.

- Root `package.json` enforces via `pnpm.overrides`
- GitHub issue: radix-ui/primitives#3799

### No Inline Styles

**ESLint enforces ban.** All styling via Tailwind classes.

- Good: `className="bg-primary"`
- Bad: `style={{ background: '#hex' }}`

### No Arbitrary Tailwind Values in packages/ui

**Components use semantic tokens only.**

- Good: `bg-primary`, `text-foreground`, `border-input`
- Bad: `bg-[#3b82f6]`, `text-[#000]`
- Rationale: Automatic dark mode support

### All Components Must Use forwardRef

**Required for ref forwarding to DOM elements.**

- Enables parent component DOM access
- Required for Radix UI composition (asChild pattern)

### All Components Need .figma.tsx Mapping

**Even if Figma design doesn't exist yet.**

- Scaffolding ready for future Figma Code Connect integration
- ESLint ignores `.figma.tsx` files

### Semantic Token Classes Only

**Zero hardcoded colors.**

- Ensures automatic dark mode via CSS variable swapping
- All components verified: no `style=` attributes, no arbitrary values

### Style Dictionary Build is Async

**Always use `await sd.buildAllPlatforms()`** in build scripts.

- Style Dictionary 5+ requires async/await
- Build script uses `.mjs` extension for ESM

### Tailwind CSS 4 Uses @theme Directive

**NOT tailwind.config.js.**

- Theme configuration in CSS files (`apps/web/src/index.css`)
- Must duplicate @theme section in Storybook (`apps/storybook/stories/index.css`)

### Source Exports for HMR

**Workspace packages use `main: "src/index.ts"`** NOT dist builds.

- Enables Hot Module Replacement during development
- Build step for production will be added in later phase

---

## Tool-Specific Configuration

### Claude Code

**Primary documentation:** `CLAUDE.md` (492 lines)

**Path-scoped rules:** `.claude/rules/` directory

- `ui-components.md` - Component authoring template
- `token-authoring.md` - Token editing guide
- `storybook-stories.md` - Story template

Rules load automatically when Claude works in relevant directories.

### Cursor

**Core patterns:** This file (`AGENTS.md`)

**Detailed patterns:** `CLAUDE.md` for comprehensive reference

**Rules mapping:** `.claude/rules/` files can be mapped to `.cursor/rules/*.mdc` if desired

### GitHub Copilot

**Core patterns:** This file (`AGENTS.md`)

**Detailed patterns:** `CLAUDE.md` for comprehensive reference

**In-editor:** Copilot reads this file for project context

### Other AI Tools (Windsurf, etc.)

**Start here:** This file (`AGENTS.md`) for quick orientation

**Deep dive:** `CLAUDE.md` for complete patterns and constraints

---

## 13 Components Available

1. **Button** - CVA variants + sizes + asChild support
2. **Input** - forwardRef input with semantic tokens
3. **Textarea** - autoResize prop for dynamic height
4. **Select** - 10 compound parts for dropdown selection
5. **Checkbox** - Radix primitive with inline SVG check
6. **RadioGroup** - 2 compound parts for radio selection
7. **Label** - Radix primitive with semantic tokens
8. **Dialog** - 10 compound parts with modal overlay
9. **DropdownMenu** - 15 compound parts with submenu support
10. **Tabs** - 4 compound parts with underline indicator
11. **Tooltip** - 4 compound parts with animations
12. **Toast** - Sonner wrapper with semantic tokens
13. **Form** - 8 exports for react-hook-form integration

**Import pattern:**

```tsx
import { Button, Dialog, DropdownMenu, Input } from '@phoenix/ui'
```

---

## Design Token Categories

- **Colors:** OKLCH format, P3 gamut, semantic mappings
- **Spacing:** 8px base unit with fractional multipliers
- **Typography:** Font families, sizes, weights, line heights
- **Border radius:** Corner rounding values
- **Semantic colors:** primary, destructive, muted, accent, etc.

**Editing workflow:**

1. Edit JSON in `packages/tokens/src/tokens/`
2. Run `cd packages/tokens && pnpm build`
3. Tokens auto-available in Tailwind utilities
4. Components inherit changes automatically

---

## Project Philosophy

**AI-First Design**

Every aspect of this project is optimized for AI agent autonomy:

- **Explicit structure:** Clear monorepo layout, predictable paths
- **Naming conventions:** Consistent kebab-case files, PascalCase exports
- **Pattern enforcement:** ESLint rules ban anti-patterns
- **Documentation layers:** AGENTS.md (quick start) → CLAUDE.md (comprehensive) → .claude/rules/ (templates)
- **Semantic constraints:** Token-only styling prevents dark mode bugs

**Result:** AI agents can add components, modify tokens, and extend functionality without human intervention.

---

## Additional Resources

- **CLAUDE.md** - Comprehensive Claude Code reference (492 lines)
- **README.md** - User-facing project documentation
- **.claude/rules/** - Path-scoped component/token/story templates
- **Storybook** - http://localhost:6006 (run `pnpm dev`)

---

**File version:** 2026-02-02 | Phoenix Design System v0.0.0
