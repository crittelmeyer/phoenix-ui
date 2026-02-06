# Architecture Research: Figma Integration

**Researched:** 2026-02-06
**Confidence:** HIGH (verified via official documentation)

## Executive Summary

Phoenix's existing architecture is well-positioned for Figma integration. The token pipeline uses Style Dictionary 5 with DTCG format, and component scaffolding (.figma.tsx files) already exists. Two integration paths need to be wired:

1. **Token Flow (Figma to Code):** Figma Variables/Tokens Studio exports JSON that Style Dictionary transforms into CSS custom properties
2. **Component Display (Code to Figma):** Code Connect CLI publishes .figma.tsx mappings so components appear in Figma Dev Mode

Key architectural insight: Phoenix already uses DTCG format (`$value`, `$type`) which aligns with Tokens Studio's W3C DTCG export option. The existing Style Dictionary build script needs modification to handle Tokens Studio's multi-file export structure and theming configuration.

## Data Flow

```
                     TOKENS FLOW (Figma to Code)
    +---------------------------------------------------------------------------+
    |                                                                           |
    |  Figma Variables ─────> Tokens Studio Plugin ─────> Export JSON           |
    |       ^                       |                         |                 |
    |       |                       v                         v                 |
    |  (source of truth)      $themes.json             Token Set Files          |
    |                         (theme config)           (colors.json, etc.)      |
    |                               |                         |                 |
    |                               v                         v                 |
    |                         @tokens-studio/sd-transforms                      |
    |                         (preprocessors + transforms)                      |
    |                                        |                                  |
    |                                        v                                  |
    |                              Style Dictionary 5                           |
    |                              (build.mjs)                                  |
    |                                        |                                  |
    |                                        v                                  |
    |                         dist/tokens.css + dist/tokens.dark.css            |
    |                                        |                                  |
    |                                        v                                  |
    |                         @theme directive (Tailwind CSS 4)                 |
    |                                        |                                  |
    |                                        v                                  |
    |                         Component Classes (bg-primary, etc.)              |
    |                                                                           |
    +---------------------------------------------------------------------------+

                     COMPONENT FLOW (Code to Figma)
    +---------------------------------------------------------------------------+
    |                                                                           |
    |  packages/ui/src/components/*.tsx ─────> *.figma.tsx mappings             |
    |       (React components)                    (prop mappings)               |
    |                                                  |                        |
    |                                                  v                        |
    |                                         figma.config.json                 |
    |                                         (Code Connect config)             |
    |                                                  |                        |
    |                                                  v                        |
    |                                    npx figma connect publish              |
    |                                    (Code Connect CLI)                     |
    |                                                  |                        |
    |                                                  v                        |
    |                                         Figma Dev Mode                    |
    |                                    (shows code snippets)                  |
    |                                                                           |
    +---------------------------------------------------------------------------+
```

## Current State Analysis

### Token Pipeline (packages/tokens)

**What Exists:**

```
packages/tokens/
├── src/
│   ├── tokens/           # Hand-authored DTCG JSON
│   │   ├── colors.json          # OKLCH values, semantic aliases
│   │   ├── colors.dark.json     # Dark mode semantic overrides
│   │   ├── spacing.json         # 8px base unit scale
│   │   ├── typography.json      # Font sizes, weights, line heights
│   │   └── radii.json           # Border radius scale
│   ├── build.mjs         # Vanilla Style Dictionary 5 config
│   └── index.ts          # Package entry (empty)
├── dist/
│   ├── tokens.css        # :root { --color-* }
│   └── tokens.dark.css   # .dark { --color-* }
└── package.json          # style-dictionary: ^5.2.0
```

**Key Observations:**

- Uses DTCG format (`$value`, `$type`, `$description`) - compatible with Tokens Studio
- OKLCH color format throughout - superior for P3 gamut
- Light/dark handled via separate source files - different from Tokens Studio themes
- No @tokens-studio/sd-transforms installed yet

**Current build.mjs (30 lines):**

```javascript
import StyleDictionary from 'style-dictionary'

const sdLight = new StyleDictionary({
  source: ['src/tokens/**/!(*.dark).json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
  },
})

const sdDark = new StyleDictionary({
  source: ['src/tokens/**/*.dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.dark.css',
          format: 'css/variables',
          options: { selector: '.dark', outputReferences: true },
        },
      ],
    },
  },
})

await sdLight.buildAllPlatforms()
await sdDark.buildAllPlatforms()
```

