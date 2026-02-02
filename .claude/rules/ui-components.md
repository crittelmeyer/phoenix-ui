---
paths:
  - packages/ui/src/components/**/*.tsx
  - packages/ui/src/components/**/*.ts
  - packages/ui/src/index.ts
---

# UI Component Authoring Rules

## Component Authoring Checklist

When creating a new component, complete ALL four steps:

- [ ] Create component file: `packages/ui/src/components/[name].tsx`
- [ ] Create Figma mapping: `packages/ui/src/components/[name].figma.tsx`
- [ ] Create story: `apps/storybook/stories/[Name].stories.tsx`
- [ ] Update barrel export: `packages/ui/src/index.ts`

Run `pnpm typecheck` after all files are created.

## Simple Component Template

For standalone components with variants (Button, Input, Textarea).

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const [name]Variants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface [Name]Props
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof [name]Variants> {}

const [Name] = React.forwardRef<HTMLElement, [Name]Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn([name]Variants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
[Name].displayName = '[Name]'

export { [Name], [name]Variants }
```

**Replacements:**

- `[name]` → lowercase (button, input, textarea)
- `[Name]` → PascalCase (Button, Input, Textarea)
- `HTMLElement` → element type (HTMLButtonElement, HTMLInputElement, HTMLTextAreaElement)
- `element` → tag (button, input, textarea)
- `base-classes-here` → shared base classes

## Compound Component Template

For multi-part components built on Radix UI primitives (Tabs, Dialog, DropdownMenu).

```tsx
import * as React from 'react'
import * as [Name]Primitive from '@radix-ui/react-[name]'
import { cn } from '../lib/utils'

const [Name] = [Name]Primitive.Root

const [Name]Part = React.forwardRef<
  React.ElementRef<typeof [Name]Primitive.Part>,
  React.ComponentPropsWithoutRef<typeof [Name]Primitive.Part>
>(({ className, ...props }, ref) => (
  <[Name]Primitive.Part
    ref={ref}
    className={cn('semantic-token-classes', className)}
    {...props}
  />
))
[Name]Part.displayName = [Name]Primitive.Part.displayName

export { [Name], [Name]Part }
```

**Replacements:**

- `[name]` → lowercase (tabs, dialog, dropdown-menu)
- `[Name]` → PascalCase (Tabs, Dialog, DropdownMenu)
- `Part` → part name (List, Trigger, Content, Item, etc.)

**Real example (Tabs):**

```tsx
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'border-border inline-flex h-10 items-center justify-center border-b',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium',
      'data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:border-b-2',
      'text-muted-foreground transition-all',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-2 focus-visible:outline-none', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

## Figma Code Connect Template

Create `.figma.tsx` file for every component.

**Simple component:**

```tsx
import React from 'react'
import figma from '@figma/code-connect'
import { [Name] } from './[name]'

figma.connect(
  [Name],
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      variant: figma.enum('Variant', { Default: 'default', Destructive: 'destructive' }),
      size: figma.enum('Size', { Default: 'default', Small: 'sm', Large: 'lg' }),
      children: figma.string('Label'),
    },
    example: (props) => <[Name] {...props} />,
  },
)
```

**Compound component:**

```tsx
import React from 'react'
import figma from '@figma/code-connect'
import { [Name], [Name]Part } from './[name]'

figma.connect(
  [Name],
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: { defaultValue: figma.string('Default Tab') },
    example: ({ defaultValue }) => (
      <[Name] defaultValue={defaultValue}>
        <[Name]Part value="tab1">Tab 1</[Name]Part>
        <[Name]Part value="tab2">Tab 2</[Name]Part>
      </[Name]>
    ),
  },
)
```

**Note:** URLs are placeholders. ESLint ignores `.figma.tsx` files.

## Barrel Export Pattern

Export every component from `packages/ui/src/index.ts`.

**Simple component:**

```tsx
export { [Name], [name]Variants } from './components/[name]'
export type { [Name]Props } from './components/[name]'
```

**Compound component (all parts):**

```tsx
export { [Name], [Name]Part1, [Name]Part2 } from './components/[name]'
```

**Examples:**

```tsx
// Simple
export { Button, buttonVariants } from './components/button'
export type { ButtonProps } from './components/button'

// Compound
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs'
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './components/dialog'
```

**Never default exports** - Always named exports for tree-shaking.

## Anti-Patterns

### 1. No inline styles

```tsx
// WRONG
<button style={{ backgroundColor: '#3b82f6' }}>Click</button>

// CORRECT
<button className="bg-primary">Click</button>
```

**Why:** Inline styles bypass tokens and break dark mode. ESLint will error on `style` prop.

### 2. No arbitrary Tailwind values

```tsx
// WRONG
<div className="bg-[#ff0000] text-[18px] mt-[13px]">

// CORRECT
<div className="bg-destructive text-base mt-4">
```

**Why:** Arbitrary values bypass semantic tokens. Use token-mapped utilities. Dark mode relies on CSS variable swapping.

### 3. Always forwardRef

```tsx
// WRONG - no ref forwarding
const Button = ({ className, ...props }) => {
  return <button className={cn('bg-primary', className)} {...props} />
}

// CORRECT
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button ref={ref} className={cn('bg-primary', className)} {...props} />
    )
  },
)
Button.displayName = 'Button'
```

**Why:** Radix triggers need ref access. Without forwardRef, parent components cannot access DOM node.

### 4. Always displayName

```tsx
// WRONG - missing displayName
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)

// CORRECT
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)
Button.displayName = 'Button'
```

**Why:** React DevTools and Radix debugging require displayName. Without it, shows as `Anonymous`.

### 5. Always cn() for className

```tsx
// WRONG - manual concatenation
<button className={`bg-primary ${className}`} />

// CORRECT
<button className={cn('bg-primary hover:bg-primary/90', className)} />
```

**Why:** `cn()` handles undefined, deduplicates, and resolves Tailwind conflicts. If `className` prop has `bg-secondary`, cn() removes `bg-primary`.

### 6. Semantic tokens only

```tsx
// WRONG - color scale values
<div className="bg-blue-500 text-white border-gray-300">

// CORRECT - semantic tokens
<div className="bg-primary text-primary-foreground border-border">
```

**Why:** Semantic tokens enable automatic dark mode. Color scale classes are static.

**Semantic token reference:**

- `background` / `foreground` - Page background and text
- `primary` / `primary-foreground` - Primary actions
- `secondary` / `secondary-foreground` - Secondary actions
- `muted` / `muted-foreground` - Muted content
- `accent` / `accent-foreground` - Hover states
- `destructive` / `destructive-foreground` - Destructive actions
- `border` - Borders
- `input` - Input background
- `ring` - Focus ring

### 7. Never hardcode spacing

```tsx
// WRONG - magic numbers
<div className="p-[13px] text-[17px]">

// CORRECT - design system scale
<div className="p-4 text-base">
```

**Why:** Spacing uses 8px base unit. Typography uses rem for accessibility.

## Additional Patterns

### asChild prop (render as different element)

```tsx
import { Slot } from '@radix-ui/react-slot'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
```

**Usage:**

```tsx
<Button asChild>
  <a href="/login">Login</a>
</Button>
```

### Custom props with internal state

For components with logic (Textarea autoResize):

```tsx
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null)
    const ref = internalRef as React.MutableRefObject<HTMLTextAreaElement>

    React.useLayoutEffect(() => {
      if (autoResize && ref.current) {
        ref.current.style.height = 'auto'
        ref.current.style.height = `${ref.current.scrollHeight}px`
      }
    }, [autoResize, props.value])

    // Merge refs
    React.useImperativeHandle(forwardedRef, () => ref.current!)

    return <textarea ref={ref} className={cn('...', className)} {...props} />
  },
)
```

**Why useLayoutEffect:** Prevents flicker by running before paint.

## Verification Checklist

- [ ] Component uses `React.forwardRef`
- [ ] Component has `displayName`
- [ ] All classNames use `cn()`
- [ ] All colors use semantic tokens
- [ ] No inline `style` prop
- [ ] No arbitrary values (square brackets)
- [ ] Variants use CVA (if multiple styles)
- [ ] Props extend HTML element attributes
- [ ] Exported from `packages/ui/src/index.ts`
- [ ] `.figma.tsx` file exists
- [ ] Story exists in `apps/storybook/stories/`
- [ ] `pnpm typecheck` passes

---

**Path-scoped** to `packages/ui/src/components/**` and `packages/ui/src/index.ts`.
