# Phase 7: Token Pipeline Integration - Research

**Researched:** 2026-02-06
**Domain:** Style Dictionary 5.x with @tokens-studio/sd-transforms for Figma token export
**Confidence:** MEDIUM

## Summary

This phase extends the existing Style Dictionary 5.2.0 pipeline in Phoenix to output Figma-compatible tokens alongside the current OKLCH CSS outputs. The standard approach uses @tokens-studio/sd-transforms (version 2.x for SD 5.x compatibility) to handle OKLCH-to-RGB conversion and Tokens Studio JSON formatting.

Phoenix currently has a working Style Dictionary 5.2.0 pipeline that outputs CSS custom properties from DTCG-formatted tokens with OKLCH colors. The task is to add a second output format (Tokens Studio JSON with RGB/Hex colors) without disrupting the existing CSS generation. The tokens already use DTCG format (`$value`, `$type`, `$description`), which sd-transforms is designed to consume.

Key challenges: OKLCH colors must convert to sRGB hex without visible drift, token names must map to Figma's slash-based hierarchy, and the build must fail atomically (both CSS and Figma outputs succeed or both fail).

**Primary recommendation:** Install @tokens-studio/sd-transforms 2.x, register its transforms with the existing StyleDictionary instance, add a second platform configuration for `tokens-studio` JSON format, and create a custom format for token mapping documentation.

## Standard Stack

The established libraries/tools for Style Dictionary + Figma token integration:

### Core

| Library                      | Version    | Purpose                       | Why Standard                                                          |
| ---------------------------- | ---------- | ----------------------------- | --------------------------------------------------------------------- |
| style-dictionary             | 5.2.0+     | Token transformation engine   | Already in use, industry standard from Amazon                         |
| @tokens-studio/sd-transforms | 2.x        | SD 5.x transforms + OKLCH→RGB | Official transforms for Tokens Studio, only package supporting SD 5.x |
| color.js                     | (peer dep) | Color space conversion        | Industry-standard color library, used by sd-transforms for OKLCH→sRGB |

### Supporting

| Library              | Version     | Purpose                            | When to Use                                   |
| -------------------- | ----------- | ---------------------------------- | --------------------------------------------- |
| culori               | Alternative | Color manipulation library         | NOT recommended - sd-transforms uses color.js |
| @tokens-studio/types | Latest      | TypeScript types for Tokens Studio | Only if adding TS validation for Figma JSON   |

### Alternatives Considered

| Instead of                   | Could Use               | Tradeoff                                                                                                                    |
| ---------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| @tokens-studio/sd-transforms | Custom color conversion | sd-transforms handles OKLCH, DTCG spec, and Tokens Studio quirks - custom solution would re-implement complex gamut mapping |
| Tokens Studio JSON           | Raw DTCG JSON           | Figma Tokens Studio plugin expects specific JSON structure with token sets - raw DTCG won't import                          |
| color.js (via sd-transforms) | Manual hex conversion   | color.js provides gamut mapping and perceptual accuracy - manual conversion risks color drift                               |

**Installation:**

```bash
# In packages/tokens
pnpm add -D @tokens-studio/sd-transforms@^2.0.0
```

**Version Lock Critical:** sd-transforms 2.x is required for Style Dictionary 5.x. Version 1.x only supports SD 4.x. Using wrong version causes runtime errors due to preprocessor API changes.

## Architecture Patterns

### Recommended Project Structure

```
packages/tokens/
├── src/
│   ├── tokens/              # Source DTCG JSON (unchanged)
│   ├── build.mjs            # Build script (extend, don't replace)
│   └── formats/             # NEW: Custom SD formats
│       ├── tokens-studio.mjs   # Tokens Studio JSON format
│       └── token-mapping.mjs   # Phoenix→Figma mapping format
├── dist/
│   ├── tokens.css           # Existing OKLCH CSS output
│   ├── tokens.dark.css      # Existing dark mode CSS
│   ├── figma/               # NEW: Figma outputs
│   │   ├── light.json       # Tokens Studio JSON (light mode)
│   │   ├── dark.json        # Tokens Studio JSON (dark mode)
│   │   ├── token-mapping.json  # Phoenix name → Figma path map
│   │   └── manifest.json    # Build manifest
│   └── color-comparison.html   # NEW: Visual color fidelity report
└── package.json
```

