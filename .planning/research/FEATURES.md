# Features Research: Figma Integration

**Domain:** Design system Figma-to-code integration
**Researched:** 2026-02-06
**Overall confidence:** HIGH (verified via official Figma documentation)

## Executive Summary

A complete Figma integration for Phoenix consists of two distinct workflows that solve different problems:

1. **Code Connect** - Shows real Phoenix component code in Figma Dev Mode instead of auto-generated snippets. Developers inspecting designs see actual import statements and props they can copy.

2. **Token synchronization** - Keeps design tokens aligned between Figma Variables and the code token system. Without this, designers use one set of colors while developers use another, causing drift.

Phoenix already has the scaffolding for Code Connect (14 `.figma.tsx` files with placeholder URLs) and a DTCG token system. The integration work is connecting these to real Figma files, not building from scratch.

**Key constraint:** Phoenix user has Figma Professional plan, which does NOT include the Variables REST API. Token sync requires either upgrading to Enterprise or using Tokens Studio plugin as an intermediary.

---

## Table Stakes (Must Have)

These features are required for the Figma integration to feel "working." Without them, developers and designers will perceive the integration as broken or incomplete.

### Code Connect: Component Mapping

- **Real code snippets in Dev Mode** - When developers inspect a Button in Figma, they see `import { Button } from '@phoenix/ui'` instead of generic CSS
  - Complexity: Low (scaffolding exists)
  - Dependencies: Figma file with published library, Organization/Enterprise plan
  - User story: Developer opens Dev Mode, clicks component, copies working import statement

- **Property mapping to variants** - Figma variant selections map to actual prop values. "Size: Large" shows `size="lg"`, "Variant: Destructive" shows `variant="destructive"`
  - Complexity: Medium (requires matching Figma variant names to code props)
  - Dependencies: Figma library with properly named variants
  - User story: Developer changes variant in Figma, code snippet updates to match

- **All 14 components connected** - Every Phoenix component has a working Code Connect mapping to a real Figma node
  - Complexity: Medium (14 components, each needs URL + property mapping)
  - Dependencies: Figma library file with all components
  - User story: Any component in the design file shows correct code

### Code Connect: Publishing Workflow

- **CLI publish command works** - `npx figma connect publish` successfully uploads mappings
  - Complexity: Low (existing CLI tool)
  - Dependencies: Figma access token with Code Connect Write scope
  - User story: Developer runs publish, sees components in Dev Mode

- **figma.config.json configured** - Config file has correct file key, include paths, and parser settings
  - Complexity: Low (file exists, needs real URLs)
  - Dependencies: Figma file URL
  - User story: CLI finds all .figma.tsx files and publishes them

### Token Alignment

- **Token names match between Figma and code** - When a designer uses `color/primary/500` in Figma, the developer sees `--color-primary-500` in code
  - Complexity: Medium (naming convention alignment)
  - Dependencies: Figma Variables using consistent naming
  - User story: Designer says "use primary-500", developer knows exactly which token

- **Semantic tokens documented** - Clear mapping between Figma semantic variables and code semantic classes
  - Complexity: Low (documentation)
  - Dependencies: Phoenix token system (exists)
  - User story: Both roles understand `bg-primary` = Figma's `primary` color variable

---

## Differentiators (Competitive Edge)

Features that make Phoenix's Figma integration smoother than typical design system handoffs. Not required, but significantly improve the workflow.

### Enhanced Code Connect

- **Compound component snippets** - Dialog shows full usage pattern including DialogTrigger, DialogContent, DialogHeader, etc.
  - Complexity: High (requires figma.children() for nested instances)
  - Dependencies: Figma file structured with nested components
  - User story: Developer copies complete Dialog pattern, not just one part

- **Icon instance mapping** - Icon components in Figma map to actual icon imports in code
  - Complexity: Medium (figma.instance() with icon library)
  - Dependencies: Icon library in both Figma and code
  - User story: Icon selection in Figma shows correct icon import

- **Dark mode variant handling** - Same component shows correct code for light/dark themes
  - Complexity: Low (semantic tokens handle this automatically)
  - Dependencies: Phoenix semantic token system (exists)
  - User story: Theme toggle in Figma, code snippets stay the same (semantic tokens)

