# Phase 3: Core Components (Foundation) - Research

**Researched:** 2026-02-01
**Domain:** React UI component library development with CVA + Radix UI + Tailwind CSS
**Confidence:** HIGH

## Summary

This phase builds foundational UI components (Button, Input, Textarea, Select, Checkbox, Radio, Dialog) using an established stack: **class-variance-authority (CVA)** for type-safe variants, **Radix UI primitives** for accessible headless components, and **tailwind-merge + clsx** for the `cn()` utility. The implementation follows **shadcn/ui conventions** closely—components are copied (not installed), use semantic tokens exclusively, and expose composable APIs via Radix's `asChild` prop.

The standard approach is well-documented with high confidence: CVA v0.7.1 provides variant APIs, Radix UI primitives (latest: Select v2.2.6, Dialog v1.1.15) handle accessibility and behavior, and tailwind-merge v3.0.0 supports Tailwind v4. The shadcn/ui pattern is the de facto industry standard for this stack in 2026.

Key technical decisions locked in context: full shadcn/ui variant set (default, destructive, outline, secondary, ghost, link), Radix `asChild` polymorphism for Button, uncontrolled-by-default form components, and compound parts API for Dialog. Claude has discretion over exact spacing values, file structure, and Radix primitive configuration details.

**Primary recommendation:** Follow shadcn/ui component structure exactly—each component in its own file, `React.forwardRef` with `ElementRef`/`ComponentPropsWithoutRef` typing, CVA `buttonVariants` exported for reuse, and `cn()` utility for all className merging. Refer to official Radix documentation for each primitive's API (not training data), as versions have evolved significantly.

## Standard Stack

The established libraries/tools for React component library development with this architecture:

### Core

| Library                     | Version | Purpose                                  | Why Standard                                                                                                          |
| --------------------------- | ------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| class-variance-authority    | 0.7.1   | Type-safe variant system for CSS classes | Industry standard for variant APIs; 7M+ weekly downloads, inspired by Stitches/Vanilla Extract, zero runtime overhead |
| @radix-ui/react-select      | 2.2.6   | Accessible Select primitive              | WAI-ARIA compliant, used by Vercel/Linear/Supabase, 130M+ monthly downloads ecosystem-wide                            |
| @radix-ui/react-dialog      | 1.1.15  | Accessible Dialog/Modal primitive        | Focus trap, overlay management, ESC/click-outside handled; de facto standard for modals                               |
| @radix-ui/react-checkbox    | Latest  | Accessible Checkbox primitive            | Tri-state support, keyboard navigation, ARIA attributes built-in                                                      |
| @radix-ui/react-radio-group | Latest  | Accessible RadioGroup primitive          | Arrow key navigation, WAI-ARIA RadioGroup pattern implementation                                                      |
| @radix-ui/react-slot        | Latest  | Component composition primitive          | Enables `asChild` polymorphism; merges props/refs correctly                                                           |
| tailwind-merge              | 3.0.0+  | Intelligent Tailwind class merging       | Tailwind v4 support (v3.0+), removes style conflicts, 5kB gzipped                                                     |
| clsx                        | 2.1.1   | Conditional className utility            | Tiny (239B), handles objects/arrays/conditionals; pairs with tailwind-merge                                           |

### Supporting

| Library                 | Version           | Purpose                       | When to Use                                                     |
| ----------------------- | ----------------- | ----------------------------- | --------------------------------------------------------------- |
| react-textarea-autosize | Latest (optional) | Auto-resize textarea behavior | If implementing auto-resize; 1.3kB gzipped, drop-in replacement |
| @radix-ui/react-label   | Latest            | Accessible label primitive    | Pairs with Input/Textarea; automatic `htmlFor` association      |

### Alternatives Considered

| Instead of     | Could Use               | Tradeoff                                                                    |
| -------------- | ----------------------- | --------------------------------------------------------------------------- |
| CVA            | tailwind-variants       | TV has runtime merging but CVA is more established in shadcn ecosystem      |
| Radix UI       | Headless UI, React ARIA | Both excellent but shadcn/ui standardizes on Radix; ecosystem compatibility |
| tailwind-merge | Manual merging          | Would break with conflicting classes (e.g., `bg-red-500 bg-blue-500`)       |

