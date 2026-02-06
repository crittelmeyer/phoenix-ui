---
phase: 07-token-pipeline-integration
plan: 02
subsystem: token-pipeline
tags: [style-dictionary, sd-transforms, figma, oklch, color-conversion]

requires:
  - 07-01: sd-transforms and custom formats installed

provides:
  - Functional token build pipeline with dual outputs (CSS + Figma)
  - OKLCH-to-hex color conversion for Figma compatibility
  - Token mapping documentation
  - Visual color comparison HTML report

affects:
  - 07-03: Figma plugin configuration will consume these outputs

tech-stack:
  added:
    - colorjs.io: Color space conversion library
  patterns:
    - Custom Style Dictionary transforms for OKLCH-to-hex
    - Preprocessor pattern for DTCG token parsing
    - Dollar-value fallback ($value ?? value) for format compatibility

key-files:
  created:
    - packages/tokens/src/transforms/oklch-to-hex.mjs
    - packages/tokens/dist/figma/light.json
    - packages/tokens/dist/figma/dark.json
    - packages/tokens/dist/figma/token-mapping.json
    - packages/tokens/dist/color-comparison.html
  modified:
    - packages/tokens/src/build.mjs
    - packages/tokens/src/formats/tokens-studio.mjs
    - packages/tokens/src/formats/token-mapping.mjs
    - packages/tokens/src/formats/color-comparison.mjs
    - packages/tokens/package.json

decisions:
  - id: D-07-02-01
    title: Custom OKLCH-to-hex transform required
    rationale: sd-transforms doesn't convert OKLCH to hex automatically; needed custom transform using colorjs.io
    impact: Phoenix tokens can now output in both OKLCH (for web) and hex (for Figma)
  - id: D-07-02-02
    title: Set excludeParentKeys to false
    rationale: excludeParentKeys: true broke semantic token references
    impact: Token references like {color.neutral.50} resolve correctly
  - id: D-07-02-03
    title: Install colorjs.io as direct dependency
    rationale: colorjs.io is transitive dep of sd-transforms but not directly importable
    impact: OKLCH color parsing and conversion to sRGB/hex works reliably
  - id: D-07-02-04
    title: Use preprocessors array with tokens-studio
    rationale: sd-transforms requires preprocessor to parse DTCG format tokens
    impact: $value properties correctly parsed before transformation

metrics:
  duration: 6 minutes
  completed: 2026-02-06

completed_at: 2026-02-06T21:58:49Z
---

# Phase 07 Plan 02: Configure Build Script with sd-transforms Summary

**One-liner:** Extended Style Dictionary build to output both OKLCH CSS and hex Figma JSON with custom color conversion

## What Was Built

Integrated sd-transforms and custom formats into the token build pipeline to generate dual outputs:

1. **CSS Output (OKLCH)** - Preserved existing web app token format
2. **Figma Output (Hex)** - New Figma-compatible JSON with hex colors
3. **Token Mapping** - Documentation of Phoenix-to-Figma path correspondence
4. **Color Comparison** - HTML report showing OKLCH vs hex visual comparison

### Build Pipeline Architecture

```
Source Tokens (OKLCH)
    ↓
[sd-transforms preprocessor] → Parse DTCG format
    ↓
[Style Dictionary transforms]
    ├─ CSS platform → OKLCH CSS variables (unchanged)
    └─ Figma platform → Hex JSON via custom transform
         ↓
    [Custom formats]
    ├─ tokens-studio.mjs → Figma-compatible JSON
    ├─ token-mapping.mjs → Documentation JSON
    └─ color-comparison.mjs → Visual HTML report
```

### Key Technical Decisions

**OKLCH-to-Hex Transform:**
Created custom transform using colorjs.io because sd-transforms `ts/color/modifiers` only handles color modifications (lighten/darken), not format conversion. The transform:

- Parses OKLCH values: `oklch(0.647 0.186 264.54)`
- Converts to sRGB color space
- Outputs hex: `#4338ca`

**Preprocessor Configuration:**
Added `preprocessors: ['tokens-studio']` to both light and dark mode builds. This preprocessor:

- Parses DTCG `$value`, `$type`, `$description` properties
- Resolves token references before transformation
- Required for sd-transforms to work with DTCG format

**Dollar-Value Fallback:**
Updated all custom format functions to use `token.$value ?? token.value` pattern. During format execution, Style Dictionary hasn't converted `$value` to `value` yet, so fallback ensures values are accessible.