### Token Synchronization

- **Bi-directional token sync** - Changes in either Figma or code can propagate to the other
  - Complexity: High (requires Tokens Studio + GitHub workflow)
  - Dependencies: Tokens Studio Pro license, GitHub Actions
  - User story: Designer updates spacing, PR appears with code changes

- **Token changelog visibility** - When tokens change, both roles see what changed and why
  - Complexity: Medium (git history + documentation)
  - Dependencies: Structured commit messages
  - User story: "Why did this color change?" answered by git log

- **Mode support (light/dark)** - Figma variable modes map to code theme files
  - Complexity: Medium (already have light/dark CSS, need Figma modes)
  - Dependencies: Phoenix tokens.css and tokens.dark.css (exist)
  - User story: Designer toggles mode, sees correct values applied

### Developer Experience

- **Storybook links in Figma** - Dev Mode shows link to component's Storybook page
  - Complexity: Low (custom links in Code Connect)
  - Dependencies: Deployed Storybook
  - User story: Developer clicks link, sees interactive documentation

- **Copy-paste ready code** - Snippets include realistic example values, not just placeholders
  - Complexity: Low (better example() functions)
  - Dependencies: None
  - User story: Copied code runs without modification

---

## Anti-Features (Don't Build)

Features to explicitly NOT build in this milestone. Either out of scope, counterproductive, or requiring resources beyond the current project.

### Token System Rewrites

- **Replace Style Dictionary with Tokens Studio as source of truth** - Current Phoenix setup uses DTCG JSON as source. Tokens Studio would be an additional layer, not a replacement.
  - Why not: Phoenix already has a working token pipeline. Adding Tokens Studio adds complexity for marginal gain on Professional plan.
  - Alternative: Keep DTCG JSON as source, optionally import into Tokens Studio for designer visibility.

- **Figma Variables REST API integration** - REST API for variables requires Enterprise plan ($75/editor/month).
  - Why not: User has Professional plan. Cost is prohibitive for learning workflow.
  - Alternative: Manual token export/import or Tokens Studio plugin (works on all plans).

- **Automated CI/CD token sync** - GitHub Actions that auto-sync on every Figma save.
  - Why not: Over-engineering for a learning project. Manual sync teaches the workflow better.
  - Alternative: Document manual sync process, consider automation in future.

### Figma Build Automation

- **Generate Figma components from code** - Tools that create Figma components from React components.
  - Why not: User is starting from community kit, not building Figma from scratch.
  - Alternative: Map existing community kit components to Phoenix code.

- **Figma plugin development** - Custom plugins for Phoenix-specific workflows.
  - Why not: Maintenance burden, learning curve, and existing plugins cover most needs.
  - Alternative: Use existing plugins (Tokens Studio, Export Import Variables).

### Full Design System Platform

- **Supernova/Zeroheight integration** - Third-party design system documentation platforms.
  - Why not: Scope creep. Storybook already provides documentation.
  - Alternative: Enhance Storybook with Figma embeds if needed.

- **Multi-brand theming in Figma** - Supporting multiple brand themes in a single Figma file.
  - Why not: Phoenix is single-brand. Multi-brand adds significant complexity.
  - Alternative: Document how to fork for additional brands if needed later.

---

## Expected Workflow

How designers and developers use Phoenix Figma integration after it's set up.

### Designer Workflow

1. **Design with library** - Designer uses Phoenix Figma library (community kit, customized with Phoenix tokens)
2. **Apply variables** - Uses semantic variables for colors, spacing, typography
3. **Mark ready for dev** - Uses Figma's "Ready for dev" status on frames
4. **Review code snippets** - Verifies Dev Mode shows correct Phoenix components

### Developer Workflow

1. **Open Dev Mode** - Inspects designs marked ready for development
2. **Copy code snippets** - Gets real Phoenix imports and props from Code Connect
3. **Verify tokens** - Confirms color/spacing values match semantic tokens
4. **Build feature** - Uses copied snippets as starting point
5. **Update if needed** - If component doesn't exist, creates and publishes new Code Connect mapping

