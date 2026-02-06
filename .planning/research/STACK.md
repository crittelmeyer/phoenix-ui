# Technology Stack

**Project:** Phoenix Design System Monorepo Starter
**Researched:** 2026-02-06
**Overall Confidence:** HIGH

---

## V2 Figma Integration Additions

This section documents the stack additions required for the v2 Figma integration milestone. The existing v1 stack (React 18.3.0, Tailwind CSS 4, Style Dictionary 5, Radix UI, CVA) remains unchanged.

### Executive Summary

Phoenix needs three additions for complete Figma integration:

1. **@tokens-studio/sd-transforms v2.0.3** — Process Tokens Studio exports in Style Dictionary
2. **@figma/code-connect v1.3.13** — Publish component mappings to Figma Dev Mode
3. **Pietro Schirano shadcn/ui Figma kit** — Starting design file with Variables

The existing DTCG token format in Phoenix (`$value`, `$type`, `$description`) is already compatible with Tokens Studio's W3C DTCG export format, minimizing migration effort.

---

### Token Pipeline Addition

| Technology                       | Version | Purpose                       | Why                                                                                                                                                                                                                       | Confidence |
| -------------------------------- | ------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **@tokens-studio/sd-transforms** | ^2.0.3  | Process Tokens Studio exports | Required bridge between Tokens Studio plugin output and Style Dictionary. Handles Tokens Studio-specific token types (typography composites, color modifiers, math expressions) that raw Style Dictionary cannot process. | HIGH       |

**Integration with existing `build.mjs`:**

```javascript
import { register } from '@tokens-studio/sd-transforms'
import StyleDictionary from 'style-dictionary'

// Register Tokens Studio transforms BEFORE creating instances
register(StyleDictionary)

const sdLight = new StyleDictionary({
  source: ['src/tokens/**/!(*.dark).json'],
  preprocessors: ['tokens-studio'], // ADD THIS
  platforms: {
    css: {
      transformGroup: 'tokens-studio', // CHANGE FROM 'css'
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
})
```

**Key transforms provided:**

- `ts/descriptionToComment` — Maps `$description` to CSS comments
- `ts/resolveMath` — Resolves math expressions in token values
- `ts/typography/compose` — Handles composite typography tokens
- `ts/color/modifiers` — Processes color modifier functions
- `ts/opacity` — Converts opacity percentages to decimals

**Compatibility:**

- sd-transforms v2.0.0+ requires Style Dictionary v5.0.0+
- Phoenix uses Style Dictionary ^5.2.0 (compatible)
- sd-transforms v1.x is NOT compatible (requires SD v4)

