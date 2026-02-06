# Phase 7: Token Pipeline Integration - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Style Dictionary build outputs Figma-compatible tokens (Tokens Studio JSON format) alongside existing OKLCH CSS. This phase adds sd-transforms integration, OKLCH-to-RGB conversion, and token naming conventions. The Figma library setup and designer workflows are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Output Structure

- Figma tokens output to separate directory: `packages/tokens/dist/figma/`
- Format: Tokens Studio JSON (plugin-importable)
- Light and dark modes as separate files: `figma/light.json` and `figma/dark.json`
- Include `token-mapping.json` showing Phoenix name → Figma path mappings

### Naming Conventions

- Hierarchical names with slashes: `primary` → `color/semantic/primary`
- Top-level groups organized by type: `color/`, `spacing/`, `typography/`, `radius/`
- Semantic tokens only — no primitive/raw color values exported to Figma
- Preserve `$description` fields from source tokens for designer guidance

### Color Fidelity

- Output format: Hex (#RRGGBB) for maximum Figma compatibility
- Generate visual comparison report showing OKLCH vs RGB side-by-side

### Claude's Discretion

- OKLCH→RGB conversion tolerance (perceptual vs mathematical)
- Gamut clipping behavior and warning strategy
- Color comparison report format (HTML or Markdown)

### Build Workflow

- Figma tokens are part of main build: `pnpm build` outputs both CSS and Figma tokens
- Build fails if Figma token generation fails (keeps CSS and Figma in sync)
- Token changes automatically update Storybook token visualization
- Output `manifest.json` listing all generated files

</decisions>

<specifics>
## Specific Ideas

- Token mapping file enables tooling/CI to verify Phoenix→Figma correspondence
- Visual comparison report helps catch color drift during token updates
- Manifest file useful for debugging and CI verification

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 07-token-pipeline-integration_
_Context gathered: 2026-02-06_
