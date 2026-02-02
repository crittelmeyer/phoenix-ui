# Phase 5: Core Components (Advanced) - Research

**Researched:** 2026-02-01
**Domain:** Advanced React UI Components (Radix Primitives, Form Management, Toast Notifications)
**Confidence:** HIGH

## Summary

Phase 5 implements the final tier of UI components that enable complex interactions: DropdownMenu, Tabs, Tooltip (Radix UI primitives), Toast (Sonner library), and Form (react-hook-form + Zod). The research confirms all selected libraries are industry-standard choices that integrate seamlessly with the existing stack (React 18.3, Tailwind CSS 4, shadcn/ui patterns).

The component pattern established in Phase 3 applies perfectly to Phase 5: compound components using Radix primitives, forwardRef for proper ref handling, semantic token classes via Tailwind CSS 4's @theme directive, and CVA for variant management where needed. All components follow the proven shadcn/ui architecture, ensuring ecosystem compatibility and familiar developer experience.

Key findings: Radix UI primitives are fully compatible with React 18.3, Sonner is the modern standard for toast notifications (2-3KB, built for React 18+, shadcn/ui's official choice), react-hook-form + Zod is the type-safe form validation standard, and the shadcn/ui Form pattern (FormField/FormItem/FormLabel/FormControl/FormMessage/FormDescription) provides excellent DX while maintaining accessibility.

**Primary recommendation:** Follow existing component patterns from Phase 3 (Dialog, Select) for compound components. Use shadcn/ui's exact Form pattern for react-hook-form integration. Style Sonner toasts with semantic tokens to match the design system. Maintain strict semantic token usage (no hardcoded colors) across all new components.

## Standard Stack

The established libraries/tools for advanced React UI components:

### Core

| Library                       | Version | Purpose                            | Why Standard                                                                                          |
| ----------------------------- | ------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| @radix-ui/react-dropdown-menu | ^1.1.x  | Accessible dropdown menu primitive | WAI-ARIA compliant, keyboard nav, nested submenus, checkable items. Used by Vercel, Linear, Supabase. |
| @radix-ui/react-tabs          | ^1.1.x  | Accessible tabs primitive          | Full keyboard support, horizontal/vertical, controlled/uncontrolled. Radix standard.                  |
| @radix-ui/react-tooltip       | ^1.1.x  | Accessible tooltip primitive       | Includes TooltipProvider for shared delay, hover+focus triggers, portal rendering.                    |
| sonner                        | ^1.x    | Modern toast notification library  | 2-3KB, TypeScript-first, React 18+ optimized, shadcn/ui official choice. Built for modern React.      |
| react-hook-form               | ^7.x    | Performant form state management   | Minimal re-renders, uncontrolled components, DevTools support. Industry standard for React forms.     |
| zod                           | ^3.x    | TypeScript-first schema validation | Runtime type checking, type inference, custom error messages. Pairs perfectly with react-hook-form.   |
| @hookform/resolvers           | ^3.x    | Validation resolver bridge         | Connects Zod schemas to react-hook-form via zodResolver. Official integration package.                |

### Supporting

| Library                  | Version                    | Purpose                                 | When to Use                                                                |
| ------------------------ | -------------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| @radix-ui/react-slot     | ^1.2.x                     | Composition utility (already installed) | asChild prop pattern for merging props into custom elements                |
| class-variance-authority | ^0.7.x (already installed) | Variant management                      | When components need multiple variants (size, variant, state combinations) |
| tailwind-merge           | ^3.4.x (already installed) | Tailwind class conflict resolution      | cn() utility for merging className props                                   |

### Alternatives Considered

| Instead of      | Could Use       | Tradeoff                                                                                                                                            |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Radix UI        | Headless UI     | Headless UI is Tailwind Labs' alternative but less feature-complete for menus (no RadioItem, limited nesting). Radix has broader primitive surface. |
| Sonner          | react-hot-toast | react-hot-toast is popular but heavier (5KB+). Sonner is specifically optimized for shadcn/ui integration and modern React.                         |
| react-hook-form | Formik          | Formik uses controlled components (more re-renders), heavier bundle, slower development. RHF is performance-focused with better TypeScript support. |
| Zod             | Yup             | Yup is JavaScript-first, weaker TypeScript inference. Zod is TypeScript-native with better type inference and error handling.                       |

**Installation:**

```bash
# New packages for Phase 5
pnpm add @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-tooltip sonner react-hook-form zod @hookform/resolvers

# Already installed from Phase 3
# @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

**Source:**

- [Radix UI Primitives Documentation](https://www.radix-ui.com/primitives)
- [Sonner GitHub Repository](https://github.com/emilkowalski/sonner)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [shadcn/ui Component Patterns](https://ui.shadcn.com/docs/components/)

## Architecture Patterns

### Recommended Project Structure

```
packages/ui/src/components/
├── dropdown-menu.tsx         # Compound component (14+ parts)
├── dropdown-menu.figma.tsx   # Figma Code Connect mapping
├── tabs.tsx                  # Compound component (4 parts)
├── tabs.figma.tsx           # Figma Code Connect mapping
├── tooltip.tsx              # Compound component (5 parts)
├── tooltip.figma.tsx        # Figma Code Connect mapping
├── toast.tsx                # Sonner wrapper (Toaster + styled exports)
├── toast.figma.tsx          # Figma Code Connect mapping
└── form.tsx                 # RHF context components (6 parts)
    form.figma.tsx           # Figma Code Connect mapping

packages/ui/src/index.ts     # Barrel export (add all new components)

apps/storybook/stories/
├── DropdownMenu.stories.tsx
├── Tabs.stories.tsx
├── Tooltip.stories.tsx
├── Toast.stories.tsx
└── Form.stories.tsx
```

### Pattern 1: Compound Radix Primitive Component

**What:** Wrap Radix primitive parts with semantic token styling, maintain displayName, use forwardRef for ref forwarding.

**When to use:** DropdownMenu, Tabs, Tooltip (all Radix primitives with multiple parts).

**Example (DropdownMenu):**

```typescript
// Source: Existing Dialog pattern in packages/ui/src/components/dialog.tsx
import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '../lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'bg-background text-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // ... export all 14+ parts
}
```

**Key points:**

- Use semantic tokens only: `bg-background`, `text-foreground`, `border`, `focus:bg-accent`
- Inline SVG icons (check marks, chevrons) instead of icon library
- Portal rendering for proper z-index stacking
- data-[state] attributes for animations via Tailwind
- Preserve all Radix accessibility features

### Pattern 2: TooltipProvider at App Root

**What:** Single TooltipProvider wrapping the entire app provides shared delay configuration (skipDelayDuration) for fast hover between tooltips.

**When to use:** Always wrap app root with TooltipProvider when using Tooltip components.

**Example:**

```typescript
// Source: Radix UI Tooltip Documentation
// apps/web/src/main.tsx or layout
import { TooltipProvider } from '@phoenix/ui'