**Source:** [GitHub - tokens-studio/sd-transforms](https://github.com/tokens-studio/sd-transforms)

---

### Code Connect Addition

| Technology              | Version | Purpose                    | Why                                                                                                                                                                 | Confidence |
| ----------------------- | ------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **@figma/code-connect** | ^1.3.13 | Publish component mappings | Enables Figma Dev Mode to display actual Phoenix component code instead of auto-generated snippets. Existing `.figma.tsx` files already follow the correct pattern. | HIGH       |

**CLI Commands:**

```bash
# Publish all Code Connect files
npx figma connect publish

# Dry run to verify before publishing
npx figma connect publish --dry-run

# Unpublish a specific component
npx figma connect unpublish --node=NODE_URL --label=React
```

**Authentication:**

```bash
# Set environment variable (recommended)
export FIGMA_ACCESS_TOKEN=figd_xxxxx

# Or pass token directly
npx figma connect publish --token=figd_xxxxx
```

**Token Requirements:**

- Personal access token from Figma account settings
- Scopes required: **Code Connect: Write** + **File content: Read**

**Existing scaffolding in Phoenix:**

Phoenix already has:

- `figma.config.json` at repo root (valid configuration)
- `.figma.tsx` files for all 14 components (placeholder URLs)
- Correct `figma.connect()` patterns with prop mappings

**What needs updating:**

- Replace `FIGMA_FILE_KEY` and `NODE_ID` placeholders with actual Figma URLs
- Add `FIGMA_ACCESS_TOKEN` to environment

**Source:** [Figma Code Connect Quickstart](https://developers.figma.com/docs/code-connect/quickstart-guide/)

---

### Figma Plugin (Designer Tooling)

| Tool                        | Version | Purpose                          | License                             | Confidence |
| --------------------------- | ------- | -------------------------------- | ----------------------------------- | ---------- |
| **Tokens Studio for Figma** | Latest  | Design token management in Figma | Pro ($15/mo/editor) for folder sync | HIGH       |

**Why Tokens Studio:**

- Industry-standard plugin for managing design tokens in Figma
- Supports W3C DTCG format (matches Phoenix's existing token structure)
- Bidirectional sync with GitHub
- Creates/updates Figma Variables from tokens

**License requirements:**

| Feature                 | Free | Pro |
| ----------------------- | ---- | --- |
| Single-file JSON sync   | Yes  | Yes |
| Multi-file folder sync  | No   | Yes |
| GitHub branch switching | No   | Yes |
| Themes feature          | No   | Yes |

**Recommendation:** Pro license for multi-file sync to match Phoenix's token file structure.

**GitHub sync configuration:**

```
Repository: [org]/phoenix
Branch: main (or figma-tokens for PR workflow)
File path: packages/tokens/src/tokens
Token format: W3C DTCG
Storage: Folder (multiple files)
```

**Token file mapping:**

| Tokens Studio Set | Phoenix File         |
| ----------------- | -------------------- |
| colors            | colors.json          |
| colors/dark       | colors.dark.json     |
| spacing           | spacing.json         |
| typography        | typography.json      |
| border-radius     | border-radius.json   |
| semantic          | semantic-colors.json |

**Source:** [Tokens Studio Documentation](https://docs.tokens.studio)

---

### Community Kit Recommendations

**Primary Recommendation:**

**@shadcn/ui - Design System (Variables and Theming)** by Pietro Schirano

- URL: https://www.figma.com/community/file/1314057472629730742
- Author: Pietro Schirano (@skirano)
- License: Free
- Components: All Radix components, matches Phoenix's 14 components
- Variables: Semantic color tokens, typography, spacing with modes
- Theming: Light/dark mode via Figma Variable modes

**Why this kit:**

1. Official shadcn/ui companion — maintained by community with blessing
2. Uses Figma Variables (not just Styles) — modern, supports modes
3. Includes all Radix primitives — matches Phoenix component set
4. Free — no commercial license required
5. Active updates — January 2026 version available

**Alternative Options:**

| Kit                             | URL                                                                        | Pros                                   | Cons                            |
| ------------------------------- | -------------------------------------------------------------------------- | -------------------------------------- | ------------------------------- |
| shadcn/ui with Tailwind classes | [Community file](https://www.figma.com/community/file/1342715840824755935) | Monthly updates, Tailwind class naming | More complex variable structure |
| Myna UI                         | [Community file](https://www.figma.com/community/file/1340017605248937608) | Premium quality, extensive             | Overkill for starter kit        |
| shadcn/ui: The Ultimate UI Kit  | [Community file](https://www.figma.com/community/file/1462213965300249379) | Very comprehensive                     | May have more than needed       |

**Plugin Helper:**

**Radix UI + ShadCN Variable Generator**

- URL: https://www.figma.com/community/plugin/1401977462200982932
- Purpose: Generates Figma Variables from Radix/shadcn color scales
- When to use: If starting from scratch instead of community kit

---

## Version Compatibility Matrix

| Tool                         | Version | Depends On               | Notes                       |
| ---------------------------- | ------- | ------------------------ | --------------------------- |
| style-dictionary             | ^5.2.0  | Node 18+                 | Already in Phoenix          |
| @tokens-studio/sd-transforms | ^2.0.3  | style-dictionary >=5.0.0 | v2.0 dropped SD v4 support  |
| @figma/code-connect          | ^1.3.13 | Node 18+                 | No React version conflicts  |
| Tokens Studio plugin         | Latest  | Figma Professional       | Pro license for folder sync |

**sd-transforms version history:**

| sd-transforms   | Style Dictionary           | Notes                     |
| --------------- | -------------------------- | ------------------------- |
| <= 0.12.2       | 3.0.0 - 4.0.0-prerelease.1 | Legacy                    |
| 0.13.0 - 0.14.4 | 4.0.0-prerelease.2 - 18    | Transition                |
| >= 0.16.0       | >= 4.0.0-prerelease.27     | Transition                |
| >= 1.0.0        | >= 4.0.0                   | Stable SD v4              |
| >= 2.0.0        | >= 5.0.0                   | **Use this** (SD v5 only) |

---

## Installation Commands

```bash
# In packages/tokens — add sd-transforms
pnpm add -D @tokens-studio/sd-transforms@^2.0.3

# In packages/ui — add Code Connect
pnpm add -D @figma/code-connect@^1.3.13
```

---

## Scripts to Add

**packages/ui/package.json:**

```json
{
  "scripts": {
    "figma:publish": "figma connect publish",
    "figma:publish:dry": "figma connect publish --dry-run"
  }
}
```

**Root package.json:**

```json
{
  "scripts": {
    "figma:publish": "turbo run figma:publish"
  }
}
```

---

## Environment Variables Required

```bash
# For Code Connect publishing
FIGMA_ACCESS_TOKEN=figd_xxxxx

# Token must have these scopes:
# - Code Connect: Write
# - File content: Read
```

**Recommendation:** Add to `.env.local` (gitignored) or CI secrets.

---

## figma.config.json Updates

Current Phoenix config:

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

**Updated for real Figma file:**

```json
{
  "codeConnect": {
    "include": ["packages/ui/src/components/**/*.figma.tsx"],
    "parser": "react",
    "label": "React"
  },
  "documentUrlSubstitutions": {
    "FIGMA_FILE_KEY": "actual-figma-file-key-here",
    "NODE_ID": ""
  }
}
```

**How documentUrlSubstitutions works:**

`.figma.tsx` files use placeholder URLs:

```typescript
figma.connect(
  Button,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    /* ... */
  },
)
```

At publish time, `FIGMA_FILE_KEY` is replaced with the actual key from the Figma file URL.

This pattern enables:

- Same code works across dev/staging/production Figma files
- URL changes centralized in config, not scattered across files

---

## What NOT to Add

| Tool                                      | Why Excluded                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| **@tokens-studio/sd-transforms v1.x**     | Only works with Style Dictionary v4. Phoenix uses v5.                             |
| **token-transformer**                     | Deprecated. sd-transforms is the successor.                                       |
| **Figma REST API direct calls**           | Code Connect CLI handles all publishing. No need for custom API integration.      |
| **style-dictionary v4.x**                 | Downgrade would lose performance benefits and break future sd-transforms updates. |
| **tokens-studio/configurator**            | Over-engineered for this use case. Direct sd-transforms integration is simpler.   |
| **Design Tokens plugin** (lukasoppermann) | Different token format, not DTCG compatible without conversion.                   |
| **Supernova**                             | Enterprise tool, overkill for starter kit. Tokens Studio covers needs.            |
| **Specify**                               | Commercial platform, not needed for Git-based workflow.                           |

---

## Sources

### Official Documentation

- [Tokens Studio Documentation](https://docs.tokens.studio)
- [Tokens Studio Token Format](https://docs.tokens.studio/manage-settings/token-format)
- [Tokens Studio GitHub Sync](https://docs.tokens.studio/token-storage/remote/sync-git-github)
- [Figma Code Connect Quickstart](https://developers.figma.com/docs/code-connect/quickstart-guide/)

### GitHub Releases

- [tokens-studio/sd-transforms Releases](https://github.com/tokens-studio/sd-transforms/releases) — v2.0.3 (Dec 10, 2025)
- [figma/code-connect Releases](https://github.com/figma/code-connect/releases) — v1.3.13 (Feb 2, 2026)
- [style-dictionary Releases](https://github.com/style-dictionary/style-dictionary/releases) — v5.1.1 current

### Figma Community

- [shadcn/ui Figma page](https://ui.shadcn.com/docs/figma)
- [@shadcn/ui Design System (Variables and Theming)](https://www.figma.com/community/file/1314057472629730742)
- [Radix UI + ShadCN Variable Generator](https://www.figma.com/community/plugin/1401977462200982932)

---

## Confidence Assessment

| Area                          | Confidence | Reason                                               |
| ----------------------------- | ---------- | ---------------------------------------------------- |
| sd-transforms version         | HIGH       | Verified via GitHub releases (v2.0.3 Dec 2025)       |
| SD v5 compatibility           | HIGH       | README explicitly states >=5.0.0 required for v2.0+  |
| Code Connect CLI              | HIGH       | npm shows v1.3.13 (Feb 2, 2026), docs verified       |
| Token format compatibility    | HIGH       | Phoenix already uses DTCG format, matches TS export  |
| Community kit                 | MEDIUM     | Based on community reputation, not tested in Phoenix |
| Tokens Studio Pro requirement | HIGH       | Official docs confirm multi-file sync requires Pro   |

**Overall Confidence: HIGH**

All package versions verified via GitHub releases and npm. Token format compatibility confirmed by reviewing Phoenix's existing DTCG-format tokens against Tokens Studio documentation.

---

## V1 Stack Reference (Unchanged)

The following v1 stack remains unchanged for the v2 milestone:

### Core Framework

| Technology | Version | Purpose                                        |
| ---------- | ------- | ---------------------------------------------- |
| React      | 18.3.0  | UI library (pinned due to Radix compatibility) |
| TypeScript | ^5.0.0  | Type system                                    |
| Vite       | Latest  | Build tool                                     |

### Monorepo

| Technology | Version | Purpose             |
| ---------- | ------- | ------------------- |
| pnpm       | 10.0.0  | Package manager     |
| Turborepo  | ^2.7.0  | Build orchestration |

### Styling

| Technology     | Version | Purpose                   |
| -------------- | ------- | ------------------------- |
| Tailwind CSS   | 4.x     | Utility-first CSS         |
| CVA            | ^0.7.1  | Variant management        |
| tailwind-merge | Latest  | Class conflict resolution |
| clsx           | Latest  | Conditional classes       |

### UI Primitives

| Technology | Version | Purpose             |
| ---------- | ------- | ------------------- |
| Radix UI   | Latest  | Headless components |

### Design Tokens

| Technology       | Version | Purpose              |
| ---------------- | ------- | -------------------- |
| Style Dictionary | ^5.2.0  | Token transformation |

### Documentation

| Technology | Version | Purpose        |
| ---------- | ------- | -------------- |
| Storybook  | 8.6     | Component docs |