### Component Library (packages/ui)

**What Exists:**

```
packages/ui/src/components/
├── button.tsx
├── button.figma.tsx      # Scaffolding with placeholder URL
├── dialog.tsx
├── dialog.figma.tsx      # Scaffolding with placeholder URL
├── ... (14 components, 14 .figma.tsx files)
```

**Current .figma.tsx Pattern (button.figma.tsx):**

```tsx
import React from 'react'
import figma from '@figma/code-connect'
import { Button } from './button'

figma.connect(
  Button,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID', // Placeholder
  {
    props: {
      variant: figma.enum('Variant', {
        Default: 'default',
        Destructive: 'destructive',
        Outline: 'outline',
        Secondary: 'secondary',
        Ghost: 'ghost',
        Link: 'link',
      }),
      size: figma.enum('Size', {
        Default: 'default',
        Small: 'sm',
        Large: 'lg',
        Icon: 'icon',
      }),
      disabled: figma.boolean('Disabled'),
      children: figma.string('Label'),
    },
    example: (props) => <Button {...props} />,
  },
)
```

**Key Observations:**

- @figma/code-connect already installed (v1.3.12)
- All 14 components have .figma.tsx scaffolding
- Prop mappings defined but not tested against real Figma
- URLs are placeholders that need real node IDs

**Current figma.config.json:**

```json
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React"
  },
  "documentUrlSubstitutions": {}
}
```

### Build Pipeline

**What Exists:**

- turbo.json: `build` task depends on `^build` (packages first)
- tokens build: `node src/build.mjs` (outputs CSS)
- ui build: `echo 'No build step yet'` (source exports for HMR)
- No Figma-related scripts in pipeline

## Integration Points

### Token Pipeline Changes

**New Dependency:**

```json
{
  "devDependencies": {
    "@tokens-studio/sd-transforms": "^1.0.0",
    "style-dictionary": "^5.2.0"
  }
}
```

**New Directory Structure:**

```
packages/tokens/src/
├── tokens/               # KEEP: Original seed tokens (fallback)
│   └── ... existing files
├── figma/                # NEW: Tokens Studio exports
│   ├── $themes.json      # Theme configuration
│   ├── core/             # Shared tokens across themes
│   │   ├── colors.json
│   │   ├── spacing.json
│   │   └── typography.json
│   └── themes/           # Theme-specific token sets
│       ├── light.json    # Light mode semantic values
│       └── dark.json     # Dark mode semantic values
└── build.mjs             # MODIFY: Use sd-transforms
```

**Modified build.mjs Pattern:**

```javascript
import fs from 'fs'
import { permutateThemes, register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Register Tokens Studio transforms
register(StyleDictionary)

// Check if Figma tokens exist, fall back to seed tokens
const hasFigmaTokens = fs.existsSync('src/figma/$themes.json')

if (hasFigmaTokens) {
  // Tokens Studio flow: use $themes.json for theme permutation
  const themes = permutateThemes(
    JSON.parse(fs.readFileSync('src/figma/$themes.json', 'utf-8')),
  )

  for (const [themeName, tokenSets] of Object.entries(themes)) {
    const sd = new StyleDictionary({
      source: tokenSets.map((set) => `src/figma/${set}.json`),
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab'],
          buildPath: 'dist/',
          files: [
            {
              destination:
                themeName === 'light' ? 'tokens.css' : 'tokens.dark.css',
              format: 'css/variables',
              options: {
                selector: themeName === 'dark' ? '.dark' : ':root',
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
    await sd.buildAllPlatforms()
  }
} else {
  // Seed token flow: original build logic
  // ... existing code
}
```

### Component Library Changes

**figma.config.json Updates:**

```json
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React"
  },
  "documentUrlSubstitutions": {
    "FIGMA_FILE_KEY": "actual-file-key-here"
  }
}
```

**Per-Component Updates:**
Each .figma.tsx file needs:

1. Real Figma node URL (from component in Figma file)
2. Prop name verification (Figma property names are case-sensitive)
3. Variant value verification (must match Figma exactly)

**New Script in packages/ui/package.json:**

```json
{
  "scripts": {
    "figma:publish": "npx figma connect publish",
    "figma:unpublish": "npx figma connect unpublish"
  }
}
```

### Authentication Setup

**Environment Variable:**

```bash
# .env.local (gitignored)
FIGMA_ACCESS_TOKEN=figd_xxxxx
```