function App() {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      {/* Rest of app */}
    </TooltipProvider>
  )
}
```

**Key configuration:**

- `delayDuration`: Initial hover delay (default 700ms, recommend 200ms for snappier UX)
- `skipDelayDuration`: Delay after first tooltip shown (default 300ms, recommend 100ms)

### Pattern 3: Sonner Toast with Semantic Token Styling

**What:** Import Toaster component from Sonner, style with CSS variables mapped to semantic tokens, use toast() functions throughout app.

**When to use:** Toast notifications for user feedback (success, error, info, warning, loading states).

**Example:**

```typescript
// Source: shadcn/ui Sonner documentation
// packages/ui/src/components/toast.tsx
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

// Usage in app
import { toast } from 'sonner'

toast.success('Profile updated')
toast.error('Failed to save', {
  action: { label: 'Retry', onClick: () => retry() }
})
toast.promise(fetchData(), {
  loading: 'Loading...',
  success: (data) => `Loaded ${data.count} items`,
  error: 'Failed to load',
})
```

### Pattern 4: Form with react-hook-form + Zod

**What:** shadcn/ui Form pattern using FormField render prop with FormItem/FormLabel/FormControl/FormMessage/FormDescription structure.

**When to use:** All forms requiring validation, especially multi-field forms with complex validation rules.

**Example:**

```typescript
// Source: shadcn/ui Form documentation
// packages/ui/src/components/form.tsx
import { useFormContext } from 'react-hook-form'

const FormField = <TFieldValues extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => render({ field, fieldState })}
    />
  )
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    )
  },
)

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error } = useFormField()
  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      {...props}
    />
  )
})

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error } = useFormField()
    const body = error ? String(error?.message) : children
    if (!body) return null
    return (
      <p
        ref={ref}
        className={cn('text-destructive text-sm font-medium', className)}
        {...props}
      >
        {body}
      </p>
    )
  },
)

