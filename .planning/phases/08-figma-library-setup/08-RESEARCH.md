# Phase 8: Figma Library Setup - Research

**Researched:** 2026-02-06
**Domain:** Figma Variables, Tokens Studio for Figma, Design Token Sync
**Confidence:** MEDIUM

## Summary

This phase configures a Figma library with Phoenix design tokens using Tokens Studio for Figma. The workflow involves duplicating Pietro Schirano's shadcn/ui community kit, connecting Tokens Studio to the GitHub repository (`packages/tokens/src/tokens`), and establishing bidirectional sync between Figma Variables and code tokens.

Phase 7 already built the infrastructure for this: the token build script outputs Figma-ready JSON files (`dist/figma/light.json`, `dist/figma/dark.json`) with OKLCH colors converted to hex and proper Tokens Studio format with named token sets (`phoenix-light`, `phoenix-dark`). The token mapping documentation (`dist/figma/token-mapping.json`) provides a reference for matching token names to Figma Variable paths.

The key challenge is that Tokens Studio does not natively support OKLCH colors. The existing build pipeline handles OKLCH-to-hex conversion before Figma sync, but bidirectional sync from Figma back to code will produce hex values that must either be accepted or manually converted. For production workflows, the code tokens remain the source of truth (OKLCH), and Figma receives the converted hex values.

**Primary recommendation:** Use Tokens Studio Pro for themes feature (required for multi-file sync and proper light/dark mode Variables export), connect to GitHub at `packages/tokens/src/tokens`, and export using Themes to get light/dark modes as Figma Variable modes in a single collection.

## Standard Stack

### Core Tools

| Tool                                          | Version                            | Purpose                              | Why Standard                                                                                 |
| --------------------------------------------- | ---------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Tokens Studio for Figma                       | Latest                             | Design token management plugin       | Industry standard for token-to-Figma sync; only plugin with GitHub sync and Variables export |
| Figma Variables                               | Native                             | Store and apply design tokens        | Figma's native token system; supports modes for light/dark                                   |
| shadcn/ui Design System (Variables & Theming) | Community File 1314057472629730742 | Starting point for component library | Pietro Schirano's official kit with Variables support; matches code implementation           |

### Supporting Infrastructure

| Tool                         | Purpose                                  | When to Use                                  |
| ---------------------------- | ---------------------------------------- | -------------------------------------------- |
| GitHub Personal Access Token | Authentication for Tokens Studio sync    | Required for bidirectional sync              |
| Tokens Studio Pro License    | Multi-file sync and Themes feature       | Required for proper light/dark mode handling |
| Figma Professional Plan      | Variable modes (up to 10 per collection) | Required for light/dark mode Variables       |

### Alternatives Considered

| Instead of              | Could Use          | Tradeoff                                                                  |
| ----------------------- | ------------------ | ------------------------------------------------------------------------- |
| shadcn/ui kit by Pietro | Start from scratch | Much more work; kit has 40+ components ready                              |
| Tokens Studio Pro       | Free tier          | Single-file sync only; no Themes (manual mode management)                 |
| Manual token management | Specify, Supernova | Different sync paradigm; Tokens Studio is most mature for GitHub workflow |

## Architecture Patterns

### Figma Variable Collections Structure

Based on user decisions in CONTEXT.md, organize collections by category:

```
Collections:
├── Colors                    # All color Variables
│   ├── Primitives (group)    # neutral-50 through neutral-950, primary-*, etc.
│   └── Semantic (group)      # background, foreground, primary, destructive, etc.
├── Spacing                   # All spacing Variables (0, 0.5, 1, 1.5, 2, ...)
├── Typography                # Font sizes, line heights, weights, families
└── Radius                    # Border radius values (none, sm, base, md, ...)
```

Each collection has two modes: **Light** and **Dark**.

### Token-to-Variable Naming Convention

Variable names match CSS custom property names exactly (per CONTEXT.md decision):

| Token Path (Code)           | Figma Variable Name         | CSS Property                  |
| --------------------------- | --------------------------- | ----------------------------- |
| `color.primary.600`         | `color-primary-600`         | `--color-primary-600`         |
| `color.semantic.background` | `color-semantic-background` | `--color-semantic-background` |
| `spacing.4`                 | `spacing-4`                 | `--spacing-4`                 |
| `radius.lg`                 | `radius-lg`                 | `--radius-lg`                 |
| `font.size.base`            | `font-size-base`            | `--font-size-base`            |

