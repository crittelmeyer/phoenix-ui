# Phase 4: Documentation Infrastructure - Research

**Researched:** 2026-02-01
**Domain:** Storybook 10 + Vite + Tailwind CSS 4, Figma Code Connect, AI-optimized documentation
**Confidence:** HIGH

## Summary

Phase 4 establishes interactive component documentation using Storybook 10.1 (ESM-only, 29% lighter) with Vite builder and @tailwindcss/vite plugin integration, Figma Code Connect CLI scaffolding for 7 components, and a root README optimized for AI agent comprehension. The 2026 ecosystem has standardized on Storybook for component libraries, with official @storybook/addon-themes replacing older dark mode addons, MDX for custom documentation pages, and the emerging AGENTS.md/CLAUDE.md pattern for AI-readable documentation.

The critical path involves: (1) Storybook 10 app in apps/storybook with Vite builder configured via viteFinal hook to load @tailwindcss/vite plugin, (2) one story file per component using CSF 3.0 format with multiple named exports (Default, AllVariants, AllSizes, Disabled, etc.), (3) @storybook/addon-themes with withThemeByClassName decorator for class-based dark mode ("" for light, "dark" for dark), (4) tokens overview page as standalone MDX file visualizing colors/spacing/typography/radii in single scrollable page, (5) Figma Code Connect CLI setup with figma.config.json and .figma.tsx files co-located with components, and (6) README.md structured for AI agents with project overview, architecture, conventions, and scope rename instructions.

Key technical decisions: Storybook's built-in "Show code" feature eliminates manual code blocks, compound components (Select, Dialog) get both sub-part stories and fully assembled examples, token page follows global theme toggle (not side-by-side), Figma mappings are placeholder scaffolds (no Figma file exists yet), and README targets Claude Code/similar agents with structured sections and explicit context. The highest risk pitfall is @tailwindcss/vite integration requiring async dynamic import in viteFinal (generates CJS deprecation warning but works correctly).

**Primary recommendation:** Use @storybook/addon-themes (official) not storybook-dark-mode (unmaintained), configure viteFinal with async import for Tailwind plugin, write stories with subcomponents pattern for compound components, create token page as MDX with Meta block (not custom addon), scaffold Figma Code Connect files early even without Figma file, and structure README with clear sections for project structure, conventions, and getting started.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library                     | Version | Purpose                             | Why Standard                                                                                                                         |
| --------------------------- | ------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Storybook                   | 10.1.x  | Interactive component documentation | ESM-only (29% lighter), sb.mock for module mocking, CSF Factories for type safety, industry standard for component libraries in 2026 |
| @storybook/react-vite       | 10.1.x  | Vite builder for React              | Fast HMR, native ESM, official React framework integration with Vite builder                                                         |
| @storybook/addon-essentials | 10.1.x  | Core addons bundle                  | Actions, Viewport, Measure, Outline, Docs, Controls, Backgrounds, Toolbars - zero-config bundle included by default                  |
| @storybook/addon-themes     | Latest  | Theme switching decorator           | Official addon for class/data-attribute theming, replaces storybook-dark-mode in Storybook 9+                                        |
| @figma/code-connect         | Latest  | Figma-to-code linking               | Official Figma tool, connects React components to Figma design files, enables Dev Mode code snippets                                 |

### Supporting

| Library               | Version | Purpose                          | When to Use                                                         |
| --------------------- | ------- | -------------------------------- | ------------------------------------------------------------------- |
| @storybook/addon-a11y | Latest  | Accessibility testing            | Optional but recommended - shows a11y violations in Addon panel     |
| @storybook/blocks     | 10.1.x  | MDX documentation blocks         | Meta, Canvas, Controls, Stories blocks for custom MDX pages         |
| vite                  | 7.x     | Build tool (already in monorepo) | Reuse existing Vite config, @tailwindcss/vite plugin integration    |
| @tailwindcss/vite     | 4.x     | Tailwind v4 Vite plugin          | Required for Tailwind CSS 4 in Storybook, loaded via viteFinal hook |

### Alternatives Considered

| Instead of              | Could Use              | Tradeoff                                                                                                                                                              |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @storybook/addon-themes | storybook-dark-mode    | storybook-dark-mode v4.0.2 last updated 2024, incompatible with Storybook 9+; @vueless/storybook-dark-mode is fork for v9/v10 but @storybook/addon-themes is official |
| MDX for token page      | Custom Storybook addon | Custom addon requires more code and understanding of Storybook API; MDX simpler for read-only documentation pages                                                     |
| Figma Code Connect      | Manual code examples   | Code Connect auto-syncs with Figma, reduces drift; manual examples easier but require constant updates                                                                |
| README.md only          | Separate AGENTS.md     | AGENTS.md emerging standard for AI context but README.md sufficient for Phase 4; can add AGENTS.md in Phase 6 (AI Integration)                                        |