**Installation:**

```bash
# Core dependencies for all components
pnpm add class-variance-authority clsx tailwind-merge

# Radix UI primitives (install as needed per component)
pnpm add @radix-ui/react-slot          # For Button asChild
pnpm add @radix-ui/react-select        # For Select
pnpm add @radix-ui/react-dialog        # For Dialog
pnpm add @radix-ui/react-checkbox      # For Checkbox
pnpm add @radix-ui/react-radio-group   # For Radio
pnpm add @radix-ui/react-label         # Optional: for Label wrapper

# Optional: Auto-resize textarea
pnpm add react-textarea-autosize
```

**Note on React version:** React 18.3.0 is pinned (already in project) due to Radix UI + React 19 infinite loop bug. Radix UI components work perfectly with React 18; React 19 support is tracked but not yet stable.

## Architecture Patterns

### Recommended Project Structure

shadcn/ui uses a flat component structure in `components/ui/`:

```
packages/ui/src/
├── components/
│   ├── button.tsx           # Button component + buttonVariants export
│   ├── input.tsx            # Input component
│   ├── textarea.tsx         # Textarea component
│   ├── select.tsx           # Select compound component
│   ├── checkbox.tsx         # Checkbox component
│   ├── radio-group.tsx      # RadioGroup + RadioGroupItem
│   ├── dialog.tsx           # Dialog compound parts (Root, Trigger, Content, etc.)
│   └── label.tsx            # Optional: Label wrapper
├── lib/
│   └── utils.ts             # cn() utility function
└── index.ts                 # Barrel export
```

**Key principles:**

- One component per file, even for compound components (Dialog exports all parts from one file)
- `lib/utils.ts` contains only the `cn()` function initially
- Barrel export from `src/index.ts` re-exports all components
- No separate style files—Tailwind classes inline via `cn()`

### Pattern 1: cn() Utility Function

**What:** Combines clsx (conditional classes) + tailwind-merge (conflict resolution)

**When to use:** Every component className prop; essential for Tailwind class composition

**Example:**

```typescript
// Source: https://github.com/shadcn-ui/taxonomy/blob/main/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage in component:
<div className={cn("px-4 py-2 text-white", className)} />
```

**Why this pattern:**

- `clsx` handles conditionals: `cn("base", { "active": isActive })`
- `twMerge` resolves conflicts: `cn("bg-red-500", "bg-blue-500")` → `"bg-blue-500"`
- Enables prop-based className overrides without specificity wars

### Pattern 2: Button with CVA + Slot (Polymorphism)

**What:** Type-safe variants via CVA, polymorphism via Radix Slot's `asChild` prop

**When to use:** Any component with multiple visual variants and flexible element type

**Example:**

```typescript
// Source: Derived from https://ui.shadcn.com/docs/components/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { buttonVariants } // Export variants for reuse in other components
```

**Key details:**

- `buttonVariants` exported separately for use in other components
- `asChild` enables polymorphism: `<Button asChild><Link to="/">Home</Link></Button>`
- `Slot` component merges props and ref onto child when `asChild={true}`
- TypeScript: `VariantProps<typeof buttonVariants>` extracts variant types automatically

### Pattern 3: Input/Textarea with forwardRef

**What:** Simple form components with ref forwarding for react-hook-form/uncontrolled usage

**When to use:** Native HTML form elements (input, textarea) wrapped for consistent styling

**Example:**

```typescript
// Source: Derived from https://ui.shadcn.com/docs/components/input
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
```

**TypeScript typing pattern for Radix components:**

```typescript
// Standard pattern for wrapping Radix primitives
const Component = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadixPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadixPrimitive.Root
    ref={ref}
    className={cn("base classes", className)}
    {...props}
  />
))
```

**Why this pattern:**

