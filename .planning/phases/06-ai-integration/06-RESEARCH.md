# Phase 6: AI Integration - Research

**Researched:** 2026-02-01
**Domain:** AI agent documentation and autonomous capability validation
**Confidence:** HIGH

## Summary

AI agent documentation in 2026 has converged on clear standards: CLAUDE.md for Claude Code, AGENTS.md for cross-tool compatibility, and path-scoped rules in .claude/rules/ for modular organization. The research reveals a critical shift from monolithic documentation to "progressive disclosure" patterns where root files act as navigation hubs pointing to domain-specific instructions. For design system monorepos, the winning pattern is three-tier documentation: universal conventions in root CLAUDE.md, package-specific patterns in .claude/rules/ with path targeting, and cross-tool mapping in AGENTS.md.

The validation approach must prove autonomous capability through a "cold start test" - a fresh Claude Code session with zero context must successfully implement a complete component (code + story + Figma mapping + barrel export) using only the documentation. This mirrors production usage where agents work independently. The research identifies anti-pattern documentation as critical: explicitly showing "don't do this" examples (inline styles, arbitrary values, missing forwardRef) prevents Claude from defaulting to common web patterns that violate Phoenix conventions.

Key findings: CLAUDE.md should be comprehensive but concise (under 500 lines), rule files should be strict templates (exact file structure, exact imports), AGENTS.md should be standalone (no Claude-specific features), and validation must iterate on documentation failures (if Claude gets stuck, fix docs not code).

**Primary recommendation:** Structure documentation as executable recipes with side-by-side comparison of correct vs incorrect patterns, validate with fresh session testing before declaring phase complete.

## Standard Stack

The established tools for AI agent documentation and validation in 2026:

### Core

| Tool/Standard    | Version | Purpose                           | Why Standard                                                                |
| ---------------- | ------- | --------------------------------- | --------------------------------------------------------------------------- |
| CLAUDE.md        | -       | Claude Code project documentation | Automatically loaded by Claude Code at session start, high-priority context |
| .claude/rules/   | -       | Path-scoped modular rules         | Native Claude Code support for conditional rule loading based on file paths |
| AGENTS.md        | v1.0    | Cross-tool AI documentation       | Linux Foundation standard adopted by 60,000+ repos, tool-agnostic format    |
| YAML frontmatter | -       | Path targeting for rules          | Standard mechanism for paths field in rule files (glob patterns)            |

### Supporting

| Tool/Standard                   | Version | Purpose                                                | When to Use                                                 |
| ------------------------------- | ------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| .github/copilot-instructions.md | -       | GitHub Copilot repository instructions                 | For GitHub Copilot compatibility (alternative to AGENTS.md) |
| .cursor/rules/\*.mdc            | -       | Cursor-specific rules (legacy .cursorrules deprecated) | For Cursor IDE compatibility                                |
| Skills (SKILL.md)               | -       | Reusable AI capabilities with metadata                 | For complex, multi-step workflows invoked on-demand         |

### Alternatives Considered

| Instead of                       | Could Use                     | Tradeoff                                                            |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| Separate CLAUDE.md and AGENTS.md | Single CLAUDE.md with symlink | Duplication vs maintenance - separate files recommended for clarity |
| Path-scoped rules                | Monolithic CLAUDE.md          | Modularity vs simplicity - rules preferred for 500+ line docs       |
| Fresh session validation         | Human review only             | Automation vs speed - validation proves docs work but takes longer  |

**Installation:**

No package installation required - documentation files are conventions recognized by AI tools.

## Architecture Patterns

### Recommended Documentation Structure

For Phoenix design system monorepo:

```
phoenix/
├── CLAUDE.md                          # Comprehensive reference (directory tree, commands, pitfalls)
├── AGENTS.md                          # Cross-tool compatibility (references CLAUDE.md)
├── .claude/
│   └── rules/
│       ├── ui-components.md           # paths: packages/ui/src/components/**/*.tsx
│       ├── token-authoring.md         # paths: packages/tokens/src/tokens/**/*.json
│       └── storybook-stories.md       # paths: apps/storybook/stories/**/*.stories.tsx
└── packages/
    └── ui/
        └── src/
            └── components/
                ├── button.tsx         # Component implementation
                ├── button.figma.tsx   # Figma Code Connect mapping
                └── ...
```

