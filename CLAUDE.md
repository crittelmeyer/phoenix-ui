# Phoenix Design System - Claude Code Reference

**Purpose:** This file provides comprehensive project context for Claude Code. It's loaded automatically when Claude starts a session.

**For other AI tools:** See `AGENTS.md` for cross-tool documentation.

---

## Project Overview

**Phoenix Design System Monorepo Starter**

Core value: AI agents can add, modify, and extend components autonomously without human hand-holding.

Tech stack: React 18.3.0 + Tailwind CSS 4 + Radix UI + CVA + Style Dictionary 5

Build system: pnpm 10 + Turborepo 2.7

**Current Status:**

- 14 production-ready components built on Radix UI primitives
- Design token system (DTCG format + OKLCH colors)
- Storybook 8.6 documentation with Figma Code Connect scaffolding
- Semantic token enforcement (no hardcoded colors)

---

## Monorepo Structure

```
phoenix/
├── apps/
│   ├── web/                # Vite + React Router demo app
│   │   ├── src/
│   │   │   ├── index.css   # Tailwind @theme directive (185 lines)
│   │   │   ├── main.tsx    # App entry point
│   │   │   └── routes/     # React Router pages
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── storybook/          # Storybook 8.6 documentation
│       ├── .storybook/
│       │   ├── main.ts     # Storybook config with viteFinal hook
│       │   └── preview.ts  # Theme decorator (dark mode support)
│       ├── stories/
│       │   ├── index.css   # Duplicate of web app @theme (required)
│       │   ├── Tokens.mdx  # Token visualization page
│       │   └── *.stories.tsx  # 13 component stories
│       └── package.json
│
├── packages/
│   ├── ui/                 # Component library (@phoenix/ui)
│   │   ├── src/
│   │   │   ├── components/   # 13 component .tsx files
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   └── *.figma.tsx  # 13 Figma Code Connect mappings
│   │   │   ├── lib/
│   │   │   │   └── utils.ts   # cn() utility function
│   │   │   └── index.ts       # Barrel export (60+ named exports)
│   │   └── package.json
│   │
│   ├── tokens/             # Design tokens (@phoenix/tokens)
│   │   ├── src/
│   │   │   ├── tokens/       # DTCG JSON source files
│   │   │   │   ├── colors.json
│   │   │   │   ├── colors.dark.json
│   │   │   │   ├── spacing.json
│   │   │   │   ├── typography.json
│   │   │   │   ├── border-radius.json
│   │   │   │   └── semantic-colors.json
│   │   │   ├── build.mjs     # Style Dictionary build script
│   │   │   └── index.ts      # Empty file for package entry
│   │   ├── dist/
│   │   │   ├── light.css     # Generated light mode CSS
│   │   │   └── dark.css      # Generated dark mode CSS
│   │   └── package.json
│   │
│   ├── eslint-config/      # Shared ESLint configuration
│   │   └── index.js
│   │
│   └── tsconfig/           # Shared TypeScript configuration
│       ├── base.json
│       ├── react.json
│       └── library.json
│
├── CLAUDE.md               # This file (Claude Code reference)
├── AGENTS.md               # Cross-tool AI documentation
├── README.md               # User-facing project documentation
├── .claude/rules/          # Path-scoped rules (loaded conditionally)
│   ├── ui-components.md    # Component authoring template
│   ├── token-authoring.md  # Token editing guide
│   └── storybook-stories.md  # Story template
├── figma.config.json       # Figma Code Connect root config
├── turbo.json              # Turborepo pipeline configuration
├── package.json            # Root workspace package.json
└── pnpm-workspace.yaml     # pnpm workspace configuration
```

---

## Development Commands

**Install dependencies:**

```bash
pnpm install
```

**Start all dev servers:**

```bash
pnpm dev
```

- Web app: http://localhost:5173
- Storybook: http://localhost:6006

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

**Start Storybook standalone:**

```bash
pnpm storybook
```

**Rebuild tokens after editing:**

```bash
cd packages/tokens && pnpm build
```

**Pre-commit checklist:**

```bash
pnpm typecheck && pnpm lint && pnpm format:check
```

---

## Component Patterns

**Location:** All components live in `packages/ui/src/components/[name].tsx`

**Core pattern:** forwardRef + cn() + semantic tokens + CVA (when variants needed)

**Anatomy of a component:**

1. Imports (React, Radix primitives, CVA, cn utility)
2. CVA variant definitions (if component has variants)
3. TypeScript interface extending HTML element props
4. forwardRef implementation with cn() for className merging
5. displayName assignment (required for React DevTools)
6. Named exports (component + variants if applicable)

**Compound components:** Export multiple parts from single file (Dialog, Select, DropdownMenu, Tabs, Tooltip, Form)

**Every component needs:**

- `.tsx` file with implementation
- `.figma.tsx` mapping file for Figma Code Connect
- `.stories.tsx` file in `apps/storybook/stories/`
- Barrel export entry in `packages/ui/src/index.ts`

