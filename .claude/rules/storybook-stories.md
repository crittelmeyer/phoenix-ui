---
paths:
  - apps/storybook/stories/**/*.stories.tsx
  - apps/storybook/stories/**/*.mdx
---

# Storybook Story Authoring Rules

## Story File Template

Use CSF 3.0 (Component Story Format) for all stories.

**Simple component:**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { [Name] } from '@phoenix/ui'

const meta = {
  title: 'Components/[Name]',
  component: [Name],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // or 'padded' for full-width components
  },
  argTypes: {
    // Map props to Storybook controls
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
} satisfies Meta<typeof [Name]>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}
```

**Replacements:**

- `[Name]` → Component name (Button, Input, Tabs)

**Required elements:**

- `satisfies Meta<typeof [Name]>` for type safety (NOT `satisfies Meta<any>`)
- `tags: ['autodocs']` for automatic prop table generation
- `parameters.layout` set to 'centered' or 'padded'
- `argTypes` to map props to Storybook controls

## Compound Component Stories

For components with multiple sub-parts (Tabs, Dialog, DropdownMenu).

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { [Name], [Name]Part1, [Name]Part2 } from '@phoenix/ui'

const meta = {
  title: 'Components/[Name]',
  component: [Name],
  subcomponents: { [Name]Part1, [Name]Part2 },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof [Name]>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <[Name] defaultValue="tab1">
      <[Name]Part1>Tab 1</[Name]Part1>
      <[Name]Part2>Tab 2</[Name]Part2>
    </[Name]>
  ),
}
```

**Key differences:**

- Add `subcomponents` property mapping all parts
- Use `render` function instead of `args` when composition is needed
- Import ALL parts from `@phoenix/ui`

**Real example (Tabs):**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@phoenix/ui'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
}
```

## Story Naming Conventions

Use these standard story names:

- **Default:** Base component with default props
- **AllVariants:** Shows all variant options side by side
- **WithDisabled:** Disabled state demonstration
- **[SpecificFeature]:** Feature-specific story (e.g., WithAutoResize, WithIcon)

**Example:**

```tsx
export const Default: Story = {
  args: { children: 'Button' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
}

export const WithDisabled: Story = {
  args: { children: 'Disabled', disabled: true },
}
```

## Layout Options

Set `parameters.layout` based on component type:

- **centered:** Small components (Button, Input, Badge)
- **padded:** Full-width components (Form, Card, Dialog)
- **fullscreen:** App-level components (Navbar, Layout)

```tsx
const meta = {
  // ...
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>
```

## ArgTypes for Controls

Map component props to Storybook controls for interactive editing.

**Control types:**

- `select` - Dropdown (for enums/variants)
- `boolean` - Checkbox
- `text` - Text input
- `number` - Number input
- `color` - Color picker (avoid - use semantic tokens)

**Example:**

```tsx
const meta = {
  // ...
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>
```

## Anti-Patterns

### 1. No `satisfies Meta<any>`

```tsx
// WRONG
const meta = {
  title: 'Components/Button',
  component: Button,
} satisfies Meta<any>

// CORRECT
const meta = {
  title: 'Components/Button',
  component: Button,
} satisfies Meta<typeof Button>
```

**Why:** `satisfies Meta<typeof Button>` provides type checking for argTypes and ensures IntelliSense works correctly.

### 2. No missing `tags: ['autodocs']`

```tsx
// WRONG - no autodocs tag
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>

// CORRECT
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>
```

**Why:** `tags: ['autodocs']` enables automatic prop table generation from TypeScript types.

### 3. No hardcoded hex values

```tsx
// WRONG
export const Default: Story = {
  render: () => <Button style={{ backgroundColor: '#3b82f6' }}>Click</Button>,
}

// CORRECT
export const Default: Story = {
  render: () => <Button className="bg-primary">Click</Button>,
}
```

**Why:** Use semantic token classes. Hardcoded values bypass the design system and break dark mode.

### 4. No default exports for stories

```tsx
// WRONG
export default function DefaultStory() {
  return <Button>Click</Button>
}

// CORRECT
export const Default: Story = {
  args: { children: 'Click' },
}
```

**Why:** CSF 3.0 requires named exports for stories. Only meta object uses default export.

### 5. No missing subcomponents property

```tsx
// WRONG - compound component without subcomponents
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

// CORRECT
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>
```

**Why:** `subcomponents` enables autodocs to generate prop tables for all parts of compound components.

### 6. No inline story functions

```tsx
// WRONG
export default Default = () => <Button>Click</Button>

// CORRECT
export const Default: Story = {
  render: () => <Button>Click</Button>,
}
```

**Why:** Story objects enable argTypes, args, and other Storybook features. Inline functions bypass these capabilities.

## MDX Documentation Pattern

For custom documentation pages (e.g., Tokens.mdx):

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Design System/Tokens" />

# Design Tokens

Documentation content here...
```

**Use MDX for:**

- Design system overview pages
- Token visualization
- Pattern libraries
- Usage guidelines

**Do NOT use MDX for component stories** - Use `.stories.tsx` files with CSF 3.0.

---

**Path-scoped** to `apps/storybook/stories/**/*.stories.tsx` and `apps/storybook/stories/**/*.mdx`.
