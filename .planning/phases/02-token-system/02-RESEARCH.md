# Phase 2: Token System - Research

**Researched:** 2026-02-01
**Domain:** Design token pipelines with Style Dictionary 4 and Tailwind CSS 4
**Confidence:** HIGH

## Summary

The design token ecosystem has undergone significant changes in 2025-2026 with the DTCG specification reaching first stable version (October 2025) and Tailwind CSS v4 shifting to CSS-first configuration via the `@theme` directive. Style Dictionary v4 (current version) provides native DTCG format support and ESM modules, while Tailwind v4 exposes all design tokens as CSS variables by default.

The standard approach is a Style Dictionary build pipeline that transforms DTCG-formatted JSON tokens into both CSS custom properties and Tailwind preset files. Components consume semantic tokens (--background, --foreground, --primary) following shadcn/ui conventions, with dark mode implemented via class strategy and protected against flash-of-wrong-theme using inline scripts.

Key architecture decisions center on OKLCH color format (perceptually uniform, wide gamut), flat JSON token files per category (colors.json, spacing.json, etc.), and semantic token naming that follows shadcn/ui patterns for immediate ecosystem compatibility.

**Primary recommendation:** Use Style Dictionary v4 with DTCG format to generate CSS custom properties in OKLCH format, output a Tailwind preset for utility classes, and implement class-based dark mode with localStorage persistence plus inline script protection against theme flash.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library           | Version | Purpose                                              | Why Standard                                                                    |
| ----------------- | ------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| style-dictionary  | 4.x     | Transform design tokens to platform-specific formats | Industry standard, DTCG-compatible, 7K+ GitHub stars, used by major companies   |
| @tailwindcss/vite | 4.x     | Tailwind CSS v4 via Vite                             | CSS-first configuration, native CSS variables, official Tailwind v4 integration |

### Supporting

| Library                    | Version | Purpose                                        | When to Use                            |
| -------------------------- | ------- | ---------------------------------------------- | -------------------------------------- |
| sd-tailwindcss-transformer | 2.2.1   | Generate Tailwind config from Style Dictionary | When outputting Tailwind preset format |

### Alternatives Considered

| Instead of       | Could Use                  | Tradeoff                                                                      |
| ---------------- | -------------------------- | ----------------------------------------------------------------------------- |
| Style Dictionary | Vanilla CSS                | Lose automation, token versioning, multi-platform output, DTCG compatibility  |
| OKLCH colors     | HSL colors                 | Lose perceptual uniformity, wide gamut support (P3), accessibility guarantees |
| DTCG format      | Style Dictionary v3 format | Lose Figma/Tokens Studio interop, industry standard compliance                |

**Installation:**

```bash
pnpm add -D style-dictionary@latest
pnpm add @tailwindcss/vite@next
```

## Architecture Patterns

### Recommended Project Structure

```
packages/tokens/
├── src/
│   ├── tokens/              # Source token files (DTCG format)
│   │   ├── colors.json      # Color scales + semantic colors
│   │   ├── colors.dark.json # Dark mode color overrides
│   │   ├── spacing.json     # Spacing scale
│   │   ├── typography.json  # Font sizes, line heights, families
│   │   └── radii.json       # Border radius scale
│   ├── build.mjs            # Style Dictionary build script (ESM)
│   └── config.mjs           # Style Dictionary config (ESM)
├── dist/                    # Generated outputs
│   ├── tokens.css           # CSS custom properties
│   └── tailwind-preset.js   # Tailwind config preset
├── package.json
└── tsconfig.json
```

### Pattern 1: DTCG Token Format

**What:** Design Tokens Community Group specification v1 (stable October 2025)
**When to use:** All token definitions for cross-tool compatibility

**Example:**

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "oklch(0.55 0.22 265.75)",
        "$type": "color",
        "$description": "Primary brand color for buttons, links, and key actions"
      }
    }
  },
  "spacing": {
    "4": {
      "$value": "32px",
      "$type": "dimension",
      "$description": "Base spacing unit (8px base × 4)"
    }
  }
}
```

### Pattern 2: Multi-File Dark Mode Method

**What:** Separate token files for light and dark color schemes, Style Dictionary builds both sets
**When to use:** When dark mode requires independently curated colors (not inverted scales)

**Example:**

```javascript
// src/config.mjs
export default {
  source: ['src/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      files: [
        {
          destination: 'dist/tokens.css',
          format: 'css/variables',
          filter: (token) => !token.filePath.includes('.dark.json'),
        },
        {
          destination: 'dist/tokens.dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('.dark.json'),
          options: {
            selector: '.dark',
          },
        },
      ],
    },
  },
}
```

### Pattern 3: Tailwind v4 CSS-First Configuration

**What:** Use `@theme` directive to define design tokens in CSS instead of tailwind.config.js
**When to use:** Tailwind CSS v4 projects (required pattern, not optional)

**Example:**

```css
/* app.css */
@import 'tailwindcss';
@import '../tokens/dist/tokens.css';

