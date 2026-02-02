# Phase 5: Core Components (Advanced) - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver complex UI components: DropdownMenu, Tabs, Tooltip, Toast (Sonner), and Form (react-hook-form + Zod). Update barrel exports and add Storybook stories + Figma Code Connect mappings for all new components. Does NOT include new page layouts, routing, or additional primitive components beyond what's scoped.

</domain>

<decisions>
## Implementation Decisions

### Toast behavior

- Position: bottom-right (standard SaaS pattern)
- Auto-dismiss: 4 seconds default
- Action support: yes — optional action label + callback on toasts; toasts with actions persist until dismissed
- Visual variants: full set — success, error, warning, info, loading — each with distinct icon and color
- Integration: Sonner library with semantic token styling

### Form validation UX

- Validation timing: on submit first, then live — errors appear after first submit attempt, then update in real-time as user corrects
- Error display: below field in red text with destructive border color on the input
- Component structure: full shadcn/ui FormField pattern — FormField + FormItem + FormLabel + FormControl + FormMessage + FormDescription
- FormDescription: included — muted helper text below input (above error) for hints like "Must be 8+ characters"
- Integration: react-hook-form + Zod schema validation

### Dropdown menu interaction

- Nested submenus: yes — SubMenu support with hover-to-open on desktop
- Item types: full Radix surface — Item, CheckboxItem, RadioItem, Separator, Label
- Compound component pattern matching existing Select/Dialog convention

### Tooltip interaction

- Trigger: hover + focus (accessible on both desktop and touch/keyboard)
- Provider pattern: yes — single TooltipProvider at app root controls shared delay timing (skipDelayDuration for fast hover between tooltips)

### Tabs design

- Visual style: underline — bottom border highlight on active tab (GitHub/Linear style)
- Orientation: horizontal only — vertical tabs out of scope for starter
- Content rendering: unmount when hidden (default Radix behavior) — only active tab content in DOM
- Disabled state: yes — individual TabsTrigger can be disabled with muted styling

### Claude's Discretion

- Sonner theme integration details and animation choices
- Toast stacking limit and overflow behavior
- Tooltip delay timing defaults
- Exact border/shadow styling for dropdown menus
- Tab indicator animation (if any)
- Keyboard shortcut hints in dropdown items

</decisions>

<specifics>
## Specific Ideas

- Toast position bottom-right matches Linear/GitHub convention the project already follows
- Form pattern should match shadcn/ui exactly for ecosystem compatibility (FormField/FormItem/FormLabel/FormControl/FormMessage/FormDescription)
- Dropdown should expose full Radix primitive surface — this is a starter kit, show what's possible

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 05-core-components-advanced_
_Context gathered: 2026-02-01_