**Figma Token Scopes Required:**

- Code Connect: Write
- File content: Read

**CI/CD Consideration:**
Store `FIGMA_ACCESS_TOKEN` as GitHub Actions secret for automated publishing.

## File Structure: Complete Change List

```
packages/tokens/
├── src/
│   ├── tokens/           # UNCHANGED: Original seed tokens
│   │   ├── colors.json
│   │   ├── colors.dark.json
│   │   ├── spacing.json
│   │   ├── typography.json
│   │   └── radii.json
│   ├── figma/            # NEW: Tokens Studio export location
│   │   ├── $themes.json  # NEW: Theme configuration
│   │   ├── core/         # NEW: Core token sets
│   │   │   ├── colors.json
│   │   │   ├── spacing.json
│   │   │   └── typography.json
│   │   └── themes/       # NEW: Theme-specific overrides
│   │       ├── light.json
│   │       └── dark.json
│   └── build.mjs         # MODIFY: Add sd-transforms, theme handling
├── dist/                 # UNCHANGED: Output location
│   ├── tokens.css
│   └── tokens.dark.css
└── package.json          # MODIFY: Add @tokens-studio/sd-transforms

packages/ui/
├── src/
│   └── components/
│       ├── button.tsx           # UNCHANGED
│       ├── button.figma.tsx     # MODIFY: Real Figma URL
│       └── ... (all 14 .figma.tsx files need URL updates)
└── package.json                 # MODIFY: Add figma:publish script

figma.config.json                # MODIFY: Add documentUrlSubstitutions

.env.local                       # NEW: FIGMA_ACCESS_TOKEN (gitignored)
.gitignore                       # MODIFY: Add .env.local if missing
```

## Token Format Compatibility

### Phoenix Current Format (DTCG + OKLCH)

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "oklch(0.647 0.186 264.54)",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

### Tokens Studio DTCG Export (hex)

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#3b82f6",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

### Compatibility Analysis

| Aspect      | Current Phoenix | Tokens Studio   | Compatible?            |
| ----------- | --------------- | --------------- | ---------------------- |
| Format      | DTCG ($value)   | DTCG ($value)   | YES                    |
| Color space | OKLCH           | hex/rgba        | NO - conversion needed |
| Structure   | Flat files      | Multi-file sets | YES with changes       |
| Dark mode   | Separate file   | $themes.json    | YES with changes       |
| References  | Uses aliases    | Uses aliases    | YES                    |

### Color Format Decision

**Option A: Accept hex from Figma (Recommended for MVP)**

- Pros: Simpler pipeline, no conversion errors
- Cons: Lose OKLCH P3 gamut benefits
- Implementation: No extra transforms needed

**Option B: Convert to OKLCH in build**

- Pros: Maintain P3 gamut, consistent with current tokens
- Cons: Requires custom transform, potential color drift
- Implementation: Custom Style Dictionary transform

**Recommendation:** Start with hex for initial integration, add OKLCH conversion as enhancement later.

## Theme Handling Strategy

### Phoenix Current Pattern

- Light: `:root { --color-* }` from colors.json
- Dark: `.dark { --color-* }` from colors.dark.json

### Tokens Studio Pattern

```json
// $themes.json
[
  {
    "name": "light",
    "selectedTokenSets": {
      "core/colors": "enabled",
      "core/spacing": "enabled",
      "themes/light": "enabled"
    }
  },
  {
    "name": "dark",
    "selectedTokenSets": {
      "core/colors": "enabled",
      "core/spacing": "enabled",
      "themes/dark": "enabled"
    }
  }
]
```

### Migration Path

1. Maintain output format (tokens.css, tokens.dark.css)
2. Change source from single files to token set combinations
3. Use `permutateThemes` to build each theme separately
4. Output files unchanged - consumers unaffected

## Suggested Phase Order

### Phase 1: Token Pipeline Preparation

**Scope:**

- Install @tokens-studio/sd-transforms
- Create src/figma/ directory structure
- Update build.mjs with fallback logic
- Validate with mock Tokens Studio export

**Depends on:** Nothing
**Outputs:** Build script ready for Tokens Studio input
**Risk:** Low - additive changes only

### Phase 2: Figma Token Setup

**Scope:**

- Install Tokens Studio plugin in Figma
- Create token structure matching Phoenix
- Configure themes (light/dark)
- Export to src/figma/