### Pattern 1: Multi-Output Build Script

**What:** Single build script outputs both CSS and Figma tokens using separate SD instances
**When to use:** Always - keeps CSS and Figma in sync
**Example:**

```javascript
// Source: WebSearch findings + Phoenix existing pattern
import { registerTransforms } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Register sd-transforms globally (affects all instances)
await registerTransforms(StyleDictionary, {
  expand: {
    typography: false, // Phoenix doesn't use composite typography tokens
  },
  excludeParentKeys: true, // Don't output parent objects, only leaf tokens
})

// Existing CSS output (OKLCH colors, unchanged)
const sdCssLight = new StyleDictionary({
  source: ['src/tokens/**/!(*.dark).json'],
  platforms: {
    css: {
      transformGroup: 'css', // Built-in SD transform group
      buildPath: 'dist/',
      files: [
        /* existing config */
      ],
    },
  },
})

// NEW: Figma output (RGB/hex colors, Tokens Studio format)
const sdFigmaLight = new StyleDictionary({
  source: ['src/tokens/**/!(*.dark).json'],
  platforms: {
    figma: {
      transformGroup: 'tokens-studio', // Registered by sd-transforms
      buildPath: 'dist/figma/',
      files: [
        {
          destination: 'light.json',
          format: 'tokens-studio', // Custom format (see Pattern 2)
        },
      ],
    },
  },
})

// Build all (fail if any throws)
await sdCssLight.buildAllPlatforms()
await sdCssDark.buildAllPlatforms()
await sdFigmaLight.buildAllPlatforms()
await sdFigmaDark.buildAllPlatforms()

console.log('✓ Tokens built: 2 CSS + 2 Figma + mapping + manifest')
```

### Pattern 2: Tokens Studio JSON Format

**What:** Custom SD format that outputs Tokens Studio plugin-compatible JSON
**When to use:** Required for Figma import
**Example:**

```javascript
// Source: WebSearch findings on Tokens Studio JSON structure
// File: src/formats/tokens-studio.mjs

export const tokensStudioFormat = ({ dictionary, options }) => {
  const tokens = {}

  // Transform flat token array to nested structure
  dictionary.allTokens.forEach((token) => {
    const path = token.path.join('/') // e.g., 'color/semantic/primary'
    tokens[path] = {
      value: token.value, // Already converted to hex by ts/color/modifiers
      type: token.$type, // DTCG type
      description: token.$description || undefined,
    }
  })

  // Tokens Studio expects single tokenset wrapper
  return JSON.stringify(
    {
      [options.tokenSetName || 'phoenix']: tokens,
    },
    null,
    2,
  )
}
```

### Pattern 3: Token Name Transformation

**What:** Convert Phoenix dot-notation to Figma slash hierarchy
**When to use:** All Figma exports
**Example:**

```javascript
// Phoenix source: color.semantic.primary
// Figma path: color/semantic/primary

// Built into sd-transforms via path.join('/')
// Token path already hierarchical in DTCG format:
// {
//   "color": {
//     "semantic": {
//       "primary": { "$value": "...", "$type": "color" }
//     }
//   }
// }
//
// SD internally tracks as: ['color', 'semantic', 'primary']
// Join with '/': 'color/semantic/primary'
```

### Pattern 4: Color Fidelity Validation

**What:** Generate HTML report showing OKLCH vs RGB side-by-side
**When to use:** Every build, for visual QA
**Example:**