### Pattern 1: Progressive Disclosure Navigation

**What:** Root CLAUDE.md acts as navigation hub pointing to specialized documentation based on task context.

**When to use:** Monorepos with distinct domains (tokens, components, apps) where loading all rules wastes context window.

**Example:**

```markdown
# CLAUDE.md (root)

## Component Development

Adding or modifying components:

- Read `.claude/rules/ui-components.md` for full component lifecycle
- Read `.claude/rules/storybook-stories.md` for story patterns

## Token Management

Editing design tokens:

- Read `.claude/rules/token-authoring.md` for token constraints

## Quick Reference

Directory structure:
[full tree here]

Development commands:
[pnpm commands here]

Common pitfalls:
[gotchas here]
```

**Source:** [Steering AI Agents in Monorepos with AGENTS.md](https://dev.to/datadog-frontend-dev/steering-ai-agents-in-monorepos-with-agentsmd-13g0)

### Pattern 2: Path-Scoped Rule Activation

**What:** Rules with YAML frontmatter `paths` field only load when Claude works on matching files.

**When to use:** Preventing context pollution - component authoring rules shouldn't load when editing tokens.

**Example:**

```markdown
---
paths: packages/ui/src/components/**/*.tsx
---

# UI Component Authoring

When creating a new component:

1. Create component file: `packages/ui/src/components/[name].tsx`
   - Use lowercase kebab-case for filename
   - Export component with PascalCase name
   - Follow CVA + Radix pattern

2. Create Figma mapping: `packages/ui/src/components/[name].figma.tsx`
   [exact template]

3. Update barrel export: `packages/ui/src/index.ts`
   [exact pattern]

4. Create story: `apps/storybook/stories/[Name].stories.tsx`
   [exact template]
```

**Source:** [Rules Directory - Mechanics | Claude Fast](https://claudefa.st/blog/guide/mechanics/rules-directory)

### Pattern 3: Anti-Pattern Documentation

**What:** Side-by-side comparison of incorrect vs correct patterns with explanations.

**When to use:** Preventing Claude from using common web patterns that violate design system conventions.

**Example:**

```markdown
## Anti-Patterns to Avoid

### Inline Styles ❌

Don't do this:
\`\`\`tsx
<button style={{ backgroundColor: '#3b82f6' }}>Click</button>
\`\`\`

Do this instead ✅:
\`\`\`tsx
<button className="bg-primary">Click</button>
\`\`\`

Why: Inline styles bypass design tokens and break dark mode.

### Arbitrary Tailwind Values ❌

Don't do this:
\`\`\`tsx

<div className="bg-[#ff0000] text-[18px]">Content</div>
\`\`\`

Do this instead ✅:
\`\`\`tsx

<div className="bg-destructive text-base">Content</div>
\`\`\`

Why: Arbitrary values not allowed in packages/ui - use semantic tokens only.

### Missing forwardRef ❌

Don't do this:
\`\`\`tsx
const Button = ({ className, ...props }) => {
return <button className={cn(buttonVariants({ className }))} {...props} />
}
\`\`\`

Do this instead ✅:
\`\`\`tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
({ className, ...props }, ref) => {
return <button ref={ref} className={cn(buttonVariants({ className }))} {...props} />
}
)
Button.displayName = 'Button'
\`\`\`

Why: Components must forward refs for composition (Dialog.Trigger needs ref access).
```

**Source:** [Coding Guidelines for Your AI Agents | JetBrains](https://blog.jetbrains.com/idea/2025/05/coding-guidelines-for-your-ai-agents/)

### Pattern 4: Strict Template Approach

**What:** Provide exact file structure, exact imports, exact export patterns as copy-paste templates.

**When to use:** Ensuring consistency - following template mechanically produces correct result.

**Example:**

```markdown
## Component File Template

Exact structure for `packages/ui/src/components/[name].tsx`:

\`\`\`tsx
import \* as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const [name]Variants = cva(
'base-classes-here',
{
variants: {
variant: { default: '...', /_ other variants _/ },
size: { default: '...', sm: '...', lg: '...' },
},
defaultVariants: {
variant: 'default',
size: 'default',
},
},
)

export interface [Name]Props
extends
React.HTMLAttributes<HTMLElement>,
VariantProps<typeof [name]Variants> {}

const [Name] = React.forwardRef<HTMLElement, [Name]Props>(
({ className, variant, size, ...props }, ref) => {
return (
<element
ref={ref}
className={cn([name]Variants({ variant, size, className }))}
{...props}
/>
)
},
)
[Name].displayName = '[Name]'

export { [Name], [name]Variants }
\`\`\`

Replace:

- `[name]` with lowercase component name (e.g., `button`)
- `[Name]` with PascalCase component name (e.g., `Button`)
- `HTMLElement` with specific element type (e.g., `HTMLButtonElement`)
- `base-classes-here` with component base Tailwind classes
- Update variants as needed
```

**Source:** Context decision "strict template approach - exact file structure, exact imports, exact patterns"

### Pattern 5: AGENTS.md as Standalone Reference

**What:** AGENTS.md contains full context needed for any AI tool without Claude-specific features.

**When to use:** Ensuring Cursor, GitHub Copilot, and other tools can use documentation.

**Example:**

```markdown
# AGENTS.md

## Project Overview

Phoenix is a React design system monorepo with:

- 13 components built on Radix UI primitives
- Design token system using Style Dictionary
- Tailwind CSS 4 with semantic tokens only
- Component documentation in Storybook

## Tech Stack

- React 18.3.0 (pinned - see Pitfalls)
- TypeScript 5.7.3
- Tailwind CSS 4.0.18
- Radix UI 1.x primitives
- CVA 0.7 for variants
- pnpm 10.0.0 + Turborepo 2.7.0

## Development Commands

\`\`\`bash
pnpm install # Install dependencies
pnpm dev # Start all dev servers
pnpm build # Build all packages
pnpm typecheck # Type check all packages
pnpm lint # Lint all packages
pnpm format # Format with Prettier
\`\`\`

## Code Patterns

See `CLAUDE.md` for comprehensive patterns, or:

- Component authoring: `.claude/rules/ui-components.md`
- Token editing: `.claude/rules/token-authoring.md`
- Story writing: `.claude/rules/storybook-stories.md`

## Tool-Specific Mappings

### Cursor

Cursor users: See `.cursor/rules/*.mdc` files (maps to .claude/rules/ content)

### GitHub Copilot

Copilot users: See `.github/copilot-instructions.md` (references this file)

## Critical Constraints

⚠️ React pinned to 18.3.0 (Radix + React 19 infinite loop bug)
🚫 No inline styles allowed (ESLint enforced)
🚫 No arbitrary Tailwind values in packages/ui (semantic tokens only)
✅ All components must use forwardRef
✅ All components need Figma mapping file
```

**Source:** [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)

### Anti-Patterns to Avoid

- **Verbose documentation without iteration:** Don't dump all knowledge into CLAUDE.md - refine through actual usage testing
- **Missing executable commands:** Claude hallucinates flags when commands lack examples - always show exact syntax with arguments
- **Vague boundaries:** "Be careful with secrets" fails - explicitly list prohibited paths (`.env`, `credentials.json`)
- **Generic instructions:** "Follow React best practices" is useless - show specific patterns with code examples
- **Monolithic rules:** 2000-line CLAUDE.md makes nothing high-priority - split into focused rules under 500 lines each

**Source:** [Creating the Perfect CLAUDE.md for Claude Code](https://dometrain.com/blog/creating-the-perfect-claudemd-for-claude-code/)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                        | Don't Build                       | Use Instead                            | Why                                                                      |
| ------------------------------ | --------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Custom AI documentation format | Proprietary .md structure         | CLAUDE.md + AGENTS.md standards        | 60,000+ repos use AGENTS.md, cross-tool compatibility proven             |
| Inline validation testing      | Manual component building         | Fresh Claude Code session test         | Proves docs work autonomously, catches gaps humans miss                  |
| Tool-specific rule duplication | Separate Cursor/Copilot rule sets | Single source with tool mappings       | Mercari learned divergence causes inconsistent behavior                  |
| Component templates in docs    | Long-form explanations            | Exact code templates with placeholders | Templates are copy-paste executable, explanations require interpretation |
| Generic code style rules       | "Follow best practices"           | Concrete anti-pattern examples         | Claude needs explicit "don't do X, do Y instead" with reasons            |

**Key insight:** AI agents need deterministic instructions (templates, checklists) not heuristic guidance (principles, philosophies). Documentation should be executable.

**Source:** [Taming Agents in the Mercari Web Monorepo](https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/)

## Common Pitfalls

### Pitfall 1: Context Window Pollution

**What goes wrong:** Loading all documentation for every file edit wastes context window, leaving less room for code.

**Why it happens:** Monolithic CLAUDE.md without path scoping activates everywhere regardless of task relevance.

**How to avoid:** Use .claude/rules/ with YAML frontmatter `paths` field to conditionally load rules. Component authoring rules only load for .tsx files in packages/ui/src/components/.

**Warning signs:** Claude responses mention irrelevant documentation sections, slower response times, truncated code suggestions.

**Source:** [Rules Directory - Mechanics | Claude Fast](https://claudefa.st/blog/guide/mechanics/rules-directory)

### Pitfall 2: Documentation Staleness

**What goes wrong:** Documentation diverges from actual codebase patterns, causing Claude to generate outdated code.

**Why it happens:** Docs written once and never updated as patterns evolve. No validation loop.

**How to avoid:** Implement validation testing as phase exit criteria - docs must enable successful component creation. Use Mercari's "self-updating loop" pattern where agents suggest doc updates during PR reviews.

**Warning signs:** Claude generates code that fails typecheck, uses deprecated patterns, or requires manual correction every time.

**Source:** [Taming Agents in the Mercari Web Monorepo](https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/)

### Pitfall 3: Insufficient Anti-Pattern Documentation

**What goes wrong:** Claude defaults to common web patterns (inline styles, arbitrary Tailwind values) that violate Phoenix conventions.

**Why it happens:** AI training data contains millions of examples of inline styles and arbitrary values - probabilistically likely outputs without explicit constraints.

**How to avoid:** Document anti-patterns alongside correct patterns with "Don't do this ❌ / Do this instead ✅" format. Include WHY explanations so Claude understands the constraint reasoning.

**Warning signs:** Generated components use `style` prop, `bg-[#hex]`, `text-[20px]` instead of semantic tokens.

**Source:** [Coding Guidelines for Your AI Agents | JetBrains](https://blog.jetbrains.com/idea/2025/05/coding-guidelines-for-your-ai-agents/)

### Pitfall 4: Missing Figma Code Connect Patterns

**What goes wrong:** Claude creates components but forgets Figma mapping file, breaking design-to-code workflow.

**Why it happens:** Figma Code Connect is less common than component/story patterns - not in typical training examples.

**How to avoid:** Strict checklist in ui-components.md rule: "Component lifecycle: 1. Create .tsx file, 2. Create .figma.tsx file, 3. Create .stories.tsx file, 4. Update barrel export." Make .figma.tsx template as explicit as component template.

**Warning signs:** Components work but don't appear in Figma Dev Mode, missing .figma.tsx files in PR reviews.

**Source:** [Connecting React components | Figma Developer Docs](https://developers.figma.com/docs/code-connect/react/)

### Pitfall 5: Tool-Specific Rule Divergence

**What goes wrong:** Cursor rules and Claude rules diverge over time, causing inconsistent behavior across team members using different tools.

**Why it happens:** Maintaining separate rule files for each tool, updating one but not others.

**How to avoid:** Single source of truth in .claude/rules/, create tool-specific mapping files that reference (not duplicate) core rules. AGENTS.md references CLAUDE.md rather than duplicating content.

**Warning signs:** Code reviews reveal different styling from different developers, "it works on my machine" with tool-specific behavior.

**Source:** [Taming Agents in the Mercari Web Monorepo](https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/)

### Pitfall 6: Validation Without Fresh Session

**What goes wrong:** Testing validation by continuing existing Claude session carries forward conversation context, falsely proving documentation sufficiency.

**Why it happens:** Starting fresh session feels wasteful when Claude "already knows" the project from current chat.

**How to avoid:** Exit Claude Code completely, start new session, run validation test with zero prior context. Only documentation files should inform implementation.

**Warning signs:** Validation succeeds in continued session but fails when teammate tries cold start, documentation gaps only discovered in production usage.

**Source:** Context decision "must be done in a fresh Claude Code session (no prior context) - proves docs are self-sufficient"

## Code Examples

Verified patterns from official sources and Phoenix context:

### Figma Code Connect Mapping

```tsx
// packages/ui/src/components/button.figma.tsx
import React from 'react'
import figma from '@figma/code-connect'
import { Button } from './button'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  Button,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
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

**Source:** Actual Phoenix button.figma.tsx file

### Storybook Story Template

```tsx
// apps/storybook/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@phoenix/ui'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}
```

**Source:** Actual Phoenix Button.stories.tsx file

### Barrel Export Pattern

```tsx
// packages/ui/src/index.ts

// Utilities
export { cn } from './lib/utils'

// Simple component
export { Button, buttonVariants } from './components/button'
export type { ButtonProps } from './components/button'

// Compound component (all parts exported)
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog'

// Form component (includes hook)
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from './components/form'
```

**Source:** Actual Phoenix packages/ui/src/index.ts file

### Path-Scoped Rule with YAML Frontmatter

```markdown
---
paths:
  - packages/ui/src/components/**/*.tsx
  - packages/ui/src/components/**/*.ts
---

# UI Component Development Rules

This rule activates when editing component files in packages/ui/src/components/.

## Required Patterns

1. All components must use React.forwardRef
2. All components must have displayName set
3. Use CVA for variants (import from 'class-variance-authority')
4. Use cn() helper for className composition
5. Export component, variants, and props type
6. Never use inline styles (style prop)
7. Never use arbitrary Tailwind values (bg-[#hex])
8. Only use semantic tokens (bg-primary, text-foreground, etc.)

## File Checklist

For each new component:

- [ ] Component file created: `[name].tsx`
- [ ] Figma mapping created: `[name].figma.tsx`
- [ ] Story file created in apps/storybook: `[Name].stories.tsx`
- [ ] Barrel export updated: packages/ui/src/index.ts
```

**Source:** Context decision "paths field in YAML frontmatter for conditional loading"

## State of the Art

| Old Approach             | Current Approach            | When Changed | Impact                                      |
| ------------------------ | --------------------------- | ------------ | ------------------------------------------- |
| Single .cursorrules file | .cursor/rules/\*.mdc files  | 2025         | Better modularity, version control per rule |
| Generic AGENTS.md        | Path-scoped .claude/rules/  | 2025         | Context efficiency, conditional loading     |
| Manual doc updates       | Self-updating doc loops     | 2026         | Docs stay current with codebase evolution   |
| Human validation only    | Fresh session AI validation | 2026         | Proves autonomous capability objectively    |
| Inline documentation     | Separate .figma.tsx files   | 2024         | Figma Code Connect standard pattern         |

**Deprecated/outdated:**

- **.cursorrules (deprecated):** Replaced by .cursor/rules/\*.mdc files in Cursor IDE
- **Monolithic CLAUDE.md:** Replaced by modular .claude/rules/ for large projects
- **Tool-specific rule duplication:** Replaced by single source with tool mapping layers

**Source:** [Cursor IDE Rules for AI](https://docs.cursor.com/context/rules-for-ai), [Rules Directory - Mechanics | Claude Fast](https://claudefa.st/blog/guide/mechanics/rules-directory)

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal CLAUDE.md section ordering**
   - What we know: Common practice puts commands early, project overview first, architecture in middle
   - What's unclear: Whether pitfalls should be in dedicated section or inline with relevant topics
   - Recommendation: Test both approaches during validation - if Claude frequently misses pitfalls, make them more prominent

2. **Detail level in Cursor/Copilot mappings**
   - What we know: Mapping files should reference not duplicate core rules
   - What's unclear: How much tool-specific guidance is needed vs generic reference
   - Recommendation: Start minimal (just references), expand based on team feedback using different tools

3. **Validation iteration threshold**
   - What we know: Validation failures should improve docs, not code
   - What's unclear: How many validation iterations are acceptable before declaring phase complete
   - Recommendation: Set budget of 3 validation cycles - more than 3 suggests fundamental doc structure issue

4. **Quick start summary value**
   - What we know: Some CLAUDE.md files include TL;DR section at top
   - What's unclear: Whether quick start helps or wastes context window for Phoenix use case
   - Recommendation: Claude's discretion per context decision - try both and measure validation success rate

## Sources

### Primary (HIGH confidence)

- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices) - Official Anthropic guidance
- [Rules Directory - Mechanics | Claude Fast](https://claudefa.st/blog/guide/mechanics/rules-directory) - Path-scoped rules mechanics
- [Manage Claude's memory - Claude Code Docs](https://code.claude.com/docs/en/memory) - Official Claude Code documentation patterns
- [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) - GitHub analysis of effective patterns
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) - Official GitHub Copilot documentation
- [Cursor – Rules for AI](https://docs.cursor.com/context/rules-for-ai) - Official Cursor documentation (.mdc format)
- [Connecting React components | Figma Developer Docs](https://developers.figma.com/docs/code-connect/react/) - Official Figma Code Connect patterns

### Secondary (MEDIUM confidence)

- [Creating the Perfect CLAUDE.md for Claude Code](https://dometrain.com/blog/creating-the-perfect-claudemd-for-claude-code/) - Community best practices
- [Steering AI Agents in Monorepos with AGENTS.md](https://dev.to/datadog-frontend-dev/steering-ai-agents-in-monorepos-with-agentsmd-13g0) - Datadog monorepo patterns
- [Taming Agents in the Mercari Web Monorepo](https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/) - Production experience, self-updating docs
- [Coding Guidelines for Your AI Agents | JetBrains](https://blog.jetbrains.com/idea/2025/05/coding-guidelines-for-your-ai-agents/) - Anti-pattern documentation patterns
- [The Complete Guide to CLAUDE.md](https://www.builder.io/blog/claude-md-guide) - Structure recommendations
- [Modular Rules in Claude Code](https://claude-blog.setec.rs/blog/claude-code-rules-directory) - Rule organization patterns
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) - Semantic token conventions
- [Compound Components | Workday Canvas Design System](https://canvas.workday.com/getting-started/for-developers/resources/compound-components/) - Compound component documentation patterns

### Tertiary (LOW confidence)

- [Agentic AI in Testing: The 2026 Blueprint for Autonomous QA](https://medium.com/the-qa-space/agentic-ai-in-testing-the-2026-blueprint-for-autonomous-qa-786412ab2644) - Validation testing approaches (general AI testing, not specific to doc validation)
- Community discussions on WebSearch about optimal documentation length - no authoritative source, varies by project

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - CLAUDE.md, AGENTS.md, .claude/rules/ verified from official documentation and widespread adoption
- Architecture: HIGH - Patterns verified from production monorepo implementations (Datadog, Mercari) and official guides
- Pitfalls: HIGH - Context pollution, staleness, anti-pattern gaps verified from multiple production experiences
- Code examples: HIGH - All examples sourced from actual Phoenix codebase or official documentation

**Research date:** 2026-02-01

**Valid until:** 60 days (stable standards, but AI tooling evolves rapidly - revalidate in April 2026)

**Validation note:** This research was conducted specifically for Phoenix's AI integration phase and incorporates project-specific context decisions from 06-CONTEXT.md. Generic AI documentation patterns were adapted to design system monorepo use case.
