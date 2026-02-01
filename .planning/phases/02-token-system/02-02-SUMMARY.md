---
phase: 02-token-system
plan: 02
subsystem: web-app
tags: [tailwind-v4, theme, dark-mode, css-variables, design-tokens]

# Dependency graph
requires:
  - phase: 02-token-system
    plan: 01
    provides: CSS custom properties for design tokens
provides:
  - Tailwind v4 @theme directive configuration mapping design tokens to utility classes
  - Dark mode implementation with class-based toggle (.dark)
  - Theme persistence via localStorage with OS preference fallback
  - Flash-of-wrong-theme prevention script
  - ThemeToggle component with system preference detection
  - Token-based UI demonstration in welcome page
affects: [03-components, 04-storybook, all-future-ui-work]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Tailwind v4 CSS-first configuration via @theme directive
    - Dark mode via .dark class toggle instead of media query
    - Inline script for flash prevention (FOUC mitigation)
    - Theme persistence with localStorage + system preference fallback

key-files:
  created:
    - apps/web/src/components/theme-toggle.tsx
  modified:
    - apps/web/src/index.css
    - apps/web/index.html
    - apps/web/src/routes/root.tsx

key-decisions:
  - 'Map all semantic tokens and color scales in @theme directive for comprehensive Tailwind coverage'
  - 'Use class-based dark mode (.dark) for manual toggle control vs media-query-only'
  - 'Flash prevention script runs synchronously in head before any rendering'
  - 'Theme toggle uses text labels ("Light" / "Dark") instead of icons for accessibility'

patterns-established:
  - '@theme directive maps token CSS variables to Tailwind utility class names'
  - 'localStorage.theme persistence with matchMedia fallback for OS preference'
  - 'document.documentElement.classList.toggle for dark mode class management'
  - 'Inline IIFE script in head for synchronous theme application'

# Metrics
duration: 3min
completed: 2026-02-01
---

# Phase 2 Plan 2: Tailwind v4 Theme Integration Summary

**Tailwind v4 @theme directive consuming 187 design tokens via CSS variables, dark mode toggle with localStorage persistence and flash prevention**

## Performance

- **Duration:** 3 min (estimated from commit time)
- **Completed:** 2026-02-01
- **Tasks:** 1 auto task + 1 checkpoint (approved)
- **Files modified:** 4 files (1 created, 3 modified)

## Accomplishments

- Tailwind v4 @theme directive configured to map semantic tokens to utility classes (bg-primary, text-foreground, bg-card, etc.)
- All 7 color scales (neutral, primary, secondary, destructive, warning, success, info) mapped for direct use (bg-neutral-500, text-primary-600)
- Dark mode implemented via .dark class toggle on html element
- Flash-of-wrong-theme prevention via inline script in index.html head
- ThemeToggle component with localStorage persistence and matchMedia OS preference detection
- Welcome page redesigned using token-based Tailwind classes (no hardcoded colors)
- Full Tailwind CSS utility coverage for spacing, typography, and border-radius tokens

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire token CSS into Tailwind v4 and add dark mode toggle** - `4219563` (feat)

## Files Created/Modified

**Created:**

- `apps/web/src/components/theme-toggle.tsx` - Dark mode toggle component with useState/useEffect for theme state, localStorage persistence, OS preference fallback, and accessible button with text labels

**Modified:**

- `apps/web/src/index.css` - Tailwind v4 @theme directive configuration with 185 lines mapping token CSS variables to Tailwind utility classes (colors, spacing, typography, radii)
- `apps/web/index.html` - Flash-prevention inline script added to head (reads localStorage.theme, detects prefers-color-scheme, applies .dark class before render)
- `apps/web/src/routes/root.tsx` - Welcome page updated to use token-based classes (bg-background, text-foreground, bg-card, border-border, bg-primary, text-primary-foreground) instead of hardcoded slate colors, plus ThemeToggle component integration

## Decisions Made

**1. Comprehensive @theme mapping for all tokens**

- **Context:** Could map only semantic tokens, leaving color scales unmapped
- **Decision:** Mapped all semantic tokens AND full color scales (neutral-50 through neutral-950, primary-50 through primary-950, etc.)
- **Rationale:** Provides flexibility for component authors to use semantic tokens (bg-primary) OR specific scale values (bg-primary-600) depending on use case
- **Impact:** 185 lines in @theme directive, complete Tailwind utility coverage for entire token system

**2. Class-based dark mode instead of media-query-only**

- **Context:** Tailwind v4 supports automatic dark: variant via prefers-color-scheme
- **Decision:** Use .dark class on html element for manual toggle control
- **Rationale:** Gives user explicit control via ThemeToggle component, allows override of OS preference
- **Impact:** All dark mode tokens activate via single class toggle, user preference persists

**3. Flash prevention via synchronous inline script**

- **Context:** Could use useEffect to set theme on mount (causes flash)
- **Decision:** Inline IIFE script in head runs before any rendering
- **Rationale:** Synchronous execution prevents white flash on dark mode page load
- **Impact:** Zero flash of wrong theme, seamless user experience

**4. Text-based theme toggle labels**

- **Context:** Could use icon-only button (sun/moon icons)
- **Decision:** Text labels "Light" / "Dark" with aria-label for current state
- **Rationale:** Accessibility-first (screen reader friendly), no icon library dependency
- **Impact:** Simple, accessible toggle component with 77 lines of code

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - Tailwind v4 @theme directive worked as documented, token CSS variables consumed correctly, dark mode class toggle functional, flash prevention script effective.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 3 (Component Library):**

- ✓ Token-based Tailwind utilities available (bg-primary, text-foreground, etc.)
- ✓ Dark mode infrastructure complete (.dark class toggle)
- ✓ All 187 design tokens accessible via Tailwind classes
- ✓ OKLCH color format verified working in browser (computed values match tokens)
- ✓ Theme persistence working (localStorage + OS preference)
- ✓ Flash prevention proven effective
- ✓ Welcome page demonstrates token system usage

**Context for Phase 3:**

- Component authors can use semantic tokens (bg-card, border-border) for theme-adaptive UI
- Color scale utilities (bg-neutral-100, text-primary-700) available for specific shades
- Dark mode variants automatically work via .dark class (e.g., dark:bg-card)
- All spacing/typography/radii tokens mapped to standard Tailwind scale (space-4, text-base, rounded-md)

**No blockers.**

---

_Phase: 02-token-system_
_Completed: 2026-02-01_