- `React.ElementRef` extracts correct ref type from Radix primitive
- `React.ComponentPropsWithoutRef` gets all props except ref (handled by forwardRef)
- Maintains full TypeScript autocomplete and type safety
- Works with uncontrolled (default) and controlled usage

### Pattern 4: Radix Compound Components (Dialog, Select)

**What:** Compound component pattern where parent provides context, children are named parts

**When to use:** Complex components with multiple related sub-components (Dialog, Select, Dropdown, etc.)

**Example (Dialog):**

```typescript
// Source: Derived from https://www.radix-ui.com/primitives/docs/components/dialog
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

// Re-export Root, Trigger, Close as-is (no styling needed)
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

// Overlay with styling
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// Content with overlay + portal
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// Additional parts: Header, Footer, Title, Description
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// Export all parts
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
```

**Usage:**

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Key details:**

- Radix primitives provide behavior (focus trap, ESC handler, overlay dismiss)
- Styling applied via `cn()` on wrapper components
- `data-[state=open]` attributes enable Tailwind animations
- Portal renders overlay/content into `document.body` by default
- Compound parts enable full layout control while maintaining accessibility

### Pattern 5: Textarea Auto-Resize (Optional)

**What:** Dynamically adjust textarea height based on content

**When to use:** Opt-in via `autoResize` prop; default is fixed height with manual resize

**Example (custom implementation):**

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

    React.useLayoutEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current
        textarea.style.height = "auto" // Reset height
        textarea.style.height = `${textarea.scrollHeight}px` // Set to scrollHeight
      }
    }, [autoResize, props.value, textareaRef])

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          autoResize && "resize-none overflow-hidden",
          className
        )}
        ref={textareaRef}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"
