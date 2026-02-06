# Phase 8: Figma Library Setup - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure a Figma library file with Phoenix tokens applied via Tokens Studio. Community kit duplicated and customized, Figma Variables matching Phoenix token structure, light/dark mode configured, Tokens Studio connected to GitHub. Changes exported from Tokens Studio import successfully into Style Dictionary build.

</domain>

<decisions>
## Implementation Decisions

### Community kit choice

- Start from Pietro Schirano's shadcn/ui kit (most-used community option)
- Tokens only customization — replace colors/spacing via Variables, keep component visuals as-is
- Keep extra components beyond Phoenix's 14 — might use later
- Library file lives in team project (requires paid Figma plan)

### Variable structure

- Organize collections by category: separate Colors, Spacing, Typography, Radius collections
- Variable naming matches CSS exactly — e.g., `color-primary`, `spacing-4` (matches --color-primary)
- Semantic colors reference primitive colors via aliases — change primitive, semantic updates
- Light/dark modes via Figma's native Variable modes — single color variable with Light/Dark modes

### Token scope

- Full token set synced to Figma: colors, spacing, typography, radius
- Full color depth: primitives (blue-100 through blue-900) plus semantic tokens
- OKLCH auto-converted on sync — Tokens Studio converts OKLCH → hex when pushing to Figma

### Sync workflow

- Tokens Studio connected directly to GitHub (packages/tokens/src/tokens folder)
- Anyone with Figma edit access can sync tokens to GitHub
- Bidirectional: designers pull latest code tokens into Figma when code changes

### Claude's Discretion

- Branch strategy for GitHub sync (dedicated branch vs feature branches)
- Spacing and radius units (pixels vs relative — pick based on Figma Variables capabilities)
- Permission configuration details for Tokens Studio GitHub integration

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches based on Tokens Studio best practices.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 08-figma-library-setup_
_Context gathered: 2026-02-06_