### Tokens Studio GitHub Sync Structure

Connect to the source token directory for bidirectional sync:

```
Repository: [owner]/phoenix
Branch: main (or dedicated tokens branch)
File Path: packages/tokens/src/tokens
```

This syncs directly to the DTCG JSON source files. Token sets in Tokens Studio map to:

| Tokens Studio Token Set | Source Files       |
| ----------------------- | ------------------ |
| `colors`                | `colors.json`      |
| `colors-dark`           | `colors.dark.json` |
| `spacing`               | `spacing.json`     |
| `typography`            | `typography.json`  |
| `radii`                 | `radii.json`       |

### Themes Configuration (Pro Feature)

Create themes that combine token sets:

| Theme           | Token Sets (enabled)                    | Figma Variable Mode |
| --------------- | --------------------------------------- | ------------------- |
| `phoenix-light` | colors, spacing, typography, radii      | Light               |
| `phoenix-dark`  | colors-dark, spacing, typography, radii | Dark                |

Export using Themes to automatically create Figma Variable modes.

### Anti-Patterns to Avoid

- **Syncing to dist/figma instead of src/tokens:** The dist files are build outputs with resolved values. Sync to source for true bidirectional workflow.
- **Creating separate collections for light/dark:** Use modes within a single collection; this is how Figma Variables are designed to work.
- **Naming Variables differently than CSS properties:** Creates confusion and manual mapping work; maintain 1:1 naming.
- **Editing primitive colors in Figma:** Primitives should only be edited in code (OKLCH source of truth); Figma receives hex conversions.

## Don't Hand-Roll

| Problem                           | Don't Build             | Use Instead                                  | Why                                                                   |
| --------------------------------- | ----------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| Token sync between Figma and code | Custom export scripts   | Tokens Studio GitHub sync                    | Handles conflicts, versioning, multi-file management                  |
| OKLCH to hex conversion           | Manual color conversion | Style Dictionary build (already implemented) | Consistent conversion, automated via `phoenix/oklch-to-hex` transform |
| Variable mode switching           | Manual duplicate frames | Figma's native mode system                   | Built-in mode inheritance, instant switching                          |
| Semantic color aliases            | Hardcoded values        | Figma Variable aliases                       | Change primitive, semantic auto-updates                               |

**Key insight:** The Figma-to-code workflow has mature tooling. The complexity lies in configuration, not implementation. Focus on correct setup rather than custom solutions.

## Common Pitfalls

### Pitfall 1: Expired GitHub Personal Access Token

**What goes wrong:** Sync fails silently or with cryptic errors after initial setup works.
**Why it happens:** PATs have expiration dates (30-90 days common); users forget to renew.
**How to avoid:** Set PAT expiration to maximum allowed; document renewal process; use fine-grained tokens with explicit scope.
**Warning signs:** "Push to GitHub" button stops working; error messages about authentication.

### Pitfall 2: Token Format Mismatch (Legacy vs DTCG)

**What goes wrong:** Style Dictionary build fails or produces wrong output after Figma sync.
**Why it happens:** Tokens Studio defaults to Legacy format (`value:`) but Phoenix uses DTCG format (`$value:`).
**How to avoid:** Set Tokens Studio to W3C DTCG format before first sync; verify format in Settings > Token Format.
**Warning signs:** JSON files have `value:` instead of `$value:`; build warnings about unrecognized format.

### Pitfall 3: OKLCH Colors Not Supported in Tokens Studio

**What goes wrong:** OKLCH values pushed from code show as invalid or get mangled.
**Why it happens:** Tokens Studio only supports Hex, RGBA, and HSLA natively; OKLCH is not yet supported.
**How to avoid:** Accept one-way color flow: code (OKLCH) -> build (hex) -> Figma. For bidirectional, accept hex from Figma or convert manually.
**Warning signs:** Colors display incorrectly; warning about unsupported color format.

### Pitfall 4: Multi-file Sync Requires Pro

**What goes wrong:** Only one token set syncs; other files ignored.
**Why it happens:** Free tier only supports single-file sync (`tokens.json`).
**How to avoid:** Upgrade to Tokens Studio Pro before configuring sync; use Folder path not File path.
**Warning signs:** Only seeing one token set in plugin; other JSON files not appearing.

### Pitfall 5: Variable Mode Limits on Free Figma Plan