**Installation:**

```bash
# Storybook 10 with React + Vite
cd apps/storybook
pnpm add -D storybook @storybook/react-vite @storybook/addon-essentials @storybook/addon-themes @storybook/blocks

# Figma Code Connect (global or dev dependency)
pnpm add -D @figma/code-connect

# Initialize Storybook (if not already done)
pnpm dlx storybook@latest init --builder vite
```

## Architecture Patterns

### Recommended Project Structure

```
apps/storybook/
├── .storybook/
│   ├── main.ts                      # Storybook config with viteFinal hook
│   ├── preview.ts                   # Global decorators, theme setup
│   └── preview-head.html            # Optional: custom fonts/meta tags
├── stories/
│   ├── Introduction.mdx             # Getting started page
│   ├── Tokens.mdx                   # Design tokens visualization
│   ├── Button.stories.tsx           # Component stories
│   ├── Input.stories.tsx
│   ├── Textarea.stories.tsx
│   ├── Select.stories.tsx           # Compound component
│   ├── Checkbox.stories.tsx
│   ├── RadioGroup.stories.tsx
│   └── Dialog.stories.tsx           # Compound component
├── package.json                     # Storybook dependencies
└── tsconfig.json

packages/ui/src/components/
├── button.tsx
├── button.figma.tsx                 # Co-located Code Connect file
├── input.tsx
├── input.figma.tsx
└── ...

figma.config.json                    # Root config for Code Connect
README.md                            # AI-optimized documentation
```

### Pattern 1: Storybook Main Config with Tailwind CSS 4

**What:** Configure Storybook's Vite builder to use @tailwindcss/vite plugin via viteFinal hook

**When to use:** Required for Tailwind CSS 4 support in Storybook

**Example:**

```typescript
// apps/storybook/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    // Dynamic import required due to ESM-only package
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      plugins: [tailwindcss()],
    })
  },
}

export default config
```

**Critical:** Must use async dynamic import `await import('@tailwindcss/vite')` - direct import fails with "No exports main defined" error. Generates CJS deprecation warning but functions correctly.

### Pattern 2: Theme Switching with Class-Based Dark Mode

**What:** Configure @storybook/addon-themes for Tailwind's class-based dark mode

**When to use:** All Storybook setups with class-based theming (e.g., Tailwind)

**Example:**

```typescript
// apps/storybook/.storybook/preview.ts
import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import '@phoenix/ui/src/index.css' // Import Tailwind styles

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '', // No class for light mode
        dark: 'dark', // 'dark' class for dark mode
      },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

**Why:** withThemeByClassName applies/removes class names on story root element, matching Tailwind's `class="dark"` convention. Toolbar in Storybook UI provides theme toggle.

### Pattern 3: Component Story File with Multiple Exports (CSF 3.0)

**What:** One .stories.tsx file per component with named exports for each story

**When to use:** All component stories

**Example:**

```typescript
// apps/storybook/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@phoenix/ui'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">→</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}
```

**Why:** Multiple named exports = multiple stories in sidebar. Storybook's "Show code" automatically generates code snippets. `tags: ['autodocs']` enables auto-generated docs page.

### Pattern 4: Compound Component Stories (Select, Dialog)

**What:** Use `subcomponents` property to document child components alongside parent

**When to use:** Components with multiple sub-parts (Select, Dialog, RadioGroup)

**Example:**

```typescript
// apps/storybook/stories/Select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@phoenix/ui'