@theme {
  /* Tokens from Style Dictionary become Tailwind utilities */
  --color-primary-500: var(--color-primary-500);
  --spacing-4: var(--spacing-4);
}
```

### Pattern 4: Flash-of-Wrong-Theme Prevention

**What:** Inline script in HTML `<head>` that runs synchronously before first paint
**When to use:** Always, when implementing dark mode with localStorage persistence

**Example:**

```html
<!-- apps/web/index.html -->
<script>
  ;(function () {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const theme = stored || (prefersDark ? 'dark' : 'light')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  })()
</script>
```

### Anti-Patterns to Avoid

- **Component-specific token names:** Creates sprawl, reduces reusability (use semantic names like --primary, not --button-background)
- **Type property on parent groups:** DTCG requires `$type` on individual tokens, not ancestors
- **Hardcoded color values in components:** Always reference tokens, never use raw hex/rgb/oklch in component code
- **JavaScript theme initialization in React:** Causes hydration mismatch and flash, use inline script instead
- **Over-engineering token layers initially:** Start with base + semantic tokens, add abstraction layers only when needed

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                    | Don't Build                       | Use Instead                                                    | Why                                                                                                  |
| -------------------------- | --------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Color palette generation   | Manual color picker + spreadsheet | Design tool (Figma Variables) or OKLCH generator + DTCG export | Perceptual uniformity, accessibility contrast ratios, wide gamut support are mathematically complex  |
| Token transformation       | Custom Node.js scripts            | Style Dictionary with built-in transforms                      | Cross-platform consistency, DTCG compatibility, battle-tested edge cases                             |
| Dark mode color inversion  | Automated HSL lightness inversion | Hand-curated dark palette in separate token file               | Inverted scales look wrong (blue-500 in dark != inverted blue-500 from light), accessibility issues  |
| Tailwind preset generation | Manual JavaScript object mapping  | sd-tailwindcss-transformer plugin                              | Handles naming conventions, type conversions, nested structures automatically                        |
| Theme flash prevention     | useEffect + useState              | Inline `<script>` in HTML head                                 | useEffect runs after hydration, causing visible flash; inline script runs synchronously before paint |

**Key insight:** Design token tooling has matured significantly in 2025-2026 with DTCG standardization. Custom solutions miss ecosystem interoperability (Figma, Tokens Studio, Sketch) and introduce maintenance burden.

## Common Pitfalls

### Pitfall 1: Turborepo Cache Invalidation Missing Token Files

**What goes wrong:** Developer changes color token, runs `pnpm build`, but Tailwind preset isn't regenerated due to stale cache
**Why it happens:** Default Turborepo config doesn't track token JSON files as inputs for build tasks
**How to avoid:** Explicitly add token files to `inputs` array in turbo.json build task:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "src/tokens/**/*.json"],
      "outputs": ["dist/**"]
    }
  }
}
```

**Warning signs:** Build completes instantly even after token changes, generated CSS doesn't reflect new values

### Pitfall 2: HSL Format in Tailwind v4 with OKLCH Tokens

**What goes wrong:** Tokens defined in OKLCH but Tailwind utilities generate HSL, causing color shifts and loss of P3 gamut
**Why it happens:** Tailwind v4 defaults to HSL for color utilities unless color format is explicitly preserved
**How to avoid:** Use OKLCH format in both token source and CSS output, ensure transformers preserve color space
**Warning signs:** Vibrant P3 colors appear desaturated, color picker values don't match rendered colors

### Pitfall 3: React Hydration Errors with Tailwind v4 in Production

**What goes wrong:** Development builds work fine, production builds throw React hydration error #418
**Why it happens:** Tailwind v4 generates separate CSS files for server/client bundles in production, causing class mismatches
**How to avoid:** Known Tailwind v4 issue (as of early 2026), monitor GitHub issues, consider staying on v3 if hydration stability is critical
**Warning signs:** Errors only in production builds (`pnpm build` + preview), not in dev server

### Pitfall 4: Type Property Placement in DTCG Format

**What goes wrong:** Style Dictionary fails to parse tokens or exports incorrect types
**Why it happens:** DTCG spec requires `$type` at token level, not parent group level (unlike Style Dictionary v3 format)
**How to avoid:** Always place `$type` on individual tokens:

```json
// WRONG
{
  "color": {
    "$type": "color",
    "primary": { "$value": "oklch(...)" }
  }
}

// CORRECT
{
  "color": {
    "primary": {
      "$value": "oklch(...)",
      "$type": "color"
    }
  }
}
```

**Warning signs:** Build errors mentioning missing type, tokens exported as strings instead of typed values

