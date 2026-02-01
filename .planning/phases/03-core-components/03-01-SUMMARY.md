---
phase: 03
plan: 01
subsystem: component-foundation
tags: [react, cva, radix-ui, forwardRef, semantic-tokens, typescript]
requires: [02-02, 02-03]
provides:
  - cn() utility function
  - Button component with CVA variants
  - Input component with forwarded ref
  - Textarea component with autoResize
affects: [03-02, 03-03]
tech-stack:
  added:
    - class-variance-authority@0.7.1
    - clsx@2.1.1
    - tailwind-merge@3.4.0
    - '@radix-ui/react-slot@1.2.4'
    - '@radix-ui/react-select@1.2.4'
    - '@radix-ui/react-dialog@1.1.4'
    - '@radix-ui/react-checkbox@1.1.4'
    - '@radix-ui/react-radio-group@1.1.4'
    - '@radix-ui/react-label@1.1.4'
  patterns:
    - CVA for variant management
    - forwardRef for ref forwarding
    - Radix Slot for asChild polymorphism
    - Semantic token classes exclusively
key-files:
  created:
    - packages/ui/src/lib/utils.ts
    - packages/ui/src/components/button.tsx
    - packages/ui/src/components/input.tsx
    - packages/ui/src/components/textarea.tsx
  modified:
    - packages/ui/package.json
key-decisions:
  - id: COMP-CVA
    title: Use CVA for variant management
    rationale: Type-safe variant props with IntelliSense autocomplete, eliminates manual className concatenation
    impact: All components with variants follow this pattern
  - id: COMP-SEMANTIC-TOKENS
    title: Semantic token classes only
    rationale: Ensures dark mode compatibility and maintains design system consistency
    impact: No arbitrary values allowed in component styling
  - id: COMP-AUTORESIZE
    title: Textarea autoResize with useLayoutEffect
    rationale: Reset-then-set height pattern prevents layout thrashing, useLayoutEffect prevents visual flicker
    impact: Custom textarea implementation vs native behavior
duration: 3m 7s
completed: 2026-02-01
---

# Phase 3 Plan 1: Core Component Foundation Summary

**One-liner:** cn() utility + Button (CVA with 6 variants/4 sizes + asChild) + Input/Textarea with forwarded refs and semantic tokens

## Performance

- Duration: 3 minutes 7 seconds
- Task commits: 2
- Files created: 4
- Dependencies added: 9 packages

## What Was Accomplished

Built the component authoring foundation for the Phoenix design system:

1. **cn() utility**: Combines clsx (conditional classes) + tailwind-merge (Tailwind conflict resolution)
2. **Button component**: Most variant-heavy component proving CVA pattern works
   - 6 variants: default, destructive, outline, secondary, ghost, link
   - 4 sizes: default (h-10), sm (h-9), lg (h-11), icon (h-10 w-10)
   - asChild polymorphism via Radix Slot
   - Full TypeScript autocomplete for variant/size props
3. **Input component**: Simple forwardRef wrapper demonstrating semantic token usage
4. **Textarea component**: Enhanced with autoResize prop using useLayoutEffect height adjustment

All components use semantic token classes exclusively (bg-primary, text-foreground, border-input, etc.) ensuring dark mode compatibility.

## Task Commits

| Task | Commit  | Description                                   |
| ---- | ------- | --------------------------------------------- |
| 1    | 8b8f4dc | Install dependencies and create cn() utility  |
| 2    | df48c3f | Create Button, Input, and Textarea components |

## Files Created

1. `packages/ui/src/lib/utils.ts` - cn() utility combining clsx + tailwind-merge
2. `packages/ui/src/components/button.tsx` - Button with CVA variants + asChild
3. `packages/ui/src/components/input.tsx` - Input with forwardRef
4. `packages/ui/src/components/textarea.tsx` - Textarea with autoResize prop

## Files Modified

- `packages/ui/package.json` - Added CVA, clsx, tailwind-merge, all Radix UI packages
- `pnpm-lock.yaml` - Updated dependencies

## Decisions Made

**COMP-CVA: Use CVA for variant management**

- CVA provides type-safe variant props with IntelliSense autocomplete
- Eliminates manual className string concatenation
- Pattern: Define variants object with defaultVariants, extract VariantProps for interface
- Impact: All components with variants (Button, Select, Dialog, etc.) follow this pattern

**COMP-SEMANTIC-TOKENS: Semantic token classes only**

- All component styling uses semantic tokens (bg-primary, text-foreground, border-input)
- Zero arbitrary values (no bg-[#hex] or text-[#hex])
- Ensures automatic dark mode support via CSS variable swapping
- Verified via grep check: no style= attributes, no arbitrary color values
- Impact: Components inherit theme changes automatically

**COMP-AUTORESIZE: Textarea autoResize with useLayoutEffect**

- Custom autoResize prop grows/shrinks textarea with content
- Reset-then-set pattern: height='auto' → height=scrollHeight prevents layout thrashing
- useLayoutEffect prevents visual flicker (runs before paint)
- Ref merging pattern: internal ref for measurement + forwarded ref for parent access
- Impact: Enhanced UX for multi-line inputs, pattern reusable for other auto-sizing needs

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] TypeScript ref forwarding type safety**

- **Found during:** Task 2 (Textarea component creation)
- **Issue:** TypeScript complained that RefObject.current is read-only when merging refs
- **Fix:** Cast forwarded ref to MutableRefObject when assigning in setRef callback, destructured onInput/value props to satisfy exhaustive-deps lint rule
- **Files modified:** packages/ui/src/components/textarea.tsx
- **Commit:** df48c3f (included in Task 2 commit)
- **Rationale:** Critical for proper ref forwarding to work with both callback refs and RefObjects

**2. [Rule 2 - Missing Critical] Empty interface lint rule**

- **Found during:** Task 2 (Input component lint check)
- **Issue:** ESLint error for empty InputProps interface extending HTMLInputElement attributes
- **Fix:** Added eslint-disable-next-line comment for no-empty-object-type rule
- **Files modified:** packages/ui/src/components/input.tsx
- **Commit:** df48c3f (included in Task 2 commit)
- **Rationale:** Empty interface needed for future extensibility pattern (shadcn/ui convention)

## Issues Encountered

None. All tasks completed successfully on first attempt after fixing TypeScript/lint issues.

## Next Phase Readiness

**Ready for 03-02 (Form Components):** Yes

- Select, Checkbox, RadioGroup, and Label components can now use cn() utility
- CVA pattern proven with Button variants
- Radix UI packages already installed
- forwardRef pattern established

**Blockers:** None

**Concerns:** None

**Validation Items:**

- [ ] Verify Button variants render correctly with semantic tokens in Storybook (03-04)
- [ ] Test Textarea autoResize with controlled/uncontrolled usage (03-04)
- [ ] Confirm focus-visible ring tokens work in dark mode (03-04)