const meta = {
  title: 'Components/Select',
  component: Select,
  subcomponents: {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
}
```

**Why:** `subcomponents` property documents all related components in single story file. Auto-generated docs show props tables for each sub-component. Fully assembled examples demonstrate actual usage patterns.

### Pattern 5: Token Overview Page (MDX)

**What:** Standalone MDX page visualizing design tokens without interactive controls

**When to use:** Single scrollable reference page for colors, spacing, typography, radii

**Example:**

```mdx
{/* apps/storybook/stories/Tokens.mdx */}
import { Meta } from '@storybook/blocks'

<Meta title="Design System/Tokens" />

# Design Tokens

Visual reference for all design tokens in the Phoenix design system.

## Colors

### Background

<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <div className="bg-background h-20 rounded border" />
    <p className="text-sm">
      <strong>background</strong>
      <br />
      <code>--color-background</code>
    </p>
  </div>
  <div className="space-y-2">
    <div className="bg-foreground h-20 rounded" />
    <p className="text-sm">
      <strong>foreground</strong>
      <br />
      <code>--color-foreground</code>
    </p>
  </div>
</div>

### Primary

<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <div className="bg-primary h-20 rounded" />
    <p className="text-sm">
      <strong>primary</strong>
      <br />
      <code>--color-primary</code>
    </p>
  </div>
  <div className="space-y-2">
    <div className="bg-primary-foreground h-20 rounded" />
    <p className="text-sm">
      <strong>primary-foreground</strong>
      <br />
      <code>--color-primary-foreground</code>
    </p>
  </div>
</div>

## Spacing

Visual representation of spacing scale:

<div className="space-y-4">
  {[1, 2, 4, 8, 12, 16, 24, 32, 48, 64].map((size) => (
    <div key={size} className="flex items-center gap-4">
      <div className={`bg-primary h-8`} style={{ width: `${size * 4}px` }} />
      <p className="text-sm">
        <strong>{size}</strong> ({size * 4}px)
      </p>
    </div>
  ))}
</div>

## Typography

<div className="space-y-8">
  <div>
    <p className="text-muted-foreground mb-2 text-sm">font-sans / text-sm</p>
    <p className="font-sans text-sm">
      The quick brown fox jumps over the lazy dog
    </p>
  </div>
  <div>
    <p className="text-muted-foreground mb-2 text-sm">font-sans / text-base</p>
    <p className="font-sans text-base">
      The quick brown fox jumps over the lazy dog
    </p>
  </div>
  <div>
    <p className="text-muted-foreground mb-2 text-sm">font-sans / text-lg</p>
    <p className="font-sans text-lg">
      The quick brown fox jumps over the lazy dog
    </p>
  </div>
</div>

## Border Radius

<div className="grid grid-cols-3 gap-4">
  <div className="space-y-2">
    <div className="bg-muted h-20 rounded-sm" />
    <p className="text-sm">
      <strong>sm</strong> (2px)
    </p>
  </div>
  <div className="space-y-2">
    <div className="bg-muted h-20 rounded-md" />
    <p className="text-sm">
      <strong>md</strong> (6px)
    </p>
  </div>
  <div className="space-y-2">
    <div className="bg-muted h-20 rounded-lg" />
    <p className="text-sm">
      <strong>lg</strong> (8px)
    </p>
  </div>
</div>
```

**Why:** MDX allows mixing markdown with JSX components. Follows global theme toggle automatically. Simple, maintainable, no custom addon code needed.

### Pattern 6: Figma Code Connect Setup (Scaffold)

**What:** Initialize figma.config.json and create placeholder .figma.tsx files co-located with components

**When to use:** Early scaffolding even without Figma file (Phase 4 scope)

**Example:**

```bash
# Initialize Code Connect (interactive)
npx figma connect create --token=PLACEHOLDER_TOKEN

# Or manually create config
```

```json
// figma.config.json (root)
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React"
  },
  "documentUrlSubstitutions": {}
}
```

```typescript
// packages/ui/src/components/button.figma.tsx
import figma from '@figma/code-connect'
import { Button } from './button'

/**
 * Placeholder Code Connect mapping for Button component.
 * Update with actual Figma component URL when design file is created.
 */
figma.connect(
  Button,
  'https://figma.com/file/PLACEHOLDER/Button', // Replace with real URL
  {
    props: {
      variant: figma.enum('Variant', {
        Default: 'default',
        Destructive: 'destructive',
        Outline: 'outline',
        Ghost: 'ghost',
        Link: 'link',
      }),
      size: figma.enum('Size', {
        Default: 'default',
        Small: 'sm',
        Large: 'lg',
        Icon: 'icon',
      }),
      disabled: figma.boolean('Disabled'),
      children: figma.string('Label'),
    },
    example: ({ variant, size, disabled, children }) => (
      <Button variant={variant} size={size} disabled={disabled}>
        {children}
      </Button>
    ),
  }
)
```

**Why:** Co-location (button.figma.tsx next to button.tsx) keeps mappings discoverable. Placeholder files ready to populate when Figma file created. `figma.enum()`, `figma.boolean()`, `figma.string()` map Figma properties to React props.

**Publish:** `npx figma connect publish --token=TOKEN` (deferred until Figma file exists)

### Pattern 7: AI-Optimized README Structure

**What:** README.md targeting AI agents (Claude Code) with structured sections for comprehension

**When to use:** Root README.md in monorepo

**Example:**

```markdown
# Phoenix Design System

A modern, accessible design system built with React, TypeScript, Tailwind CSS, and Radix UI.

## Overview

Phoenix is a production-ready design system starter template featuring:

