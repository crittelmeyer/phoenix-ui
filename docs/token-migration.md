# Token Migration Guide

This guide explains how to migrate from the DTCG-formatted seed token files in this repository to design tool workflows using either Tokens Studio (Figma plugin) or native Figma Variables.

## Why Migration Matters

The Phoenix token system uses the **Design Tokens Community Group (DTCG)** specification - an industry standard format that enables interoperability across design tools. This means you're not locked into a developer-only workflow. When you're ready to involve designers or connect to a design file, you can migrate the same token source to Tokens Studio or Figma Variables without rewriting your system.

## Current Token Architecture

### Seed Files

The token source of truth lives in `packages/tokens/src/tokens/`:

- **colors.json** - Color scales (neutral, primary, secondary, destructive, etc.) and semantic tokens (background, foreground, primary, border, etc.)
- **colors.dark.json** - Dark mode color overrides for semantic tokens
- **spacing.json** - Spacing scale (8px base unit: 8, 16, 24, 32, 48, 64, 96)
- **typography.json** - Font sizes, line heights, font families
- **radii.json** - Border radius scale

### DTCG Format

All token files use the DTCG format with `$value`, `$type`, and `$description` properties:

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "oklch(0.55 0.22 265.75)",
        "$type": "color",
        "$description": "Primary brand color for buttons, links, and key actions"
      }
    },
    "semantic": {
      "background": {
        "$value": "{color.neutral.50}",
        "$type": "color",
        "$description": "Default page background"
      }
    }
  }
}
```

Note the alias syntax `{color.neutral.50}` - semantic tokens reference scale values, creating a two-tier token system.

### Build Pipeline

**Style Dictionary** transforms these DTCG files into:

1. **CSS custom properties** (`packages/tokens/dist/tokens.css` and `tokens.dark.css`)
2. **Tailwind preset** (optional, if configured) for utility class generation

Components consume tokens via Tailwind utilities (`bg-background`, `text-foreground`) or CSS variables (`var(--primary)`).

### Color Format: OKLCH

Colors are defined in **OKLCH** format for perceptual uniformity and wide color gamut (P3) support. This is the modern standard for design systems (as of 2026).

## Migration Path A: Tokens Studio

### What is Tokens Studio?

[Tokens Studio](https://tokens.studio/) is a Figma plugin that manages design tokens in DTCG format. It provides **bidirectional sync** between Figma and your token repository.

### Why Choose Tokens Studio?

- Full DTCG support (all token types: color, spacing, typography, border radius, shadows, etc.)
- Bidirectional sync: designer changes flow to JSON, developer changes flow to Figma
- Mature plugin with broad adoption
- Supports advanced token features: aliases, composition, theming

### Migration Steps

1. **Install the plugin**
   - Open Figma, go to Plugins → Browse all plugins
   - Search for "Tokens Studio for Figma" and install

2. **Connect to your repository**
   - In Figma, run the Tokens Studio plugin
   - Configure sync settings:
     - Source: GitHub (or your Git provider)
     - Path: `packages/tokens/src/tokens/`
     - Branch: `main` (or your working branch)

3. **Initial sync**
   - Import tokens from your repository
   - Tokens Studio will parse the DTCG files and populate the plugin UI
   - Colors, spacing, typography, and radii will appear in the plugin panel

4. **Apply tokens in Figma**
   - Use the plugin panel to apply tokens to Figma layers
   - Example: Select a button, apply `{color.semantic.primary}` to fill
   - Applied tokens create a link between design and code

5. **Bidirectional workflow**
   - **Designer → Developer**: Designer edits token value in plugin → commits to repo → triggers Style Dictionary rebuild → CSS/Tailwind updates
   - **Developer → Designer**: Developer edits JSON file → pushes to repo → designer pulls in plugin → Figma updates

### Limitations

- Requires Git repository access (GitHub token, permissions)
- Initial setup has learning curve for non-technical designers
- OKLCH colors may need conversion to RGB/Hex for plugin compatibility (check current Tokens Studio version support)

### Resources

- [Tokens Studio Documentation](https://docs.tokens.studio/)
- [DTCG Format Guide](https://docs.tokens.studio/tokens/dtcg-format)

## Migration Path B: Figma Variables

### What are Figma Variables?

Figma Variables is a **native Figma feature** for managing design tokens. It's built into Figma (no plugin required) and provides a UI for creating collections of variables that map to design tokens.

### Why Choose Figma Variables?

- Native to Figma (no plugin installation)
- Simpler setup for designers
- Better performance than plugin-based solutions
- Good for color-only or simple token systems

### Migration Steps

1. **Export DTCG tokens to Figma Variables format**
   - Use a conversion tool like [style-dictionary-to-figma](https://www.npmjs.com/package/style-dictionary-to-figma) or write a custom Style Dictionary formatter
   - Output format: Figma Variables JSON schema

2. **Import into Figma**
   - In Figma, open the Variables panel (right sidebar)
   - Click import and select your exported JSON file
   - Figma will create variable collections matching your token structure

3. **Apply variables in Figma**
   - Select layers and bind them to variables (color fills, text styles, spacing)
   - Changes to variable values propagate across all bound layers

4. **Sync strategy**
   - **One-directional (Developer → Designer)**: Developer edits JSON → exports to Figma format → designer imports
   - **Bidirectional (with plugin)**: Use a Figma Variables sync plugin (e.g., [Variables Sync](https://www.figma.com/community/plugin/1253571037449127631)) to automate the sync process

### Limitations

- Figma Variables is a newer feature (feature maturity as of 2026)
- Limited token types compared to DTCG spec (primarily colors, numbers, strings, booleans)
- No native support for advanced token features (aliases require manual setup, composition is limited)
- OKLCH format may not be supported (check Figma's color format requirements)
- One-directional sync is manual unless you use additional tooling

### Resources

- [Figma Variables Documentation](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Figma Variables Best Practices](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)

## Migration Path C: Stay with Seed Files

### When to Stay with JSON Files

You might not need to migrate at all if:

- **No designer on the team**: You're solo or developer-only team
- **AI-first workflow**: You're using Claude Code or similar agents to generate components from token definitions
- **Prototyping phase**: Design system is still evolving rapidly, formal design file premature
- **Programmatic token generation**: Tokens are computed/generated algorithmically (e.g., color scales from a base hue)

### Benefits of JSON-First Approach

- Version control: Git history tracks every token change with commit messages
- Automation-friendly: Easy to validate, lint, transform, and generate from scripts
- No external dependencies: No Figma licenses, plugin access, or design tool lock-in
- Claude Code can edit directly: AI agents understand JSON better than design tool UIs

## Choosing a Path

| Criteria                        | Tokens Studio | Figma Variables | Seed Files Only |
| ------------------------------- | ------------- | --------------- | --------------- |
| Bidirectional sync              | Yes           | No (manual)     | N/A             |
| Full DTCG support               | Yes           | Partial         | Yes             |
| No plugin required              | No            | Yes             | N/A             |
| Designer-friendly               | Medium        | High            | Low             |
| Developer-friendly              | High          | Medium          | High            |
| AI agent-friendly               | Medium        | Low             | High            |
| Setup complexity                | High          | Low             | None            |
| All token types (shadows, etc.) | Yes           | No              | Yes             |
| Git-based workflow              | Yes (native)  | No (manual)     | Yes (native)    |
| OKLCH color support             | Check plugin  | Likely no       | Yes             |

### Recommended Path

- **For design-heavy teams with Git-savvy designers**: Tokens Studio
- **For design teams new to design tokens**: Figma Variables (simpler onboarding)
- **For developer-only or AI-first teams**: Stay with seed files
- **For hybrid workflows**: Start with seed files, migrate to Tokens Studio when design collaboration scales

## Next Steps

1. **If staying with seed files**: You're done! Continue editing JSON and running `pnpm tokens:build` to regenerate CSS/Tailwind outputs.

2. **If migrating to Tokens Studio**:
   - Set up GitHub access for designers
   - Install plugin and configure sync
   - Document token naming conventions for your team
   - Establish a Git workflow (PRs for token changes, review process)

3. **If migrating to Figma Variables**:
   - Choose or build a DTCG-to-Figma conversion script
   - Export your current tokens
   - Import into Figma and test variable bindings
   - Document the export-import process for future token updates

## Support

For questions about the Phoenix token system architecture, see:

- `packages/tokens/README.md` - Token package documentation
- `.planning/phases/02-token-system/02-RESEARCH.md` - Research on DTCG, Style Dictionary, and color formats
- [DTCG Specification](https://www.designtokens.org/) - Official DTCG format reference

For tool-specific questions:

- Tokens Studio: [Community Discord](https://tokens.studio/discord)
- Figma Variables: [Figma Community Forum](https://forum.figma.com/)