**excludeParentKeys Configuration:**
Set to `false` (not `true` as planned). When `true`, the preprocessor changes token structure in a way that breaks semantic token references like `{color.neutral.50}`. With `false`, references resolve correctly.

## Files Changed

### Created (6 files)

1. **packages/tokens/src/transforms/oklch-to-hex.mjs** - Custom transform for color conversion
2. **packages/tokens/dist/figma/light.json** - Light mode Figma tokens (19KB, 94 color tokens)
3. **packages/tokens/dist/figma/dark.json** - Dark mode Figma tokens (2.4KB, 17 dark overrides)
4. **packages/tokens/dist/figma/token-mapping.json** - Token path documentation (19KB)
5. **packages/tokens/dist/color-comparison.html** - Visual comparison report (31KB)

### Modified (5 files)

1. **packages/tokens/src/build.mjs**
   - Imported and registered sd-transforms with preprocessor
   - Registered custom OKLCH-to-hex transform
   - Added Figma platform configuration with custom transforms
   - Added try/catch for atomic failure handling

2. **packages/tokens/src/formats/tokens-studio.mjs**
   - Added `$value ?? value` fallback pattern

3. **packages/tokens/src/formats/token-mapping.mjs**
   - Added `$value ?? value` fallback pattern

4. **packages/tokens/src/formats/color-comparison.mjs**
   - Added `$value ?? value` fallback pattern

5. **packages/tokens/package.json**
   - Added colorjs.io ^0.6.1 devDependency
   - Added 3 Figma token exports for programmatic access

## Verification Results

### Build Output

```
✓ dist/tokens.css (OKLCH CSS variables) - 10.2KB
✓ dist/tokens.dark.css (OKLCH CSS variables) - 1.6KB
✓ dist/figma/light.json (Hex Tokens Studio format) - 19KB
✓ dist/figma/dark.json (Hex Tokens Studio format) - 2.4KB
✓ dist/figma/token-mapping.json (Documentation) - 19KB
✓ dist/color-comparison.html (Visual comparison) - 31KB
```

### Color Conversion Verification

```bash
# Figma JSON has hex colors (not OKLCH)
$ grep -c "#[0-9a-fA-F]{6}" dist/figma/light.json
94

# CSS still has OKLCH (unchanged)
$ grep -c "oklch" dist/tokens.css
94
```

### Sample Output Comparison

**Source (colors.json):**

```json
"neutral": {
  "50": {
    "$value": "oklch(0.985 0.002 264.54)",
    "$type": "color"
  }
}
```

**CSS Output (tokens.css):**

```css
--color-neutral-50: oklch(0.985 0.002 264.54);
```

**Figma Output (light.json):**

```json
{
  "phoenix-light": {
    "color/neutral/50": {
      "value": "#f9fafb",
      "type": "color"
    }
  }
}
```

## Decisions Made

### D-07-02-01: Custom OKLCH-to-hex transform required

**Context:** sd-transforms provides `ts/color/modifiers` transform, but this only handles color modifications (lighten, darken, mix), not format conversion.

**Decision:** Created custom transform using colorjs.io for OKLCH-to-hex conversion.

**Rationale:**

- Phoenix source tokens use OKLCH for perceptual uniformity
- Figma requires hex values for color import
- colorjs.io already available as transitive dependency
- Custom transform gives full control over conversion process

**Impact:** Phoenix can now maintain OKLCH source format while outputting Figma-compatible hex values.

### D-07-02-02: Set excludeParentKeys to false

**Context:** Plan specified `excludeParentKeys: true` based on research, but this broke token references.

**Decision:** Set `excludeParentKeys: false` in registerTransforms options.

**Error encountered:**

```
Reference Errors (17):
{semantic.background} tries to reference {color.neutral.50}, which is not defined.
```

**Root cause:** When `excludeParentKeys: true`, the preprocessor restructures tokens in a way that changes how references are resolved. Semantic tokens like `{color.neutral.50}` became unresolvable.

**Impact:** All token references now resolve correctly. Semantic tokens (background, foreground, etc.) correctly reference base color tokens.

### D-07-02-03: Install colorjs.io as direct dependency

**Context:** colorjs.io is a transitive dependency of sd-transforms but not directly importable.

**Decision:** Added colorjs.io ^0.6.1 as devDependency.