- 7 core components (Button, Input, Textarea, Select, Checkbox, RadioGroup, Dialog)
- Semantic design tokens using Tailwind CSS 4 and OKLCH color format
- Dark mode with class-based theming
- Full TypeScript support with strict mode
- Interactive Storybook documentation
- Figma Code Connect integration (scaffolded)

**Target audience:** This README is optimized for AI agents (Claude Code and similar tools). Human developers should refer to the [Storybook documentation](http://localhost:6006) for component usage.

## Architecture

### Monorepo Structure
```

phoenix/
├── apps/
│ ├── storybook/ # Component documentation
│ └── web/ # Demo application
├── packages/
│ ├── ui/ # React component library
│ └── tokens/ # Design tokens
└── scripts/
└── rename-scope.mjs # Scope renaming utility

````

### Technology Stack

- **Build:** pnpm 10 workspaces + Turborepo 2.7
- **Framework:** React 18.3.0 (pinned for Radix UI compatibility)
- **Styling:** Tailwind CSS 4 with @tailwindcss/vite plugin
- **Components:** Radix UI primitives + CVA for variants
- **Documentation:** Storybook 10.1 with Vite builder
- **TypeScript:** 5.9.x with strict mode

### Key Conventions

**Design Tokens:**
- OKLCH color format for perceptually uniform colors
- Semantic token classes only (no arbitrary values in packages/ui)
- @theme comprehensive mapping for Tailwind v4
- Class-based dark mode (`class="dark"`) for manual control

**Component Patterns:**
- CVA for variant management
- Radix UI for accessibility and behavior
- Source exports (`main: "src/index.ts"`) for HMR during development
- Compound components for complex UI (Select, Dialog, RadioGroup)

**Styling Rules:**
- No arbitrary Tailwind values in packages/ui (enforced by ESLint)
- Apps can use arbitrary values for one-off customization
- All colors use semantic tokens (background, foreground, primary, etc.)

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/phoenix.git
cd phoenix

# Install dependencies
pnpm install

# Start development servers
pnpm dev
````

### Viewing Documentation

```bash
# Start Storybook
cd apps/storybook
pnpm dev

# Open http://localhost:6006
```

## Customization

### Renaming Package Scope

To rename from `@phoenix` to your custom scope:

```bash
# Run rename script
node scripts/rename-scope.mjs @yourscope

# Reinstall dependencies
rm -rf node_modules **/node_modules pnpm-lock.yaml
pnpm install
```

The script updates all package.json files, imports, and documentation.

### Modifying Design Tokens

Edit `packages/tokens/src/tokens.css` to customize:

- Colors (OKLCH format)
- Spacing scale
- Typography
- Border radii

Components automatically use updated tokens via Tailwind's CSS variable system.

## Development Workflow

### Adding a Component

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Add story in `apps/storybook/stories/`
4. Add Figma Code Connect file (`.figma.tsx`)

### Running Tasks

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm typecheck    # Type-check all packages
pnpm format       # Format with Prettier
```

## Prior Decisions

**React Version:** Pinned to 18.3.0 due to React 19 + Radix UI infinite loop bug (GitHub issue radix-ui/primitives#3799)

**Tailwind Version:** v4 for 5x faster builds and CSS-first configuration

**Dark Mode:** Class-based (`class="dark"`) for manual control vs. media query

**Color Format:** OKLCH for perceptually uniform color manipulation

## Components

- **Button** - Primary action buttons with 5 variants and 4 sizes
- **Input** - Text input field with error states
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection with keyboard navigation
- **Checkbox** - Boolean toggle with indeterminate state
- **RadioGroup** - Single selection from multiple options
- **Dialog** - Modal overlay with backdrop and focus management

View interactive examples in [Storybook](http://localhost:6006).

## License

MIT

````

**Why:** Structured sections help AI agents understand project context quickly. Explicit technology stack, conventions, and prior decisions provide necessary context without requiring codebase exploration. Links to Storybook for component details. Scope rename documented via script usage, not manual steps.

### Anti-Patterns to Avoid

- **Manual code blocks in stories:** Use Storybook's built-in "Show code" feature instead of duplicating code in MDX
- **Side-by-side light/dark in token page:** Follow global theme toggle for consistency
- **Custom addon for simple pages:** MDX sufficient for read-only documentation
- **storybook-dark-mode package:** Use @storybook/addon-themes (official, maintained)
- **Missing subcomponents property:** Document compound component sub-parts together
- **Placeholder Figma URLs in production:** Update URLs when Figma file created
- **Human-centric README only:** Include AI agent context (tech stack, conventions, prior decisions)
- **Screenshots in README:** Text-only component listing with Storybook links

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme switching in Storybook | Custom decorator | @storybook/addon-themes with withThemeByClassName | Official addon, handles localStorage, toolbar UI, multiple themes, class/data-attribute/provider patterns |
| Code snippets in stories | Manual MDX code blocks | Storybook's built-in "Show code" | Auto-generates code from story args, always in sync with component, supports multiple frameworks |
| Token visualization | Custom React component | MDX with Tailwind classes | Simpler, follows theme toggle automatically, no custom state management |
| Figma-to-code linking | Manual code examples | @figma/code-connect CLI | Auto-syncs with Figma, property mapping, Dev Mode integration, prevents drift |
| Compound component docs | Separate story files | subcomponents property in meta | Single story file with sub-part documentation, reduces duplication |
| Story organization | Manual sidebar config | File-based auto-titles | Storybook infers hierarchy from file path, less config to maintain |
| Dark mode testing | Manual dark class toggle | @storybook/addon-themes | Persistent theme selection, toolbar integration, global decorator |

**Key insight:** Storybook 10 provides built-in solutions for most documentation needs. The "simple custom solution" approach creates maintenance burden. Use official addons and MDX for documentation pages instead of building custom tooling.

## Common Pitfalls

### Pitfall 1: @tailwindcss/vite Integration CJS Warning

**What goes wrong:** Adding @tailwindcss/vite to viteFinal hook generates "Vite CJS Node API is deprecated" warning

**Why it happens:** Storybook's config system uses CommonJS, but @tailwindcss/vite is ESM-only package. Async dynamic import works but triggers deprecation notice.

**How to avoid:**

```typescript
// Correct approach (async import)
async viteFinal(config) {
  const { default: tailwindcss } = await import('@tailwindcss/vite')
  const { mergeConfig } = await import('vite')
  return mergeConfig(config, {
    plugins: [tailwindcss()],
  })
}
````

**Why this works:** Async import successfully loads ESM package. Warning is cosmetic - functionality unaffected.

**Alternative workaround:** Use @tailwindcss/cli instead of Vite plugin (less ideal - loses Vite integration benefits).

**Warning signs:** "deprecated" in console, but Tailwind classes render correctly in stories

### Pitfall 2: Missing subcomponents for Compound Components

**What goes wrong:** Dialog, Select, RadioGroup stories don't show sub-component props in documentation

**Why it happens:** Storybook only documents components explicitly listed in meta config

**How to avoid:**

```typescript
// Good
const meta = {
  component: Select,
  subcomponents: {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  },
} satisfies Meta<typeof Select>

// Bad - missing subcomponents
const meta = {
  component: Select,
} satisfies Meta<typeof Select>
```

**Why this works:** subcomponents property tells Storybook to generate docs for child components alongside parent.

**Warning signs:** Auto-docs page missing props tables for SelectItem, SelectTrigger, etc.

### Pitfall 3: Hardcoded Light Theme in Token Visualization

**What goes wrong:** Token page shows only light theme colors, doesn't respond to Storybook theme toggle

**Why it happens:** Tailwind classes in MDX use CSS variables, but if dark: classes used, they override theme decorator

**How to avoid:**

```mdx
<!-- Good - uses CSS variables, follows theme toggle -->

<div className="bg-background border" />

<!-- Bad - hardcoded dark variant -->

<div className="bg-background border dark:bg-slate-900" />
```

**Why this works:** Tailwind's CSS variable classes (bg-background) automatically switch based on parent .dark class applied by theme decorator.

**Warning signs:** Token swatches don't change when switching theme toggle in toolbar

### Pitfall 4: Figma Code Connect Publish Without Figma File

**What goes wrong:** Running `npx figma connect publish` fails with "component not found" errors

**Why it happens:** Placeholder URLs in .figma.tsx files don't point to real Figma components

**How to avoid:**

- Scaffold .figma.tsx files in Phase 4 with placeholder URLs
- Document in README that Figma file doesn't exist yet
- Do NOT run `npx figma connect publish` until Figma file created
- Add publish step to Phase 5 or later when Figma file available

**Why this works:** Code Connect files ready for immediate use when Figma file created. Publishing deferred until URLs valid.

**Warning signs:** "Unable to find component" errors when running publish command

### Pitfall 5: Testing All Component States But Missing Disabled State

**What goes wrong:** Stories show all variants/sizes but forget disabled prop

**Why it happens:** Focus on visual variants, overlook interactive states

**How to avoid:**

Always include these story variations:

- Default (interactive)
- Disabled (disabled: true)
- Loading (if applicable)
- Error/invalid (if applicable)

```typescript
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}
```

**Why this works:** Disabled state critical for accessibility testing and visual QA.

**Warning signs:** Component has disabled prop but no Disabled story

### Pitfall 6: Story File in Wrong Directory Breaking Auto-Title

**What goes wrong:** Story appears in unexpected location in sidebar (e.g., "stories/Button" instead of "Components/Button")

**Why it happens:** Storybook generates auto-title from file path relative to stories glob in main.ts

**How to avoid:**

```typescript
// main.ts
stories: ['../stories/**/*.stories.tsx']

// File: stories/Button.stories.tsx
// Auto-title: "Button" ❌

// File: stories/Components/Button.stories.tsx
// Auto-title: "Components/Button" ✅
```

Or use explicit title:

```typescript
const meta = {
  title: 'Components/Button', // Overrides auto-title
  component: Button,
}
```

**Why this works:** Auto-title derived from path after stories/ directory. Explicit title gives full control.

**Warning signs:** Story sidebar organization doesn't match intended hierarchy

### Pitfall 7: README Too Human-Centric for AI Agents

**What goes wrong:** README written for human developers lacks context AI agents need (tech stack, conventions, prior decisions)

**Why it happens:** Traditional README structure focuses on getting started, not project comprehension

**How to avoid:**

Include these sections explicitly:

- **Technology Stack** - exact versions and why chosen
- **Key Conventions** - coding patterns, token usage, component structure
- **Prior Decisions** - React version pinning, dark mode approach, color format
- **Architecture** - monorepo structure, package purposes

**Why this works:** AI agents need explicit context to make correct decisions. Humans can infer from exploring code; AI agents cannot.

**Warning signs:** README has install steps but AI asks basic questions about tech choices

### Pitfall 8: Storybook Not Importing UI Package Styles

**What goes wrong:** Components render without styles in Storybook

**Why it happens:** Forgot to import Tailwind CSS from packages/ui in preview.ts

**How to avoid:**

```typescript
// apps/storybook/.storybook/preview.ts
import '@phoenix/ui/src/index.css' // Import UI package styles

const preview: Preview = {
  // ... decorators
}
```

**Why this works:** Storybook needs CSS imported in preview.ts to apply styles globally across all stories.

**Warning signs:** Components render with default browser styles, no Tailwind classes applied

### Pitfall 9: Code Connect Files Not Ignored in ESLint

**What goes wrong:** ESLint errors on .figma.tsx files for unused imports or invalid syntax

**Why it happens:** Code Connect example blocks aren't executed code, just templates for Figma

**How to avoid:**

```javascript
// apps/storybook/eslint.config.mjs
export default [
  {
    ignores: ['**/*.figma.tsx'], // Ignore Code Connect files
  },
  // ... rest of config
]
```

**Or add ESLint disable comments:**

```typescript
/* eslint-disable */
import figma from '@figma/code-connect'

/* eslint-enable */
```

**Why this works:** Code Connect examples use syntax that may not be valid executed code (e.g., JSX without imports).

**Warning signs:** ESLint errors in .figma.tsx files

### Pitfall 10: Missing tags: ['autodocs'] in Story Meta

**What goes wrong:** Auto-generated docs page doesn't appear for component

**Why it happens:** Storybook requires explicit opt-in to auto-docs via tags

**How to avoid:**

```typescript
const meta = {
  component: Button,
  tags: ['autodocs'], // Enables auto-generated docs page
} satisfies Meta<typeof Button>
```

**Why this works:** tags: ['autodocs'] tells Storybook to generate Docs page from component props and stories.

**Warning signs:** Component has stories but no Docs entry in sidebar

## Code Examples

Verified patterns from official sources:

### Complete Storybook Setup

```typescript
// apps/storybook/.storybook/main.ts
// Source: https://storybook.js.org/docs/builders/vite
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      plugins: [tailwindcss()],
    })
  },
}