// Usage with Zod
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '' },
    mode: 'onSubmit', // Then switches to onChange after first submit
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Your public display name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

**Key validation timing:** Default mode is `onSubmit` (validates on first submit), then automatically switches to live validation (`onChange`) after first submit attempt. This provides optimal UX: no validation noise before user attempts submit, immediate feedback during corrections.

### Pattern 5: Tabs with Underline Style

**What:** Radix Tabs styled with bottom border active indicator (GitHub/Linear convention).

**When to use:** Content that logically groups into sections with single active view.

**Example:**

```typescript
// Source: Radix UI Tabs + shadcn/ui patterns
import * as TabsPrimitive from '@radix-ui/react-tabs'

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'border-b border-border inline-flex h-10 items-center justify-center',
      className,
    )}
    {...props}
  />
))

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-t-sm px-3 py-1.5 text-sm font-medium',
      'text-muted-foreground transition-all',
      'data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary',
      'disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
```

### Pattern 6: Figma Code Connect Mapping

**What:** Placeholder .figma.tsx files mapping component props to Figma design properties.

**When to use:** Every component needs a Code Connect file for design-dev integration (even if Figma file URL is placeholder).

**Example:**

```typescript
// Source: Existing button.figma.tsx pattern
import React from 'react'
import figma from '@figma/code-connect'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

figma.connect(
  Tabs,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      defaultValue: figma.string('Default Tab'),
    },
    example: (props) => (
      <Tabs defaultValue={props.defaultValue}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    ),
  },
)
```

**Pattern established:** Placeholder URL until Figma file exists, map component variants/props using figma.enum/figma.boolean/figma.string helpers.

### Anti-Patterns to Avoid

- **Hardcoded colors in components:** Always use semantic tokens (`bg-background`, `text-foreground`), never `bg-gray-100` or hex colors. This breaks theming.
- **Icon libraries for simple icons:** Use inline SVG (see Select/Dialog examples). Adds bundle size for no benefit with only a few icons.
- **Custom z-index values:** Let Radix Portal handle stacking automatically. Manual z-index causes conflicts between overlapping portals (Dialog, DropdownMenu, Tooltip).
- **Controlled forms without defaultValues:** react-hook-form requires defaultValues for all fields or form state breaks (dirty tracking, reset, etc).
- **onChange validation mode from start:** Use default `onSubmit` mode. Showing errors before user attempts submit is poor UX.
- **Mixing CVA with Radix variants:** Only use CVA when component needs custom variant logic (like Button). Radix primitives handle their own state via data attributes.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                           | Don't Build                 | Use Instead                     | Why                                                                                                                                              |
| --------------------------------- | --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dropdown menu keyboard navigation | Custom onKeyDown logic      | Radix DropdownMenu              | Arrow keys, Home/End, typeahead, focus management, nested submenus all built-in. ~500 lines of accessibility code.                               |
| Toast notification queue          | Custom notification manager | Sonner                          | Auto-stacking, queue management, pause-on-hover, promise support, action buttons. Already handles edge cases (max toasts, overflow, animations). |
| Form validation timing            | Custom useEffect + state    | react-hook-form modes           | Handles validation timing (onSubmit → onChange), async validation, field dependencies, error focus management. ~1000 lines to replicate.         |
| Tooltip delay logic               | setTimeout + state          | Radix Tooltip + TooltipProvider | Shared delay between tooltips, hover intent detection, focus handling, screen reader support. Deceptively complex (~300 lines).                  |
| Portal z-index stacking           | Manual z-index CSS          | Radix Portal                    | Automatically manages stacking context across Dialog/Dropdown/Tooltip. Manual z-index causes conflicts.                                          |
| Type-safe form validation         | Manual validation functions | Zod + zodResolver               | Runtime type checking, custom error messages, schema composition, type inference. ~500 lines of validation logic per form without it.            |
| Tabs keyboard navigation          | Custom tab focus logic      | Radix Tabs                      | Arrow key navigation, Home/End keys, automatic aria attributes, disabled state management built-in.                                              |
| Checkbox/Radio in dropdown        | Custom state management     | Radix CheckboxItem/RadioItem    | Controlled/uncontrolled state, visual indicators, keyboard selection, proper ARIA roles. ~200 lines per item type.                               |

