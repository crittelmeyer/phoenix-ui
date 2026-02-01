# Phase 4: Documentation Infrastructure - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Interactive Storybook documentation for all 7 core components (Button, Input, Textarea, Select, Checkbox, RadioGroup, Dialog), a token visualization page, scaffolded Figma Code Connect mappings, and a root README optimized for AI agent comprehension. No new components are added in this phase.

</domain>

<decisions>
## Implementation Decisions

### Story structure

- One story file per component with multiple named exports (Default, AllVariants, AllSizes, Disabled, WithIcon, etc.)
- Rely on Storybook's built-in "Show code" feature — no manual MDX code blocks
- Compound components (Select, Dialog) get sub-part stories plus fully assembled examples
- Dark mode via storybook-dark-mode addon with global toggle — not side-by-side rendering

### Tokens overview page

- Single scrollable page with sections: Colors, Spacing, Typography, Border Radii
- Color swatches show: color rectangle + semantic token name + CSS variable name (no raw OKLCH values)
- Follows the global Storybook theme toggle for light/dark — not side-by-side
- Spacing section uses visual boxes showing relative sizes at each scale value

### Figma Code Connect

- No Figma file exists yet — scaffold config and placeholder mapping files
- Mapping files co-located with components: `button.figma.tsx` next to `button.tsx`
- Placeholder files for all 7 components, ready to fill in when Figma file is created

### README & onboarding

- Target audience: AI agents primarily (Claude Code and similar tools)
- README optimized for project structure comprehension and conventions
- Scope rename documented as script usage (script exists from Phase 1), not step-by-step manual instructions
- Text-only component listing with links to Storybook — no embedded screenshots
- Single README.md at repo root only — no per-package READMEs

### Claude's Discretion

- Storybook addon selection and configuration details
- Story naming conventions and file organization
- Token page implementation approach (custom page vs MDX)
- Exact Code Connect scaffold structure
- README section ordering and formatting

</decisions>

<specifics>
## Specific Ideas

- README is primarily for AI agents to understand the project — human-readable is secondary
- This aligns with Phase 6 (AI Integration) which adds CLAUDE.md and scoped rules
- Token page should be a visual reference, not interactive playground

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 04-documentation-infrastructure_
_Context gathered: 2026-02-01_