**For detailed component authoring template:** See `.claude/rules/ui-components.md`

---

## Token System

**Format:** DTCG (Design Tokens Community Group) JSON format

**Location:** `packages/tokens/src/tokens/`

**Color format:** OKLCH throughout (e.g., `"oklch(0.647 0.186 264.54)"`)

**Build process:** Style Dictionary compiles JSON to CSS custom properties

**Output:** `packages/tokens/dist/light.css` and `dark.css`

**Dark mode:** Class-based (`.dark` class on `<html>`)

**Tailwind integration:** `@theme` directive maps tokens to utilities

**Token categories:**

- Colors (OKLCH, P3 gamut)
- Spacing (8px base, fractional multipliers)
- Typography (font families, sizes, weights, line heights)
- Border radius (rounded corners)
- Semantic colors (primary, destructive, muted, etc.)

**Editing workflow:**

1. Edit JSON files in `packages/tokens/src/tokens/`
2. Run `cd packages/tokens && pnpm build`
3. Tokens automatically available in Tailwind utilities
4. Components inherit changes via semantic token classes

**For detailed token authoring guide:** See `.claude/rules/token-authoring.md`

---

## Storybook

**Version:** Storybook 8.6 with Vite builder

**Location:** Stories in `apps/storybook/stories/[Name].stories.tsx`

**Format:** CSF 3.0 with `satisfies Meta<typeof Component>`