**Key insight:** Radix UI primitives handle the "invisible 80%" — keyboard navigation, focus management, ARIA attributes, screen reader announcements, portal rendering, animation state data attributes. Building these manually takes weeks and results in accessibility bugs. Sonner handles toast queue edge cases (rapid firing, max stack, pause-on-hover, promise state transitions). react-hook-form handles form state complexity (dirty tracking, validation timing, touched state, error focus, reset logic).

## Common Pitfalls

### Pitfall 1: Missing Default Values in react-hook-form

**What goes wrong:** Form state breaks — dirty tracking fails, reset doesn't work, field values undefined on submit.

**Why it happens:** react-hook-form uses defaultValues to determine initial state. Without them, uncontrolled inputs aren't registered properly.

**How to avoid:**

```typescript
// BAD
const form = useForm({ resolver: zodResolver(schema) })

// GOOD
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { username: '', email: '', role: 'user' }, // All fields
})
```

**Warning signs:** `form.formState.isDirty` always false, `form.reset()` does nothing, undefined values in `handleSubmit`.

**Source:** [React Hook Form Common Mistakes](https://alexhooley.com/blog/react-hook-form-common-mistakes) | [Daily.dev - React Hook Form Errors Not Working](https://daily.dev/blog/react-hook-form-errors-not-working-common-fixes)

### Pitfall 2: Portal Z-Index Conflicts (Dialog + DropdownMenu + Tooltip)

**What goes wrong:** DropdownMenu appears behind Dialog overlay, Tooltip hidden behind DropdownMenu content.

**Why it happens:** Radix no longer sets automatic z-index on portals (changed in v1.1+). Multiple portals stack in DOM order unless explicitly controlled.

**How to avoid:**

```typescript
// Ensure proper CSS variable order in global styles
.dropdown-menu-content { z-index: 50; }
.dialog-overlay { z-index: 50; }
.dialog-content { z-index: 50; }
.tooltip-content { z-index: 60; } // Tooltips highest

// Or use Portal container prop
<DropdownMenuContent container={document.getElementById('portal-root')} />
```

**Warning signs:** Dropdown menu cut off by dialog overlay, tooltip not visible when triggered inside dropdown.

**Source:** [Radix UI Issue #1317 - Z-index issues](https://github.com/radix-ui/primitives/issues/1317) | [Radix UI Portal Documentation](https://www.radix-ui.com/primitives/docs/utilities/portal)

### Pitfall 3: TooltipProvider Missing or Incorrect Placement

**What goes wrong:** Tooltips have long delays between hover interactions, or multiple TooltipProvider instances cause inconsistent behavior.

**Why it happens:** TooltipProvider shares delay state via React Context. Must be a single instance wrapping the entire app.

**How to avoid:**

```typescript
// BAD - TooltipProvider per tooltip
function MyComponent() {
  return (
    <TooltipProvider>
      <Tooltip>...</Tooltip>
    </TooltipProvider>
  )
}

// GOOD - Single provider at app root
function App() {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <MyComponent />
    </TooltipProvider>
  )
}
```

**Warning signs:** Long delay between hovering tooltips, inconsistent tooltip timing, tooltips feel sluggish.

**Source:** [Radix UI Tooltip Documentation](https://www.radix-ui.com/primitives/docs/components/tooltip)

### Pitfall 4: Form Validation Mode Set to onChange Too Early

**What goes wrong:** Validation errors show immediately on first keystroke, poor UX (user sees errors before they finish typing).

**Why it happens:** Developer sets `mode: 'onChange'` thinking it provides better feedback, but it fires on every keystroke before user finishes field.

**How to avoid:**

```typescript
// BAD - Errors on every keystroke
const form = useForm({
  mode: 'onChange',
  resolver: zodResolver(schema),
})

// GOOD - Validate on submit, then switch to live
const form = useForm({
  mode: 'onSubmit', // Default mode
  resolver: zodResolver(schema),
})
// After first submit attempt, RHF automatically switches to live validation
```

**Best practice:** Use default `onSubmit` mode. react-hook-form automatically switches to live validation after first submit attempt — best of both worlds.

**Warning signs:** Users report form feels "naggy", errors appear before they finish typing field.

**Source:** [React Hook Form useForm Documentation](https://react-hook-form.com/docs/useform) | [React Hook Form with Zod: Complete Guide](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)

### Pitfall 5: Sonner Toasts Not Styled with Semantic Tokens

**What goes wrong:** Toasts don't match design system theme, appear wrong in dark mode, break visual consistency.

**Why it happens:** Sonner uses default styling. Must explicitly map classNames to semantic token classes.

**How to avoid:**

```typescript
// BAD - Default Sonner styling
<Toaster />

// GOOD - Semantic token styling
<Toaster
  toastOptions={{
    classNames: {
      toast: 'group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border',
      description: 'group-[.toast]:text-muted-foreground',
      actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
      cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
    },
  }}
/>
```

**Warning signs:** Toast colors don't match button variants, toasts look wrong in dark mode, toasts use white background in dark theme.

**Source:** [shadcn/ui Sonner Component](https://ui.shadcn.com/docs/components/sonner)

### Pitfall 6: Inline SVG Icons Missing Accessibility

**What goes wrong:** Screen readers announce icons as images, icon-only buttons have no accessible name.

**Why it happens:** SVG without aria-hidden or accessible label confuses screen readers.

**How to avoid:**

```typescript
// BAD - Icon announced by screen reader
<svg>...</svg>

// GOOD - Icon hidden from screen readers
<svg aria-hidden="true">...</svg>

// GOOD - Icon-only button with label
<button>
  <svg aria-hidden="true">...</svg>
  <span className="sr-only">Close</span>
</button>
```

**Pattern established:** All decorative icons get `aria-hidden="true"`, icon-only interactive elements get `<span className="sr-only">` label.

**Warning signs:** Screen reader testing announces "image" for decorative icons, icon-only buttons have no name.

### Pitfall 7: DropdownMenu SubMenu Opening on Click Instead of Hover

**What goes wrong:** Desktop users must click to open nested submenus, feels wrong compared to native OS menus.

**Why it happens:** Not using SubTrigger correctly or missing hover configuration.

**How to avoid:**

```typescript
// Desktop hover-to-open (default Radix behavior)
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Sub item</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>

// Radix handles hover on desktop, click on touch automatically
```

**Key point:** Radix DropdownMenu SubMenu opens on hover by default on desktop (pointer: fine), touch requires click. Don't override this behavior.

**Warning signs:** Users report submenus feel "sticky" or require extra clicks.

**Source:** [Radix UI DropdownMenu Documentation](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)

### Pitfall 8: Tabs Content Not Unmounting When Hidden

**What goes wrong:** Hidden tab content remains in DOM, causes performance issues with forms/heavy components, breaks expected cleanup behavior.

**Why it happens:** Using CSS `display: none` instead of conditional rendering.

**How to avoid:**

```typescript
// Radix Tabs unmounts by default (correct behavior)
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Heavy component unmounted when tab2 active</TabsContent>
  <TabsContent value="tab2">Heavy component unmounted when tab1 active</TabsContent>
</Tabs>

// Don't override with forceMount unless truly needed
<TabsContent value="tab1" forceMount>...</TabsContent> // Keeps in DOM always
```

**Best practice:** Use default behavior (unmount hidden content). Only use `forceMount` if animation timing requires content in DOM while hidden.

**Warning signs:** Performance issues with many tabs, form state persists when switching tabs (unexpected), cleanup effects not running.

**Source:** [Radix UI Tabs Documentation](https://www.radix-ui.com/primitives/docs/components/tabs)

## Code Examples

Verified patterns from official sources and existing codebase:

### DropdownMenu with CheckboxItem and SubMenu

```typescript
// Source: Radix UI DropdownMenu Documentation + shadcn/ui pattern
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@phoenix/ui'

function SettingsMenu() {
  const [notifications, setNotifications] = React.useState(true)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={notifications}
          onCheckedChange={setNotifications}
        >
          Enable notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Light</DropdownMenuItem>
            <DropdownMenuItem>Dark</DropdownMenuItem>
            <DropdownMenuItem>System</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Toast with All Variants

```typescript
// Source: Sonner API Documentation
import { toast } from 'sonner'

// Basic toast
toast('Event created')

// Success variant
toast.success('Profile updated successfully')

// Error variant with action
toast.error('Failed to save changes', {
  action: {
    label: 'Retry',
    onClick: () => retrySave(),
  },
})

// Loading variant
const loadingToast = toast.loading('Uploading file...')
// Later dismiss or update
toast.success('File uploaded', { id: loadingToast })

// Promise variant (auto-updates)
toast.promise(fetchUserData(), {
  loading: 'Loading user...',
  success: (data) => `Welcome back, ${data.name}!`,
  error: (err) => `Failed to load: ${err.message}`,
})

// With custom duration and position
toast('Custom toast', {
  duration: 5000,
  position: 'bottom-right',
  description: 'Additional details here',
})
```

### Form with Complex Validation

```typescript
// Source: shadcn/ui Form + React Hook Form documentation
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@phoenix/ui'

const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160, 'Bio must not exceed 160 characters').optional(),
  notifications: z.boolean().default(true),
})

type ProfileFormValues = z.infer<typeof profileSchema>

function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      bio: '',
      notifications: true,
    },
    mode: 'onSubmit', // Validate on submit first, then live validation
  })

  function onSubmit(data: ProfileFormValues) {
    console.log(data) // Type-safe validated data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                Your public display name. Must be unique.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormDescription>
                Optional. Maximum 160 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  )
}
```

### Tooltip with Keyboard Access

```typescript
// Source: Radix UI Tooltip Documentation
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@phoenix/ui'

