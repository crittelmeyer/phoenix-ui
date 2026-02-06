---
phase: 07-token-pipeline-integration
plan: 01
subsystem: design-tokens
tags: [tokens, figma, style-dictionary, sd-transforms, formats]

requires:
  - v1 Style Dictionary 5.2.0 pipeline (existing)
  - DTCG token source files in OKLCH format

provides:
  - '@tokens-studio/sd-transforms dependency'
  - 'Custom Style Dictionary formats for Figma output'
  - 'Tokens Studio JSON format'
  - 'Token mapping documentation format'
  - 'Color comparison HTML report format'

affects:
  - 07-02 (will register these formats in build script)
  - 07-03 (will use these formats for Figma output)

tech-stack:
  added:
    - '@tokens-studio/sd-transforms@^2.0.0'
  patterns:
    - 'Custom Style Dictionary formats (ESM)'
    - 'OKLCH-to-RGB color conversion'

key-files:
  created:
    - packages/tokens/src/formats/tokens-studio.mjs
    - packages/tokens/src/formats/token-mapping.mjs
    - packages/tokens/src/formats/color-comparison.mjs
  modified:
    - packages/tokens/package.json

decisions:
  - id: D-07-01-01
    choice: 'Use @tokens-studio/sd-transforms 2.x'
    rationale: 'Required for Style Dictionary 5.x compatibility (version 1.x only works with SD 4.x)'
    alternatives: ['Manual OKLCH-to-RGB conversion']
    impact: 'Enables automatic color conversion and Tokens Studio compatibility'

  - id: D-07-01-02
    choice: 'Create custom formats as ESM modules (.mjs)'
    rationale: 'Matches existing build.mjs ESM pattern, native Node.js support'
    alternatives: ['CJS with require()']
    impact: 'Consistent with project architecture, no transpilation needed'

  - id: D-07-01-03
    choice: 'Wrap tokens in named sets (phoenix-light/phoenix-dark)'
    rationale: 'Tokens Studio plugin expects this structure for multi-theme support'
    alternatives: ['Flat token structure']
    impact: 'Enables light/dark mode separation in Figma'

metrics:
  duration: '2 minutes'
  completed: '2026-02-06'
---

# Phase 7 Plan 1: Install sd-transforms and Create Custom Formats Summary

**One-liner:** Install @tokens-studio/sd-transforms 2.0.3 and create three custom Style Dictionary formats for Figma-compatible token output.

## Objective Achieved

Established the foundation for Figma-compatible token generation. The sd-transforms dependency provides OKLCH-to-RGB conversion and Tokens Studio compatibility. Custom formats structure token output for Figma import and documentation.

## Tasks Completed

| Task | Name                                  | Commit  | Files                                   |
| ---- | ------------------------------------- | ------- | --------------------------------------- |
| 1    | Install sd-transforms dependency      | 7147fac | package.json, pnpm-lock.yaml            |
| 2    | Create Tokens Studio JSON format      | cb027fd | formats/tokens-studio.mjs               |
| 3    | Create mapping and comparison formats | 363032c | formats/token-mapping.mjs, color-\*.mjs |

## What Was Built

### 1. sd-transforms Dependency

Installed `@tokens-studio/sd-transforms@^2.0.0` (version 2.0.3):

- Provides OKLCH-to-RGB color conversion via `ts/color/modifiers` transform
- Enables Tokens Studio plugin compatibility
- Version 2.x required for Style Dictionary 5.x (critical version lock)
- Includes color.js peer dependency for color space conversions

### 2. Tokens Studio JSON Format

Custom format in `src/formats/tokens-studio.mjs`:

**Purpose:** Outputs Figma-compatible JSON for Tokens Studio plugin import

**Key features:**

- Wraps tokens in named sets (`{ "phoenix-light": { ... } }`)
- Uses slash separator for Figma hierarchy (`color/semantic/primary`)
- Includes DTCG `$type` and `$description` metadata
- Expects hex-converted values from sd-transforms

**Format API signature:**

```javascript
tokensStudioFormat({ dictionary, options, file })
```

**Output structure:**

```json
{
  "phoenix-light": {
    "color/semantic/primary": {
      "value": "#3b82f6",
      "type": "color",
      "description": "Primary brand color"
    }
  }
}
```

### 3. Token Mapping Format

Custom format in `src/formats/token-mapping.mjs`:

**Purpose:** Documents Phoenix dot-notation to Figma slash-path mapping

**Key features:**

- Maps `color.semantic.primary` → `color/semantic/primary`
- Includes token type and final converted value
- Useful for debugging Figma import issues