### Token Update Workflow (Manual)

1. **Designer proposes change** - Updates token value in Figma Variables
2. **Export tokens** - Uses plugin to export Variables as JSON
3. **Developer imports** - Updates DTCG JSON files in code
4. **Rebuild tokens** - Runs `pnpm build` in tokens package
5. **Verify sync** - Both check that values match

### Publish Workflow

1. **Developer updates .figma.tsx** - Modifies property mappings or examples
2. **Run publish** - `npx figma connect publish`
3. **Verify in Figma** - Open Dev Mode, confirm snippets updated
4. **Commit changes** - Push .figma.tsx changes to repository

---

## Feature Dependencies

```
Code Connect Workflow:
  figma.config.json (exists)
    |
    v
  .figma.tsx files (exist, need real URLs)
    |
    v
  npx figma connect publish (requires Figma token)
    |
    v
  Dev Mode shows snippets

Token Alignment Workflow:
  DTCG JSON tokens (exist)
    |
    v
  Style Dictionary build (exists)
    |
    v
  CSS Variables (exist)
    |
    v
  Figma Variables (need to create/import)
    |
    v
  Designer visibility

Compound Component Snippets:
  figma.connect() with props (exists)
    |
    v
  figma.children() for nested instances (new)
    |
    v
  Figma file with nested component structure (need)
```

---

## MVP Recommendation

For MVP Figma integration, prioritize:

1. **Code Connect for all 14 components** - Table stakes. Users expect this to work.
2. **Property mapping for variants** - Makes Code Connect actually useful.
3. **Token naming alignment documentation** - Enables handoff without automation.
4. **Publish workflow documented** - Developers can maintain the integration.

Defer to post-MVP:

- Bi-directional token sync: Requires Tokens Studio Pro or Enterprise plan
- Compound component nested snippets: High complexity, not blocking
- Storybook links in Code Connect: Nice-to-have

---

## Sources

### Figma Official Documentation

- [Code Connect Help Center](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)
- [Code Connect CLI Quickstart](https://developers.figma.com/docs/code-connect/quickstart-guide/)
- [Connecting React Components](https://developers.figma.com/docs/code-connect/react/)
- [Guide to Variables in Figma](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Guide to Developer Handoff](https://www.figma.com/best-practices/guide-to-developer-handoff/)

### Code Connect Repository

- [figma/code-connect GitHub](https://github.com/figma/code-connect)

### Tokens Studio

- [GitHub Sync Provider](https://docs.tokens.studio/token-storage/remote/sync-git-github)
- [W3C DTCG Token Format](https://docs.tokens.studio/manage-settings/token-format)
- [Variables and Tokens Studio Overview](https://docs.tokens.studio/figma/variables-overview)

### Industry Analysis

- [Figma Variables vs Tokens Studio: Why Both Matter](https://dev.to/quintonjason/figma-variables-vs-tokens-studio-why-both-matter-2md7) - DEV Community
- [Understanding Figma Variables vs Design Tokens](https://www.supernova.io/blog/understanding-the-differences-between-figma-variables-and-design-tokens) - Supernova
- [The Gap Between Figma and Production](https://dev.to/lewisnewman24/the-gap-between-figma-and-production-why-handoff-fails-and-how-design-systems-fix-it-4ma9) - DEV Community

### Plan Requirements

- [Variables API Enterprise Plan Discussion](https://forum.figma.com/suggest-a-feature-11/why-s-the-variables-api-only-available-on-enterprise-plans-36426) - Figma Forum

---

## Confidence Assessment

| Area                  | Confidence | Rationale                                                                                |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| Code Connect features | HIGH       | Verified via official Figma documentation and React API reference                        |
| Token sync options    | HIGH       | Cross-verified Figma docs, Tokens Studio docs, and community discussions                 |
| Plan limitations      | HIGH       | Confirmed via Figma Forum and developer docs that Variables REST API requires Enterprise |
| Complexity estimates  | MEDIUM     | Based on existing Phoenix codebase analysis + documentation, but implementation may vary |
| Workflow patterns     | MEDIUM     | Synthesized from multiple sources, but real-world friction may differ                    |