**What goes wrong:** Cannot create Dark mode for Variables.
**Why it happens:** Free Figma plan allows only 1 mode per collection.
**How to avoid:** Use Figma Professional plan (10 modes per collection) or Organization plan.
**Warning signs:** "Upgrade to add more modes" message; mode column disabled.

### Pitfall 6: Token Name Changes Break Connections

**What goes wrong:** Renaming a token in code orphans the Figma Variable; old Variable remains, new one created.
**Why it happens:** Tokens Studio uses name as the ID connecting tokens to Variables.
**How to avoid:** Plan token names carefully before initial sync; use deprecation (create new, migrate usages, delete old) rather than rename.
**Warning signs:** Duplicate Variables appearing; old styles not updating.

### Pitfall 7: Branch Protection Blocks Direct Pushes

**What goes wrong:** Tokens Studio push fails with permission error.
**Why it happens:** Protected `main` branch requires PR workflow.
**How to avoid:** Either: (a) Create unprotected `tokens` branch for sync, (b) Use feature branch workflow with manual PR merge, or (c) Whitelist Tokens Studio commits.
**Warning signs:** Push fails with "branch protection" or "requires pull request" error.

### Pitfall 8: Theme Switcher Stops Working After Variable Export

**What goes wrong:** Tokens Studio theme toggle no longer changes design appearance.
**Why it happens:** Once exported to Figma Variables with Themes, Figma's native mode switching takes over.
**How to avoid:** After Variable export, use Figma's mode switching (frame selection > Appearance > Apply variable mode), not Tokens Studio theme switcher.
**Warning signs:** Clicking themes in plugin does nothing; components stay same appearance.

## Code Examples

### GitHub Sync Configuration

```json
// Tokens Studio GitHub sync settings
{
  "name": "Phoenix Tokens",
  "personalAccessToken": "[GITHUB_PAT]",
  "repository": "owner/phoenix",
  "branch": "main",
  "filePath": "packages/tokens/src/tokens"
}
```