export default config
```

```typescript
// apps/storybook/.storybook/preview.ts
// Source: https://storybook.js.org/docs/essentials/themes
import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import '@phoenix/ui/src/index.css'

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

### Component Story with All Variants

```typescript
// apps/storybook/stories/Button.stories.tsx
// Source: https://storybook.js.org/docs/writing-stories
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@phoenix/ui'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Individual stories
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
}

// Composite stories
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">→</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}
```

### Compound Component Story (Select)

```typescript
// apps/storybook/stories/Select.stories.tsx
// Source: https://storybook.js.org/docs/writing-stories/stories-for-multiple-components
import type { Meta, StoryObj } from '@storybook/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@phoenix/ui'

const meta = {
  title: 'Components/Select',
  component: Select,
  subcomponents: {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
      </SelectContent>
    </Select>
  ),
}
```

### Figma Code Connect Configuration

```json
// figma.config.json (root)
// Source: https://developers.figma.com/docs/code-connect/quickstart-guide/
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React"
  },
  "documentUrlSubstitutions": {}
}
```

```typescript
// packages/ui/src/components/button.figma.tsx
// Source: https://developers.figma.com/docs/code-connect/react/
import figma from '@figma/code-connect'
import { Button } from './button'

/**
 * Button component Code Connect mapping.
 *
 * This file links the React Button component to its Figma counterpart.
 * Update the URL below with the actual Figma component URL when the design file is created.
 */
figma.connect(
  Button,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      variant: figma.enum('Variant', {
        Default: 'default',
        Destructive: 'destructive',
        Outline: 'outline',
        Ghost: 'ghost',
        Link: 'link',
      }),
      size: figma.enum('Size', {
        Default: 'default',
        Small: 'sm',
        Large: 'lg',
        Icon: 'icon',
      }),
      disabled: figma.boolean('Disabled'),
      children: figma.string('Text Content'),
    },
    example: ({ variant, size, disabled, children }) => (
      <Button variant={variant} size={size} disabled={disabled}>
        {children}
      </Button>
    ),
  }
)
```