**Output structure:**

```json
{
  "color.semantic.primary": {
    "figmaPath": "color/semantic/primary",
    "type": "color",
    "value": "#3b82f6"
  }
}
```

### 4. Color Comparison HTML Format

Custom format in `src/formats/color-comparison.mjs`:

**Purpose:** Visual verification of OKLCH-to-RGB conversion accuracy

**Key features:**

- Side-by-side comparison of source OKLCH and converted RGB
- Visual swatches for both color values
- Filterable HTML table with token count
- Useful for design review and debugging color differences

**Output:** Full HTML document with embedded CSS and color swatch table

## Technical Implementation

### Format Pattern

All three formats follow Style Dictionary format API:

```javascript
export const formatName = ({ dictionary, options, file }) => {
  // Access tokens via dictionary.allTokens
  // Return string output (JSON or HTML)
}
```

**Critical API details:**

- `dictionary.allTokens` - Array of all tokens after transforms
- `token.path` - Array of token hierarchy segments
- `token.value` - Transformed value (hex after sd-transforms)
- `token.original.$value` - Original DTCG value (OKLCH)
- `token.$type` - DTCG token type (color, dimension, etc.)

### Color Conversion Flow

1. Source tokens use OKLCH format: `oklch(0.647 0.186 264.54)`
2. sd-transforms `ts/color/modifiers` converts to hex: `#3b82f6`
3. Custom formats receive already-converted hex values
4. Comparison format preserves both original and converted for verification

### Module System

All formats use ESM (.mjs extension):

- Native Node.js support (no transpilation)
- Matches existing build.mjs pattern
- Named exports for explicit API

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Ready for 07-02:** Build script integration

- Formats created and verified
- sd-transforms installed and ready
- Next: Register formats in build.mjs and configure platforms

**No blockers identified.**

## Decisions Made

### D-07-01-01: Use sd-transforms 2.x

**Context:** Need OKLCH-to-RGB conversion for Figma compatibility

**Options:**

1. Use @tokens-studio/sd-transforms (chosen)
2. Manual conversion with color.js
3. Custom transform implementation

**Decision:** Install sd-transforms 2.x

**Rationale:**

- Version 2.x required for Style Dictionary 5.x (1.x only works with SD 4.x)
- Provides battle-tested OKLCH conversion
- Includes Tokens Studio compatibility out of the box
- Maintained by community with active development

**Impact:** Enables automatic color conversion without custom implementation

### D-07-01-02: ESM Format Modules

**Context:** Need to create custom Style Dictionary formats

**Options:**

1. ESM modules with .mjs extension (chosen)
2. CJS with require()
3. TypeScript with compilation step

**Decision:** Use ESM .mjs files

**Rationale:**

- Matches existing build.mjs pattern
- Native Node.js support (no transpilation)
- Style Dictionary 5.x expects ESM
- Simpler development workflow

**Impact:** Consistent architecture, no build complexity

### D-07-01-03: Named Token Sets

**Context:** Structuring Tokens Studio JSON output

**Options:**

1. Wrap in named sets like `{ "phoenix-light": {...} }` (chosen)
2. Flat token structure
3. Nested theme structure

**Decision:** Use named token sets with theme names

**Rationale:**

- Tokens Studio plugin expects this structure
- Enables light/dark mode separation in Figma
- Matches Tokens Studio documentation pattern
- Allows future theme expansion

**Impact:** Figma import will recognize separate light/dark themes

## Testing & Validation

**Verification performed:**

1. Dependency installation: `pnpm ls @tokens-studio/sd-transforms` → 2.0.3
2. Format files exist: `ls src/formats/` → 3 .mjs files
3. ESM imports work: Node.js can import all three formats without errors
4. Type checking passes: Turbo typecheck success across all packages

**All success criteria met:**

- @tokens-studio/sd-transforms ^2.0.0 installed
- src/formats/ directory exists with 3 format files
- All formats export named functions following SD format API
- No import errors when loading format modules

## Lessons Learned

**What went well:**

- Version constraint ^2.0.0 correctly installed 2.0.3
- ESM format pattern straightforward to implement
- Format API well-documented and easy to follow

**What could be improved:**

- Could add JSDoc types for better IDE support (future enhancement)
- Color comparison HTML could have dark mode (future enhancement)

**For next plan:**

- Formats ready for registration in build.mjs
- Need to configure sd-transforms preprocessor
- Need to add new platforms (tokens-studio, token-mapping, color-comparison)