```

**Alternative:** Use `react-textarea-autosize` library (1.3kB gzipped, battle-tested):

```typescript
import TextareaAutosize from "react-textarea-autosize"

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    const Comp = autoResize ? TextareaAutosize : "textarea"
    return (
      <Comp
        className={cn("flex min-h-[80px] w-full rounded-md ...", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Anti-Patterns to Avoid

- **Arbitrary Tailwind values in components:** Use semantic tokens (`bg-primary` not `bg-blue-500`). ESLint rule FNDN-07 enforces this.
- **Inline styles:** Banned in packages/ui via ESLint rule FNDN-08. All styling via Tailwind classes.
- **Manual className concatenation:** Always use `cn()` utility to avoid conflicts.
- **Controlled-by-default components:** Radix pattern is uncontrolled by default; add controlled support but don't require it.
- **Missing `displayName`:** React DevTools shows `ForwardRef` without it; always set after `forwardRef`.
- **Not spreading `...props`:** Radix components pass event handlers and ARIA attributes via props; must spread them.
- **Skipping `asChild` support on Button:** Users expect Button polymorphism for links, etc.
- **Deep component nesting:** Flat structure (Dialog exports all parts from one file) is shadcn standard.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                              | Don't Build                           | Use Instead                                    | Why                                                                                             |
| ------------------------------------ | ------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Class name merging with conditionals | Custom `classNames()` helper          | `clsx` + `tailwind-merge` via `cn()`           | Handles Tailwind conflicts (`bg-red-500 bg-blue-500` → `bg-blue-500`), 239B size, battle-tested |
| Variant APIs for components          | Manual prop-to-class mapping          | `class-variance-authority` (CVA)               | Type-safe, supports compound variants, zero runtime overhead, 7M+ weekly downloads              |
| Accessible Select/Dialog/Checkbox    | Custom implementations                | Radix UI primitives                            | WAI-ARIA compliance, focus management, keyboard navigation, 130M+ monthly downloads             |
| Component polymorphism (`asChild`)   | Custom render prop logic              | `@radix-ui/react-slot`                         | Correctly merges props and refs, handles edge cases (Fragment children, etc.)                   |
| Textarea auto-resize                 | scrollHeight calculations + useEffect | `react-textarea-autosize`                      | Handles padding, border-box, window resize, input events; 1.3kB                                 |
| Focus ring styling                   | Custom outline styles                 | Tailwind `ring-*` utilities + `focus-visible:` | Supports Windows High Contrast Mode, ring-offset for dark backgrounds                           |

**Key insight:** This stack is the result of years of ecosystem convergence. shadcn/ui popularized CVA + Radix + Tailwind in 2023-2024; by 2026 it's the de facto standard. Custom solutions miss edge cases (Radix handles 50+ accessibility details per component) and lack TypeScript integration quality.

## Common Pitfalls

### Pitfall 1: Radix Package Version Mismatches

**What goes wrong:** Different Radix UI primitives use shared internal dependencies (`@radix-ui/react-primitive`, `@radix-ui/react-use-controllable-state`, etc.). Version mismatches cause runtime errors like "hooks called in wrong order" or "multiple instances of React detected."

**Why it happens:** Installing primitives at different times or from different package managers can result in duplicate internal dependencies at conflicting versions.

**How to avoid:**

- Install all Radix packages in a single pnpm command: `pnpm add @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-slot`
- Check `pnpm ls @radix-ui/react-primitive` to verify single version
- Use pnpm's workspace protocol if consuming across packages: `"@radix-ui/react-select": "workspace:*"` won't work (external dependency); use exact versions

**Warning signs:**

- "Invalid hook call" errors in development
- Components don't open/close correctly
- TypeScript errors about incompatible types between primitives

**Source:** https://github.com/radix-ui/primitives/discussions/2794 and https://medium.com/@sibteali786/how-i-fixed-the-multiselect-not-working-inside-dialog-a-radix-ui-version-mismatch-3158104d994a

### Pitfall 2: Missing `cn()` Import Path After Reorganization

**What goes wrong:** After renaming `lib/utils.ts` to `lib/utils/cn.ts` or moving to different folder, newly added shadcn components default to `import { cn } from "@/lib/utils"` even when `component.json` specifies different path.

**Why it happens:** shadcn CLI templates have hardcoded import paths that don't always respect `component.json` configuration.

**How to avoid:**

- Keep `cn()` utility at `lib/utils.ts` (standard shadcn location)
- If moving, update all component files manually after generation
- Set `aliases.utils` in `component.json` to custom path

**Warning signs:**

- TypeScript error "Cannot find module '@/lib/utils'" after running `shadcn add`
- Components import from wrong path

**Source:** https://github.com/shadcn-ui/ui/issues/4803 and https://github.com/shadcn-ui/ui/issues/7348

### Pitfall 3: CVA with SSR/SSG Optimization

**What goes wrong:** CVA adds ~5kB to bundle even though it's runtime-logic-free. In SSR/SSG contexts, users don't need the JavaScript if components are static.

**Why it happens:** CVA is imported and executed client-side even when component props are known at build time.

**How to avoid:**

- Use CVA in SSR/SSG environments (Next.js, Astro) where static HTML is generated
- Avoid CVA in pure client-side apps where bundle size is critical and components are highly dynamic
- For static components, consider extracting final className at build time (advanced optimization)

**Warning signs:**

- Large bundle size for simple button components
- CVA logic executing on every render in client-only SPA

**Source:** https://cva.style/docs and https://fveracoechea.com/blog/cva-and-tailwind/

### Pitfall 4: forwardRef Without Prop Spreading

**What goes wrong:** Radix primitives pass event handlers (`onClick`, `onKeyDown`, etc.) and ARIA attributes (`aria-expanded`, `role`, etc.) via props. If you don't spread `{...props}`, components lose accessibility and functionality.

**Why it happens:** Developers filter props manually or forget to spread when adding custom logic.

**How to avoid:**

- Always spread `{...props}` onto underlying element: `<button {...props} />`
- If you need to intercept props, merge them: `onClick={(e) => { customLogic(); props.onClick?.(e); }}`
- Use TypeScript `ComponentPropsWithoutRef` to ensure all props are accepted

**Warning signs:**

- Keyboard navigation breaks (Tab, Enter don't work)
- Screen readers don't announce states correctly
- Radix components don't respond to user interaction

**Source:** https://www.radix-ui.com/primitives/docs/guides/composition

### Pitfall 5: Textarea Auto-Resize Without `height: auto` Reset

**What goes wrong:** When implementing auto-resize manually, setting `textarea.style.height = scrollHeight` without first resetting to `auto` causes height to accumulate incorrectly if content shrinks.

**Why it happens:** scrollHeight reflects current height + scroll overflow; if you don't reset, deleting content doesn't shrink the textarea.

**How to avoid:**

```typescript
textarea.style.height = 'auto' // Reset first
textarea.style.height = `${textarea.scrollHeight}px` // Then set
```

**Warning signs:**

- Textarea grows but never shrinks when deleting content
- Height increases on every keystroke even with same content length

**Source:** https://upmostly.com/tutorials/autosizing-textarea-react and https://dev.to/parth24072001/implementing-autosize-textarea-in-react-a-complete-guide-5pg

### Pitfall 6: Tailwind v4 + tailwind-merge v2 Incompatibility

**What goes wrong:** tailwind-merge v2.6.0 (designed for Tailwind v3) doesn't correctly merge Tailwind v4 classes, leading to conflicting styles not being resolved.

**Why it happens:** Tailwind v4 changed theme scale keys, modifier positions, and class structures. tailwind-merge v3.0.0 was released specifically to support v4.

**How to avoid:**

- Use tailwind-merge v3.0.0+ with Tailwind v4 (project already has v4.1.18)
- Verify version: `pnpm ls tailwind-merge` should show 3.x
- If using Tailwind v3 (not this project), stay on tailwind-merge v2.6.0

**Warning signs:**

- Conflicting classes both apply (e.g., `bg-red-500 bg-blue-500` → both backgrounds)
- `cn()` utility doesn't remove conflicts as expected

**Source:** https://github.com/dcastil/tailwind-merge/discussions/468 and https://github.com/dcastil/tailwind-merge/releases

### Pitfall 7: Focus Rings Breaking Accessibility on Dark Backgrounds

**What goes wrong:** Default focus rings (e.g., `ring-2 ring-blue-500`) blend into dark backgrounds, failing WCAG 2.4.7 visible focus indicator requirements.

**Why it happens:** Ring color needs contrast with both element background AND surrounding context. On dark backgrounds, blue/white rings are invisible without offset.

**How to avoid:**

- Use `ring-offset-2 ring-offset-background` to create gap between element and ring
- Tailwind v4 semantic token `ring-offset-background` automatically uses correct color per theme
- Prefer `focus-visible:ring-*` over `focus:ring-*` to only show for keyboard (not mouse clicks)

**Example:**

```typescript
className={cn(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  className
)}
```

**Warning signs:**

- Focus indicators invisible in dark mode
- Accessibility audit failures for focus visibility

**Source:** https://v3.tailwindcss.com/docs/ring-offset-width and https://www.tutorialpedia.org/blog/tailwind-css-ring/

## Code Examples

Verified patterns from official sources:

### Basic cn() Utility

```typescript
// Source: https://github.com/shadcn-ui/taxonomy/blob/main/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### CVA with Compound Variants

```typescript
// Source: https://cva.style/docs/getting-started/variants
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva(
  'font-semibold border rounded', // base
  {
    variants: {
      intent: {
        primary: 'bg-blue-500 text-white border-transparent hover:bg-blue-600',
        secondary: 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      },
      size: {
        small: 'text-sm py-1 px-2',
        medium: 'text-base py-2 px-4',
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        size: 'medium',
        class: 'uppercase', // Only when both conditions met
      },
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
    },
  },
)

// Usage:
button({ intent: 'secondary', size: 'small' })
// → "font-semibold border rounded bg-white text-gray-800 border-gray-400 hover:bg-gray-100 text-sm py-1 px-2"
```

### Radix Select Component Structure

```typescript
// Source: https://www.radix-ui.com/primitives/docs/components/select
import * as Select from "@radix-ui/react-select"

function SelectDemo() {
  return (
    <Select.Root>
      <Select.Trigger className="...">
        <Select.Value placeholder="Select a fruit..." />
        <Select.Icon />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>

            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
              <Select.Item value="banana">
                <Select.ItemText>Banana</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
            </Select.Group>

            <Select.Separator />

            <Select.Group>
              <Select.Label>Vegetables</Select.Label>
              <Select.Item value="carrot">
                <Select.ItemText>Carrot</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
            </Select.Group>

          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
```

**Key parts:**

- `Root`: Manages state (controlled via `value`/`onValueChange` or uncontrolled via `defaultValue`)
- `Trigger`: Opens dropdown, shows current value
- `Portal`: Renders content into document.body (prevents overflow clipping)
- `Content`: Popup container with positioning (`position="popper"` or `"item-aligned"`)
- `Item`: Individual option; `value` prop required
- `ItemText`: Text portion (Radix uses for typeahead search)
- `ItemIndicator`: Shown when item is selected

### Radix Dialog Focus Management

```typescript
// Source: https://www.radix-ui.com/primitives/docs/components/dialog
import * as Dialog from "@radix-ui/react-dialog"

function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg"
          onOpenAutoFocus={(e) => {
            // Prevent default focus on first element
            e.preventDefault()
            // Custom focus logic here
          }}
        >
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>

          {/* Content */}

          <Dialog.Close asChild>
            <button>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**Focus management:**

- `onOpenAutoFocus`: Fires when dialog opens (before focus moves); call `e.preventDefault()` to customize
- `onCloseAutoFocus`: Fires when dialog closes (before focus returns to trigger)
- Default: Focus moves to first focusable element in Content
- Focus trap: Tab cycles within Content; Shift+Tab at start wraps to end

### TypeScript Pattern for Radix Wrappers

```typescript
// Source: https://www.radix-ui.com/primitives/docs/guides/composition
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

**Type breakdown:**

- `React.ElementRef<typeof LabelPrimitive.Root>`: Extracts ref type (e.g., `HTMLLabelElement`)
- `React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>`: Gets all props except `ref`
- `forwardRef` merges ref into props automatically
- `...props` spreads Radix's event handlers and ARIA attributes

## State of the Art

| Old Approach                   | Current Approach               | When Changed | Impact                                                   |
| ------------------------------ | ------------------------------ | ------------ | -------------------------------------------------------- |
| CSS Modules for variants       | CVA (class-variance-authority) | 2023         | Type-safe variants, zero runtime, Tailwind-first         |
| Headless UI                    | Radix UI                       | 2022-2023    | Better composition (`asChild`), wider primitive coverage |
| classnames + manual merging    | clsx + tailwind-merge          | 2022         | Automatic Tailwind conflict resolution                   |
| Installing component libraries | Copying source (shadcn/ui)     | 2023         | Full code ownership, no version lock-in, AI-friendly     |
| React 19 adoption              | Stuck on React 18.3.0          | 2024-2025    | Radix infinite loop bug; will upgrade when fixed         |
| Tailwind v3                    | Tailwind v4                    | 2024         | CSS-first, better semantic tokens, `@theme` directive    |
| tailwind-merge v2              | tailwind-merge v3              | 2024         | Tailwind v4 compatibility, more accurate merging         |

**Deprecated/outdated:**

- **Stitches:** CVA was inspired by Stitches but Stitches development paused in 2023
- **Radix Themes:** Radix offers styled components via Radix Themes, but shadcn/ui ecosystem standardized on Radix Primitives (unstyled) + Tailwind
- **React.forwardRef in React 19:** Deprecated but still works; Radix will migrate when React 19 is stable with Radix
- **Arbitrary Tailwind values in components:** Phase 1 ESLint rules ban this; tokens only

## Open Questions

Things that couldn't be fully resolved:

1. **react-textarea-autosize vs custom implementation**
   - What we know: Library is 1.3kB, battle-tested, handles edge cases (padding, border-box, resize events)
   - What's unclear: Whether adding dependency is worth it vs 10-line custom implementation
   - Recommendation: Start with custom implementation (context says "auto-resize option" not mandatory library). Add react-textarea-autosize if edge cases arise during testing.

2. **Exact semantic token class names for all states**
   - What we know: Context defines destructive border color for errors, 50% opacity for disabled
   - What's unclear: Exact token names (e.g., `border-destructive` vs `border-error`, `text-destructive-foreground` vs `text-error`)
   - Recommendation: Follow Phase 2 token implementation exactly. Check `apps/web/src/index.css` for defined tokens. Likely: `border-destructive`, `text-destructive-foreground`, `opacity-50` for disabled.

3. **Button icon size exact dimensions**
   - What we know: Context says "icon (square icon-only size for toolbars/close buttons)", shadcn uses `icon-sm`, `icon`, `icon-lg` (size-8, size-10, size-12)
   - What's unclear: Whether to match shadcn exactly or use 8px scale (size-8 = 32px, size-10 = 40px, size-12 = 48px)
   - Recommendation: Use shadcn sizes exactly (`h-10 w-10` for icon default) since context says "follow shadcn/ui conventions closely"

4. **Select/Checkbox/Radio internal API details**
   - What we know: Context says "follow shadcn/Radix patterns", Radix provides full primitives
   - What's unclear: Exact wrapper structure (which parts need styling, which are re-exported as-is)
   - Recommendation: Refer to shadcn/ui GitHub registry for Select/Checkbox/Radio implementations during planning. Radix docs provide primitive structure; shadcn shows styling approach.

## Sources

### Primary (HIGH confidence)

- **CVA Documentation:** https://cva.style/docs - Official docs for class-variance-authority
- **Radix UI Primitives:** https://www.radix-ui.com/primitives - Official Radix primitive documentation
  - Select: https://www.radix-ui.com/primitives/docs/components/select
  - Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
  - Radio Group: https://www.radix-ui.com/primitives/docs/components/radio-group
  - Composition Guide: https://www.radix-ui.com/primitives/docs/guides/composition
  - Accessibility: https://www.radix-ui.com/primitives/docs/overview/accessibility
- **tailwind-merge GitHub:** https://github.com/dcastil/tailwind-merge - Official repository with v3.0 Tailwind v4 support
- **shadcn/ui Documentation:** https://ui.shadcn.com/docs - Official component documentation
  - Button: https://ui.shadcn.com/docs/components/button
  - Textarea: https://ui.shadcn.com/docs/components/textarea
- **shadcn/ui GitHub Registry:** https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/button.tsx - Actual source implementations
- **clsx npm package:** https://www.npmjs.com/package/clsx - Official package page

### Secondary (MEDIUM confidence)

- **shadcn/ui Anatomy:** https://manupa.dev/blog/anatomy-of-shadcn-ui - Community deep-dive into component structure
- **Radix UI Blog (Polymorphism):** https://blog.makerx.com.au/polymorphic-typesafe-react-components/ - TypeScript patterns for polymorphic components
- **Tailwind Ring Offset Guide:** https://v3.tailwindcss.com/docs/ring-offset-width - Focus ring accessibility
- **CVA + Tailwind Integration:** https://fveracoechea.com/blog/cva-and-tailwind/ - Community guide on CVA usage

### Tertiary (LOW confidence)

- **WebSearch:** Various community blog posts and Medium articles verified against official sources
- **GitHub Issues:** Radix UI and shadcn/ui issue discussions for pitfalls and edge cases

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Official documentation verified, versions confirmed via npm, 130M+ monthly downloads
- Architecture: HIGH - shadcn/ui patterns are well-documented, Radix composition guide is authoritative
- Pitfalls: MEDIUM-HIGH - Combination of official docs and GitHub issues; version mismatch pitfall verified via community reports

**Research date:** 2026-02-01
**Valid until:** 60 days (stable ecosystem; Radix and CVA are mature, Tailwind v4 stable since late 2024)

**Key verification notes:**

- All Radix UI primitive APIs verified against official documentation (not training data)
- shadcn/ui component patterns verified via official docs and GitHub registry source
- Version numbers confirmed via WebSearch of npm registry (npm.com blocked WebFetch)
- CVA, tailwind-merge, clsx APIs verified via official documentation
- TypeScript patterns verified via Radix composition guide and community best practices