**Publish command (when Figma file ready):**

```bash
# Using token directly
npx figma connect publish --token=FIGMA_ACCESS_TOKEN

# Or using environment variable
export FIGMA_ACCESS_TOKEN=your_token_here
npx figma connect publish

# Dry run to verify
npx figma connect publish --dry-run
```

**Unpublish command:**

```bash
# Unpublish specific component
npx figma connect unpublish --node=FIGMA_NODE_URL --label=React

# Unpublish all components
npx figma connect unpublish
```

## State of the Art

| Old Approach                      | Current Approach                          | When Changed           | Impact                                                                                      |
| --------------------------------- | ----------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| storybook-dark-mode addon         | @storybook/addon-themes                   | Storybook 9.0 (2025)   | Official addon with class/data-attribute/provider support; storybook-dark-mode unmaintained |
| Manual code blocks in MDX         | Storybook "Show code" feature             | Storybook 7.0+         | Auto-generated code snippets always in sync with component                                  |
| Separate story files for variants | Multiple exports in single file (CSF 3.0) | Storybook 6.5+         | Reduced duplication, better type safety, auto-completion                                    |
| Custom theme switching            | withThemeByClassName decorator            | Storybook 9.0+         | Persistent theme, toolbar integration, localStorage                                         |
| Manual Figma links                | Figma Code Connect                        | Figma 2024             | Auto-syncs code with design, Dev Mode integration                                           |
| AGENTS.md for AI context          | Emerging standard (not yet universal)     | 2025-2026              | Dedicated file for AI agent instructions, separate from README                              |
| PostCSS config for Tailwind       | @tailwindcss/vite plugin                  | Tailwind 4.0 (2024)    | Faster builds, simpler config, automatic content detection                                  |
| Webpack builder                   | Vite builder                              | Storybook 7.0+ default | 100x faster HMR, native ESM, simpler config                                                 |