### Pitfall 5: Dark Mode Tokens Not Scoped to .dark Selector

**What goes wrong:** Dark mode colors applied globally, breaking light mode
**Why it happens:** Forgot to configure selector option in Style Dictionary dark mode file output
**How to avoid:** Explicitly set `options.selector` for dark token output files (see Pattern 2 above)
**Warning signs:** Both light and dark colors present in browser DevTools :root, toggling .dark class has no effect

## Code Examples

Verified patterns from official sources:

### Style Dictionary v4 ESM Build Script

```javascript
// packages/tokens/src/build.mjs
// Source: https://styledictionary.com/
import StyleDictionary from 'style-dictionary'

const sd = new StyleDictionary({
  source: ['src/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          filter: (token) => !token.filePath.includes('.dark.json'),
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'tokens.dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('.dark.json'),
          options: {
            selector: '.dark',
            outputReferences: true,
          },
        },
      ],
    },
  },
})

await sd.buildAllPlatforms()
```

### DTCG Color Tokens with OKLCH

```json
// packages/tokens/src/tokens/colors.json
{
  "color": {
    "neutral": {
      "50": {
        "$value": "oklch(0.985 0 0)",
        "$type": "color",
        "$description": "Lightest neutral for backgrounds"
      },
      "500": {
        "$value": "oklch(0.53 0.016 256.85)",
        "$type": "color",
        "$description": "Mid-range neutral for borders, disabled states"
      },
      "950": {
        "$value": "oklch(0.172 0.01 256.85)",
        "$type": "color",
        "$description": "Darkest neutral for text"
      }
    },
    "semantic": {
      "background": {
        "$value": "{color.neutral.50}",
        "$type": "color",
        "$description": "Default page background"
      },
      "foreground": {
        "$value": "{color.neutral.950}",
        "$type": "color",
        "$description": "Default text color"
      },
      "primary": {
        "$value": "{color.primary.500}",
        "$type": "color"
      }
    }
  }
}
```

### Dark Mode Color Overrides

```json
// packages/tokens/src/tokens/colors.dark.json
{
  "color": {
    "semantic": {
      "background": {
        "$value": "oklch(0.172 0.01 256.85)",
        "$type": "color",
        "$description": "Dark mode page background"
      },
      "foreground": {
        "$value": "oklch(0.985 0 0)",
        "$type": "color",
        "$description": "Dark mode text color"
      }
    }
  }
}
```

### shadcn/ui Semantic Token Structure

```css
/* Source: https://ui.shadcn.com/docs/theming */
@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.172 0.01 256.85);

    --card: oklch(1 0 0);
    --card-foreground: oklch(0.172 0.01 256.85);

    --primary: oklch(0.55 0.22 265.75);
    --primary-foreground: oklch(0.985 0 0);

    --secondary: oklch(0.961 0.013 256.85);
    --secondary-foreground: oklch(0.172 0.01 256.85);

    --muted: oklch(0.961 0.013 256.85);
    --muted-foreground: oklch(0.478 0.015 256.85);

    --accent: oklch(0.961 0.013 256.85);
    --accent-foreground: oklch(0.172 0.01 256.85);

    --destructive: oklch(0.576 0.214 27.325);
    --destructive-foreground: oklch(0.985 0 0);

    --border: oklch(0.898 0.015 256.85);
    --input: oklch(0.898 0.015 256.85);
    --ring: oklch(0.55 0.22 265.75);

    --radius: 0.5rem;
  }

  .dark {
    --background: oklch(0.172 0.01 256.85);
    --foreground: oklch(0.985 0 0);
    /* ... dark mode overrides */
  }
}
```

### Tailwind v4 Configuration with Tokens

```css
/* apps/web/app.css */
/* Source: https://tailwindcss.com/blog/tailwindcss-v4 */
@import 'tailwindcss';
@import '@phoenix/tokens/dist/tokens.css';

@theme {
  /* Map CSS variables to Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  /* Spacing scale */
  --spacing-1: var(--spacing-1);
  --spacing-2: var(--spacing-2);
  --spacing-4: var(--spacing-4);

  /* Typography */
  --font-size-base: var(--font-size-base);
  --line-height-base: var(--line-height-base);
}
```

### Dark Mode Toggle Component