// At app root
function App() {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <MyApp />
    </TooltipProvider>
  )
}

// In components
function IconButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          <svg aria-hidden="true">...</svg>
          <span className="sr-only">Delete item</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Delete item</p>
      </TooltipContent>
    </Tooltip>
  )
}
```

### Tabs with Underline Style

```typescript
// Source: Radix UI Tabs + shadcn/ui pattern
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@phoenix/ui'

function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications" disabled>
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="space-y-4">
        <h3 className="text-lg font-semibold">General Settings</h3>
        {/* Content unmounts when switching tabs */}
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <h3 className="text-lg font-semibold">Security Settings</h3>
      </TabsContent>
    </Tabs>
  )
}
```

## State of the Art

| Old Approach               | Current Approach           | When Changed             | Impact                                                                                                                                     |
| -------------------------- | -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Formik for React forms     | react-hook-form            | 2020-2021                | Better performance (uncontrolled), smaller bundle, better TypeScript support. Formik still works but RHF is modern standard.               |
| Yup for validation         | Zod                        | 2022-2023                | TypeScript-first design, better type inference, runtime + compile-time safety. Zod is 2026 standard for TS projects.                       |
| react-hot-toast            | Sonner                     | 2023-2024                | Lighter (2-3KB vs 5KB+), better React 18 support, shadcn/ui official choice. react-hot-toast still popular but Sonner is momentum winner.  |
| JavaScript Tailwind config | CSS-first @theme           | Tailwind 4.0 (late 2024) | Single source of truth, CSS variables by default, semantic token pattern. Major shift from v3 JavaScript config.                           |
| Headless UI                | Radix UI                   | Ongoing                  | Both valid, Radix has richer primitive surface (RadioItem, CheckboxItem in menus, more comprehensive APIs). Radix chosen for this project. |
| Manual z-index on portals  | Radix Portal auto-stacking | Radix v1.1+              | Radix removed automatic z-index, now developer-controlled. More flexible but requires explicit z-index CSS.                                |

**Deprecated/outdated:**

- **Formik:** Still maintained but heavier, controlled form approach causes more re-renders. react-hook-form is performance standard.
- **Yup:** JavaScript-first, weaker TypeScript inference than Zod. Use Zod for TS projects.
- **Tailwind v3 JavaScript config:** Tailwind 4 uses CSS-first @theme directive. Old `tailwind.config.js` still works but not recommended for new projects.
- **react-hot-toast:** Not deprecated but Sonner is lighter and better integrated with modern React + shadcn/ui ecosystem.

## Open Questions

Things that couldn't be fully resolved:

1. **Sonner toast stacking limit**
   - What we know: Sonner has a `visibleToasts` prop to control max displayed toasts
   - What's unclear: Recommended default for SaaS apps (3? 5? unlimited?), performance impact of large stacks
   - Recommendation: Use default (unlimited) initially, add `visibleToasts={5}` if users report toast overload

2. **Form async validation debounce timing**
   - What we know: Zod `refine()` supports async validation (e.g., username uniqueness checks)
   - What's unclear: Optimal debounce delay for server validation (300ms? 500ms? 1000ms?)
   - Recommendation: Start with 500ms debounce, adjust based on API latency and UX feedback

3. **Tooltip delay timing for touch devices**
   - What we know: Radix Tooltip supports hover (desktop) and focus (keyboard/touch)
   - What's unclear: Whether touch users need longer/shorter delay than desktop hover
   - Recommendation: Use same timing (200ms initial, 100ms skip), Radix handles touch vs hover automatically

4. **DropdownMenu keyboard shortcut display**
   - What we know: shadcn/ui has DropdownMenuShortcut component for displaying shortcuts
   - What's unclear: Whether Phase 5 should implement keyboard shortcuts for menu items or defer to Phase 6+
   - Recommendation: Implement DropdownMenuShortcut component (just styled text), but leave actual shortcut handling to app layer (not library concern)

5. **Tab indicator animation**
   - What we know: Tabs should use underline style (bottom border on active tab)
   - What's unclear: Should underline animate/slide between tabs or appear instantly?
   - Recommendation: Start with instant (simpler, no animation complexity), can add Framer Motion slide animation in Phase 6+ if desired

## Sources

### Primary (HIGH confidence)

- [Radix UI DropdownMenu Documentation](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) - Component API, keyboard shortcuts, accessibility features
- [Radix UI Tabs Documentation](https://www.radix-ui.com/primitives/docs/components/tabs) - Component anatomy, data attributes, keyboard navigation
- [Radix UI Tooltip Documentation](https://www.radix-ui.com/primitives/docs/components/tooltip) - TooltipProvider pattern, delay configuration, keyboard support
- [Sonner Official Documentation](https://sonner.emilkowal.ski/) - Toast API, variants, promise support, action buttons
- [shadcn/ui Sonner Component](https://ui.shadcn.com/docs/components/sonner) - Semantic token styling integration
- [shadcn/ui Form Component](https://ui.shadcn.com/docs/components/form) - FormField pattern, Zod integration
- [React Hook Form Documentation](https://react-hook-form.com/) - useForm API, validation modes, TypeScript support
- [Zod Documentation](https://zod.dev/) - Schema definition, type inference, custom error messages
- [Tailwind CSS v4.0 Documentation](https://tailwindcss.com/blog/tailwindcss-v4) - @theme directive, CSS-first configuration
- Existing codebase components (/packages/ui/src/components/\*.tsx) - Established patterns for compound components, semantic tokens, forwardRef usage

### Secondary (MEDIUM confidence)

- [React Hook Form with Zod: Complete Guide for 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1) - Integration patterns, best practices
- [Shadcn/ui React Series — Part 19: Sonner](https://medium.com/@rivainasution/shadcn-ui-react-series-part-19-sonner-modern-toast-notifications-done-right-903757c5681f) - Modern toast patterns
- [Form Validation with React Hook Form](https://claritydev.net/blog/form-validation-react-hook-form) - Validation timing strategies
- [CVA Documentation](https://cva.style/docs) - Compound variants, best practices
- [Figma Code Connect Documentation](https://developers.figma.com/docs/code-connect/) - React component mapping

### Tertiary (LOW confidence)

- [Top 9 React notification libraries in 2026](https://knock.app/blog/the-top-notification-libraries-for-react) - Ecosystem comparison (useful for alternatives context but not authoritative)
- [Radix UI GitHub Issue #1317](https://github.com/radix-ui/primitives/issues/1317) - z-index issues discussion (community-reported, not official docs)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries verified via official documentation and are industry standards (Radix, Sonner, RHF, Zod)
- Architecture: HIGH - Patterns extracted from official shadcn/ui components and existing Phoenix codebase (Dialog, Select, Button)
- Pitfalls: MEDIUM-HIGH - Common issues verified via official documentation and multiple credible sources, some based on community reports
- Tailwind CSS 4 integration: HIGH - Official Tailwind v4 documentation confirms @theme directive and semantic token patterns
- React 18.3 compatibility: HIGH - All libraries explicitly support React 18, Radix peer deps target 18.3.1

**Research date:** 2026-02-01
**Valid until:** ~60 days (stable ecosystem — Radix, RHF, Zod are mature libraries with infrequent breaking changes)

**Key validation points:**

- Radix UI primitives versions confirmed compatible with React 18.3.0 (existing package.json shows @radix-ui packages installed)
- Tailwind CSS 4.0.13 confirmed installed with @theme directive support (apps/web/src/index.css shows @theme usage)
- class-variance-authority 0.7.1 already installed and used in Button component
- Existing component patterns (Dialog, Select) provide proven templates for compound Radix components
- shadcn/ui Form pattern matches expected FormField/FormItem structure for Phase 5 requirements
