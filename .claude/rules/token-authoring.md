---
paths:
  - packages/tokens/src/tokens/**/*.json
  - packages/tokens/src/build.mjs
---

# Token Authoring Rules

## Token File Structure

All token files use DTCG (Design Tokens Community Group) format.

**Format:**

```json
{
  "category": {
    "name": {
      "$value": "value-here",
      "$type": "type-here",
      "$description": "Optional description"
    }
  }
}
```

**Example (spacing.json):**

```json
{
  "spacing": {
    "0": {
      "$value": "0px",
      "$type": "dimension",
      "$description": "Zero spacing"
    },
    "1": {
      "$value": "8px",
      "$type": "dimension",
      "$description": "Base spacing unit"
    },
    "2": {
      "$value": "16px",
      "$type": "dimension",
      "$description": "2 × base unit"
    }
  }
}
```

## Color Token Rules

### OKLCH Format Required

ALL colors MUST use OKLCH format: `oklch(L C H)`.

- **L** (Lightness): 0-1 (0 = black, 1 = white)
- **C** (Chroma): 0-0.4 (0 = grayscale, 0.4 = highly saturated)
- **H** (Hue): 0-360 (degrees on color wheel)

**Example:**

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

### Light and Dark Mode

- **Light mode tokens:** `packages/tokens/src/tokens/colors.json`
- **Dark mode overrides:** `packages/tokens/src/tokens/colors.dark.json`

Dark mode file contains ONLY values that differ from light mode.

**Example (colors.dark.json):**

```json
{
  "color": {
    "semantic": {
      "background": {
        "$value": "{color.neutral.950}",
        "$type": "color",
        "$description": "Dark mode background"
      }
    }
  }
}
```

### Semantic Token Naming

Follow shadcn/ui semantic token convention:

- `background` / `foreground` - Page background and default text
- `primary` / `primary-foreground` - Primary actions and their text
- `secondary` / `secondary-foreground` - Secondary actions and their text
- `muted` / `muted-foreground` - Muted/subtle content
- `accent` / `accent-foreground` - Hover states and highlights
- `destructive` / `destructive-foreground` - Destructive actions (delete, error)
- `border` - Borders on inputs, cards, separators
- `input` - Input field background
- `ring` - Focus ring color

### Color Scale Tokens

Use numbered steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

**Example:**

```json
{
  "color": {
    "neutral": {
      "50": { "$value": "oklch(0.985 0 0)", "$type": "color" },
      "100": { "$value": "oklch(0.97 0 0)", "$type": "color" },
      "500": { "$value": "oklch(0.647 0 0)", "$type": "color" },
      "950": { "$value": "oklch(0.15 0 0)", "$type": "color" }
    }
  }
}
```

## Non-Color Token Rules

### Spacing Tokens

- **Base unit:** 8px
- **Multipliers:** 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
- **Type:** `"dimension"`
- **Units:** Include `px` in $value

**Example:**

```json
{
  "spacing": {
    "4": {
      "$value": "32px",
      "$type": "dimension",
      "$description": "4 × base unit"
    }
  }
}
```

### Typography Tokens

**Font Family:**

```json
{
  "typography": {
    "font-family": {
      "sans": {
        "$value": "Inter, system-ui, sans-serif",
        "$type": "fontFamily"
      }
    }
  }
}
```

**Font Size (use rem units):**

```json
{
  "typography": {
    "font-size": {
      "base": { "$value": "1rem", "$type": "fontSize" },
      "lg": { "$value": "1.125rem", "$type": "fontSize" }
    }
  }
}
```

**Font Weight:**

```json
{
  "typography": {
    "font-weight": {
      "normal": { "$value": "400", "$type": "fontWeight" },
      "medium": { "$value": "500", "$type": "fontWeight" },
      "bold": { "$value": "700", "$type": "fontWeight" }
    }
  }
}
```

**Line Height:**

```json
{
  "typography": {
    "line-height": {
      "normal": { "$value": "1.5", "$type": "lineHeight" },
      "tight": { "$value": "1.25", "$type": "lineHeight" }
    }
  }
}
```