```typescript
// apps/web/src/components/theme-toggle.tsx
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = (stored as 'light' | 'dark') || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## State of the Art

| Old Approach                                 | Current Approach                        | When Changed                      | Impact                                                                    |
| -------------------------------------------- | --------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| Tailwind config in tailwind.config.js        | `@theme` directive in CSS               | Tailwind v4 (Dec 2024)            | Single source of truth, runtime access to tokens, simpler maintenance     |
| HSL color format                             | OKLCH color format                      | 2025-2026 adoption surge          | Perceptual uniformity, P3 wide gamut, better accessibility contrast       |
| Style Dictionary v3 format (`value`, `type`) | DTCG format (`$value`, `$type`)         | DTCG v1 stable Oct 2025           | Cross-tool interoperability (Figma, Tokens Studio, Sketch)                |
| Custom dark mode scripts                     | Class-based strategy with inline script | Tailwind v3 introduced class mode | Better SSR compatibility, prevents flash, user override support           |
| Fixed typography scales                      | Fluid typography with clamp()           | 2025-2026 trend                   | Responsive text without breakpoints, better mobile-to-desktop transitions |

**Deprecated/outdated:**

- **Style Dictionary v3 format:** Still works but lose DTCG ecosystem compatibility
- **eslint-plugin-tailwindcss:** Incompatible with Tailwind v4, removed from ecosystem
- **Tailwind config JavaScript exports:** Replaced by CSS-first `@theme` in v4
- **RGB/Hex color formats:** OKLCH is new standard for design systems (as of 2026)

## Open Questions

Things that couldn't be fully resolved:

1. **Style Dictionary v5 Status**
   - What we know: Documentation references v4 as current (Jan 2026), GitHub README links to v4 migration
   - What's unclear: Context mentions "Style Dictionary v5.1" but no official v5 release found in docs/GitHub
   - Recommendation: Proceed with v4 (confirmed stable), monitor releases, plan for easy upgrade path

2. **Tailwind v4 React Hydration Issues**
   - What we know: Known production-only hydration errors with React SSR (error #418), generates separate CSS for server/client
   - What's unclear: Timeline for fix, workarounds beyond "stay on v3"
   - Recommendation: For apps/web demo, hydration errors may be acceptable; for production components (packages/ui in Phase 3), validate behavior or consider v3

3. **Optimal Typography Scale Approach**
   - What we know: Fluid typography is 2026 trend, uses clamp() for viewport-based scaling, fixed scales simpler
   - What's unclear: Best practice for component library context (shared by multiple apps with different viewport ranges)
   - Recommendation: Start with fixed scale (simpler, predictable), provide fluid option as enhancement later if needed

4. **CSS Variable Namespace Prefix**
   - What we know: shadcn/ui uses no prefix (--primary, --background), some systems use prefixes (--ph-primary)
   - What's unclear: Risk of collision in real-world apps, whether prefix adds or reduces developer friction
   - Recommendation: No prefix (follow shadcn/ui convention for ecosystem compatibility), document collision avoidance in migration guide

## Sources

### Primary (HIGH confidence)

- [Style Dictionary Official Docs](https://styledictionary.com/) - v4 features, DTCG support, configuration
- [Style Dictionary GitHub](https://github.com/style-dictionary/style-dictionary) - Version confirmation, installation
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) - `@theme` directive, CSS-first config
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) - Token configuration syntax
- [shadcn/ui Theming Docs](https://ui.shadcn.com/docs/theming) - Semantic token names and values
- [DTCG Official Site](https://www.designtokens.org/) - Specification overview
- [DTCG Style Dictionary Integration](https://styledictionary.com/info/dtcg/) - Format syntax requirements
- [W3C DTCG First Stable Version Announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) - October 2025 v1 release

### Secondary (MEDIUM confidence)

- [Dark Mode with Style Dictionary (Danny Banks)](https://dbanks.design/blog/dark-mode-with-style-dictionary/) - Multi-file method, verified approach
- [OKLCH in CSS (Evil Martians)](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) - Color format benefits
- [Flash-of-Wrong-Theme Prevention Patterns](https://dev.to/gaisdav/how-to-prevent-theme-flash-in-a-react-instant-dark-mode-switching-o20) - Inline script technique
- [Turborepo Cache Invalidation](https://vercel.com/academy/production-monorepos/turborepo-basics) - Inputs configuration
- [Style Dictionary Tailwind Transformer](https://www.npmjs.com/package/sd-tailwindcss-transformer) - Plugin for preset generation
- [Common Design Token Mistakes](https://designtokens.substack.com/p/common-mistakes-in-design-tokens) - Community patterns

### Tertiary (LOW confidence)

- WebSearch results for "Style Dictionary 5.1" - No official confirmation found, likely context error
- WebSearch results for Tailwind v4 hydration issues - Multiple reports but no official resolution timeline

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Style Dictionary v4 and Tailwind v4 officially documented and stable
- Architecture: HIGH - DTCG format official spec v1, shadcn/ui patterns widely adopted, dark mode patterns proven
- Pitfalls: MEDIUM - Turborepo cache issues verified, Tailwind v4 hydration errors reported but evolving
- OKLCH format: HIGH - Official CSS spec, browser support >93%, industry trend confirmed

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - stable ecosystem, but Tailwind v4 still evolving with potential breaking changes)