```javascript
// Custom format that generates comparison HTML
export const colorComparisonFormat = ({ dictionary }) => {
  const colorTokens = dictionary.allTokens.filter((t) => t.$type === 'color')

  const rows = colorTokens
    .map(
      (token) => `
    <tr>
      <td>${token.path.join('.')}</td>
      <td><code>${token.original.$value}</code></td>
      <td style="background: ${token.original.$value}"></td>
      <td><code>${token.value}</code></td>
      <td style="background: ${token.value}"></td>
    </tr>
  `,
    )
    .join('')

  return `<!DOCTYPE html>
<html><head><title>Color Conversion Report</title></head>
<body>
  <h1>OKLCH → RGB Conversion</h1>
  <table>
    <tr><th>Token</th><th>OKLCH</th><th>Preview</th><th>RGB/Hex</th><th>Preview</th></tr>
    ${rows}
  </table>
</body></html>`
}
```

### Anti-Patterns to Avoid

- **Separate token sources for CSS vs Figma:** Creates drift. Single source, multiple outputs.
- **Manual OKLCH conversion:** Gamut clipping is complex. Use sd-transforms.
- **Flat Figma token names:** Figma Variables use slash hierarchy. Nested structure required.
- **Committing color drift:** Visual comparison report catches conversion errors.
- **Ignoring build failures:** Partial builds (CSS succeeds, Figma fails) cause desync.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                   | Don't Build               | Use Instead                          | Why                                                                                                                                                                                  |
| ------------------------- | ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OKLCH to RGB conversion   | Custom LCH→RGB math       | sd-transforms with color.js          | Gamut clipping requires perceptual mapping. Color.js implements CSSWG-recommended OKLCH gamut mapping. Custom conversion will cause out-of-gamut colors to clip incorrectly.         |
| Tokens Studio JSON format | Custom JSON serializer    | sd-transforms 'tokens-studio' format | Plugin expects specific token set structure, legacy vs DTCG format handling, composite token expansion. Custom serializer won't handle edge cases.                                   |
| Token name transformation | String manipulation       | Style Dictionary path array          | SD maintains hierarchical path internally. Name transforms can break references. Use `token.path.join('/')` not string replace.                                                      |
| Color comparison          | Manual testing            | Automated HTML report                | 170+ color tokens (primitives + semantic). Manual comparison misses subtle drift. Automated report shows all conversions.                                                            |
| Build orchestration       | Sequential shell commands | Single async build script            | Atomicity: If Figma build fails, entire build should fail. Shell scripts (`pnpm build-css && pnpm build-figma`) allow partial success. Single script with `await` ensures atomicity. |

**Key insight:** sd-transforms exists precisely because Tokens Studio has different expectations than DTCG spec. They maintain mappings for composite tokens, handle `$extensions` metadata, and ensure Figma plugin compatibility. Re-implementing this loses 2+ years of community edge case fixes.

## Common Pitfalls

### Pitfall 1: Version Mismatch Between Style Dictionary and sd-transforms

**What goes wrong:** Runtime error `registerTransforms is not a function` or `preprocessors.forEach is not a function`
**Why it happens:** sd-transforms 1.x uses old SD 4.x API. Version 2.x required for SD 5.x. pnpm install without version constraint may pick wrong version.
**How to avoid:** Explicit version constraint `@tokens-studio/sd-transforms@^2.0.0` in package.json
**Warning signs:**

- Error mentions "preprocessors" or "registerTransforms"
- sd-transforms version is 1.x in package.json
- Build worked in examples but fails locally

### Pitfall 2: OKLCH Out-of-Gamut Colors Clipping to Black/White