**Pattern:**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@phoenix/ui'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  // For compound components:
  subcomponents: { ButtonPart1, ButtonPart2 },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Click me',
  },
}
```

**All stories include:** `tags: ['autodocs']` for automatic prop table generation

**Compound component pattern:** Use `subcomponents` property for multi-part components

**Dark mode:** Theme toggle in Storybook toolbar (addon-themes)

**For detailed story template:** See `.claude/rules/storybook-stories.md`

---

## Critical Pitfalls

### 1. React Version Pinned to 18.3.0

**DO NOT upgrade to React 19.** Radix UI + React 19 causes infinite render loop bug.

- Root `package.json` has `pnpm.overrides` forcing React 18.3.0
- GitHub issue: radix-ui/primitives#3799
- Monitor issue for resolution before upgrading

### 2. No Inline Styles Allowed

**ESLint enforces ban on inline styles** via `react/forbid-dom-props` and `react/forbid-component-props`.

- Use Tailwind classes only: `className="bg-primary"` NOT `style={{ background: '#hex' }}`
- Rationale: Forces semantic tokens, enables automatic dark mode

### 3. No Arbitrary Tailwind Values in packages/ui

**Components must use semantic tokens only.** No `bg-[#hex]` or `text-[#hex]`.

- Good: `bg-primary`, `text-foreground`, `border-input`
- Bad: `bg-[#3b82f6]`, `text-[#000]`
- Arbitrary values break dark mode and token system

### 4. Style Dictionary Build is Async

**Always use `await sd.buildAllPlatforms()`** in build scripts.

- Style Dictionary 5+ requires async/await
- Build script is ESM (`.mjs` extension)
- Pattern: `const sd = new StyleDictionary(config); await sd.buildAllPlatforms();`

### 5. Tailwind CSS 4 Uses @theme Directive

**NOT tailwind.config.js.** Theme configuration via CSS `@theme` directive.

- Location: `apps/web/src/index.css` and `apps/storybook/stories/index.css`
- 185 lines mapping semantic tokens to Tailwind utilities
- Must be duplicated in both apps (UI package has no CSS)

### 6. Source Exports for HMR

**Workspace packages use `main: "src/index.ts"`** in package.json, NOT dist builds.

- Enables Hot Module Replacement during development
- Apps import directly from source files
- Build step for production will be added in later phase

### 7. eslint-plugin-tailwindcss Removed

**Incompatible with Tailwind CSS 4.** Do NOT add it back.

- Plugin tries to import `resolveConfig` which doesn't exist in Tailwind CSS 4
- Inline style ban via `react/forbid-dom-props` still enforces Tailwind usage
- Will re-evaluate when plugin updates for Tailwind CSS 4

### 8. Storybook Duplicate CSS Required

**`apps/storybook/stories/index.css` must mirror `apps/web/src/index.css`** @theme section.

- UI package has no index.css to import (source exports only)
- Duplicate all `@import` statements and `@theme` mappings (185 lines)
- Ensures Storybook has identical token setup for accurate preview

### 9. Async Tailwind CSS Plugin Import in Storybook

**Use `await import('@tailwindcss/vite')`** in `viteFinal` hook.

- `@tailwindcss/vite` is ESM-only package
- CJS deprecation warning is cosmetic and expected
- Pattern: `plugins: [(await import('@tailwindcss/vite')).default()]`

### 10. All Components Must Use forwardRef

**Every component forwarding refs** to DOM elements must use `React.forwardRef`.

- Enables parent components to access underlying DOM node
- Required for Radix UI composition (asChild pattern)
- Pattern: `const Component = React.forwardRef<HTMLDivElement, Props>((props, ref) => ...)`

### 11. All Components Need .figma.tsx Mapping

**Even if Figma design doesn't exist yet.**

- Scaffolding: `figma.config.json` at repo root + `.figma.tsx` files
- Placeholder URLs: `https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID`
- ESLint ignores `.figma.tsx` files to prevent false errors
- Infrastructure ready for future Figma Code Connect integration

### 12. Semantic Token Classes Only in Components

**Zero hardcoded colors allowed.**

- All styling uses semantic tokens: `bg-primary`, `text-foreground`, `border-input`
- Automatic dark mode support via CSS variable swapping
- Verified via grep: no `style=` attributes, no arbitrary color values

---

## Naming Conventions

| Item               | Convention                    | Example                    |
| ------------------ | ----------------------------- | -------------------------- |
| Component files    | lowercase kebab-case          | `dropdown-menu.tsx`        |
| Component exports  | PascalCase                    | `DropdownMenu`             |
| Story files        | PascalCase                    | `DropdownMenu.stories.tsx` |
| Figma files        | kebab-case with .figma suffix | `dropdown-menu.figma.tsx`  |
| Token files        | kebab-case JSON               | `colors.json`              |
| Token files (dark) | kebab-case with .dark suffix  | `colors.dark.json`         |
| Package scope      | `@phoenix/` (configurable)    | `@phoenix/ui`              |
| Story titles       | Category/Name                 | `Components/DropdownMenu`  |

---

## Key Architectural Decisions

### CVA for Variant Management

Use class-variance-authority for type-safe component variants instead of custom prop logic.

**Pattern:**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const variants = cva('base-classes', {
  variants: {
    variant: {
      default: 'variant-classes',
      secondary: 'variant-classes',
    },
    size: {
      sm: 'size-classes',
      md: 'size-classes',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})

interface Props extends VariantProps<typeof variants> {}
```

### Radix UI Primitives for Accessibility

Use Radix UI primitives for focus trap, ARIA attributes, keyboard navigation.

- Built-in accessibility (no custom implementation needed)
- Focus management (focus trap on open, return on close)
- Keyboard shortcuts (Escape to close, Arrow keys for navigation)
- ARIA attributes (role, aria-labelledby, aria-describedby)

### Semantic Tokens Only in Components

All component styling uses semantic tokens for automatic dark mode.

- `bg-primary` NOT `bg-blue-500`
- `text-foreground` NOT `text-gray-900`
- `border-input` NOT `border-gray-300`

### Class-Based Dark Mode

Use `.dark` class on `<html>` for manual dark mode control.

- ThemeToggle component sets class based on localStorage
- Overrides OS preference (users control theme explicitly)
- Zero FOUC via synchronous inline script in `<head>`

### Compound Component Pattern

Complex UI exports multiple parts from single file for maximum composition flexibility.

- Dialog: 10 parts (Root, Trigger, Content, Header, Footer, Title, Description, Portal, Overlay, Close)
- DropdownMenu: 15 parts (Root, Trigger, Content, Item, CheckboxItem, RadioItem, etc.)
- Select: 10 parts (Root, Trigger, Content, Item, Group, Label, etc.)
- Tabs: 4 parts (Root, List, Trigger, Content)
- Tooltip: 4 parts (Provider, Root, Trigger, Content)
- Form: 8 exports (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField)

---

## 14 Components in @phoenix/ui

1. **Button** - CVA variants (default, destructive, outline, secondary, ghost, link) + sizes + asChild
2. **Input** - forwardRef input with semantic token styling
3. **Textarea** - autoResize prop grows/shrinks with content
4. **Select** - 10 compound parts (Root, Trigger, Content, Item, Group, Label, Separator, ScrollUpButton, ScrollDownButton, Value)
5. **Checkbox** - Inline SVG check, Radix primitive
6. **RadioGroup** - 2 compound parts (Root, Item)
7. **Label** - Radix primitive with semantic token styling
8. **Dialog** - 10 compound parts with default X close button
9. **DropdownMenu** - 15 compound parts with CheckboxItem, RadioItem, submenu support
10. **Tabs** - 4 compound parts with underline-style active indicator
11. **Tooltip** - 4 compound parts with side-aware animations + Provider
12. **Toast/Toaster** - Sonner wrapper with semantic token styling
13. **Form** - 8 exports for react-hook-form integration with dual React Context pattern
14. **Accordion** - 4 compound parts (Root, Item, Trigger, Content) with CSS keyframe animations

---

## Progressive Disclosure References

For detailed patterns and templates, see:

- `.claude/rules/ui-components.md` - Component authoring template
- `.claude/rules/token-authoring.md` - Token editing guide
- `.claude/rules/storybook-stories.md` - Story template

These path-scoped rules load automatically when Claude works in relevant directories.