### Border Radius Tokens

- **Type:** `"dimension"`
- **Units:** Use rem for scalability

**Example:**

```json
{
  "border-radius": {
    "sm": { "$value": "0.25rem", "$type": "dimension" },
    "md": { "$value": "0.5rem", "$type": "dimension" },
    "lg": { "$value": "0.75rem", "$type": "dimension" }
  }
}
```

## After Editing Tokens

### 1. Build tokens

```bash
cd packages/tokens
pnpm build
```

This runs `src/build.mjs` which generates CSS files in `dist/`.

**Expected output:**

```
css
✔︎ dist/tokens.css
✔︎ dist/tokens.dark.css
```

### 2. Check output files

Verify generated CSS in `packages/tokens/dist/`:

- `tokens.css` - Light mode CSS variables
- `tokens.dark.css` - Dark mode CSS variables (under `.dark` selector)

### 3. Update CSS files if adding new semantic tokens

If you added NEW semantic tokens (not scale values), update BOTH:

- `apps/web/src/index.css` - @theme section
- `apps/storybook/stories/index.css` - @theme section

**IMPORTANT:** Both files must stay in sync. Copy the ENTIRE @theme section from web to storybook.

**Example @theme entry:**

```css
@theme {
  --color-primary: oklch(0.647 0.186 264.54);
  --color-primary-foreground: oklch(0.985 0 0);
}
```

## Token Reference Syntax

Use curly braces to reference other tokens:

```json
{
  "color": {
    "semantic": {
      "background": {
        "$value": "{color.neutral.50}",
        "$type": "color"
      }
    }
  }
}
```

This creates an alias. Style Dictionary resolves references during build.

## Anti-Patterns

### 1. No hex colors

```json
// WRONG
{ "$value": "#3b82f6", "$type": "color" }

// CORRECT
{ "$value": "oklch(0.647 0.186 264.54)", "$type": "color" }
```

**Why:** OKLCH provides perceptual uniformity, wide gamut P3 support, and better accessibility for color modifications.

### 2. No px in spacing $value raw numbers

```json
// WRONG - raw number without unit
{ "$value": "32", "$type": "dimension" }

// CORRECT - include px unit
{ "$value": "32px", "$type": "dimension" }
```

**Why:** DTCG spec requires units for dimension type. Style Dictionary expects units in source.

### 3. No hardcoded values in components

```tsx
// WRONG - hardcoded color in component
<button className="bg-[#3b82f6]">Click</button>

// CORRECT - reference token via Tailwind utility
<button className="bg-primary">Click</button>
```

**Why:** Tokens enable theme switching. Hardcoded values bypass the design system.

### 4. No editing dist/ files

```bash
# WRONG - editing generated file
vim packages/tokens/dist/tokens.css

# CORRECT - edit source, then rebuild
vim packages/tokens/src/tokens/colors.json
cd packages/tokens && pnpm build
```

**Why:** dist/ files are auto-generated. Changes will be overwritten on next build.

### 5. No RGB or HSL color formats

```json
// WRONG
{ "$value": "rgb(59, 130, 246)", "$type": "color" }
{ "$value": "hsl(217, 91%, 60%)", "$type": "color" }

// CORRECT
{ "$value": "oklch(0.647 0.186 264.54)", "$type": "color" }
```

**Why:** OKLCH is the standard for this design system. Mixing formats breaks consistency.

### 6. No missing $type property

```json
// WRONG - missing $type
{
  "spacing": {
    "4": { "$value": "32px" }
  }
}

// CORRECT
{
  "spacing": {
    "4": { "$value": "32px", "$type": "dimension" }
  }
}
```

**Why:** $type is required by DTCG spec. Style Dictionary uses it for transformations.

## Build Configuration

The build process uses Style Dictionary with two separate instances:

**Light mode (build.mjs):**

```javascript
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
```

**Dark mode (build.mjs):**

```javascript
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

**Do not modify build.mjs** unless changing build output format.

---

**Path-scoped** to `packages/tokens/src/tokens/**/*.json` and `packages/tokens/src/build.mjs`.