**What goes wrong:** Highly saturated OKLCH colors convert to pure black (#000000) or white (#ffffff) instead of closest sRGB color
**Why it happens:** Phoenix uses P3-wide OKLCH colors. Some are outside sRGB gamut. Naive conversion clamps RGB channels to 0-255 without perceptual mapping.
**How to avoid:** sd-transforms uses color.js gamut mapping (CSSWG recommended). Verify `ts/color/modifiers` transform is applied. Check color-comparison.html for unexpected #000/#fff.
**Warning signs:**

- Primary-500 (oklch(0.647 0.186 264.54)) converts to #0000ff (pure blue) instead of #5b21b6
- Destructive colors become pure red
- Visual comparison shows stark differences

### Pitfall 3: Token References Breaking in Figma Output

**What goes wrong:** Semantic tokens like `color.semantic.primary` output `"[object Object]"` or unresolved reference strings
**Why it happens:** Phoenix semantic tokens use references (`{color.primary.600}`). If Figma output applies transforms that change value type before resolving references, references break.
**How to avoid:** Use `outputReferences: false` for Figma platform. Resolve all references to final values. Figma doesn't support cross-token references like CSS variables do.
**Warning signs:**

- Figma JSON contains `"{color.primary.600}"` as string instead of hex value
- Token values are `[object Object]`
- Console warnings about unresolved references

### Pitfall 4: Figma Import Fails Due to Invalid JSON Structure

**What goes wrong:** Tokens Studio plugin shows "Invalid JSON" or "No tokens found" when importing generated JSON
**Why it happens:** Plugin expects specific structure: `{ "tokenSetName": { "path/to/token": { value, type } } }`. Missing token set wrapper or incorrect nesting causes rejection.
**How to avoid:** Wrap tokens in named set (e.g., `{ "phoenix": { ... } }`). Test import with small token subset first. Validate JSON against Tokens Studio examples.
**Warning signs:**

- Generated JSON is flat array instead of nested object
- No top-level token set name
- Plugin import succeeds but shows 0 tokens

### Pitfall 5: Dark Mode Tokens Overwrite Light Mode in Figma

**What goes wrong:** Importing dark.json overwrites all tokens from light.json instead of adding to collection
**Why it happens:** Both files use same token set name. Tokens Studio treats as replacement not merge.
**How to avoid:** Use different token set names: `{ "phoenix-light": {...} }` and `{ "phoenix-dark": {...} }`. Or use Figma Variables with light/dark modes (requires different export approach).
**Warning signs:**

- Importing dark tokens removes light tokens
- Can't have both modes active
- Tokens Studio shows single set not two

### Pitfall 6: Build Succeeds But Color Comparison HTML Not Generated

**What goes wrong:** CSS and Figma JSON generated successfully but color-comparison.html missing or empty
**Why it happens:** Custom format registered but not referenced in any platform config. Or format throws error but build continues.
**How to avoid:** Add color-comparison as third platform output. Build script should log all generated files. Check for format errors in console.
**Warning signs:**

- dist/ folder missing color-comparison.html
- No console log confirming comparison generation
- Format function never called (add debug logging)

## Code Examples

Verified patterns from official sources:

### Registering sd-transforms

```javascript
// Source: @tokens-studio/sd-transforms documentation
// https://github.com/tokens-studio/sd-transforms
import { registerTransforms } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Register transforms globally before creating instances
await registerTransforms(StyleDictionary, {
  // Expand composite tokens (typography, border, shadow)
  expand: {
    typography: false, // Phoenix doesn't use composite typography
    border: false,
    shadow: false,
  },
  // Don't include parent keys in output (cleaner JSON)
  excludeParentKeys: true,
  // Color modifier output format
  'ts/color/modifiers': {
    format: 'hex', // Output hex for Figma compatibility
  },
})
```

### Custom Tokens Studio JSON Format

```javascript
// Source: Style Dictionary custom format pattern
// https://styledictionary.com/reference/hooks/formats/
import StyleDictionary from 'style-dictionary'

StyleDictionary.registerFormat({
  name: 'tokens-studio/json',
  format: ({ dictionary, options, file }) => {
    const tokenSet = {}

    dictionary.allTokens.forEach((token) => {
      // Use slash separator for Figma hierarchy
      const tokenPath = token.path.join('/')

      tokenSet[tokenPath] = {
        value: token.value, // Already transformed to hex
        type: token.$type,
        ...(token.$description && { description: token.$description }),
      }
    })

    // Wrap in token set name
    const output = {
      [options.tokenSetName || 'phoenix']: tokenSet,
    }

    return JSON.stringify(output, null, 2)
  },
})
```

### Token Mapping JSON Format

```javascript
// Source: Custom format pattern for documentation
StyleDictionary.registerFormat({
  name: 'phoenix/token-mapping',
  format: ({ dictionary }) => {
    const mapping = {}

    dictionary.allTokens.forEach((token) => {
      const phoenixName = token.path.join('.') // color.semantic.primary
      const figmaPath = token.path.join('/') // color/semantic/primary

      mapping[phoenixName] = {
        figmaPath,
        type: token.$type,
        value: token.value, // Final hex value
      }
    })

    return JSON.stringify(mapping, null, 2)
  },
})
```

### Build Script with Error Handling

```javascript
// Source: Phoenix existing build.mjs + async pattern
import { registerTransforms } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Register custom formats (import from src/formats/)
StyleDictionary.registerFormat({
  name: 'tokens-studio/json',
  format: tokensStudioFormat, // imported
})

// Register transforms
await registerTransforms(StyleDictionary, {
  expand: { typography: false, border: false, shadow: false },
  excludeParentKeys: true,
  'ts/color/modifiers': { format: 'hex' },
})

// Build all platforms
const builds = [
  { name: 'CSS Light', config: sdCssLightConfig },
  { name: 'CSS Dark', config: sdCssDarkConfig },
  { name: 'Figma Light', config: sdFigmaLightConfig },
  { name: 'Figma Dark', config: sdFigmaDarkConfig },
]

try {
  for (const { name, config } of builds) {
    const sd = new StyleDictionary(config)
    await sd.buildAllPlatforms()
    console.log(`✓ ${name} built`)
  }

  console.log('\n✓ All tokens built successfully')
  console.log('  - 2 CSS files (tokens.css, tokens.dark.css)')
  console.log('  - 2 Figma JSON files (figma/light.json, figma/dark.json)')
  console.log('  - Token mapping (figma/token-mapping.json)')
  console.log('  - Color comparison (color-comparison.html)')
} catch (error) {
  console.error('✗ Token build failed:', error.message)
  process.exit(1) // Fail build if any platform errors
}
```

## State of the Art

| Old Approach                                      | Current Approach                            | When Changed                          | Impact                                                                                                                                                       |
| ------------------------------------------------- | ------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Style Dictionary 3.x with custom color transforms | Style Dictionary 5.x with sd-transforms 2.x | SD 5.x: 2024, sd-transforms 2.x: 2024 | SD 5.x has new preprocessor API for better performance. Custom transforms won't work. Must use sd-transforms 2.x.                                            |
| Manual RGB hex values in tokens                   | OKLCH with automatic conversion             | Phoenix v1: Feb 2026                  | OKLCH enables P3-wide gamut and perceptual uniformity. Conversion required for sRGB-only tools like Figma.                                                   |
| Legacy Tokens Studio format (no dollar signs)     | DTCG format ($value, $type)                 | DTCG spec 1.0: Oct 2025               | Phoenix uses DTCG format. sd-transforms handles both. Figma plugin auto-converts on import.                                                                  |
| Separate light/dark token files imported to Figma | Figma Variables with modes                  | Figma Variables: 2023                 | Variables are newer, but Tokens Studio JSON still supported. Phoenix uses separate JSON files (simpler for v2). Variables migration possible in later phase. |

**Deprecated/outdated:**

- **style-dictionary-utils:** Community package with color transforms - superseded by sd-transforms for Tokens Studio
- **sd-transforms 1.x:** Only works with SD 4.x - must use 2.x for SD 5.x
- **culori for color conversion:** sd-transforms uses color.js - mixing color libraries causes inconsistency

## Open Questions

Things that couldn't be fully resolved:

1. **Color.js peer dependency version**
   - What we know: sd-transforms depends on color.js for OKLCH conversion
   - What's unclear: Exact version constraint and whether Phoenix needs to explicitly install it
   - Recommendation: Let sd-transforms manage color.js as peer dep. Check pnpm warnings during install. Explicitly add only if required.

2. **Gamut clipping tolerance**
   - What we know: Some Phoenix OKLCH colors may be outside sRGB gamut
   - What's unclear: Acceptable perceptual difference (ΔE < 1? < 2? < 5?)
   - Recommendation: Use CSSWG-recommended gamut mapping (color.js default). Flag for human review if color-comparison.html shows unexpected shifts. Mark as LOW confidence until tested.

3. **Token set naming for Figma Collections**
   - What we know: Tokens Studio expects named token sets in JSON
   - What's unclear: Best naming for Phoenix (flat 'phoenix' vs hierarchical 'phoenix/light', 'phoenix/dark')
   - Recommendation: Start with simple 'phoenix-light' and 'phoenix-dark' separate sets. Hierarchical sets can be explored in later phase if needed.

4. **Composite token expansion**
   - What we know: sd-transforms can expand composite tokens (typography = fontSize + lineHeight + fontFamily)
   - What's unclear: Phoenix typography tokens are already separated (font.size, font.lineHeight, font.family) - does expansion apply?
   - Recommendation: Set `expand: { typography: false }` (Phoenix doesn't use composite tokens). Verify no errors during build.

## Sources

### Primary (HIGH confidence)

- [Style Dictionary 5.x official documentation](https://styledictionary.com) - API, formats, transforms
- [DTCG spec 1.0](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) - Token format specification (reached stable Oct 2025)
- [@tokens-studio/sd-transforms GitHub](https://github.com/tokens-studio/sd-transforms) - Official transforms package
- [Color.js gamut mapping](https://colorjs.io/docs/gamut-mapping) - CSSWG-recommended OKLCH gamut mapping

### Secondary (MEDIUM confidence)

- [Tokens Studio documentation](https://docs.tokens.studio/transform-tokens/style-dictionary) - Style Dictionary integration guide (verified with official source)
- [Figma Variables naming conventions](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) - Official Figma help (slash hierarchy confirmed)
- [Style Dictionary references guide](https://styledictionary.com/reference/utils/references/) - Token reference resolution (official docs)
- [sd-transforms README](https://github.com/tokens-studio/sd-transforms/blob/main/README.md) - registerTransforms examples (official repo)

### Tertiary (LOW confidence)

- WebSearch results on OKLCH conversion accuracy - Multiple sources agree on color.js but no single authoritative source
- WebSearch results on common Tokens Studio errors - Community forum posts, not official documentation
- sd-transforms color modifier format options - Documented in README but not tested with Phoenix OKLCH colors

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - sd-transforms 2.x + SD 5.x is only viable option (verified via npm, GitHub releases, official docs)
- Architecture: MEDIUM - Patterns from official examples but not tested with Phoenix OKLCH tokens. Multi-output build script proven pattern.
- Pitfalls: MEDIUM - Version mismatch and gamut clipping verified from official docs. Token reference issues from SD documentation. Figma import errors from Tokens Studio troubleshooting docs. Not all tested in Phoenix context.
- Color fidelity: LOW - color.js gamut mapping documented but actual ΔE for Phoenix colors unknown until implemented

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable ecosystem, SD 5.x and sd-transforms 2.x are released, not alpha)

**Key unknowns requiring validation during implementation:**

- Exact color.js peer dependency version requirement
- Visual acceptability of OKLCH→sRGB conversion for Phoenix palette
- Token set naming preference (flat vs hierarchical)
- Whether composite token expansion applies to Phoenix's separated typography tokens