Source: [Tokens Studio GitHub Sync Docs](https://docs.tokens.studio/token-storage/remote/sync-git-github)

### Token Format (DTCG)

Phoenix tokens use DTCG format with `$value`, `$type`, `$description`:

```json
{
  "color": {
    "primary": {
      "600": {
        "$value": "oklch(0.544 0.195 264.54)",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

In Tokens Studio, navigate to Settings > Token Format and select "W3C DTCG".

Source: [Tokens Studio Token Format](https://docs.tokens.studio/manage-settings/token-format)

### Figma Variable Modes Setup

Create collections with Light and Dark modes:

1. Open Variables panel (right sidebar > "Open variables")
2. Create collection named "Colors"
3. Click "+" next to mode column header to add mode
4. Rename Mode 1 to "Light", Mode 2 to "Dark"
5. Repeat for Spacing, Typography, Radius collections

Source: [Figma Modes Documentation](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)

### Semantic Color Aliases in Figma

Semantic colors reference primitives via Variable aliases:

1. Create primitive Variable: `color-neutral-50` = `#f9fafb`
2. Create semantic Variable: `color-semantic-background`
3. Set semantic value to alias: click variable field, select `color-neutral-50`
4. In Dark mode, change alias to `color-neutral-950`

This matches the code pattern:

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

### Export to Figma Variables

Using Tokens Studio Pro Themes feature:

1. Create Theme Group: "Phoenix"
2. Create Theme: "phoenix-light" with token sets: colors, spacing, typography, radii
3. Create Theme: "phoenix-dark" with token sets: colors-dark, spacing, typography, radii
4. Click "Styles & Variables" > "Export styles & variables"
5. Select "Export from Themes"
6. Enable Variables for: Color, Number, String
7. Confirm export

Result: Single collection per category with Light/Dark modes.

Source: [Tokens Studio Export Guide](https://docs.tokens.studio/figma/export)

## State of the Art

| Old Approach           | Current Approach         | When Changed            | Impact                                   |
| ---------------------- | ------------------------ | ----------------------- | ---------------------------------------- |
| Figma Styles only      | Figma Variables + Styles | 2023 (Variables launch) | Native mode switching; cleaner theming   |
| Legacy token format    | W3C DTCG format          | 2024-2025               | Standard interop; $ prefix on properties |
| Manual token handoff   | GitHub sync              | 2022+                   | Continuous sync; version control         |
| Single-file tokens     | Multi-file token sets    | Tokens Studio Pro       | Better organization; themed exports      |
| 4 modes per collection | 10 modes per collection  | Figma Schema 2025       | More theme flexibility on Pro plan       |

**Deprecated/outdated:**

- Figma Styles for colors (use Variables instead; Styles remain useful for typography/effects)
- Tokens Studio "Sync styles and variables" naming (now "Export to Figma")
- Legacy token format for new projects (use DTCG `$value` format)

## Open Questions

### 1. OKLCH Color Roundtrip

**What we know:**

- Phoenix code tokens use OKLCH for perceptually uniform colors
- Tokens Studio does not support OKLCH (only Hex, RGBA, HSLA)
- Style Dictionary build already converts OKLCH to hex for Figma output

**What's unclear:**

- If designer edits color in Figma and syncs back, will it overwrite OKLCH with hex?
- Should we sync to dist/figma (hex, read-only) or src/tokens (OKLCH source)?

**Recommendation:**
Sync to `src/tokens` for true source control, but accept that color edits from Figma will be in hex. Either: (a) manually convert designer hex back to OKLCH, or (b) accept hex for designer-originated colors, or (c) treat code as source of truth for colors (designers request changes, devs implement).

### 2. Tokens Studio Pro Pricing

**What we know:**

- Pro license required for multi-file sync and Themes
- Pricing page exists but varies by region

**What's unclear:**

- Current 2026 pricing tiers
- Whether team seats or per-file pricing

**Recommendation:**
Check https://tokens.studio/pricing before starting; budget for Pro subscription.

### 3. Branch Strategy for Token Sync

**What we know:**

- Main branch may have protection
- Tokens Studio can push to any branch

**What's unclear:**

- Whether to use dedicated `tokens` branch or feature branches
- How to handle merge conflicts between designer and developer token changes

**Recommendation (Claude's Discretion per CONTEXT.md):**
Use dedicated `tokens` branch with auto-merge PR workflow:

1. Tokens Studio pushes to `tokens` branch
2. CI creates PR to `main`
3. Build validates tokens
4. Auto-merge if validation passes

This avoids branch protection issues while maintaining code review for substantive changes.

## Sources

### Primary (HIGH confidence)

- [Tokens Studio GitHub Sync Documentation](https://docs.tokens.studio/token-storage/remote/sync-git-github) - Configuration steps, PAT requirements
- [Tokens Studio Export to Figma](https://docs.tokens.studio/figma/export) - Variable export process
- [Figma Variables Modes Documentation](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables) - Mode creation and limits
- [Tokens Studio Token Format](https://docs.tokens.studio/manage-settings/token-format) - DTCG vs Legacy format

### Secondary (MEDIUM confidence)

- [Tokens Studio Variables Overview](https://docs.tokens.studio/figma/variables-overview) - Variables/Tokens integration
- [Tokens Studio Import Variables](https://docs.tokens.studio/figma/import/variables) - Bidirectional sync behavior
- [Figma Plans and Features](https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features) - Plan mode limits
- [shadcn/ui Design System Figma Kit](https://www.figma.com/community/file/1314057472629730742/shadcn-ui-design-system-variables-theming) - Community kit with Variables

### Tertiary (LOW confidence)

- [Tokens Studio OKLCH Color Support](https://feedback.tokens.studio/p/expanded-support-for-color-spaces) - Feature request; not yet implemented
- Various Medium articles on Figma Variables setup - Community patterns

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Official documentation confirms Tokens Studio + Figma Variables as standard
- Architecture: MEDIUM - Based on documentation and common patterns; community kit structure unverified directly
- Pitfalls: MEDIUM - Combination of official troubleshooting docs and community reports
- OKLCH workflow: LOW - No official documentation; based on feature gap analysis

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days; Tokens Studio updates frequently)

---

## Appendix: Existing Phoenix Token Build Output

The Phase 7 build script already generates Figma-ready files:

| Output File                     | Format              | Purpose                                  |
| ------------------------------- | ------------------- | ---------------------------------------- |
| `dist/figma/light.json`         | Tokens Studio (hex) | Light theme token set for Figma          |
| `dist/figma/dark.json`          | Tokens Studio (hex) | Dark theme (semantic overrides only)     |
| `dist/figma/token-mapping.json` | Documentation       | Maps token paths to Figma Variable paths |

These files use the Legacy format (`value:` not `$value:`) for Tokens Studio compatibility, though Tokens Studio now supports DTCG. The source tokens in `src/tokens/` use DTCG format.
