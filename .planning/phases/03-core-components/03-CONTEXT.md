# Phase 3: Core Components (Foundation) - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the first 7 components (Button, Input, Textarea, Select, Checkbox, Radio, Dialog) in packages/ui using CVA + Radix + semantic tokens. Includes cn() utility and barrel exports. All components use semantic tokens exclusively. Advanced components (DropdownMenu, Tabs, Tooltip, Toast, Form) are Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Component API design

- Full shadcn/ui variant set for Button: default, destructive, outline, secondary, ghost, link
- Button sizes: sm, md, lg + icon (square icon-only size for toolbars/close buttons)
- Children-based composability: `<Button><Icon /> Save</Button>` — user controls layout
- Polymorphism via Radix Slot `asChild` prop on Button — enables links-as-buttons etc.
- Uncontrolled by default (Radix pattern) — users add controlled behavior when needed

### Visual style & feel

- shadcn/ui default aesthetic: clean, minimal, slightly rounded
- Focus rings: ring offset style (visible ring with gap between element and ring)
- Subtle transitions: 150-200ms ease on color/shadow changes for hover, press, focus
- Default density: standard shadcn spacing, comfortable touch targets

### Form behavior

- Uncontrolled by default — components work without state management out of the box
- Error state: destructive border color + error message text below the input
- Disabled state: 50% opacity on the whole component
- Textarea auto-resize: opt-in via `autoResize` prop; default is fixed height with manual resize handle

### Dialog specifics

- Close triggers: overlay click + Escape + X button (all three; overlay dismiss preventable via prop)
- Animation: fade + scale (95% to 100%) for enter/exit
- Compound parts API (shadcn style): DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
- Size variants: sm (400px), md (500px), lg (640px), full (90vw)

### Claude's Discretion

- Exact spacing values within components (using token system)
- Radix primitive configuration details
- cn() utility implementation approach
- Component file structure within packages/ui
- Select, Checkbox, Radio internal API details (follow shadcn/Radix patterns)

</decisions>

<specifics>
## Specific Ideas

- Follow shadcn/ui conventions closely — this is a starter kit, ecosystem compatibility matters
- Button icon size should be square with equal padding, useful for toolbar and close button patterns
- Dialog should feel like shadcn's Dialog — compound parts give full layout control

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-core-components_
_Context gathered: 2026-02-01_
