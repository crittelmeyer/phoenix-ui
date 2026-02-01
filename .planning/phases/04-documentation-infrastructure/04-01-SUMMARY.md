---
phase: 04-documentation-infrastructure
plan: 01
subsystem: docs
tags: [storybook, vite, tailwindcss, mdx, design-tokens]

# Dependency graph
requires:
  - phase: 02-token-system
    provides: Design tokens with CSS variables and Tailwind integration
  - phase: 03-core-components
    provides: UI component library with semantic token classes
provides:
  - Storybook 8.6 documentation environment with Vite builder
  - Tailwind CSS 4 integration with @theme mappings
  - Dark mode theme toggle in Storybook toolbar
  - Tokens overview page visualizing color, spacing, typography, and radius
affects: [04-02, 04-03, future-component-stories]

# Tech tracking
tech-stack:
  added: [storybook@8.6, @storybook/react-vite, @storybook/addon-themes, @storybook/blocks]
  patterns: [MDX documentation pages, theme-aware token classes, async Tailwind CSS plugin import]

key-files:
  created:
    - apps/storybook/.storybook/main.ts
    - apps/storybook/.storybook/preview.ts
    - apps/storybook/stories/index.css
    - apps/storybook/stories/Tokens.mdx
  modified:
    - apps/storybook/package.json
    - apps/storybook/tsconfig.json

key-decisions:
  - "Storybook 8.6 instead of 10.1 (10.x not yet released)"
  - "Duplicate index.css with @theme mappings for Storybook instead of importing from UI package"
  - "Async dynamic import for @tailwindcss/vite plugin (ESM-only package)"
  - "withThemeByClassName decorator for manual dark mode control"

patterns-established:
  - "MDX documentation pages with Meta title for Storybook structure"
  - "Semantic token classes (bg-primary, text-foreground) instead of arbitrary values for theme-aware styling"
  - "viteFinal hook pattern for Vite plugin integration in Storybook"

# Metrics
duration: 4min
completed: 2026-02-01
---

# Phase 04 Plan 01: Storybook Foundation Summary

**Storybook 8.6 with Vite builder, Tailwind CSS 4 integration, dark mode toggle, and tokens visualization page**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-01T22:32:27Z
- **Completed:** 2026-02-01T22:36:24Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Storybook dev server runs on localhost:6006 with Vite builder
- Tailwind CSS 4 integration via viteFinal hook with async plugin import
- Dark mode toggle in Storybook toolbar switches .dark class
- Tokens overview page with color swatches, spacing scale, typography, and border radius sections
- All token visualizations respond to theme toggle automatically

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure Storybook with Vite builder and Tailwind CSS 4** - `998c904` (feat)
2. **Task 2: Create tokens overview MDX page** - `77b1b91` (feat)

## Files Created/Modified

- `apps/storybook/.storybook/main.ts` - Storybook config with viteFinal hook for @tailwindcss/vite plugin
- `apps/storybook/.storybook/preview.ts` - Global decorators with withThemeByClassName for dark mode
- `apps/storybook/stories/index.css` - Duplicate of web app CSS with @theme mappings (185 lines)
- `apps/storybook/stories/Tokens.mdx` - Token visualization page with colors, spacing, typography, radii
- `apps/storybook/package.json` - Storybook 8.6 dependencies and dev/build scripts
- `apps/storybook/tsconfig.json` - TypeScript config including stories and .storybook directories

## Decisions Made

**Storybook 8.6 instead of 10.1**

- Plan specified Storybook 10.1.0, but this version doesn't exist yet (latest is 8.6.15)
- Used @storybook packages at ^8.6.0 version range
- Deviation Rule 3 (blocking issue) - couldn't install non-existent version
- No functional impact - Storybook 8.6 has all needed features

**Duplicate index.css for Storybook**

- Created apps/storybook/stories/index.css mirroring apps/web/src/index.css
- UI package has no index.css to import (source exports only)
- All token CSS imports and @theme mappings duplicated (185 lines)
- Ensures Storybook has identical token setup to web app

**Async dynamic import for Tailwind CSS plugin**

- @tailwindcss/vite is ESM-only package
- Used `await import('@tailwindcss/vite')` in viteFinal hook
- CJS deprecation warning expected and cosmetic (research Pitfall 1)

**Theme decorator configuration**

- Used withThemeByClassName from @storybook/addon-themes
- Themes: { light: '', dark: 'dark' } for class-based dark mode
- Provides manual theme control vs OS preference only

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Storybook version corrected to 8.6**

- **Found during:** Task 1 (npm install)
- **Issue:** Plan specified Storybook 10.1.0, but this version doesn't exist (latest is 8.6.15)
- **Fix:** Updated all @storybook/\* dependencies from ^10.1.0 to ^8.6.0
- **Files modified:** apps/storybook/package.json
- **Verification:** pnpm install succeeded, Storybook dev server started successfully
- **Committed in:** 998c904 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Version correction necessary to proceed. Storybook 8.6 provides all required functionality (Vite builder, addon-themes, MDX support). No feature gaps.

## Issues Encountered

**Vite 7 peer dependency warning**

- Storybook 8.6.15 expects Vite 4-6, but project uses Vite 7.3.1
- Warning shown during pnpm install about unmet peer dependency
- Dev server runs successfully despite warning - compatibility issue is cosmetic
- Will resolve when Storybook updates peer dependency ranges for Vite 7

**Prettier reformatting MDX/TS files**

- Pre-commit hook ran prettier on committed files
- Reordered class names in Tokens.mdx (e.g., "h-20 rounded-md bg-background" → "bg-background h-20 rounded-md")
- Reordered imports in preview.ts
- No functional impact - cosmetic formatting only

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for component story creation (Plan 04-02 and 04-03):**

- Storybook dev server operational at localhost:6006
- Tailwind CSS 4 integration working with semantic tokens
- Dark mode toggle functional in toolbar
- Token visualization page validates design system is rendering correctly
- @phoenix/ui package already available as dependency

**Documentation pattern established:**

- MDX pages with Meta title for structure
- Semantic token classes ensure automatic theme support
- Component stories can import UI components directly

**No blockers or concerns.**

---

_Phase: 04-documentation-infrastructure_
_Completed: 2026-02-01_