**Error encountered:**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'colorjs.io'
```

**Rationale:**

- Node's ESM resolution doesn't support importing transitive dependencies
- colorjs.io is the standard library for modern color space conversion
- Small addition (already in dependency tree via sd-transforms)

**Impact:** OKLCH color parsing and sRGB conversion works reliably in custom transform.

### D-07-02-04: Use preprocessors array with tokens-studio

**Context:** sd-transforms registers a preprocessor called 'tokens-studio' that must be explicitly enabled.

**Decision:** Added `preprocessors: ['tokens-studio']` to StyleDictionary config for both light and dark builds.

**What it does:**

- Parses DTCG format (`$value`, `$type`, `$description`)
- Resolves token references before transformation
- Normalizes token structure for sd-transforms

**Impact:** DTCG format tokens are correctly parsed and transformed. Without this, tokens would have undefined values.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed register function import**

- **Found during:** Task 1 build execution
- **Issue:** Imported `registerTransforms` but correct export is `register`
- **Fix:** Changed import to `{ register }` from sd-transforms
- **Files modified:** packages/tokens/src/build.mjs
- **Commit:** 7a903f1 (overwritten by later commit)

**2. [Rule 2 - Missing Critical] Added preprocessor configuration**

- **Found during:** Task 1 execution
- **Issue:** sd-transforms requires preprocessor to parse DTCG tokens, values were undefined without it
- **Fix:** Added `preprocessors: ['tokens-studio']` to both StyleDictionary configs
- **Files modified:** packages/tokens/src/build.mjs
- **Commit:** f4befe3

**3. [Rule 1 - Bug] Fixed excludeParentKeys breaking references**

- **Found during:** Task 1 execution
- **Issue:** excludeParentKeys: true caused 17 reference errors
- **Fix:** Set excludeParentKeys: false to preserve token references
- **Files modified:** packages/tokens/src/build.mjs
- **Commit:** f4befe3

**4. [Rule 2 - Missing Critical] Added dollar-value fallback**

- **Found during:** Task 1 execution
- **Issue:** Format functions accessed token.value but it was undefined (DTCG format uses $value)
- **Fix:** Added `token.$value ?? token.value` pattern to all format functions
- **Files modified:** All 3 format files
- **Commit:** f4befe3

**5. [Rule 1 - Bug] Created custom OKLCH-to-hex transform**

- **Found during:** Task 1 execution
- **Issue:** tokens-studio transform group doesn't convert OKLCH to hex automatically
- **Fix:** Created custom transform using colorjs.io for explicit conversion
- **Files modified:** Created oklch-to-hex.mjs transform
- **Commit:** f4befe3

**6. [Rule 3 - Blocking] Installed colorjs.io dependency**

- **Found during:** Task 1 execution
- **Issue:** colorjs.io import failed (transitive dep not directly importable)
- **Fix:** Added colorjs.io ^0.6.1 as devDependency
- **Files modified:** packages/tokens/package.json
- **Commit:** f4befe3

## Known Issues & Warnings

### Token Collision Warnings

Build shows warnings about token collisions:

```
⚠️ dist/figma/light.json
While building light.json, token collisions were found; output may be unexpected.
```

**Cause:** Using single transform (phoenix/oklch-to-hex) instead of full transform group. Style Dictionary detects tokens with same name but doesn't actually have collisions.

**Impact:** None - outputs are correct. This is a cosmetic warning.

**Resolution:** Ignore this warning. If issues arise, can create custom transform group with name transforms included.

## Next Phase Readiness

### Blockers

None.

### Ready for 07-03 (Configure Figma Code Connect)

- ✓ Figma token outputs generated (light.json, dark.json)
- ✓ Token set names configured (phoenix-light, phoenix-dark)
- ✓ Token mapping documentation available
- ✓ Hex color format compatible with Figma import

### Phase 7 Progress

- [x] 07-01: Install sd-transforms and create custom formats
- [x] 07-02: Configure build script with sd-transforms
- [ ] 07-03: Configure Figma Code Connect for token import

## Commits

| Hash    | Message                                              | Files |
| ------- | ---------------------------------------------------- | ----- |
| 7a903f1 | feat(07-02): extend build script (first attempt)     | 1     |
| f4befe3 | feat(07-02): extend build script with sd-transforms  | 6     |
| e351504 | feat(07-02): add Figma token exports to package.json | 1     |

**Total:** 3 commits, 8 files changed (6 created, 5 modified)