**Deprecated/outdated:**

- **storybook-dark-mode v4.0.2:** Last updated 2024, incompatible with Storybook 9+
- **MDX 1.x:** Storybook 7+ uses MDX 2.x with improved performance
- **StoriesOf API:** Replaced by CSF (Component Story Format)
- **DocsPage template override:** Use doc blocks in MDX instead
- **Manual sidebar config:** Auto-titles from file path preferred
- **@storybook/addon-docs:** Now included in addon-essentials

## Open Questions

Things that couldn't be fully resolved:

1. **Storybook Build Output Location**
   - What we know: `pnpm build` in apps/storybook should generate static site
   - What's unclear: Output directory (storybook-static?), whether to commit built files or deploy from CI
   - Recommendation: Use default storybook-static/, add to .gitignore, document deployment in README if needed for later phases

2. **Token Page Implementation Depth**
   - What we know: Single scrollable page with colors, spacing, typography, radii
   - What's unclear: Level of detail (show all color shades? every spacing value?)
   - Recommendation: Show semantic tokens only (background, foreground, primary, etc.) not raw shades. Spacing: common scale values (1-64). Typography: text-sm/base/lg/xl. Radii: sm/md/lg. Keep simple.

3. **Story Naming Convention**
   - What we know: Named exports become story names (Default, AllVariants, Disabled)
   - What's unclear: Standard naming pattern for ecosystem (Default vs Primary? AllVariants vs Variants?)
   - Recommendation: Use Default for basic story, AllVariants/AllSizes for composite views, Disabled/Loading for states, WithIcon/WithLabel for variations. Claude's discretion on exact names per component.

