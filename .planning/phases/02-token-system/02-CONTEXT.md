# Phase 2: Token System - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Design token pipeline using Style Dictionary 5 that outputs CSS custom properties and a Tailwind preset. Components reference semantic tokens for colors, spacing, typography, and border radii. Light and dark mode support via class strategy. Migration guide for Tokens Studio / Figma Variables.

</domain>

<decisions>
## Implementation Decisions

### Color palette scope

- Full palette: neutral, primary, secondary, destructive, warning, success, info
- 11 shades per scale (Tailwind standard: 50, 100, 200...900, 950)
- Curated defaults out of the box — shadcn/ui zinc aesthetic (zinc neutrals + slate-blue primary)
- Should look polished immediately, users customize from there

### Token naming convention

- Semantic tokens follow shadcn/ui convention: --background, --foreground, --primary, --primary-foreground, --muted, --accent, --destructive, --border, --ring, etc.
- Source/seed files use DTCG format ($value, $type, $description) for industry standard interop
- Flat JSON per category for seed files: colors.json, spacing.json, typography.json, radii.json

### Dark mode color strategy

- Independently curated dark palette (not scale inversion) — separate dark token file with hand-picked values per semantic token
- Activated via class="dark" on html element (Tailwind darkMode: 'class')
- Include a basic dark mode toggle in apps/web to demonstrate the system
- Persistence: default to OS prefers-color-scheme, user can override, override saved to localStorage
- Handle flash-of-wrong-theme with inline script

### Spacing & typography scale

- 8px base spacing unit (8, 16, 24, 32, 48, 64, 96)

### Claude's Discretion

- CSS variable namespace prefix decision (no prefix vs short prefix like --ph-)
- Whether spacing tokens replace or extend Tailwind defaults (consider existing ESLint arbitrary value ban)
- Typography scale approach (fixed vs fluid) — pick what's practical for component library
- Font family tokens — pick what makes sense for a starter kit
- Exact shade values for each color scale
- Border radii scale values

</decisions>

<specifics>
## Specific Ideas

- shadcn/ui zinc aesthetic as the default look — clean, professional, widely recognized
- DTCG format chosen specifically for future Tokens Studio / Figma Variables migration path
- Dark mode toggle is a demo utility in apps/web, not a packages/ui component (components come in Phase 3)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-token-system_
_Context gathered: 2026-02-01_