**Depends on:** Phase 1 complete
**Outputs:** Working Figma-to-code token flow
**Risk:** Medium - requires Figma file and designer workflow

### Phase 3: Token Sync Workflow

**Scope:**

- Document export workflow for designers
- Create sync script or GitHub Action
- Validate token changes don't break components

**Depends on:** Phase 2 complete
**Outputs:** Repeatable designer-to-code process
**Risk:** Low - process documentation

### Phase 4: Code Connect Authentication

**Scope:**

- Generate Figma personal access token
- Configure FIGMA_ACCESS_TOKEN
- Test publish with single component

**Depends on:** Figma file exists
**Outputs:** Working Code Connect CLI
**Risk:** Low - straightforward setup

### Phase 5: Component Mapping

**Scope:**

- Update all 14 .figma.tsx with real URLs
- Verify prop mappings against Figma
- Publish all components

**Depends on:** Phase 4 validated
**Outputs:** All components visible in Dev Mode
**Risk:** Medium - bulk work, case-sensitive matching

### Phase 6: CI/CD Integration (Optional)

**Scope:**

- GitHub Action for token sync
- GitHub Action for Code Connect publish
- Branch protection rules

**Depends on:** Phases 1-5 validated
**Outputs:** Automated design-to-code sync
**Risk:** Low - automation of manual process

## API Reference

### @tokens-studio/sd-transforms

```javascript
import {
  expandTypesMap, // Handle composite tokens (typography, shadows)
  permutateThemes, // Generate theme combinations from $themes.json
  register, // Register all transforms with Style Dictionary
} from '@tokens-studio/sd-transforms'

// Registration
register(StyleDictionary, {
  excludeParentKeys: true, // Remove parent keys from token hierarchy
  platform: 'css', // Target platform
  withSDBuiltins: true, // Include Style Dictionary built-in transforms
})
```

### @figma/code-connect

```javascript
import figma from '@figma/code-connect'

figma.connect(Component, 'https://figma.com/...', {
  props: {
    // Map Figma properties to component props
    variant: figma.enum('PropertyName', { FigmaValue: 'codeValue' }),
    disabled: figma.boolean('PropertyName'),
    label: figma.string('PropertyName'),
    icon: figma.instance('LayerName'),
    children: figma.children('*'),
  },
  example: (props) => <Component {...props} />,
})
```

### CLI Commands

```bash
# Token build
cd packages/tokens && pnpm build

# Code Connect
npx figma connect publish --token=$FIGMA_ACCESS_TOKEN
npx figma connect unpublish --token=$FIGMA_ACCESS_TOKEN
```

## Risk Assessment

| Risk                     | Likelihood | Impact | Mitigation                            |
| ------------------------ | ---------- | ------ | ------------------------------------- |
| OKLCH color loss         | HIGH       | LOW    | Accept hex for MVP, enhance later     |
| Theme structure mismatch | MEDIUM     | MEDIUM | Test with mock export first           |
| Prop name mismatch       | HIGH       | LOW    | Audit Figma properties before mapping |
| Token structure drift    | MEDIUM     | HIGH   | Define contract, validate in CI       |
| Auth token expiry        | LOW        | LOW    | Document renewal process              |
| Build time increase      | LOW        | LOW    | sd-transforms is fast                 |

## Sources

**HIGH Confidence (Official Documentation):**

- [@tokens-studio/sd-transforms GitHub](https://github.com/tokens-studio/sd-transforms) - Style Dictionary integration patterns
- [Tokens Studio Style Dictionary docs](https://docs.tokens.studio/transform-tokens/style-dictionary) - Setup instructions
- [Figma Code Connect CLI Quickstart](https://developers.figma.com/docs/code-connect/quickstart-guide/) - Publishing workflow
- [Figma Code Connect React docs](https://developers.figma.com/docs/code-connect/react/) - Prop mapping functions
- [Tokens Studio Themes Overview](https://docs.tokens.studio/manage-themes/themes-overview) - Theme configuration
- [Tokens Studio DTCG Format](https://docs.tokens.studio/manage-settings/token-format) - Format compatibility

**MEDIUM Confidence (Verified via multiple sources):**

- sd-transforms v1.0.0+ requires Style Dictionary v5.0.0+
- Tokens Studio supports W3C DTCG format export
- permutateThemes handles multi-dimensional theming

**LOW Confidence (Needs validation):**

- OKLCH color conversion transform (custom implementation required)
- Exact Figma property names for Phoenix components (requires Figma file)