4. **Accessibility Addon**
   - What we know: @storybook/addon-a11y available for accessibility testing
   - What's unclear: Whether to include in Phase 4 or defer to Phase 5 (Accessibility)
   - Recommendation: Include as optional addon in main.ts config. Simple to add, provides value immediately. Document in README that a11y violations shown in Addon panel.

5. **README vs AGENTS.md**
   - What we know: AGENTS.md emerging standard for AI context, README traditional for humans
   - What's unclear: Whether to create separate AGENTS.md in Phase 4 or wait for Phase 6 (AI Integration)
   - Recommendation: Single README.md in Phase 4 optimized for both AI and humans. Add AGENTS.md in Phase 6 if needed for deeper AI integration (project-specific rules, architecture details).

## Sources

### Primary (HIGH confidence)

- [Storybook 10 Release](https://storybook.js.org/blog/storybook-10/) - ESM-only architecture, CSF Factories, module mocking
- [Storybook Vite Builder](https://storybook.js.org/docs/builders/vite) - viteFinal hook configuration
- [Storybook Tailwind CSS Recipe](https://storybook.js.org/recipes/tailwindcss) - Integration steps for Vite projects
- [Storybook @storybook/addon-themes](https://storybook.js.org/docs/essentials/themes) - withThemeByClassName decorator for class-based dark mode
- [Storybook Writing Stories](https://storybook.js.org/docs/writing-stories) - CSF 3.0 format and best practices
- [Storybook Stories for Multiple Components](https://storybook.js.org/docs/writing-stories/stories-for-multiple-components) - subcomponents pattern
- [Storybook MDX](https://storybook.js.org/docs/writing-docs/mdx) - Custom documentation pages
- [Storybook Naming Components](https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy) - Auto-titles and hierarchy
- [Figma Code Connect React](https://developers.figma.com/docs/code-connect/react/) - React component connections
- [Figma Code Connect Quickstart](https://developers.figma.com/docs/code-connect/quickstart-guide/) - CLI setup and publish commands
- [@figma/code-connect npm](https://www.npmjs.com/package/@figma/code-connect) - Package installation

### Secondary (MEDIUM confidence)

- [Integrating Storybook with Tailwind CSS v4.1](https://medium.com/@ayomitunde.isijola/integrating-storybook-with-tailwind-css-v4-1-f520ae018c10) - viteFinal configuration pattern
- [Tailwind 4 Vite Plugin Storybook Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/16687) - CJS deprecation warning workaround
- [13 Steps to Build UI Library with Tailwind 4 React Storybook](https://medium.com/@cristinarestrepo/13-steps-to-build-a-scalable-ui-library-with-tailwind-css-4-react-and-storybook-f064f26fee3c) - End-to-end setup guide
- [Storybook 9 Dark Mode Setup with @storybook/addon-themes](https://medium.com/@nderdweik/storybook-9-dark-mode-complete-setup-guide-with-storybook-addon-themes-1dfd735e7a5d) - Theme decorator configuration
- [10 Storybook Best Practices](https://dev.to/rafaelrozon/10-storybook-best-practices-5a97) - Story organization and testing patterns
- [Common Pitfalls in Storybook Visual Tests](https://infinitejs.com/posts/common-pitfalls-storybook-visual-tests/) - Missing states, responsive design
- [When Design System Documentation Becomes AI-Readable](https://medium.com/design-bootcamp/when-design-system-documentation-becomes-ai-readable-14f7a3180233) - AI-optimized documentation structure
- [AGENTS.md Standard](https://agents.md/) - Machine-readable alternative to README
- [Writing Documentation for AI Best Practices](https://docs.kapa.ai/improving/writing-best-practices) - Semantic structure, explicit context
- [README Best Practices](https://medium.com/@fulton_shaun/readme-rules-structure-style-and-pro-tips-faea5eb5d252) - Structure, quick start, conventions

### Tertiary (LOW confidence)

- Exact token page detail level - No official guidance, varies by design system
- Story naming conventions - Community patterns vary (Default vs Primary, etc.)
- @storybook/addon-a11y inclusion timing - Project-specific decision

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Storybook 10.1 verified via npm releases and official docs, @storybook/addon-themes official replacement for storybook-dark-mode, Figma Code Connect from official Figma developer docs
- Architecture: HIGH - viteFinal pattern from official Storybook Vite docs, withThemeByClassName from official addon-themes docs, subcomponents pattern from official story writing guide, MDX format from official docs
- Pitfalls: MEDIUM - @tailwindcss/vite CJS warning verified in GitHub discussions, missing subcomponents documented in official docs, token page theme issue inferred from Tailwind CSS variable behavior (not explicitly documented)

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - Storybook 10 stable, Tailwind 4 mature, Figma Code Connect established)
